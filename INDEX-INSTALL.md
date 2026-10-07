# Cài đặt components + commit theo RULE

## RULE commit (từ huong-dan-nang-cap-portfolio.md Mục 5)

Mỗi commit:

- **Title (English)** — Conventional Commits, ≤ 72 ký tự: `feat:`, `fix:`, `style:`, `docs:`
- **Detail (tiếng Việt)** — đổi gì, vì sao, ảnh hưởng cũ, rollback

### Commit đề xuất (tách PR/commit cho rõ)

**Commit 1 — components + contact/docs UI**

```
Title: feat: extract docs-modal and contact-section web components

Detail:
- Thêm js/components/docs-modal.js và contact-section.js (Web Component,
  chạy trên GitHub Pages không cần build/backend).
- Modal 2 card CV + Phụ lục; phụ lục chỉ xem qua Drive (transcript-viewer).
- Contact centered card grid (email, github, linkedin, phone).
- CSS: contact-v2-and-docs-modal.css dán cuối upgrade-ui.css.
- index.html: thay modal/section cũ bằng <docs-modal> và <contact-section>.
- Không sửa logic click navbar / printCV trong main.js.
- Rollback: xóa 2 component + script, khôi phục markup cũ.
```

**Commit 2 — i18n fix**

```
Title: fix: map navbar i18n by href and short CV & Docs labels

Detail:
- Sửa updateNavigation: map theo href, hết ReferenceError biến t,
  hết lệch text khi có link Docs.
- buttons.openDocs: "CV & Docs" / "CV & Hồ sơ".
- contact.* và cvModal.* đủ EN/VN trong languages.json.
- Rollback: revert language-switcher.js + languages.json.
```

---

## File trong zip / thư mục `portfolio-upgrade`

| File | Việc làm |
|------|----------|
| `js/components/docs-modal.js` | Copy vào repo cùng path |
| `js/components/contact-section.js` | Copy vào repo cùng path |
| `js/transcript-viewer.js` | Ghi đè file hiện có |
| `css/contact-v2-and-docs-modal.css` | **Dán cuối** `css/upgrade-ui.css` |
| `js/language-switcher-patches.js` | **Copy hàm** vào class trong `language-switcher.js` (không load riêng) |
| `languages-fragment.json` | Merge vào `js/languages.json` (us + vn) |
| `index-snippets.html` | Hướng dẫn chỗ sửa index.html |

---

## Sửa index.html (3 chỗ)

### 1) Navbar — Docs trước Contact

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

### 2) Nút About

```html
<div class="btn-cv">
  <button type="button" onclick="printCV()" class="main-btn" id="openDocsBtn">
    <span class="btn-text" data-i18n="buttons.openDocs">CV &amp; Hồ sơ</span>
    <span class="btn-icon"><i class="bi bi-folder2-open"></i></span>
  </button>
</div>
```

### 3) Xóa `#printOptionsModal` cũ và `<section id="contact">` cũ

Thêm trước các script vendor (hoặc cuối body):

```html
<docs-modal></docs-modal>
<contact-section></contact-section>
```

Scripts (components **trước** language-switcher):

```html
<script src="js/main.js"></script>
<script src="js/transcript-viewer.js"></script>
<script src="js/theme-persist.js"></script>
<script src="js/scroll-to-click-bridge.js"></script>
<script src="js/components/docs-modal.js"></script>
<script src="js/components/contact-section.js"></script>
<script src="js/chat-widget.js"></script>
<script src="js/language-switcher.js"></script>
```

### 4) main.js — khóa cuộn khi mở modal

Trong `printCV()` sau khi show modal:

```js
document.body.classList.add("modal-docs-open");
```

Trong `closePrintOptions()`:

```js
document.body.classList.remove("modal-docs-open");
```

---

## Checklist test

- [ ] Navbar Docs / Tài liệu mở modal
- [ ] Nút `CV & Docs` / `CV & Hồ sơ`
- [ ] Đổi ngôn ngữ không lỗi console (`t is not defined`)
- [ ] Modal giữa màn, overlay đậm
- [ ] Phụ lục → tab Drive
- [ ] Contact 4 card, EN/VI đổi badge/title/lead
- [ ] Credit BootstrapMade footer còn nguyên
