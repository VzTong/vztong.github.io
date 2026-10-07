# DocForge

<p align="center">
  <strong>Document conversion & media processing toolkit</strong><br/>
  <em>Bộ công cụ chuyển đổi tài liệu & xử lý media</em>
</p>

<p align="center">
  <a href="https://forgedoc.onrender.com">
    <img src="https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo"/>
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License MIT"/>
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue 3"/>
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Pinia-State-FFD859?style=flat-square&logo=pinia&logoColor=black" alt="Pinia"/>
  <img src="https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap&logoColor=white" alt="Bootstrap"/>
  <img src="https://img.shields.io/badge/Vue_Router-4-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue Router"/>
  &nbsp;
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/WeasyPrint-PDF-E34F26?style=flat-square&logo=css3&logoColor=white" alt="WeasyPrint"/>
  <img src="https://img.shields.io/badge/Whisper-Transcription-FF6F00?style=flat-square&logo=openai&logoColor=white" alt="Whisper"/>
  <img src="https://img.shields.io/badge/Groq-API-F55036?style=flat-square&logo=groq&logoColor=white" alt="Groq"/>
</p>

---

**DocForge** is a web toolkit for document conversion and media processing, consisting of:

| Part | Directory | Description |
|------|-----------|-------------|
| **Frontend** | `DocForge_FE` | Web UI (Vue 3 + Vite) |
| **Backend** | `DocForge_PyService` | RESTful API (Python FastAPI) |

**DocForge** là bộ công cụ web chuyển đổi tài liệu và xử lý media, gồm:

| Phần | Thư mục | Mô tả |
|------|---------|-------|
| **Frontend** | `DocForge_FE` | Giao diện web (Vue 3 + Vite) |
| **Backend** | `DocForge_PyService` | API RESTful (Python FastAPI) |

