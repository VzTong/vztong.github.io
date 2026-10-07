# DocForge — Tài liệu Thiết kế & Kiến trúc hiện tại

> Tài liệu này mô tả **thiết kế đang chạy** của hai phần chính:
> - `DocForge_PyService` (Python FastAPI)
> - `DocForge_FE` (Vue 3 + Vite)
>
> Mục tiêu: người đọc sau này (kể cả chính mình) hiểu nhanh hệ thống đang hoạt động thế nào, luồng dữ liệu ra sao, và chỗ nào có thể mở rộng.

---

## 1. Tổng quan hệ thống

```
┌─────────────────────┐         HTTP (REST / multipart)        ┌──────────────────────────┐
│                     │  ──────────────────────────────────►   │                          │
│   DocForge_FE       │                                        │   DocForge_PyService     │
│   (Vue 3 + Vite)    │  ◄──────────────────────────────────   │   (FastAPI)              │
│                     │         File / JSON response           │                          │
└─────────────────────┘                                        └──────────────────────────┘
         │                                                                │
         │ Browser                                                        │
         ▼                                                                ▼
   Người dùng                                              Work dir tạm + (optional) Groq API
```

- **FE**: giao diện, validation, gọi API, hiển thị kết quả, editor transcript.
- **PyService**: toàn bộ logic nặng (convert PDF, transcription, render file).
- Không có authentication / user account ở thời điểm hiện tại.
- Không có database. Mọi job tạm sống trên filesystem với TTL (đặc biệt transcription).

---

## 2. DocForge_PyService — Thiết kế Backend

### 2.1. Vai trò

Service Python cung cấp các API chuyển đổi tài liệu và xử lý media:

| Nhóm chức năng | Endpoint chính | Mô tả |
|----------------|----------------|-------|
| Health / Info | `GET /health`, `GET /converters` | Kiểm tra sống, liệt kê converter |
| Markdown → PDF | `POST /convert/md-to-pdf`<br>`POST /preview/md-to-pdf` | Theme document / github / cv |
| PDF → DOCX | `POST /convert/pdf-to-docx` | Dùng pdf2docx, hỗ trợ range trang |
| Transcription | `POST /transcribe/transcribe/audio-to-file`<br>`POST /transcribe/preview`<br>`POST /transcribe/export` | Audio → segments / file SRT·VTT·TXT |

### 2.2. Cấu trúc thư mục (logic)

```
DocForge_PyService/
├── app/
│   ├── main.py                      # Tạo FastAPI app, CORS, gắn router
│   ├── api/
│   │   ├── routes.py                # md-to-pdf, pdf-to-docx, health, converters
│   │   └── transcription_routes.py  # Toàn bộ /transcribe/*
│   ├── converters/
│   │   ├── base.py                  # BaseConverter + ConversionError
│   │   ├── registry.py              # Đăng ký & lấy converter theo name
│   │   ├── common.py                # PageSize enum...
│   │   ├── markdown/                # Markdown → PDF
│   │   ├── pdf/                     # PDF → DOCX
│   │   └── templates/markdown/      # Jinja2 + CSS theo theme
│   ├── media/
│   │   └── transcription/           # Engine + formatter + service
│   └── core/
│       ├── config.py                # Settings (pydantic-settings)
│       └── exception_handler.py     # Global exception handlers
├── tests/
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
└── .env.example
```

### 2.3. Các pattern quan trọng

#### A. Converter Registry

- Mỗi converter implement `BaseConverter` (có `name`, method `convert` / `convert_from_text`).
- `registry.py` giữ map `name → instance`.
- Route chỉ việc `get_converter("md-to-pdf")` rồi gọi, không hard-code class.

Lợi ích: thêm converter mới (Word→PDF, Image→PDF…) gần như chỉ cần viết class + đăng ký.

#### B. Theme Markdown (Jinja2)

```
templates/markdown/
├── document/   → template.j2 + style.css
├── github/     → template.j2 + github-markdown.css + override.css + LICENSE (third-party)
└── cv/         → template.j2 + style.css
```

- `MarkdownToPdfConverter` render Markdown → HTML (qua theme) → WeasyPrint → PDF.
- Theme `cv` có logic tách header (title, subtitle, contact, address, links) để đưa lên layout riêng.
- Theme `document` / `github` giữ nguyên nội dung header trong body.

#### C. Transcription Pipeline

```
Upload audio
    │
    ▼
Lưu vào work_dir / job_id          ← job_id = uuid.hex
    │
    ▼
Transcriber (local faster-whisper  hoặc  Groq API)
    │
    ▼
segments thô
    │
    ▼
split_long_segments()              ← cắt cue ~42 ký tự / ≤7s
    │
    ▼
Trả JSON (preview)  hoặc  render SRT/VTT/TXT (export / audio-to-file)
```

**Hai chế độ sử dụng:**

