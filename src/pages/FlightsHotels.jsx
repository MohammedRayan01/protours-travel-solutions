import { useRef } from 'react'
import { Check, ArrowRight, Plane, BedDouble, BadgeCheck } from 'lucide-react'

import { BIZ, SERVICES, waLink } from '../data/site.js'
import { Reveal, SectionHeading, PageHero, Parallax, Stagger, Magnetic } from '../components/ui.jsx'
import { ImageReveal, Marquee, FlightPath, Spotlight, Orbs, Grain, RevealGrid } from '../components/fx.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'
import { useHashScroll } from '../components/SmoothScroll.jsx'
import { gsap, useGSAP, reduceMotion } from '../lib/gsap.js'

const flights = SERVICES.find((s) => s.id === 'flights')
const hotels = SERVICES.find((s) => s.id === 'hotels')

const WHY = [
  ['Best-fare search', 'Every major carrier out of Bengaluru, compared across GDS and airline-direct inventory before we quote you.'],
  ['Group fares held', '10+ passengers travelling together get fares held on request, not re-priced every time someone confirms.'],
  ['Confirmed vouchers', 'Hotel vouchers issued before you fly — never "on request" once you have paid.'],
  ['Free-cancellation options', 'When your dates are not fixed yet, we book rooms that let you change your mind without a penalty.'],
  ['On-trip support', 'Date changes, delays and hotel issues handled on WhatsApp while you are actually travelling.'],
]

// Airport codes only — a departures-board feel, no carrier names or marks.
const ROUTES = ['DXB', 'SIN', 'LHR', 'CDG', 'DPS', 'MLE', 'HKT', 'JED', 'MED', 'KUL', 'IST', 'ZRH']

/* The dark CTA band opens from an inset window to full width on scroll. */
function ExpandBand({ children, className = '' }) {
  const ref = useRef(null)
  useGSAP(() => {
    const el = ref.current
    if (!el || reduceMotion()) return
    gsap.fromTo(el,
      { clipPath: 'inset(6% 7% 6% 7% round 2.75rem)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 2.75rem)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 45%', scrub: 0.8 },
      })
  }, { scope: ref })
  return <div ref={ref} className={className}>{children}</div>
}

/* Floating glass chip pinned to a photo corner. */
function FloatChip({ className = '', children, delay = 0 }) {
  return (
    <div
      aria-hidden="true"
      style={{ animationDelay: `${delay}s` }}
      className={`animate-float glass-light pointer-events-none absolute z-10 flex items-center gap-3 rounded-2xl px-4 py-3 ${className}`}
    >
      {children}
    </div>
  )
}

function Points({ items }) {
  return (
    <Stagger className="mt-8 grid gap-3.5" stagger={0.08} y={22}>
      {items.map((x) => (
        <div key={x} className="flex gap-3.5">
          <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-500">
            <Check size={12} strokeWidth={3.2} />
          </span>
          <span className="text-[1.07rem] text-pretty">{x}</span>
        </div>
      ))}
    </Stagger>
  )
}

