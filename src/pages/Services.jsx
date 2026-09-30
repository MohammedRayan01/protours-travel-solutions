import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'

import { BIZ, SERVICES, waLink } from '../data/site.js'
import { Reveal, SectionHeading, PageHero, Parallax, Stagger, Magnetic } from '../components/ui.jsx'
import { ImageReveal, Marquee, FlightPath, Spotlight, Orbs, Grain, RevealGrid, RotatingBadge } from '../components/fx.jsx'
import { useHashScroll } from '../components/SmoothScroll.jsx'
import { gsap, useGSAP, reduceMotion } from '../lib/gsap.js'

const EXTRAS = [
  { img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=72', alt: 'Signing a travel insurance document', title: 'Travel Insurance', desc: 'Schengen-compliant medical cover, trip cancellation, baggage loss and senior-citizen plans, issued alongside your ticket.' },
  { img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=72', alt: 'Chauffeur at the wheel', title: 'Transfers & Car Rental', desc: 'Airport pickups, chauffeur-driven cars and coach hire for groups — in India and at your destination.' },
  { img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=72', alt: 'Corporate travel planning meeting', title: 'Corporate Travel Desk', desc: 'Credit terms, GST invoicing, policy-compliant fares, monthly MIS reports and a named consultant for your company.' },
]

/* The dark CTA band opens up from an inset "window" to full width as it
   scrolls in — clip-path only, so layout never moves. */
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

/* The gold rule under each service number grows from the left as it enters. */
function GrowRule({ className = '' }) {
  const ref = useRef(null)
  useGSAP(() => {
    const el = ref.current
    if (!el || reduceMotion()) return
    gsap.fromTo(el, { scaleX: 0 }, {
      scaleX: 1, duration: 1.3, ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    })
  }, { scope: ref })
  return <span ref={ref} aria-hidden="true" className={`block h-0.5 origin-left rounded-full bg-gradient-to-r from-gold-500 to-brand-400 ${className}`} />
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
        title="Eight services. One travel desk."
        sub="Everything a journey needs — booked, documented and supported by the same team from first enquiry to final landing."
      />

      {/* ---- Service index ticker ---- */}
      <nav aria-label="Jump to a service" className="relative isolate overflow-hidden border-b border-white/10 bg-navy-950 py-5">
        <Grain />
        <Marquee speed={42} trackClassName="py-1">
          {SERVICES.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="group flex shrink-0 items-center gap-4 px-6 font-display text-[1.02rem] font-bold whitespace-nowrap text-white/75 transition-colors hover:text-gold-400 md:px-8 md:text-[1.12rem]"
            >
              <span className="font-display text-[0.78rem] tracking-[0.2em] text-gold-500">{String(i + 1).padStart(2, '0')}</span>
              <span className="link-grow">{s.title}</span>
              <Sparkles aria-hidden="true" size={15} className="text-gold-500/70 transition-transform duration-500 group-hover:rotate-90" />
            </a>
          ))}
        </Marquee>
      </nav>

      {/* ---- Alternating detail blocks ---- */}
      {SERVICES.map((s, i) => {
        const flip = i % 2 === 1
        const num = String(i + 1).padStart(2, '0')
        return (
          <section
            key={s.id}
            id={s.id}
            className={`section relative isolate scroll-mt-24 overflow-hidden ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
          >
            <div className="wrap">
              <div className="grid items-center gap-14 lg:grid-cols-2">
                {/* Twin images */}
                <div className={`relative ${flip ? 'lg:order-2' : ''}`}>
                  <ImageReveal from={flip ? 'right' : 'left'} className="rounded-5xl shadow-[var(--shadow-lift)]">
                    <img
                      src={s.img}
                      alt={s.title}
                      loading="lazy"
                      className="aspect-[4/3.2] w-full object-cover"
                    />
                  </ImageReveal>
                  {/* Secondary photo floats and drifts against the scroll */}
                  <Parallax
                    speed={-0.5}
                    className={`pointer-events-none absolute -bottom-9 hidden w-44 sm:block ${flip ? '-left-6' : '-right-6'}`}
                  >
                    <div>
                      <img
                        src={s.img2}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        style={{ animationDelay: `${i * -1.3}s` }}
                        className={`animate-float aspect-square w-full rounded-4xl border-[6px] border-white object-cover shadow-[var(--shadow-lift)] ${flip ? '-rotate-3' : 'rotate-3'}`}
                      />
                    </div>
                  </Parallax>
                </div>

                {/* Copy */}
                <div className={`relative ${flip ? 'lg:order-1' : ''}`}>
                  {/* Giant outlined numeral drifting behind the copy */}
                  <Parallax
                    speed={0.35}
                    className={`pointer-events-none absolute -top-8 -z-10 select-none md:-top-12 ${flip ? 'left-0 lg:left-auto lg:right-0' : 'right-0'}`}
                  >
                    <span
                      aria-hidden="true"
                      className="block font-display text-[clamp(6.5rem,17vw,12rem)] leading-none font-extrabold tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_rgb(18_115_196/0.16)]"
                    >
                      {num}
                    </span>
                  </Parallax>

                  <Reveal>
                    <span className="eyebrow">
                      Service {num}
                    </span>
                  </Reveal>
                  <Reveal delay={0.08}>
                    <h2 className="h-sec mt-4 text-balance">{s.title}</h2>
                  </Reveal>
                  <GrowRule className="mt-6 w-24" />
                  <Reveal delay={0.14}>
                    <p className="mt-5 text-[1.14rem] text-pretty">{s.desc}</p>
                  </Reveal>

                  <Stagger className="mt-8 grid gap-3.5" stagger={0.08} y={22}>
                    {s.points.map((p) => (
                      <div key={p} className="flex gap-3.5">
                        <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-500">
                          <Check size={12} strokeWidth={3.2} />
                        </span>
                        <span className="text-[1.07rem] text-pretty">{p}</span>
                      </div>
                    ))}
                  </Stagger>

                  <Reveal delay={0.28}>
                    <div className="mt-9 flex flex-wrap gap-4">
                      <a
                        href={waLink(`Hello Pro Tours & Travel Solutions, I would like to enquire about ${s.title}.`)}
                        target="_blank" rel="noopener noreferrer"
                        className="group/btn btn btn-brand"
                      >
                        Enquire Now <ArrowRight size={16} className="transition-transform duration-500 group-hover/btn:translate-x-1" />
                      </a>
                      {s.id === 'umrah' && <Link to="/umrah" className="btn btn-ghost">Umrah Packages</Link>}
                      {(s.id === 'visa' || s.id === 'passport') && <Link to="/visa" className="btn btn-ghost">Visa Guide</Link>}
                      {s.id === 'tours' && <Link to="/packages" className="btn btn-ghost">Browse Packages</Link>}
                      {s.id === 'flights' && <Link to="/flights-hotels#flights" className="btn btn-ghost">Flights & Hotels</Link>}
                      {s.id === 'hotels' && <Link to="/flights-hotels#hotels" className="btn btn-ghost">Flights & Hotels</Link>}
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* ---- Extras ---- */}
      <section className="section relative isolate overflow-hidden bg-white">
        <Orbs tone="light" className="opacity-60" />
        <div className="wrap">
          <SectionHeading center eyebrow="Also available" title="The rest of what we handle" />
          <RevealGrid className="grid gap-6 md:grid-cols-3">
            {EXTRAS.map((e, i) => (
              <Spotlight key={e.title} className="h-full rounded-4xl" color="rgb(232 163 23 / 0.14)">
                <div className="group flex h-full flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={e.img}
                      alt={e.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1300ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-5 font-display text-[0.8rem] font-bold tracking-[0.22em] text-white/85 uppercase">
                      Extra {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute top-4 right-4 grid h-10 w-10 translate-y-2 scale-75 place-items-center rounded-full bg-gold-500 text-navy-950 opacity-0 transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
                    >
                      <ArrowUpRight size={18} strokeWidth={2.4} />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-[1.3rem]">{e.title}</h3>
                    <p className="mt-2.5 text-[1.04rem] text-pretty">{e.desc}</p>
                  </div>
                </div>
              </Spotlight>
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="bg-slate-50 py-20">
        <div className="wrap">
          <ExpandBand>
            <div className="relative isolate overflow-hidden rounded-5xl bg-navy-950 px-6 py-16 text-center sm:px-8 md:px-16 md:py-20">
              <Orbs />
              <Grain />
              <FlightPath
                className="absolute inset-x-0 bottom-0 -z-[1] mx-auto max-w-5xl translate-y-[18%] opacity-50"
                d="M 20 230 C 240 40, 470 30, 640 140 S 980 250, 1180 50"
                viewBox="0 0 1200 280"
                start="top 90%"
                end="bottom 40%"
              />
              <div aria-hidden="true" className="absolute top-8 right-8 hidden lg:block">
                <RotatingBadge
                  text="One desk · Eight services · "
                  size={120}
                  textClass="fill-gold-400/80"
                >
                  <Sparkles size={22} className="text-gold-400" />
                </RotatingBadge>
              </div>

              <Reveal>
                <h2 className="h-sec relative !text-white text-balance">Not sure which service you need?</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="relative mx-auto mt-5 max-w-xl text-[1.14rem] text-white/70 text-pretty">
                  Describe the trip in a WhatsApp message. We will tell you exactly what it takes — and what it costs.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="relative mt-10 flex flex-wrap justify-center gap-4">
                  <Magnetic><Link to="/contact" className="btn btn-gold">Send an Enquiry</Link></Magnetic>
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
