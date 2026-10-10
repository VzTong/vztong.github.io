import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import portfolioData from '../../data/portfolioData.json'
import { resolveProjectImage } from '../../utils/helpers'

/**
 * ExperienceSection Component (Career & Work Experience Showcase)
 * 
 * Modeled strictly after the 3D Project Book concept:
 * - 2/3 description & role information + 1/3 visual preview card
 * - Expandable Deep-Dive Drawer (taking 2/3 of viewport width)
 * - Isolated scrolling, full dark theme aesthetics, zero overflow (fits 100vh)
 */
export default function ExperienceSection() {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'

  const experiences = portfolioData.experiences || []
  const totalExperiences = experiences.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedExperience, setSelectedExperience] = useState(null)
  const [isFlipping, setIsFlipping] = useState(false)

  const drawerRef = useRef(null)
  const containerRef = useRef(null)

  const currentExp = experiences[currentIndex] || experiences[0]

  // Handlers for next / prev experience pagination
  const handleNext = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setCurrentIndex((prev) => (prev + 1 >= totalExperiences ? 0 : prev + 1))
    setTimeout(() => setIsFlipping(false), 250)
  }

  const handlePrev = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setCurrentIndex((prev) => (prev - 1 < 0 ? totalExperiences - 1 : prev - 1))
    setTimeout(() => setIsFlipping(false), 250)
  }

  // Open & Close Details Drawer
  const handleOpenDetail = (exp) => {
    setSelectedExperience(exp)
  }

  const handleCloseDetail = () => {
    setSelectedExperience(null)
  }

  // Lock external scroll when drawer is open
  useEffect(() => {
    const mainEl = document.querySelector('main')
    if (selectedExperience) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      if (mainEl) mainEl.style.overflowY = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (mainEl) mainEl.style.overflowY = ''
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedExperience) {
        handleCloseDetail()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (mainEl) mainEl.style.overflowY = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedExperience])

  if (!currentExp) return null

  const role = currentExp.role?.[currentLang] || currentExp.role?.vi || ''
  const company = currentExp.company?.[currentLang] || currentExp.company?.vi || ''
  const period = currentExp.period?.[currentLang] || currentExp.period?.vi || ''
  const location = currentExp.location?.[currentLang] || currentExp.location?.vi || ''
  const summary = currentExp.summary?.[currentLang] || currentExp.summary?.vi || ''
  const responsibilities = currentExp.responsibilities?.[currentLang] || currentExp.responsibilities?.vi || []
  const achievements = currentExp.achievements?.[currentLang] || currentExp.achievements?.vi || []
  const coverUrl = resolveProjectImage(currentExp.coverImage)

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative min-h-screen min-h-[100dvh] md:h-[100dvh] w-full overflow-hidden flex flex-col justify-between items-center pt-20 pb-6 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto select-none"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[250px] sm:h-[350px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* ─── Section Header ─────────────────────────────────────────────────── */}
      <div className="text-center space-y-1 mb-2 relative z-10 w-full">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono tracking-widest uppercase bg-slate-900/80 text-blue-400 border border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>03 / CAREER & WORK EXPERIENCE</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.08em] sm:tracking-[0.12em] text-white">
          {currentLang === 'vi' ? 'KINH NGHIỆM LÀM VIỆC' : 'WORK EXPERIENCE'}
        </h2>

        <p className="text-[10px] sm:text-xs font-mono tracking-wider uppercase text-slate-400 max-w-lg mx-auto leading-relaxed px-2">
          {currentLang === 'vi'
            ? 'HÀNH TRÌNH PHÁT TRIỂN NĂNG LỰC KỸ THUẬT VÀ ĐÓNG GÓP THỰC TẾ TRONG DOANH NGHIỆP'
            : 'PROFESSIONAL ENGINEERING JOURNEY & MEASURABLE BUSINESS IMPACT'}
        </p>
      </div>

      {/* ─── Interactive Career Showcase Book Card ───────────────────────────── */}
      <div className="w-full relative z-10 my-auto py-1">
        <div className="relative w-full rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-4 sm:p-7 md:p-8 flex flex-col justify-between">
          {/* Header Metadata */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3.5 sm:mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-mono font-semibold uppercase bg-blue-950/80 text-blue-300 border border-blue-800/80">
                {currentExp.type?.toUpperCase()}
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-slate-400">
                {period}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-mono text-slate-400">
                {location}
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-slate-500">
                ({currentIndex + 1}/{totalExperiences})
              </span>
            </div>
          </div>

          {/* Main 2-Column Grid (2/3 Info + 1/3 Visual Preview) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
            {/* Left Column (2/3): Role, Company, Summary, Tech Stack & CTA */}
            <div className="md:col-span-8 space-y-3 sm:space-y-3.5 text-left">
              <div>
                <span className="text-[11px] sm:text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase block">
                  {company}
                </span>
                <h3 className="text-lg sm:text-2xl font-black uppercase text-white tracking-tight leading-snug">
                  {role}
                </h3>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans line-clamp-2 sm:line-clamp-3">
                {summary}
              </p>

              {/* Technologies */}
              <div className="space-y-1.5 pt-0.5 sm:pt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
                  CORE TECHNOLOGIES:
                </span>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {currentExp.technologies?.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                  {currentExp.technologies?.length > 6 && (
                    <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 sm:py-1 rounded-md bg-slate-950 text-blue-400 border border-blue-900/50">
                      +{currentExp.technologies.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 sm:pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenDetail(currentExp)}
                  className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold tracking-wider uppercase shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{currentLang === 'vi' ? 'XEM CHI TIẾT' : 'VIEW FULL'}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right Column (1/3): Visual Card / Timeline Graphic */}
            <div
              onClick={() => handleOpenDetail(currentExp)}
              className="md:col-span-4 relative group cursor-pointer w-full mt-2 md:mt-0"
            >
              <div className="relative aspect-[16/9] sm:aspect-[4/3] max-h-[180px] sm:max-h-[240px] w-full rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 border border-slate-800 group-hover:border-blue-500/60 overflow-hidden shadow-xl group-hover:shadow-[0_0_30px_rgba(59,130,246,0.35)] transition-all duration-300 transform group-hover:scale-[1.02] flex flex-col justify-between p-3.5 sm:p-4">
                {coverUrl && (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={coverUrl}
                      alt={role}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-65 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  </div>
                )}

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300">
                  <span className="px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-blue-400 font-semibold shadow">
                    CAREER
                  </span>
                  <span className="text-blue-400 font-semibold flex items-center gap-1">
                    <span>EXPAND</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
                  </span>
                </div>

                {/* Bottom Tag */}
                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 bg-slate-950/75 backdrop-blur-md -mx-3.5 -mb-3.5 sm:-mx-4 sm:-mb-4 px-3.5 sm:px-4 pb-2.5">
                  <span className="uppercase text-slate-400 truncate max-w-[120px]">{period}</span>
                  <span className="text-blue-400 font-bold flex-shrink-0">CHI TIẾT →</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalExperiences > 1 && (
          <div className="flex items-center justify-center gap-3 mt-3">
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 rounded-full border border-slate-800 bg-slate-900/80 hover:bg-white hover:text-black text-white text-xs font-mono tracking-wider uppercase transition-all cursor-pointer min-h-[38px] flex items-center"
            >
              ← {t('ui.buttons.prevPage', 'PREV')}
            </button>
            <span className="text-xs font-mono text-slate-400">
              {currentIndex + 1} / {totalExperiences}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-full border border-slate-800 bg-slate-900/80 hover:bg-white hover:text-black text-white text-xs font-mono tracking-wider uppercase transition-all cursor-pointer min-h-[38px] flex items-center"
            >
              {t('ui.buttons.nextPage', 'NEXT')} →
            </button>
          </div>
        )}
      </div>

      {/* ─── Experience Details Deep-Dive Drawer (2/3 screen width on desktop, 100% on mobile) ─── */}
      {selectedExperience && (
        <div
          onClick={handleCloseDetail}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-end animate-fade-in"
        >
          <div
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative w-full md:w-2/3 lg:w-2/3 h-full bg-slate-950 border-l border-slate-800 shadow-2xl overflow-y-auto overscroll-contain flex flex-col justify-between p-4 sm:p-8 md:p-10 custom-scrollbar animate-fade-in-up"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur-md z-20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-slate-400">
                  Career Deep Dive
                </span>
              </div>

              <button
                type="button"
                onClick={handleCloseDetail}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-mono transition-all cursor-pointer"
              >
                <span>✕</span>
                <span>{currentLang === 'vi' ? 'ĐÓNG' : 'CLOSE'}</span>
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="py-4 sm:py-6 space-y-5 sm:space-y-6 flex-1 text-slate-100">
              {/* Type, Period & Role */}
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-mono font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    TYPE: {selectedExperience.type?.toUpperCase()}
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono text-slate-400">
                    {selectedExperience.period?.[currentLang] || selectedExperience.period?.vi} | {selectedExperience.location?.[currentLang] || selectedExperience.location?.vi}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-snug pt-1">
                  {selectedExperience.role?.[currentLang] || selectedExperience.role?.vi}
                </h2>
                <p className="text-xs sm:text-sm font-mono text-blue-400 font-semibold">
                  {selectedExperience.company?.[currentLang] || selectedExperience.company?.vi}
                </p>
              </div>

              {/* Summary Callout */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 shadow-inner">
                <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed italic">
                  "{selectedExperience.summary?.[currentLang] || selectedExperience.summary?.vi}"
                </p>
              </div>

              {/* Technologies */}
              {selectedExperience.technologies && (
                <div className="space-y-2 pt-1">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                    {currentLang === 'vi' ? 'Công nghệ áp dụng' : 'Technologies Used'}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedExperience.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2.5 sm:px-3 py-1 rounded-md bg-slate-900 text-slate-200 border border-slate-700 hover:border-blue-500/50 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <div className="space-y-2 sm:space-y-2.5 pt-2">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{currentLang === 'vi' ? 'Trách nhiệm & Nhiệm vụ cốt lõi' : 'Key Responsibilities'}</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                        <span className="leading-relaxed font-sans">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Achievements */}
              {achievements.length > 0 && (
                <div className="space-y-2 sm:space-y-2.5 pt-2">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{currentLang === 'vi' ? 'Thành tựu & Đóng góp nổi bật' : 'Key Achievements & Impact'}</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {achievements.map((ach, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        <span className="leading-relaxed font-sans">{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 sm:pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="hidden sm:inline">Press ESC to exit</span>
              <button
                type="button"
                onClick={handleCloseDetail}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                ← Return to timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom Footer Bar ──────────────────────────────────────────────── */}
      <div className="relative z-10 w-full pt-2 pb-1 border-t border-slate-800/60 flex flex-col xs:flex-row items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 gap-1 text-center">
        <span>CAREER TRACK: BACKEND DEVELOPER</span>
        <span>EXPERIENCE SHOWCASE</span>
      </div>
    </section>
  )
}
