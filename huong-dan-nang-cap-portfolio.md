# Hướng dẫn nâng cấp portfolio `vztong.github.io` (v3 — đã khớp với `js/main.js` thật)

Tài liệu dựa trên cấu trúc thực tế repo `VzTong/vztong.github.io` và **đã đọc trực tiếp file `js/main.js`** bạn gửi. Site dùng template **"Personal"** của BootstrapMade (không phải iPortfolio như đoán ban đầu ở bản v1/v2 — đã sửa lại cho đúng), License gốc: `https://bootstrapmade.com/license/`.

**Cơ chế chuyển section thật sự (đọc từ code):** đây **không phải** một trang cuộn dọc bình thường. Mỗi section (`#header/#about/#resume/#portfolio/#contact`) được ẩn/hiện bằng class `.section-show` trên thẻ `<section>`, và `#header` được toggle class `.header-top`. Khi bấm 1 `.nav-link` trong `#navbar`:
1. `preventDefault()`, gỡ `active` khỏi mọi nav-link, gán `active` cho link vừa bấm.
2. Nếu bấm về `#header`: gỡ `.header-top` khỏi header, gỡ `.section-show` khỏi mọi section, dừng lại.
3. Nếu đây là lần đầu rời `#header`: thêm `.header-top`, đợi 350ms rồi mới đổi `.section-show` sang section mới (khớp animation CSS đóng header).
4. Nếu đã ở "chế độ section" rồi (không phải lần đầu): đổi `.section-show` ngay lập tức, không delay.
5. Cuối cùng luôn gọi `scrollto()` — hàm này chỉ làm `window.scrollTo({top:0, behavior:'smooth'})`, tức là **luôn kéo cửa sổ về đỉnh trang** sau khi đổi section.

Vì scrollTo luôn đưa về top, còn nội dung thật sự dài (Resume, Portfolio...) thì trang **vẫn cuộn dọc bình thường bên trong section đang hiển thị** — nên giải pháp scroll-to-next ở Mục 2 phải phân biệt "đang cuộn đọc nội dung trong section" với "đã cuộn hết, muốn qua section kế" — bản dưới đây đã sửa lại đúng theo điều này (bản v2 trước đó coi mọi lần lăn chuột là next, sẽ **phá** khả năng cuộn đọc nội dung dài — đã fix).

Cũng xác nhận trong `main.js`: nút đổi theme sáng/tối (`.theme-btn` toggle class `light-mode`) và toàn bộ modal chọn ngôn ngữ CV (`printCV/selectLanguage/previewSelectedCV/downloadSelectedCV`) **đã có sẵn** — mục 1 và 3.3 bên dưới đã cập nhật lại để không đề xuất trùng lặp.

Nguyên tắc xuyên suốt: **cộng thêm, không thay thế**. Không đụng logic đang chạy tốt. Site là **static, không có backend** (GitHub Pages) — mọi thứ "lưu trữ" đều là lưu trên trình duyệt của người xem, không phải server của bạn.

---

## 0. Chuẩn bị trước khi sửa

1. `git checkout -b feature/ui-scroll-upgrade` — không sửa thẳng `main`.
2. Backup local trước khi bắt đầu.
3. Xác định "hợp đồng" không được đổi hành vi:
   - ID/section: `#header`, `#about`, `#resume`, `#portfolio`, `#contact`.
   - Các trang `portfolio-detail/*.html` và đường dẫn ảnh trong `pics/`.
   - Scrollspy / active-link trên navbar hiện tại, modal chọn ngôn ngữ CV, nút Download CV.
   - Bộ màu chủ đạo: copy nguyên giá trị hex từ `scss/_variables.scss` (hoặc file biến màu tương đương) sang `scss/_tokens.scss` mới để tái dùng — **không đổi giá trị**.
4. **Kiểm tra lại giấy phép của template gốc** (mục 4 bên dưới) trước khi sửa bất kỳ file CSS/JS lõi nào.

