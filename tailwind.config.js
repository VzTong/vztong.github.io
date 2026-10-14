/**
 * ============================================================================
 * Tailwind CSS Configuration — Portfolio
 * ============================================================================
 *
 * TÓM TẮT
 * -------
 * File cấu hình design token cho toàn app.
 * Mục tiêu lần này: giữ NGUYÊN tên class đang dùng trong JSX (slate / blue),
 * chỉ ĐỔI GIÁ TRỊ màu bên trong để gần tone index2.html:
 *   - Dark: nền #040404, accent xanh neon #18d26e
 *   - Light: nền sáng, muted xám index2; accent light (hồng) xử lý riêng nếu cần
 *
 * CHIẾN LƯỢC MÀU (không đổi tên class)
 * ------------------------------------
 * 1. darkMode: 'class'
 *    - Bật/tắt bằng class `dark` trên <html>
 *    - Hook useTheme đọc/ghi localStorage và gán/gỡ class này
 *
 * 2. Override `colors.slate`
 *    - Dùng cho nền, chữ, viền (bg-slate-*, text-slate-*, border-slate-*)
 *    - 950 ≈ nền dark index2 (#040404)
 *    - 500 ≈ muted text light (#6c7983)
 *
 * 3. Override `colors.blue`
 *    - Dùng làm ACCENT (text-blue-*, bg-blue-*, ring-blue-*)
 *    - 500 ≈ #18d26e (neon green index2 dark)
 *    - 400 ≈ #34d399 (hover sáng hơn)
 *    → Mọi chỗ đang viết blue-400/500/600 tự thành xanh neon, không sửa JSX
 *
 * 4. Keyframes
 *    - fade-in-up: micro-interaction chung
 *    - preloader-line: thanh accent chạy dọc trong Preloader
 *
 * 5. Font
 *    - sans: Inter (UI)
 *    - mono: JetBrains Mono (code / tech label)
 *
 * LƯU Ý
 * -----
 * - Không thêm token `brand-*` để tránh phải rename class khắp repo.
 * - Light mode accent hồng (#F56692) không map sạch vào scale blue dùng chung
 *   dark/light. Nếu cần pink khi light: thêm file CSS override nhỏ
 *   (html:not(.dark) .bg-blue-500 { background: #F56692 }) — tuỳ chọn.
 * - content[] phải cover mọi file dùng class Tailwind, nếu thiếu path
 *   class sẽ bị purge khi build production.
 * ============================================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
  /**
   * darkMode: 'class'
   * -----------------
   * Tailwind chỉ áp utility `dark:` khi <html> (hoặc ancestor) có class `dark`.
   * Không dùng 'media' (theo OS) vì portfolio muốn user tự toggle.
   */
  darkMode: 'class',

  /**
   * content — các file Tailwind sẽ scan để giữ class khi purge
   */
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      /**
       * ----------------------------------------------------------
       * COLOR OVERRIDES (giữ tên slate / blue, đổi giá trị hex)
       * ----------------------------------------------------------
       * Cấu trúc 50 → 950 giữ nguyên để mọi class cũ (slate-200, blue-500…)
       * vẫn hợp lệ; chỉ palette bên trong đổi theo index2.
       */
      colors: {
        /**
         * slate — nền / chữ / viền
         * Dark-first: 950 = #040404 (nền index2 dark)
         * Light: 50–200 gần trắng; 500 = muted #6c7983 (index2 grey)
         */
        slate: {
          50:  '#f8fafc', // nền phụ light, card nhạt
          100: '#f1f5f9',
          200: '#e2e8f0', // border light
          300: '#cbd5e1',
          400: '#94a3b8', // muted dark-mode text phụ
          500: '#6c7983', // muted light (index2 --color-grey-3)
          600: '#454e56', // index2 --color-grey-4
          700: '#2a2e35', // index2 --color-grey-5 tối
          800: '#161718', // index2 --color-grey-6
          900: '#0a0a0a', // gần đen, card dark
          950: '#040404', // nền chính dark (index2 --background dark)
        },

        /**
         * blue — ACCENT (không còn xanh dương mặc định của Tailwind)
         * Map sang xanh neon index2 dark:
         *   --color-text / accent = #18d26e
         *   --color-hover         = #35e888
         *   --color-text-shadow   = #15BB62
         */
        blue: {
          50:  '#ecfdf5', // nền accent rất nhạt (badge light)
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399', // hover sáng / text accent phụ
          500: '#18d26e', // ACCENT CHÍNH (index2 dark)
          600: '#15BB62', // nhấn mạnh / shadow text
          700: '#0f9f52',
          800: '#0b7a3f',
          900: '#065f32',
          950: '#043b1f',
        },
      },

      /**
       * Typography
       * ----------
       * Inter: UI body / heading
       * JetBrains Mono: snippet, label kỹ thuật
       * (Font được load trong index.html qua Google Fonts)
       */
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      /**
       * Keyframes & animation
       * ---------------------
       * fade-in-up: xuất hiện từ dưới (section / card)
       * preloader-line: thanh dọc chạy trong Preloader (giống index2)
       */
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'preloader-line': {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
        // preloader dùng arbitrary: animate-[preloader-line_0.85s_ease-in-out_infinite]
      },

      /**
       * zIndex — lớp xếp chồng (tham chiếu nhanh)
       * Có thể dùng z-overlay, z-tear-* nếu section tear/GSAP cần
       */
      zIndex: {
        'tear-back':   '-1',
        'tear-top':    '20',
        'tear-bottom': '20',
        'overlay':     '50',
      },
    },
  },

  plugins: [],
}