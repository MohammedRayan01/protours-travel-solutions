/**
 * Airports offered in the flight search box. `country` decides domestic vs
 * international (TBO FAQ Q23: domestic = both ends in India).
 * Shared with the browser bundle via src/data/airports.js.
 */
const IN = [
  ['BLR', 'Bengaluru', 'Kempegowda International'], ['DEL', 'Delhi', 'Indira Gandhi International'], ['BOM', 'Mumbai', 'Chhatrapati Shivaji Maharaj International'],
  ['MAA', 'Chennai', 'Chennai International'], ['HYD', 'Hyderabad', 'Rajiv Gandhi International'], ['CCU', 'Kolkata', 'Netaji Subhas Chandra Bose International'],
  ['COK', 'Kochi', 'Cochin International'], ['GOI', 'Goa', 'Dabolim'], ['GOX', 'Goa', 'Manohar International (Mopa)'], ['AMD', 'Ahmedabad', 'Sardar Vallabhbhai Patel International'],
  ['PNQ', 'Pune', 'Pune'], ['JAI', 'Jaipur', 'Jaipur International'], ['LKO', 'Lucknow', 'Chaudhary Charan Singh International'], ['TRV', 'Thiruvananthapuram', 'Trivandrum International'],
  ['CCJ', 'Kozhikode', 'Calicut International'], ['CNN', 'Kannur', 'Kannur International'], ['IXE', 'Mangaluru', 'Mangalore International'], ['MYQ', 'Mysuru', 'Mysore'],
  ['HBX', 'Hubballi', 'Hubli'], ['IXG', 'Belagavi', 'Belgaum'], ['SXR', 'Srinagar', 'Sheikh ul-Alam International'], ['IXJ', 'Jammu', 'Jammu'], ['IXL', 'Leh', 'Kushok Bakula Rimpochee'],
  ['ATQ', 'Amritsar', 'Sri Guru Ram Dass Jee International'], ['IXC', 'Chandigarh', 'Chandigarh'], ['VNS', 'Varanasi', 'Lal Bahadur Shastri International'], ['PAT', 'Patna', 'Jay Prakash Narayan'],
  ['GAU', 'Guwahati', 'Lokpriya Gopinath Bordoloi International'], ['IXB', 'Bagdogra', 'Bagdogra'], ['BBI', 'Bhubaneswar', 'Biju Patnaik International'], ['NAG', 'Nagpur', 'Dr. Babasaheb Ambedkar International'],
  ['IDR', 'Indore', 'Devi Ahilya Bai Holkar'], ['BHO', 'Bhopal', 'Raja Bhoj'], ['RPR', 'Raipur', 'Swami Vivekananda'], ['VTZ', 'Visakhapatnam', 'Visakhapatnam'], ['VGA', 'Vijayawada', 'Vijayawada'],
  ['TIR', 'Tirupati', 'Tirupati'], ['IXM', 'Madurai', 'Madurai'], ['TRZ', 'Tiruchirappalli', 'Tiruchirappalli International'], ['CJB', 'Coimbatore', 'Coimbatore International'],
  ['IXZ', 'Port Blair', 'Veer Savarkar International'], ['UDR', 'Udaipur', 'Maharana Pratap'], ['JDH', 'Jodhpur', 'Jodhpur'], ['STV', 'Surat', 'Surat'], ['BDQ', 'Vadodara', 'Vadodara'],
  ['RAJ', 'Rajkot', 'Rajkot International'], ['DED', 'Dehradun', 'Jolly Grant'], ['IXR', 'Ranchi', 'Birsa Munda'], ['AGR', 'Agra', 'Agra'], ['GAY', 'Gaya', 'Gaya'], ['IXA', 'Agartala', 'Maharaja Bir Bikram'],
  ['IMF', 'Imphal', 'Imphal'], ['DIB', 'Dibrugarh', 'Dibrugarh'], ['IXU', 'Aurangabad', 'Aurangabad'], ['NDC', 'Nanded', 'Nanded'], ['KLH', 'Kolhapur', 'Kolhapur'], ['AYJ', 'Ayodhya', 'Maharishi Valmiki International'],
].map(([code, city, name]) => [code, { city, name, country: 'IN' }])

const WORLD = [
  ['DXB', 'Dubai', 'Dubai International', 'AE'], ['AUH', 'Abu Dhabi', 'Zayed International', 'AE'], ['SHJ', 'Sharjah', 'Sharjah International', 'AE'],
  ['JED', 'Jeddah', 'King Abdulaziz International', 'SA'], ['MED', 'Madinah', 'Prince Mohammad bin Abdulaziz', 'SA'], ['RUH', 'Riyadh', 'King Khalid International', 'SA'], ['DMM', 'Dammam', 'King Fahd International', 'SA'],
  ['DOH', 'Doha', 'Hamad International', 'QA'], ['MCT', 'Muscat', 'Muscat International', 'OM'], ['BAH', 'Bahrain', 'Bahrain International', 'BH'], ['KWI', 'Kuwait', 'Kuwait International', 'KW'],
  ['SIN', 'Singapore', 'Changi', 'SG'], ['KUL', 'Kuala Lumpur', 'Kuala Lumpur International', 'MY'], ['BKK', 'Bangkok', 'Suvarnabhumi', 'TH'], ['DMK', 'Bangkok', 'Don Mueang', 'TH'], ['HKT', 'Phuket', 'Phuket International', 'TH'],
  ['DPS', 'Bali', 'Ngurah Rai International', 'ID'], ['MLE', 'Malé', 'Velana International', 'MV'], ['CMB', 'Colombo', 'Bandaranaike International', 'LK'], ['KTM', 'Kathmandu', 'Tribhuvan International', 'NP'],
  ['DAC', 'Dhaka', 'Hazrat Shahjalal International', 'BD'], ['HKG', 'Hong Kong', 'Hong Kong International', 'HK'], ['NRT', 'Tokyo', 'Narita', 'JP'], ['ICN', 'Seoul', 'Incheon', 'KR'],
  ['LHR', 'London', 'Heathrow', 'GB'], ['CDG', 'Paris', 'Charles de Gaulle', 'FR'], ['FRA', 'Frankfurt', 'Frankfurt', 'DE'], ['AMS', 'Amsterdam', 'Schiphol', 'NL'], ['ZRH', 'Zurich', 'Zurich', 'CH'],
  ['FCO', 'Rome', 'Fiumicino', 'IT'], ['IST', 'Istanbul', 'Istanbul', 'TR'], ['JFK', 'New York', 'John F. Kennedy International', 'US'], ['EWR', 'Newark', 'Newark Liberty', 'US'], ['SFO', 'San Francisco', 'San Francisco International', 'US'],
  ['ORD', 'Chicago', "O'Hare", 'US'], ['YYZ', 'Toronto', 'Pearson', 'CA'], ['SYD', 'Sydney', 'Kingsford Smith', 'AU'], ['MEL', 'Melbourne', 'Tullamarine', 'AU'], ['CAI', 'Cairo', 'Cairo International', 'EG'],
  ['NBO', 'Nairobi', 'Jomo Kenyatta', 'KE'], ['BAK', 'Baku', 'Heydar Aliyev', 'AZ'], ['TBS', 'Tbilisi', 'Tbilisi', 'GE'], ['ALA', 'Almaty', 'Almaty', 'KZ'],
].map(([code, city, name, country]) => [code, { city, name, country }])

export const AIRPORTS = Object.fromEntries([...IN, ...WORLD])
