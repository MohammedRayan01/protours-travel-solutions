import { useRef, useState, useCallback } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP, EASE, EASE_EXPO, reduceMotion, enterTrigger } from '../lib/gsap.js'

/* ============================================================
   Reveal — the workhorse. Fades a block up as it scrolls in.
   Drop-in replacement for the old Framer Motion version, so
   every existing <Reveal> on the site now runs on ScrollTrigger.
   ============================================================ */
export function Reveal({ children, delay = 0, y = 34, className = '', once = true }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    if (reduceMotion()) { gsap.set(el, { opacity: 1, y: 0 }); return }

    gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: EASE,
        scrollTrigger: enterTrigger(el, {
          toggleActions: once ? 'play none none none' : 'play none none reverse',
        }),
      }
    )
  }, { scope: ref, dependencies: [delay, y] })

  return <div ref={ref} className={className}>{children}</div>
}

/* ============================================================
   Stagger — animates a container's direct children in sequence.
   One ScrollTrigger for the whole group instead of one per card.
   ============================================================ */
export function Stagger({ children, className = '', stagger = 0.09, y = 40, from = 'start' }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const kids = gsap.utils.toArray(el.children)
    if (!kids.length) return
    if (reduceMotion()) { gsap.set(kids, { opacity: 1, y: 0 }); return }

    gsap.fromTo(
      kids,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: EASE,
        stagger: { each: stagger, from },
        scrollTrigger: enterTrigger(el),
      }
    )
  }, { scope: ref })

  return <div ref={ref} className={className}>{children}</div>
}

/* ============================================================
   SplitHeading — SplitText line/word reveal for big headings.
   Masked by line so words rise out of an invisible edge.
   ============================================================ */
export function SplitHeading({ children, as: Tag = 'h2', className = '', by = 'words', delay = 0 }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    if (reduceMotion()) return

    // Fonts must be ready or SplitText measures the fallback face and
    // the lines re-wrap after load.
    let split
    const run = () => {
      split = SplitText.create(el, {
        type: by === 'chars' ? 'chars,words' : 'words,lines',
        mask: 'lines',
        linesClass: 'split-line',
      })
      const targets = by === 'chars' ? split.chars : split.words

      gsap.from(targets, {
        yPercent: 115,
        opacity: 0,
        duration: 1.05,
        ease: EASE_EXPO,
        stagger: by === 'chars' ? 0.02 : 0.045,
        delay,
        scrollTrigger: enterTrigger(el, { start: 'top 85%' }),
      })
    }

    if (document.fonts?.ready) document.fonts.ready.then(run)
    else run()

    return () => split?.revert()
  }, { scope: ref })

  return <Tag ref={ref} className={className}>{children}</Tag>
}

/* ============================================================
   Parallax — moves a layer at a different rate to the scroll.
   `speed` > 0 drifts up, < 0 drifts down.
   ============================================================ */
export function Parallax({ children, speed = 0.18, className = '', scale = false }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el || reduceMotion()) return
    const inner = el.firstElementChild || el

    gsap.fromTo(
      inner,
      { yPercent: -speed * 50, ...(scale ? { scale: 1.14 } : {}) },
      {
        yPercent: speed * 50,
        ...(scale ? { scale: 1 } : {}),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    )
  }, { scope: ref, dependencies: [speed] })

  return <div ref={ref} className={className}>{children}</div>
}

/* ============================================================
   Magnetic — button leans toward the cursor, springs back.
   Pointer-based so it no-ops on touch devices.
   ============================================================ */
export function Magnetic({ children, strength = 0.32, className = '' }) {
  const ref = useRef(null)

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el || reduceMotion() || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    gsap.to(el, {
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
      duration: 0.6,
      ease: EASE,
    })
  }, [strength])

  const onLeave = useCallback(() => {
    if (!ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
  }, [])

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}

/* ============================================================
   CountUp — number animation driven by ScrollTrigger.
   ============================================================ */
export function CountUp({ value, suffix = '', duration = 1.9, className = '' }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const fmt = (n) => (value >= 1000 ? Math.round(n).toLocaleString('en-IN') : Math.round(n))

    if (reduceMotion()) { el.textContent = `${fmt(value)}${suffix}`; return }

    const obj = { n: 0 }
    gsap.to(obj, {
      n: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = `${fmt(obj.n)}${suffix}` },
      scrollTrigger: enterTrigger(el, { start: 'top 88%' }),
    })
  }, { scope: ref, dependencies: [value, suffix] })

  return <span ref={ref} className={className}>0{suffix}</span>
}

/* ============================================================
   PinnedPanels — pins a section and scrubs horizontally
   through its panels. Disabled below lg where it fights
   with native vertical scrolling.
   ============================================================ */
export function PinnedPanels({ children, className = '' }) {
  const outer = useRef(null)
  const track = useRef(null)

  useGSAP(() => {
    const sec = outer.current
    const rail = track.current
    if (!sec || !rail) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => rail.scrollWidth - window.innerWidth + 120

      const tween = gsap.to(rail, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      return () => tween.kill()
    })

    return () => mm.revert()
  }, { scope: outer })

  return (
    <section ref={outer} className={className}>
      <div ref={track} className="flex gap-6 lg:will-change-transform">
        {children}
      </div>
    </section>
  )
}

/* ============================================================
   TiltCard — subtle 3D tilt toward the pointer.
   ============================================================ */
export function TiltCard({ children, className = '', max = 7 }) {
  const ref = useRef(null)

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el || reduceMotion() || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el, {
      rotateY: px * max * 2,
      rotateX: -py * max * 2,
      duration: 0.5,
      ease: EASE,
      transformPerspective: 900,
    })
  }, [max])

  const onLeave = useCallback(() => {
    if (ref.current) gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' })
  }, [])

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={className}>
      {children}
    </div>
  )
}

/* Kept so existing imports of the old name keep working. */
export { Reveal as default }
