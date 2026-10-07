# Đoạn HTML cần có (sau khi dọn)

## 1. Head — CSS

```html
<link href="css/style.css" rel="stylesheet">
<link href="css/upgrade-ui.css" rel="stylesheet">
<link href="css/docs-modal.css" rel="stylesheet">
<link href="css/chat-widget.css" rel="stylesheet">
```

**Không** link `contact-v2-and-docs-modal.css` nữa (đã gộp modal → docs-modal.css).

---

## 2. Cờ ngôn ngữ — GIỮ onclick (đã fix)

```html
<div class="lang-toggle" title="Switch Language" onclick="switchSiteLanguage()">
  <img id="currentFlag" src="https://flagcdn.com/w20/us.png" loading="lazy" alt="EN" width="20" height="15">
  <span class="hover-hint">Click to switch</span>
</div>
```

`switchSiteLanguage` = hàm global trong `js/i18n/language-switcher.js`  
(có debounce, gọi `__langSwitcher.switchLanguage()`).

---

## 3. About — một nút, không modal, không orphan

```html
<div class="btn-cv">
  <button type="button" onclick="printCV()" class="main-btn" id="openDocsBtn">
    <span class="btn-text" data-i18n="buttons.openDocs">CV &amp; Docs</span>
    <span class="btn-icon"><i class="bi bi-folder2-open"></i></span>
  </button>
</div>
```

**Xóa** toàn bộ `#printOptionsModal` khỏi About (component lo).

---

## 4. Nav Docs

```html
<li>
  <a class="nav-link" href="#docs" id="navDocsLink"
     onclick="event.preventDefault(); printCV();">
    <span data-i18n="nav.docs">Docs</span>
  </a>
</li>
```

---

## 5. Trước `</body>` — component + scripts

```html
<!-- Modal Docs: ngoài mọi section -->
<docs-modal></docs-modal>

<!-- Vendor (jquery, bootstrap, …) giữ như cũ -->

<script src="js/main.js"></script>
<script src="js/docs/transcript-viewer.js"></script>
<script src="js/docs/docs-modal.js"></script>
<script src="js/ui/theme-persist.js"></script>
<script src="js/ui/scroll-to-click-bridge.js"></script>
<script src="js/chat/chat-widget.js"></script>
<script src="js/i18n/language-switcher.js"></script>
```

---

## 6. main.js

**Xóa** từ `// CV Modal State` / `let selectedLanguage` đến hết file  
(hết `printCV`, `downloadSelectedCV`, … — đã nằm trong docs-modal.js).

Giữ phần IIFE template (preloader, nav section-show, swiper, …).

---

## 7. Xóa file rác sau khi chuyển xong

```
js/main-cv-block.js
js/language-switcher-tail.js
js/language-switcher-patches.js
js/language-switcher.js          ← đã chuyển sang i18n/
js/languages.json                ← đã chuyển sang i18n/
js/transcript-viewer.js          ← đã chuyển sang docs/
js/components/docs-modal.js      ← đã chuyển sang docs/
js/components/contact-section.js ← không wire
css/contact-v2-and-docs-modal.css
```

Move (không xóa nội dung):

```
js/theme-persist.js              → js/ui/theme-persist.js
js/scroll-to-click-bridge.js     → js/ui/scroll-to-click-bridge.js
js/chat-widget.js                → js/chat/chat-widget.js
```

---

## 8. Vì sao trước modal không đổi ngôn ngữ?

`updateCVModal` chỉ query `[data-i18n^='cvModal.']`.  
Khi modal nằm trong About ẩn, hoặc text không có `data-i18n`, sẽ không đổi.  
Component mới gắn đủ `data-i18n="cvModal.*"`; mỗi lần `applyLanguage` gọi lại `updateCVModal`.
