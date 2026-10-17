# Cloudflare Worker — Portfolio AI Assistant & Access Logging

Serverless proxy connecting the Portfolio frontend with Google Gemini API,
plus visitor tracking stored in Cloudflare D1.

---

## Tiếng Việt

### Tổng quan

Worker này đảm nhận hai nhiệm vụ chính:

1. **AI Chat Proxy** — Bảo vệ `GEMINI_API_KEY` và chuyển tiếp request tới Google Gemini.
2. **Access Tracking** — Ghi nhận lượt truy cập vào bảng `portfolio_access_history` trên Cloudflare D1.

### Biến môi trường

| Biến                 | Loại     | Bắt buộc | Mô tả                                              |
|----------------------|----------|----------|----------------------------------------------------|
| `GEMINI_API_KEY`     | Secret   | Có       | API Key từ Google AI Studio                        |
| `GEMINI_MODEL`       | Var      | Không    | Model Gemini (mặc định: `gemini-1.5-flash`)        |
| `LOGS_ADMIN_SECRET`  | Secret   | Không*   | Key bảo vệ endpoint `GET /api/logs`                |

\* Bắt buộc nếu bạn muốn xem lịch sử truy cập qua API.

Các biến khác (đã cấu hình sẵn trong `wrangler.toml`):

| Biến                     | Mô tả                                              |
|--------------------------|----------------------------------------------------|
| `ENVIRONMENT`            | `production`                                       |
| `PORTFOLIO_DATA_URL`     | URL raw JSON portfolio data                        |
| `GITHUB_DOCS_BASE_URL`   | Base URL raw documentation                         |
| `MAX_REQUESTS_PER_MINUTE`| Rate limit (mặc định 10)                           |
| `MAX_TOKENS_PER_REQUEST` | Giới hạn token                                     |

### 1. Cấu hình Local Development

```bash
cp worker/.dev.vars.example worker/.dev.vars
```

Nội dung mẫu `worker/.dev.vars`:

```env
GEMINI_API_KEY="AIzaSyYourActualKeyHere..."
GEMINI_MODEL="gemini-1.5-flash"
LOGS_ADMIN_SECRET="your-strong-random-secret-here"
```

Chạy Worker:

```bash
npm run worker:dev
```

Worker mặc định chạy tại `http://localhost:8787`.

### 2. Deploy lên Cloudflare

#### Đặt Secrets

```bash
# Gemini API Key
npx wrangler secret put GEMINI_API_KEY --config worker/wrangler.toml

# Admin secret để xem logs
npx wrangler secret put LOGS_ADMIN_SECRET --config worker/wrangler.toml

# hoặc dùng script tiện lợi có sẵn trong package.json:
npm run secret:logs
```

#### Deploy

```bash
npm run worker:deploy
```

### 3. Hướng dẫn chi tiết: Tạo & dùng LOGS_ADMIN_SECRET

`LOGS_ADMIN_SECRET` là chìa khóa bảo vệ endpoint `GET /api/logs`.
Chỉ ai biết secret này mới xem được lịch sử người truy cập portfolio.

#### Bước 1 — Tạo secret trên Cloudflare

Chạy **một trong hai** lệnh sau (từ thư mục gốc project):

```bash
# Cách 1: dùng script có sẵn (khuyến nghị)
npm run secret:logs

# Cách 2: gọi wrangler trực tiếp
npx wrangler secret put LOGS_ADMIN_SECRET --config worker/wrangler.toml
```

Terminal sẽ hiện:

```
Enter a secret value:
```

**Bạn cần nhập một chuỗi bí mật.** Ví dụ:

```
Logs_2026_K9mP2qR7vN4xL8wZ
```

Hoặc tạo chuỗi ngẫu nhiên an toàn bằng OpenSSL:

```bash
openssl rand -base64 32
```

Copy kết quả rồi dán vào prompt `Enter a secret value:`, sau đó nhấn Enter.

Wrangler sẽ upload secret lên Cloudflare Secret Store.
Secret **không bao giờ** được lưu trong git hay code.

> **Lưu ý:**
> - Nên dùng ≥ 24 ký tự, kết hợp chữ + số + ký tự đặc biệt.
> - Giữ secret ở nơi an toàn (password manager).
> - Nếu quên secret → chạy lại lệnh `secret put` để ghi đè bằng giá trị mới.

#### Bước 2 — Xem lịch sử truy cập qua API

