/**
 * Runs the website's real validation code (api/_lib/flights.js) against TBO's rules.
 *   node scripts/validation-tests.mjs
 * Search tests stop at validation (no network). Exits 1 if any test fails.
 */
process.env.TBO_USERNAME ||= 'x'
process.env.TBO_PASSWORD ||= 'x'
process.env.SIGNING_SECRET ||= 'test'
const { search, validatePassengers } = await import('../api/_lib/flights.js')

let pass = 0, fail = 0
const iso = (d) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10)
const show = (ok, name, detail) => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  →  ' + detail : ''}`) }
const rejects = async (name, fn, expect) => {
  try { await fn(); show(false, name, 'was ACCEPTED') } catch (e) { show(!expect || e.message.includes(expect), name, e.message) }
}
const accepts = async (name, fn) => { try { await fn(); show(true, name) } catch (e) { show(false, name, 'was REJECTED: ' + e.message) } }

const base = { journeyType: 'oneway', segments: [{ from: 'BLR', to: 'DEL', date: iso(20) }], cabin: 'economy', adults: 1, children: 0, infants: 0 }
console.log('--- SEARCH METHOD VALIDATION (TBO) ---')
await rejects('10 travellers (9A+1C)', () => search({ ...base, adults: 9, children: 1 }), 'at most 9'.length ? 'Up to 9' : '')
await rejects('18 travellers (9A+9I)', () => search({ ...base, adults: 9, infants: 9 }), 'Up to 9')
await rejects('9 adults + 1 infant = 10', () => search({ ...base, adults: 9, infants: 1 }), 'Up to 9')
await rejects('no adult (0A+1C)', () => search({ ...base, adults: 0, children: 1 }), 'at least one adult')
await rejects('infants > adults', () => search({ ...base, adults: 1, infants: 2 }), 'infant')
await rejects('departure date in the past', () => search({ ...base, segments: [{ from: 'BLR', to: 'DEL', date: iso(-2) }] }), 'past')
await rejects('origin = destination', () => search({ ...base, segments: [{ from: 'BLR', to: 'BLR', date: iso(20) }] }), 'different')
await rejects('origin missing', () => search({ ...base, segments: [{ from: '', to: 'DEL', date: iso(20) }] }), 'airports')
await rejects('bad date format', () => search({ ...base, segments: [{ from: 'BLR', to: 'DEL', date: '25/11/2026' }] }), 'date')
await rejects('return date missing', () => search({ ...base, journeyType: 'return' }), 'return date')
await rejects('multi-city 2nd flight before 1st', () => search({ ...base, journeyType: 'multicity', segments: [{ from: 'BLR', to: 'DEL', date: iso(20) }, { from: 'DEL', to: 'BOM', date: iso(10) }] }), 'on or after')
await rejects('segments not a list', () => search({ ...base, segments: 'x' }), 'flying')

console.log('\n--- PASSENGER VALIDATION (TBO name / DOB / contact / passport / PAN rules) ---')
const leg = (o = {}) => ({ panRequired: false, passportAtBook: false, passportAtTicket: false, passportFull: false, airlineCode: '6E', depDate: iso(30) + 'T10:00:00', lastDepDate: iso(30) + 'T10:00:00', ...o })
const Q = (pax, o = {}, legs = [leg()]) => ({ pax: { adults: 1, children: 0, infants: 0, ...pax }, international: false, legs, ...o })
const C = { phone: '9900517604', email: 'a@b.co' }
const A = (o = {}) => ({ paxType: 1, title: 'Mr', firstName: 'Rahul', lastName: 'Sharma', dob: '', ...o })
const run = (list, q, c = C) => validatePassengers(list, q, c)

