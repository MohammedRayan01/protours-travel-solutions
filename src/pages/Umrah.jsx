import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Moon, Star, Crown, Sparkles, ArrowRight, MapPin } from 'lucide-react'

import { BIZ, waLink } from '../data/site.js'
import { Reveal, SectionHeading } from '../components/ui.jsx'
import { SplitHeading, Stagger } from '../components/motion.jsx'
import {
  ImageReveal, Marquee, FlightPath, Spotlight, ScrubText, RevealGrid, RotatingBadge, introDone,
} from '../components/fx.jsx'
import { gsap, SplitText, useGSAP, EASE_EXPO, reduceMotion, enterTrigger } from '../lib/gsap.js'

/* Makkah / Madinah imagery — the page sits fully submerged in it. */
const BG = 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=2000&q=76'
const BG2 = 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1400&q=74'

const TIERS = [
  {
    name: 'Economy',
    icon: Star,
    duration: '10 Nights — 5 Makkah / 5 Madinah',
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
    icon: Sparkles,
    duration: '12 Nights — 6 Makkah / 6 Madinah',
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
    icon: Crown,
    duration: '14 Nights — 7 Makkah / 7 Madinah',
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
  ['Choose dates & tier', 'Tell us your travel window, how many people, and the hotel category you have in mind.'],
  ['Submit documents', 'Passport with 6+ months validity, photographs, vaccination record. We handle the rest.'],
  ['Visa & confirmations', 'Umrah visa, e-tickets and hotel vouchers reach you well before departure.'],
  ['Travel & support', 'Ground co-ordinator on arrival, plus a Bengaluru number on WhatsApp the whole time.'],
]

const UMRAH_FAQS = [
  { q: 'What documents do I need for an Umrah visa?', a: 'A passport valid for at least six months, recent white-background photographs, proof of vaccination as required that season, and basic personal details. Women under 45 travelling without a mahram should speak to us first — rules change and we will tell you the current position.' },
  { q: 'How far are the hotels from the Haram?', a: 'Economy hotels are typically 600–800 m, Deluxe within 300 m, and Premium are Haram-view properties. We give you the hotel name and the actual walking distance before you pay — never a vague "close to Haram".' },
  { q: 'Can you arrange a package for just my family?', a: 'Yes. Private family Umrah is common — your own dates, your own hotel choice, private transfers, and no group schedule to follow.' },
  { q: 'Do you handle Hajj as well?', a: 'Yes, subject to quota and the Hajj Committee process for that year. Hajj arrangements need to start many months ahead — contact us early so we can advise on the correct route for your case.' },
  { q: 'Is the quote per person or per family?', a: 'Per person, based on the room sharing shown in each tier. Double or triple occupancy changes the quote, and children sharing with parents are quoted separately. We break this down clearly for you.' },
]

/* Sacred sites of Makkah & Madinah — a calm ticker, names only. */
const PLACES = [
  'Masjid al-Haram', 'Al-Masjid an-Nabawi', 'Masjid Quba', 'Jabal al-Nour', 'Mount Uhud',
  'Masjid al-Qiblatayn', 'Jannat al-Baqi', 'Mina', 'Arafat', 'Muzdalifah', 'Jabal Thawr',
]

/* Resolves when the intro curtain lifts — or after a ceiling, whatever happens. */
const heroReady = () =>
  Promise.all([
    Promise.race([introDone, new Promise((r) => setTimeout(r, 3400))]),
    document.fonts?.ready ?? Promise.resolve(),
  ])

/* ============================================================
   Rosette — Islamic geometric line-art (overlapping rotated
   squares = a sixteen-point star inside a double ring) that
   inks itself in with DrawSVG, then turns very slowly.
   ============================================================ */
function Rosette({ className = '', stroke = 'rgb(232 163 23 / 0.6)', spin = 140, hero = false, width = 1 }) {
  const ref = useRef(null)

  useGSAP((ctx, contextSafe) => {
    const svg = ref.current
    if (!svg || reduceMotion()) return
    const lines = svg.querySelectorAll('[data-ink]')
    gsap.set(lines, { drawSVG: '0%' })
    const draw = () =>
      gsap.to(lines, { drawSVG: '100%', duration: 2.2, ease: 'power2.inOut', stagger: 0.09 })

    if (hero) {
      let dead = false
      const go = contextSafe(() => { if (!dead) draw().delay(0.35) })
      heroReady().then(go)
      return () => { dead = true }
    }
    gsap.to(lines, {
      drawSVG: '100%', duration: 2.2, ease: 'power2.inOut', stagger: 0.09,
      scrollTrigger: enterTrigger(svg, { start: 'top 88%' }),
    })
  }, { scope: ref })

  const sq = [0, 22.5, 45, 67.5]
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div className="animate-spin-slow h-full w-full" style={{ animationDuration: `${spin}s` }}>
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
   Hero — masked headline that rises after the intro curtain,
   a drawn rosette with a spinning division stamp, and content
   that drifts gently away as you scroll on.
   ============================================================ */
function UmrahHero() {
  const root = useRef(null)
  const content = useRef(null)

  useGSAP((ctx, contextSafe) => {
    if (reduceMotion()) return
    const q = gsap.utils.selector(root)
    const h1 = q('h1')[0]
    const fades = q('[data-hero-fade]')
    const badge = q('[data-hero-badge]')

    gsap.set(fades, { autoAlpha: 0, y: 28 })
    gsap.set(h1, { autoAlpha: 0 })
    gsap.set(badge, { autoAlpha: 0, scale: 0.55, rotate: -60 })

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
        .to(badge, { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.6 }, 0.7)
    })
    heroReady().then(go)

    // Calm exit: the copy lifts and softens as the page scrolls on.
    gsap.to(content.current, {
      yPercent: -14, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    })

    return () => { dead = true; split?.revert() }
  }, { scope: root })

  return (
    <section ref={root} className="relative isolate flex min-h-[70svh] items-center overflow-hidden md:min-h-[86svh]">
      {/* Mobile: the rosette sits faintly behind the headline */}
      <Rosette hero className="absolute -top-10 -right-28 -z-10 h-[340px] w-[340px] opacity-40 lg:hidden" />

      <div className="wrap grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1fr_auto]">
        <div ref={content} className="max-w-3xl">
          <span data-hero-fade className="glass inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-[0.9rem] font-semibold text-white/90">
            <Moon size={15} className="text-gold-400" /> Hajj &amp; Umrah Division
          </span>
          <h1 className="h-hero mt-7 !text-white text-balance">
            Umrah, arranged <span className="accent text-gold-400">properly</span>
          </h1>
          <p data-hero-fade className="mt-7 max-w-2xl text-[1.23rem] text-white/75 text-pretty">
            Visa, tickets and hotels near the Haram — handled by a team that has been sending groups from
            Bengaluru for years. We quote walking distances in metres, not adjectives.
          </p>
          <div data-hero-fade className="mt-10 flex flex-wrap gap-4">
            <a
              href={waLink('Hello Pro Tours & Travel Solutions, I would like to enquire about your Umrah packages.')}
              target="_blank" rel="noopener noreferrer" className="btn btn-gold"
            >
              Get Umrah Quote <ArrowRight size={17} />
            </a>
            <a href={`tel:${BIZ.phone}`} className="btn btn-glass">Call {BIZ.phoneDisplay}</a>
          </div>
        </div>

        {/* Desktop: drawn rosette with the spinning division stamp at its heart */}
        <div className="relative hidden h-[440px] w-[440px] place-items-center lg:grid" aria-hidden="true">
          <Rosette hero className="absolute inset-0" />
          <div className="absolute inset-[22%] rounded-full bg-gold-500/10 blur-3xl" />
          <div data-hero-badge>
            <RotatingBadge text="Hajj & Umrah Division • Bengaluru • " size={170} textClass="fill-white/85">
              <span className="glass-strong grid h-16 w-16 place-items-center rounded-full text-gold-400">
                <Moon size={26} />
              </span>
            </RotatingBadge>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Steps — four stages joined by a gold line that draws itself
   as you scroll; each number lights up as the line reaches it.
   Horizontal on desktop, vertical on mobile. Never pinned.
   ============================================================ */
function Steps() {
  const root = useRef(null)

  useGSAP(() => {
    if (reduceMotion()) return
    const q = gsap.utils.selector(root)
    const badges = q('[data-step-badge]')
    const segs = q('[data-step-seg]')
    const glows = q('[data-step-glow]')

    const mm = gsap.matchMedia()
    const build = (axis) => {
      gsap.set(segs, { [axis]: 0 })
      gsap.set(badges, { scale: 0.6, autoAlpha: 0.35, rotate: -45 })
      gsap.set(glows, { autoAlpha: 0 })
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top 78%', end: 'bottom 62%', scrub: 1 },
      })
      badges.forEach((b, i) => {
        tl.to(b, { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' })
          .to(glows[i], { autoAlpha: 1, duration: 0.4 }, '<')
        if (segs[i]) tl.to(segs[i], { [axis]: 1, duration: 1 })
      })
    }
    mm.add('(min-width: 1024px)', () => build('scaleX'))
    mm.add('(max-width: 1023.98px)', () => build('scaleY'))
    return () => mm.revert()
  }, { scope: root })

  return (
    <div ref={root}>
      <Stagger className="grid gap-6 lg:grid-cols-4" y={30}>
        {STEPS.map(([t, d], i) => (
          <div key={t} className="relative flex gap-5 lg:block">
            {/* connector to the next step */}
            {i < STEPS.length - 1 && (
              <span aria-hidden="true" className="absolute top-[3.25rem] -bottom-6 left-6 w-px -translate-x-1/2 bg-white/15 lg:top-6 lg:bottom-auto lg:left-[calc(50%+1.75rem)] lg:h-px lg:w-[calc(100%-2rem)] lg:translate-x-0">
                <span data-step-seg className="block h-full w-full origin-top bg-gradient-to-b from-gold-400 to-gold-500 lg:origin-left lg:bg-gradient-to-r" />
              </span>
            )}
            <span className="relative grid h-12 w-12 shrink-0 place-items-center lg:mx-auto">
              <span data-step-glow aria-hidden="true" className="absolute -inset-2 rounded-3xl bg-gold-500/35 blur-lg" />
              <span data-step-badge className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gold-500 font-display text-[1.26rem] font-extrabold text-navy-950 shadow-[0_10px_30px_-8px_rgb(232_163_23/0.7)]">
                {i + 1}
              </span>
            </span>
            <div className="glass min-w-0 flex-1 rounded-4xl p-7 lg:mt-7">
              <h4 className="font-display text-[1.14rem] font-bold !text-white">{t}</h4>
              <p className="mt-2.5 text-[1rem] text-white/65 text-pretty">{d}</p>
            </div>
          </div>
        ))}
      </Stagger>
    </div>
  )
}

export default function Umrah() {
  const [open, setOpen] = useState(0)

  return (
    /* The entire page is submerged in Makkah imagery, fixed behind the content. */
    <div className="relative isolate min-h-screen overflow-x-hidden">
      {/* Fixed background layer */}
      <div className="fixed inset-0 -z-30">
        <img src={BG} alt="" aria-hidden="true" className="h-full w-full object-cover" />
      </div>
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-navy-950/62 via-navy-950/48 to-navy-950/68" />
      <div className="pointer-events-none fixed -top-32 -left-32 -z-10 h-[520px] w-[520px] rounded-full bg-brand-500/18 blur-[140px]" />
      <div className="pointer-events-none fixed right-0 bottom-0 -z-10 h-[520px] w-[520px] rounded-full bg-gold-500/14 blur-[140px]" />

      {/* ---------- Hero ---------- */}
      <UmrahHero />

      {/* ---------- Ziyarat ticker ---------- */}
      <div className="border-y border-white/10 bg-navy-950/35 py-5 backdrop-blur-md">
        <Marquee speed={70} className="[mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          {PLACES.map((p) => (
            <span key={p} className="flex shrink-0 items-center gap-6 px-6">
              <span className="font-display text-[0.95rem] font-bold tracking-[0.22em] whitespace-nowrap text-white/75 uppercase">{p}</span>
              <StarGlyph className="h-3 w-3 text-gold-400/80" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* ---------- Why us ---------- */}
      <section className="section">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <Rosette spin={180} className="absolute -top-12 -left-12 hidden h-44 w-44 opacity-70 md:block" />
              <div className="glass-strong relative rounded-5xl p-3">
                <ImageReveal className="rounded-4xl" from="bottom">
                  <img src={BG2} alt="Al-Masjid an-Nabawi, Madinah" loading="lazy" className="aspect-[4/3.2] w-full rounded-4xl object-cover" />
                </ImageReveal>
                <span className="glass-strong animate-float absolute bottom-7 left-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.86rem] font-semibold text-white">
                  <MapPin size={14} className="text-gold-400" /> Madinah
                </span>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading light eyebrow="Our Umrah desk" title="For pilgrims, the details are not a luxury" className="!mb-6 md:!mb-7" />
            <ScrubText className="font-display text-[1.28rem] leading-[1.55] font-medium text-white text-pretty md:text-[1.42rem]" dim={0.2}>
              How far the hotel really is from Bab-us-Salam. Whether the transfer waits or leaves. Whether someone
              who speaks your language is reachable at 3 AM in Madinah. These are the things that decide whether an
              Umrah feels peaceful or stressful.
            </ScrubText>
            <Stagger className="mt-9 grid gap-3.5" y={22} stagger={0.08}>
              {[
                'Umrah visa processing with full document guidance',
                'Direct and one-stop flights from Bengaluru',
                'Verified walking distances to the Haram — in metres',
                'Ziyarat in Makkah and Madinah with a knowledgeable guide',
                'Group departures in Ramadan and school holidays',
              ].map((x) => (
                <div key={x} className="flex gap-3.5">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-500/20 text-gold-400">
                    <Check size={13} strokeWidth={3.2} />
                  </span>
                  <span className="text-[1.08rem] text-white/80 text-pretty">{x}</span>
                </div>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ---------- Tiers ---------- */}
      <section className="section">
        <div className="wrap">
          <SectionHeading
            center light
            eyebrow="Choose your tier"
            title="Umrah packages from Bengaluru"
            sub="Per person, based on the sharing shown. Includes visa, return airfare, hotels and transfers. Ask us for today's exact quote."
            className="md:!mb-16"
          />

          <RevealGrid className="grid gap-11 lg:grid-cols-3 lg:gap-7" stagger={0.12}>
            {TIERS.map((t) => (
              <Spotlight
                key={t.name}
                className="isolate h-full rounded-5xl transition-[translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2"
                color={t.featured ? 'rgb(232 163 23 / 0.2)' : 'rgb(255 255 255 / 0.1)'}
              >
                {t.featured && (
                  <span aria-hidden="true" className="pointer-events-none absolute -inset-3 -z-10 rounded-[2.75rem] bg-gold-500/20 blur-2xl animate-pulse [animation-duration:5s]" />
                )}
                <div
                  className={`relative flex h-full flex-col rounded-5xl p-8 ${
                    t.featured ? 'glass-strong ring-2 ring-gold-500/60' : 'glass'
                  }`}
                >
                  {/* gentle light sweep on hover */}
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                    <span className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/14 to-transparent opacity-0 transition-[translate,opacity] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/spot:translate-x-[320%] group-hover/spot:opacity-100" />
                  </span>

                  {t.featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-4 py-1.5 font-display text-[0.73rem] font-extrabold tracking-[0.12em] text-navy-950 uppercase">
                      Most chosen
                    </span>
                  )}

                  <span className={`mb-6 grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/spot:scale-110 group-hover/spot:-rotate-6 ${t.featured ? 'bg-gold-500 text-navy-950' : 'bg-white/12 text-gold-400'}`}>
                    <t.icon size={25} strokeWidth={1.9} />
                  </span>

                  <h3 className="!text-white text-[1.54rem]">{t.name}</h3>
                  <span className="mt-1.5 block text-[0.94rem] font-semibold text-brand-300">{t.duration}</span>

                  <ul className="mt-7 grid flex-1 gap-3">
                    {t.inc.map((x) => (
                      <li key={x} className="flex gap-3 text-[1.01rem] text-white/75">
                        <Check size={15} strokeWidth={3} className="mt-1 shrink-0 text-gold-400" />
                        <span className="text-pretty">{x}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={waLink(`Hello Pro Tours & Travel Solutions, I am interested in the Umrah ${t.name} package (${t.duration}). Please share current rates and availability.`)}
                    target="_blank" rel="noopener noreferrer"
                    className={`btn relative z-20 mt-8 w-full ${t.featured ? 'btn-gold' : 'btn-glass'}`}
                  >
                    Enquire
                  </a>
                </div>
              </Spotlight>
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="section">
        <div className="wrap">
          <SectionHeading center light eyebrow="Your journey" title="How an Umrah booking works with us" className="md:!mb-16" />
          <Steps />
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section">
        <div className="wrap grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative isolate">
            <Rosette spin={200} stroke="rgb(255 255 255 / 0.22)" className="absolute -top-16 -right-4 -z-10 h-56 w-56 md:-right-10 md:h-72 md:w-72" />
            <SectionHeading
              light
              eyebrow="Common questions"
              title="Umrah FAQs"
              sub="Anything not covered here — just ask. First-time pilgrims are welcome to call and take their time."
              className="!mb-0 md:!mb-0"
            />
            <Reveal delay={0.24}>
              <a
                href={waLink('Hello, I have a question about Umrah.')}
                target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-8"
              >
                Ask a Question
              </a>
            </Reveal>
          </div>

          <Stagger className="space-y-3" y={26} stagger={0.07}>
            {UMRAH_FAQS.map((f, i) => (
              <div key={i} className={`relative overflow-hidden rounded-3xl transition-colors duration-500 ${open === i ? 'glass-strong' : 'glass'}`}>
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ scaleY: open === i ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-y-0 left-0 w-[3px] origin-top bg-gradient-to-b from-gold-400 to-gold-500"
                />
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left font-display text-[1.11rem] font-bold text-white"
                >
                  {f.q}
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-500/20 text-gold-400"
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
                  <p className="px-6 pb-6 text-[1.04rem] text-white/70 text-pretty">{f.a}</p>
                </motion.div>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="pb-28">
        <div className="wrap">
          <Reveal>
            <Spotlight className="rounded-5xl" color="rgb(232 163 23 / 0.14)" size={620}>
              <div className="glass-strong relative isolate overflow-hidden rounded-5xl px-8 py-16 text-center md:px-16">
                <Rosette spin={160} stroke="rgb(232 163 23 / 0.35)" className="absolute -bottom-24 -left-24 -z-10 h-72 w-72" />
                <Rosette spin={220} stroke="rgb(255 255 255 / 0.18)" className="absolute -top-28 -right-20 -z-10 h-80 w-80" />
                <FlightPath
                  className="mx-auto -mt-4 mb-8 max-w-xl opacity-90"
                  d="M 20 120 C 160 20, 360 10, 480 70 S 640 110, 680 40"
                  viewBox="0 0 700 140"
                  start="top 90%"
                  end="bottom 45%"
                />
                <SplitHeading className="h-sec !text-white text-balance">Planning your Umrah?</SplitHeading>
                <p className="mx-auto mt-5 max-w-xl text-[1.14rem] text-white/70 text-pretty">
                  Send us your travel window. We will come back with hotel names, walking distances and a clear
                  quotation.
                </p>
                <div className="relative z-20 mt-10 flex flex-wrap justify-center gap-4">
                  <a
                    href={waLink('Hello Pro Tours & Travel Solutions, please send me current Umrah package rates.')}
                    target="_blank" rel="noopener noreferrer" className="btn btn-gold"
                  >
                    Get Umrah Quote
                  </a>
                  <a href={`tel:${BIZ.phone}`} className="btn btn-glass">Call {BIZ.phoneDisplay}</a>
                </div>
              </div>
            </Spotlight>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
