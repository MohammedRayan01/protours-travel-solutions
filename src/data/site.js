/* ============================================================
   SINGLE SOURCE OF TRUTH
   Change business details here and they update everywhere.
   ============================================================ */

export const BIZ = {
  name: 'Pro Tours & Travel Solutions',
  shortName: 'Pro Tours',
  tagline: 'One stop travel solutions for all your travel needs',
  owner: 'Abdul Mannan Sajid',
  phone: '+919900517604',
  phoneDisplay: '+91 99005 17604',
  wa: '919900517604',
  email: 'luckysaj@gmail.com',
  skype: 'luckysaj',
  instagram: 'https://www.instagram.com/protoursandtravelsolutions/',
  instagramHandle: '@protoursandtravelsolutions',
  mapsUrl: 'https://maps.google.com/?q=A+M+Plaza+Hospital+Road+Shivaji+Nagar+Bengaluru+560001',
  address: {
    line1: '21/1, G-2 Plain Street, A.M. Plaza, Ground Floor',
    line2: 'Hospital Road, Near Infantry Road',
    line3: 'Shivaji Nagar, Bengaluru, Karnataka 560001',
  },
  addressOneLine:
    '21/1, G-2 Plain Street, A.M. Plaza, Ground Floor, Hospital Road, Near Infantry Road, Shivaji Nagar, Bengaluru, Karnataka 560001',
  hours: 'Monday – Saturday: 10:00 AM – 8:00 PM',
  hoursNote: 'Sunday: by appointment',
  rating: 4.5,
  reviewCount: 128,
  since: 2009,
}

/** Build a wa.me deep link with a pre-filled message. */
export const waLink = (msg) =>
  `https://wa.me/${BIZ.wa}?text=${encodeURIComponent(
    msg || `Hello ${BIZ.name}, I would like to enquire about your travel services.`
  )}`

/* ---- Navigation — About deliberately sits LAST, after Contact ---- */
export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/packages', label: 'Packages' },
  { to: '/umrah', label: 'Hajj & Umrah' },
  { to: '/visa', label: 'Visa & Passport' },
  { to: '/contact', label: 'Contact' },
  { to: '/about', label: 'About' },
]

/* ---- Hero slides: fully-bleed, immersive imagery ---- */
export const HERO_SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=76',
    alt: 'Mountain lake at sunrise',
  },
  {
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=76',
    alt: 'Dubai skyline at dusk',
  },
  {
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=76',
    alt: 'Tropical beach with turquoise water',
  },
  {
    img: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=2000&q=76',
    alt: 'Masjid al-Haram, Makkah',
  },
]

