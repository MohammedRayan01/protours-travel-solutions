import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { BIZ, NAV, waLink } from '../data/site.js'
import { lockScroll } from './SmoothScroll.jsx'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const burgerRef = useRef(null)
  const { pathname } = useLocation()

  // Only the home page has a full-bleed hero for the bar to float over.
  const overHero = pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer on navigation, and lock body scroll while it is open.
  useEffect(() => setOpen(false), [pathname])

  // Escape closes the drawer; focus goes back to the trigger.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])
  useEffect(() => {
    lockScroll(open)
    return () => lockScroll(false)
  }, [open])

  return (
    <>
      {/* ---------- Contact strip: numbers + email, no social icons ---------- */}
      <div className="hidden bg-navy-950 text-white/70 lg:block">
        <div className="wrap flex items-center justify-between gap-6 py-2.5 text-[0.92rem]">
          <div className="flex items-center gap-7">
            <a href={`tel:${BIZ.phone}`} className="flex items-center gap-2 transition-colors hover:text-gold-400">
              <Phone size={14} className="text-gold-500" /> {BIZ.phoneDisplay}
            </a>
            <a href={`mailto:${BIZ.email}`} className="flex items-center gap-2 transition-colors hover:text-gold-400">
              <Mail size={14} className="text-gold-500" /> {BIZ.email}
            </a>
          </div>
          <a
            href={BIZ.mapsUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-gold-400"
          >
            <MapPin size={14} className="text-gold-500" />
            A.M. Plaza, Hospital Road, Shivaji Nagar, Bengaluru 560001
          </a>
        </div>
      </div>

      {/* ---------- Main bar ---------- */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          overHero
            ? 'bg-transparent'
            : 'border-b border-white/60 bg-white/96 shadow-[0_10px_40px_-18px_rgb(4_24_44/0.3)] backdrop-blur-2xl'
        }`}
      >
        <div className="wrap flex h-[74px] items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center" aria-label={`${BIZ.name} — home`}>
            {/* White cut over the hero photography, full colour on the light bar */}
            <img
              src={overHero ? '/logo-white.png' : '/logo.png'}
              alt={BIZ.name}
              width={1200}
              height={209}
              className="h-10 w-auto sm:h-12"
            />
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center xl:flex" aria-label="Main">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `rounded-full whitespace-nowrap px-3 py-2 font-display text-[0.92rem] font-semibold transition-all duration-250 ${
                    overHero
                      ? isActive ? 'bg-white/20 text-white' : 'text-white/85 hover:bg-white/12 hover:text-white'
                      : isActive ? 'bg-brand-500/10 text-brand-500' : 'text-ink hover:bg-slate-100 hover:text-brand-500'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            <a
              href={waLink()} target="_blank" rel="noopener noreferrer"
              className="btn btn-gold hidden !px-5 !py-2.5 !text-[0.97rem] sm:inline-flex"
            >
              Get a Quote <ArrowRight size={15} />
            </a>

            {/* Three-line hamburger */}
            <button
              ref={burgerRef}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className={`grid h-11 w-11 shrink-0 place-items-center gap-[5px] rounded-xl border transition-colors xl:hidden ${
                overHero ? 'border-white/30 bg-white/10 backdrop-blur-xl' : 'border-slate-200 bg-white'
              }`}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={
                    open
                      ? i === 0 ? { rotate: 45, y: 7 } : i === 1 ? { opacity: 0, scaleX: 0 } : { rotate: -45, y: -7 }
                      : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`block h-[2.5px] w-5 rounded-full ${overHero ? 'bg-white' : 'bg-navy-900'}`}
                />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/*
        Mobile drawer — deliberately NOT gated by AnimatePresence mount/unmount.
        Real bug found via testing the production bundle (not the dev server):
        AnimatePresence keeps the exiting backdrop/panel mounted, at full size,
        until Framer Motion's exit transition reports complete. If that never
        fires cleanly on a given device (a throttled/backgrounded phone, low
        power mode, or any rAF hiccup — the same class of thing we've hit with
        this animation stack before), the fixed inset-0 backdrop stays mounted
        and can keep intercepting scroll/tap input over the whole page even
        though `open` has already gone back to false and the button no longer
        looks pressed.
        Fix: keep both elements permanently mounted, animate them by feeding
        `open` into `animate` (not by mounting/unmounting), and tie
        `pointerEvents` directly to the `open` boolean via inline style —
        that applies in the same render as the state change, synchronously,
        regardless of whether any animation ever finishes.
      */}
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setOpen(false)}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
        aria-hidden={!open}
        className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-sm xl:hidden"
      />
      <motion.nav
        initial={false}
        animate={{ x: open ? 0 : '100%' }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
        aria-hidden={!open}
        className="fixed top-0 right-0 z-50 flex h-[100dvh] w-[86%] max-w-sm flex-col overflow-y-auto bg-navy-950 px-7 pt-7 pb-10 xl:hidden"
        aria-label="Mobile"
      >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-[0.75rem] font-bold uppercase tracking-[0.3em] text-gold-400">
                  Menu
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-white"
                >
                  <span className="relative block h-4 w-4">
                    <span className="absolute top-1/2 left-0 block h-[2.5px] w-4 -translate-y-1/2 rotate-45 rounded-full bg-white" />
                    <span className="absolute top-1/2 left-0 block h-[2.5px] w-4 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
                  </span>
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                {NAV.map((n, i) => (
                  <motion.div
                    key={n.to}
                    initial={false}
                    // Tied to `open` (not mount) since the drawer itself no longer
                    // remounts on every open — otherwise this stagger only ever
                    // played once, on first page load.
                    animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
                    transition={{ delay: open ? 0.1 + i * 0.055 : 0, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <NavLink
                      to={n.to}
                      end={n.to === '/'}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-2xl px-5 py-4 font-display text-[1.19rem] font-bold transition-colors ${
                          isActive ? 'bg-gold-500 text-navy-950' : 'text-white/85 hover:bg-white/10'
                        }`
                      }
                    >
                      {n.label} <ArrowRight size={17} />
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto space-y-3 pt-9">
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-wa w-full">
                  Chat on WhatsApp
                </a>
                <a href={`tel:${BIZ.phone}`} className="btn glass w-full text-white">
                  <Phone size={16} /> {BIZ.phoneDisplay}
                </a>
                <a
                  href={`mailto:${BIZ.email}`}
                  className="flex items-center justify-center gap-2 pt-2 text-[0.97rem] text-white/60 hover:text-gold-400"
                >
                  <Mail size={14} /> {BIZ.email}
                </a>
              </div>
            </motion.nav>
    </>
  )
}
