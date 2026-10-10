import React from 'react'
import Header from '../common/Header'
import { useScrollSnap } from '../../hooks/useScrollSnap'

/**
 * MainLayout Component
 * 
 * Provides global layout structure:
 * - Fixed Sticky Header at top
 * - Full-page Scroll Snap container: each child section occupies strictly 100vh
 * - Integrates useScrollSnap hook for smart snapping & locking to each section
 */
export default function MainLayout({ children }) {
  // Activate smart section snapping
  useScrollSnap()

  return (
    <div className="w-full bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* ─── 1. Fixed Sticky Navbar ────────────────────────────────────────── */}
      <Header />

      {/* ─── 2. Main Content Flow ──────────────────────────────────────────── */}
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}