Sau khi đã đặt secret, gọi endpoint:

```bash
# Thay YOUR_SECRET bằng giá trị bạn vừa đặt
# Thay <subdomain> bằng subdomain Worker thực tế

# Cách A — query parameter
curl "https://portfolio-gemini-worker.<subdomain>.workers.dev/api/logs?key=YOUR_SECRET&limit=50"

# Cách B — Authorization header (khuyến nghị hơn)
curl -H "Authorization: Bearer YOUR_SECRET" \
  "https://portfolio-gemini-worker.<subdomain>.workers.dev/api/logs?limit=50"
```

**Tham số query:**

| Tham số  | Mặc định | Tối đa | Mô tả                          |
|----------|----------|--------|--------------------------------|
| `limit`  | 50       | 200    | Số bản ghi trả về              |
| `key`    | —        | —      | Giá trị `LOGS_ADMIN_SECRET`    |

**Response mẫu thành công:**

```json
{
  "success": true,
  "stats": {
    "total_visits": 1284,
    "unique_ips": 892,
    "top_countries": [
      { "country": "VN", "count": 650 },
      { "country": "US", "count": 210 }
    ],
    "top_devices": [
      { "device_type": "desktop", "count": 720 },
      { "device_type": "mobile", "count": 480 }
    ]
  },
  "logs": [
    {
      "id": 1284,
      "ip": "xxx.xxx.xxx.xxx",
      "country": "VN",
      "city": "Ho Chi Minh",
      "device_type": "desktop",
      "path": "/",
      "referrer": "https://google.com",
      "created_at": "2026-10-18 03:45:12"
    }
  ]
}
```

**Nếu secret sai hoặc thiếu** → HTTP `401 Unauthorized`:

```json
{ "error": "Unauthorized. Valid admin key required." }
```

#### Cách khác: Xem log bằng Wrangler CLI (không cần secret)

```bash
npm run logs
```

Lệnh này dùng quyền Cloudflare account của bạn để query D1 trực tiếp, không đi qua endpoint `/api/logs`.

### 4. Các endpoint của Worker

| Method | Path          | Mô tả                                      | Bảo vệ              |
|--------|---------------|--------------------------------------------|---------------------|
| POST   | `/api/chat`   | Chat với Gemini AI                         | Rate limit          |
| POST   | `/api/track`  | Ghi log lượt truy cập                      | Không (public)      |
| GET    | `/api/logs`   | Xem lịch sử truy cập + thống kê            | `LOGS_ADMIN_SECRET` |

### 5. Kiểm tra nhanh

```bash
# Test chat
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Chào bạn, hãy giới thiệu về Vy\"}"

# Test logs (sau khi đã đặt secret trong .dev.vars hoặc production)
curl "http://localhost:8787/api/logs?key=YOUR_SECRET&limit=10"
```

---

## English

### Overview

This Worker serves two main purposes:

1. **AI Chat Proxy** — Protects the `GEMINI_API_KEY` and forwards requests to Google Gemini.
2. **Access Tracking** — Records page visits into the `portfolio_access_history` table on Cloudflare D1.

### Environment Variables

| Variable             | Type   | Required | Description                                            |
|----------------------|--------|----------|--------------------------------------------------------|
| `GEMINI_API_KEY`     | Secret | Yes      | API Key from Google AI Studio                          |
| `GEMINI_MODEL`       | Var    | No       | Gemini model (default: `gemini-1.5-flash`)             |
| `LOGS_ADMIN_SECRET`  | Secret | No*      | Key protecting the `GET /api/logs` endpoint            |

\* Required only if you want to view access history via the API.

Other variables (pre-configured in `wrangler.toml`):

| Variable                 | Description                                          |
|--------------------------|------------------------------------------------------|
| `ENVIRONMENT`            | `production`                                         |
| `PORTFOLIO_DATA_URL`     | Raw JSON URL of portfolio data                       |
| `GITHUB_DOCS_BASE_URL`   | Base URL for raw documentation                       |
| `MAX_REQUESTS_PER_MINUTE`| Rate limit (default 10)                              |
| `MAX_TOKENS_PER_REQUEST` | Token ceiling                                        |

### 1. Local Development Setup

```bash
cp worker/.dev.vars.example worker/.dev.vars
```

Example content of `worker/.dev.vars`:

```env
GEMINI_API_KEY="AIzaSyYourActualKeyHere..."
GEMINI_MODEL="gemini-1.5-flash"
LOGS_ADMIN_SECRET="your-strong-random-secret-here"
```

