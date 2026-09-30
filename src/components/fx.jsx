import { useEffect, useRef, useState, useCallback } from 'react'
import {
  gsap, ScrollTrigger, SplitText, useGSAP, EASE_EXPO, reduceMotion, enterTrigger,
} from '../lib/gsap.js'

/* ============================================================
   FX — the premium motion-graphics layer.
   Rules every primitive here follows:
   • animate transform / opacity / clip-path only (no layout props)
   • cursor effects run only for a real hovering mouse
   • reduced-motion renders the final, static state
   • nothing here touches scrolling itself (no smooth-scroll lib,
     no touch-action) — that layer caused the old mobile bugs
   ============================================================ */

/* ---------- Intro coordination --------------------------------
   The Preloader resolves this when its curtain starts lifting, so
   hero timelines can wait for it instead of playing unseen beneath. */
let resolveIntro
export const introDone = new Promise((r) => { resolveIntro = r })
export const markIntroDone = () => resolveIntro?.()

/* ============================================================
   ImageReveal — a curtain wipe (clip-path) with the image inside
   settling from an over-scaled zoom. Wrap a single <img>.
   ============================================================ */
export function ImageReveal({ children, className = '', from = 'bottom', delay = 0, start = 'top 85%' }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el || reduceMotion()) return
    const inner = el.firstElementChild
    const clip = {
      bottom: 'inset(100% 0% 0% 0%)',
      top: 'inset(0% 0% 100% 0%)',
      left: 'inset(0% 100% 0% 0%)',
      right: 'inset(0% 0% 0% 100%)',
    }[from]

    const tl = gsap.timeline({
      delay,
      scrollTrigger: enterTrigger(el, { start }),
      // Hand transform back to CSS so hover-zoom classes keep working.
      onComplete: () => {
        gsap.set(el, { clearProps: 'clipPath' })
        if (inner) gsap.set(inner, { clearProps: 'transform' })
      },
    })
    tl.fromTo(el, { clipPath: clip }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.35, ease: 'expo.inOut' })
    if (inner) tl.fromTo(inner, { scale: 1.32 }, { scale: 1, duration: 1.7, ease: EASE_EXPO }, 0)
  }, { scope: ref })

  return <div ref={ref} className={`overflow-hidden ${className}`}>{children}</div>
}

/* ============================================================
   Marquee — infinite ticker. Content is rendered twice; the copy
   is inert + aria-hidden so it is never read or tabbed twice.
   ============================================================ */
export function Marquee({ children, speed = 40, reverse = false, className = '', trackClassName = '', pauseOnHover = true }) {
  return (
    <div
      className={`marquee group/marquee relative flex overflow-hidden ${className}`}
      style={{ '--marquee-duration': `${speed}s` }}
    >
      {[0, 1].map((k) => (
        <div
          key={k}
          aria-hidden={k === 1 || undefined}
          inert={k === 1 || undefined}
          className={`marquee-track flex min-w-full shrink-0 items-center justify-around ${
            reverse ? 'marquee-reverse' : ''
          } ${pauseOnHover ? 'group-hover/marquee:[animation-play-state:paused]' : ''} ${trackClassName}`}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

/* ============================================================
   FlightPath — a dashed flight route that draws itself as you
   scroll, with a plane riding the line. Purely decorative.
   ============================================================ */
const PLANE =
  'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z'

export function FlightPath({
  className = '',
  d = 'M 30 210 C 250 30, 520 20, 700 150 S 1060 290, 1170 70',
  viewBox = '0 0 1200 290',
  stroke = 'rgb(232 163 23 / 0.9)',
  guide = 'rgb(255 255 255 / 0.18)',
  plane = '#ffffff',
  start = 'top 85%',
  end = 'bottom 25%',
}) {
  const root = useRef(null)
  const path = useRef(null)
  const craft = useRef(null)

  useGSAP(() => {
    const p = path.current
    const c = craft.current
    if (!p || !c) return

    if (reduceMotion()) {
      gsap.set(p, { drawSVG: '100%' })
      gsap.set(c, { autoAlpha: 0 })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root.current, start, end, scrub: 1.2 },
      defaults: { ease: 'none' },
    })
    tl.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%' }, 0)
      .to(c, {
        motionPath: { path: p, align: p, alignOrigin: [0.5, 0.5], autoRotate: 45 },
      }, 0)
  }, { scope: root })

  return (
    <svg
      ref={root}
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none h-auto w-full overflow-visible ${className}`}
      fill="none"
    >
      <path d={d} stroke={guide} strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
      <path ref={path} d={d} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <g ref={craft}>
        <circle r="17" fill={stroke} opacity="0.18" />
        <g transform="translate(-12 -12)">
          <path d={PLANE} fill={plane} />
        </g>
      </g>
    </svg>
  )
}

/* ============================================================
   Spotlight — a soft glow that follows the mouse across a card.
   Writes CSS variables directly, so there are no re-renders.
   ============================================================ */
export function Spotlight({ children, className = '', color = 'rgb(232 163 23 / 0.16)', size = 460 }) {
  const ref = useRef(null)

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }, [])

  return (
    <div ref={ref} onPointerMove={onMove} className={`group/spot relative ${className}`}>
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 62%)`,
        }}
      />
    </div>
  )
}

/* ============================================================
   Orbs — slow-drifting colour blooms behind dark sections.
   ============================================================ */
export function Orbs({ className = '', tone = 'dark' }) {
  const a = tone === 'dark' ? 'bg-brand-500/25' : 'bg-brand-400/18'
  const b = tone === 'dark' ? 'bg-gold-500/18' : 'bg-gold-400/20'
  const c = tone === 'dark' ? 'bg-brand-300/12' : 'bg-brand-300/14'
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <span className={`orb orb-a absolute -top-32 -left-24 h-[34rem] w-[34rem] rounded-full blur-[120px] ${a}`} />
      <span className={`orb orb-b absolute -right-24 -bottom-40 h-[30rem] w-[30rem] rounded-full blur-[120px] ${b}`} />
      <span className={`orb orb-c absolute top-1/3 left-1/2 h-[22rem] w-[22rem] rounded-full blur-[110px] ${c}`} />
    </div>
  )
}

