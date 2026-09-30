import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Check, Clock, CalendarDays, Info, ArrowRight, X, BadgeCheck } from 'lucide-react'

import { VISAS, VISA_TYPES, REGIONS, visaStats } from '../data/visas.js'
import { waLink } from '../data/site.js'
import { useHashScroll } from '../components/SmoothScroll.jsx'
import { Reveal, SectionHeading, PageHero } from '../components/ui.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'
import { Stagger, Parallax } from '../components/motion.jsx'
import {
  ImageReveal, Marquee, FlightPath, Spotlight, RevealGrid, RotatingBadge, Grain, introDone,
} from '../components/fx.jsx'
import { gsap, useGSAP, reduceMotion } from '../lib/gsap.js'

/* Tailwind needs literal class strings, so map tone → classes explicitly. */
const TONE = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  sky: 'bg-sky-50 text-sky-700 border-sky-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
}
const DOT = {
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
}

const TIPS = [
  ['Funds that look real', 'Six months of bank statements with a steady pattern beat a large last-minute deposit every time.'],
  ['A reason to return', 'Employment letter, business proof, property or family ties — the case for coming home matters most.'],
  ['A coherent itinerary', 'Flights, hotels and a day plan that actually fit the dates you have applied for.'],
  ['Correct insurance', 'Schengen requires €30,000 medical cover for the full stay. Wrong cover means a rejected file.'],
  ['Enough lead time', 'Apply early. Rushed applications leave no room for an extra document request.'],
]

/* Two ticker rows of destination names, drawn from the live list. */
const ROW_A = VISAS.filter((_, i) => i % 4 === 0)
const ROW_B = VISAS.filter((_, i) => i % 4 === 2)

/* Resolves when the intro curtain lifts — or after a ceiling, whatever happens. */
const heroReady = () => Promise.race([introDone, new Promise((r) => setTimeout(r, 3400))])

/* ============================================================
   HeroStat — counts up once the intro curtain has lifted, with
   a thin gold meter showing its share of all destinations.
   ============================================================ */
function HeroStat({ value, total, label, delay = 0 }) {
  const root = useRef(null)
  const num = useRef(null)
  const bar = useRef(null)
  const share = total ? value / total : 0

  useGSAP((ctx, contextSafe) => {
    const el = num.current
    if (!el || reduceMotion()) return
    const obj = { n: 0 }
    el.textContent = '0'
    gsap.set(bar.current, { scaleX: 0 })
    let dead = false
    const go = contextSafe(() => {
      if (dead) return
      gsap.to(obj, {
        n: value, duration: 1.9, delay: 0.55 + delay, ease: 'power3.out',
        onUpdate: () => { el.textContent = Math.round(obj.n) },
      })
      gsap.to(bar.current, { scaleX: share, duration: 2, delay: 0.55 + delay, ease: 'expo.out' })
    })
    heroReady().then(go)
    return () => { dead = true }
  }, { scope: root, dependencies: [value, total] })

  return (
    <div ref={root} className="glass min-w-[7.25rem] rounded-2xl px-5 py-3 transition-[translate] duration-500 hover:-translate-y-1">
      <div ref={num} className="font-display text-[1.54rem] leading-none font-extrabold text-gold-400 tabular-nums">{value}</div>
      <div className="mt-1 text-[0.84rem] text-white/60">{label}</div>
      <div aria-hidden="true" className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-white/12">
        <span
          ref={bar}
          className="block h-full origin-left rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
          style={{ transform: `scaleX(${share})` }}
        />
      </div>
    </div>
  )
}

/* Sliding highlight shared across a pill group (Framer layoutId). */
function PillBg({ id, className }) {
  return (
    <motion.span
      layoutId={id}
      aria-hidden="true"
      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
      className={`absolute inset-0 -z-10 rounded-full ${className}`}
    />
  )
}

