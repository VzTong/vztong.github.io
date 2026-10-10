import { useEffect } from 'react'

/**
 * useScrollSnap Hook (Magnetic Auto-Fix & Section Snapping Engine)
 * 
 * Features:
 * - Magnetic Auto-Fix: Automatically pulls and locks (snaps) to the nearest section
 *   when scrolling slows down or stops nearby, preventing floating in-between states.
 * - Native 120fps CSS Scroll Snap synchronization.
 * - Respects detail drawer modal state (unlocks full natural inner scrolling when open).
 * - Smooth keyboard navigation (Arrow Up/Down, Page Up/Down, Spacebar).
 */
export function useScrollSnap() {
  useEffect(() => {
    let scrollTimeout = null
    let isSnapping = false

    const getSections = () => Array.from(document.querySelectorAll('section'))

    // Get current section index based on scroll position
    const getCurrentSectionIndex = () => {
      const sections = getSections()
      if (!sections.length) return 0

      const scrollY = window.scrollY || document.documentElement.scrollTop
      let activeIdx = 0
      let minDiff = Infinity

      sections.forEach((sec, idx) => {
        const top = sec.offsetTop
        const diff = Math.abs(top - scrollY)
        if (diff < minDiff) {
          minDiff = diff
          activeIdx = idx
        }
      })

      return activeIdx
    }

    // Smoothly scroll to target section index
    const scrollToSection = (targetIndex) => {
      const sections = getSections()
      if (!sections.length || targetIndex < 0 || targetIndex >= sections.length) {
        return
      }

      const targetEl = sections[targetIndex]
      if (targetEl) {
        isSnapping = true
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
        setTimeout(() => {
          isSnapping = false
        }, 400)
      }
    }

    // ── 1. MAGNETIC AUTO-FIX TO NEAREST SECTION ─────────────────────────────
    // When the user stops scrolling or lands near a section, automatically
    // magnetic-snap strictly to that section top (desktop only).
    const handleScroll = () => {
      // If modal drawer is open or already snapping, let scroll flow naturally
      if (document.body.style.overflow === 'hidden' || isSnapping) return

      // Disable magnetic snapping on mobile / small screens to allow smooth touch scrolling
      if (window.innerWidth < 768 || window.innerHeight < 680) return

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const sections = getSections()
        if (!sections.length) return

        const scrollY = window.scrollY || document.documentElement.scrollTop
        let closestSection = null
        let minDiff = Infinity

        sections.forEach((sec) => {
          const top = sec.offsetTop
          const diff = Math.abs(top - scrollY)
          if (diff < minDiff) {
            minDiff = diff
            closestSection = sec
          }
        })

        // If the page is slightly off (between 4px and 50% of viewport height), magnetic-snap into place!
        if (closestSection && minDiff > 4 && minDiff < window.innerHeight * 0.5) {
          isSnapping = true
          closestSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
          setTimeout(() => {
            isSnapping = false
          }, 350)
        }
      }, 120)
    }

    // ── 2. KEYBOARD NAVIGATION ───────────────────────────────────────────────
    const handleKeyDown = (e) => {
      if (document.body.style.overflow === 'hidden') return
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      const currentIndex = getCurrentSectionIndex()

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault()
        scrollToSection(currentIndex + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault()
        scrollToSection(currentIndex - 1)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(scrollTimeout)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}