1. **Nhanh – không sửa**: `POST /transcribe/transcribe/audio-to-file` → nhận file luôn.
2. **Có editor**:  
   - `POST /transcribe/preview` → nhận `{ job_id, segments }`  
   - User sửa trên FE  
   - `POST /transcribe/export` → gửi segments đã sửa → nhận file.

**Giữ audio theo `job_id`:**
- Lần đầu upload → tạo `job_id`, lưu file.
- Lần sau chỉ gửi `job_id` + `prompt` mới → transcribe lại mà không upload lại.
- Lazy cleanup: mỗi request preview gọi `_cleanup_stale_jobs()` (TTL mặc định 2 giờ).

#### D. Cấu hình (`core/config.py` + `.env`)

Các biến quan trọng:
- `MAX_FILE_SIZE`, `MAX_AUDIO_SIZE`
- `TRANSCRIBER_ENGINE` = `local` | `groq`
- `GROQ_API_KEY`, `GROQ_MODEL`, `GROQ_MAX_BYTES`
- `work_dir` (thư mục tạm)

### 2.4. Luồng xử lý file tạm

Mọi request convert/transcribe đều:
1. Tạo `job_dir = work_dir / uuid.hex`
2. Lưu input vào đó
3. Sinh output trong cùng thư mục (hoặc subfolder)
4. Trả `FileResponse` / JSON
5. (Transcription) giữ lại theo TTL; các convert khác thường sống trong 1 request

Không dùng database, không queue phức tạp → phù hợp quy mô hiện tại.

### 2.5. Exception handling

- `ConversionError`, `TranscriptionError` → map sang HTTP 422.
- File quá lớn → 413.
- Input sai → 400.
- Global handlers đăng ký trong `main.py`.

---

## 3. DocForge_FE — Thiết kế Frontend

### 3.1. Vai trò

SPA Vue 3 giúp người dùng:
- Chọn công cụ (Markdown→PDF, PDF→DOCX, Audio→Text)
- Upload / dán nội dung
- Xem preview / chỉnh sửa (đặc biệt transcript)
- Tải kết quả

### 3.2. Stack

- Vue 3 (Composition API + `<script setup>`)
- Vite
- Vue Router 4
- Pinia (đã gắn, chưa dùng nhiều cho domain state)
- Bootstrap 5 + Bootstrap Icons + Font Awesome
- VeeValidate (tiếng Việt)
- GSAP / Anime.js (animation nhẹ)

### 3.3. Cấu trúc thư mục (logic)

```
DocForge_FE/
├── public/                    # favicon, ảnh tĩnh
├── src/
│   ├── main.js                # bootstrap app, theme, vee-validate, pinia
│   ├── App.vue                # shell: Menu + RouterView + Toast + Loader
│   ├── Menu.vue               # navigation
│   ├── route.js               # định nghĩa routes
│   ├── configs/config.js      # API base URL...
│   ├── services/apiService.js # wrapper gọi HTTP
│   ├── composables/           # logic tái sử dụng theo từng công cụ
│   │   ├── useApi.js
│   │   ├── useMdToPdfConverter.js
│   │   ├── usePdfToDocsConverter.js
│   │   └── useTranscriptEditor.js
│   ├── pages/client/          # 1 page = 1 công cụ (hoặc Home)
│   │   ├── Home.vue
│   │   ├── Mdtopdf.vue
│   │   ├── PdftodocxPage.vue
│   │   └── TranscriptEditorPage.vue
│   ├── components/            # UI nhỏ dùng chung (input, toast, loader...)
│   ├── utils/                 # toast, errorHandler, helpers
│   └── assets/                # css/js theme
└── ...
```

### 3.4. Nguyên tắc tổ chức code

#### Một công cụ = một Page + một Composable

```
Mdtopdf.vue          ←→  useMdToPdfConverter.js
PdftodocxPage.vue    ←→  usePdfToDocsConverter.js
TranscriptEditorPage ←→  useTranscriptEditor.js
```

- **Page**: UI, form, binding.
- **Composable**: gọi API, state loading/error/result, xử lý file download.

Khi thêm công cụ mới (Video→Text, Dịch transcript) chỉ cần lặp lại khuôn này + thêm route.

#### Route hiện tại

| Path | Page | Ghi chú |
|------|------|--------|
| `/` | Home | Giới thiệu + điều hướng |
| `/convert` | redirect → md-to-pdf | Giữ link cũ |
| `/convert/md-to-pdf` | Mdtopdf | |
| `/convert/pdf-to-docx` | PdftodocxPage | |
| `/convert/audio-to-text` | TranscriptEditorPage | Editor segments |

Các route Video / Translate / Word→PDF đang comment sẵn trong `route.js`, chờ implement.

### 3.5. Luồng Transcript Editor (quan trọng nhất)

