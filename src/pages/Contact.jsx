import { MapPin, Phone, Mail, Instagram, Clock, MessageCircle } from 'lucide-react'

import { BIZ, waLink } from '../data/site.js'
import { Reveal, PageHero } from '../components/ui.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'

const CARDS = [
  {
    icon: MapPin,
    title: 'Our Office',
    lines: [BIZ.address.line1, BIZ.address.line2, BIZ.address.line3],
    href: BIZ.mapsUrl,
    external: true,
  },
  {
    icon: Phone,
    title: 'Phone & WhatsApp',
    lines: [BIZ.phoneDisplay, 'Call or message — both reach us'],
    href: `tel:${BIZ.phone}`,
  },
  {
    icon: Mail,
    title: 'Email',
    emails: [BIZ.email2, BIZ.email],
    lines: ['We reply within one working day'],
  },
  {
    icon: Instagram,
    title: 'Instagram',
    lines: [BIZ.instagramHandle, 'Latest offers and departures'],
    href: BIZ.instagram,
    external: true,
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: [BIZ.hours],
  },
]

export default function Contact() {
  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1800&q=74"
        alt="Airport departure hall"
        eyebrow="Get in touch"
        title="Let's plan your next trip"
        sub="Walk into the office, call, or send a WhatsApp message. We reply within minutes during working hours."
      />

      <section className="section bg-white">
        <div className="wrap grid items-start gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          {/* ---- Details ---- */}
          <div>
            <Reveal><span className="eyebrow">Reach us</span></Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-sec mt-4 text-balance">{BIZ.name}</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-pretty">
                We are on the ground floor of A.M. Plaza on Hospital Road, a short walk from Infantry Road in
                Shivaji Nagar. Street parking is available — call us and we will guide you in.
              </p>
            </Reveal>

            <div className="mt-9 grid gap-4">
              {CARDS.map((c, i) => {
                const Inner = (
                  <>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                      <c.icon size={20} />
                    </span>
                    <div className="min-w-0">
                      <div className="font-display text-[1.08rem] font-bold text-ink">{c.title}</div>
                      {c.emails?.map((e) => (
                        <a
                          key={e}
                          href={`mailto:${e}`}
                          onClick={(ev) => ev.stopPropagation()}
                          className="mt-0.5 block text-[1.01rem] text-pretty hover:text-brand-500 hover:underline"
                        >
                          {e}
                        </a>
                      ))}
                      {c.lines.map((l, k) => (
                        <p key={k} className="mt-0.5 text-[1.01rem] text-pretty">{l}</p>
                      ))}
                    </div>
                  </>
                )
                const cls =
                  'group flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-400 hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow-lift)]'

                return (
                  <Reveal key={c.title} delay={0.06 * i}>
                    {c.href ? (
                      <a
                        href={c.href}
                        {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className={cls}
                      >
                        {Inner}
                      </a>
                    ) : (
                      <div className={cls}>{Inner}</div>
                    )}
                  </Reveal>
                )
              })}
            </div>

            <Reveal delay={0.36}>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-7 w-full sm:w-auto">
                <MessageCircle size={17} /> Chat on WhatsApp
              </a>
            </Reveal>
          </div>

          {/* ---- Form ---- */}
          <Reveal delay={0.1}>
            <div className="rounded-5xl border border-slate-200 bg-slate-50 p-8 md:p-10">
              <h3 className="text-[1.43rem]">Send us an enquiry</h3>
              <p className="mt-2.5 mb-8 text-[1.03rem] text-pretty">
                Fill this in and it opens WhatsApp with your details ready to send — the fastest way to reach us.
              </p>
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Map ---- */}
      <section className="pb-24">
        <div className="wrap">
          <Reveal>
            <div className="overflow-hidden rounded-5xl border border-slate-200 shadow-[var(--shadow-lift)]">
              <iframe
                title="Pro Tours & Travel Solutions location"
                src="https://www.google.com/maps?q=A.M.%20Plaza%2C%20Hospital%20Road%2C%20Shivaji%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560001&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block h-[420px] w-full border-0"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
