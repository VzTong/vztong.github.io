/**
 * js/components/docs-modal.js
 * -----------------------------------------------------------------------
 * MỤC ĐÍCH:
 *   Web Component <docs-modal> — modal 2 card:
 *   - Master CV: chọn EN/VI, xem + tải PDF local (CV/us|vn/...)
 *   - Phụ lục VB: chỉ xem (gọi window.previewTranscript → Google Drive)
 *
 * PHỤ THUỘC (không sửa các file này từ component):
 *   - js/main.js: printCV, closePrintOptions, selectLanguage,
 *     previewSelectedCV, downloadSelectedCV
 *   - js/transcript-viewer.js: previewTranscript
 *   - js/language-switcher.js + languages.json: data-i18n="cvModal.*"
 *   - css/upgrade-ui.css: class .docs-modal, #printOptionsModal
 *
 * ROLLBACK:
 *   Xóa <docs-modal></docs-modal> và <script src="js/components/docs-modal.js">
 *   trong index.html; khôi phục markup modal cũ nếu cần.
 *
 * Template gốc BootstrapMade Personal — component này là code tự viết,
 * không xóa credit footer template.
 * -----------------------------------------------------------------------
 */
(function () {
  "use strict";

  /**
   * Markup modal. data-i18n để language-switcher điền text EN/VI.
   * id="previewCVBtn" / "downloadCVBtn" / data-lang giữ nguyên contract main.js.
   */
  var TEMPLATE =
    '<div id="printOptionsModal" class="modal">' +
    '  <div class="modal-content docs-modal">' +
    '    <button type="button" class="docs-modal-close" onclick="closePrintOptions()" aria-label="Close">&times;</button>' +
    '    <header class="docs-modal-header">' +
    '      <h2 data-i18n="cvModal.title">CV &amp; Docs</h2>' +
    '      <p class="docs-modal-sub" data-i18n="cvModal.subtitle"></p>' +
    "    </header>" +
    '    <div class="docs-cards">' +
    '      <article class="docs-card docs-card--cv">' +
    '        <div class="docs-card-badge" data-i18n="cvModal.cvBadge">MASTER CV</div>' +
    '        <div class="docs-card-title">' +
    '          <i class="bi bi-file-earmark-text"></i>' +
    '          <span data-i18n="cvModal.cvTitle">MASTER CV</span>' +
    "        </div>" +
    '        <p class="docs-card-desc" data-i18n="cvModal.cvDesc"></p>' +
    '        <ul class="docs-card-highlights">' +
    '          <li data-i18n="cvModal.cvHighlight1"></li>' +
    '          <li data-i18n="cvModal.cvHighlight2"></li>' +
    '          <li data-i18n="cvModal.cvHighlight3"></li>' +
    "        </ul>" +
    '        <div class="docs-lang-row">' +
    '          <button type="button" class="cv-option-btn" data-lang="us" onclick="selectLanguage(\'us\')">' +
    '            <i class="bi bi-translate"></i>' +
    '            <span data-i18n="cvModal.englishOption">English</span>' +
    "          </button>" +
    '          <button type="button" class="cv-option-btn" data-lang="vn" onclick="selectLanguage(\'vn\')">' +
    '            <i class="bi bi-translate"></i>' +
    '            <span data-i18n="cvModal.vietnameseOption">Tiếng Việt</span>' +
    "          </button>" +
    "        </div>" +
    '        <div class="docs-card-meta" data-i18n="cvModal.cvFileMeta">CV_TongNhaVy_Fresher_*.pdf</div>' +
    '        <div class="docs-card-actions">' +
    '          <button type="button" id="previewCVBtn" class="docs-btn docs-btn--ghost" onclick="previewSelectedCV()" disabled>' +
    '            <i class="bi bi-eye"></i>' +
    '            <span class="btn-text" data-i18n="cvModal.previewCV">View</span>' +
    "          </button>" +
    '          <button type="button" id="downloadCVBtn" class="docs-btn docs-btn--primary" onclick="downloadSelectedCV()" disabled>' +
    '            <i class="bi bi-download"></i>' +
    '            <span class="btn-text" data-i18n="cvModal.downloadCV">Download</span>' +
    "          </button>" +
    "        </div>" +
    "      </article>" +
    '      <article class="docs-card docs-card--transcript">' +
    '        <div class="docs-card-badge docs-card-badge--soft" data-i18n="cvModal.transcriptBadge">APPENDIX</div>' +
    '        <div class="docs-card-title">' +
    '          <i class="bi bi-award"></i>' +
    '          <span data-i18n="cvModal.transcriptTitle"></span>' +
    "        </div>" +
    '        <p class="docs-card-desc" data-i18n="cvModal.transcriptDesc"></p>' +
    '        <ul class="docs-card-highlights">' +
    '          <li data-i18n="cvModal.transcriptNote1"></li>' +
    '          <li data-i18n="cvModal.transcriptNote2"></li>' +
    "        </ul>" +
    '        <div class="docs-card-meta" data-i18n="cvModal.transcriptFileMeta"></div>' +
    '        <div class="docs-card-actions">' +
    '          <button type="button" class="docs-btn docs-btn--ghost docs-btn--full" onclick="previewTranscript()">' +
    '            <i class="bi bi-eye"></i>' +
    '            <span data-i18n="cvModal.previewTranscript">View</span>' +
    "          </button>" +
    "        </div>" +
    "      </article>" +
    "    </div>" +
    '    <p class="docs-modal-hint" data-i18n="cvModal.closeHint"></p>' +
    "  </div>" +
    "</div>";

  /**
   * Custom element: khi gắn vào DOM thì inject TEMPLATE một lần.
   */
  function DocsModal() {
    return Reflect.construct(HTMLElement, [], DocsModal);
  }
  DocsModal.prototype = Object.create(HTMLElement.prototype);
  DocsModal.prototype.constructor = DocsModal;

  /**
   * Lifecycle: element đã vào document.
   * Chỉ mount một lần (_mounted) tránh nhân đôi modal nếu re-attach.
   */
  DocsModal.prototype.connectedCallback = function () {
    if (this._mounted) return;
    this._mounted = true;
    this.innerHTML = TEMPLATE;
  };

  if (!customElements.get("docs-modal")) {
    customElements.define("docs-modal", DocsModal);
  }
})();
