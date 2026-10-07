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
        border border-brand-border dark:border-brand-border-dark
        bg-brand-card/80 dark:bg-brand-card-dark/80
        hover:border-brand-accent dark:hover:border-brand-accent-dark
        text-brand-text dark:text-brand-text-dark
        transition-all duration-200 active:scale-95 shadow-sm ${className}`}
    >
      🌐 {i18n.language === 'vi' ? 'VI' : 'EN'}
    </button>
  )
}
