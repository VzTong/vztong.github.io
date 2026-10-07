# Cấu trúc sạch — 1 chức năng = 1 thư mục

```
js/
  main.js                 ← Template BootstrapMade ONLY (section, swiper, isotope…)
                           KHÔNG chứa printCV / download CV

  i18n/
    language-switcher.js  ← Đổi ngôn ngữ site (flag + apply text)
    languages.json        ← Toàn bộ bản dịch

  docs/
    docs-modal.js         ← Web Component <docs-modal> + printCV/close/select/preview/download
    transcript-viewer.js  ← previewTranscript() phụ lục

  ui/
    theme-persist.js
    scroll-to-click-bridge.js

  chat/
    chat-widget.js
    chatbot-data.json     (nếu có)

css/
  style.css               ← template gốc (giữ)
  upgrade-ui.css          ← scroll bridge, theme, misc
  docs-modal.css          ← CHỈ style modal Docs (gộp từ upgrade + contact-v2 phần modal)
```

## index.html gọn hơn

- Xóa hết `#printOptionsModal` trong About.
- Trước `</body>`: `<docs-modal></docs-modal>`
- Nút About / nav Docs: `onclick="printCV()"` (hàm export từ docs-modal.js)
- Contact: **giữ 3 card cũ** (chưa extract — HTML ngắn, không bắt buộc)

## Script order (cuối body)

```html
<script src="js/main.js"></script>
<script src="js/docs/transcript-viewer.js"></script>
<script src="js/docs/docs-modal.js"></script>
<script src="js/ui/theme-persist.js"></script>
<script src="js/ui/scroll-to-click-bridge.js"></script>
<script src="js/chat/chat-widget.js"></script>
<script src="js/i18n/language-switcher.js"></script>
```

## Việc migrate từ branch hiện tại

| Cũ | Mới |
|----|-----|
| `js/language-switcher.js` | `js/i18n/language-switcher.js` |
| `js/languages.json` | `js/i18n/languages.json` |
| `js/transcript-viewer.js` | `js/docs/transcript-viewer.js` |
| `js/components/docs-modal.js` | `js/docs/docs-modal.js` (bản đầy đủ bên dưới) |
| Block CV cuối `main.js` | **Xóa** — đã nằm trong docs-modal.js |
| `js/main-cv-block.js`, `*-tail.js`, `*-patches.js` | **Xóa hẳn** (không commit patch) |
| `js/components/contact-section.js` | Xóa nếu không dùng thẻ |
| `css/contact-v2-and-docs-modal.css` | Gộp phần modal → `css/docs-modal.css`, bỏ contact-v2 |

## Commit

```
Title: refactor: feature folders for docs and i18n, wire docs-modal component

Detail:
- Tách js theo chức năng: i18n/, docs/, ui/, chat/.
- Wire <docs-modal>: HTML ngắn, modal ngoài section, mở Docs mọi trang.
- Path CV đúng en/vi; xóa block CV khỏi main.js.
- language-switcher: export switchSiteLanguage + instance, đổi lang ổn định.
- Xóa file patch/rác (main-cv-block, patches, components cũ không wire).
- CSS modal gom docs-modal.css.
- Rollback: revert commit này.
```