/* ---- The eight core services ---- */
export const SERVICES = [
  {
    id: 'flights',
    icon: 'Plane',
    title: 'Flight Booking',
    short: 'International & domestic air ticketing',
    desc: 'Every major carrier out of Bengaluru — economy to business, one-way, round-trip or multi-city, with fare rules explained in plain language.',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=72',
    img2: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1000&q=72',
    points: [
      'Best-fare search across GDS and airline-direct inventory',
      'Group fares for 10+ passengers with seats held',
      'Date change, cancellation and refunds handled by us',
      'Web check-in, seat, meal and special assistance requests',
    ],
  },
  {
    id: 'hotels',
    icon: 'BedDouble',
    title: 'Hotel Booking',
    short: 'Hotels & resorts all over the world',
    desc: 'From a budget business hotel in Chennai to an overwater villa in the Maldives — on contracted rates that usually beat public portals once taxes land.',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=72',
    img2: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=72',
    points: [
      'Hotels, resorts, serviced apartments and private villas',
      'Free-cancellation options when your dates are not fixed',
      'Honeymoon, connecting-room and accessibility requests',
      'Confirmed vouchers before you fly — never "on request"',
    ],
  },
  {
    id: 'tailor',
    icon: 'PenTool',
    title: 'Tailor-Made Packages',
    short: 'Built around you, not a brochure',
    desc: 'Tell us the dates, the budget, who is travelling and how fast you like to move. We build the itinerary around that and cost it line by line.',
    img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=72',
    img2: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1000&q=72',
    points: [
      'Honeymoons, anniversaries and milestone celebrations',
      'Multi-generational family trips paced for everyone',
      'Corporate offsites, incentive travel and MICE groups',
      'Jain, Halal, vegan and other meal needs planned from day one',
    ],
  },
  {
    id: 'tours',
    icon: 'Map',
    title: 'Tour Packages',
    short: 'Ready-to-book holidays',
    desc: 'Fixed departures and flexible itineraries across India and the world — honeymoons, family holidays, group departures and corporate meets.',
    img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=72',
    img2: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=72',
    points: [
      'Economy, Deluxe and Premium tiers on every destination',
      'Fixed group departures in school and festival holidays',
      'Private departures on your own dates',
      'Every inclusion and exclusion written down before you pay',
    ],
  },
  {
    id: 'visa',
    icon: 'FileCheck',
    title: 'Visa Services',
    short: 'Tourist, business, visit & transit',
    desc: 'Checklist, forms, covering letter, appointment and follow-up — for the Gulf, Schengen, UK, USA, Canada, Australia and all of Southeast Asia.',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=72',
    img2: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&w=1000&q=72',
    points: [
      'Checklist tailored to your profile, not a generic PDF',
      'Form filling, covering letters and itinerary drafting',
      'VFS / BLS appointments and biometrics guidance',
      'Honest advice if a case looks weak — before you spend on fees',
    ],
  },
  {
    id: 'passport',
    icon: 'BookUser',
    title: 'Passport Assistance',
    short: 'Fresh, renewal, tatkal & lost',
    desc: 'The passport process is simple until something is unusual — a name change, a lost booklet, a minor, a mismatched address. That is where we help most.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=72',
    img2: 'https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=1000&q=72',
    points: [
      'Fresh application, re-issue and renewal',
      'Tatkal when you are travelling at short notice',
      'Lost, damaged or exhausted-pages replacement',
      'Minors, post-marriage name change and address correction',
    ],
  },
  {
    id: 'cruise',
    icon: 'Ship',
    title: 'Cruise Holidays',
    short: 'Arabian Gulf, Mediterranean & India',
    desc: 'Cordelia, MSC, Royal Caribbean, Costa and Norwegian — cabin selection, dining plan, shore excursions and the pre- and post-cruise hotel nights.',
    img: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&w=1000&q=72',
    img2: 'https://images.unsplash.com/photo-1580541631950-7282082b53ce?auto=format&fit=crop&w=1000&q=72',
    points: [
      'India sailings with no visa required',
      'Interior to balcony and suite — we explain the real difference',
      'Port visas, shore excursions and insurance bundled',
      'Family cabins and kids-club sailings',
    ],
  },
  {
    id: 'umrah',
    icon: 'Moon',
    title: 'Umrah & Hajj',
    short: 'Visa, tickets & hotels near the Haram',
    desc: 'Umrah visa, return tickets and hotels within walking distance of the Haram — with Ziyarat tours, group co-ordinators and honest walking distances.',
    img: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1000&q=72',
    img2: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=72',
    points: [
      'Umrah visa processing with document guidance',
      'Direct and one-stop flights from Bengaluru',
      'Walking distance to the Haram quoted in metres, not adjectives',
      'Ziyarat in Makkah and Madinah with a knowledgeable guide',
    ],
  },
]

