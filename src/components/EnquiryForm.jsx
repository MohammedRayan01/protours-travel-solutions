import { useState } from 'react'
import { Send } from 'lucide-react'
import { waLink, SERVICES } from '../data/site.js'

const SERVICE_OPTIONS = [...SERVICES.map((s) => s.title), 'Corporate Travel', 'Travel Insurance']

/**
 * Enquiry form. Serialises its fields into a formatted WhatsApp message
 * and opens the chat — no backend required, which suits the business.
 *
 * variant: 'glass' (on photography) | 'light' (on white)
 * layout:  'bar' (single row, hero) | 'full' (stacked, contact pages)
 */
export default function EnquiryForm({ variant = 'light', layout = 'full', defaultService }) {
  const glass = variant === 'glass'
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const lines = []
    data.forEach((v, k) => { if (String(v).trim()) lines.push(`${k}: ${v}`) })
    if (!lines.length) return

    const msg = `*New Enquiry — Pro Tours & Travel Solutions*\n\n${lines.join('\n')}`
    window.open(waLink(msg), '_blank', 'noopener,noreferrer')
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    e.currentTarget.reset()
  }

  const L = glass ? 'field-label text-white/80' : 'field-label text-navy-900'
  const F = glass ? 'field-glass' : 'field'

  if (layout === 'bar') {
    return (
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-[1.1fr_1fr_1fr_auto] md:items-end">
        <div>
          <label className={L} htmlFor="b-service">Service</label>
          <select id="b-service" name="Service" className={F} defaultValue={defaultService}>
            {SERVICE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={L} htmlFor="b-dest">Destination</label>
          <input id="b-dest" name="Destination" className={F} placeholder="Dubai, Makkah, Bali…" />
        </div>
        <div>
          <label className={L} htmlFor="b-mob">Your Mobile</label>
          <input id="b-mob" name="Mobile" type="tel" required className={F} placeholder="10-digit number" />
        </div>
        <button type="submit" className="btn btn-gold h-[50px] w-full md:w-auto">
          {sent ? 'Opening…' : 'Get Free Quote'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={L} htmlFor="f-name">Your Name</label>
          <input id="f-name" name="Name" required className={F} placeholder="Full name" />
        </div>
        <div>
          <label className={L} htmlFor="f-mob">Mobile / WhatsApp</label>
          <input id="f-mob" name="Mobile" type="tel" required className={F} placeholder="10-digit number" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={L} htmlFor="f-service">Service Needed</label>
          <select id="f-service" name="Service" className={F} defaultValue={defaultService}>
            {SERVICE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={L} htmlFor="f-trav">Travellers</label>
          <select id="f-trav" name="Travellers" className={F}>
            <option>1 adult</option><option>2 adults</option>
            <option>Family (3–5)</option><option>Group (6+)</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={L} htmlFor="f-dest">Destination</label>
          <input id="f-dest" name="Destination" className={F} placeholder="e.g. Dubai, Makkah, Kerala" />
        </div>
        <div>
          <label className={L} htmlFor="f-date">Travel Date</label>
          <input id="f-date" name="Travel Date" type="date" className={F} />
        </div>
      </div>

      <div>
        <label className={L} htmlFor="f-msg">Your Message</label>
        <textarea
          id="f-msg" name="Message" rows={4} className={`${F} resize-y`}
          placeholder="Budget, hotel preference, anything else we should know…"
        />
      </div>

      <button type="submit" className="btn btn-wa w-full">
        <Send size={17} /> {sent ? 'Opening WhatsApp…' : 'Send via WhatsApp'}
      </button>

      <p className={`text-center text-[0.9rem] ${glass ? 'text-white/70' : 'text-slate-500'}`}>
        Your details open in WhatsApp ready to send — nothing is stored on this site.
      </p>
    </form>
  )
}
