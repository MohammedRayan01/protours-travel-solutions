import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Check, Sparkles, MousePointer2 } from 'lucide-react'

import { BIZ, HERO_SLIDES, SERVICES, DESTINATIONS, PACKAGES, REVIEWS, STATS, FAQS, waLink } from '../data/site.js'
import { Reveal, SectionHeading, Counter, Stars, Accordion } from '../components/ui.jsx'
import { Stagger, Parallax, Magnetic, TiltCard, SplitHeading } from '../components/motion.jsx'
import { gsap, useGSAP, SplitText, EASE, EASE_EXPO, reduceMotion } from '../lib/gsap.js'
import { scrollTo } from '../components/SmoothScroll.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'

const serviceLink = (id) =>
  id === 'umrah' ? '/umrah' : id === 'passport' ? '/visa#passport' : id === 'visa' ? '/visa' : `/services#${id}`

/* ============================================================
   HERO — fully-bleed photography, submerged under gradient,
   glass panels floating on top.
   ============================================================ */
function Hero() {
  const [i, setI] = useState(0)
  const root = useRef(null)
  const slidesRef = useRef([])
  const contentRef = useRef(null)

  /* Auto-advance the slideshow. */
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HERO_SLIDES.length), 6500)
    return () => clearInterval(t)
  }, [])

  /* Crossfade + slow zoom on the active slide, driven by GSAP so the
     slideshow shares one ticker with the scroll animations. */
  useGSAP(() => {
    const slides = slidesRef.current.filter(Boolean)
    if (!slides.length) return

    slides.forEach((el, k) => {
      const active = k === i
      gsap.to(el, {
        autoAlpha: active ? 1 : 0,
        duration: reduceMotion() ? 0 : 1.5,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
      if (active && !reduceMotion()) {
        gsap.fromTo(el, { scale: 1.16 }, { scale: 1.02, duration: 7.5, ease: 'none', overwrite: 'auto' })
      }
    })
  }, { dependencies: [i] })

  /* Intro timeline — headline splits into words that rise out of a mask.
     Hero elements start with `js-hide` in the markup so nothing flashes
     while we wait on document.fonts; every step is an explicit fromTo so
     the final state is always "visible", even if a tween is interrupted. */
  useGSAP(() => {
    const el = contentRef.current
    if (!el) return

    const all = el.parentElement.querySelectorAll(
      '[data-hero-badge],[data-hero-title],[data-hero-copy],[data-hero-btn],[data-hero-stats],[data-hero-cue]'
    )

    // Reduced motion, or anything unexpected: just show it.
    if (reduceMotion()) { gsap.set(all, { autoAlpha: 1 }); return }

    let split
    let cancelled = false

    const run = () => {
      if (cancelled) return
      const heading = el.querySelector('[data-hero-title]')
      split = SplitText.create(heading, { type: 'words,lines', mask: 'lines', linesClass: 'split-line' })
      gsap.set(heading, { autoAlpha: 1 }) // container shows; the words animate

      const tl = gsap.timeline({ defaults: { ease: EASE_EXPO } })
      tl.fromTo('[data-hero-badge]', { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 })
        .fromTo(split.words, { yPercent: 118, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.15, stagger: 0.045 }, '-=0.55')
        .fromTo('[data-hero-copy]', { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, '-=0.75')
        .fromTo('[data-hero-btn]', { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 }, '-=0.6')
        .fromTo('[data-hero-stats]', { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, '-=0.55')
        .fromTo('[data-hero-cue]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, '-=0.4')
    }

    // Fail-safe: if fonts never settle, reveal anyway rather than stay blank.
    const bail = setTimeout(() => { if (!split) gsap.set(all, { autoAlpha: 1 }) }, 2500)

    if (document.fonts?.ready) document.fonts.ready.then(run)
    else run()

    return () => {
      cancelled = true
      clearTimeout(bail)
      split?.revert()
    }
  }, { scope: contentRef })

  /* Content drifts up and dissolves as the hero scrolls away. */
  useGSAP(() => {
    if (!contentRef.current || reduceMotion()) return
    gsap.to(contentRef.current, {
      yPercent: -22,
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 40%', scrub: true },
    })
  }, { scope: root })

  return (
    /* -mt pulls the hero up beneath the sticky nav so the bar floats over the
       photography. Without it the nav keeps its own row and its white-on-
       transparent text lands on the white page background. */
    <section
      ref={root}
      className="relative isolate -mt-[74px] flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Submerged background imagery */}
      {HERO_SLIDES.map((s, k) => (
        <img
          key={s.img}
          ref={(el) => { slidesRef.current[k] = el }}
          src={s.img}
          alt={s.alt}
          fetchPriority={k === 0 ? 'high' : 'low'}
          loading={k === 0 ? 'eager' : 'lazy'}
          style={{ opacity: k === 0 ? 1 : 0 }}
          className="absolute inset-0 -z-20 h-full w-full object-cover will-change-transform"
        />
      ))}

      {/* Deep gradient wash so the photo reads as one submerged surface */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/58 via-navy-950/28 to-navy-950/60" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/45 via-transparent to-transparent" />
      {/* Colour blooms */}
      <div className="pointer-events-none absolute -top-24 -left-24 -z-10 h-[520px] w-[520px] rounded-full bg-brand-500/22 blur-[130px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[480px] w-[480px] rounded-full bg-gold-500/16 blur-[130px]" />

      <div ref={contentRef} className="wrap relative z-10 pt-28 pb-24 md:pt-24">
        <div className="max-w-4xl">
          <span
            data-hero-badge
            className="js-hide glass inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full py-2 pr-5 pl-2 text-[0.86rem] font-semibold text-white/90 sm:text-[0.92rem]"
          >
            <span className="rounded-full bg-gold-500 px-3 py-1 text-[0.77rem] font-extrabold tracking-[0.08em] text-navy-950 uppercase">
              Since {BIZ.since}
            </span>
            Trusted by 10,000+ travellers from Bengaluru
          </span>

          <h1 data-hero-title className="js-hide h-hero mt-7 !text-white text-balance">
            One stop travel solutions for{' '}
            <span className="accent text-gold-400 sm:whitespace-nowrap">all your travel needs</span>
          </h1>

          <p data-hero-copy className="js-hide mt-7 max-w-2xl text-[1.25rem] text-white/80 text-pretty">
            Flights, hotels, visas, passports, tailor-made holidays, cruises and Umrah — planned, booked and
            supported by a real team you can call, not a chatbot.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Magnetic>
              <Link to="/packages" data-hero-btn className="js-hide btn btn-gold">
                Explore Packages <ArrowRight size={17} />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" data-hero-btn className="js-hide btn btn-glass">
                Plan My Trip
              </a>
            </Magnetic>
          </div>

          {/* Glass stat rail */}
          <div
            data-hero-stats
            className="js-hide glass mt-14 grid max-w-3xl grid-cols-2 gap-y-7 rounded-4xl px-8 py-7 sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-[2.09rem] leading-none font-extrabold text-white">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-[0.88rem] text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        data-hero-cue
        onClick={() => scrollTo('#services', { offset: -40 })}
        aria-label="Scroll to services"
        className="js-hide absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 transition-colors hover:text-gold-400 md:flex"
      >
        <MousePointer2 size={15} />
        <span className="font-display text-[0.73rem] font-bold tracking-[0.22em] uppercase">Scroll</span>
        <span className="h-9 w-px bg-gradient-to-b from-white/45 to-transparent" />
      </button>

      {/* Slide indicators */}
      <div className="absolute right-6 bottom-7 z-10 flex gap-2.5">
        {HERO_SLIDES.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Go to slide ${k + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${k === i ? 'w-8 bg-gold-500' : 'w-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   QUICK ENQUIRY — glass card overlapping the hero
   ============================================================ */
function QuickEnquiry() {
  return (
    <section className="relative z-20 -mt-16">
      <div className="wrap">
        <Reveal>
          <div className="rounded-4xl border border-white/70 bg-white/80 p-7 shadow-[var(--shadow-lift)] backdrop-blur-2xl md:p-9">
            <div className="mb-6 flex items-center gap-2.5">
              <Sparkles size={18} className="text-gold-500" />
              <span className="font-display text-[0.9rem] font-bold tracking-[0.14em] text-navy-900 uppercase">
                Free quote in minutes
              </span>
            </div>
            <EnquiryForm layout="bar" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================================
   SERVICES — first section after the hero.
   Flight & Hotel Booking lead as large image cards.
   ============================================================ */
function ServicesSection() {
  const [flights, hotels, ...rest] = SERVICES

  const BigCard = ({ s, delay }) => (
    <Reveal delay={delay} className="sm:col-span-3">
      <Link
        to={serviceLink(s.id)}
        className="group relative block h-full min-h-[340px] overflow-hidden rounded-4xl sm:min-h-[400px]"
      >
        <img
          src={s.img}
          alt={s.title}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/72 to-navy-950/25" />

        <span className="absolute top-6 left-6 z-10 inline-flex max-w-[calc(100%-3rem)] items-center truncate rounded-full bg-gold-500 px-3 py-1 font-display text-[0.68rem] font-extrabold tracking-[0.08em] text-navy-950 uppercase">
          {s.short}
        </span>

        <div className="relative flex h-full flex-col justify-end p-8 pt-20">
          <h3 className="!text-white text-[1.72rem]">{s.title}</h3>
          <p className="mt-2.5 max-w-md text-[1.05rem] text-white/70 text-pretty">{s.desc}</p>

          {/* Inclusions in full — truncating these produced nonsense fragments */}
          <ul className="mt-5 grid max-w-md gap-2.5 border-t border-white/15 pt-5">
            {s.points.slice(0, 3).map((pt) => (
              <li key={pt} className="flex gap-2.5 text-[0.95rem] leading-snug text-white/85">
                <Check size={15} strokeWidth={3} className="mt-1 shrink-0 text-gold-400" />
                <span className="text-pretty">{pt}</span>
              </li>
            ))}
          </ul>

          <span className="mt-6 inline-flex items-center gap-2 font-display text-[1rem] font-bold text-gold-400">
            Learn more
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  )

  return (
    <section id="services" className="section scroll-mt-20 bg-white">
      <div className="wrap">
        <SectionHeading
          center
          eyebrow="What we do"
          title="Every travel service, under one roof"
          sub="Eight services that cover a journey from the first enquiry to the moment you are back home — handled by the same consultant throughout."
        />

        <div className="grid gap-5 sm:grid-cols-6">
          <BigCard s={flights} delay={0} />
          <BigCard s={hotels} delay={0.08} />

          {rest.map((s, i) => (
              <Reveal key={s.id} delay={0.05 * i} className="sm:col-span-3 lg:col-span-2">
                <Link
                  to={serviceLink(s.id)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="absolute top-0 left-0 z-20 h-[3px] w-0 bg-gradient-to-r from-brand-500 to-gold-500 transition-all duration-600 group-hover:w-full" />

                  {/* Photo header */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-navy-950/10 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-[1.32rem]">{s.title}</h3>
                    <p className="mt-1.5 font-display text-[0.95rem] font-bold text-brand-500">{s.short}</p>

                    {/* What you actually get — the card's substance */}
                    <ul className="mt-5 grid flex-1 gap-2.5 border-t border-slate-100 pt-5">
                      {s.points.slice(0, 3).map((pt) => (
                        <li key={pt} className="flex gap-2.5 text-[0.97rem] leading-snug">
                          <Check size={15} strokeWidth={3} className="mt-1 shrink-0 text-gold-500" />
                          <span className="text-pretty">{pt}</span>
                        </li>
                      ))}
                    </ul>

                    <span className="mt-6 inline-flex items-center gap-2 font-display text-[0.97rem] font-bold text-brand-500">
                      Learn more
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-4xl border border-slate-200 bg-slate-50 px-8 py-8 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="text-[1.28rem]">Not sure which service you need?</h3>
              <p className="mt-1.5 text-[1.02rem] text-pretty">
                Describe the trip and we will tell you exactly what it takes — and what it costs.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap justify-center gap-3">
              <Link to="/services" className="btn btn-ghost !py-3 !text-[0.97rem]">All Services</Link>
              <Magnetic>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold !py-3 !text-[0.97rem]">
                  Ask an Expert <ArrowRight size={16} />
                </a>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================================
   DESTINATIONS
   ============================================================ */
function DestinationsSection() {
  return (
    <section className="section bg-slate-50">
      <div className="wrap">
        <SectionHeading
          center
          eyebrow="Where our travellers go"
          title="Popular destinations this season"
          sub="Visa-friendly, well-priced and tested by our own clients — these are the trips we book most from Bengaluru."
        />

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {DESTINATIONS.map((d, i) => (
            <Reveal key={d.name} delay={(i % 4) * 0.07}>
              <TiltCard max={6}>
              <Link
                to="/packages"
                className="group relative block aspect-[3/4] overflow-hidden rounded-4xl"
              >
                <img
                  src={d.img}
                  alt={d.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent" />

                <span className="glass absolute top-4 right-4 rounded-full px-3 py-1.5 text-[0.79rem] font-bold text-white">
                  {d.nights}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[0.81rem] font-semibold text-gold-400">
                    <MapPin size={12} /> {d.country}
                  </span>
                  <h3 className="!text-white text-[1.23rem]">{d.name}</h3>
                  <p className="mt-1 text-[0.95rem] text-white/70">
                    from <span className="font-display font-bold text-white">{d.price}</span>
                  </p>
                </div>
              </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   FEATURED PACKAGES
   ============================================================ */
function PackagesSection() {
  const featured = PACKAGES.filter((p) => ['dubai', 'maldives', 'umrah-pkg'].includes(p.id))

  return (
    <section className="section bg-white">
      <div className="wrap">
        <SectionHeading
          center
          eyebrow="Handpicked holidays"
          title="Featured tour packages"
          sub="Every package comes in Economy, Deluxe and Premium — same destination, your choice of comfort. Prices are per person on twin sharing."
        />

        <div className="grid gap-7 md:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <article className="group flex h-full flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
                  />
                  <span className="glass absolute top-4 left-4 rounded-full px-3.5 py-1.5 text-[0.77rem] font-bold tracking-wide text-white uppercase">
                    {p.badge}
                  </span>
                  <span className="absolute right-4 bottom-4 rounded-full bg-gold-500 px-3.5 py-1.5 font-display text-[0.86rem] font-extrabold text-navy-950">
                    {p.nights}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <span className="mb-2 flex items-center gap-1.5 text-[0.86rem] font-semibold text-brand-500">
                    <MapPin size={13} /> {p.region}
                  </span>
                  <h3 className="text-[1.28rem]">{p.name}</h3>
                  <p className="mt-2.5 flex-1 text-[1.02rem] text-pretty">{p.desc}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {['Economy', 'Deluxe', 'Premium'].map((t) => (
                      <span key={t} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.81rem] font-semibold">
                        {t} · {p.tiers[t].price}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-dashed border-slate-200 pt-5">
                    <div>
                      <span className="block text-[0.75rem] tracking-wider text-slate-500 uppercase">Starting from</span>
                      <span className="font-display text-[1.45rem] font-extrabold text-navy-900">
                        {p.tiers.Economy.price}
                      </span>
                    </div>
                    <Link to="/packages" className="btn btn-brand !px-5 !py-2.5 !text-[0.95rem]">
                      View Tiers
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 text-center">
            <Link to="/packages" className="btn btn-ghost">
              View All Packages <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================================
   GOOGLE-VERIFIED REVIEWS
   ============================================================ */
function ReviewsSection() {
  const GoogleG = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.500 6.6-16.1z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.5A22 22 0 0 0 2 24c0 3.6.9 6.9 2.5 9.9l7.3-5.7z" />
      <path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.4 2 8.1 6.9 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z" />
    </svg>
  )

  return (
    <section className="section bg-slate-50">
      <div className="wrap">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">Client feedback</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="h-sec mt-4 text-balance">What our travellers actually say</h2>
          </Reveal>

          {/* Google rating badge */}
          <Reveal delay={0.16}>
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-5 rounded-3xl border border-slate-200 bg-white px-7 py-5 shadow-[0_16px_44px_-24px_rgb(4_24_44/0.35)]">
              <div className="flex items-center gap-3">
                <GoogleG size={26} />
                <div className="text-left">
                  <div className="font-display text-[0.9rem] font-bold text-ink">Google Reviews</div>
                  <div className="flex items-center gap-1 text-[0.81rem] text-emerald-600">
                    <Check size={12} strokeWidth={3} /> Verified business
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <span className="font-display text-[2.2rem] leading-none font-extrabold text-navy-900">{BIZ.rating}</span>
                <div>
                  <Stars n={5} size={14} />
                  <div className="mt-1 text-[0.84rem] text-slate-500">{BIZ.reviewCount}+ reviews</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 0.08}>
              <article className="flex h-full flex-col rounded-4xl border border-slate-200 bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <Stars n={r.stars} size={16} />
                  <GoogleG size={19} />
                </div>
                <p className="quote flex-1 text-ink text-pretty">“{r.text}”</p>
                <div className="mt-6 flex items-center gap-3.5 border-t border-slate-100 pt-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-navy-800 font-display text-[1.01rem] font-extrabold text-white">
                    {r.initials}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-display text-[1.03rem] font-bold text-ink">{r.name}</div>
                    <div className="truncate text-[0.88rem] text-slate-500">{r.place} · {r.when}</div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   STATS — 16+ years band, near the bottom
   ============================================================ */
function StatsSection() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 py-20 md:py-24">
      <img
        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=70"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950/70 to-navy-900/55" />
      <div className="pointer-events-none absolute -top-32 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-brand-500/22 blur-[120px]" />

      <div className="wrap relative z-10">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Reveal><span className="eyebrow eyebrow-light">By the numbers</span></Reveal>
          <Reveal delay={0.08}>
            <h2 className="h-sec mt-4 !text-white text-balance">Sixteen years of getting people there</h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="glass rounded-4xl px-6 py-9 text-center">
                <div className="font-display text-[clamp(2.1rem,4.4vw,3rem)] leading-none font-extrabold text-gold-400">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-3 text-[0.95rem] text-white/65">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   WHO WE ARE — deliberately the last content section
   ============================================================ */
function WhoWeAre() {
  return (
    <section className="section bg-white">
      <div className="wrap">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=72"
                alt="Travellers exploring India"
                loading="lazy"
                className="aspect-[4/3.4] w-full rounded-5xl object-cover shadow-[var(--shadow-lift)]"
              />
              <div className="absolute -right-3 -bottom-6 rounded-3xl border-4 border-white bg-navy-950 px-7 py-6 text-center shadow-[var(--shadow-lift)] sm:-right-6">
                <div className="font-display text-[2.31rem] leading-none font-extrabold text-gold-400">16+</div>
                <div className="mt-1.5 text-[0.79rem] tracking-[0.1em] text-white/60 uppercase">Years in travel</div>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal><span className="eyebrow">Who we are</span></Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-sec mt-4 text-balance">A Bengaluru travel desk that actually picks up the phone</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 text-pretty">
                Pro Tours &amp; Travel Solutions is a corporate travel consultant and full-service agency based at
                A.M. Plaza, Hospital Road, Shivaji Nagar. We handle everything a traveller needs under one roof —
                the ticket, the hotel, the visa, the itinerary, and the person who answers when plans change at 11 PM.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <ul className="mt-8 grid gap-3.5">
                {[
                  ['Corporate & leisure', 'from single business fares to 60-pax group departures.'],
                  ['Specialists in Hajj & Umrah', 'visa, tickets and hotels close to the Haram.'],
                  ['Documentation done right', 'visa files checked line by line before submission.'],
                  ['Walk in or WhatsApp', 'whichever is easier for you.'],
                ].map(([b, t]) => (
                  <li key={b} className="flex gap-3.5">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-500">
                      <Check size={12} strokeWidth={3.2} />
                    </span>
                    <span className="text-[1.07rem]">
                      <b className="font-display font-bold text-ink">{b}</b> — {t}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/about" className="btn btn-brand">More About Us <ArrowRight size={16} /></Link>
                <Link to="/contact" className="btn btn-ghost">Visit Our Office</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   FAQ + CTA
   ============================================================ */
function FaqSection() {
  return (
    <section className="section bg-slate-50">
      <div className="wrap grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Reveal><span className="eyebrow">Good to know</span></Reveal>
          <Reveal delay={0.08}><h2 className="h-sec mt-4 text-balance">Frequently asked questions</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 text-pretty">
              Still unsure about something? Message us on WhatsApp — we reply in minutes during working hours.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-8">
              Ask on WhatsApp
            </a>
          </Reveal>
        </div>
        <Accordion items={FAQS} />
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="bg-slate-50 pb-24">
      <div className="wrap">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-5xl bg-navy-950 px-8 py-16 text-center md:px-16 md:py-20">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=70"
              alt="" aria-hidden="true" loading="lazy"
              className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950/68 to-brand-600/38" />
            <div className="pointer-events-none absolute -top-28 -right-20 -z-10 h-[380px] w-[380px] rounded-full bg-gold-500/22 blur-[110px]" />

            <h2 className="h-sec !text-white text-balance">Ready when you are</h2>
            <p className="mx-auto mt-5 max-w-xl text-[1.17rem] text-white/75 text-pretty">
              Tell us where you want to go. We will come back with a clear plan, a real price and a date you can book.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Magnetic>
                <Link to="/contact" className="btn btn-gold">Start Planning <ArrowRight size={17} /></Link>
              </Magnetic>
              <Magnetic>
                <a href={`tel:${BIZ.phone}`} className="btn btn-glass">Call {BIZ.phoneDisplay}</a>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================================
   PAGE — order: Hero → Services → Destinations → Packages
                → Reviews → Stats → Who We Are → FAQ → CTA
   ============================================================ */
export default function Home() {
  return (
    <>
      <Hero />
      <QuickEnquiry />
      <ServicesSection />
      <DestinationsSection />
      <PackagesSection />
      <ReviewsSection />
      <StatsSection />
      <WhoWeAre />
      <FaqSection />
      <CtaSection />
    </>
  )
}
