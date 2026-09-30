import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle, ShieldCheck } from 'lucide-react'
import { BIZ, NAV, SERVICES, waLink } from '../data/site.js'
import { Stamp } from './fx.jsx'

const LINK = 'link-grow transition-colors hover:text-gold-400'
const HEAD = 'mb-5 font-display text-[1.02rem] font-bold !text-white'

const serviceHref = (id) =>
  id === 'umrah' ? '/umrah'
  : id === 'passport' ? '/visa#passport'
  : id === 'visa' ? '/visa'
  : id === 'flights' ? '/flights-hotels#flights'
  : id === 'hotels' ? '/flights-hotels#hotels'
  : `/services#${id}`

const [DAYS, TIMES] = BIZ.hours.split(': ')

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative isolate overflow-hidden bg-navy-950 text-white/70">
      {/* ---- Visit us: a short, warm note before the link columns ---- */}
      <div className="border-b border-white/10">
        <div className="wrap grid items-center gap-8 py-12 md:grid-cols-[1fr_auto] md:py-14">
          <div className="max-w-2xl">
            <p className="note text-[1.35rem] text-gold-400">Visit us</p>
            <p className="mt-2 font-display text-[clamp(1.35rem,2.6vw,1.9rem)] leading-snug font-bold text-white text-balance">
              Ground floor, A.M. Plaza on Hospital Road, near Infantry Road. Come in any day but Sunday.
            </p>
            <p className="mt-3 text-[1rem]">
              {DAYS}, {TIMES}.{' '}
              <a href={BIZ.mapsUrl} target="_blank" rel="noopener noreferrer" className={`${LINK} font-bold text-white`}>
                Get directions
              </a>
            </p>
          </div>
          <Stamp
            top="Shivaji Nagar"
            main={`Since ${BIZ.since}`}
            bottom="Bengaluru"
            tone="gold"
            rotate={-8}
            className="!mix-blend-normal justify-self-start md:justify-self-end"
          />
        </div>
      </div>

      <div className="wrap relative pt-14 pb-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_1fr_1.5fr]">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="mb-6 inline-block" aria-label={`${BIZ.name} — home`}>
              <img src="/logo-white.png" alt={BIZ.name} width={1200} height={209} className="h-11 w-auto" />
            </Link>
            <p className="max-w-sm text-[1.02rem] text-pretty">
              {BIZ.tagline}. Air tickets, hotels, visas, holidays, cruises and Umrah, arranged from our office in
              Shivaji Nagar, Bengaluru.
            </p>
            <div className="mt-6 flex items-center gap-3.5">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white p-1.5">
                <img src="/iata-logo.png" alt="IATA Accredited Travel Agent" width={512} height={512} className="h-full w-full" />
              </span>
              <span className="text-[0.95rem] leading-snug">
                <span className="block font-display font-bold text-white">IATA accredited</span>
                travel agent
              </span>
            </div>
          </div>

          {/* Pages */}
          <nav aria-label="Footer">
            <h2 className={HEAD}>Pages</h2>
            <ul className="space-y-2.5 text-[1rem]">
              {NAV.map((n) => (
                <li key={n.to}><Link to={n.to} className={LINK}>{n.label}</Link></li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h2 className={HEAD}>Services</h2>
            <ul className="space-y-2.5 text-[1rem]">
              {SERVICES.map((s) => (
                <li key={s.id}><Link to={serviceHref(s.id)} className={LINK}>{s.title}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <h2 className={HEAD}>Reach us</h2>
            <ul className="space-y-4 text-[1rem]">
              <li className="flex gap-3">
                <MapPin size={17} aria-hidden="true" className="mt-1 shrink-0 text-gold-400" />
                <a href={BIZ.mapsUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold-400">
                  {BIZ.address.line1}, {BIZ.address.line2}, {BIZ.address.line3}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone size={17} aria-hidden="true" className="mt-1 shrink-0 text-gold-400" />
                <a href={`tel:${BIZ.phone}`} className={LINK}>{BIZ.phoneDisplay}</a>
              </li>
              <li className="flex gap-3">
                <MessageCircle size={17} aria-hidden="true" className="mt-1 shrink-0 text-gold-400" />
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className={LINK}>WhatsApp, same number</a>
              </li>
              <li className="flex gap-3">
                <Mail size={17} aria-hidden="true" className="mt-1 shrink-0 text-gold-400" />
                <span className="flex min-w-0 flex-col items-start gap-1.5">
                  <a href={`mailto:${BIZ.email2}`} className={`${LINK} break-all`}>{BIZ.email2}</a>
                  <a href={`mailto:${BIZ.email}`} className={`${LINK} break-all`}>{BIZ.email}</a>
                </span>
              </li>
              <li className="flex gap-3">
                <Instagram size={17} aria-hidden="true" className="mt-1 shrink-0 text-gold-400" />
                <a href={BIZ.instagram} target="_blank" rel="noopener noreferrer" className={`${LINK} break-all`}>
                  {BIZ.instagramHandle}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={17} aria-hidden="true" className="mt-1 shrink-0 text-gold-400" />
                <span>{BIZ.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ---- Policies, payments, copyright ---- */}
        <div className="mt-14 grid gap-5 border-t border-white/12 pt-7 text-[0.9rem] lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/terms" className={LINK}>Terms &amp; Conditions</Link>
            <Link to="/privacy" className={LINK}>Privacy Policy</Link>
            <Link to="/refund-policy" className={LINK}>Cancellation &amp; Refund Policy</Link>
            <Link to="/disclaimer" className={LINK}>Disclaimer</Link>
          </div>
          <div className="text-white/65 lg:text-right">
            <span className="flex items-center gap-1.5 lg:justify-end">
              <ShieldCheck size={14} aria-hidden="true" className="text-emerald-400" /> Payments secured by Razorpay
            </span>
            <span className="mt-1 block">We accept Visa · Mastercard · RuPay · American Express · UPI · Net Banking</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-[0.9rem] text-white/55 sm:flex-row sm:justify-between">
          <span>© {year} {BIZ.name}. All rights reserved.</span>
          <span>Bengaluru, Karnataka · India</span>
        </div>

        {/* Studio credit. rel="nofollow" on purpose: Google's spam policies
            name site-wide footer/template credit links as a link scheme and
            recommend nofollow for "made by" credits. It still sends referral
            traffic and brand visibility without putting either site at risk. */}
        <div className="mt-6 border-t border-white/10 pt-5 text-center text-[0.86rem] text-white/50">
          Created and developed by{' '}
          <a
            href="https://naazailabs.com"
            target="_blank"
            rel="nofollow noopener"
            className="font-semibold text-white/80 underline decoration-gold-500/60 underline-offset-4 transition-colors hover:text-gold-400"
          >
            naazailabs.com
          </a>
        </div>
      </div>
    </footer>
  )
}
