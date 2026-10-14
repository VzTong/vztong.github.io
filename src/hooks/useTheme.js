/**
 * ============================================================================
 * useTheme — Hook quản lý Dark / Light theme toàn portfolio
 * ============================================================================
 *
 * TÓM TẮT
 * -------
 * - Nguồn sự thật: class `dark` trên <html> (Tailwind darkMode: 'class').
 * - Preference lưu localStorage key `portfolio-theme`.
 * - Mặc định: 'dark' (dark-first, khớp index2.html và index.html hiện tại).
 * - API: { theme, isDark, toggleTheme, setTheme }
 *
 * LUỒNG HOẠT ĐỘNG
 * ----------------
 * 1. Mount → đọc localStorage (hoặc DEFAULT)
 * 2. useEffect → add/remove class `dark` trên document.documentElement
 * 3. User bấm toggle → đổi state → effect chạy lại → DOM + localStorage cập nhật
 *
 * CÁCH DÙNG
 * ---------
 *   import { useTheme } from '../hooks/useTheme'
 *   const { isDark, toggleTheme } = useTheme()
 *
 * LƯU Ý
 * -----
 * - Chỉ gọi trong React function component / custom hook.
 * - localStorage có thể fail (private mode) → try/catch, không crash app.
 * - index.html nên giữ class="dark" sẵn để tránh flash sáng trước hydrate.
 * ============================================================================
 */

import { useEffect, useState, useCallback } from 'react'

/** Key lưu preference trong localStorage */
const STORAGE_KEY = 'portfolio-theme'

/** Theme mặc định khi chưa có preference */
const DEFAULT_THEME = 'dark'

/**
 * Đọc theme ban đầu (an toàn với SSR / private mode).
 * @returns {'dark' | 'light'}
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // ignore — private mode / blocked storage
  }
  return DEFAULT_THEME
}

/**
 * Áp theme lên <html> và ghi localStorage.
 * @param {'dark' | 'light'} theme
 */
function applyThemeToDocument(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // ignore write errors
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)

  // Mỗi lần theme đổi → đồng bộ DOM + storage
  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  /** Set tường minh 'dark' | 'light' */
  const setTheme = useCallback((next) => {
    if (next === 'dark' || next === 'light') {
      setThemeState(next)
    }
  }, [])

  /** Đảo dark ↔ light */
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return {
    /** 'dark' | 'light' */
    theme,
    /** true khi đang dark mode */
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  }
}

export default useTheme