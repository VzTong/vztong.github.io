/**
 * ============================================================================
 * ThemeToggleButton — Nút đảo Dark / Light
 * ============================================================================
 *
 * TÓM TẮT
 * -------
 * Nút nằm trong Header (cạnh LanguageToggle).
 * Dùng useTheme; không tự giữ state theme.
 * Icon: đang dark → ☀️ (bấm sang light); đang light → 🌙 (bấm sang dark).
 *
 * FIX 2026-10: Bỏ fixed → relative để không lệch khỏi header.
 * Style đồng bộ với LanguageToggle (slate + blue).
 * ============================================================================
 */

import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="
        px-3 py-1.5 rounded-lg text-xs font-mono font-semibold

        bg-white
        text-slate-700
        border border-slate-200
        shadow-sm

        hover:bg-slate-50
        hover:border-main-500/50
        hover:text-main-600

        dark:bg-slate-900/80
        dark:text-slate-200
        dark:border-slate-600/60
        dark:hover:bg-slate-800/90
        dark:hover:hover:border-main-500/50
        dark:hover:text-white

        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-main-500/40

        transition-all duration-200
        active:scale-95
      "
    >
      <span className="text-sm leading-none" aria-hidden="true">
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
