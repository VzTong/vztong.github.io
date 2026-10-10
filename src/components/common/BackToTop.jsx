/**
 * ============================================================
 * BackToTop Component
 * ------------------------------------------------------------
 * Nút cuộn lên đầu trang.
 * Vị trí: fixed, nằm BÊN TRÁI nút Chat (Chat đang ở right-5).
 *
 * - Hiện khi scrollY > 120
 * - Dùng brand-accent → tự đổi màu theo theme (hồng / xanh lá)
 * - z-index thấp hơn chat một chút để không đè chat window
 *
 * Cách dùng: <BackToTop /> trong App hoặc MainLayout
 * ============================================================
 */
import React, { useState, useEffect } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 120)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // check lần đầu
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`
        fixed z-[996]
        bottom-5
        /* Nằm bên trái chat: chat ~ right-5 (20px), nút chat rộng ~140px
           → đặt right khoảng 11rem (176px) */
        right-[11rem]
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