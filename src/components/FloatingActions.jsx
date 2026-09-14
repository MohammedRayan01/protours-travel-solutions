import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Instagram, ArrowUp } from 'lucide-react'
import { BIZ, waLink } from '../data/site.js'
import { scrollTo } from './SmoothScroll.jsx'

/** Inline WhatsApp glyph — lucide has no official WhatsApp mark. */
const WhatsAppIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.41 9.42-9.41a9.36 9.36 0 0 1 9.41 9.42c0 5.19-4.23 9.41-9.42 9.41zM20.5 3.49A11.79 11.79 0 0 0 12.04 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.59 5.93L.08 24l6.36-1.66a11.85 11.85 0 0 0 5.6 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.41-8.41z" />
  </svg>
)

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 620)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const actions = [
    {
      key: 'wa',
      href: waLink(),
      label: 'Chat on WhatsApp',
      className: 'bg-[#25d366] text-white animate-halo',
      icon: <WhatsAppIcon size={23} />,
      external: true,
    },
    {
      key: 'ig',
      href: BIZ.instagram,
      label: 'Follow us on Instagram',
      className:
        'text-white bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]',
      icon: <Instagram size={22} strokeWidth={2.1} />,
      external: true,
    },
    {
      key: 'call',
      href: `tel:${BIZ.phone}`,
      label: `Call ${BIZ.phoneDisplay}`,
      className: 'bg-brand-500 text-white',
      icon: <Phone size={21} strokeWidth={2.2} />,
    },
  ]

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {actions.map((a, i) => (
        <motion.a
          key={a.key}
          href={a.href}
          aria-label={a.label}
          {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          initial={{ opacity: 0, scale: 0.6, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.7 + i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.94 }}
          className={`group relative grid h-[52px] w-[52px] place-items-center rounded-full shadow-lg ${a.className}`}
        >
          {a.icon}
          {/* Desktop hover label */}
          <span className="pointer-events-none absolute right-[62px] hidden whitespace-nowrap rounded-lg bg-navy-950 px-3 py-1.5 text-[0.86rem] font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:block">
            {a.label}
          </span>
        </motion.a>
      ))}

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => scrollTo(0)}
            aria-label="Back to top"
            className="grid h-[52px] w-[52px] place-items-center rounded-full bg-navy-900 text-white shadow-lg"
          >
            <ArrowUp size={21} strokeWidth={2.3} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
