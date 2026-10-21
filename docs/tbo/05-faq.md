# TBO Flight API - FAQ

Verbatim from the FAQ pages of https://apidoc.tektravels.com/flighT/ (crawled 2026-10-21). Only line breaks, markdown headings and mojibake characters were adjusted. Note: Q26/Q27 duplicate Q4/Q25 on the source page.


## General Flight FAQ (FlightFAQ.aspx)


### Q1. How to call Authenticate method

Authenticate method will return the Token ID that needs to be echoed back in every subsequent request.

In case of session expiry or log outs, the authenticate method needs to be called again and the updated Token ID

needs to be passed in every subsequent request. Only 1 token should be generated for all transactions.

Parameters

- 1. ClientId
- 2. TokenAgencyId
- 3. TokenMemberId
- 4. EndUserIp

### Q2. How to identify FareType(SME/Corporate/Coupon etc)

We need to refer AIRLINEREMARKS node for the faretype and the description of that specific AIRLINEREMARK node value will be provided by your salesperson.


### Q3. How to call logout method in API

Logout method can be used to kill any existing token (session), forecefully. Once the session is killed, the authenticate method needs to be called again and the updated Token ID needs to be passed in every subsequent request.

Parameters

- 1. ClientId
- 2. TokenAgencyId
- 3. TokenMemberId
- 4. EndUserIp

### Q4. Why do we use Get Agency balance method

GetAgencyBalance method can be used to know the Agency Balance in TBO Account.

Parameters

- 1. ClientId
- 2. TokenAgencyId
- 3. TokenMemberId
- 4. EndUserIp
- 5. TokenId
Token AgencyId and Token MemberId should be passed as received in Authenticate Response


### Q5. How do we use Air Search Method

Search method provides availability information with the cheapest fare option available. The request includes single query. The search request contains optional field of Return Date.

In case of round trip, this field should be filled with the date of return. When properly submitted, the Search Response returns the available option.

Once the requested query is parsed and validated, the booking engine start searching for the best option in all possible sources. If the search is successful it will return Result object.

Parameters

- 1. EndUserIp
- 2. TokenId
- 3. AdultCount
- 4. ChildCount
- 5. InfantCount
- 6. DirectFlight
- 7. OneStopFlight
- 8. JourneyType
- 9. PreferredAirlines
- 10. Segments
- 11. Origin
- 12. Destination
- 13. FlightCabinClass
- 14. PreferredDepartureTime
- 15. PreferredArrivalTime
- 16. Sources

### Q6. How to we use Fare Rule in Air Api method

This method is used to get the fare rules and condition of a specific flight option. It contains the fare basis code and the relevant details associated with it, such as restrictions and penalties.

Parameters

- 1. EndUserIp
- 2. TokenId
- 3. TraceId
- 4. ResultIndex

### Q7. How do we use Fare Quote method in air API

This method is required to re-price the selected itinerary. This method is also accessed to sell/ hold seats for LCC airlines. This is required to make sure that we have the updated price including tax because in some cases, the fare provided at the time of search may change.

Parameters

- 1. EndUserIp
- 2. TokenId
- 3. TraceId
- 4. ResultIndex

### Q8. How to use SSR method in air API

This method is used to obtain the online prices of Special Service Request like Excess Baggage and Meal for LCC airlines like Indigo, Spice Jet, Air Asia, Air Arabia, Fly Dubai, etc. For LCC Airlines which currently do not support online SSR requests, the SSR request will not return Excess Baggage and meal charges. To avail excess baggage and meal services, the selected baggage and meal needs to be passed in the ticket request with the applicable price. The total price deducted during ticketing would be addition of Offered Fare + Excess Baggage and Meal Charges. This method is also accessed to get available meal and seat options for Non LCC airlines. For Non LCC carriers the meal and seat options received in the SSR response are indicative only and may be added in the ticket request for availing the same. The given information is passed to the GDS/ airline and depending on the availability, the same is provided to the customer. Non LCC airlines do not provide online confirmation for the meal and seat option selected by the customer.

