import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Moon, ArrowRight, Phone } from 'lucide-react'

import { BIZ, PHOTOS, waLink } from '../data/site.js'
import { Reveal, SectionHeading } from '../components/ui.jsx'
import { SplitHeading } from '../components/motion.jsx'
import {
  Marquee, FlightPath, ScrubText, RevealGrid, Polaroid, Stamp, introDone,
} from '../components/fx.jsx'
import { gsap, SplitText, useGSAP, EASE_EXPO, reduceMotion, enterTrigger } from '../lib/gsap.js'
import { photo } from '../lib/img.js'
import { UMRAH_FAQS } from '../data/umrah.js'

/* Makkah / Madinah imagery. The hero, the packages and the FAQ sit on
   it (fixed behind the page); the paper sections slide over it. */
const BG = 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=2000&q=76'
const BG2 = 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1400&q=74'
/* The fixed backdrop always fills the viewport, so 100vw is the honest size. */
const BG_IMG = photo(BG, { sizes: '100vw', widths: [640, 1080, 1440, 1920, 2400], quality: 76 })

const TIERS = [
  {
    name: 'Economy',
    num: 'i.',
    duration: '10 nights: 5 Makkah, 5 Madinah',
    featured: false,
    inc: [
      'Umrah visa included',
      'Return economy air tickets',
      '3★ hotels, 600–800 m from the Haram',
      'Quad sharing rooms',
      'Makkah–Madinah bus transfers',
      'Ziyarat tours in both cities',
    ],
  },
  {
    name: 'Deluxe',
    num: 'ii.',
    duration: '12 nights: 6 Makkah, 6 Madinah',
    featured: true,
    inc: [
      'Umrah visa included',
      'Preferred-airline return tickets',
      '4★ hotels within 300 m of the Haram',
      'Triple sharing, breakfast & dinner daily',
      'Private AC coach transfers',
      'Group co-ordinator throughout',
    ],
  },
  {
    name: 'Premium',
    num: 'iii.',
    duration: '14 nights: 7 Makkah, 7 Madinah',
    featured: false,
    inc: [
      'Umrah visa included',
      'Direct flights, preferred seating',
      '5★ Haram-view hotels',
      'Double sharing, full board',
      'Private car + Haramain train option',
      'Dedicated scholar with the group',
    ],
  },
]

const STEPS = [
  ['Choose dates and a tier', 'Tell us your travel window, how many of you are going, and the hotel category you have in mind.'],
  ['Send your documents', 'Passport with six months or more of validity, photographs and vaccination record. We handle the rest.'],
  ['Visa and confirmations', 'Umrah visa, e-tickets and hotel vouchers reach you well before departure.'],
  ['Travel, with support', 'A ground co-ordinator on arrival, and a Bengaluru number on WhatsApp the whole time.'],
]

/* Taken from the document guidance in the FAQ below; nothing new. */
const KEEP_READY = [
  'Passport, valid for six months or more',
  'Recent photographs, white background',
  'Vaccination record, as required that season',
  'Your travel window, and who is travelling',
  'Room sharing: double, triple or quad',
]

const HANDLED = [
  'Umrah visa processing, with document guidance',
  'Direct and one-stop flights from Bengaluru',
  'Walking distances to the Haram, in metres',
  'Ziyarat in Makkah and Madinah with a knowledgeable guide',
  'Group departures in Ramadan and school holidays',
]


/* Sacred sites of Makkah & Madinah, a calm ticker, names only. */
const PLACES = [
  'Masjid al-Haram', 'Al-Masjid an-Nabawi', 'Masjid Quba', 'Jabal al-Nour', 'Mount Uhud',
  'Masjid al-Qiblatayn', 'Jannat al-Baqi', 'Mina', 'Arafat', 'Muzdalifah', 'Jabal Thawr',
]

/* Resolves when the intro curtain lifts, or after a ceiling. Only ever
   called from inside useGSAP, so `document` is never touched on the server. */
