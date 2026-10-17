# Tống Nhã Vy — Portfolio

Personal portfolio of **Tống Nhã Vy**, Software Engineer specialized in Backend (.NET / C#) and modern frontend technologies.

**Live site:** [https://vytong.pages.dev](https://vytong.pages.dev)
GitHub Pages automatically redirects to the Cloudflare Pages domain.

[![Live Demo](https://img.shields.io/badge/Live-Demo-00C853?style=flat-square)](https://vytong.pages.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers%20%2B%20Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)

---

## Tiếng Việt

### Tổng quan

Portfolio hiện đại, tối ưu hiệu suất của **Tống Nhã Vy** – Kỹ sư Phần mềm chuyên sâu Backend (.NET / C#) và Frontend hiện đại.

**Điểm nổi bật:**
- Kiến trúc module rõ ràng (feature-based)
- Hỗ trợ song ngữ (Tiếng Việt / English)
- Animation mượt với GSAP
- Flipbook 3D giới thiệu dự án
- Trợ lý AI (Google Gemini) qua Cloudflare Worker
- Ghi log lượt truy cập với Cloudflare D1
- Tối ưu SEO (meta tags + Open Graph)

### Tính năng

| Section          | Mô tả                                           |
|------------------|-------------------------------------------------|
| **Hero**         | Banner full-viewport kiểu cinematic             |
| **About**        | Giới thiệu bản thân + số liệu nổi bật           |
| **Skills**       | Ma trận kỹ năng theo nhóm, tương tác            |
| **Experience**   | Timeline kinh nghiệm + drawer chi tiết          |
| **Projects**     | Gallery flipbook 3D (react-pageflip)            |
| **Contact**      | Thông tin liên hệ + social links                |
| **AI ChatBot**   | Trợ lý AI nổi, powered by Gemini                |
| **Documents**    | Xem CV & bảng điểm                              |
| **Utilities**    | Preloader, Back-to-Top, Theme & Language toggle |

### Tech Stack

**Frontend**
- React 19 · Vite 6 · Tailwind CSS 3
- GSAP (`@gsap/react`)
- i18next + react-i18next
- react-pageflip

**Backend / Infrastructure**
- Cloudflare Workers (AI proxy + tracking)
- Google Gemini API
- Cloudflare D1 (access history)
- Cloudflare Pages (hosting chính)

**Tooling**
- ESLint · PostCSS · Wrangler

### Cấu trúc dự án

```text
.
├── public/
├── src/
│   ├── assets/
│   ├── components/          # Shared UI & layout
│   ├── data/                # portfolioData.json
│   ├── features/            # about, chat, contact, experience, hero, projects, skills
│   ├── hooks/
│   ├── i18n/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── worker/                  # Cloudflare Worker (AI + logging)
│   ├── src/
│   ├── schema.sql
│   ├── wrangler.toml
│   └── README.md
├── scripts/
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Cài đặt & Chạy Local

**Yêu cầu:** Node.js ≥ 18

```bash
git clone https://github.com/VzTong/vztong.github.io.git
cd vztong.github.io
npm install
```

**Chạy frontend:**

```bash
npm run dev
```

Mở [http://localhost:5173](http://localhost:5173)

**Chạy Worker (tùy chọn – cho AI Chat & Tracking):**

```bash
cp worker/.dev.vars.example worker/.dev.vars
# Điền GEMINI_API_KEY vào worker/.dev.vars

npm run worker:dev
```

Worker chạy tại `http://localhost:8787`.

### Scripts

| Lệnh                     | Mô tả                                      |
|--------------------------|--------------------------------------------|
| `npm run dev`            | Chạy Vite dev server                       |
| `npm run build`          | Build production                           |
| `npm run preview`        | Preview bản build                          |
| `npm run lint`           | Chạy ESLint                                |
| `npm run worker:dev`     | Chạy Cloudflare Worker local               |
| `npm run worker:deploy`  | Deploy Worker lên Cloudflare               |
| `npm run logs`           | Xem 15 log truy cập gần nhất (D1)          |
| `npm run secret:logs`    | Đặt secret `LOGS_ADMIN_SECRET`             |

### Biến môi trường

**Frontend** (xem `.env.example`):

```env
VITE_API_CHAT_URL=https://your-worker.workers.dev/api/chat
```

**Worker:**

| Biến               | Loại     | Mô tả                                      |
|--------------------|----------|--------------------------------------------|
| `GEMINI_API_KEY`   | Secret   | API Key từ Google AI Studio                |
| `GEMINI_MODEL`     | Var      | Model (mặc định `gemini-1.5-flash`)        |
| `LOGS_ADMIN_SECRET`| Secret   | Key bảo vệ endpoint xem lịch sử truy cập   |

### Deploy

**Cloudflare Pages (khuyến nghị)**

1. Kết nối repository với Cloudflare Pages.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Thêm `VITE_API_CHAT_URL` nếu cần.

**Deploy Worker**

```bash
npx wrangler secret put GEMINI_API_KEY --config worker/wrangler.toml
npx wrangler secret put LOGS_ADMIN_SECRET --config worker/wrangler.toml
npm run worker:deploy
```

### Xem lịch sử truy cập (Access Logs)

Có **2 cách**:

#### Cách 1: Dùng Wrangler CLI (khuyến nghị khi đang phát triển)

```bash
npm run logs
```

Lệnh này truy vấn trực tiếp Cloudflare D1 (không cần secret).

#### Cách 2: Dùng API endpoint (GET /api/logs)

**Bước 1 — Tạo secret `LOGS_ADMIN_SECRET`:**

```bash
# Cách nhanh nhất (dùng script có sẵn)
npm run secret:logs

# Hoặc gọi trực tiếp wrangler
npx wrangler secret put LOGS_ADMIN_SECRET --config worker/wrangler.toml
```

Khi chạy lệnh, terminal sẽ hiện dòng:

```
Enter a secret value:
```

Bạn gõ (hoặc dán) một chuỗi bí mật mạnh, ví dụ:

```
VyPortfolioLogs_2026_xK9mP2qR7vN4
```

Nhấn Enter. Wrangler sẽ upload secret lên Cloudflare (không lưu vào git).

> **Lưu ý bảo mật:**
> - Không commit secret vào repository.
> - Nên dùng chuỗi ngẫu nhiên dài ≥ 24 ký tự.
> - Có thể tạo nhanh bằng: `openssl rand -base64 32`

**Bước 2 — Gọi API xem log:**

```bash
# Thay YOUR_SECRET bằng giá trị bạn vừa đặt
# Thay <subdomain> bằng subdomain Worker thực tế của bạn

# Cách A: truyền key qua query parameter
curl "https://portfolio-gemini-worker.<subdomain>.workers.dev/api/logs?key=YOUR_SECRET&limit=50"

# Cách B: truyền key qua Authorization header (khuyến nghị)
curl -H "Authorization: Bearer YOUR_SECRET" \
  "https://portfolio-gemini-worker.<subdomain>.workers.dev/api/logs?limit=50"
```

**Tham số:**
- `limit` (tùy chọn): số bản ghi trả về (mặc định 50, tối đa 200)

**Response** bao gồm:
- Danh sách log mới nhất (IP, country, city, device, path, referrer…)
- Thống kê: tổng lượt xem, unique IP, top countries, top devices

Nếu secret sai hoặc thiếu → trả về `401 Unauthorized`.

> Chi tiết đầy đủ nằm trong [`worker/README.md`](./worker/README.md).

### Tùy chỉnh nội dung

Hầu hết nội dung (About, Experience, Projects, Skills, Contact…) nằm trong:

```
src/data/portfolioData.json
```

### Liên hệ

- Email: [vzz95559@gmail.com](mailto:vzz95559@gmail.com)
- GitHub: [github.com/vztong](https://github.com/vztong)
- LinkedIn: [linkedin.com/in/nha-vy-tong-vztong](https://www.linkedin.com/in/nha-vy-tong-vztong)
- Portfolio: [vytong.pages.dev](https://vytong.pages.dev)

---

## English

### Overview

Modern, performance-oriented portfolio of **Tống Nhã Vy** – Software Engineer specialized in Backend (.NET / C#) and modern frontend technologies.

**Highlights:**
- Clean modular architecture (feature-based)
- Full bilingual support (Vietnamese / English)
- Smooth animations powered by GSAP
- Interactive 3D project flipbook
- AI assistant (Google Gemini) via Cloudflare Worker
- Access logging with Cloudflare D1
- SEO-friendly (meta tags + Open Graph)

### Features

| Section          | Description                                      |
|------------------|--------------------------------------------------|
| **Hero**         | Cinematic full-viewport banner with CTA          |
| **About**        | Personal introduction + key metrics              |
| **Skills**       | Interactive skill matrix by category             |
| **Experience**   | Timeline + detailed drawer view                  |
| **Projects**     | 3D flipbook gallery (react-pageflip)             |
| **Contact**      | Contact information + social links               |
| **AI ChatBot**   | Floating assistant powered by Gemini             |
| **Documents**    | CV & academic transcript viewer                  |
| **Utilities**    | Preloader, Back-to-Top, Theme & Language toggles |

### Tech Stack

**Frontend**
- React 19 · Vite 6 · Tailwind CSS 3
- GSAP (`@gsap/react`)
- i18next + react-i18next
- react-pageflip

**Backend / Infrastructure**
- Cloudflare Workers (AI proxy + tracking)
- Google Gemini API
- Cloudflare D1 (access history)
- Cloudflare Pages (primary hosting)

**Tooling**
- ESLint · PostCSS · Wrangler

### Project Structure

```text
.
├── public/
├── src/
│   ├── assets/
│   ├── components/          # Shared UI & layout
│   ├── data/                # portfolioData.json
│   ├── features/            # about, chat, contact, experience, hero, projects, skills
│   ├── hooks/
│   ├── i18n/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── worker/                  # Cloudflare Worker (AI + logging)
│   ├── src/
│   ├── schema.sql
│   ├── wrangler.toml
│   └── README.md
├── scripts/
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Getting Started

**Prerequisites:** Node.js ≥ 18

```bash
git clone https://github.com/VzTong/vztong.github.io.git
cd vztong.github.io
npm install
```

**Run frontend:**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Run Worker (optional – for AI Chat & Tracking):**

```bash
cp worker/.dev.vars.example worker/.dev.vars
# Add GEMINI_API_KEY to worker/.dev.vars

npm run worker:dev
```

Worker runs at `http://localhost:8787`.

### Available Scripts

| Command                  | Description                                |
|--------------------------|--------------------------------------------|
| `npm run dev`            | Start Vite development server              |
| `npm run build`          | Build for production                       |
| `npm run preview`        | Preview production build                   |
| `npm run lint`           | Run ESLint                                 |
| `npm run worker:dev`     | Start Cloudflare Worker locally            |
| `npm run worker:deploy`  | Deploy Worker to Cloudflare                |
| `npm run logs`           | View latest 15 access logs (D1)            |
| `npm run secret:logs`    | Set `LOGS_ADMIN_SECRET` secret             |

### Environment Variables

**Frontend** (see `.env.example`):

```env
VITE_API_CHAT_URL=https://your-worker.workers.dev/api/chat
```

**Worker:**

| Variable            | Type   | Description                                      |
|---------------------|--------|--------------------------------------------------|
| `GEMINI_API_KEY`    | Secret | Google AI Studio API key                         |
| `GEMINI_MODEL`      | Var    | Model name (default: `gemini-1.5-flash`)         |
| `LOGS_ADMIN_SECRET` | Secret | Key protecting the access logs endpoint          |

### Deployment

**Cloudflare Pages (Recommended)**

1. Connect the repository to Cloudflare Pages.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set `VITE_API_CHAT_URL` if needed.

**Deploy Worker**

```bash
npx wrangler secret put GEMINI_API_KEY --config worker/wrangler.toml
npx wrangler secret put LOGS_ADMIN_SECRET --config worker/wrangler.toml
npm run worker:deploy
```

### Viewing Access Logs

There are **two ways**:

#### Method 1: Wrangler CLI (recommended during development)

```bash
npm run logs
```

This queries Cloudflare D1 directly (no secret required).

#### Method 2: API endpoint (GET /api/logs)

**Step 1 — Create the `LOGS_ADMIN_SECRET`:**

```bash
# Easiest way (uses the existing script)
npm run secret:logs

# Or call wrangler directly
npx wrangler secret put LOGS_ADMIN_SECRET --config worker/wrangler.toml
```

When you run the command, the terminal will prompt:

```
Enter a secret value:
```

Type (or paste) a strong secret string, for example:

```
VyPortfolioLogs_2026_xK9mP2qR7vN4
```

Press Enter. Wrangler uploads the secret to Cloudflare (it is never stored in git).

> **Security notes:**
> - Never commit the secret to the repository.
> - Prefer a random string ≥ 24 characters.
> - You can generate one quickly with: `openssl rand -base64 32`

**Step 2 — Call the API to view logs:**

```bash
# Replace YOUR_SECRET with the value you just set
# Replace <subdomain> with your actual Worker subdomain

# Option A: pass key via query parameter
curl "https://portfolio-gemini-worker.<subdomain>.workers.dev/api/logs?key=YOUR_SECRET&limit=50"

# Option B: pass key via Authorization header (preferred)
curl -H "Authorization: Bearer YOUR_SECRET" \
  "https://portfolio-gemini-worker.<subdomain>.workers.dev/api/logs?limit=50"
```

**Parameters:**
- `limit` (optional): number of records to return (default 50, max 200)

**Response includes:**
- Latest log entries (IP, country, city, device, path, referrer…)
- Statistics: total visits, unique IPs, top countries, top devices

If the secret is missing or incorrect → returns `401 Unauthorized`.

> Full details are available in [`worker/README.md`](./worker/README.md).

### Customization

Most content (About, Experience, Projects, Skills, Contact…) is managed in:

```
src/data/portfolioData.json
```

### Contact

- Email: [vzz95559@gmail.com](mailto:vzz95559@gmail.com)
- GitHub: [github.com/vztong](https://github.com/vztong)
- LinkedIn: [linkedin.com/in/nha-vy-tong-vztong](https://www.linkedin.com/in/nha-vy-tong-vztong)
- Portfolio: [vytong.pages.dev](https://vytong.pages.dev)
