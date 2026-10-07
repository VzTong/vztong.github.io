// js/scroll-to-click-bridge.js
// -----------------------------------------------------------------------
// MỤC ĐÍCH: Cuộn/vuốt chuyển section bằng navLink.click().
// Loop: Contact cuộn tiếp → về Home. Nút .back-to-top cũng về Home.
// Rollback: xóa <script src="js/scroll-to-click-bridge.js">.
// -----------------------------------------------------------------------

(function () {
  "use strict";

  const NAV_LINK_SELECTOR = "#navbar .nav-link";
  const SECTION_ORDER = ["header", "about", "resume", "portfolio", "contact"];
  const EDGE_PX = 80; // phải cuộn sát mép hơn mới nhảy (trước 48)
  const COOLDOWN_MS = 1400; // chờ animation xong hẳn mới cho nhảy tiếp (trước 900)
  const SWIPE_THRESHOLD = 80; // vuốt phải rõ hơn mới tính

  let currentIndex = 0;
  let isCoolingDown = false;

  function getNavLink(sectionId) {
    return document.querySelector(`${NAV_LINK_SELECTOR}[href="#${sectionId}"]`);
  }

  function goTo(index) {
    // Loop: Contact → Home, Home (kéo lên) → Contact
    if (index >= SECTION_ORDER.length) index = 0;
    if (index < 0) index = SECTION_ORDER.length - 1;

    if (isCoolingDown) return;
    const link = getNavLink(SECTION_ORDER[index]);
    if (!link) return;

    isCoolingDown = true;
    link.click();
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

  // Desktop wheel
  window.addEventListener(
    "wheel",
    (e) => {
      if (isCoolingDown) return;
      if (e.deltaY > 0 && isAtPageBottom()) {
        goTo(currentIndex + 1); // Contact → Home (loop)
      } else if (e.deltaY < 0 && isAtPageTop()) {
        goTo(currentIndex - 1);
      }
    },
    { passive: true },
  );

  // Mobile swipe
  let touchStartY = 0;
  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
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
    { passive: true },
  );

  // Đồng bộ khi bấm navbar
  document.querySelectorAll(NAV_LINK_SELECTOR).forEach((link) => {
    link.addEventListener("click", () => {
      const id = (link.getAttribute("href") || "").replace("#", "");
      const idx = SECTION_ORDER.indexOf(id);
      if (idx !== -1) currentIndex = idx;
    });
  });

  // Nút back-to-top sẵn có → về Home (dùng đúng animation)
  const backBtn = document.querySelector(".back-to-top");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(0); // về header/Home
    });
  }

  // Khởi tạo index theo hash
  window.addEventListener("load", () => {
    const hash = (window.location.hash || "#header").replace("#", "");
    const idx = SECTION_ORDER.indexOf(hash);
    if (idx !== -1) currentIndex = idx;
  });
})();