---

## 1. Cải thiện UI/UX mà không phá chức năng hiện có

| Hạng mục | Việc cần làm | Ghi chú an toàn |
|---|---|---|
| Design tokens | `scss/_tokens.scss`: `--color-primary`, `--color-accent`, `--color-bg`, `--radius`, `--shadow` lấy đúng giá trị hex hiện tại | Không đổi giá trị, chỉ đặt tên biến để tái dùng cho chatbot/modal CV/flip-card |
| Micro-interaction | `transition: transform .25s ease, box-shadow .25s ease` cho `.portfolio-item`, nút, avatar khi hover | Thêm trong file mới `css/upgrade-ui.css`, load **sau** `css/style.css` |
| Glass nav | `backdrop-filter: blur(10px)` + nền bán trong suốt cho `#header` ở màn hình rộng | Bọc trong `@supports (backdrop-filter: blur(1px))`, fallback giữ nền đặc như cũ |
| Dark/Light toggle | **Đã có sẵn** (`.theme-btn` toggle class `light-mode` trong `main.js`) — chỉ nên **thêm phần nhớ lựa chọn**: lưu vào `localStorage` (khoá gợi ý: `vztong_theme_pref`, tách biệt với khoá `language` đang dùng cho ngôn ngữ) rồi đọc lại lúc tải trang | Chỉ thêm 4-5 dòng JS trong file riêng, không đụng listener `.theme-btn` cũ |
| Skeleton ảnh | `loading="lazy"` + placeholder màu nền cho ảnh portfolio | Chỉ thêm attribute, không đổi HTML gốc |

Quy tắc: mọi CSS/JS mới nằm **trong file riêng**, include sau file gốc trong `index.html`. Muốn rollback chỉ cần gỡ 1-2 dòng `<link>/<script>`.

---

## 2. Scroll chuột **và** click navbar dùng chung một animation

### Nguyên lý: gọi lại đúng `.nav-link.click()` — KHÔNG chạm vào animation gốc

Vì handler click thật (dòng ~174-227 trong `main.js`) đã tự lo toàn bộ animation (`header-top`, `section-show`, delay 350ms, `scrollto()`), cách chắc ăn nhất là script mới **giả lập đúng cú click đó**, tuyệt đối không viết lại animation.

### Điểm quan trọng đã sửa so với bản trước: không được coi MỌI lần lăn chuột là "next"

Vì nội dung Resume/Portfolio có thể dài hơn 1 màn hình và **vẫn cuộn dọc bình thường** bên trong section đang hiện, script chỉ được phép "next/prev section" khi trang đã cuộn **tới đúng đáy hoặc đỉnh** — còn lại phải để trình duyệt cuộn nội dung như bình thường, nếu không sẽ làm hỏng khả năng đọc Resume/Portfolio dài.

