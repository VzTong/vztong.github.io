# Scripts

## Build docs bundle

### `build-docs-bundle.js`

Script này dùng để đóng gói các file Markdown trong thư mục `docs/` thành:

```text
worker/src/docsBundle.json
```

`docsBundle.json` được Cloudflare Worker sử dụng làm **local fallback** khi Worker không thể lấy documentation từ GitHub Raw.

### Khi nào cần chạy?

Chạy lại script sau khi:

* Thêm tài liệu `.md` mới vào `docs/`
* Chỉnh sửa nội dung các file `.md`
* Xóa hoặc đổi tên tài liệu
* Thay đổi cấu trúc thư mục `docs/`

### Cách chạy

Từ thư mục gốc của project:

```powershell
node .\scripts\build-docs-bundle.js
```

Sau khi chạy thành công, kiểm tra file:

```text
worker/src/docsBundle.json
```

### Sau khi bundle

Có thể chạy Worker local để kiểm tra:

```powershell
npm run worker:dev
```

### Lưu ý

Không chỉnh sửa `worker/src/docsBundle.json` bằng tay.

File này là **file được generate**, nên khi documentation thay đổi hãy chạy lại:

```powershell
node .\scripts\build-docs-bundle.js
```

Luồng dữ liệu:

```text
docs/*.md
   ↓
build-docs-bundle.js
   ↓
worker/src/docsBundle.json
   ↓
Cloudflare Worker
```
