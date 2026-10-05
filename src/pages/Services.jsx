import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowRight, MessageCircle } from 'lucide-react'

import { BIZ, SERVICES, waLink } from '../data/site.js'
import { Reveal, SectionHeading, PageHero, Parallax, SplitHeading } from '../components/ui.jsx'
import { ImageReveal, FlightPath, Polaroid, CircleMark } from '../components/fx.jsx'
import { useHashScroll } from '../components/SmoothScroll.jsx'
import { gsap, useGSAP, reduceMotion, enterTrigger, EASE } from '../lib/gsap.js'
import { photo } from '../lib/img.js'

/* Margin notes — the kind of thing someone scribbles beside a list.
   Deliberately not claims: just the question each service starts with. */
const NOTES = {
  flights: 'aisle or window?',
  hotels: 'dates might move? ask about free cancellation',
  tailor: 'your pace, your dates',
  tours: 'same route, three tiers',
  visa: 'the checklist comes first',
  passport: 'tatkal, when time is short',
  umrah: 'distance in metres',
}

/* Where each service has a page of its own. */
const RELATED = {
  umrah: { to: '/umrah', label: 'Umrah packages from Bengaluru' },
  visa: { to: '/visa', label: 'Visa guide' },
  passport: { to: '/visa#passport', label: 'Passport help' },
  tours: { to: '/packages', label: 'Browse tour packages' },
  tailor: { to: '/contact', label: 'Plan it with us in person' },
  flights: { to: '/flights-hotels#flights', label: 'Flight booking' },
  hotels: { to: '/flights-hotels#hotels', label: 'Hotel booking' },
}

/* What each photograph actually shows (keyed by Unsplash photo id). */
const ALT = {
  '1436491865332': 'Aircraft wing above sunlit clouds',
  '1566073771259': 'Resort pool and sun loungers beside a timber lodge',
  '1488646953014': 'Travel map, notebook, camera and backpack laid out for trip planning',
  '1469854523086': 'Camper van on a desert road between red rock formations',
  '1450101499163': 'Hand signing a document with a fountain pen',
  '1554224155': 'Paperwork, forms and a calculator spread across a desk',
  '1580418827493': 'The clock towers above Masjid al-Haram in Makkah',
}

/* Responsive sources, computed once. The main photo fills 5 of 12
   columns on desktop and the full width below that. */
const MAIN_IMG = Object.fromEntries(SERVICES.map((s) => [s.id, {
  ...photo(s.img, { sizes: '(min-width: 1280px) 520px, (min-width: 1024px) 40vw, 100vw', widths: [480, 768, 1080, 1440] }),
  alt: ALT[s.img.match(/photo-(\d+)/)?.[1]] ?? s.title,
}]))

const EXTRAS = [
  { img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=72', alt: 'Signing a travel insurance document', title: 'Travel insurance advice', desc: 'We are insurance consultants, not insurers: we help you compare and choose Schengen-compliant medical cover, trip cancellation, baggage and senior-citizen plans. The policy is issued by the insurance company, which also decides claims.' },
  { img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=72', alt: 'Driver’s hands on the steering wheel of a car at dusk', title: 'Transfers & car rental', desc: 'Airport pickups, chauffeur-driven cars and coach hire for groups, in India and at your destination.' },
  { img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=72', alt: 'Two colleagues high-fiving across an office desk with a laptop', title: 'Corporate travel desk', desc: 'Credit terms, GST invoicing, policy-compliant fares, monthly MIS reports and a named consultant for your company.' },
]
const EXTRA_IMG = EXTRAS.map((e) => photo(e.img, { sizes: '(min-width: 768px) 31vw, 100vw', widths: [480, 768, 1080] }))

/* A list whose items rise in sequence as it scrolls in — the same motion
   as <Stagger>, but rendered as a real <ul>/<ol> so it reads as a list. */
function StaggerList({ as: Tag = 'ul', children, className = '', stagger = 0.07, y = 16 }) {
  const ref = useRef(null)
  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const kids = gsap.utils.toArray(el.children)
    if (!kids.length) return
    if (reduceMotion()) { gsap.set(kids, { opacity: 1, y: 0 }); return }
    gsap.fromTo(kids, { opacity: 0, y }, {
      opacity: 1, y: 0, duration: 0.95, ease: EASE, stagger: { each: stagger },
      scrollTrigger: enterTrigger(el),
    })
  }, { scope: ref })
  return <Tag ref={ref} role="list" className={className}>{children}</Tag>
}

/* The dark CTA band opens from an inset "window" to full width as it
   scrolls in. clip-path only, so layout never moves. */
function ExpandBand({ children, className = '' }) {
  const ref = useRef(null)
  useGSAP(() => {
    const el = ref.current
    if (!el || reduceMotion()) return
    gsap.fromTo(el,
      { clipPath: 'inset(5% 6% 5% 6% round 1.75rem)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 1.75rem)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 50%', scrub: 0.8 },
      })
  }, { scope: ref })
  return <div ref={ref} className={className}>{children}</div>
}

