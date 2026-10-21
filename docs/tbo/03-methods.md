# TBO Flight API - Method Reference

Source: https://apidoc.tektravels.com/flighT/ (crawled 2026-10-21). The Authenticate / Logout / GetAgencyBalance sections below were transcribed by hand (their tables use non-table markup); every section after that is the converted page content (field tables and the JSON samples exactly as published, including their typos and invalid JSON such as trailing commas). Only the sample password was redacted.

Conventions across all methods:
- REST, JSON only, HTTP POST, `Content-Type: application/json`. Optional `Accept-Encoding: gzip, deflate`; the response then has `Content-Encoding: gzip` and must be decompressed (compression.aspx). On HTTP 400, read the body of the error response (mathodToPostJson.aspx).
- Every response carries `Error.ErrorCode` (int) and `Error.ErrorMessage` (blank when ErrorCode=0). Air-service responses are wrapped in `{"Response": {...}}` with `ResponseStatus`.
- `ResponseStatus` enum (air methods): NotSet = 0, Successfull = 1, Failed = 2, InValidRequest = 3, InValidSession = 4, InValidCredentials = 5.
- Documented error code: **ErrorCode 6 = Invalid Token** (check the code, not the message). TraceId expiry message: "Your session (TraceId) is expired." No full error-code table was found in the docs.

---

## Authenticate

**Staging URL:** `http://Sharedapi.tektravels.com/SharedData.svc/rest/Authenticate` (the HTTPS form `https://Sharedapi.tektravels.com/SharedData.svc/rest/Authenticate` is confirmed working by the project; docs show http)  
**Source pages:** https://apidoc.tektravels.com/flighT/Authentication.aspx, https://apidoc.tektravels.com/flighT/Auth_JSON.aspx

"Authenticate method will return the Token ID that needs to be echoed back in every subsequent request. In case of session expiry or log outs, the authenticate method needs to be called again and the updated Token ID needs to be passed in every subsequent request." "Password will be change by API team in Test Environment and in Live API, Ms Pavneet Kaur will do the same."

Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | ClientId | String | Client ID - ApiIntegrationNew | Mandatory |
| 2 | UserName | String | User name provided to the agency at registration | Mandatory |
| 3 | Password | String | Password provided to the agency at registration (Use API Password) | Mandatory |
| 4 | EndUserIp | String | Public Server IP | Mandatory |

Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | Member | | | |
| 1.1 | FirstName | String | First Name of the client | Mandatory |
| 1.2 | LastName | String | Last Name of the client | Mandatory |
| 1.3 | Email | String | Email ID of the client | Mandatory |
| 1.4 | MemberId | Integer | Unique Member ID | Mandatory |
| 1.5 | AgencyId | Integer | Unique Agency ID | Mandatory |
| 1.6 | LoginName | String | Login Name (user name) | Mandatory |
| 1.7 | LoginDetails | String | Login Details of the client | Mandatory |
| 2 | TokenId | String | Token ID | Mandatory |
| 3 | Status | Integer | NotSet = 0, Successful = 1, Failed = 2, InCorrectUserName = 3, InCorrectPassword = 4, PasswordExpired = 5 | Mandatory |
| 4 | Error | | | Mandatory |
| 4.1 | ErrorCode | Integer | Code corresponding to the Error | Mandatory |
| 4.2 | ErrorMessage | String | Blank when ErrorCode=0 | Mandatory |

```json
Authenticate Request
{
"ClientId": "ApiIntegrationNew",
"UserName": "xxxxxx",
"Password": "<API_PASSWORD - never commit>",
"EndUserIp": "192.168.11.120"
}
```
```json
Authenticate Response
{
"Status": 1,
"TokenId": "705d0324-56eb-48a0-9e8e-bd6ed9f853d5",
"Error": { "ErrorCode": 0, "ErrorMessage": "" },
"Member": {
"FirstName": "Xxxxx",
"LastName": "Yyyyyy",
"Email": "zaassssss@gmail.com",
"MemberId": 111,
"AgencyId": 222,
"LoginName": "username",
"LoginDetails": "Login Success at#@ 8/14/2013 6:17:22 PM #@ IPAddress: 122.172.106.185",
"isPrimaryAgent": false
}
}
```

---

## Logout

**Staging URL:** `http://Sharedapi.tektravels.com/SharedData.svc/rest/Logout`  
**Source pages:** https://apidoc.tektravels.com/flighT/logout.aspx, https://apidoc.tektravels.com/flighT/logout_json.aspx

"Logout method can be used to kill any existing token (session), forcefully."

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | ClientId | String | Client ID - ApiIntegrationNew | Mandatory |
| 2 | TokenAgencyId | String | Agency ID (Provided in Authenticate response) | Mandatory |
| 3 | TokenMemberId | String | Member ID (Provided in Authenticate response) | Mandatory |
| 4 | EndUserIp | String | IP address of the End User | Mandatory |
| 5 | TokenId | String | Token Id received in authenticate response | Mandatory |

Response: `Status` (NotSet = 0, Successful = 1, Failed = 2), `Error.ErrorCode`, `Error.ErrorMessage`.

```json
Logout Request
{
"ClientId": "ApiIntegrationNew",
"EndUserIp": "192.168.11.120",
"TokenAgencyId": 8428,
"TokenMemberId": 9611,
"TokenId": "b4d01ea0-6e4d-481b-aff1-ab7983064082"
}
```
```json
LogOut Response
{ "Error": { "ErrorCode": 0, "ErrorMessage": "" }, "Status": 1 }
```

---

## GetAgencyBalance

**Staging URL:** `http://Sharedapi.tektravels.com/SharedData.svc/rest/GetAgencyBalance`  
**Source pages:** https://apidoc.tektravels.com/flighT/getagencybalance.aspx, https://apidoc.tektravels.com/flighT/GetAgencyBalance_Json.aspx

| Level | Element | Format | Remark | Mandatory/Optional |
|---|---|---|---|---|
| 1 | ClientId | String | ApiIntegrationNew (Staging) / tboprod (Production) | Mandatory |
| 2 | TokenAgencyId | String | Received in authenticate response | Mandatory |
| 3 | TokenMemberId | String | Received in authenticate response | Mandatory |
| 4 | EndUserIp | String | IP address of the End User | Mandatory |
| 5 | TokenId | String | Received in authenticate response | Mandatory |

Response

| Level | Element | Format | Comments |
|---|---|---|---|
| 1 | Status | Enumeration | Not Set = 0, Successful = 1, Failed = 2 |
| 2 | AgencyType | Enumeration | Not Set = 0, Cash = 1, Credit = 2 |
| 3 | CashBalance | Decimal | Cash Balance |
| 4 | CreditBalance | Decimal | Credit Balance |
| 5 | Error.ErrorCode / Error.ErrorMessage | Integer / String | |

```json
GetAgencyBalance Request
{
"ClientId": "ApiIntegrationNew",
"EndUserIp": "192.168.11.120",
"TokenAgencyId": 8428,
"TokenMemberId": 9611,
"TokenId": "b4d01ea0-6e4d-481b-aff1-ab7983064082"
}
```
```json
GetAgencyBalance Response
{ "AgencyType": 1, "CashBalance": 9973376207, "CreditBalance": 0, "Error": { "ErrorCode": 0, "ErrorMessage": "" }, "Status": 1 }
```

---

## GetAirlineSectorList (2025 release)

**URL as published:** `https://tboapi.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/GetAirlineSectorList` (this is the only `tboapi.travelboutiqueonline.com` host in the docs; whether it is staging or live is not stated)  
**Source:** https://apidoc.tektravels.com/flighT/NewReleases2025.aspx

Purpose: download sector-wise airline list so searches are only made for valid airline-sector combinations (docs: ~20% of customers hit "No Result Found"). Response structure: not found in docs.

```json
Request
{
"EndUserIp": "192.168.5.56",
"TokenId": "ac2751e9-4cc3-406f-b678-c947e4f57a00",
"TraceId": "f140170f-2b71-4b51-9cec-423a8f0bfef3",
 "AgencyId": 1234
}
```

---

## Re-issuance (TicketReissue)

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/TicketReissue`  
**Source:** https://apidoc.tektravels.com/flighT/NewReleases.aspx, NewReleases2025.aspx

- Flow: SEARCH -> FAREQUOTE -> TICKETREISSUE (only for an already-created booking). Full re-issuance only (no partial). Originally LCC only; 2025: also GDS (Galileo, Amadeus) and NDC (EK, LH, EY, AI, Amadeus NDC); LCC 6E, IX, SG, FZ, QP.
- New Search nodes (mandatory only for re-issue): `SearchType` (Normal search - 0, Re-issue - 1, Reissue with creditshell - 2), `Pnr`, `Bookingid` (from original ticket).
- FareQuote returns `SupplierReissueCharges` (extra charge for modification).
- Call TicketReissue instead of Ticket. It has object `TicketData` with `TourCode`, `Endorsement`, `CorporateCode`, `AgentDealCode` taken from the original ticket.
- Original BookingId status becomes 'reissued'; a new BookingId is issued (use it for later cancellation). Re-issued PNR is the same as original PNR.
- Support check: `MiniFareRules[].OnlineRefundAllowed` in Search/FareQuote (as written in docs, the same node is named for both cancellation and re-issue).
- Full TicketReissue request/response JSON: not found in docs.


---

## Search

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search`  
**Source pages:** https://apidoc.tektravels.com/flighT/Search.aspx, https://apidoc.tektravels.com/flighT/Search_jason.aspx, https://apidoc.tektravels.com/flighT/AdvanceSearch.aspx, https://apidoc.tektravels.com/flighT/CorporateFareSearch.aspx


### Verbatim content of `Search.aspx`

SEARCH
This method provides availability information with the cheapest fare option available. The request includes single query. The search request contains optional field of Return Date.
Difference Between Normal and Special Return Search
Normal Return - Can be two different airline or same airline with two fares for each outbound and inbound.
Special Return - Same Airline for outbound and inbound with a single combined fare.
Important Notes
1. Result index of OB is for the outbound journey whereas the result index of IB is for the inbound journey.
2. In Domestic return (For both normal return and special return), you will receive both results index differently but in international return (For both normal return and special return), both segments will come under a single result index.
3. In case of the domestic normal return, you have call methods (Fare quote to Ticket ) twice for two different result indexes i.e OB and IB.
4. In the case of the domestic special return, you have to send both result indexes (comma separated) in the same method.
5. In the case of Special return, you will receive different airline for OBs and IBs search response, you have combined and pass the same airline for OB and IB in the request of fare quote.
Time Zone Difference of Air
Eg. The time duration from 02:50 to 05:15 is 2hrs 25mins for Dubai
As Dubai time difference is 1 hr 30mins,
Therefore when you add 1 hr 30mins and 2hrs 25mins you will get 3hrs 55mins.
Time difference mentioned in highlighted is the zonal time difference as per country which you need to calculate at your end
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search
Note: A booking can include up to 9 passengers at a time, including adults, children, and infants.
Student Fare and Senior Citizen and Armed Force Fare
We have implemented Student Fare for 6E(Indigo), SG(SpiceJet), I5(AirAsia) & GDS:
Client need to pass 'ResultFareType' node to get the Student fare and below are the enums for the same-
RegularFare: 2
ResultFareType:3  (StudentFare )
ResultFareType:4 (Armed Force)
ResultFareType:5 (Senior Citizen)
StudentId is mandatory in case of SG.
SeniorCitizen is mandatory id's in case of Indigo airline only.
Indigo, SpiceJet both are available for Senior Citizen Fare.
Sample File:
Download Student Fare Search Request Log
Search Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID (Token Id to be echoed back from Authenticate response) | Mandatory |
| 3 | AdultCount | Integer | Number of adults except for Advance Search | Mandatory |
| 4 | ChildCount | Integer | Number of children (except for Advance Search. Minimum value should be 0) | Mandatory |
| 5 | InfantCount | Integer | Number of infants (except for Advance Search. Minimum value should be 0) | Mandatory |
| 6 | DirectFlight | Boolean | If it is TRUE only direct flight will come. (Value – True or False) | Optional |
| 7 | OneStopFlight | Boolean | If it is true only one stop flights will come (Value – True or False) | Optional |
| 8 | JourneyType | Enumeration | Specify journey type (1 - OneWay, 2 - Return, 3 - Multi Stop, 4 - AdvanceSearch, 5 - Special Return) | Mandatory |
| 9 | ResultFareType | Enumeration | Specify ResultfareType( 2 - Regularfare, 3 - Student Fare, 4 - Armed Force, 5 - Senior Citizen) | Optional |
| 10 | PreferredAirlines | String[] | This filter works only on GDS airline (null for All) i.e. ["AI","9W"] | Optional |
| 11 | Segments [] |  | List of segments |  |
| 11.1 | Origin | String | Origin city code (e.g. DEL) | Mandatory |
| 11.2 | Destination | String | Destination city code(e.g. BOM) | Mandatory |
| 11.3 | FlightCabinClass | Enumerator | Cabin class (1 for All, 2 for Economy, 3 for PremiumEconomy, 4 for Business, 5 for PremiumBusiness, 6 for First) | Mandatory |
| 11.4 | PreferredDeparture | Date Time | Preferred departure | Mandatory |
|  | Date Time |  | Format: yyyy-MM-ddTHH:mm:ss (2015-08-10T00:00:00 for any time 2015-08-10T08:00:00 for Morning Flights 2015-08-10T14:00:00 for Afternoon Flights 2015-08-10T19:00:00 for Evening Flights 2015-08-10T01:00:00 for Night Flights) |  |
| 11.5 | PreferredArrivalTim |  | Preferred arrival date (same as above) Format: yyyy-MM-ddTHH:mm:ss | Mandatory |
| 12 | Sources | String[] | Airline Sources For Normal OW/RT (GDS - Amadeus/Galileo SG - SpiceJet 6E - Indigo G8 - Go Air G9 - Air Arabia FZ - Fly Dubai IX - Air India Express AK - Air Asia LB - Air Costa For LCC Spl Return: SG - SpiceJet 6E - Indigo G8 - Go Air For GDS Spl Return: GDS For Advance Search: GDS - Amadeus/Galileo For MultiStop Search: GDS - Amadeus/Galileo) | Optional |

Search Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | TraceId | String | Trace ID (Trace Id to be echoed back in further requests valid for 15 minutes only) | Mandatory |
| 2 | Origin | String | Origin city code | Mandatory |
| 3 | Destination | String | Destination city code | Mandatory |
| 4 | Results [ ] | Array of element | Array of the flight results (Can be blank in case no found for requested flights search) | Mandatory |
| 4.1 | ResultIndex | String | Result Index | Mandatory |
| 4.2 | Source | String | Airline Source ( NotSet = 0 SpiceJet = 3 Amadeus = 4 Galileo = 5 Indigo = 6 GoAir = 10 AirArabia = 13 AirIndiaExpress = 14 AirIndiaExpressDom = 15 FlyDubai = 17 AirAsia = 19 IndigoCoupon = 24 SpiceJetCoupon = 25 GoAirCoupon = 26 IndigoTBF = 27 SpiceJetTBF = 28 GoAirTBF = 29 IndigoSPLCoupon = 30 SpiceJetSPLCoupon = 31 GoAirSPLCoupon = 32 IndigoCrpFare = 36 SpiceJetCrpFare = 37 GoAirCrpFare = 38 IndigoDstInv = 42 SpiceJetDstInv = 43 GoAirDstInv = 44 AirCosta = 46 MalindoAir = 47 BhutanAirlines = 48 AirPegasus = 49 TruJet = 50) | Mandatory |
| 4.3 | IsLCC | Boolean | Is the result for LCC or Non LCC (Value – True or False) | Mandatory |
| 4.4 | IsRefundable | Boolean | Is the fare refundable | Mandatory |
| 4.5 | AirlineRemarks | String | Airline remarks | Optional |
| 4.6 | Fare |  |  |  |
| 4.6.1 | Currency | String | Currency | Mandatory |
| 4.6.2 | BaseFare | Decimal | The total Base fare of the booking | Mandatory |
| 4.6.3 | Tax | Decimal | The total tax of the booking | Mandatory |
| 4.6.4 | YQTax | Decimal | It is Fuel surcharge. It is part of Tax | Mandatory |
| 4.6.5 | AdditionalTxnFeeOfrd | Decimal | It is additional Transaction fee that API User can charge from the customer but TBO will not charge it from you as per airline (It will always be zero) | Mandatory |
| 4.6.6 | AdditionalTxnFeePub | Decimal | It is additional Transaction fee that API User can charge from the customer but TBO will not charge it from you as per airline (It will always be zero) | Mandatory |
| 4.6.7 | OtherCharges | Decimal | Some additional charge by airline airport. | Mandatory |
| 4.6.8 | ChargeBU[] |  | It will contain different charge breakup that is service charge or Credit card charge.For details please refer ChargeBraekUp structure | Mandatory |
| 4.6.8.1 | TBOMarkUp | Decimal | TBO Mark-up | Mandatory |
| 4.6.8.2 | ConvenienceCharge | Decimal | Convenience Charge | Mandatory |
| 4.6.8.3 | OtherCharge | Decimal | Other Charge | Mandatory |
| 4.6.9 | Discount | Decimal | The total discount amount of the booking. Will be zero for API customer. | Mandatory |
| 4.6.10 | PublishedFare | Decimal | Published Fare | Mandatory |
| 4.6.11 | CommissionEarned | Decimal | Total Commission of Agent. Basically it is your profit margin, earning from booking. | Mandatory |
| 4.6.12 | PLBEarned | Decimal | Performance Linked Bonus on a particular airline. | Mandatory |
| 4.6.13 | IncentiveEarned | Decimal | Incentive applicable(if any) | Mandatory |
| 4.6.14 | OfferedFare | Decimal | Offered Fare | Mandatory |
| 4.6.15 | TdsOnCommission | Decimal | TDS on the commission earned. | Mandatory |
| 4.6.16 | TdsOnPLB | Decimal | TDS on Performance Linked Bonus. | Mandatory |
| 4.6.17 | TdsOnIncentive | Decimal | TDS on the incentive earned. | Mandatory |
| 4.6.18 | ServiceFee | Decimal | Service Fee | Mandatory |
| 4.7 | FareBreakdown[] |  | Details of fare breakup into several part. It give fare of Each Passenger Type. |  |
| 4.7.1 | Currency | String | Currency | Mandatory |
| 4.7.2 | PassengerType | String | Passenger Type Adult – 1 Child – 2 Infant – 3 | Mandatory |
| 4.7.3 | PassengerCount | Integer | Number of Passenger | Mandatory |
| 4.7.4 | BaseFare | Decimal | The total Base fare of the booking for particular pax type | Mandatory |
| 4.7.5 | Tax | Decimal | The total tax of the booking for particular pax type | Mandatory |
| 4.7.6 | YQTax | Decimal | Fuel Surcharge for | Mandatory |
|  |  |  | particular pax type |  |
| 4.7.7 | AdditionalTxnFeeOfrd | Decimal | It is additional Transaction fee that API User can charge from the customer but TBO will not charge it from you as per airline (It will always be zero) | Mandatory |
| 4.7.8 | AdditionalTxnFeePub | Decimal | It is additional Transaction fee that API User can charge from the customer butTBO will not charge it from you as per airline | Mandatory |
| 4.8 | Segments |  |  |  |
| 4.8.1 | TripIndicator | Integer | Trip Indicator (1 for Outbound 2 for Inbound flights) | Mandatory |
| 4.8.2 | SegmentIndicator | Integer | Segment Indicator (1 for Outbound 2 for Inbound flights) | Mandatory |
| 4.8.3 | Airline |  |  |  |
| 4.8.3.1 | AirlineCode | String | Airline code | Mandatory |
| 4.8.3.2 | AirlineName | String | Airline name | Mandatory |
| 4.8.3.3 | FlightNumber | String | Flight Number | Mandatory |
| 4.8.3.4 | FareClass | String | Fare Class | Mandatory |
| 4.8.3.5 | OperatingCarrier | String | Operating Carrier | Mandatory |
| 4.8.4 | Origin |  |  |  |
| 4.8.4.1 | Airport |  |  |  |
| 4.8.4.1.1 | AirportCode | String | Airport code | Mandatory |
| 4.8.4.1.2 | AirportName | String | Airport name | Optional |
| 4.8.4.1.3 | Terminal | String | Terminal number | Optional |
| 4.8.4.1.4 | CityCode | String | City code | Mandatory |
| 4.8.4.1.5 | CityName | String | City name | Mandatory |
| 4.8.4.1.6 | CountryCode | String | Country code | Mandatory |
| 4.8.4.1.7 | CountryName | String | Country name | Mandatory |
| 4.8.5 | DepTime | Date Time | Departure time | Mandatory |
| 4.8.6 | Destination |  |  |  |
| 4.8.6.1 | Airport |  |  |  |
| 4.8.6.1.1 | AirportCode | String | Airport code | Mandatory |
| 4.8.6.1.2 | AirportName | String | Airport name | Optional |
| 4.8.6.1.3 | Terminal | String | Terminal number | Optional |
| 4.8.6.1.4 | CityCode | String | City code | Mandatory |
| 4.8.6.1.5 | CityName | String | City name | Mandatory |
| 4.8.6.1.6 | CountryCode | String | Country code | Mandatory |
| 4.8.6.1.7 | CountryName | String | Country name | Mandatory |
| 4.8.7 | ArrTime | Date Time | Arrival time | Mandatory |
| 4.8.8 | AccumulatedDuration | Time | Accumulated duration | Optional |
| 4.8.9 | Duration | Time | Duration (if in case duration is 0 refer the node of Accumulated Duration) | Optional |
| 4.8.10 | GroundTime | Time | Ground time | Optional |
| 4.8.11 | Mile | String | Miles | Optional |
| 4.8.12 | StopOver |  |  |  |
| 4.8.13 | StopPoint | String | Stopover point | Optional |
| 4.8.14 | StopPointArrivalTime | Date Time | Stopover arrival time | Optional |
| 4.8.15 | StopPointDepartureTime | Date Time | Stopover departuretime | Optional |
| 4.8.16 | Craft | String | Craft | Optional |
| 4.8.17 | IsETicketEligible | Boolean | Is E-Ticket eligible (Value – true or false) | Mandatory |
| 4.8.18 | FlightStatus | String | Flight status | Mandatory |
| 4.8.19 | Status | String | Status | Mandatory |
| 4.9 | LastTicketDate | Date Time | Last ticket date | Mandatory |
| 4.1 | TicketAdvisory | String | Ticket Advisory | Optional |
| 4.11 |  | FareRules | This is the fare rules of the flight fare offered Note: Fare rule details will not be available on search response. Call GetFareRule method to get fare details |  |
| 4.11.1 | Origin | String | Origin | Mandatory |
| 4.11.2 | Destination | String | Destination | Mandatory |
| 4.11.3 | Airline | String | Airline | Mandatory |
| 4.11.4 | FareBasisCode | String | Fare basis code | Mandatory |
| 4.11.5 | FareRuleDetail | String List | Fare rule details | Mandatory |
| 4.11.6 | FareRestriction | String | Fare restriction | Mandatory |
| 4.11.7 | AirlineCode | String | Airline code | Mandatory |
| 5 | Penalty |  | Cancellation/Re-issuance | Optional |
| 5.1 | ReissueCharge | Amount | Re-issuance Charge | Optional |
| 5.2 | CancellationCharge | Amount | CancellationCharge | Optional |
### Verbatim content of `Search_jason.aspx`

Download Search Requests
OnewaySearch
ReturnSearch
MulticitySearch
AdvancedSearch
SpecialReturn
```json
	
Search Request
{
"EndUserIp": "192.168.10.10",
"TokenId": "ac2751e9-4cc3-406f-b678-c947e4f57a00",
"AdultCount": "1",
"ChildCount": "1",
"InfantCount": "1",
"DirectFlight": "false",
"OneStopFlight": "false",
"JourneyType": "1",
"PreferredAirlines": null,
"Segments": [
{
"Origin": "DEL",
"Destination": "BOM",
        "FlightCabinClass": "1",
"PreferredDepartureTime": "2024-12-30T00: 00: 00",
"PreferredArrivalTime": "2024-12-30T00: 00: 00"
}
        ],
"Sources": null
}

    
```
```json
	
        Search Response
{
"Response": {
"ResponseStatus": 1,
"Error": {
"ErrorCode": 0,
"ErrorMessage": ""
},
"TraceId": "742cc856-3d73-4cdd-b267-f0e4484c0984",
"Origin": "DEL",
"Destination": "BOM",
 "Results": [
            [
                {
                    "FirstNameFormat": null,
                    "IsBookableIfSeatNotAvailable": false,
                    "IsHoldAllowedWithSSR": false,
                    "LastNameFormat": null,
                    "ResultIndex": "OB2[TBO]ZJfnrNr3lGdOyRzztpRBmpqAnpA8mmd12UtfkktuuMcRXXF+7PK+/bnF1gS0v+UoWfYG/BwPX5S2UJu0HNhTZX+W/96o0tgqGP0KVW1tGjPY8Tm7/YWb8lttExBQkTLSGV483dt3Iv77t4AWMlRZsQcIJ5a8aEe/JNO/e+t/dWseJfu1sRArWmHUDpK5WQGnYfm657yX77yL7QmBYXx6VNzEOph1TLWcsXbEtP8RLU1Jvu0hkHPkAqMf2Gz7KMzgq0WsGDlAGby3jkyf/xz4+miELH/gfsdbQCCzY2iUWlRjrplDQcu7KgLoF7ZvKLBAq9zwt8RwxBCgKGSNbaCY1s2LfE00I0BsK/PVLWmMoy3aZx9i3s79hP/HD3YtR13an/rmwGZUAVnH8Wk2l15offmsxTMry/y2MTwTSq0gaiqA8bKSQomOQz3yYAAHDcdwR9VpBwY7M8kcO+hDtcq9pOfN1XWGOAgma4CFRn8dzqZbKXNFBlk/STQpzVM6HQ14xQFUgPDHrCoCjI8jnWf7uKCF33VZSVWlO2Ncs/vjf0th9VOeb63ny2EzYKmNBWxA",
                    "Source": 6,
                    "IsLCC": true,
                    "IsRefundable": true,
                    "IsPanRequiredAtBook": false,
                    "IsPanRequiredAtTicket": false,
                    "IsPassportRequiredAtBook": false,
                    "IsPassportRequiredAtTicket": false,
                    "GSTAllowed": true,
                    "IsCouponAppilcable": true,
                    "IsGSTMandatory": false,
                    "AirlineRemark": "6E main.",
                    "IsPassportFullDetailRequiredAtBook": false,
                    "ResultFareType": "RegularFare",
                    "Fare": {
                        "Currency": "INR",
                        "BaseFare": 9130,
                        "Tax": 1356,
                        "TaxBreakup": [
                            {
                                "key": "K3",
                                "value": 0
                            },
                            {
                                "key": "YQTax",
                                "value": 0
                            },
                            {
                                "key": "YR",
                                "value": 0
                            },
                            {
                                "key": "PSF",
                                "value": 0
                            },
                            {
                                "key": "UDF",
                                "value": 0
                            },
                            {
                                "key": "INTax",
                                "value": 0
                            },
                            {
                                "key": "TransactionFee",
                                "value": 0
                            },
                            {
                                "key": "OtherTaxes",
                                "value": 0
                            }
                        ],
                        "YQTax": 0,
                        "AdditionalTxnFeeOfrd": 0,
                        "AdditionalTxnFeePub": 0,
                        "PGCharge": 0,
                        "OtherCharges": 0,
                        "ChargeBU": [
                            {
                                "key": "TBOMARKUP",
                                "value": 0
                            },
                            {
                                "key": "GLOBALPROCUREMENTCHARGE",
                                "value": 0
                            },
                            {
                                "key": "CONVENIENCECHARGE",
                                "value": 0
                            },
                            {
                                "key": "OTHERCHARGE",
                                "value": 0
                            }
                        ],
                        "Discount": 0,
                        "PublishedFare": 10486,
                        "CommissionEarned": 0,
                        "PLBEarned": 0,
                        "IncentiveEarned": 0,
                        "OfferedFare": 10486,
                        "TdsOnCommission": 0,
                        "TdsOnPLB": 0,
                        "TdsOnIncentive": 0,
                        "ServiceFee": 0,
                        "TotalBaggageCharges": 0,
                        "TotalMealCharges": 0,
                        "TotalSeatCharges": 0,
                        "TotalSpecialServiceCharges": 0
                    },
                    "FareBreakdown": [
                        {
                            "Currency": "INR",
                            "PassengerType": 1,
                            "PassengerCount": 1,
                            "BaseFare": 3690,
                            "Tax": 678,
                            "TaxBreakUp": [
                                {
                                    "key": "YQTax",
                                    "value": 0
                                },
                                {
                                    "key": "YR",
                                    "value": 0
                                }
                            ],
                            "YQTax": 0,
                            "AdditionalTxnFeeOfrd": 0,
                            "AdditionalTxnFeePub": 0,
                            "PGCharge": 0,
                            "SupplierReissueCharges": 0
                        },
                        {
                            "Currency": "INR",
                            "PassengerType": 2,
                            "PassengerCount": 1,
                            "BaseFare": 3690,
                            "Tax": 678,
                            "TaxBreakUp": [
                                {
                                    "key": "YQTax",
                                    "value": 0
                                },
                                {
                                    "key": "YR",
                                    "value": 0
                                }
                            ],
                            "YQTax": 0,
                            "AdditionalTxnFeeOfrd": 0,
                            "AdditionalTxnFeePub": 0,
                            "PGCharge": 0,
                            "SupplierReissueCharges": 0
                        },
                        {
                            "Currency": "INR",
                            "PassengerType": 3,
                            "PassengerCount": 1,
                            "BaseFare": 1750,
                            "Tax": 0,
                            "TaxBreakUp": null,
                            "YQTax": 0,
                            "AdditionalTxnFeeOfrd": 0,
                            "AdditionalTxnFeePub": 0,
                            "PGCharge": 0,
                            "SupplierReissueCharges": 0
                        }
                    ],
                    "Segments": [
                        [
                            {
                                "Baggage": "15 KG",
                                "CabinBaggage": " 7 KG",
                                "CabinClass": 2,
                                "SupplierFareClass": null,
                                "TripIndicator": 1,
                                "SegmentIndicator": 1,
                                "Airline": {
                                    "AirlineCode": "6E",
                                    "AirlineName": "Indigo",
                                    "FlightNumber": "6047",
                                    "FareClass": "RR",
                                    "OperatingCarrier": ""
                                },
                                "NoOfSeatAvailable": 2,
                                "Origin": {
                                    "Airport": {
                                        "AirportCode": "DEL",
                                        "AirportName": "Indira Gandhi Airport",
                                        "Terminal": "1",
                                        "CityCode": "DEL",
                                        "CityName": "Delhi",
                                        "CountryCode": "IN",
                                        "CountryName": "India"
                                    },
                                    "DepTime": "2024-12-30T11:15:00"
                                },
                                "Destination": {
                                    "Airport": {
                                        "AirportCode": "BOM",
                                        "AirportName": "Chhatrapati Shivaji Maharaj International Airport",
                                        "Terminal": "2",
                                        "CityCode": "BOM",
                                        "CityName": "Mumbai",
                                        "CountryCode": "IN",
                                        "CountryName": "India"
                                    },
                                    "ArrTime": "2024-12-30T13:30:00"
                                },
                                "Duration": 135,
                                "GroundTime": 0,
                                "Mile": 0,
                                "StopOver": false,
                                "FlightInfoIndex": "",
                                "StopPoint": "",
                                "StopPointArrivalTime": null,
                                "StopPointDepartureTime": null,
                                "Craft": "321",
                                "Remark": null,
                                "IsETicketEligible": true,
                                "FlightStatus": "Confirmed",
                                "Status": "",
                                "FareClassification": {
                                    "Type": "Publish"
                                }
                            }
                        ]
                    ],
                    "LastTicketDate": null,
                    "TicketAdvisory": null,
                    "FareRules": [
                        {
                            "Origin": "DEL",
                            "Destination": "BOM",
                            "Airline": "6E",
                            "FareBasisCode": "R0IP",
                            "FareRuleDetail": "",
                            "FareRestriction": "",
                            "FareFamilyCode": "",
                            "FareRuleIndex": ""
                        }
                    ],
                    "AirlineCode": "6E",
                    "ValidatingAirline": "6E",
                    "FareClassification": {
                        "Color": "lightBlue",
                        "Type": "Publish"
                    }
                }

]
]
}
}

    
```
### Verbatim content of `AdvanceSearch.aspx`

ADVANCE SEARCH
For the Advance Search Request Response kindly refer the Search JSON Tab.
### Verbatim content of `CorporateFareSearch.aspx`

CorporateCode in Search
Client can pass corporate code in search request to get the related fares. Below is the sample-
"AdultCount": "1",
"ChildCount": "0",
"InfantCount": "0",
"DirectFlight": "false",
"OneStopFlight": "false",
"JourneyType": "1",
"EndUserIp": "192.168.10.36",
"TokenId": "*****************",
"PreferredAirlines": [],
"CorporateCodes" :
[
"PCC": "OTI011",
"AirlineKeys" :
[
"Airline": "6E",
"CorporateCode":"152634,123654"
]
},
"PCC": "APITRVBOUTON",
"AirlineKeys" :
[
"Airline": "AK",
"CorporateCode":"753951"
]
],
"Segments": [
"Origin": "DEL",
"Destination": "BOM",
"PreferredDepartureTime": "2022-08-29T00:00:00",
"PreferredArrivalTime": "2022-08-29T00:00:00",
"FlightCabinClass": 1
],
"Sources": null,
"IsBaseCurrencyRequired": "true",
"PreferredCurrency": "INR"

---

## FareRule

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareRule`  
**Source pages:** https://apidoc.tektravels.com/flighT/FareRule.aspx, https://apidoc.tektravels.com/flighT/FareRule_Json.aspx


### Verbatim content of `FareRule.aspx`

FARE RULE
This method is used to get the fare rules and condition of a specific flight option. It contains the fare basis code and the relevant details associated with it, such as restrictions and penalties(cancellation fees).
Important Note regarding FareRule:
MENTIONED FEE ARE INDICATIVE PER PAX AND PER SECTOR.
APART FROM AIRLINE CHARGES,GST+RAF+ APPLICABLE CHARGES IF ANY, WILL BE CHARGED.
FOR DOMESTIC BOOKINGS, PASSENGERS ARE REQUIRED TO SUBMIT THE CANCELLATION OR REISSUE REQUEST AT LEAST 2 HOURS BEFORE THE AIRLINES CANCELLATION AND REISSUE POLICY.
FOR INTERNATIONAL BOOKINGS, PASSENGERS ARE REQUIRED TO SUBMIT THE CANCELLATION OR REISSUE REQUEST AT LEAST 4 HOURS BEFORE THE AIRLINES CANCELLATION AND REISSUE POLICY.
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareRule
FareRule Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID | Mandatory |
|  |  |  |  | (Token Id to be echoed back from Authenticate response) |
| 3 | TraceId | String | Trace Id | Mandatory |
|  |  |  |  | (Trace Id to be echoed back from search response. This can be used to trace particular search/ book at TBO’s end) |
| 4 | ResultIndex | Integer | Result Index | Mandatory |

FareRule Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | FareRules[] |  |  |  |
| 1.1 | Airline | String | Airline | Mandatory |
| 1.1.1 | Origin | String | Origin | Mandatory |
| 1.1.2 | Destination | String | Destination | Mandatory |
| 1.1.3 | FareBasisCode | String | Fare basis code is the fare class code provided by the supplier | Mandatory |
| 1.1.4 | FareRestriction | String | Fare restriction | Optional |
| 1.1.5 | FareRuleDetail | String List | Fare rule details | Mandatory |
| 1.2 | Error |  |  |  |
| 1.2.1 | ErrorCode | Integer | Code corresponding to the Error | Mandatory |
| 12.2 | ErrorMessage | String | Contains error message | Mandatory (Will contain error description corresponding to ErrorCode. Error Message would be blank in case ErrorCode=0) |
### Verbatim content of `FareRule_Json.aspx`

```json
	
        FareRule Request
{
"EndUserIp": "192.168.5.56",
"TokenId": "ac2751e9-4cc3-406f-b678-c947e4f57a00",
"TraceId": "f140170f-2b71-4b51-9cec-423a8f0bfef3",
"ResultIndex": "OB2[TBO]ZJfnrNr3lGdOyRzztpRBmpqAnpA8mmd12UtfkktuuMcRXXF+7PK+/bnF1gS0v+UoWfYG/BwPX5S2UJu0HNhTZX+W/96o0tgqGP0KVW1tGjPY8Tm7/YWb8lttExBQkTLSGV483dt3Iv77t4AWMlRZsQcIJ5a8aEe/JNO/e+t/dWseJfu1sRArWmHUDpK5WQGnYfm657yX77yL7QmBYXx6VNzEOph1TLWcsXbEtP8RLU1Jvu0hkHPkAqMf2Gz7KMzgq0WsGDlAGby3jkyf/xz4+miELH/gfsdbQCCzY2iUWlRjrplDQcu7KgLoF7ZvKLBAq9zwt8RwxBCgKGSNbaCY1s2LfE00I0BsK/PVLWmMoy3aZx9i3s79hP/HD3YtR13an/rmwGZUAVnH8Wk2l15offmsxTMry/y2MTwTSq0gaiqA8bKSQomOQz3yYAAHDcdwR9VpBwY7M8kcO+hDtcq9pOfN1XWGOAgma4CFRn8dzqZbKXNFBlk/STQpzVM6HQ14xQFUgPDHrCoCjI8jnWf7uKCF33VZSVWlO2Ncs/vjf0th9VOeb63ny2EzYKmNBWxA"
}

    
```
```json
	
        FareRule Response
{
    "Response": {
        "Error": {
            "ErrorCode": 0,
            "ErrorMessage": ""
        },
        "FareRules": [
            {
                "Airline": "6E",
                "DepartureTime": "0001-01-01T00:00:00",
                "Destination": "BOM",
                "FareBasisCode": "R0IP",
                "FareInclusions": [],
                "FareRestriction": null,
                "FareRuleDetail": "The FareBasisCode is: R0IP \r\n\r\n IndiGo Fares Terms & Conditions\r\n\r\n Regular / Promo - One Way retail\r\n\r\n Baggage Conditions\r\n Check-in Baggage Allowance: 15 kg for Domestic sectors and 20 kg for International Sectors except 30 Kg for Kuwait, Abu Dhabi, Dubai, Muscat, Damam, Sharjah, Doha, Istanbul and Codeshare destinations; and 25 kg for Jeddah + 5L Zamzam water (only for flights from Jeddah to India)\r\n Hand Baggage Allowance: 7 Kg on IndiGo Operations and 8 Kg on 6E-TK Codeshares. (Including ladies bag and laptop bag.)\r\n\r\n Change Fee / Cancel Fee\r\n Domestic - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 3 hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 3 hrs from scheduled departure. Difference of fare will be applicable along with Change/Cancellation fees.\r\n\r\n International - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 4hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 4 hrs from scheduled departure. Difference of fare will be applicable along with change fees.\r\n\r\n Click here for Change / Cancellation charges: https://www.goindigo.in/information/fees-and-charges.html?linkNav=fees-and-charges_header \r\n\r\n\r\n Super 6E Fare - The e2809cSuper 6Ee2809d fare will include an extra 10kg baggage allowance, free seat selection including XL seat, meal / snack combo, check-in first and get your bags before anyone else, anytime boarding, delayed and lost baggage protection service and reduced change and cancellation fee, as well as no convenience fee.\r\n       \r\n        Baggage Conditions\r\n       Check-in Baggage Allowance: An extra 10KG baggage allowance on regular baggage allowance.\r\n       Hand Baggage Allowance:  7 Kg. (including ladies bag and laptop bag.)\r\n\r\n\r\nChange Fee \r\nDomestic: No Date Change Fee If changed 4 Days and Above left for departure. Change fee of IN 500 (Per Passenger per sector) will be applicable if changed within 0-3 days from the departure.No-show charges will be levied if changed/cancelled within 3 hrs from scheduled departure. Difference of fare will be applicable along with change fees.\r\n      \r\nInternational: INR 500 per passenger will be charged for changes made in the period 4(four) days prior to date of departure and INR 900 per passenger for international sector within 3 (three) days from the date of departure. No-show charges will be levied if changed/cancelled within 4 hrs from scheduled departure. Difference of fare will be applicable along with change fees.\r\n      \r\n\r\nCancellation Fee \r\n      \r\nCancellation fee of only INR 500 per passenger for domestic sector and INR 1500 per passenger for international sector.\r\n\r\nIf changed/cancelled at least 4hrs before the scheduled departure for International sectors and at least 3hrs before the scheduled departure for Domestic sectors. No-show charges will be levied if changed/cancelled within 4 hrs (International) and 3hrs (Domestic) from scheduled departure. Difference of fare will be applicable along with change fees. \r\n\r\n                                                                                                                                                                                     Click here for Change / Cancellation charges: https://www.goindigo.in/add-on-services/super-6e-fare.html?linkNav=super-6e-fare_Home-homepage~service-listing~5\r\n\r\nReturn Fare - Applicable for Round-Trip journey\r\n\r\nBaggage Conditions\r\nCheck-in Baggage Allowance: 15 kg for Domestic sectors and 20 kg for International Sectors except 30 Kg for Kuwait, Abu Dhabi, Dubai, Muscat, Damam, Sharjah, Doha, Istanbul and Codeshare destinations; and 25 kg for Jeddah + 5L Zamzam water (only for flights from Jeddah to India)\r\nHand Baggage Allowance:  7 Kg on IndiGo Operations and 8 Kg on 6E-TK Codeshares. (Including ladies bag and laptop bag.)\r\n\r\nChange Fee / Cancel Fee\r\nDomestic - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 3 hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 3 hrs from scheduled departure. Difference of fare will be applicable along with Change/Cancellation fees.\r\n\r\nInternational - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 4hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 4 hrs from scheduled departure. Difference of fare will be applicable along with change fees. \r\n\r\nClick here for Change / Cancellation charges: https://www.goindigo.in/information/fees-and-charges.html?linkNav=fees-and-charges_header \r\n\r\n\r\nFamily Fare - Applicable on a minimum of 4 pax booked on the same PNR\r\n\r\nBaggage Conditions\r\nCheck-in Baggage Allowance: 15 kg for Domestic sectors and 20 kg for International Sectors except 30 Kg for Kuwait, Abu Dhabi, Dubai, Muscat, Damam, Sharjah, Doha, Istanbul and Codeshare destinations; and 25 kg for Jeddah + 5L Zamzam water (only for flights from Jeddah to India)\r\nHand Baggage Allowance:  7 Kg. (including ladies bag and laptop bag.)\r\n\r\nChange Fee / Cancel Fee\r\nDomestic - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 3 hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 3 hrs from scheduled departure. Difference of fare will be applicable along with Change fees.\r\n\r\nInternational - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 4hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 4 hrs from scheduled departure. Difference of fare will be applicable along with change fees. \r\n\r\nClick here for Change / Cancellation charges: https://www.goindigo.in/information/fees-and-charges.html?linkNav=fees-and-charges_header \r\n\r\n\r\nFlexi Fare - Unlimited changes 4 Days and Above left for departure for domestic and international sectors. Fare difference applies.\r\n\r\nBaggage Conditions\r\nCheck-in Baggage Allowance: 15 kg for Domestic sectors and 20 kg for International Sectors except 30 Kg for Kuwait, Abu Dhabi, Dubai, Muscat, Damam, Sharjah, Doha, Istanbul and Codeshare destinations; and 25 kg for Jeddah + 5L Zamzam water (only for flights from Jeddah to India)\r\nHand Baggage Allowance:  7 Kg. (including ladies bag and laptop bag.)\r\n\r\n\r\nChange Fee \r\nDomestic : No Date Change Fee If changed 4 Days and Above left for departure. Change fee up to INR 3000 (Per Passenger per sector)will be levied if changed within 0-3 days from the departure. No-show charges will be levied if changed/cancelled within 3 hrs from scheduled departure. Difference of fare will be applicable along with Change fees.\r\nInternational: No Change Fee: if changed at least 4 Days and Above left for departure. Change fee up to INR 5000 (Per Passenger per sector)will be levied if changed within 0-3 days from the departure. No-show charges will be levied if changed/cancelled within 4 hrs from scheduled departure. Difference of fare will be applicable along with change fees.\r\n\r\nCancellation Fee \r\nDomestic: The cancellation fee will be INR 500 for cancellation 4 Days and Above left for departure. Cancellation fee up to INR 3500 (Per Passenger per sector) will be levied if cancelled within 0-3 days from the departure.No-show charges will be levied if Booking cancellation is made, less than 3 hours prior to the scheduled departure time.\r\nInternational: The cancellation fee will be INR 1000 for cancellation 4 Days and Above left for departure. Cancellation fee up to INR 6500 (Per Passenger per sector) will be levied if cancelled within 0-3 days from the departure.No-show charges will be levied if Booking cancellation is made, less than 4 hours prior to the scheduled departure time.\r\n\r\n\r\nClick here for Change / Cancellation charges: https://www.goindigo.in/add-on-services/flexi-fares.html?linkNav=flexi-fares_header \r\n\r\n\r\n\r\nSME Fare - Wee28099ve got a deal thate28099ll give our travel partners an edge. Unlock a discounted seat* along with lower change and cancellation fee, when you book for business travellers with SME fares. *T&C apply.\r\n\r\n\r\nBaggage Conditions\r\nCheck-in Baggage Allowance: 15 kg for Domestic sectors and 20 kg for International Sectors except 30 Kg for Kuwait, Abu Dhabi, Dubai, Muscat, Damam, Sharjah, Doha, Istanbul and Codeshare destinations; and 25 kg for Jeddah + 5L Zamzam water (only for flights from Jeddah to India)\r\nHand Baggage Allowance:  7 Kg. (including ladies bag and laptop bag.)\r\n\r\nChange Fee \r\nDomestic Travel : For travel within India, a Change Fee of INR 449 will be charged if change is made to a Booking at least 3 hours before the scheduled departure time. For clarity, no-show charges will be levied if change to a Booking is made within 3 hours prior to the scheduled departure time.\r\nInternational Travel : For travel to/from an international destination, a Change Fee of INR 999 will be charged if change is made to a Booking at least 4 hours before the scheduled departure time. For clarity, no-show charges will be levied if change to a Booking is made within 4 hours prior to the scheduled departure time.\r\n\r\nCancel Fee\r\nDomestic Travel : The cancellation fee will be INR 499 per passenger per flight for cancellation if cancelled beyond 24 Hrs prior to departure. Cancellation fee up to INR 1499 (Per Passenger per sector) will be levied if cancelled within 3-24 hours from the departure.No-show charges will be levied if Booking cancellation is made, less than 3 hours prior to the scheduled departure time.\r\nInternational Travel : The cancellation fee will be INR 999 for cancellation if cancelled beyond 24 Hrs prior to departure. Cancellation fee up to INR 2499 (Per Passenger per sector) will be levied if cancelled within 3-24 Hours from the departure.No-show charges will be levied if Booking cancellation is made, less than 4 hours prior to the scheduled departure time.\r\n\r\n\r\nClick here for Change / Cancellation charges: https://6esme.goindigo.in/IndiGoSMESite/term_cond/TnC.html\r\n\r\n\r\nLite fare - Applicable for travel without a check-in baggage. Applicable for travel beyond 15 days from the booking date on Domestic and same day on International travel. For a multi-leg/return journey, Lite Fare will be available only if it is available and selected on each of the individual legs.\r\n\r\nBaggage Conditions\r\nCheck-in Baggage Allowance: No check-in baggage allowed.\r\n\r\nHand Baggage Allowance:  7 Kg. (including ladies bag and laptop bag.)\r\n\r\nChange Fee / Cancel Fee\r\nDomestic - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 3 hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 3 hrs from scheduled departure. Difference of fare will be applicable along with Change/Cancellation fees.\r\n\r\nInternational - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 4hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 4 hrs from scheduled departure. Difference of fare will be applicable along with change fees.\r\n\r\nClick here for Change / Cancellation charges: https://www.goindigo.in/information/fees-and-charges.html?linkNav=fees-and-charges_header \r\n\r\n\r\nCorporate / Coupon Fare - Available for contracted Corporate Customers only. Allows unlimited flexibility to change / cancel, extra hand-baggage allowance, complimentary seat and meal (1 food item & 1 beverage). \r\n\r\nBaggage Conditions:\r\nCheck-in Baggage Allowance: 15 kg for Domestic sectors and 20 kg for International Sectors except 30 Kg for Kuwait, Abu Dhabi, Dubai, Muscat, Damam, Sharjah, Doha, Istanbul and Codeshare destinations; and 25 kg for Jeddah + 5L Zamzam water (only for flights from Jeddah to India)\r\nHand Baggage Allowance: 10 Kg. (including ladies bag and laptop bag.)\r\n\r\nChange Fee:\r\nDomestic India : No Change Fee: if changed at least 3 hr before the scheduled departure. No-show charges will be levied if changed within 3 hrs from scheduled departure. Difference of fare will be applicable.\r\nInternational: No Change Fee: if changed at least 4 hr before the scheduled departure. No-show charges will be levied if changed within 4 hrs from scheduled departure. Difference of fare will be applicable.\r\n\r\nCancellation Fee:\r\nDomestic India : No Cancellation Fee: if cancelled at least 3 hr before the scheduled departure. No-show charges will be levied if cancelled within 3 hrs from scheduled departure.     \r\nInternational : No Cancellation Fee: if changed at least 4 hrs before the scheduled departure. No-show charges will be levied if cancelled within 4 hrs from scheduled departure.\r  APART FROM AIRLINE CHARGES,GST+RAF+ APPLICABLE CHARGES IF ANY, WILL BE CHARGED.MENTIONED FEE ARE INDICATIVE PER PAX AND PER SECTOR.FOR DOMESTIC BOOKINGS, PASSENGERS ARE REQUIRED TO SUBMIT THE CANCELLATION OR REISSUE REQUEST AT LEAST 2 HOURS BEFORE THE AIRLINES CANCELLATION AND REISSUE POLICY.FOR INTERNATIONAL BOOKINGS, PASSENGERS ARE REQUIRED TO SUBMIT THE CANCELLATION OR REISSUE REQUEST AT LEAST 4 HOURS BEFORE THE AIRLINES CANCELLATION AND REISSUE POLICY.",
                "FlightId": 0,
                "Origin": "DEL",
                "ReturnDate": "0001-01-01T00:00:00"
            }
        ],
        "ResponseStatus": 1,
        "TraceId": "f140170f-2b71-4b51-9cec-423a8f0bfef3"
    }
}

    
```

---

## FareQuote

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote`  
**Source pages:** https://apidoc.tektravels.com/flighT/FareQuote.aspx, https://apidoc.tektravels.com/flighT/FareQuote_Json.aspx


### Verbatim content of `FareQuote.aspx`

FARE QUOTE
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote
Fare Quote New Sample File:
Download FareQuote Requestresponse
Fare Quote Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token Id (Token Id to be echoed back from Authenticate response) | Mandatory |
| 3 | TraceId | String | Trace Id (Trace Id to be echoed back from search response. This can be used to trace particular search/ book at TBO’s end) | Mandatory |
| 4 | ResultIndex | Integer | Result index(selected result index from search response) | Mandatory |

Fare Quote Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | TraceId | String | Trace Id | Mandatory |
| 2 | IsPriceChanged | Boolean | Is Price changed (Value - true or false) | Mandatory |
| 3 | ResponseStatus | String | Response Status [NotSet = 0, Successfull = 1, Failed = 2, InValidRequest = 3, InValidSession = 4,InValidCredentials = 5] | Mandatory |
| 4 | Results |  |  |  |
| 4.1 | ResultIndex | String | Result Index | Mandatory |
| 4.2 | Source | String | Airline Source | Mandatory |
| 4.3 | IsLCC | Boolean | Is the result for LCC or Non LCC (Value – True or False) | Mandatory |
| 4.4 | IsRefundable | Boolean | Is the fare refundable or not (Value – True or False) | Mandatory |
| 4.5 | AirlineRemark | String | Airline Remark | Optional |
| 4.6 | Fare |  | Fare of search result |  |
| 4.6.1 | Currency | String | Currency | Mandatory |
| 4.6.2 | BaseFare | Decimal | Base fare | Mandatory |
| 4.6.4 | YQTax | Decimal | Fuel surcharge | Mandatory |
| 4.6.5 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 4.6.6 | AdditionalTxnFeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 4.6.7 | OtherCharges | Decimal | Some additional charge by airline/ airport. | Mandatory |
| 4.6.8 | ChargeBU[] |  | It will contain different charge breakup that is service charge or Credit card charge. For details please refer ChargeBraekUp structure | Mandatory |
| 4.6.8.1 | TBOMarkUp | Decimal | TBO Mark-up | Mandatory |
| 4.6.8.2 | ConvenienceCharge | Decimal | Convenience Charge | Mandatory |
| 4.6.8.3 | OtherCharge | Decimal | Other Charge | Mandatory |
| 4.6.9 | Discount | Decimal | Discount | Mandatory |
| 4.6.10 | PublishedFare | Decimal | Published Fare | Mandatory |
| 4.6.11 | Commission Earned | Decimal | Agent Commission | Mandatory |
| 4.6.12 | PLBEarned | Decimal | Performance Linked Bonus | Mandatory |
| 4.6.13 | IncentiveEarned | Decimal | Incentive earned | Mandatory |
| 4.6.14 | OfferedFare | Decimal | Offered Fare | Mandatory |
| 4.6.15 | TdsOnCommission | Decimal | TDS on the commission | Mandatory |
| 4.6.16 | TdsOnPLB | Decimal | TDS on PerformanceLinked Bonus | Mandatory |
| 4.6.17 | TdsOnIncentive | Decimal | TDS on the incentive earned | Mandatory |
| 4.6.18 | ServiceFee | Decimal | Service Fee | Mandatory |
| 4.7 | FareBreakdown[] |  | Details of fare breakup into divide the base fare and tax from this array with the passanger count several part. It give fare of and then pass that fare in the ticket or book request Each Passenger Type. |  |
| 4.7.1 | Currency | String | Currency | Mandatory |
| 4.7.3 | PassengerCount | Integer | Number of Passenger | Mandatory |
| 4.7.3 | PassengerType | Integer | Type of Passenger Adult – 1 Child – 2 Infant – 3 | Mandatory |
| 4.7.4 | BaseFare | Decimal | Base fare | Mandatory |
| 4.7.5 | Tax | Decimal | Total tax | Mandatory |
| 4.7.6 | YQTax | Decimal | Fuel Surcharge | Mandatory |
| 4.7.7 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 4.7.8 | AdditionalTxnFeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 4.8 | Segments[] |  |  |  |
| 4.8.1 | TripIndicator | Integer | Trip Indicator | Mandatory |
| 4.8.2 | SegmentIndicator | Integer | Segment Indicator | Mandatory |
| 4.8.3 | Airline |  |  |  |
| 4.8.3.1 | AirlineCode | String | Airline code | Mandatory |
| 4.8.3.2 | AirlineName | String | Airline name | Mandatory |
| 4.8.3.3 | FlightNumber | String | Flight Number | Mandatory |
| 4.8.3.4 | FareClass | String | Fare Class | Mandatory |
| 4.8.3.5 | OperatingCarrier | String | Operating Carrier | Mandatory |
| 4.8.4 | Origin |  |  |  |
| 4.8.4.1 | Airport |  |  |  |
| 4.8.4.1.1 | AirportCode | String | Airport code | Mandatory |
| 4.8.4.1.2 | AirportName | String | Airport name | Optional |
| 4.8.4.1.3 | Terminal | String | Terminal number | Optional |
| 4.8.4.1.4 | CityCode | String | City code | Mandatory |
| 4.8.4.1.5 | CityName | String | City name | Mandatory |
| 4.8.4.1.6 | CountryCode | String | Country code | Mandatory |
| 4.8.4.1.7 | CountryName | String | Country name | Mandatory |
| 4.8.5 | DepTime | Date Time | Departure time | Mandatory |
| 4.8.6 | Destination |  |  |  |
| 4.8.6.1 | Airport |  |  |  |
| 4.8.6.1.2 | AirportName | String | Airport name | Optional |
| 4.8.6.1.3 | Terminal | String | Terminal number | Optional |
| 4.8.6.1.4 | CityCode | String | City code | Mandatory |
| 4.8.6.1.5 | CityName | String | City name | Mandatory |
| 4.8.6.1.6 | CountryCode | String | Country code | Mandatory |
| 4.8.6.1.7 | CountryName | String | Country name | Mandatory |
| 4.8.7 | ArrTime | Date Time | Arrival time | Mandatory |
| 4.8.8 | Duration | Time | Duration | Optional |
| 4.8.9 | GroundTime | Time | Ground time | Optional |
| 4.8.10 | Mile | String | Miles | Optional |
| 4.8.11 | StopOver |  |  |  |
| 4.8.12 | StopPoint | String | Stopover point | Optional |
| 4.8.13 | StopPointArrivalTime | Date Time | Stopover arrival time | Optional |
| 4.8.14 | StopPointDepartureTime | Date Time | Stopover departure time | Optional |
| 4.8.15 | Craft | String | Craft | Optional |
| 4.8.16 | IsETicketEligible | Boolean | Value – true or false | Mandatory |
| 4.8.17 | FlightStatus | String | Flight status | Mandatory |
| 4.8.18 | Status | String | Status | Mandatory |
| 4.9 | LastTicketDate | Date Time | Last ticket date | Mandatory |
| 4.1 | TicketAdvisory | String | Ticket Advisory | Optional |
| 4.11 | FareRules |  | This is the fare rules of the flight fare offered |  |
| 4.11.1 | Origin | String | Origin | Mandatory |
| 4.11.2 | Destination | String | Destination | Mandatory |
| 4.11.3 | Airline | String | Airline | Mandatory |
| 4.11.4 | FareBasisCode | String | Fare basis code | Mandatory |
| 4.11.5 | FareRuleDetail | String List | Fare rule details | Mandatory |
| 4.11.6 | FareRestriction | String | Fare restriction | Mandatory |
| 4.13 | ValidatingAirline | String | Validating airline | Mandatory |
| 4.14 | Error |  |  | Mandatory |
| 4.14.1 | ErrorCode | Integer | Code corresponding to the Error | Mandatory |
| 4.14.2 | ErrorMessage | String | Contains error message (Will contain error description corresponding to ErrorCode. Error Message would be blank in case ErrorCode=0) | Mandatory |
| 5 | Penalty |  | Cancellation/Re-issuance | Optional |
| 5.1 | ReissueCharge | Amount | Re-issuance Charge | Optional |
| 5.2 | CancellationCharge | Amount | CancellationCharge | Optional |
### Verbatim content of `FareQuote_Json.aspx`

```json
	
        FareQuote Request
{
"EndUserIp": "192.168.5.56",
"TokenId": "ac2751e9-4cc3-406f-b678-c947e4f57a00",
"TraceId": "f140170f-2b71-4b51-9cec-423a8f0bfef3",
"ResultIndex": "OB2[TBO]ZJfnrNr3lGdOyRzztpRBmpqAnpA8mmd12UtfkktuuMcRXXF+7PK+"
}

    
```
```json
	
        FareQuote Response
{
    "Response": {
        "Error": {
            "ErrorCode": 0,
            "ErrorMessage": ""
        },
        "FlightDetailChangeInfo": "Baggage",
        "IsPriceChanged": false,
        "ResponseStatus": 1,
        "Results": {
            "FirstNameFormat": "If FirstName is missing, Update FirstName as LastName.\r\n\t\t\t",
            "IsBookableIfSeatNotAvailable": true,
            "IsHoldAllowedWithSSR": false,
            "LastNameFormat": "If LastName is missing, Update LastName and FirstName as FirstName.\r\n\t\t\t",
            "ResultIndex": "OB2[TBO]ZJfnrNr3lGdOyRzztpRBmpqAnpA8mmd12UtfkktuuMcRXXF+7PK+/bnF1gS0v+UoWfYG/BwPX5S2UJu0HNhTZX+W/96o",
            "Source": 6,
            "IsLCC": true,
            "IsRefundable": true,
            "IsPanRequiredAtBook": false,
            "IsPanRequiredAtTicket": false,
            "IsPassportRequiredAtBook": false,
            "IsPassportRequiredAtTicket": false,
            "GSTAllowed": true,
            "IsCouponAppilcable": true,
            "IsGSTMandatory": false,
            "IsHoldAllowed": true,
            "AirlineRemark": "6E main.",
            "IsPassportFullDetailRequiredAtBook": false,
            "ResultFareType": "RegularFare",
            "Fare": {
                "Currency": "INR",
                "BaseFare": 9047,
                "Tax": 1439,
                "TaxBreakup": [
                    {
                        "key": "K3",
                        "value": 380
                    },
                    {
                        "key": "YQTax",
                        "value": 0
                    },
                    {
                        "key": "YR",
                        "value": 100
                    },
                    {
                        "key": "PSF",
                        "value": 182
                    },
                    {
                        "key": "UDF",
                        "value": 122
                    },
                    {
                        "key": "INTax",
                        "value": 0
                    },
                    {
                        "key": "TransactionFee",
                        "value": 0
                    },
                    {
                        "key": "OtherTaxes",
                        "value": 472
                    }
                ],
                "YQTax": 0,
                "AdditionalTxnFeeOfrd": 0,
                "AdditionalTxnFeePub": 0,
                "PGCharge": 0,
                "OtherCharges": 0,
                "ChargeBU": [
                    {
                        "key": "TBOMARKUP",
                        "value": 0
                    },
                    {
                        "key": "GLOBALPROCUREMENTCHARGE",
                        "value": 0
                    },
                    {
                        "key": "CONVENIENCECHARGE",
                        "value": 0
                    },
                    {
                        "key": "OTHERCHARGE",
                        "value": 0
                    }
                ],
                "Discount": 0,
                "PublishedFare": 10486,
                "CommissionEarned": 0,
                "PLBEarned": 0,
                "IncentiveEarned": 0,
                "OfferedFare": 10486,
                "TdsOnCommission": 0,
                "TdsOnPLB": 0,
                "TdsOnIncentive": 0,
                "ServiceFee": 0,
                "TotalBaggageCharges": 0,
                "TotalMealCharges": 0,
                "TotalSeatCharges": 0,
                "TotalSpecialServiceCharges": 0
            },
            "FareBreakdown": [
                {
                    "Currency": "INR",
                    "PassengerType": 1,
                    "PassengerCount": 1,
                    "BaseFare": 3690,
                    "Tax": 678,
                    "TaxBreakUp": [
                        {
                            "key": "PSF",
                            "value": 91
                        },
                        {
                            "key": "UDF",
                            "value": 61
                        },
                        {
                            "key": "YR",
                            "value": 50
                        },
                        {
                            "key": "K3",
                            "value": 190
                        },
                        {
                            "key": "OtherTaxes",
                            "value": 236
                        }
                    ],
                    "YQTax": 0,
                    "AdditionalTxnFeeOfrd": 0,
                    "AdditionalTxnFeePub": 0,
                    "PGCharge": 0,
                    "SupplierReissueCharges": 0
                },
                {
                    "Currency": "INR",
                    "PassengerType": 2,
                    "PassengerCount": 1,
                    "BaseFare": 3690,
                    "Tax": 678,
                    "TaxBreakUp": [
                        {
                            "key": "PSF",
                            "value": 91
                        },
                        {
                            "key": "UDF",
                            "value": 61
                        },
                        {
                            "key": "YR",
                            "value": 50
                        },
                        {
                            "key": "K3",
                            "value": 190
                        },
                        {
                            "key": "OtherTaxes",
                            "value": 236
                        }
                    ],
                    "YQTax": 0,
                    "AdditionalTxnFeeOfrd": 0,
                    "AdditionalTxnFeePub": 0,
                    "PGCharge": 0,
                    "SupplierReissueCharges": 0
                },
                {
                    "Currency": "INR",
                    "PassengerType": 3,
                    "PassengerCount": 1,
                    "BaseFare": 1667,
                    "Tax": 83,
                    "TaxBreakUp": null,
                    "YQTax": 0,
                    "AdditionalTxnFeeOfrd": 0,
                    "AdditionalTxnFeePub": 0,
                    "PGCharge": 0,
                    "SupplierReissueCharges": 0
                }
            ],
            "Segments": [
                [
                    {
                        "Baggage": "15 Kilograms",
                        "CabinBaggage": " 7 KG",
                        "CabinClass": 2,
                        "SupplierFareClass": null,
                        "TripIndicator": 1,
                        "SegmentIndicator": 1,
                        "Airline": {
                            "AirlineCode": "6E",
                            "AirlineName": "IndiGo",
                            "FlightNumber": "6047",
                            "FareClass": "RR",
                            "OperatingCarrier": ""
                        },
                        "Origin": {
                            "Airport": {
                                "AirportCode": "DEL",
                                "AirportName": "Indira Gandhi Airport",
                                "Terminal": "1",
                                "CityCode": "DEL",
                                "CityName": "Delhi",
                                "CountryCode": "IN",
                                "CountryName": "India"
                            },
                            "DepTime": "2024-12-30T11:15:00"
                        },
                        "Destination": {
                            "Airport": {
                                "AirportCode": "BOM",
                                "AirportName": "Chhatrapati Shivaji International Airport",
                                "Terminal": "2",
                                "CityCode": "BOM",
                                "CityName": "Mumbai",
                                "CountryCode": "IN",
                                "CountryName": "India"
                            },
                            "ArrTime": "2024-12-30T13:30:00"
                        },
                        "Duration": 135,
                        "GroundTime": 0,
                        "Mile": 0,
                        "StopOver": false,
                        "FlightInfoIndex": "",
                        "StopPoint": "",
                        "StopPointArrivalTime": "0001-01-01T00:00:00",
                        "StopPointDepartureTime": "0001-01-01T00:00:00",
                        "Craft": "321",
                        "Remark": null,
                        "IsETicketEligible": true,
                        "FlightStatus": "Confirmed",
                        "Status": "",
                        "FareClassification": {
                            "Type": "Publish"
                        }
                    }
                ]
            ],
            "LastTicketDate": "0001-01-01T00:00:00",
            "TicketAdvisory": null,
            "FareRules": [
                {
                    "Origin": "DEL",
                    "Destination": "BOM",
                    "Airline": "6E",
                    "FareBasisCode": "R0IP",
                    "FareRuleDetail": "",
                    "FareRestriction": "",
                    "FareFamilyCode": "",
                    "FareRuleIndex": ""
                }
            ],
            "AirlineCode": "6E",
            "MiniFareRules": [
                [
                    {
                        "JourneyPoints": "",
                        "Type": "",
                        "From": "",
                        "To": "",
                        "Unit": "",
                        "Details": ""
                    }
                ]
            ],
            "ValidatingAirline": "6E",
            "FareClassification": {
                "Color": "lightBlue",
                "Type": "Publish"
            }
        },
        "TraceId": "f140170f-2b71-4b51-9cec-423a8f0bfef3"
    }
}

 
```

---

## SSR

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR`  
**Source pages:** https://apidoc.tektravels.com/flighT/SSR.aspx, https://apidoc.tektravels.com/flighT/SSR_Jason.aspx


### Verbatim content of `SSR.aspx`

This method is used to obtain the online prices of Special Service Request like Excess Baggage and Meal for LCC airlines like Indigo, Spice Jet, Air Asia, Air Arabia, Fly Dubai, etc. For LCC Airlines which currently do not support online SSR requests, the SSR request will not return Excess Baggage and meal charges. To avail excess baggage and meal services, the selected baggage and meal needs to be passed in the ticket request with the applicable price. The total price deducted during ticketing would be addition of Offered Fare + Excess Baggage and Meal Charges.
This method is also accessed to get available meal and seat options for Non LCC airlines. For Non LCC carriers the meal and seat options received in the SSR response are indicative only and may be added in the ticket request for availing the same. The given information is passed to the GDS/ airline and depending on the availability, the same is provided to the customer. Non LCC airlines do not provide online confirmation for the meal and seat option selected by the customer.
NOTE :
In case of Fly Dubai and all the International LCC, the free baggage should be added from the SSR response to the ticket request then only you will be able to to avail yourself with the benefit.
If in case the free baggage is not selected from SSR response with Price node 0 then no free or default baggage would be provided from the airline end.
For Ex : 20 kg, 30 kg and 40 kg baggage are included in the fare only until and unless you will not select the this baggage in the ticket request you will not be able to avail yourself with the same.
NOTE :  In case of return sector, if you need to have baggage only for one segment in that case you need to add both the objects for inbound and outbound in an array format.
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR
SSR Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID | Mandatory(Token Id to be echoed back from Authenticate response) |
| 3 | TraceId | String | Trace Id | Mandatory(Trace Id to be echoed back from search response. This can be used to trace particular search/ book at TBO’s end) |
| 4 | ResultIndex | String | Result Index | Mandatory |

SSR Response For LCC

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | TraceId | String | Trace Id | Mandatory |
| 2 | ResponseStatus | String | Response status | Mandatory[NotSet = 0,Successfull = 1,Failed = 2,InValidRequest = 3,InValidSession = 4,InValidCredentials = 5] |
| 3 | Baggage[] |  |  |  |
| 3.1 | WayType | Integer | Way type | Mandatory[NotSet = 0Segment = 1FullJourney = 2] |
| 3.2 | Code | String | Baggage code | Mandatory |
| 3.3 | Weight | String | Baggage weight | Mandatory |
| 3.4 | Currency | String | Currency | Mandatory |
| 3.5 | Price | Decimal | Baggage price | Mandatory |
| 3.6 | Origin | String | Origin | Mandatory |
| 3.7 | Destination | String | Destination | Mandatory |
| 3.8 | AirlineCode | String | Airline Code | Mandatory |
| 3.9 | FlightNumber | String | Flight Number | Mandatory |
| 3.10 | Description | String | Description | Mandatory[NotSet = 0,Included = 1,Direct = 2(Purchase),Imported = 3,UpGrade = 4ImportedUpgrade = 5]In case of Included, baggage can be upgraded (if upgrade baggage option exists)And In case of Direct, baggage can't be upgraded. |
| 3.11 | Text | String | Detailed Description | 30 KG INTL Connecting Flights Baggage |
| 4 | MealDynamic[] |  |  |  |
| 4.1 | WayType | String | Way Type | Mandatory[Segment = 1,FullJourney = 2] |
| 4.2 | Code | String | Meal Code | Mandatory |
| 4.3 | Description | String | Description | Mandatory[Included = 1 (The fare includes the Meal), Direct = 2(The Meal charges are added while making the ticket), Imported = 3,(Meal charges are added while importing the ticket.)] |
| 4.4 | AirlineDescription | String | Meal description | Mandatory |
| 4.5 | Quantity | String | Meal quantity | Mandatory |
| 4.6 | Price | Decimal | Meal Price | Mandatory |
| 4.7 | Currency | String | Currency | Mandatory |
| 4.8 | Origin | String | String | Mandatory |
| 4.9 | Destination | String | Destination | Mandatory |
| 4.10 | AirlineCode | String | Airline Code | Mandatory |
| 4.11 | FlightNumber | String | Flight Number | Mandatory |
| 5 | SeatDynamic[] |  |  |  |
| 5.1 | SegmentSeat[] |  |  | Mandatory |
| 5.2 | RowSeats[] |  |  |  |
| 5.3 | Seats[] |  |  |  |
| 5.3.1 | AirlineCode | String | Airline Code | Mandatory |
| 5.3.2 | FlightNumber | String | Flight Number | Mandatory |
| 5.3.3 | CraftType | String | Craft Type Eg A320 | Mandatory |
| 5.3.4 | Origin | String | String | Mandatory |
| 5.3.5 | Destination | String | Destination | Mandatory |
| 5.3.6 | AvailablityType | String | SeatAvailalblityType | Mandatory [Notset = 0, Open = 1, Reserved = 3, Blocked = 4, NoSeatAtThisLocation = 5] |
| 5.3.7 | Description | String |  | Mandatory[Included = 1 (The fare includes the Seat), Purchase = 2 (The Seat charges are added while making the ticket)] |
| 5.3.8 | Code | String | Seat code | Mandatory |
| 5.3.9 | RowNo | String | Row No of Seat | Mandatory |
| 5.3.10 | SeatNo | String | SeatNo | Mandatory |
| 5.3.11 | SeatType | String | Seat Type | Mandatory[Window = 1,Aisle = 2,Middle = 3] |
| 5.3.12 | SeatWayType | String | SeatWayType | Mandatory[Segment = 1,FullJourney = 2] |
| 5.3.13 | Compartment | String | Compartment | Mandatory[Compartment1 = 1, Compartment2 = 2, Compartment3 = 3 etc] |
| 5.3.14 | Deck | String | Deck | Mandatory[Deck1 = 1,Deck2 = 2,Deck3 = 3] |
| 5.3.15 | Currency | String | Currency | Mandatory |
| 5.3.13 | Price | Decimal | Seat Price | Mandatory |
| 6 | Error |  |  |  |
| 6.1 | ErrorCode | Integer | Code corresponding to the Error | Mandatory |
| 6.2 | ErrorMessage | String | Contains error message | Mandatory(Will contain error description corresponding to ErrorCode. Error Message would be blank in case ErrorCode=0) |

SSR Response For Non LCC

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | TraceId | String | Trace Id | Mandatory(Trace Id to be echoed back in further requests) |
| 2 | ResponseStatus | String | Response status | Mandatory[NotSet = 0,Successfull = 1,Failed = 2,InValidRequest = 3,InValidSession = 4,InValidCredentials = 5] |
| 3 | SeatPreference |  |  |  |
| 3.1 | Code | String | Seat code | Mandatory |
| 3.2 | Description | String | Seat description | Mandatory |
| 4 | Meal |  |  |  |
| 4.1 | Code | String | Meal code | Mandatory |
| 4.2 | Description | String | Meal description | Mandatory |
| 5 | Error |  |  |  |
| 5.1 | ErrorCode | Integer | Code corresponding to the Error | Mandatory |
| 5.2 | ErrorMessage | String | Contains error message | Mandatory(Will contain error description corresponding to ErrorCode. Error Message would be blank in case ErrorCode=0) |

Download Seat Map - Sample Code (.Net):
https://apidoc.tektravels.com/fligh/doc/seat/SeatMapSampleAppDotNet.rar
### Verbatim content of `SSR_Jason.aspx`

```json
	
        SSR Request
{
"EndUserIp": "192.168.5.56",
"TokenId": "ac2751e9-4cc3-406f-b678-c947e4f57a00",
"TraceId": "f140170f-2b71-4b51-9cec-423a8f0bfef3",
"ResultIndex": "OB2[TBO]ZJfnrNr3lGdOyRzztpRBmpqAnpA8mmd12UtfkktuuMcRXXF+7PK+/bnF1gS0v+UoWfYG"
}

    
```
```json
	
        SSR Response for LCC
{
  "Response": {
    "ResponseStatus": 1,
    "Error": {
      "ErrorCode": 0,
      "ErrorMessage": ""
    },
    "TraceId": "f140170f-2b71-4b51-9cec-423a8f0bfef3",
    "Baggage": [
      [
        {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "NoBaggage",
                    "Description": 2,
                    "Weight": 0,
                    "Currency": "INR",
                    "Price": 0,
                    "Origin": "DEL",
                    "Destination": "BOM"
                },
                {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "XBPA",
                    "Description": 2,
                    "Weight": 5,
                    "Currency": "INR",
                    "Price": 2525,
                    "Origin": "DEL",
                    "Destination": "BOM"
                },
                {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "XBPB",
                    "Description": 2,
                    "Weight": 10,
                    "Currency": "INR",
                    "Price": 11385,
                    "Origin": "DEL",
                    "Destination": "BOM"
                },
                {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "XBPC",
                    "Description": 2,
                    "Weight": 15,
                    "Currency": "INR",
                    "Price": 7200,
                    "Origin": "DEL",
                    "Destination": "BOM"
                },
                {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "XBPD",
                    "Description": 2,
                    "Weight": 30,
                    "Currency": "INR",
                    "Price": 14400,
                    "Origin": "DEL",
                    "Destination": "BOM"
                }
            ]
        ],
        "MealDynamic": [
            [
                {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "NoMeal",
                    "Description": 2,
                    "AirlineDescription": "",
                    "Quantity": 0,
                    "Currency": "INR",
                    "Price": 0,
                    "Origin": "DEL",
                    "Destination": "BOM"
                },
                {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "TCSW",
                    "Description": 2,
                    "AirlineDescription": "Tomato Cucumber Cheese Lettuce Sandwich Combo",
                    "Quantity": 1,
                    "Currency": "INR",
                    "Price": 400,
                    "Origin": "DEL",
                    "Destination": "BOM"
                },
                {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "PTSW",
                    "Description": 2,
                    "AirlineDescription": "Paneer Tikka Sandwich Combo",
                    "Quantity": 1,
                    "Currency": "INR",
                    "Price": 500,
                    "Origin": "DEL",
                    "Destination": "BOM"
                },
                {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "CJSW",
                    "Description": 2,
                    "AirlineDescription": "Chicken Tikka Sandwich ombo",
                    "Quantity": 1,
                    "Currency": "INR",
                    "Price": 500,
                    "Origin": "DEL",
                    "Destination": "BOM"
                }
            ]
        ],
    "SeatDynamic": [
      {
        "SegmentSeat": [
          {
            "RowSeats": [
              {
                "Seats": [
                  {
                    "AirlineCode": "6E",
                    "FlightNumber": "23",
                    "CraftType": "A320",
                    "Origin": "DEL",
                    "Destination": "DXB",
                    "AvailablityType": 0,
                    "Description": 2,
                    "Code": "NoSeat",
                    "RowNo": "0",
                    "SeatNo": null,
                    "SeatType": 0,
                    "SeatWayType": 2,
                    "Compartment": 0,
                    "Deck": 0,
                    "Currency": "INR",
                    "Price": 0
                  }
                ]
              },
              {
                "Seats": [
                  {
                                        "AirlineCode": "6E",
                                        "FlightNumber": "6047",
                                        "CraftType": "A321-220",
                                        "Origin": "DEL",
                                        "Destination": "BOM",
                                        "AvailablityType": 0,
                                        "Description": 2,
                                        "Code": "NoSeat",
                                        "RowNo": "0",
                                        "SeatNo": null,
                                        "SeatType": 0,
                                        "SeatWayType": 2,
                                        "Compartment": 0,
                                        "Deck": 0,
                                        "Currency": "INR",
                                        "Price": 0
                                    }
                                ]
                            },
                            {
                                "Seats": [
                                    {
                                        "AirlineCode": "6E",
                                        "FlightNumber": "6047",
                                        "CraftType": "A321-220",
                                        "Origin": "DEL",
                                        "Destination": "BOM",
                                        "AvailablityType": 3,
                                        "Description": 2,
                                        "Code": "1A",
                                        "RowNo": "1",
                                        "SeatNo": "A",
                                        "SeatType": 1,
                                        "SeatWayType": 2,
                                        "Compartment": 1,
                                        "Deck": 1,
                                        "Currency": "INR",
                                        "Price": 3500
                                    },
                                    {
                                        "AirlineCode": "6E",
                                        "FlightNumber": "6047",
                                        "CraftType": "A321-220",
                                        "Origin": "DEL",
                                        "Destination": "BOM",
                                        "AvailablityType": 3,
                                        "Description": 2,
                                        "Code": "1C",
                                        "RowNo": "1",
                                        "SeatNo": "C",
                                        "SeatType": 2,
                                        "SeatWayType": 2,
                                        "Compartment": 1,
                                        "Deck": 1,
                                        "Currency": "INR",
                                        "Price": 3500
                                    }
                ]
              }
            ]
          }
        ]
      }
    ], 

	"SpecialServices": [
            {
                "SegmentSpecialService": [
                    {
                        "SSRService": [
                            {
                                "Origin": "DEL",
                                "Destination": "BOM",
                                "DepartureTime": "2024-12-30T11:15:00",
                                "AirlineCode": "6E",
                                "FlightNumber": "6047",
                                "Code": "FFWD",
                                "ServiceType": 3,
                                "Text": "Priority checkin is allowed",
                                "WayType": 4,
                                "Currency": "INR",
                                "Price": 600
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
        
    
```
```json
         Response for NON LCC
{"Response": {
"Error": {
"ErrorCode": 0,
"ErrorMessage": ""
},
"Meal": [
{
"Code": "AVML",
"Description": "Asian - Vegetarian"
},
{
"Code": "BBML",
"Description": "Baby/Infant Food"
        },
{
"Code": "BLML",
"Description": "Bland"
},
{
        "Code": "CHML",
"Description": "Child Food"
},
{
"Code": "DBML",
"Description": "Diabetic"
},
{
"Code": "FPML",
"Description": "Fruit Platter"
},
{
"Code": "GFML",
"Description": "Gluten Free"
        },
{
"Code": "HFML",
"Description": "High Fiber"
},
{
"Code": "HNML",
"Description": "Hindu - Non Veg"
},
{
"Code": "KSML",
        "Description": "Kosher"
},
{
"Code": "LCML",
"Description": "Low Calorie"
},
{
"Code": "LFML",
"Description": "Low Cholesterol/Fat"
},
{
"Code": "LPML",
"Description": "Low Protein"
},
{
"Code": "LSML",
        "Description": "Low Sodium/No Salt"
},
{
"Code": "MOML",
"Description": "Moslem"
},
{
"Code": "NLML",
"Description": "Non Lactose"
        },
{
"Code": "ORML",
"Description": "Oriental"
},
{
"Code": "PRML",
"Description": "Low Purin"
},
{
"Code": "RVML",
"Description": "Raw Vegetarian"
},
{
"Code": "SFML",
"Description": "Seafood"
        },
{
"Code": "SPML",
"Description": "Special Meal"
},
{
"Code": "VGML",
"Description": "Veg/Non Dairy"
},
        {
"Code": "VJML",
"Description": "Vegetarian Jain"
},
{
"Code": "VLML",
"Description": "Veg/Milk/Eggs"
},
{
"Code": "VOML",
"Description": "Vegetarian Oriental"
}
],
"ResponseStatus": 1,
"SeatPreference": [
        {
"Code": "A",
"Description": "Aisle"
}, {
"Code": "W",
"Description": "Window"
}
],
"TraceId": "2aa52fe7-705f-40a2-896e-5384c0c0db06"
}}


    
```

---

## Book (Non-LCC hold)

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Book`  
**Source pages:** https://apidoc.tektravels.com/flighT/Book.aspx, https://apidoc.tektravels.com/flighT/Book_Jason.aspx

Note: apivalidation.aspx says "Search and Book Url's are different" and gives the Book base as `http://api.tektravels.com/BookingEngineService_AirBook/AirService.svc`, while Book.aspx shows the `BookingEngineService_Air` URL above. Confirm the correct one with TBO.

### Verbatim content of `Book.aspx`

Book method is to hold the Booking of Non LCC airline. Every Non LCC airline must be Hold first before ticketing. It will not work for LCC airline because LCC airline is ticketed directly.
Price verification is done before creating a booking and PNR No. is returned in case of a successful booking.
In case of Price change or Time change, you will get new fare and/or new time in Book response with IsPriceChanged node and/or IsTimeChanged node set as ‘true’.
The price comparison is to be made at the client’s end, and Book request needs to be sent again with the updated fare and/ or updated time.
Passenger’s Date of Birth and Passport details are optional in book request wherever applicable. However, if not provided in book request then the same needs to be provided in Ticket request.
If in case there is any price or time chnage then you need to hit the ticket method only and the ticket would be generated with the updated price only.
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Book
Book Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID | Mandatory |
| 3 | TraceId | String | Trace Id | Mandatory |
| 4 | ResultIndex | String | Result Index | Mandatory |
| 5 | Passengers[] |  |  | Mandatory |
| 5.1 | Title | String | Title | Mandatory |
| 5.2 | FirstName | String | First name | Mandatory |
| 5.3 | LastName | String | Last name | Mandatory |
| 5.4 | PaxType | String | Pax type | Mandatory |
| 5.5 | DateOfBirth | Date Time | Date of birth | Optional |
| 5.6 | Gender | String | Gender | Mandatory |
| 5.7 | GSTCompanyAddress | String | GSTCompanyAddress | Mandatory |
| 5.8 | GSTCompanyContactNumber | String | GSTCompanyContactNumber | Mandatory |
| 5.9 | GSTCompanyName | String | GSTCompanyName | Mandatory |
| 5.10 | GSTNumber | String | GSTNumber | Mandatory |
| 5.11 | GSTCompanyEmail | String | GSTCompanyEmail | Mandatory |
| 5.12 | PassportNo | String | Passport no | Mandaory in case of IsPassportRequiredAtBook is TRUE in FareQuote response otherwise Optional |
| 5.13 | PassportExpiry | Date time | Passport expiry | Mandaory in case of IsPassportRequiredAtBook is TRUE in FareQuote response otherwise Optional |
| 5.14 | PassportIssueDate | Date time | Passport Issue Date | Mandaory in case of IsPassportFullDetailRequiredAtBook is TRUE in FareQuote response otherwise Optional |
| 5.15 | AddressLine1 | String | Address | Mandatory |
| 5.16 | AddressLine2 | String | Address | Optional |
| 5.17 | City | String | City | Mandatory |
| 5.18 | CountryCode | String | Country code | Mandatory |
| 5.19 | CountryName | String | Country name | Mandatory |
| 5.20 | ContactNo | String | Contact no | Mandatory |
| 5.21 | Email | String | Email | Mandatory |
| 5.22 | IsLeadPax | Boolean | Represent the lead guest of the booking (Value True/ False) | Mandatory |
| 5.23 | FFAirlineCode | String | FF airline Code | Optional |
| 5.24 | FFNumber | String | FF number | Optional |
| 5.25 | Fare |  |  |  |
| 5.25.1 | BaseFare | Decimal | Base fare | Mandatory |
| 5.25.2 | Tax | Decimal | Tax | Mandatory |
| 5.25.3 | TransactionFee | Decimal | Transaction fee | Mandatory |
| 5.25.4 | YQTax | Decimal | Fuel Surcharge | Mandatory |
| 5.25.5 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 5.25.6 | AdditionalTxnFeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 5.25.7 | AirTransFee | Decimal | Air trans fee | Mandatory |
| 5.26 | Meal |  |  |  |
| 5.26.1 | Code | String | Meal code | Optional |
| 5.26.2 | Description | String | Meal description | Optional |
| 5.27 | Seat |  |  |  |
| 5.27.1 | Code | String | Seat code | Optional |
| 5.27.2 | Description | String | Seat description | Optional |
| 5.28 | Nationality | String | Nationality | Mandatory |
| 5.29 | CellCountryCode | String | CellCountryCode | Optional[This is an optional node and can be send in Book/Ticket request, it will return the contact number with the passed CellCountryCode] |

Book Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | IsPriceChanged | Boolean | Represents whether price has changed or not (Value - True/ False) | Mandatory |
| 2 | IsTimeChanged | Boolean | Represents whether time has changed or not (Value - True/ False) | Mandatory |
| 3 | SSRDenied | String | SSR denied | Mandatory |
| 4 | SSRMessage | String | SSRMessage | Optional |
| 5 | Status | String | [NotSet = 0, Successful = 1, Failed = 2, OtherFare = 3, OtherClass = 4, BookedOther = 5, NotConfirmed = 6] | Mandatory |
| 6 | FlightItinerary |  |  |  |
| 6.1 | BookingId | Integer | Unique booking id | Mandatory |
| 6.2 | PNR | String | PNR no | Mandatory |
| 6.3 | IsDomestic | Boolean | Search Request is for domestic or international (Value – True or False) | Mandatory |
| 6.4 | Source | String | Airline Source | Mandatory |
| 6.5 | Origin | String | Origin | Mandatory |
| 6.6 | Destination | String | Destination | Mandatory |
| 6.7 | AirlineCode | String | Airline Code | Mandatory |
| 6.8 | ValidatingAirlineCode | String | Validating airline code | Mandatory |
| 6.9 | AirlineRemarks | String | Airline Remarks | Optional |
| 6.10 | IsLCC | Boolean | Is the result for LCC or Non LCC (Value – True or False) | Mandatory |
| 6.11 | NonRefundable | Boolean | Is the fare refundable or | Mandatory |
| 6.12 | FareType | String | FareType | Mandatory |
| 6.13 | Fare |  | Fare of search resultr |  |
| 6.13.1 | Currency | String | Currency | Mandatory |
| 6.13.2 | BaseFare | Decimal | Base fare | Mandatory |
| 6.13.3 | Tax | Decimal | Total tax | Mandatory |
| 6.13.4 | YQTax | Decimal | IP Address of the end user | Mandatory |
| 6.13.5 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 6.13.6 | AdditionalTxnFeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 6.13.7 | OtherCharges | Decimal | Other Charges | Mandatory |
| 6.13.8 | ChargeBU[] | String | Charge Break Up | Mandatory |
| 6.13.8.1 | TBOMarkUp | Decimal | TBO Mark-up | Mandatory |
| 6.13.8.2 | ConvenienceCharge | Decimal | Convenience Charge | Mandatory |
| 6.13.8.3 | OtherCharge | Decimal | Other Charge | Mandatory |
| 6.13.9 | Discount | Decimal | The total discount amount of the booking. Will be zero for API customer. | Mandatory |
| 6.13.10 | PublishedFare | Decimal | Published Fare | Mandatory |
| 6.13.11 | CommissionEarned | Decimal | Agent Commission | Mandatory |
| 6.13.12 | PLBEarned | Decimal | Performance Linked Bonus | Mandatory |
| 6.13.13 | IncentiveEarned | Decimal | Agent Incentive | Mandatory |
| 6.13.14 | OfferedFare | Decimal | Offerred Fare | Mandatory |
| 6.13.15 | TdsOnCommission | Decimal | TDS on the commission | Mandatory |
| 6.13.16 | TdsOnPLB | Decimal | TDS on Performance Linked Bonus | Mandatory |
| 6.13.17 | TdsOnIncentive | Decimal | TDS on the incentive | Mandatory |
| 6.13.18 | ServiceFee | Decimal | Service Fee | Mandatory |
| 6.14 | Passenger[] |  |  |  |
| 6.14.1 | PaxID | Integer | Unique pax id | Mandatory |
| 6.14.2 | Title | String | Title | Mandatory |
| 6.14.3 | FirstName | String | First Name | Mandatory |
| 6.14.4 | LastName | String | Last Name | Mandatory |
| 6.14.5 | PaxType | String | Pax Type | Mandatory |
| 6.14.6 | DateOfBirth | Date Time | Date of birth | Optional |
| 6.14.7 | Gender | String | Gender | Mandatory |
| 6.14.8 | PassportNo | String | Passport no | Optional |
| 6.14.9 | PassportExpiry | Date time | Passport expiry | Optional |
| 6.14.10 | AddressLine1 | String | Address | Mandatory |
| 6.14.11 | AddressLine2 | String | Address | Optional |
| 6.14.12 | City | String | City | Mandatory |
| 6.14.13 | CountryCode | String | Country Code | Mandatory |
| 6.14.14 | CountryName | String | Country Name | Mandatory |
| 6.14.15 | ContactNo | String | Contact No | Mandatory |
| 6.14.16 | Email | String | Email | Mandatory |
| 6.14.17 | IsLeadPax | Boolean | Represent the lead guest of the booking (Value - True/ False) | Mandatory |
| 6.14.18 | FFAirlineCode | String | FF airline | Optional |
| 6.14.19 | FFNumber | String | FF number | Optional |
| 6.14.20 | Fare |  |  |  |
| 6.14.20.1 | Currency | String | Currency | Mandatory |
| 6.14.20.2 | BaseFare | Decimal | Base fare | Mandatory |
| 6.14.20.3 | Tax | Decimal | Total tax | Mandatory |
| 6.14.20.4 | YQTax | Decimal | Fuel surcharge | Mandatory |
| 6.14.20.5 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 6.14.20.6 | AdditionalTxnFeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 6.14.20.7 | OtherCharges | Decimal | Other Charge | Mandatory |
| 6.14.20.8 | ChargeBU[] | String | It will contain different charge breakup that is service charge or Credit card charge.For details please refer ChargeBraekUp structure. | Mandatory |
| 6.14.20.8.1 | TBOMarkUp | Decimal | TBO Mark-up | Mandatory |
| 6.14.20.8.2 | ConvenienceCharge | Decimal | Convenience Charge | Mandatory |
| 6.14.20.8.3 | OtherCharge | Decimal | Other Charge | Mandatory |
| 6.14.20.9 | Discount | Decimal | The total discount amount of the booking. Will be zero for API customer. | Mandatory |
| 6.14.20.10 | PublishedFare | Decimal | Published Fare | Mandatory |
| 6.14.20.11 | CommissionEarned | Decimal | Agent Commission | Mandatory |
| 6.14.20.12 | PLBEarned | Decimal | Performance Linked Bonus | Mandatory |
| 6.14.20.13 | IncentiveEarned | Decimal | Agent Incentive | Mandatory |
| 6.14.20.14 | OfferedFare | Decimal | Offered Fare | Mandatory |
| 6.14.20.15 | TdsOnCommission | Decimal | TDS on the commission | Mandatory |
| 6.14.20.16 | TdsOnPLB | Decimal | TDS on Performance Linked Bonus | Mandatory |
| 6.14.20.17 | TdsOnIncentive | Decimal | TDS on the incentive | Mandatory |
| 6.14.20.18 | ServiceFee | Decimal | Service Fee | Mandatory |
| 6.14.21 | Meal |  |  |  |
| 6.14.21.1 | Code | String | Meal code | Optional |
| 6.14.21.2 | Description | String | Meal description | Optional |
| 6.14.22 | Seat |  |  |  |
| 6.14.22.1 | Code | String | Seat code | Optional |
| 6.14.22.2 | Description | String | Seat description | Optional |
| 6.14.23 | Nationality | String | Nationality | Mandatory |
| 6.15 | Segments |  |  |  |
| 6.15.1 | TripIndicator | Integer | Trip Indicator | Mandatory |
| 6.15.2 | SegmentIndicator | Integer | Segment Indicator | Mandatory |
| 6.15.3.1 | AirlineCode | String | Airline code | Mandatory |
| 6.15.3.2 | AirlineName | String | Airline name | Mandatory |
| 6.15.3.3 | FlightNumber | String | Flight Number | Mandatory |
| 6.15.3.4 | FareClass | String | Fare Class | Mandatory |
| 6.15.3.5 | OperatingCarrier | String | OperatingCarrier | Mandatory |
| 6.15.4 | Origin |  |  |  |
| 6.15.4.1 | Airport |  |  |  |
| 6.15.4.1.1 | AirportCode | String | Airport Code | Mandatory |
| 6.15.4.1.2 | AirportName | String | Airport Name | Optional |
| 6.15.4.1.3 | Terminal | String | Terminal number | Optional |
| 6.15.4.1.4 | CityCode | String | City code | Mandatory |
| 6.15.4.1.5 | CityName | String | City name | Mandatory |
| 6.15.4.1.6 | CountryCode | String | CountryCode | Mandatory |
| 6.15.4.1.7 | CountryName | String | CountryName | Mandatory |
| 6.15.4.2 | DepTime | Date Time | Departure time | Mandatory |
| 6.15.5 | Destination |  |  |  |
| 6.15.5.1 | Airport |  |  |  |
| 6.15.5.1.1 | AirportCode | String | Airport code | Mandatory |
| 6.15.5.1.2 | AirportName | String | Airport Name | Optional |
| 6.15.5.1.3 | Terminal | String | Terminal number | Optional |
| 6.15.5.1.4 | CityCode | String | City code | Mandatory |
| 6.15.5.1.5 | CityName | String | City Name | Mandatory |
| 6.15.5.1.6 | CountryCode | String | Country Code | Mandatory |
| 6.15.5.1.7 | CountryName | String | Country Name | Mandatory |
| 6.15.5.2 | ArrTime | Date Time | Arrival time | Mandatory |
| 6.15.5 | AirlinePNR | String | Airline pnr | Optional |
| 6.15.6 | AccumulatedDuration | Time | Accumulated duration | Optional |
| 6.15.7 | Duration | Time | Duration | Optional |
| 6.15.8 | GroundTime | Time | Ground time | Optional |
| 6.15.9 | Mile | String | Miles | Optional |
| 6.15.10 | StopOver |  |  |  |
| 6.15.11 | StopPoint | String | Stopover point | Optional |
| 6.15.12 | StopPointArrivalTime | Date Time | Stopover arrival time | Optional |
| 6.15.13 | StopPointDepartureTime | Date Time | Stopover departure time | Optional |
| 6.15.14 | Craft | String | Craft | Optional |
| 6.15.15 | IsETicketEligible | Boolean | Is E-Ticket eligible | Mandatory |
| 6.15.16 | FlightStatus | String | Flight status | Mandatory |
| 6.15.17 | Status | String | Flight status code | Mandatory |
| 6.16 | LastTicketDate | Date Time | Last ticket date | Mandatory |
| 6.17 | TicketAdvisory | String | Ticket Advisory | Optional |
| 6.18 | FareRules |  | This is the fare rules of the flight fare offeredr |  |
| 6.18.1 | Origin | String | Origin | Mandatory |
| 6.18.2 | Destination | String | Destination | Mandatory |
| 6.18.3 | Airline | String | Airline | Mandatory |
| 6.18.4 | FareBasisCode | String | Fare Basis Code | Mandatory |
| 6.18.5 | FareRuleDetail | String List | Fare Rule Detail | Mandatory |
| 6.18.6 | FareRestriction | String | FareRestriction | Mandatory |
| 6.18.7 | GSTCompanyAddress | String | GSTCompanyAddress | Mandatory |
| 6.18.8 | GSTCompanyContactNumber | String | GSTCompanyContactNumber | Mandatory |
| 6.18.9 | GSTCompanyName | String | GSTCompanyName | Mandatory |
| 6.18.10 | GSTNumber | String | GSTNumber | Mandatory |
| 6.18.11 | GSTCompanyEmail | String | GSTCompanyEmail | Mandatory |
### Verbatim content of `Book_Jason.aspx`

```json
	
   Book Request
{
	"ResultIndex": "OB48",
	"Passengers": [{
		"Title": "Mr",
		"FirstName": "hgjsshsxsgjh",
		"LastName": "tbotest",
		"PaxType": 1,
		"DateOfBirth": "1987-12-06T00:00:00",
		"Gender": 1,
		"PassportNo": "KJHHJKHKJH",
		"PassportExpiry": "2020-12-06T00:00:00",
		"AddressLine1": "123, Test",
		"AddressLine2": "",
		"Fare": {
			"Currency": "INR",
			"BaseFare": 3171.0,
			"Tax": 1284.0,
			"YQTax": 0.0,
			"AdditionalTxnFeePub": 0.0,
			"AdditionalTxnFeeOfrd": 0.0,
			"OtherCharges": 116.96,
			"Discount": 0.0,
			"PublishedFare": 4581.96,
			"OfferedFare": 4355.03,
			"TdsOnCommission": 6.34,
			"TdsOnPLB": 9.14,
			"TdsOnIncentive": 6.22,
			"ServiceFee": 10.0
		},
		"City": "Gurgaon",
		"CountryCode": "IN",
		"CellCountryCode" : "+92581-",
                "ContactNo": "1234567890",
		"Nationality": "IN",
                "Email": "harsh@tbtq.in",
		"IsLeadPax": true,
		"FFAirlineCode": null,
		"FFNumber": "",
		"GSTCompanyAddress": "",
		"GSTCompanyContactNumber": "",
		"GSTCompanyName": "",
		"GSTNumber": "",
		"GSTCompanyEmail": ""
	}],
	"EndUserIp": "192.168.11.58",
	"TokenId": "2abbe90b-7984-4442-a96a-cd7d32554076",
	"TraceId": "5cfdf80d-7b55-4e9d-a6c1-21f091dc6ee7"
}

    
```
```json
	
    
  Book Response
        {
	"Error": {
		"ErrorCode": 0,
		"ErrorMessage": ""
	},
	"TraceId": "5cfdf80d-7b55-4e9d-a6c1-21f091dc6ee7",
	"ResponseStatus": 1,
	"Response": {
		"PNR": "WFWVIA",
		"BookingId": 1304924,
		"SSRDenied": false,
		"SSRMessage": null,
		"Status": 1,
		"IsPriceChanged": false,
		"IsTimeChanged": false,
		"FlightItinerary": {
			"BookingAllowedForRoamer": true,
			"BookingId": 1304924,
			"PNR": "WFWVIA",
			"IsManual": false,
			"Source": 4,
			"IsDomestic": true,
			"Origin": "DEL",
			"Destination": "BOM",
			"AirlineCode": "AI",
			"ValidatingAirlineCode": "AI",
			"LastTicketDate": "29JUN17",
			"AirlineTollFreeNo": "1800-1100-2200-100",
			"IsLCC": false,
			"NonRefundable": true,
			"AirlineRemark": "",
			"FareType": "RP",
			"CreditNoteNo": null,
			"BaseCurrencyFare": {
				"Currency": "INR",
				"BaseFare": 3171.0,
				"Tax": 1284.0,
				"TaxBreakup": [{
					"Key": "YQTax",
					"Value": 0.0
				}, {
					"Key": "YR",
					"Value": 140.0
				}, {
					"Key": "TotalTax",
					"Value": 1284.0
				}],
				"YQTax": 0.0,
				"AdditionalTxnFeePub": 0.0,
				"PGCharge": 0.0,
				"AdditionalTxnFeeOfrd": 0.0,
				"OtherCharges": 116.96,
				"ChargeBU": [{
					"Key": "TBOMARKUP",
					"Value": 26.81
				}, {
					"Key": "CONVENIENCECHARGE",
					"Value": 0.0
				}, {
					"Key": "OTHERCHARGE",
					"Value": 90.15
				}],
				"Discount": 0.0,
				"PublishedFare": 4581.96,
				"CommissionEarned": 63.42,
				"PLBEarned": 91.36,
				"IncentiveEarned": 62.15,
				"OfferedFare": 4355.03,
				"TdsOnCommission": 6.34,
				"TdsOnPLB": 9.14,
				"TdsOnIncentive": 6.22,
				"ServiceFee": 10.0,
				"TotalBaggageCharges": 0.0,
				"TotalMealCharges": 0.0,
				"TotalSeatCharges": 0.0,
				"TotalSpecialServiceCharges": 0.0
			},
			"Fare": {
				"Currency": "INR",
				"BaseFare": 3171.0,
				"Tax": 1284.0,
				"TaxBreakup": [{
					"Key": "YQTax",
					"Value": 0.0
				}, {
					"Key": "YR",
					"Value": 140.0
				}, {
					"Key": "TotalTax",
					"Value": 1284.0
				}],
				"YQTax": 0.0,
				"AdditionalTxnFeePub": 0.0,
				"PGCharge": 0.0,
				"AdditionalTxnFeeOfrd": 0.0,
				"OtherCharges": 116.96,
				"ChargeBU": [{
					"Key": "TBOMARKUP",
					"Value": 26.81
				}, {
					"Key": "CONVENIENCECHARGE",
					"Value": 0.0
				}, {
					"Key": "OTHERCHARGE",
					"Value": 90.15
				}],
				"Discount": 0.0,
				"PublishedFare": 4581.96,
				"CommissionEarned": 63.42,
				"PLBEarned": 91.36,
				"IncentiveEarned": 62.15,
				"OfferedFare": 4355.03,
				"TdsOnCommission": 6.34,
				"TdsOnPLB": 9.14,
				"TdsOnIncentive": 6.22,
				"ServiceFee": 10.0,
				"TotalBaggageCharges": 0.0,
				"TotalMealCharges": 0.0,
				"TotalSeatCharges": 0.0,
				"TotalSpecialServiceCharges": 0.0
			},
			"CreditNoteCreatedOn": null,
			"Passenger": [{
				"PaxId": 1785775,
				"Title": "Mr",
				"FirstName": "hgjsshsxsgjh",
				"LastName": "tbotest",
				"PaxType": 1,
				"DateOfBirth": "1987-12-06T00:00:00",
				"Gender": 1,
				"PassportNo": "KJHHJKHKJH",
				"PassportExpiry": "2020-12-06T00:00:00",
				"AddressLine1": "123, Test",
				"AddressLine2": "",
				"Fare": {
					"Currency": "INR",
					"BaseFare": 3171.0,
					"Tax": 1284.0,
					"TaxBreakup": [{
						"Key": "YQTax",
						"Value": 0.0
					}, {
						"Key": "YR",
						"Value": 140.0
					}, {
						"Key": "TotalTax",
						"Value": 1284.0
					}],
					"YQTax": 0.0,
					"AdditionalTxnFeePub": 0.0,
					"PGCharge": 0.0,
					"AdditionalTxnFeeOfrd": 0.0,
					"OtherCharges": 116.96,
					"ChargeBU": [{
						"Key": "TBOMARKUP",
						"Value": 26.81
					}, {
						"Key": "CONVENIENCECHARGE",
						"Value": 0.0
					}, {
						"Key": "OTHERCHARGE",
						"Value": 90.15
					}],
					"Discount": 0.0,
					"PublishedFare": 4581.96,
					"CommissionEarned": 63.42,
					"PLBEarned": 91.36,
					"IncentiveEarned": 62.15,
					"OfferedFare": 4355.03,
					"TdsOnCommission": 6.34,
					"TdsOnPLB": 9.14,
					"TdsOnIncentive": 6.22,
					"ServiceFee": 10.0,
					"TotalBaggageCharges": 0.0,
					"TotalMealCharges": 0.0,
					"TotalSeatCharges": 0.0,
					"TotalSpecialServiceCharges": 0.0
				},
				"City": "Gurgaon",
				"CountryCode": "IN",
				"CountryName": "India",
				"Nationality": "IN",
				"ContactNo": "+92581-1234567890",
				"Email": "harsh@tbtq.in",
				"IsLeadPax": true,
				"FFAirlineCode": null,s
				"FFNumber": "",
				"GSTCompanyAddress": "A-fhgjkhsjkfd",
				"GSTCompanyContactNumber": "98881063278748979",
				"GSTCompanyName": "nikhil",
				"GSTNumber": "700932234532413",
				"GSTCompanyEmail": "nikhil123@gmail.com"
			}],
			"CancellationCharges": null,
			"Segments": [{
				"Baggage": null,
				"CabinBaggage": null,
				"TripIndicator": 1,
				"SegmentIndicator": 1,
				"Airline": {
					"AirlineCode": "AI",
					"AirlineName": "Air India",
					"FlightNumber": "544",
					"FareClass": "S",
					"OperatingCarrier": "AI"
				},
				"AirlinePNR": "",
				"Origin": {
					"Airport": {
						"AirportCode": "DEL",
						"AirportName": "Indira Gandhi Airport",
						"Terminal": "3",
						"CityCode": "DEL",
						"CityName": "Delhi",
						"CountryCode": "IN",
						"CountryName": "India"
					},
					"DepTime": "2017-08-15T13:15:00"
				},
				"Destination": {
					"Airport": {
						"AirportCode": "HYD",
						"AirportName": "Shamsabad International Airport",
						"Terminal": "",
						"CityCode": "HYD",
						"CityName": "Hyderabad",
						"CountryCode": "IN",
						"CountryName": "India"
					},
					"ArrTime": "2017-08-15T15:15:00"
				},
				"Duration": 0,
				"GroundTime": 0,
				"Mile": 0,
				"StopOver": false,
				"StopPoint": "",
				"StopPointArrivalTime": "2017-08-15T15:15:00",
				"StopPointDepartureTime": "2017-08-15T13:15:00",
				"Craft": "320",
				"Remark": "DEPARTURE DEL TERMINAL 3 / ARRIVAL HYD TERMINAL, SEE RTSVC",
				"IsETicketEligible": false,
				"FlightStatus": "Confirmed",
				"Status": "HK"
			}, {
				"Baggage": null,
				"CabinBaggage": null,
				"TripIndicator": 1,
				"SegmentIndicator": 2,
				"Airline": {
					"AirlineCode": "AI",
					"AirlineName": "Air India",
					"FlightNumber": "318",
					"FareClass": "S",
					"OperatingCarrier": "AI"
				},
				"AirlinePNR": "",
				"Origin": {
					"Airport": {
						"AirportCode": "HYD",
						"AirportName": "Shamsabad International Airport",
						"Terminal": "",
						"CityCode": "HYD",
						"CityName": "Hyderabad",
						"CountryCode": "IN",
						"CountryName": "India"
					},
					"DepTime": "2017-08-15T17:00:00"
				},
				"Destination": {
					"Airport": {
						"AirportCode": "BOM",
						"AirportName": "Mumbai",
						"Terminal": "",
						"CityCode": "BOM",
						"CityName": "Mumbai",
						"CountryCode": "IN",
						"CountryName": "India"
					},
					"ArrTime": "2017-08-15T18:25:00"
				},
				"AccumulatedDuration": 310,
				"Duration": 0,
				"GroundTime": 0,
				"Mile": 0,
				"StopOver": false,
				"StopPoint": "",
				"StopPointArrivalTime": "2017-08-15T18:25:00",
				"StopPointDepartureTime": "2017-08-15T17:00:00",
				"Craft": "319",
				"Remark": null,
				"IsETicketEligible": false,
				"FlightStatus": "Confirmed",
				"Status": "HK"
			}],
			"FareRules": [{
				"Origin": "DEL",
				"Destination": "HYD",
				"Airline": "AI",
				"FareBasisCode": "SAP20",
				"FareRuleDetail": "Advance PurchaseFare Component SAP20  Sector DEL-HYD  Fare Component SAP20  Sector HYD-BOM  Earliest reservation date before departure No restrictionEarliest ticketing date before departure No restrictionLatest reservation date before departure No restrictionLatest ticketing date before departure 26JUL17  2359Latest ticketing date after reservation No restrictionThere is no Minimum Stay requirementThere is no Maximum Stay requirementAdultRevalidation/ReissueFare Component SAP20  Sector DEL-HYD  Revalidation before/after departure, including failure to show at first/subsequent flight(s) : Not AllowedReissue, including failure to show at first flight : Allowed with RestrictionsPrior to Departure of journeyReissuePenalty fee : 2500 INR(at today exchange rates 2500 INR) Maximum reissue penalty fee for entire ticket (per reissue) : 5000 INRRevalidation/Reissue request must be made prior to : No restrictionFailure to show at first flightReissuePenalty fee between : 0 INR/2500 INRMaximum reissue penalty fee for entire ticket (per reissue) : 5000 INRRevalidation/Reissue request must be made prior to : No restrictionAfter departure of journeyRevalidation/Reissue request must be made prior to : No restrictionFailure to show at subsequent flight(s)Revalidation/Reissue request must be made prior to : No restrictionRevalidation/ReissueFare Component SAP20  Sector HYD-BOM  Revalidation before/after departure, including failure to show at first/subsequent flight(s) : Not AllowedReissue before/after departure, including failure to show at first/subsequent flight(s) : Allowed with RestrictionsPrior to Departure of journeyReissuePenalty fee : 2500 INR(at today exchange rates 2500 INR) Maximum reissue penalty fee for entire ticket (per reissue) : 5000 INRRevalidation/Reissue request must be made prior to : No restrictionFailure to show at first flightReissuePenalty fee between : 0 INR/5000 INRMaximum reissue penalty fee for entire ticket (per reissue) : 5000 INRRevalidation/Reissue request must be made prior to : No restrictionAfter departure of journeyReissuePenalty fee : 2500 INR(at today exchange rates 2500 INR) Maximum reissue penalty fee for entire ticket (per reissue) : 2500 INRRevalidation/Reissue request must be made prior to : No restrictionFailure to show at subsequent flight(s)ReissuePenalty fee between : 0 INR/2500 INRMaximum reissue penalty fee for entire ticket (per reissue) : 2500 INRRevalidation/Reissue request must be made prior to : No restrictionRefundFare Component SAP20  Sector DEL-HYD  Refund, including failure to show at subsequent flight(s) : Not AllowedPrior to Departure of journeyRefund : Not AllowedRefund request must be made prior to : No restrictionFailure to show at first flightRefund : Allowed with RestrictionsPenalty fee : 2500 INR(at today exchange rates 2500 INR) Maximum Refund penalty fee for entire ticket : 2500 INRRefund request must be made prior to : No restrictionAfter departure of journeyRefund request must be made prior to : No restrictionFailure to show at subsequent flight(s)Refund request must be made prior to : No restrictionRefundFare Component SAP20  Sector HYD-BOM  Prior to Departure of journeyRefund : Not AllowedRefund request must be made prior to : No restrictionFailure to show at first flightRefund : Allowed with RestrictionsRefund : Allowed, Check with Agent for further detailsMaximum Refund penalty fee for entire ticket : 2500 INRRefund request must be made prior to : No restrictionAfter departure of journeyRefund : Not AllowedRefund request must be made prior to : No restrictionFailure to show at subsequent flight(s)Refund : Allowed with RestrictionsRefund : Allowed, Check with Agent for further detailsMaximum Refund penalty fee for entire ticket : No chargeRefund request must be made prior to : No restriction* Revalidation is a modification of the original ticket without any reissue of a new ticket.* For Reissue, Penalty fees are in addition to any difference in fare.* For Refund, certain Taxes are non-refundable.",
				"FareRestriction": "Y"
			}, {
				"Origin": "HYD",
				"Destination": "BOM",
				"Airline": "AI",
				"FareBasisCode": "SAP20",
				"FareRuleDetail": "Please refer above.",
				"FareRestriction": "Y"
			}],
			"Status": 1,
			"BookingHistory": [{
				"BookingId": 1304924,
				"EventCategory": 1,
				"Remarks": "Booking is on hold. (through BookingEngine Service),  Booked By Auto (IP Address :- 192.168.11.58) | MSDTC OFF",
				"CreatedOn": "2017-06-29T16:13:12",
				"CreatedBy": 9102,
				"CreatedByName": "Vikask test",
				"LastModifiedOn": "2017-06-29T16:13:12",
				"LastModifiedBy": 9102,
				"LastModifiedByName": "Vikask test"
			}]
		}
	}
}

    
```

---

## Ticket

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket`  
**Source pages:** https://apidoc.tektravels.com/flighT/Ticket.aspx, https://apidoc.tektravels.com/flighT/Ticket_Jason.aspx


### Verbatim content of `Ticket.aspx`

This method is to be called to generate ticket for both LCCs and Non LCCs (already booked itinerary).
Price verification is done before creating a booking/ ticket and PNR No. is returned in case of a successful booking
In case of Price change or Time change, you will get new fare and/or new time in Ticket response with IsPriceChanged node and/or IsTimeChanged node set as ‘true’.
The price comparison is to be made at the client’s end, and Book request needs to be sent again with the updated fare and/ or updated time.
Also, in case of Non LCC bookings, if Passenger’s Date of Birth and Passport details are not provided in the book response, then the same needs to be provided when calling ticket method wherever applicable.
If in case there is a price change at the time of ticketing then hit the ticket method again with the updated price and "IsPriceChangeAccepted" node true and the ticket would be generated with the updated price.
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket
Ticket Request for Non LCC

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID (Token Id to be echoed back from Authenticate response) | Mandatory |
| 3 | TraceId | String | Trace Id (Trace Id to be echoed back from search response. This can be used to trace particular search/ book at TBO’s end) | Mandatory |
| 4 | PNR | String | PNR number | Mandatory |
| 5 | BookingId | Integer | Unique booking id | Mandatory |
| 6 | Passport[] | List of Passenger Passport List |  |  |
| 6.1 | PaxId | Integer | Unique Pax id | Optional |
| 6.2 | PassportNo | String | Passport no | Optional |
| 6.3 | PassportExpiry | Date time | Passport expiry | Optional |
| 6.4 | DateOfBirth | Date Time | Date of birth | Mandatory |
| 7 | IsPriceChangeAccepted | Boolean | In Case Price has changed then this node need to passed true as acceptance for successful booking. | Optional |

Ticket Request for LCC

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID | Mandatory |
| 3 | TraceId | String | Trace Id | Mandatory |
| 4 | ResultIndex | String | Result Index | Mandatory |
| 5 | Passengers[] |  |  | Mandatory |
| 5.1 | Title | String | Title (Adult Mr/Mrs Child Miss/Mstr Infant Miss/Mstr) | Mandatory |
| 5.2 | FirstName | String | First name | Mandatory |
| 5.3 | LastName | String | Last name | Mandatory |
| 5.4 | PaxType | String | Pax type (Adult = 1,Child = 2,Infant = 3) | Mandatory |
| 5.5 | DateOfBirth | Date Time | Date of birth | Optional |
| 5.6 | Gender | String | Gender (Male=1,Female=2) | Mandatory |
| 5.7 | PassportNo | String | Passport no | Optional |
| 5.8 | PassportExpiry | Date time | Passport expiry | Optional |
| 5.9 | AddressLine1 | String | Address | Mandatory |
| 5.10 | AddressLine2 | String | Address | Optional |
| 5.11 | City | String | City | Mandatory |
| 5.12 | CountryCode | String | Country code | Mandatory |
| 5.13 | CountryName | String | Country name | Mandatory |
| 5.14 | ContactNo | String | Contact no | Mandatory |
| 5.15 | Email | String | Email | Mandatory |
| 5.16 | IsLeadPax | Boolean | Represent the lead guest of the booking (Value True/ False) | Mandatory |
| 5.17 | FFAirlineCode | String | FF airline code | Optional |
| 5.18 | FFNumber | String | FF number | Optional |
| 5.19 | GSTCompanyAddress | String | GSTCompanyAddress | Mandatory |
| 5.20 | GSTCompanyContactNumber | String | GSTCompanyContactNumber | Mandatory |
| 5.21 | GSTCompanyName | String | GSTCompanyName | Mandatory |
| 5.22 | GSTNumber | String | GSTNumber | Mandatory |
| 5.23 | GSTCompanyEmail | String | GSTCompanyEmail | Mandatory |
| 5.19 | Fare |  |  |  |
| 5.19.1 | BaseFare | Decimal | Base fare | Mandatory |
| 5.19.2 | Tax | Decimal | Tax | Mandatory |
| 5.19.3 | TransactionFee | Decimal | Transaction fee | Mandatory |
| 5.19.4 | YQTax | Decimal | Fuel Surcharge | Mandatory |
| 5.19.5 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 5.19.6 | AdditionalTxnFeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 5.19.7 | AirTransFee | Decimal | Air trans fee | Mandatory |
| 5.20 | Baggage |  |  |  |
| 5.20.1 | WayType | Enumeration | Way type [NotSet = 0Segment = 1,FullJourney = 2] |  |
| 5.20.2 | Code | String | Baggage code | Mandatory |
| 5.20.3 | Description | String | ([NotSet = 0,Included = 1,Direct = 2,Imported = 3,UpGrade = 4,ImportedUpgrade = 5]In case of Included, baggage can be upgraded (if upgrade baggage option exists)And In case of Direct, baggage can't be upgraded.) | Mandatory |
| 5.20.4 | Weight | String | Baggage weight | Mandatory |
| 5.20.5 | Currency | String | Currency | Mandatory |
| 5.20.6 | Price | Decimal | Baggage price | Mandatory |
| 5.20.7 | Origin | String | String | Mandatory |
| 5.20.8 | Destination | String | Destination | Mandatory |
| 5.21 | MealDynamic |  |  |  |
| 5.21.1 | WayType | Enumeration | Way Type [NotSet = 0,Segment = 1FullJourney = 2] | Mandatory |
| 5.21.2 | Code | String | Meal Code | Mandatory |
| 5.21.3 | Description | String | ([NotSet = 0,Included = 1,Direct = 2,Imported = 3,UpGrade = 4,ImportedUpgrade = 5] In case of Included, baggage can be upgraded (if upgrade baggage option exists)And In case of Direct, baggage can't be upgraded.) | Mandatory |
| 5.21.4 | AirlineDescription | String | Meal description | Mandatory |
| 5.21.5 | Quantity | String | Meal quantity | Mandatory |
| 5.21.6 | Price | Decimal | Meal Price | Mandatory |
| 5.21.7 | Currency | String | Currency | Mandatory |
| 5.21.8 | Origin | String | Origin | Mandatory |
| 5.21.9 | Destination | String | Destination | Mandatory |
| 5.21.10 | Nationality | String | Nationality | Mandatory |
| 6 | IsPriceChangeAccepted | Boolean | In Case Price has changed then this node need to passed true as acceptance for successful booking. | Optional |

Ticket Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | IsPriceChanged | Boolean | Represents whether price has changed or not | Mandatory (Value - True/ False) |
| 2 | IsTimeChanged | Boolean | Represents whether time has changed or not | Mandatory (Value - True/ False) |
| 3 | PNR | String | PNR number | Mandatory |
| 4 | BookingId | Integer | Unique booking id | Mandatory |
| 5 | SSRDenied | String | SSR denied | Mandatory |
| 6 | SSRMessage | String | SSR message | Optional |
| 7 | FlightItinerary |  |  |  |
| 7.1 | BookingId | Integer | Unique booking id | Mandatory |
| 7.2 | PNR | String | PNR no | Mandatory |
| 7.3 | IsDomestic | Boolean | Search request is for domestic or international | Mandatory |
| 7.4 | Source | String | Airline source | Mandatory |
| 7.5 | Origin | String | Origin | Mandatory |
| 7.6 | Destination | String | Destination | Mandatory |
| 7.7 | AirlineCode | String | Airline code | Mandatory |
| 7.8 | ValidatingAirlineCode | String | Validating airline code | Mandatory |
| 7.9 | AirlineRemarks | String | Airline remarks | Optional |
| 7.10 | IsLCC | Boolean | Is the result for LCC or Non LCC | Mandatory |
| 7.11 | NonRefundable | Boolean | Is the fare refundable or not | Mandatory |
| 7.12 | FareType | String | Fare type | Mandatory |
| 7.13 | Fare |  |  |  |
| 7.13.1 | Currency | String | Currency | Mandatory |
| 7.13.2 | BaseFare | Decimal | Base fare | Mandatory |
| 7.13.3 | Tax | Decimal | Total tax | Mandatory |
| 7.13.4 | YQTax | Decimal | Fuel surcharge | Mandatory |
| 7.13.5 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 7.13.6 | AdditionalTxnFeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 7.13.7 | OtherCharges | String | Other Charges | Mandatory |
| 7.13.8 | ChargeBU[] |  |  |  |
| 7.13.8.1 | TBOMarkUp | Decimal | TBO Mark-up | Mandatory |
| 7.13.8.2 | ConvenienceCharge | Decimal | Convenience Charge | Mandatory |
| 7.13.8.3 | OtherCharge | Decimal | Other Charge | Mandatory |
| 7.13.9 | Discount | Decimal | Discount | Mandatory |
| 7.13.10 | PublishedFare | Decimal | Published fare | Mandatory |
| 7.13.11 | CommissionEarned | Decimal | Agent commission | Mandatory |
| 7.13.12 | PLBEarned | Decimal | Performance Linked Bonus | Mandatory |
| 7.13.13 | IncentiveEarned | Decimal | Incentive applicable | Mandatory |
| 7.13.14 | OfferedFare | Decimal | Offerred fare | Mandatory |
| 7.13.15 | TdsOnCommission | Decimal | TDS on commission | Mandatory |
| 7.13.16 | TdsOnPLB | Decimal | TDS on Performance Linked Bonus | Mandatory |
| 7.13.17 | TdsOnIncentive | Decimal | TDS on the incentive | Mandatory |
| 7.13.18 | ServiceFee[] | Decimal | Service fee | Mandatory |
| 7.14 | Passenger[] |  |  |  |
| 7.14.1 | PaxID[] | Integer | Unique pax id | Mandatory |
| 7.14.2 | Title | String | Title | Mandatory |
| 7.14.3 | FirstName | String | First Name | Mandatory |
| 7.14.4 | LastName | String | Last Name | Mandatory |
| 7.14.5 | PaxType | String | Pax Type | Mandatory |
| 7.14.6 | DateOfBirth | Date Time | Date of birth | Mandatory |
| 7.14.7 | Gender | String | Gender | Mandatory |
| 7.14.8 | PassportNo | String | Passport no | Optional |
| 7.14.9 | PassportExpiry | Date time | Passport expiry | Optional |
| 7.14.10 | AddressLine1 | String | Address | Mandatory |
| 7.14.11 | AddressLine2 | String | Address | Optional |
| 7.14.12 | City | String | City | Mandatory |
| 7.14.13 | CountryCode | String | Country Code | Mandatory |
| 7.14.14 | CountryName | String | Country Name | Mandatory |
| 7.14.15 | ContactNo | String | Contact No | Mandatory |
| 7.14.16 | Email | String | Email | Mandatory |
| 7.14.17 | IsLeadPax | Boolean | Represent the lead guest of the booking (Value - True/ False) | Mandatory |
| 7.14.18 | FFAirlineCode | String | FF airline | Optional |
| 7.14.19 | FFNumber | String | FF number | Optional |
| 7.14.20 | Fare |  |  |  |
| 7.14.20.1 | Currency | String | Currency | Mandatory |
| 7.14.20.2 | BaseFare | Decimal | Base fare | Mandatory |
| 7.14.20.3 | Tax | Decimal | Total tax | Mandatory |
| 7.14.20.4 | YQTax | Decimal | Fuel surcharge | Mandatory |
| 7.14.20.5 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 7.14.20.6 | AdditionalTxnFeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 7.14.20.7 | OtherCharges | Decimal | Other Charge | Mandatory |
| 7.14.20.8 | ChargeBU[] |  |  | Mandatory |
| 7.14.20.8.1 | TBOMarkUp | Decimal | TBO Mark-up | Mandatory |
| 7.14.20.8.2 | ConvenienceCharge | Decimal | Convenience Charge | Mandatory |
| 7.14.20.8.3 | OtherCharge | Decimal | Other Charge | Mandatory |
| 7.14.20.9 | Discount | Decimal | The total discount amount of the booking. Will be zero for API customer. | Mandatory |
| 7.14.20.10 | PublishedFare | Decimal | Published Fare | Mandatory |
| 7.14.20.11 | CommissionEarned | Decimal | Agent Commission | Mandatory |
| 7.14.20.12 | PLBEarned | Decimal | Performance Linked Bonus | Mandatory |
| 7.14.20.13 | IncentiveEarned | Decimal | Agent Incentive | Mandatory |
| 7.14.20.14 | OfferedFare | Decimal | Offered Fare | Mandatory |
| 7.14.20.15 | TdsOnCommission | Decimal | TDS on the commission | Mandatory |
| 7.14.20.16 | TdsOnPLB | Decimal | TDS on Performance Linked Bonus | Mandatory |
| 7.14.20.17 | TdsOnIncentive | Decimal | TDS on the incentive | Mandatory |
| 7.14.20.18 | ServiceFee | Decimal | Service Fee | Mandatory |
| 7.14.21 | Baggage[] |  |  |  |
| 7.14.21.1 | WayType | Enumeration | Way type | Mandatory |
| 7.14.21.2 | Code | String | Baggage code | Mandatory |
| 7.14.21.3 | Description | String | Baggage description | Mandatory |
| 7.14.21.4 | Weight | String | Baggage weight | Mandatory |
| 7.14.21.5 | Currency | String | Currency | Mandatory |
| 7.14.21.6 | Price | Decimal | Baggage price | Mandatory |
| 7.14.21.7 | Origin | String | Origin | Mandatory |
| 7.14.21.8 | Destination | String | Destination | Mandatory |
| 7.14.22 | MealDynamic |  |  |  |
| 7.14.22.1 | WayType | Enumeration | Way type | Mandatory |
| 7.14.22.2 | Code | String | Meal code | Mandatory |
| 7.14.22.3 | Description | String | Description | Mandatory |
| 7.14.22.4 | AirlineDescription | String | Meal description | Mandatory |
| 7.14.22.5 | Quantity | String | Meal quantity | Mandatory |
| 7.14.22.6 | Price | Decimal | Meal price | Mandatory |
| 7.14.22.7 | Currency | String | Currency | Mandatory |
| 7.14.22.8 | Origin | String | Origin | Mandatory |
| 7.14.22.9 | Destination | String | Destination | Optional |
| 7.14.23 | Ticket |  |  |  |
| 7.14.23.1 | TicketId | Integer | Unique ticket id | Mandatory |
| 7.14.23.2 | TicketNumber | String | Ticket number | Mandatory |
| 7.14.23.3 | IssueDate | Date time | Ticket issue date | Mandatory |
| 7.14.23.4 | ValidatingAirline | String | Validating airline | Mandatory |
| 7.14.23.5 | Remarks | String | Remarks | Mandatory |
| 7.14.23.6 | ServiceFeeDisplayType | String | Service fee display type | Mandatory |
| 7.14.23.7 | Status | String | Booking Status [NotSet = 0, Successful = 1, Failed = 2, OtherFare = 3, OtherClass = 4, BookedOther = 5, NotConfirmed = 6] | Mandatory |
| 7.14.24 | SegmentAdditionalInfo |  |  |  |
| 7.14.24.1 | FareBasis | String | Fare basis | Mandatory |
| 7.14.24.2 | NVA | Date Time | Not valid after date | Mandatory |
| 7.14.24.3 | NVB | Date Time | Not valid before date | Mandatory |
| 7.14.24.4 | Baggage | String | Free baggage allowance | Mandatory |
| 7.14.24.5 | Meal | String | Meal | Mandatory |
| 7.15 | Segments |  |  |  |
| 7.15.1 | TripIndicator | Integer | Trip indicator | Mandatory |
| 7.15.2 | SegmentIndicator | Integer | Segment indicator | Mandatory |
| 7.15.3.1 | AirlineCode | String | Airline code | Mandatory |
| 7.15.3.2 | AirlineName | String | Airline name | Mandatory |
| 7.15.3.3 | FlightNumber | String | Flight Number | Mandatory |
| 7.15.3.4 | FareClass | String | Fare Class | Mandatory |
| 7.15.3.5 | OperatingCarrier | String | Operating Carrier | Mandatory |
| 7.15.4 | Origin |  |  |  |
| 7.15.4.1 | Airport |  |  |  |
| 7.15.4.1.1 | AirportCode | String | Airport Code | Mandatory |
| 7.15.4.1.2 | AirportName | String | Airport name | Optional |
| 7.15.4.1.3 | Terminal | String | Terminal number | Optional |
| 7.15.4.1.4 | CityCode | String | City code | Mandatory |
| 7.15.4.1.5 | CityName | String | City Name | Mandatory |
| 7.15.4.1.6 | CountryCode | String | CountryCode | Mandatory |
| 7.15.4.1.7 | CountryName | String | Country Name | Mandatory |
| 7.15.4.2 | DepTime | Date Time | Departure time | Mandatory |
| 7.15.5 | Destination |  |  |  |
| 7.15.5.1 | Airport |  |  |  |
| 7.15.5.1.1 | AirportCode | String | Airport Code | Mandatory |
| 7.15.5.1.2 | AirportName | String | Airport Name | Optional |
| 7.15.5.1.3 | Terminal | String | Terminal number | Optional |
| 7.15.5.1.4 | CityCode | String | City code | Mandatory |
| 7.14.24 | SegmentAdditionalInfo |  |  |  |
| 7.14.24.1 | FareBasis | String | Fare basis | Mandatory |
| 7.14.24.2 | NVA | Date Time | Not valid after date | Mandatory |
| 7.14.24.3 | NVB | Date Time | Not valid before date | Mandatory |
| 7.14.24.4 | Baggage | String | Free baggage allowance | Mandatory |
| 7.14.24.5 | Meal | String | Meal | Mandatory |
| 7.15 | Segments |  |  |  |
| 7.15.1 | TripIndicator | Integer | Trip indicator | Mandatory |
| 7.15.2 | SegmentIndicator | Integer | Segment indicator | Mandatory |
| 7.15.3.1 | AirlineCode | String | Airline code | Mandatory |
| 7.15.3.2 | AirlineName | String | Airline name | Mandatory |
| 7.15.3.3 | FlightNumber | String | Flight Number | Mandatory |
| 7.15.3.4 | FareClass | String | Fare Class | Mandatory |
| 7.15.3.5 | OperatingCarrier | String | Operating Carrier | Mandatory |
| 7.15.4 | Origin |  |  |  |
| 7.15.4.1 | Airport |  |  |  |
| 7.15.4.1.1 | AirportCode | String | Airport Code | Mandatory |
| 7.15.4.1.2 | AirportName | String | Airport name | Optional |
| 7.15.4.1.3 | Terminal | String | Terminal number | Optional |
| 7.15.4.1.4 | CityCode | String | City code | Mandatory |
| 7.15.4.1.5 | CityName | String | City Name | Mandatory |
| 7.15.4.1.6 | CountryCode | String | CountryCode | Mandatory |
| 7.15.4.1.7 | CountryName | String | Country Name | Mandatory |
| 7.15.4.2 | DepTime | Date Time | Departure time | Mandatory |
| 7.15.5 | Destination |  |  |  |
| 7.15.5.1 | Airport |  |  |  |
| 7.15.5.1.1 | AirportCode | String | Airport Code | Mandatory |
| 7.15.5.1.2 | AirportName | String | Airport Name | Optional |
| 7.15.5.1.3 | Terminal | String | Terminal number | Optional |
| 7.15.5.1.4 | CityCode | String | City code | Mandatory |
| 7.15.5.1.5 | CityName | String | City Name | Mandatory |
| 7.15.5.1.6 | CountryCode | String | Country code | Mandatory |
| 7.15.5.1.7 | CountryName | String | Country name | Mandatory |
| 7.15.5.2 | ArrTime | Date Time | Arrival time | Mandatory |
| 7.15.6 | AirlinePNR | String | Airline pnr | Optional |
| 7.15.7 | AccumulatedDuration | Time | Accumulated duration | Optional |
| 7.15.8 | Duration | Time | Duration | Optional |
| 7.15.9 | GroundTime | Time | Ground time | Optional |
| 7.15.10 | Mile | String | Miles | Optional |
| 7.15.11 | StopOver |  |  |  |
| 7.15.12 | StopPoint | String | Stopover point | Optional |
| 7.15.13 | StopPointArrivalTime | Date Time | Stopover arrival time | Optional |
| 7.15.14 | StopPointDepartureTime | Date Time | Stopover departure time | Optional |
| 7.15.15 | Craft | String | Craft | Optional |
| 7.15.16 | IsETicketEligible | Boolean | Is E-Ticket eligible | Mandatory |
| 7.15.17 | FlightStatus | String | Flight status | Mandatory |
| 7.15.18 | Status | String | Flight status code | Mandatory |
| 7.16 | FareRules | String | Fare rules | Mandatory |
| 7.16.1 | Origin | String | Origin | Mandatory |
| 7.16.2 | Destination | String | Destination | Mandatory |
| 7.16.3 | Airline | String | Airline | Mandatory |
| 7.16.4 | FareBasisCode | String | Fare basis code | Mandatory |
| 7.16.5 | FareRuleDetail | String List | Fare rule details | Mandatory |
| 7.16.6 | FareRestriction | String | Fare restriction | Mandatory |
| 7.17 | InvoiceNo | Date Time | Invoice no | Mandatory |
| 7.18 | InvoiceCreatedOn | String | Invoice created on | Mandatory |
| 7.19 | GSTCompanyAddress | String | GSTCompanyAddress | Mandatory |
| 7.20 | GSTCompanyContactNumber | String | GSTCompanyContactNumber | Mandatory |
| 7.21 | GSTCompanyName | String | GSTCompanyName | Mandatory |
| 7.22 | GSTNumber | String | GSTNumber | Mandatory |
| 7.23 | GSTCompanyEmail | String | GSTCompanyEmail | Mandatory |
| 7.19 | TicketStatus | Enumeration | [Failed = 0, Successful = 1, NotSaved = 2, NotCreated = 3, NotAllowed = 4, InProgress = 5, TicketeAlreadyCreated= 6, PriceChanged = 8, OtherError = 9] | Mandatory |
| 7.20 | Message | String | Message | Optional |
| 8 | Nationality | String | Nationality | Mandatory |
### Verbatim content of `Ticket_Jason.aspx`

```json
	
Ticket Request for LCC
{
    "PreferredCurrency": null,
    "AgentReferenceNo": "sonam1234567890",
    "Passengers": [
        {
            "Title": "Mr",
            "FirstName": "Rakesh",
            "LastName": "Sharma",
            "PaxType": 1,
            "DateOfBirth": "1987-12-06T00:00:00",
            "Gender": 1,
            "PassportNo": "KJHHJKHKJH",
            "PassportExpiry": "2025-12-06T00:00:00",
            "AddressLine1": "123, Test",
            "AddressLine2": "",
            "Fare": {
                "BaseFare": 3690,
                "Tax": 678,
                "YQTax": 0.0,
                "AdditionalTxnFeePub": 0.0,
                "AdditionalTxnFeeOfrd": 0.0,
                "OtherCharges": 0.0
            },
            "City": "Gurgaon",
            "CountryCode": "IN",
            "CountryName": "India",
            "Nationality": "IN",
            "ContactNo": "9879879877",
            "Email": "harsh@tbtq.in",
            "IsLeadPax": true,
            "FFAirlineCode": null,
            "FFNumber": null,
            "Baggage": [
               {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "NoBaggage",
                    "Description": 2,
                    "Weight": 0,
                    "Currency": "INR",
                    "Price": 0,
                    "Origin": "DEL",
                    "Destination": "BOM"
                }
            ],
            "MealDynamic": [
               {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "NoMeal",
                    "Description": 2,
                    "AirlineDescription": "",
                    "Quantity": 0,
                    "Currency": "INR",
                    "Price": 0,
                    "Origin": "DEL",
                    "Destination": "BOM"
                }
            ],
            "SeatDynamic": [
               {
                                        "AirlineCode": "6E",
                                        "FlightNumber": "6047",
                                        "CraftType": "A321-220",
                                        "Origin": "DEL",
                                        "Destination": "BOM",
                                        "AvailablityType": 0,
                                        "Description": 2,
                                        "Code": "NoSeat",
                                        "RowNo": "0",
                                        "SeatNo": null,
                                        "SeatType": 0,
                                        "SeatWayType": 2,
                                        "Compartment": 0,
                                        "Deck": 0,
                                        "Currency": "INR",
                                        "Price": 0
                                    }
            ],
            "SpecialServices": [
                {
                                "Origin": "DEL",
                                "Destination": "BOM",
                                "DepartureTime": "2024-12-30T11:15:00",
                                "AirlineCode": "6E",
                                "FlightNumber": "6047",
                                "Code": "FFWD",
                                "ServiceType": 3,
                                "Text": "Priority checkin is allowed",
                                "WayType": 4,
                                "Currency": "INR",
                                "Price": 600
                            }
            ],
            "GSTCompanyAddress": "",
            "GSTCompanyContactNumber": "",
            "GSTCompanyName": "",
            "GSTNumber": "",
            "GSTCompanyEmail": ""
        },
        {
            "Title": "Mr",
            "FirstName": "Mahesh",
            "LastName": "Sharma",
            "PaxType": 2,
            "DateOfBirth": "2017-12-06T00:00:00",
            "Gender": 1,
            "PassportNo": "KJHHJKJH",
            "PassportExpiry": "2025-12-06T00:00:00",
            "AddressLine1": "123, Test",
            "AddressLine2": "",
            "Fare": {
                "BaseFare": 3690,
                "Tax": 678,
                "YQTax": 0.0,
                "AdditionalTxnFeePub": 0.0,
                "AdditionalTxnFeeOfrd": 0.0,
                "OtherCharges": 0.0
            },
            "City": "Gurgaon",
            "CountryCode": "IN",
            "CountryName": "India",
            "Nationality": "IN",
            "ContactNo": "9879879877",
            "Email": "harsh@tbtq.in",
            "IsLeadPax": false,
            "FFAirlineCode": null,
            "FFNumber": null,
            "Baggage": [
               {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "NoBaggage",
                    "Description": 2,
                    "Weight": 0,
                    "Currency": "INR",
                    "Price": 0,
                    "Origin": "DEL",
                    "Destination": "BOM"
                }
            ],
            "MealDynamic": [
               {
                    "AirlineCode": "6E",
                    "FlightNumber": "6047",
                    "WayType": 2,
                    "Code": "NoMeal",
                    "Description": 2,
                    "AirlineDescription": "",
                    "Quantity": 0,
                    "Currency": "INR",
                    "Price": 0,
                    "Origin": "DEL",
                    "Destination": "BOM"
                }
            ],
            "SeatDynamic": [
               {
                                        "AirlineCode": "6E",
                                        "FlightNumber": "6047",
                                        "CraftType": "A321-220",
                                        "Origin": "DEL",
                                        "Destination": "BOM",
                                        "AvailablityType": 0,
                                        "Description": 2,
                                        "Code": "NoSeat",
                                        "RowNo": "0",
                                        "SeatNo": null,
                                        "SeatType": 0,
                                        "SeatWayType": 2,
                                        "Compartment": 0,
                                        "Deck": 0,
                                        "Currency": "INR",
                                        "Price": 0
                                    }
            ],
            "GSTCompanyAddress": "",
            "GSTCompanyContactNumber": "",
            "GSTCompanyName": "",
            "GSTNumber": "",
            "GSTCompanyEmail": ""
        },
        {
            "Title": "Mstr",
            "FirstName": "Hrash",
            "LastName": "Sharma",
            "PaxType": 3,
            "DateOfBirth": "2023-12-06T00:00:00",
            "Gender": 1,
            "PassportNo": "KJHHJKHKH",
            "PassportExpiry": "2025-12-06T00:00:00",
            "AddressLine1": "123, Test",
            "AddressLine2": "",
            "Fare": {
                "BaseFare": 1667,
                "Tax": 83,
                "YQTax": 0.0,
                "AdditionalTxnFeePub": 0.0,
                "AdditionalTxnFeeOfrd": 0.0,
                "OtherCharges": 0.0
            },
            "City": "Gurgaon",
            "CountryCode": "IN",
            "CountryName": "India",
            "Nationality": "IN",
            "ContactNo": "9879879877",
            "Email": "harsh@tbtq.in",
            "IsLeadPax": false,
            "FFAirlineCode": null,
            "FFNumber": null,
            "GSTCompanyAddress": "",
            "GSTCompanyContactNumber": "",
            "GSTCompanyName": "",
            "GSTNumber": "",
            "GSTCompanyEmail": ""
        }
    ],
   "EndUserIp": "192.168.5.56",
  "TokenId": "ac2751e9-4cc3-406f-b678-c947e4f57a00",
  "TraceId": "f140170f-2b71-4b51-9cec-423a8f0bfef3",
  "ResultIndex": "OB2[TBO]ZJfnrNr3lGdOyRzztpRBmpqAnpA8mmd12UtfkktuuMcRXXF+7PK+/bnF1gS0v+UoWfYG/BwPX5S2UJu0HNhTZX+W/96o0tgqGP0KVW1tGjPY8Tm7/YWb8lttExBQkTLSGV483dt3Iv77t4AWMlRZsQcIJ5a8aEe/JNO/e+t/dWseJfu1sRArWmHUDpK5WQGnYfm657yX77yL7QmBYXx6VNzEOph1TLWcsXbEtP8RLU1Jvu0hkHPkAqMf2Gz7KMzgq0WsGDlAGby3jkyf/xz4+miELH/gfsdbQCCzY2iUWlRjrplDQcu7KgLoF7ZvKLBAq9zwt8RwxBCgKGSNbaCY1s2LfE00I0BsK/PVLWmMoy3aZx9i3s79hP/HD3YtR13an/rmwGZUAVnH8Wk2l15offmsxTMry/y2MTwTSq0gaiqA8bKSQomOQz3yYAAHDcdwR9VpBwY7M8kcO+hDtcq9pOfN1XWGOAgma4CFRn8dzqZbKXNFBlk/STQpzVM6HQ14xQFUgPDHrCoCjI8jnWf7uKCF33VZSVWlO2Ncs/vjf0th9VOeb63ny2EzYKmNBWxA"
}

        
		
Ticket Response for LCC
{
    "Response": {
        "B2B2BStatus": false,
        "Error": {
            "ErrorCode": 0,
            "ErrorMessage": ""
        },
        "ResponseStatus": 1,
        "TraceId": "f140170f-2b71-4b51-9cec-423a8f0bfef3",
        "Response": {
            "PNR": "YQ3M4F",
            "BookingId": 1940519,
            "SSRDenied": false,
            "SSRMessage": null,
            "Status": 1,
            "IsPriceChanged": false,
            "IsTimeChanged": false,
            "FlightItinerary": {
                "CommentDetails": null,
                "IsAutoReissuanceAllowed": true,
                "IssuancePcc": "OTI011",
                "JourneyType": 1,
                "SearchCombinationType": 2,
                "TripIndicator": 1,
                "BookingAllowedForRoamer": true,
                "BookingId": 1940519,
                "IsCouponAppilcable": true,
                "IsManual": false,
                "PNR": "YQ3M4F",
                "AgentReferenceNo": "sonam1234567890",
                "IsDomestic": true,
                "ResultFareType": "RegularFare",
                "Source": 6,
                "Origin": "DEL",
                "Destination": "BOM",
                "AirlineCode": "6E",
                "LastTicketDate": "9999-12-31T00:00:00",
                "ValidatingAirlineCode": "6E",
                "AirlineRemark": "6E main",
                "AirlineTollFreeNo": "1800-0001-5456-51515",
                "IsLCC": true,
                "NonRefundable": false,
                "FareType": "PUB",
                "CreditNoteNo": null,
                "Fare": {
                    "Currency": "INR",
                    "BaseFare": 9047,
                    "Tax": 1439,
                    "TaxBreakup": [
                        {
                            "key": "PSF",
                            "value": 182.00
                        },
                        {
                            "key": "UDF",
                            "value": 122.00
                        },
                        {
                            "key": "YR",
                            "value": 100.00
                        },
                        {
                            "key": "TotalTax",
                            "value": 1356.00
                        },
                        {
                            "key": "OtherTaxes",
                            "value": 472.00
                        },
                        {
                            "key": "K3",
                            "value": 380.00
                        }
                    ],
                    "YQTax": 0,
                    "AdditionalTxnFeeOfrd": 0,
                    "AdditionalTxnFeePub": 0,
                    "PGCharge": 0,
                    "OtherCharges": 0,
                    "ChargeBU": [
                        {
                            "key": "TBOMARKUP",
                            "value": 0
                        },
                        {
                            "key": "GLOBALPROCUREMENTCHARGE",
                            "value": 0
                        },
                        {
                            "key": "OTHERCHARGE",
                            "value": 0
                        },
                        {
                            "key": "CONVENIENCECHARGE",
                            "value": 0
                        }
                    ],
                    "Discount": 0.00,
                    "PublishedFare": 11086,
                    "CommissionEarned": 0,
                    "PLBEarned": 0,
                    "IncentiveEarned": 0,
                    "OfferedFare": 11086,
                    "TdsOnCommission": 0,
                    "TdsOnPLB": 0,
                    "TdsOnIncentive": 0,
                    "ServiceFee": 0,
                    "TotalBaggageCharges": 0,
                    "TotalMealCharges": 0,
                    "TotalSeatCharges": 0,
                    "TotalSpecialServiceCharges": 600
                },
                "CreditNoteCreatedOn": null,
                "Passenger": [
                    {
                        "BarcodeDetails": {
                            "Id": 3175879,
                            "Barcode": [
                                {
                                    "Index": 1,
                                    "Format": "PDF417",
                                    "Content": "M1SHARMA/RAKESH        YQ3M4F DELBOM6E 6047 365Y000000000000",
                                    "BarCodeInBase64": null,
                                    "JourneyWayType": 3
                                }
                            ]
                        },
                        "DocumentDetails": null,
                        "GuardianDetails": null,
                        "PaxId": 3175879,
                        "Title": "Mr",
                        "FirstName": "Rakesh",
                        "LastName": "Sharma",
                        "PaxType": 1,
                        "DateOfBirth": "1987-12-06T00:00:00",
                        "Gender": 1,
                        "IsPANRequired": false,
                        "IsPassportRequired": false,
                        "PAN": "",
                        "PassportNo": "KJHHJKHKJH",
                        "PassportExpiry": "2025-12-06T00:00:00",
                        "AddressLine1": "123, Test",
                        "Fare": {
                            "Currency": "INR",
                            "BaseFare": 3690,
                            "Tax": 678,
                            "TaxBreakup": [
                                {
                                    "key": "K3",
                                    "value": 190.00
                                },
                                {
                                    "key": "PSF",
                                    "value": 91.00
                                },
                                {
                                    "key": "UDF",
                                    "value": 61.00
                                },
                                {
                                    "key": "YR",
                                    "value": 50.00
                                },
                                {
                                    "key": "TotalTax",
                                    "value": 678.00
                                },
                                {
                                    "key": "OtherTaxes",
                                    "value": 236.00
                                }
                            ],
                            "YQTax": 0,
                            "AdditionalTxnFeeOfrd": 0,
                            "AdditionalTxnFeePub": 0,
                            "PGCharge": 0,
                            "OtherCharges": 0,
                            "ChargeBU": [
                                {
                                    "key": "TBOMARKUP",
                                    "value": 0
                                },
                                {
                                    "key": "GLOBALPROCUREMENTCHARGE",
                                    "value": 0
                                },
                                {
                                    "key": "OTHERCHARGE",
                                    "value": 0
                                },
                                {
                                    "key": "CONVENIENCECHARGE",
                                    "value": 0
                                }
                            ],
                            "Discount": 0.00,
                            "PublishedFare": 4968,
                            "CommissionEarned": 0,
                            "PLBEarned": 0,
                            "IncentiveEarned": 0,
                            "OfferedFare": 4968,
                            "TdsOnCommission": 0,
                            "TdsOnPLB": 0,
                            "TdsOnIncentive": 0,
                            "ServiceFee": 0,
                            "TotalBaggageCharges": 0,
                            "TotalMealCharges": 0,
                            "TotalSeatCharges": 0,
                            "TotalSpecialServiceCharges": 600
                        },
                        "City": "Gurgaon",
                        "CountryCode": "IN",
                        "CountryName": "India",
                        "Nationality": "IN",
                        "ContactNo": "9879879877",
                        "Email": "harsh@tbtq.in",
                        "IsLeadPax": true,
                        "FFAirlineCode": null,
                        "FFNumber": null,
                        "Baggage": [
                            {
                                "AirlineCode": "6E",
                                "FlightNumber": "6047",
                                "WayType": 2,
                                "Code": "NoBaggage",
                                "Description": 2,
                                "Weight": 0,
                                "Currency": "INR",
                                "Price": 0,
                                "Origin": "DEL",
                                "Destination": "BOM"
                            }
                        ],
                        "MealDynamic": [
                            {
                                "AirlineCode": "6E",
                                "FlightNumber": "6047",
                                "WayType": 2,
                                "Code": "NoMeal",
                                "Description": 2,
                                "AirlineDescription": "",
                                "Quantity": 0,
                                "Currency": "INR",
                                "Price": 0,
                                "Origin": "DEL",
                                "Destination": "BOM"
                            }
                        ],
                        "SeatDynamic": [
                            {
                                "AirlineCode": "6E",
                                "FlightNumber": "6047",
                                "CraftType": "A321-220",
                                "Origin": "DEL",
                                "Destination": "BOM",
                                "AvailablityType": 0,
                                "Description": 2,
                                "Code": "NoSeat",
                                "RowNo": "0",
                                "SeatNo": null,
                                "SeatType": 0,
                                "SeatWayType": 2,
                                "Compartment": 0,
                                "Deck": 0,
                                "Currency": "INR",
                                "Price": 0
                            }
                        ],
                        "SpecialServices": [
                            {
                                "Origin": "DEL",
                                "Destination": "BOM",
                                "DepartureTime": "2024-12-30T11:15:00",
                                "AirlineCode": "6E",
                                "FlightNumber": "6047",
                                "Code": "FFWD",
                                "ServiceType": 3,
                                "Text": "Priority checkin is allowed",
                                "WayType": 4,
                                "Currency": "INR",
                                "Price": 600
                            }
                        ],
                        "Ssr": [],
                        "Ticket": {
                            "TicketId": 2223685,
                            "TicketNumber": "YQ3M4F",
                            "IssueDate": "2024-12-09T15:43:36",
                            "ValidatingAirline": "708",
                            "Remarks": "",
                            "ServiceFeeDisplayType": "ShowInTax",
                            "Status": "OK",
                            "ConjunctionNumber": "",
                            "TicketType": "N"
                        },
                        "GSTCompanyAddress": "",
                        "GSTCompanyContactNumber": "",
                        "GSTCompanyEmail": "",
                        "GSTCompanyName": "",
                        "GSTNumber": "",
                        "SegmentAdditionalInfo": [
                            {
                                "FareBasis": "R0IP",
                                "NVA": "",
                                "NVB": "",
                                "Baggage": "15 Kilograms",
                                "Meal": "0 Platter",
                                "Seat": "0",
                                "SpecialService": "PriorityCheckIn"
                            }
                        ]
                    },
                    {
                        "BarcodeDetails": {
                            "Id": 3175880,
                            "Barcode": [
                                {
                                    "Index": 1,
                                    "Format": "PDF417",
                                    "Content": "M1SHARMA/MAHESH        YQ3M4F DELBOM6E 6047 365Y000000000000",
                                    "BarCodeInBase64": null,
                                    "JourneyWayType": 3
                                }
                            ]
                        },
                        "DocumentDetails": null,
                        "GuardianDetails": null,
                        "PaxId": 3175880,
                        "Title": "Mr",
                        "FirstName": "Mahesh",
                        "LastName": "Sharma",
                        "PaxType": 2,
                        "DateOfBirth": "2017-12-06T00:00:00",
                        "Gender": 1,
                        "IsPANRequired": false,
                        "IsPassportRequired": false,
                        "PAN": "",
                        "PassportNo": "KJHHJKJH",
                        "PassportExpiry": "2025-12-06T00:00:00",
                        "AddressLine1": "123, Test",
                        "Fare": {
                            "Currency": "INR",
                            "BaseFare": 3690,
                            "Tax": 678,
                            "TaxBreakup": [
                                {
                                    "key": "K3",
                                    "value": 190.00
                                },
                                {
                                    "key": "PSF",
                                    "value": 91.00
                                },
                                {
                                    "key": "UDF",
                                    "value": 61.00
                                },
                                {
                                    "key": "YR",
                                    "value": 50.00
                                },
                                {
                                    "key": "TotalTax",
                                    "value": 678.00
                                },
                                {
                                    "key": "OtherTaxes",
                                    "value": 236.00
                                }
                            ],
                            "YQTax": 0,
                            "AdditionalTxnFeeOfrd": 0,
                            "AdditionalTxnFeePub": 0,
                            "PGCharge": 0,
                            "OtherCharges": 0,
                            "ChargeBU": [
                                {
                                    "key": "TBOMARKUP",
                                    "value": 0
                                },
                                {
                                    "key": "GLOBALPROCUREMENTCHARGE",
                                    "value": 0
                                },
                                {
                                    "key": "OTHERCHARGE",
                                    "value": 0
                                },
                                {
                                    "key": "CONVENIENCECHARGE",
                                    "value": 0
                                }
                            ],
                            "Discount": 0.00,
                            "PublishedFare": 4368,
                            "CommissionEarned": 0,
                            "PLBEarned": 0,
                            "IncentiveEarned": 0,
                            "OfferedFare": 4368,
                            "TdsOnCommission": 0,
                            "TdsOnPLB": 0,
                            "TdsOnIncentive": 0,
                            "ServiceFee": 0,
                            "TotalBaggageCharges": 0,
                            "TotalMealCharges": 0,
                            "TotalSeatCharges": 0,
                            "TotalSpecialServiceCharges": 0
                        },
                        "City": "Gurgaon",
                        "CountryCode": "IN",
                        "CountryName": "India",
                        "Nationality": "IN",
                        "ContactNo": "9879879877",
                        "Email": "harsh@tbtq.in",
                        "IsLeadPax": false,
                        "FFAirlineCode": null,
                        "FFNumber": null,
                        "Baggage": [
                            {
                                "AirlineCode": "6E",
                                "FlightNumber": "6047",
                                "WayType": 2,
                                "Code": "NoBaggage",
                                "Description": 2,
                                "Weight": 0,
                                "Currency": "INR",
                                "Price": 0,
                                "Origin": "DEL",
                                "Destination": "BOM"
                            }
                        ],
                        "MealDynamic": [
                            {
                                "AirlineCode": "6E",
                                "FlightNumber": "6047",
                                "WayType": 2,
                                "Code": "NoMeal",
                                "Description": 2,
                                "AirlineDescription": "",
                                "Quantity": 0,
                                "Currency": "INR",
                                "Price": 0,
                                "Origin": "DEL",
                                "Destination": "BOM"
                            }
                        ],
                        "SeatDynamic": [
                            {
                                "AirlineCode": "6E",
                                "FlightNumber": "6047",
                                "CraftType": "A321-220",
                                "Origin": "DEL",
                                "Destination": "BOM",
                                "AvailablityType": 0,
                                "Description": 2,
                                "Code": "NoSeat",
                                "RowNo": "0",
                                "SeatNo": null,
                                "SeatType": 0,
                                "SeatWayType": 2,
                                "Compartment": 0,
                                "Deck": 0,
                                "Currency": "INR",
                                "Price": 0
                            }
                        ],
                        "Ssr": [],
                        "Ticket": {
                            "TicketId": 2223686,
                            "TicketNumber": "YQ3M4F",
                            "IssueDate": "2024-12-09T15:43:36",
                            "ValidatingAirline": "708",
                            "Remarks": "",
                            "ServiceFeeDisplayType": "ShowInTax",
                            "Status": "OK",
                            "ConjunctionNumber": "",
                            "TicketType": "N"
                        },
                        "GSTCompanyAddress": "",
                        "GSTCompanyContactNumber": "",
                        "GSTCompanyEmail": "",
                        "GSTCompanyName": "",
                        "GSTNumber": "",
                        "SegmentAdditionalInfo": [
                            {
                                "FareBasis": "R0IP",
                                "NVA": "",
                                "NVB": "",
                                "Baggage": "15 Kilograms",
                                "Meal": "0 Platter",
                                "Seat": "0",
                                "SpecialService": ""
                            }
                        ]
                    },
                    {
                        "BarcodeDetails": null,
                        "DocumentDetails": null,
                        "GuardianDetails": null,
                        "PaxId": 3175881,
                        "Title": "Mstr",
                        "FirstName": "Hrash",
                        "LastName": "Sharma",
                        "PaxType": 3,
                        "DateOfBirth": "2023-12-06T00:00:00",
                        "Gender": 1,
                        "IsPANRequired": false,
                        "IsPassportRequired": false,
                        "PAN": "",
                        "PassportNo": "KJHHJKHKH",
                        "PassportExpiry": "2025-12-06T00:00:00",
                        "AddressLine1": "123, Test",
                        "Fare": {
                            "Currency": "INR",
                            "BaseFare": 1667,
                            "Tax": 83,
                            "TaxBreakup": [
                                {
                                    "key": "K3",
                                    "value": 0
                                }
                            ],
                            "YQTax": 0,
                            "AdditionalTxnFeeOfrd": 0,
                            "AdditionalTxnFeePub": 0,
                            "PGCharge": 0,
                            "OtherCharges": 0,
                            "ChargeBU": [
                                {
                                    "key": "TBOMARKUP",
                                    "value": 0
                                },
                                {
                                    "key": "GLOBALPROCUREMENTCHARGE",
                                    "value": 0
                                },
                                {
                                    "key": "OTHERCHARGE",
                                    "value": 0
                                },
                                {
                                    "key": "CONVENIENCECHARGE",
                                    "value": 0
                                }
                            ],
                            "Discount": 0.00,
                            "PublishedFare": 1750,
                            "CommissionEarned": 0,
                            "PLBEarned": 0,
                            "IncentiveEarned": 0,
                            "OfferedFare": 1750,
                            "TdsOnCommission": 0,
                            "TdsOnPLB": 0,
                            "TdsOnIncentive": 0,
                            "ServiceFee": 0,
                            "TotalBaggageCharges": 0,
                            "TotalMealCharges": 0,
                            "TotalSeatCharges": 0,
                            "TotalSpecialServiceCharges": 0
                        },
                        "City": "Gurgaon",
                        "CountryCode": "IN",
                        "CountryName": "India",
                        "Nationality": "IN",
                        "ContactNo": "9879879877",
                        "Email": "harsh@tbtq.in",
                        "IsLeadPax": false,
                        "FFAirlineCode": null,
                        "FFNumber": null,
                        "Ssr": [],
                        "Ticket": {
                            "TicketId": 2223687,
                            "TicketNumber": "YQ3M4F",
                            "IssueDate": "2024-12-09T15:43:36",
                            "ValidatingAirline": "708",
                            "Remarks": "",
                            "ServiceFeeDisplayType": "ShowInTax",
                            "Status": "OK",
                            "ConjunctionNumber": "",
                            "TicketType": "N"
                        },
                        "GSTCompanyAddress": "",
                        "GSTCompanyContactNumber": "",
                        "GSTCompanyEmail": "",
                        "GSTCompanyName": "",
                        "GSTNumber": "",
                        "SegmentAdditionalInfo": [
                            {
                                "FareBasis": "R0IP",
                                "NVA": "",
                                "NVB": "",
                                "Baggage": "0 Kg",
                                "Meal": "0 Platter",
                                "Seat": "",
                                "SpecialService": ""
                            }
                        ]
                    }
                ],
                "CancellationCharges": null,
                "Segments": [
                    {
                        "Baggage": "15 Kilograms",
                        "CabinBaggage": " 7 KG",
                        "CabinClass": 2,
                        "SupplierFareClass": null,
                        "TripIndicator": 1,
                        "SegmentIndicator": 1,
                        "Airline": {
                            "AirlineCode": "6E",
                            "AirlineName": "IndiGo",
                            "FlightNumber": "6047",
                            "FareClass": "RR",
                            "OperatingCarrier": ""
                        },
                        "AirlinePNR": "",
                        "Origin": {
                            "Airport": {
                                "AirportCode": "DEL",
                                "AirportName": "Indira Gandhi Airport",
                                "Terminal": "1",
                                "CityCode": "DEL",
                                "CityName": "Delhi",
                                "CountryCode": "IN",
                                "CountryName": "India"
                            },
                            "DepTime": "2024-12-30T11:15:00"
                        },
                        "Destination": {
                            "Airport": {
                                "AirportCode": "BOM",
                                "AirportName": "Chhatrapati Shivaji International Airport",
                                "Terminal": "2",
                                "CityCode": "BOM",
                                "CityName": "Mumbai",
                                "CountryCode": "IN",
                                "CountryName": "India"
                            },
                            "ArrTime": "2024-12-30T13:30:00"
                        },
                        "Duration": 135,
                        "GroundTime": 0,
                        "Mile": 0,
                        "StopOver": false,
                        "FlightInfoIndex": "",
                        "StopPoint": "",
                        "StopPointArrivalTime": "0001-01-01T00:00:00",
                        "StopPointDepartureTime": "0001-01-01T00:00:00",
                        "Craft": "321",
                        "Remark": null,
                        "IsETicketEligible": true,
                        "FlightStatus": "Confirmed",
                        "Status": "HK",
                        "FareClassification": null
                    }
                ],
                "FareRules": [
                    {
                        "Origin": "DEL",
                        "Destination": "BOM",
                        "Airline": "6E",
                        "FareBasisCode": "R0IP",
                        "FareRuleDetail": "The FareBasisCode is: R0IP \r\n\r\n IndiGo Fares Terms & Conditions\r\n\r\n Regular / Promo - One Way retail\r\n\r\n Baggage Conditions\r\n Check-in Baggage Allowance: 15 kg for Domestic sectors and 20 kg for International Sectors except 30 Kg for Kuwait, Abu Dhabi, Dubai, Muscat, Damam, Sharjah, Doha, Istanbul and Codeshare destinations; and 25 kg for Jeddah + 5L Zamzam water (only for flights from Jeddah to India)\r\n Hand Baggage Allowance: 7 Kg on IndiGo Operations and 8 Kg on 6E-TK Codeshares. (Including ladies bag and laptop bag.)\r\n\r\n Change Fee / Cancel Fee\r\n Domestic - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 3 hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 3 hrs from scheduled departure. Difference of fare will be applicable along with Change/Cancellation fees.\r\n\r\n International - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 4hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 4 hrs from scheduled departure. Difference of fare will be applicable along with change fees.\r\n\r\n Click here for Change / Cancellation charges: https://www.goindigo.in/information/fees-and-charges.html?linkNav=fees-and-charges_header \r\n\r\n\r\n Super 6E Fare - The e2809cSuper 6Ee2809d fare will include an extra 10kg baggage allowance, free seat selection including XL seat, meal / snack combo, check-in first and get your bags before anyone else, anytime boarding, delayed and lost baggage protection service and reduced change and cancellation fee, as well as no convenience fee.\r\n       \r\n        Baggage Conditions\r\n       Check-in Baggage Allowance: An extra 10KG baggage allowance on regular baggage allowance.\r\n       Hand Baggage Allowance:  7 Kg. (including ladies bag and laptop bag.)\r\n\r\n\r\nChange Fee \r\nDomestic: No Date Change Fee If changed 4 Days and Above left for departure. Change fee of IN 500 (Per Passenger per sector) will be applicable if changed within 0-3 days from the departure.No-show charges will be levied if changed/cancelled within 3 hrs from scheduled departure. Difference of fare will be applicable along with change fees.\r\n      \r\nInternational: INR 500 per passenger will be charged for changes made in the period 4(four) days prior to date of departure and INR 900 per passenger for international sector within 3 (three) days from the date of departure. No-show charges will be levied if changed/cancelled within 4 hrs from scheduled departure. Difference of fare will be applicable along with change fees.\r\n      \r\n\r\nCancellation Fee \r\n      \r\nCancellation fee of only INR 500 per passenger for domestic sector and INR 1500 per passenger for international sector.\r\n\r\nIf changed/cancelled at least 4hrs before the scheduled departure for International sectors and at least 3hrs before the scheduled departure for Domestic sectors. No-show charges will be levied if changed/cancelled within 4 hrs (International) and 3hrs (Domestic) from scheduled departure. Difference of fare will be applicable along with change fees. \r\n\r\n                                                                                                                                                                                     Click here for Change / Cancellation charges: https://www.goindigo.in/add-on-services/super-6e-fare.html?linkNav=super-6e-fare_Home-homepage~service-listing~5\r\n\r\nReturn Fare - Applicable for Round-Trip journey\r\n\r\nBaggage Conditions\r\nCheck-in Baggage Allowance: 15 kg for Domestic sectors and 20 kg for International Sectors except 30 Kg for Kuwait, Abu Dhabi, Dubai, Muscat, Damam, Sharjah, Doha, Istanbul and Codeshare destinations; and 25 kg for Jeddah + 5L Zamzam water (only for flights from Jeddah to India)\r\nHand Baggage Allowance:  7 Kg on IndiGo Operations and 8 Kg on 6E-TK Codeshares. (Including ladies bag and laptop bag.)\r\n\r\nChange Fee / Cancel Fee\r\nDomestic - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 3 hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 3 hrs from scheduled departure. Difference of fare will be applicable along with Change/Cancellation fees.\r\n\r\nInternational - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 4hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 4 hrs from scheduled departure. Difference of fare will be applicable along with change fees. \r\n\r\nClick here for Change / Cancellation charges: https://www.goindigo.in/information/fees-and-charges.html?linkNav=fees-and-charges_header \r\n\r\n\r\nFamily Fare - Applicable on a minimum of 4 pax booked on the same PNR\r\n\r\nBaggage Conditions\r\nCheck-in Baggage Allowance: 15 kg for Domestic sectors and 20 kg for International Sectors except 30 Kg for Kuwait, Abu Dhabi, Dubai, Muscat, Damam, Sharjah, Doha, Istanbul and Codeshare destinations; and 25 kg for Jeddah + 5L Zamzam water (only for flights from Jeddah to India)\r\nHand Baggage Allowance:  7 Kg. (including ladies bag and laptop bag.)\r\n\r\nChange Fee / Cancel Fee\r\nDomestic - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 3 hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 3 hrs from scheduled departure. Difference of fare will be applicable along with Change fees.\r\n\r\nInternational - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 4hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 4 hrs from scheduled departure. Difference of fare will be applicable along with change fees. \r\n\r\nClick here for Change / Cancellation charges: https://www.goindigo.in/information/fees-and-charges.html?linkNav=fees-and-charges_header \r\n\r\n\r\nFlexi Fare - Unlimited changes 4 Days and Above left for departure for domestic and international sectors. Fare difference applies.\r\n\r\nBaggage Conditions\r\nCheck-in Baggage Allowance: 15 kg for Domestic sectors and 20 kg for International Sectors except 30 Kg for Kuwait, Abu Dhabi, Dubai, Muscat, Damam, Sharjah, Doha, Istanbul and Codeshare destinations; and 25 kg for Jeddah + 5L Zamzam water (only for flights from Jeddah to India)\r\nHand Baggage Allowance:  7 Kg. (including ladies bag and laptop bag.)\r\n\r\n\r\nChange Fee \r\nDomestic : No Date Change Fee If changed 4 Days and Above left for departure. Change fee up to INR 3000 (Per Passenger per sector)will be levied if changed within 0-3 days from the departure. No-show charges will be levied if changed/cancelled within 3 hrs from scheduled departure. Difference of fare will be applicable along with Change fees.\r\nInternational: No Change Fee: if changed at least 4 Days and Above left for departure. Change fee up to INR 5000 (Per Passenger per sector)will be levied if changed within 0-3 days from the departure. No-show charges will be levied if changed/cancelled within 4 hrs from scheduled departure. Difference of fare will be applicable along with change fees.\r\n\r\nCancellation Fee \r\nDomestic: The cancellation fee will be INR 500 for cancellation 4 Days and Above left for departure. Cancellation fee up to INR 3500 (Per Passenger per sector) will be levied if cancelled within 0-3 days from the departure.No-show charges will be levied if Booking cancellation is made, less than 3 hours prior to the scheduled departure time.\r\nInternational: The cancellation fee will be INR 1000 for cancellation 4 Days and Above left for departure. Cancellation fee up to INR 6500 (Per Passenger per sector) will be levied if cancelled within 0-3 days from the departure.No-show charges will be levied if Booking cancellation is made, less than 4 hours prior to the scheduled departure time.\r\n\r\n\r\nClick here for Change / Cancellation charges: https://www.goindigo.in/add-on-services/flexi-fares.html?linkNav=flexi-fares_header \r\n\r\n\r\n\r\nSME Fare - Wee28099ve got a deal thate28099ll give our travel partners an edge. Unlock a discounted seat* along with lower change and cancellation fee, when you book for business travellers with SME fares. *T&C apply.\r\n\r\n\r\nBaggage Conditions\r\nCheck-in Baggage Allowance: 15 kg for Domestic sectors and 20 kg for International Sectors except 30 Kg for Kuwait, Abu Dhabi, Dubai, Muscat, Damam, Sharjah, Doha, Istanbul and Codeshare destinations; and 25 kg for Jeddah + 5L Zamzam water (only for flights from Jeddah to India)\r\nHand Baggage Allowance:  7 Kg. (including ladies bag and laptop bag.)\r\n\r\nChange Fee \r\nDomestic Travel : For travel within India, a Change Fee of INR 449 will be charged if change is made to a Booking at least 3 hours before the scheduled departure time. For clarity, no-show charges will be levied if change to a Booking is made within 3 hours prior to the scheduled departure time.\r\nInternational Travel : For travel to/from an international destination, a Change Fee of INR 999 will be charged if change is made to a Booking at least 4 hours before the scheduled departure time. For clarity, no-show charges will be levied if change to a Booking is made within 4 hours prior to the scheduled departure time.\r\n\r\nCancel Fee\r\nDomestic Travel : The cancellation fee will be INR 499 per passenger per flight for cancellation if cancelled beyond 24 Hrs prior to departure. Cancellation fee up to INR 1499 (Per Passenger per sector) will be levied if cancelled within 3-24 hours from the departure.No-show charges will be levied if Booking cancellation is made, less than 3 hours prior to the scheduled departure time.\r\nInternational Travel : The cancellation fee will be INR 999 for cancellation if cancelled beyond 24 Hrs prior to departure. Cancellation fee up to INR 2499 (Per Passenger per sector) will be levied if cancelled within 3-24 Hours from the departure.No-show charges will be levied if Booking cancellation is made, less than 4 hours prior to the scheduled departure time.\r\n\r\n\r\nClick here for Change / Cancellation charges: https://6esme.goindigo.in/IndiGoSMESite/term_cond/TnC.html\r\n\r\n\r\nLite fare - Applicable for travel without a check-in baggage. Applicable for travel beyond 15 days from the booking date on Domestic and same day on International travel. For a multi-leg/return journey, Lite Fare will be available only if it is available and selected on each of the individual legs.\r\n\r\nBaggage Conditions\r\nCheck-in Baggage Allowance: No check-in baggage allowed.\r\n\r\nHand Baggage Allowance:  7 Kg. (including ladies bag and laptop bag.)\r\n\r\nChange Fee / Cancel Fee\r\nDomestic - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 3 hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 3 hrs from scheduled departure. Difference of fare will be applicable along with Change/Cancellation fees.\r\n\r\nInternational - Respective Change / cancellation charges (click the link below) or 100% of airfare charge (whichever is lower) per passenger per segment will be levied if changed/cancelled at least 4hrs before the scheduled departure. No-show charges will be levied if changed/cancelled within 4 hrs from scheduled departure. Difference of fare will be applicable along with change fees.\r\n\r\nClick here for Change / Cancellation charges: https://www.goindigo.in/information/fees-and-charges.html?linkNav=fees-and-charges_header \r\n\r\n\r\nCorporate / Coupon Fare - Available for contracted Corporate Customers only. Allows unlimited flexibility to change / cancel, extra hand-baggage allowance, complimentary seat and meal (1 food item & 1 beverage). \r\n\r\nBaggage Conditions:\r\nCheck-in Baggage Allowance: 15 kg for Domestic sectors and 20 kg for International Sectors except 30 Kg for Kuwait, Abu Dhabi, Dubai, Muscat, Damam, Sharjah, Doha, Istanbul and Codeshare destinations; and 25 kg for Jeddah + 5L Zamzam water (only for flights from Jeddah to India)\r\nHand Baggage Allowance: 10 Kg. (including ladies bag and laptop bag.)\r\n\r\nChange Fee:\r\nDomestic India : No Change Fee: if changed at least 3 hr before the scheduled departure. No-show charges will be levied if changed within 3 hrs from scheduled departure. Difference of fare will be applicable.\r\nInternational: No Change Fee: if changed at least 4 hr before the scheduled departure. No-show charges will be levied if changed within 4 hrs from scheduled departure. Difference of fare will be applicable.\r\n\r\nCancellation Fee:\r\nDomestic India : No Cancellation Fee: if cancelled at least 3 hr before the scheduled departure. No-show charges will be levied if cancelled within 3 hrs from scheduled departure.     \r\nInternational : No Cancellation Fee: if changed at least 4 hrs before the scheduled departure. No-show charges will be levied if cancelled within 4 hrs from scheduled departure.\r  APART FROM AIRLINE CHARGES,GST+RAF+ APPLICABLE CHARGES IF ANY, WILL BE CHARGED.MENTIONED FEE ARE INDICATIVE PER PAX AND PER SECTOR.FOR DOMESTIC BOOKINGS, PASSENGERS ARE REQUIRED TO SUBMIT THE CANCELLATION OR REISSUE REQUEST AT LEAST 2 HOURS BEFORE THE AIRLINES CANCELLATION AND REISSUE POLICY.FOR INTERNATIONAL BOOKINGS, PASSENGERS ARE REQUIRED TO SUBMIT THE CANCELLATION OR REISSUE REQUEST AT LEAST 4 HOURS BEFORE THE AIRLINES CANCELLATION AND REISSUE POLICY.",
                        "FareRestriction": null,
                        "FareInclusions": []
                    }
                ],
                "MiniFareRules": [
                    {
                        "JourneyPoints": "",
                        "Type": "",
                        "From": "",
                        "To": "",
                        "Unit": "",
                        "Details": ""
                    }
                ],
                "PenaltyCharges": {},
                "Status": 5,
                "Invoice": [
                    {
                        "CreditNoteGSTIN": null,
                        "GSTIN": null,
                        "InvoiceCreatedOn": "2024-12-09T15:43:40",
                        "InvoiceId": 21210,
                        "InvoiceNo": "IW/2425/21210",
                        "InvoiceAmount": 11086.00,
                        "Remarks": "",
                        "InvoiceStatus": 3
                    }
                ],
                "InvoiceAmount": 11086.00,
                "InvoiceNo": "IW/2425/21210",
                "InvoiceStatus": 3,
                "InvoiceCreatedOn": "2024-12-09T15:43:40",
                "Remarks": "",
                "IsWebCheckInAllowed": false
            },
            "TicketStatus": 1
        }
    }
}
            
Ticket Request for NON LCC (Without Passport Details if Passport details were passed in Hold Request)

{
"EndUserIp": "192.168.10.10",
"TokenId": "96af01e7-55c5-4a1b-ba98-0465ec20109c",
"TraceId": "0ff543d8-2207-4e46-8ff3-76ef1178a518",
"PNR": "N38C3V",
"BookingId": 1428318
}

Ticket Request for NON LCC (With Passport Details if Passport details were not passed in Hold Request)

{
"EndUserIp": "192.168.10.10",
  "TokenId": "96af01e7-55c5-4a1b-ba98-0465ec20109c",
 "TraceId": "0ff543d8-2207-4e46-8ff3-76ef1178a518",
 
"Passport": [
  {
    "PaxId": 2040529,
    "PassportNo": "abcx12345",
    "PassportExpiry": "2030-03-03T00:00:00",
    "DateOfBirth": "1998-02-02T00:00:00"
  },
  {
    "PaxId": 2040530,
    "PassportNo": "abcx54321",
    "PassportExpiry": "2030-03-05T00:00:00",
    "DateOfBirth": "1999-02-02T00:00:00"
  }
],
  "PNR": "N38C3V",
  "BookingId": 1428318
}

            
```

---

## GetBookingDetails

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetBookingDetails`  
**Source pages:** https://apidoc.tektravels.com/flighT/GetBookingDetails.aspx, https://apidoc.tektravels.com/flighT/GetBookingDetails_Json.aspx


### Verbatim content of `GetBookingDetails.aspx`

This method is used to retrieve booking details and booking status of an existing booking using BookingId, PNR or TraceId as the search parameter. It is typically used after a booking has been made to capture a current snapshot of the reservation.
If Booking Id is received as 0 then please call GetBookingDetails using Trace id or PNR with First Name and Last Name of the lead passenger.
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetBookingDetails
GetBookingDetails Method can be call by using multiple way, Below are the request cases to get the response.
Request 1: EndUserIp, TokenId, BookingId
Request 2: EndUserIp, TokenId, BookingId, PNR
Request 3: EndUserIp, TokenId, PNR, First Name
Request 4: EndUserIp, TokenId, PNR, Last Name
Request 5: EndUserIp, TokenId, PNR, First Name, Last Name
Request 6: EndUserIp, TokenId,TraceId
GetBookingDetails Paramenters

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID | Mandatory (Token Id to be echoed back from Authenticate response) |
| 3 | BookingId | Integer | Unique booking id of the >successful booking | Mandatory (BookingId will always be greater than 0. Either BookingId, PNR or TraceId will be required to retrieve booking details) |
| 4 | PNR | String | PNR | Mandatory ( Either BookingId, PNR or TraceId will be required to retrieve booking details) |
| 5 | First Name | String | First Name of Lead Pax | Mandatory |
| 6 | Last Name | String | Last Name of Lead Pax | Mandatory |

GetBookingDetails Response - LCC

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | FlightItinerary |  |  |  |
| 1.1 | BookingId | Integer | Unique booking id | Mandatory |
| 1.2 | PNR | String | PNR no | Mandatory |
| 1.3 | IsDomestic | Boolean | Search request is for domestic or international |  |
| 1.4 | Source | String | Airline source | Mandatory |
| 1.5 | Origin | String | Origin | Mandatory |
| 1.6 | Destination | String | Destination | Mandatory |
| 1.7 | AirlineCode | String | Airline code | Mandatory |
| 1.8 | ValidatingAirlineCode | String | Validating airline code | Mandatory |
| 1.9 | AirlineRemarks | String | Airline remarks | Optional |
| 1.10 | AirlineTollFreeNo | String | AirlineTollFreeNo | Optional |
| 1.11 | IsLCC | Boolean | Is the result for LCC or Non LCC | Mandatory |
| 1.12 | NonRefundable | Boolean | Is the fare refundable or not | Mandatory |
| 1.13 | FareType | String | Fare type | Mandatory |
| 1.14 | Fare |  |  |  |
| 1.14.1 | Currency | String | Currency | Mandatory |
| 1.14.2 | BaseFare | Decimal | Base fare | Mandatory |
| 1.14.3 | Tax | Decimal | Total tax | Mandatory |
| 1.14.4 | YQTax | Decimal | Fuel surcharge | Mandatory |
| 1.14.5 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 1.14.6 | AdditionalTxnFeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 1.14.7 | OtherCharges | Decimal | Other charges | Mandatory |
| 1.14.8 | ChargeBU[] |  |  |  |
| 1.14.8.1 | TBOMarkUp | Decimal | TBO Mark-up | Mandatory |
| 1.14.8.2 | ConvenienceCharge | Decimal | Convenience Charge | Mandatory |
| 1.14.8.3 | OtherCharge | Decimal | Other Charge | Mandatory |
| 1.14.9 | Discount | Decimal | Discount | Mandatory |
| 1.14.10 | PublishedFare | Decimal | Published fare | Mandatory |
| 1.14.11 | CommissionEarned | Decimal | Agent commission | Mandatory |
| 1.14.12 | PLBEarned | Decimal | Performance Linked Bonus | Mandatory |
| 1.14.13 | IncentiveEarned | Decimal | Incentive applicable | Mandatory |
| 1.14.14 | OfferedFare | Decimal | Offerred fare | Mandatory |
| 1.14.15 | TdsOnCommission | Decimal | TDS on the commission | Mandatory |
| 1.14.16 | TdsOnPLB | Decimal | TDS on Performance Linked Bonus | Mandatory |
| 1.14.17 | TdsOnIncentive | Decimal | TDS on the incentive | Mandatory |
| 1.14.18 | ServiceFee | Decimal | Service fee | Mandatory |
| 1.15 | Passenger |  |  |  |
| 1.15.1 | PaxID | Integer | Unique pax id | Mandatory |
| 1.15.2 | Title | String | Title | Mandatory |
| 1.15.3 | FirstName | String | First name | Mandatory |
| 1.15.4 | LastName | String | Last name | Mandatory |
| 1.15.5 | PaxType | String | Pax type | Mandatory |
| 1.15.6 | DateOfBirth | Date Time | Date of birth | Mandatory |
| 1.15.7 | Gender | String | Gender | Mandatory |
| 1.15.8 | PassportNo | String | Passport no | Optional |
| 1.15.9 | PassportExpiry | Date time | Passport expiry | Optional |
| 1.15.10 | AddressLine1 | String | Address | Mandatory |
| 1.15.11 | AddressLine2 | String | Address | Optional |
| 1.15.12 | City | String | City | Mandatory |
| 1.15.13 | CountryCode | String | Country code | Mandatory |
| 1.15.14 | CountryName | String | Country name | Mandatory |
| 1.15.15 | ContactNo | String | Contact no | Mandatory |
| 1.15.16 | Email | String | Email | Mandatory |
| 1.15.17 | IsLeadPax | Boolean | Represent the lead guest of the booking | Mandatory |
| 1.15.18 | FFAirlineCode | String | Frequent flyer airline | Optional * |
| 1.15.19 | FFNumber | String | Frequent flyer number | Optional * |
| 1.15.20 | Fare |  |  |  |
| 1.15.20.1 | Currency | String | Currency | Mandatory |
| 1.15.20.2 | BaseFare | Decimal | Base fare | Mandatory |
| 1.15.20.3 | Tax | Decimal | Tax | Mandatory |
| 1.15.20.4 | YQTax | Decimal | Fuel surcharge | Mandatory |
| 1.15.20.5 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 1.15.20.6 | AdditionalTxnFeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 1.15.20.7 | OtherCharges | Decimal | Other charge | Mandatory |
| 1.15.20.8 | ChargeBU[] |  |  |  |
| 1.15.20.8.1 | TBOMarkUp | Decimal | TBO mark-up | Mandatory |
| 1.15.20.8.2 | ConvenienceCharge | Decimal | Convenience charge | Mandatory |
| 1.15.20.8.3 | OtherCharge | Decimal | Other charge | Mandatory |
| 1.15.20.9 | Discount | Decimal | Discount | Mandatory |
| 1.15.20.10 | PublishedFare | Decimal | Published fare | Mandatory |
| 1.15.20.11 | CommissionEarned | Decimal | Agent commission | Mandatory |
| 1.15.20.12 | PLBEarned | Decimal | Performance linked bonus | Mandatory |
| 1.15.20.13 | IncentiveEarned | Decimal | Incentive | Mandatory |
| 1.15.20.14 | OfferedFare | Decimal | Offered fare | Mandatory |
| 1.15.20.15 | TdsOnCommission | Decimal | TDS on commission | Mandatory |
| 1.15.20.16 | TdsOnPLB | Decimal | TDS on Performance linked bonus | Mandatory |
| 1.15.20.17 | TdsOnIncentive | Decimal | TDS on incentive | Mandatory |
| 1.15.20.18 | ServiceFee | Decimal | Service fee | Mandatory |
| 1.15.21 | Baggage |  |  |  |
| 1.15.21.1 | WayType | Enumeration | Way type | Mandatory |
| 1.15.21.2 | Code | String | Baggage code | Mandatory |
| 1.15.21.3 | Description | String | Baggage description | Mandatory |
| 1.15.21.4 | Weight | String | Baggage weight | Mandatory |
| 1.15.21.5 | Currency | String | Currency | Mandatory |
| 1.15.21.6 | Price | Decimal | Baggage price | Mandatory |
| 1.15.21.7 | Origin | String | Origin | Mandatory |
| 1.15.21.8 | Destination | String | Destination | Mandatory |
| 1.15.22 | MealDynamic |  |  |  |
| 1.15.22.1 | WayType | Enumeration | Way type | Mandatory |
| 1.15.22.2 | Code | String | Meal code | Mandatory |
| 1.15.22.3 | Description | String | Description | Mandatory |
| 1.15.22.4 | AirlineDescription | String | Meal description | Mandatory |
| 1.15.22.5 | Quantity | String | Meal quantity | Mandatory |
| 1.15.22.6 | Price | Decimal | Meal price | Mandatory |
| 1.15.22.7 | Currency | String | Currency | Mandatory |
| 1.15.22.8 | Origin | String | Origin | Mandatory |
| 1.15.22.9 | Destination | String | Destination | Mandatory |
| 1.15.23 | Ticket |  |  |  |
| 1.15.23.1 | TicketId | Integer | Unique ticket id | Mandatory |
| 1.15.23.2 | TicketNumber | String | Ticket number | Mandatory |
| 1.15.23.3 | IssueDate | Date time | Ticket issue date | Mandatory |
| 1.15.23.4 | ValidatingAirline | String | Validating airline | Mandatory |
| 1.15.23.5 | Remarks | String | Remarks | Mandatory |
| 1.15.23.6 | ServiceFeeDisplayType | String | Service fee display type | Mandatory |
| 1.15.23.7 | Status | String | Ticket status | Mandatory |
| 1.15.24 | SegmentAdditionalInfo |  |  |  |
| 1.15.24.1 | FareBasis | String | Fare basis | Mandatory |
| 1.15.24.2 | NVA | Date Time | Not valid after date | Mandatory |
| 1.15.24.3 | NVB | Date Time | Not valid before date | Mandatory |
| 1.15.24.4 | Baggage | String | Free baggage allowance | Optional |
| 1.15.24.5 | Meal | String | Free Meal Detail | Optional |
| 1.16 | Segments |  |  |  |
| 1.16.1 | TripIndicator | Integer | Trip indicator | Mandatory |
| 1.16.2 | SegmentIndicator | Integer | Segment indicator | Mandatory |
| 1.16.3 | Airline |  |  |  |
| 1.16.3.1 | AirlineCode | String | Airline code | Mandatory |
| 1.16.3.2 | AirlineName | String | Airline name | Mandatory |
| 1.16.3.3 | FlightNumber | String | Flight Number | Mandatory |
| 1.16.3.4 | FareClass | String | Fare Class | Mandatory |
| 1.16.3.5 | OperatingCarrier | String | Operating Carrier | Mandatory |
| 1.16.4 | Origin |  |  |  |
| 1.16.4.1 | Airport |  |  |  |
| 1.16.4.1.1 | AirportCode | String | Airport code | Mandatory |
| 1.16.4.1.2 | AirportName | String | Airport name | Optional |
| 1.16.4.1.3 | Terminal | String | Terminal number | Optional |
| 1.16.4.1.4 | CityCode | String | City code | Mandatory |
| 1.16.4.1.5 | CityName | String | City name | Mandatory |
| 1.16.4.1.6 | CountryCode | String | Country code | Mandatory |
| 1.16.4.1.7 | CountryName | String | Country name | Mandatory |
| 1.16.4.2 | DepTime | Date Time | Departure time | Mandatory |
| 1.16.5 | Destination |  |  |  |
| 1.16.5.1 | Airport |  |  |  |
| 1.16.5.1.1 | AirportCode | String | Airport code | Mandatory |
| 1.16.5.1.2 | AirportName | String | Airport name | Optional |
| 1.16.5.1.3 | Terminal | String | Terminal number | Optional |
| 8.16.5.1.4 | CityCode | String | City code | Mandatory |
| 1.16.5.1.5 | CityName | String | City name | Mandatory |
| 1.16.5.1.6 | CountryCode | String | Country code | Mandatory |
| 1.16.5.1.7 | CountryName | String | Country name | Mandatory |
| 1.16.5.2 | ArrTime | Date Time | Arrival time | Mandatory |
| 1.16.6 | AirlinePNR | String | Airline pnr | Optional |
| 1.16.7 | AccumulatedDuration | Time | Accumulated duration | Optional |
| 1.16.8 | Duration | Time | Duration | Optional |
| 1.16.9 | GroundTime | Time | Ground time | Optional |
| 1.16.10 | Mile | String | Miles | Optional |
| 1.16.11 | StopOver |  |  |  |
| 1.16.12 | StopPoint | String | Stopover point | Optional |
| 1.16.13 | StopPointArrivalTime | Date Time | Stopover arrival time | Optional |
| 1.16.14 | StopPointDepartureTime | Date Time | Stopover departure time | Optional |
| 1.16.15 | Craft | String | Craft | Optional |
| 1.16.16 | IsETicketEligible | Boolean | Is E-Ticket eligible | Mandatory |
| 1.16.17 | FlightStatus | String | Flight status | Mandatory |
| 1.16.18 | Status | String | Flight status code | Mandatory |
| 1.17 | FareRules |  | Fare rules | Mandatory |
| 1.17.1 | Origin | String | Origin | Mandatory |
| 1.17.2 | Destination | String | Destination | Mandatory |
| 1.17.3 | Airline | String | Airline | Mandatory |
| 1.17.4 | FareBasisCode | String | Fare basis code | Mandatory |
| 1.17.5 | FareRuleDetail | String List | Fare rule details | Mandatory |
| 1.17.6 | FareRestriction | String | Fare restriction | Mandatory |
| 1.18 | InvoiceNo | String | Invoice no | Mandatory |
| 1.19 | InvoiceCreatedOn | String | Invoice created on | Mandatory |
| 1.20 | TicketStatus | Enumeration | Ticket status | Mandatory |
| 1.21 | Message | String | Message | Optional |

GetBookingDetails Response - NON-LCC

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | FlightItinerary |  |  |  |
| 1.2 | PNR | String | PNR no | Mandatory |
| 1.3 | IsDomestic | Boolean | Search request is for domestic or international | Mandatory |
| 1.4 | Source | String | Airline source | Mandatory |
| 1.5 | Origin | String | Origin | Mandatory |
| 1.6 | Destination | String | Destination | Mandatory |
| 1.7 | AirlineCode | String | Airline code | Mandatory |
| 1.8 | ValidatingAirlineCode | String | Validating airline code | Mandatory |
| 1.9 | AirlineRemarks | String | Airline remarks | Optional |
| 1.10 | AirlineTollFreeNo | String | AirlineTollFreeNo | Optional |
| 1.11 | IsLCC | Boolean | Is the result for LCC or Non LCC | Mandatory |
| 1.12 | NonRefundable | Boolean | Is the fare refundable or not | Mandatory |
| 1.13 | FareType | String | Fare type | Mandatory |
| 1.14 | Fare |  |  |  |
| 1.14.1 | Currency | String | Currency | Mandatory |
| 1.14.2 | BaseFare | Decimal | Base fare | Mandatory |
| 1.14.3 | Tax | Decimal | Total tax | Mandatory |
| 1.14.4 | YQTax | Decimal | Fuel surcharge | Mandatory |
| 1.14.5 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction | Mandatory |
|  |  |  | Fee Offered | (It will always be zero) |
| 1.14.6 | AdditionalTxnFeePub | Decimal | Additional Transaction | Mandatory |
|  |  |  | Fee Published |  |
| 1.14.7 | OtherCharges | Decimal | Other charges | Mandatory |
| 8.14.7.1 | ChargeBU |  |  |  |
| 1.14.7.2 | TBOMarkUp | Decimal | TBO Mark-up | Mandatory |
| 1.14.7.3 | ConvenienceCharge | Decimal | Convenience Charge | Mandatory |
| 1.14.8 | OtherCharge | Decimal | Other Charge | Mandatory |
| 1.14.9 | Discount | Decimal | Discount | Mandatory |
| 1.14.10 | PublishedFare | Decimal | Published fare | Mandatory |
| 1.14.11 | CommissionEarned | Decimal | Agent commission | Mandatory |
| 1.14.12 | PLBEarned | Decimal | Performance Linked Bonus | Mandatory |
| 1.14.13 | IncentiveEarned | Decimal | Incentive applicable | Mandatory |
| 1.14.14 | OfferedFare | Decimal | Offerred fare | Mandatory |
| 1.14.15 | TdsOnCommission | Decimal | TDS on the commission | Mandatory |
| 1.14.16 | TdsOnPLB | Decimal | TDS on Performance Linked Bonus | Mandatory |
| 1.14.17 | TdsOnIncentive | Decimal | TDS on the incentive | Mandatory |
| 1.14.18 | ServiceFee | Decimal | Service fee | Mandatory |
| 1.15 | Passenger |  |  |  |
| 1.15.1 | PaxID | Integer | Unique pax id | Mandatory |
| 1.15.2 | Title | String | Title | Mandatory |
| 1.15.3 | FirstName | String | First name | Mandatory |
| 1.15.4 | LastName | String | Last name | Mandatory |
| 1.15.5 | PaxType | String | Pax type | Mandatory |
| 1.15.6 | DateOfBirth | Date Time | Date of birth | Mandatory |
| 1.15.7 | Gender | String | Gender | Mandatory |
| 1.15.8 | PassportNo | String | Passport no | Optional |
| 1.15.9 | PassportExpiry | Date time | Passport expiry | Optional |
| 1.15.10 | AddressLine1 | String | Address | Mandatory |
| 1.15.11 | AddressLine2 | String | Address | Optional |
| 1.15.12 | City | String | City | Mandatory |
| 1.15.13 | CountryCode | String | Country code | Mandatory |
| 1.15.14 | CountryName | String | Country name | Mandatory |
| 1.15.15 | ContactNo | String | Contact no | Mandatory |
| 1.15.16 | Email | String | Email | Mandatory |
| 1.15.17 | IsLeadPax | Boolean | Represent the lead guest of the booking | Mandatory |
| 1.15.18 | FFAirlineCode | String | Frequent flyer airline | Optional |
| 1.15.19 | FFNumber | String | Frequent flyer number | Optional |
| 1.15.20 | Fare |  |  |  |
| 1.15.20.1 | Currency | String | Currency | Mandatory |
| 1.15.20.2 | BaseFare | Decimal | Base fare | Mandatory |
| 1.15.20.3 | Tax | Decimal | Tax | Mandatory |
| 1.15.20.4 | YQTax | Decimal | Fuel surcharge | Mandatory |
| 1.15.20.5 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 1.15.20.6 | AdditionalTxnFeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 1.15.20.7 | OtherCharges | Decimal | Other charge | Mandatory |
| 1.15.20.8 | ChargeBU[] |  |  |  |
| 1.15.20.8.1 | TBOMarkUp | Decimal | TBO mark-up | Mandatory |
| 1.15.20.8.2 | ConvenienceCharge | Decimal | Convenience charge | Mandatory |
| 1.15.20.8.3 | OtherCharge | Decimal | Other charge | Mandatory |
| 1.15.20.9 | Discount | Decimal | Discount | Mandatory |
| 1.15.20.10 | PublishedFare | Decimal | Published fare | Mandatory |
| 1.15.20.11 | CommissionEarned | Decimal | Agent commission | Mandatory |
| 1.15.20.12 | PLBEarned | Decimal | Performance linked bonus | Mandatory |
| 1.15.20.13 | IncentiveEarned | Decimal | Incentive | Mandatory |
| 1.15.20.14 | OfferedFare | Decimal | Offered fare | Mandatory |
| 1.15.20.15 | TdsOnCommission | Decimal | TDS on commission | Mandatory |
| 1.15.20.16 | TdsOnPLB | Decimal | TDS on Performance linked bonus | Mandatory |
| 1.15.20.17 | TdsOnIncentive | Decimal | TDS on incentive | Mandatory |
| 1.15.20.18 | ServiceFee | Decimal | Service fee | Mandatory |
| 1.15.21 | SeatPreference |  |  |  |
| 1.15.21.1 | Code | String | Seat code | Optional |
| 1.15.21.3 | Description | String | Seat description | Optional |
| 1.15.22 | Meal |  |  |  |
| 1.15.22.1 | Code | String | Meal code | Optional |
| 1.15.22.1 | Description | String | Meal description | Optional |
| 1.15.23 | Ticket |  |  |  |
| 1.15.23.1 | TicketId | Integer | Unique ticket id | Mandatory |
| 1.15.23.2 | TicketNumber | String | Ticket number | Mandatory |
| 1.15.23.3 | IssueDate | Date time | Ticket issue date | Mandatory |
| 1.15.23.4 | ValidatingAirline | String | Validating airline | Mandatory |
| 1.15.23.5 | Remarks | String | Remarks | Mandatory |
| 1.15.23.6 | ServiceFeeDisplayType | String | Service fee display type | Mandatory |
| 1.15.23.7 | Status | String | Ticket status | Mandatory |
| 1.15.24 | SegmentAdditionalInfo |  |  |  |
| 1.15.24.1 | FareBasis | String | Fare basis | Mandatory |
| 1.15.24.2 | NVA | Date Time | Not valid after date | Mandatory |
| 1.15.24.3 | NVB | Date Time | Not valid before date | Mandatory |
| 1.15.24.4 | Baggage | String | Free baggage allowance | Optional |
| 1.15.24.5 | Meal | String | Free Meal Detail | Optional |
| 1.16 | Segments |  |  |  |
| 1.16.1 | TripIndicator | Integer | Trip indicator | Mandatory |
| 1.16.2 | SegmentIndicator | Integer | Segment indicator | Mandatory |
| 1.16.3 | Airline |  |  |  |
| 1.16.3.1 | AirlineCode | String | Airline code | Mandatory |
| 1.16.3.2 | AirlineName | String | Airline name | Mandatory |
| 1.16.3.3 | FlightNumber | String | Flight Number | Mandatory |
| 1.16.3.4 | FareClass | String | Fare Class | Mandatory |
| 1.16.3.5 | OperatingCarrier | String | Operating Carrier | Mandatory |
| 1.16.4 | Origin |  |  |  |
| 1.16.4.1 | Airport |  |  |  |
| 1.16.4.1.1 | AirportCode | String | Airport code | Mandatory |
| 1.16.4.1.2 | AirportName | String | Airport name | Optional |
| 1.16.4.1.3 | Terminal | String | Terminal number | Optional |
| 1.16.4.1.4 | CityCode | String | City code | Mandatory |
| 1.16.4.1.5 | CityName | String | City name | Mandatory |
| 1.16.4.1.6 | CountryCode | String | Country code | Mandatory |
| 1.16.4.1.7 | CountryName | String | Country name | Mandatory |
| 1.16.4.2 | DepTime | Date Time | Departure time | Mandatory |
| 1.16.5 | Destination |  |  |  |
| 1.16.5.1 | Airport |  |  |  |
| 1.16.5.1.1 | AirportCode | String | Airport code | Mandatory |
| 1.16.5.1.2 | AirportName | String | Airport name | Optional |
| 1.16.5.1.3 | Terminal | String | Terminal number | Optional |
| 1.16.5.1.4 | CityCode | String | City code | Mandatory |
| 1.16.5.1.5 | CityName | String | City name | Mandatory |
| 1.16.5.1.6 | CountryCode | String | Country code | Mandatory |
| 1.16.5.1.7 | CountryName | String | Country name | Mandatory |
| 1.16.5.2 | ArrTime | Date Time | Arrival time | Mandatory |
| 1.16.6 | AirlinePNR | String | Airline pnr | Optional |
| 1.16.7 | AccumulatedDuration | Time | Accumulated duration | Optional |
| 1.16.8 | Duration | Time | Duration | Optional |
| 1.16.9 | GroundTime | Time | Ground time | Optional |
| 1.16.10 | Mile | String | Miles | Optional |
| 1.16.11 | StopOver |  |  |  |
| 1.16.12 | StopPoint | String | Stopover point | Optional |
| 1.16.13 | StopPointArrivalTime | Date Time | Stopover arrival time | Optional |
| 1.16.14 | StopPointDepartureTime | Date Time | Stopover departure time | Optional |
| 1.16.15 | Craft | String | Craft | Optional |
| 1.16.16 | IsETicketEligible | Boolean | Is E-Ticket eligible | Mandatory |
| 1.16.17 | FlightStatus | String | Flight status | Mandatory |
| 1.16.18 | Status | String | Flight status code | Mandatory |
| 1.17 | FareRules |  | Fare rules | Mandatory |
| 1.17.1 | Origin | String | Origin | Mandatory |
| 1.17.2 | Destination | String | Destination | Mandatory |
| 1.17.3 | Airline | String | Airline | Mandatory |
| 1.17.4 | FareBasisCode | String | Fare basis code | Mandatory |
| 1.17.5 | FareRuleDetail | String List | Fare rule details | Mandatory |
| 1.17.6 | FareRestriction | String | Fare restriction | Mandatory |
| 1.18 | InvoiceNo | String | Invoice no | Mandatory |
| 1.19 | InvoiceCreatedOn | String | Invoice created on | Mandatory |
| 1.20 | Status | Enumeration | Ticket status | Mandatory |
| 1.21 | Message | String | Message | Optional |
| 2 | Penalty |  | Cancellation/Re-issuance | Optional |
| 2.1 | ReissueCharge | Amount | Re-issuance Charge | Optional |
| 2.2 | CancellationCharge | Amount | CancellationCharge | Optional |
### Verbatim content of `GetBookingDetails_Json.aspx`

GetBookingDetails Request-1
```json
	
      
{
"EndUserIp": "192.168.11.58",
"TokenId": "604d4f5a-283e-4c42-8bbc-09e92934f81d",
"PNR": "BBM64K",
"BookingId": "1288956",
}

    
```
GetBookingDetails Request-2
```json
	
    {
"EndUserIp": "192.168.11.58",
"TokenId": "e43c5219-7209-4562-8c96-bced9d5df9cc",
"PNR": "C6YW6C",
"FirstName": "Riya",
"LastName": "Sinha"
}

        
```
GetBookingDetails Request-3
```json
	
{
"EndUserIp": "192.168.11.58",
"TokenId": "604d4f5a-283e-4c42-8bbc-09e92934f81d",
"TraceId": "caef5986-98cf-4f4c-8bc2-c80caa023b00"
}

    
```
GetBookingDetails Response
```json
        
{
"Response": {
"Error": {
"ErrorCode": 0,
"ErrorMessage": ""
},
        "FlightItinerary": {
"BookingId": 1288956,
"PNR": "BBM64K",
"IsDomestic": true,
"Source": 6,
"Origin": "DEL",
"Destination": "BOM",
"AirlineCode": "6E",
"ValidatingAirlineCode": "6E",
"AirlineRemark": "",
"AirlineTollFreeNo": "1800-0001-5456-222",
"IsLCC": true,
"NonRefundable": false,
"FareType": "PUB",
"Fare": {
"Currency": "INR",
        "BaseFare": 9700,
"Tax": 2534,
"YQTax": 0,
"AdditionalTxnFeeOfrd": 0,
"AdditionalTxnFeePub": 1,
"OtherCharges": 572.68,
"ChargeBU": [
{
"key": "TBOMARKUP",
        "value": 172.68
},
{
"key": "CONVENIENCECHARGE",
"value": 0
},
{
"key": "OTHERCHARGE",
"value": 400
}
],
"Discount": 0,
"PublishedFare": 15326.68,
"CommissionEarned": 522,
"PLBEarned": 466.14,
"IncentiveEarned": 408.9,
"OfferedFare": 13909.64,
        "TdsOnCommission": 104.4,
"TdsOnPLB": 93.22,
"TdsOnIncentive": 81.78,
"ServiceFee": 20
},
"Passenger": [
{
"PaxId": 1770998,
        "Title": "Mr",
"FirstName": "JRIBHYQAX",
"LastName": "Re",
"PaxType": 1,
"DateOfBirth": "1982-12-06T00:00:00",
"Gender": 1,
"PassportNo": "KJHHJKHKJH",
"AddressLine1": "123, Test",
"AddressLine2": "",
"Fare": {
"Currency": "INR",
"BaseFare": 4350,
"Tax": 1267,
"YQTax": 0,
"AdditionalTxnFeeOfrd": 0,
"AdditionalTxnFeePub": 1,
"OtherCharges": 286.34,
        "ChargeBU": [
{
"key": "TBOMARKUP",
"value": 86.34
},
{
"key": "CONVENIENCECHARGE",
"value": 0
        },
{
"key": "OTHERCHARGE",
"value": 200
}
],
"Discount": 0,
"PublishedFare": 7163.34,
"CommissionEarned": 261,
"PLBEarned": 233.07,
"IncentiveEarned": 204.45,
"OfferedFare": 6454.82,
"TdsOnCommission": 52.2,
"TdsOnPLB": 46.61,
"TdsOnIncentive": 40.89,
"ServiceFee": 10
        },
"City": "Gurgaon",
"CountryCode": "IN",
"Nationality": "IN",
"ContactNo": "9879879877",
"Email": "harsh@tbtq.in",
"IsLeadPax": true,
"FFAirlineCode": null,
"FFNumber": "",
        "Baggage": [
{
"WayType": 2,
"Code": "XBPA",
"Description": 2,
"Weight": 5,
"Currency": "INR",
"Price": 1000,
"Origin": "DEL",
"Destination": "BOM"
}
],
"MealDynamic": [
{
"WayType": 2,
"Code": "VGML ",
        "Description": 2,
"AirlineDescription": "VEG MEAL",
"Quantity": 1,
"Price": 250,
"Currency": "INR",
"Origin": "DEL",
"Destination": "BOM"
}
],
        "Ticket": {
"TicketId": 1569310,
"TicketNumber": "BBM64K",
"IssueDate": "2015-10-08T11:41:16",
"ValidatingAirline": "708",
"Remarks": "",
"ServiceFeeDisplayType": "ShowInTax",
"Status": "OK"
},
"SegmentAdditionalInfo": [
{
"FareBasis": "M",
"NVA": null,
"NVB": null,
"Baggage": "20 Kg|5",
"Meal": "1 Platter"
        }
]
},
{
"PaxId": 1770999,
"Title": "Mr",
"FirstName": "Rajvecuf",
"LastName": "Singh",
"PaxType": 2,
        "DateOfBirth": "2011-12-06T00:00:00",
"Gender": 1,
"PassportNo": "KJHHJKHKJH",
"Fare": {
"Currency": "INR",
"BaseFare": 4350,
"Tax": 1267,
"YQTax": 0,
"AdditionalTxnFeeOfrd": 0,
"AdditionalTxnFeePub": 1,
"OtherCharges": 286.34,
"ChargeBU": [
{
"key": "TBOMARKUP",
"value": 86.34
        },
{
"key": "CONVENIENCECHARGE",
"value": 0
},
{
"key": "OTHERCHARGE",
"value": 200
}
]
        "Discount": 0,
"PublishedFare": 7163.34,
"CommissionEarned": 261,
"PLBEarned": 233.07,
"IncentiveEarned": 204.45,
"OfferedFare": 6454.82,
"TdsOnCommission": 52.2,
"TdsOnPLB": 46.61
        "TdsOnIncentive": 40.89,
"ServiceFee": 10
},
"City": "Gurgaon",
"CountryCode": "IN",
"Nationality": "IN",
"IsLeadPax": true,
"FFAirlineCode": null,
"FFNumber": "",
"Baggage": [
{
"WayType": 2,
"Code": "XBPA",
"Description": 2,
"Weight": 5,
        "Currency": "INR",
"Price": 1000,
        "Origin": "DEL",
"Destination": "BOM"
}
],
"MealDynamic": [
{
"WayType": 2,
"Code": "VGML ",
"Description": 2,
"AirlineDescription": "VEG MEAL",
"Quantity": 1,
"Price": 250,
"Currency": "INR",
"Origin": "DEL",
"Destination": "BOM"
        }
],
"Ticket": {
"TicketId": 1569311,
"TicketNumber": "BBM64K",
"IssueDate": "2015-10-08T11:41:16",
"ValidatingAirline": "708",
"Remarks": "",
"ServiceFeeDisplayType": "ShowInTax",
"Status": "OK"
        },
"SegmentAdditionalInfo": [
{
"FareBasis": "M",
"NVA": null,
"NVB": null,
"Baggage": "20 Kg|5",
"Meal": "1 Platter"
}
]
},
{
"PaxId": 1771000,
"Title": "",
"FirstName": "R",
"LastName": "Si",
"PaxType": 3,
        "DateOfBirth": "2014-12-06T00:00:00",
"Gender": 1,
"PassportNo": "KJHHJKHKJH",
"Fare": {
"Currency": "INR",
"BaseFare": 1000,
"Tax": 0,
"YQTax": 0,
        "AdditionalTxnFeeOfrd": 0,
"AdditionalTxnFeePub": 1,
"OtherCharges": 0,
"ChargeBU": [
{
"key": "TBOMARKUP",
"value": 0
},
{
"key": "CONVENIENCECHARGE",
"value": 0
},
{
"key": "OTHERCHARGE",
"value": 0
        }
],
"Discount": 0,
"PublishedFare": 1000,
"CommissionEarned": 0,
"PLBEarned": 0,
"IncentiveEarned": 0,
"OfferedFare": 1000,
"TdsOnCommission": 0,
"TdsOnPLB": 0,
        "TdsOnIncentive": 0,
"ServiceFee": 0
},
"City": "Gurgaon",
"CountryCode": "IN",
"Nationality": "IN",
"IsLeadPax": true,
"FFAirlineCode": null,
"FFNumber": "",
"Meal": {
"Code": null,
"Description": null
},
"Ticket": {
"TicketId": 1569312,
        "TicketNumber": "BBM64K",
"IssueDate": "2015-10-08T11:41:16",
"ValidatingAirline": "708",
"Remarks": "",
"ServiceFeeDisplayType": "ShowInTax",
"Status": "OK"
},
"SegmentAdditionalInfo": [
{
"FareBasis": "M",
        "NVA": null,
"NVB": null,
"Baggage": "0 Kg",
"Meal": "0 Platter"
}
]
}
],
"Segments": [
{
"TripIndicator": 1,
"SegmentIndicator": 1,
"Airline": {
"AirlineCode": "6E",
"AirlineName": "IndiGo",
"FlightNumber": "175",
        "FareClass": "M",
"OperatingCarrier": ""
},
"AirlinePNR": "",
"Origin": {
"Airport": {
"AirportCode": "DEL",
"AirportName": "Indira Gandhi Airport",
"Terminal": "1D",
        "CityCode": "DEL",
"CityName": "Delhi",
"CountryCode": "IN",
"CountryName": "India"
},
"DepTime": "2015-11-06T12:55:00"
},
"Destination": {
"Airport": {
"AirportCode": "BOM",
"AirportName": "Mumbai",
"Terminal": "1B",
"CityCode": "BOM",
"CityName": "Mumbai",
"CountryCode": "IN",
"CountryName": "India"
},
"ArrTime": "2015-11-06T15:25:00"
        },
"Duration": 150,
"GroundTime": 0,
"Mile": 0,
"StopOver": false,
"StopPoint": "",
"StopPointArrivalTime": null,
        "StopPointDepartureTime": null,
"Craft": "320",
"IsETicketEligible": false,
"FlightStatus": "Confirmed",
"Status": "HK"
}
],
"FareRules": [
{
"Origin": "DEL",
"Destination": "BOM",
"Airline": "6E",
"FareBasisCode": "M",
"FareRuleDetail": "Fare rules for 6E",
"FareRestriction": ""
        }
],
"Status": 5,
"InvoiceNo": "DW/1516/649",
"InvoiceCreatedOn": "2015-10-08T11:41:16",
"ResponseStatus": 1,
"TraceId": "caef5986-98cf-4f4c-8bc2-c80caa023b00"
}
}
}

    
```

---

## PriceRBD (Advance Search only)

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/PriceRBD`  
**Source pages:** https://apidoc.tektravels.com/flighT/PriceRBD.aspx, https://apidoc.tektravels.com/flighT/PriceRBD_Json.aspx


### Verbatim content of `PriceRBD.aspx`

PRICE RBD
PriceRBD method is to be called only for Advance Search. This method will do seat sell for the request fare class. You need to send Adult count, Child count and Infant count in the PriceRBD request.  .
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/PriceRBD
Advance Search Price RBD Req

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID | Mandatory |
| 3 | TraceId | String | Trace ID | Mandatory |
| 3 | AdultCount | Integer | Number of adults | Mandatory |
| 4 | ChildCount | Integer | Number of children | Mandatory |
| 5 | InfantCount | Integer | Number of infants | Mandatory |
| 6 | AirSearchResult |  |  |  |
| 6.1 | ResultIndex | String | Result Index | Mandatory |
| 6.2 | Source | String | Airline Sources | Mandatory |
| 6.3 | IsLCC | Boolean | Is the Flight LCC or Not | Mandatory |
| 6.4 | IsRefundable | Boolean | Is the Fare refundable or Not | Mandatory |
| 6.5 | AirlineRemark | String | Airline Remarks | Mandatory |
| 6.6 | Segments |  |  |  |
| 6.6.1 | TripIndicators | Enumerator | Trip Indicator | Mandatory |
| 6.6.2 | SegmentIndicator | Date Time | Segment Indicator | Mandatory |
| 6.6.3 | Airline |  |  |  |
| 6.6.3.1 | AirlineCode | String[] | Airline Code | Optional |
| 6.6.3.2 | AirlineName | String[] | Airline Name | Optional |
| 6.6.3.3 | FlightNumber | String | Flight Number | Mandatory |
| 6.6.3.4 | FareClass | String | Fare Class | Mandatory |
| 6.6.3.5 | OperatingCarrier | String | Operating Carrier | Mandatory |

Price RBD Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | TraceId | String | Trace ID | Mandatory |
| 2 | Origin | String | Origin city code | Mandatory |
| 3 | Destination | String | Destination city code | Mandatory |
| 4 | IsPriced | Boolean | Is Priced or not | Mandatory |
| 4 | Results [ ] |  |  | Mandatory |
| 4.1 | ResultIndex | String | Result Index | Mandatory |
| 4.2 | Source | String | Airline Source | Mandatory |
| 4.3 | IsLCC | Boolean | Is the result for LCC or | Mandatory |
|  |  |  | Non LCC |  |
| 4.4 | IsRefundable | Boolean | Is the fare refundable | Mandatory |
|  |  |  | or not |  |
| 4.5 | AirlineRemarks | String | Airline remarks | Optional |
| 4.6 | Fare |  |  |  |
| 4.6.1 | Currency | String | Currency | Mandatory |
| 4.6.2 | BaseFare | Decimal | Base fare | Mandatory |
| 4.6.3 | Tax | Decimal | Total tax | Mandatory |
| 4.6.4 | YQTax | Decimal | Fuel surcharge | Mandatory |
| 4.6.5 | AdditionalTxnFeeO | Decimal | Additional Transaction | Mandatory |
|  | frd |  | Fee Offered | (It will always be zero) |
| 4.6.5 | AdditionalTxnFeePub | Decimal | Additional Transaction | Mandatory |
|  |  |  | Fee Published |  |
| 4.6.6 | OtherCharges | Decimal | Other Charge | Mandatory |
| 4.6.7 | ChargeBU[] |  | It will contain different | Mandatory |
|  |  |  | charge breakup that is |  |
|  |  |  | service charge or |  |
|  |  |  | Credit card charge. |  |
|  |  |  | For details please |  |
|  |  |  | refer ChargeBraekUp |  |
|  |  |  | structure |  |
| 4.6.7.2 | ConvenienceCharge | Decimal | Convenience Charge | Mandatory |
| 4.6.7.3 | OtherCharge | Decimal | Other Charge | Mandatory |
| 4.6.8 | Discount | Decimal | Discount | Mandatory |
| 4.6.9 | PublishedFare | Decimal | Published Fare | Mandatory |
| 4.6.10 | CommissionEarned | Decimal | Agent Commission | Mandatory |
| 4.6.11 | PLBEarned | Decimal | Performance Linked | Mandatory |
|  |  |  | Bonus |  |
| 4.6.12 | IncentiveEarned | Decimal | Agent Incentive | Mandatory |
| 4.6.13 | OfferedFare | Decimal | Offered Fare | Mandatory |
| 4.6.14 | TdsOnCommission | Decimal | TDS on the | Mandatory |
|  |  |  | commission |  |
| 4.6.15 | TdsOnPLB | Decimal | TDS on Performance | Mandatory |
|  |  |  | Linked Bonus |  |
| 4.6.16 | TdsOnIncentive | Decimal | TDS on the incentive | Mandatory |
| 4.6.17 | ServiceFee | Decimal | Service Fee | Mandatory |
| 4.7 | FareBreakdown[] |  | Details of fare breakup |  |
|  |  |  | into several part. It |  |
|  |  |  | give fare of Each |  |
|  |  |  | Passenger Type. |  |
| 4.7.1 | Currency | String | Currency | Mandatory |
| 4.7.2 | PassengerType | String | Passenger Type | Mandatory |
|  |  |  |  | Adult – 1 |
|  |  |  |  | Child – 2 |
|  |  |  |  | Infant – 3 |
| 4.7.3 | PassengerCount | Integer | Number of Passenger | Mandatory |
| 4.7.4 | BaseFare | Decimal | Base fare | Mandatory |
| 4.7.5 | Tax | Decimal | Total tax | Mandatory |
| 4.7.6 | YQTax | Decimal | Fuel Surcharge | Mandatory |
|  | frd |  | Fee Offered | (It will always be zero) |
| 4.7.7 | AdditionalTxnFeeP | Decimal | Additional Transaction | Mandatory |
|  | ub |  | Fee Published |  |
| 4.8 | Segments |  |  |  |
| 4.8.1 | TripIndicator | Integer | Trip Indicator | Mandatory |
|  |  |  |  | 1 for Outbound |
|  |  |  |  | 2 for Inbound flights |
| 4.8.2 | SegmentIndicator | Integer | Segment Indicator | Mandatory |
|  |  |  |  | 1 for Outbound |
|  |  |  |  | 2 for Inbound flights |
| 4.8.3 | Airline |  |  |  |
| 4.8.3.1 | AirlineCode | String | Airline code | Mandatory |
| 4.8.3.2 | AirlineName | String | Airline name | Mandatory |
| 4.8.3.3 | FlightNumber | String | Flight Number | Mandatory |
| 4.8.3.4 | FareClass | String | Fare Class | Mandatory |
| 4.8.3.5 | OperatingCarrier | String | Operating Carrier | Mandatory |
| 4.8.4 | Origin |  |  |  |
| 4.8.4.1 | Airport |  |  |  |
| 4.8.4.1.1 | AirportCode | String | Airport code | Mandatory |
| 4.8.4.1.2 | AirportName | String | Airport name | Optional |
| 4.8.4.1.3 | Terminal | String | Terminal number | Optional |
| 4.8.4.1.4 | CityCode | String | City code | Mandatory |
| 4.8.4.1.5 | CityName | String | City name | Mandatory |
| 4.8.4.1.6 | CountryCode | String | Country code | Mandatory |
| 4.8.4.1.7 | CountryName | String | Country name | Mandatory |
| 4.8.5 | DepTime | Date Time | Departure time | Mandatory |
| 4.8.6 | Destination |  |  |  |
| 4.8.6.1 | Airport |  |  |  |
| 4.8.6.1.1 | AirportCode | String | Airport code | Mandatory |
| 4.8.6.1.2 | AirportName | String | Airport name | Optional |
| 4.8.6.1.3 | Terminal | String | Terminal number | Optional |
| 4.8.6.1.4 | CityCode | String | City code | Mandatory |
| 4.8.6.1.5 | CityName | String | City name | Mandatory |
| 4.8.6.1.6 | CountryCode | String | Country code | Mandatory |
| 4.8.7 | ArrTime | Date Time | Arrival time | Mandatory |
| 4.8.8 | AccumulatedDurati | Time | Accumulated duration | Optional |
|  | on |  |  |  |
| 4.8.9 | Duration | Time | Duration | Optional |
| 4.8.10 | GroundTime | Time | Ground time | Optional |
| 4.8.11 | Mile | String | Miles | Optional |
| 4.8.12 | StopOver |  |  |  |
| 4.8.13 | StopPoint | String | Stopover point | Optional |
| 4.8.14 | StopPointArrivalTi | Date Time | Stopover arrival time | Optional |
|  | me |  |  |  |
| 4.8.15 | StopPointDeparture | Date Time | Stopover departure | Optional |
|  | Time |  | time |  |
| 4.8.16 | Craft | String | Craft | Optional |
| 4.8.17 | IsETicketEligible | Boolean | Is E-Ticket eligible | Mandatory |
|  |  |  |  | (Value – true or false) |
| 4.8.18 | FlightStatus | String | Flight status | Mandatory |
| 4.8.19 | Status | String | Status | Mandatory |
| 4.9 | LastTicketDate | Date Time | Last ticket date | Mandatory |
| 4.1 | TicketAdvisory | String | Ticket Advisory | Optional |
| 4.11 | FareRules |  | Fare Rules |  |
| 4.11.1 | Origin | String | Origin | Mandatory |
| 4.11.2 | Destination | String | Destination | Mandatory |
| 4.11.3 | Airline | String | Airline | Mandatory |
| 4.11.4 | FareBasisCode | String | Fare basis code | Mandatory |
| 4.11.5 | FareRuleDetail | String List | Fare rule details | Mandatory |
| 4.11.6 | FareRestriction | String | Fare restriction | Mandatory |
| 4.11.7 | AirlineCode | String | Airline code | Mandatory |
| 4.11.8 | ValidatingAirline | String | Validating airline | Mandatory |
### Verbatim content of `PriceRBD_Json.aspx`

```json
        PriceRBD Request
{
"AdultCount": "1",
"ChildCount": "1",
"InfantCount": "1",
"EndUserIp": "192.168.10.130",
        "TokenId": "60390ee5-147f-46b6-a666-f6a0faea6156",
"TraceId": "8dccf7e6-2890-478b-964a-b12b1d85c75f",
"AirSearchResult": [
{
"ResultIndex": "OB1",
"Source": 4,
"IsLCC": false,
"IsRefundable": true,
"AirlineRemark": "",
"Segments": [
[
{
"TripIndicator": 1,
"SegmentIndicator": 1,
"Airline": {
"AirlineCode": "AI",
        "AirlineName": "Air India",
"FlightNumber": "349",
"FareClass": "C",
"OperatingCarrier": ""
}
}
]
]
}
        ]
}
    
```
```json
        PriceRBD Response
{
"Response": {
"ResponseStatus": 1,
"Error": {
"ErrorCode": 0,
"ErrorMessage": ""
},
"TraceId": "8dccf7e6-2890-478b-964a-b12b1d85c75f",
"Origin": "DEL",
"Destination": "BOM",
"IsPriced": true,
        "Results": [
[
{
"ResultIndex": "OB1",
"Source": 4,
"IsLCC": false,
"IsRefundable": true,
"AirlineRemark": "",
"Fare": {
        "Currency": "INR",
"BaseFare": 47725,
"Tax": 12050,
"TransactionFee": 5362.5,
"YQTax": 5900,
"AdditionalTxnFeeOfrd": 0,
"AdditionalTxnFeePub": 0,
"OtherCharges": 847.45,
"ChargeBU": [
{
"key": "TBOMARKUP",
"value": 697.45
        },
{
"key": "CONVENIENCECHARGE",
"value": 30
},
{
"key": "OTHERCHARGE",
"value": 120
}
],
"Discount": 0,
"PublishedFare": 65984.95,
        "CommissionEarned": 1678.75,
"PLBEarned": 2162.22,
"IncentiveEarned": 1801.85,
"OfferedFare": 60342.13,
"TdsOnCommission": 335.75,
"TdsOnPLB": 432.44,
"TdsOnIncentive": 360.37,
"ServiceFee": 0
},
"FareBreakdown": [
{
"Currency": "INR",
"PassengerType": 1,
"PassengerCount": 1,
        "BaseFare": 31150,
"Tax": 6637,
"YQTax": 2950,
"AdditionalTxnFeeOfrd": 0,
"AdditionalTxnFeePub": 0
},
{
"Currency": "INR",
"PassengerType": 2,
"PassengerCount": 1,
        "BaseFare": 15575,
"Tax": 5329,
"YQTax": 2950,
"AdditionalTxnFeeOfrd": 0,
"AdditionalTxnFeePub": 0
},
{
"Currency": "INR",
"PassengerType": 3,
"PassengerCount": 1,
"BaseFare": 1000,
"Tax": 84,
"YQTax": 0,
"AdditionalTxnFeeOfrd": 0,
"AdditionalTxnFeePub": 0
        }
],
"Segments": [
[
{
"TripIndicator": 1,
"SegmentIndicator": 1,
"Airline": {
"AirlineCode": "AI",
        "AirlineName": "Air India",
"FlightNumber": "349",
"FareClass": "C",
"OperatingCarrier": ""
        },
"Origin": {
"Airport": {
"AirportCode": "DEL",
"AirportName": "Indira Gandhi Airport",
"Terminal": "3",
"CityCode": "DEL",
"CityName": "Delhi",
"CountryCode": "IN",
"CountryName": "India"
},
"DepTime": "2015-10-14T03:15:00"
},
"Destination": {
"Airport": {
"AirportCode": "BOM",
"AirportName": "Mumbai",
        "Terminal": "2",
"CityCode": "BOM",
"CityName": "Mumbai
        "CountryCode": "IN",
"CountryName": "India"
},
"ArrTime": "2015-10-14T05:25:00"
},
"Duration": 130,
"GroundTime": 0,
"Mile": 0,
"StopOver": false,
"StopPoint": "",
"StopPointArrivalTime": "2015-10-14T05:25:00",
"StopPointDepartureTime": "2015-10-14T03:15:00",
"Craft": "788",
"IsETicketEligible": true,
        "FlightStatus": "NotSet",
"Status": ""
}
]
],
"LastTicketDate": "01Oct15",
"TicketAdvisory": null,
"FareRules": [
{
"Origin": "DEL",
        "Destination": "BOM",
"Airline": "AI",
"FareBasisCode": "C",
"FareRuleDetail": null,
"FareRestriction": null
}
],
"AirlineCode": "AI",
"ValidatingAirline": "AI"
}
]
]
}
}
    
```

---

## GetCalendarFare / UpdateCalendarFareOfDay

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetCalendarFare` and `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/UpdateCalendarFareOfDay`  
**Source pages:** https://apidoc.tektravels.com/flighT/GETCALENDARFARE.aspx, https://apidoc.tektravels.com/flighT/UPDATECALENDARFAREOF%20DAY.aspx, https://apidoc.tektravels.com/flighT/Calendar_Jason.aspx


### Verbatim content of `GETCALENDARFARE.aspx`

This method allows you to check the Lowest Airfare of the month for any domestic sector. Fare shown in the calendar is suggestive pricing for informational purpose only and is for a single adult. The information shown is based on the bookings done by the TBO customers in the past. Due to rapidly changing airline prices & seat availability, these fares are not guaranteed and may no longer be available.
11.1 GETCalendarFare
This method will return the Cheapest Fare of the month along with the lowest fare for each day, if available. You further need to call the Search method for real time inventory and pricing. Rest of the flow remains same for booking.
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetCalendarFare
Get Calendar Fare Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID | MandatoryToken Id to be echoed back from Authenticate response) |
| 3 | JourneyType | Enumerator | Specify journey type | Mandatory(1 - OneWay) |
| 4 | PreferredAirlines | String[] | This filter works only on GDS airline | Optional(null for All i.e. ["AI","9W","SG"]) |
| 5 | Segments [][] |  | List of segments | Mandatory |
| 5.1 | Origin | String | Origin city code | Mandatory(e.g. DEL) |
| 5.2 | Destination | String | Destination city code | Mandatory(e.g. BOM) |
| 5.3 | FlightCabinClass | Enumerator | Cabin class | Mandatory(1 for All 2 for Economy 3 for PremiumEconomy 4 for Business 5 for PremiumBusiness 6 for First) |
| 5.4 | PreferredDepartureTime | Date Time | Preferred departure date timeFormat: yyyy-MM-ddTHH:mm:ss | Mandatory(2015-08-10T00:00:00 for any time 2015-08-10T08:00:00 for Morning Flights 2015-08-10T14:00:00 for Afternoon Flights 2015-08-10T19:00:00 for Evening Flights 2015-08-10T01:00:00 for Night Flights) |
| 6 | Sources | String[] | Airline Sources | Optional(For Normal OW/RT: GDS – Amadeus/Galileo SG - SpiceJet 6E - Indigo G8 – Go Air) |

GetCalendarFare Response
Level
Element
Format
Comments
Mandatory/ Optional
1
TraceId
String
Trace ID
Mandatory(Trace Id to be echoed back in further requests)
2
Origin
String
Origin city code
Mandatory
3
Destination
String
Destination city code
Mandatory
4
SearchResults [ ]
Array of element
Array of the flight results
Mandatory(Can be blank in case no flights found for requested search)
4.1
AirlineCode
String
Airline Code
Mandatory
4.2
AirlineName
String
Airline Name
Mandatory
4.3
DepartureTime
Date Time
Departure time
Mandatory
4.4
IsLowestFareOfMonth
Boolean
Is Lowest Fare of the month
Mandatory(Value - True or False)
4.5
BaseFare
Decimal
The total Base fare of the booking
Mandatory
4.6
Tax
Decimal
The total tax of the booking
Mandatory
4.7
YQTax
Decimal
It is Fuel surcharge. It is part of Tax
Mandatory
4.8
OtherCharge
Decimal
Other Charge
Mandatory
5
Response Status
Enumeration
Response Status
Mandatory
6
Error
6.1
ErrorCode
Integer
Code corresponding to the Error
Mandatory
6.2
ErrorMessage
String
Contains error message
Mandatory(Will contain error description corresponding to ErrorCode. Error Message would be blank in case ErrorCode=0)
### Verbatim content of `UPDATECALENDARFAREOF DAY.aspx`

11.2. UPDATECALENDARFAREOFDAY
This method should be called only after the method GetCalendarFare in order to obtain the lowest fare of a particular day.
This method will return the Cheapest Fare of a particular day of month.
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/UpdateCalendarFareOfDay
Update Calendar Fare Of Day Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID | MandatoryToken Id to be echoed back from Authenticate response) |
| 3 | JourneyType | Enumerator | Specify journey type | Mandatory(1 - OneWay) |
| 4 | PreferredAirlines | String[] | This filter works only on GDS airline | Optional(null for All i.e. ["AI","9W","SG"]) |
| 5 | Segments [][] |  | List of segments | Mandatory |
| 5.1 | Origin | String | Origin city code | Mandatory(e.g. DEL) |
| 5.2 | Destination | String | Destination city code | Mandatory(e.g. BOM) |
| 5.3 | FlightCabinClass | Enumerator | Cabin class | Mandatory(1 for All 2 for Economy 3 for PremiumEconomy 4 for Business 5 for PremiumBusiness 6 for First) |
| 5.4 | PreferredDepartureTime | Date Time | Preferred departure date timeFormat: yyyy-MM-ddTHH:mm:ss | Mandatory(2015-08-10T00:00:00 for any time 2015-08-10T08:00:00 for Morning Flights 2015-08-10T14:00:00 for Afternoon Flights 2015-08-10T19:00:00 for Evening Flights 2015-08-10T01:00:00 for Night Flights) |
| 6 | Sources | String[] | Airline Sources | Optional(For Normal OW/RT: GDS – Amadeus/Galileo SG - SpiceJet 6E - Indigo G8 – Go Air) |

Update Calendar Fare Of Day Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | TraceId | String | Trace ID | Mandatory(Trace Id to be echoed back in further requests) |
| 2 | Origin | String | Origin city code | Mandatory |
| 3 | Destination | String | Destination city code | Mandatory |
| 4 | SearchResults [ ] | Array of element | Array of the flight results | Mandatory(Can be blank in case no flights found for requested search) |
| 4.1 | AirlineCode | String | Airline Code | Mandatory |
| 4.2 | AirlineName | String | Airline Name | Mandatory |
| 4.3 | DepartureTime | Date Time | Departure time | Mandatory |
| 4.4 | IsLowestFareOfMonth | Boolean | Is Lowest Fare of the month | Mandatory(Value - True or False) |
| 4.5 | BaseFare | Decimal | The total Base fare of the booking | Mandatory |
| 4.6 | Tax | Decimal | The total tax of the booking | Mandatory |
| 4.7 | YQTax | Decimal | It is Fuel surcharge. It is part of Tax | Mandatory |
| 4.8 | OtherCharge | Decimal | Other Charge | Mandatory |
| 5 | Response Status | Enumeration | Response Status | Mandatory |
| 6 | Error |  |  |  |
| 6.1 | ErrorCode | Integer | Code corresponding to the Error | Mandatory |
| 6.2 | ErrorMessage | String | Contains error message | Mandatory(Will contain error description corresponding to ErrorCode. Error Message would be blank in case ErrorCode=0) |
### Verbatim content of `Calendar_Jason.aspx`

```json
 19.6. GETCALENDARFARE ()

GetCalendarFare Request
{
"JourneyType": "1",
"EndUserIp": "192.168.10.36",
"TokenId": "ebf966ff-9e72-4fc2-a63d-2236a91f7152",
"PreferredAirlines": null,
"Segments": [ {
        "Origin": "DEL",
"Destination": "BOM",
"FlightCabinClass": "1",
"PreferredDepartureTime": "2016-10-02T00:00:00",
}
],
"Sources": null
}
        
           
        
 GetCalendarFare Response

{"Response": {
"ResponseStatus": 1,
"Error": {
"ErrorCode": 0,
"ErrorMessage": ""
},
"TraceId": "bec81122-e673-4aad-b7c1-3caa68de43f6",
"Origin": "DEL",
"Destination": "BOM",
"SearchResults": [ {
"AirlineCode": "SG",
"AirlineName": "Spicejet",
"DepartureDate": "02-10-2016 19:45:00",
"IsLowestFare": true,
            "BaseFare": 3577.93,
"Tax": 970,
"OtherCharges": 54.34,
"FuelSurcharge": 0
}]
}}
        
    
 19.7. UPDATECALENDARFAREOFDAY ()

UpdateCalendarFareOfDay Request
{
"JourneyType": "1",
"EndUserIp": "192.168.10.36",
"TokenId": "ebf966ff-9e72-4fc2-a63d-2236a91f7152",
"PreferredAirlines": null,
"Segments": [ {
"Origin": "DEL",
"Destination": "BOM",
"FlightCabinClass": "1",
"PreferredDepartureTime": "2016-10-02T00:00:00",
}
],
"Sources": null
        }
    
```
```json
 UpdateCalendarFareOfDay Response
{"Response": {
"ResponseStatus": 1,
"Error": {
"ErrorCode": 0,
"ErrorMessage": ""
},
"TraceId": "bec81122-e673-4aad-b7c1-3caa68de43f6",
"Origin": "DEL",
"Destination": "BOM",
"SearchResults": [ {
"AirlineCode": "SG",
"AirlineName": "Spicejet",
            "DepartureDate": "02-10-2016 19:45:00",
"BaseFare": 3577.93,
"Tax": 970,
"OtherCharges": 54.34,
"FuelSurcharge": 0
}]
}}
        
```

---

## FareUpsell

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareUpsell`  
**Source pages:** https://apidoc.tektravels.com/flighT/Fareupsell.aspx, https://apidoc.tektravels.com/flighT/Fareupsell_json.aspx


### Verbatim content of `Fareupsell.aspx`

FARE UPSELL
Upsell are basically bundled fares which are provided with some add ons like seat, free cancellation, re-issuance less charges etc provided from airline side.
This method needs to be called separately after search method and you will get the updated fares and add ons in “UpsellOptionsList".
Same result index need to pass in fare quote and next subsequent methods (Book, Ticket and GetBookingDetails) to create booking with upsell fares.
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareUpsell
FARE UPSELL Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token Id (Token Id to be echoed back from Authenticate response) | Mandatory |
| 3 | TraceId | String | Trace Id (Trace Id to be echoed back from search response. This can be used to trace particular search/ book at TBO’s end) | Mandatory |
| 4 | ResultIndex | Nvarchar | Result index | Mandatory(selected result index from search response) |

FARE UPSELL Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | TraceId | String | Trace Id | Mandatory |
| 2 | IsPriceChanged | Boolean | Is Price changed | Mandatory(Value - true or false) |
| 3 | ResponseStatus | String | Response Status | Mandatory |
|  |  |  |  | Successfull = 1, Failed = 2, InValidRequest = 3, InValidSession = 4, InValidCredentials = 5] |
| 4 | Results |  |  |  |
| 4.1 | ResultIndex | Nvarchar | Result Index | Mandatory |
| 4.2 | Source | String | Airline Source | Mandatory |
| 4.3 | IsLCC | Boolean | Is the result for LCC or Non LCC(Value – True or False) | Mandatory |
| 4.4 | IsRefundable | Boolean | Is the fare refundable or not (Value – True or False) | Mandatory |
| 4.5 | AirlineRemark | String | Airline Remark | Optional |
| 4.6 | Fare |  | Fare of search result |  |
| 4.6.1 | Currency | String | Currency | Mandatory |
| 4.6.2 | BaseFare | Decimal | Base fare | Mandatory |
| 4.6.4 | YQTax | Decimal | Fuel surcharge | Mandatory |
| 4.6.5 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 4.6.6 | AdditionalTxn FeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 4.6.7 | OtherCharges | Decimal | Some additional charge by airline/ airport. | Mandatory |
| 4.6.8 | ChargeBU[] |  | It will contain different charge breakup that is service charge or Credit card charge. For details please refer ChargeBreakUp structure | Mandatory |
| 4.6.8.1 | TBOMarkUp | Decimal | TBO Mark-up | Mandatory |
| 4.6.8.2 | Convenience Charge | Decimal | Convenience Charge | Mandatory |
| 4.6.8.3 | OtherCharge | Decimal | Other Charge | Mandatory |
| 4.6.9 | Discount | Decimal | Discount | Mandatory |
| 4.6.10 | PublishedFare | Decimal | Published Fare | Mandatory |
| 4.6.11 | CommissionEarned | Decimal | Agent Commission | Mandatory |
| 4.6.12 | PLBEarned | Decimal | Performance Linked Bonus | Mandatory |
| 4.6.13 | IncentiveEarned | Decimal | Incentive earned | Mandatory |
| 4.6.14 | OfferedFare | Decimal | Offered Fare | Mandatory |
| 4.6.15 | TdsOnCommission | Decimal | TDS on the commission | Mandatory |
| 4.6.16 | TdsOnPLB | Decimal | TDS on Performance Linked Bonus | Mandatory |
| 4.6.17 | TdsOnIncentive | Decimal | TDS on the incentive earned | Mandatory |
| 4.6.18 | ServiceFee | Decimal | Service Fee | Mandatory |
| 4.7 | FareBreakdown[] |  | Details of fare breakup into several part. It give fare of Each Passenger Type. | divide the base fare and tax from this array with the passanger count and then pass that fare in the ticket or book request |
| 4.7.1 | Currency | String | Currency | Mandatory |
| 4.7.3 | PassengerCount | Integer | Number of Passenger | Mandatory |
| 4.7.3 | PassengerType | Integer | Type of Passenger (Adult – 1, Child – 2, Infant – 3) | Mandatory |
| 4.7.4 | BaseFare | Decimal | Base fare | Mandatory |
| 4.7.5 | Tax | Decimal | Total tax | Mandatory |
| 4.7.6 | YQTax | Decimal | Fuel Surcharge | Mandatory |
| 4.7.7 | AdditionalTxnFeeOfrd | Decimal | Additional Transaction Fee Offered (It will always be zero) | Mandatory |
| 4.7.8 | AdditionalTxnFeePub | Decimal | Additional Transaction Fee Published | Mandatory |
| 4.8 | Segments[] |  |  |  |
| 4.8.1 | TripIndicator | Integer | Trip Indicator | Mandatory |
| 4.8.2 | SegmentIndicator | Integer | Segment Indicator | Mandatory |
| 4.8.3 | Airline |  |  |  |
| 4.8.3.1 | AirlineCode | String | Airline code | Mandatory |
| 4.8.3.2 | AirlineName | String | Airline name | Mandatory |
| 4.8.3.3 | FlightNumber | String | Flight Number | Mandatory |
| 4.8.3.4 | FareClass | String | Fare Class | Mandatory |
| 4.8.3.5 | OperatingCarrier | String | Operating Carrier | Mandatory |
| 4.8.4 | Origin |  |  |  |
| 4.8.4.1 | Airport |  |  |  |
| 4.8.4.1.1 | AirportCode | String | Airport code | Mandatory |
| 4.8.4.1.2 | AirportName | String | Airport name | Optional |
| 4.8.4.1.3 | Terminal | String | Terminal number | Optional |
| 4.8.4.1.4 | CityCode | String | City code | Mandatory |
| 4.8.4.1.5 | CityName | String | City name | Mandatory |
| 4.8.4.1.6 | CountryCode | String | Country code | Mandatory |
| 4.8.4.1.7 | CountryName | String | Country name | Mandatory |
| 4.8.5 | DepTime | Date Time | Departure time | Mandatory |
| 4.8.6 | Destination |  |  |  |
| 4.8.6.1 | Airport |  |  |  |
| 4.8.6.1.2 | AirportName | String | Airport name | Optional |
| 4.8.6.1.3 | Terminal | String | Terminal number | Optional |
| 4.8.6.1.4 | CityCode | String | City code | Mandatory |
| 4.8.6.1.5 | CityName | String | City name | Mandatory |
| 4.8.6.1.6 | CountryCode | String | Country code | Mandatory |
| 4.8.6.1.7 | CountryName | String | Country name | Mandatory |
| 4.8.7 | ArrTime | Date Time | Arrival time | Mandatory |
| 4.8.8 | Duration | Time | Duration | Optional |
| 4.8.9 | GroundTime | Time | Ground time | Optional |
| 4.8.10 | Mile | String | Miles | Optional |
| 4.8.11 | StopOver |  |  |  |
| 4.8.12 | StopPoint | String | Stopover point | Optional |
| 4.8.13 | StopPointArrivalTime | Date Time | Stopover arrival time | Optional |
| 4.8.14 | StopPointDepartureTime | Date Time | Stopover departure time | Optional |
| 4.8.15 | Craft | String | Craft | Optional |
| 4.8.16 | IsETicketEligible | Boolean (Value – true or false) | Is E-Ticket eligible | Mandatory |
| 4.8.17 | FlightStatus | String | Flight status | Mandatory |
| 4.8.18 | Status | String | Status | Mandatory |
| 4.9 | LastTicketDate | Date Time | Last ticket date | Mandatory |
| 4.1 | TicketAdvisory | String | Ticket Advisory | Optional |
| 4.11 | FareRules |  | This is the fare rules of the flight fare offere |  |
| 4.11.1 | Origin | String | Origin | Mandatory |
| 4.11.2 | Destination | String | Destination | Mandatory |
| 4.11.3 | Airline | String | Airline | Mandatory |
| 4.11.4 | FareBasisCode | String | Fare basis code | Mandatory |
| 4.11.5 | FareRuleDetail | String List | Fare rule details | Mandatory |
| 4.11.6 | FareRestriction | String | Fare restriction | Mandatory |
| 4.13 | ValidatingAirline | String | Validating airline | Mandatory |
| 4.14 | Error |  |  | Mandatory |
| 4.14.1 | ErrorCode | Integer | Code corresponding to the Error | Mandatory |
| 4.14.2 | ErrorMessage | String | Contains error message (Will contain error description corresponding to ErrorCode. Error Message would be blank in case ErrorCode=0) | Mandatory |
| 5 | Penalty |  | Cancellation/Re-issuance | Optional |
| 5.1 | ReissueCharge | Amount | Re-issuance Charge | Optional |
| 5.2 | CancellationCharge | Amount | CancellationCharge | Optional |
| 6 | UpsellOptionsList |  | UpsellOptions | Mandatory |
| 6.1 | UpsellList | Array | Upsell Option List | Mandatory |
| 6.1.1 | FareFamilyCode | String | FareFamilyCode | Mandatory |
| 6.1.2 | FareFamilyName | String | FareFamilyName | Mandatory |
| 6.1.3 | FareRuleIndex | Integer | FareRuleIndex | Mandatory |
| 6.1.4 | FlightInfoIndex | Integer | FlightInfoIndex | Mandatory |
| 6.1.4 | PassengerType | Integer | PassengerType | Mandatory |
| 6.1.4 | ServicesList | Array | List of Services | Mandatory |
| 6.1.4.1 | Code | Nvarchar | Code | Mandatory |
| 6.1.4.2 | IsChargeable | Boolean | IsChargeable | Mandatory |
| 6.1.4.3 | IsIncluded | Boolean | IsIncluded | Mandatory |
| 6.1.4.4 | ServiceType | String | ServiceType | Mandatory |
| 6.1.4.5 | SSRCode | String | SSRCode | Mandatory |
| 6.1.4.6 | UpsellDescription | String | UpsellDescription | Mandatory |
### Verbatim content of `Fareupsell_json.aspx`

```json
	
        FareUpsell Request:
{
  "EndUserIp": "192.168.5.56",
  "TokenId": "************************************",
  "TraceId": "************************************", 
  "ResultIndex": "OB2"
}

    
```
```json
	
        FareUpsell Response:
{
  "Response": {
    "Error": {
      "ErrorCode": 0,
      "ErrorMessage": ""
    },
    "ResponseStatus": 1,
    "Results": [
      {
        "ResultIndex": "OB19",
        "Source": 4,
        "IsLCC": false,
        "IsRefundable": true,
        "GSTAllowed": true,
        "IsCouponAppilcable": true,
        "IsGSTMandatory": false,
        "AirlineRemark": null,
        "Fare": {
          "Currency": "USD",
          "BaseFare": 315.71,
          "Tax": 47.29,
          "TaxBreakup": [
            {
              "key": "K3",
              "value": 16.6
            },
            {
              "key": "YQTax",
              "value": 0
            },
            {
              "key": "YR",
              "value": 15.94
            },
            {
              "key": "PSF",
              "value": 0
            },
            {
              "key": "UDF",
              "value": 0
            },
            {
              "key": "INTax",
              "value": 0
            },
            {
              "key": "TransactionFee",
              "value": 0
            },
            {
              "key": "OtherTaxes",
              "value": 14.74
            }
          ],
          "YQTax": 0,
          "AdditionalTxnFeeOfrd": 0,
          "AdditionalTxnFeePub": 0,
          "PGCharge": 0,
          "OtherCharges": 0.06,
          "ChargeBU": [
            {
              "key": "TBOMARKUP",
              "value": 0
            },
            {
              "key": "CONVENIENCECHARGE",
              "value": 0
            },
            {
              "key": "OTHERCHARGE",
              "value": 0.06
            }
          ],
          "Discount": 0,
          "PublishedFare": 363.07,
          "CommissionEarned": 0,
          "PLBEarned": 0,
          "IncentiveEarned": 0,
          "OfferedFare": 363.07,
          "TdsOnCommission": 0,
          "TdsOnPLB": 0,
          "TdsOnIncentive": 0,
          "ServiceFee": 0,
          "TotalBaggageCharges": 0,
          "TotalMealCharges": 0,
          "TotalSeatCharges": 0,
          "TotalSpecialServiceCharges": 0,
          "GST": {
            "CGSTAmount": 0.01,
            "CGSTRate": 13.00,
            "CessAmount": 0,
            "CessRate": 0,
            "IGSTAmount": 0,
            "IGSTRate": 0,
            "SGSTAmount": 0.01,
            "SGSTRate": 11.00,
            "TaxableAmount": 0.06
          }
        },
        "BaseCurrencyFare": {
          "Currency": "INR",
          "BaseFare": 22100,
          "Tax": 3310,
          "TaxBreakup": [
            {
              "key": "K3",
              "value": 1162
            },
            {
              "key": "YQTax",
              "value": 0
            },
            {
              "key": "YR",
              "value": 1116
            },
            {
              "key": "PSF",
              "value": 0
            },
            {
              "key": "UDF",
              "value": 0
            },
            {
              "key": "INTax",
              "value": 0
            },
            {
              "key": "TransactionFee",
              "value": 0
            },
            {
              "key": "OtherTaxes",
              "value": 1032
            }
          ],
          "YQTax": 0,
          "AdditionalTxnFeeOfrd": 0,
          "AdditionalTxnFeePub": 0,
          "PGCharge": 0,
          "OtherCharges": 4.00,
          "ChargeBU": [
            {
              "key": "TBOMARKUP",
              "value": 0
            },
            {
              "key": "CONVENIENCECHARGE",
              "value": 0
            },
            {
              "key": "OTHERCHARGE",
              "value": 4.00
            }
          ],
          "Discount": 0,
          "PublishedFare": 25414.96,
          "CommissionEarned": 0,
          "PLBEarned": 0,
          "IncentiveEarned": 0,
          "OfferedFare": 25414.96,
          "TdsOnCommission": 0,
          "TdsOnPLB": 0,
          "TdsOnIncentive": 0,
          "ServiceFee": 0,
          "TotalBaggageCharges": 0,
          "TotalMealCharges": 0,
          "TotalSeatCharges": 0,
          "TotalSpecialServiceCharges": 0,
          "GST": {
            "CGSTAmount": 0.5200,
            "CGSTRate": 13.00,
            "CessAmount": 0.00,
            "CessRate": 0,
            "IGSTAmount": 0,
            "IGSTRate": 0,
            "SGSTAmount": 0.4400,
            "SGSTRate": 11.00,
            "TaxableAmount": 4.00
          }
        },
        "FareBreakdown": [
          {
            "Currency": "USD",
            "PassengerType": 1,
            "PassengerCount": 1,
            "BaseFare": 140,
            "Tax": 19.96,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "USD",
            "PassengerType": 2,
            "PassengerCount": 1,
            "BaseFare": 140,
            "Tax": 19.96,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "USD",
            "PassengerType": 3,
            "PassengerCount": 1,
            "BaseFare": 35.71,
            "Tax": 7.37,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          }
        ],
        "BaseCurrencyFareBreakdown": [
          {
            "Currency": "INR",
            "PassengerType": 1,
            "PassengerCount": 1,
            "BaseFare": 9800,
            "Tax": 1397,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "INR",
            "PassengerType": 2,
            "PassengerCount": 1,
            "BaseFare": 9800,
            "Tax": 1397,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "INR",
            "PassengerType": 3,
            "PassengerCount": 1,
            "BaseFare": 2500,
            "Tax": 516,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          }
        ],
        "Segments": [
          [
            {
              "Baggage": "1 PC(s)",
              "CabinBaggage": null,
              "TripIndicator": 1,
              "SegmentIndicator": 1,
              "Airline": {
                "AirlineCode": "UK",
                "AirlineName": "Air Vistara",
                "FlightNumber": "191",
                "FareClass": "E",
                "OperatingCarrier": "UK"
              },
              "Origin": {
                "Airport": {
                  "AirportCode": "BLR",
                  "AirportName": "Hindustan",
                  "Terminal": "",
                  "CityCode": "BLR",
                  "CityName": "Bangalore",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "DepTime": "2019-05-31T19:00:00"
              },
              "Destination": {
                "Airport": {
                  "AirportCode": "DEL",
                  "AirportName": "Indira Gandhi Airport",
                  "Terminal": "3",
                  "CityCode": "DEL",
                  "CityName": "Delhi",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "ArrTime": "2019-05-31T22:00:00"
              },
              "Duration": 0,
              "GroundTime": 0,
              "Mile": 0,
              "StopOver": false,
              "FlightInfoIndex": "1",
              "StopPoint": "",
              "StopPointArrivalTime": "2019-05-31T22:00:00",
              "StopPointDepartureTime": "2019-05-31T19:00:00",
              "Craft": "737",
              "Remark": null,
              "IsETicketEligible": true,
              "FlightStatus": "Confirmed",
              "Status": ""
            },
            {
              "Baggage": "1 PC(s)",
              "CabinBaggage": null,
              "TripIndicator": 1,
              "SegmentIndicator": 2,
              "Airline": {
                "AirlineCode": "UK",
                "AirlineName": "Air Vistara",
                "FlightNumber": "719",
                "FareClass": "E",
                "OperatingCarrier": "UK"
              },
              "Origin": {
                "Airport": {
                  "AirportCode": "DEL",
                  "AirportName": "Indira Gandhi Airport",
                  "Terminal": "3",
                  "CityCode": "DEL",
                  "CityName": "Delhi",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "DepTime": "2019-06-01T20:10:00"
              },
              "Destination": {
                "Airport": {
                  "AirportCode": "CCU",
                  "AirportName": "Calcutta",
                  "Terminal": "",
                  "CityCode": "CCU",
                  "CityName": "Kolkata",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "ArrTime": "2019-06-01T22:20:00"
              },
              "AccumulatedDuration": 1640,
              "Duration": 0,
              "GroundTime": 0,
              "Mile": 0,
              "StopOver": false,
              "FlightInfoIndex": "2",
              "StopPoint": "",
              "StopPointArrivalTime": "2019-06-01T22:20:00",
              "StopPointDepartureTime": "2019-06-01T20:10:00",
              "Craft": "320",
              "Remark": null,
              "IsETicketEligible": true,
              "FlightStatus": "Confirmed",
              "Status": ""
            }
          ]
        ],
        "LastTicketDate": "29MAY19",
        "TicketAdvisory": "LAST TKT DTE 29MAY19  - SEE ADV PURCHASE \n",
        "FareRules": [
          {
            "Origin": "BLR",
            "Destination": "DEL",
            "Airline": "UK",
            "FareBasisCode": "EH1PYL",
            "FareRuleDetail": "",
            "FareRestriction": null,
            "FareFamilyCode": "ECOYL",
            "FareRuleIndex": "1"
          },
          {
            "Origin": "DEL",
            "Destination": "CCU",
            "Airline": "UK",
            "FareBasisCode": "EH1PYL",
            "FareRuleDetail": "",
            "FareRestriction": null,
            "FareFamilyCode": "ECOYL",
            "FareRuleIndex": "2"
          }
        ],
        "AirlineCode": "UK",
        "ValidatingAirline": "UK",
        "UpsellOptionsList": {
          "UpsellList": [
            {
              "FareFamilyCode": "ECOYL",
              "FareFamilyName": "Economy Lite",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 1,
              "ServicesList": [
                {
                  "Code": "0B3",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Buy on board"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYL",
              "FareFamilyName": "Economy Lite",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 1,
              "ServicesList": [
                {
                  "Code": "0B3",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Buy on board"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYL",
              "FareFamilyName": "Economy Lite",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 2,
              "ServicesList": [
                {
                  "Code": "0B3",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Buy on board"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYL",
              "FareFamilyName": "Economy Lite",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 2,
              "ServicesList": [
                {
                  "Code": "0B3",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Buy on board"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYL",
              "FareFamilyName": "Economy Lite",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 3,
              "ServicesList": [
                {
                  "Code": "0B3",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Buy on board"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYL",
              "FareFamilyName": "Economy Lite",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 3,
              "ServicesList": [
                {
                  "Code": "0B3",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Buy on board"
                }
              ]
            }
          ]
        }
      },
      {
        "ResultIndex": "OB20",
        "Source": 4,
        "IsLCC": false,
        "IsRefundable": true,
        "GSTAllowed": true,
        "IsCouponAppilcable": true,
        "IsGSTMandatory": false,
        "AirlineRemark": null,
        "Fare": {
          "Currency": "USD",
          "BaseFare": 347.14,
          "Tax": 48.86,
          "TaxBreakup": [
            {
              "key": "K3",
              "value": 18.17
            },
            {
              "key": "YQTax",
              "value": 0
            },
            {
              "key": "YR",
              "value": 15.94
            },
            {
              "key": "PSF",
              "value": 0
            },
            {
              "key": "UDF",
              "value": 0
            },
            {
              "key": "INTax",
              "value": 0
            },
            {
              "key": "TransactionFee",
              "value": 0
            },
            {
              "key": "OtherTaxes",
              "value": 14.74
            }
          ],
          "YQTax": 0,
          "AdditionalTxnFeeOfrd": 0,
          "AdditionalTxnFeePub": 0,
          "PGCharge": 0,
          "OtherCharges": 0.06,
          "ChargeBU": [
            {
              "key": "TBOMARKUP",
              "value": 0
            },
            {
              "key": "CONVENIENCECHARGE",
              "value": 0
            },
            {
              "key": "OTHERCHARGE",
              "value": 0.06
            }
          ],
          "Discount": 0,
          "PublishedFare": 396.07,
          "CommissionEarned": 0,
          "PLBEarned": 0,
          "IncentiveEarned": 0,
          "OfferedFare": 396.07,
          "TdsOnCommission": 0,
          "TdsOnPLB": 0,
          "TdsOnIncentive": 0,
          "ServiceFee": 0,
          "TotalBaggageCharges": 0,
          "TotalMealCharges": 0,
          "TotalSeatCharges": 0,
          "TotalSpecialServiceCharges": 0,
          "GST": {
            "CGSTAmount": 0.01,
            "CGSTRate": 13.00,
            "CessAmount": 0,
            "CessRate": 0,
            "IGSTAmount": 0,
            "IGSTRate": 0,
            "SGSTAmount": 0.01,
            "SGSTRate": 11.00,
            "TaxableAmount": 0.06
          }
        },
        "BaseCurrencyFare": {
          "Currency": "INR",
          "BaseFare": 24300,
          "Tax": 3420,
          "TaxBreakup": [
            {
              "key": "K3",
              "value": 1272
            },
            {
              "key": "YQTax",
              "value": 0
            },
            {
              "key": "YR",
              "value": 1116
            },
            {
              "key": "PSF",
              "value": 0
            },
            {
              "key": "UDF",
              "value": 0
            },
            {
              "key": "INTax",
              "value": 0
            },
            {
              "key": "TransactionFee",
              "value": 0
            },
            {
              "key": "OtherTaxes",
              "value": 1032
            }
          ],
          "YQTax": 0,
          "AdditionalTxnFeeOfrd": 0,
          "AdditionalTxnFeePub": 0,
          "PGCharge": 0,
          "OtherCharges": 4.00,
          "ChargeBU": [
            {
              "key": "TBOMARKUP",
              "value": 0
            },
            {
              "key": "CONVENIENCECHARGE",
              "value": 0
            },
            {
              "key": "OTHERCHARGE",
              "value": 4.00
            }
          ],
          "Discount": 0,
          "PublishedFare": 27724.96,
          "CommissionEarned": 0,
          "PLBEarned": 0,
          "IncentiveEarned": 0,
          "OfferedFare": 27724.96,
          "TdsOnCommission": 0,
          "TdsOnPLB": 0,
          "TdsOnIncentive": 0,
          "ServiceFee": 0,
          "TotalBaggageCharges": 0,
          "TotalMealCharges": 0,
          "TotalSeatCharges": 0,
          "TotalSpecialServiceCharges": 0,
          "GST": {
            "CGSTAmount": 0.5200,
            "CGSTRate": 13.00,
            "CessAmount": 0.00,
            "CessRate": 0,
            "IGSTAmount": 0,
            "IGSTRate": 0,
            "SGSTAmount": 0.4400,
            "SGSTRate": 11.00,
            "TaxableAmount": 4.00
          }
        },
        "FareBreakdown": [
          {
            "Currency": "USD",
            "PassengerType": 1,
            "PassengerCount": 1,
            "BaseFare": 155.71,
            "Tax": 20.74,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "USD",
            "PassengerType": 2,
            "PassengerCount": 1,
            "BaseFare": 155.71,
            "Tax": 20.74,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "USD",
            "PassengerType": 3,
            "PassengerCount": 1,
            "BaseFare": 35.71,
            "Tax": 7.37,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          }
        ],
        "BaseCurrencyFareBreakdown": [
          {
            "Currency": "INR",
            "PassengerType": 1,
            "PassengerCount": 1,
            "BaseFare": 10900,
            "Tax": 1452,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "INR",
            "PassengerType": 2,
            "PassengerCount": 1,
            "BaseFare": 10900,
            "Tax": 1452,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "INR",
            "PassengerType": 3,
            "PassengerCount": 1,
            "BaseFare": 2500,
            "Tax": 516,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          }
        ],
        "Segments": [
          [
            {
              "Baggage": "1 PC(s)",
              "CabinBaggage": null,
              "TripIndicator": 1,
              "SegmentIndicator": 1,
              "Airline": {
                "AirlineCode": "UK",
                "AirlineName": "Air Vistara",
                "FlightNumber": "191",
                "FareClass": "V",
                "OperatingCarrier": "UK"
              },
              "Origin": {
                "Airport": {
                  "AirportCode": "BLR",
                  "AirportName": "Hindustan",
                  "Terminal": "",
                  "CityCode": "BLR",
                  "CityName": "Bangalore",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "DepTime": "2019-05-31T19:00:00"
              },
              "Destination": {
                "Airport": {
                  "AirportCode": "DEL",
                  "AirportName": "Indira Gandhi Airport",
                  "Terminal": "3",
                  "CityCode": "DEL",
                  "CityName": "Delhi",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "ArrTime": "2019-05-31T22:00:00"
              },
              "Duration": 0,
              "GroundTime": 0,
              "Mile": 0,
              "StopOver": false,
              "FlightInfoIndex": "1",
              "StopPoint": "",
              "StopPointArrivalTime": "2019-05-31T22:00:00",
              "StopPointDepartureTime": "2019-05-31T19:00:00",
              "Craft": "737",
              "Remark": null,
              "IsETicketEligible": true,
              "FlightStatus": "Confirmed",
              "Status": ""
            },
            {
              "Baggage": "1 PC(s)",
              "CabinBaggage": null,
              "TripIndicator": 1,
              "SegmentIndicator": 2,
              "Airline": {
                "AirlineCode": "UK",
                "AirlineName": "Air Vistara",
                "FlightNumber": "719",
                "FareClass": "V",
                "OperatingCarrier": "UK"
              },
              "Origin": {
                "Airport": {
                  "AirportCode": "DEL",
                  "AirportName": "Indira Gandhi Airport",
                  "Terminal": "3",
                  "CityCode": "DEL",
                  "CityName": "Delhi",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "DepTime": "2019-06-01T20:10:00"
              },
              "Destination": {
                "Airport": {
                  "AirportCode": "CCU",
                  "AirportName": "Calcutta",
                  "Terminal": "",
                  "CityCode": "CCU",
                  "CityName": "Kolkata",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "ArrTime": "2019-06-01T22:20:00"
              },
              "AccumulatedDuration": 1640,
              "Duration": 0,
              "GroundTime": 0,
              "Mile": 0,
              "StopOver": false,
              "FlightInfoIndex": "2",
              "StopPoint": "",
              "StopPointArrivalTime": "2019-06-01T22:20:00",
              "StopPointDepartureTime": "2019-06-01T20:10:00",
              "Craft": "320",
              "Remark": null,
              "IsETicketEligible": true,
              "FlightStatus": "Confirmed",
              "Status": ""
            }
          ]
        ],
        "LastTicketDate": "29MAY19",
        "TicketAdvisory": "LAST TKT DTE 29MAY19  - SEE ADV PURCHASE \n",
        "FareRules": [
          {
            "Origin": "BLR",
            "Destination": "DEL",
            "Airline": "UK",
            "FareBasisCode": "VH1PYS",
            "FareRuleDetail": "",
            "FareRestriction": null,
            "FareFamilyCode": "ECOYS",
            "FareRuleIndex": "1"
          },
          {
            "Origin": "DEL",
            "Destination": "CCU",
            "Airline": "UK",
            "FareBasisCode": "VH1PYS",
            "FareRuleDetail": "",
            "FareRestriction": null,
            "FareFamilyCode": "ECOYS",
            "FareRuleIndex": "2"
          }
        ],
        "AirlineCode": "UK",
        "ValidatingAirline": "UK",
        "UpsellOptionsList": {
          "UpsellList": [
            {
              "FareFamilyCode": "ECOYS",
              "FareFamilyName": "ECONOMY Standard",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 1,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "SEAT|any seat except Emergency Exit"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|2500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYS",
              "FareFamilyName": "ECONOMY Standard",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 1,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "SEAT|any seat except Emergency Exit"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|2500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYS",
              "FareFamilyName": "ECONOMY Standard",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 2,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "SEAT|any seat except Emergency Exit"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|2500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYS",
              "FareFamilyName": "ECONOMY Standard",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 2,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "SEAT|any seat except Emergency Exit"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|2500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYS",
              "FareFamilyName": "ECONOMY Standard",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 3,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "SEAT|any seat except Emergency Exit"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|2500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYS",
              "FareFamilyName": "ECONOMY Standard",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 3,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "SEAT|any seat except Emergency Exit"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|2500 per change"
                }
              ]
            }
          ]
        }
      },
      {
        "ResultIndex": "OB21",
        "Source": 4,
        "IsLCC": false,
        "IsRefundable": true,
        "GSTAllowed": true,
        "IsCouponAppilcable": true,
        "IsGSTMandatory": false,
        "AirlineRemark": null,
        "Fare": {
          "Currency": "USD",
          "BaseFare": 415.66,
          "Tax": 52.29,
          "TaxBreakup": [
            {
              "key": "K3",
              "value": 21.6
            },
            {
              "key": "YQTax",
              "value": 0
            },
            {
              "key": "YR",
              "value": 15.94
            },
            {
              "key": "PSF",
              "value": 0
            },
            {
              "key": "UDF",
              "value": 0
            },
            {
              "key": "INTax",
              "value": 0
            },
            {
              "key": "TransactionFee",
              "value": 0
            },
            {
              "key": "OtherTaxes",
              "value": 14.74
            }
          ],
          "YQTax": 0,
          "AdditionalTxnFeeOfrd": 0,
          "AdditionalTxnFeePub": 0,
          "PGCharge": 0,
          "OtherCharges": 0.06,
          "ChargeBU": [
            {
              "key": "TBOMARKUP",
              "value": 0
            },
            {
              "key": "CONVENIENCECHARGE",
              "value": 0
            },
            {
              "key": "OTHERCHARGE",
              "value": 0.06
            }
          ],
          "Discount": 0,
          "PublishedFare": 468.01,
          "CommissionEarned": 0,
          "PLBEarned": 0,
          "IncentiveEarned": 0,
          "OfferedFare": 468.01,
          "TdsOnCommission": 0,
          "TdsOnPLB": 0,
          "TdsOnIncentive": 0,
          "ServiceFee": 0,
          "TotalBaggageCharges": 0,
          "TotalMealCharges": 0,
          "TotalSeatCharges": 0,
          "TotalSpecialServiceCharges": 0,
          "GST": {
            "CGSTAmount": 0.01,
            "CGSTRate": 13.00,
            "CessAmount": 0,
            "CessRate": 0,
            "IGSTAmount": 0,
            "IGSTRate": 0,
            "SGSTAmount": 0.01,
            "SGSTRate": 11.00,
            "TaxableAmount": 0.06
          }
        },
        "BaseCurrencyFare": {
          "Currency": "INR",
          "BaseFare": 29096,
          "Tax": 3660,
          "TaxBreakup": [
            {
              "key": "K3",
              "value": 1512
            },
            {
              "key": "YQTax",
              "value": 0
            },
            {
              "key": "YR",
              "value": 1116
            },
            {
              "key": "PSF",
              "value": 0
            },
            {
              "key": "UDF",
              "value": 0
            },
            {
              "key": "INTax",
              "value": 0
            },
            {
              "key": "TransactionFee",
              "value": 0
            },
            {
              "key": "OtherTaxes",
              "value": 1032
            }
          ],
          "YQTax": 0,
          "AdditionalTxnFeeOfrd": 0,
          "AdditionalTxnFeePub": 0,
          "PGCharge": 0,
          "OtherCharges": 4.00,
          "ChargeBU": [
            {
              "key": "TBOMARKUP",
              "value": 0
            },
            {
              "key": "CONVENIENCECHARGE",
              "value": 0
            },
            {
              "key": "OTHERCHARGE",
              "value": 4.00
            }
          ],
          "Discount": 0,
          "PublishedFare": 32760.96,
          "CommissionEarned": 0,
          "PLBEarned": 0,
          "IncentiveEarned": 0,
          "OfferedFare": 32760.96,
          "TdsOnCommission": 0,
          "TdsOnPLB": 0,
          "TdsOnIncentive": 0,
          "ServiceFee": 0,
          "TotalBaggageCharges": 0,
          "TotalMealCharges": 0,
          "TotalSeatCharges": 0,
          "TotalSpecialServiceCharges": 0,
          "GST": {
            "CGSTAmount": 0.5200,
            "CGSTRate": 13.00,
            "CessAmount": 0.00,
            "CessRate": 0,
            "IGSTAmount": 0,
            "IGSTRate": 0,
            "SGSTAmount": 0.4400,
            "SGSTRate": 11.00,
            "TaxableAmount": 4.00
          }
        },
        "FareBreakdown": [
          {
            "Currency": "USD",
            "PassengerType": 1,
            "PassengerCount": 1,
            "BaseFare": 189.97,
            "Tax": 22.46,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "USD",
            "PassengerType": 2,
            "PassengerCount": 1,
            "BaseFare": 189.97,
            "Tax": 22.46,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "USD",
            "PassengerType": 3,
            "PassengerCount": 1,
            "BaseFare": 35.71,
            "Tax": 7.37,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          }
        ],
        "BaseCurrencyFareBreakdown": [
          {
            "Currency": "INR",
            "PassengerType": 1,
            "PassengerCount": 1,
            "BaseFare": 13298,
            "Tax": 1572,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "INR",
            "PassengerType": 2,
            "PassengerCount": 1,
            "BaseFare": 13298,
            "Tax": 1572,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "INR",
            "PassengerType": 3,
            "PassengerCount": 1,
            "BaseFare": 2500,
            "Tax": 516,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          }
        ],
        "Segments": [
          [
            {
              "Baggage": "1 PC(s)",
              "CabinBaggage": null,
              "TripIndicator": 1,
              "SegmentIndicator": 1,
              "Airline": {
                "AirlineCode": "UK",
                "AirlineName": "Air Vistara",
                "FlightNumber": "191",
                "FareClass": "V",
                "OperatingCarrier": "UK"
              },
              "Origin": {
                "Airport": {
                  "AirportCode": "BLR",
                  "AirportName": "Hindustan",
                  "Terminal": "",
                  "CityCode": "BLR",
                  "CityName": "Bangalore",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "DepTime": "2019-05-31T19:00:00"
              },
              "Destination": {
                "Airport": {
                  "AirportCode": "DEL",
                  "AirportName": "Indira Gandhi Airport",
                  "Terminal": "3",
                  "CityCode": "DEL",
                  "CityName": "Delhi",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "ArrTime": "2019-05-31T22:00:00"
              },
              "Duration": 0,
              "GroundTime": 0,
              "Mile": 0,
              "StopOver": false,
              "FlightInfoIndex": "1",
              "StopPoint": "",
              "StopPointArrivalTime": "2019-05-31T22:00:00",
              "StopPointDepartureTime": "2019-05-31T19:00:00",
              "Craft": "737",
              "Remark": null,
              "IsETicketEligible": true,
              "FlightStatus": "Confirmed",
              "Status": ""
            },
            {
              "Baggage": "1 PC(s)",
              "CabinBaggage": null,
              "TripIndicator": 1,
              "SegmentIndicator": 2,
              "Airline": {
                "AirlineCode": "UK",
                "AirlineName": "Air Vistara",
                "FlightNumber": "719",
                "FareClass": "V",
                "OperatingCarrier": "UK"
              },
              "Origin": {
                "Airport": {
                  "AirportCode": "DEL",
                  "AirportName": "Indira Gandhi Airport",
                  "Terminal": "3",
                  "CityCode": "DEL",
                  "CityName": "Delhi",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "DepTime": "2019-06-01T20:10:00"
              },
              "Destination": {
                "Airport": {
                  "AirportCode": "CCU",
                  "AirportName": "Calcutta",
                  "Terminal": "",
                  "CityCode": "CCU",
                  "CityName": "Kolkata",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "ArrTime": "2019-06-01T22:20:00"
              },
              "AccumulatedDuration": 1640,
              "Duration": 0,
              "GroundTime": 0,
              "Mile": 0,
              "StopOver": false,
              "FlightInfoIndex": "2",
              "StopPoint": "",
              "StopPointArrivalTime": "2019-06-01T22:20:00",
              "StopPointDepartureTime": "2019-06-01T20:10:00",
              "Craft": "320",
              "Remark": null,
              "IsETicketEligible": true,
              "FlightStatus": "Confirmed",
              "Status": ""
            }
          ]
        ],
        "LastTicketDate": "29MAY19",
        "TicketAdvisory": "LAST TKT DTE 29MAY19  - SEE ADV PURCHASE \n",
        "FareRules": [
          {
            "Origin": "BLR",
            "Destination": "DEL",
            "Airline": "UK",
            "FareBasisCode": "VH1PYF",
            "FareRuleDetail": "",
            "FareRestriction": null,
            "FareFamilyCode": "ECOYF",
            "FareRuleIndex": "1"
          },
          {
            "Origin": "DEL",
            "Destination": "CCU",
            "Airline": "UK",
            "FareBasisCode": "VH1PYF",
            "FareRuleDetail": "",
            "FareRestriction": null,
            "FareFamilyCode": "ECOYF",
            "FareRuleIndex": "2"
          }
        ],
        "AirlineCode": "UK",
        "ValidatingAirline": "UK",
        "UpsellOptionsList": {
          "UpsellList": [
            {
              "FareFamilyCode": "ECOYF",
              "FareFamilyName": "ECONOMY Flexi",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 1,
              "ServicesList": [
                {
                  "Code": "0G6",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BOARDING CHARGES|Priority Handling(Check-in, Boarding) - Complimentary"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYF",
              "FareFamilyName": "ECONOMY Flexi",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 1,
              "ServicesList": [
                {
                  "Code": "0G6",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BOARDING CHARGES|Priority Handling(Check-in, Boarding) - Complimentary"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYF",
              "FareFamilyName": "ECONOMY Flexi",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 2,
              "ServicesList": [
                {
                  "Code": "0G6",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BOARDING CHARGES|Priority Handling(Check-in, Boarding) - Complimentary"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYF",
              "FareFamilyName": "ECONOMY Flexi",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 2,
              "ServicesList": [
                {
                  "Code": "0G6",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BOARDING CHARGES|Priority Handling(Check-in, Boarding) - Complimentary"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYF",
              "FareFamilyName": "ECONOMY Flexi",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 3,
              "ServicesList": [
                {
                  "Code": "0G6",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BOARDING CHARGES|Priority Handling(Check-in, Boarding) - Complimentary"
                }
              ]
            },
            {
              "FareFamilyCode": "ECOYF",
              "FareFamilyName": "ECONOMY Flexi",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 3,
              "ServicesList": [
                {
                  "Code": "0G6",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BOARDING CHARGES|Priority Handling(Check-in, Boarding) - Complimentary"
                }
              ]
            }
          ]
        }
      },
      {
        "ResultIndex": "OB22",
        "Source": 4,
        "IsLCC": false,
        "IsRefundable": true,
        "GSTAllowed": true,
        "IsCouponAppilcable": true,
        "IsGSTMandatory": false,
        "AirlineRemark": null,
        "Fare": {
          "Currency": "USD",
          "BaseFare": 1567.14,
          "Tax": 220.67,
          "TaxBreakup": [
            {
              "key": "K3",
              "value": 189.99
            },
            {
              "key": "YQTax",
              "value": 0
            },
            {
              "key": "YR",
              "value": 15.94
            },
            {
              "key": "PSF",
              "value": 0
            },
            {
              "key": "UDF",
              "value": 0
            },
            {
              "key": "INTax",
              "value": 0
            },
            {
              "key": "TransactionFee",
              "value": 0
            },
            {
              "key": "OtherTaxes",
              "value": 14.74
            }
          ],
          "YQTax": 0,
          "AdditionalTxnFeeOfrd": 0,
          "AdditionalTxnFeePub": 0,
          "PGCharge": 0,
          "OtherCharges": 0.06,
          "ChargeBU": [
            {
              "key": "TBOMARKUP",
              "value": 0
            },
            {
              "key": "CONVENIENCECHARGE",
              "value": 0
            },
            {
              "key": "OTHERCHARGE",
              "value": 0.06
            }
          ],
          "Discount": 0,
          "PublishedFare": 1787.89,
          "CommissionEarned": 0,
          "PLBEarned": 0,
          "IncentiveEarned": 0,
          "OfferedFare": 1787.89,
          "TdsOnCommission": 0,
          "TdsOnPLB": 0,
          "TdsOnIncentive": 0,
          "ServiceFee": 0,
          "TotalBaggageCharges": 0,
          "TotalMealCharges": 0,
          "TotalSeatCharges": 0,
          "TotalSpecialServiceCharges": 0,
          "GST": {
            "CGSTAmount": 0.01,
            "CGSTRate": 13.00,
            "CessAmount": 0,
            "CessRate": 0,
            "IGSTAmount": 0,
            "IGSTRate": 0,
            "SGSTAmount": 0.01,
            "SGSTRate": 11.00,
            "TaxableAmount": 0.06
          }
        },
        "BaseCurrencyFare": {
          "Currency": "INR",
          "BaseFare": 109700,
          "Tax": 15447,
          "TaxBreakup": [
            {
              "key": "K3",
              "value": 13299
            },
            {
              "key": "YQTax",
              "value": 0
            },
            {
              "key": "YR",
              "value": 1116
            },
            {
              "key": "PSF",
              "value": 0
            },
            {
              "key": "UDF",
              "value": 0
            },
            {
              "key": "INTax",
              "value": 0
            },
            {
              "key": "TransactionFee",
              "value": 0
            },
            {
              "key": "OtherTaxes",
              "value": 1032
            }
          ],
          "YQTax": 0,
          "AdditionalTxnFeeOfrd": 0,
          "AdditionalTxnFeePub": 0,
          "PGCharge": 0,
          "OtherCharges": 4.00,
          "ChargeBU": [
            {
              "key": "TBOMARKUP",
              "value": 0
            },
            {
              "key": "CONVENIENCECHARGE",
              "value": 0
            },
            {
              "key": "OTHERCHARGE",
              "value": 4.00
            }
          ],
          "Discount": 0,
          "PublishedFare": 125151.96,
          "CommissionEarned": 0,
          "PLBEarned": 0,
          "IncentiveEarned": 0,
          "OfferedFare": 125151.96,
          "TdsOnCommission": 0,
          "TdsOnPLB": 0,
          "TdsOnIncentive": 0,
          "ServiceFee": 0,
          "TotalBaggageCharges": 0,
          "TotalMealCharges": 0,
          "TotalSeatCharges": 0,
          "TotalSpecialServiceCharges": 0,
          "GST": {
            "CGSTAmount": 0.5200,
            "CGSTRate": 13.00,
            "CessAmount": 0.00,
            "CessRate": 0,
            "IGSTAmount": 0,
            "IGSTRate": 0,
            "SGSTAmount": 0.4400,
            "SGSTRate": 11.00,
            "TaxableAmount": 4.00
          }
        },
        "FareBreakdown": [
          {
            "Currency": "USD",
            "PassengerType": 1,
            "PassengerCount": 1,
            "BaseFare": 730,
            "Tax": 100.93,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "USD",
            "PassengerType": 2,
            "PassengerCount": 1,
            "BaseFare": 730,
            "Tax": 100.93,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "USD",
            "PassengerType": 3,
            "PassengerCount": 1,
            "BaseFare": 107.14,
            "Tax": 18.81,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          }
        ],
        "BaseCurrencyFareBreakdown": [
          {
            "Currency": "INR",
            "PassengerType": 1,
            "PassengerCount": 1,
            "BaseFare": 51100,
            "Tax": 7065,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "INR",
            "PassengerType": 2,
            "PassengerCount": 1,
            "BaseFare": 51100,
            "Tax": 7065,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "INR",
            "PassengerType": 3,
            "PassengerCount": 1,
            "BaseFare": 7500,
            "Tax": 1317,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          }
        ],
        "Segments": [
          [
            {
              "Baggage": "1 PC(s)",
              "CabinBaggage": null,
              "TripIndicator": 1,
              "SegmentIndicator": 1,
              "Airline": {
                "AirlineCode": "UK",
                "AirlineName": "Air Vistara",
                "FlightNumber": "191",
                "FareClass": "Z",
                "OperatingCarrier": "UK"
              },
              "Origin": {
                "Airport": {
                  "AirportCode": "BLR",
                  "AirportName": "Hindustan",
                  "Terminal": "",
                  "CityCode": "BLR",
                  "CityName": "Bangalore",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "DepTime": "2019-05-31T19:00:00"
              },
              "Destination": {
                "Airport": {
                  "AirportCode": "DEL",
                  "AirportName": "Indira Gandhi Airport",
                  "Terminal": "3",
                  "CityCode": "DEL",
                  "CityName": "Delhi",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "ArrTime": "2019-05-31T22:00:00"
              },
              "Duration": 0,
              "GroundTime": 0,
              "Mile": 0,
              "StopOver": false,
              "FlightInfoIndex": "1",
              "StopPoint": "",
              "StopPointArrivalTime": "2019-05-31T22:00:00",
              "StopPointDepartureTime": "2019-05-31T19:00:00",
              "Craft": "737",
              "Remark": null,
              "IsETicketEligible": true,
              "FlightStatus": "Confirmed",
              "Status": ""
            },
            {
              "Baggage": "1 PC(s)",
              "CabinBaggage": null,
              "TripIndicator": 1,
              "SegmentIndicator": 2,
              "Airline": {
                "AirlineCode": "UK",
                "AirlineName": "Air Vistara",
                "FlightNumber": "719",
                "FareClass": "Z",
                "OperatingCarrier": "UK"
              },
              "Origin": {
                "Airport": {
                  "AirportCode": "DEL",
                  "AirportName": "Indira Gandhi Airport",
                  "Terminal": "3",
                  "CityCode": "DEL",
                  "CityName": "Delhi",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "DepTime": "2019-06-01T20:10:00"
              },
              "Destination": {
                "Airport": {
                  "AirportCode": "CCU",
                  "AirportName": "Calcutta",
                  "Terminal": "",
                  "CityCode": "CCU",
                  "CityName": "Kolkata",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "ArrTime": "2019-06-01T22:20:00"
              },
              "AccumulatedDuration": 1640,
              "Duration": 0,
              "GroundTime": 0,
              "Mile": 0,
              "StopOver": false,
              "FlightInfoIndex": "2",
              "StopPoint": "",
              "StopPointArrivalTime": "2019-06-01T22:20:00",
              "StopPointDepartureTime": "2019-06-01T20:10:00",
              "Craft": "320",
              "Remark": null,
              "IsETicketEligible": true,
              "FlightStatus": "Confirmed",
              "Status": ""
            }
          ]
        ],
        "LastTicketDate": "29MAY19",
        "TicketAdvisory": "LAST TKT DTE 29MAY19  - SEE ADV PURCHASE \n",
        "FareRules": [
          {
            "Origin": "BLR",
            "Destination": "DEL",
            "Airline": "UK",
            "FareBasisCode": "Z1PCV",
            "FareRuleDetail": "",
            "FareRestriction": null,
            "FareFamilyCode": "BIZCV",
            "FareRuleIndex": "1"
          },
          {
            "Origin": "DEL",
            "Destination": "CCU",
            "Airline": "UK",
            "FareBasisCode": "Z3PCV",
            "FareRuleDetail": "",
            "FareRestriction": null,
            "FareFamilyCode": "BIZCV",
            "FareRuleIndex": "2"
          }
        ],
        "AirlineCode": "UK",
        "ValidatingAirline": "UK",
        "UpsellOptionsList": {
          "UpsellList": [
            {
              "FareFamilyCode": "BIZCV",
              "FareFamilyName": "BUSINESS Value",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 1,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - 3500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCV",
              "FareFamilyName": "BUSINESS Value",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 1,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - 3500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCV",
              "FareFamilyName": "BUSINESS Value",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 2,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - 3500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCV",
              "FareFamilyName": "BUSINESS Value",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 2,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - 3500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCV",
              "FareFamilyName": "BUSINESS Value",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 3,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - 3500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCV",
              "FareFamilyName": "BUSINESS Value",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 3,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - 3500 per change"
                }
              ]
            }
          ]
        }
      },
      {
        "ResultIndex": "OB23",
        "Source": 4,
        "IsLCC": false,
        "IsRefundable": true,
        "GSTAllowed": true,
        "IsCouponAppilcable": true,
        "IsGSTMandatory": false,
        "AirlineRemark": null,
        "Fare": {
          "Currency": "USD",
          "BaseFare": 1669.94,
          "Tax": 233.01,
          "TaxBreakup": [
            {
              "key": "K3",
              "value": 202.33
            },
            {
              "key": "YQTax",
              "value": 0
            },
            {
              "key": "YR",
              "value": 15.94
            },
            {
              "key": "PSF",
              "value": 0
            },
            {
              "key": "UDF",
              "value": 0
            },
            {
              "key": "INTax",
              "value": 0
            },
            {
              "key": "TransactionFee",
              "value": 0
            },
            {
              "key": "OtherTaxes",
              "value": 14.74
            }
          ],
          "YQTax": 0,
          "AdditionalTxnFeeOfrd": 0,
          "AdditionalTxnFeePub": 0,
          "PGCharge": 0,
          "OtherCharges": 0.06,
          "ChargeBU": [
            {
              "key": "TBOMARKUP",
              "value": 0
            },
            {
              "key": "CONVENIENCECHARGE",
              "value": 0
            },
            {
              "key": "OTHERCHARGE",
              "value": 0.06
            }
          ],
          "Discount": 0,
          "PublishedFare": 1903.03,
          "CommissionEarned": 0,
          "PLBEarned": 0,
          "IncentiveEarned": 0,
          "OfferedFare": 1903.03,
          "TdsOnCommission": 0,
          "TdsOnPLB": 0,
          "TdsOnIncentive": 0,
          "ServiceFee": 0,
          "TotalBaggageCharges": 0,
          "TotalMealCharges": 0,
          "TotalSeatCharges": 0,
          "TotalSpecialServiceCharges": 0,
          "GST": {
            "CGSTAmount": 0.01,
            "CGSTRate": 13.00,
            "CessAmount": 0,
            "CessRate": 0,
            "IGSTAmount": 0,
            "IGSTRate": 0,
            "SGSTAmount": 0.01,
            "SGSTRate": 11.00,
            "TaxableAmount": 0.06
          }
        },
        "BaseCurrencyFare": {
          "Currency": "INR",
          "BaseFare": 116896,
          "Tax": 16311,
          "TaxBreakup": [
            {
              "key": "K3",
              "value": 14163
            },
            {
              "key": "YQTax",
              "value": 0
            },
            {
              "key": "YR",
              "value": 1116
            },
            {
              "key": "PSF",
              "value": 0
            },
            {
              "key": "UDF",
              "value": 0
            },
            {
              "key": "INTax",
              "value": 0
            },
            {
              "key": "TransactionFee",
              "value": 0
            },
            {
              "key": "OtherTaxes",
              "value": 1032
            }
          ],
          "YQTax": 0,
          "AdditionalTxnFeeOfrd": 0,
          "AdditionalTxnFeePub": 0,
          "PGCharge": 0,
          "OtherCharges": 4.00,
          "ChargeBU": [
            {
              "key": "TBOMARKUP",
              "value": 0
            },
            {
              "key": "CONVENIENCECHARGE",
              "value": 0
            },
            {
              "key": "OTHERCHARGE",
              "value": 4.00
            }
          ],
          "Discount": 0,
          "PublishedFare": 133211.96,
          "CommissionEarned": 0,
          "PLBEarned": 0,
          "IncentiveEarned": 0,
          "OfferedFare": 133211.96,
          "TdsOnCommission": 0,
          "TdsOnPLB": 0,
          "TdsOnIncentive": 0,
          "ServiceFee": 0,
          "TotalBaggageCharges": 0,
          "TotalMealCharges": 0,
          "TotalSeatCharges": 0,
          "TotalSpecialServiceCharges": 0,
          "GST": {
            "CGSTAmount": 0.5200,
            "CGSTRate": 13.00,
            "CessAmount": 0.00,
            "CessRate": 0,
            "IGSTAmount": 0,
            "IGSTRate": 0,
            "SGSTAmount": 0.4400,
            "SGSTRate": 11.00,
            "TaxableAmount": 4.00
          }
        },
        "FareBreakdown": [
          {
            "Currency": "USD",
            "PassengerType": 1,
            "PassengerCount": 1,
            "BaseFare": 781.4,
            "Tax": 107.1,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "USD",
            "PassengerType": 2,
            "PassengerCount": 1,
            "BaseFare": 781.4,
            "Tax": 107.1,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "USD",
            "PassengerType": 3,
            "PassengerCount": 1,
            "BaseFare": 107.14,
            "Tax": 18.81,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          }
        ],
        "BaseCurrencyFareBreakdown": [
          {
            "Currency": "INR",
            "PassengerType": 1,
            "PassengerCount": 1,
            "BaseFare": 54698,
            "Tax": 7497,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "INR",
            "PassengerType": 2,
            "PassengerCount": 1,
            "BaseFare": 54698,
            "Tax": 7497,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "INR",
            "PassengerType": 3,
            "PassengerCount": 1,
            "BaseFare": 7500,
            "Tax": 1317,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          }
        ],
        "Segments": [
          [
            {
              "Baggage": "1 PC(s)",
              "CabinBaggage": null,
              "TripIndicator": 1,
              "SegmentIndicator": 1,
              "Airline": {
                "AirlineCode": "UK",
                "AirlineName": "Air Vistara",
                "FlightNumber": "191",
                "FareClass": "Z",
                "OperatingCarrier": "UK"
              },
              "Origin": {
                "Airport": {
                  "AirportCode": "BLR",
                  "AirportName": "Hindustan",
                  "Terminal": "",
                  "CityCode": "BLR",
                  "CityName": "Bangalore",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "DepTime": "2019-05-31T19:00:00"
              },
              "Destination": {
                "Airport": {
                  "AirportCode": "DEL",
                  "AirportName": "Indira Gandhi Airport",
                  "Terminal": "3",
                  "CityCode": "DEL",
                  "CityName": "Delhi",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "ArrTime": "2019-05-31T22:00:00"
              },
              "Duration": 0,
              "GroundTime": 0,
              "Mile": 0,
              "StopOver": false,
              "FlightInfoIndex": "1",
              "StopPoint": "",
              "StopPointArrivalTime": "2019-05-31T22:00:00",
              "StopPointDepartureTime": "2019-05-31T19:00:00",
              "Craft": "737",
              "Remark": null,
              "IsETicketEligible": true,
              "FlightStatus": "Confirmed",
              "Status": ""
            },
            {
              "Baggage": "1 PC(s)",
              "CabinBaggage": null,
              "TripIndicator": 1,
              "SegmentIndicator": 2,
              "Airline": {
                "AirlineCode": "UK",
                "AirlineName": "Air Vistara",
                "FlightNumber": "719",
                "FareClass": "Z",
                "OperatingCarrier": "UK"
              },
              "Origin": {
                "Airport": {
                  "AirportCode": "DEL",
                  "AirportName": "Indira Gandhi Airport",
                  "Terminal": "3",
                  "CityCode": "DEL",
                  "CityName": "Delhi",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "DepTime": "2019-06-01T20:10:00"
              },
              "Destination": {
                "Airport": {
                  "AirportCode": "CCU",
                  "AirportName": "Calcutta",
                  "Terminal": "",
                  "CityCode": "CCU",
                  "CityName": "Kolkata",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "ArrTime": "2019-06-01T22:20:00"
              },
              "AccumulatedDuration": 1640,
              "Duration": 0,
              "GroundTime": 0,
              "Mile": 0,
              "StopOver": false,
              "FlightInfoIndex": "2",
              "StopPoint": "",
              "StopPointArrivalTime": "2019-06-01T22:20:00",
              "StopPointDepartureTime": "2019-06-01T20:10:00",
              "Craft": "320",
              "Remark": null,
              "IsETicketEligible": true,
              "FlightStatus": "Confirmed",
              "Status": ""
            }
          ]
        ],
        "LastTicketDate": "29MAY19",
        "TicketAdvisory": "LAST TKT DTE 29MAY19  - SEE ADV PURCHASE \n",
        "FareRules": [
          {
            "Origin": "BLR",
            "Destination": "DEL",
            "Airline": "UK",
            "FareBasisCode": "Z1PCS",
            "FareRuleDetail": "",
            "FareRestriction": null,
            "FareFamilyCode": "BIZCS",
            "FareRuleIndex": "1"
          },
          {
            "Origin": "DEL",
            "Destination": "CCU",
            "Airline": "UK",
            "FareBasisCode": "Z3PCS",
            "FareRuleDetail": "",
            "FareRestriction": null,
            "FareFamilyCode": "BIZCS",
            "FareRuleIndex": "2"
          }
        ],
        "AirlineCode": "UK",
        "ValidatingAirline": "UK",
        "UpsellOptionsList": {
          "UpsellList": [
            {
              "FareFamilyCode": "BIZCS",
              "FareFamilyName": "BUSINESS Standard",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 1,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - 2500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCS",
              "FareFamilyName": "BUSINESS Standard",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 1,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - 2500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCS",
              "FareFamilyName": "BUSINESS Standard",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 2,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - 2500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCS",
              "FareFamilyName": "BUSINESS Standard",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 2,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - 2500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCS",
              "FareFamilyName": "BUSINESS Standard",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 3,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - 2500 per change"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCS",
              "FareFamilyName": "BUSINESS Standard",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 3,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                },
                {
                  "Code": "068",
                  "IsChargeable": "Yes",
                  "IsIncluded": "No",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - 2500 per change"
                }
              ]
            }
          ]
        }
      },
      {
        "ResultIndex": "OB24",
        "Source": 4,
        "IsLCC": false,
        "IsRefundable": true,
        "GSTAllowed": true,
        "IsCouponAppilcable": true,
        "IsGSTMandatory": false,
        "AirlineRemark": null,
        "Fare": {
          "Currency": "USD",
          "BaseFare": 1789.89,
          "Tax": 247.41,
          "TaxBreakup": [
            {
              "key": "K3",
              "value": 216.73
            },
            {
              "key": "YQTax",
              "value": 0
            },
            {
              "key": "YR",
              "value": 15.94
            },
            {
              "key": "PSF",
              "value": 0
            },
            {
              "key": "UDF",
              "value": 0
            },
            {
              "key": "INTax",
              "value": 0
            },
            {
              "key": "TransactionFee",
              "value": 0
            },
            {
              "key": "OtherTaxes",
              "value": 14.74
            }
          ],
          "YQTax": 0,
          "AdditionalTxnFeeOfrd": 0,
          "AdditionalTxnFeePub": 0,
          "PGCharge": 0,
          "OtherCharges": 0.06,
          "ChargeBU": [
            {
              "key": "TBOMARKUP",
              "value": 0
            },
            {
              "key": "CONVENIENCECHARGE",
              "value": 0
            },
            {
              "key": "OTHERCHARGE",
              "value": 0.06
            }
          ],
          "Discount": 0,
          "PublishedFare": 2037.37,
          "CommissionEarned": 0,
          "PLBEarned": 0,
          "IncentiveEarned": 0,
          "OfferedFare": 2037.37,
          "TdsOnCommission": 0,
          "TdsOnPLB": 0,
          "TdsOnIncentive": 0,
          "ServiceFee": 0,
          "TotalBaggageCharges": 0,
          "TotalMealCharges": 0,
          "TotalSeatCharges": 0,
          "TotalSpecialServiceCharges": 0,
          "GST": {
            "CGSTAmount": 0.01,
            "CGSTRate": 13.00,
            "CessAmount": 0,
            "CessRate": 0,
            "IGSTAmount": 0,
            "IGSTRate": 0,
            "SGSTAmount": 0.01,
            "SGSTRate": 11.00,
            "TaxableAmount": 0.06
          }
        },
        "BaseCurrencyFare": {
          "Currency": "INR",
          "BaseFare": 125292,
          "Tax": 17319,
          "TaxBreakup": [
            {
              "key": "K3",
              "value": 15171
            },
            {
              "key": "YQTax",
              "value": 0
            },
            {
              "key": "YR",
              "value": 1116
            },
            {
              "key": "PSF",
              "value": 0
            },
            {
              "key": "UDF",
              "value": 0
            },
            {
              "key": "INTax",
              "value": 0
            },
            {
              "key": "TransactionFee",
              "value": 0
            },
            {
              "key": "OtherTaxes",
              "value": 1032
            }
          ],
          "YQTax": 0,
          "AdditionalTxnFeeOfrd": 0,
          "AdditionalTxnFeePub": 0,
          "PGCharge": 0,
          "OtherCharges": 4.00,
          "ChargeBU": [
            {
              "key": "TBOMARKUP",
              "value": 0
            },
            {
              "key": "CONVENIENCECHARGE",
              "value": 0
            },
            {
              "key": "OTHERCHARGE",
              "value": 4.00
            }
          ],
          "Discount": 0,
          "PublishedFare": 142615.96,
          "CommissionEarned": 0,
          "PLBEarned": 0,
          "IncentiveEarned": 0,
          "OfferedFare": 142615.96,
          "TdsOnCommission": 0,
          "TdsOnPLB": 0,
          "TdsOnIncentive": 0,
          "ServiceFee": 0,
          "TotalBaggageCharges": 0,
          "TotalMealCharges": 0,
          "TotalSeatCharges": 0,
          "TotalSpecialServiceCharges": 0,
          "GST": {
            "CGSTAmount": 0.5200,
            "CGSTRate": 13.00,
            "CessAmount": 0.00,
            "CessRate": 0,
            "IGSTAmount": 0,
            "IGSTRate": 0,
            "SGSTAmount": 0.4400,
            "SGSTRate": 11.00,
            "TaxableAmount": 4.00
          }
        },
        "FareBreakdown": [
          {
            "Currency": "USD",
            "PassengerType": 1,
            "PassengerCount": 1,
            "BaseFare": 841.37,
            "Tax": 114.3,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "USD",
            "PassengerType": 2,
            "PassengerCount": 1,
            "BaseFare": 841.37,
            "Tax": 114.3,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "USD",
            "PassengerType": 3,
            "PassengerCount": 1,
            "BaseFare": 107.14,
            "Tax": 18.81,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          }
        ],
        "BaseCurrencyFareBreakdown": [
          {
            "Currency": "INR",
            "PassengerType": 1,
            "PassengerCount": 1,
            "BaseFare": 58896,
            "Tax": 8001,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "INR",
            "PassengerType": 2,
            "PassengerCount": 1,
            "BaseFare": 58896,
            "Tax": 8001,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          },
          {
            "Currency": "INR",
            "PassengerType": 3,
            "PassengerCount": 1,
            "BaseFare": 7500,
            "Tax": 1317,
            "YQTax": 0,
            "AdditionalTxnFeeOfrd": 0,
            "AdditionalTxnFeePub": 0,
            "PGCharge": 0
          }
        ],
        "Segments": [
          [
            {
              "Baggage": "1 PC(s)",
              "CabinBaggage": null,
              "TripIndicator": 1,
              "SegmentIndicator": 1,
              "Airline": {
                "AirlineCode": "UK",
                "AirlineName": "Air Vistara",
                "FlightNumber": "191",
                "FareClass": "Z",
                "OperatingCarrier": "UK"
              },
              "Origin": {
                "Airport": {
                  "AirportCode": "BLR",
                  "AirportName": "Hindustan",
                  "Terminal": "",
                  "CityCode": "BLR",
                  "CityName": "Bangalore",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "DepTime": "2019-05-31T19:00:00"
              },
              "Destination": {
                "Airport": {
                  "AirportCode": "DEL",
                  "AirportName": "Indira Gandhi Airport",
                  "Terminal": "3",
                  "CityCode": "DEL",
                  "CityName": "Delhi",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "ArrTime": "2019-05-31T22:00:00"
              },
              "Duration": 0,
              "GroundTime": 0,
              "Mile": 0,
              "StopOver": false,
              "FlightInfoIndex": "1",
              "StopPoint": "",
              "StopPointArrivalTime": "2019-05-31T22:00:00",
              "StopPointDepartureTime": "2019-05-31T19:00:00",
              "Craft": "737",
              "Remark": null,
              "IsETicketEligible": true,
              "FlightStatus": "Confirmed",
              "Status": ""
            },
            {
              "Baggage": "1 PC(s)",
              "CabinBaggage": null,
              "TripIndicator": 1,
              "SegmentIndicator": 2,
              "Airline": {
                "AirlineCode": "UK",
                "AirlineName": "Air Vistara",
                "FlightNumber": "719",
                "FareClass": "Z",
                "OperatingCarrier": "UK"
              },
              "Origin": {
                "Airport": {
                  "AirportCode": "DEL",
                  "AirportName": "Indira Gandhi Airport",
                  "Terminal": "3",
                  "CityCode": "DEL",
                  "CityName": "Delhi",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "DepTime": "2019-06-01T20:10:00"
              },
              "Destination": {
                "Airport": {
                  "AirportCode": "CCU",
                  "AirportName": "Calcutta",
                  "Terminal": "",
                  "CityCode": "CCU",
                  "CityName": "Kolkata",
                  "CountryCode": "IN",
                  "CountryName": "India"
                },
                "ArrTime": "2019-06-01T22:20:00"
              },
              "AccumulatedDuration": 1640,
              "Duration": 0,
              "GroundTime": 0,
              "Mile": 0,
              "StopOver": false,
              "FlightInfoIndex": "2",
              "StopPoint": "",
              "StopPointArrivalTime": "2019-06-01T22:20:00",
              "StopPointDepartureTime": "2019-06-01T20:10:00",
              "Craft": "320",
              "Remark": null,
              "IsETicketEligible": true,
              "FlightStatus": "Confirmed",
              "Status": ""
            }
          ]
        ],
        "LastTicketDate": "29MAY19",
        "TicketAdvisory": "LAST TKT DTE 29MAY19  - SEE ADV PURCHASE \n",
        "FareRules": [
          {
            "Origin": "BLR",
            "Destination": "DEL",
            "Airline": "UK",
            "FareBasisCode": "Z1PCF",
            "FareRuleDetail": "",
            "FareRestriction": null,
            "FareFamilyCode": "BIZCF",
            "FareRuleIndex": "1"
          },
          {
            "Origin": "DEL",
            "Destination": "CCU",
            "Airline": "UK",
            "FareBasisCode": "Z3PCF",
            "FareRuleDetail": "",
            "FareRestriction": null,
            "FareFamilyCode": "BIZCF",
            "FareRuleIndex": "2"
          }
        ],
        "AirlineCode": "UK",
        "ValidatingAirline": "UK",
        "UpsellOptionsList": {
          "UpsellList": [
            {
              "FareFamilyCode": "BIZCF",
              "FareFamilyName": "BUSINESS Flexi",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 1,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "068",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - Two free change up to 24 hrs of departure, ?2500 thereafter"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCF",
              "FareFamilyName": "BUSINESS Flexi",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 1,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "068",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - Two free change up to 24 hrs of departure, ?2500 thereafter"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCF",
              "FareFamilyName": "BUSINESS Flexi",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 2,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "068",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - Two free change up to 24 hrs of departure, ?2500 thereafter"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCF",
              "FareFamilyName": "BUSINESS Flexi",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 2,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "068",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - Two free change up to 24 hrs of departure, ?2500 thereafter"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCF",
              "FareFamilyName": "BUSINESS Flexi",
              "FareRuleIndex": "1",
              "FlightInfoIndex": "1",
              "PassengerType": 3,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "068",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - Two free change up to 24 hrs of departure, ?2500 thereafter"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                }
              ]
            },
            {
              "FareFamilyCode": "BIZCF",
              "FareFamilyName": "BUSINESS Flexi",
              "FareRuleIndex": "2",
              "FlightInfoIndex": "2",
              "PassengerType": 3,
              "ServicesList": [
                {
                  "Code": "0B5",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "SA",
                  "SSRCode": "F",
                  "UpsellDescription": "PRE RESERVED SEAT ASSIGNMENT|Complimentary"
                },
                {
                  "Code": "0BX",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "LG",
                  "SSRCode": "F",
                  "UpsellDescription": "LOUNGE ACCESS|Complimentory"
                },
                {
                  "Code": "0B3",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "ML",
                  "SSRCode": "F",
                  "UpsellDescription": "MEAL|Complimentary hot gourmet meal-Complimentary hot or cold beverage including refreshing mocktails and Starbucks Coffee"
                },
                {
                  "Code": "0LF",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "TS",
                  "SSRCode": "F",
                  "UpsellDescription": "PRIORITY BAGGAGE HANDLING|Priority Handling(Check-in, Baggage) - Complimentary"
                },
                {
                  "Code": "068",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BF",
                  "SSRCode": "Z",
                  "UpsellDescription": "CHANGE ANYTIME|Changes(Permitted up to 2 hrs prior to departure) - Two free change up to 24 hrs of departure, ?2500 thereafter"
                },
                {
                  "Code": "0MR",
                  "IsChargeable": "No",
                  "IsIncluded": "Yes",
                  "ServiceType": "BG",
                  "SSRCode": "C",
                  "UpsellDescription": "CARRY12KG 26LB UPTO45LI 115LCM|Standard Hand Baggage Allowance-12 kg"
                }
              ]
            }
          ]
        }
      }
    ],
  "TraceId": "************************************", 
  }
}

    
```

---

## SendChangeRequest (cancellation)

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SendChangeRequest`  
**Source pages:** https://apidoc.tektravels.com/flighT/SendChangeRequest.aspx


### Verbatim content of `SendChangeRequest.aspx`

SEND CHANGE REQUEST
This method is used to send change request or cancel a ticketed booking.
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SendChangeRequest
Send Change Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end | Mandatory |
|  |  |  | user |  |
| 2 | TokenId | String | Token ID | Mandatory |
|  |  |  |  | (Token Id to be echoed back |
|  |  |  |  | from Authenticate response) |
| 3 | BookingId | Integer | Unique booking id | Mandatory |
| 4 | RequestType | Enumeration | Request type | Mandatory |
|  |  |  |  | Possible values can be - |
|  |  |  |  | NotSet = 0, |
|  |  |  |  | FullCancellation = 1, |
|  |  |  |  | PartialCancellation = 2, |
|  |  |  |  | Reissuance = 3 |
|  | CancellationType | Enumeration | Cancellation type | Mandatory |
|  |  |  |  | Possible values can be - |
|  |  |  |  | NotSet = 0, |
|  |  |  |  | NoShow = 1, |
|  |  |  |  | FlightCancelled = 2, |
|  |  |  |  | Others = 3 |
|  | Sectors |  |  |  |
|  | Origin | String | Origin | Mandatory * |
|  |  |  |  | [Mandatory only in case of partial cancellation] |
|  | Destination | String | Destination | Mandatory * |
|  |  |  |  | [Mandatory only in case of partial cancellation] |
|  | TicketId | Integer | Ticket Id | Mandatory |
|  |  |  |  | [ may send multiple comma separated ticket ids] |
| 5 | Remarks | String | Remarks for cancelling the booking | Mandatory |
|  |  |  |  | Remarks for cancelling the booking |

Send Change Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | TicketCRInfo |  |  |  |
| 2 | ChangeRequestId | Integer | Unique change | Mandatory |
|  |  |  | request id |  |
| 3 | Status | Enumeration | Status | Mandatory |
| 4 | Remarks | String | Change Request Status | Mandatory |
| 5 | ResponseStatus | Enumeration | Response status | Mandatory |
|  |  |  |  | [NotSet = 0, |
|  |  |  |  | Successfull = 1, |
|  |  |  |  | Failed = 2, |
|  |  |  |  | InValidRequest = 3, |
|  |  |  |  | InValidSession = 4, |
|  |  |  |  | InValidCredentials = 5] |
| 6 | Error |  |  | Mandatory |
| 6.1 | ErrorCode | Integer | Code corresponding to the Error | Mandatory |
| 6.2 | ErrorMessage | String | Contains error message | Mandatory |
|  |  |  | (Will contain error description corresponding to ErrorCode. Error Message would be blank in case ErrorCode=0) |

---

## GetChangeRequestStatus

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetChangeRequestStatus`  
**Source pages:** https://apidoc.tektravels.com/flighT/GetChangeRequestStatus.aspx


### Verbatim content of `GetChangeRequestStatus.aspx`

GET CHANGE REQUEST STATUS
This method is used to check the Cancellation status using change request id and also to know cancellation charges and refunded amount.
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetChangeRequestStatus
Get Change Request Status Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID | Mandatory |
| 3 | ChangeRequestId | Integer | Unique Change Request Id to be echoed back from Send Chang | Mandatory |

Get Change Request Status Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | TraceId | String | Trace ID | Mandatory |
| 2 | Response Status | Enumeration | Response Status | Mandatory [NotSet = 0,Successfull = 1,Failed = 2,InValidRequest = 3,InValidSession = 4,InValidCredentials = 5] |
| 3 | Error |  |  |  |
| 3.1 | ErrorCode | Integer | Code corresponding to the Error | Mandatory |
| 3.2 | ErrorMessage | String | Contains error message | Mandatory (Will contain error description corresponding to ErrorCode. Error Message would be blank in case ErrorCode=0) |
| 4 | ChangeRequestId | Integer | Unique Change Request Id to be echoed back from Send Change Request response | Mandatory |
| 5 | RefundedAmount | Decimal | Refunded Amount | Mandatory |
| 6 | CancellationCharge | Decimal | Cancellation Charge | Mandatory |
| 7 | ServiceTaxOnRAF | Decimal | Service Tax On RAF | Mandatory |
| 8 | ChangeRequestStatus | Enumeration | Change Request Status | Mandatory [NotSet = 0,Unassigned = 1,Assigned = 2,Acknowledged = 3,Completed = 4,Rejected = 5,Closed = 6,Pending = 7,Other = 8] |

---

## GetCancellationCharges

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetCancellationCharges`  
**Source pages:** https://apidoc.tektravels.com/flighT/GetCancellationCharges.aspx


### Verbatim content of `GetCancellationCharges.aspx`

Cancellation Charges
This method is used to obtain the Cancellation Charges.
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetCancellationCharges
Cancellation Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID | Mandatory(Token Id to be echoed back from Authenticate response) |
| 3 | RequestType | Enumeration | RequestType | Mandatory[FullCancellation = 1] |
| 4 | BookingId | Integer | Unique booking id received in Ticket Response | Mandatory |
| 5 | BookingMode | Integer | Booking created through | Optional[API=5] |

Cancellation Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | TraceId | String | Trace Id | Mandatory |
| 2 | ResponseStatus | String | Response status | Mandatory[NotSet = 0,Successfull = 1,Failed = 2,InValidRequest = 3,InValidSession = 4,InValidCredentials = 5] |
| 3 | RefundAmount | Decimal | RefundAmount | Mandatory |
| 4 | CancellationCharge | Decimal | CancellationCharge | Mandatory |
| 5 | Remarks | String | Remarks | Mandatory |
| 6 | Currency | String | Currency | Mandatory |

---

## ReleasePNRRequest

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/ReleasePNRRequest`  
**Source pages:** https://apidoc.tektravels.com/flighT/ReleasePnrRequest.aspx


### Verbatim content of `ReleasePnrRequest.aspx`

RELEASE PNR REQUEST
This method is used to cancel hold bookings, send change request of Ticketed Booking and get change request status. SendChangeRequest can be sent for full booking cancellation or for partial cancellation (passenger wise cancellation or sector wise cancellation. All TicketId's must be sent in case of full booking cancellation.
This method is used to release Hold Bookings which you do not want to ticket.
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/ReleasePNRRequest
Release PNR Request

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | EndUserIp | String | IP Address of the end user | Mandatory |
| 2 | TokenId | String | Token ID | Mandatory |
| 3 | BookingId | Integer | Unique Booking Id | Mandatory |
| 4 | Source | String | Airline Sources | Mandatory |

Release PNR Response

| Level | Element | Format | Comments | Mandatory/Optional |
|---|---|---|---|---|
| 1 | TraceId | String | Trace ID | Mandatory |
| 2 | ResponseStat | Enumeration | Response Status | Mandatory |
|  | us |  |  | [NotSet = 0, |
|  |  |  |  | Successfull = 1, |
|  |  |  |  | Failed = 2, |
|  |  |  |  | InValidRequest = 3, |
|  |  |  |  | InValidSession = 4, |
|  |  |  |  | InValidCredentials = 5] |
| 3 | Error |  |  |  |
| 3.1 | ErrorCode | Integer | Code corresponding to | Mandatory |
|  |  |  | the Error |  |
| 3.2 | ErrorMessage | String | Contains error message | Mandatory |
|  |  |  |  | (Will contain error description corresponding to ErrorCode. Error Message would be blank in case ErrorCode=0) |

---

## Sample JSON page: ReleasePNR / SendChangeRequest / GetChangeRequestStatus / CancellationCharges

**Staging URL:** `(see sections above)`  
**Source pages:** https://apidoc.tektravels.com/flighT/SampleJson.aspx


### Verbatim content of `SampleJson.aspx`

```json
	
        ReleasePNR Request
{
"EndUserIp": "192.168.10.36",
"TokenId": "ebf966ff-9e72-4fc2-a63d-2236a91f7152",
"BookingId": "1288527",
"Source": "4"
}

    
```
```json
	
        ReleasePNR Response
{
"Response": {
"ResponseStatus": 1,
"TraceId": "1eaf3154-621f-4b6d-b942-9ef0857c3e60",
"Error": {
"ErrorCode": 0,
"ErrorMessage": ""
}
}
}

    
```
```json
	
       SendChangeRequest Full Cancellation
{
  "BookingId": 1907823,
  "RequestType": 1,
  "CancellationType": 3,
  "Remarks": "Test remarks",
  "EndUserIp": "192.168.11.23",
  "TokenId":"d2aac316-5fd4-4c72-983f-0679a35a0506"
 
}

    
```
```json
	
       SendChangeRequest Full Cancellation Response
{
    "Response": {
        "B2B2BStatus": false,
        "TicketCRInfo": [
            {
                "ChangeRequestId": 309390,
                "TicketId": 2194072,
                "Status": 1,
                "Remarks": "Ticket is Cancelled Successfully | Ticket Id: 2194072",
                "ChangeRequestStatus": 4,
                "CancellationCharge": 793.0000,
                "RefundedAmount": 304.0000,
                "ServiceTaxOnRAF": 0.00,
                "SwachhBharatCess": 0.00,
                "KrishiKalyanCess": 0.00,
                "CreditNoteNo": "IE/2425/1195",
                "CreditNoteCreatedOn": "2024-07-11T19:07:14"
            }
        ],
        "ResponseStatus": 1,
        "TraceId": "1a67c9a7-1610-4f59-8069-c0cb2795c113"
    }
}

        
```
```json
	
       SendChangeRequest Partial Cancellation
{
  "BookingId": 1288166,
  "RequestType": 2,
  "CancellationType": 3,
  "Sectors": [
    {
      "Origin": "DEL",
      "Destination": "SVO"
    }
  ],
  "TicketId": [
    1567415,
    1567416
  ],
  "Remarks": "Test remarks",
  "EndUserIp": "192.168.11.23",
  "TokenId": "a3db0ecd-079e-4fa4-abda-157f5a8b2a60"
}

    
```
```json
	
       SendChangeRequest Partial Response
{
  "Response": {
    "TicketCRInfo": [
      {
        "ChangeRequestId": 195187,
        "Status": 1,
        "Remarks": "Successful"
      },
      {
        "ChangeRequestId": 195188,
        "Status": 1,
        "Remarks": "Successful"
      }
    ],
    "ResponseStatus": 1,
    "TraceId": ""
  }
}

        
```
```json
		
      GetChangeRequest
{ 
"ChangeRequestId": "199350", 
"EndUserIp": "123.1.1.1", 
"TokenId": "901cba3c-4846-4dd3-b3d5-54311ae43db5" 
}

 
```
```json
		
      GetChangeRequest Response
 { 
"ResponseStatus": 1,
"Error": null,
"TraceId": "120e537c-fbe8-463d-a52b-5653b38ab87b",
"ChangeRequestId": 199350,
"RefundedAmount": 3560.0000,
"CancellationCharge": 100.0000,
"ServiceTaxOnRAF": 12.36,
"ChangeRequestStatus": 4
}

        
```
```json
	 
      Cancellation Charges Request
{
 "BookingId": "1583080",
 "RequestType": "1",
 "BookingMode": "5",
 "EndUserIp": "192.168.10.23",
"TokenId": "b5011adf-2ac8-4bc7-9550-70870e016150"
}

 
```
```json
		 
       Cancellation Charges Response
 {
    "Response": 
{
"ResponseStatus": 1,
"TraceId": "040d3c33-b279-468f-bd78-b68e8df19cd8",
"RefundAmount": 2413,
"CancellationCharge": 8532,
"Remarks": "Infant added later Onwards",
"Currency": "INR"
 }
}

        
```

---

## Air Amendment (post-ticket ancillary: SSR by BookingId, then TicketReIssue)

**Staging URL:** `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR` then `http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/TicketReIssue`  
**Source pages:** https://apidoc.tektravels.com/flighT/Air%20Amendment.aspx


### Verbatim content of `Air Amendment.aspx`

Please consider below points for clarification:
Air Amendment is to buy baggage, meal or seat after Ticket is created. As of now special service is not included in amendment.
If baggage is already added for a specific pax while booking the PNR then baggage for the same pax can’t be bought through air amendment.
As of now air amendment is only available for LCC carriers i.e. Indigo, Spice jet, Akasa, AirIndiaExpress, AirAsia, Jazeera and FlyDubai.
Air Amendment can be done as many as times you want after ticketing.
In Amendment, Invoice will be generated per passenger.
If meal and baggage is bought in amendment of a passenger at the same time then the invoice will be the same for both, but if meal and baggage is bought for the same passenger but in different time then invoice of them will be different.
JSON
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR
SSR Request:
"EndUserIp": "192.168.11.195",
"TokenId": "XXXXXXXXXXXXXXXXXXXXXXXXXX", 🡪 (Current day’s Token Value)
"BookingId": "XXXXXXX" 🡪 (Booking ID of the PNR which is already created)
SSR Response:
http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/TicketReIssue
Ticket ReIssue Request:
"EndUserIp": "192.168.11.195",
"TokenId": "381931f7-afcb-4e56-a5b5-abb6889844c7",
"TraceId": "bc6b66e9-90c1-40e3-b9e7-577421e22aaa",
"BookingId": 1599626,
"SSR": [
"PaxId": 2587823, (PassengerID of the passenger for whom SSR needs to be bought)
"Baggage": [        (BaggageArray: One of the available baggageoptions,provided in the SSR response)
"AirlineCode": "SG",
"FlightNumber": "11",
"WayType": 2,
"Code": "EB10",
"Description": 2,
"Weight": 10,
"Currency": "INR",
"Price": 4950,
"Origin": "DEL",
"Destination": "DXB"
]
]
Ticket ReIssue  Response:
Nodes that were earlier received in Ticket () response will be received in this response also such as PNR, Booking ID, Segment, Fare Details,       Passenger Details etc.
In this response, Invoice array will be received which will have all the invoices.
Invoices will be generated per passenger at a time, if we go for an amendment for the second time then the second time also invoices will       be generated.
In this response, Booking History array will be received which will have all details as provided in TBO portal.
SSR charges will also be received.
In Segment Additional Info Array, All the SSR that are bought will be provided, Baggage before pipe is free baggage provided by airline and       baggage after pipe is the purchased one.
In case of LCC in EMD number nodes, PNR will be received.
Invoice Id is the same that is received in the Invoice array for the same Amendment.