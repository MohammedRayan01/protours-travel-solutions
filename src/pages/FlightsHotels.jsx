import { Check, ArrowRight, Plane, BedDouble } from 'lucide-react'

import { BIZ, SERVICES, waLink } from '../data/site.js'
import { Reveal, SectionHeading, PageHero } from '../components/ui.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'
import { useHashScroll } from '../components/SmoothScroll.jsx'

const flights = SERVICES.find((s) => s.id === 'flights')
const hotels = SERVICES.find((s) => s.id === 'hotels')

const WHY = [
  ['Best-fare search', 'Every major carrier out of Bengaluru, compared across GDS and airline-direct inventory before we quote you.'],
  ['Group fares held', '10+ passengers travelling together get fares held on request, not re-priced every time someone confirms.'],
  ['Confirmed vouchers', 'Hotel vouchers issued before you fly — never "on request" once you have paid.'],
  ['Free-cancellation options', 'When your dates are not fixed yet, we book rooms that let you change your mind without a penalty.'],
  ['On-trip support', 'Date changes, delays and hotel issues handled on WhatsApp while you are actually travelling.'],
]

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

      {/* ---------- Flights ---------- */}
      <section id="flights" className="section scroll-mt-24 bg-white">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <img
                src={flights.img}
                alt={flights.title}
                loading="lazy"
                className="aspect-[4/3.2] w-full rounded-5xl object-cover shadow-[var(--shadow-lift)]"
              />
              <img
                src={flights.img2}
                alt="" aria-hidden="true" loading="lazy"
                className="absolute -right-6 -bottom-9 hidden aspect-square w-44 rounded-4xl border-[6px] border-white object-cover shadow-[var(--shadow-lift)] sm:block"
              />
            </div>
          </Reveal>

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
            <Reveal delay={0.24}>
              <ul className="mt-8 grid gap-3.5">
                {flights.points.map((x) => (
                  <li key={x} className="flex gap-3.5">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-500">
                      <Check size={12} strokeWidth={3.2} />
                    </span>
                    <span className="text-[1.07rem] text-pretty">{x}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.32}>
              <a
                href={waLink('Hello Pro Tours & Travel Solutions, I would like to enquire about flight booking.')}
                target="_blank" rel="noopener noreferrer" className="btn btn-brand mt-9"
              >
                Ask About Flights <ArrowRight size={16} />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Hotels ---------- */}
      <section id="hotels" className="section scroll-mt-24 bg-slate-50">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="lg:order-2">
            <div className="relative">
              <img
                src={hotels.img}
                alt={hotels.title}
                loading="lazy"
                className="aspect-[4/3.2] w-full rounded-5xl object-cover shadow-[var(--shadow-lift)]"
              />
              <img
                src={hotels.img2}
                alt="" aria-hidden="true" loading="lazy"
                className="absolute -left-6 -bottom-9 hidden aspect-square w-44 rounded-4xl border-[6px] border-white object-cover shadow-[var(--shadow-lift)] sm:block"
              />
            </div>
          </Reveal>

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
            <Reveal delay={0.24}>
              <ul className="mt-8 grid gap-3.5">
                {hotels.points.map((x) => (
                  <li key={x} className="flex gap-3.5">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-500">
                      <Check size={12} strokeWidth={3.2} />
                    </span>
                    <span className="text-[1.07rem] text-pretty">{x}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.32}>
              <a
                href={waLink('Hello Pro Tours & Travel Solutions, I would like to enquire about hotel booking.')}
                target="_blank" rel="noopener noreferrer" className="btn btn-brand mt-9"
              >
                Ask About Hotels <ArrowRight size={16} />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Why book both with us ---------- */}
      <section className="relative isolate overflow-hidden bg-navy-950 py-20 md:py-28">
        <img
          src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1800&q=70"
          alt="" aria-hidden="true" loading="lazy"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950/68 to-navy-900/55" />

        <div className="wrap relative z-10">
          <SectionHeading
            center light
            eyebrow="Why book here"
            title="What you get booking flights and hotels with us"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {WHY.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="glass h-full rounded-4xl p-7">
                  <span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-gold-500 font-display text-[1.16rem] font-extrabold text-navy-950">
                    {i + 1}
                  </span>
                  <h4 className="font-display text-[1.1rem] font-bold !text-white">{t}</h4>
                  <p className="mt-2.5 text-[0.98rem] text-white/65 text-pretty">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Form ---------- */}
      <section className="section bg-white">
        <div className="wrap">
          <SectionHeading
            center
            eyebrow="Start here"
            title="Tell us your flight or hotel need"
            sub="Share a few details and we will come back with fare and room options that actually fit your dates."
          />
          <Reveal>
            <div className="mx-auto max-w-3xl rounded-5xl border border-slate-200 bg-slate-50 p-8 md:p-10">
              <EnquiryForm defaultService="Flight Booking" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bg-slate-50 pb-24">
        <div className="wrap">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-5xl bg-navy-950 px-8 py-16 text-center md:px-16">
              <div className="pointer-events-none absolute -top-24 -right-16 -z-10 h-80 w-80 rounded-full bg-brand-500/25 blur-[110px]" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-80 w-80 rounded-full bg-gold-500/18 blur-[110px]" />
              <h2 className="h-sec !text-white text-balance">Flying somewhere and need a room booked too?</h2>
              <p className="mx-auto mt-5 max-w-xl text-[1.14rem] text-white/70 text-pretty">
                Send us your dates on WhatsApp. We will hold fares and rooms together so nothing falls out of sync.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Chat on WhatsApp</a>
                <a href={`tel:${BIZ.phone}`} className="btn btn-glass">Call {BIZ.phoneDisplay}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
