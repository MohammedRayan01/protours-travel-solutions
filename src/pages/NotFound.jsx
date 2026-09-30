import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { waLink } from '../data/site.js'
import { Stamp } from '../components/fx.jsx'

const PLACES = [
  ['/packages', 'Tour packages', 'Dubai, Maldives, Bali, Europe, Kerala and more'],
  ['/umrah', 'Hajj & Umrah', 'Visa, flights and hotels near the Haram'],
  ['/visa', 'Visa & passport', 'Visa rules for Indian passport holders'],
  ['/flights-hotels', 'Flights & hotels', 'Tell us your route and dates'],
  ['/contact', 'Contact us', 'Hospital Road, Shivaji Nagar, Bengaluru'],
]

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="paper bg-sand pt-32 pb-24 md:pt-40">
      <div className="wrap grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="eyebrow">Error 404</span>
          <h1 id="nf-title" className="h-sec mt-4 text-balance">This page has gone off the map</h1>
          <p className="mt-5 max-w-xl text-pretty">
            The link may be old or mistyped. Nothing is lost: pick where you were heading below, or send us a
            message and we'll point you the right way.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/" className="btn btn-brand">Go to the homepage <ArrowRight size={16} aria-hidden="true" /></Link>
            <a href={waLink('Hello, I followed a link on your website that did not work.')} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Ask us on WhatsApp
            </a>
          </div>
          <div className="mt-12 hidden sm:block">
            <Stamp top="Destination" main="Not found" bottom="Try another route" tone="clay" rotate={-7} />
          </div>
        </div>

        <nav aria-label="Popular pages">
          <ul className="divide-y divide-slate-200 border-y border-slate-200">
            {PLACES.map(([to, title, sub]) => (
              <li key={to}>
                <Link to={to} className="group flex items-center justify-between gap-4 py-5">
                  <span>
                    <span className="block font-display text-[1.15rem] font-bold text-ink">{title}</span>
                    <span className="block text-[0.95rem] text-slate-500">{sub}</span>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-gold-600 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
