/**
 * Replays TBO-style responses (including the ones staging cannot produce: price change,
 * duplicate booking, expired token, timeouts, mandatory seat/meal, PAN, TruJet…) into the
 * REAL booking code and checks what we send back to TBO.   node scripts/tbo-flow-tests.mjs
 * No network, no files written (VERCEL=1 disables local logging/bookings).
 */
process.env.VERCEL = '1'
process.env.TBO_USERNAME = 'u'
process.env.TBO_PASSWORD = 'p'
process.env.SIGNING_SECRET = 'test-secret'
process.env.ALLOW_FAKE_PAYMENTS = 'true'
process.env.TBO_ENV = 'staging'
process.env.TBO_POLL_MS = '3'
process.env.TBO_STAGING_BOOK_URL = 'https://book.example.test/AirBook/rest'
delete process.env.RAZORPAY_KEY_ID
delete process.env.RAZORPAY_KEY_SECRET

const { search, quote, checkout, ticket } = await import('../api/_lib/flights.js')
const tbo = await import('../api/_lib/tbo.js')

let pass = 0, fail = 0
const ok = (cond, name, detail = '') => { cond ? pass++ : fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  →  ' + detail : ''}`) }
const section = (t) => console.log(`\n--- ${t} ---`)
const throws = async (fn) => { try { await fn(); return null } catch (e) { return e } }

/* ---------- fake TBO ---------- */
let calls = [], script = {}, authN = 0
const asResp = (o) => new Response(JSON.stringify(o), { status: 200 })
globalThis.fetch = async (url, opts) => {
  const method = String(url).split('/').pop()
  const body = opts?.body ? JSON.parse(opts.body) : {}
  calls.push({ method, url: String(url), body })
  if (method === 'Authenticate' && script.Authenticate) return asResp(script.Authenticate(body))
  if (method === 'Authenticate') return asResp({ Status: 1, TokenId: 'tok-' + ++authN, Member: { AgencyId: 1, MemberId: 2 } })
  const h = script[method]
  if (!h) throw new Error('unscripted TBO call: ' + method)
  const out = await h(body, calls.filter((c) => c.method === method).length)
  if (out instanceof Error) throw out
  return asResp(out)
}
const reset = (s = {}) => { calls = []; script = s }
const names = () => calls.map((c) => c.method).filter((m) => m !== 'Authenticate')
const last = (m) => [...calls].reverse().find((c) => c.method === m)
const all = (m) => calls.filter((c) => c.method === m)

/* ---------- fixtures ---------- */
const airport = (code, country = 'IN', city = code) => ({ Airport: { AirportCode: code, CityName: city, CityCode: code, Terminal: '1', CountryCode: country, AirportName: city } })
const seg = (from, to, fromC, toC, al = '6E', name = 'IndiGo', no = '950') => [[{
  Airline: { AirlineCode: al, AirlineName: name, FlightNumber: no, FareClass: 'R' }, Origin: { ...airport(from, fromC), DepTime: '2026-12-01T10:00:00' },
  Destination: { ...airport(to, toC), ArrTime: '2026-12-01T13:00:00' }, Duration: 180, GroundTime: 0, Baggage: '', CabinBaggage: '', NoOfSeatAvailable: 5,
}]]
const bd = (type, count, base, tax, yq) => ({ PassengerType: type, PassengerCount: count, BaseFare: base, Tax: tax, YQTax: yq, TransactionFee: 0, AirTransFee: 0, AdditionalTxnFeePub: 0, AdditionalTxnFeeOfrd: 0, PGCharge: 0 })
const result = (o = {}) => ({
  ResultIndex: 'OB1', Source: 6, IsLCC: true, AirlineCode: o.al || '6E', IsRefundable: true, IsGSTMandatory: false, GSTAllowed: true,
  Fare: { PublishedFare: o.pub ?? 12000, OfferedFare: 11900, Currency: 'INR', BaseFare: 8900, Tax: 2300, YQTax: 1100, OtherCharges: 0, Discount: 0 },
  FareBreakdown: [bd(1, 2, 6000, 1600, 800), bd(2, 1, 2500, 600, 300), bd(3, 1, 400, 100, 0)],
  Segments: o.segments || seg('DEL', 'DXB', 'IN', 'AE', o.al || '6E', o.name || 'IndiGo'), ...o.extra,
})
const searchResp = (r, trace = 'trace-1') => () => ({ Response: { ResponseStatus: 1, Error: { ErrorCode: 0 }, TraceId: trace, Results: [[r]] } })
const noErr = { ErrorCode: 0, ErrorMessage: '' }
const fareRule = () => ({ Response: { Error: noErr, FareRules: [] } })
const quoteResp = (r, extra = {}) => () => ({ Response: { Error: noErr, ResponseStatus: 1, IsPriceChanged: false, Results: r, ...extra } })
const pax = [
  { paxType: 1, title: 'Mr', firstName: 'Rahul', lastName: 'Sharma', dob: '1988-04-12', passportNo: 'Z4337010', passportExpiry: '2032-12-31', passportCountry: 'IN', passportIssue: '2022-04-18' },
  { paxType: 1, title: 'Mrs', firstName: 'Ayesha', lastName: 'Sharma', dob: '1991-09-23', passportNo: 'Z4337011', passportExpiry: '2032-12-31', passportCountry: 'IN', passportIssue: '2022-04-18' },
  { paxType: 2, title: 'Miss', firstName: 'Sara', lastName: 'Sharma', dob: '2019-02-08', passportNo: 'Z4337012', passportExpiry: '2032-12-31', passportCountry: 'IN', passportIssue: '2023-04-18' },
  { paxType: 3, title: 'Miss', firstName: 'Zoya', lastName: 'Sharma', dob: '2026-02-10', passportNo: 'Z4337013', passportExpiry: '2032-12-31', passportCountry: 'IN', passportIssue: '2026-03-18' },
]
const contact = { phone: '9900517604', email: 'a@b.co', address: 'Shivaji Nagar', city: 'Bengaluru' }
const date = new Date(Date.now() + 40 * 864e5).toISOString().slice(0, 10)
const S = { journeyType: 'oneway', segments: [{ from: 'DEL', to: 'DXB', date }], adults: 2, children: 1, infants: 1, cabin: 'economy' }
const ssrItem = (kind, code, price, o = {}) => ({ AirlineCode: o.al || '6E', FlightNumber: '950', WayType: 2, Code: code, Description: 2, Weight: o.w || 0, Currency: 'INR', Price: price, Origin: 'DEL', Destination: 'DXB', ...(kind === 'meal' ? { Quantity: 1, AirlineDescription: code, WayType: 1 } : {}) })
const seatItem = (code, row, price = 0, avail = 1) => ({ AirlineCode: '6E', FlightNumber: '950', Origin: 'DEL', Destination: 'DXB', Code: code, RowNo: String(row), SeatNo: code.slice(-1), SeatType: 1, Price: price, AvailablityType: avail, Currency: 'INR', SeatWayType: 2, Compartment: 1, Deck: 1, Description: 2 })

/* =====================================================  1. SEARCH  */
section('Search method / token / URLs / end-user IP')
reset({ Search: searchResp(result()) })
const s1 = await tbo.withEndUserIp('103.53.43.82', () => search(S))
const sc = last('Search')
ok(sc.body.EndUserIp === '103.53.43.82', 'EndUserIp is the visitor\'s real IP', sc.body.EndUserIp)
ok(/^\d{4}-\d\d-\d\dT00:00:00$/.test(sc.body.Segments[0].PreferredDepartureTime), 'departure sent as yyyy-MM-ddTHH:mm:ss, AnyTime 00:00:00', sc.body.Segments[0].PreferredDepartureTime)
ok(sc.body.AdultCount === '2' && sc.body.InfantCount === '1', 'passenger counts sent', `A=${sc.body.AdultCount} C=${sc.body.ChildCount} I=${sc.body.InfantCount}`)
ok(sc.url.startsWith('https://api.tektravels.com/BookingEngineService_Air/'), 'Search goes to the Search URL', sc.url)

reset({ Search: (b, n) => n === 1 ? { Response: { Error: { ErrorCode: 6, ErrorMessage: 'Invalid Token' }, ResponseStatus: 4 } } : searchResp(result())() })
const t0 = authN
await search(S)
const sr = all('Search')
ok(sr.length === 2 && sr[0].body.TokenId !== sr[1].body.TokenId, 'ErrorCode 6 on Search → fresh token, retried once', `tokens ${sr.map((c) => c.body.TokenId).join(' → ')}`)
reset({ Search: () => ({ Response: { Error: { ErrorCode: 6, ErrorMessage: 'some other wording' }, ResponseStatus: 4 } }) })
const e6 = await throws(() => search(S))
ok(e6 && all('Search').length === 2, 'ErrorCode 6 is detected by CODE (message wording ignored) and retried only once', `search calls=${all('Search').length}`)

for (const [name, fn] of [['Special Return with 2 sources', () => search({ ...S, adults: 1, children: 0, infants: 0, journeyType: 'special', returnDate: date, sources: ['6E', 'SG'] })]]) {
  const e = await throws(fn); ok(!!e && /one airline source/.test(e.message), name + ' refused', e?.message)
}
reset({ Search: searchResp(result()) })
await search({ ...S, adults: 1, children: 0, infants: 0, journeyType: 'special', returnDate: date, sources: ['6E'] })
ok(JSON.stringify(last('Search').body.Sources) === '["6E"]', 'Special Return with 1 source is sent as Sources:["6E"]')

section('End-user IP and login errors')
const req = (h, sock) => ({ headers: h, socket: { remoteAddress: sock } })
ok(tbo.clientIp(req({ 'x-forwarded-for': '103.53.43.82, 10.0.0.1' })) === '103.53.43.82', 'x-forwarded-for → first (client) IPv4')
ok(tbo.clientIp(req({}, '::ffff:49.207.132.220')) === '49.207.132.220', 'IPv4-mapped socket address is unwrapped')
ok(tbo.clientIp(req({ 'x-forwarded-for': '2402:e280:2123:12:f9e0:ad99:72ae:fff7' })) === null, 'IPv6 is NOT sent (TBO column is ~15 chars: would break Authenticate) → fallback address used')
ok(tbo.clientIp(req({}, '::1')) === null && tbo.clientIp(req({}, '127.0.0.1')) === null, 'loopback addresses are not sent')
ok(tbo.clientIp(req({ 'x-forwarded-for': '999.1.1.1' })) === null && tbo.clientIp(req({ 'x-forwarded-for': 'not an ip' })) === null, 'garbage in x-forwarded-for is ignored')
{
  const real = Object.getOwnPropertyDescriptor(globalThis, 'fetch')
  reset({ Authenticate: () => ({ Status: 2, Error: { ErrorCode: 2, ErrorMessage: "String or binary data would be truncated in table 'SharedDB.dbo.AuthenticationToken_API1', column 'IPaddress'." } }) })
  const e = await throws(() => tbo.authenticate({ force: true }))
  ok(e && !/SharedDB|truncated|column|table/i.test(e.message), 'a TBO login failure never shows TBO database text to the customer', e?.message)
}

/* =====================================================  2. QUOTE  */
section('FareQuote: price change, flight change, PAN/passport/special-fare flags, TruJet')
reset({ Search: searchResp(result({ pub: 12000 })), FareRule: fareRule, FareQuote: quoteResp(result({ pub: 12600, extra: { IsPanRequiredAtBook: true, IsPassportFullDetailRequiredAtBook: true, IsPassportRequiredAtTicket: true, RequiredFieldValidators: { IsMealRequired: true, IsSeatRequired: true } } }), { IsPriceChanged: true, FlightDetailChangeInfo: 'Time' }), SSR: () => ({ Response: { Error: noErr } }) })
const s2 = await search(S)
const q2 = await quote({ session: s2.session, resultIndexes: [s2.lists[0][0].resultIndex] })
const L = q2.legs[0]
ok(L.priceChanged === true && q2.total === 12600, 'FareQuote IsPriceChanged → customer sees the UPDATED fare', `shown total ₹${q2.total} (search said 12000)`)
ok(L.detailChange === 'Time', 'FlightDetailChangeInfo "Time" is passed to the page', L.detailChange)
ok(L.panRequired && L.passportFull && L.passportRequired && L.mealRequired === true, 'PAN / full-passport / meal flags read from FareQuote')
const sealed2 = tbo.unseal(q2.quote).legs[0]
ok(sealed2.panRequired && sealed2.passportFull && sealed2.mealRequired && sealed2.seatRequired, 'flags survive in the saved quote used for ticketing')
ok(names().join('>') === 'Search>FareRule>FareQuote>SSR', 'call order Search > FareRule > FareQuote > SSR', names().join('>'))

reset({ Search: searchResp(result({ extra: { Source: 50 } })), FareRule: fareRule, FareQuote: quoteResp(result({ extra: { Source: 50 } })), SSR: () => ({ Response: { Error: noErr } }) })
const s3 = await search(S); const q3 = await quote({ session: s3.session, resultIndexes: [s3.lists[0][0].resultIndex] })
ok(tbo.unseal(q3.quote).legs[0].noSpaceLast === true, 'TruJet (TBO Source 50) → no-space-in-last-name rule on')
reset({ Search: searchResp(result({ name: 'Zoom Air' })), FareRule: fareRule, FareQuote: quoteResp(result({ name: 'Zoom Air' })), SSR: () => ({ Response: { Error: noErr } }) })
const s3b = await search(S); const q3b = await quote({ session: s3b.session, resultIndexes: [s3b.lists[0][0].resultIndex] })
ok(tbo.unseal(q3b.quote).legs[0].noSpaceLast === true, 'Zoom Air (by airline name) → no-space rule on')
reset({ Search: searchResp(result({ name: 'Tru Jet' })), FareRule: fareRule, FareQuote: quoteResp(result({ name: 'Tru Jet' })), SSR: () => ({ Response: { Error: noErr } }) })
const s3d = await search(S); const q3d = await quote({ session: s3d.session, resultIndexes: [s3d.lists[0][0].resultIndex] })
ok(tbo.unseal(q3d.quote).legs[0].noSpaceLast === true, 'Tru Jet (written with a space) → no-space rule on')

reset({ Search: searchResp(result()), FareRule: () => ({ Response: { Error: { ErrorCode: 6, ErrorMessage: 'Invalid token' } } }), FareQuote: quoteResp(result()), SSR: () => ({ Response: { Error: noErr } }) })
const s3c = await search(S)
const e6b = await throws(() => quote({ session: s3c.session, resultIndexes: [s3c.lists[0][0].resultIndex] }))
ok(e6b && /search again/i.test(e6b.message) && e6b.status === 410, 'ErrorCode 6 after search → "please search again" (trace belongs to the old token)', e6b?.message)

/* =====================================================  3. CHECKOUT payloads  */
section('Checkout payload: fares, SSR, GST, PAN, titles, passport (what is sent to Book/Ticket)')
const fullSSR = () => ({ Response: { Error: noErr, ResponseStatus: 1,
  Baggage: [[ssrItem('bag', 'NoBaggage', 0), ssrItem('bag', 'FREE20', 0, { w: 20 }), ssrItem('bag', 'XB10', 2100, { w: 10 })]],
  MealDynamic: [[ssrItem('meal', 'NoMeal', 0), ssrItem('meal', 'VGML', 0), ssrItem('meal', 'CHKN', 450)]],
  SeatDynamic: [{ SegmentSeat: [{ RowSeats: [{ Seats: [seatItem('1A', 1), seatItem('1B', 1), seatItem('1C', 1, 300), seatItem('2A', 2, 0, 3), seatItem('2B', 2)] }] }] }] } })
const quoteFor = async (r, ssr = fullSSR, extraScript = {}, sBody = S) => {
  reset({ Search: searchResp(r), FareRule: fareRule, FareQuote: quoteResp(r), SSR: ssr, ...extraScript })
  const s = await search(sBody)
  return quote({ session: s.session, resultIndexes: [s.lists[0][0].resultIndex] })
}
const build = async (q, passengers = pax, extra = {}) => {
  const c = await checkout({ quote: q.quote, passengers, contact, choices: [], ...extra })
  return { c, payload: tbo.unseal(c.checkout).payloads[0].passengers }
}

let q = await quoteFor(result({ extra: { IsPanRequiredAtBook: true, IsGSTMandatory: true, RequiredFieldValidators: { IsMealRequired: true, IsSeatRequired: true } } }))
const gst = { number: '29AAAAA0000A1Z5', company: 'Pro Tours', address: 'Shivaji Nagar', phone: '9900517604', email: 'a@b.co' }
const withPan = pax.map((p, i) => i < 2 ? { ...p, pan: 'GSBPM2112A' } : { ...p, guardian: { title: 'Mr', firstName: 'Rahul', lastName: 'Sharma', pan: 'GSBPM2112A' } })
let { c, payload: P } = await build(q, withPan, { gst })
ok(names().slice(-1)[0] === 'SSR' && !names().includes('Ticket'), 'SSR is the last call before ticketing', names().join('>'))
const adultFare = P[0].Fare, childFare = P[2].Fare, infFare = P[3].Fare
ok(adultFare.BaseFare === 3000 && adultFare.Tax === 800 && adultFare.YQTax === 400, 'adult fare = FareBreakdown ÷ passenger count (6000/2, 1600/2, 800/2)', JSON.stringify([adultFare.BaseFare, adultFare.Tax, adultFare.YQTax]))
ok(childFare.BaseFare === 2500 && infFare.BaseFare === 400, 'child and infant use their own breakdown line (2500 and 400)')
const need = ['BaseFare', 'Tax', 'TransactionFee', 'YQTax', 'AdditionalTxnFeeOfrd', 'AdditionalTxnFeePub', 'AirTransFee']
ok(need.every((k) => k in adultFare), 'all 7 TBO-mandatory Fare fields present', need.filter((k) => !(k in adultFare)).join(',') || 'none missing')
ok(!('PublishedFare' in adultFare) && !('OfferedFare' in adultFare), 'no invented PublishedFare/OfferedFare per passenger')
ok(P[0].GSTNumber === gst.number && P[0].GSTCompanyName === 'Pro Tours' && P[0].GSTCompanyEmail && P[0].GSTCompanyContactNumber && P[0].GSTCompanyAddress, 'IsGSTMandatory → full GST details on the lead passenger')
ok(!P[1].GSTNumber, 'GST details only on the lead passenger')
ok(P[0].PAN === 'GSBPM2112A' && P[1].PAN === 'GSBPM2112A', 'adults send their own PAN')
ok(P[2].GuardianDetails?.PAN === 'GSBPM2112A' && P[3].GuardianDetails?.FirstName === 'Rahul' && !P[2].PAN, 'child/infant send GuardianDetails {Title,FirstName,LastName,PAN}')
ok(P.every((p) => p.PassportNo && p.PassportExpiry && p.PassportIssueDate && p.PassportIssueCountryCode), 'IsPassportFullDetailRequiredAtBook / international → PassportNo, Expiry, IssueDate, IssueCountryCode on every passenger')
ok(P.every((p) => p.Gender && p.ContactNo && p.Email && p.AddressLine1 && p.City && p.CountryCode && p.CountryName && p.Nationality), 'Gender, phone, email, address, city, country code/name, nationality on every passenger (LCC + AirAsia rules)')
ok(P[0].Baggage.some((b) => b.Code === 'FREE20' && b.Price === 0), 'international LCC: included Price-0 baggage (20 kg) is sent so the benefit is availed', P[0].Baggage.map((b) => b.Code + '@' + b.Price).join(','))
ok(!P[3].Baggage && !P[3].SeatDynamic, 'infant: no baggage, no seat')
ok(P[0].MealDynamic[0].Code === 'VGML' && P[0].MealDynamic[0].Price === 0, 'IsMealRequired → a free meal (never "NoMeal") is sent', P[0].MealDynamic[0].Code)
const seats = P.filter((p) => p.SeatDynamic).map((p) => p.SeatDynamic[0].Code)
ok(seats.length === 3 && new Set(seats).size === 3 && P[0].SeatDynamic[0].Price === 0, 'IsSeatRequired → one free open seat each for the 3 non-infants, all different', seats.join(','))
ok(Array.isArray(P[0].Baggage) && Array.isArray(P[0].MealDynamic), 'SSR arrays are real arrays, never null')

// SpiceJet titles
q = await quoteFor(result({ al: 'SG', name: 'SpiceJet' }))
;({ payload: P } = await build(q))
ok(P[2].Title === 'Ms' && P[3].Title === 'Ms', 'SpiceJet: child "Miss" → MS and infant "Miss" → MS (valid SG titles)', `${P[2].Title}/${P[3].Title}`)
const boy = pax.map((p, i) => i === 2 ? { ...p, title: 'Mstr', firstName: 'Ayaan' } : i === 3 ? { ...p, title: 'Mstr', firstName: 'Zayd' } : p)
;({ payload: P } = await build(q, boy))
ok(P[2].Title === 'Mr' && P[3].Title === 'Mstr', 'SpiceJet: boy child → MR, boy infant → MSTR', `${P[2].Title}/${P[3].Title}`)
q = await quoteFor(result({ al: '6E' }))
;({ payload: P } = await build(q, boy))
ok(P[2].Title === 'Mstr', 'other airlines keep Mstr/Miss')

// I5 domestic: price-0 baggage and meal
const dom = seg('DEL', 'BOM', 'IN', 'IN', 'I5', 'AirAsia India')
const domSSR = () => ({ Response: { Error: noErr, Baggage: [[ssrItem('bag', 'NoBaggage', 0, { al: 'I5' }), ssrItem('bag', 'BG15', 0, { al: 'I5', w: 15 }), ssrItem('bag', 'BG20', 900, { al: 'I5', w: 20 })]], MealDynamic: [[ssrItem('meal', 'NoMeal', 0, { al: 'I5' }), ssrItem('meal', 'SNCK', 0, { al: 'I5' })]] } })
q = await quoteFor(result({ al: 'I5', name: 'AirAsia India', segments: dom }), domSSR, {}, { ...S, segments: [{ from: 'DEL', to: 'BOM', date }], adults: 1, children: 0, infants: 0 })
;({ payload: P } = await build(q, [{ paxType: 1, title: 'Mr', firstName: 'Rahul', lastName: 'Sharma', dob: '' }]))
ok(P[0].Baggage?.[0]?.Code === 'BG15' && P[0].MealDynamic?.[0]?.Code === 'SNCK', 'AirAsia (I5) domestic: Price-0 baggage AND Price-0 meal are sent', `${P[0].Baggage?.[0]?.Code}, ${P[0].MealDynamic?.[0]?.Code}`)
ok(!('PassportNo' in P[0]) || P[0].PassportNo === '', 'domestic booking sends no passport number')

/* =====================================================  4. TICKET flows  */
section('Ticket: flow order, price change, time change, duplicate, timeout / polling, URLs')
const itin = (pub) => ({ FlightItinerary: { Fare: { PublishedFare: pub } } })
const details = (id = 777) => ({ Response: { Error: noErr, ResponseStatus: 1, FlightItinerary: { BookingId: id, PNR: 'ABC123', Status: 5, Passenger: [] } } })
const lccRun = async (ticketHandler, gbd = () => details()) => {
  const q = await quoteFor(result({ pub: 12000 }), fullSSR, {})
  const { c } = await build(q)
  const quotedBefore = calls.length
  reset({ SSR: fullSSR, Ticket: ticketHandler, GetBookingDetails: gbd })
  return ticket({ checkout: c.checkout, payment: { orderId: c.payment.orderId } })
}
let r = await lccRun(() => ({ Response: { Error: noErr, ResponseStatus: 1, Response: { PNR: 'ABC123', BookingId: 777, TicketStatus: 1 } } }))
ok(names().join('>') === 'SSR>Ticket>GetBookingDetails', 'LCC flow: SSR > Ticket > GetBookingDetails (no Book)', names().join('>'))
ok(r.results[0].pnr === 'ABC123' && !r.results[0].error, 'LCC ticketed')
ok(last('Ticket').url.startsWith('https://book.example.test/AirBook/rest'), 'Ticket/Book/GetBookingDetails use the separate Book URL; Search uses the Search URL', last('Ticket').url)
ok(!('IsPriceChangeAccepted' in last('Ticket').body), 'no IsPriceChangeAccepted unless TBO reported a price change')

r = await lccRun((b, n) => n === 1 ? { Response: { Error: noErr, Response: { IsPriceChanged: true, TicketStatus: 8, ...itin(11800) } } } : { Response: { Error: noErr, ResponseStatus: 1, Response: { PNR: 'ABC123', BookingId: 778, TicketStatus: 1 } } })
ok(all('Ticket').length === 2 && last('Ticket').body.IsPriceChangeAccepted === true, 'Ticket IsPriceChanged:true (fare NOT higher) → Ticket called again with IsPriceChangeAccepted:true', `Ticket calls=${all('Ticket').length}`)
ok(r.results[0].bookingId === 778, 'booking completes after accepting the lower/equal price')
r = await lccRun(() => ({ Response: { Error: noErr, Response: { IsPriceChanged: true, TicketStatus: 8, ...itin(13500) } } }), () => ({ Response: { Error: { ErrorCode: 28, ErrorMessage: 'x' } } }))
ok(all('Ticket').length === 1 && /raised the fare/.test(r.results[0].error), 'Ticket price HIGHER than the customer paid → NOT accepted, nothing ticketed', r.results[0].error)

// Non-LCC
const gdsRun = async (bookH, ticketH = () => ({ Response: { Error: noErr, ResponseStatus: 1, Response: { TicketStatus: 1 } } })) => {
  const gr = result({ pub: 12000, extra: { IsLCC: false, Source: 4 } })
  const q = await quoteFor(gr, () => ({ Response: { Error: noErr } }))
  const { c } = await build(q)
  reset({ Book: bookH, Ticket: ticketH, GetBookingDetails: () => details(900) })
  return ticket({ checkout: c.checkout, payment: { orderId: c.payment.orderId } })
}
const bookOk = (extra = {}, pub = 12000) => () => ({ Response: { Error: noErr, ResponseStatus: 1, Response: { PNR: 'GDS999', BookingId: 900, Status: 1, IsPriceChanged: false, IsTimeChanged: false, ...itin(pub), ...extra } } })
r = await gdsRun(bookOk())
ok(names().join('>') === 'Book>Ticket>GetBookingDetails', 'Non-LCC flow: Book > Ticket > GetBookingDetails', names().join('>'))
ok(last('Ticket').body.PNR === 'GDS999' && last('Ticket').body.BookingId === 900 && !('IsPriceChangeAccepted' in last('Ticket').body), 'Non-LCC Ticket carries PNR + BookingId')
r = await gdsRun(bookOk({ IsPriceChanged: true }, 11900))
ok(last('Ticket').body.IsPriceChangeAccepted === true, 'Book IsPriceChanged:true (not higher) → Ticket sent with IsPriceChangeAccepted:true')
r = await gdsRun(bookOk({ IsPriceChanged: true }, 14000))
ok(!names().includes('Ticket') && /raised the fare/.test(r.results[0].error), 'Book price HIGHER → no Ticket, customer told')
r = await gdsRun(bookOk({ IsTimeChanged: true }))
ok(!names().includes('Ticket') && /timing/.test(r.results[0].error), 'Book IsTimeChanged:true → no Ticket, customer told')
r = await gdsRun(() => ({ Response: { Error: { ErrorCode: 24, ErrorMessage: 'Booking is already done for the same criteria for PNR ABCDE' }, ResponseStatus: 2 } }))
ok(all('Book').length === 1 && !names().includes('Ticket') && /already done for the same criteria/.test(r.results[0].error), 'Duplicate booking error from TBO: shown to customer, no second Book, no Ticket', r.results[0].error)
ok(all('GetBookingDetails').length === 1, 'a definite TBO error is checked once with GetBookingDetails (not 10×)', `GetBookingDetails calls=${all('GetBookingDetails').length}`)

// Timeout → poll
let gbdN = 0
r = await lccRun(() => new Error('socket hang up'), () => (++gbdN < 4 ? { Response: { Error: { ErrorCode: 28, ErrorMessage: 'Your request could not be processed as booking is under process.' } } } : details(4242)))
ok(all('Ticket').length === 1, 'timeout on Ticket → NEVER rebooked (Ticket called once)', `Ticket calls=${all('Ticket').length}`)
ok(all('GetBookingDetails').length === 4 && r.results[0].bookingId === 4242, 'keeps calling GetBookingDetails while "booking is under process", until details arrive', `GetBookingDetails calls=${all('GetBookingDetails').length}, bookingId=${r.results[0].bookingId}`)
ok(!('BookingId' in all('GetBookingDetails')[0].body) && all('GetBookingDetails')[0].body.TraceId, 'polling uses the TraceId when no BookingId exists yet')

/* =====================================================  5. TIMEOUTS & misc  */
section('Timeouts and session rules')
ok(tbo.timeoutFor('Book') === 300000 && tbo.timeoutFor('Ticket') === 300000, 'Book and Ticket timeout = 300 s', tbo.timeoutFor('Ticket') / 1000 + ' s')
ok(tbo.timeoutFor('Search') >= 60000 && tbo.timeoutFor('Search') <= 120000, 'Search timeout covers international (up to 60 s+)', tbo.timeoutFor('Search') / 1000 + ' s')
ok(tbo.timeoutFor('FareQuote') === 60000 && tbo.timeoutFor('SSR') === 60000 && tbo.timeoutFor('GetBookingDetails') === 60000, 'all other methods timeout = 60 s')
const sealedOld = tbo.seal({ x: 1 }, -1000)
const eOld = await throws(() => tbo.unseal(sealedOld))
ok(eOld && /expired/.test(eOld.message) && eOld.status === 410, 'a session older than 15 minutes is refused with an expiry message', eOld?.message)
const fresh = tbo.seal({ x: 1 })
ok(tbo.unseal(fresh).exp - Date.now() <= 15 * 60 * 1000 + 1000, 'sessions are created with a 15-minute life')

console.log(`\nRESULT: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
