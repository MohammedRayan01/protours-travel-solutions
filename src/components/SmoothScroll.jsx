import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, reduceMotion } from '../lib/gsap.js'

/**
 * Lenis inertial smooth scrolling, driven by GSAP's ticker and kept in
 * lockstep with ScrollTrigger.
 *
 * Why the ticker rather than Lenis's own rAF loop: running both on GSAP's
 * single ticker keeps scroll position and tween playheads on the same frame,
 * which is what stops pinned/scrubbed sections from juddering.
 *
 * Lenis drives the real scroll position (no transform on <body>), so
 * `position: fixed` layers — the Umrah background, the navbar, the floating
 * buttons — keep working normally.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Respect the OS setting: no smoothing, no hijacked wheel.
    if (reduceMotion()) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
      smoothWheel: true,
      syncTouch: false,   // native momentum on touch feels better than emulated
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    })

    lenisRef.current = lenis
    window.lenis = lenis // used by back-to-top and in-page anchors

    // Keep ScrollTrigger's cached positions in sync with every Lenis frame.
    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000) // GSAP ticker is in seconds
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
      delete window.lenis
    }
  }, [])

  // On navigation: jump to top, then recalculate every trigger once the new
  // page has laid out. Without the refresh, triggers keep the old page's
  // measurements and fire at the wrong scroll offsets.
  //
  // A hash in the URL (/services#hotels) means the page wants to land on a
  // section, so we leave the position alone and let that page scroll itself.
  useEffect(() => {
    const lenis = lenisRef.current
    if (!hash) {
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }

    // Defense in depth: the only thing that ever calls lenis.stop() is the
    // mobile drawer closing. If that ever desyncs — a route change firing
    // mid-close, a missed cleanup — scrolling stays permanently frozen with
    // no way to recover short of a refresh. A route change is proof the user
    // is not looking at an open drawer, so force-restart here unconditionally.
    if (lenis?.isStopped) lenis.start()
    document.body.style.overflow = ''

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    return () => cancelAnimationFrame(id)
  }, [pathname, hash])

  // Same safety net for the app being backgrounded/foregrounded (phone locked
  // mid-scroll, browser tab switched away and back) — some mobile browsers
  // can suspend timers/rAF while hidden in ways that leave Lenis's internal
  // state stale on return.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      const lenis = lenisRef.current
      if (lenis?.isStopped) lenis.start()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  // Images settling in changes page height, which moves every trigger below them.
  useEffect(() => {
    const onLoad = (e) => {
      if (e.target?.tagName === 'IMG') ScrollTrigger.refresh()
    }
    window.addEventListener('load', onLoad, true)
    return () => window.removeEventListener('load', onLoad, true)
  }, [])

  // Belt-and-braces: re-measure every ScrollTrigger whenever the document's
  // total height actually changes, for ANY reason — a lazy image finishing
  // after the window 'load' event, a web font swapping in and re-wrapping
  // text, a card's height changing as content streams in. Without this, a
  // trigger's cached position can go stale and the element below it stays
  // at its pre-reveal opacity:0 forever, even though the user has genuinely
  // scrolled past it — which reads as a "missing section" / blank gap.
  useEffect(() => {
    if (reduceMotion() || typeof ResizeObserver === 'undefined') return
    let raf
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    ro.observe(document.body)
    return () => { ro.disconnect(); cancelAnimationFrame(raf) }
  }, [pathname])

  return children
}

/** Scroll to an element (or the top) through Lenis when it is running. */
export const scrollTo = (target, options = {}) => {
  if (window.lenis) {
    window.lenis.scrollTo(target, { duration: 1.2, ...options })
    return
  }
  // Lenis is absent (reduced motion, or not mounted yet) — fall back to native.
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
  } else if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + (options.offset || 0)
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

/**
 * Scrolls to `location.hash` on mount and whenever the hash changes.
 * Shared by the pages that expose deep-linkable sections.
 *
 * The delay lets a lazily-loaded route paint before we measure, and the rAF
 * lets layout settle after that paint.
 */
export function useHashScroll(offset = -90) {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    let raf
    const t = setTimeout(() => {
      raf = requestAnimationFrame(() => {
        const el = document.querySelector(hash)
        if (el) scrollTo(el, { offset })
      })
    }, 180)
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  }, [hash, offset])
}

/**
 * Freeze/unfreeze page scrolling — used by the mobile drawer.
 * `body { overflow: hidden }` alone does nothing once Lenis owns the scroll,
 * so Lenis has to be stopped explicitly; the overflow rule stays as the
 * fallback for when Lenis is not running.
 */
export const lockScroll = (locked) => {
  if (window.lenis) locked ? window.lenis.stop() : window.lenis.start()
  document.body.style.overflow = locked ? 'hidden' : ''
}