Parameters

- 1. EndUserIp
- 2. TokenId
- 3. TraceId
- 4. ResultIndex

### Q9. How to use Ticket method in Air Api in case of Lcc flights

This method is to be called to generate ticket for both LCCs and Non LCCs (already booked itinerary).

Price verification is done before creating a booking/ ticket and PNR No. is returned in case of a successful booking.

In case of Price change or Time change, you will get new fare and/or new time in Book response with IsPriceChanged node and/or IsTimeChanged node set as ‘true’.

The price comparison is to be made at the client’s end, and Book request needs to be sent again with the updated fare and/ or updated time.

Mandatory Parameters for Lcc Flights:

- 1. EndUserIp
- 2. TokenId
- 3. TraceId
- 4. ResultIndex
- 5. Passengers
- 6. PaxType -- 1- Adult 2- Child 3- Infant
- 7. DateOfBirth--Date time format yyyy-mm-ddThh:mm:ss
- 8. Gender-1 – Male 2 – Female
- 9. PassportExpiry--Date time format yyyy-mm-ddThh:mm:ss
- 10. City
- 11. CountryCode
- 12. CountryName
- 13. IsLeadPax ---Value - True/ False

### Q10. How and where to use Book method in Air API

Book method is used to hold the Booking of Non LCC airline. Every Non LCC airline must be Hold first before ticketing. It will not work for LCC airline because LCC airline is ticketed directly.

Price verification is done before creating a booking and PNR No. is returned in case of a successful booking.

In case of Price change or Time change, you will get new fare and/or new time in Book response with IsPriceChanged node and/or IsTimeChanged node set as ‘true’.The price comparison is to be made at the client’s end, and Book request needs to be sent again with the updated fare and/ or updated time. Passenger’s Date of Birth and Passport details are optional in book request wherever applicable. However, if not provided in book request then the same needs to be provided in Ticket request.

Mandatory Parameters

- 1. EndUserIp
- 2. TokenId
- 3. TraceId
- 4. ResultIndex
- 5. Passengers
- 6. Title
- 7. FirstName
- 8. LastName
- 9. PaxType -(1- Male 2- Female )
- 10. DateOfBirth -should be in format (0001-01-01T00:00:00)
- 11. Gender-(1- Male 2- Female )
- 12. PassportNo
- 13. PassportExpiry - should be in format (0001-01-01T00:00:00)
- 14. AddressLine1
- 15. City
- 16. CountryCode

### Q11. How to use Ticket method in Air Api in case of Non Lcc flights:

This method is to be called to generate ticket for both LCCs and Non LCCs (already booked itinerary).

Price verification is done before creating a booking/ ticket and PNR No. is returned in case of a successful booking.

In case of Price change or Time change, you will get new fare and/or new time in Book response with IsPriceChanged node and/or IsTimeChanged node set as ‘true’.

The price comparison is to be made at the client’s end, and Book request needs to be sent again with the updated fare and/ or updated time.

Also, in case of Non LCC bookings, if Passenger’s Date of Birth and Passport details are not provided in the book response, then the same needs to be provided when calling ticket method wherever applicable.

Mandatory Parameters

1.EndUserIp

2.TokenId

3.TraceId

4.PNR

5.BookingId


### Q12. How to use Get Booking Details method in Air API

This method is used to retrieve booking details and booking status of an existing booking using BookingId, PNR or TraceId as the search parameter. It is typically used after a booking has been made to capture a current snapshot of the reservation. If Booking Id is received as 0 then please call GetBookingDetails using Trace id or PNR with First Name and Last Name of the lead passenger.

Mandatory Parameters

- 1. EndUserIp
- 2. TokenId
- 3. BookingId
- 4. TraceId
- 5. PNR

### Q13. How to cancel the booking in Air API :