await accepts('valid domestic adult', () => run([A()], Q({})))
await rejects('first name with a dot', () => run([A({ firstName: 'Mohd.' })], Q({})), 'letters')
await rejects('last name with a comma', () => run([A({ lastName: 'Kumar,' })], Q({})), 'letters')
await rejects('name with digits', () => run([A({ firstName: 'Rahul2' })], Q({})), 'letters')
await rejects('last name 1 letter', () => run([A({ lastName: 'K' })], Q({})), 'at least 2')
await rejects('first name over 32 letters', () => run([A({ firstName: 'A'.repeat(33) })], Q({})), '32')
await rejects('title not allowed for adult (Mstr)', () => run([A({ title: 'Mstr' })], Q({})), 'title')
await rejects('two passengers, same name', () => run([A(), A({ title: 'Mrs' })], Q({ adults: 2 })), 'same name')
await rejects('invalid phone', () => run([A()], Q({}), { phone: '12345', email: 'a@b.co' }), '10-digit')
await rejects('invalid email', () => run([A()], Q({}), { phone: '9900517604', email: 'nope' }), 'email')
await rejects('passenger count does not match search', () => run([A()], Q({ adults: 2 })), 'does not match')
await rejects('10 passenger entries', () => run(Array.from({ length: 10 }, (_, i) => A({ firstName: 'Ab' + 'c'.repeat(i) })), Q({ adults: 9 })), 'at most 9')
await rejects('child without date of birth', () => run([A(), A({ paxType: 2, title: 'Mstr', firstName: 'Ayaan' })], Q({ children: 1 })), 'date of birth')
await rejects('"child" aged 13', () => run([A(), A({ paxType: 2, title: 'Mstr', firstName: 'Ayaan', dob: iso(-365 * 13 - 60) })], Q({ children: 1 })), 'children must be')
await rejects('"infant" aged 3', () => run([A(), A({ paxType: 3, title: 'Miss', firstName: 'Zara', dob: iso(-365 * 3 - 60) })], Q({ infants: 1 })), 'infants must be')
await accepts('child aged 6 + infant aged 1', () => run([A(), A({ paxType: 2, title: 'Mstr', firstName: 'Ayaan', dob: iso(-365 * 6) }), A({ paxType: 3, title: 'Miss', firstName: 'Zara', dob: iso(-365) })], Q({ children: 1, infants: 1 })))
await rejects('TruJet/Zoom Air: space in last name', () => run([A({ lastName: 'Van Der' })], Q({}, {}, [leg({ noSpaceLast: true })])), 'spaces')
await accepts('other airline: space in last name is allowed', () => run([A({ lastName: 'Van Der' })], Q({})))

const intl = { international: true }
const P = (o = {}) => A({ dob: '1990-01-15', passportNo: 'Z4337010', passportExpiry: '2032-12-31', passportCountry: 'IN', passportIssue: '2022-04-18', ...o })
await accepts('international adult with passport', () => run([P()], Q({}, intl)))
await rejects('international: no passport number', () => run([P({ passportNo: '' })], Q({}, intl)), 'passport number')
await rejects('international: passport expires before travel', () => run([P({ passportExpiry: iso(5) })], Q({}, intl)), 'expires before')
await rejects('international: no date of birth', () => run([P({ dob: '' })], Q({}, intl)), 'date of birth')
await rejects('passport issue date before birth', () => run([P({ passportIssue: '1980-01-01' })], Q({}, intl)), 'issue date')
await rejects('full passport details needed, issue date missing', () => run([P({ passportIssue: '' })], Q({}, intl, [leg({ passportFull: true })])), 'issue date')
await rejects('domestic fare needing passport, none given', () => run([A()], Q({}, {}, [leg({ passportAtBook: true })])), 'passport')

const pan = { panRequired: true }
await rejects('PAN required, adult gives none', () => run([A()], Q({}, {}, [leg(pan)])), 'PAN is required')
await rejects('PAN wrong format', () => run([A({ pan: 'ABC123' })], Q({}, {}, [leg(pan)])), 'PAN format')
await accepts('PAN required, adult gives valid PAN', () => run([A({ pan: 'GSBPM2112A' })], Q({}, {}, [leg(pan)])))
const kid = { paxType: 2, title: 'Mstr', firstName: 'Ayaan', dob: iso(-365 * 6) }
await rejects('PAN required, child has no guardian PAN', () => run([A({ pan: 'GSBPM2112A' }), A(kid)], Q({ children: 1 }, {}, [leg(pan)])), 'guardian')
const out = run([A({ pan: 'GSBPM2112A' }), A({ ...kid, guardian: { title: 'Mr', firstName: 'Ankit', lastName: 'Mehta', pan: 'GSBPM2112A' } })], Q({ children: 1 }, {}, [leg(pan)]))
show(out[1].guardian?.PAN === 'GSBPM2112A' && out[1].guardian.FirstName === 'Ankit', 'child gets GuardianDetails {Title,FirstName,LastName,PAN}', JSON.stringify(out[1].guardian))

console.log(`\nRESULT: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
