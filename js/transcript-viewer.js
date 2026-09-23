// js/transcript-viewer.js
// -----------------------------------------------------------------------
// MỤC ĐÍCH: Chỉ XEM Phụ lục VB tốt nghiệp trong modal (#printOptionsModal).
// KHÔNG cho tải file (không có downloadTranscript, không a[download]).
// Fallback Google Docs Viewer nếu <embed> không render được.
// Rollback: xóa <script src="js/transcript-viewer.js"> + khối HTML phụ lục.
// -----------------------------------------------------------------------

(function () {
  "use strict";

  const TRANSCRIPT_URL = "CV/phu-luc-vb-tot-nghiep.pdf";

  function getEmbed() {
    return document.getElementById("transcriptEmbed");
  }

  function getWrap() {
    return document.getElementById("transcriptViewerWrap");
  }

  /**
   * Xem Phụ lục VB tốt nghiệp — chỉ preview, không tải.
   */
  window.previewTranscript = function previewTranscript() {
    const wrap = getWrap();
    const embed = getEmbed();
    if (!wrap || !embed) return;

    wrap.style.display = "block";
    embed.src = TRANSCRIPT_URL;

    // Fallback nếu trình duyệt không hỗ trợ embed PDF
    embed.onerror = function () {
      const origin = window.location.origin;
      const viewerUrl =
        "https://docs.google.com/viewer?url=" +
        encodeURIComponent(origin + "/" + TRANSCRIPT_URL) +
        "&embedded=true";

      embed.outerHTML =
        '<iframe id="transcriptEmbed" src="' +
        viewerUrl +
        '" width="100%" height="480" style="border:none;border-radius:8px;"></iframe>';
    };

    setTimeout(() => {
      wrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  // KHÔNG có downloadTranscript — cố ý không export hàm tải.
})();