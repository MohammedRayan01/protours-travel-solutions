# TBO Flight API - Process and Rules

Source: https://apidoc.tektravels.com/flighT/ (Default.aspx, Pathway.aspx, APIGuide.aspx, Certification.aspx, SampleVerification.aspx, apivalidation.aspx, compression.aspx, mathodToPostJson.aspx, NewReleases*.aspx). Crawled 2026-10-21. Content is quoted or closely paraphrased; nothing added. Gaps are marked "not found in docs".

## 1. Overview (Default.aspx)

- "UNIVERSAL AIR API Technical Guide", Version 10.0, September 30, 2015.
- RESTful service, communicates **only in JSON**. All steps from search, re-price, seat sell, excess baggage/meal, fare rules to booking are linked by a shared transaction identifier (**TraceId**).
- Support contact: apiintegrationteam@tbo.com, +91 0124 4986150, +91 0124 4986103.
- Test environment connectivity: Spice Jet, Indigo, Go Air, Air Asia, Fly Dubai, Air India Express, GDS (Amadeus & Galileo).
- Air Arabia new version (G9, 3L, 3O, E5): "There is no dedicated test environment available." (NewReleases2024.aspx)

## 2. Pathway (Pathway.aspx)

| Method | Purpose (as documented) |
|---|---|
| Authenticate | Login into the TBO API service. |
| Search | All available itineraries of selected or all airlines. |
| FareRule | All details about the selected result index (fare rules). |
| FareQuote | Pricing according to passenger count (re-price). |
| SSR | Available amenities: seat, meal, baggage. |
| Book | Non-LCC only: pass passenger details to generate PNR (hold until last ticketing date). Money deducted only when Ticket is called. |
| Ticket | LCC: pass all passenger details, PNR + invoice generated here. Non-LCC: pass PNR details to ticket the held booking. |
| GetBookingDetails | Status of booking; always call after network error/timeout. |
| GetCancellationCharges | Exact cancellation charges after PNR generated ("as of now only for 6E, SG & G8" on Pathway page; 2025 release notes list wider support, see 03-methods.md). |
| SendChangeRequest | Raise cancellation (full/partial) or re-issuance request. |
| GetChangeRequestStatus | Status of a raised change request (Ops processing). |

### Booking flows

- **LCC:** Authenticate -> Search -> FareRule -> FareQuote -> SSR (optional) -> Ticket -> GetBookingDetails
- **Non-LCC (GDS):** Authenticate -> Search -> FareRule -> FareQuote -> SSR (optional) -> Book -> Ticket -> GetBookingDetails
- **Advance Search (GDS):** Search (JourneyType 4) -> PriceRBD (seat sell for requested fare class) -> ... (PriceRBD "to be called only for Advance Search").
- **Calendar fare:** GetCalendarFare (indicative, single adult, domestic) -> optional UpdateCalendarFareOfDay -> then normal Search flow.
- **Fare upsell:** Search -> FareUpsell -> FareQuote (same ResultIndex) -> Book/Ticket -> GetBookingDetails.
- **Re-issue:** Search (SearchType=1, Pnr, BookingId) -> FareQuote -> TicketReissue.
- **Air Amendment (post-ticket ancillary):** SSR (with BookingId) -> TicketReIssue (with SSR array).
- **Air Arabia new version with SSR selected:** must Book (hold) first, then Ticket ("Direct ticketing is not allowed with SSR"). Indicated by `IsHoldMandatoryWithSSR='true'` in FareQuote. Book returns "BookedOther" status with updated pricing to be used in the Ticket request.
- Hold for LCC: only if FareQuote returns `IsHoldAllowed: true` (FAQFareQuote.aspx).

## 3. Integration prerequisites and certification process (APIGuide.aspx)

1. Client should have appropriate test credentials.
2. Client id **ApiIntegrationNew** should be passed in API authentication request.
3. Client should have all URLs and understanding of API methods.
4. Startup meeting with API team before integration, after going through the document.
5. In between integration follow the sample verification process.
6. Correct all the changes in test cases as suggested in sample verification.
7. After correction and verification of sample, create all the mandatory test cases [1 to 10] and send to support team along with the request id/subject on which the sample was verified.
8. Support team initial verification checks:
   1. Token and Trace should be same throughout the booking process.
   2. Verification of all mandatory methods for each test case.
   3. Error message in each method for all test cases.
   4. Cases made on specific search criteria as per test cases.
   5. GetBookingDetails called for each case.