const heroReady = () =>
  Promise.all([
    Promise.race([introDone, new Promise((r) => setTimeout(r, 3400))]),
    document.fonts?.ready ?? Promise.resolve(),
  ])

/* ------------------------------------------------------------
   A slightly uneven, overshooting circle, the way a pen goes
   round a spot on a map. Deterministic, so SSR/hydration and
   re-renders always produce the same line.
   ------------------------------------------------------------ */
function wobblyCircle(cx, cy, r, seed = 1, turns = 1.07, n = 14) {
  let s = seed * 7919
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  const a0 = rnd() * Math.PI * 2
  const pts = []
  for (let i = 0; i <= n; i++) {
    const a = a0 + (i / n) * Math.PI * 2 * turns
    const rr = r * (1 + (rnd() - 0.5) * 0.07)
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }
  const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`
  let d = `M${f(pts[0])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${f(c1)} ${f(c2)} ${f(p2)}`
  }
  return d
}

/* ============================================================
   Rosette: Islamic geometric line-art (overlapping rotated
   squares, a sixteen-point star inside a double ring) that inks
   itself in once. Quiet by default: thin, faint, and it only
   turns when `spin` is given.
   ============================================================ */
function Rosette({ className = '', stroke = 'rgb(232 163 23 / 0.38)', spin = 0, hero = false, width = 0.8 }) {
  const ref = useRef(null)

  useGSAP((ctx, contextSafe) => {
    const svg = ref.current
    if (!svg || reduceMotion()) return
    const lines = svg.querySelectorAll('[data-ink]')
    gsap.set(lines, { drawSVG: '0%' })
    const draw = { drawSVG: '100%', duration: 2.6, ease: 'power2.inOut', stagger: 0.12 }

    if (hero) {
      let dead = false
      const go = contextSafe(() => { if (!dead) gsap.to(lines, { ...draw, delay: 0.4 }) })
      heroReady().then(go)
      return () => { dead = true }
    }
    gsap.to(lines, { ...draw, scrollTrigger: enterTrigger(svg, { start: 'top 88%' }) })
  }, { scope: ref })

  const sq = [0, 22.5, 45, 67.5]
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div className={`h-full w-full ${spin ? 'animate-spin-slow' : ''}`} style={spin ? { animationDuration: `${spin}s` } : undefined}>
        <svg ref={ref} viewBox="0 0 200 200" fill="none" stroke={stroke} strokeWidth={width} className="h-full w-full overflow-visible">
          <circle data-ink cx="100" cy="100" r="97" />
          <circle data-ink cx="100" cy="100" r="90" strokeDasharray="1.5 4" />
          {sq.map((a) => (
            <rect data-ink key={a} x="38" y="38" width="124" height="124" transform={`rotate(${a} 100 100)`} />
          ))}
          {[0, 45].map((a) => (
            <rect data-ink key={`i${a}`} x="66" y="66" width="68" height="68" transform={`rotate(${a} 100 100)`} />
          ))}
          <circle data-ink cx="100" cy="100" r="30" />
          <circle data-ink cx="100" cy="100" r="12" />
        </svg>
      </div>
    </div>
  )
}

/* Small eight-point star used as a separator glyph. */
function StarGlyph({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 1.5 14.6 6l5-1.2-1.2 5L22.5 12l-4.1 2.2 1.2 5-5-1.2L12 22.5 9.4 18l-5 1.2 1.2-5L1.5 12l4.1-2.2-1.2-5 5 1.2z" />
    </svg>
  )
}

/* ============================================================
   Hero: the headline rises line by line after the intro, the
   rosette inks in beside it, and the copy lifts gently away as
   the page scrolls on.
   ============================================================ */
function UmrahHero() {
  const root = useRef(null)
  const content = useRef(null)

  useGSAP((ctx, contextSafe) => {
    if (reduceMotion()) return
    const q = gsap.utils.selector(root)
    const h1 = q('h1')[0]
    const fades = q('[data-hero-fade]')
    const mark = q('[data-hero-mark]')

    gsap.set(fades, { autoAlpha: 0, y: 22 })
    gsap.set(h1, { autoAlpha: 0 })
    gsap.set(mark, { autoAlpha: 0, y: 10 })

    let dead = false
    let split
    const go = contextSafe(() => {
      if (dead) return
      split = SplitText.create(h1, { type: 'words,lines', mask: 'lines', linesClass: 'split-line' })
      gsap.timeline({ defaults: { ease: EASE_EXPO } })
        .to(fades[0], { autoAlpha: 1, y: 0, duration: 1 })
        .set(h1, { autoAlpha: 1 }, 0.1)
        .from(split.words, { yPercent: 118, duration: 1.4, stagger: 0.08 }, 0.1)
        .to(fades.slice(1), { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.13 }, 0.55)
        .to(mark, { autoAlpha: 1, y: 0, duration: 1.4 }, 1.4)
    })
    heroReady().then(go)

    gsap.to(content.current, {
      yPercent: -12, opacity: 0.3, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    })

    return () => { dead = true; split?.revert() }
  }, { scope: root })

  return (
    <section ref={root} aria-labelledby="umrah-hero-title" className="relative isolate flex min-h-[70svh] items-center overflow-hidden md:min-h-[84svh]">
      {/* Mobile: the rosette sits faintly behind the headline */}
      <Rosette hero className="absolute -top-10 -right-28 -z-10 h-[320px] w-[320px] opacity-60 lg:hidden" />

      <div className="wrap grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1fr_auto]">
        <div ref={content} className="max-w-3xl">
          <span data-hero-fade className="eyebrow eyebrow-light">Hajj &amp; Umrah from Bengaluru</span>
          <h1 id="umrah-hero-title" className="h-hero mt-6 !text-white text-balance">
            Umrah, arranged <span className="accent text-gold-400">properly</span>
          </h1>
          <p data-hero-fade className="mt-7 max-w-2xl text-[1.23rem] text-white/80 text-pretty">
            Umrah visa, tickets and hotels near the Haram, handled by a team that has been sending groups from
            Shivaji Nagar, Bengaluru, for years. We quote walking distances in metres, not adjectives.
          </p>
          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href={waLink('Assalamu alaikum, I would like to enquire about Umrah packages from Bengaluru. Our travel window is:')}
              target="_blank" rel="noopener noreferrer" className="btn btn-wa"
            >
              Ask for an Umrah quote <span className="sr-only">on WhatsApp</span> <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a href={`tel:${BIZ.phone}`} className="link-grow inline-flex items-center gap-2 font-display text-[1.02rem] font-bold text-white/90">
              <Phone size={15} aria-hidden="true" className="text-gold-400" /> or call {BIZ.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Desktop: the drawn rosette, turning very slowly */}
        <div className="relative hidden h-[420px] w-[420px] place-items-center lg:grid" aria-hidden="true">
          <Rosette hero spin={260} className="absolute inset-0" />
          <div data-hero-mark className="relative grid place-items-center text-center">
            <Moon size={26} strokeWidth={1.5} aria-hidden="true" className="text-gold-400" />
            <span className="note mt-2 text-[1.35rem] leading-tight text-white/85">Makkah<br />&amp; Madinah</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Walking-distance map note: a hand-sketched, not-to-scale plan
   of the rings around the Haram, drawn in pen as it scrolls in,
   with footsteps walking from a hotel to the mosque.
   ============================================================ */
const MAP = { cx: 170, cy: 176 }
const RINGS = [
  { r: 44, seed: 3, label: 'Haram-view', tier: 'Premium', y: 118 },
  { r: 92, seed: 5, label: 'within 300 m', tier: 'Deluxe', y: 180 },
  { r: 146, seed: 8, label: '600–800 m', tier: 'Economy', y: 242 },
].map((g) => {
  const a = (-18 + g.r * 0.12) * (Math.PI / 180)
  return { ...g, d: wobblyCircle(MAP.cx, MAP.cy, g.r, g.seed), lx: MAP.cx + Math.cos(a) * g.r, ly: MAP.cy + Math.sin(a) * g.r }
})
const HOTEL = { x: MAP.cx + Math.cos(0.78) * 92, y: MAP.cy + Math.sin(0.78) * 92 }
const STEPS_DOTS = Array.from({ length: 7 }, (_, i) => {
  const t = (i + 1) / 8
  return {
    x: HOTEL.x + (MAP.cx + 10 - HOTEL.x) * t + Math.sin(t * 9) * 3,
    y: HOTEL.y + (MAP.cy + 12 - HOTEL.y) * t,
  }
})

function DistanceMap() {
  const ref = useRef(null)

  useGSAP(() => {
    const svg = ref.current
    if (!svg) return
    const q = gsap.utils.selector(svg)
    const ink = q('[data-ink]')
    const words = q('[data-word]')
    const dots = q('[data-step-dot]')
    if (reduceMotion()) { gsap.set(ink, { drawSVG: '100%' }); return }

    gsap.set(ink, { drawSVG: '0%' })
    gsap.set(words, { autoAlpha: 0 })
    gsap.set(dots, { autoAlpha: 0, scale: 0.2, transformOrigin: '50% 50%' })
    gsap.timeline({ scrollTrigger: enterTrigger(svg, { start: 'top 78%' }) })
      .to(ink, { drawSVG: '100%', duration: 1.3, ease: 'power2.inOut', stagger: 0.22 })
      .to(words, { autoAlpha: 1, duration: 0.6, stagger: 0.12 }, '-=1.4')
      .to(dots, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.16 }, '-=0.4')
  }, { scope: ref })

  const ink = '#062647'
  return (
    <svg
      ref={ref}
      viewBox="0 0 520 340"
      role="img"
      aria-label="Sketch, not to scale: Premium hotels are Haram-view, Deluxe within 300 metres, Economy 600 to 800 metres from Masjid al-Haram."
      className="h-auto w-full overflow-visible"
      fill="none"
    >
      {/* north mark */}
      <path data-ink d="M34 64 L34 28 M26 38 L34 26 L42 38" stroke={ink} strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text data-word x="29" y="80" className="note" fontSize="16" fill={ink} fillOpacity="0.6">N</text>

      {RINGS.map((g) => (
        <g key={g.r}>
          <path data-ink d={g.d} stroke="#0b6e4f" strokeOpacity={0.85 - g.r / 400} strokeWidth="1.8" strokeLinecap="round" />
          {/* leader line from ring to its label */}
          <path data-ink d={`M${g.lx.toFixed(1)} ${g.ly.toFixed(1)} Q ${(g.lx + 330) / 2} ${g.y - 20} 338 ${g.y - 6}`} stroke={ink} strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" />
          <text data-word x="346" y={g.y} className="note" fontSize="24" fill={ink}>{g.label}</text>
          <text data-word x="346" y={g.y + 21} fontSize="14" fontWeight="700" letterSpacing="2" fill="#0b6e4f" className="font-display uppercase">{g.tier}</text>
        </g>
      ))}

      {/* the Haram, a small square in the middle */}
      <rect x={MAP.cx - 7} y={MAP.cy - 7} width="14" height="14" fill={ink} transform={`rotate(-4 ${MAP.cx} ${MAP.cy})`} />
      <text data-word x={MAP.cx} y={MAP.cy - 16} textAnchor="middle" className="note" fontSize="18" fill={ink}>al-Haram</text>

      {/* a hotel, and the walk from its door */}
      <rect x={HOTEL.x - 6} y={HOTEL.y - 6} width="12" height="12" fill="#fbf7f0" stroke="#b4532a" strokeWidth="2" />
      {STEPS_DOTS.map((p, i) => (
        <circle data-step-dot key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="2.4" fill="#b4532a" />
      ))}
      <path data-ink d={`M${(HOTEL.x + 8).toFixed(1)} ${(HOTEL.y + 6).toFixed(1)} Q 300 ${HOTEL.y + 50} 340 ${HOTEL.y + 50}`} stroke="#b4532a" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" />
      <text data-word x="346" y={HOTEL.y + 50} className="note" fontSize="17" fill="#b4532a">
        <tspan x="346">your hotel,</tspan>
        <tspan x="346" dy="19">named before you pay</tspan>
      </text>
    </svg>
  )
}

/* ============================================================
   Steps: a vertical line draws down once, and each number is
   stamped on as the line reaches it. Plays once, never pinned.
   ============================================================ */
function Steps() {
  const root = useRef(null)

  useGSAP(() => {
    if (reduceMotion()) return
    const q = gsap.utils.selector(root)
    const line = q('[data-line]')
    const dots = q('[data-dot]')
    const items = q('[data-step]')
    gsap.set(line, { scaleY: 0 })
    gsap.set(dots, { scale: 0.5, autoAlpha: 0 })
    gsap.set(items, { autoAlpha: 0, x: 14 })
    const tl = gsap.timeline({ scrollTrigger: enterTrigger(root.current, { start: 'top 75%' }) })
    tl.to(line, { scaleY: 1, duration: 0.6 * STEPS.length, ease: 'power1.inOut' }, 0)
    dots.forEach((d, i) => {
      tl.to(d, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.6)' }, i * 0.55)
        .to(items[i], { autoAlpha: 1, x: 0, duration: 0.9, ease: EASE_EXPO }, i * 0.55 + 0.05)
    })
  }, { scope: root })

  return (
    <ol ref={root} className="relative grid gap-9">
      <span aria-hidden="true" className="absolute top-5 bottom-5 left-5 w-px -translate-x-1/2 bg-slate-200">
        <span data-line className="block h-full w-full origin-top bg-palm" />
      </span>
      {STEPS.map(([t, d], i) => (
        <li key={t} className="relative flex gap-5">
          <span data-dot className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border-[1.5px] border-palm bg-paper font-accent text-[1.35rem] font-semibold text-palm italic">
            {i + 1}
          </span>
          <div data-step className="min-w-0 pt-1">
            <h3 className="font-display text-[1.16rem] font-bold">{t}</h3>
            <p className="mt-1.5 text-[1.02rem] text-pretty">{d}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ============================================================
   Checklist: a handwritten list on lined paper, taped to the
   page. Boxes are pencilled in; the ticks ink in one by one.
   ============================================================ */
function Checklist({ title, items, className = '' }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const ticks = el.querySelectorAll('path[data-tick]')
    if (reduceMotion()) { gsap.set(ticks, { drawSVG: '100%' }); return }
    gsap.fromTo(ticks, { drawSVG: '0%' }, {
      drawSVG: '100%', duration: 0.45, ease: 'power2.out', stagger: 0.38, delay: 0.3,
      scrollTrigger: enterTrigger(el, { start: 'top 72%' }),
    })
  }, { scope: ref })

  return (
    <div ref={ref} className={`relative ${className}`}>
      <span aria-hidden="true" className="absolute -top-3 left-10 z-10 h-6 w-20 rotate-[-6deg] bg-gold-400/45" />
      <div
        className="relative rotate-[1.2deg] overflow-hidden bg-white px-6 pt-7 pb-8 shadow-[0_22px_40px_-24px_rgb(60_40_20/0.5),0_2px_6px_-2px_rgb(60_40_20/0.18)] sm:pr-8 sm:pl-14"
        style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 2.5rem, rgb(15 94 158 / 0.13) 2.5rem, rgb(15 94 158 / 0.13) calc(2.5rem + 1px))',
          backgroundPosition: '0 1.75rem',
        }}
      >
        {/* red margin rule */}
        <span aria-hidden="true" className="absolute inset-y-0 left-10 hidden w-px bg-clay/40 sm:block" />
        <p className="note text-[1.5rem] leading-[2.5rem] text-navy-900">{title}</p>
        <ul className="mt-0">
          {items.map((x) => (
            <li key={x} className="flex items-start gap-3">
              <svg viewBox="0 0 28 28" aria-hidden="true" className="mt-[0.375rem] h-7 w-7 shrink-0 overflow-visible" fill="none">
                <path d="M5 7.6c5-.8 11-.9 16-.3.6 5 .5 10 .1 14.6-5 .6-10.6.5-15.7 0-.5-4.6-.6-9.6-.4-14.3z" stroke="#062647" strokeOpacity="0.45" strokeWidth="1.4" strokeLinejoin="round" />
                <path data-tick d="M8 14.5c1.8 1.3 3 2.8 4.3 4.8C14.8 13 18.4 8 25 2.8" stroke="#0b6e4f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="note text-[1.14rem] leading-[2.5rem] text-navy-900 sm:text-[1.3rem]">{x}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Umrah() {
  const [open, setOpen] = useState(0)
  const ownPhoto = Boolean(PHOTOS.umrah)

  return (
    /* The hero, packages and FAQ sit on Makkah imagery fixed behind the page. */
    <div className="relative isolate min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-30" aria-hidden="true">
        {/* Decorative backdrop behind the hero: eager, it is the first thing seen. */}
        <img
          {...BG_IMG}
          alt=""
          width={2000}
          height={1333}
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
      </div>
      <div aria-hidden="true" className="fixed inset-0 -z-20 bg-gradient-to-b from-navy-950/66 via-navy-950/55 to-navy-950/72" />

      {/* ---------- Hero ---------- */}
      <UmrahHero />

      {/* ---------- Ziyarat ticker (the page's only marquee) ---------- */}
      <div aria-hidden="true" className="border-y border-white/10 bg-navy-950/85 py-5">
        <Marquee speed={80} className="[mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          {PLACES.map((p) => (
            <span key={p} className="flex shrink-0 items-center gap-6 px-6">
              <span className="note text-[1.25rem] whitespace-nowrap text-white/80">{p}</span>
              <StarGlyph className="h-2.5 w-2.5 text-gold-500/70" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* ---------- Our Umrah desk (paper) ---------- */}
      <section aria-label="Our Umrah desk" className="section paper bg-paper">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-md pt-4 lg:max-w-none">
            <Polaroid
              src={PHOTOS.umrah || BG2}
              alt={ownPhoto ? 'A Pro Tours Umrah group in Madinah' : 'Al-Masjid an-Nabawi, the Prophet’s Mosque in Madinah'}
              caption={ownPhoto ? 'One of our groups, Madinah' : 'Masjid an-Nabawi, Madinah'}
              rotate={-2.5}
              imgClassName="aspect-[4/3.4]"
            />
            <div className="absolute -right-1 -bottom-20 sm:-right-4">
              <Stamp top="Umrah visa" main="In-house" bottom="Bengaluru" tone="palm" rotate={-9} />
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Our Umrah desk" title="For pilgrims, the details are not a luxury" className="!mb-6 md:!mb-7" />
            <ScrubText className="font-display text-[1.24rem] leading-[1.55] font-medium text-ink text-pretty md:text-[1.38rem]" dim={0.22}>
              How far the hotel really is from Bab-us-Salam. Whether the transfer waits or leaves. Whether someone
              who speaks your language is reachable at 3 AM in Madinah. These are the things that decide whether an
              Umrah feels peaceful or stressful.
            </ScrubText>
            <Reveal>
              <ul className="mt-9 grid gap-3 border-t border-slate-200 pt-7">
                {HANDLED.map((x) => (
                  <li key={x} className="flex gap-3.5">
                    <Check size={17} strokeWidth={2.6} aria-hidden="true" className="mt-1 shrink-0 text-palm" />
                    <span className="text-[1.06rem] text-pretty">{x}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[1.02rem] text-pretty">
                Passport expiring soon? Our{' '}
                <Link to="/visa#passport" className="link-grow font-bold text-navy-900 hover:text-brand-500">
                  passport renewal and tatkal help
                </Link>{' '}
                can sort that out before you travel.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Tiers (on the imagery) ---------- */}
      <section aria-label="Umrah packages from Bengaluru" className="section py-16 md:py-24">
        <div className="wrap">
          <div className="mb-12 grid gap-6 md:mb-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <SectionHeading light eyebrow="Three ways to go" title="Umrah packages from Bengaluru" className="!mb-0 md:!mb-0" />
            <Reveal delay={0.1}>
              <p className="max-w-md text-[1.08rem] text-white/75 text-pretty lg:ml-auto">
                Quoted per person, on the room sharing shown. Every tier includes the visa, return airfare, hotels and
                transfers. Ask us for today&apos;s exact quote.
              </p>
            </Reveal>
          </div>

          <RevealGrid className="grid gap-6 lg:grid-cols-3 lg:gap-7" stagger={0.12} y={50}>
            {TIERS.map((t) => (
              <article
                key={t.name}
                className={`relative flex h-full flex-col rounded-3xl p-8 ${
                  t.featured
                    ? 'bg-paper text-body shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] lg:-my-4 lg:py-12'
                    : 'border border-white/12 bg-navy-950/88 text-white/75'
                }`}
              >
                {t.featured && (
                  <span className="note absolute top-5 right-6 text-[1.1rem] text-gold-600">a good middle ground</span>
                )}
                <span className={`font-accent text-[2rem] leading-none font-semibold italic ${t.featured ? 'text-palm' : 'text-gold-400'}`}>{t.num}</span>
                <h3 className={`mt-3 text-[1.6rem] ${t.featured ? '' : '!text-white'}`}>{t.name}</h3>
                <span className={`mt-1 block text-[0.98rem] font-semibold ${t.featured ? 'text-palm' : 'text-brand-300'}`}>{t.duration}</span>

                <ul className={`mt-6 grid flex-1 gap-2.5 border-t pt-6 ${t.featured ? 'border-slate-200' : 'border-white/12'}`}>
                  {t.inc.map((x) => (
                    <li key={x} className="flex gap-3 text-[1.01rem]">
                      <Check size={15} strokeWidth={2.8} aria-hidden="true" className={`mt-1.5 shrink-0 ${t.featured ? 'text-palm' : 'text-gold-400'}`} />
                      <span className="text-pretty">{x}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={waLink(`Assalamu alaikum, I am interested in the Umrah ${t.name} package (${t.duration}). Please share current rates and availability. Our travel window is:`)}
                  target="_blank" rel="noopener noreferrer"
                  className={`btn mt-8 w-full ${t.featured ? 'btn-wa' : 'btn-glass'}`}
                  aria-label={`Enquire about the ${t.name} Umrah package on WhatsApp`}
                >
                  Enquire about {t.name}
                </a>
              </article>
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* ---------- Walking distances (sand, map note) ---------- */}
      <section aria-label="Walking distance to the Haram" className="section paper bg-sand">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Walking distance" title="How far you walk, five times a day" className="!mb-6 md:!mb-6" />
            <Reveal delay={0.1}>
              <p className="text-pretty">
                Economy hotels are typically 600–800 m from the Haram, Deluxe within 300 m, and Premium are Haram-view
                properties. You get the hotel&apos;s name and the actual walking distance before you pay.
              </p>
              <p className="note mt-5 text-[1.2rem] text-gold-600">Never a vague &ldquo;close to Haram&rdquo;.</p>
            </Reveal>
          </div>

          <div className="relative rounded-2xl border border-slate-300/70 bg-paper p-5 shadow-[var(--shadow-lift)] sm:p-8">
            <span aria-hidden="true" className="note absolute top-3 right-5 text-[1rem] text-slate-500">Makkah, not to scale</span>
            <DistanceMap />
          </div>
        </div>
      </section>

      {/* ---------- Process + checklist (paper) ---------- */}
      <section aria-label="How booking an Umrah package works" className="section paper bg-paper">
        <div className="wrap">
          <SectionHeading eyebrow="How it works" title="From first message to the Haram" className="md:!mb-14" />
          <div className="grid items-start gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <Steps />
            <Checklist title="Keep these ready:" items={KEEP_READY} className="mx-auto w-full max-w-lg lg:mt-2" />
          </div>
        </div>
      </section>

      {/* ---------- FAQ (on the imagery) ---------- */}
      <section aria-label="Umrah FAQs" className="section py-16 md:py-24">
        <div className="wrap grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="relative isolate">
            <Rosette stroke="rgb(251 247 240 / 0.2)" className="absolute -top-16 -right-4 -z-10 h-56 w-56 md:-right-10 md:h-72 md:w-72" />
            <SectionHeading
              light
              eyebrow="Common questions"
              title="Umrah FAQs"
              sub="If your question is not here, just ask. First-time pilgrims are welcome to call and take their time."
              className="!mb-0 md:!mb-0"
            />
            <Reveal delay={0.2}>
              <a
                href={waLink('Assalamu alaikum, I have a question about Umrah:')}
                target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-8"
              >
                Ask us on WhatsApp
              </a>
            </Reveal>
          </div>

          <Reveal className="space-y-3">
            {UMRAH_FAQS.map((f, i) => (
              <div key={i} className={`relative overflow-hidden rounded-2xl border transition-colors duration-500 ${open === i ? 'border-white/20 bg-navy-950/92' : 'border-white/10 bg-navy-950/78'}`}>
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ scaleY: open === i ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-y-0 left-0 w-[3px] origin-top bg-gold-500"
                />
                {/* Each question is a heading so the Q&A reads as a clear list to
                    screen readers and crawlers. The answer text is always in the
                    DOM (and in the pre-rendered HTML), only visually collapsed. */}
                <h3 className="leading-[inherit] tracking-normal">
                <button
                  type="button"
                  id={`umrah-faq-q-${i}`}
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                  aria-controls={`umrah-faq-${i}`}
                  className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left font-display text-[1.1rem] font-bold text-white"
                >
                  {f.q}
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold-500/50 text-gold-400"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </motion.span>
                </button>
                </h3>
                <motion.div
                  id={`umrah-faq-${i}`}
                  role="region"
                  aria-labelledby={`umrah-faq-q-${i}`}
                  initial={false}
                  animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                  transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-[1.03rem] text-white/75 text-pretty">{f.a}</p>
                </motion.div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="pb-24 md:pb-28">
        <div className="wrap">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-navy-950 px-7 py-14 md:px-16 md:py-16">
              <Rosette stroke="rgb(232 163 23 / 0.22)" className="absolute -right-24 -bottom-24 -z-10 h-80 w-80" />
              <FlightPath
                className="mb-8 max-w-lg opacity-80"
                d="M 20 120 C 160 20, 360 10, 480 70 S 640 110, 680 40"
                viewBox="0 0 700 140"
                start="top 90%"
                end="bottom 45%"
              />
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div>
                  <SplitHeading className="h-sec !text-white text-balance">Planning your Umrah?</SplitHeading>
                  <p className="mt-5 max-w-xl text-[1.12rem] text-white/75 text-pretty">
                    Send us your travel window. We will come back with hotel names, walking distances and a clear
                    quotation.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-4 lg:items-end">
                  <a
                    href={waLink('Assalamu alaikum, please send me current Umrah package rates. Our travel window is:')}
                    target="_blank" rel="noopener noreferrer" className="btn btn-wa"
                  >
                    Send your travel window <span className="sr-only">on WhatsApp</span> <ArrowRight size={17} aria-hidden="true" />
                  </a>
                  <a href={`tel:${BIZ.phone}`} className="link-grow font-display text-[1rem] font-bold text-white/80">
                    or call {BIZ.phoneDisplay}
                  </a>
                  <Link to="/contact" className="link-grow font-display text-[1rem] font-bold text-white/80">
                    or visit our Shivaji Nagar office
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
