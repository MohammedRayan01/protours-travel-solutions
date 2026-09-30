import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Clock, ArrowUpRight } from 'lucide-react'

import { BIZ, waLink } from '../data/site.js'
import { Reveal, PageHero } from '../components/ui.jsx'
import { ImageReveal, CircleMark, ArrowDoodle, Stamp } from '../components/fx.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'

const [DAYS, TIMES] = BIZ.hours.split(': ')

/** One row of the "reach us" list — label on the left, links on the right. */
function Row({ icon: Icon, label, children }) {
  return (
    <div className="grid gap-1 border-b border-slate-200 py-5 sm:grid-cols-[12rem_1fr] sm:gap-4">
      <dt className="flex items-start gap-3 font-display text-[1rem] font-bold text-ink">
        <Icon size={19} aria-hidden="true" className="mt-[0.2rem] shrink-0 text-clay" />
        {label}
      </dt>
      <dd className="min-w-0 pl-[2rem] text-[1.04rem] sm:pl-0">{children}</dd>
    </div>
  )
}

const LINK = 'link-grow break-words text-navy-900 hover:text-brand-500'

export default function Contact() {
  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1800&q=74"
        alt="Travellers walking through a bright airport departure hall"
        eyebrow="Contact Pro Tours, Shivaji Nagar"
        title="Come in, call, or send us a message"
        sub="Our office is on the ground floor of A.M. Plaza on Hospital Road, Shivaji Nagar, Bengaluru. Most people start with a WhatsApp message, and that is fine by us."
      />

      <section aria-labelledby="contact-find" className="section overflow-hidden bg-paper">
        <div className="wrap grid items-start gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* ---- Where we are + how to reach us ---- */}
          <div className="min-w-0">
            <Reveal><span className="eyebrow">How to find us</span></Reveal>
            <h2 id="contact-find" className="h-sec mt-4 text-balance">We're easy to find in Shivaji Nagar</h2>

            {/* the address, written out like a note left on the counter */}
            <Reveal y={20}>
              <div className="relative mt-8 max-w-lg">
                <div
                  className="relative rounded-sm border border-slate-200 bg-[#fffdf8] px-6 pt-6 pb-7 shadow-[0_18px_36px_-26px_rgb(60_40_20/0.6)] sm:-rotate-[1.2deg]"
                >
                  <span aria-hidden="true" className="absolute -top-3 left-8 h-6 w-20 -rotate-3 bg-sand/90 shadow-sm" />
                  <p className="font-display text-[0.8rem] font-bold tracking-[0.18em] text-clay uppercase">Our address</p>
                  <address
                    className="note mt-2 text-[1.4rem] leading-[2.2rem] text-navy-900"
                    style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 calc(2.2rem - 1px), rgb(15 94 158 / 0.16) calc(2.2rem - 1px) 2.2rem)' }}
                  >
                    {BIZ.name}<br />
                    {BIZ.address.line1}<br />
                    Hospital Road, <CircleMark color="#b4532a">near Infantry Road</CircleMark><br />
                    {BIZ.address.line3}
                  </address>
                </div>
                <ArrowDoodle
                  color="#b4532a"
                  className="absolute -right-4 -bottom-16 hidden w-24 rotate-[20deg] sm:block lg:-right-16"
                />
              </div>
            </Reveal>

            <p className="mt-8 max-w-xl text-pretty">
              {BIZ.name} is an IATA-accredited travel agency in Shivaji Nagar, Bengaluru, booking trips since{' '}
              {BIZ.since}. We're on Hospital Road, a short walk from Infantry Road. Look for A.M. Plaza; we're on
              the ground floor, open {DAYS}, {TIMES}. Street parking is available, and if you get lost, call us
              and we'll guide you in.
            </p>

            {/* Phone, email and hours as real, linkable text for people and crawlers alike */}
            <address className="not-italic">
            <dl className="mt-8 border-t border-slate-200">
              <Row icon={Phone} label="Call or WhatsApp">
                <a href={`tel:${BIZ.phone}`} className={`${LINK} font-display font-bold`}>{BIZ.phoneDisplay}</a>
                <span className="block text-[0.96rem] text-body">
                  Same number for both.{' '}
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" className="link-grow font-bold text-palm">
                    Open WhatsApp<span className="sr-only"> chat with {BIZ.shortName}</span>
                  </a>
                </span>
              </Row>
              <Row icon={Mail} label="Email">
                <a href={`mailto:${BIZ.email2}`} className={`${LINK} block w-fit`}>{BIZ.email2}</a>
                <a href={`mailto:${BIZ.email}`} className={`${LINK} mt-0.5 block w-fit`}>{BIZ.email}</a>
              </Row>
              <Row icon={Clock} label="Opening hours">
                <span className="block">{DAYS}</span>
                <span className="block text-body">{TIMES}</span>
              </Row>
              <Row icon={Instagram} label="Instagram">
                <a href={BIZ.instagram} target="_blank" rel="noopener noreferrer" className={LINK}>
                  {BIZ.instagramHandle}
                </a>
                <span className="block text-[0.96rem] text-body">Latest offers and departures</span>
              </Row>
            </dl>
            </address>

            <p className="mt-7 max-w-xl text-[1.02rem] text-pretty">
              Coming in about a visa, a passport or Umrah? Our{' '}
              <Link to="/visa" className="link-grow font-bold text-navy-900 hover:text-brand-500">visa assistance</Link> and{' '}
              <Link to="/umrah" className="link-grow font-bold text-navy-900 hover:text-brand-500">Umrah packages from Bengaluru</Link>{' '}
              pages list the documents worth bringing.
            </p>
          </div>

          {/* ---- The form: a plain card, nothing spinning around it ---- */}
          <Reveal delay={0.1} y={24} className="min-w-0 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-slate-200 bg-sand p-6 sm:p-8 md:p-10">
              <h2 className="text-[1.5rem]">Send us an enquiry</h2>
              <p className="mt-2 mb-7 text-[1.03rem] text-pretty">
                Fill in what you know. It opens WhatsApp with everything written out, ready to send.
              </p>
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Map ---- */}
      <section aria-label="Map" className="overflow-x-clip bg-paper pb-20 md:pb-24">
        <div className="wrap">
          <div className="relative">
            <ImageReveal from="bottom" className="rounded-3xl border border-slate-200">
              <iframe
                title="Map showing Pro Tours & Travel Solutions at A.M. Plaza, Hospital Road"
                src="https://www.google.com/maps?q=A.M.%20Plaza%2C%20Hospital%20Road%2C%20Shivaji%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560001&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block h-[380px] w-full border-0 md:h-[440px]"
              />
            </ImageReveal>

            <Reveal delay={0.8} y={12} className="pointer-events-none absolute top-4 right-4 left-4 sm:right-auto">
              <a
                href={BIZ.mapsUrl} target="_blank" rel="noopener noreferrer"
                className="group pointer-events-auto flex max-w-sm items-center gap-3.5 rounded-2xl bg-navy-950 p-3.5 pr-5 text-white shadow-[var(--shadow-lift)]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-500 text-navy-950">
                  <MapPin size={19} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[0.98rem] font-bold">A.M. Plaza, Hospital Road</span>
                  <span className="flex items-center gap-1 text-[0.88rem] text-white/75 group-hover:text-gold-400">
                    Open in Google Maps <ArrowUpRight size={13} aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                </span>
              </a>
            </Reveal>

            <div className="pointer-events-none absolute right-6 -bottom-8 hidden md:block">
              <Stamp top="Bengaluru 560001" main="Walk-ins welcome" bottom="Mon – Sat" tone="clay" rotate={-6} className="bg-paper/80" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
