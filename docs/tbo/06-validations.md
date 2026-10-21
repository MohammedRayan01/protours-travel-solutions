# TBO Flight API - Validations, Statuses and Error Codes

Sources: https://apidoc.tektravels.com/flighT/apivalidation.aspx, SampleVerification.aspx, FlightFAQ.aspx (Q14), NewReleases*.aspx, `samples/FlightNameValidation.rar` (FlightNameValidation.xlsx), `samples/TBOFlightAPICheckList.rar` (TBO Flight API Check List.xlsx). Crawled 2026-10-21.

Note: there is no separate "Name Validations" or "Ticket Status" HTML page (`NameValidation.aspx` and `Ticket_Status.aspx` return 404). Name validation is the xlsx download; ticket status meanings are in FAQ Q14.

## 1. Name validation (FlightNameValidation.xlsx, transcribed)

| Field | Length | NDC Allowed | NDC Not allowed | Bhutan, AirCosta, Trujet, ZoomAir Allowed | ... Not allowed | SpiceJet Allowed | SpiceJet Not allowed | Jazeera & AirArabia Allowed | ... Not allowed | Rest of airlines/sources Allowed | ... Not allowed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| First Name | Min 1, Max 32 | A to Z | | A to Z, Space, Dot (.) | Start with dot (.) | A to Z, Space, Dot (.) | Start with dot (.) | A to Z, Space, Dot (.) | Start with dot (.) | A to Z, Space, Dot (.) | Start with dot (.) |
| Last Name | Min 2, Max 32 | A to Z | Title with dot (.) like Mr. Ms. etc. | A to Z | Title with dot (.) like Mr. Ms. etc. | A to Z, Space, Dot (.) | Titles; start with dot (.) | Title, A to Z, Dot (.) | Start with dot (.) | A to Z, Space, Dot (.) | Titles; start with dot (.) |
| Full Name (First + Last) | | | | | | | Duplicate Name | | | | |

Title, all sources: "Mr", "Mstr", "Mrs", "Ms", "Miss", "Master", "DR", "CHD", "MST", "PROF", "Inf".
TrueJet: Adult - "MR", "MRS", "MS"; Child - "MISS", "MSTR".

Additional name rules from apivalidation.aspx / release notes:
- Title, First Name, Last Name mandatory. SpiceJet: passenger name (First + Last) must be distinct.
- Navitaire 4X (SG) titles: Male MR; Female MRS, MS; Child MR, MS; Infant MSTR, MR, MS.
- No special characters like `. , /` in first/middle/last name (example of bad input: "Mr Pushaan .. Grover..").
- Tru Jet or Zoom Air: no space in last name.
- NDC: dot not allowed in FirstName and LastName.
- Missing/single-character last name: follow FareQuote `FirstNameFormat` / `LastNameFormat` (e.g. "If LastName is missing, Update LastName and FirstName as FirstName.").
- Title must match Gender (Gender: 1 Male, 2 Female). Male infant title `Mstr`.

## 2. Passenger detail validation (LCC and Non-LCC)

- Gender mandatory. DOB of Child and Infant mandatory. Phone number mandatory in all journeys.
- Only one passenger with `IsLeadPax: true`.
- Gender, Title, AddressLine1, City, CountryCode, Nationality, CountryName for all passengers (SampleVerification).
- LCC first passenger: Address and Email mandatory. AirAsia: CountryCode and CountryName mandatory.
- AirAsia international adult: DOB mandatory.
- NDC: EmailId mandatory; `CellCountryCode` mandatory in Book; passport full details at Book.
- Max 9 passengers per booking (adults + children + infants).
- PaxType: 1 Adult, 2 Child, 3 Infant. Date format `yyyy-MM-ddTHH:mm:ss`.

## 3. Passport, PAN, GST

See 01-process-and-rules.md sections 10-11. Key nodes in FareQuote: `IsGSTMandatory`, `GSTAllowed`, `IsPanRequiredAtBook`, `IsPanRequiredAtTicket`, `IsPassportRequiredAtBook`, `IsPassportRequiredAtTicket`, `IsPassportFullDetailRequiredAtBook`, `isseatmandatory`, `ismealmandatory`, `IsHoldAllowed`, `IsHoldMandatoryWithSSR`, `IsBookableIfSeatNotAvailable`, `FlightDetailChangeInfo`, `FirstNameFormat`, `LastNameFormat`. FAQFareQuote: "All validation comes in fare quote response ... If any of this node come true than pass in book/ticket request to avoid failure." `GuardianDetails` {Title, FirstName, LastName, PAN} for child/infant.

## 4. Search validation (error conditions)

