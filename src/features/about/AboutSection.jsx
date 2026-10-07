import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import portfolioData from '../../data/portfolioData.json'
import { useGSAPFadeUp } from '../../hooks/useGSAPAnimations'
import { resolveDocumentUrl } from '../../utils/helpers'
import DocumentsModal from '../../components/common/DocumentsModal'

/**
 * AboutSection Component
 * 
 * Fits 100% strictly inside fullscreen viewport (`h-screen` / `100dvh`) with `pt-20 pb-6`
 * to guarantee that the fixed navbar NEVER overlaps or crops any content.
 * Features verified credentials for Master CV and Academic Transcript downloads.
 */
export default function AboutSection() {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false)
  const sectionRef = useGSAPFadeUp({ delay: 0.2, stagger: 0.15 })

  const bio = portfolioData.about.bio?.[currentLang] || portfolioData.about.bio?.vi || ''
  const role = portfolioData.about.role?.[currentLang] || portfolioData.about.role?.vi || ''

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen min-h-[100dvh] md:h-[100dvh] w-full overflow-hidden flex flex-col justify-center items-center pt-20 pb-8 px-4 sm:px-8 md:px-12 max-w-6xl mx-auto select-none"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[200px] sm:h-[300px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center my-auto py-2">
        {/* Left Column: Heading & Role Accent */}
        <div className="md:col-span-4 space-y-3 sm:space-y-4 text-center md:text-left" data-animate>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-950/80 text-blue-300 border border-blue-800/80">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>01 / ABOUT ME</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {t('about.title', 'Giới thiệu về tôi')}
          </h2>

          <p className="text-xs sm:text-sm md:text-base font-mono text-blue-400 font-semibold tracking-wide uppercase">
            {role}
          </p>
        </div>

        {/* Right Column: Bio Narrative & Stats Card */}
        <div className="md:col-span-8 space-y-4 sm:space-y-6" data-animate>
          <div className="p-5 sm:p-7 md:p-8 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-xl">
            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-200 font-sans italic">
              "{bio}"
            </p>

            {/* Responsive 3-Column Stats Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 pt-5 mt-5 sm:pt-6 sm:mt-6 border-t border-slate-800/80 text-center">
              <div className="p-2 sm:p-2.5 lg:p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-col justify-center items-center overflow-hidden">
                <span className="block text-base sm:text-lg md:text-sm lg:text-base xl:text-xl font-black text-blue-400 font-mono tracking-tight whitespace-nowrap">
                  .NET / NestJS
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-1 whitespace-nowrap">
                  Backend Core
                </span>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-col justify-center items-center overflow-hidden">
                <span className="block text-base sm:text-lg md:text-sm lg:text-base xl:text-xl font-black text-blue-400 font-mono tracking-tight whitespace-nowrap">
                  Micro & EDA
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-1 whitespace-nowrap">
                  Architecture
                </span>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-col justify-center items-center overflow-hidden">
                <span className="block text-base sm:text-lg md:text-sm lg:text-base xl:text-xl font-black text-blue-400 font-mono tracking-tight whitespace-nowrap">
                  React & Next
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-1 whitespace-nowrap">
                  Modern Frontend
                </span>
              </div>
            </div>

            {/* Direct Downloads & Verified Credentials Row */}
            <div className="pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  {currentLang === 'vi' ? 'HỒ SƠ & BẢNG ĐIỂM' : 'CREDENTIALS'}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Master CV Action */}
                <button
                  type="button"
                  onClick={() => setIsDocsModalOpen(true)}
                  className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/35 text-blue-300 hover:text-white border border-blue-500/40 hover:border-blue-400 text-[11px] sm:text-xs font-mono font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  title={currentLang === 'vi' ? 'Xem & Tải Master CV' : 'View & Download Master CV'}
                >
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{currentLang === 'vi' ? 'MASTER CV' : 'MASTER CV'}</span>
                </button>

                {/* Academic Transcript Action */}
                <button
                  type="button"
                  onClick={() => setIsDocsModalOpen(true)}
                  className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-300 hover:text-white border border-emerald-500/40 hover:border-emerald-400 text-[11px] sm:text-xs font-mono font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  title={currentLang === 'vi' ? 'Xem & Tải Bảng điểm đại học' : 'View & Download Transcript'}
                >
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{currentLang === 'vi' ? 'BẢNG ĐIỂM' : 'TRANSCRIPT'}</span>
                </button>

                {/* View Details / Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setIsDocsModalOpen(true)}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                  title={currentLang === 'vi' ? 'Xem chi tiết tài liệu & mở khóa' : 'View credentials & unlock'}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Documents Modal ──────────────────────────────────────────────── */}
      <DocumentsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />
    </section>
  )
}