/* ---- Destinations ---- */
export const DESTINATIONS = [
  { name: 'Dubai & Abu Dhabi', country: 'United Arab Emirates', price: '₹42,900', nights: '4N / 5D', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=72' },
  { name: 'Maldives', country: 'Indian Ocean', price: '₹68,500', nights: '3N / 4D', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=72' },
  { name: 'Bali', country: 'Indonesia', price: '₹54,000', nights: '5N / 6D', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=72' },
  { name: 'Singapore', country: 'Southeast Asia', price: '₹59,900', nights: '4N / 5D', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=72' },
  { name: 'Europe', country: 'Paris · Swiss · Italy', price: '₹1,68,000', nights: '8N / 9D', img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=72' },
  { name: 'Thailand', country: 'Phuket & Krabi', price: '₹38,500', nights: '4N / 5D', img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=72' },
  { name: 'Kerala', country: 'India', price: '₹21,900', nights: '4N / 5D', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=72' },
  { name: 'Makkah & Madinah', country: 'Saudi Arabia', price: '₹74,500', nights: '10 Nights', img: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=72' },
]

/* ---- Package tiers offered on every destination ---- */
export const TIERS = ['Economy', 'Deluxe', 'Premium']

/* ---- Packages (each carries all three tiers) ---- */
export const PACKAGES = [
  {
    id: 'dubai',
    name: 'Dubai City Break & Desert Safari',
    region: 'United Arab Emirates',
    cats: ['international', 'family'],
    badge: 'Best Seller',
    nights: '4N / 5D',
    img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=72',
    desc: 'Burj Khalifa level 124, a dhow cruise dinner on the Creek, red-dune desert safari with BBQ, and a full day in Abu Dhabi at the Grand Mosque.',
    tiers: {
      Economy: { price: '₹42,900', hotel: '3★ Deira / Bur Dubai', inc: ['Return economy flights', 'Daily breakfast', 'Desert safari with BBQ', 'Shared transfers', 'UAE tourist visa'] },
      Deluxe:  { price: '₹58,500', hotel: '4★ Downtown / Marina', inc: ['Return flights, preferred airline', 'Breakfast + 2 dinners', 'Burj Khalifa 124 + Dhow cruise', 'Private AC transfers', 'UAE visa + insurance'] },
      Premium: { price: '₹82,000', hotel: '5★ Palm / Downtown', inc: ['Direct flights, extra baggage', 'Full board', 'Burj Khalifa 148 + Desert VIP', 'Private chauffeur throughout', 'Abu Dhabi day with guide'] },
    },
  },
  {
    id: 'maldives',
    name: 'Maldives Overwater Escape',
    region: 'Maldives',
    cats: ['international', 'honeymoon'],
    badge: 'Honeymoon',
    nights: '3N / 4D',
    img: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=900&q=72',
    desc: 'A water villa with a private sundeck, sunset dolphin cruise, snorkelling on the house reef and a candle-light dinner on the sand.',
    tiers: {
      Economy: { price: '₹68,500', hotel: 'Beach villa, 4★ resort', inc: ['Return flights', 'Breakfast + dinner', 'Speedboat transfers', 'Snorkelling equipment', 'Honeymoon cake & decor'] },
      Deluxe:  { price: '₹96,000', hotel: 'Water villa, 4★ resort', inc: ['Return flights', 'Full board', 'Speedboat transfers', 'Sunset dolphin cruise', 'Candle-light beach dinner'] },
      Premium: { price: '₹1,48,000', hotel: 'Water villa with pool, 5★', inc: ['Direct flights', 'All-inclusive with drinks', 'Seaplane transfer', 'Private sandbank picnic', 'Couple spa ritual'] },
    },
  },
  {
    id: 'bali',
    name: 'Bali — Ubud, Kuta & Nusa Penida',
    region: 'Indonesia',
    cats: ['international', 'honeymoon', 'family'],
    badge: 'Popular',
    nights: '5N / 6D',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=72',
    desc: 'Rice terraces and temples in Ubud, beach days in Kuta, and a full-day Nusa Penida island trip with a floating breakfast to finish.',
    tiers: {
      Economy: { price: '₹54,000', hotel: '3★ Kuta + Ubud', inc: ['Return flights', 'Daily breakfast', 'Ubud & Kintamani tour', 'Shared transfers', 'Visa on arrival guidance'] },
      Deluxe:  { price: '₹72,500', hotel: '4★ + private pool villa', inc: ['Return flights', 'Breakfast + 3 dinners', 'Nusa Penida day trip', 'Private car with driver', 'Floating breakfast'] },
      Premium: { price: '₹1,05,000', hotel: '5★ cliff-side resort', inc: ['Direct flights', 'Full board', 'Private yacht day', 'Dedicated guide', 'Couple spa & photoshoot'] },
    },
  },
  {
    id: 'singapore',
    name: 'Singapore with Universal Studios',
    region: 'Singapore',
    cats: ['international', 'family'],
    badge: 'Family Favourite',
    nights: '4N / 5D',
    img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=72',
    desc: 'Gardens by the Bay, the Sentosa cable car, a Universal Studios day pass and a night safari — paced properly for travelling with children.',
    tiers: {
      Economy: { price: '₹59,900', hotel: '3★ Little India', inc: ['Return flights', 'Daily breakfast', 'City tour + Gardens by the Bay', 'Shared transfers', 'Visa assistance'] },
      Deluxe:  { price: '₹78,000', hotel: '4★ Clarke Quay', inc: ['Return flights', 'Breakfast + 2 dinners', 'Universal Studios + Sentosa', 'Private transfers', 'Night Safari'] },
      Premium: { price: '₹1,12,000', hotel: '5★ Marina Bay', inc: ['Direct flights', 'Full board', 'All attraction passes', 'Private guide & car', 'Sentosa island resort night'] },
    },
  },
  {
    id: 'europe',
    name: 'Classic Europe — Paris, Swiss & Italy',
    region: 'Europe',
    cats: ['international', 'honeymoon'],
    badge: 'Grand Tour',
    nights: '8N / 9D',
    img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=72',
    desc: 'The Eiffel Tower summit, Jungfraujoch, a Venice gondola and the Colosseum — on a comfortable coach-and-rail routing with Indian meals throughout.',
    tiers: {
      Economy: { price: '₹1,68,000', hotel: '3★ city outskirts', inc: ['Return flights', 'Daily Indian breakfast + dinner', 'Coach tour with guide', 'Schengen visa assistance', 'Rail pass where applicable'] },
      Deluxe:  { price: '₹2,15,000', hotel: '4★ central', inc: ['Return flights', 'Full board, Indian meals', 'Eiffel summit + Jungfraujoch', 'Gondola ride, Swiss rail', 'Visa + travel insurance'] },
      Premium: { price: '₹3,10,000', hotel: '5★ landmark hotels', inc: ['Premium economy flights', 'Full board with wine dinners', 'Private guided tours', 'First-class Swiss rail', 'Airport-to-hotel chauffeur'] },
    },
  },
  {
    id: 'thailand',
    name: 'Phuket & Krabi Island Hopper',
    region: 'Thailand',
    cats: ['international', 'family', 'honeymoon'],
    badge: 'Best Value',
    nights: '4N / 5D',
    img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=72',
    desc: 'Phi Phi by speedboat, James Bond island canoeing, and a free evening in Patong. Easy visa, short flight, excellent value.',
    tiers: {
      Economy: { price: '₹38,500', hotel: '3★ Patong', inc: ['Return flights', 'Daily breakfast', 'Phi Phi island tour', 'Shared transfers', 'Visa on arrival guidance'] },
      Deluxe:  { price: '₹52,000', hotel: '4★ beachfront', inc: ['Return flights', 'Breakfast + 2 dinners', 'Phi Phi + James Bond island', 'Private transfers', 'Krabi extension'] },
      Premium: { price: '₹74,500', hotel: '5★ pool villa', inc: ['Direct flights', 'Full board', 'Private speedboat charter', 'Thai spa package', 'Private guide'] },
    },
  },
  {
    id: 'kerala',
    name: 'Kerala — Munnar, Thekkady & Alleppey',
    region: 'Kerala, India',
    cats: ['india', 'honeymoon', 'family'],
    badge: 'God’s Own Country',
    nights: '4N / 5D',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=72',
    desc: 'Tea gardens in Munnar, a spice plantation walk in Thekkady, and an overnight private houseboat drifting the Alleppey backwaters.',
    tiers: {
      Economy: { price: '₹21,900', hotel: '3★ + shared houseboat', inc: ['AC car throughout', 'Daily breakfast', 'Munnar & Thekkady sightseeing', 'Shared houseboat night', 'Driver allowance included'] },
      Deluxe:  { price: '₹32,500', hotel: '4★ + private houseboat', inc: ['AC car throughout', 'Breakfast + dinner', 'Private houseboat with chef', 'Spice plantation tour', 'Kathakali show'] },
      Premium: { price: '₹48,000', hotel: '5★ resorts + luxury boat', inc: ['Premium SUV with driver', 'Full board', 'Luxury houseboat suite', 'Ayurvedic spa sessions', 'Private guide throughout'] },
    },
  },
  {
    id: 'kashmir',
    name: 'Kashmir — Srinagar, Gulmarg & Pahalgam',
    region: 'Jammu & Kashmir, India',
    cats: ['india', 'honeymoon'],
    badge: 'Seasonal',
    nights: '5N / 6D',
    img: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=72',
    desc: 'A shikara ride on Dal Lake, a night on a deluxe houseboat, the Gulmarg gondola and the meadows and pine valleys of Pahalgam.',
    tiers: {
      Economy: { price: '₹27,500', hotel: '3★ + houseboat night', inc: ['Return flights', 'Breakfast + dinner', 'Shikara ride', 'Gulmarg & Pahalgam day trips', 'All transfers'] },
      Deluxe:  { price: '₹38,900', hotel: '4★ + deluxe houseboat', inc: ['Return flights', 'Full board', 'Gondola phase 1 & 2', 'Private cab throughout', 'Sonmarg day trip'] },
      Premium: { price: '₹56,000', hotel: '5★ lake-view resorts', inc: ['Return flights', 'Full board', 'Luxury houseboat suite', 'Private guide & SUV', 'Candle-light shikara dinner'] },
    },
  },
  {
    id: 'goldentriangle',
    name: 'Golden Triangle — Delhi, Agra, Jaipur',
    region: 'North India',
    cats: ['india', 'family'],
    badge: 'Heritage',
    nights: '5N / 6D',
    img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=72',
    desc: 'The Taj at sunrise, Amber Fort in Jaipur, Qutub Minar and the food lanes of Old Delhi — the classic first circuit of North India.',
    tiers: {
      Economy: { price: '₹24,500', hotel: '3★ hotels', inc: ['AC car throughout', 'Daily breakfast', 'Monument entry tickets', 'Driver allowance', 'All transfers'] },
      Deluxe:  { price: '₹36,000', hotel: '4★ hotels', inc: ['AC car throughout', 'Breakfast + dinner', 'Local guides at each city', 'Taj sunrise visit', 'Amber Fort jeep ride'] },
      Premium: { price: '₹62,000', hotel: '5★ heritage palaces', inc: ['Premium SUV with chauffeur', 'Full board', 'Private historian guide', 'Heritage palace stay in Jaipur', 'Old Delhi food walk'] },
    },
  },
  {
    id: 'goa',
    name: 'Goa Beach Getaway',
    region: 'Goa, India',
    cats: ['india', 'family'],
    badge: 'Long Weekend',
    nights: '3N / 4D',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=72',
    desc: 'North and South Goa sightseeing, a Mandovi river cruise, and plenty of unscheduled beach time. Flights from Bengaluru included.',
    tiers: {
      Economy: { price: '₹16,900', hotel: '3★ North Goa', inc: ['Return flights from BLR', 'Daily breakfast', 'North Goa sightseeing', 'Airport transfers', 'Mandovi river cruise'] },
      Deluxe:  { price: '₹26,500', hotel: '4★ beach resort', inc: ['Return flights', 'Breakfast + dinner', 'North & South Goa tours', 'Private cab', 'Water sports package'] },
      Premium: { price: '₹42,000', hotel: '5★ beachfront villa', inc: ['Return flights', 'Full board', 'Private yacht sunset cruise', 'Chauffeur throughout', 'Spa & candle-light dinner'] },
    },
  },
  {
    id: 'gulfcruise',
    name: 'Arabian Gulf Cruise — MSC',
    region: 'Dubai · Abu Dhabi · Doha',
    cats: ['cruise', 'international', 'family'],
    badge: 'Cruise',
    nights: '3 Nights',
    img: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&w=900&q=72',
    desc: 'Sail Dubai, Abu Dhabi, Sir Bani Yas and Doha with all meals, live entertainment and the pool deck included on board.',
    tiers: {
      Economy: { price: '₹46,000', hotel: 'Interior cabin', inc: ['Return flights to Dubai', 'All meals on board', 'Port charges & taxes', 'Live entertainment', 'Port visas'] },
      Deluxe:  { price: '₹62,000', hotel: 'Balcony cabin', inc: ['Return flights', 'All meals + select drinks', 'Shore excursions', 'Pre-cruise Dubai night', 'Port visas & transfers'] },
      Premium: { price: '₹94,000', hotel: 'Yacht Club suite', inc: ['Direct flights', 'All-inclusive with butler', 'Private shore excursions', '2 nights 5★ Dubai', 'Priority embarkation'] },
    },
  },
  {
    id: 'cordelia',
    name: 'Mumbai – Goa Cordelia Cruise',
    region: 'India Sailing',
    cats: ['cruise', 'india', 'family'],
    badge: 'No Visa Needed',
    nights: '2 Nights',
    img: 'https://images.unsplash.com/photo-1580541631950-7282082b53ce?auto=format&fit=crop&w=900&q=72',
    desc: 'India’s own cruise line — Indian and international buffets, casino, kids’ club, live shows and a full shore day in Goa.',
    tiers: {
      Economy: { price: '₹19,500', hotel: 'Interior cabin', inc: ['All meals on board', 'Live entertainment', 'Kids’ club access', 'Port charges', 'No visa required'] },
      Deluxe:  { price: '₹28,000', hotel: 'Sea-view cabin', inc: ['All meals on board', 'Goa shore excursion', 'Speciality dining credit', 'Priority boarding', 'Port charges'] },
      Premium: { price: '₹44,000', hotel: 'Balcony suite', inc: ['All meals + beverage package', 'Private Goa excursion', 'Spa credit', 'Butler service', 'Mumbai hotel night'] },
    },
  },
  {
    id: 'umrah-pkg',
    name: 'Umrah — Makkah & Madinah',
    region: 'Saudi Arabia',
    cats: ['umrah'],
    badge: 'Umrah',
    nights: '10–14 Nights',
    img: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=900&q=72',
    desc: 'Umrah visa, return tickets, hotels within walking distance of the Haram, Ziyarat tours and a group co-ordinator with you throughout.',
    tiers: {
      Economy: { price: '₹74,500', hotel: '3★, 600–800 m from Haram', inc: ['Umrah visa included', 'Return economy flights', 'Quad sharing rooms', 'Makkah–Madinah bus transfers', 'Ziyarat in both cities'] },
      Deluxe:  { price: '₹1,08,000', hotel: '4★, within 300 m of Haram', inc: ['Umrah visa included', 'Preferred-airline flights', 'Triple sharing, breakfast + dinner', 'Private AC coach transfers', 'Group co-ordinator throughout'] },
      Premium: { price: '₹1,45,000', hotel: '5★ Haram-view', inc: ['Umrah visa included', 'Direct flights, preferred seats', 'Double sharing, full board', 'Private car + Haramain train', 'Dedicated scholar with the group'] },
    },
  },
]

/* ---- Google-verified reviews ---- */
export const REVIEWS = [
  {
    name: 'Rahul Kulkarni',
    place: 'Indiranagar, Bengaluru',
    initials: 'RK',
    stars: 5,
    when: '2 months ago',
    text: 'Booked our Dubai family trip through Sajid bhai. Visa came through in four days and the hotel was exactly as promised. He even rearranged our return flight when my son fell ill — no extra fuss, no arguing about fees.',
  },
  {
    name: 'Fatima Anwar',
    place: 'Shivaji Nagar, Bengaluru',
    initials: 'FA',
    stars: 5,
    when: '5 months ago',
    text: 'We did our Umrah with them last Ramadan. The hotel was a five-minute walk from the Haram, exactly as they said, and the group co-ordinator stayed with us the whole time. For first-timers that mattered more than the price.',
  },
  {
    name: 'Suresh Menon',
    place: 'Admin Head, IT services firm',
    initials: 'SM',
    stars: 5,
    when: '1 month ago',
    text: 'Our company routes all international ticketing here now. Quotes come back the same day, invoices are clean for accounts, and someone always answers after office hours. That is genuinely rare in this business.',
  },
  {
    name: 'Priya Nair',
    place: 'Whitefield, Bengaluru',
    initials: 'PN',
    stars: 5,
    when: '3 weeks ago',
    text: 'Our Kerala houseboat trip was planned perfectly for my parents — slow pace, good food, no long drives. They thought of things we did not even ask about.',
  },
  {
    name: 'Mohammed Irfan',
    place: 'Frazer Town, Bengaluru',
    initials: 'MI',
    stars: 4,
    when: '4 months ago',
    text: 'Schengen visa approved on the first attempt. They rewrote my covering letter and caught two mistakes in my bank statements before submission. Worth every rupee of the service fee.',
  },
  {
    name: 'Anitha Reddy',
    place: 'Jayanagar, Bengaluru',
    initials: 'AR',
    stars: 5,
    when: '6 weeks ago',
    text: 'Honeymoon in Maldives. The water villa was exactly the one shown to us, not a downgrade on arrival like friends had warned. Everything was confirmed in writing beforehand.',
  },
]

/* ---- Headline numbers ---- */
export const STATS = [
  { value: 16, suffix: '+', label: 'Years of experience' },
  { value: 10000, suffix: '+', label: 'Travellers served' },
  { value: 60, suffix: '+', label: 'Destinations covered' },
  { value: 98, suffix: '%', label: 'Visa success rate' },
]

/* ---- FAQ ---- */
export const FAQS = [
  { q: 'Do you charge for a quotation?', a: 'No. Quotes, itinerary suggestions and visa checklists are free. You only pay once you decide to book, and our service fee is shown to you before that point.' },
  { q: 'How early should I apply for a visa?', a: 'Schengen and UK — six to eight weeks before travel. UAE, Singapore, Thailand and Malaysia — two to three weeks is usually comfortable. We will tell you the realistic timeline for your specific case.' },
  { q: 'Can you customise a package we saw elsewhere?', a: 'Yes. Send us the itinerary and we will rebuild it with your preferred hotels, dates and pace — and show you exactly where the cost sits.' },
  { q: 'What does the Umrah package include?', a: 'Umrah visa, return air tickets, hotels in Makkah and Madinah, intercity transfers, Ziyarat tours and on-ground assistance. Meal plan and hotel category are yours to choose.' },
  { q: 'Do you handle corporate travel accounts?', a: 'Yes — credit terms, GST invoicing, policy-compliant fares, monthly MIS reports and a named consultant for your travel desk. Ask us for a corporate proposal.' },
  { q: 'What if something goes wrong while I am travelling?', a: 'You message the same WhatsApp number you booked on. Delays, missed connections, hotel problems or lost baggage — we handle it from Bengaluru while you are on the ground.' },
]
