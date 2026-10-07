import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useGSAPFadeUp Hook
 * 
 * Failsafe entrance animation for sections:
 * - Elements are 100% visible by default (no permanent hiding or opacity locks)
 * - Animate smoothly when scrolled into view
 */
export function useGSAPFadeUp({
  delay = 0.1,
  duration = 0.7,
  stagger = 0.12,
  yOffset = 25,
} = {}) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const targets = containerRef.current.querySelectorAll('[data-animate]')
      if (!targets.length) return

      gsap.from(targets, {
        opacity: 0,
        y: yOffset,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [delay, duration, stagger, yOffset])

  return containerRef
}
