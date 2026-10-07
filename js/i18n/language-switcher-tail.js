/**
 * ========================================================================
 * ĐUÔI js/language-switcher.js
 * Thay từ dòng "window.manualLanguageSwitch = ..." đến HẾT file.
 * ========================================================================
 *
 * MỤC ĐÍCH:
 *   - Lưu instance LanguageSwitcher ra window.__langSwitcher.
 *   - manualLanguageSwitch() thật sự gọi applyLanguage (trước đây chỉ đổi cờ).
 *   - Bỏ onclick trùng: HTML không còn cần onclick trên .lang-toggle
 *     (bindEvents trong class đã lắng nghe click).
 *
 * Rollback: khôi phục đuôi file cũ.
 * ========================================================================
 */

/**
 * Fallback khi HTML còn onclick="manualLanguageSwitch()".
 * Luôn ủy quyền cho instance thật nếu đã init.
 */
window.manualLanguageSwitch = function () {
  if (window.__langSwitcher && typeof window.__langSwitcher.switchLanguage === "function") {
    window.__langSwitcher.switchLanguage();
    return;
  }

  // Fallback tối thiểu nếu class chưa kịp init
  var currentFlag = document.getElementById("currentFlag");
  if (!currentFlag) return;
  var isUS = (currentFlag.src || "").indexOf("us.png") !== -1;
  var newLang = isUS ? "vn" : "us";
  currentFlag.src = "https://flagcdn.com/w20/" + newLang + ".png";
  currentFlag.alt = newLang.toUpperCase();
  localStorage.setItem("language", newLang);
  console.warn("[i18n] LanguageSwitcher chưa sẵn sàng — chỉ đổi cờ. Thử lại sau 1s.");
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    try {
      window.__langSwitcher = new LanguageSwitcher();
    } catch (error) {
      console.error("Error creating LanguageSwitcher:", error);
      initSimpleLanguageSwitcher();
    }
  }, 500);
});

/**
 * Fallback đơn giản nếu class lỗi lúc khởi tạo.
 */
function initSimpleLanguageSwitcher() {
  var langToggle = document.querySelector(".lang-toggle");
  var currentFlag = document.getElementById("currentFlag");
  if (!langToggle || !currentFlag) return;

  var currentLang = localStorage.getItem("language") || "us";
  currentFlag.src =
    currentLang === "us"
      ? "https://flagcdn.com/w20/us.png"
      : "https://flagcdn.com/w20/vn.png";
  currentFlag.alt = currentLang.toUpperCase();

  langToggle.addEventListener("click", function () {
    currentLang = currentLang === "us" ? "vn" : "us";
    currentFlag.src =
      currentLang === "us"
        ? "https://flagcdn.com/w20/us.png"
        : "https://flagcdn.com/w20/vn.png";
    currentFlag.alt = currentLang.toUpperCase();
    localStorage.setItem("language", currentLang);

    try {
      var switcher = new LanguageSwitcher();
      window.__langSwitcher = switcher;
      switcher.currentLanguage = currentLang;
      switcher.loadTranslations().then(function () {
        switcher.applyLanguage(currentLang);
      });
    } catch (error) {
      console.warn("Advanced language switching not available:", error);
    }
  });
}
