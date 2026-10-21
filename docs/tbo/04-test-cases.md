# TBO Flight API - Certification Test Cases

Sources: https://apidoc.tektravels.com/flighT/Certification.aspx, APIGuide.aspx, SampleVerification.aspx, FlightFAQ.aspx (Q17), sample archives in `samples/`. Crawled 2026-10-21.

## 0. Before test cases: Sample Verification (SampleVerification.aspx)

Submit **one sample case first**: **Domestic Return (2 Adult + 1 Child + 1 Infant)**. Rules checked:

1. Token and TraceId the same throughout the booking.
2. Search criteria exactly as the sample test case.
3. ResultIndex the same throughout the booking.
4. `LeadPax` (IsLeadPax) true for only one passenger.
5. `Gender`, `Title`, `AddressLine1`, `City`, `CountryCode`, `Nationality`, `CountryName` passed for all passengers.
6. Title consistent with Gender (e.g. `Mr` when Gender = 1).
7. Male infant title must be `Mstr`.
8. LCC SSR (Meal/Baggage/Seat) as array `[ { } ]`; Non-LCC SSR as object `{ }`. If SSR not required, do not pass blank nodes. Infant: only Meal.
9. DOB & passport optional for domestic LCC, mandatory for international LCC & Non-LCC (Book or Ticket). DOB of Child and Infant mandatory always.
10. Ticket request: BaseFare and Tax per pax = FareQuote FareBreakdown value / pax count.

Flow expected - LCC: Search -> FareRule -> FareQuote -> SSR (optional) -> Ticket -> GetBookingDetails. Non-LCC: Search -> FareRule -> FareQuote -> SSR (optional) -> Book -> Ticket -> GetBookingDetails.

Reference sample: `samples/AirSampleTestCase2Adult1Child1Infant.rar` (search: JourneyType 2, DEL-BOM / BOM-DEL, Sources ["6E"], 2A+1C+1I; files Search, OB/IB FareRule, OB/IB FareQuote, OB/IB Ticket, OB/IB GetBookingDetails).

## 1. Certification test cases (Certification.aspx, Step 1 - verbatim list)

"Below is the list of test cases that needs to be executed by clients at their end. JSON Request/ Response for these cases along with the pnr numbers will be required for verification as a part of the certification process. Also, please make sure that test cases should be sent to the API team Casewise rather than all test cases in a single notepad file."

**Mandatory (1-5):**

| Case | Description | Supplier type | Journey | Pax | SSR |
|---|---|---|---|---|---|
| 1 | GDS Domestic Oneway | GDS (Non-LCC) | Domestic, JourneyType 1 | 1 Adult | - |
| 2 | LCC Domestic Oneway | LCC | Domestic, JourneyType 1 | 1 Adult + 1 Child + 1 Infant | With SSR |
| 3 | LCC Domestic Return | LCC | Domestic, JourneyType 2 (OB + IB, 2 PNRs) | 2 Adults + 2 Child + 1 Infant | - |
| 4 | LCC International Oneway | LCC | International, JourneyType 1 | 1 Adult + 1 Child + 1 Infant | With SSR |
| 5 | GDS International Return | GDS (Non-LCC) | International, JourneyType 2 (single ResultIndex) | 2 Adults + 2 Child + 1 Infant | - |

**Additional cases (as per requirement):**

| Case | Description | Pax | Notes |
|---|---|---|---|
| 6 | LCC Domestic Special Return | 2 Adult + 1 Child | JourneyType 5; FareQuote with "OBx,IBx" |
| 7 | GDS Domestic Special Return SSR | 2 Adults + 2 Child + 1 Infant | JourneyType 5, Sources ["GDS"] |
| 8 | GDS Multiway | 2 Adults | JourneyType 3 |
| 9 | Domestic Oneway Air Fare Calendar | 2 Adults | GetCalendarFare then Search |
| 10 | GDS Advance Search (PriceRBD) Booking | 2 Adults | JourneyType 4 + PriceRBD |
| 11 | NDC International Oneway | 2 Adult + 2 Child | With SSR |
| 12 | NDC International Return | 2 Adult + 2 Child | - |

Conflict in docs: APIGuide.aspx step 7 says "create all the mandatory test cases [1 to 10]"; Certification.aspx says "1-5 Mandatory, Rest as per the requirement". Confirm with TBO which apply to this account (e.g. if GDS/NDC/calendar features will be offered).

Exact dates/airlines per case: **not found in docs** beyond the descriptions above. FAQ Q17 suggests sectors that return results on the test server:
- Domestic: DEL -> BOM, DEL -> BLR, BLR -> BOM
- International: DEL -> DXB, DEL -> BKK
- NDC (NewReleases.aspx): BA/LH DEL to LON (ACC-TXL & INN-PRG - SN airline for EMD in LH), SQ DEL to SIN; departure date greater than 3 months.

