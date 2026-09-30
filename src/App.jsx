import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingActions from './components/FloatingActions.jsx'
import SmoothScroll from './components/SmoothScroll.jsx'
import { Preloader } from './components/fx.jsx'

// Home ships in the main bundle; every other route is code-split so the
// first paint stays small.
import Home from './pages/Home.jsx'
const Services = lazy(() => import('./pages/Services.jsx'))
const Packages = lazy(() => import('./pages/Packages.jsx'))
const FlightsHotels = lazy(() => import('./pages/FlightsHotels.jsx'))
const Umrah    = lazy(() => import('./pages/Umrah.jsx'))
const Visa     = lazy(() => import('./pages/Visa.jsx'))
const Contact  = lazy(() => import('./pages/Contact.jsx'))
const About    = lazy(() => import('./pages/About.jsx'))
const Terms    = lazy(() => import('./pages/Terms.jsx'))
const Privacy  = lazy(() => import('./pages/Privacy.jsx'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy.jsx'))

/** Lightweight placeholder while a route chunk loads. */
function RouteFallback() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <span className="h-11 w-11 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand-500" />
        <span className="font-display text-[0.84rem] font-bold tracking-[0.22em] text-slate-500 uppercase">
          Loading
        </span>
      </div>
    </div>
  )
}

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
}

/* Per-route <title> + description. It's an SPA, so without this every
   page shares one title in search results and browser tabs. */
const META = {
  '/': ['Pro Tours & Travel Solutions | Travel agency in Shivaji Nagar, Bengaluru', 'A Bengaluru travel agency since 2009, and an IATA-accredited agent — flights, hotels, visas, passports, tour packages, cruises and Hajj & Umrah. Walk in on Hospital Road or WhatsApp us.'],
  '/services': ['Travel services — flights, hotels, visas & more | Pro Tours', 'Flight and hotel bookings, tailor-made and group tours, visa and passport help, cruises and Umrah — handled by one desk in Shivaji Nagar, Bengaluru.'],
  '/packages': ['Tour packages from Bengaluru — Dubai, Bali, Maldives, Europe | Pro Tours', 'Economy, Deluxe and Premium holiday packages from Bengaluru, with inclusions and exclusions listed clearly. Get today\'s quote on WhatsApp.'],
  '/flights-hotels': ['Flight & hotel booking in Bengaluru | Pro Tours', 'Domestic and international air tickets and hotel bookings with fare rules explained and confirmed vouchers before you fly.'],
  '/umrah': ['Umrah packages from Bengaluru | Pro Tours Hajj & Umrah Division', 'Umrah visa, flights and hotels near the Haram with walking distances quoted in metres, group co-ordinators and Ziyarat tours.'],
  '/visa': ['Visa requirements for Indian passport holders | Pro Tours', 'Search visa rules for 100+ destinations and get your file checked line by line before it goes in. Passport fresh, renewal and tatkal help too.'],
  '/contact': ['Contact & office address | Pro Tours & Travel Solutions', 'A.M. Plaza, Hospital Road, Shivaji Nagar, Bengaluru 560001. Call, WhatsApp or walk in, Monday–Saturday 10 AM–8 PM.'],
  '/about': ['About us | Pro Tours & Travel Solutions, Bengaluru', 'A travel desk on Hospital Road, Bengaluru, booking trips since 2009. IATA-accredited agent.'],
  '/terms': ['Terms & Conditions | Pro Tours', 'Terms and conditions for bookings made with Pro Tours & Travel Solutions.'],
  '/privacy': ['Privacy Policy | Pro Tours', 'How Pro Tours & Travel Solutions collects, uses and protects your personal information.'],
  '/refund-policy': ['Cancellation & Refund Policy | Pro Tours', 'Cancellation charges and refund timelines for flights, hotels, packages, visas and Umrah.'],
}

function useRouteMeta(pathname) {
  useEffect(() => {
    const [title, desc] = META[pathname] || META['/']
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://www.protoursandtravelsolutions.com${pathname === '/' ? '/' : pathname}`)
  }, [pathname])
}

function Page({ children }) {
  return <motion.main id="main" tabIndex={-1} {...fade}>{children}</motion.main>
}

export default function App() {
  const location = useLocation()
  useRouteMeta(location.pathname)

  return (
    // MotionConfig reducedMotion="user" is Framer Motion's own switch: every
    // animate/whileHover/transition across the app (drawer, page transitions,
    // accordion, floating buttons) auto-respects the OS "reduce motion"
    // setting, without auditing each component individually.
    //
    // SmoothScroll resets scroll on navigation and keeps ScrollTrigger's
    // measurements in sync, which is why ScrollToTop is no longer mounted.
    <MotionConfig reducedMotion="user">
    <SmoothScroll>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-navy-950 focus:px-5 focus:py-3 focus:font-display focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <Preloader />
      <Navbar />
      <AnimatePresence mode="wait">
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/"         element={<Page><Home /></Page>} />
            <Route path="/services" element={<Page><Services /></Page>} />
            <Route path="/packages" element={<Page><Packages /></Page>} />
            <Route path="/flights-hotels" element={<Page><FlightsHotels /></Page>} />
            <Route path="/umrah"    element={<Page><Umrah /></Page>} />
            <Route path="/visa"     element={<Page><Visa /></Page>} />
            <Route path="/contact"  element={<Page><Contact /></Page>} />
            <Route path="/about"    element={<Page><About /></Page>} />
            <Route path="/terms"    element={<Page><Terms /></Page>} />
            <Route path="/privacy"  element={<Page><Privacy /></Page>} />
            <Route path="/refund-policy" element={<Page><RefundPolicy /></Page>} />
            <Route path="*"         element={<Page><Home /></Page>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Footer />
      <FloatingActions />
    </SmoothScroll>
    </MotionConfig>
  )
}
