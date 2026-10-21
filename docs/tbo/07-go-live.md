# TBO Flight API - Go Live

Sources: https://apidoc.tektravels.com/flighT/Certification.aspx, APIGuide.aspx, Authentication.aspx, getagencybalance.aspx, FAQAuthenticate.aspx. Crawled 2026-10-21.

## 1. What the docs say

1. **Sample verification** - submit one sample (Domestic Return 2A+1C+1I), fix everything the API team flags (SampleVerification.aspx).
2. **Step 1 - Test cases execution** - cases 1-5 mandatory, 6-12 as per requirement (APIGuide says 1-10). JSON request/response + PNRs, sent case-wise. See 04-test-cases.md.
3. **Step 2 - Test cases verification** - TBO verifies JSON logs; ~4-5 working days (APIGuide: initial verification 24-48 working hours; rejected cases must be resubmitted). Support team shares a certification sheet with the validation checklist.
4. **Step 3 - Flight API validations** - confirm all validations from the Flight API Checklist are implemented (`samples/TBOFlightAPICheckList.rar`; see 06-validations.md section 8).
5. **Step 4 - Sign off and live access** - "On successful completion of all the above steps, TBO will give sign off and provide Live access details to the client. It is strongly recommended that the client also completes their UAT before making the services live at their end."
6. **Step 5 - IP whitelisting** - "Post successful signoff, the client needs to check the Static Public IP/ Gateway (Network Routing IP) with their domain service provider and share the same. This would be the IP Address from where client's API requests would come to TBO server." (check via http://cmyip.com/ or http://www.whatismyip.com/). FAQ: non-whitelisted IP returns "You are not authorized to access TBO-API"; IP whitelisting is done by Ms. Pavneet Kaur's end.
7. **Credentials** - live password changes are handled by Ms Pavneet Kaur (Authentication.aspx). Production ClientId is listed as `tboprod` on getagencybalance.aspx (staging `ApiIntegrationNew`).
8. **Wallet** - amount deducted from agency wallet at ticketing; no TBO payment gateway; client implements its own.
9. Contact: apiintegrationteam@tbo.com, +91 0124 4986150, +91 0124 4986103.

## 2. Implications for this project (from the docs, not new rules)

- Production calls need a **static public egress IP** (serverless/edge functions with rotating IPs will be refused). Plan a fixed-IP proxy or server.
- Keep staging and live base URLs and ClientId in config, never hard-coded; sending live credentials to staging URLs (or vice versa) produces the "not authorized" error.
- Store logs of every request/response per booking (needed for certification and for supplier-error disputes).
- Book/Ticket timeout 300 s; on timeout poll GetBookingDetails, never re-book.

## 3. Open questions (not found in docs - ask TBO)

1. Live/production URLs for SharedData (Authenticate, Logout, GetAgencyBalance) and Air services.
2. Whether live uses the `BookingEngineService_AirBook` host and for which methods (Book only, or Ticket/GetBookingDetails/cancellation too). Same question for staging.
3. Is `tboprod` the live ClientId for Authenticate too, or only GetAgencyBalance?
4. Whether HTTPS is supported/required on live (docs show http; staging HTTPS works for Authenticate).
5. Which test cases are mandatory for our account: 1-5 (Certification page) or 1-10 (APIGuide)? Do we need NDC cases 11-12?
6. Duplicate booking window: 24 hours (apivalidation) vs 5 days (FAQ Q18).
7. Exact dates/carriers expected for each test case, and which test sectors currently return inventory.
8. Is GetAirlineSectorList (`tboapi.travelboutiqueonline.com/AirAPI_V10`) live-only, and what is its response schema and AgencyId source?
9. Full error-code list.
10. TicketReissue full request/response schema; whether re-issue/online cancellation is available on staging.
11. Number of IPs that can be whitelisted and lead time; process to change IP later.
12. Whether a deposit/credit limit must be in place before live ticketing, and the commission/markup profile ("Agency additional Markup (if applied from profile)").
13. Token lifetime on live (FAQ: one token per day, 00:00-23:59) and whether parallel tokens invalidate each other.
14. Whether Air Arabia new version (no test environment) must be certified separately.
