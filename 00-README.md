# P0-fix2 — Sửa lỗi sau commit (1 gói đủ comment)

## Nguyên nhân từng lỗi (screenshot)

| Lỗi | Nguyên nhân |
|-----|-------------|
| **Docs chỉ mở được khi đang About** | `#printOptionsModal` nằm **bên trong** `<section id="about">`. Section khác ẩn About → modal cũng bị `display:none` theo cha. |
| **Đổi ngôn ngữ không ăn** | HTML gọi `manualLanguageSwitch()` — hàm này **chỉ đổi cờ**, không gọi `applyLanguage()`. |
| **Preview/Download CV 404** | Code cũ: `CV/us/...Fresher_US.pdf`. Thư mục thật: `CV/en/CV_TongNhaVy_EN.pdf`, `CV/vi/CV_TongNhaVy_VI.pdf`. |
| **Contact “lỏ”** | Layout list 1 cột lệch với theme. **Giữ layout cũ (3 card ngang)** như hình 4 — chỉ căn lại nếu cần. |
| **About ảnh/slogan vỡ** | HTML About bị **nút orphan + `</div>` thừa** → DOM lệch CSS. |
| **About chuyển section nhanh** | Delay 350ms trong `main.js` (sẵn có); cảm giác “nhanh” khi modal/section chồng — sau khi modal ra ngoài body sẽ ổn hơn. |

## File trong gói này

| File | Việc làm |
|------|----------|
| `js/main-cv-block.js` | **Thay toàn bộ** đoạn từ `// CV Modal State` đến hết `js/main.js` |
| `js/language-switcher-tail.js` | **Thay** từ `window.manualLanguageSwitch` đến hết file `language-switcher.js` |
| `js/transcript-viewer.js` | Ghi đè (đã đúng path phụ lục local) |
| `index-EDIT.md` | Sửa HTML: chuyển modal ra ngoài About, xóa orphan, Contact giữ cũ |

## Commit

```
Title: fix: docs modal outside about, CV paths en/vi, language switch apply

Detail:
- Chuyển #printOptionsModal ra ngoài section #about để Docs mở từ mọi mục.
- Sửa path CV: CV/en/CV_TongNhaVy_EN.pdf, CV/vi/CV_TongNhaVy_VI.pdf.
- manualLanguageSwitch gọi đúng LanguageSwitcher.applyLanguage.
- Xóa nút About orphan gây vỡ layout ảnh/slogan.
- Contact giữ layout 3 card cũ (không dùng list 05/GET IN TOUCH).
- Rollback: revert commit này.
```