```js
// js/scroll-to-click-bridge.js
// -----------------------------------------------------------------------
// MỤC ĐÍCH: Cho phép cuộn chuột/vuốt để chuyển section, tái dùng NGUYÊN VẸN
// animation trong main.js (dòng xử lý click "#navbar .nav-link") bằng cách
// gọi navLink.click() — không viết lại header-top/section-show/scrollto().
//
// QUAN TRỌNG: chỉ trigger next/prev khi trang đã cuộn tới ĐÁY hoặc ĐỈNH.
// Ở giữa (đang đọc nội dung Resume/Portfolio dài) thì KHÔNG can thiệp,
// để trình duyệt cuộn nội dung như bình thường.
//
// KHÔNG xoá, KHÔNG sửa bất kỳ dòng nào trong js/main.js.
// -----------------------------------------------------------------------

(function () {
  "use strict";

  const NAV_LINK_SELECTOR = '#navbar .nav-link';               // đúng selector handler click thật trong main.js
  const SECTION_ORDER = ['header', 'about', 'resume', 'portfolio', 'contact'];
  const EDGE_PX = 40;      // coi là "đã chạm đáy/đỉnh" khi còn cách mép này (px)
  const COOLDOWN_MS = 800; // chặn spam trong lúc animation (header-top delay 350ms + CSS transition) đang chạy

  let currentIndex = 0;
  let isCoolingDown = false;

  function getNavLink(sectionId) {
    return document.querySelector(`${NAV_LINK_SELECTOR}[href="#${sectionId}"]`);
  }

  // Chạy lại đúng handler gốc trong main.js bằng cách "bấm hộ" — animation y hệt lúc bấm tay
  function goTo(index) {
    if (index < 0 || index >= SECTION_ORDER.length || isCoolingDown) return;
    const link = getNavLink(SECTION_ORDER[index]);
    if (!link) return;
    isCoolingDown = true;
    link.click();
    currentIndex = index;
    setTimeout(() => { isCoolingDown = false; }, COOLDOWN_MS);
  }

  function isAtPageBottom() {
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - EDGE_PX;
  }
  function isAtPageTop() {
    return window.scrollY <= EDGE_PX;
  }

  // Scroll chuột (desktop) — chỉ next/prev khi đã chạm đáy/đỉnh trang
  window.addEventListener('wheel', (e) => {
    if (isCoolingDown) return;
    if (e.deltaY > 0 && isAtPageBottom()) {
      goTo(currentIndex + 1);
    } else if (e.deltaY < 0 && isAtPageTop()) {
      goTo(currentIndex - 1);
    }
    // Nếu chưa chạm mép => không preventDefault, để trình duyệt cuộn nội dung bình thường
  }, { passive: true });

  // Vuốt (mobile) — cùng logic, ngưỡng 50px để tránh nhận nhầm tap
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (isCoolingDown) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 50) return;
    if (diff > 0 && isAtPageBottom()) goTo(currentIndex + 1);
    else if (diff < 0 && isAtPageTop()) goTo(currentIndex - 1);
  }, { passive: true });

  // Đồng bộ currentIndex khi người dùng bấm tay trực tiếp trên navbar (không đổi hành vi click cũ)
  document.querySelectorAll(NAV_LINK_SELECTOR).forEach((link) => {
    link.addEventListener('click', () => {
      const id = (link.getAttribute('href') || '').replace('#', '');
      const idx = SECTION_ORDER.indexOf(id);
      if (idx !== -1) currentIndex = idx;
    });
  });
})();
```

Chèn vào `index.html` **sau** `js/main.js`:
```html
<script src="js/scroll-to-click-bridge.js"></script>
```

`EDGE_PX` và `COOLDOWN_MS` là 2 số nên chỉnh tay sau khi test thật trên site (tuỳ độ dài nội dung Resume/Portfolio và tốc độ animation CSS thật của `.section-show`).

---

## 3. Tham khảo `ayana0409.github.io/portfolio`

### 3.1. AI Chatbot thật — kiến trúc free & hợp pháp

**Không được** để API key trong JS client (ai cũng mở DevTools đọc được → vừa mất bảo mật vừa vi phạm điều khoản của nhà cung cấp AI). Kiến trúc bắt buộc phải có 1 lớp trung gian (proxy) giấu key:

```
Trình duyệt (widget chat, static) → Cloudflare Worker (miễn phí, giấu key) → Anthropic API → trả lời
```

Vì sao Cloudflare Worker: **miễn phí** (gói Free: 100.000 request/ngày), **hợp pháp** (bạn tự tạo API key từ tài khoản Anthropic của chính bạn và dùng đúng Điều khoản dịch vụ — không có gì "lách luật" ở đây), tách biệt hoàn toàn với GitHub Pages nên không ảnh hưởng site tĩnh hiện tại.

