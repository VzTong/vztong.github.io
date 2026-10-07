/**
 * js/components/contact-section.js
 * -----------------------------------------------------------------------
 * Web Component: <contact-section></contact-section>
 *
 * MỤC ĐÍCH:
 *   Section Liên hệ centered: badge + title + lead + 4 card
 *   (Email, GitHub, LinkedIn, Phone). Học layout mẫu, data của VzTong.
 *
 * i18n: data-i18n="contact.*"
 * ROLLBACK: xóa thẻ + script này, khôi phục section #contact cũ.
 * -----------------------------------------------------------------------
 */
(function () {
  "use strict";

  const TEMPLATE = `
<section id="contact" class="contact contact--v2">
  <div class="container contact-v2">
    <div class="contact-v2-head">
      <span class="contact-v2-badge" data-i18n="contact.badge">05 / GET IN TOUCH</span>
      <h2 class="contact-v2-title" data-i18n="contact.title">Contact</h2>
      <p class="contact-v2-lead" data-i18n="contact.lead">
        Always open to chat about .NET backend, system design, and new opportunities.
      </p>
    </div>

    <div class="contact-v2-grid">
      <a class="contact-v2-card" href="mailto:vzz95559@gmail.com" aria-label="Email">
        <div class="contact-v2-icon" aria-hidden="true"><i class="bx bx-envelope"></i></div>
        <span class="contact-v2-label" data-i18n="contact.emailLabel">EMAIL</span>
        <span class="contact-v2-value">vzz95559@gmail.com</span>
      </a>

      <a class="contact-v2-card" href="https://github.com/VzTong" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <div class="contact-v2-icon" aria-hidden="true"><i class="bx bxl-github"></i></div>
        <span class="contact-v2-label" data-i18n="contact.githubLabel">GITHUB</span>
        <span class="contact-v2-value">@VzTong</span>
      </a>

      <a class="contact-v2-card" href="https://www.linkedin.com/in/nha-vy-tong-vztong/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <div class="contact-v2-icon" aria-hidden="true"><i class="bx bxl-linkedin"></i></div>
        <span class="contact-v2-label" data-i18n="contact.linkedinLabel">LINKEDIN</span>
        <span class="contact-v2-value">Nha Vy Tong</span>
      </a>

      <a class="contact-v2-card" href="tel:+84848735559" aria-label="Phone">
        <div class="contact-v2-icon" aria-hidden="true"><i class="bx bx-phone-call"></i></div>
        <span class="contact-v2-label" data-i18n="contact.phoneLabel">PHONE</span>
        <span class="contact-v2-value">+848 4873 5559</span>
      </a>
    </div>
  </div>
</section>
`;

  class ContactSection extends HTMLElement {
    connectedCallback() {
      if (this._mounted) return;
      this._mounted = true;
      this.innerHTML = TEMPLATE;
    }
  }

  if (!customElements.get("contact-section")) {
    customElements.define("contact-section", ContactSection);
  }
})();