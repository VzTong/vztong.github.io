/**
 * js/components/docs-modal.js
 * -----------------------------------------------------------------------
 * Web Component: <docs-modal></docs-modal>
 *
 * MỤC ĐÍCH:
 *   - Modal 2 card: Master CV (xem/tải EN|VI) + Phụ lục (chỉ xem Drive).
 *   - i18n qua data-i18n="cvModal.*" (language-switcher lo).
 *   - Không embed PDF phụ lục → previewTranscript() mở tab Drive.
 *
 * PHỤ THUỘC (global từ main.js / transcript-viewer.js):
 *   printCV, closePrintOptions, selectLanguage,
 *   previewSelectedCV, downloadSelectedCV, previewTranscript
 *
 * ROLLBACK: xóa thẻ <docs-modal> + script này.
 * -----------------------------------------------------------------------
 */
(function () {
  "use strict";

  const TEMPLATE = `
<div id="printOptionsModal" class="modal">
  <div class="modal-content docs-modal">
    <button type="button" class="docs-modal-close" onclick="closePrintOptions()" aria-label="Close">&times;</button>

    <header class="docs-modal-header">
      <h2 data-i18n="cvModal.title">CV &amp; Docs</h2>
      <p class="docs-modal-sub" data-i18n="cvModal.subtitle">View and download Master CV and Graduation Appendix</p>
    </header>

    <div class="docs-cards">
      <article class="docs-card docs-card--cv">
        <div class="docs-card-badge" data-i18n="cvModal.cvBadge">MASTER CV</div>
        <div class="docs-card-title">
          <i class="bi bi-file-earmark-text"></i>
          <span data-i18n="cvModal.cvTitle">MASTER CV</span>
        </div>
        <p class="docs-card-desc" data-i18n="cvModal.cvDesc"></p>
        <ul class="docs-card-highlights">
          <li data-i18n="cvModal.cvHighlight1"></li>
          <li data-i18n="cvModal.cvHighlight2"></li>
          <li data-i18n="cvModal.cvHighlight3"></li>
        </ul>
        <div class="docs-lang-row">
          <button type="button" class="cv-option-btn" data-lang="us" onclick="selectLanguage('us')">
            <i class="bi bi-translate"></i>
            <span data-i18n="cvModal.englishOption">English</span>
          </button>
          <button type="button" class="cv-option-btn" data-lang="vn" onclick="selectLanguage('vn')">
            <i class="bi bi-translate"></i>
            <span data-i18n="cvModal.vietnameseOption">Tiếng Việt</span>
          </button>
        </div>
        <div class="docs-card-meta" data-i18n="cvModal.cvFileMeta">CV_TongNhaVy_Fresher_*.pdf</div>
        <div class="docs-card-actions">
          <button type="button" id="previewCVBtn" class="docs-btn docs-btn--ghost" onclick="previewSelectedCV()" disabled>
            <i class="bi bi-eye"></i>
            <span class="btn-text" data-i18n="cvModal.previewCV">View</span>
          </button>
          <button type="button" id="downloadCVBtn" class="docs-btn docs-btn--primary" onclick="downloadSelectedCV()" disabled>
            <i class="bi bi-download"></i>
            <span class="btn-text" data-i18n="cvModal.downloadCV">Download</span>
          </button>
        </div>
      </article>

      <article class="docs-card docs-card--transcript">
        <div class="docs-card-badge docs-card-badge--soft" data-i18n="cvModal.transcriptBadge">APPENDIX</div>
        <div class="docs-card-title">
          <i class="bi bi-award"></i>
          <span data-i18n="cvModal.transcriptTitle">GRADUATION APPENDIX</span>
        </div>
        <p class="docs-card-desc" data-i18n="cvModal.transcriptDesc"></p>
        <ul class="docs-card-highlights">
          <li data-i18n="cvModal.transcriptNote1"></li>
          <li data-i18n="cvModal.transcriptNote2"></li>
        </ul>
        <div class="docs-card-meta" data-i18n="cvModal.transcriptFileMeta">phu-luc-vb-tot-nghiep.pdf</div>
        <div class="docs-card-actions">
          <button type="button" class="docs-btn docs-btn--ghost docs-btn--full" onclick="previewTranscript()">
            <i class="bi bi-eye"></i>
            <span data-i18n="cvModal.previewTranscript">View</span>
          </button>
        </div>
      </article>
    </div>

    <p class="docs-modal-hint" data-i18n="cvModal.closeHint">Press [ESC] to close</p>
  </div>
</div>
`;

  class DocsModal extends HTMLElement {
    /**
     * Gắn DOM một lần khi element được insert vào page.
     */
    connectedCallback() {
      if (this._mounted) return;
      this._mounted = true;
      this.innerHTML = TEMPLATE;
    }
  }

  if (!customElements.get("docs-modal")) {
    customElements.define("docs-modal", DocsModal);
  }
})();