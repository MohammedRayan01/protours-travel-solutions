import { useEffect, useState } from 'react'
import { RefreshCw, Plane, FileJson, Wallet, LayoutDashboard, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

/*
 * Back office (CRM) — testing version, no login yet.
 * Reads /api/crm, which only answers where CRM_ENABLED=true (local machine).
 * Later: add CRM_PASSWORD + Supabase, then enquiries/packages editing.
 */

const get = async (action, params = {}) => {
  const r = await fetch(`/api/crm?${new URLSearchParams({ action, ...params })}`)
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.error || 'Request failed')
  return d
}
const inr = (n) => (n == null ? '—' : '₹' + Math.round(n).toLocaleString('en-IN'))
const when = (s) => (s ? new Date(s).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—')
const TABS = [['overview', 'Overview', LayoutDashboard], ['bookings', 'Bookings', Plane], ['logs', 'API logs', FileJson], ['wallet', 'TBO wallet', Wallet]]
const card = 'rounded-2xl border border-slate-200 bg-white p-5'

export default function Crm() {
  const [tab, setTab] = useState('overview')
  const [ov, setOv] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { get('overview').then(setOv).catch((e) => setErr(e.message)) }, [])

  return (
    <section className="min-h-screen bg-slate-50 pt-36 pb-16 md:pt-44">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Back office</p>
            <h1 className="font-display text-[2rem] font-bold text-ink">Pro Tours CRM</h1>
          </div>
          <p className="rounded-full bg-gold-500/15 px-4 py-1.5 text-[0.85rem] font-semibold text-navy-900">Testing version · no login · local only</p>
        </div>

        {err ? (
          <div className={`${card} mt-6 flex gap-3 text-red-800`}><AlertTriangle /><div><p className="font-bold">{err}</p><p className="mt-1 text-[0.92rem] text-slate-600">The CRM runs only on your computer: set <code>CRM_ENABLED=true</code> in <code>.env.local</code> and run <code>npm run dev</code>.</p></div></div>
        ) : (
          <>
            <nav className="mt-6 flex flex-wrap gap-2">
              {TABS.map(([k, l, Icon]) => (
                <button key={k} onClick={() => setTab(k)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.95rem] font-bold ${tab === k ? 'bg-navy-950 text-white' : 'bg-white text-navy-900 border border-slate-200'}`}><Icon size={16} />{l}</button>
              ))}
            </nav>
            <div className="mt-6">
              {tab === 'overview' && <Overview ov={ov} />}
              {tab === 'bookings' && <Bookings />}
              {tab === 'logs' && <Logs />}
              {tab === 'wallet' && <WalletTab />}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function Stat({ label, value, tone = 'text-ink' }) {
  return <div className={card}><p className="text-[0.8rem] font-bold tracking-wide text-slate-500 uppercase">{label}</p><p className={`mt-1 font-display text-[1.7rem] font-bold ${tone}`}>{value}</p></div>
}

function Overview({ ov }) {
  if (!ov) return <p>Loading…</p>
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Bookings" value={ov.totals.all} />
        <Stat label="Ticketed" value={ov.totals.ticketed} tone="text-palm" />
        <Stat label="Need attention" value={ov.totals.attention} tone="text-gold-600" />
        <Stat label="Failed" value={ov.totals.failed} tone="text-red-700" />
      </div>
      <div className={card}>
        <h2 className="font-display text-[1.15rem] font-bold">Settings (read-only for now)</h2>
        <dl className="mt-3 grid gap-2 text-[0.95rem] sm:grid-cols-2">
          <dt className="text-slate-500">TBO environment</dt><dd className="font-semibold">{ov.env}</dd>
          <dt className="text-slate-500">Online flight booking</dt><dd className="font-semibold">{ov.flightsEnabled ? 'On' : 'Off'}</dd>
          <dt className="text-slate-500">Payments</dt><dd className="font-semibold">{ov.payments}</dd>
          <dt className="text-slate-500">Markup on fares</dt><dd className="font-semibold">{ov.markupPercent}%</dd>
          <dt className="text-slate-500">Supabase database</dt><dd className="font-semibold">{ov.supabase ? 'Connected' : 'Not connected yet (data from local files)'}</dd>
          <dt className="text-slate-500">TBO API traces logged</dt><dd className="font-semibold">{ov.traces}</dd>
        </dl>
      </div>
      <div className={`${card} text-[0.93rem] text-slate-600`}>
        <p className="font-bold text-ink">Coming next (after Supabase + password)</p>
        <p className="mt-1">Website enquiries, editing packages and site content, cancellations (SendChangeRequest), refunds and staff logins.</p>
      </div>
    </div>
  )
}

const STATUS = {
  ticketed: ['Ticketed', 'bg-palm/10 text-palm', CheckCircle2],
  needs_attention: ['Needs attention', 'bg-gold-500/15 text-gold-700', AlertTriangle],
  failed: ['Failed', 'bg-red-50 text-red-700', XCircle],
}

function Bookings() {
  const [rows, setRows] = useState(null)
  const [open, setOpen] = useState(null)
  const [live, setLive] = useState({})
  const load = () => get('bookings').then(setRows).catch((e) => setRows({ error: e.message }))
  useEffect(() => { load() }, [])
  const check = async (id) => {
    setLive((l) => ({ ...l, [id]: 'loading' }))
    try {
      const d = await get('booking', { id })
      const it = d.FlightItinerary
      setLive((l) => ({ ...l, [id]: it ? `TBO status ${it.Status} · ${it.Passenger?.map((p) => `${p.FirstName} ${p.LastName}: ${p.Ticket?.TicketNumber || 'no ticket'}`).join(', ')}` : d.Error?.ErrorMessage || 'No details' }))
    } catch (e) { setLive((l) => ({ ...l, [id]: e.message })) }
  }
  if (!rows) return <p>Loading…</p>
  if (rows.error) return <p className="text-red-700">{rows.error}</p>
  return (
    <div className={`${card} overflow-x-auto p-0`}>
      <div className="flex items-center justify-between border-b border-slate-200 p-4"><p className="font-bold">{rows.length} bookings</p><button onClick={load} className="inline-flex items-center gap-1 text-[0.9rem] font-bold text-brand-500"><RefreshCw size={15} />Refresh</button></div>
      <table className="w-full min-w-[760px] text-left text-[0.92rem]">
        <thead className="bg-slate-50 text-[0.8rem] tracking-wide text-slate-500 uppercase"><tr>{['When', 'Reference', 'Source', 'Status', 'PNR / Booking ID', 'Amount', ''].map((h) => <th key={h} className="px-4 py-2">{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((b) => {
            const [label, cls, Icon] = STATUS[b.status] || [b.status, 'bg-slate-100', AlertTriangle]
            return [
              <tr key={b.order_ref} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3 whitespace-nowrap">{when(b.created_at)}</td>
                <td className="px-4 py-3 font-semibold">{b.order_ref}<p className="text-[0.82rem] font-normal text-slate-500">{b.title || b.contact_email}</p></td>
                <td className="px-4 py-3">{b.source} · {b.env}</td>
                <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.8rem] font-bold ${cls}`}><Icon size={13} />{label}</span></td>
                <td className="px-4 py-3 font-mono text-[0.85rem]">{(b.legs || []).map((l, i) => <div key={i}>{l.pnr || '—'} / {l.bookingId || '—'}</div>)}</td>
                <td className="px-4 py-3">{inr(b.amount_inr)}</td>
                <td className="px-4 py-3"><button className="font-bold text-brand-500" onClick={() => setOpen(open === b.order_ref ? null : b.order_ref)}>{open === b.order_ref ? 'Hide' : 'Details'}</button></td>
              </tr>,
              open === b.order_ref && (
                <tr key={b.order_ref + '-d'} className="bg-slate-50"><td colSpan={7} className="px-4 py-3 text-[0.88rem]">
                  <p><strong>TraceId:</strong> <span className="font-mono">{b.trace_id || '—'}</span></p>
                  {b.notes && <p className="mt-1 text-slate-600">{b.notes}</p>}
                  {(b.legs || []).map((l, i) => (
                    <div key={i} className="mt-2 rounded-xl bg-white p-3">
                      <p><strong>Leg {i + 1}:</strong> PNR {l.pnr || '—'} · Booking {l.bookingId || '—'} · Ticket status {l.ticketStatus ?? '—'}{l.error ? ` · ${l.error}` : ''}</p>
                      {l.details?.passengers?.map((p, k) => <p key={k}>{p.name} — {p.ticket || 'no ticket number'}</p>)}
                      {l.bookingId && <button className="mt-1 font-bold text-brand-500" onClick={() => check(l.bookingId)}>Check live status with TBO</button>}
                      {live[l.bookingId] && <p className="mt-1 text-slate-600">{live[l.bookingId] === 'loading' ? 'Checking…' : live[l.bookingId]}</p>}
                    </div>
                  ))}
                </td></tr>
              ),
            ]
          })}
        </tbody>
      </table>
    </div>
  )
}