🔗 **Demo:** [https://forgedoc.onrender.com](https://forgedoc.onrender.com)

---

## Vision / Tầm nhìn

**DocForge** aims to be a practical, browser-based toolkit that helps people turn everyday content into usable documents and transcripts — without heavy desktop software or complicated setup.

*DocForge hướng tới trở thành bộ công cụ web thực dụng, giúp người dùng chuyển nội dung thường ngày thành tài liệu và transcript dùng được ngay — không cần phần mềm desktop nặng hay cấu hình phức tạp.*

We focus on:

- **Clear conversion flows** — Markdown to polished PDF, PDF to editable Word, audio to editable subtitles.
- **Human-in-the-loop** — especially for transcription: preview, edit, find & replace, then export (SRT / VTT / TXT).
- **Practical growth** — the next steps we want to build are Video → Text and natural AI transcript translation (see roadmap), reusing the same preview/export pipeline.

*Chúng tôi tập trung vào:*

- *Luồng chuyển đổi rõ ràng* — Markdown thành PDF đẹp, PDF thành Word chỉnh sửa được, audio thành phụ đề chỉnh sửa được.
- *Con người vẫn nắm quyền* — đặc biệt với transcript: xem trước, sửa, tìm & thay, rồi mới xuất file.
- *Phát triển thực tế* — hướng tới Video → Text và dịch transcript bằng AI (thoát nghĩa, tự nhiên), tái sử dụng pipeline preview/export hiện có.

This is an active project. Features listed as “coming soon” are intentional next steps documented in the repo plans — not marketing promises.

*Đây là dự án đang phát triển. Các mục “sắp tới” là bước tiếp theo đã ghi trong kế hoạch repo — không phải lời hứa marketing.*

---

## Features / Tính năng hiện có

| Feature / Tính năng | Frontend route | Backend endpoints | Description / Mô tả |
|---------------------|----------------|-------------------|---------------------|
| **Markdown → PDF** | `/convert/md-to-pdf` | `POST /convert/md-to-pdf`<br>`POST /preview/md-to-pdf` | Upload or paste Markdown, choose theme (`document` / `github` / `cv`), preview & download PDF. Supports metadata (title, subtitle, contact...).<br>*Upload/dán Markdown, chọn theme, preview & tải PDF. Hỗ trợ metadata.* |
| **PDF → DOCX** | `/convert/pdf-to-docx` | `POST /convert/pdf-to-docx` | Upload PDF, optional page range, download Word file (via `pdf2docx`).<br>*Upload PDF, tùy chọn khoảng trang, tải file Word.* |
| **Audio → Text (Transcript Editor)** | `/convert/audio-to-text` | `POST /transcribe/preview`<br>`POST /transcribe/export`<br>`POST /transcribe/transcribe/audio-to-file` | Upload audio → view & edit segments → export SRT / VTT / TXT. Supports hint/prompt for better accuracy.<br>*Upload audio → xem & chỉnh sửa segments → xuất SRT/VTT/TXT. Hỗ trợ hint.* |

**Coming soon / Sắp tới** (routes already commented in `DocForge_FE/src/route.js`, plan in `DocForge_PyService/PLAN_video_and_translate.md`):

- Video → Text
- AI transcript translation / Dịch transcript bằng AI

---

## Project structure / Cấu trúc monorepo

```
DocForge/
├── DocForge_FE/                 # Frontend (Vue 3 + Vite)
│   ├── src/
│   │   ├── pages/client/        # Home, Mdtopdf, PdftodocxPage, TranscriptEditorPage
│   │   ├── composables/         # API logic (useMdToPdfConverter, usePdfToDocxConverter...)
│   │   ├── configs/             # API base URL config
│   │   ├── components/
│   │   ├── services/
│   │   ├── route.js
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── README.md
│
├── DocForge_PyService/          # Backend (FastAPI)
│   ├── app/
│   │   ├── main.py              # Entry point
│   │   ├── api/
│   │   │   ├── routes.py        # md-to-pdf, pdf-to-docx
│   │   │   └── transcription_routes.py
│   │   ├── converters/          # Markdown → PDF, PDF → DOCX + templates
│   │   ├── media/transcription/ # faster-whisper / Groq
│   │   └── core/
│   ├── tests/
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── .env.example
│   ├── Dockerfile
│   ├── PLAN_video_and_translate.md
│   ├── Transcript-editor-plan.md
│   └── README.md
│
└── .gitignore
```

---

## Tech stack / Công nghệ sử dụng

### Frontend (`DocForge_FE`)

| Technology | Badge | Role / Vai trò |
|------------|-------|----------------|
| Vue 3 | ![Vue](https://img.shields.io/badge/Vue.js-3-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white) | UI framework (Composition API) |
| Vite 7 | ![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white) | Build tool |
| Vue Router 4 | ![Vue Router](https://img.shields.io/badge/Vue_Router-4-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white) | Routing |
| Pinia | ![Pinia](https://img.shields.io/badge/Pinia-State-FFD859?style=flat-square&logo=pinia&logoColor=black) | State management |
| Bootstrap 5 | ![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap&logoColor=white) | UI framework + Icons |
| VeeValidate | ![VeeValidate](https://img.shields.io/badge/VeeValidate-Form-42B883?style=flat-square) | Form validation |
| GSAP | ![GSAP](https://img.shields.io/badge/GSAP-Animation-88CE02?style=flat-square&logo=greensock&logoColor=white) | Animation |
| Anime.js | ![Anime.js](https://img.shields.io/badge/Anime.js-Animation-FF2D55?style=flat-square) | Lightweight animation |
| Poppins / Rubik | ![Fonts](https://img.shields.io/badge/Fonts-Poppins_·_Rubik-4285F4?style=flat-square&logo=googlefonts&logoColor=white) | Typography |

### Backend (`DocForge_PyService`)

| Technology | Badge | Role / Vai trò |
|------------|-------|----------------|
| FastAPI | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) | Web framework |
| Python 3.10+ | ![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white) | Language |
| Uvicorn | ![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI-499848?style=flat-square&logo=uvicorn&logoColor=white) | ASGI server |
| WeasyPrint | ![WeasyPrint](https://img.shields.io/badge/WeasyPrint-PDF-E34F26?style=flat-square) | Markdown → PDF rendering |
| pdf2docx | ![pdf2docx](https://img.shields.io/badge/pdf2docx-PDF_to_DOCX-2B579A?style=flat-square&logo=microsoftword&logoColor=white) | PDF → DOCX conversion |
| faster-whisper | ![Whisper](https://img.shields.io/badge/faster--whisper-Local-FF6F00?style=flat-square&logo=openai&logoColor=white) | Local transcription |
| Groq API | ![Groq](https://img.shields.io/badge/Groq-API-F55036?style=flat-square) | Cloud transcription (fast) |
| Pydantic | ![Pydantic](https://img.shields.io/badge/Pydantic-Settings-E92063?style=flat-square) | Config & validation |
| Jinja2 | ![Jinja2](https://img.shields.io/badge/Jinja2-Templates-B41717?style=flat-square) | Theme templates (MD→PDF) |

---

## Requirements / Yêu cầu hệ thống

### Common / Chung
- Git
- Node.js **18+** (recommended: 20 LTS)
- Python **3.10+**

### Backend – System dependencies (WeasyPrint)
- **Windows**: Install [GTK3 Runtime](https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases)
- **Linux (Ubuntu/Debian)**:
  ```bash
  sudo apt-get update
  sudo apt-get install -y libpango-1.0-0 libcairo2 libgdk-pixbuf-2.0-0 libffi-dev
  ```
- (Optional) GPU + CUDA for faster local `faster-whisper`
- (Optional) `ffmpeg` (for upcoming Video → Text feature)

---

## Setup & Run / Cài đặt & Chạy local

### 1. Backend (DocForge_PyService)

```bash
cd DocForge_PyService

# Create virtual environment / Tạo virtual environment
python -m venv .venv

# Activate / Kích hoạt
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install dependencies (including dev) / Cài dependencies
pip install -r requirements-dev.txt

# Create .env file / Tạo file .env
cp .env.example .env
# Edit .env (especially GROQ_API_KEY if using groq engine)
# Chỉnh sửa .env (đặc biệt GROQ_API_KEY nếu dùng engine groq)
```

Run the server / Chạy server:

```bash
# Development (auto-reload)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 2. Frontend (DocForge_FE)

```bash
cd DocForge_FE

npm install

# Development server / Chạy development server
npm run dev
```

Default: http://localhost:5173

Frontend calls the backend at `http://localhost:8000` (configured in `src/configs/` or via `VITE_API_BASE_URL`). Backend CORS currently allows `*`.

*Frontend gọi backend tại `http://localhost:8000`. CORS backend hiện cho phép `*`.*

### Build production Frontend

```bash
npm run build      # output → dist/
npm run preview    # preview production build
```

---

## Backend configuration (`.env`) / Cấu hình Backend

| Variable / Biến | Description / Mô tả | Example / Ví dụ |
|-----------------|---------------------|-----------------|
| `DEBUG` | Enable debug mode / Bật debug mode | `true` / `false` |
| `MAX_FILE_SIZE` | Max document file size (bytes) / Giới hạn file document | `20971520` (20MB) |
| `MAX_AUDIO_SIZE` | Max audio file size (bytes) / Giới hạn file audio | `104857600` (100MB) |
| `TRANSCRIBER_ENGINE` | Transcription engine / Engine transcription | `local` or `groq` |
| `GROQ_API_KEY` | Groq API key (required if using `groq`) | `gsk_...` |
| `GROQ_MODEL` | Groq model | `whisper-large-v3` |
| `GROQ_MAX_BYTES` | Max file size sent to Groq | `26214400` |

---

## Main API Endpoints / API Endpoints chính

### Health & Info
```
GET /health
GET /converters
GET /transcribe/health
GET /transcribe/format
```

### Markdown → PDF
```
POST /convert/md-to-pdf          # multipart/form-data (file or content)
POST /preview/md-to-pdf          # application/json → inline PDF
```

Key params: `theme` (`document` | `github` | `cv`), `title`, `subtitle`, `contact`, `page_size`...

### PDF → DOCX
```
POST /convert/pdf-to-docx        # multipart/form-data
```
Params: `file`, `start_page` (0-indexed, optional), `end_page` (exclusive, optional)

### Transcription
```
POST /transcribe/preview                 # upload audio → JSON segments + job_id
POST /transcribe/export                  # edited segments → SRT/VTT/TXT
POST /transcribe/transcribe/audio-to-file  # upload audio → file directly
```

Engine: `faster-whisper` (local) or Groq API. Supports `prompt` (hint) for better accuracy.

Full details in `DocForge_PyService/README.md`.

---

## Docker

### Backend
```bash
cd DocForge_PyService
docker build -t docforge-pyservice .
docker run -p 8000:8000 --env-file .env docforge-pyservice
```

### Frontend
```bash
cd DocForge_FE
docker build -t docforge-fe .
docker run -p 80:80 docforge-fe
```

---

## Run Tests (Backend) / Chạy Test

```bash
cd DocForge_PyService
python -m pytest -v --tb=short

# Specific tests / Test cụ thể
python -m pytest tests/test_api.py::test_render_cv_theme -v -s
python -m pytest tests/test_api.py::test_pdf_to_docx_success -v
```

> Note: Some PDF tests may return `422` if WeasyPrint system libraries are missing. This is expected.
>
> *Lưu ý: Một số test PDF có thể trả `422` nếu máy thiếu system libraries của WeasyPrint.*

---

## Troubleshooting / Xử lý lỗi nhanh

| Error / Lỗi | Cause / Nguyên nhân | Fix / Cách xử lý |
|-------------|---------------------|------------------|
| `WeasyPrint import failed` | Missing GTK/Pango/Cairo | Install system dependencies (see Requirements) |
| `Theme 'xyz' does not exist` | Theme not found | Use `document` / `github` / `cv` |
| `413 File too large` | Exceeds `MAX_FILE_SIZE` / `MAX_AUDIO_SIZE` | Increase value in `.env` or compress file |
| Slow transcription | Using local engine | Set `TRANSCRIBER_ENGINE=groq` + add `GROQ_API_KEY` |
| `Job not found` / Job không tồn tại | `job_id` expired (TTL ~2 hours) | Re-upload audio |

---

## Roadmap / Lộ trình ngắn hạn

What we want to build next — in a way that stays legal, reusable, and consistent with the current architecture:

*Những gì chúng tôi muốn xây tiếp — theo hướng hợp pháp, tái sử dụng được, và thống nhất với kiến trúc hiện tại:*

1. **Video → Text** — upload video or public YouTube link → extract audio → same transcript preview / edit / export flow as audio.
2. **AI transcript translation** — sense-for-sense translation of segments (any language → any language), keep timestamps, let users review before export.

See detailed plans / Xem kế hoạch chi tiết:

- `DocForge_PyService/PLAN_video_and_translate.md`
- `DocForge_PyService/Transcript-editor-plan.md`

---

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

MIT

> Project license (MIT) is currently at `DocForge_PyService/LICENSE`. Recommended: also place a `LICENSE` file at the **repository root** so GitHub detects it correctly.
>
> *License dự án (MIT) hiện tại nằm tại `DocForge_PyService/LICENSE`. Khuyến nghị: đặt thêm file `LICENSE` ở **root** repo để GitHub nhận diện đúng.*
>
> The file under `app/converters/templates/markdown/github/` belongs to the third-party library `github-markdown-css`, not the project itself.
>
> *File `LICENSE` trong `app/converters/templates/markdown/github/` thuộc thư viện bên thứ ba (`github-markdown-css`), không phải của dự án.*
```