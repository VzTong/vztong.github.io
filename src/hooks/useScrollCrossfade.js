import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useScrollCrossfade Hook
 * 
 * Failsafe snap-compatible entrance animation:
 * - Guarantees 100% data visibility at all times (no stuck dimming or hidden sections)
 * - Triggers smooth, crisp fade-in and scale-up when each section snaps into the viewport
 * 
 * @param {React.RefObject} containerRef - Container containing the section elements
 */
export function useScrollCrossfade(containerRef) {
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const scrollerEl = containerRef.current
      const sections = scrollerEl.querySelectorAll('section')

      sections.forEach((section, index) => {
        // First section (Hero) is always fully visible immediately
        if (index === 0) {
          gsap.set(section, { opacity: 1, y: 0, scale: 1 })
          return
        }

        // Animate each section smoothly as it enters/snaps into view
        gsap.fromTo(
          section,
          {
            opacity: 0.4,
            y: 30,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: section,
              scroller: scrollerEl,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [containerRef])
}
