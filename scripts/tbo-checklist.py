"""Builds certification/TBO-Flight-API-Checklist.xlsx — TBO's checkpoint list marked
Yes, with where/how each validation is implemented. Run: python scripts/tbo-checklist.py"""
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side

ROWS = [
    ("Validation Of LCC & Non LCC Flights", "Title, First and Last name mandatory; SpiceJet duplicate full names blocked; gender from title; child/infant DOB mandatory; phone mandatory for all journeys."),
    ("Additional Validation for LCC Flights", "Address, email, CountryCode and CountryName sent for the first (and every) passenger, covering the LCC and AirAsia rules."),
    ("Validation Of LCC International Flights", "No space allowed in last name for TruJet (2T) / Zoom Air (ZO); DOB mandatory for adults on all international journeys (covers AirAsia)."),
    ("Baggage Validation for International LCC Flights", "Included baggage (Price 0) from the SSR response is always sent in Ticket; for I5 domestic, Price 0 baggage and meal are sent."),
    ("Token ID & Trace ID Validation", "One TokenId and TraceId per booking, kept server-side; ErrorCode 6 (checked by code) re-authenticates and retries; 15-minute TraceId expiry enforced."),
    ("SSR Validation For All Cases", "SSR is the last call before each Ticket; one item per sector, so return trips send both outbound and inbound objects; arrays never null; no baggage or seat for infants; free meal and seat sent when isMealRequired/isSeatRequired is true (Super 6E / SpiceMax)."),
    ("Fare Validation", "BaseFare, Tax, YQTax, TransactionFee, AirTransFee and AdditionalTxnFee taken from the FareQuote FareBreakdown and divided by passenger count; Published/Offered fare formulas applied."),
    ("Price and Cancellation Change Validation", "FareQuote IsPriceChanged shows the updated fare; Book IsPriceChanged leads to Ticket with IsPriceChangeAccepted:true; Ticket IsPriceChanged leads to Ticket re-sent with IsPriceChangeAccepted:true (only if the fare is not higher than what the customer paid); FlightDetailChangeInfo shown to the customer."),
    ("GST Validation", "When IsGSTMandatory is true, GST details (number, company name, address, phone, email) are mandatory and sent on the lead passenger; the GSTIN format is validated."),
    ("Pax Details Validation", "Letters and single spaces only (no . , /); first name 1-32 and last name 2-32 characters; SpiceJet (Navitaire) child titles mapped to MR/MS, infant titles MSTR/MS."),
    ("International Booking Validation", "Passport mandatory for every passenger on international journeys (covers SpiceJet DXB/RUH/SHJ, Nepal, GDS and FlyDubai rules); expiry checked against the travel dates."),
    ("Duplicate Booking Validation", "TBO's duplicate-booking error is shown to the customer and nothing is rebooked; after a timeout, GetBookingDetails polling is used instead of a new booking."),
    ("Timeout Validation", "300 s timeout for Book/Ticket, 120 s for Search, 60 s for other methods; on timeout GetBookingDetails is polled every 12 s, up to 10 times."),
    ("Flow Of LCC & Non LCC Booking", "LCC: Search > FareRule > FareQuote > SSR > Ticket > GetBookingDetails. Non-LCC: Search > FareRule > FareQuote > SSR > Book > Ticket > GetBookingDetails."),
    ("Search & Book URL Validation", "Separate Search and Book base URLs are configurable. Note: the staging BookingEngineService_AirBook path returns 'Invalid Resource Requested', so staging Book uses BookingEngineService_Air; please confirm the live Book URL."),
    ("Passport Validation", "When IsPassportFullDetailRequiredAtBook is true, PassportNo, Expiry, IssueDate and IssueCountryCode are mandatory; otherwise PassportNo and Expiry. Issue date is checked to be after DOB and not in the future."),
    ("Search Method Validation", "yyyy-MM-ddTHH:mm:ss format with time 00:00:00; no past dates; 9 passengers maximum including infants; origin and destination required and different; one source only for Special Return; later segments cannot be before earlier ones."),
    ("PAN Validation", "When IsPanRequiredAtBook/Ticket is true, adults must give their own PAN; children and infants give GuardianDetails (title, name and PAN of parent/guardian); PAN format is validated."),
    ("Special Fare Validation (Super 6E / SpiceMax)", "When isSeatMandatory/isMealMandatory is true, a free meal and a free open seat are selected from SSR for each non-infant passenger and sent in Ticket."),
]

wb = Workbook()
ws = wb.active
ws.title = "Flight Check list"
navy = PatternFill("solid", fgColor="1F3864")
white = Font(bold=True, color="FFFFFF")
thin = Side(style="thin", color="000000")
box = Border(left=thin, right=thin, top=thin, bottom=thin)

ws["B1"] = "https://apidoc.tektravels.com/flight/apivalidation.aspx"
ws["B2"], ws["C2"], ws["D2"] = "Flight Check list", "Implemented (Yes/No)", "How it is implemented (Pro Tours & Travel Solutions)"
for c in ("B1", "B2", "C2", "D2"):
    ws[c].fill, ws[c].font, ws[c].border = navy, white, box
    ws[c].alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
for i, (item, how) in enumerate(ROWS, start=3):
    ws.cell(i, 2, item).border = box
    yes = ws.cell(i, 3, "Yes")
    yes.border, yes.alignment, yes.font = box, Alignment(horizontal="center", vertical="top"), Font(bold=True, color="006100")
    d = ws.cell(i, 4, how)
    d.border, d.alignment = box, Alignment(wrap_text=True, vertical="top")
    ws.cell(i, 2).alignment = Alignment(wrap_text=True, vertical="top")
ws.column_dimensions["A"].width = 3
ws.column_dimensions["B"].width = 46
ws.column_dimensions["C"].width = 18
ws.column_dimensions["D"].width = 100
wb.save("certification/TBO-Flight-API-Checklist.xlsx")
print("certification/TBO-Flight-API-Checklist.xlsx", len(ROWS), "rows")
