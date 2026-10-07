/**
 * ========================================================================
 * BLOCK CUỐI js/main.js — thay từ dòng "// CV Modal State" đến HẾT file.
 * ========================================================================
 *
 * MỤC ĐÍCH:
 *   - Mở/đóng modal Hồ sơ & Tài liệu (#printOptionsModal).
 *   - Chọn ngôn ngữ CV (us/vn trên UI) → map sang thư mục en/vi trên disk.
 *   - Preview / Download PDF đúng path sau khi đổi tên folder.
 *
 * PATH THẬT TRÊN REPO (không đổi bừa):
 *   CV/en/CV_TongNhaVy_EN.pdf
 *   CV/vi/CV_TongNhaVy_VI.pdf
 *   CV/phu-luc-vb-tot-nghiep.pdf  (xem qua transcript-viewer.js)
 *
 * LƯU Ý HTML:
 *   #printOptionsModal PHẢI nằm ngoài mọi <section> (ví dụ trước </body>),
 *   nếu không khi đang Resume/Portfolio section About bị ẩn → modal không hiện.
 *
 * Rollback: khôi phục block CV cũ trong main.js.
 * ========================================================================
 */

// --- Trạng thái modal CV (global, dùng bởi onclick HTML) ---
let selectedLanguage = "";

/**
 * Map mã nút UI (us|vn) → { folder, file } trên disk.
 * UI vẫn dùng us/vn cho khớp languages.json / data-lang.
 */
function resolveCvPath(langCode) {
  if (langCode === "us") {
    return {
      folder: "en",
      file: "CV_TongNhaVy_EN.pdf",
      downloadName: "CV_TongNhaVy_EN.pdf",
    };
  }
  return {
    folder: "vi",
    file: "CV_TongNhaVy_VI.pdf",
    downloadName: "CV_TongNhaVy_VI.pdf",
  };
}

/**
 * Đóng modal Docs; mở lại scroll body.
 */
function closePrintOptions() {
  const modal = document.getElementById("printOptionsModal");
  if (!modal) return;

  modal.classList.add("hide");
  document.body.classList.remove("modal-docs-open");
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";

  setTimeout(function () {
    modal.style.display = "none";
    modal.classList.remove("show", "hide");
    resetCVSelections();
  }, 300);
}

/**
 * Mở modal Docs từ mọi section (nav Docs, nút About, ...).
 * Gọi: printCV() — đã gắn onclick trên #navDocsLink và #openDocsBtn.
 */
function printCV() {
  const modal = document.getElementById("printOptionsModal");
  if (!modal) {
    console.error("[printCV] #printOptionsModal không tìm thấy — kiểm tra HTML đã chuyển modal ra ngoài section chưa.");
    return;
  }

  // Hiện overlay (CSS .modal.show dùng flex center)
  modal.style.display = "flex";
  document.body.classList.add("modal-docs-open");
  document.body.style.overflow = "hidden";

  setTimeout(function () {
    modal.classList.add("show");
  }, 10);

  const firstButton = modal.querySelector(".cv-option-btn");
  if (firstButton) firstButton.focus();
}

/**
 * Chọn ngôn ngữ CV trong modal (data-lang="us"|"vn").
 * @param {string} language - "us" hoặc "vn"
 */
function selectLanguage(language) {
  selectedLanguage = language;

  if ("vibrate" in navigator) {
    navigator.vibrate(50);
  }

  document.querySelectorAll(".cv-option-btn[data-lang]").forEach(function (btn) {
    btn.classList.remove("selected");
  });
  var active = document.querySelector('.cv-option-btn[data-lang="' + language + '"]');
  if (active) active.classList.add("selected");

  updateDownloadButton();
}

/**
 * Bật/tắt nút Preview & Download + cập nhật nhãn theo ngôn ngữ site.
 */
function updateDownloadButton() {
  var downloadBtn = document.getElementById("downloadCVBtn");
  var previewBtn = document.getElementById("previewCVBtn");
  if (!downloadBtn || !previewBtn) return;

  var currentLang = localStorage.getItem("language") || "us";
  var isVietnamese = currentLang === "vn";

  var dlTextEl = downloadBtn.querySelector(".btn-text");
  var pvTextEl = previewBtn.querySelector(".btn-text");

  if (selectedLanguage) {
    downloadBtn.disabled = false;
    previewBtn.disabled = false;

    var langText =
      selectedLanguage === "us"
        ? isVietnamese
          ? "Tiếng Anh"
          : "English"
        : isVietnamese
          ? "Tiếng Việt"
          : "Vietnamese";

    var downloadText = isVietnamese ? "Tải CV" : "Download CV";
    var previewText = isVietnamese ? "Xem trước CV" : "Preview CV";

    if (dlTextEl) dlTextEl.textContent = downloadText + " (" + langText + ")";
    if (pvTextEl) pvTextEl.textContent = previewText + " (" + langText + ")";
  } else {
    downloadBtn.disabled = true;
    previewBtn.disabled = true;
    if (dlTextEl) dlTextEl.textContent = isVietnamese ? "Tải CV" : "Download CV";
    if (pvTextEl) pvTextEl.textContent = isVietnamese ? "Xem trước CV" : "Preview CV";
  }
}

/**
 * Mở PDF CV tab mới (preview).
 */
function previewSelectedCV() {
  if (!selectedLanguage) {
    var currentLang = localStorage.getItem("language") || "us";
    alert(currentLang === "vn" ? "Vui lòng chọn ngôn ngữ" : "Please select a language");
    return;
  }

  var previewBtn = document.getElementById("previewCVBtn");
  var originalText = previewBtn.querySelector(".btn-text").textContent;
  var currentLang = localStorage.getItem("language") || "us";
  previewBtn.querySelector(".btn-text").textContent =
    currentLang === "vn" ? "Đang mở..." : "Opening...";
  previewBtn.disabled = true;

  var resolved = resolveCvPath(selectedLanguage);
  var url = "CV/" + resolved.folder + "/" + resolved.file;
  window.open(url, "_blank", "noopener,noreferrer");

  setTimeout(function () {
    previewBtn.querySelector(".btn-text").textContent = originalText;
    previewBtn.disabled = false;
  }, 800);
}

/**
 * Tải PDF CV về máy.
 */
function downloadSelectedCV() {
  if (!selectedLanguage) {
    var currentLang = localStorage.getItem("language") || "us";
    alert(currentLang === "vn" ? "Vui lòng chọn ngôn ngữ" : "Please select a language");
    return;
  }

  var downloadBtn = document.getElementById("downloadCVBtn");
  var originalText = downloadBtn.querySelector(".btn-text").textContent;
  var currentLang = localStorage.getItem("language") || "us";
  downloadBtn.querySelector(".btn-text").textContent =
    currentLang === "vn" ? "Đang tải..." : "Downloading...";
  downloadBtn.disabled = true;

  if ("vibrate" in navigator) {
    navigator.vibrate([100, 50, 100]);
  }

  var resolved = resolveCvPath(selectedLanguage);
  var url = "CV/" + resolved.folder + "/" + resolved.file;

  var a = document.createElement("a");
  a.href = url;
  a.download = resolved.downloadName;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(function () {
    downloadBtn.querySelector(".btn-text").textContent = originalText;
    downloadBtn.disabled = false;
    closePrintOptions();
  }, 1200);
}

/**
 * Reset chọn ngôn ngữ khi đóng modal.
 */
function resetCVSelections() {
  selectedLanguage = "";
  document.querySelectorAll(".cv-option-btn[data-lang]").forEach(function (btn) {
    btn.classList.remove("selected");
  });
  updateDownloadButton();
}
