/**
 * ============================================================================
 * ThemeToggleButton — Nút đảo Dark / Light
 * ============================================================================
 *
 * TÓM TẮT
 * -------
 * Floating button góc phải trên. Dùng useTheme; không tự giữ state theme.
 * Icon: đang dark → ☀️ (bấm sang light); đang light → 🌙 (bấm sang dark).
 *
 * TÍCH HỢP
 * --------
 * Gắn trong Header.jsx (hoặc MainLayout nếu Header chưa có slot):
 *   import ThemeToggleButton from '../common/ThemeToggleButton'
 *   <ThemeToggleButton />
 *
 * CLASS
 * -----
 * border-slate-*, bg white/slate, text-blue-500 — sau override = tone index2.
 * ============================================================================
 */

import { useTheme } from '../../hooks/useTheme'

export default function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="
        fixed top-6 right-6 z-[60]
        flex h-11 w-11 items-center justify-center
        rounded-full
        border border-slate-200 dark:border-slate-700
        bg-white/90 dark:bg-white/10
        text-blue-500
        backdrop-blur-sm
        transition-transform duration-200
        hover:scale-105
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
      "
    >
      <span className="text-base leading-none" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  )
}