9. Takes 24 to 48 working hours; discrepancies -> cases rejected, resubmit with corrections.
10. After initial verification, support team validates all methods and gives findings; resubmit rejected cases.
11. Support team shares certification sheet of submitted cases along with validation checklist.
12. Implement all validations from the validation document at client site.

Note: APIGuide says "mandatory test cases [1 to 10]", Certification.aspx says "1-5 Mandatory, Rest as per the requirement". See 04-test-cases.md.

Credentials: "Client will get two passwords at the time of API registration, one for API which can be used for integration and another will be for TBO B2B login" (B2B portal: https://api.tektravels.com/). Use the **API password** in Authenticate.

## 4. Dos and Don'ts (APIGuide.aspx)

1. Always send API logs (request and response) in JSON format **as an attachment**.
2. Follow the integration process as provided in Pathway.
3. On session expiry or logout, call Authenticate again and pass the updated TokenId in every subsequent request.
4. TraceId is valid for **15 minutes** only.
- Certification.aspx: send test cases to the API team **case-wise**, not all in a single notepad file.

## 5. Token and Trace rules

- TokenId: returned by Authenticate, echoed in every request. "Only 1 token should be generated for all transactions." FAQ: "generate only 1 token id in a single day as it is valid from 00:00:00 AM till 11:59:59 PM and same can be used for any API's and on any server."
- Invalid token -> **ErrorCode 6**. Re-generate a token. "Always please check ErrorCode: 6 for Invalid Token rather checking the error message."
- TraceId: from Search response, passed in every following call; unique per booking. Expires after booking or after 15 minutes. Expiry message: "Your session (TraceId) is expired."
- Token and TraceId and ResultIndex must remain the same throughout one booking (SampleVerification).
- Logout kills the token forcefully.

## 6. Pricing formulas (APIGuide.aspx, verbatim)

- **Published Fare** (price agency charges end customer; agency may add markup at their end):
  `BaseFare + Tax + OtherCharges + ServiceFee + AdditionalTxnFeepub + AirlineTransFee + GST + TDS + Agency additional Markup (if applied from profile)`
- **Offered Fare** (airline price after deduction of only commission):
  `Published Fare - Commission Earned (Commission + PLB + Incentive) - TDS - Agency additional Markup (if applied from profile)`
  Note: "TDS is not the part of offered fare in search response only".
- **Net Payable** (payable to TBO by agency):
  `Published Fare - (CommissionEarned + IncentiveEarned + PLBEarned + AdditionalTxnFee) + (TdsOnCommission + TdsOnIncentive + TdsOnPLB) + GST(IGSTAmount + CGSTAmount + SGSTAmount + CessAmount)`
- Fare Validation: "Fare calculation should be done as per the provided formulas for Published Fare & Offered Fare (including GST)."
- `AdditionalTxnFeeOfrd` / `AdditionalTxnFeePub`: "It will always be zero" (Search response).
- SSR: total deducted at ticketing = Offered Fare + Excess Baggage and Meal Charges.

### Per-passenger fare in Book/Ticket

Fares in the Ticket (and Book) request must come from FareQuote response `FareBreakdown` array: divide BaseFare and Tax by passenger count of that pax type entry. Example: "If Base Fare received is 4000 and passenger count is 2 irrespective pax type then divide 4000 by 2 and then pass 2000 for each passenger in ticket request and the same process needs to be followed for the tax node."

### Payment

"Amount will be deducted from agency wallet once ticket is generated successfully. Thus there is no payment gateway implementation in API from our end, that client need to implement at their end."

## 7. Price / time change handling (apivalidation.aspx, Book.aspx, Ticket.aspx)

- `IsPriceChanged: true` in FareQuote -> pass updated price in Book and Ticket.
- `IsPriceChanged: true` in Book response -> in Ticket request send `IsPriceChangeAccepted: true` (docs spell it `ispricechangedaccepted` in one place and `IsPriceChangeAccepted` on Ticket.aspx).
- `IsPriceChanged: true` in Ticket response -> call Ticket again with `IsPriceChangeAccepted: true`.
- `IsTimeChanged` is also returned. "The price comparison is to be made at the client's end."
- `FlightDetailChangeInfo` in FareQuote (e.g. "Time", "Baggage") -> create the booking with the updated info.
- Cancellation charges follow the updated price.

## 8. SSR rules (APIGuide.aspx, SSR.aspx, SampleVerification.aspx, FAQ)

- Paid SSR (Meal/Baggage/Seat) for **LCC only**; pass in **Ticket** request, taken from SSR response.
- GDS: meal and seat free if airline provides; pass in **Book** request from SSR response. Non-LCC options are indicative only; no online confirmation.
- LCC nodes: `MealDynamic`, `SeatDynamic`, `Baggage` as **arrays** `[ { } ]`. Non-LCC: `Meal`, `Seat` as **objects** `{ }` ("string" in docs). Baggage node not available for Non-LCC.
- Baggage, Meal and Seat arrays should not be passed as null; if SSR not required, do not pass blank nodes.
- Infant: only Meal; no Baggage or Seat.
- If SSR is used, SSR must be the most recent method called before ticketing, else "invalid Meal, Baggage" errors.
- International LCC (and Fly Dubai): free baggage must be selected from SSR (the option with `Price` 0) and passed in Ticket, otherwise no free baggage. I5 domestic: pass baggage and meal with Price 0.
- Return sector baggage for one segment only: still add both inbound and outbound objects in the array.
- Special fares (Super 6E, SpiceMax): FareQuote returns `isseatmandatory: true` / `ismealmandatory: true` -> select free meal and free seat from SSR and include in Ticket.
- Indigo seat failure: if FareQuote `IsBookableIfSeatNotAvailable: true`, pass `IsAllowBookingWithoutSeat: true/false` in Book/Ticket.
- Seat map sample code (.NET): `samples/SeatMapSampleAppDotNet.rar`.

## 9. LCC vs Non-LCC

- Identify with `IsLCC` in Search result.
- LCC: no Book; Ticket directly (unless `IsHoldAllowed` / Air Arabia SSR hold rule).
- Non-LCC: must Book (hold, PNR, `LastTicketDate` in Book response) then Ticket with PNR + BookingId.
- APIGuide wording: "Book and ticket method should be called only for Non-LCC airlines. Ticket method is only called for LCC airlines."
- Domestic return: OB and IB result indexes separate; call FareQuote..Ticket twice -> 2 PNRs. International return: single result index (OB) with both journeys.
- LCC special return (JourneyType 5): FareQuote with `"ResultIndex": "OB4,IB4"` comma separated; FareQuote returns only OB index; book with it -> one PNR. Must combine same airline for OB and IB. "Multiple sources not allowed in case of SpecialReturn."

## 10. GST (APIGuide, FAQ Q15, apivalidation)

- `IsGSTMandatory: true` in FareQuote -> GST details must be passed for the **lead passenger** in Book/Ticket, else error/failure.
- `GSTAllowed: true` and `IsGSTMandatory: false` -> GST optional.
- Exact GST field names: see Book/Ticket request tables in 03-methods.md.

## 11. Passport / PAN rules (apivalidation.aspx, APIGuide, SampleVerification)

- Passport details mandatory in Book/Ticket for international journeys. DOB and passport optional for domestic LCC; mandatory for international LCC and Non-LCC (can be in Book or Ticket). DOB of Child and Infant mandatory in all cases.
- FareQuote flags: `IsPanRequiredAtTicket`, `IsPanRequiredAtBook`, `IsPassportRequiredAtTicket`, `IsPassportRequiredAtBook`. If true, mandatory. If false but provided, it must be correct or booking fails.
- `IsPassportFullDetailRequiredAtBook: true` -> pass `PassportNo`, `PassportExpiry`, `PassportIssueDate`, `PassportIssueCountryCode`. (Docs then repeat the sentence with `false` -> `PassportNo`, `PassportExpiry` only.)
- Name must match PAN/passport. Adult 18+: guardian PAN not accepted (contact ops for offline booking). Age 12-18: pax's own PAN/passport considered if given. Child/Infant: pass parent/guardian PAN/passport and name via `GuardianDetails` (`Title`, `FirstName`, `LastName`, `PAN`).
- Air India international: always pass valid passport details in Book (test and live).
- Destination rules: SpiceJet to Dubai, Riyadh, Sharjah -> passport for all pax. LCC (SpiceJet, Indigo; except Bhutan Airlines) to Nepal -> passport for adult and child. GDS -> passport for adult and child (except Nepal). FlyDubai -> all pax. NDC -> passport full details at Book.
- Transit visa: `IsTransitVisaRequired: true` in Search response.

## 12. Duplicate booking

- apivalidation.aspx: not allowed within **24 hours** (Non-LCC) even if first booking cancelled/released. Criteria: same Sector / Journey Dates / Airline / FlightNo / Passengers. Error: "Booking is already done for the same criteria for PNR".
- FAQ Q18: "You cannot make a duplicate booking within next 5 days of original Booking." (Conflicts with the 24-hour rule; confirm with TBO.)

## 13. Timeouts (apivalidation.aspx)

- Search domestic: 75% within 5s, 95% within 10s, rest within 30s. International: 75% within 10s, 95% within 30s, rest 60+s.
- Book/Ticket: 30-60s typical, up to 300s. **Set 300s timeout.** On timeout do not rebook: call GetBookingDetails; if "Your request could not be processed as booking under process." keep polling every 10-15 seconds.
- Other methods: 5-10s, up to 60s. Set 60s timeout.

## 14. Search validation (apivalidation.aspx)

- Date format `yyyy-MM-ddTHH:mm:ss`; departure not before today.
- Time slots: AnyTime `00:00:00`, Morning `08:00:00`, AfterNoon `14:00:00`, Evening `19:00:00`, Night `01:00:00`.
- Max 9 passengers total. Origin/Destination not null. No multiple sources in SpecialReturn. 2nd segment departure not before 1st segment arrival.
- `AutoTicketingOnly: true` in Search returns only airlines that allow auto ticketing (FAQ Q20).
- Times are local; elapsed duration needs time zone adjustment at client side (Search.aspx example: Dubai +1h30).

## 15. Transport

- gzip: send `Accept-Encoding: gzip, deflate`; if response has `Content-Encoding: gzip`, decompress. Do not decompress non-gzip responses.
- POST with `Content-Type: application/json`. On 400 Bad Request read the response body of the error.

## 16. Other implementations noted in release pages

- Student / Armed Force / Senior Citizen fares: `ResultFareType` 2 Regular, 3 Student, 4 Armed Force, 5 Senior Citizen. StudentId mandatory for SG (FAQ: student mandatory for 6E and SG); Senior Citizen IDs mandatory for Indigo; Akasa only Armed Force. Sample: `samples/StudentFare.zip`.
- Corporate codes: `CorporateCodes` array (PCC + AirlineKeys[Airline, CorporateCode]) in Search; also `IsBaseCurrencyRequired`, `PreferredCurrency`.
- Fare type identification: `AirlineRemark` node; description from sales person (FAQ Q2).
- `FirstNameFormat` / `LastNameFormat` in FareQuote tell how to pass single-character/missing names.
- International `SearchCombinationType`: 1 open combination, 2 fixed combination.
- NDC airlines (British Airways, Lufthansa, Singapore, Saudia, Oman Air, Emirates, Etihad): EmailId mandatory; passport full details at Book; no dot in names; `CellCountryCode` mandatory in Book; title list; online cancellation incl. infant; import not supported; SSR charges non-refundable; test search BA/LH DEL-LON, SQ DEL-SIN, departure > 3 months out. Sample: `samples/NDC_request_response_search_to_Book.zip`.
- Online cancellation (2025): GDS, NDC (EK, LH, WY, EY, GF, AI, Amadeus NDC), LCC (6E, IX, SG, FZ, QP). For GDS and NDC "it is mandatory to call the Cancellation Charges method before sending any cancellation request." Some cases go to OPS manually (medical, checked-in, partial, split PNR).
- Pre/post ancillary via Air Amendment now for GDS, NDC and LCC (list in 03-methods.md).
- NewReleases2026.aspx: page contains only the heading "Important Implementations" (no content found).
