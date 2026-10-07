# P0 — Gọn + đúng (vanilla, không build, chạy GitHub Pages)

## Trả lời nhanh: Build trên Pages?

| | |
|--|--|
| **Vanilla / Web Component** | Push là chạy. **Không** cần npm trên Pages. |
| **Vue + Vite** | Phải build local/CI, **commit `dist/`**, HTML trỏ file đã build. Visitor không chạy npm. |

Mục tiêu hiện tại = **code gọn, đơn giản** → giữ vanilla. Vue = nhánh khác sau.

---

## Checklist sửa trên branch `feature/ui-scroll-upgrade`

### 1. Ghi đè file hỏng

| File | Việc |
|------|------|
| `js/transcript-viewer.js` | **Ghi đè** bằng bản trong thư mục này (đang bị patches ghi đè) |
| `js/docs-modal.js` (ở root `js/`) | **Xóa** (nội dung sai = contact-section) |
| `js/language-switcher-patches.js` | **Xóa** sau khi đã copy method vào class |
| `js/languages-fragment.json` | **Xóa** sau khi merge key (nếu đã merge) |

Giữ `js/components/` nếu muốn dùng sau; **P0 không bắt buộc load component** — modal 2-card đã nằm trong `index.html`.

### 2. `language-switcher.js`

Mở class `LanguageSwitcher`, **thay 4 method** bằng nội dung `js/language-switcher-METHODS.js`:
- `updateNavigation`
- `updateButtons`
- `updateContactSection`
- `updateCVModal`

### 3. `languages.json` — short label nút

```json
// us.buttons
"openDocs": "CV & Docs"

// vn.buttons
"openDocs": "CV & Hồ sơ"
```

Đảm bảo có `nav.docs` (`"Docs"` / `"Tài liệu"`) — repo đã có.

Thêm vào `contact` (us + vn) nếu chưa có (cho contact v2):

```json
// us.contact thêm:
"badge": "05 / GET IN TOUCH",
"lead": "Always open to chat about .NET backend, system design, and new opportunities.",
"emailLabel": "EMAIL",
"githubLabel": "GITHUB",
"linkedinLabel": "LINKEDIN",
"phoneLabel": "PHONE"

// vn.contact thêm:
"badge": "05 / LIÊN HỆ",
"lead": "Luôn sẵn sàng trao đổi về .NET backend, thiết kế hệ thống và cơ hội mới.",
"emailLabel": "EMAIL",
"githubLabel": "GITHUB",
"linkedinLabel": "LINKEDIN",
"phoneLabel": "ĐIỆN THOẠI"
```

### 4. `index.html` — 4 chỗ

#### 4.1 Navbar — Docs **trước** Contact

```html
<ul>
  <li><a class="nav-link scrollto active" href="#header">Home</a></li>
  <li><a class="nav-link scrollto" href="#about">About</a></li>
  <li><a class="nav-link scrollto" href="#resume">Resume</a></li>
  <li><a class="nav-link scrollto" href="#portfolio">Portfolio</a></li>
  <li>
    <a class="nav-link" href="#docs" id="navDocsLink"
       onclick="event.preventDefault(); printCV();">
      <span data-i18n="nav.docs">Docs</span>
    </a>
  </li>
  <li><a class="nav-link scrollto" href="#contact">Contact</a></li>
</ul>
```

#### 4.2 About button — **xóa mảnh orphan** (dòng ~150–155)

Chỉ giữ **một** khối:

```html
<div class="btn-cv">
  <button type="button" onclick="printCV()" class="main-btn" id="openDocsBtn">
    <span class="btn-text" data-i18n="buttons.openDocs">CV &amp; Docs</span>
    <span class="btn-icon"><i class="bi bi-folder2-open"></i></span>
  </button>
</div>

<!-- Modal Hồ sơ & Tài liệu: giữ nguyên #printOptionsModal 2-card hiện có -->
```

Xóa đoạn orphan:
```html
<!-- Modal Hồ sơ & Tài liệu -->
  <button onclick="printCV()" class="main-btn">...Download CV...</button>
</div>
```

#### 4.3 Contact — thay section cũ bằng v2 (markup trực tiếp, không WC)

Xóa `<section id="contact" class="contact">...</section>` cũ, thay:

```html
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
```

Style contact-v2 đã có trong `upgrade-ui.css` / `contact-v2-and-docs-modal.css`.  
Nếu chưa link CSS riêng, thêm (sau upgrade-ui):

```html
<link rel="stylesheet" href="css/contact-v2-and-docs-modal.css" />
```

(hoặc dán nội dung file đó vào **cuối** `upgrade-ui.css` rồi bỏ link riêng).

#### 4.4 Scripts — giữ đơn giản

```html
<script src="js/main.js"></script>
<script src="js/transcript-viewer.js"></script>
<script src="js/theme-persist.js"></script>
<script src="js/scroll-to-click-bridge.js"></script>
<script src="js/chat-widget.js"></script>
<script src="js/language-switcher.js"></script>
```

**Không** load `language-switcher-patches.js`, `js/docs-modal.js` (root), components (P0).

### 5. `main.js` (tuỳ chọn, tốt hơn)

Trong `printCV()` thêm: `document.body.classList.add("modal-docs-open");`  
Trong `closePrintOptions()` thêm: `document.body.classList.remove("modal-docs-open");`

### 6. Drive ID

Trong `transcript-viewer.js` thay `REPLACE_WITH_YOUR_DRIVE_FILE_ID` bằng ID file phụ lục trên Drive.

---

## Commit đề xuất

```
Title: fix: restore transcript viewer, i18n nav map, clean about/contact markup

Detail:
- Khôi phục js/transcript-viewer.js (file bị ghi đè bởi patches).
- updateNavigation map theo href, hết ReferenceError t.
- Xóa nút About orphan; Docs trước Contact; Contact v2 4 card.
- openDocs short label; xóa file rác docs-modal.js root / patches.
- Không build; chạy GitHub Pages tĩnh.
- Rollback: revert commit này.
```

---

## Sau P0 (plan cũ, nhánh này hoặc PR riêng)

1. Skills UI (chip / nhóm tech gọn hơn list dài)
2. Portfolio show (card hover, center modal detail — Mục 3.4)
3. Vue islands — **nhánh mới**, không trộn P0

---

## Test nhanh

- [ ] Console không còn `t is not defined`
- [ ] Docs / nút About mở modal 2 card giữa màn
- [ ] Chọn EN/VI → Preview/Download CV
- [ ] Phụ lục mở tab (Drive hoặc PDF)
- [ ] Contact 4 card; đổi ngôn ngữ đổi badge/lead
- [ ] Scroll bridge + nav section vẫn ổn
- [ ] Footer BootstrapMade còn
