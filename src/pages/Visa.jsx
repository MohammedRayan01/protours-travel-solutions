import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Check, Clock, CalendarDays, Info, ArrowRight, X } from 'lucide-react'

import { VISAS, VISA_TYPES, REGIONS, visaStats } from '../data/visas.js'
import { waLink } from '../data/site.js'
import { useHashScroll } from '../components/SmoothScroll.jsx'
import { Reveal, SectionHeading, PageHero } from '../components/ui.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'

/* Tailwind needs literal class strings, so map tone → classes explicitly. */
const TONE = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  sky: 'bg-sky-50 text-sky-700 border-sky-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
}
const DOT = {
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
}

const TIPS = [
  ['Funds that look real', 'Six months of bank statements with a steady pattern beat a large last-minute deposit every time.'],
  ['A reason to return', 'Employment letter, business proof, property or family ties — the case for coming home matters most.'],
  ['A coherent itinerary', 'Flights, hotels and a day plan that actually fit the dates you have applied for.'],
  ['Correct insurance', 'Schengen requires €30,000 medical cover for the full stay. Wrong cover means a rejected file.'],
  ['Enough lead time', 'Apply early. Rushed applications leave no room for an extra document request.'],
]

export default function Visa() {
  useHashScroll() // /visa#passport
  const [q, setQ] = useState('')
  const [region, setRegion] = useState('All')
  const [type, setType] = useState('all')
  const stats = visaStats()

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return VISAS.filter((v) => {
      const okQ = !needle || v.c.toLowerCase().includes(needle) || v.r.toLowerCase().includes(needle)
      const okR = region === 'All' || v.r === region
      const okT = type === 'all' || v.t === type
      return okQ && okR && okT
    })
  }, [q, region, type])

  // Group the filtered results by region for readable output.
  const grouped = useMemo(() => {
    const map = new Map()
    list.forEach((v) => {
      if (!map.has(v.r)) map.set(v.r, [])
      map.get(v.r).push(v)
    })
    return [...map.entries()]
  }, [list])

  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1800&q=74"
        alt="Passport and travel documents"
        eyebrow="Visa & passport"
        title="Visa requirements for every country we book"
        sub="Most rejections come from paperwork, not from the applicant. We check every file line by line before it goes in."
      >
        <div className="flex flex-wrap gap-3">
          {[
            [stats.free, 'Visa Free'],
            [stats.arrival, 'On Arrival'],
            [stats.evisa, 'e-Visa'],
            [stats.embassy, 'Embassy'],
          ].map(([n, l]) => (
            <div key={l} className="glass rounded-2xl px-5 py-3">
              <div className="font-display text-[1.54rem] leading-none font-extrabold text-gold-400">{n}</div>
              <div className="mt-1 text-[0.84rem] text-white/60">{l}</div>
            </div>
          ))}
        </div>
      </PageHero>

      {/* ---------- Browser ---------- */}
      <section className="section bg-white">
        <div className="wrap">
          <SectionHeading
            center
            eyebrow={`${stats.total} destinations`}
            title="Search visa rules for Indian passport holders"
            sub="Indicative timelines and entry types. Rules and fees change often — we confirm the current position for your exact case before you pay anything."
          />

          {/* Controls */}
          <Reveal>
            <div className="mb-10 rounded-4xl border border-slate-200 bg-slate-50 p-6">
              <div className="relative mb-5">
                <Search size={19} className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search a country — Dubai, Japan, Schengen, Kenya…"
                  aria-label="Search countries"
                  className="field !rounded-full !border-slate-200 !bg-white !py-3.5 !pr-12 !pl-12 !text-[1rem] md:!py-4 md:!pl-14 md:!text-[1.1rem]"
                />
                {q && (
                  <button
                    onClick={() => setQ('')}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-5 -translate-y-1/2 text-slate-500 hover:text-ink"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Type filter */}
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setType('all')}
                  className={`rounded-full border px-4 py-2 text-[0.92rem] font-semibold transition-all ${
                    type === 'all' ? 'border-navy-950 bg-navy-950 text-white' : 'border-slate-200 bg-white hover:border-brand-500'
                  }`}
                >
                  All types
                </button>
                {Object.entries(VISA_TYPES).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setType(type === k ? 'all' : k)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[0.92rem] font-semibold transition-all ${
                      type === k ? 'border-navy-950 bg-navy-950 text-white' : 'border-slate-200 bg-white hover:border-brand-500'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${DOT[v.tone]}`} />
                    {v.label}
                  </button>
                ))}
              </div>

              {/* Region filter */}
              <div className="flex flex-wrap gap-2">
                {['All', ...REGIONS].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`rounded-full px-4 py-2 text-[0.9rem] font-semibold transition-all ${
                      region === r ? 'bg-brand-500 text-white' : 'bg-white text-body hover:text-brand-500'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Results */}
          <p className="mb-7 text-[1.01rem] text-slate-500">
            Showing <b className="text-ink">{list.length}</b> of {stats.total} destinations
          </p>

          {grouped.map(([r, items]) => (
            <div key={r} className="mb-12">
              <h3 className="mb-5 flex items-center gap-3 text-[1.26rem]">
                {r}
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-[0.88rem] font-semibold text-slate-500">{items.length}</span>
              </h3>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {items.map((v, i) => {
                  const meta = VISA_TYPES[v.t]
                  return (
                    <motion.div
                      key={v.c}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
                      className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-400 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[var(--shadow-lift)]"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <h4 className="min-w-0 font-display text-[1.14rem] font-bold text-ink">{v.c}</h4>
                        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.77rem] font-bold ${TONE[meta.tone]}`}>
                          {meta.label}
                        </span>
                      </div>

                      <div className="mb-4 grid gap-2 text-[0.95rem]">
                        <span className="flex items-center gap-2">
                          <Clock size={14} className="shrink-0 text-brand-500" /> {v.time}
                        </span>
                        <span className="flex items-center gap-2">
                          <CalendarDays size={14} className="shrink-0 text-brand-500" /> Stay up to {v.stay}
                        </span>
                      </div>

                      <p className="flex-1 text-[0.95rem] text-slate-500 text-pretty">{v.note}</p>

                      <a
                        href={waLink(`Hello Pro Tours & Travel Solutions, I need visa assistance for ${v.c}. Please share the checklist and current processing time.`)}
                        target="_blank" rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 font-display text-[0.95rem] font-bold text-brand-500"
                      >
                        Apply with us
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}

          {!list.length && (
            <div className="rounded-4xl border border-slate-200 bg-slate-50 py-20 text-center">
              <p className="text-[1.12rem]">
                No match for “<b className="text-ink">{q}</b>”.
              </p>
              <p className="mt-2 text-[1.02rem]">
                We handle destinations beyond this list too —{' '}
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-500">
                  just ask us
                </a>
                .
              </p>
            </div>
          )}

          <Reveal>
            <div className="mt-6 flex gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <Info size={20} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-[0.99rem] text-amber-900 text-pretty">
                <b>Important:</b> this table is indicative and maintained for guidance only. Visa rules, fees and
                processing times change frequently and vary by individual profile. Always confirm the current
                requirement with us before booking flights — we do this check free of charge.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Passport ---------- */}
      <section id="passport" className="section scroll-mt-24 bg-slate-50">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=72"
                alt="Passport application documents"
                loading="lazy"
                className="aspect-[4/3.2] w-full rounded-5xl object-cover shadow-[var(--shadow-lift)]"
              />
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=72"
                alt="" aria-hidden="true" loading="lazy"
                className="absolute -right-6 -bottom-9 hidden aspect-square w-44 rounded-4xl border-[6px] border-white object-cover shadow-[var(--shadow-lift)] lg:block"
              />
            </div>
          </Reveal>

          <div>
            <Reveal><span className="eyebrow">Passport services</span></Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-sec mt-4 text-balance">Passport assistance — fresh, renewal &amp; tatkal</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-pretty">
                The passport process is straightforward until something is unusual — a name change, a lost booklet,
                a minor without both parents present, or an address that does not match your documents. That is where
                we are most useful.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <ul className="mt-8 grid gap-3.5">
                {[
                  'Fresh application, re-issue and renewal',
                  'Tatkal applications when you are travelling at short notice',
                  'Lost, damaged or exhausted-pages replacement',
                  'Minors, post-marriage name change and address correction',
                  'PSK appointment slots and document verification before you go',
                ].map((x) => (
                  <li key={x} className="flex gap-3.5">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-500">
                      <Check size={12} strokeWidth={3.2} />
                    </span>
                    <span className="text-[1.07rem] text-pretty">{x}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.32}>
              <a
                href={waLink('Hello, I need help with passport assistance.')}
                target="_blank" rel="noopener noreferrer" className="btn btn-brand mt-9"
              >
                Ask About Passport <ArrowRight size={16} />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Tips ---------- */}
      <section className="relative isolate overflow-hidden bg-navy-950 py-20 md:py-28">
        <img
          src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1800&q=70"
          alt="" aria-hidden="true" loading="lazy"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950/68 to-navy-900/55" />

        <div className="wrap relative z-10">
          <SectionHeading
            center light
            eyebrow="Before you apply"
            title="Five things that decide most visa outcomes"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {TIPS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="glass h-full rounded-4xl p-7">
                  <span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-gold-500 font-display text-[1.16rem] font-extrabold text-navy-950">
                    {i + 1}
                  </span>
                  <h4 className="font-display text-[1.1rem] font-bold !text-white">{t}</h4>
                  <p className="mt-2.5 text-[0.98rem] text-white/65 text-pretty">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Form ---------- */}
      <section className="section bg-white">
        <div className="wrap">
          <SectionHeading
            center
            eyebrow="Start here"
            title="Tell us where you are headed"
            sub="Share a few details and we will send you the exact checklist for your destination and profile."
          />
          <Reveal>
            <div className="mx-auto max-w-3xl rounded-5xl border border-slate-200 bg-slate-50 p-8 md:p-10">
              <EnquiryForm defaultService="Visa Services" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