- 1) SendChangeRequestStatus()
This method is used to send change request or cancel a ticketed booking.

Mandatory Parameters

- 1) EndUserIp
- 2) TokenId
- 3) BookingId—Received from Book or Ticket response
- 4) RequestType -Possible values can be-(FullCancellation = 1, PartialCancellation =2)
- 5) CancellationType  -  Possible values can be - (NoShow = 1, FlightCancelled = 2, Others = 3)
- 6) Sectors
- 7) Origin
- 8) Destination
- 9) TicketId
- 10) Remarks
- 2) GetChangeRequestStatus ()
This method is used to check the Cancellation status using change request id and also to know cancellation charges and refunded amount. Refunded Amount, Cancellation Charges and the ServiceTaxOnRAF nodes would be provided in the response only after successful cancellation.

Mandatory Parameters

- 1)EndUserIp
- 2)TokenId
- 3)ChangeRequestId- to be provided in Send change request method response

### Q14. What is the Meanings of Ticket Status

- 1.     Failed = 0 If you have received status as failed 0 , then your booking has not been made and failed due to any reason so in this case we request you to call get booking details method to verify the exact status of your ticket.
- 2.     Successful = 1 Your ticket has been created successfully.
- 3.     NotSaved = 2  Your ticket has not been saved due to any reason and in this case you can call our operation team and also call get booking details method to verify the exact status of your ticket.
- 4.     NotCreated = 3 Your ticket has not been created due to any reason and in this case you can call our operation team and also call get booking details method to verify the exact status of your ticket.
- 5.     NotAllowed = 4 This error comes from supplier end so you need to contact us
- 6.     InProgress = 5   your ticket is in progress state so in this case we request you to call get booking details method to verify the exact status of your ticket
- 7.     TicketeAlreadyCreated= 6 This ticket is already created with Same PNR.
- 8.     PriceChanged = 8 in this case you would have received “IsPriceChanged”: True in book or ticket response so you need to pass same request again with updated price.
- 9.     OtherError = 9 In this case please send us request and response logs and will check same and update you reason for the error.

### Q15. How to implement GST In Boking Process

We need to validate both IsGSTMandatory and GSTAllowed node or just the IsGSTMandatory:

If you are getting “GSTAllowed” true then you may or may not send GST details of the passenger but if you're getting “IsGSTMandatory” node 'true' then GST details are mandatory to be passed with lead passenger details, else booking will be failed.

There may be case that you receive “GSTAllowed” true and “IsGSTMandatory” false, so in that case GST details are not mandatory to be passed with passenger details.


### Q16. Domestic Return Type Segments for Both Lcc and Non LCC

In case of Domestic Round Trip Search the inbound and outbound flights are provided under different result index(OB and IB), but in case of International both inbound and outbound flights are provided under one result index only. Also every method need to call twice in case of domestic return and 2 PNR’s will be generated, for Non-LCC all method need to call single time and one PNR will be generated


### Q17. For Certification Process Sectors that would provide response on test Server

- a. For Domestic you can try for DEL -> BOM, DEL -> BLR or BLR -> BOM.
- b. For International you can try for DEL -> DXB, or DEL -> BKK.

### Q18. Duplicate Booking Validation.

You cannot make a duplicate booking within next 5 days of original Booking.


### Q19. Token Id Validation

You need to generate only 1 token id in a single day as it is valid from "00:00:00 AM" till "11:59:59 PM" and same can be used for any API’s and on any server.


### Q20. For receiving Flights that have Auto Ticketing as True

you can pass a new node of   "AutoTicketingOnly":true in Search request to not receive airlines that do not allow auto

ticketing in ticket method that is get results only for those validating airlines for which auto ticketing is allowed at our end.


### Q21. What is the flow of passing request in Air API?

For LCC : Authenticate-->Search-->FareRule-->FareQuote-->SSR(optional)-->Ticket-->GetBookingDetails.