Start the Worker:

```bash
npm run worker:dev
```

The Worker runs at `http://localhost:8787` by default.

### 2. Deploy to Cloudflare

#### Set Secrets

```bash
# Gemini API Key
npx wrangler secret put GEMINI_API_KEY --config worker/wrangler.toml

# Admin secret for viewing logs
npx wrangler secret put LOGS_ADMIN_SECRET --config worker/wrangler.toml

# or use the convenience script from package.json:
npm run secret:logs
```

#### Deploy

```bash
npm run worker:deploy
```

### 3. Detailed Guide: Create & Use LOGS_ADMIN_SECRET

`LOGS_ADMIN_SECRET` is the key that protects the `GET /api/logs` endpoint.
Only someone who knows this secret can view the visitor history of the portfolio.

#### Step 1 — Create the secret on Cloudflare

Run **one of the following** commands (from the project root):

```bash
# Option 1: use the existing script (recommended)
npm run secret:logs

# Option 2: call wrangler directly
npx wrangler secret put LOGS_ADMIN_SECRET --config worker/wrangler.toml
```

The terminal will prompt:

```
Enter a secret value:
```

**Enter a secret string.** Example:

```
VyLogs_2026_K9mP2qR7vN4xL8wZ
```

Or generate a secure random string with OpenSSL:

```bash
openssl rand -base64 32
```

Copy the output and paste it into the `Enter a secret value:` prompt, then press Enter.

Wrangler uploads the secret to the Cloudflare Secret Store.
The secret is **never** stored in git or source code.

> **Notes:**
> - Prefer ≥ 24 characters, mixing letters, numbers, and symbols.
> - Keep the secret in a safe place (password manager).
> - If you forget the secret → run the `secret put` command again to overwrite it with a new value.

#### Step 2 — View access history via the API

After setting the secret, call the endpoint:

```bash
# Replace YOUR_SECRET with the value you just set
# Replace <subdomain> with your actual Worker subdomain

# Option A — query parameter
curl "https://portfolio-gemini-worker.<subdomain>.workers.dev/api/logs?key=YOUR_SECRET&limit=50"

# Option B — Authorization header (preferred)
curl -H "Authorization: Bearer YOUR_SECRET" \
  "https://portfolio-gemini-worker.<subdomain>.workers.dev/api/logs?limit=50"
```

**Query parameters:**

| Parameter | Default | Max | Description                     |
|-----------|---------|-----|---------------------------------|
| `limit`   | 50      | 200 | Number of records to return     |
| `key`     | —       | —   | Value of `LOGS_ADMIN_SECRET`    |

**Sample successful response:**

```json
{
  "success": true,
  "stats": {
    "total_visits": 1284,
    "unique_ips": 892,
    "top_countries": [
      { "country": "VN", "count": 650 },
      { "country": "US", "count": 210 }
    ],
    "top_devices": [
      { "device_type": "desktop", "count": 720 },
      { "device_type": "mobile", "count": 480 }
    ]
  },
  "logs": [
    {
      "id": 1284,
      "ip": "xxx.xxx.xxx.xxx",
      "country": "VN",
      "city": "Ho Chi Minh",
      "device_type": "desktop",
      "path": "/",
      "referrer": "https://google.com",
      "created_at": "2026-10-18 03:45:12"
    }
  ]
}
```

**If the secret is missing or incorrect** → HTTP `401 Unauthorized`:

```json
{ "error": "Unauthorized. Valid admin key required." }
```

#### Alternative: View logs with Wrangler CLI (no secret needed)

```bash
npm run logs
```

This uses your Cloudflare account credentials to query D1 directly, bypassing the `/api/logs` endpoint.

### 4. Worker Endpoints

| Method | Path          | Description                              | Protection            |
|--------|---------------|------------------------------------------|-----------------------|
| POST   | `/api/chat`   | Chat with Gemini AI                      | Rate limit            |
| POST   | `/api/track`  | Record page visit                         | None (public)         |
| GET    | `/api/logs`   | View access history + statistics         | `LOGS_ADMIN_SECRET`   |

### 5. Quick Test

```bash
# Test chat
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Hello, please introduce Vy\"}"

# Test logs (after setting the secret in .dev.vars or production)
curl "http://localhost:8787/api/logs?key=YOUR_SECRET&limit=10"
```
