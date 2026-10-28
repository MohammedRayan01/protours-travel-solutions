# TBO Flight Validation page → implementation → proof

Source: https://apidoc.tektravels.com/flight/apivalidation.aspx (fetched 2026-10-28, 20 rule groups).

**Proof types**
- **STAGING** – seen in real request/response logs sent to TBO staging (`certification/`, `.data/tbo-logs/`).
- **REPLAY** – TBO-style responses fed into the real code by `scripts/tbo-flow-tests.mjs` (66 checks) because staging cannot produce them (price change, duplicate, timeout, PAN, I5, TruJet…).
- **UNIT** – `scripts/validation-tests.mjs` (42 checks) on the real validation functions.
- **BROWSER** – `scripts/browser-proof.mjs`: real Chrome, real buttons.
- **CODE ONLY** – implemented, not provable offline. Listed as such, never as "proven".

Run everything: `node scripts/validation-tests.mjs && node scripts/tbo-flow-tests.mjs`

| # | TBO rule | Where (code) | Proof | Status |
|---|---|---|---|---|
| 1a | PAN/Passport required when `IsPanRequiredAtBook/Ticket`, `IsPassportRequiredAtBook/Ticket` = true | `quote()` reads flags → saved in sealed quote; `validatePassengers()` enforces | REPLAY (flags survive in saved quote), UNIT | Done |
| 1b | Adult passes own PAN; wrong format refused | `validatePassengers` | UNIT (PAN required / wrong format / valid) | Done |
| 1c | Child/infant: parent/guardian name + PAN as `GuardianDetails{Title,FirstName,LastName,PAN}` | `validatePassengers`, `toTboPassenger` | UNIT + REPLAY (payload contains GuardianDetails; child has no own PAN) | Done |
| 1d | Age 12–17 may use own PAN | Treated as adult (12+): asks for own PAN | — | **Stricter than TBO** (a teenager without a PAN cannot book online; nothing TBO would reject is ever sent) |
| 2 | Special fares (Super 6E / SpiceMax): free meal **and** free seat in Ticket | `RequiredFieldValidators` / `ismealmandatory` / `isseatmandatory` → `buildSsr` | STAGING (real 6E UpFront ticket sent free meal + seat 4A@0) + REPLAY (3 non-infants get 3 different free seats; never "NoMeal") | Done |
| 3 | Title, first, last name mandatory; SpiceJet names distinct | `validatePassengers` (distinct names enforced for **every** airline) | UNIT | Done |
| 3 | Gender mandatory; child/infant DOB; phone mandatory | same | UNIT + REPLAY (every passenger carries Gender, ContactNo) | Done |
| 4 | LCC first passenger: address + email; AirAsia: CountryCode + CountryName | `toTboPassenger` sends them for **every** passenger | REPLAY + STAGING logs | Done. Country is fixed to India (customer address) |
| 5a | TruJet / Zoom Air: no space in last name | `noSpaceLast` = TBO Source **50** (TruJet) or airline name matches Zoom / Tru Jet | REPLAY (Source 50, "Zoom Air", "Tru Jet") + UNIT | Done. Zoom Air has no source number in TBO docs, so it is matched by name |
| 5b | AirAsia adult: DOB mandatory | International adults need DOB | UNIT | Done (domestic AirAsia adult DOB not forced) |
| 6a | International LCC: send the included **Price 0** baggage from SSR | `buildSsr(... preferIncluded)` | REPLAY (FREE20@0 sent). **Not seen on staging**: in all 5 international LCC tickets TBO offered no free baggage | Done, replay-proven only |
| 6b | I5 domestic: Price 0 baggage **and** meal | `buildSsr` when airline code I5 | REPLAY (BG15 + SNCK) | Done, replay-proven only |
| 7 | Token: re-generate on `ErrorCode 6` (by code, not message) | `search()` retries once with a fresh token; other methods → "Your session expired, please search again" (the TraceId belongs to the old token) | REPLAY (tokens tok-1 → tok-2; message wording ignored; 410 after search) | Done |
| 8 | TraceId: one per booking, 15-minute life | sealed session `exp = +15 min`; one trace per booking | REPLAY (expiry refused) + STAGING (1 token, 1 trace per booking in all logs) | Done |
| 9 | SSR: baggage for return = both objects in an array; free baggage; SSR last before Ticket | `buildSsr` (one item per sector, arrays never null); SSR re-called right before Ticket | STAGING (order SSR→Ticket in every LCC log) + REPLAY (arrays, infants none) | Done |
| 10 | Fare: Base/Tax divided by pax count from the FareBreakdown | `toTboPassenger` sends exactly TBO's 7 mandatory Fare fields + PGCharge | STAGING (115 of 115 passenger entries equal FareBreakdown ÷ count, incl. 31 multi-passenger requests) + REPLAY | Done. We no longer send invented Published/Offered per passenger |
| 11a | FareQuote `IsPriceChanged` → use the updated fare | `quote()` uses the FareQuote fare; flag shown | REPLAY (₹12,000 → ₹12,600 shown) | Done |
| 11b | Book `IsPriceChanged` → Ticket with `IsPriceChangeAccepted:true`; `IsTimeChanged` → stop | `ticket()` | REPLAY (accepts when fare not higher; refuses when higher; time change stops) | Done. We never accept a fare above what the customer paid |
| 11c | Ticket `IsPriceChanged` → call Ticket again with `IsPriceChangeAccepted:true` | `ticket()` | REPLAY | Done (same safeguard) |
| 11d | `FlightDetailChangeInfo` (Time/Baggage) → book with updated info | `quote()` passes it; page shows a notice | REPLAY | Done |
| 11e | "Cancellation charges follow the updated price" | — | — | **Not built** (cancellation is a later phase) |
| 12 | `IsGSTMandatory` → GST details on the lead passenger | `checkout` requires GST; `toTboPassenger` | REPLAY (all five GST fields on lead only) + UNIT | Done |
| 13a | SpiceJet titles: Male MR, Female MRS/MS, Child MR/MS, Infant MSTR/MR/MS | `toTboPassenger` | REPLAY (girl child → MS, girl infant → MS, boy child → MR, boy infant → MSTR) | Done. **Fixed today**: infant "Miss" was sent as-is |
| 13b | No special characters (`. , /`) in names | `validatePassengers` (letters and single spaces only) | UNIT | Done (stricter: no digits either) |
| 14 | International: passport mandatory (SpiceJet DXB/RUH/SHJ, Nepal, GDS, FlyDubai) | Passport required for **every** passenger on any international journey | UNIT | Done (stricter than TBO for infants and GDS-Nepal) |
| 15 | Duplicate booking (24 h, non-LCC) | TBO enforces; its message is shown, no second Book, no Ticket | REPLAY ("Booking is already done for the same criteria for PNR…") | Done. No client-side pre-check (TBO owns the rule) |
| 16a | Book/Ticket timeout 300 s; others 60 s | `timeoutFor()` (Search 120 s) | REPLAY | Done. **Hosting caveat**: Vercel must allow a 300 s function (plan-dependent) |
| 16b | On timeout: GetBookingDetails every 10–15 s while "booking is under process"; never rebook | `ticket()` polls every 12 s, up to 10 times, by TraceId | REPLAY (Ticket called once; 4 polls; bookingId recovered) | Done. A definite TBO error code gets one check |
| 17 | Flow LCC: Search>FareRule>FareQuote>SSR>Ticket>GetBookingDetails; Non-LCC adds Book | `flights.js` | STAGING logs (every case) + REPLAY | Done |
| 18 | Separate Search and Book URLs | `URLS.air` / `URLS.booking` (`TBO_STAGING_BOOK_URL`, `TBO_LIVE_BOOK_URL`) | REPLAY (Search → Search URL; Book/Ticket/GetBookingDetails → Book URL) | **Open question for TBO**: on staging the `…_AirBook` URL answers "Invalid Resource Requested", so staging uses the Air URL for both. Live Book URL must come from TBO |
| 19 | `IsPassportFullDetailRequiredAtBook` → PassportNo, Expiry, **IssueDate, IssueCountryCode** | `validatePassengers` + `toTboPassenger` | UNIT + REPLAY | Done |
| 20a | Date format `yyyy-MM-ddTHH:mm:ss`, time AnyTime `00:00:00` | `search()` | REPLAY (`2026-12-07T00:00:00`) | Done (only AnyTime is offered, which is on TBO's list) |
| 20b | Departure not in the past | `search()` | UNIT | Done |
| 20c | Max 9 passengers (infants included) | Page: one handler for every +/−; server: search, quote, checkout | BROWSER (1,500 random clicks, max 9, 0 violations) + UNIT + live server | Done in code; **live site shows the old form until you redeploy** |
| 20d | Origin and destination not empty | `search()` | UNIT | Done |
| 20e | Special Return: one source only | `search()` | REPLAY | Done (added today) |
| 20f | 2nd segment departure not before 1st arrival | Date order checked; exact times are known only after search | UNIT | Partly: TBO checks the times |
| — | EndUserIp = end user's IP | `withEndUserIp(clientIp(req))`; IPv4 only | REPLAY + real TBO staging (2 of 2 fresh searches accepted a real IPv4) | Done. IPv6 is never sent (TBO's column is ~15 chars; IPv6 makes Authenticate fail) |

## Not covered / honest limits
- Staging never returned: a price change, a duplicate-booking error, a timeout, a PAN-required fare, an I5 flight, a TruJet/Zoom flight, or a free baggage item. Those rows are **REPLAY-proven**, not seen live.
- Cancellation / change requests are not built.
- Hosting: 300 s functions and a fixed egress IP for TBO whitelisting are still to arrange.
