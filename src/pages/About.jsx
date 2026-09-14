import { Link } from 'react-router-dom'
import { Check, Phone, Mail, Globe2, ArrowRight } from 'lucide-react'

import { BIZ, STATS, waLink } from '../data/site.js'
import { Reveal, SectionHeading, Counter, PageHero } from '../components/ui.jsx'

/* Indian imagery throughout — this is a Bengaluru business. */
const IMG = {
  hero: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1800&q=74',
  office: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=72',
  detail: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=700&q=72',
  founder: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=72',
}

const VALUES = [
  {
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=72',
    alt: 'Agreeing terms with a client',
    title: 'Honest pricing',
    desc: 'We show the airline fare, the taxes and our service fee separately. If a cheaper routing exists, we tell you about it even when it earns us less.',
  },
  {
    img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=72',
    alt: 'Your dedicated travel consultant',
    title: 'One point of contact',
    desc: 'No ticket numbers, no call queues. The consultant who quoted your trip is the same one who fixes it if something changes mid-journey.',
  },
  {
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=72',
    alt: 'Visa paperwork being checked',
    title: 'Documents done properly',
    desc: 'Most visa rejections come from paperwork, not profile. We check every file line by line before it reaches the consulate.',
  },
]

export default function About() {
  return (
    <>
      <PageHero
        img={IMG.hero}
        alt="The Taj Mahal at sunrise"
        eyebrow="About us"
        title="Travel planned by people, not algorithms"
        sub="Sixteen years, one office on Hospital Road, and a client list that mostly arrived through word of mouth."
      />

      {/* ---- Story ---- */}
      <section className="section bg-white">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <img
                src={IMG.office}
                alt="Kerala backwaters, one of our most-booked Indian itineraries"
                loading="lazy"
                className="aspect-[4/3.4] w-full rounded-5xl object-cover shadow-[var(--shadow-lift)]"
              />
              <img
                src={IMG.detail}
                alt="" aria-hidden="true" loading="lazy"
                className="absolute -right-6 -bottom-9 hidden aspect-square w-44 rounded-4xl border-[6px] border-white object-cover shadow-[var(--shadow-lift)] sm:block"
              />
              <div className="absolute -top-6 -left-4 rounded-3xl border-4 border-white bg-navy-950 px-6 py-5 text-center shadow-[var(--shadow-lift)]">
                <div className="font-display text-[1.93rem] leading-none font-extrabold text-gold-400">{BIZ.rating}★</div>
                <div className="mt-1 text-[0.75rem] tracking-[0.1em] text-white/60 uppercase">Google rating</div>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal><span className="eyebrow">Our story</span></Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-sec mt-4 text-balance">A full-service travel desk in the heart of Shivaji Nagar</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 text-pretty">
                Pro Tours &amp; Travel Solutions started with a simple idea: a traveller should not have to deal with
                four different agencies for one trip. One person should handle the ticket, the hotel, the visa file,
                and the phone call at midnight when a flight gets cancelled.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-4 text-pretty">
                From our office at 21/1, A.M. Plaza on Hospital Road — a short walk from Infantry Road — we handle
                corporate travel accounts, family holidays, honeymoon itineraries, group departures and specialised
                Hajj and Umrah services. Some of our clients have been booking with us since their first passport.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <ul className="mt-8 grid gap-3.5">
                {[
                  'Domestic and international air ticketing on all major carriers',
                  'Visa and passport documentation handled in-house',
                  'Custom holidays, honeymoons, group tours and corporate meets',
                  'Dedicated Hajj & Umrah division with seasonal group departures',
                ].map((x) => (
                  <li key={x} className="flex gap-3.5">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-500">
                      <Check size={12} strokeWidth={3.2} />
                    </span>
                    <span className="text-[1.07rem] text-pretty">{x}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.38}>
              <Link to="/contact" className="btn btn-brand mt-9">
                Visit Our Office <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Values ---- */}
      <section className="section bg-slate-50">
        <div className="wrap">
          <SectionHeading center eyebrow="What guides us" title="Three things we refuse to compromise on" />
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="group flex h-full flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={v.img}
                      alt={v.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-[1.3rem]">{v.title}</h3>
                    <p className="mt-2.5 text-[1.04rem] text-pretty">{v.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Founder ---- */}
      <section className="section bg-white">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal><span className="eyebrow">Leadership</span></Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-sec mt-4 text-balance">{BIZ.owner}</h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-3 font-display text-[1.1rem] font-bold text-brand-500">
                Founder &amp; Managing Consultant
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-pretty">
                Sajid has spent his career on the operations side of travel — fare construction, visa documentation,
                and the unglamorous work of rerouting a stranded family at 2 AM. He personally reviews every Umrah
                file and every complex international itinerary before it goes out.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <p className="mt-4 text-pretty">
                Most of our clients deal with him directly. If you walk into the office on Hospital Road, he is
                usually the one at the desk.
              </p>
            </Reveal>

            <Reveal delay={0.34}>
              <div className="mt-9 grid gap-3">
                <a href={`tel:${BIZ.phone}`} className="flex items-center gap-3.5 text-[1.07rem] hover:text-brand-500">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                    <Phone size={17} />
                  </span>
                  {BIZ.phoneDisplay}
                </a>
                <a href={`mailto:${BIZ.email}`} className="flex items-center gap-3.5 text-[1.07rem] hover:text-brand-500">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                    <Mail size={17} />
                  </span>
                  {BIZ.email}
                </a>
                <div className="flex items-center gap-3.5 text-[1.07rem]">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                    <Globe2 size={17} />
                  </span>
                  Skype: {BIZ.skype}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <img
              src={IMG.founder}
              alt="Goa coastline — a long-running favourite with our clients"
              loading="lazy"
              className="aspect-[4/3.4] w-full rounded-5xl object-cover shadow-[var(--shadow-lift)]"
            />
          </Reveal>
        </div>
      </section>

      {/* ---- Numbers ---- */}
      <section className="relative isolate overflow-hidden bg-navy-950 py-20 md:py-24">
        <img
          src={IMG.hero}
          alt="" aria-hidden="true" loading="lazy"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950/95 to-navy-900/88" />
        <div className="wrap relative z-10">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="glass rounded-4xl px-6 py-9 text-center">
                  <div className="font-display text-[clamp(2rem,4vw,2.9rem)] leading-none font-extrabold text-gold-400">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-3 text-[0.94rem] text-white/65">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="section bg-white">
        <div className="wrap">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-5xl bg-navy-950 px-8 py-16 text-center md:px-16">
              <div className="pointer-events-none absolute -top-24 -right-16 -z-10 h-80 w-80 rounded-full bg-brand-500/25 blur-[110px]" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-80 w-80 rounded-full bg-gold-500/18 blur-[110px]" />
              <h2 className="h-sec !text-white text-balance">Come say hello</h2>
              <p className="mx-auto mt-5 max-w-xl text-[1.14rem] text-white/70 text-pretty">
                Walk into our office on Hospital Road, or just send a WhatsApp message. Either works.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="btn btn-gold">Contact Us</Link>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