For Non LCC: Authenticate-->Search-->FareRule-->FareQuote-->SSR(optional)-->Book-->Ticket-->GetBookingDetails.


### Q22. What nodes are not required to be passed in case of Infant?

In case of Infant Seat & baggage  node is not required to be passed, meal can be selected.


### Q23. How to define a flight is domestic or international?

It depends on Origin and destination if both are within India it is domestic else it is international.


### Q24. How to pass SSR(Seat, Meal & Baggage) in LCC and Non LCC flight?

In case of LCC flights the nodes will be passed as SeatDynamic, MealDynamic and Baggage in Ticket Request.

In case of Non LCC flights the nodes will be passed as Seat, Meal in Book Request as received in SSR response.

Baggage node is not available in Non LCC Flight.


### Q25. What is mutlicity Flight and the format for multicity?

Multicity flights are the one in which we by choice want to have stop during our full journey, the stops need to be defined and the time when next flight will be taken.

Format for Multicity:

AMD--BOM dd/mm/yyy

BOM--BLR dd/mm/yyy

BLR--DEL dd/mm/yyy


### Q26. Why do we use Get Agency balance method

GetAgencyBalance method can be used to know the Agency Balance in TBO Account.

Parameters

- 1. ClientId
- 2. TokenAgencyId
- 3. TokenMemberId
- 4. EndUserIp
- 5. TokenId
Token AgencyId and Token MemberId should be passed as received in Authenticate Response


### Q27. What is mutlicity Flight and the format for multicity?

Multicity flights are the one in which we by choice want to have stop during our full journey, the stops need to be defined and the time when next flight will be taken.

Format for Multicity:

AMD--BOM dd/mm/yyy

BOM--BLR dd/mm/yyy

BLR--DEL dd/mm/yyy


## Authenticate FAQ (FAQAuthenticate.aspx)


### Q1. What is the Error means - You are not authorized to access TBO-API

Solution:This error occurs when we are getting hit from non-whitelisted IP. For this you have to connect with your service domain Partner and if you want to whitelist the IP It needs to be whitelisted from Ms. Pavneet Kaur end's

Also, this error comes in case where the client is sending request for live but using staging's URL.


### Q2. How to call Authenticate method

Solution:Authenticate method will return the Token ID that needs to be echoed back in every subsequent request. In case of session expiry or log outs, the authenticate method needs to be called again and the updated Token ID needs to be passed in every subsequent request.Only 1 token should be generated for all transactions.

Parameters

ClientId

UserName

Password

EndUserIp


### Q3.Token id validation

Solution:You need to generate only 1 token id in a single day as it is valid from "00:00:00 AM" till "11:59:59 PM" and same can be used for any API's and on any server.


## Search FAQ (FAQSearch.aspx)


### Q1. How do we use Air Search Method

Solution: Search method provides availability information with the cheapest fare option available. The request includes single query. The search request contains optional field of Return Date.

In case of round trip, this field should be filled with the date of return. When properly submitted, the Search Response returns the available option.

Once the requested query is parsed and validated, the booking engine start searching for the best option in all possible sources. If the search is successful it will return Result object.


### Q2. What is difference between LCC and GDS?

Solution:LCC- Low cost carrier flight and offering low fares and minimizing operational costs. Some airlines from Lcc are Indigo, SpiceJet

GDS-Global Distribution System platform that allows travel agencies and other entities to access real-time information about flights, fares, availability, and make reservations across multiple airlines. Some airlines for GDS are Air India, Vistara.


### Q3. How to filter data for LCC and GDS?

Solution: In case of GDS you have to pass  Sources: ["GDS"] and in "PreferredAirlines":["AI"].

In case of LCC you have to pass airline code in sources "Sources": ["6E","SG"]


### Q4. How  to get special fare  while searching?

Solution: Client need to pass 'ResultFareType' node to get the special fare  and below are the enums for the same-: https://api.tektravels.com/FlightAPIDocument/NewReleases.aspx

