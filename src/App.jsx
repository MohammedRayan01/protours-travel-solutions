import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingActions from './components/FloatingActions.jsx'
import SmoothScroll from './components/SmoothScroll.jsx'
import { ScrollProgress } from './components/motion.jsx'

// Home ships in the main bundle; every other route is code-split so the
// first paint stays small.
import Home from './pages/Home.jsx'
const Services = lazy(() => import('./pages/Services.jsx'))
const Packages = lazy(() => import('./pages/Packages.jsx'))
const Umrah    = lazy(() => import('./pages/Umrah.jsx'))
const Visa     = lazy(() => import('./pages/Visa.jsx'))
const Contact  = lazy(() => import('./pages/Contact.jsx'))
const About    = lazy(() => import('./pages/About.jsx'))

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

function Page({ children }) {
  return <motion.main id="main" tabIndex={-1} {...fade}>{children}</motion.main>
}

export default function App() {
  const location = useLocation()

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
      <ScrollProgress />
      <Navbar />
      <AnimatePresence mode="wait">
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/"         element={<Page><Home /></Page>} />
            <Route path="/services" element={<Page><Services /></Page>} />
            <Route path="/packages" element={<Page><Packages /></Page>} />
            <Route path="/umrah"    element={<Page><Umrah /></Page>} />
            <Route path="/visa"     element={<Page><Visa /></Page>} />
            <Route path="/contact"  element={<Page><Contact /></Page>} />
            <Route path="/about"    element={<Page><About /></Page>} />
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
