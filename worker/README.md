# Cloudflare Worker - Portfolio AI Assistant

Cloudflare Worker serverless proxy connecting the Portfolio frontend with Google Gemini API.

---

## ⚙️ Cấu hình biến môi trường (Environment Variables)

Hệ thống hỗ trợ 2 biến môi trường:

| Biến | Loại | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | **Secret** (Bảo mật) | *(Bắt buộc)* | API Key từ Google AI Studio |
| `GEMINI_MODEL` | **Var / Config** | `gemini-1.5-flash` | Tên model Gemini (`gemini-1.5-flash`, `gemini-2.0-flash`,...) |

---

## 🚀 1. Cấu hình khi chạy Local (Local Development)

1. Tạo file `worker/.dev.vars` (sao chép từ `worker/.dev.vars.example`):
   ```bash
   cp worker/.dev.vars.example worker/.dev.vars
   ```
2. Mở file `worker/.dev.vars` và điền:
   ```env
   GEMINI_API_KEY="AIzaSyYourActualKeyHere..."
   GEMINI_MODEL="gemini-1.5-flash"
   ```
3. Khởi động Worker ở máy local:
   ```bash
   npm run worker:dev
   ```

---

## 🌐 2. Cấu hình khi triển khai lên Cloudflare (Production)

### Cách 1: Thay đổi Model trong `worker/wrangler.toml`
Trong file [worker/wrangler.toml](file:///d:/Workspace/Portfolio/worker/wrangler.toml):
```toml
[vars]
ENVIRONMENT = "production"
GEMINI_MODEL = "gemini-1.5-flash"
```
*(Bạn có thể đổi sang model khác như `gemini-2.0-flash` bất kỳ lúc nào rồi chạy `npm run worker:deploy`)*

### Cách 2: Thiết lập `GEMINI_API_KEY` Secret trên Cloudflare
Lệnh này gửi trực tiếp API Key lên Cloudflare Secret Store (không bao giờ lộ trong git hay code):
```bash
npx wrangler secret put GEMINI_API_KEY --config worker/wrangler.toml
```

### Deploy lên Cloudflare Edge:
```bash
npm run worker:deploy
```

---

## 🧪 Kiểm tra API ở Local (curl)

```bash
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Chào bạn, hãy giới thiệu về Thuận\"}"
```
