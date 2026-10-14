/**
 * ============================================================================
 * BackToTop — Nút cuộn về đầu trang / section hero
 * ============================================================================
 *
 * TÓM TẮT
 * -------
 * Hiện khi scrollY > THRESHOLD_PX. Click → ưu tiên #hero (scroll-snap),
 * fallback window.scrollTo(0).
 *
 * VỊ TRÍ
 * ------
 * fixed bottom-24 right-6 — cao hơn ChatBot (thường bottom-6) để không đè.
 * z-[55] dưới theme toggle (60), trên nội dung thường.
 *
 * MÀU
 * ---
 * bg-blue-500 = accent neon sau override config. text-white giữ contrast.
 *
 * TÍCH HỢP
 * --------
 *   // App.jsx trong MainLayout
 *   <ChatBot />
 *   <BackToTop />
 * ============================================================================
 */

import { useEffect, useState, useCallback } from 'react'

/** Ngưỡng scroll (px) để hiện nút */
const THRESHOLD_PX = 400

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > THRESHOLD_PX)
    }
    onScroll() // đúng state nếu refresh giữa trang
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = useCallback(() => {
    const hero = document.getElementById('hero')
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      title="Back to top"
      className={`
        fixed z-[9998]
        bottom-20
        /* Nằm bên trái chat: chat ~ right-5 (20px), nút chat rộng ~140px
           → đặt right khoảng 11rem (176px) => right-[11rem] */
        right
        w-12 h-12 rounded-full
        flex items-center justify-center
        bg-brand-accent dark:bg-brand-accent-dark
        text-white
        shadow-lg dark:shadow-brand-glow-dark shadow-brand-glow
        border border-transparent
        transition-all duration-300
        hover:scale-110 hover:-translate-y-1
        active:scale-95
        ${visible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4 pointer-events-none'}
      `}
    >
      {/* Icon mũi tên lên */}
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  )
}