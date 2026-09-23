// js/transcript-viewer.js
// -----------------------------------------------------------------------
// MỤC ĐÍCH: Xem / tải Bảng điểm trong cùng modal CV (#printOptionsModal).
// KHÔNG dùng selectedLanguage của CV (bảng điểm chỉ 1 bản).
// Fallback Google Docs Viewer nếu <embed> không render được.
// Rollback: xóa <script> + khối HTML transcript-section.
// -----------------------------------------------------------------------

(function () {
  "use strict";

  const TRANSCRIPT_URL = "CV/phu-luc-vb-tot-nghiep.pdf";
  const DOWNLOAD_NAME = "PhuLuc_VB_TotNghiep_TongNhaVy.pdf";

  function getEmbed() {
    return document.getElementById("transcriptEmbed");
  }

  function getWrap() {
    return document.getElementById("transcriptViewerWrap");
  }

  /**
   * Xem bảng điểm: hiện <embed>, nếu lỗi thì fallback Google Viewer.
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

    // Cuộn modal xuống phần viewer cho dễ nhìn
    setTimeout(() => {
      wrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  /**
   * Tải bảng điểm về máy.
   */
  window.downloadTranscript = function downloadTranscript() {
    const a = document.createElement("a");
    a.href = TRANSCRIPT_URL;
    a.download = DOWNLOAD_NAME;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
})();