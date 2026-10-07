import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'
import DocumentsModal from './DocumentsModal'
import portfolioData from '../../data/portfolioData.json'

/**
 * Header Component (Active Scroll-Synced Navbar - Pure Dark Mode)
 * 
 * Features:
 * - Dedicated Dark-Only Aesthetic
 * - Real-time scroll spy: Automatically highlights active section in sync with scroll & snap
 * - Smooth scroll navigation when clicking links
 * - Full Responsive Mobile Navigation with animated Hamburger & Slide-down Drawer
 * - Active pill indicator with subtle cyan/blue neon glow
 * - Backdrop blur effect (`backdrop-blur-md`) with glass styling
 * - Direct access to Master CV and Academic Transcript download modal
 */
export default function Header() {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const [activeSection, setActiveSection] = useState('hero')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false)

  const navLinks = [
    { id: 'about', href: '#about', label: t('nav.about', currentLang === 'vi' ? 'Giới thiệu' : 'About') },
    { id: 'skills', href: '#skills', label: t('ui.navItems.skills', currentLang === 'vi' ? 'Kỹ năng' : 'Skills') },
    { id: 'experience', href: '#experience', label: t('ui.navItems.experience', currentLang === 'vi' ? 'Kinh nghiệm' : 'Experience') },
    { id: 'projects', href: '#projects', label: t('nav.projects', currentLang === 'vi' ? 'Dự án' : 'Projects') },
    { id: 'contact', href: '#contact', label: t('nav.contact', currentLang === 'vi' ? 'Liên hệ' : 'Contact') },
  ]

  // Auto-sync active section on scroll using IntersectionObserver
  useEffect(() => {
    const sectionIds = ['about', 'skills', 'experience', 'projects', 'contact']
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        threshold: 0.25,
        rootMargin: '-60px 0px -20% 0px',
      }
    )

    sections.forEach((sec) => observer.observe(sec))

    const handleScroll = () => {
      if (window.scrollY < 180) {
        setActiveSection('hero')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  // Smooth scroll handler
  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    setActiveSection(targetId)
    setIsMobileMenuOpen(false)

    const targetEl = document.getElementById(targetId)
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setActiveSection('hero')
            setIsMobileMenuOpen(false)
          }}
          className="flex items-center gap-2.5 sm:gap-3 text-white group focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-mono font-bold text-blue-400 text-sm shadow-brand-glow group-hover:scale-105 transition-transform">
            &lt;/&gt;
          </div>
          <span className="font-mono font-black text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white group-hover:text-blue-400 transition-colors truncate max-w-[170px] sm:max-w-none">
            {portfolioData.about.name}
          </span>
        </a>

        {/* Right Side: Desktop Nav + Toggles + Mobile Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-900/60 border border-slate-800/60">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  )}
                  <span>{link.label}</span>
                </a>
              )
            })}
          </nav>

            {/* Quick Access: Master CV & Academic Transcript Button */}
            <button
              type="button"
              onClick={() => setIsDocsModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase font-semibold text-blue-300 bg-blue-950/70 hover:bg-blue-900/80 border border-blue-600/50 hover:border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 cursor-pointer focus:outline-none"
              title={currentLang === 'vi' ? 'Tải Master CV & Bảng điểm' : 'Download Master CV & Transcript'}
            >
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{currentLang === 'vi' ? 'Hồ sơ & CV' : 'CV & Docs'}</span>
            </button>

            {/* Language Toggle (Always accessible) */}
            <div className="flex items-center">
              <LanguageToggle />
            </div>

            {/* Mobile Hamburger Toggle Button (md:hidden) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden w-9 h-9 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center gap-1.5 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer focus:outline-none"
            >
              <span
                className={`w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-current rounded-full transition-opacity duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* ─── Mobile Slide-Down Drawer Navigation ───────────────────────────────── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 py-4 px-4' : 'max-h-0 opacity-0 py-0 px-4'
          }`}
        >
          <nav className="flex flex-col space-y-1.5 max-w-sm mx-auto">
            {navLinks.map((link, idx) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-4 py-3 rounded-xl text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                    <span>{link.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </a>
              )
            })}

            {/* Mobile Master CV & Transcript Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false)
                setIsDocsModalOpen(true)
              }}
              className="w-full mt-2 px-4 py-3 rounded-xl text-xs font-mono tracking-widest uppercase bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/50 flex items-center justify-between cursor-pointer transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{currentLang === 'vi' ? 'TẢI MASTER CV & BẢNG ĐIỂM' : 'DOWNLOAD CV & TRANSCRIPT'}</span>
              </div>
              <span>→</span>
            </button>
          </nav>
        </div>

        {/* ─── Master CV & Transcript Modal Dialog ─────────────────────────────── */}
        <DocumentsModal
          isOpen={isDocsModalOpen}
          onClose={() => setIsDocsModalOpen(false)}
        />
      </header>
    )
  }