/* The service number, written large in the margin, with a short ink
   stroke that draws under it as the block arrives. */
function MarginNumber({ num }) {
  const ref = useRef(null)
  useGSAP(() => {
    const el = ref.current
    const p = el?.querySelector('path')
    const n = el?.querySelector('[data-num]')
    if (!p || !n) return
    if (reduceMotion()) { gsap.set(p, { drawSVG: '100%' }); return }
    const tl = gsap.timeline({ scrollTrigger: enterTrigger(el, { start: 'top 85%' }) })
    tl.fromTo(n, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out' })
      .fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' }, '-=0.5')
  }, { scope: ref })
  return (
    <div ref={ref} className="overflow-hidden">
      <span data-num className="block font-accent text-[3.4rem] leading-none font-semibold text-gold-600 italic md:text-[4.4rem]">
        {num}
      </span>
      <svg viewBox="0 0 90 10" aria-hidden="true" fill="none" className="mt-1 h-2.5 w-20">
        <path d="M2 6c14-4 26-4 40-1s30 3 46-2" stroke="#b4532a" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

/* A small hand-drawn tick, static — these are list bullets, not effects. */
function Tick() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" className="mt-1.5 h-4 w-4 shrink-0">
      <path d="M3 11c2 1.5 3.5 3 4.5 5C10 10 13 6 17.5 3" stroke="#0f5e9e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ServiceBlock({ s, i }) {
  const flip = i % 2 === 1
  const num = String(i + 1).padStart(2, '0')
  const rel = RELATED[s.id]
  const tall = i % 3 === 1
  const img = MAIN_IMG[s.id]

  return (
    <section
      id={s.id}
      aria-label={s.title}
      className={`section scroll-mt-24 overflow-x-clip ${i % 2 === 0 ? 'bg-white' : 'paper bg-sand'}`}
    >
      <div className="wrap grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Margin column: number + note */}
        <div className="flex items-end gap-5 lg:col-span-2 lg:flex-col lg:items-start lg:gap-3">
          <MarginNumber num={num} />
          <Reveal delay={0.2}>
            <p className="note max-w-[12rem] pb-2 text-[1.12rem] leading-snug text-navy-900/75 lg:pb-0">{NOTES[s.id]}</p>
          </Reveal>
        </div>

        {/* Copy */}
        <div className={`lg:col-span-5 ${flip ? 'lg:order-3' : ''}`}>
          <p className="font-display text-[0.78rem] font-bold tracking-[0.2em] text-slate-500 uppercase">{s.short}</p>
          <SplitHeading className="h-sec mt-3 text-balance">
            {s.title}
          </SplitHeading>
          <Reveal delay={0.1}>
            <p className="mt-5 text-[1.12rem] text-pretty">{s.desc}</p>
          </Reveal>

          <StaggerList className="mt-7 grid gap-3 border-t border-slate-200 pt-6">
            {s.points.map((p) => (
              <li key={p} className="flex gap-3">
                <Tick />
                <span className="text-[1.05rem] text-pretty">{p}</span>
              </li>
            ))}
          </StaggerList>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={waLink(`Hello Pro Tours & Travel Solutions, I would like to ask about ${s.title}.`)}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <MessageCircle size={17} aria-hidden="true" /> Ask on WhatsApp
                <span className="sr-only"> about {s.title}</span>
              </a>
              {rel && (
                <Link to={rel.to} className="group/rel inline-flex items-center gap-1.5 font-display font-bold text-brand-500">
                  <span className="link-grow">{rel.label}</span>
                  <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover/rel:translate-x-1" />
                </Link>
              )}
            </div>
          </Reveal>
        </div>

        {/* Photos: a curtain reveal with a slow drift inside, plus a pinned print */}
        <div className={`relative lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
          <ImageReveal from={flip ? 'left' : 'right'} className={`relative rounded-3xl ${tall ? 'aspect-[4/4.4]' : 'aspect-[4/3.2]'}`}>
            <Parallax speed={0.12} className="absolute inset-0">
              <img
                {...img}
                width={1080}
                height={864}
                loading="lazy"
                decoding="async"
                className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
              />
            </Parallax>
          </ImageReveal>
          <div className={`absolute -bottom-8 hidden w-40 sm:block md:w-44 ${flip ? '-left-3' : '-right-3'}`}>
            <Parallax speed={-0.25}>
              <div>
                <Polaroid src={s.img2} alt="" caption={null} rotate={flip ? -5 : 4} imgClassName="aspect-square" />
              </div>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Services() {
  // Deep links like /services#hotels land on that block.
  useHashScroll()

  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=74"
        alt="Aircraft wing above the clouds"
        eyebrow="Our services"
        title="Seven travel services, one desk in Bengaluru"
        sub="Flight booking, hotels, tour packages and Umrah, plus consultancy for visas, passports and travel insurance. The same people look after your booking from the first message to the flight home."
      />

      {/* ---- Index: a contents page, not a ticker ---- */}
      <nav aria-labelledby="index-title" className="section bg-white">
        <div className="wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <span className="eyebrow">What we do</span>
            <h2 id="index-title" className="h-sec mt-4 text-balance">
              The whole trip, from{' '}
              <CircleMark>one desk</CircleMark>
            </h2>
            <p className="mt-6 max-w-md text-[1.12rem] text-pretty">
              {BIZ.name} is an IATA-accredited travel agency on Hospital Road, Shivaji Nagar, Bengaluru, booking
              trips since {BIZ.since}. Tickets, hotels, and advice on your visa and insurance can all sit with the same people here, so
              nothing falls between two agencies.
            </p>
            <p className="note mt-5 text-[1.15rem] text-navy-900/70">Pick a line to jump straight to it.</p>
          </Reveal>

          <StaggerList as="ol" className="border-b border-slate-200" stagger={0.05} y={14}>
            {SERVICES.map((s, i) => (
              <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="group grid grid-cols-[2.6rem_1fr_auto] items-center gap-3 border-t border-slate-200 py-4 sm:gap-5"
              >
                <span className="note text-[1.2rem] text-gold-600">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <span className="block font-display text-[1.14rem] font-bold text-ink transition-colors group-hover:text-brand-500">{s.title}</span>
                  <span className="block truncate text-[0.93rem] text-slate-500">{s.short}</span>
                </span>
                <ArrowDownRight
                  size={18}
                  aria-hidden="true"
                  className="text-slate-400 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-brand-500"
                />
              </a>
              </li>
            ))}
          </StaggerList>
        </div>
      </nav>

      {SERVICES.map((s, i) => <ServiceBlock key={s.id} s={s} i={i} />)}

      {/* ---- Extras: a short list, not another card grid ---- */}
      <section aria-label="The smaller things we sort out too" className="section bg-white">
        <div className="wrap">
          <SectionHeading eyebrow="Also on the desk" title="The smaller things we sort out too" />
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {EXTRAS.map((e, i) => (
              <article key={e.title}>
                <ImageReveal from="bottom" delay={i * 0.1} className="aspect-[16/10] rounded-2xl">
                  <img
                    {...EXTRA_IMG[i]}
                    alt={e.alt}
                    width={1080}
                    height={675}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </ImageReveal>
                <Reveal delay={0.1 + i * 0.08}>
                  <h3 className="mt-5 text-[1.28rem]">{e.title}</h3>
                  <p className="mt-2 text-[1.04rem] text-pretty">{e.desc}</p>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section aria-labelledby="services-cta-title" className="paper bg-sand py-16 md:py-20">
        <div className="wrap">
          <ExpandBand>
            <div className="relative isolate overflow-hidden rounded-5xl bg-navy-950 px-6 py-14 sm:px-10 md:px-16 md:py-20">
              <FlightPath
                className="absolute inset-x-0 bottom-0 -z-[1] mx-auto max-w-5xl translate-y-[18%] opacity-40"
                d="M 20 230 C 240 40, 470 30, 640 140 S 980 250, 1180 50"
                viewBox="0 0 1200 280"
                start="top 90%"
                end="bottom 40%"
              />
              <div className="max-w-2xl">
                <Reveal>
                  <span className="eyebrow eyebrow-light">Not sure where to start?</span>
                  <h2 id="services-cta-title" className="h-sec mt-4 !text-white text-balance">Describe the trip. We’ll tell you what it needs.</h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-5 text-[1.12rem] text-white/75 text-pretty">
                    A few lines on WhatsApp is enough: where, when, and who is going. We reply with what’s involved and a quote.
                  </p>
                </Reveal>
                <Reveal delay={0.18}>
                  <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                    <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                      <MessageCircle size={18} aria-hidden="true" /> Message us on WhatsApp
                    </a>
                    <a href={`tel:${BIZ.phone}`} className="font-display font-bold text-white/85 underline decoration-white/30 underline-offset-4 hover:decoration-white">
                      or call {BIZ.phoneDisplay}
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>
          </ExpandBand>
        </div>
      </section>
    </>
  )
}
