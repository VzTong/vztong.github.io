/**
 * js/transcript-viewer.js
 * -----------------------------------------------------------------------
 * MỤC ĐÍCH: Xem Phụ lục VB tốt nghiệp (mở tab Drive hoặc PDF local).
 * Không dùng selectedLanguage của CV.
 * Rollback: xóa script này + nút previewTranscript trong modal.
 * -----------------------------------------------------------------------
 */
(function () {
  "use strict";

  /** PDF local (fallback) */
  var TRANSCRIPT_URL = "CV/phu-luc-vb-tot-nghiep.pdf";

  /**
   * Link Drive xem phụ lục (Share → Anyone with the link).
   * Điền FILE_ID thật; để trống / placeholder thì dùng PDF local.
   */
  var DRIVE_VIEW_URL =
    "https://drive.google.com/file/d/REPLACE_WITH_YOUR_DRIVE_FILE_ID/view";

  /**
   * Mở phụ lục: ưu tiên Drive, không có ID thì mở PDF local.
   */
  window.previewTranscript = function previewTranscript() {
    var hasDrive =
      DRIVE_VIEW_URL && DRIVE_VIEW_URL.indexOf("REPLACE_WITH_YOUR") === -1;

    if (hasDrive) {
      window.open(DRIVE_VIEW_URL, "_blank", "noopener,noreferrer");
      return;
    }
    window.open(TRANSCRIPT_URL, "_blank", "noopener,noreferrer");
  };
})();
