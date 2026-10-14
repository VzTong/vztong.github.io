import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * LanguageToggle Component
 *
 * Toggles application language between Vietnamese ('vi') and English ('en')
 * using react-i18next.
 */
export default function LanguageToggle({ className = '' }) {
  const { i18n } = useTranslation()

  const handleToggle = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle Language"
      className={`
        px-3 py-1.5 rounded-lg text-xs font-mono font-semibold
        bg-white text-slate-700 border border-slate-200 shadow-sm
        hover:bg-slate-50 hover:border-main-500/50 hover:text-main-600
        dark:bg-slate-900/80 dark:text-slate-200 dark:border-slate-600/50
        dark:hover:border-main-500/50 dark:hover:bg-slate-800/90 dark:hover:text-white
        focus:outline-none focus-visible:ring-2 focus-visible:ring-main-500/40 focus-visible:border-main-500/60
        transition-all duration-200 active:scale-95
        ${className}
      `}
    >
      🌐 {i18n.language === 'vi' ? 'VI' : 'EN'}
    </button>
  )
}