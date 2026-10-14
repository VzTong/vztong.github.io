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
        bg-slate-900/80
        text-slate-200
        border border-slate-600/60
        bg-slate-900/80
        text-slate-200
        hover:border-blue-500/50 hover:bg-slate-800/90 hover:text-white
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40
        transition-all duration-200 active:scale-95
      "
    >
      <span className="text-sm leading-none" aria-hidden="true">
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}