export default function Visa() {
  useHashScroll() // /visa#passport
  const [q, setQ] = useState('')
  const [region, setRegion] = useState('All')
  const [type, setType] = useState('all')
  const stats = visaStats()

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return VISAS.filter((v) => {
      const okQ = !needle || v.c.toLowerCase().includes(needle) || v.r.toLowerCase().includes(needle)
      const okR = region === 'All' || v.r === region
      const okT = type === 'all' || v.t === type
      return okQ && okR && okT
    })
  }, [q, region, type])

  // Group the filtered results by region for readable output.
  const grouped = useMemo(() => {
    const map = new Map()
    list.forEach((v) => {
      if (!map.has(v.r)) map.set(v.r, [])
      map.get(v.r).push(v)
    })
    return [...map.entries()]
  }, [list])

  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1800&q=74"
        alt="Passport and travel documents"
        eyebrow="Visa & passport"
        title="Visa requirements for every country we book"
        sub="Most rejections come from paperwork, not from the applicant. We check every file line by line before it goes in."
      >
        <div className="flex flex-wrap gap-3">
          {[
            [stats.free, 'Visa Free'],
            [stats.arrival, 'On Arrival'],
            [stats.evisa, 'e-Visa'],
            [stats.embassy, 'Embassy'],
          ].map(([n, l], i) => (
            <HeroStat key={l} value={n} total={stats.total} label={l} delay={i * 0.12} />
          ))}
        </div>
      </PageHero>

      {/* ---------- Destination ticker ---------- */}
      <div className="relative isolate overflow-hidden bg-navy-950 py-7 md:py-9">
        <Grain />
        <div className="grid gap-2 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] md:gap-3">
          <Marquee speed={80}>
            {ROW_A.map((v) => (
              <span key={v.c} className="flex shrink-0 items-center gap-3 px-5 md:px-7">
                <span className={`h-2 w-2 shrink-0 rounded-full ${DOT[VISA_TYPES[v.t].tone]}`} />
                <span className="font-display text-[1.3rem] font-bold whitespace-nowrap text-white/90 md:text-[1.8rem]">{v.c}</span>
              </span>
            ))}
          </Marquee>
          <Marquee speed={95} reverse>
            {ROW_B.map((v) => (
              <span key={v.c} className="flex shrink-0 items-center gap-5 px-3 md:gap-7 md:px-4">
                <span className="accent text-[1.4rem] whitespace-nowrap text-gold-400/85 md:text-[1.95rem]">{v.c}</span>
                <span aria-hidden="true" className="text-[0.8rem] text-white/25">✦</span>
              </span>
            ))}
          </Marquee>
        </div>
      </div>

      {/* ---------- Browser ---------- */}
      <section className="section bg-white">
        <div className="wrap">
          <SectionHeading
            center
            eyebrow={`${stats.total} destinations`}
            title="Search visa rules for Indian passport holders"
            sub="Indicative timelines and entry types. Rules and fees change often — we confirm the current position for your exact case before you pay anything."
          />

          {/* Controls */}
          <Reveal>
            <div className="mb-10 rounded-4xl border border-slate-200 bg-slate-50 p-6">
              <div className="relative mb-5">
                <Search size={19} className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search a country — Dubai, Japan, Schengen, Kenya…"
                  aria-label="Search countries"
                  className="field !rounded-full !border-slate-200 !bg-white !py-3.5 !pr-12 !pl-12 !text-[1rem] md:!py-4 md:!pl-14 md:!text-[1.1rem]"
                />
                {q && (
                  <button
                    onClick={() => setQ('')}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-5 -translate-y-1/2 text-slate-500 hover:text-ink"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Type filter — a navy highlight slides between the active pill */}
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setType('all')}
                  className={`relative isolate rounded-full border px-4 py-2 text-[0.92rem] font-semibold transition-colors duration-300 ${
                    type === 'all' ? 'border-navy-950 text-white' : 'border-slate-200 bg-white hover:border-brand-500'
                  }`}
                >
                  {type === 'all' && <PillBg id="visa-type-pill" className="bg-navy-950" />}
                  All types
                </button>
                {Object.entries(VISA_TYPES).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setType(type === k ? 'all' : k)}
                    className={`relative isolate flex items-center gap-2 rounded-full border px-4 py-2 text-[0.92rem] font-semibold transition-colors duration-300 ${
                      type === k ? 'border-navy-950 text-white' : 'border-slate-200 bg-white hover:border-brand-500'
                    }`}
                  >
                    {type === k && <PillBg id="visa-type-pill" className="bg-navy-950" />}
                    <span className={`h-2 w-2 rounded-full ${DOT[v.tone]}`} />
                    {v.label}
                  </button>
                ))}
              </div>

              {/* Region filter — the blue highlight glides to the chosen region */}
              <div className="flex flex-wrap gap-2">
                {['All', ...REGIONS].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`relative isolate rounded-full px-4 py-2 text-[0.9rem] font-semibold transition-colors duration-300 ${
                      region === r ? 'text-white' : 'bg-white text-body hover:text-brand-500'
                    }`}
                  >
                    {region === r && <PillBg id="visa-region-pill" className="bg-brand-500" />}
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Results */}
          <p className="mb-7 text-[1.01rem] text-slate-500">
            Showing{' '}
            <motion.b
              key={list.length}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-ink tabular-nums"
            >
              {list.length}
            </motion.b>{' '}
            of {stats.total} destinations
          </p>

          {grouped.map(([r, items]) => (
            <div key={r} className="mb-12">
              <h3 className="mb-5 flex items-center gap-3 text-[1.26rem]">
                {r}
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="h-px flex-1 origin-left bg-gradient-to-r from-brand-500/60 via-slate-200 to-slate-200"
                />
                <span className="text-[0.88rem] font-semibold text-slate-500">{items.length}</span>
              </h3>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {items.map((v, i) => {
                  const meta = VISA_TYPES[v.t]
                  return (
                    <motion.div
                      key={v.c}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
                      className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-400 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[var(--shadow-lift)]"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <h4 className="min-w-0 font-display text-[1.14rem] font-bold text-ink">{v.c}</h4>
                        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.77rem] font-bold ${TONE[meta.tone]}`}>
                          {meta.label}
                        </span>
                      </div>

                      <div className="mb-4 grid gap-2 text-[0.95rem]">
                        <span className="flex items-center gap-2">
                          <Clock size={14} className="shrink-0 text-brand-500" /> {v.time}
                        </span>
                        <span className="flex items-center gap-2">
                          <CalendarDays size={14} className="shrink-0 text-brand-500" /> Stay up to {v.stay}
                        </span>
                      </div>

                      <p className="flex-1 text-[0.95rem] text-slate-500 text-pretty">{v.note}</p>

                      <a
                        href={waLink(`Hello Pro Tours & Travel Solutions, I need visa assistance for ${v.c}. Please share the checklist and current processing time.`)}
                        target="_blank" rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 font-display text-[0.95rem] font-bold text-brand-500"
                      >
                        Apply with us
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}

          {!list.length && (
            <div className="rounded-4xl border border-slate-200 bg-slate-50 py-20 text-center">
              <p className="text-[1.12rem]">
                No match for “<b className="text-ink">{q}</b>”.
              </p>
              <p className="mt-2 text-[1.02rem]">
                We handle destinations beyond this list too —{' '}
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-500">
                  just ask us
                </a>
                .
              </p>
            </div>
          )}

          <Reveal>
            <div className="mt-6 flex gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <Info size={20} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-[0.99rem] text-amber-900 text-pretty">
                <b>Important:</b> this table is indicative and maintained for guidance only. Visa rules, fees and
                processing times change frequently and vary by individual profile. Always confirm the current
                requirement with us before booking flights — we do this check free of charge.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Passport ---------- */}
      <section id="passport" className="section scroll-mt-24 bg-slate-50">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <div className="rounded-5xl shadow-[var(--shadow-lift)]">
              <ImageReveal className="rounded-5xl" from="left">
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=72"
                  alt="Passport application documents"
                  loading="lazy"
                  className="aspect-[4/3.2] w-full rounded-5xl object-cover"
                />
              </ImageReveal>
            </div>

            {/* A stamp that turns slowly over the corner of the photo */}
            <Reveal delay={0.55} className="absolute -top-8 left-4 z-10 lg:-left-8">
              <RotatingBadge
                text="Fresh • Renewal • Tatkal • Re-issue • "
                size={124}
                className="rounded-full bg-navy-950 shadow-[var(--shadow-lift)]"
                textClass="fill-gold-400"
              >
                <BadgeCheck size={30} strokeWidth={1.8} className="text-white" />
              </RotatingBadge>
            </Reveal>

            {/* Secondary image drifts against the scroll and floats */}
            <Parallax speed={0.4} className="absolute -right-6 -bottom-9 hidden w-44 lg:block">
              <div>
                <Reveal delay={0.7} y={50}>
                  <img
                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=72"
                    alt="" aria-hidden="true" loading="lazy"
                    className="animate-float aspect-square w-44 rounded-4xl border-[6px] border-white object-cover shadow-[var(--shadow-lift)]"
                  />
                </Reveal>
              </div>
            </Parallax>
          </div>

          <div>
            <Reveal><span className="eyebrow">Passport services</span></Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-sec mt-4 text-balance">Passport assistance — fresh, renewal &amp; tatkal</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-pretty">
                The passport process is straightforward until something is unusual — a name change, a lost booklet,
                a minor without both parents present, or an address that does not match your documents. That is where
                we are most useful.
              </p>
            </Reveal>
            <Stagger className="mt-8 grid gap-3.5" y={22} stagger={0.08}>
              {[
                'Fresh application, re-issue and renewal',
                'Tatkal applications when you are travelling at short notice',
                'Lost, damaged or exhausted-pages replacement',
                'Minors, post-marriage name change and address correction',
                'PSK appointment slots and document verification before you go',
              ].map((x) => (
                <div key={x} className="flex gap-3.5">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-500">
                    <Check size={12} strokeWidth={3.2} />
                  </span>
                  <span className="text-[1.07rem] text-pretty">{x}</span>
                </div>
              ))}
            </Stagger>
            <Reveal delay={0.32}>
              <a
                href={waLink('Hello, I need help with passport assistance.')}
                target="_blank" rel="noopener noreferrer" className="btn btn-brand mt-9"
              >
                Ask About Passport <ArrowRight size={16} />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Tips ---------- */}
      <section className="relative isolate overflow-hidden bg-navy-950 py-20 md:py-28">
        <img
          src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1800&q=70"
          alt="" aria-hidden="true" loading="lazy"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950/68 to-navy-900/55" />
        <Grain className="-z-10" />
        <FlightPath className="absolute inset-x-0 top-6 -z-[5] opacity-55 md:top-10" start="top 80%" end="bottom 40%" />

        <div className="wrap relative z-10">
          <SectionHeading
            center light
            eyebrow="Before you apply"
            title="Five things that decide most visa outcomes"
          />
          <RevealGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" stagger={0.1}>
            {TIPS.map(([t, d], i) => (
              <Spotlight key={t} className="h-full rounded-4xl transition-[translate] duration-500 hover:-translate-y-1.5">
                <div className="glass relative h-full overflow-hidden rounded-4xl p-7">
                  {/* oversized outline numeral */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1 -bottom-8 font-display text-[7rem] leading-none font-extrabold text-transparent transition-transform duration-700 [-webkit-text-stroke:1.5px_rgb(255_255_255/0.14)] group-hover/spot:-translate-y-2 group-hover/spot:scale-105"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative mb-5 grid h-11 w-11 place-items-center">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 animate-ping rounded-2xl bg-gold-500/40 [animation-duration:3.2s]"
                      style={{ animationDelay: `${i * 0.45}s` }}
                    />
                    <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gold-500 font-display text-[1.16rem] font-extrabold text-navy-950 transition-transform duration-500 group-hover/spot:scale-110 group-hover/spot:-rotate-6">
                      {i + 1}
                    </span>
                  </span>
                  <h4 className="relative font-display text-[1.1rem] font-bold !text-white">{t}</h4>
                  <p className="relative mt-2.5 text-[0.98rem] text-white/65 text-pretty">{d}</p>
                </div>
              </Spotlight>
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* ---------- Form ---------- */}
      <section className="section relative isolate overflow-hidden bg-white">
        <FlightPath
          className="absolute inset-x-0 top-4 -z-10 opacity-70"
          d="M 20 240 C 260 60, 520 40, 640 150 S 980 260, 1180 60"
          stroke="rgb(18 115 196 / 0.5)"
          guide="rgb(4 24 44 / 0.12)"
          plane="#1273c4"
          start="top 85%"
          end="center 45%"
        />
        <div className="wrap">
          <SectionHeading
            center
            eyebrow="Start here"
            title="Tell us where you are headed"
            sub="Share a few details and we will send you the exact checklist for your destination and profile."
          />
          <Reveal>
            <div className="mx-auto max-w-3xl rounded-5xl border border-slate-200 bg-slate-50 p-8 md:p-10">
              <EnquiryForm defaultService="Visa Services" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
