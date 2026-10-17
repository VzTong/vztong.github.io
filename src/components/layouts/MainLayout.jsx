import React from "react";
import Header from "../common/Header";
import { useScrollSnap } from "../../hooks/useScrollSnap";
import DustParticles from "../common/DustParticles";

/**
 * MainLayout Component
 *
 * Provides global layout structure:
 * - Fixed Sticky Header at top
 * - Full-page Scroll Snap container: each child section occupies strictly 100vh
 * - Integrates useScrollSnap hook for smart snapping & locking to each section
 */
export default function MainLayout({ children }) {
  useScrollSnap();

  return (
    <div className="w-full min-h-screen bg-brand-bg text-brand-text dark:bg-brand-bg-dark dark:text-brand-text-dark selection:bg-main-500 selection:text-white transition-colors duration-300">
      {/* Background particles across the entire page */}
      <DustParticles />
      <Header />
      <main className="w-full">{children}</main>
    </div>
  );
}