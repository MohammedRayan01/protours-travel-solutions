import { useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { MapPin, Check, X, Crown, Star, Sparkles, Hotel } from 'lucide-react'

import { PACKAGES, TIERS, waLink } from '../data/site.js'
import { Reveal, SectionHeading, PageHero } from '../components/ui.jsx'
import { Marquee, Spotlight, RevealGrid, Orbs, Grain } from '../components/fx.jsx'
import { gsap, useGSAP, reduceMotion, enterTrigger } from '../lib/gsap.js'

const FILTERS = [
  { k: 'all', label: 'All Packages' },
  { k: 'international', label: 'International' },
  { k: 'india', label: 'India' },
  { k: 'honeymoon', label: 'Honeymoon' },
  { k: 'family', label: 'Family' },
  { k: 'cruise', label: 'Cruise' },
  { k: 'umrah', label: 'Umrah' },
]

const TIER_META = {
  Economy: { icon: Star,     blurb: 'Smart value, everything essential covered' },
  Deluxe:  { icon: Sparkles, blurb: 'Better hotels, more inclusions, private transfers' },
  Premium: { icon: Crown,    blurb: 'Five-star throughout, private guides, full board' },
}

// Destinations taken straight from the package list, for the ticker band.
const DESTINATIONS = [
  'Dubai', 'Maldives', 'Bali', 'Singapore', 'Europe', 'Phuket & Krabi',
  'Kerala', 'Kashmir', 'Golden Triangle', 'Goa', 'Arabian Gulf', 'Makkah & Madinah',
]

const PROMISES = [
  'Three tiers on every package', 'Confirmed hotel vouchers', 'All listed transfers',
  'Visa guidance', 'On-trip WhatsApp support',
]

const INCLUDED = [
  ['Confirmed hotel vouchers', 'Issued before you travel, never “on request”.'],
  ['All listed transfers', 'Airport pickups and inter-city moves, no surprise add-ons.'],
  ['Visa guidance', 'Checklist, forms and appointment support for the destination.'],
  ['On-trip WhatsApp support', 'A number that answers while you are actually travelling.'],
]

const SPRING = { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 }

/* A ring + tick that ink themselves in as the card enters. */
function DrawCheck({ delay = 0 }) {
  const ref = useRef(null)
  useGSAP(() => {
    const paths = ref.current?.querySelectorAll('path, circle')
    if (!paths?.length) return
    if (reduceMotion()) { gsap.set(paths, { drawSVG: '100%' }); return }
    gsap.fromTo(paths, { drawSVG: '0%' }, {
      drawSVG: '100%', duration: 1.1, ease: 'power2.inOut', stagger: 0.35, delay,
      scrollTrigger: enterTrigger(ref.current, { start: 'top 90%' }),
    })
  }, { scope: ref })
  return (
    <svg ref={ref} viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12" fill="none">
      <circle cx="24" cy="24" r="21" stroke="#e8a317" strokeWidth="2.2" transform="rotate(-90 24 24)" />
      <path d="M15 24.5l6 6 12-13" stroke="#1273c4" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PackageCard({ p, tier, delay }) {
  const t = p.tiers[tier]
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 26, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]"
    >
      <Spotlight className="flex h-full flex-1 flex-col" color="rgb(18 115 196 / 0.08)" size={520}>
        <div className="relative aspect-[16/11] overflow-hidden">
          <img
            src={p.img}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
          {/* Light sweep across the photo on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.28)_50%,transparent_65%)] transition-transform duration-[1300ms] ease-[var(--ease-out-expo)] group-hover:translate-x-full"
          />
          <span className="glass absolute top-4 left-4 max-w-[calc(100%-2rem)] truncate rounded-full px-3.5 py-1.5 text-[0.72rem] font-bold tracking-wide text-white uppercase">
            {p.badge}
          </span>
          <span className="absolute right-4 bottom-4 rounded-full bg-gold-500 px-3.5 py-1.5 font-display text-[0.86rem] font-extrabold text-navy-950 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1">
            {p.nights}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-7">
          <span className="mb-2 flex items-center gap-1.5 text-[0.86rem] font-semibold text-brand-500">
            <MapPin size={13} /> {p.region}
          </span>
          <h3 className="text-[1.28rem]">{p.name}</h3>
          <p className="mt-2.5 text-[1.02rem] text-pretty">{p.desc}</p>

          {/* Tier detail */}
          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <div className="mb-3.5 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Hotel size={15} className="text-brand-500" />
              <span className="font-display text-[0.95rem] font-bold text-ink">{t.hotel}</span>
            </div>
            <ul className="grid gap-2.5">
              {t.inc.map((x) => (
                <li key={x} className="flex gap-2.5 text-[0.96rem]">
                  <Check size={14} strokeWidth={3} className="mt-1 shrink-0 text-brand-500" />
                  <span className="text-pretty">{x}</span>
                </li>
              ))}
            </ul>

            {p.exc?.length > 0 && (
              <>
                <div className="mt-4 mb-3.5 flex items-center gap-2 border-t border-slate-200 pt-3.5">
                  <X size={15} className="text-slate-400" />
                  <span className="font-display text-[0.85rem] font-bold text-slate-500">Not included</span>
                </div>
                <ul className="grid gap-2.5">
                  {p.exc.map((x) => (
                    <li key={x} className="flex gap-2.5 text-[0.92rem] text-slate-500">
                      <X size={14} strokeWidth={3} className="mt-1 shrink-0 text-slate-400" />
                      <span className="text-pretty">{x}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="relative z-20 mt-auto flex flex-col items-start gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <span className="block text-[0.75rem] tracking-wider text-slate-500 uppercase">
              {tier} · per person
            </span>
            <a
              href={waLink(`Hello Pro Tours & Travel Solutions, I am interested in: ${p.name} — ${tier} tier. Please share details and availability.`)}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-gold !px-5 !py-2.5 !text-[0.95rem]"
            >
              Enquire
            </a>
          </div>
        </div>
      </Spotlight>
      {/* Gold rule that draws across the card foot on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-500 via-gold-400 to-brand-400 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
      />
    </motion.article>
  )
}

export default function Packages() {
  const [filter, setFilter] = useState('all')
  const [tier, setTier] = useState('Deluxe')

  const list = useMemo(
    () => (filter === 'all' ? PACKAGES : PACKAGES.filter((p) => p.cats.includes(filter))),
    [filter]
  )

  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=74"
        alt="Tropical beach at sunset"
        eyebrow="Tour packages"
        title="Holidays you can actually book this month"
        sub="Every destination comes in three tiers — Economy, Deluxe and Premium. Same trip, your choice of comfort, on twin sharing."
      />

      {/* ---- Tier selector ---- */}
      <section className="relative isolate overflow-hidden bg-white pt-16">
        <Orbs tone="light" className="opacity-60" />
        <div className="wrap">
          <SectionHeading
            center
            eyebrow="Choose your comfort"
            title="Three tiers on every package"
            sub="Pick a tier and every card below updates to show that hotel category and those inclusions."
          />

          <LayoutGroup id="tiers">
            <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TIERS.map((t, i) => {
                const M = TIER_META[t]
                const active = tier === t
                return (
                  <Reveal key={t} delay={i * 0.07}>
                    <button
                      onClick={() => setTier(t)}
                      aria-pressed={active}
                      className={`relative isolate w-full rounded-4xl border-2 p-6 text-left transition-[transform,border-color,background-color] duration-500 ease-[var(--ease-out-expo)] ${
                        active
                          ? 'border-transparent bg-transparent'
                          : 'border-slate-200 bg-white/80 hover:-translate-y-1 hover:border-brand-500/40'
                      }`}
                    >
                      {/* The navy + gold selection slab glides between tiers */}
                      {active && (
                        <motion.span
                          layoutId="tier-slab"
                          aria-hidden="true"
                          transition={SPRING}
                          className="absolute -inset-[2px] -z-10 overflow-hidden rounded-4xl border-2 border-gold-500 bg-navy-950 shadow-[var(--shadow-lift)]"
                        >
                          <span className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-gold-500/20 blur-3xl" />
                          <span className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-brand-500/30 blur-3xl" />
                        </motion.span>
                      )}
                      <span className="mb-4 flex items-center justify-between">
                        <motion.span
                          animate={{ rotate: active ? [0, -12, 8, 0] : 0, scale: active ? [1, 1.12, 1] : 1 }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                          className={`grid h-12 w-12 place-items-center rounded-2xl transition-colors duration-500 ${
                            active ? 'bg-gold-500 text-navy-950' : 'bg-brand-500/10 text-brand-500'
                          }`}
                        >
                          <M.icon size={22} strokeWidth={1.9} />
                        </motion.span>
                        {/* Comfort meter: one, two or three bars */}
                        <span aria-hidden="true" className="flex items-end gap-1">
                          {[0, 1, 2].map((b) => (
                            <motion.span
                              key={b}
                              initial={false}
                              animate={{ scaleY: b <= i ? 1 : 0.45, opacity: b <= i ? 1 : 0.35 }}
                              transition={{ duration: 0.5, delay: active ? b * 0.08 : 0, ease: [0.16, 1, 0.3, 1] }}
                              style={{ height: 10 + b * 7 }}
                              className={`block w-1.5 origin-bottom rounded-full ${
                                b <= i ? (active ? 'bg-gold-400' : 'bg-brand-500') : active ? 'bg-white/40' : 'bg-slate-300'
                              }`}
                            />
                          ))}
                        </span>
                      </span>
                      <span className={`block font-display text-[1.26rem] font-extrabold transition-colors duration-500 ${active ? 'text-white' : 'text-ink'}`}>
                        {t}
                      </span>
                      <span className={`mt-1.5 block text-[0.96rem] text-pretty transition-colors duration-500 ${active ? 'text-white/65' : 'text-body'}`}>
                        {M.blurb}
                      </span>
                    </button>
                  </Reveal>
                )
              })}
            </div>
          </LayoutGroup>
        </div>
      </section>

      {/* ---- Filters + grid ---- */}
      <section className="section bg-white pt-14">
        <div className="wrap">
          <Reveal>
            <LayoutGroup id="filters">
              <div className="mb-6 flex flex-wrap justify-center gap-2.5">
                {FILTERS.map((f) => {
                  const on = filter === f.k
                  return (
                    <button
                      key={f.k}
                      onClick={() => setFilter(f.k)}
                      aria-pressed={on}
                      className={`relative isolate rounded-full border-[1.5px] px-5 py-2.5 font-display text-[0.97rem] font-bold transition-[transform,color,border-color] duration-300 ${
                        on
                          ? 'border-navy-950 text-white'
                          : 'border-slate-200 bg-white text-body hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-500'
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="filter-pill"
                          aria-hidden="true"
                          transition={SPRING}
                          className="absolute -inset-[1.5px] -z-10 rounded-full bg-navy-950 shadow-[0_10px_30px_-12px_rgb(4_24_44/0.6)]"
                        />
                      )}
                      {f.label}
                    </button>
                  )
                })}
              </div>
            </LayoutGroup>
          </Reveal>

          {/* Live status line — the tier word flips when it changes */}
          <p aria-live="polite" className="mb-10 flex flex-wrap items-center justify-center gap-x-1.5 text-center text-[0.95rem] text-slate-500">
            Showing
            <motion.span
              key={`n-${list.length}-${filter}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-extrabold text-ink"
            >
              {list.length}
            </motion.span>
            {list.length === 1 ? 'package' : 'packages'} in
            <span className="relative inline-grid overflow-hidden align-bottom">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={tier}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-full bg-gold-500/15 px-2.5 font-display font-extrabold text-gold-600"
                >
                  {tier}
                </motion.span>
              </AnimatePresence>
            </span>
            tier
          </p>

          <motion.div layout className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <PackageCard key={`${p.id}-${tier}`} p={p} tier={tier} delay={(i % 3) * 0.07} />
              ))}
            </AnimatePresence>
          </motion.div>

          {!list.length && (
            <p className="py-16 text-center">
              Nothing in this category yet — but we build tailor-made trips every day.{' '}
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-500">
                Tell us what you want.
              </a>
            </p>
          )}
        </div>
      </section>

      {/* ---- Destination ticker band ---- */}
      <section aria-label="Destinations we package" className="relative isolate overflow-hidden bg-navy-950 py-12 md:py-16">
        <Orbs />
        <Grain />
        <Marquee speed={48} className="[mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          {DESTINATIONS.map((d, k) => (
            <span key={d} className="flex shrink-0 items-center">
              <span
                className={`px-6 font-display text-[clamp(2.1rem,5.6vw,4.4rem)] leading-none font-extrabold tracking-[-0.03em] whitespace-nowrap md:px-9 ${
                  k % 2 ? 'text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.55)]' : 'text-white'
                }`}
              >
                {k % 3 === 1 ? <span className="accent font-semibold text-gold-400">{d}</span> : d}
              </span>
              <Sparkles aria-hidden="true" size={26} className="shrink-0 text-gold-500" />
            </span>
          ))}
        </Marquee>
        <Marquee speed={36} reverse className="mt-6 md:mt-8">
          {PROMISES.map((t) => (
            <span key={t} className="flex shrink-0 items-center gap-6 px-6 font-display text-[0.86rem] font-bold tracking-[0.26em] whitespace-nowrap text-white/55 uppercase">
              {t}
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* ---- Always included ---- */}
      <section className="section relative isolate overflow-hidden bg-slate-50">
        <Orbs tone="light" className="opacity-70" />
        <div className="wrap">
          <SectionHeading center eyebrow="Every package includes" title="What is always included" />
          <RevealGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {INCLUDED.map(([t, d], i) => (
              <Spotlight key={t} className="h-full rounded-4xl">
                <div className="group relative h-full overflow-hidden rounded-4xl border border-slate-200 bg-white/85 p-7 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-[var(--shadow-lift)]">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-4 right-4 font-display text-[5.5rem] leading-none font-extrabold text-transparent [-webkit-text-stroke:1.5px_rgb(18_115_196/0.14)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mb-5 block">
                    <DrawCheck delay={0.25 + i * 0.12} />
                  </span>
                  <h4 className="relative font-display text-[1.12rem] font-bold text-ink">{t}</h4>
                  <p className="relative mt-2 text-[1.01rem] text-pretty">{d}</p>
                </div>
              </Spotlight>
            ))}
          </RevealGrid>
        </div>
      </section>
    </>
  )
}