## 2. Required methods per case (derived from the documented flows)

The docs do not give a per-case method table; the following applies the documented LCC / Non-LCC flows and special-flow notes:

| Case | Methods to log |
|---|---|
| 1 GDS Dom OW | Authenticate, Search, FareRule, FareQuote, (SSR optional), Book, Ticket, GetBookingDetails |
| 2 LCC Dom OW + SSR | Authenticate, Search, FareRule, FareQuote, SSR, Ticket, GetBookingDetails |
| 3 LCC Dom Return | Search once; then FareRule, FareQuote, (SSR), Ticket, GetBookingDetails for OB and again for IB |
| 4 LCC Intl OW + SSR | Search, FareRule, FareQuote, SSR (free baggage Price 0 must be included), Ticket, GetBookingDetails |
| 5 GDS Intl Return | Search, FareRule, FareQuote, (SSR), Book, Ticket, GetBookingDetails (single ResultIndex) |
| 6 LCC Dom Special Return | Search (JourneyType 5), FareRule, FareQuote with "OB..,IB..", Ticket with returned OB index, GetBookingDetails |
| 7 GDS Dom Special Return SSR | Search (5), FareRule, FareQuote, SSR, Book, Ticket, GetBookingDetails |
| 8 GDS Multiway | Search (3), FareRule, FareQuote, Book, Ticket, GetBookingDetails |
| 9 Calendar | GetCalendarFare (optional UpdateCalendarFareOfDay), Search, FareRule, FareQuote, Ticket/Book+Ticket, GetBookingDetails |
| 10 Advance Search | Search (4), PriceRBD, FareRule, FareQuote, (SSR), Book, Ticket, GetBookingDetails |
| 11/12 NDC | Search, FareRule, FareQuote, (SSR), Book, Ticket, GetBookingDetails (NDC sample shows this) |

APIGuide initial verification: "Get Booking details should be called for each case."

## 3. What must be submitted

- JSON request **and** response for every method of each case, plus PNR numbers (Certification Step 1).
- Case-wise, as separate files/attachments (not one notepad file). Logs as JSON attachments (APIGuide Dos).
- The request id/subject on which the sample was verified (APIGuide step 7).
- If PNR was generated but Ticket failed due to supplier error, send those logs; it will be considered (APIGuide item 10).
- After verification, confirm implementation of all validations in the Flight API Checklist (Step 3) - see 06-validations.md.

## 4. Reference sample archives (downloaded into `samples/`)

| File | Case | Search criteria seen in sample |
|---|---|---|
| AirSampleTestCase2Adult1Child1Infant.rar | Sample verification | JT 2, DEL-BOM-DEL, 6E, 2A1C1I |
| LCCDomesticReturnSSR2Adult2Child1Infant.rar | LCC dom return SSR | JT 2, AMD-DEL-AMD, 2A2C1I |
| LCCMultiwayAdult2Adult2Child1Infant.rar | LCC multiway | JT 3, DEL-BOM, BOM-BLR, BLR-DEL, 2A2C1I |
| LCCCalendarFare2Adult2Child1Infant.rar | Calendar | JT 1, DEL-BOM, 2A2C1I |
| NONLCCDomesticSpecialReturnSSR2Adult2Child1Infant.rar | GDS dom special return | JT 5, DEL-BOM-DEL, Sources ["GDS"], 2A2C1I |
| NONLCCAdvanceSearchPriceRBD2Adult2Child1Infant.rar | Advance search | JT 4, DEL-DXB, 2A2C1I |
| NONLCCInternationalReturnSSR2Adult2Child1Infant.rar | GDS intl return SSR | JT 2, DEL-DXB-DEL, 2A2C1I |
| GSTFare2Adult2Child1Infant.rar | GST fare | JT 1, DEL-BOM, 6E, 2A2C1I |
| NDC_request_response_search_to_Book.zip | NDC | JT 1, MUC-FRA, LH, Sources ["GDS"] |
| AirArabiaNewVersionSample.zip | Air Arabia | JT 1, DEL-DOH, G9 |
| StudentFare.zip | Student fare | JT 1, DEL-CCU |
| OneWaySearch / ReturnSearch / Multicity / Advanced .rar | Search request samples | |
| SSR.rar, GetAgencyBalance.rar | Method samples | |
| SeatMapSampleAppDotNet.rar | Seat map .NET sample | |
| TBOFlightAPICheckList.rar | Validation checklist (xlsx) | |
| FlightNameValidation.rar | Name validation (xlsx) | |

Could not download (404): Authenticate.rar, CalendarFare.rar, FareQuote.rar, FareRule.rar (under /flightapidocument/doc/SampleJson/), SpecialReturn.rar.

## 5. Turnaround

- APIGuide: initial verification 24-48 working hours.
- Certification Step 2: test case verification about 4-5 working days.
