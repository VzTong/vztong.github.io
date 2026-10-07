import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import portfolioData from '../../data/portfolioData.json'
import { resolveDocumentUrl, resolveDocumentDownloadUrl } from '../../utils/helpers'

/**
 * DocumentsModal Component (Streamlined Google Drive Version)
 * 
 * Clean, frictionless modal dialog for previewing and downloading:
 * 1. Master CV (Google Drive link)
 * 2. Academic Transcript (Google Drive link)
 * 
 * Features:
 * - Direct one-click access without any passcodes or captchas
 * - Opens Google Drive viewer or initiates direct download
 * - Teleported to document.body via createPortal
 * - Light-dismiss on backdrop click & ESC key
 */
export default function DocumentsModal({ isOpen, onClose }) {
  const { i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const modalContentRef = useRef(null)

  const docData = portfolioData.documents || {
    title: { vi: 'Hồ sơ & Tài liệu', en: 'Documents & Credentials' },
    subtitle: {
      vi: 'Xem và tải trực tiếp Master CV và Bảng điểm đại học trên Google Drive',
      en: 'Preview and download Master CV and verified academic transcript on Google Drive',
    },
    driveFolderUrl: '',
    items: [],
  }

  // Handle ESC key press and scroll locking
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') return null

  // Light dismiss backdrop click handler
  const handleBackdropClick = (e) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
      onClose()
    }
  }

  const modalTitle = docData.title?.[currentLang] || docData.title?.vi || 'Hồ sơ & Tài liệu'
  const modalSubtitle = docData.subtitle?.[currentLang] || docData.subtitle?.vi || ''

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="documents-modal-title"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col my-auto animate-fade-in-up"
      >
        {/* Top Header Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-7 border-b border-slate-800/80 bg-slate-900/40">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-semibold uppercase bg-blue-950/80 text-blue-300 border border-blue-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>GOOGLE DRIVE CREDENTIALS</span>
            </div>
            <h2
              id="documents-modal-title"
              className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white pt-1"
            >
              {modalTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-xl">
              {modalSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Document Cards for Master CV & Transcript */}
        <div className="p-4 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-slate-950">
          {docData.items?.map((item) => {
            const title = item.title?.[currentLang] || item.title?.vi
            const badge = item.badge?.[currentLang] || item.badge?.vi
            const description = item.description?.[currentLang] || item.description?.vi
            const rawUrl = item.url && !item.url.startsWith('/docs/') ? item.url : docData.driveFolderUrl
            const fileUrl = rawUrl ? resolveDocumentUrl(rawUrl) : ''
            const downloadUrl = rawUrl ? resolveDocumentDownloadUrl(rawUrl) : ''
            const isCv = item.type === 'cv'
            const highlights = Array.isArray(item.highlights)
              ? item.highlights
              : (item.highlights?.[currentLang] || item.highlights?.vi || item.highlights?.en || [])

            return (
              <div
                key={item.id}
                className="relative rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-blue-500/50 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 group hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]"
              >
                {/* Top Badge & Type */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-md uppercase border ${
                      isCv
                        ? 'bg-blue-950/80 text-blue-300 border-blue-800/80'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                    }`}
                  >
                    {badge || (isCv ? 'MASTER CV' : 'TRANSCRIPT')}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <span>Google Drive</span>
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCv
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                          : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {isCv ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                          />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                      {title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pt-1">
                    {description}
                  </p>

                  {/* Highlights list */}
                  {highlights && highlights.length > 0 && (
                    <div className="pt-2 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                        {currentLang === 'vi' ? 'ĐIỂM NỔI BẬT:' : 'HIGHLIGHTS:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {highlights.map((h, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                          >
                            • {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{item.filename || 'PDF Document'}</span>
                    <span>
                      {currentLang === 'vi' ? 'Cập nhật' : 'Updated'}: {item.updatedAt || '2026'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {/* View directly on Google Drive */}
                    <a
                      href={fileUrl || '#'}
                      target={fileUrl ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!fileUrl) {
                          e.preventDefault()
                          alert(currentLang === 'vi' ? 'Vui lòng cập nhật link Google Drive trong src/data/portfolioData.json' : 'Please configure Google Drive link in src/data/portfolioData.json')
                        }
                      }}
                      className="px-3 py-2 sm:py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-semibold tracking-wider uppercase text-center transition-all flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{currentLang === 'vi' ? 'XEM TRỰC TIẾP' : 'VIEW'}</span>
                    </a>

                    {/* Download PDF via Drive */}
                    <a
                      href={downloadUrl || fileUrl || '#'}
                      target={downloadUrl || fileUrl ? '_blank' : '_self'}
                      download={item.filename}
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!downloadUrl && !fileUrl) {
                          e.preventDefault()
                          alert(currentLang === 'vi' ? 'Vui lòng cập nhật link Google Drive trong src/data/portfolioData.json' : 'Please configure Google Drive link in src/data/portfolioData.json')
                        }
                      }}
                      className="px-3 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold tracking-wider uppercase text-center shadow-md shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>{currentLang === 'vi' ? 'TẢI VỀ' : 'DOWNLOAD'}</span>
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Optional Google Drive Shared Folder Link */}
        {docData.driveFolderUrl && (
          <div className="px-5 py-3.5 border-t border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="text-amber-400">📁</span>
              <span>
                {currentLang === 'vi'
                  ? 'Thư mục Google Drive lưu trữ đầy đủ tài liệu & chứng chỉ:'
                  : 'Google Drive Folder containing all documents:'}
              </span>
            </div>
            <a
              href={docData.driveFolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/35 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
            >
              <span>{currentLang === 'vi' ? 'MỞ THƯ MỤC DRIVE' : 'OPEN DRIVE FOLDER'}</span>
              <span>↗</span>
            </a>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Google Drive Direct Link</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            {currentLang === 'vi' ? 'Đóng cửa sổ' : 'Close window'} [ESC]
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
