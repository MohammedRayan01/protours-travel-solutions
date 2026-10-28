import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plane, ArrowRightLeft, Users, Loader2, CheckCircle2, AlertTriangle, Luggage, Utensils, Plus, Trash2 } from 'lucide-react'

import { BIZ, waLink } from '../data/site.js'
import { AIRPORTS } from '../../api/_lib/airports.js'

/*
 * Online flight booking on TBO's Air API.
 * Steps: search → pick fare(s) → travellers & extras → pay → ticketed.
 * Everything that talks to TBO runs in /api/flights; this page only holds
 * the sealed session tokens the server hands back.
 */

const AIRPORT_LIST = Object.entries(AIRPORTS).map(([code, a]) => ({ code, ...a }))
const todayIso = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
const addDays = (iso, n) => new Date(new Date(iso).getTime() + n * 864e5).toISOString().slice(0, 10)
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
const time = (s) => (s ? s.slice(11, 16) : '')
const dateLabel = (s) => (s ? new Date(s).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '')
const dur = (m) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`

async function api(action, payload) {
  const r = await fetch('/api/flights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...payload }) })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}

const input = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-[1rem] text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
const label = 'mb-1 block text-[0.82rem] font-bold tracking-wide text-slate-600 uppercase'

export default function BookFlights() {
  const [status, setStatus] = useState(null) // { enabled, live }
  useEffect(() => {
    fetch('/api/flights').then((r) => r.json()).then(setStatus).catch(() => setStatus({ enabled: false }))
  }, [])

  const [step, setStep] = useState('search')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [found, setFound] = useState(null)
  const [picked, setPicked] = useState([])
  const [q, setQ] = useState(null)
  const [done, setDone] = useState(null)

  const run = async (what, fn) => {
    setError('')
    setBusy(what)
    try {
      await fn()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <>
      <section className="bg-navy-950 pt-36 pb-10 text-white md:pt-44">
        <div className="wrap">
          <p className="eyebrow text-gold-400">Book flights online</p>
          <h1 className="mt-3 font-display text-[2rem] leading-tight font-bold md:text-[2.8rem]">Search fares and get your e-ticket</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Domestic and international flights through our IATA-accredited desk in Bengaluru. Prices include taxes; the fare rules
            are shown before you pay.
          </p>
          {status && !status.live && status.enabled && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-500/15 px-4 py-1.5 text-[0.9rem] font-semibold text-gold-300">
              <AlertTriangle size={16} /> Test mode — bookings here use TBO’s test system and are not real tickets.
            </p>
          )}
        </div>
      </section>

      <section className="section bg-paper">
        <div className="wrap max-w-5xl">
          {status && !status.enabled ? (
            <Offline />
          ) : (
            <>
              {/* Each step shows its own error beside its button; this banner only covers the final step. */}
              {error && step === 'done' && (
                <div role="alert" className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
                  <AlertTriangle size={20} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">{error}</p>
                    <p className="mt-1 text-[0.92rem]">Need help? Call <a className="font-bold underline" href={`tel:${BIZ.phone}`}>{BIZ.phoneDisplay}</a> or <a className="font-bold underline" href={waLink('Hi, I need help booking a flight.')}>WhatsApp us</a>.</p>
                  </div>
                </div>
              )}

              {step === 'search' && (
                <SearchForm
                  error={error}
                  busy={busy === 'search'}
                  onSearch={(form) =>
                    run('search', async () => {
                      const r = await api('search', form)
                      setFound(r)
                      setPicked(r.lists.map(() => null))
                      setStep('results')
                    })
                  }
                />
              )}

              {step === 'results' && found && (
                <Results
                  error={error}
                  found={found}
                  picked={picked}
                  setPicked={setPicked}
                  busy={busy === 'quote'}
                  onBack={() => setStep('search')}
                  onContinue={() =>
                    run('quote', async () => {
                      const r = await api('quote', { session: found.session, resultIndexes: picked.map((p) => p.resultIndex) })
                      setQ(r)
                      setStep('travellers')
                    })
                  }
                />
              )}

              {step === 'travellers' && q && (
                <Travellers
                  error={error}
                  q={q}
                  busy={busy}
                  onBack={() => setStep('results')}
                  onPay={(details) =>
                    run('pay', async () => {
                      const c = await api('checkout', { quote: q.quote, ...details })
                      const payment = c.payment.mode === 'razorpay' ? await razorpay(c, details.contact) : { orderId: c.payment.orderId }
                      setBusy('ticket')
                      const t = await api('ticket', { checkout: c.checkout, payment })
                      setDone(t)
                      setStep('done')
                    })
                  }
                />
              )}

              {step === 'done' && done && <Done done={done} onNew={() => { setStep('search'); setDone(null); setQ(null); setFound(null) }} />}
            </>
          )}
        </div>
      </section>
    </>
  )
}

/* ---------------- search ---------------- */

function AirportField({ id, value, onChange, labelText }) {
  const [text, setText] = useState(value ? `${AIRPORTS[value]?.city || value} (${value})` : '')
  const [open, setOpen] = useState(false)
  const matches = useMemo(() => {
    const t = text.trim().toLowerCase()
    if (!t) return AIRPORT_LIST.slice(0, 8)
    return AIRPORT_LIST.filter((a) => a.code.toLowerCase().startsWith(t) || a.city.toLowerCase().includes(t) || a.name.toLowerCase().includes(t)).slice(0, 8)
  }, [text])
  return (
    <div className="relative">
      <label htmlFor={id} className={label}>{labelText}</label>
      <input
        id={id}
        className={input}
        value={text}
        autoComplete="off"
        placeholder="City or airport"
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => { setText(e.target.value); onChange(''); setOpen(true) }}
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
          {matches.map((a) => (
            <li key={a.code}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left hover:bg-sand"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onChange(a.code); setText(`${a.city} (${a.code})`); setOpen(false) }}
              >
                <span><span className="font-semibold text-ink">{a.city}</span> <span className="text-[0.88rem] text-slate-500">{a.name}</span></span>
                <span className="font-mono font-bold text-navy-900">{a.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SearchForm({ onSearch, busy, error }) {
  const t = todayIso()
  const [journeyType, setJourney] = useState('oneway')
  const [segs, setSegs] = useState([{ from: 'BLR', to: '', date: addDays(t, 7) }])
  const [returnDate, setReturn] = useState(addDays(t, 12))
  const [pax, setPax] = useState({ adults: 1, children: 0, infants: 0 })
  const [cabin, setCabin] = useState('economy')
  const [directOnly, setDirect] = useState(false)
  const [msg, setMsg] = useState('')

  const setSeg = (i, k, v) => setSegs((s) => s.map((x, j) => (j === i ? { ...x, [k]: v } : x)))
  const setType = (jt) => {
    setJourney(jt)
    if (jt === 'multicity' && segs.length < 2) setSegs((s) => [...s, { from: s[0].to, to: '', date: addDays(s[0].date, 3) }])
    if (jt !== 'multicity') setSegs((s) => s.slice(0, 1))
  }
  const total = pax.adults + pax.children

  const submit = (e) => {
    e.preventDefault()
    setMsg('')
    if (segs.some((s) => !s.from || !s.to)) return setMsg('Pick the airports from the list.')
    if (pax.infants > pax.adults) return setMsg('Each infant must travel with an adult.')
    // TBO hard limit: 9 passengers in total, infants included.
    if (pax.adults + pax.children + pax.infants > 9) return setMsg('A booking can have at most 9 travellers, including infants.')
    onSearch({ journeyType, segments: segs, returnDate: journeyType === 'return' ? returnDate : undefined, ...pax, cabin, directOnly })
  }

  // One place decides every change, so the totals can never break TBO's rules:
  // 9 travellers in total (infants included), 1+ adult, each infant with an adult.
  const MAX_PAX = 9
  const change = (k, delta) => setPax((p) => {
    const n = { ...p, [k]: Math.max(k === 'adults' ? 1 : 0, p[k] + delta) }
    if (n.adults + n.children + n.infants > MAX_PAX) return p
    if (n.infants > n.adults) n.infants = n.adults
    return n
  })
  const counter = (k, min, max) => (
    <div className="flex items-center gap-2">
      <button type="button" className="h-9 w-9 rounded-full border border-slate-300 text-lg font-bold disabled:opacity-40" disabled={pax[k] <= min} onClick={() => change(k, -1)} aria-label={`Fewer ${k}`}>−</button>
      <span className="w-6 text-center font-bold">{pax[k]}</span>
      <button type="button" className="h-9 w-9 rounded-full border border-slate-300 text-lg font-bold disabled:opacity-40" disabled={pax[k] >= max} onClick={() => change(k, 1)} aria-label={`More ${k}`}>+</button>
    </div>
  )

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Trip type">
        {[['oneway', 'One way'], ['return', 'Return'], ['multicity', 'Multi-city']].map(([v, l]) => (
          <button key={v} type="button" role="radio" aria-checked={journeyType === v} onClick={() => setType(v)}
            className={`rounded-full px-4 py-2 text-[0.95rem] font-bold ${journeyType === v ? 'bg-navy-950 text-white' : 'bg-sand text-navy-900'}`}>{l}</button>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {segs.map((s, i) => (
          <div key={i} className="grid gap-4 md:grid-cols-[1fr_auto_1fr_11rem_auto] md:items-end">
            <AirportField id={`from${i}`} labelText="From" value={s.from} onChange={(v) => setSeg(i, 'from', v)} />
            <button type="button" aria-label="Swap" className="hidden h-11 w-11 place-items-center rounded-full border border-slate-300 md:grid"
              onClick={() => setSegs((x) => x.map((y, j) => (j === i ? { ...y, from: y.to, to: y.from } : y)))}><ArrowRightLeft size={18} /></button>
            <AirportField key={`to${i}-${s.to}`} id={`to${i}`} labelText="To" value={s.to} onChange={(v) => setSeg(i, 'to', v)} />
            <div>
              <label htmlFor={`d${i}`} className={label}>{journeyType === 'multicity' ? `Flight ${i + 1}` : 'Departure'}</label>
              <input id={`d${i}`} type="date" className={input} min={i ? segs[i - 1].date : todayIso()} value={s.date} onChange={(e) => setSeg(i, 'date', e.target.value)} required />
            </div>
            {journeyType === 'multicity' && i > 1 ? (
              <button type="button" aria-label="Remove flight" className="grid h-11 w-11 place-items-center rounded-full text-red-600 hover:bg-red-50" onClick={() => setSegs((x) => x.filter((_, j) => j !== i))}><Trash2 size={18} /></button>
            ) : <span className="hidden md:block md:w-11" />}
          </div>
        ))}
        {journeyType === 'multicity' && segs.length < 5 && (
          <button type="button" className="inline-flex w-fit items-center gap-2 font-bold text-brand-500" onClick={() => setSegs((x) => [...x, { from: x.at(-1).to, to: '', date: addDays(x.at(-1).date, 3) }])}><Plus size={18} /> Add another flight</button>
        )}
        {journeyType === 'return' && (
          <div className="md:w-[11rem]">
            <label htmlFor="ret" className={label}>Return</label>
            <input id="ret" type="date" className={input} min={segs[0].date} value={returnDate} onChange={(e) => setReturn(e.target.value)} required />
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-5 border-t border-slate-200 pt-6 md:grid-cols-[1fr_1fr_1fr_12rem]">
        <div><p className={label}>Adults (12+)</p>{counter('adults', 1, 9 - pax.children - pax.infants)}</div>
        <div><p className={label}>Children (2–11)</p>{counter('children', 0, 9 - pax.adults - pax.infants)}</div>
        <div><p className={label}>Infants (under 2)</p>{counter('infants', 0, Math.min(pax.adults, 9 - pax.adults - pax.children))}</div>
        <div>
          <label htmlFor="cabin" className={label}>Cabin</label>
          <select id="cabin" className={input} value={cabin} onChange={(e) => setCabin(e.target.value)}>
            <option value="economy">Economy</option><option value="premium">Premium economy</option><option value="business">Business</option><option value="first">First</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-[0.98rem]"><input type="checkbox" checked={directOnly} onChange={(e) => setDirect(e.target.checked)} className="h-5 w-5" /> Direct flights only</label>
        <div className="flex items-center gap-4">
          {msg && <p className="text-[0.95rem] font-semibold text-red-700">{msg}</p>}
          <p className="text-[0.9rem] text-slate-500"><Users size={15} className="mr-1 inline" />{total + pax.infants} traveller{total + pax.infants > 1 ? 's' : ''}</p>
          <button className="btn btn-brand" disabled={busy}>{busy ? <><Loader2 className="animate-spin" size={18} /> Searching…</> : <><Plane size={18} /> Search flights</>}</button>
        </div>
      </div>
      {error && !busy && <p role="alert" className="mt-3 flex gap-2 rounded-xl bg-red-50 p-3 text-[0.92rem] font-semibold text-red-800"><AlertTriangle size={18} className="mt-0.5 shrink-0" />{error}</p>}
    </form>
  )
}

/* ---------------- results ---------------- */

function Results({ found, picked, setPicked, onBack, onContinue, busy, error }) {
  const [filter, setFilter] = useState({ nonstop: false, airline: '' })
  const twoLists = found.lists.length === 2
  const airlines = [...new Set(found.lists.flat().map((r) => r.airline))].filter(Boolean)
  const ready = picked.every(Boolean)
  const total = picked.reduce((t, p) => t + (p?.price || 0), 0)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button className="font-bold text-brand-500" onClick={onBack}>← Change search</button>
        <div className="flex flex-wrap items-center gap-3 text-[0.95rem]">
          <label className="flex items-center gap-2"><input type="checkbox" checked={filter.nonstop} onChange={(e) => setFilter((f) => ({ ...f, nonstop: e.target.checked }))} /> Non-stop</label>
          <select className="rounded-lg border border-slate-300 px-2 py-1.5" value={filter.airline} onChange={(e) => setFilter((f) => ({ ...f, airline: e.target.value }))} aria-label="Airline">
            <option value="">All airlines</option>{airlines.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className={`mt-5 grid gap-6 ${twoLists ? 'lg:grid-cols-2' : ''}`}>
        {found.lists.map((list, li) => {
          const shown = list.filter((r) => (!filter.nonstop || r.journeys.every((j) => !j.stops)) && (!filter.airline || r.airline === filter.airline))
          return (
            <div key={li}>
              {twoLists && <h2 className="mb-3 text-[1.2rem] font-bold text-ink">{li ? 'Return flight' : 'Outbound flight'}</h2>}
              {!shown.length && <p className="rounded-2xl bg-white p-6 text-center text-slate-600">No flights match. Try another date or remove filters.</p>}
              <ul className="grid gap-3">
                {shown.slice(0, 60).map((r) => {
                  const on = picked[li]?.resultIndex === r.resultIndex
                  return (
                    <li key={r.resultIndex}>
                      <button type="button" onClick={() => setPicked((p) => p.map((x, j) => (j === li ? r : x)))}
                        className={`w-full rounded-2xl border bg-white p-4 text-left transition md:p-5 ${on ? 'border-brand-500 ring-2 ring-brand-500/25' : 'border-slate-200 hover:border-slate-400'}`}>
                        {r.journeys.map((j, k) => <JourneyRow key={k} j={j} />)}
                        <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-dashed border-slate-200 pt-3">
                          <p className="text-[0.85rem] text-slate-600">
                            {r.airline} · {r.refundable ? 'Refundable' : 'Non-refundable'}{r.baggage ? ` · ${r.baggage} check-in` : ''}{r.seats != null && r.seats < 6 ? ` · ${r.seats} seats left` : ''}
                          </p>
                          <p className="font-display text-[1.35rem] font-bold text-navy-950">{inr(r.price)}</p>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      {error && !busy && <p role="alert" className="mt-3 flex gap-2 rounded-xl bg-red-50 p-3 text-[0.92rem] font-semibold text-red-800"><AlertTriangle size={18} className="mt-0.5 shrink-0" />{error}</p>}
      <div className="sticky bottom-3 z-10 mt-6 flex items-center justify-between gap-4 rounded-2xl bg-navy-950 p-4 text-white shadow-xl">
        <p>{ready ? <>Total for all travellers <strong className="ml-1 text-[1.2rem]">{inr(total)}</strong></> : twoLists ? 'Pick an outbound and a return flight' : 'Pick a flight'}</p>
        <button className="btn btn-gold" disabled={!ready || busy} onClick={onContinue}>{busy ? <><Loader2 className="animate-spin" size={18} /> Checking fare…</> : 'Continue'}</button>
      </div>
    </div>
  )
}

function JourneyRow({ j }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-1">
      <div><p className="font-display text-[1.25rem] font-bold text-ink">{time(j.dep)}</p><p className="text-[0.85rem] text-slate-600">{j.from} · {dateLabel(j.dep)}</p></div>
      <div className="text-center text-[0.8rem] text-slate-500"><p>{dur(j.minutes)}</p><p className="mx-auto my-1 h-px w-16 bg-slate-300" /><p>{j.stops ? `${j.stops} stop${j.stops > 1 ? 's' : ''}` : 'Non-stop'}</p></div>
      <div className="text-right"><p className="font-display text-[1.25rem] font-bold text-ink">{time(j.arr)}</p><p className="text-[0.85rem] text-slate-600">{j.to} · {dateLabel(j.arr)}</p></div>
      <p className="col-span-3 text-[0.8rem] text-slate-500">{j.flights.map((f) => `${f.code} ${f.number}`).join(' + ')}</p>
    </div>
  )
}

/* ---------------- travellers + extras ---------------- */

const TYPE_NAME = { 1: 'Adult', 2: 'Child', 3: 'Infant' }
const TITLES = { 1: ['Mr', 'Mrs', 'Ms'], 2: ['Mstr', 'Miss'], 3: ['Mstr', 'Miss'] }

function Travellers({ q, onPay, onBack, busy, error }) {
  const intl = q.international
  const needPassport = intl || q.legs.some((l) => l.passportRequired)
  const panNeeded = q.legs.some((l) => l.panRequired)
  const passportFull = q.legs.some((l) => l.passportFull)
  const detailChange = q.legs.map((l) => l.detailChange).filter(Boolean)
  const gstMandatory = q.legs.some((l) => l.isGSTMandatory)
  const gstAllowed = gstMandatory || q.legs.some((l) => l.gstAllowed)
  const initial = []
  for (const [t, n] of [[1, q.pax.adults], [2, q.pax.children], [3, q.pax.infants]]) for (let i = 0; i < n; i++) initial.push({ paxType: t, title: TITLES[t][0], firstName: '', lastName: '', dob: '', passportNo: '', passportExpiry: '', passportIssue: '', passportCountry: 'IN', nationality: 'IN', pan: '', guardian: { title: 'Mr', firstName: '', lastName: '', pan: '' } })
  const [pax, setPax] = useState(initial)
  const [contact, setContact] = useState({ phone: '', email: '', address: '', city: 'Bengaluru' })
  const [gstOn, setGstOn] = useState(gstMandatory)
  const [gst, setGst] = useState({ number: '', company: '', address: '', phone: '', email: '' })
  const [choices, setChoices] = useState(q.legs.map(() => pax.map(() => ({ baggage: [], meals: [] }))))
  const [agree, setAgree] = useState(false)
  const [showRules, setShowRules] = useState(false)

  const setP = (i, k, v) => setPax((p) => p.map((x, j) => (j === i ? { ...x, [k]: v } : x)))
  const setG = (i, k, v) => setPax((p) => p.map((x, j) => (j === i ? { ...x, guardian: { ...x.guardian, [k]: v } } : x)))
  const extras = q.legs.reduce((t, leg, li) => t + choices[li].reduce((s, c) => s + [...c.baggage, ...c.meals].reduce((a, key) => a + (findSsr(leg, key)?.price || 0), 0), 0), 0)

  const pick = (li, pi, kind, sectorKey, key) =>
    setChoices((c) => c.map((leg, a) => (a !== li ? leg : leg.map((p, b) => (b !== pi ? p : { ...p, [kind]: [...p[kind].filter((k) => !k.startsWith(sectorKey)), ...(key ? [key] : [])] })))))

  const submit = (e) => {
    e.preventDefault()
    onPay({ passengers: pax, contact, gst: gstOn ? gst : undefined, choices })
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="grid gap-6">
        <button type="button" className="w-fit font-bold text-brand-500" onClick={onBack}>← Back to flights</button>

        {detailChange.length > 0 && <p className="rounded-xl bg-gold-500/15 p-3 font-semibold text-navy-900">The airline updated this flight ({detailChange.join(', ')}). Please check the details below before paying.</p>}
        {q.legs.some((l) => l.priceChanged) && <p className="rounded-xl bg-gold-500/15 p-3 font-semibold text-navy-900">The airline updated this fare. The price below is the latest.</p>}

        {pax.map((p, i) => (
          <fieldset key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
            <legend className="px-1 font-display text-[1.1rem] font-bold text-ink">{TYPE_NAME[p.paxType]} {pax.slice(0, i + 1).filter((x) => x.paxType === p.paxType).length}{i === 0 ? ' (lead)' : ''}</legend>
            <p className="mb-3 text-[0.88rem] text-slate-500">Exactly as on the {intl ? 'passport' : 'government photo ID'}. Letters only.</p>
            <div className="grid gap-3 sm:grid-cols-[6rem_1fr_1fr]">
              <div><label className={label} htmlFor={`t${i}`}>Title</label><select id={`t${i}`} className={input} value={p.title} onChange={(e) => setP(i, 'title', e.target.value)}>{TITLES[p.paxType].map((t) => <option key={t}>{t}</option>)}</select></div>
              <div><label className={label} htmlFor={`f${i}`}>First &amp; middle name</label><input id={`f${i}`} className={input} required maxLength={32} pattern="[A-Za-z ]+" value={p.firstName} onChange={(e) => setP(i, 'firstName', e.target.value)} /></div>
              <div><label className={label} htmlFor={`l${i}`}>Last name</label><input id={`l${i}`} className={input} required minLength={2} maxLength={32} pattern="[A-Za-z ]+" value={p.lastName} onChange={(e) => setP(i, 'lastName', e.target.value)} /></div>
            </div>
            {(p.paxType !== 1 || intl) && (
              <div className="mt-3 sm:w-52"><label className={label} htmlFor={`b${i}`}>Date of birth</label><input id={`b${i}`} type="date" className={input} required max={todayIso()} value={p.dob} onChange={(e) => setP(i, 'dob', e.target.value)} /></div>
            )}
            {needPassport && (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div><label className={label} htmlFor={`pn${i}`}>Passport no.</label><input id={`pn${i}`} className={input} required value={p.passportNo} onChange={(e) => setP(i, 'passportNo', e.target.value.toUpperCase())} /></div>
                <div><label className={label} htmlFor={`pe${i}`}>Passport expiry</label><input id={`pe${i}`} type="date" className={input} required min={todayIso()} value={p.passportExpiry} onChange={(e) => setP(i, 'passportExpiry', e.target.value)} /></div>
                <div><label className={label} htmlFor={`na${i}`}>Nationality</label><input id={`na${i}`} className={input} maxLength={2} value={p.nationality} onChange={(e) => setP(i, 'nationality', e.target.value.toUpperCase())} /></div>
              </div>
            )}
            {passportFull && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div><label className={label} htmlFor={`pi${i}`}>Passport issue date</label><input id={`pi${i}`} type="date" className={input} required max={todayIso()} value={p.passportIssue} onChange={(e) => setP(i, 'passportIssue', e.target.value)} /></div>
                <div><label className={label} htmlFor={`pc${i}`}>Issuing country (2 letters)</label><input id={`pc${i}`} className={input} required maxLength={2} value={p.passportCountry} onChange={(e) => setP(i, 'passportCountry', e.target.value.toUpperCase())} /></div>
              </div>
            )}
            {panNeeded && p.paxType === 1 && (
              <div className="mt-3 sm:w-64"><label className={label} htmlFor={`pan${i}`}>PAN (as on card)</label><input id={`pan${i}`} className={input} required maxLength={10} pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]" value={p.pan} onChange={(e) => setP(i, 'pan', e.target.value.toUpperCase())} /></div>
            )}
            {panNeeded && p.paxType !== 1 && (
              <div className="mt-3 grid gap-3 sm:grid-cols-[6rem_1fr_1fr_10rem]">
                <p className="text-[0.88rem] text-slate-500 sm:col-span-4">Parent / guardian PAN details (exactly as on the PAN card)</p>
                <div><label className={label} htmlFor={`gt${i}`}>Title</label><select id={`gt${i}`} className={input} value={p.guardian.title} onChange={(e) => setG(i, 'title', e.target.value)}>{['Mr', 'Mrs', 'Ms'].map((t) => <option key={t}>{t}</option>)}</select></div>
                <div><label className={label} htmlFor={`gf${i}`}>First name</label><input id={`gf${i}`} className={input} required value={p.guardian.firstName} onChange={(e) => setG(i, 'firstName', e.target.value)} /></div>
                <div><label className={label} htmlFor={`gl${i}`}>Last name</label><input id={`gl${i}`} className={input} required value={p.guardian.lastName} onChange={(e) => setG(i, 'lastName', e.target.value)} /></div>
                <div><label className={label} htmlFor={`gp${i}`}>PAN</label><input id={`gp${i}`} className={input} required maxLength={10} value={p.guardian.pan} onChange={(e) => setG(i, 'pan', e.target.value.toUpperCase())} /></div>
              </div>
            )}
            {q.legs.map((leg, li) => <Extras key={li} leg={leg} li={li} legs={q.legs.length} pax={p} choice={choices[li][i]} onPick={(kind, sector, key) => pick(li, i, kind, sector, key)} />)}
          </fieldset>
        ))}

        <fieldset className="rounded-2xl border border-slate-200 bg-white p-5">
          <legend className="px-1 font-display text-[1.1rem] font-bold text-ink">Contact for the e-ticket</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className={label} htmlFor="ph">Mobile</label><input id="ph" type="tel" className={input} required inputMode="numeric" pattern="[0-9+ ]{10,14}" value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} /></div>
            <div><label className={label} htmlFor="em">Email</label><input id="em" type="email" className={input} required value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} /></div>
            <div><label className={label} htmlFor="ad">Address</label><input id="ad" className={input} required value={contact.address} onChange={(e) => setContact((c) => ({ ...c, address: e.target.value }))} /></div>
            <div><label className={label} htmlFor="ci">City</label><input id="ci" className={input} required value={contact.city} onChange={(e) => setContact((c) => ({ ...c, city: e.target.value }))} /></div>
          </div>
          {gstAllowed && (
            <div className="mt-4">
              <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={gstOn} disabled={gstMandatory} onChange={(e) => setGstOn(e.target.checked)} /> {gstMandatory ? 'GST details (required for this fare)' : 'Use my company GST number'}</label>
              {gstOn && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[['number', 'GSTIN'], ['company', 'Company name'], ['address', 'Company address'], ['phone', 'Company phone'], ['email', 'Company email']].map(([k, l]) => (
                    <div key={k}><label className={label} htmlFor={`g${k}`}>{l}</label><input id={`g${k}`} className={input} required value={gst[k]} onChange={(e) => setGst((g) => ({ ...g, [k]: k === 'number' ? e.target.value.toUpperCase() : e.target.value }))} /></div>
                  ))}
                </div>
              )}
            </div>
          )}
        </fieldset>
      </div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-28">
        <h2 className="font-display text-[1.15rem] font-bold text-ink">Your trip</h2>
        {q.legs.map((leg, li) => (
          <div key={li} className="mt-3 border-b border-slate-100 pb-3">{leg.journeys.map((j, k) => <p key={k} className="text-[0.92rem]"><strong>{j.from} → {j.to}</strong> · {dateLabel(j.dep)} {time(j.dep)}</p>)}<p className="text-[0.85rem] text-slate-500">{leg.isLCC ? 'Low-cost carrier' : 'Full-service carrier'}</p></div>
        ))}
        <dl className="mt-3 grid grid-cols-[1fr_auto] gap-1 text-[0.95rem]">
          <dt>Fare incl. taxes</dt><dd>{inr(q.total)}</dd>
          {extras > 0 && <><dt>Baggage &amp; meals</dt><dd>{inr(extras)}</dd></>}
          <dt className="mt-2 font-bold">Total</dt><dd className="mt-2 font-display text-[1.3rem] font-bold">{inr(q.total + extras)}</dd>
        </dl>
        <button type="button" className="mt-3 text-[0.92rem] font-bold text-brand-500" onClick={() => setShowRules((s) => !s)}>{showRules ? 'Hide' : 'Show'} fare rules</button>
        {showRules && <FareRules legs={q.legs} />}
        <label className="mt-4 flex items-start gap-2 text-[0.9rem]"><input type="checkbox" className="mt-1" required checked={agree} onChange={(e) => setAgree(e.target.checked)} /> <span>Names match ID/passport, and I accept the fare rules, <Link className="underline" to="/terms">Terms</Link> and <Link className="underline" to="/refund-policy">Refund Policy</Link>.</span></label>
        <button className="btn btn-brand mt-4 w-full" disabled={!!busy}>
          {busy === 'pay' ? <><Loader2 className="animate-spin" size={18} /> Starting payment…</> : busy === 'ticket' ? <><Loader2 className="animate-spin" size={18} /> Issuing ticket — don’t close</> : `Pay ${inr(q.total + extras)}`}
        </button>
        {error && !busy && <p role="alert" className="mt-3 flex gap-2 rounded-xl bg-red-50 p-3 text-[0.92rem] font-semibold text-red-800"><AlertTriangle size={18} className="mt-0.5 shrink-0" />{error}</p>}
      </aside>
    </form>
  )
}

const findSsr = (leg, key) => [...(leg.ssr?.baggage || []), ...(leg.ssr?.meals || [])].find((x) => x.key === key)

function Extras({ leg, li, legs, pax, choice, onPick }) {
  if (!leg.ssr?.available || !leg.ssr.isLCC) return null
  const sectors = (items) => {
    const m = new Map()
    for (const x of items || []) {
      const k = `${x.origin}|${x.destination}|${x.wayType}|`
      if (!m.has(k)) m.set(k, [])
      m.get(k).push(x)
    }
    return [...m.entries()]
  }
  const block = (kind, items, Icon, title) =>
    sectors(items).map(([k, list]) => (
      <div key={kind + k}>
        <label className={label}><Icon size={13} className="mr-1 inline" />{title} {list[0].origin}→{list[0].destination}{legs > 1 ? ` (${li ? 'return' : 'outbound'})` : ''}</label>
        <select className={input} value={choice[kind].find((x) => x.startsWith(k)) || ''} onChange={(e) => onPick(kind, k, e.target.value)}>
          <option value="">{kind === 'baggage' ? 'No extra baggage' : leg.mealRequired ? 'Free meal (this fare includes one)' : 'No meal'}</option>
          {list.filter((x) => x.price > 0 || !/^No/.test(x.code)).map((x) => <option key={x.key} value={x.key}>{x.label}{x.price ? ` — ${inr(x.price)}` : ' — included'}</option>)}
        </select>
      </div>
    ))
  return (
    <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
      {pax.paxType !== 3 && block('baggage', leg.ssr.baggage, Luggage, 'Extra baggage')}
      {block('meals', leg.ssr.meals, Utensils, 'Meal')}
    </div>
  )
}

function FareRules({ legs }) {
  return (
    <div className="mt-2 max-h-72 overflow-auto rounded-xl bg-sand p-3 text-[0.85rem]">
      {legs.flatMap((l) => l.rules).map((r, i) => (
        <div key={i} className="mb-3">
          <p className="font-bold">{r.airline} {r.origin}–{r.destination} · {r.fareBasis}</p>
          {(r.mini?.Rules || []).map((m, k) => (
            <p key={k}>{m.Type === 1 ? 'Cancellation' : m.Type === 2 ? 'Date change' : 'Rule'} {m.FromDuration ? `from ${m.FromDuration.replace(/^P(T)?/, '')}` : ''}{m.ToDuration ? ` to ${m.ToDuration.replace(/^P(T)?/, '')}` : ''} before: {(m.PaxPenalties || []).map((p) => inr(p.AirlineFee)).join(', ')} + our service fee</p>
          ))}
          {/* Fare rule text from TBO is airline-supplied HTML; render as text only. */}
          <p className="mt-1 whitespace-pre-line text-slate-600">{String(r.text || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim().slice(0, 1500)}</p>
        </div>
      ))}
    </div>
  )
}

/* ---------------- payment + done ---------------- */

function razorpay(c, contact) {
  return new Promise((resolve, reject) => {
    const open = () => {
      const rz = new window.Razorpay({
        key: c.payment.keyId,
        order_id: c.payment.orderId,
        amount: c.payment.amountPaise,
        currency: 'INR',
        name: BIZ.name,
        description: `Flight booking ${c.orderRef}`,
        prefill: { email: contact.email, contact: contact.phone },
        theme: { color: '#0b2545' },
        handler: (r) => resolve({ orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, signature: r.razorpay_signature }),
        modal: { ondismiss: () => reject(new Error('Payment was cancelled. Nothing has been booked.')) },
      })
      rz.on('payment.failed', (r) => reject(new Error(r.error?.description || 'Payment failed. Nothing has been booked.')))
      rz.open()
    }
    if (window.Razorpay) return open()
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = open
    s.onerror = () => reject(new Error('Could not load the payment window. Check your connection.'))
    document.body.appendChild(s)
  })
}

function Done({ done, onNew }) {
  const ok = done.results.every((r) => r.bookingId && !r.error)
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10">
      {ok ? <CheckCircle2 className="text-palm" size={44} /> : <AlertTriangle className="text-gold-600" size={44} />}
      <h2 className="mt-3 font-display text-[1.7rem] font-bold text-ink">{ok ? 'Booked — your e-ticket is on its way' : 'We received your payment — our team is finishing this booking'}</h2>
      <p className="mt-2 text-slate-600">Reference <strong>{done.orderRef}</strong> · Paid {inr(done.amount)}</p>
      {done.results.map((r, i) => (
        <div key={i} className="mt-5 rounded-2xl bg-sand p-4">
          <p><strong>PNR:</strong> {r.pnr || 'pending'} · <strong>Booking ID:</strong> {r.bookingId || 'pending'}</p>
          {r.error && <p className="mt-1 text-red-700">{r.error}</p>}
          {r.details?.passengers?.map((p, k) => <p key={k} className="text-[0.95rem]">{p.name}{p.ticket ? ` — ticket ${p.ticket}` : ''}</p>)}
          {r.details?.segments?.map((s, k) => <p key={k} className="text-[0.9rem] text-slate-600">{s.flight} {s.from}→{s.to} {dateLabel(s.dep)} {time(s.dep)}</p>)}
        </div>
      ))}
      <p className="mt-5 text-[0.95rem]">Questions? Call <a className="font-bold" href={`tel:${BIZ.phone}`}>{BIZ.phoneDisplay}</a> with your reference.</p>
      <button className="btn btn-ghost mt-5" onClick={onNew}>Book another flight</button>
    </div>
  )
}

function Offline() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center md:p-10">
      <Plane className="mx-auto text-brand-500" size={40} />
      <h2 className="mt-3 font-display text-[1.6rem] font-bold text-ink">Online booking is coming soon</h2>
      <p className="mx-auto mt-2 max-w-xl text-slate-600">Until then, send us your route and dates and we’ll reply with fare options.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <a className="btn btn-wa" href={waLink('Hi, I want to book a flight: from __ to __ on __ for __ travellers.')}>WhatsApp us</a>
        <Link className="btn btn-ghost" to="/flights-hotels">Flights &amp; hotels desk</Link>
      </div>
    </div>
  )
}
