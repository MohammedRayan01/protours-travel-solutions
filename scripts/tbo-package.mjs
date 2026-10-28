/**
 * Builds the TBO certification submission from certification/case-* results:
 *
 *   certification/TBO-Certification-Package/
 *     00-SUMMARY.md / 00-SUMMARY.csv      every case, PNRs, BookingIds, TraceIds, status
 *     01-EMAIL-TO-TBO.txt                 ready-to-send cover email
 *     Case-<n> - <scenario>/NN-Method-Request.json / -Response.json  (in call order)
 *     All-API-Logs/<TraceId>/...          every raw request/response logged on staging
 *   certification/TBO-Certification-Package.zip
 *
 *   node scripts/tbo-package.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve('certification')
const OUT = path.join(ROOT, 'TBO-Certification-Package')
const RAW = path.resolve('.data', 'tbo-logs')

fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })

const order = (id) => (id === 'S' ? 0 : Number(id))
// SKIP=10 leaves out cases whose newest successful run predates the latest code.
const SKIP = new Set(String(process.env.SKIP || '').split(',').filter(Boolean))
const cases = fs.readdirSync(ROOT)
  .filter((d) => d.startsWith('case-') && !SKIP.has(d.slice(5)) && fs.existsSync(path.join(ROOT, d, 'result.json')))
  .map((d) => JSON.parse(fs.readFileSync(path.join(ROOT, d, 'result.json'), 'utf8')))
  .sort((a, b) => order(a.case) - order(b.case))

const safe = (s) => s.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, ' ').trim()
const label = (id) => (id === 'S' ? 'Sample Case' : `Case ${id}`)

for (const r of cases) {
  const dir = path.join(OUT, safe(`${label(r.case)} - ${r.title}`))
  fs.mkdirSync(dir, { recursive: true })
  const logRoot = path.join(ROOT, `case-${r.case}`, 'logs')
  // Only the successful trace (plus calendar traces) goes in the case folder; every attempt is in All-API-Logs.
  const traces = fs.existsSync(logRoot) ? fs.readdirSync(logRoot) : []
  const keep = traces.filter((t) => t === r.traceId || (fs.readdirSync(path.join(logRoot, t)).some((f) => f.includes('GetCalendarFare'))))
  const files = keep.flatMap((t) => fs.readdirSync(path.join(logRoot, t)).map((f) => ({ t, f })))
    .sort((a, b) => a.f.localeCompare(b.f))
  // Authenticate first, then the rest in call order.
  files.sort((a, b) => (b.f.includes('Authenticate') - a.f.includes('Authenticate')) || a.f.localeCompare(b.f))
  let n = 0
  const seen = new Set()
  for (const { t, f } of files) {
    const m = f.match(/-\d+-(\w+)-(request|response)\.json$/)
    if (!m) continue
    if (m[1] === 'Authenticate' && seen.has(f.slice(-40))) continue
    seen.add(f.slice(-40))
    const num = m[2] === 'request' ? String(++n).padStart(2, '0') : String(n).padStart(2, '0')
    fs.copyFileSync(path.join(logRoot, t, f), path.join(dir, `${num}-${m[1]}-${m[2] === 'request' ? 'Request' : 'Response'}.json`))
  }
  fs.writeFileSync(path.join(dir, 'RESULT.json'), JSON.stringify(r, null, 2))
}

// Every raw log from staging, untouched (the API team asked for the complete log files).
if (fs.existsSync(RAW)) fs.cpSync(RAW, path.join(OUT, 'All-API-Logs'), { recursive: true })

const row = (r) => {
  const legs = r.legs || []
  return {
    case: label(r.case),
    scenario: r.title,
    result: r.ok ? 'Ticketed' : legs.some((l) => l.pnr) ? 'PNR created, ticket failed at supplier' : 'Not completed',
    sector: r.sector || '',
    traceId: r.traceId || '',
    pnr: legs.map((l) => l.pnr || '-').join(' + '),
    bookingId: legs.map((l) => l.bookingId || '-').join(' + '),
    run: fs.statSync(path.join(ROOT, `case-${r.case}`, 'result.json')).mtime.toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
    note: legs.map((l) => l.error).filter(Boolean).join('; '),
  }
}
const rows = cases.map(row)
const md = [
  '# Pro Tours & Travel Solutions — TBO Air API certification test cases',
  '',
  `Environment: TBO staging · Agency: ProTours (AgencyId 58561) · ClientId: ApiIntegrationNew · Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`,
  '',
  '| Case | Scenario | Result | Sector | TraceId | PNR | BookingId | Run at | Note |',
  '|---|---|---|---|---|---|---|---|---|',
  ...rows.map((x) => `| ${x.case} | ${x.scenario} | ${x.result} | ${x.sector} | ${x.traceId} | ${x.pnr} | ${x.bookingId} | ${x.run} | ${x.note} |`),
  '',
  'Each case folder holds the JSON request and response of every method in call order',
  '(Authenticate → Search → [PriceRBD] → FareRule → FareQuote → SSR → [Book] → Ticket → GetBookingDetails).',
  'One TokenId and one TraceId are used throughout each booking. GetBookingDetails is called for every case.',
  '`All-API-Logs/` contains every request/response sent to staging, grouped by TraceId, including retried attempts.',
  '',
].join('\n')
fs.writeFileSync(path.join(OUT, '00-SUMMARY.md'), md)
const csv = [['Case', 'Scenario', 'Result', 'Sector', 'TraceId', 'PNR', 'BookingId', 'Run at', 'Note'], ...rows.map((x) => Object.values(x))]
  .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n')
fs.writeFileSync(path.join(OUT, '00-SUMMARY.csv'), '\ufeff' + csv)

const email = `To: apiintegrationteam@tbo.com
Subject: Certification test cases – Pro Tours & Travel Solutions (ProTours, AgencyId 58561)

Dear TBO API Integration Team,

Please find attached our Air API certification test cases from the staging environment
(login ProTours, AgencyId 58561, ClientId ApiIntegrationNew).

Sample case: Domestic Return (2 Adult + 1 Child + 1 Infant) — PNR ${rows.find((x) => x.case === 'Sample Case')?.pnr || '-'}
Sample verification request id / subject: <<ADD THE REQUEST ID OR EMAIL SUBJECT IF TBO GAVE ONE>>

${rows.map((x) => `${x.case}: ${x.scenario}\n   Result: ${x.result} | PNR: ${x.pnr} | BookingId: ${x.bookingId} | TraceId: ${x.traceId}${x.note ? `\n   Note: ${x.note}` : ''}`).join('\n')}

Each case is a separate folder with the JSON request and response of every method in call
order. The same TokenId and TraceId are used through each booking, and GetBookingDetails is
called for every case. The folder All-API-Logs has the complete request/response logs.
${rows.some((x) => x.result === 'Not completed') ? `For ${rows.filter((x) => x.result === 'Not completed').map((x) => x.case).join(', ')}, staging returned "No Result Found" on every
sector and date we tried (see All-API-Logs). Please suggest a sector/date with inventory and we
will complete it immediately.` : ''}

Kindly verify and share the certification sheet and validation checklist. Please also let us
know the next steps for live credentials and the IP whitelisting requirement.

Regards,
Abdul Mannan Sajid
Proprietor, Pro Tours & Travel Solutions
21/1, G-2 Plain Street, A.M. Plaza, Hospital Road, Shivaji Nagar, Bengaluru 560001
+91 99005 17604 · protours@protours.co.in
`
fs.writeFileSync(path.join(OUT, '01-EMAIL-TO-TBO.txt'), email)

const zip = path.join(ROOT, 'TBO-Certification-Package.zip')
fs.rmSync(zip, { force: true })
// Windows 10+ ships bsdtar, which writes .zip with -a.
execFileSync(process.platform === 'win32' ? 'C:\\Windows\\System32\\tar.exe' : 'zip', process.platform === 'win32' ? ['-a', '-cf', zip, '-C', ROOT, 'TBO-Certification-Package'] : ['-qr', zip, 'TBO-Certification-Package'], { cwd: ROOT })
console.log(md)
console.log(`Package: ${OUT}\nZip:     ${zip} (${(fs.statSync(zip).size / 1e6).toFixed(1)} MB)`)