Đây là luồng phức tạp nhất, bám `Transcript-editor-plan.md`:

```
1. User chọn audio (+ optional hint/prompt)
2. FE gọi POST /transcribe/preview
   → nhận { job_id, segments[] }
3. Hiển thị list segment trong editor
   - Sửa text từng dòng
   - Find & Replace (chỉ đụng field text, giữ start/end)
4. User có thể đổi hint → gọi lại preview với job_id (không upload lại)
5. Bấm Xuất → POST /transcribe/export (gửi segments đã sửa)
   → tải file SRT / VTT / TXT
```

Điểm thiết kế then chốt:
- Transcribe chỉ chạy ở backend.
- Chỉnh sửa thuần FE (không gọi lại model).
- Export chỉ format lại, không cần `job_id`.

### 3.6. Giao tiếp với Backend

- Base URL lấy từ `configs/config.js` (hoặc biến môi trường Vite).
- Gọi qua `services/apiService.js` + các composable.
- CORS backend đang mở `*` (dev). Production nên siết origin.

---

## 4. Luồng dữ liệu tổng hợp theo use-case

### 4.1. Markdown → PDF

```
FE: upload .md hoặc dán text + chọn theme/metadata
        │
        ▼
POST /convert/md-to-pdf  (hoặc /preview/md-to-pdf)
        │
        ▼
PyService: tách header (nếu CV) → render Jinja theme → WeasyPrint
        │
        ▼
Trả file PDF → FE preview / download
```

### 4.2. PDF → DOCX

```
FE: upload PDF (+ optional start_page / end_page)
        │
        ▼
POST /convert/pdf-to-docx
        │
        ▼
PdfToDocxConverter (pdf2docx)
        │
        ▼
Trả .docx
```

### 4.3. Audio → Text (có editor)

Xem mục 3.5.

---

## 5. Những gì CỐ Ý chưa làm (phạm vi hiện tại)

| Hạng mục | Trạng thái | Ghi chú |
|----------|------------|--------|
| Đăng nhập / Đăng xuất / User | Không có | Không nằm trong scope hiện tại |
| Database | Không có | Job tạm trên disk + TTL |
| Queue / Worker nền | Không có | Xử lý request-response đồng bộ |
| Video → Text | Chưa | Nằm trong PLAN |
| Dịch transcript AI (any↔any) | Chưa | Nằm trong PLAN |
| Word → PDF | Chưa | Route comment sẵn |

---

## 6. Hướng mở rộng (tham chiếu PLAN)

Khi làm tiếp, giữ nguyên tinh thần thiết kế hiện tại:

1. **Video → Text**  
   - Backend: thêm bước `video → audio` (ffmpeg) + optional YouTube (yt-dlp, chỉ public).  
   - Tái sử dụng nguyên pipeline preview / export / editor.

2. **Dịch transcript**  
   - Endpoint mới nhận `segments` + `source_language` + `target_language` + style/context.  
   - FE gắn vào Transcript Editor (hoặc page riêng).  
   - Dịch thoát nghĩa, giữ timestamp.

3. **Converter mới**  
   - Viết class mới + đăng ký registry + thêm composable/page tương ứng.

Chi tiết xem:
- `DocForge_PyService/PLAN_video_and_translate.md` (khi đã đưa vào repo)
- `Transcript-editor-plan.md` (root)

---

## 7. Quy ước khi đọc / sửa code sau này

1. **Backend**  
   - Muốn thêm loại convert → nhìn `converters/` + `registry.py`.  
   - Muốn đụng transcription → nhìn `media/transcription/` và `transcription_routes.py`.  
   - Config luôn đi qua `core/config.py`.

2. **Frontend**  
   - Một công cụ mới = 1 page + 1 composable + 1 route.  
   - Không nhét logic API sâu vào component UI.  
   - Toast / error dùng chung `utils/`.

3. **Không commit**  
   - File debug (`debug_output_*.html`), output tạm test.  
   - Backup (`*_backup.vue`, `*_backup.css`, `*_backup.js`) nếu không còn cần.

4. **License**  
   - `templates/markdown/github/LICENSE` là của thư viện `github-markdown-css` (third-party).  
   - Toàn dự án hiện ghi MIT ở README nhưng chưa có file `LICENSE` riêng ở root.

---

## 8. Tóm tắt một câu

> **DocForge** là monorepo gồm Vue FE + FastAPI service, tập trung vào chuyển đổi tài liệu và transcription, thiết kế theo hướng “mỗi công cụ = page + composable / converter”, không auth, không DB, dùng filesystem tạm có TTL, sẵn sàng mở rộng Video→Text và dịch transcript đa ngôn ngữ theo đúng pipeline hiện có.

---

*Tài liệu phản ánh trạng thái repo tại thời điểm viết. Khi kiến trúc đổi lớn, hãy cập nhật lại file này.*