function Logs() {
  const [list, setList] = useState(null)
  const [sel, setSel] = useState(null)
  const [calls, setCalls] = useState(null)
  const [view, setView] = useState(null)
  useEffect(() => { get('traces').then(setList).catch((e) => setList({ error: e.message })) }, [])
  const pick = (t) => { setSel(t); setView(null); setCalls(null); get('trace', { id: t }).then(setCalls).catch((e) => setCalls({ error: e.message })) }
  if (!list) return <p>Loading…</p>
  if (list.error) return <p className="text-red-700">{list.error}</p>
  return (
    <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
      <div className={`${card} max-h-[70vh] overflow-auto p-2`}>
        {list.map((t) => (
          <button key={t.traceId} onClick={() => pick(t.traceId)} className={`block w-full rounded-xl p-3 text-left text-[0.85rem] ${sel === t.traceId ? 'bg-navy-950 text-white' : 'hover:bg-slate-50'}`}>
            <p className="font-mono text-[0.78rem]">{t.traceId}</p>
            <p className="opacity-75">{when(t.at)} · {t.calls} calls</p>
            <p className="opacity-75">{t.methods.join(' › ')}</p>
          </button>
        ))}
      </div>
      <div className={`${card} max-h-[70vh] overflow-auto`}>
        {!sel && <p className="text-slate-500">Pick a trace to see every request and response sent to TBO.</p>}
        {calls?.error && <p className="text-red-700">{calls.error}</p>}
        {Array.isArray(calls) && (
          <>
            <div className="flex flex-wrap gap-2">
              {calls.map((c, i) => <button key={c.file} onClick={() => setView(i)} className={`rounded-lg px-2.5 py-1 text-[0.8rem] font-bold ${view === i ? 'bg-brand-500 text-white' : c.kind === 'request' ? 'bg-slate-100' : 'bg-palm/10'}`}>{c.method} {c.kind === 'request' ? '→' : '←'}</button>)}
            </div>
            {view != null && <pre className="mt-3 overflow-auto rounded-xl bg-slate-900 p-3 text-[0.75rem] text-slate-100">{JSON.stringify(calls[view].body, null, 2).slice(0, 200000)}</pre>}
          </>
        )}
      </div>
    </div>
  )
}

function WalletTab() {
  const [b, setB] = useState(null)
  const load = () => { setB(null); get('balance').then(setB).catch((e) => setB({ error: e.message })) }
  useEffect(load, [])
  return (
    <div className={`${card} max-w-md`}>
      <h2 className="font-display text-[1.15rem] font-bold">TBO wallet (GetAgencyBalance)</h2>
      {!b ? <p className="mt-2">Loading…</p> : b.error ? <p className="mt-2 text-red-700">{b.error}</p> : (
        <dl className="mt-3 grid grid-cols-2 gap-2 text-[0.95rem]"><dt className="text-slate-500">Cash balance</dt><dd className="font-bold">{inr(b.cash)}</dd><dt className="text-slate-500">Credit balance</dt><dd className="font-bold">{inr(b.credit)}</dd><dt className="text-slate-500">Account type</dt><dd className="font-bold">{b.agencyType}</dd></dl>
      )}
      <button onClick={load} className="mt-4 inline-flex items-center gap-1 font-bold text-brand-500"><RefreshCw size={15} />Refresh</button>
    </div>
  )
}
