import fs from 'node:fs'
import path from 'node:path'
import { IS_LIVE } from './tbo.js'

/**
 * Booking records for the CRM. Until Supabase is connected they go to
 * .data/bookings.jsonl (local only); with SUPABASE_URL + SUPABASE_SERVICE_KEY
 * they are also written to the flight_bookings table (supabase/schema.sql).
 */
const DIR = path.resolve(process.cwd(), '.data')
export const BOOKINGS_FILE = path.join(DIR, 'bookings.jsonl')

export function recordBooking(b) {
  const ok = b.results.every((r) => r.bookingId && !r.error)
  const row = {
    created_at: new Date().toISOString(),
    order_ref: b.orderRef,
    env: IS_LIVE ? 'live' : 'staging',
    trace_id: b.traceId,
    status: ok ? 'ticketed' : b.results.some((r) => r.pnr) ? 'needs_attention' : 'failed',
    amount_inr: b.amount,
    payment_id: b.paymentId,
    contact_phone: b.contact?.phone || null,
    contact_email: b.contact?.email || null,
    legs: b.results,
  }
  if (!process.env.VERCEL) {
    try {
      fs.mkdirSync(DIR, { recursive: true })
      fs.appendFileSync(BOOKINGS_FILE, JSON.stringify(row) + '\n')
    } catch { /* never block a booking on record-keeping */ }
  }
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY
  if (url && key) {
    fetch(`${url}/rest/v1/flight_bookings`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row),
    }).catch(() => {})
  }
  return row
}
