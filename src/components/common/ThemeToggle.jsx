import React, { useState, useEffect } from 'react'

/**
 * ThemeToggle Component
 * 
 * Toggles dark/light mode by adding/removing the 'dark' class on <html>.
 * Reusable across any header, drawer, or modal.
 */
export default function ThemeToggle({ className = '' }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const handleToggle = () => {
    const nextState = !isDark
    setIsDark(nextState)
    if (nextState) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle Theme"
      className={`p-2 rounded-lg text-xs font-mono
        border border-brand-border dark:border-brand-border-dark
        bg-brand-card/80 dark:bg-brand-card-dark/80
        hover:border-brand-accent dark:hover:border-brand-accent-dark
        text-brand-text dark:text-brand-text-dark
        transition-all duration-200 active:scale-95 shadow-sm ${className}`}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