Các bước:
1. Tạo tài khoản Cloudflare (free) → tạo 1 Worker mới.
2. Trong Worker Settings → Environment Variables → thêm biến bí mật `ANTHROPIC_API_KEY` (kiểu *Secret*, không hiện lại được sau khi lưu).
3. Code Worker mẫu:

```js
// worker/chat-proxy.js
// -----------------------------------------------------------------------
// MỤC ĐÍCH: Nhận tin nhắn từ widget chat trên vztong.github.io, gọi Anthropic
// API bằng key giấu trong biến môi trường (KHÔNG bao giờ lộ ra trình duyệt),
// trả lời lại cho frontend. Có giới hạn request/phút theo IP để tránh bị
// lạm dụng chi phí API.
// -----------------------------------------------------------------------

const ALLOWED_ORIGIN = 'https://vztong.github.io';
const RATE_LIMIT = 10;              // tối đa 10 request / phút / IP
const rateMap = new Map();          // lưu tạm trong bộ nhớ Worker (reset khi Worker khởi động lại)

function isRateLimited(ip) {
  const now = Date.now();
  const windowStart = now - 60_000;
  const timestamps = (rateMap.get(ip) || []).filter(t => t > windowStart);
  timestamps.push(now);
  rateMap.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const origin = request.headers.get('Origin');
    if (origin !== ALLOWED_ORIGIN) {
      return new Response('Forbidden origin', { status: 403 });
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response('Too many requests, try again later.', { status: 429, headers: corsHeaders() });
    }

    const { message, history } = await request.json();

    const SYSTEM_PROMPT = `Bạn là trợ lý AI trên portfolio của Tong Nha Vy.
Chỉ trả lời dựa trên thông tin: backend .NET/C#, thực tập .NET Backend tại 365 EJSC,
các dự án Booking hotel, Movie watching website, FlappyBird. Trả lời ngắn gọn, thân thiện.`;

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [...(history || []), { role: 'user', content: message }],
      }),
    });

    const data = await anthropicRes.json();
    const reply = data.content?.map(c => c.text || '').join('') || 'Xin lỗi, mình chưa trả lời được lúc này.';

    return new Response(JSON.stringify({ reply }), {
      headers: { 'content-type': 'application/json', ...corsHeaders() },
    });
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
  };
}
```

4. Deploy: `npx wrangler deploy` (Wrangler CLI của Cloudflare, free) → nhận về URL dạng `https://chat-proxy.<username>.workers.dev`.
5. Frontend chỉ gọi URL đó, **không** chứa key:

```js
// js/ai-chat-widget.js — phần gọi API (tóm tắt)
async function askAI(message, history) {
  const res = await fetch('https://chat-proxy.<username>.workers.dev', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json();
  return data.reply;
}
```

> Kiểm tra lại: mở DevTools → tab Network khi chat, đảm bảo request tới `workers.dev` **không** chứa `x-api-key` — key chỉ tồn tại trong Worker, không bao giờ tới trình duyệt.

### 3.2. Widget chat kéo thả

```html
<!-- index.html — thêm cuối <body>, trước các <script> -->
<div id="ai-chat-fab" class="ai-chat-fab" aria-label="Mở trợ lý AI">💬</div>
<div id="ai-chat-panel" class="ai-chat-panel is-hidden">...</div>
```

