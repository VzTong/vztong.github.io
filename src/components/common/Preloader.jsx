/**
 * ============================================================================
 * Preloader — Màn hình chờ khi portfolio khởi tạo
 * ============================================================================
 *
 * TÓM TẮT
 * -------
 * Overlay full-screen, nền slate-950 (#040404 sau override), thanh accent
 * blue-500 (#18d26e) chạy dọc — lấy cảm hứng preloader index2.html.
 *
 * TIMING
 * ------
 * SHOW_MS (900)  → giữ overlay
 * FADE_MS (400)  → opacity 0
 * Tổng ~1300ms   → unmount (hide = true)
 *
 * TÍCH HỢP
 * --------
 * Gắn ở App.jsx, ngoài MainLayout, để phủ toàn trang:
 *   <>
 *     <Preloader />
 *     <MainLayout>...</MainLayout>
 *   </>
 *
 * CLASS MÀU
 * ---------
 * Dùng slate-950 / blue-500 / white/10 — không brand-*.
 * Sau khi override tailwind.config, các class này = tone index2.
 *
 * TUỲ CHỈNH
 * ---------
 * - Muốn chờ asset: thay setTimeout bằng window 'load' hoặc Promise font/image.
 * - Đổi thời gian: sửa SHOW_MS / FADE_MS.
 * ============================================================================
 */

import { useEffect, useState } from 'react'

/** Thời gian hiện preloader trước khi fade (ms) */
const SHOW_MS = 900
/** Thời gian fade-out trước khi unmount (ms) */
const FADE_MS = 400

export default function Preloader() {
  // Bắt đầu fade (opacity → 0)
  const [done, setDone] = useState(false)
  // Unmount khỏi DOM
  const [hide, setHide] = useState(false)

  useEffect(() => {
    const tShow = setTimeout(() => setDone(true), SHOW_MS)
    const tHide = setTimeout(() => setHide(true), SHOW_MS + FADE_MS)
    return () => {
      clearTimeout(tShow)
      clearTimeout(tHide)
    }
  }, [])

  if (hide) return null

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-live="polite"
      className={`
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-slate-950
        transition-opacity duration-300 ease-in-out
        ${done ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
    >
      {/* Thanh dọc + line accent chạy (keyframe preloader-line trong tailwind config) */}
      <div className="relative h-24 w-px overflow-hidden bg-white/10">
        <span
          className="
            absolute inset-x-0 top-0 h-full w-full
            bg-main-500
            animate-[preloader-line_0.85s_ease-in-out_infinite]
          "
        />
      </div>
    </div>
  )
}