export default function FlightsHotels() {
  // Deep links like /flights-hotels#hotels land on that block.
  useHashScroll()

  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=74"
        alt="Aircraft wing above the clouds"
        eyebrow="Flights & Hotels"
        title="Air tickets and hotel stays, sorted properly"
        sub="Two of the most-booked parts of any trip — fare-compared flights and confirmed hotel rooms, handled by the same desk from search to check-in."
      />

      {/* ---------- Departures-board route ticker ---------- */}
      <div className="relative isolate overflow-hidden bg-navy-950 py-5">
        <Grain />
        <Marquee speed={38} className="[mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
          {ROUTES.map((code) => (
            <span
              key={code}
              className="flex shrink-0 items-center gap-3 px-5 font-display text-[1.05rem] font-extrabold tracking-[0.18em] whitespace-nowrap text-white md:px-7 md:text-[1.2rem]"
            >
              <span className="text-white/60">BLR</span>
              <span aria-hidden="true" className="relative flex w-10 items-center">
                <span className="h-px w-full bg-gradient-to-r from-gold-500/30 via-gold-500 to-gold-500/30" />
                <Plane size={14} className="absolute left-1/2 -translate-x-1/2 rotate-45 fill-gold-400 text-gold-400" />
              </span>
              <span className="sr-only">to</span>
              <span className="text-gold-400">{code}</span>
              <span aria-hidden="true" className="ml-3 h-1 w-1 rounded-full bg-white/30" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* ---------- Flights ---------- */}
      <section id="flights" className="section relative isolate scroll-mt-24 overflow-hidden bg-white">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <ImageReveal from="left" className="rounded-5xl shadow-[var(--shadow-lift)]">
              <img
                src={flights.img}
                alt={flights.title}
                loading="lazy"
                className="aspect-[4/3.2] w-full object-cover"
              />
            </ImageReveal>
            <Parallax speed={-0.5} className="pointer-events-none absolute -right-6 -bottom-9 hidden w-44 sm:block">
              <div>
                <img
                  src={flights.img2}
                  alt="" aria-hidden="true" loading="lazy"
                  className="animate-float aspect-square w-full rotate-3 rounded-4xl border-[6px] border-white object-cover shadow-[var(--shadow-lift)]"
                />
              </div>
            </Parallax>
            <FloatChip className="top-5 left-5" delay={-2}>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white">
                <Plane size={16} className="rotate-45" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-[0.7rem] font-bold tracking-[0.18em] text-slate-500 uppercase">Departing</span>
                <span className="block font-display text-[1.05rem] font-extrabold text-ink">Bengaluru · BLR</span>
              </span>
            </FloatChip>
          </div>

          <div>
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-2">
                <Plane size={14} /> Flight booking
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-sec mt-4 text-balance">{flights.title} — {flights.short}</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-pretty">{flights.desc}</p>
            </Reveal>
            <Points items={flights.points} />
            <Reveal delay={0.32}>
              <a
                href={waLink('Hello Pro Tours & Travel Solutions, I would like to enquire about flight booking.')}
                target="_blank" rel="noopener noreferrer" className="group/btn btn btn-brand mt-9"
              >
                Ask About Flights <ArrowRight size={16} className="transition-transform duration-500 group-hover/btn:translate-x-1" />
              </a>
            </Reveal>
          </div>
        </div>

        {/* Scroll-drawn route: Bengaluru out to the world */}
        <div className="wrap mt-16 md:mt-20">
          <div className="relative">
            <FlightPath
              d="M 40 150 C 280 -10, 560 -10, 760 70 S 1060 170, 1160 40"
              viewBox="0 0 1200 180"
              stroke="rgb(18 115 196 / 0.9)"
              guide="rgb(4 24 44 / 0.16)"
              plane="#e8a317"
              start="top 92%"
              end="bottom 40%"
            />
            <div aria-hidden="true" className="mt-3 flex items-center justify-between font-display text-[0.78rem] font-bold tracking-[0.22em] text-slate-500 uppercase">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-500" /> BLR</span>
              <span className="flex items-center gap-2">Anywhere <span className="h-2 w-2 rounded-full bg-gold-500" /></span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Hotels ---------- */}
      <section id="hotels" className="section relative isolate scroll-mt-24 overflow-hidden bg-slate-50">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <div className="relative lg:order-2">
            <ImageReveal from="right" className="rounded-5xl shadow-[var(--shadow-lift)]">
              <img
                src={hotels.img}
                alt={hotels.title}
                loading="lazy"
                className="aspect-[4/3.2] w-full object-cover"
              />
            </ImageReveal>
            <Parallax speed={-0.5} className="pointer-events-none absolute -bottom-9 -left-6 hidden w-44 sm:block">
              <div>
                <img
                  src={hotels.img2}
                  alt="" aria-hidden="true" loading="lazy"
                  style={{ animationDelay: '-3s' }}
                  className="animate-float aspect-square w-full -rotate-3 rounded-4xl border-[6px] border-white object-cover shadow-[var(--shadow-lift)]"
                />
              </div>
            </Parallax>
            <FloatChip className="top-5 right-5" delay={-4}>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-500 text-navy-950">
                <BadgeCheck size={17} />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-[0.7rem] font-bold tracking-[0.18em] text-slate-500 uppercase">Hotel voucher</span>
                <span className="block font-display text-[1.05rem] font-extrabold text-ink">Confirmed</span>
              </span>
            </FloatChip>
          </div>

          <div className="lg:order-1">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-2">
                <BedDouble size={14} /> Hotel booking
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-sec mt-4 text-balance">{hotels.title} — {hotels.short}</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-pretty">{hotels.desc}</p>
            </Reveal>
            <Points items={hotels.points} />
            <Reveal delay={0.32}>
              <a
                href={waLink('Hello Pro Tours & Travel Solutions, I would like to enquire about hotel booking.')}
                target="_blank" rel="noopener noreferrer" className="group/btn btn btn-brand mt-9"
              >
                Ask About Hotels <ArrowRight size={16} className="transition-transform duration-500 group-hover/btn:translate-x-1" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Why book both with us ---------- */}
      <section className="relative isolate overflow-hidden bg-navy-950 py-20 md:py-28">
        <Parallax speed={0.2} className="absolute inset-0 -z-20 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1800&q=70"
            alt="" aria-hidden="true" loading="lazy"
            className="absolute inset-x-0 -top-[12%] h-[124%] w-full object-cover opacity-55"
          />
        </Parallax>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950/68 to-navy-900/55" />
        <Orbs className="!z-[-5] opacity-70" />
        <Grain />

        <div className="wrap relative z-10">
          <SectionHeading
            center light
            eyebrow="Why book here"
            title="What you get booking flights and hotels with us"
          />
          <RevealGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {WHY.map(([t, d], i) => (
              <Spotlight key={t} className="h-full rounded-4xl">
                <div className="group glass relative h-full overflow-hidden rounded-4xl p-7 transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:bg-white/15">
                  <span className="relative mb-5 grid h-11 w-11 place-items-center">
                    <span aria-hidden="true" className="absolute inset-0 rounded-2xl bg-gold-500 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[20deg] group-hover:scale-110" />
                    <span className="relative font-display text-[1.16rem] font-extrabold text-navy-950">{i + 1}</span>
                  </span>
                  <h4 className="font-display text-[1.1rem] font-bold !text-white">{t}</h4>
                  <p className="mt-2.5 text-[0.98rem] text-white/65 text-pretty">{d}</p>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold-500 to-transparent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                  />
                </div>
              </Spotlight>
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* ---------- Form ---------- */}
      <section className="section relative isolate overflow-hidden bg-white">
        <Orbs tone="light" className="opacity-60" />
        <div className="wrap">
          <SectionHeading
            center
            eyebrow="Start here"
            title="Tell us your flight or hotel need"
            sub="Share a few details and we will come back with fare and room options that actually fit your dates."
          />
          <Reveal>
            <div className="relative mx-auto max-w-3xl rounded-5xl border border-slate-200 bg-slate-50/90 p-8 shadow-[0_30px_80px_-40px_rgb(4_24_44/0.35)] backdrop-blur-sm md:p-10">
              <span aria-hidden="true" className="hero-hairline pointer-events-none absolute inset-x-10 top-0 h-px" />
              <EnquiryForm defaultService="Flight Booking" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bg-slate-50 pt-16 pb-24">
        <div className="wrap">
          <ExpandBand>
            <div className="relative isolate overflow-hidden rounded-5xl bg-navy-950 px-6 py-16 text-center sm:px-8 md:px-16 md:py-20">
              <Orbs />
              <Grain />
              <FlightPath
                className="absolute inset-x-0 bottom-4 -z-[1] mx-auto max-w-5xl opacity-55"
                d="M 20 60 C 260 250, 520 250, 700 130 S 1000 20, 1180 200"
                viewBox="0 0 1200 270"
                start="top 90%"
                end="bottom 40%"
              />
              <Reveal>
                <h2 className="h-sec relative !text-white text-balance">Flying somewhere and need a room booked too?</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="relative mx-auto mt-5 max-w-xl text-[1.14rem] text-white/70 text-pretty">
                  Send us your dates on WhatsApp. We will hold fares and rooms together so nothing falls out of sync.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="relative mt-10 flex flex-wrap justify-center gap-4">
                  <Magnetic><a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Chat on WhatsApp</a></Magnetic>
                  <Magnetic><a href={`tel:${BIZ.phone}`} className="btn btn-glass">Call {BIZ.phoneDisplay}</a></Magnetic>
                </div>
              </Reveal>
            </div>
          </ExpandBand>
        </div>
      </section>
    </>
  )
}
