import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle, ShieldCheck, Plane } from 'lucide-react'
import { BIZ, NAV, SERVICES, DESTINATIONS, waLink } from '../data/site.js'
import { Stagger } from './motion.jsx'
import { Marquee, Orbs, Grain, RotatingBadge } from './fx.jsx'
import { gsap, SplitText, useGSAP, reduceMotion, enterTrigger } from '../lib/gsap.js'

const LINK = 'link-grow transition-colors hover:text-gold-400'

/* ------------------------------------------------------------
   Wordmark — oversized outlined brand name that rises letter by
   letter as the footer comes in. Clipped by its own container so
   it can never push the page wider than the viewport.
   ------------------------------------------------------------ */
function Wordmark() {
  const ref = useRef(null)

  // Size the line so it exactly spans its container at every width.
  useEffect(() => {
    const el = ref.current
    const box = el?.parentElement
    if (!el || !box) return
    let last = -1
    const fit = (force) => {
      if (force !== true && box.clientWidth === last) return
      last = box.clientWidth
      el.style.fontSize = '100px'
      const w = el.scrollWidth
      if (w) el.style.fontSize = `${Math.floor((100 * box.clientWidth * 0.99) / w)}px`
    }
    fit()
    document.fonts?.ready.then(() => fit(true))
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  useGSAP(() => {
    const el = ref.current
    if (!el || reduceMotion()) return
    let split
    const run = () => {
      split = SplitText.create(el, { type: 'chars', charsClass: 'inline-block' })
      gsap.fromTo(split.chars, { yPercent: 105, rotate: 6 }, {
        yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: 0.035,
        scrollTrigger: enterTrigger(el, { start: 'top 98%' }),
      })
    }
    if (document.fonts?.ready) document.fonts.ready.then(run)
    else run()
    return () => split?.revert()
  }, { scope: ref })

  return (
    <div aria-hidden="true" className="pointer-events-none relative mt-12 overflow-hidden select-none [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
      <div
        ref={ref}
        className="inline-block font-display text-[9vw] leading-[0.92] font-extrabold tracking-[-0.03em] whitespace-nowrap text-transparent"
        style={{ WebkitTextStroke: '1px rgb(255 255 255 / 0.22)' }}
      >
        Pro Tours <span className="accent font-medium text-gold-500/80" style={{ WebkitTextStroke: '0' }}>&amp;</span> Travel
      </div>
    </div>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative isolate overflow-hidden bg-navy-950 text-white/65">
      <Orbs className="opacity-70" />
      <Grain />

      {/* ---- Destination ticker ---- */}
      <div className="relative border-y border-white/10 bg-white/[0.02] py-5">
        <Marquee speed={55} trackClassName="gap-0">
          {DESTINATIONS.map((d) => (
            <span key={d.name} className="flex shrink-0 items-center gap-6 px-6 sm:gap-8 sm:px-8">
              <span className="accent text-[1.7rem] leading-none whitespace-nowrap text-white/80 sm:text-[2.1rem]">{d.name}</span>
              <Plane size={16} aria-hidden="true" className="rotate-45 text-gold-500" />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="wrap relative z-10 pt-16 pb-10 md:pt-20">
        <Stagger className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.5fr]" stagger={0.1}>
          {/* Brand */}
          <div>
            <Link to="/" className="mb-6 inline-block" aria-label={`${BIZ.name} — home`}>
              <img src="/logo-white.png" alt={BIZ.name} width={1200} height={209} className="h-11 w-auto" />
            </Link>

            <p className="mb-6 max-w-sm text-[1.04rem] text-pretty">
              {BIZ.tagline}. Air ticketing, hotels, visas, holidays, cruises and Umrah — handled end to end
              from our office in Shivaji Nagar, Bengaluru.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <a
                href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/8 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:rotate-[-6deg] hover:border-transparent hover:bg-[#25d366] hover:text-white"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={BIZ.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/8 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:rotate-[-6deg] hover:border-transparent hover:bg-[linear-gradient(45deg,#f09433,#dc2743,#bc1888)] hover:text-white"
              >
                <Instagram size={18} />
              </a>
              <a
                href={`tel:${BIZ.phone}`} aria-label="Call us"
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/8 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:rotate-[-6deg] hover:border-transparent hover:bg-brand-500 hover:text-white"
              >
                <Phone size={18} />
              </a>
              <a
                href={`mailto:${BIZ.email2}`} aria-label="Email us"
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/8 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:rotate-[-6deg] hover:border-transparent hover:bg-gold-500 hover:text-navy-950"
              >
                <Mail size={18} />
              </a>
              <a
                href={`mailto:${BIZ.email}`} aria-label="Alternate email"
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/8 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:rotate-[-6deg] hover:border-transparent hover:bg-gold-500 hover:text-navy-950"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h5 className="mb-5 font-display text-[1.1rem] font-bold !text-white">Pages</h5>
            <ul className="space-y-3 text-[1.02rem]">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="group inline-flex items-center gap-2.5 transition-colors hover:text-gold-400">
                    <span className="h-1 w-1 rounded-full bg-gold-500/70 transition-transform duration-500 group-hover:scale-[2.2]" />
                    <span className="link-grow">{n.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="mb-5 font-display text-[1.1rem] font-bold !text-white">Services</h5>
            <ul className="space-y-3 text-[1.02rem]">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    to={
                      s.id === 'umrah' ? '/umrah'
                      : s.id === 'passport' ? '/visa#passport'
                      : s.id === 'visa' ? '/visa'
                      : s.id === 'flights' ? '/flights-hotels#flights'
                      : s.id === 'hotels' ? '/flights-hotels#hotels'
                      : `/services#${s.id}`
                    }
                    className="group inline-flex items-center gap-2.5 transition-colors hover:text-gold-400"
                  >
                    <span className="h-1 w-1 rounded-full bg-gold-500/70 transition-transform duration-500 group-hover:scale-[2.2]" />
                    <span className="link-grow">{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <h5 className="mb-5 font-display text-[1.1rem] font-bold !text-white">Reach Us</h5>
            <ul className="space-y-4 text-[1.02rem]">
              <li className="flex gap-3">
                <MapPin size={17} className="mt-1 shrink-0 text-gold-500" />
                <a href={BIZ.mapsUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold-400">
                  {BIZ.address.line1}, {BIZ.address.line2}, {BIZ.address.line3}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone size={17} className="mt-1 shrink-0 text-gold-500" />
                <a href={`tel:${BIZ.phone}`} className={LINK}>{BIZ.phoneDisplay}</a>
              </li>
              <li className="flex gap-3">
                <Mail size={17} className="mt-1 shrink-0 text-gold-500" />
                <span className="flex min-w-0 flex-col items-start gap-1.5">
                  <a href={`mailto:${BIZ.email2}`} className={`${LINK} break-all`}>{BIZ.email2}</a>
                  <a href={`mailto:${BIZ.email}`} className={`${LINK} break-all`}>{BIZ.email}</a>
                </span>
              </li>
              <li className="flex gap-3">
                <Instagram size={17} className="mt-1 shrink-0 text-gold-500" />
                <a href={BIZ.instagram} target="_blank" rel="noopener noreferrer" className={LINK}>
                  {BIZ.instagramHandle}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={17} className="mt-1 shrink-0 text-gold-500" />
                <span>{BIZ.hours}</span>
              </li>
            </ul>
          </div>
        </Stagger>

        <div className="relative mt-14 pt-7">
          {/* gold hairline with a travelling highlight */}
          <span aria-hidden="true" className="hero-hairline pointer-events-none absolute inset-x-0 top-0 h-px opacity-70" />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.9rem] sm:justify-start">
            <Link to="/terms" className={LINK}>Terms & Conditions</Link>
            <Link to="/privacy" className={LINK}>Privacy Policy</Link>
            <Link to="/refund-policy" className={LINK}>Cancellation & Refund Policy</Link>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-[0.85rem] text-white/50 sm:justify-start sm:text-left">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" /> Payments secured by Razorpay
          </span>
          <span>We accept Visa · Mastercard · RuPay · American Express · UPI · Net Banking</span>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-5 pt-2 text-center text-[0.94rem] sm:flex-row sm:text-left">
          <span>© {year} {BIZ.name}. All rights reserved.</span>
          <RotatingBadge text="IATA ACCREDITED TRAVEL AGENT • " size={104} textClass="fill-white/55">
            <img src="/iata-logo.png" alt="IATA Accredited Travel Agent" width={512} height={512} className="h-12 w-12 shrink-0" />
          </RotatingBadge>
          <span>Bengaluru, Karnataka · India</span>
        </div>

        <Wordmark />
      </div>
    </footer>
  )
}
