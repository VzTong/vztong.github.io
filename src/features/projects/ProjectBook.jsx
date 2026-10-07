import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import InfoTemplate from './ProjectDetails/InfoTemplate'
import GalleryTemplate from './ProjectDetails/GalleryTemplate'
import portfolioData from '../../data/portfolioData.json'
import { resolveProjectImage } from '../../utils/helpers'

/**
 * ProjectBook Component
 * 
 * Fits 100% strictly inside fullscreen viewport (`h-screen` / `100dvh`) with `pt-20 pb-4`
 * to guarantee that the fixed navbar NEVER overlaps or crops any content.
 */
export default function ProjectBook() {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'

  const projects = portfolioData.projects || []
  const totalProjects = projects.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isFlipping, setIsFlipping] = useState(false)

  // Array of page DOM refs
  const pageRefs = useRef([])
  const shadowRefs = useRef([])
  const drawerRef = useRef(null)

  // Keep refs trimmed
  pageRefs.current = pageRefs.current.slice(0, totalProjects)
  shadowRefs.current = shadowRefs.current.slice(0, totalProjects)

  /**
   * Reset all pages to initial state for a target index
   */
  const setPageVisibility = (activeIndex) => {
    pageRefs.current.forEach((el, idx) => {
      if (!el) return
      if (idx === activeIndex) {
        gsap.set(el, {
          visibility: 'visible',
          opacity: 1,
          rotateY: 0,
          x: 0,
          scale: 1,
          y: 0,
          zIndex: 25,
        })
      } else if (idx < activeIndex) {
        gsap.set(el, {
          visibility: 'hidden',
          opacity: 0,
          rotateY: -110,
          x: -40,
          zIndex: 10,
        })
      } else {
        gsap.set(el, {
          visibility: 'hidden',
          opacity: 0,
          rotateY: 0,
          x: 0,
          scale: 0.98,
          y: 10,
          zIndex: 10,
        })
      }
    })
  }

  // Ensure clean initial render state
  useEffect(() => {
    setPageVisibility(currentIndex)
  }, [currentIndex])

  /**
   * Handle Next Page / Book Close Loop
   */
  const handleNextPage = useCallback(() => {
    if (isFlipping || totalProjects <= 1) return

    // ── CASE A: LAST PAGE ➔ CLOSE ALL PAGES SEQUENTIALLY TO PAGE 1 ──────────
    if (currentIndex >= totalProjects - 1) {
      setIsFlipping(true)

      const pagesToFold = []
      for (let i = totalProjects - 2; i >= 0; i--) {
        if (pageRefs.current[i]) {
          pagesToFold.push(pageRefs.current[i])
        }
      }

      if (pagesToFold.length > 0) {
        pagesToFold.forEach((el, idx) => {
          gsap.set(el, {
            visibility: 'visible',
            opacity: 0,
            rotateY: -110,
            x: -40,
            zIndex: 30 + idx,
          })
        })

        gsap.to(pagesToFold, {
          rotateY: 0,
          x: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.12,
          ease: 'power2.out',
          onComplete: () => {
            setCurrentIndex(0)
            setPageVisibility(0)
            setIsFlipping(false)
          },
        })
      } else {
        setCurrentIndex(0)
        setPageVisibility(0)
        setIsFlipping(false)
      }
      return
    }

    // ── CASE B: NORMAL NEXT PAGE FLIP ───────────────────────────────────────
    setIsFlipping(true)
    const nextIdx = currentIndex + 1
    const currentPageEl = pageRefs.current[currentIndex]
    const nextPageEl = pageRefs.current[nextIdx]
    const currentShadowEl = shadowRefs.current[currentIndex]

    // Prepare next page beneath
    if (nextPageEl) {
      gsap.set(nextPageEl, {
        visibility: 'visible',
        opacity: 0,
        scale: 0.98,
        y: 10,
        rotateY: 0,
        x: 0,
        zIndex: 15,
      })
    }

    if (currentPageEl) {
      gsap.set(currentPageEl, { zIndex: 25 })
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIdx)
        setPageVisibility(nextIdx)
        setIsFlipping(false)
      },
    })

    // 1. Current page flips left
    if (currentPageEl) {
      tl.to(currentPageEl, {
        rotateY: -110,
        x: -40,
        opacity: 0,
        transformOrigin: 'left center',
        duration: 0.6,
        ease: 'power2.inOut',
      })
    }

    // 2. Spine shadow effect
    if (currentShadowEl) {
      tl.to(
        currentShadowEl,
        { opacity: 0.8, duration: 0.25, ease: 'power1.in' },
        0
      )
    }

    // 3. Next page fades up cleanly from below
    if (nextPageEl) {
      tl.to(
        nextPageEl,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
        },
        0.1
      )
    }
  }, [currentIndex, isFlipping, totalProjects])

  /**
   * Jump directly to a page
   */
  const handleJumpToPage = useCallback((targetIdx) => {
    if (isFlipping || targetIdx === currentIndex) return
    setIsFlipping(true)

    setPageVisibility(targetIdx)
    setCurrentIndex(targetIdx)
    setIsFlipping(false)
  }, [currentIndex, isFlipping])

  /**
   * Handle Previous Page Flip
   */
  const handlePrevPage = useCallback(() => {
    if (isFlipping || totalProjects <= 1) return

    if (currentIndex <= 0) {
      handleJumpToPage(totalProjects - 1)
      return
    }

    setIsFlipping(true)
    const prevIdx = currentIndex - 1
    const prevPageEl = pageRefs.current[prevIdx]
    const currentPageEl = pageRefs.current[currentIndex]

    if (prevPageEl) {
      gsap.set(prevPageEl, {
        visibility: 'visible',
        opacity: 0,
        rotateY: -110,
        x: -40,
        zIndex: 30,
        transformOrigin: 'left center',
      })
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(prevIdx)
        setPageVisibility(prevIdx)
        setIsFlipping(false)
      },
    })

    if (prevPageEl) {
      tl.to(prevPageEl, {
        rotateY: 0,
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      })
    }

    if (currentPageEl) {
      tl.to(
        currentPageEl,
        {
          scale: 0.98,
          y: 10,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        0
      )
    }
  }, [currentIndex, handleJumpToPage, isFlipping, totalProjects])

  // Open & Close Details Drawer
  const handleOpenDetail = (project) => {
    setSelectedProject(project)
  }

  const handleCloseDetail = () => {
    if (drawerRef.current) {
      gsap.to(drawerRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => setSelectedProject(null),
      })
    } else {
      setSelectedProject(null)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      if (e.key === 'Escape' && selectedProject) {
        handleCloseDetail()
      } else if (!selectedProject) {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          handleNextPage()
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          handlePrevPage()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNextPage, handlePrevPage, selectedProject])

  // Lock body & main container scroll when detail drawer is open
  useEffect(() => {
    const mainEl = document.querySelector('main')
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      if (mainEl) {
        mainEl.style.overflowY = 'hidden'
      }
    } else {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
      if (mainEl) {
        mainEl.style.overflowY = 'scroll'
      }
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
      if (mainEl) {
        mainEl.style.overflowY = 'scroll'
      }
    }
  }, [selectedProject])

  // Touch gesture swipe detection for mobile
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    const diffY = touchStartY.current - e.changedTouches[0].clientY

    // Horizontal swipe threshold > 40px and dominant over vertical scroll
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNextPage()
      } else {
        handlePrevPage()
      }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <section
      id="projects"
      className="relative min-h-screen min-h-[100dvh] md:h-[100dvh] w-full pt-20 pb-6 px-3 sm:px-8 lg:px-12 flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none"
    >
      {/* ─── Ambient Glow in Background ──────────────────────────────────────── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] sm:w-[700px] h-[250px] sm:h-[350px] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* ─── Section Header (SpaceX Minimalist Style - Compact Layout) ───────── */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-widest uppercase bg-slate-900/80 text-blue-400 border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>04 / 3D BOOK</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black uppercase tracking-[0.08em] sm:tracking-[0.12em] text-white">
            {t('nav.projects', 'DỰ ÁN NỔI BẬT')}
          </h2>
        </div>

        {/* Page Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          <span className="text-slate-400 text-[11px] sm:text-xs">
            PAGE <span className="text-white font-bold text-xs sm:text-sm">0{currentIndex + 1}</span> / 0{totalProjects}
          </span>
          <div className="flex gap-1">
            {projects.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleJumpToPage(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex ? 'w-5 sm:w-6 bg-blue-500' : 'w-1.5 sm:w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                aria-label={`Jump to page ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── 3D Book Stage (Fitted Perfectly Inside Viewport) ───────────────────── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 flex-1 min-h-0 max-w-6xl mx-auto w-full flex items-center justify-center my-auto py-1 sm:py-2 [perspective:2200px]"
      >
        {/* Book Outer Frame */}
        <div className="relative w-full h-[calc(100vh-210px)] max-h-[540px] min-h-[370px] sm:min-h-[410px] rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-1.5 sm:p-2 [transform-style:preserve-3d]">
          {/* Left Spine Binding (Realistic Book Hinge) */}
          <div className="absolute inset-y-0 left-0 w-5 sm:w-8 md:w-10 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent border-r border-slate-800/80 rounded-l-2xl z-40 pointer-events-none flex flex-col justify-between items-center py-4 sm:py-6">
            <div className="w-1 h-4 sm:h-6 bg-blue-500/40 rounded-full" />
            <span className="[writing-mode:vertical-rl] rotate-180 text-[7px] sm:text-[8px] font-mono tracking-widest text-slate-500 uppercase">
              PORTFOLIO BINDING
            </span>
            <div className="w-1 h-4 sm:h-6 bg-blue-500/40 rounded-full" />
          </div>

          {/* ─── Solid Opaque Pages (Zero Overlapping / No Bleed) ─────────────── */}
          {projects.map((project, idx) => {
            const isCurrent = idx === currentIndex
            const pageNumber = idx + 1
            const title = project.title?.[currentLang] || project.title?.vi || ''
            const summary = project.summary?.[currentLang] || project.summary?.vi || ''

            return (
              <div
                key={project.id}
                ref={(el) => (pageRefs.current[idx] = el)}
                className={`absolute inset-1.5 sm:inset-2 pl-6 sm:pl-10 md:pl-14 pr-3 sm:pr-6 md:pr-8 py-3.5 sm:py-5
                  rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between
                  [transform-style:preserve-3d] select-none ${isCurrent ? 'pointer-events-auto' : 'pointer-events-none'}`}
                style={{
                  visibility: isCurrent ? 'visible' : 'hidden',
                  opacity: isCurrent ? 1 : 0,
                  zIndex: isCurrent ? 25 : 10,
                  transformOrigin: 'left center',
                }}
              >
                {/* Dynamic Spine Shadow for this page */}
                <div
                  ref={(el) => (shadowRefs.current[idx] = el)}
                  className="absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-black/95 via-black/40 to-transparent pointer-events-none z-30 opacity-0"
                />

                {/* Page Top Header */}
                <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider ${
                        project.type === 'gallery'
                          ? 'bg-purple-950/80 text-purple-300 border border-purple-800/80'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-800/80'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      TYPE: {project.type}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-slate-500">
                      #{project.id}
                    </span>
                  </div>

                  <span className="text-[10px] sm:text-[11px] font-mono text-blue-400 uppercase tracking-widest hidden xs:inline-block">
                    Page 0{pageNumber} of 0{totalProjects}
                  </span>
                </div>

                {/* Page Body (2/3 Info & Description, 1/3 Image Preview) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 my-auto py-1 sm:py-2 items-center w-full">
                  {/* Left Column (2/3): Info, Description, Tech Stack & CTAs */}
                  <div className="md:col-span-8 space-y-2.5 sm:space-y-3.5 text-left pr-0 md:pr-4">
                    <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white leading-snug">
                      {title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans line-clamp-2 sm:line-clamp-3 md:line-clamp-4 whitespace-pre-line">
                      {summary}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="space-y-1 pt-0.5 sm:pt-1">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block font-semibold">
                        TECH STACK:
                      </span>
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {project.technologies?.slice(0, 6).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-mono rounded-md bg-slate-950 border border-slate-800 text-slate-300 hover:border-blue-500/50 hover:text-white transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action CTA Buttons */}
                    <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(project)}
                        className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl
                          bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] sm:text-xs
                          uppercase tracking-wider sm:tracking-[0.18em] shadow-md shadow-blue-600/30 hover:shadow-blue-500/50
                          transition-all duration-300 active:scale-95 cursor-pointer"
                      >
                        <span>{currentLang === 'vi' ? 'KHÁM PHÁ DỰ ÁN' : 'EXPLORE PROJECT'}</span>
                        <svg
                          className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>

                      {project.links?.source && (
                        <a
                          href={project.links.source}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-mono tracking-wider sm:tracking-widest uppercase
                            border border-slate-800 bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                          <span>CODE</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column (1/3): Visual Preview Image Mockup */}
                  <div
                    onClick={() => handleOpenDetail(project)}
                    className="md:col-span-4 relative group cursor-pointer w-full mt-1 sm:mt-0"
                  >
                    <div className="relative aspect-[16/9] sm:aspect-[4/3] md:aspect-[1/1] max-h-[140px] sm:max-h-[200px] md:max-h-[260px] w-full rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 border border-slate-800 group-hover:border-blue-500/60 overflow-hidden shadow-xl group-hover:shadow-[0_0_30px_rgba(59,130,246,0.35)] transition-all duration-300 transform group-hover:scale-[1.02] flex flex-col justify-between p-2.5 sm:p-3.5">
                      {/* Background Image with crisp rendering */}
                      {project.coverImage ? (
                        <div className="absolute inset-0 z-0">
                          <img
                            src={resolveProjectImage(project.coverImage)}
                            alt={title}
                            className="w-full h-full object-cover object-center opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        </div>
                      ) : null}

                      {/* Header Badge */}
                      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300">
                        <span className="px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-blue-400 font-semibold shadow">
                          PREVIEW
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-blue-400 font-semibold shadow flex items-center gap-1">
                          <span>EXPAND</span>
                          <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                        </span>
                      </div>
                      {/* Footer Spec Tag */}
                      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300 border-t border-slate-800/80 pt-1.5 sm:pt-2 bg-slate-950/75 backdrop-blur-md -mx-2.5 -mb-2.5 sm:-mx-3.5 sm:-mb-3.5 px-2.5 sm:px-3.5 pb-2 sm:pb-2.5">
                        <span className="uppercase text-slate-400 font-semibold">
                          {project.type}
                        </span>
                        <span className="text-blue-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          {currentLang === 'vi' ? 'CHI TIẾT →' : 'DETAILS →'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Page Bottom Footer */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500">
                  <span className="truncate max-w-[180px] sm:max-w-none">{t('about.name', 'Dương Đoàn Thuận')} / Backend Portfolio</span>
                  <span>Page {pageNumber} of {totalProjects}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Bottom Navigation Controls (Compact Footer) ────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between pt-2 pb-1 border-t border-slate-800/80">
        <div className="text-[10px] sm:text-[11px] font-mono text-slate-400">
          <span className="hidden sm:inline">
            USE <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-white">←</kbd> / <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-white">→</kbd> OR SWIPE
          </span>
          <span className="sm:hidden text-slate-500">
            👈 SWIPE TO FLIP 👉
          </span>
        </div>

        {/* Page Flip Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={isFlipping}
            aria-label="Previous Page"
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full
              border border-slate-800 bg-slate-900/80 hover:bg-white hover:text-black
              text-white text-[11px] font-mono tracking-wider uppercase transition-all active:scale-95 disabled:opacity-40 cursor-pointer min-h-[34px] sm:min-h-[36px]"
          >
            <span>← PREV</span>
          </button>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={isFlipping}
            aria-label={currentIndex >= totalProjects - 1 ? 'Close book to Page 1' : 'Next Page'}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full
              border border-slate-800 bg-slate-900/80 hover:bg-white hover:text-black
              text-white text-[11px] font-mono tracking-wider uppercase transition-all active:scale-95 disabled:opacity-40 cursor-pointer min-h-[34px] sm:min-h-[36px]"
          >
            <span>
              {currentIndex >= totalProjects - 1 ? 'RESET ↺' : 'NEXT →'}
            </span>
          </button>
        </div>
      </div>

      {/* ─── Project Details Deep-Dive Drawer (Slide-Over View) ───────────────── */}
      {selectedProject && (
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
            {/* Drawer Top Navigation */}
            <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur-md z-20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-slate-400">
                  Project Deep Dive
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

            {/* Drawer Body: Comprehensive Project Details Rendering */}
            <div className="py-4 sm:py-6 space-y-5 sm:space-y-6 flex-1">
              <InfoTemplate project={selectedProject} />
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 sm:pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="hidden sm:inline">Press ESC to exit</span>
              <button
                type="button"
                onClick={handleCloseDetail}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                ← Return to showcase
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
