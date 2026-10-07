import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { resolveProjectImage } from '../../../utils/helpers'

/**
 * GalleryTemplate Component
 * 
 * Template for projects with `type: "gallery"`.
 * Focuses on visual presentation, photo gallery preview with captions,
 * lightbox modal support, responsive image grid, and UI architecture.
 *
 * @param {Object} props.project - The project data object from portfolioData.json
 */
export default function GalleryTemplate({ project }) {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const [activeImage, setActiveImage] = useState(null)

  // Retrieve bilingual text
  const title = project.title?.[currentLang] || project.title?.vi || ''
  const summary = project.summary?.[currentLang] || project.summary?.vi || ''
  const description = project.description?.[currentLang] || project.description?.vi || ''
  const gallery = project.gallery || []

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in text-slate-100 pb-4">
      {/* ─── Header: Type badge & Title ──────────────────────────────────────── */}
      <div className="space-y-2 border-b border-slate-800 pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-mono font-semibold uppercase bg-purple-950/80 text-purple-300 border border-purple-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            TYPE: {project.type?.toUpperCase()}
          </span>
          <span className="text-[11px] sm:text-xs font-mono text-slate-500">
            ID: #{project.id}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-snug pt-1">
          {title}
        </h2>
      </div>

      {/* ─── Summary Callout ─────────────────────────────────────────────────── */}
      {summary && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-purple-950/30 border border-purple-900/50 shadow-inner">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic whitespace-pre-line">
            "{summary}"
          </p>
        </div>
      )}

      {/* ─── Photo Gallery Showcase Grid ─────────────────────────────────────── */}
      {gallery && gallery.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-mono font-bold tracking-wider text-purple-400 uppercase flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{currentLang === 'vi' ? 'Bộ sưu tập ảnh' : 'Photo Gallery'}</span>
            </h3>
            <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">
              {gallery.length} PHOTOS
            </span>
          </div>

          {/* Responsive Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {gallery.map((img, idx) => {
              const caption = img.caption?.[currentLang] || img.caption?.vi || ''
              const resolvedSrc = resolveProjectImage(img.src)
              return (
                <div
                  key={img.id || idx}
                  onClick={() => setActiveImage({ ...img, caption, resolvedSrc })}
                  className="group relative cursor-pointer overflow-hidden rounded-xl
                    border border-slate-800 bg-slate-900 aspect-video
                    hover:border-purple-500/60 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                >
                  {resolvedSrc ? (
                    <img
                      src={resolvedSrc}
                      alt={caption || `Gallery ${idx + 1}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent p-2.5 sm:p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[10px] font-mono text-purple-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800">
                        #{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300 opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <span>ZOOM</span>
                        <span>🔍</span>
                      </span>
                    </div>
                    {caption && (
                      <p className="text-xs font-medium text-slate-200 line-clamp-2 leading-tight bg-slate-950/85 p-2 rounded backdrop-blur-sm border border-slate-800/80 shadow">
                        {caption}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Description / Highlights ────────────────────────────────────────── */}
      {description && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-mono font-bold tracking-wider text-purple-400 uppercase flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span>{currentLang === 'vi' ? 'Lưu trữ & Tối ưu' : 'Storage & Optimization'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
            {description}
          </p>
        </div>
      )}

      {/* ─── Tech Stack ───────────────────────────────────────────────────────── */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
            {currentLang === 'vi' ? 'Công nghệ' : 'Tech Stack'}
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md
                  bg-slate-900 text-slate-200
                  border border-slate-700 hover:border-purple-500/50 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── Action Links ─────────────────────────────────────────────────────── */}
      <div className="pt-4 sm:pt-5 flex flex-wrap items-center gap-2 sm:gap-3 border-t border-slate-800">
        {project.links?.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-semibold
              bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{t('ui.buttons.viewProject', 'Live Gallery Demo')}</span>
          </a>
        )}

        {project.links?.source && (
          <a
            href={project.links.source}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-semibold
              border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>{t('ui.buttons.viewSource', 'GitHub Source')}</span>
          </a>
        )}
      </div>

      {/* ─── Lightbox Modal Preview ─────────────────────────────────────────── */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-white space-y-3 sm:space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-purple-400">Photo Details</span>
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="text-slate-400 hover:text-white px-2 py-1 text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-700">
              {activeImage.resolvedSrc ? (
                <img
                  src={activeImage.resolvedSrc}
                  alt={activeImage.caption || 'Preview'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-mono text-sm text-purple-300">
                  [ Preview: {activeImage.id} ]
                </span>
              )}
            </div>
            {activeImage.caption && (
              <p className="text-xs sm:text-sm text-slate-300 italic">
                "{activeImage.caption}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