/* ============================================================
   Grain — film-grain texture that makes flat navy feel printed.
   ============================================================ */
export function Grain({ className = '' }) {
  return <span aria-hidden="true" className={`grain pointer-events-none absolute inset-0 ${className}`} />
}

/* ============================================================
   WordRotator — cycles words through a masked slot. Every word
   shares one grid cell, so the slot is always as wide as the
   longest word and nothing around it shifts.
   Don't nest this inside a SplitText/SplitHeading element.
   ============================================================ */
export function WordRotator({ words, interval = 2.2, className = '' }) {
  const ref = useRef(null)

  useGSAP(() => {
    const items = gsap.utils.toArray(ref.current?.children || [])
    if (!items.length) return
    if (reduceMotion() || items.length < 2) {
      items.forEach((el, k) => gsap.set(el, { autoAlpha: k === 0 ? 1 : 0, yPercent: 0 }))
      return
    }
    gsap.set(items, { yPercent: 110, autoAlpha: 0 })
    gsap.set(items[0], { yPercent: 0, autoAlpha: 1 })

    const tl = gsap.timeline({ repeat: -1 })
    items.forEach((el, k) => {
      const next = items[(k + 1) % items.length]
      tl.to(el, { yPercent: -110, autoAlpha: 0, duration: 0.75, ease: 'expo.inOut' }, `+=${interval}`)
        .fromTo(next, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.75, ease: 'expo.inOut' }, '<')
    })
  }, { scope: ref, dependencies: [words.join('|')] })

  return (
    <span className={`relative inline-block align-bottom ${className}`}>
      <span className="sr-only">{words.join(', ')}</span>
      <span ref={ref} aria-hidden="true" className="inline-grid overflow-hidden pb-[0.08em] align-bottom">
        {words.map((w) => (
          <span key={w} className="whitespace-nowrap [grid-area:1/1]">{w}</span>
        ))}
      </span>
    </span>
  )
}

/* ============================================================
   Scramble — text decodes itself from random glyphs as it enters.
   Length is held constant, so the line never reflows.
   ============================================================ */
export function Scramble({ text, className = '', delay = 0, as: Tag = 'span' }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el || reduceMotion()) return
    gsap.set(el, { autoAlpha: 0 })
    gsap.timeline({ delay, scrollTrigger: enterTrigger(el, { start: 'top 90%' }) })
      .set(el, { autoAlpha: 1 })
      .to(el, {
        duration: 1.1,
        ease: 'none',
        scrambleText: { text, chars: 'upperCase', speed: 0.6, revealDelay: 0.25, tweenLength: false },
      })
  }, { scope: ref, dependencies: [text] })

  return <Tag ref={ref} className={className}>{text}</Tag>
}

/* ============================================================
   ScrubText — a statement paragraph whose words light up one by
   one as it scrolls through the viewport.
   ============================================================ */
export function ScrubText({ children, as: Tag = 'p', className = '', dim = 0.16 }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el || reduceMotion()) return
    let split
    const run = () => {
      split = SplitText.create(el, { type: 'words' })
      gsap.fromTo(split.words, { opacity: dim }, {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true },
      })
    }
    if (document.fonts?.ready) document.fonts.ready.then(run)
    else run()
    return () => split?.revert()
  }, { scope: ref })

  return <Tag ref={ref} className={className}>{children}</Tag>
}

/* ============================================================
   RevealGrid — cards rise and un-tilt row by row as each row
   enters (ScrollTrigger.batch), instead of the whole grid at once.
   Don't combine with Framer Motion `layout` on the same children.
   ============================================================ */
