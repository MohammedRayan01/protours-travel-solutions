import { MapPin, Phone, Mail, Instagram, Clock, MessageCircle, ArrowUpRight } from 'lucide-react'

import { BIZ, waLink } from '../data/site.js'
import { Reveal, PageHero } from '../components/ui.jsx'
import { Magnetic } from '../components/motion.jsx'
import { ImageReveal, RevealGrid, Spotlight, Orbs } from '../components/fx.jsx'
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

      <section className="section relative isolate overflow-hidden bg-white">
        <Orbs tone="light" className="opacity-60" />
        <div className="wrap grid items-start gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          {/* ---- Details ---- */}
          <div className="min-w-0">
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

            <RevealGrid className="mt-9 grid gap-4" y={50} stagger={0.08}>
              {CARDS.map((c) => {
                const Inner = (
                  <>
                    <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-500 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white">
                      <c.icon size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-[1.08rem] font-bold text-ink">{c.title}</div>
                      {c.emails?.map((e) => (
                        <a
                          key={e}
                          href={`mailto:${e}`}
                          onClick={(ev) => ev.stopPropagation()}
                          className="relative z-20 mt-0.5 block break-words text-[1.01rem] text-pretty hover:text-brand-500 hover:underline"
                        >
                          {e}
                        </a>
                      ))}
                      {c.lines.map((l, k) => (
                        <p key={k} className="mt-0.5 text-[1.01rem] text-pretty">{l}</p>
                      ))}
                    </div>
                    {c.href && (
                      <ArrowUpRight
                        aria-hidden="true"
                        size={18}
                        className="mt-1 shrink-0 text-slate-300 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-500"
                      />
                    )}
                  </>
                )
                const cls =
                  'group relative flex h-full gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 backdrop-blur-sm transition-all duration-400 hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow-lift)]'

                return (
                  <Spotlight key={c.title} className="rounded-3xl" color="rgb(18 115 196 / 0.10)" size={380}>
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
                  </Spotlight>
                )
              })}
            </RevealGrid>

            <Reveal delay={0.1}>
              <Magnetic strength={0.2} className="mt-7 w-full sm:w-auto">
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-wa w-full sm:w-auto">
                  <MessageCircle size={17} /> Chat on WhatsApp
                </a>
              </Magnetic>
            </Reveal>
          </div>

          {/* ---- Form — wrapped in a slowly turning gradient rim ---- */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="relative isolate overflow-hidden rounded-5xl p-[1.5px] shadow-[0_30px_80px_-40px_rgb(4_24_44/0.45)]">
              <span
                aria-hidden="true"
                className="animate-spin-slow pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2"
                style={{ background: 'conic-gradient(from 0deg, #1273c4, #e8a317, rgb(226 232 240) 40%, rgb(226 232 240) 60%, #1273c4)' }}
              />
              <div className="rounded-[calc(var(--radius-5xl,2.5rem)-1.5px)] bg-slate-50 p-7 sm:p-8 md:p-10">
                <h3 className="text-[1.43rem]">Send us an enquiry</h3>
                <p className="mt-2.5 mb-8 text-[1.03rem] text-pretty">
                  Fill this in and it opens WhatsApp with your details ready to send — the fastest way to reach us.
                </p>
                <EnquiryForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Map ---- */}
      <section className="pb-24">
        <div className="wrap">
          <div className="relative">
            <ImageReveal from="bottom" className="rounded-5xl border border-slate-200 shadow-[var(--shadow-lift)]">
              <iframe
                title="Pro Tours & Travel Solutions location"
                src="https://www.google.com/maps?q=A.M.%20Plaza%2C%20Hospital%20Road%2C%20Shivaji%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560001&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block h-[420px] w-full border-0"
              />
            </ImageReveal>
            {/* glass address chip floating over the map */}
            <Reveal delay={0.9} className="pointer-events-none absolute top-4 left-4 right-4 sm:right-auto">
              <a
                href={BIZ.mapsUrl} target="_blank" rel="noopener noreferrer"
                className="pointer-events-auto group flex max-w-sm items-center gap-3.5 rounded-3xl border border-white/15 bg-navy-950/85 p-3.5 pr-5 text-white shadow-[var(--shadow-lift)] backdrop-blur-xl"
              >
                <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-500 text-navy-950">
                  <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-2xl bg-gold-500/50" />
                  <MapPin size={19} className="relative" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[0.98rem] font-bold">{BIZ.address.line1}</span>
                  <span className="flex items-center gap-1 text-[0.86rem] text-white/65 group-hover:text-gold-400">
                    Open in Google Maps <ArrowUpRight size={13} />
                  </span>
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
