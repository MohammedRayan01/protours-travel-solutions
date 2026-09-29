import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Moon, Star, Crown, Sparkles, ArrowRight } from 'lucide-react'

import { BIZ, waLink } from '../data/site.js'
import { Reveal } from '../components/ui.jsx'

/* Makkah / Madinah imagery — the page sits fully submerged in it. */
const BG = 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=2000&q=76'
const BG2 = 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1400&q=74'

const TIERS = [
  {
    name: 'Economy',
    icon: Star,
    duration: '10 Nights — 5 Makkah / 5 Madinah',
    featured: false,
    inc: [
      'Umrah visa included',
      'Return economy air tickets',
      '3★ hotels, 600–800 m from the Haram',
      'Quad sharing rooms',
      'Makkah–Madinah bus transfers',
      'Ziyarat tours in both cities',
    ],
  },
  {
    name: 'Deluxe',
    icon: Sparkles,
    duration: '12 Nights — 6 Makkah / 6 Madinah',
    featured: true,
    inc: [
      'Umrah visa included',
      'Preferred-airline return tickets',
      '4★ hotels within 300 m of the Haram',
      'Triple sharing, breakfast & dinner daily',
      'Private AC coach transfers',
      'Group co-ordinator throughout',
    ],
  },
  {
    name: 'Premium',
    icon: Crown,
    duration: '14 Nights — 7 Makkah / 7 Madinah',
    featured: false,
    inc: [
      'Umrah visa included',
      'Direct flights, preferred seating',
      '5★ Haram-view hotels',
      'Double sharing, full board',
      'Private car + Haramain train option',
      'Dedicated scholar with the group',
    ],
  },
]

const STEPS = [
  ['Choose dates & tier', 'Tell us your travel window, how many people, and the hotel category you have in mind.'],
  ['Submit documents', 'Passport with 6+ months validity, photographs, vaccination record. We handle the rest.'],
  ['Visa & confirmations', 'Umrah visa, e-tickets and hotel vouchers reach you well before departure.'],
  ['Travel & support', 'Ground co-ordinator on arrival, plus a Bengaluru number on WhatsApp the whole time.'],
]

const UMRAH_FAQS = [
  { q: 'What documents do I need for an Umrah visa?', a: 'A passport valid for at least six months, recent white-background photographs, proof of vaccination as required that season, and basic personal details. Women under 45 travelling without a mahram should speak to us first — rules change and we will tell you the current position.' },
  { q: 'How far are the hotels from the Haram?', a: 'Economy hotels are typically 600–800 m, Deluxe within 300 m, and Premium are Haram-view properties. We give you the hotel name and the actual walking distance before you pay — never a vague "close to Haram".' },
  { q: 'Can you arrange a package for just my family?', a: 'Yes. Private family Umrah is common — your own dates, your own hotel choice, private transfers, and no group schedule to follow.' },
  { q: 'Do you handle Hajj as well?', a: 'Yes, subject to quota and the Hajj Committee process for that year. Hajj arrangements need to start many months ahead — contact us early so we can advise on the correct route for your case.' },
  { q: 'Is the quote per person or per family?', a: 'Per person, based on the room sharing shown in each tier. Double or triple occupancy changes the quote, and children sharing with parents are quoted separately. We break this down clearly for you.' },
]

