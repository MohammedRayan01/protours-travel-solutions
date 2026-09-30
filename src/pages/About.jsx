import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Check, Phone, Mail, ArrowRight } from 'lucide-react'

import { BIZ, STATS, waLink } from '../data/site.js'
import { Reveal, SectionHeading, Counter, PageHero } from '../components/ui.jsx'
import { Parallax, Magnetic } from '../components/motion.jsx'
import {
  ImageReveal, ScrubText, RevealGrid, Spotlight, Orbs, Grain, RotatingBadge, FlightPath,
} from '../components/fx.jsx'
import { gsap, useGSAP, reduceMotion, enterTrigger } from '../lib/gsap.js'

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

const OFFER = [
  'Domestic and international air ticketing on all major carriers',
  'Visa and passport documentation handled in-house',
  'Custom holidays, honeymoons, group tours and corporate meets',
  'Dedicated Hajj & Umrah division with seasonal group departures',
]

/* ------------------------------------------------------------
   RouteList — the checklist becomes a little route map: a gold
   line inks down the rail as you scroll and each stop pops in.
   ------------------------------------------------------------ */
function RouteList({ items }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el || reduceMotion()) return
    const q = gsap.utils.selector(el)

    gsap.fromTo(q('[data-rail]'), { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 55%', scrub: 0.8 },
    })
    gsap.timeline({ scrollTrigger: enterTrigger(el, { start: 'top 85%' }) })
      .fromTo(q('[data-stop]'), { scale: 0, rotate: -90 }, {
        scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(2.2)', stagger: 0.16,
      })
      .fromTo(q('[data-copy]'), { autoAlpha: 0, x: 22 }, {
        autoAlpha: 1, x: 0, duration: 0.9, ease: 'expo.out', stagger: 0.16,
      }, 0.08)
  }, { scope: ref })

  return (
    <ul ref={ref} className="relative mt-8 grid gap-5">
      {/* rail: faint guide + the gold line that draws over it */}
      <span aria-hidden="true" className="absolute top-3 bottom-3 left-[9.5px] w-px bg-slate-200" />
      <span
        aria-hidden="true" data-rail
        className="absolute top-3 bottom-3 left-[9px] w-[2px] origin-top rounded-full bg-gradient-to-b from-brand-500 via-gold-500 to-gold-400"
      />
      {items.map((x) => (
        <li key={x} className="relative flex gap-4">
          <span
            data-stop
            className="relative mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500 text-white shadow-[0_0_0_4px_#fff,0_6px_16px_-4px_rgb(18_115_196/0.55)]"
          >
            <Check size={11} strokeWidth={3.4} />
          </span>
          <span data-copy className="text-[1.07rem] text-pretty">{x}</span>
        </li>
      ))}
    </ul>
  )
}

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
      <section className="section overflow-hidden bg-white">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <ImageReveal from="left" className="rounded-5xl shadow-[var(--shadow-lift)]">
              <img
                src={IMG.office}
                alt="Kerala backwaters, one of our most-booked Indian itineraries"
                loading="lazy"
                className="aspect-[4/3.4] w-full object-cover"
              />
            </ImageReveal>
            <ImageReveal
              from="bottom" delay={0.35}
              className="absolute -right-6 -bottom-9 hidden w-44 rounded-4xl border-[6px] border-white shadow-[var(--shadow-lift)] sm:block"
            >
              <img src={IMG.detail} alt="" aria-hidden="true" loading="lazy" className="aspect-square w-full object-cover" />
            </ImageReveal>
            <Reveal className="absolute -top-6 -left-2 sm:-left-4" delay={0.5}>
              <div className="rounded-3xl border-4 border-white bg-navy-950 px-6 py-5 text-center shadow-[var(--shadow-lift)]">
                <div className="font-display text-[1.93rem] leading-none font-extrabold text-gold-400">{BIZ.rating}★</div>
                <div className="mt-1 text-[0.75rem] tracking-[0.1em] text-white/60 uppercase">Google rating</div>
              </div>
            </Reveal>
            {/* spinning accreditation stamp */}
            <Reveal className="absolute -bottom-10 left-4 sm:left-8" delay={0.65}>
              <div className="rounded-full bg-white p-1.5 shadow-[var(--shadow-lift)]">
                <RotatingBadge text="IATA ACCREDITED TRAVEL AGENT • " size={118} textClass="fill-navy-900/80">
                  <img src="/iata-logo.png" alt="IATA Accredited Travel Agent" width={512} height={512} className="h-12 w-12" />
                </RotatingBadge>
              </div>
            </Reveal>
          </div>

          <div className="pt-6 lg:pt-0">
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

            <RouteList items={OFFER} />

            <Reveal delay={0.2}>
              <Magnetic strength={0.22} className="mt-9">
                <Link to="/contact" className="btn btn-brand">
                  Visit Our Office <ArrowRight size={16} />
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Statement: words light up as it scrolls ---- */}
      <section className="relative isolate overflow-hidden bg-navy-950 py-24 md:py-32">
        <Orbs />
        <Grain />
        <FlightPath
          className="absolute inset-x-0 top-1/2 -z-[1] -translate-y-1/2 opacity-40"
          start="top 90%"
          end="bottom 20%"
        />
        <div className="wrap relative">
          <Reveal>
            <span className="eyebrow eyebrow-light">The idea we started with</span>
          </Reveal>
          <span aria-hidden="true" className="accent pointer-events-none mt-4 block text-[5.5rem] leading-[0.6] text-gold-500/70">
            &ldquo;
          </span>
          <ScrubText
            className="max-w-5xl font-display text-[clamp(1.7rem,4.2vw,3.35rem)] leading-[1.14] font-bold tracking-tight text-white text-balance"
            dim={0.14}
          >
            A traveller should not have to deal with four different agencies for one trip. One person should handle
            the ticket, the hotel, the visa file, and the phone call at midnight when a flight gets cancelled.
          </ScrubText>
        </div>
      </section>

      {/* ---- Values ---- */}
      <section className="section bg-slate-50">
        <div className="wrap">
          <SectionHeading center eyebrow="What guides us" title="Three things we refuse to compromise on" />
          <RevealGrid className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Spotlight key={v.title} className="h-full rounded-4xl" color="rgb(18 115 196 / 0.12)">
                <div className="group flex h-full flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={v.img}
                      alt={v.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" aria-hidden="true" />
                    <span
                      aria-hidden="true"
                      className="absolute bottom-3 left-5 font-display text-[3.2rem] leading-none font-extrabold text-transparent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1"
                      style={{ WebkitTextStroke: '1.5px rgb(255 255 255 / 0.9)' }}
                    >
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-[1.3rem]">{v.title}</h3>
                    <span
                      aria-hidden="true"
                      className="mt-3 block h-[2px] w-10 origin-left rounded-full bg-gold-500 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-[2.4]"
                    />
                    <p className="mt-3 text-[1.04rem] text-pretty">{v.desc}</p>
                  </div>
                </div>
              </Spotlight>
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* ---- Founder ---- */}
      <section className="section overflow-hidden bg-white">
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
                {[
                  { href: `tel:${BIZ.phone}`, icon: Phone, label: BIZ.phoneDisplay },
                  { href: `mailto:${BIZ.email2}`, icon: Mail, label: BIZ.email2 },
                  { href: `mailto:${BIZ.email}`, icon: Mail, label: BIZ.email },
                ].map(({ href, icon: Icon, label }) => (
                  <a key={href} href={href} className="group flex min-w-0 items-center gap-3.5 text-[1.07rem] hover:text-brand-500">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-500 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-[-8deg] group-hover:bg-brand-500 group-hover:text-white">
                      <Icon size={17} />
                    </span>
                    <span className="link-grow min-w-0 break-words">{label}</span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="relative">
            {/* gold frame drifting behind the photo */}
            <Parallax speed={0.22} className="pointer-events-none absolute inset-0 hidden sm:block" >
              <div aria-hidden="true" className="h-full w-full translate-x-5 translate-y-5 rounded-5xl border-2 border-gold-500/60" />
            </Parallax>
            <ImageReveal from="right" className="relative rounded-5xl shadow-[var(--shadow-lift)]">
              <img
                src={IMG.founder}
                alt="Goa coastline — a long-running favourite with our clients"
                loading="lazy"
                className="aspect-[4/3.4] w-full object-cover"
              />
            </ImageReveal>
          </div>
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
        <Orbs className="!-z-[5] opacity-70" />
        <Grain className="-z-[4]" />
        <div className="wrap relative z-10">
          <RevealGrid className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4" stagger={0.12}>
            {STATS.map((s) => (
              <Spotlight key={s.label} className="h-full rounded-4xl">
                <div className="glass group relative h-full overflow-hidden rounded-4xl px-4 py-9 text-center sm:px-6">
                  <span aria-hidden="true" className="pointer-events-none absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-gold-500/20 blur-2xl transition-transform duration-700 group-hover:scale-150" />
                  <div className="relative font-display text-[clamp(1.9rem,4vw,2.9rem)] leading-none font-extrabold text-gold-400">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <span aria-hidden="true" className="mx-auto mt-4 block h-px w-12 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
                  <div className="mt-3 text-[0.94rem] text-white/65">{s.label}</div>
                </div>
              </Spotlight>
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="section bg-white">
        <div className="wrap">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-5xl bg-navy-950 px-6 py-16 text-center sm:px-8 md:px-16">
              <Orbs />
              <Grain />
              <FlightPath
                className="absolute inset-x-0 bottom-0 -z-[1] opacity-50"
                d="M 20 250 C 220 120, 420 260, 620 150 S 980 30, 1180 110"
                start="top 90%"
                end="bottom 40%"
              />
              <h2 className="h-sec !text-white text-balance">Come say hello</h2>
              <p className="mx-auto mt-5 max-w-xl text-[1.14rem] text-white/70 text-pretty">
                Walk into our office on Hospital Road, or just send a WhatsApp message. Either works.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Magnetic strength={0.25}>
                  <Link to="/contact" className="btn btn-gold">Contact Us</Link>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
                    Message on WhatsApp
                  </a>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