```js
// js/ai-chat-drag.js
// -----------------------------------------------------------------------
// MỤC ĐÍCH: Cho phép kéo-thả nút chat nổi bằng Pointer Events (không cần
// thư viện ngoài). Vị trí cuối cùng được lưu vào localStorage CỦA TRÌNH
// DUYỆT NGƯỜI DÙNG ĐANG XEM TRANG — đây là lưu trữ phía client, KHÔNG phải
// dữ liệu lưu trên server của bạn (site này không có backend/database).
// Mỗi người xem trang sẽ có vị trí riêng, không ảnh hưởng ai khác.
// -----------------------------------------------------------------------

const STORAGE_KEY = 'vztong_chat_fab_position'; // khoá localStorage riêng cho từng trình duyệt người dùng
const fab = document.getElementById('ai-chat-fab');
let dragging = false, offsetX = 0, offsetY = 0;

function restorePosition() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved) { fab.style.left = saved.left; fab.style.top = saved.top; }
  } catch { /* localStorage có thể bị chặn (chế độ ẩn danh) — bỏ qua an toàn */ }
}

function savePosition() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ left: fab.style.left, top: fab.style.top }));
  } catch { /* không chặn UX nếu lưu thất bại */ }
}

fab.addEventListener('pointerdown', (e) => {
  dragging = true;
  offsetX = e.clientX - fab.offsetLeft;
  offsetY = e.clientY - fab.offsetTop;
  fab.setPointerCapture(e.pointerId);
});
fab.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  fab.style.left = `${e.clientX - offsetX}px`;
  fab.style.top = `${e.clientY - offsetY}px`;
});
fab.addEventListener('pointerup', () => { dragging = false; savePosition(); });

restorePosition();
```

### 3.3. Xem CV và bảng điểm — dựa đúng trên code CV modal đang có

Code thật hiện tại (`printCV()`, `selectLanguage()`, `previewSelectedCV()`, `downloadSelectedCV()`) dùng biến `selectedLanguage` (`'us'`/`'vn'`) để build đường dẫn `CV/${langFolder}/CV_TongNhaVy_Fresher_${langCode}.pdf`. Vì **bảng điểm không có 2 bản ngôn ngữ** như CV, không nên nhét chung vào `selectedLanguage` (sẽ gây rối logic) — thêm 1 nút/khối riêng trong cùng modal `#printOptionsModal`, dùng cặp hàm riêng:

```js
// js/transcript-viewer.js
// -----------------------------------------------------------------------
// MỤC ĐÍCH: Thêm chức năng xem/tải Bảng điểm trong CÙNG modal CV
// (#printOptionsModal) nhưng KHÔNG dùng chung biến selectedLanguage của
// CV (vì bảng điểm chỉ có 1 bản, không phân EN/VI) — tránh đụng logic
// selectLanguage()/updateDownloadButton() đang hoạt động tốt.
// File PDF cần thêm sẵn tại: CV/bang-diem.pdf
// -----------------------------------------------------------------------

const TRANSCRIPT_URL = 'CV/bang-diem.pdf';

function previewTranscript() {
  // Mở trực tiếp bằng <embed> nhúng trong modal; nếu trình duyệt không
  // render được PDF nhúng, chuyển sang Google Docs Viewer làm fallback.
  const viewer = document.getElementById('transcriptEmbed');
  viewer.src = TRANSCRIPT_URL;
  viewer.onerror = () => {
    viewer.outerHTML = `<iframe src="https://docs.google.com/viewer?url=${location.origin}/${TRANSCRIPT_URL}&embedded=true" width="100%" height="600" style="border:none;"></iframe>`;
  };
}

function downloadTranscript() {
  const a = document.createElement('a');
  a.href = TRANSCRIPT_URL;
  a.download = 'BangDiem_TongNhaVy.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
```

```html
<!-- Thêm vào bên trong #printOptionsModal, cạnh khối chọn ngôn ngữ CV hiện có -->
<div class="cv-option-section transcript-section">
  <button class="cv-option-btn" onclick="previewTranscript()">Xem bảng điểm</button>
  <button class="cv-option-btn" onclick="downloadTranscript()">Tải bảng điểm</button>
  <embed id="transcriptEmbed" type="application/pdf" width="100%" height="600" style="display:none;" />
</div>
```

Đây là **Phương án B (mặc định, `<embed>` trực tiếp)** với **Phương án A (Google Docs Viewer) làm fallback tự động** khi `<embed>` lỗi — đúng như bạn muốn "lười quăng CV vào Google Docs Viewer nó cũng ăn" cho trường hợp trình duyệt không hỗ trợ xem PDF nhúng.