export default function Umrah() {
  const [open, setOpen] = useState(0)

  return (
    /* The entire page is submerged in Makkah imagery, fixed behind the content. */
    <div className="relative isolate min-h-screen overflow-x-hidden">
      {/* Fixed background layer */}
      <div className="fixed inset-0 -z-30">
        <img src={BG} alt="" aria-hidden="true" className="h-full w-full object-cover" />
      </div>
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-navy-950/62 via-navy-950/48 to-navy-950/68" />
      <div className="pointer-events-none fixed -top-32 -left-32 -z-10 h-[520px] w-[520px] rounded-full bg-brand-500/18 blur-[140px]" />
      <div className="pointer-events-none fixed right-0 bottom-0 -z-10 h-[520px] w-[520px] rounded-full bg-gold-500/14 blur-[140px]" />

      {/* ---------- Hero ---------- */}
      <section className="relative flex min-h-[70svh] items-center md:min-h-[86svh]">
        <div className="wrap py-20 md:py-28">
          <div className="max-w-3xl">
            <Reveal>
              <span className="glass inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-[0.9rem] font-semibold text-white/90">
                <Moon size={15} className="text-gold-400" /> Hajj &amp; Umrah Division
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="h-hero mt-7 !text-white text-balance">
                Umrah, arranged <span className="accent text-gold-400">properly</span>
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-7 max-w-2xl text-[1.23rem] text-white/75 text-pretty">
                Visa, tickets and hotels near the Haram — handled by a team that has been sending groups from
                Bengaluru for years. We quote walking distances in metres, not adjectives.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href={waLink('Hello Pro Tours & Travel Solutions, I would like to enquire about your Umrah packages.')}
                  target="_blank" rel="noopener noreferrer" className="btn btn-gold"
                >
                  Get Umrah Quote <ArrowRight size={17} />
                </a>
                <a href={`tel:${BIZ.phone}`} className="btn btn-glass">Call {BIZ.phoneDisplay}</a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Why us ---------- */}
      <section className="section">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="glass-strong overflow-hidden rounded-5xl p-3">
              <img src={BG2} alt="Al-Masjid an-Nabawi, Madinah" loading="lazy" className="aspect-[4/3.2] w-full rounded-4xl object-cover" />
            </div>
          </Reveal>

          <div>
            <Reveal><span className="eyebrow eyebrow-light">Our Umrah desk</span></Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-sec mt-4 !text-white text-balance">For pilgrims, the details are not a luxury</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 text-white/70 text-pretty">
                How far the hotel really is from Bab-us-Salam. Whether the transfer waits or leaves. Whether someone
                who speaks your language is reachable at 3 AM in Madinah. These are the things that decide whether an
                Umrah feels peaceful or stressful.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <ul className="mt-8 grid gap-3.5">
                {[
                  'Umrah visa processing with full document guidance',
                  'Direct and one-stop flights from Bengaluru',
                  'Verified walking distances to the Haram — in metres',
                  'Ziyarat in Makkah and Madinah with a knowledgeable guide',
                  'Group departures in Ramadan and school holidays',
                ].map((x) => (
                  <li key={x} className="flex gap-3.5">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-500/20 text-gold-400">
                      <Check size={13} strokeWidth={3.2} />
                    </span>
                    <span className="text-[1.08rem] text-white/80 text-pretty">{x}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Tiers ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <Reveal><span className="eyebrow eyebrow-light">Choose your tier</span></Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-sec mt-4 !text-white text-balance">Umrah packages from Bengaluru</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-white/65 text-pretty">
                Per person, based on the sharing shown. Includes visa, return airfare, hotels and transfers.
                Ask us for today's exact quote.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-11 lg:grid-cols-3 lg:gap-7">
            {TIERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex h-full flex-col rounded-5xl p-8 ${
                    t.featured ? 'glass-strong ring-2 ring-gold-500/60' : 'glass'
                  }`}
                >
                  {t.featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-4 py-1.5 font-display text-[0.73rem] font-extrabold tracking-[0.12em] text-navy-950 uppercase">
                      Most chosen
                    </span>
                  )}

                  <span className={`mb-6 grid h-14 w-14 place-items-center rounded-2xl ${t.featured ? 'bg-gold-500 text-navy-950' : 'bg-white/12 text-gold-400'}`}>
                    <t.icon size={25} strokeWidth={1.9} />
                  </span>

                  <h3 className="!text-white text-[1.54rem]">{t.name}</h3>
                  <span className="mt-1.5 block text-[0.94rem] font-semibold text-brand-300">{t.duration}</span>

                  <ul className="mt-7 grid flex-1 gap-3">
                    {t.inc.map((x) => (
                      <li key={x} className="flex gap-3 text-[1.01rem] text-white/75">
                        <Check size={15} strokeWidth={3} className="mt-1 shrink-0 text-gold-400" />
                        <span className="text-pretty">{x}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={waLink(`Hello Pro Tours & Travel Solutions, I am interested in the Umrah ${t.name} package (${t.duration}). Please share current rates and availability.`)}
                    target="_blank" rel="noopener noreferrer"
                    className={`btn mt-8 w-full ${t.featured ? 'btn-gold' : 'btn-glass'}`}
                  >
                    Enquire
                  </a>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Reveal><span className="eyebrow eyebrow-light">Your journey</span></Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-sec mt-4 !text-white text-balance">How an Umrah booking works with us</h2>
            </Reveal>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08}>
                <div className="glass h-full rounded-4xl p-7">
                  <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gold-500 font-display text-[1.26rem] font-extrabold text-navy-950">
                    {i + 1}
                  </span>
                  <h4 className="font-display text-[1.14rem] font-bold !text-white">{t}</h4>
                  <p className="mt-2.5 text-[1rem] text-white/65 text-pretty">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section">
        <div className="wrap grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Reveal><span className="eyebrow eyebrow-light">Common questions</span></Reveal>
            <Reveal delay={0.08}><h2 className="h-sec mt-4 !text-white text-balance">Umrah FAQs</h2></Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-white/65 text-pretty">
                Anything not covered here — just ask. First-time pilgrims are welcome to call and take their time.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <a
                href={waLink('Hello, I have a question about Umrah.')}
                target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-8"
              >
                Ask a Question
              </a>
            </Reveal>
          </div>

          <div className="space-y-3">
            {UMRAH_FAQS.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className={`overflow-hidden rounded-3xl ${open === i ? 'glass-strong' : 'glass'}`}>
                  <button
                    onClick={() => setOpen(open === i ? -1 : i)}
                    aria-expanded={open === i}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left font-display text-[1.11rem] font-bold text-white"
                  >
                    {f.q}
                    <motion.span
                      animate={{ rotate: open === i ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-500/20 text-gold-400"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </motion.span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                    transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-[1.04rem] text-white/70 text-pretty">{f.a}</p>
                  </motion.div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="pb-28">
        <div className="wrap">
          <Reveal>
            <div className="glass-strong rounded-5xl px-8 py-16 text-center md:px-16">
              <h2 className="h-sec !text-white text-balance">Planning your Umrah?</h2>
              <p className="mx-auto mt-5 max-w-xl text-[1.14rem] text-white/70 text-pretty">
                Send us your travel window. We will come back with hotel names, walking distances and a clear
                quotation.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a
                  href={waLink('Hello Pro Tours & Travel Solutions, please send me current Umrah package rates.')}
                  target="_blank" rel="noopener noreferrer" className="btn btn-gold"
                >
                  Get Umrah Quote
                </a>
                <a href={`tel:${BIZ.phone}`} className="btn btn-glass">Call {BIZ.phoneDisplay}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