export function RevealGrid({ children, className = '', y = 70, stagger = 0.09 }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const kids = gsap.utils.toArray(el.children)
    if (!kids.length) return
    if (reduceMotion()) { gsap.set(kids, { autoAlpha: 1 }); return }

    gsap.set(kids, { autoAlpha: 0, y, rotateX: 10, transformPerspective: 1100, transformOrigin: '50% 100%' })
    ScrollTrigger.batch(kids, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1, y: 0, rotateX: 0, duration: 1.1, ease: EASE_EXPO, stagger,
          overwrite: true,
          onComplete: () => gsap.set(batch, { clearProps: 'transform' }),
        }),
    })
  }, { scope: ref })

  return <div ref={ref} className={className}>{children}</div>
}

/* ============================================================
   RotatingBadge — circular text that slowly spins around a
   centre mark. Classic premium-editorial stamp.
   ============================================================ */
export function RotatingBadge({ text, size = 132, className = '', children, textClass = 'fill-white/80' }) {
  const id = useRef(`rb-${Math.random().toString(36).slice(2, 8)}`).current
  return (
    <div className={`relative grid place-items-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" aria-hidden="true" className="animate-spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className={`font-display text-[15px] font-bold tracking-[0.32em] uppercase ${textClass}`}>
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="relative">{children}</div>
    </div>
  )
}

/* ============================================================
   DrawLine — a hand-drawn gold underline that inks in on enter.
   Position it absolutely under a word inside a relative parent.
   ============================================================ */
export function DrawLine({ className = '', color = '#e8a317', delay = 0.3 }) {
  const ref = useRef(null)
  useGSAP(() => {
    const p = ref.current?.querySelector('path')
    if (!p) return
    if (reduceMotion()) { gsap.set(p, { drawSVG: '100%' }); return }
    gsap.fromTo(p, { drawSVG: '0%' }, {
      drawSVG: '100%', duration: 1.2, ease: 'power2.inOut', delay,
      scrollTrigger: enterTrigger(ref.current, { start: 'top 90%' }),
    })
  }, { scope: ref })
  return (
    <svg ref={ref} viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true" className={`pointer-events-none ${className}`} fill="none">
      <path d="M3 14 C 60 4, 140 4, 200 10 S 280 16, 297 7" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

/* ============================================================
   Preloader — a brief branded curtain on the first visit of a
   session. Hard-capped and fail-safe: it can never trap the page.
   ============================================================ */
const SEEN_KEY = 'pt-intro-seen'

// Pure read only — StrictMode double-invokes state initializers, so the
// "seen" write happens in an effect instead.
function shouldShowIntro() {
  if (typeof window === 'undefined' || reduceMotion()) return false
  try { return !sessionStorage.getItem(SEEN_KEY) } catch { return true }
}

export function Preloader() {
  const [show] = useState(shouldShowIntro)
  const [gone, setGone] = useState(!show)
  const root = useRef(null)

  useEffect(() => {
    if (!show) { markIntroDone(); return }
    try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* storage blocked */ }
  }, [show])

  useGSAP(() => {
    if (!show || !root.current) return
    const q = gsap.utils.selector(root)
    const finish = () => { markIntroDone(); setGone(true) }
    // Absolute ceiling: whatever happens, the curtain is gone by 3.2s.
    const bail = setTimeout(finish, 3200)

    const tl = gsap.timeline({ defaults: { ease: EASE_EXPO }, onComplete: () => { clearTimeout(bail); finish() } })
    tl.fromTo(q('[data-pl-logo]'), { autoAlpha: 0, y: 24, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 })
      .fromTo(q('[data-pl-line]'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, '-=0.35')
      .fromTo(q('[data-pl-plane]'), { xPercent: -50, left: '0%' }, { left: '100%', duration: 0.9, ease: 'power3.inOut' }, '<')
      .fromTo(q('[data-pl-tag]'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.5')
      .add(() => markIntroDone())
      .to(q('[data-pl-inner]'), { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '+=0.15')
      .to(q('[data-pl-panel]'), { yPercent: -100, duration: 0.95, ease: 'expo.inOut', stagger: 0.07 }, '-=0.2')

    return () => clearTimeout(bail)
  }, { scope: root, dependencies: [show] })

  if (gone) return null

  return (
    <div ref={root} className="fixed inset-0 z-[200]" aria-hidden="true">
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3].map((k) => (
          <span key={k} data-pl-panel className="h-full flex-1 bg-navy-950" />
        ))}
      </div>
      <div data-pl-inner className="relative grid h-full place-items-center px-6">
        <div className="flex w-full max-w-sm flex-col items-center">
          <img data-pl-logo src="/logo-white.png" alt="" width={1200} height={209} className="h-12 w-auto sm:h-14" />
          <div className="relative mt-8 h-px w-full">
            <span data-pl-line className="absolute inset-0 origin-left bg-gradient-to-r from-brand-400 via-gold-500 to-gold-400" />
            <svg data-pl-plane viewBox="0 0 24 24" className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 fill-gold-400">
              <path d={PLANE} />
            </svg>
          </div>
          <span data-pl-tag className="mt-6 font-display text-[0.72rem] font-bold tracking-[0.34em] text-white/60 uppercase">
            Making memories since 2009
          </span>
        </div>
      </div>
    </div>
  )
}