Chỉ cần thêm file `CV/bang-diem.pdf` vào thư mục `CV/` hiện có + 1 khối HTML nhỏ trong modal — không đổi cấu trúc `selectedLanguage`/`updateDownloadButton()` đang chạy cho phần CV.

### 3.4. Flip-card / mở chi tiết dự án ở giữa màn hình

1. Card portfolio khi click → mở overlay **ở giữa màn hình** bằng hiệu ứng phóng to từ vị trí card (đo `getBoundingClientRect()` lúc click) — khác cách mở lệch góc của bản tham khảo.
2. Nội dung modal = `fetch()` lại đúng nội dung trong `portfolio-detail/xxx.html` đã có sẵn, trích phần chi tiết ra chèn vào modal — **không viết lại nội dung dự án**.
3. Vẫn giữ link trực tiếp `portfolio-detail/xxx.html` (SEO, chia sẻ link) — modal chỉ là lớp trải nghiệm nhanh.
4. Phần "Work experience" trong Resume: đổi bố cục khác bản tham khảo — ví dụ timeline dọc ở giữa, 2 cột zig-zag trái/phải xen kẽ theo năm — để không trùng bố cục với `ayana0409`.

---

## 4. Quy ước đặt tên file, comment/summary & tôn trọng bản quyền template

### 4.1. Mỗi file mới/được sửa PHẢI có:

- **Tên file rõ nghĩa theo đúng chức năng**, ví dụ:
  - `js/scroll-to-click-bridge.js` (không đặt `js/new.js`, `js/temp.js`)
  - `css/upgrade-ui.css`, `js/ai-chat-widget.js`, `js/ai-chat-drag.js`, `worker/chat-proxy.js`
- **Header comment đầu file** gồm: mục đích file, file nào nó phụ thuộc/không được đụng vào, cách rollback. (Xem mẫu comment `// MỤC ĐÍCH: ...` ở tất cả code mẫu phía trên — áp dụng y hệt cấu trúc đó cho mọi file mới.)
- **Comment theo từng hàm/khối chức năng quan trọng** — giải thích hàm làm gì, nhận vào gì, khi nào được gọi (ví dụ các comment trong `goToIndex()`, `isRateLimited()`, `restorePosition()` ở trên).

### 4.2. Mỗi lần bàn giao (mỗi phản hồi/PR) phải kèm:

- **1 file tổng hợp thay đổi** (ví dụ `CHANGELOG_<ngày>.md` hoặc phần đầu PR description) liệt kê: file nào mới/sửa, mục đích, cách test, cách rollback.
- **Summary đầy đủ** cho từng file trong đó — không chỉ liệt kê tên file mà nói rõ file đó thay đổi/thêm chức năng gì, hoạt động ra sao.

### 4.3. Tôn trọng bản quyền template gốc (đã xác nhận từ header thật của `main.js`)

Header đầu file `js/main.js` ghi rõ:
```
Template Name: Personal
Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
Author: BootstrapMade.com
License: https://bootstrapmade.com/license/
```
Đây là bản **free** của BootstrapMade — theo chính sách license chung của BootstrapMade cho bản miễn phí: được dùng cho cá nhân/thương mại, được sửa đổi, nhưng **không được xoá credit "Designed by BootstrapMade" ở footer**, trừ khi bạn mua gói loại bỏ credit trên trang họ. Việc này bạn nên tự vào đúng link license ở trên đọc lại điều khoản mới nhất trước khi merge, vì chính sách có thể cập nhật.

