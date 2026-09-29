import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Check, X, Crown, Star, Sparkles, Hotel, CreditCard } from 'lucide-react'

import { BIZ, PACKAGES, TIERS, waLink } from '../data/site.js'
import { Reveal, SectionHeading, PageHero } from '../components/ui.jsx'
import { loadRazorpayCheckout, priceToRupees } from '../lib/razorpay.js'

const FILTERS = [
  { k: 'all', label: 'All Packages' },
  { k: 'international', label: 'International' },
  { k: 'india', label: 'India' },
  { k: 'honeymoon', label: 'Honeymoon' },
  { k: 'family', label: 'Family' },
  { k: 'cruise', label: 'Cruise' },
  { k: 'umrah', label: 'Umrah' },
]

const TIER_META = {
  Economy: { icon: Star,     blurb: 'Smart value, everything essential covered' },
  Deluxe:  { icon: Sparkles, blurb: 'Better hotels, more inclusions, private transfers' },
  Premium: { icon: Crown,    blurb: 'Five-star throughout, private guides, full board' },
}

function PackagePay({ p, tier }) {
  const price = p.tiers[tier].price
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')
  const [paymentId, setPaymentId] = useState('')

  const enquiryMsg = waLink(
    `Hello Pro Tours & Travel Solutions, I am interested in: ${p.name} — ${tier} tier (${price}). Please share details and availability.`
  )

  const handlePay = async () => {
    setStatus('loading')
    setMessage('')
    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: priceToRupees(price), packageName: p.name, tier }),
      })
      const order = await orderRes.json().catch(() => null)
      if (!order) throw new Error('Payment service is unavailable right now. Please enquire on WhatsApp instead.')
      if (!orderRes.ok) throw new Error(order.error || 'Could not start payment.')

      const ready = await loadRazorpayCheckout()
      if (!ready) throw new Error('Could not load the payment window. Check your connection and try again.')

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: BIZ.name,
        description: `${p.name} — ${tier} tier`,
        theme: { color: '#1273c4' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            })
            const verify = await verifyRes.json().catch(() => null)
            if (!verify || !verifyRes.ok || !verify.valid) throw new Error('unverified')

            setPaymentId(response.razorpay_payment_id)
            setStatus('success')
            window.open(
              waLink(
                `Hello Pro Tours & Travel Solutions, I just paid for ${p.name} — ${tier} tier (${price}). Payment ID: ${response.razorpay_payment_id}. Please confirm my booking.`
              ),
              '_blank', 'noopener,noreferrer'
            )
          } catch {
            setStatus('error')
            setMessage(`Payment went through but we could not verify it automatically. Please message us with Payment ID: ${response.razorpay_payment_id}`)
          }
        },
        modal: {
          ondismiss: () => setStatus((s) => (s === 'loading' ? 'idle' : s)),
        },
      })

      rzp.on('payment.failed', (resp) => {
        setStatus('error')
        setMessage(resp.error?.description || 'Payment failed. Please try again.')
      })

      rzp.open()
      setStatus('idle')
    } catch (e) {
      setStatus('error')
      setMessage(e.message || 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="mt-auto flex flex-col gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-[0.92rem] text-emerald-800">
        <span className="font-display font-bold">Payment received — thank you!</span>
        <span>Payment ID: {paymentId}</span>
        <span>
          We opened WhatsApp to confirm your booking. If it did not open,{' '}
          <a href={enquiryMsg} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            tap here
          </a>.
        </span>
      </div>
    )
  }

  return (
    <div className="mt-auto flex flex-col items-start gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="block text-[0.75rem] tracking-wider text-slate-500 uppercase">
          {tier} · per person
        </span>
        <span className="font-display text-[1.54rem] font-extrabold text-navy-900">{price}</span>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <button
          onClick={handlePay}
          disabled={status === 'loading'}
          className="btn btn-gold !px-5 !py-2.5 !text-[0.95rem] disabled:cursor-wait disabled:opacity-60"
        >
          {status === 'loading' ? 'Processing…' : <>Pay Now <CreditCard size={15} /></>}
        </button>
        <a href={enquiryMsg} target="_blank" rel="noopener noreferrer" className="text-[0.82rem] font-semibold text-brand-500 hover:underline">
          Or enquire on WhatsApp
        </a>
        {status === 'error' && (
          <span className="max-w-[230px] text-right text-[0.78rem] text-rose-600">{message}</span>
        )}
      </div>
    </div>
  )
}

