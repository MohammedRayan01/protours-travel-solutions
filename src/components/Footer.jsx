import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle, ShieldCheck } from 'lucide-react'
import { BIZ, NAV, SERVICES, waLink } from '../data/site.js'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white/65">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 -right-32 h-[420px] w-[420px] rounded-full bg-brand-500/18 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-gold-500/12 blur-[120px]" />

      <div className="wrap relative z-10 pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.5fr]">
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
                className="grid h-11 w-11 place-items-center rounded-xl bg-white/8 transition-all hover:-translate-y-1 hover:bg-[#25d366] hover:text-white"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={BIZ.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-xl bg-white/8 transition-all hover:-translate-y-1 hover:bg-[linear-gradient(45deg,#f09433,#dc2743,#bc1888)] hover:text-white"
              >
                <Instagram size={18} />
              </a>
              <a
                href={`tel:${BIZ.phone}`} aria-label="Call us"
                className="grid h-11 w-11 place-items-center rounded-xl bg-white/8 transition-all hover:-translate-y-1 hover:bg-brand-500 hover:text-white"
              >
                <Phone size={18} />
              </a>
              <a
                href={`mailto:${BIZ.email2}`} aria-label="Email us"
                className="grid h-11 w-11 place-items-center rounded-xl bg-white/8 transition-all hover:-translate-y-1 hover:bg-gold-500 hover:text-navy-950"
              >
                <Mail size={18} />
              </a>
              <a
                href={`mailto:${BIZ.email}`} aria-label="Alternate email"
                className="grid h-11 w-11 place-items-center rounded-xl bg-white/8 transition-all hover:-translate-y-1 hover:bg-gold-500 hover:text-navy-950"
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
                  <Link to={n.to} className="inline-flex items-center gap-2.5 transition-colors hover:text-gold-400">
                    <span className="h-1 w-1 rounded-full bg-gold-500/70" />
                    {n.label}
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
                    className="inline-flex items-center gap-2.5 transition-colors hover:text-gold-400"
                  >
                    <span className="h-1 w-1 rounded-full bg-gold-500/70" />
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="mb-5 font-display text-[1.1rem] font-bold !text-white">Reach Us</h5>
            <ul className="space-y-4 text-[1.02rem]">
              <li className="flex gap-3">
                <MapPin size={17} className="mt-1 shrink-0 text-gold-500" />
                <a href={BIZ.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">
                  {BIZ.address.line1}, {BIZ.address.line2}, {BIZ.address.line3}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone size={17} className="mt-1 shrink-0 text-gold-500" />
                <a href={`tel:${BIZ.phone}`} className="hover:text-gold-400">{BIZ.phoneDisplay}</a>
              </li>
              <li className="flex gap-3">
                <Mail size={17} className="mt-1 shrink-0 text-gold-500" />
                <span className="flex flex-col gap-1">
                  <a href={`mailto:${BIZ.email2}`} className="hover:text-gold-400">{BIZ.email2}</a>
                  <a href={`mailto:${BIZ.email}`} className="hover:text-gold-400">{BIZ.email}</a>
                </span>
              </li>
              <li className="flex gap-3">
                <Instagram size={17} className="mt-1 shrink-0 text-gold-500" />
                <a href={BIZ.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">
                  {BIZ.instagramHandle}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={17} className="mt-1 shrink-0 text-gold-500" />
                <span>{BIZ.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-7 text-[0.9rem] sm:justify-start">
          <Link to="/terms" className="transition-colors hover:text-gold-400">Terms & Conditions</Link>
          <Link to="/privacy" className="transition-colors hover:text-gold-400">Privacy Policy</Link>
          <Link to="/refund-policy" className="transition-colors hover:text-gold-400">Cancellation & Refund Policy</Link>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.85rem] text-white/50 sm:justify-start">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" /> Payments secured by Razorpay
          </span>
          <span>We accept Visa · Mastercard · RuPay · American Express · UPI · Net Banking</span>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-5 pt-2 text-[0.94rem] sm:flex-row">
          <span>© {year} {BIZ.name}. All rights reserved.</span>
          <img src="/iata-logo.png" alt="IATA Accredited Travel Agent" width={512} height={512} className="h-14 w-14 shrink-0" />
          <span>Bengaluru, Karnataka · India</span>
        </div>
      </div>
    </footer>
  )
}
