import React from 'react'
import { useTranslation } from 'react-i18next'
import portfolioData from '../../data/portfolioData.json'
import { useGSAPFadeUp } from '../../hooks/useGSAPAnimations'
import { getCurrentYear } from '../../utils/helpers'

/**
 * ContactSection Component
 * 
 * Strictly 100% fullscreen height (`h-screen` / `100dvh`) with snap-start alignment
 * and seamless integrated bottom footer bar.
 */
export default function ContactSection() {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const sectionRef = useGSAPFadeUp({ delay: 0.2, stagger: 0.15 })

  const email = portfolioData.contact?.email || 'duongdoanthuan@example.com'
  const githubUrl = portfolioData.contact?.github || 'https://github.com/ayana0409'

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen min-h-[100dvh] md:h-[100dvh] w-full overflow-hidden flex flex-col justify-between items-center pt-20 pb-6 px-4 sm:px-8 md:px-12 max-w-5xl mx-auto select-none"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[200px] sm:h-[300px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Main Content Area */}
      <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 my-auto relative z-10 w-full py-2">
        {/* Section Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-950/80 text-blue-300 border border-blue-800/80" data-animate>
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>05 / GET IN TOUCH</span>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2 sm:space-y-3" data-animate>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            {t('contact.title', 'Liên hệ & Hợp tác')}
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 max-w-md mx-auto leading-relaxed font-mono uppercase tracking-wider px-2">
            {currentLang === 'vi'
              ? 'TÔI LUÔN SẴN SÀNG TRAO ĐỔI VỀ CÁC DỰ ÁN BACKEND .NET, KIẾN TRÚC HỆ THỐNG VÀ MICROSERVICES.'
              : 'ALWAYS OPEN TO DISCUSSING C# / .NET BACKEND ARCHITECTURE, SCALABLE MICROSERVICES, OR COLLABORATION.'}
          </p>
        </div>

        {/* Contact Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto pt-2" data-animate>
          {/* Email Card */}
          <a
            href={`mailto:${email}`}
            className="p-4 sm:p-6 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-800 hover:border-blue-500/60 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col items-center gap-2.5 sm:gap-3 group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center w-full px-2">
              <span className="text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-wider block">
                Email
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white font-mono break-all block mt-0.5">
                {email}
              </span>
            </div>
          </a>

          {/* GitHub Card */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="p-4 sm:p-6 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-800 hover:border-blue-500/60 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col items-center gap-2.5 sm:gap-3 group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div className="text-center w-full px-2">
              <span className="text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-wider block">
                GitHub Profile
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white font-mono block mt-0.5">
                @ayana0409
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Integrated Bottom Footer Bar */}
      <div className="w-full border-t border-slate-800/80 pt-3 sm:pt-4 pb-1 sm:pb-0 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs font-mono text-slate-500 z-10 gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>© {getCurrentYear()} {portfolioData.about.name}. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-slate-400">
          <span>React 19</span>
          <span>•</span>
          <span>Tailwind CSS</span>
          <span>•</span>
          <span>GSAP 3D</span>
        </div>
      </div>
    </section>
  )
}