Áp dụng cụ thể:
1. **Giữ nguyên comment header ở đầu `js/main.js`** (đoạn `Template Name / Template URL / Author / License` vừa trích) và **giữ nguyên dòng credit "Designed by BootstrapMade" ở footer HTML** nếu hiện đang có — không xoá khi bạn thêm code mới.
2. Quy tắc "file riêng, include sau" ở Mục 1 & 2 giúp việc này tự động đúng vì bạn không cần sửa trực tiếp `main.js`/`style.css` gốc.
3. **Ghi rõ trong `README.md`**: base template là "Personal" của BootstrapMade (kèm link ở trên), phần bạn tự viết thêm (scroll bridge, AI chat, transcript viewer, modal center-expand, v.v.) là của riêng bạn — vừa đúng license, vừa là điểm cộng khi nhà tuyển dụng xem code.
4. Các phần **tự viết mới hoàn toàn** (`js/scroll-to-click-bridge.js`, `js/transcript-viewer.js`, `worker/chat-proxy.js`, chat widget) không dính license template — của bạn 100%.

---

## 5. Quy trình bắt buộc cho mỗi lần chỉnh sửa/commit

Mỗi lần hướng dẫn/chỉnh sửa code đều phải kèm:

- **Title (tiếng Anh)** — chuẩn Conventional Commits (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`), ≤ 72 ký tự.
- **Detail (tiếng Việt)** — đổi gì, vì sao, ảnh hưởng gì tới chức năng cũ, cách rollback.

Mẫu:
```
Title: feat: add scroll-to-click bridge for section navigation

Detail:
- Thêm js/scroll-to-click-bridge.js: khi cuộn/vuốt qua ngưỡng, script tự
  "bấm hộ" đúng link navbar tương ứng nên animation y hệt lúc bấm tay,
  không viết lại logic animation cũ.
- Không xoá/sửa bất kỳ listener click nào trong js/main.js.
- Rollback: xoá 1 dòng <script src="js/scroll-to-click-bridge.js"> trong index.html.
```

Mỗi hạng mục lớn ở Mục 1–3 nên là **1 commit/1 PR riêng**, đúng mẫu title/detail này.

---

## 6. Thứ tự triển khai đề xuất

1. Bước 0 (chuẩn bị, kiểm tra license template).
2. Mục 1 (UI/UX + tokens) — nền tảng cho các bước sau.
3. Mục 2 (scroll-to-click bridge) — nếu chưa chắc cơ chế cũ, gửi đoạn code click navbar để mình chỉnh khớp trước khi merge.
4. Mục 3.3 (CV + bảng điểm, phương án B + fallback A) — độc lập, rủi ro thấp.
5. Mục 3.4 (flip/center modal portfolio).
6. Mục 3.1–3.2 (AI chat thật qua Cloudflare Worker + kéo thả) — cần thêm hạ tầng, làm cuối.

## 7. Checklist kiểm thử trước khi merge vào `main`

- [ ] Click nav vẫn nhảy đúng section, animation giống hệt trước khi thêm scroll bridge.
- [ ] Cuộn chuột/vuốt chuyển section ra **cùng animation** như click (không có 2 kiểu hiệu ứng khác nhau).
- [ ] Mobile: vuốt hoạt động, FAB chat không che nội dung quan trọng.
- [ ] Modal CV: Preview/Download EN/VI như cũ + tab Bảng điểm (embed PDF, fallback Google Viewer khi cần).
- [ ] Card portfolio: modal giữa màn hình đúng nội dung; link trực tiếp `portfolio-detail/*.html` vẫn còn nguyên.
- [ ] Chatbot: kéo-thả mượt, vị trí lưu đúng theo từng trình duyệt (test bằng 2 trình duyệt khác nhau → 2 vị trí độc lập); gửi/nhận tin nhắn thật qua Worker; tab Network **không** thấy `x-api-key`.
- [ ] Mọi file mới có header comment + comment hàm quan trọng theo Mục 4.1.
- [ ] `README.md` đã ghi rõ phần nào từ template gốc, phần nào tự viết, đúng yêu cầu giấy phép template.
- [ ] Màu sắc/font/spacing chủ đạo không đổi so với bản hiện tại.
- [ ] Lighthouse/PageSpeed không giảm điểm đáng kể.