function PackageCard({ p, tier, delay }) {
  const t = p.tiers[tier]
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
        <span className="glass absolute top-4 left-4 max-w-[calc(100%-2rem)] truncate rounded-full px-3.5 py-1.5 text-[0.72rem] font-bold tracking-wide text-white uppercase">
          {p.badge}
        </span>
        <span className="absolute right-4 bottom-4 rounded-full bg-gold-500 px-3.5 py-1.5 font-display text-[0.86rem] font-extrabold text-navy-950">
          {p.nights}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <span className="mb-2 flex items-center gap-1.5 text-[0.86rem] font-semibold text-brand-500">
          <MapPin size={13} /> {p.region}
        </span>
        <h3 className="text-[1.28rem]">{p.name}</h3>
        <p className="mt-2.5 text-[1.02rem] text-pretty">{p.desc}</p>

        {/* Tier detail */}
        <div className="mt-6 rounded-3xl bg-slate-50 p-5">
          <div className="mb-3.5 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Hotel size={15} className="text-brand-500" />
            <span className="font-display text-[0.95rem] font-bold text-ink">{t.hotel}</span>
          </div>
          <ul className="grid gap-2.5">
            {t.inc.map((x) => (
              <li key={x} className="flex gap-2.5 text-[0.96rem]">
                <Check size={14} strokeWidth={3} className="mt-1 shrink-0 text-brand-500" />
                <span className="text-pretty">{x}</span>
              </li>
            ))}
          </ul>

          {p.exc?.length > 0 && (
            <>
              <div className="mt-4 mb-3.5 flex items-center gap-2 border-t border-slate-200 pt-3.5">
                <X size={15} className="text-slate-400" />
                <span className="font-display text-[0.85rem] font-bold text-slate-500">Not included</span>
              </div>
              <ul className="grid gap-2.5">
                {p.exc.map((x) => (
                  <li key={x} className="flex gap-2.5 text-[0.92rem] text-slate-500">
                    <X size={14} strokeWidth={3} className="mt-1 shrink-0 text-slate-400" />
                    <span className="text-pretty">{x}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <PackagePay p={p} tier={tier} />
      </div>
    </motion.article>
  )
}

export default function Packages() {
  const [filter, setFilter] = useState('all')
  const [tier, setTier] = useState('Deluxe')

  const list = useMemo(
    () => (filter === 'all' ? PACKAGES : PACKAGES.filter((p) => p.cats.includes(filter))),
    [filter]
  )

  return (
    <>
      <PageHero
        img="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=74"
        alt="Tropical beach at sunset"
        eyebrow="Tour packages"
        title="Holidays you can actually book this month"
        sub="Every destination comes in three tiers — Economy, Deluxe and Premium. Same trip, your choice of comfort. All prices per person on twin sharing — pay securely online or enquire on WhatsApp."
      />

      {/* ---- Tier selector ---- */}
      <section className="bg-white pt-16">
        <div className="wrap">
          <SectionHeading
            center
            eyebrow="Choose your comfort"
            title="Three tiers on every package"
            sub="Pick a tier and every card below updates to show that hotel category, those inclusions and that price."
          />

          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TIERS.map((t, i) => {
              const M = TIER_META[t]
              const active = tier === t
              return (
                <Reveal key={t} delay={i * 0.07}>
                  <button
                    onClick={() => setTier(t)}
                    aria-pressed={active}
                    className={`w-full rounded-4xl border-2 p-6 text-left transition-all duration-400 ${
                      active
                        ? 'border-gold-500 bg-navy-950 shadow-[var(--shadow-lift)]'
                        : 'border-slate-200 bg-white hover:-translate-y-1 hover:border-brand-500/40'
                    }`}
                  >
                    <span
                      className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl transition-colors ${
                        active ? 'bg-gold-500 text-navy-950' : 'bg-brand-500/10 text-brand-500'
                      }`}
                    >
                      <M.icon size={22} strokeWidth={1.9} />
                    </span>
                    <span className={`block font-display text-[1.26rem] font-extrabold ${active ? 'text-white' : 'text-ink'}`}>
                      {t}
                    </span>
                    <span className={`mt-1.5 block text-[0.96rem] text-pretty ${active ? 'text-white/65' : 'text-body'}`}>
                      {M.blurb}
                    </span>
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---- Filters + grid ---- */}
      <section className="section bg-white pt-14">
        <div className="wrap">
          <Reveal>
            <div className="mb-12 flex flex-wrap justify-center gap-2.5">
              {FILTERS.map((f) => (
                <button
                  key={f.k}
                  onClick={() => setFilter(f.k)}
                  aria-pressed={filter === f.k}
                  className={`rounded-full border-[1.5px] px-5 py-2.5 font-display text-[0.97rem] font-bold transition-all duration-300 ${
                    filter === f.k
                      ? 'border-navy-950 bg-navy-950 text-white'
                      : 'border-slate-200 bg-white text-body hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-500'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>

          <motion.div layout className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <PackageCard key={`${p.id}-${tier}`} p={p} tier={tier} delay={(i % 3) * 0.06} />
              ))}
            </AnimatePresence>
          </motion.div>

          {!list.length && (
            <p className="py-16 text-center">
              Nothing in this category yet — but we build tailor-made trips every day.{' '}
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-500">
                Tell us what you want.
              </a>
            </p>
          )}
        </div>
      </section>

      {/* ---- Always included ---- */}
      <section className="section bg-slate-50">
        <div className="wrap">
          <SectionHeading center eyebrow="Every package includes" title="What is always included" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {[
              ['Confirmed hotel vouchers', 'Issued before you travel, never “on request”.'],
              ['All listed transfers', 'Airport pickups and inter-city moves, no surprise add-ons.'],
              ['Visa guidance', 'Checklist, forms and appointment support for the destination.'],
              ['On-trip WhatsApp support', 'A number that answers while you are actually travelling.'],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="h-full rounded-4xl border border-slate-200 bg-white p-7">
                  <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                    <Check size={19} strokeWidth={3} />
                  </span>
                  <h4 className="font-display text-[1.12rem] font-bold text-ink">{t}</h4>
                  <p className="mt-2 text-[1.01rem] text-pretty">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
