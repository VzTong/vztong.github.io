/**
 * ============================================================================
 * Root Application Component (App.jsx)
 * ============================================================================
 *
 * TÓM TẮT
 * -------
 * Điểm lắp ráp toàn bộ portfolio. Mỗi section là một feature module độc lập,
 * bọc trong MainLayout (header + scroll-snap container).
 *
 * CÁC PHẦN CHÍNH
 * --------------
 * 1. Preloader          — Overlay chờ khi app khởi tạo (tone index2, line animation)
 * 2. HeroSection        — Banner cinematic kiểu SpaceX, CTA “Explore”
 * 3. AboutSection       — Giới thiệu bản thân, narrative backend & số liệu nổi bật
 * 4. SkillsSection      — Ma trận kỹ năng theo nhóm, stack dọc tương tác
 * 5. ExperienceSection  — Kinh nghiệm làm việc, drawer xem chi tiết
 * 6. ProjectBook        — Flipbook 3D giới thiệu dự án
 * 7. ContactSection     — Liên hệ & social links
 * 8. ChatBot            — Trợ lý AI nổi (Cloudflare Worker + Gemini)
 * 9. BackToTop          — Nút cuộn về đầu trang (hiện khi scroll xuống)
 *
 * SIDE EFFECTS
 * ------------
 * - trackVisit(): ghi log lượt truy cập (Cloudflare D1: portfolio_access_history)
 *   chạy 1 lần khi mount, fire-and-forget.
 *
 * THEME
 * -----
 * Theme dark/light do useTheme quản lý (class `dark` trên <html>).
 * Nút toggle nằm trong Header / ThemeToggleButton, không gắn trực tiếp ở App.
 *
 * Z-INDEX GỢI Ý
 * -------------
 * Preloader  100 | Theme toggle  60 | BackToTop  55 | ChatBot  ~50 | Header  40
 * ============================================================================
 */

import React, { useEffect } from 'react'
import MainLayout from './components/layouts/MainLayout'
import HeroSection from './features/hero/HeroSection'
import AboutSection from './features/about/AboutSection'
import SkillsSection from './features/skills/SkillsSection'
import ExperienceSection from './features/experience/ExperienceSection'
import ProjectBook from './features/projects/ProjectBook'
import ContactSection from './features/contact/ContactSection'
import ChatBot from './features/chat/ChatBot'
import Preloader from './components/common/Preloader'
import BackToTop from './components/common/BackToTop'
import { scrollToElement } from './utils/helpers'
import { trackVisit } from './services/tracker'

export default function App() {
  // Fire-and-forget background access tracking on initial page load
  // Ghi log truy cập 1 lần khi load trang (không chặn UI)
  useEffect(() => {
    trackVisit()
  }, [])

  /** CTA Hero → cuộn tới section projects (offset 80px tránh che header) */
  const handleExploreClick = () => {
    scrollToElement('projects', 80)
  }

  return (
    <>
      {/* Overlay chờ khởi tạo — tự ẩn sau ~1.3s */}
      <Preloader />

      <MainLayout>
        {/* ── 00. Hero banner full-viewport ── */}
        <HeroSection onExploreClick={handleExploreClick} />

        {/* ── 01. About ── */}
        <AboutSection />

        {/* ── 02. Skills ── */}
        <SkillsSection />

        {/* ── 03. Experience ── */}
        <ExperienceSection />

        {/* ── 04. Projects flipbook ── */}
        <ProjectBook />

        {/* ── 05. Contact ── */}
        <ContactSection />

        {/* ── 06. Floating AI Assistant ChatBot ── */}
        <ChatBot />

        {/* ── 07. Nút về đầu trang (không đè ChatBot: bottom-24) ── */}
        <BackToTop />
      </MainLayout>
    </>
  )
}