import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, ArrowRight, ArrowUpRight } from 'lucide-react'

import { BIZ, FACTS, PHOTOS, YEARS, waLink } from '../data/site.js'
import { Reveal, SectionHeading, PageHero } from '../components/ui.jsx'
import { Parallax } from '../components/motion.jsx'
import {
  ImageReveal, ScrubText, FlightPath, Polaroid, Stamp, DrawLine, CircleMark,
} from '../components/fx.jsx'
import { gsap, useGSAP, reduceMotion, enterTrigger } from '../lib/gsap.js'
import { photo } from '../lib/img.js'

/* Stock stand-ins, used only while the matching PHOTOS slot is empty. */
const STOCK = {
  hero: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1800&q=74',
  office: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=72',
  desk: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=700&q=72',
  founder: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=72',
}

/**
 * One photo slot. A caption that claims "our office" or names the founder
 * only appears when the business's own photo is in place; the stock
 * stand-in gets an honest alt text and a neutral caption (or none).
 */
function slot(key, real, stock) {
  const own = PHOTOS[key]
  return own
    ? { src: own, alt: real.alt, caption: real.caption }
    : { src: STOCK[key], alt: stock.alt, caption: stock.caption }
}

const OFFICE = slot(
  'office',
  { alt: `The ${BIZ.shortName} office at A.M. Plaza, Hospital Road`, caption: 'Our office on Hospital Road' },
  { alt: 'A traditional houseboat on the Kerala backwaters', caption: 'Kerala backwaters' },
)
const DESK = slot(
  'desk',
  { alt: `The ${BIZ.shortName} team at work`, caption: 'At the desk' },
  { alt: 'Shikaras and houseboats on Dal Lake, Srinagar', caption: null },
)
const FOUNDER = slot(
  'founder',
  { alt: `${BIZ.owner}, founder of ${BIZ.name}`, caption: BIZ.owner },
  { alt: 'Palm-lined beach in Goa', caption: 'Goa' },
)

const OFFER = [
  'Domestic and international air tickets on all major airlines',
  'Visa and passport paperwork, done in-house',
  'Custom holidays, honeymoons, group tours and corporate meets',
  'A Hajj & Umrah division with seasonal group departures',
]

const VALUES = [
  {
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=72',
    alt: 'Two people shaking hands across a desk',
    title: 'Prices you can read',
    desc: 'We show the airline fare, the taxes and our service fee separately. If a cheaper routing exists, we tell you about it, even when it earns us less.',
  },
  {
    img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=72',
    alt: 'A consultant on a phone call at her desk',
    title: 'One person to talk to',
    desc: 'No ticket numbers and no call queues. Whoever quoted your trip is the one who sorts it out if something changes while you are away.',
  },
  {
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=72',
    alt: 'Paperwork being checked with a pen',
    title: 'Paperwork checked twice',
    desc: 'Most visa rejections come from the paperwork, not the traveller. We read every file line by line before it goes to the consulate.',
  },
]

const [DAYS, TIMES] = BIZ.hours.split(': ')

/* The value photos sit in a 260px / 320px column on desktop, full width on phones. */
const VALUE_SIZES = '(min-width: 1024px) 320px, (min-width: 768px) 260px, calc(100vw - 40px)'

/* ------------------------------------------------------------
   RouteList — the checklist as a small route map: a line inks
   down the rail as you scroll and each stop is stamped in.
   ------------------------------------------------------------ */
