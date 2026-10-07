/**
 * js/language-switcher-patches.js
 * -----------------------------------------------------------------------
 * MỤC ĐÍCH:
 *   Các HÀM thay thế trong js/language-switcher.js (class LanguageSwitcher).
 *   Không load file này riêng — COPY từng hàm vào language-switcher.js.
 *
 * Sửa bug:
 *   - updateNavigation dùng biến `t` không tồn tại → ReferenceError
 *   - Map nav theo index → lệch khi có #docs
 *
 * Sau khi dán: xóa bản updateNavigation / updateButtons / updateCVModal /
 * updateContactSection cũ trong class.
 * -----------------------------------------------------------------------
 */

/* ========== Dán VÀO trong class LanguageSwitcher ========== */

/**
 * Cập nhật chữ navbar theo href (không theo index).
 * Docs (#docs) chỉ đổi text span, giữ onclick mở modal.
 * @param {object} nav - translations[lang].nav
 */
function updateNavigation(nav) {
  if (!nav) return;

  var hrefToKey = {
    "#header": "home",
    "#about": "about",
    "#resume": "resume",
    "#portfolio": "portfolio",
    "#contact": "contact",
  };

  document.querySelectorAll("#navbar .nav-link").forEach(function (link) {
    var href = (link.getAttribute("href") || "").trim();

    if (link.id === "navDocsLink" || href === "#docs") {
      var span = link.querySelector("[data-i18n='nav.docs']");
      if (span && nav.docs) {
        span.textContent = nav.docs;
      } else if (nav.docs) {
        link.textContent = nav.docs;
      }
      return;
    }

    var key = hrefToKey[href];
    if (key && nav[key]) {
      link.textContent = nav[key];
    }
  });
}

/**
 * Nút mở modal: "CV & Docs" / "CV & Hồ sơ"
 * @param {object} buttons - translations[lang].buttons
 */
function updateButtons(buttons) {
  if (!buttons) return;

  var openDocsEl = document.querySelector(
    "#openDocsBtn .btn-text, [data-i18n='buttons.openDocs']"
  );
  if (openDocsEl && buttons.openDocs) {
    openDocsEl.textContent = buttons.openDocs;
  }

  var backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn && buttons.backToTop) {
    backToTopBtn.setAttribute("title", buttons.backToTop);
  }
}

/**
 * Modal docs: mọi [data-i18n^='cvModal.']
 * @param {object} cvModal
 */
function updateCVModal(cvModal) {
  if (!cvModal) return;

  document.querySelectorAll("[data-i18n^='cvModal.']").forEach(function (el) {
    var key = el.getAttribute("data-i18n").replace("cvModal.", "");
    if (cvModal[key] != null) {
      el.textContent = cvModal[key];
    }
  });
}

/**
 * Contact v2: mọi [data-i18n^='contact.']
 * @param {object} contact
 */
function updateContactSection(contact) {
  if (!contact) return;

  document.querySelectorAll("[data-i18n^='contact.']").forEach(function (el) {
    var key = el.getAttribute("data-i18n").replace("contact.", "");
    if (contact[key] != null) {
      el.textContent = contact[key];
    }
  });
}

/**
 * Trong applyLanguage(lang) giữ thứ tự:
 *   this.updateNavigation(t.nav);
 *   this.updateHeroSection(t.hero);
 *   ...
 *   this.updateContactSection(t.contact);
 *   this.updateButtons(t.buttons);
 *   this.updateCVModal(t.cvModal);
 *
 * Trong constructor/init sau khi tạo instance:
 *   window.__langSwitcher = this;
 *
 * HTML .lang-toggle: BỎ onclick manualLanguageSwitch nếu đã bindEvents,
 * hoặc ngược lại — chỉ giữ MỘT đường đổi ngôn ngữ.
 */
