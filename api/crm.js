import fs from 'node:fs'
import path from 'node:path'
import { authenticate, shared, air, IS_LIVE, markupPercent, fakePaymentsAllowed, TboError } from './_lib/tbo.js'
import { BOOKINGS_FILE } from './_lib/store.js'

/**
 * Back-office (CRM) API. Read-mostly view of flight bookings, TBO API logs,
 * the TBO wallet and site settings.
 *
 * SECURITY: there is no login yet (by request, for testing), so this endpoint
 * is OFF unless CRM_ENABLED=true — set only in .env.local, never on Vercel.
 * Before enabling it anywhere public, add a password (CRM_PASSWORD) and Supabase.
 */
const ROOT = process.cwd()
const LOGS = path.join(ROOT, '.data', 'tbo-logs')
const CERT = path.join(ROOT, 'certification')
const SAFE_ID = /^[A-Za-z0-9-]{1,64}$/

const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return null } }

function bookings() {
  const rows = []
  if (fs.existsSync(BOOKINGS_FILE)) {
    for (const line of fs.readFileSync(BOOKINGS_FILE, 'utf8').split('\n')) {
      if (!line.trim()) continue
      try { rows.push({ source: 'website', ...JSON.parse(line) }) } catch { /* skip bad line */ }
    }
  }
  if (fs.existsSync(CERT)) {
    for (const d of fs.readdirSync(CERT).filter((x) => x.startsWith('case-'))) {
      const r = readJson(path.join(CERT, d, 'result.json'))
      if (!r) continue
      rows.push({
        source: 'certification',
        created_at: fs.statSync(path.join(CERT, d, 'result.json')).mtime.toISOString(),
        order_ref: `CASE-${r.case}`,
        env: 'staging',
        trace_id: r.traceId || null,
        status: r.ok ? 'ticketed' : (r.legs || []).some((l) => l.pnr) ? 'needs_attention' : 'failed',
        amount_inr: r.amount ?? null,
        title: r.title,
        legs: r.legs || [],
        notes: (r.notes || []).slice(-3).join(' · '),
      })
    }
  }
  return rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
}

function traces() {
  if (!fs.existsSync(LOGS)) return []
  return fs.readdirSync(LOGS)
    .filter((t) => t !== 'no-trace' && SAFE_ID.test(t))
    .map((t) => {
      const files = fs.readdirSync(path.join(LOGS, t))
      const methods = [...new Set(files.map((f) => (f.match(/-\d+-(\w+)-(request|response)\.json$/) || [])[1]).filter(Boolean))]
      const stamps = files.map((f) => Number(f.split('-')[0])).filter(Boolean)
      return { traceId: t, calls: files.length / 2, methods, at: stamps.length ? new Date(Math.min(...stamps)).toISOString() : null }
    })
    .sort((a, b) => String(b.at).localeCompare(String(a.at)))
}

function trace(id) {
  if (!SAFE_ID.test(id || '')) throw new TboError('Bad trace id', { status: 400 })
  const dir = path.join(LOGS, id)
  if (!fs.existsSync(dir)) throw new TboError('Trace not found', { status: 404 })
  return fs.readdirSync(dir).sort().map((f) => {
    const m = f.match(/^(\d+)-\d+-(\w+)-(request|response)\.json$/) || []
    return { file: f, at: m[1] ? new Date(Number(m[1])).toISOString() : null, method: m[2], kind: m[3], body: readJson(path.join(dir, f)) }
  })
}

async function balance() {
  const a = await authenticate()
  const r = await shared('GetAgencyBalance', { ClientId: 'ApiIntegrationNew', TokenAgencyId: a.agencyId, TokenMemberId: a.memberId })
  if (r.Status !== 1) throw new TboError(r.Error?.ErrorMessage || 'Balance not available', { status: 502 })
  return { cash: r.CashBalance, credit: r.CreditBalance, agencyType: r.AgencyType === 2 ? 'Credit' : 'Cash' }
}

async function liveBooking(id) {
  const bookingId = Number(id)
  if (!Number.isInteger(bookingId) || bookingId <= 0) throw new TboError('Bad booking id', { status: 400 })
  const a = await authenticate()
  const r = await air('GetBookingDetails', { tokenId: a.tokenId }, { BookingId: bookingId }, { allowError: true })
  return r
}

function overview() {
  const list = bookings()
  const count = (s) => list.filter((b) => b.status === s).length
  return {
    env: IS_LIVE ? 'live' : 'staging',
    flightsEnabled: String(process.env.FLIGHTS_ENABLED).toLowerCase() !== 'false' && Boolean(process.env.TBO_USERNAME),
    markupPercent: markupPercent(),
    payments: process.env.RAZORPAY_KEY_ID ? 'razorpay' : fakePaymentsAllowed() ? 'test mode (no real payment)' : 'off',
    supabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY),
    totals: { all: list.length, ticketed: count('ticketed'), attention: count('needs_attention'), failed: count('failed') },
    traces: traces().length,
  }
}

const ACTIONS = {
  overview: () => overview(),
  bookings: () => bookings(),
  traces: () => traces(),
  trace: (q) => trace(q.id),
  balance: () => balance(),
  booking: (q) => liveBooking(q.id),
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  if (String(process.env.CRM_ENABLED).toLowerCase() !== 'true' || process.env.VERCEL) {
    return res.status(403).json({ error: 'The CRM is switched off on this server.' })
  }
  const q = Object.fromEntries(new URL(req.url, 'http://x').searchParams)
  const fn = ACTIONS[q.action]
  if (!fn) return res.status(400).json({ error: 'Unknown action' })
  try {
    return res.status(200).json(await fn(q))
  } catch (e) {
    // Only our own (TboError) messages reach the browser; anything else is logged, not shown.
    if (!(e instanceof TboError)) console.error('[crm]', q.action, e)
    return res.status(e instanceof TboError ? e.status || 500 : 500).json({ error: e instanceof TboError ? e.message : 'Something went wrong in the CRM.' })
  }
}
