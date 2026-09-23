// js/scroll-to-click-bridge.js
// -----------------------------------------------------------------------
// MỤC ĐÍCH: Cuộn/vuốt chuyển section bằng cách gọi lại navLink.click().
// Chỉ nhảy khi đã chạm đáy/đỉnh. Cooldown dài hơn animation gốc.
// Rollback: xóa <script src="js/scroll-to-click-bridge.js">.
// -----------------------------------------------------------------------

(function () {
  "use strict";

  const NAV_LINK_SELECTOR = "#navbar .nav-link";
  const SECTION_ORDER = ["header", "about", "resume", "portfolio", "contact"];
  const EDGE_PX = 48;        // hơi rộng hơn → ít nhảy nhầm
  const COOLDOWN_MS = 900;   // > 350ms delay + transition của template
  const SWIPE_THRESHOLD = 60;

  let currentIndex = 0;
  let isCoolingDown = false;

  function getNavLink(sectionId) {
    return document.querySelector(`${NAV_LINK_SELECTOR}[href="#${sectionId}"]`);
  }

  function goTo(index) {
    if (index < 0 || index >= SECTION_ORDER.length || isCoolingDown) return;
    const link = getNavLink(SECTION_ORDER[index]);
    if (!link) return;

    isCoolingDown = true;
    link.click(); // tái sử dụng 100% animation gốc
    currentIndex = index;

    setTimeout(() => {
      isCoolingDown = false;
    }, COOLDOWN_MS);
  }

  function isAtPageBottom() {
    const doc = document.documentElement;
    return window.innerHeight + window.scrollY >= doc.scrollHeight - EDGE_PX;
  }

  function isAtPageTop() {
    return window.scrollY <= EDGE_PX;
  }

  // Desktop – chỉ next/prev khi đã chạm mép
  window.addEventListener(
    "wheel",
    (e) => {
      if (isCoolingDown) return;
      if (e.deltaY > 0 && isAtPageBottom()) {
        goTo(currentIndex + 1);
      } else if (e.deltaY < 0 && isAtPageTop()) {
        goTo(currentIndex - 1);
      }
    },
    { passive: true }
  );

  // Mobile swipe
  let touchStartY = 0;
  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (e) => {
      if (isCoolingDown) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < SWIPE_THRESHOLD) return;

      if (diff > 0 && isAtPageBottom()) goTo(currentIndex + 1);
      else if (diff < 0 && isAtPageTop()) goTo(currentIndex - 1);
    },
    { passive: true }
  );

  // Đồng bộ khi bấm navbar tay
  document.querySelectorAll(NAV_LINK_SELECTOR).forEach((link) => {
    link.addEventListener("click", () => {
      const id = (link.getAttribute("href") || "").replace("#", "");
      const idx = SECTION_ORDER.indexOf(id);
      if (idx !== -1) currentIndex = idx;
    });
  });

  // Khởi tạo index nếu vào trang bằng hash
  window.addEventListener("load", () => {
    const hash = (window.location.hash || "#header").replace("#", "");
    const idx = SECTION_ORDER.indexOf(hash);
    if (idx !== -1) currentIndex = idx;
  });
})();