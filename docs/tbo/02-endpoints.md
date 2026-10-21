# TBO Flight API - Endpoints

Source: URLs copied exactly from each method page on https://apidoc.tektravels.com/flighT/ (crawled 2026-10-21). All methods are HTTP POST, JSON body.

**Live (production) URLs: not found in docs.** The documentation only publishes the staging/test hosts below. The only production hint is GetAgencyBalance's ClientId remark "ApiIntegrationNew (Staging) / tboprod (Production)". The FAQ says the error "You are not authorized to access TBO-API" also appears "where the client is sending request for live but using staging's URL", which implies distinct live URLs that TBO provides at sign-off (Certification Step 4).

## Shared service (auth/session/balance)

| Method | Staging URL (as published) | Live URL |
|---|---|---|
| Authenticate | `http://Sharedapi.tektravels.com/SharedData.svc/rest/Authenticate` | not found in docs |
| Logout | `http://Sharedapi.tektravels.com/SharedData.svc/rest/Logout` | not found in docs |
| GetAgencyBalance | `http://Sharedapi.tektravels.com/SharedData.svc/rest/GetAgencyBalance` | not found in docs |

Project note: `https://Sharedapi.tektravels.com/SharedData.svc/rest/Authenticate` with ClientId `ApiIntegrationNew` is confirmed working on staging.

## Air service

Base: `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/`

| Method | Staging URL (as published) | Live URL |
|---|---|---|
| Search | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search` | not found in docs |
| FareRule | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareRule` | not found in docs |
| FareQuote | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote` | not found in docs |
| FareUpsell | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareUpsell` | not found in docs |
| SSR | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR` | not found in docs |
| Book | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Book` (see note) | not found in docs |
| Ticket | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket` (see note) | not found in docs |
| GetBookingDetails | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetBookingDetails` | not found in docs |
| SendChangeRequest | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SendChangeRequest` | not found in docs |
| GetChangeRequestStatus | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetChangeRequestStatus` | not found in docs |
| GetCancellationCharges | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetCancellationCharges` | not found in docs |
| ReleasePNRRequest | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/ReleasePNRRequest` | not found in docs |
| GetCalendarFare | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetCalendarFare` | not found in docs |
| UpdateCalendarFareOfDay | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/UpdateCalendarFareOfDay` | not found in docs |
| PriceRBD | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/PriceRBD` | not found in docs |
| TicketReissue (re-issuance) | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/TicketReissue` (NewReleases.aspx) | not found in docs |
| TicketReIssue (Air Amendment, post-ticket SSR) | `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/TicketReIssue` (Air Amendment.aspx; same path, different casing) | not found in docs |
| GetAirlineSectorList | `https://tboapi.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/GetAirlineSectorList` (only URL published; environment not stated) | not found in docs |

## Search vs Book host note

apivalidation.aspx, "Search & Book URL Validation": "Search and Book Url's are different so use each Url's accordingly for each method. For example refer below Url's-
Search URL: `http://api.tektravels.com/BookingEngineService_Air/AirService.svc`
Book URL: `http://api.tektravels.com/BookingEngineService_AirBook/AirService.svc`"

The individual Book.aspx and Ticket.aspx pages still show `BookingEngineService_Air`. Which methods go on the `BookingEngineService_AirBook` host (Book only? Book + Ticket + GetBookingDetails + cancellations?) is **not stated in docs** - confirm with TBO, especially for live.

## Other links

- TBO B2B portal (staging login, use B2B password): https://api.tektravels.com/
- Older doc host referenced in pages: https://api.tektravels.com/FlightAPIDocument/
- Check list xlsx header references: http://api.tektravels.com/FlightAPIDocument/apivalidation.aspx
