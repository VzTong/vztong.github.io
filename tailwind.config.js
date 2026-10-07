/** @type {import('tailwindcss').Config} */
export default {
  // Strategy: 'class' - toggle dark mode by adding/removing the `dark` class
  // on the <html> element. This enables user-controlled dark mode switching.
  darkMode: 'class',

  // Scan all relevant source files for class names
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // --- Color Palette: "Slate & Blue" ---
      // Defined here so we can reference them as design tokens throughout the app.
      // Tailwind's default slate/blue scale is used; these aliases make intent clear.
      colors: {
        // Light Mode semantic tokens
        'brand-bg':         '#f8fafc', // slate-50  - main background
        'brand-card':       '#ffffff', // white     - card / book page background
        'brand-text':       '#0f172a', // slate-900 - primary text
        'brand-muted':      '#64748b', // slate-500 - secondary / muted text
        'brand-accent':     '#2563eb', // blue-600  - accent / primary brand
        'brand-border':     '#e2e8f0', // slate-200 - borders / dividers

        // Dark Mode semantic tokens (used with `dark:` prefix)
        'brand-bg-dark':    '#020617', // slate-950 - deep dark background
        'brand-card-dark':  '#0f172a', // slate-900 - card / book page background
        'brand-text-dark':  '#e2e8f0', // slate-200 - primary text in dark mode
        'brand-muted-dark': '#94a3b8', // slate-400 - muted text in dark mode
        'brand-accent-dark':'#60a5fa', // blue-400  - lighter accent for dark mode contrast
        'brand-border-dark':'#1e293b', // slate-800 - borders in dark mode
      },

      // --- Typography ---
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      // --- Animation / Keyframes ---
      // Utility animations for micro-interactions (GSAP handles heavy animations)
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
        'fade-in':    'fade-in 0.4s ease-out both',
        'spin-slow':  'spin-slow 8s linear infinite',
      },

      // --- Box Shadow ---
      boxShadow: {
        // Soft glow for card highlights using brand accent color
        'brand-glow': '0 0 24px 4px rgba(37, 99, 235, 0.25)',
        // 3D book page depth shadow for the flipbook
        'page-flip':  '4px 0 12px rgba(0,0,0,0.2), -4px 0 12px rgba(0,0,0,0.1)',
      },

      // --- Z-Index ---
      // Named layers for the GSAP paper tear transition effect (Section 4.2 of spec)
      zIndex: {
        'tear-back':   '-1', // next section underneath current page
        'tear-top':    '20', // top half of current page flying up
        'tear-bottom': '20', // bottom half of current page flying down
        'overlay':     '50', // navbar, modals, drawers
      },
    },
  },

  plugins: [],
}