function RouteList({ items }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el || reduceMotion()) return
    const q = gsap.utils.selector(el)
    gsap.fromTo(q('[data-rail]'), { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 60%', scrub: 0.8 },
    })
    gsap.fromTo(q('[data-stop]'), { scale: 0 }, {
      scale: 1, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.14,
      scrollTrigger: enterTrigger(el, { start: 'top 85%' }),
    })
  }, { scope: ref })

  return (
    <ul ref={ref} className="relative mt-8 grid gap-5">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[6px] w-px border-l border-dashed border-slate-300" />
      <span aria-hidden="true" data-rail className="absolute top-2 bottom-2 left-[5.5px] w-[2px] origin-top bg-gold-600/70" />
      {items.map((x) => (
        <li key={x} className="relative flex gap-4">
          <span data-stop aria-hidden="true" className="relative mt-[0.55rem] h-[13px] w-[13px] shrink-0 rounded-full border-[2.5px] border-navy-900 bg-paper" />
          <span className="text-[1.07rem] text-pretty">{x}</span>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------
   IataSeal — the accreditation logo set like a round passport
   stamp: double ring, a little rotated, lands with a thud.
   ------------------------------------------------------------ */
function IataSeal({ className = '', rotate = 9 }) {
  const ref = useRef(null)
  useGSAP(() => {
    const el = ref.current
    if (!el) return
    if (reduceMotion()) { gsap.set(el, { rotation: rotate }); return }
    gsap.fromTo(el, { autoAlpha: 0, scale: 1.6, rotation: rotate - 14 }, {
      autoAlpha: 1, scale: 1, rotation: rotate, duration: 0.55, ease: 'back.out(2.2)', delay: 0.5,
      scrollTrigger: enterTrigger(el, { start: 'top 92%' }),
    })
  }, { scope: ref })

  return (
    <div
      ref={ref}
      className={`grid h-[8.5rem] w-[8.5rem] place-items-center rounded-full border-[2.5px] border-navy-900 bg-paper p-[5px] shadow-[0_12px_24px_-16px_rgb(60_40_20/0.6)] ${className}`}
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-dashed border-navy-900/70 text-navy-900">
        <span className="font-display text-[0.55rem] font-extrabold tracking-[0.26em] uppercase">Accredited</span>
        <img
          src="/iata-logo.png" alt="IATA logo: Pro Tours is an IATA-accredited travel agent"
          width={512} height={512} loading="lazy" decoding="async" className="my-1 h-11 w-11"
        />
        <span className="font-display text-[0.55rem] font-extrabold tracking-[0.26em] uppercase">Travel agent</span>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <>
      <PageHero
        img={STOCK.hero}
        alt="The Taj Mahal at sunrise, seen across its gardens"
        eyebrow="About Pro Tours"
        title="A travel desk on Hospital Road"
        sub={`We have been booking flights, hotels, visas, holidays and Umrah from Shivaji Nagar for ${YEARS} years. Most of our clients found us through someone they know.`}
      />

      {/* ---- Who we are: text + pinned photos ---- */}
      <section aria-labelledby="about-who" className="section overflow-hidden bg-paper">
        <div className="wrap grid items-start gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div className="lg:pt-6">
            <Reveal><span className="eyebrow">Who we are</span></Reveal>
            <h2 id="about-who" className="h-sec mt-4 text-balance">One office that handles the whole trip</h2>
            <p className="mt-6 text-pretty">
              {BIZ.name} is an IATA-accredited travel agency in Shivaji Nagar, Bengaluru, run by its founder{' '}
              {BIZ.owner}. We started in {BIZ.since}{' '}
              because booking one trip usually meant dealing with four different people: one for the ticket, one
              for the hotel, one for the visa and nobody at all when something went wrong.
            </p>
            <p className="mt-4 text-pretty">
              From A.M. Plaza on Hospital Road, a short walk from Infantry Road, we look after corporate travel
              accounts, family holidays, honeymoons, group departures and Hajj and Umrah. Some of our clients have
              been booking with us since their first passport.
            </p>
            <RouteList items={OFFER} />
            <p className="mt-8 text-[1.02rem] text-pretty">
              See our{' '}
              <Link to="/services" className="link-grow font-bold text-navy-900 hover:text-brand-500">full list of travel services</Link>,{' '}
              <Link to="/visa" className="link-grow font-bold text-navy-900 hover:text-brand-500">visa and passport help</Link> and{' '}
              <Link to="/umrah" className="link-grow font-bold text-navy-900 hover:text-brand-500">Umrah packages from Bengaluru</Link>.
            </p>
          </div>

          {/* photo collage — a big print, a small one tucked under it, and the seal */}
          <div className="relative mx-auto w-full max-w-[520px] pb-16 sm:pb-24">
            <Parallax speed={0.1}>
              <div>
                <Polaroid {...OFFICE} rotate={-2.5} imgClassName="aspect-[4/3.4]" />
              </div>
            </Parallax>
            <Polaroid
              {...DESK}
              rotate={4}
              imgClassName="aspect-square"
              className="absolute right-[-4%] bottom-0 w-[46%] sm:right-[-8%]"
            />
            <IataSeal className="absolute bottom-6 left-[4%] sm:left-[8%]" />
          </div>
        </div>

        {/* plain, checkable facts in a ruled ledger */}
        <div className="wrap mt-16 md:mt-20">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-x-10">
            {FACTS.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.06} y={14} className="min-w-0 border-t-2 border-navy-900 pt-4">
                <dt className="font-accent text-[1.45rem] leading-tight font-semibold text-navy-900 italic sm:text-[1.85rem]">{f.big}</dt>
                <dd className="mt-1 text-[0.98rem] text-body">{f.label}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- The idea: the one scrubbed statement on the page ---- */}
      <section aria-label="The idea we started with" className="relative isolate overflow-hidden bg-navy-950 py-24 md:py-32">
        <FlightPath
          className="absolute inset-x-0 top-1/2 -z-[1] -translate-y-1/2 opacity-35"
          start="top 90%"
          end="bottom 20%"
        />
        <div className="wrap relative">
          <Reveal><span className="eyebrow eyebrow-light">The idea we started with</span></Reveal>
          <ScrubText
            className="mt-6 max-w-5xl font-display text-[clamp(1.7rem,4.2vw,3.35rem)] leading-[1.16] font-bold tracking-tight text-white text-balance"
            dim={0.18}
          >
            One trip, one person. The ticket, the hotel, the visa file, and the phone call at midnight when a
            flight gets cancelled.
          </ScrubText>
        </div>
      </section>

      {/* ---- A note from the founder ---- */}
      <section aria-labelledby="about-founder" className="section paper overflow-hidden bg-sand">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-[380px]">
            <Polaroid {...FOUNDER} rotate={-4} imgClassName="aspect-[4/4.6]" />
          </div>

          <Reveal y={24}>
            <article className="relative rounded-md border border-slate-200 bg-paper px-6 py-9 shadow-[0_24px_48px_-32px_rgb(60_40_20/0.55)] sm:px-10 sm:py-11">
              <h2 id="about-founder" className="eyebrow">A note from the founder</h2>
              <div className="mt-6 grid gap-4 text-[1.1rem] text-pretty">
                <p className="quote !text-[1.45rem] leading-snug text-navy-900">Dear traveller,</p>
                <p>
                  One trip, one person: that is the idea we started with in {BIZ.since}, and it is still how we
                  work. You tell us once what
                  you need, and the same desk books it, checks it and stays with it until you are home.
                </p>
                <p>
                  Most of our clients deal with me directly. I go through every Umrah file and every complicated
                  international itinerary myself before it goes out, because that is where small mistakes turn
                  into expensive ones.
                </p>
                <p>
                  If you are nearby, come in. We are on the ground floor of A.M. Plaza on Hospital Road. If you are
                  not, a WhatsApp message reaches the same desk.
                </p>
              </div>
              <div className="mt-8">
                <div className="relative inline-block">
                  <span className="note block text-[2rem] leading-none text-navy-900">{BIZ.owner}</span>
                  <DrawLine className="absolute -bottom-3 left-0 h-3 w-full" color="#8a5a00" delay={0.5} />
                </div>
                <p className="mt-5 font-display text-[0.98rem] font-bold text-body">Founder &amp; Managing Consultant</p>
              </div>

              <ul className="mt-8 grid gap-2 border-t border-slate-200 pt-6 text-[1.02rem] sm:grid-cols-2 sm:gap-x-6">
                {[
                  { href: `tel:${BIZ.phone}`, icon: Phone, label: BIZ.phoneDisplay, sr: 'Call' },
                  { href: `mailto:${BIZ.email2}`, icon: Mail, label: BIZ.email2, sr: 'Email' },
                  { href: `mailto:${BIZ.email}`, icon: Mail, label: BIZ.email, sr: 'Email' },
                ].map(({ href, icon: Icon, label, sr }) => (
                  <li key={href}>
                    <a href={href} className="flex min-h-[44px] min-w-0 items-center gap-3 text-navy-900 hover:text-brand-500">
                      <Icon size={16} aria-hidden="true" className="shrink-0 text-gold-600" />
                      <span className="link-grow min-w-0 break-words"><span className="sr-only">{sr} </span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ---- How we work ---- */}
      <section aria-label="How we work" className="section bg-paper">
        <div className="wrap">
          <SectionHeading eyebrow="How we work" title="Three things we don't cut corners on" />
          <ol className="border-t border-slate-300">
            {VALUES.map((v, i) => (
              <li key={v.title} className="grid items-center gap-6 border-b border-slate-300 py-8 md:grid-cols-[260px_1fr] md:gap-10 lg:grid-cols-[320px_1fr]">
                <ImageReveal from={i % 2 ? 'right' : 'left'} className="rounded-xl">
                  <img
                    {...photo(v.img, { sizes: VALUE_SIZES, widths: [320, 480, 640, 960], quality: 72 })}
                    alt={v.alt} width={900} height={563} loading="lazy" decoding="async"
                    className="aspect-[16/10] w-full object-cover"
                  />
                </ImageReveal>
                <Reveal y={18}>
                  <span className="note text-[1.2rem] text-gold-600">No. {i + 1}</span>
                  <h3 className="mt-1 text-[1.45rem]">{v.title}</h3>
                  <p className="mt-3 max-w-2xl text-[1.06rem] text-pretty">{v.desc}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Visit us ---- */}
      <section aria-labelledby="about-visit" className="section paper overflow-hidden bg-sand">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal><span className="eyebrow">Visit us</span></Reveal>
            <h2 id="about-visit" className="h-sec mt-4 text-balance">Come in and say hello</h2>
            <p className="mt-5 max-w-xl text-pretty">
              Our travel agency in Shivaji Nagar is open {DAYS}, {TIMES}. Walk in during working hours, or send a
              WhatsApp message first if you'd like us to have your options ready. Either is fine.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="flex gap-3.5">
                <MapPin size={20} aria-hidden="true" className="mt-1 shrink-0 text-clay" />
                <address className="text-[1.04rem] not-italic">
                  <span className="sr-only">{BIZ.name}, </span>
                  <span className="block font-display font-bold text-ink">{BIZ.address.line1}</span>
                  <span className="block">
                    Hospital Road, <CircleMark color="#b4532a">near Infantry Road</CircleMark>
                  </span>
                  <span className="block">{BIZ.address.line3}</span>
                </address>
              </div>
              <div className="flex gap-3.5">
                <Clock size={20} aria-hidden="true" className="mt-1 shrink-0 text-clay" />
                <p className="text-[1.04rem]">
                  <span className="block font-display font-bold text-ink">{DAYS}</span>
                  <span className="block">{TIMES}</span>
                </p>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href={BIZ.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-brand">
                Get directions <span className="sr-only">to A.M. Plaza on Google Maps</span> <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a
                href={waLink()} target="_blank" rel="noopener noreferrer"
                className="link-grow font-display text-[1.04rem] font-bold text-palm"
              >
                or message us on WhatsApp
              </a>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-[420px] place-items-center py-6">
            <Stamp
              top={`Bengaluru ${BIZ.address.line3.slice(-6)}`}
              main="Shivaji Nagar"
              bottom={`Est. ${BIZ.since}`}
              tone="clay"
              rotate={-7}
              className="scale-125 sm:scale-150"
            />
            <Link
              to="/contact"
              className="mt-14 inline-flex items-center gap-2 font-display text-[1rem] font-bold text-navy-900 hover:text-brand-500"
            >
              All the ways to reach us <span className="sr-only">on the contact page</span> <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
