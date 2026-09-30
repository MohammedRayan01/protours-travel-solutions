import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { gsap, useGSAP, reduceMotion } from '../lib/gsap.js'
import { Reveal, CountUp, SplitHeading } from './motion.jsx'
import { Scramble, Grain, Orbs } from './fx.jsx'

/* Scroll-driven animation lives in motion.jsx (GSAP + ScrollTrigger).
   Re-exported here so every existing import keeps working. */
export { Reveal, SplitHeading }
export { Stagger, Parallax, Magnetic, TiltCard, PinnedPanels } from './motion.jsx'

/** Counter kept as a named export; now GSAP-driven. */
export function Counter({ value, suffix = '' }) {
  return <CountUp value={value} suffix={suffix} />
}

/* ------------------------------------------------------------
   SectionHeading — headline words rise out of a masked line.
   ------------------------------------------------------------ */
export function SectionHeading({ eyebrow, title, sub, center = false, light = false, className = '' }) {
  return (
    <div className={`${center ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'} mb-10 md:mb-14 ${className}`}>
      {eyebrow && (
        <Reveal>
          <span className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>
            <Scramble text={eyebrow} />
          </span>
        </Reveal>
      )}
      <SplitHeading className={`h-sec mt-4 text-balance ${light ? '!text-white' : ''}`}>
        {title}
      </SplitHeading>
      {sub && (
        <Reveal delay={0.12}>
          <p className={`mt-5 text-[1.17rem] text-pretty ${light ? 'text-white/70' : 'text-body'}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  )
}

/* ------------------------------------------------------------
   Stars
   ------------------------------------------------------------ */
export function Stars({ n = 5, size = 15 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < n ? 'fill-gold-500 text-gold-500' : 'fill-slate-200 text-slate-200'}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------
   PageHero — immersive photo header with a scrubbed parallax
   background and a split-text headline.
   ------------------------------------------------------------ */
export function PageHero({ img, alt, eyebrow, title, sub, children, tall = false }) {
  const root = useRef(null)
  const imgRef = useRef(null)

  useGSAP(() => {
    if (!imgRef.current || reduceMotion()) return
    // Photo drifts slower than the page, and the overlay deepens on exit.
    gsap.fromTo(
      imgRef.current,
      { yPercent: -8, scale: 1.16 },
      {
        yPercent: 12,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      }
    )
  }, { scope: root })

  return (
    <section
      ref={root}
      className={`relative isolate flex items-end overflow-hidden ${tall ? 'min-h-[64vh]' : 'min-h-[48vh]'}`}
    >
      <img
        ref={imgRef}
        src={img}
        alt={alt}
        className="absolute inset-0 -z-20 h-full w-full object-cover will-change-transform"
        fetchPriority="high"
      />
      {/* Submerge the photo under a deep gradient so text always reads */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/72 via-navy-950/42 to-navy-950/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/50 to-transparent" />
      <Orbs className="!z-[-5] opacity-80" />
      <Grain className="-z-[4]" />
      {/* Gold hairline that sweeps across the base of every page hero */}
      <span aria-hidden="true" className="hero-hairline pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px" />

      <div className="wrap relative z-10 pt-20 pb-14 md:pt-24 md:pb-16">
        <div className="max-w-3xl">
          {eyebrow && (
            <Reveal>
              <span className="eyebrow eyebrow-light"><Scramble text={eyebrow} /></span>
            </Reveal>
          )}
          <SplitHeading
            as="h1"
            className="h-sec mt-4 !text-white text-balance md:!text-[clamp(2.7rem,5vw,4.3rem)]"
          >
            {title}
          </SplitHeading>
          {sub && (
            <Reveal delay={0.14}>
              <p className="mt-5 max-w-2xl text-[1.21rem] text-white/75 text-pretty">{sub}</p>
            </Reveal>
          )}
          {children && <Reveal delay={0.22}><div className="mt-9">{children}</div></Reveal>}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------
   Accordion — interaction animation, stays on Framer Motion.
   ------------------------------------------------------------ */
export function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Reveal key={i} delay={i * 0.05}>
          <div className={`overflow-hidden rounded-2xl border transition-colors ${open === i ? 'border-brand-500/40 bg-white shadow-[var(--shadow-lift)]' : 'border-slate-200 bg-white'}`}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left font-display text-[1.12rem] font-bold text-ink"
            >
              {item.q}
              <motion.span
                animate={{ rotate: open === i ? 45 : 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-500/10 text-brand-500"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </motion.span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-6 text-[1.08rem] text-pretty">{item.a}</p>
            </motion.div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
