# Sửa index.html (làm đúng thứ tự)

## A. Nút About — xóa orphan (bắt buộc)

Trong `#about`, chỉ giữ **một** khối nút:

```html
          <div class="btn-cv">
            <button type="button" onclick="printCV()" class="main-btn" id="openDocsBtn">
              <span class="btn-text" data-i18n="buttons.openDocs">CV &amp; Docs</span>
              <span class="btn-icon"><i class="bi bi-folder2-open"></i></span>
            </button>
          </div>
```

**XÓA** đoạn sót ngay bên dưới (nếu còn):

```html
          <!-- Modal Hồ sơ & Tài liệu -->
            <button onclick="printCV()" class="main-btn">
              <span class="btn-text">Download CV</span>
              ...
            </button>
          </div>
```

Việc này sửa layout ảnh/slogan About (DOM không còn lệch).

---

## B. Chuyển modal ra ngoài section (bắt buộc — Docs mọi trang)

1. **Cắt** toàn bộ khối:

```html
<div id="printOptionsModal" class="modal">
  ... toàn bộ nội dung modal 2 card ...
</div>
```

(khỏi bên trong `#about`)

2. **Dán** ngay **trước** `</body>` (sau các section, trước hoặc sau script vendor cũng được — khuyến nghị **trước** `<script src="js/main.js">`):

```html
  <!-- Docs modal: NGOÀI mọi section để mở được từ Home/Resume/Portfolio/Contact -->
  <div id="printOptionsModal" class="modal">
    ... (nguyên khối đã cắt) ...
  </div>

  <!-- Vendor JS ... -->
  <script src="js/main.js"></script>
  ...
```

---

## C. Đổi ngôn ngữ — bỏ onclick trùng

Đổi `.lang-toggle` thành **không** gọi manualLanguageSwitch trên HTML (class tự bind):

```html
        <div class="lang-toggle" title="Switch Language">
          <img id="currentFlag" src="https://flagcdn.com/w20/us.png" loading="lazy" alt="EN" width="20" height="15">
          <span class="hover-hint">Click to switch</span>
        </div>
```

(Xóa `onclick="window.manualLanguageSwitch && window.manualLanguageSwitch()"`)

`manualLanguageSwitch` vẫn tồn tại trong JS làm fallback.

---

## D. Contact — GIỮ layout cũ (hình 4)

**Không** dùng list “05 / GET IN TOUCH”.

Giữ (hoặc khôi phục) section 3 card ngang:

```html
  <section id="contact" class="contact">
    <div class="container">
      <div class="section-title">
        <span>Contact</span>
        <h2>Contact</h2>
        <p>Contact Me</p>
      </div>
      <div class="row mt-2">
        <div class="col-md-4 mt-4 mt-md-0 d-flex align-items-stretch">
          <div class="info-box">
            <i class="bx bx-share-alt"></i>
            <h3>Social Profiles</h3>
            <div class="social-links">
              <a href="https://www.facebook.com/TongNhaVy.VzTong" target="_blank" class="facebook"><i class="bi bi-facebook"></i></a>
              <a href="https://github.com/VzTong" target="_blank"><i class="fab fa-github"></i></a>
              <a href="https://www.linkedin.com/in/nha-vy-tong-vztong/" target="_blank" class="linkedin"><i class="bi bi-linkedin"></i></a>
            </div>
          </div>
        </div>
        <div class="col-md-4 mt-4 d-flex align-items-stretch">
          <div class="info-box">
            <i class="bx bx-envelope"></i>
            <h3>Email Me</h3>
            <p>vzz95559@gmail.com</p>
          </div>
        </div>
        <div class="col-md-4 mt-4 d-flex align-items-stretch">
          <div class="info-box">
            <i class="bx bx-phone-call"></i>
            <h3>Call Me</h3>
            <p>
              <img src="/pics/user/VMflag.png" loading="lazy" width="30rem" alt=""> +848 4873 5559
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
```

Căn chỉnh lệch (nếu còn) chỉ sửa CSS `.info-box` / padding — không đổi cấu trúc.

---

## E. Nav — Docs trước Contact (khuyến nghị)

```html
          <li><a class="nav-link scrollto" href="#portfolio">Portfolio</a></li>
          <li>
            <a class="nav-link" href="#docs" id="navDocsLink"
               onclick="event.preventDefault(); printCV();">
              <span data-i18n="nav.docs">Docs</span>
            </a>
          </li>
          <li><a class="nav-link scrollto" href="#contact">Contact</a></li>
```

---

## F. Scripts (giữ)

```html
<script src="js/main.js"></script>
<script src="js/transcript-viewer.js"></script>
<script src="js/theme-persist.js"></script>
<script src="js/scroll-to-click-bridge.js"></script>
<script src="js/chat-widget.js"></script>
<script src="js/language-switcher.js"></script>
```

Không load `language-switcher-patches.js` / `js/docs-modal.js` root.
