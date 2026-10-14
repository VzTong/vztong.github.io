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
      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold
        border border-slate-700 dark:border-slate-700
        bg-slate-900/80 dark:bg-slate-900/80
        hover:border-blue-500/60 hover:bg-slate-800/90
        text-slate-200 dark:text-slate-200
        transition-all duration-200 active:scale-95 shadow-sm ${className}`}
    >
      🌐 {i18n.language === 'vi' ? 'VI' : 'EN'}
    </button>
  )
}
