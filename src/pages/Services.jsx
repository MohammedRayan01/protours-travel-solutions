import { Link } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'

import { BIZ, SERVICES, waLink } from '../data/site.js'
import { Reveal, SectionHeading, PageHero } from '../components/ui.jsx'
import { useHashScroll } from '../components/SmoothScroll.jsx'

const EXTRAS = [
  { img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=72', alt: 'Signing a travel insurance document', title: 'Travel Insurance', desc: 'Schengen-compliant medical cover, trip cancellation, baggage loss and senior-citizen plans, issued alongside your ticket.' },
  { img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=72', alt: 'Chauffeur at the wheel', title: 'Transfers & Car Rental', desc: 'Airport pickups, chauffeur-driven cars and coach hire for groups — in India and at your destination.' },
  { img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=72', alt: 'Corporate travel planning meeting', title: 'Corporate Travel Desk', desc: 'Credit terms, GST invoicing, policy-compliant fares, monthly MIS reports and a named consultant for your company.' },
]

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

      {/* ---- Alternating detail blocks ---- */}
      {SERVICES.map((s, i) => {
        const flip = i % 2 === 1
        return (
          <section
            key={s.id}
            id={s.id}
            className={`section scroll-mt-24 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
          >
            <div className="wrap">
              <div className="grid items-center gap-14 lg:grid-cols-2">
                {/* Twin images */}
                <Reveal className={flip ? 'lg:order-2' : ''}>
                  <div className="relative">
                    <img
                      src={s.img}
                      alt={s.title}
                      loading="lazy"
                      className="aspect-[4/3.2] w-full rounded-5xl object-cover shadow-[var(--shadow-lift)]"
                    />
                    <img
                      src={s.img2}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className={`absolute -bottom-9 hidden aspect-square w-44 rounded-4xl border-[6px] border-white object-cover shadow-[var(--shadow-lift)] sm:block ${flip ? '-left-6' : '-right-6'}`}
                    />
                  </div>
                </Reveal>

                {/* Copy */}
                <div className={flip ? 'lg:order-1' : ''}>
                  <Reveal>
                    <span className="eyebrow">
                      Service {String(i + 1).padStart(2, '0')}
                    </span>
                  </Reveal>
                  <Reveal delay={0.08}>
                    <h2 className="h-sec mt-4 text-balance">{s.title}</h2>
                  </Reveal>
                  <Reveal delay={0.14}>
                    <p className="mt-5 text-[1.14rem] text-pretty">{s.desc}</p>
                  </Reveal>

                  <Reveal delay={0.2}>
                    <ul className="mt-8 grid gap-3.5">
                      {s.points.map((p) => (
                        <li key={p} className="flex gap-3.5">
                          <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-500">
                            <Check size={12} strokeWidth={3.2} />
                          </span>
                          <span className="text-[1.07rem] text-pretty">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal delay={0.28}>
                    <div className="mt-9 flex flex-wrap gap-4">
                      <a
                        href={waLink(`Hello Pro Tours & Travel Solutions, I would like to enquire about ${s.title}.`)}
                        target="_blank" rel="noopener noreferrer"
                        className="btn btn-brand"
                      >
                        Enquire Now <ArrowRight size={16} />
                      </a>
                      {s.id === 'umrah' && <Link to="/umrah" className="btn btn-ghost">Umrah Packages</Link>}
                      {(s.id === 'visa' || s.id === 'passport') && <Link to="/visa" className="btn btn-ghost">Visa Guide</Link>}
                      {s.id === 'tours' && <Link to="/packages" className="btn btn-ghost">Browse Packages</Link>}
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* ---- Extras ---- */}
      <section className="section bg-white">
        <div className="wrap">
          <SectionHeading center eyebrow="Also available" title="The rest of what we handle" />
          <div className="grid gap-6 md:grid-cols-3">
            {EXTRAS.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.08}>
                <div className="group flex h-full flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={e.img}
                      alt={e.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-[1.3rem]">{e.title}</h3>
                    <p className="mt-2.5 text-[1.04rem] text-pretty">{e.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="bg-slate-50 py-20">
        <div className="wrap">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-5xl bg-navy-950 px-8 py-16 text-center md:px-16">
              <div className="pointer-events-none absolute -top-24 -right-16 -z-10 h-80 w-80 rounded-full bg-brand-500/25 blur-[110px]" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-80 w-80 rounded-full bg-gold-500/18 blur-[110px]" />
              <h2 className="h-sec !text-white text-balance">Not sure which service you need?</h2>
              <p className="mx-auto mt-5 max-w-xl text-[1.14rem] text-white/70 text-pretty">
                Describe the trip in a WhatsApp message. We will tell you exactly what it takes — and what it costs.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="btn btn-gold">Send an Enquiry</Link>
                <a href={`tel:${BIZ.phone}`} className="btn btn-glass">Call {BIZ.phoneDisplay}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
