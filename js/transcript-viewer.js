// js/transcript-viewer.js
// -----------------------------------------------------------------------
// Xem Phụ lục VB tốt nghiệp qua Google Drive (tab mới).
// Không embed, không download từ site.
// -----------------------------------------------------------------------

(function () {
  "use strict";

  // Link share "Anyone with the link can view"
  const TRANSCRIPT_DRIVE_URL =
    "https://drive.google.com/file/d/19VxphuG5rKPWR9rRfwYzcyWrQY8tc33H/view?usp=sharing";

  window.previewTranscript = function previewTranscript() {
    window.open(TRANSCRIPT_DRIVE_URL, "_blank", "noopener,noreferrer");
  };
})();