ResultFareType:2(RegularFare)

ResultFareType:3 (StudentFare )

ResultFareType:4 (Armed Force)

ResultFareType:5 (Senior Citizen)

- 1. Student is mandatory in case of 6E & SG.
- 2. Senior Citizen is mandatory id's in case of Indigo airline only.
- 3. AkasaAir is available only for Armed Force Fare.
- 4. Indigo, SpiceJet both are available for Senior Citizen Fare.

### Q5. How to check flight is LCC or Non LCC?

Solution: In search response you will receive node islcc:true/false. If its true that means its LCC flight.


### Q6.What is the maximum number of passengers allowed in a single booking?

Solution: A booking can include up to 9 passengers, including adults, children, and infants.


### Q7.Can I filter the search to show only direct or one-stop flights?

Solution: Yes. Use the DirectFlight and OneStopFlight boolean fields to filter for direct or one-stop flights respectively.


### Q8.What is a Result Index?

Solution:A ResultIndex uniquely identifies a search result. It is used in further API calls like FareQuote and Ticket.


### Q9.Are the ResultIndexes for OB and IB different in return bookings?

Solution:For Domestic returns: Yes, OB and IB have separate result indexes.

For International returns: No, OB and IB segments are grouped under a single result index.


### Q10.How should I handle method calls for domestic normal return?

Solution:You must call FareQuote,SSR,Book, and Ticket methods twice, once each for OB and IB result indexes.


## FareQuote FAQ (FAQFareQuote.aspx)


### Q1. How do we use Fare Quote method in air API

Solution:This method is required to re-price the selected itinerary. This is required to make sure that we have the updated price including tax because in some cases, the fare provided at the time of search may change.


### Q2. Validation in farequote

Solution:All validation comes in fare quote response like gst manadatory, passport requirement, seat  and meal. If any of this node come true than pass in book/ticket request to avoid failure.


### Q3. How can we check if we can hold the LCC flight

Solution:In the fare quote response, you will receive the node 'IsHoldAllowed': true; only then can you hold the LCC flight.


## SSR FAQ (FAQSSR.aspx)


### How to use SSR method in air API

Solution:This method is used to obtain the online prices of Special Service Request like Excess Baggage and Meal for LCC airlines like Indigo, Spice Jet, Air Asia, Air Arabia, Fly Dubai, etc. For LCC Airlines which currently do not support online SSR requests, the SSR request will not return Excess Baggage and meal charges. To avail excess baggage and meal services, the selected baggage and meal needs to be passed in the ticket request with the applicable price. The total price deducted during ticketing would be addition of Offered Fare + Excess Baggage and Meal Charges. This method is also accessed to get available meal and seat options for Non LCC airlines. For Non LCC carriers the meal and seat options received in the SSR response are indicative only and may be added in the ticket request for availing the same. The given information is passed to the GDS/ airline and depending on the availability, the same is provided to the customer. Non LCC airlines do not provide online confirmation for the meal and seat option selected by the customer.


## Book FAQ (FAQBook.aspx)


### Q1. How and where to use Book method in Air API

Solution Book method is to hold the Booking of Non LCC airline. Every Non LCC airline must be Hold first before ticketing. It will not work for LCC airline because LCC airline is ticketed directly.

Price verification is done before creating a booking and PNR No. is returned in case of a successful booking.

In case of Price change or Time change, you will get new fare and/or new time in Book response with IsPriceChanged node and/or IsTimeChanged node set as 'true'.The price comparison is to be made at the client's end, and Book request needs to be sent again with the updated fare and/ or updated time. Passenger's Date of Birth and Passport details are optional in book request wherever applicable. However, if not provided in book request then the same needs to be provided in Ticket request


### Q2.Where we get last ticket in book method

Solution  In book response you will receive node LastTicketDate before that ticket date you have to call ticket method.
