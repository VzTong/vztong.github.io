// i18n initialization for react-i18next
// Loads translation strings from portfolioData.json (vi / en)
// The JSON contains bilingual content as { vi: "...", en: "..." } objects.
// We reshape them here into flat i18next-compatible namespaces.

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import data from '../data/portfolioData.json'

// ---------------------------------------------------------------------------
// Helper: extract strings for a given locale from the portfolio data
// This creates a flat key-value map that i18next can consume
// ---------------------------------------------------------------------------
function extractTranslations(locale) {
  return {
    // About section
    'about.title':  data.about.title[locale],
    'about.role':   data.about.role[locale],
    'about.bio':    data.about.bio[locale],
    'about.name':   data.about.name,

    // Contact section
    'contact.title': data.contact.title[locale],

    // Navigation items
    'nav.about':     data.ui.navItems.about[locale],
    'nav.projects':  data.ui.navItems.projects[locale],
    'nav.contact':   data.ui.navItems.contact[locale],
    'nav.documents': data.ui.navItems.documents[locale],

    // Theme toggle
    'theme.light': data.ui.themeToggle.light[locale],
    'theme.dark':  data.ui.themeToggle.dark[locale],

    // Buttons
    'btn.viewProject': data.ui.buttons.viewProject[locale],
    'btn.viewSource':  data.ui.buttons.viewSource[locale],
    'btn.prevPage':    data.ui.buttons.prevPage[locale],
    'btn.nextPage':    data.ui.buttons.nextPage[locale],

    // Projects — dynamically extract all project strings
    ...data.projects.reduce((acc, project) => {
      const key = project.id
      acc[`projects.${key}.title`]       = project.title[locale]
      acc[`projects.${key}.summary`]     = project.summary[locale]
      acc[`projects.${key}.description`] = project.description[locale]

      // Features list — store as JSON string array for useTranslation().t() with returnObjects
      acc[`projects.${key}.features`] = project.features[locale]

      // Gallery captions (only present for type === 'gallery')
      if (project.gallery) {
        project.gallery.forEach((img) => {
          acc[`projects.${key}.gallery.${img.id}.caption`] = img.caption[locale]
        })
      }

      return acc
    }, {}),
  }
}

// ---------------------------------------------------------------------------
// i18next resources: two namespaces — 'translation' (default) and 'portfolio'
// We use the 'portfolio' namespace for content driven from portfolioData.json
// ---------------------------------------------------------------------------
const resources = {
  vi: {
    translation: { lang: 'VI' },
    portfolio: extractTranslations('vi'),
  },
  en: {
    translation: { lang: 'EN' },
    portfolio: extractTranslations('en'),
  },
}

i18n
  .use(LanguageDetector)   // Detect language from browser / localStorage
  .use(initReactI18next)   // Pass i18n instance to react-i18next
  .init({
    resources,

    // Default language and fallback
    lng: 'vi',             // Start in Vietnamese per spec (owner is Vietnamese)
    fallbackLng: 'en',

    // Namespaces
    defaultNS: 'translation',
    ns: ['translation', 'portfolio'],

    // Browser language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'portfolio-lang',
      cacheUserLanguage: true,
    },

    interpolation: {
      escapeValue: false,  // React already handles XSS escaping
    },

    // Allow returnObjects for array translations (e.g. features list)
    returnObjects: true,
  })

export default i18n
