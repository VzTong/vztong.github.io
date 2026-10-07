import React from 'react'
import portfolioData from '../../data/portfolioData.json'
import { getCurrentYear } from '../../utils/helpers'

/**
 * Footer Component
 * 
 * Reusable footer displaying copyright, tech stack attribution, and quick links.
 */
export default function Footer() {
  return (
    <footer className="w-full border-t border-brand-border/60 dark:border-brand-border-dark/60 py-8 text-center text-xs font-mono text-brand-muted dark:text-brand-muted-dark bg-brand-card/40 dark:bg-brand-card-dark/40">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          <span>
            © {getCurrentYear()} {portfolioData.about.name}. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>React 19 + Tailwind CSS</span>
          <span>•</span>
          <span>GSAP + react-pageflip</span>
        </div>
      </div>
    </footer>
  )
}
