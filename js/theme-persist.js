// js/theme-persist.js
// -----------------------------------------------------------------------
// MỤC ĐÍCH: Nhớ dark/light mode. Không đụng listener gốc trong main.js.
// Rollback: xóa <script src="js/theme-persist.js">.
// -----------------------------------------------------------------------

(function () {
  "use strict";

  const STORAGE_KEY = "vztong_theme_pref";

  function applySavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light") {
        document.body.classList.add("light-mode");
      } else if (saved === "dark") {
        document.body.classList.remove("light-mode");
      }
      // nếu chưa có preference → giữ nguyên mặc định của site
    } catch (_) {}
  }

  // Chạy sớm nhất có thể (tránh flash)
  applySavedTheme();

  // Lắng nghe thay đổi class (sau khi main.js toggle)
  const themeBtn = document.querySelector(".theme-btn");
  if (!themeBtn) return;

  themeBtn.addEventListener("click", () => {
    // Đợi main.js toggle xong
    requestAnimationFrame(() => {
      const isLight = document.body.classList.contains("light-mode");
      try {
        localStorage.setItem(STORAGE_KEY, isLight ? "light" : "dark");
      } catch (_) {}
    });
  });
})();