- Invalid Date Format: follow `yyyy-MM-ddTHH:mm:ss`.
- Departure date cannot be less than today.
- Invalid departure time in 1st segment: use AnyTime `00:00:00`, Morning `08:00:00`, AfterNoon `14:00:00`, Evening `19:00:00`, Night `01:00:00`.
- Total passengers cannot exceed 9.
- Origin and Destination must not be null.
- Multiple sources not allowed in SpecialReturn.
- 2nd segment departure cannot be before 1st segment arrival.

## 5. Ticket status meanings (FAQ Q14, verbatim)

| Value | Name | Meaning |
|---|---|---|
| 0 | Failed | Booking has not been made and failed due to any reason; call GetBookingDetails to verify the exact status. |
| 1 | Successful | Ticket created successfully. |
| 2 | NotSaved | Ticket not saved; call operation team and call GetBookingDetails to verify. |
| 3 | NotCreated | Ticket not created; call operation team and call GetBookingDetails to verify. |
| 4 | NotAllowed | Error from supplier end; contact TBO. |
| 5 | InProgress | Ticket in progress; call GetBookingDetails to verify. |
| 6 | TicketeAlreadyCreated | Ticket already created with same PNR. |
| 8 | PriceChanged | `IsPriceChanged: true` received in Book/Ticket response; send same request again with updated price. |
| 9 | OtherError | Send request and response logs to TBO. |

(Value 7 not listed in docs.) Other booking statuses mentioned: "BookedOther" (Air Arabia hold with SSR), original booking status "reissued" after re-issue. Full BookingStatus enum: see Book/Ticket/GetBookingDetails response tables in 03-methods.md.

## 6. Other enums referenced across methods

- ResponseStatus: NotSet 0, Successfull 1, Failed 2, InValidRequest 3, InValidSession 4, InValidCredentials 5.
- Authenticate Status: NotSet 0, Successful 1, Failed 2, InCorrectUserName 3, InCorrectPassword 4, PasswordExpired 5.
- SendChangeRequest RequestType: NotSet 0, FullCancellation 1, PartialCancellation 2, Reissuance 3. CancellationType: NotSet 0, NoShow 1, FlightCancelled 2, Others 3.
- ChangeRequestStatus: NotSet 0, Unassigned 1, Assigned 2, Acknowledged 3, Completed 4, Rejected 5, Closed 6, Pending 7, Other 8.
- JourneyType: 1 OneWay, 2 Return, 3 Multi Stop, 4 AdvanceSearch, 5 Special Return.
- FlightCabinClass: 1 All, 2 Economy, 3 PremiumEconomy, 4 Business, 5 PremiumBusiness, 6 First.
- ResultFareType: 2 RegularFare, 3 StudentFare, 4 Armed Force, 5 Senior Citizen.
- SearchType (re-issue): 0 Normal, 1 Re-issue, 2 Reissue with creditshell.
- AgencyType: NotSet 0, Cash 1, Credit 2.
- GetCancellationCharges BookingMode: API = 5.

## 7. Error codes and messages found in docs

A complete error-code table is **not found in docs**. Documented ones:

| Code / message | Meaning / action |
|---|---|
| ErrorCode 6 | Invalid Token - regenerate token; check the code not the text. |
| ErrorCode 0 | No error (ErrorMessage blank). |
| "Your session (TraceId) is expired." | TraceId older than 15 minutes or already used for a booking; restart from Search. |
| "You are not authorized to access TBO-API" | Request from non-whitelisted IP, or live credentials used against staging URL (FAQAuthenticate Q1). |
| "Booking is already done for the same criteria for PNR" | Duplicate booking rule. |
| "Your request could not be processed as booking under process." | GetBookingDetails during in-flight Book/Ticket; poll every 10-15 s. |
| "Direct ticketing is not allowed with SSR. Please hold the booking first, then proceed with ticketing." | Air Arabia new version with SSR; Book first. |
| Invalid Meal, Baggage etc. | SSR was not the last method called before ticketing. |
| HTTP 400 Bad Request | Read the error response body (mathodToPostJson.aspx). |

## 8. TBO Flight API Check List (xlsx) - items to confirm Accepted/Rejected

Header references http://api.tektravels.com/FlightAPIDocument/apivalidation.aspx. Items:

1. Validation Of LCC & Non LCC Flights
2. Additional Validation for LCC Flights
3. Validation Of LCC International Flights
4. Baggage Validation for International LCC Flights
5. Token ID & Trace ID Validation
6. SSR Validation For All Cases
7. Fare Validation
8. Price and Cancellation Change Validation
9. GST Validation
10. Pax Details Validation
11. International Booking Validation
12. Duplicate Booking Validation
13. Timeout Validation
14. Flow Of LCC & Non LCC Booking
15. Search & Book URL Validation
16. Passport Validation
17. Search Method Validation

(The sheet also contains stray example values "Yes / No / NA" in column Y.) Each item corresponds to a section of apivalidation.aspx summarized in 01-process-and-rules.md.
