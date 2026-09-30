import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger, reduceMotion } from '../lib/gsap.js'

/**
 * Scroll handling for the app: native browser scrolling, plus the GSAP
 * ScrollTrigger bookkeeping every page's reveal animations depend on.
 *
 * This used to run scrolling through Lenis for an inertial "smooth scroll"
 * feel. It was removed after repeated, confirmed mobile touch-scroll
 * failures traced back to it — a smooth-scroll library sits between the
 * user's finger and the page, and every real bug we found this session
 * (a stuck stop() state freezing input, an asymmetric CSS/JS lock, a
 * scrollTo() that silently no-ops) came from that layer, not from React,
 * GSAP, or anything else in the stack. Native scroll cannot have this class
 * of bug on any device — there's no library in the middle to get stuck.
 *
 * GSAP's ScrollTrigger does not need Lenis: it attaches its own listener to
 * the native window scroll by default and works correctly against it.
 * Removing Lenis does not touch any of the scroll-triggered reveal/parallax
 * work elsewhere in the app.
 */
export default function SmoothScroll({ children }) {
  const { pathname, hash } = useLocation()

  // On navigation: jump to top (unless the URL wants a specific section),
  // then recalculate every trigger once the new page has laid out. Without
  // the refresh, triggers keep the old page's measurements and fire at the
  // wrong scroll offsets.
  useEffect(() => {
    // { behavior: 'instant' } is deliberate: the site sets `scroll-behavior:
    // smooth` globally, so the bare `window.scrollTo(0, 0)` form inherits
    // that and animates — and ScrollTrigger.refresh() right below, plus the
    // new page's own layout settling, can cut that animation short partway,
    // landing on a random scroll offset instead of the top. `instant`
    // bypasses CSS smooth-scroll and always lands exactly at 0.
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    // Belt-and-braces: a route change is proof no modal/drawer should still
    // be holding scroll locked, so always clear it here too.
    document.body.style.overflow = ''

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    // Deep links (/privacy#your-rights, /visa#passport…) on ANY page. The
    // browser's own jump happens before a lazily-loaded route has rendered
    // its sections, so on a first visit it silently lands at the top. Poll
    // briefly for the target and scroll to it once it exists.
    let tries = 0
    let timer
    const seek = () => {
      let el = null
      try { el = hash && document.getElementById(decodeURIComponent(hash.slice(1))) } catch { /* malformed hash */ }
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 90
        window.scrollTo({ top, behavior: 'instant' })
      } else if (hash && tries++ < 40) {
        timer = setTimeout(seek, 75)
      }
    }
    if (hash) timer = setTimeout(seek, 60)

    return () => { cancelAnimationFrame(id); clearTimeout(timer) }
  }, [pathname, hash])

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

/** Scroll to an element, a hash target, or a numeric offset — native smooth scroll. */
export const scrollTo = (target, options = {}) => {
  const behavior = reduceMotion() ? 'auto' : 'smooth'

  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior })
    return
  }

  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY + (options.offset || 0)
  window.scrollTo({ top, behavior })
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
 * Plain CSS `overflow: hidden` on body. With no smooth-scroll library
 * intercepting scroll, this is symmetric for touch and wheel input by
 * construction — there's no second, independently-toggled lock left to
 * desync from this one.
 */
export const lockScroll = (locked) => {
  document.body.style.overflow = locked ? 'hidden' : ''
}
