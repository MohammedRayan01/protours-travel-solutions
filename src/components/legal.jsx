import { Children, isValidElement } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Reveal, SplitHeading } from './motion.jsx'
import { Stamp } from './fx.jsx'
import { scrollTo, useHashScroll } from './SmoothScroll.jsx'
import { BIZ } from '../data/site.js'

const POLICIES = [
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/refund-policy', label: 'Cancellation & Refund Policy' },
  { to: '/disclaimer', label: 'Disclaimer' },
]

/* Contents links: scroll in the handler (browser-only) and keep the URL shareable. */
const jumpTo = (id) => (e) => {
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  scrollTo(el, { offset: -100 })
  window.history.replaceState(window.history.state, '', `#${id}`)
}

/** "4. Travel documents" -> "travel-documents" (stable anchor ids, SSR-safe). */
export function slug(title) {
  return String(title)
    .toLowerCase()
    .replace(/^\s*\d+\.\s*/, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Shared header + prose shell for the policy pages.
 * The "On this page" list is built from the LegalSection children's titles,
 * so a section added to a page shows up in its contents automatically.
 */
export function LegalLayout({ eyebrow, title, updated, intro, children }) {
  const { pathname } = useLocation()
  useHashScroll(-100) // deep links like /privacy#your-rights land on the section
  const toc = Children.toArray(children)
    .filter((c) => isValidElement(c) && c.props.title)
    .map((c) => ({ id: c.props.id || slug(c.props.title), title: c.props.title }))

  return (
    <>
      {/* A calm, paper-toned header: the page is for reading, not for show. */}
      <section className="paper relative overflow-hidden border-b border-slate-200 bg-sand pt-14 pb-12 md:pt-20 md:pb-16 print:border-0 print:bg-white print:pt-0 print:pb-4">
        <div className="wrap relative flex items-end justify-between gap-8">
          <div className="max-w-3xl">
            <Reveal y={14}><span className="eyebrow">{eyebrow}</span></Reveal>
            <SplitHeading as="h1" className="h-sec mt-4 text-balance">{title}</SplitHeading>
            <p className="mt-4 text-[0.98rem] text-body">
              Last updated <time>{updated}</time> · {BIZ.name}
            </p>
            {intro && <p className="mt-4 max-w-2xl text-[1.03rem] text-pretty text-body">{intro}</p>}
          </div>
          <div className="hidden shrink-0 md:block print:hidden">
            <Stamp top="Pro Tours" main="Please read" bottom="Bengaluru" tone="navy" rotate={-7} />
          </div>
        </div>
      </section>

      <section className="section bg-paper print:bg-white print:py-0">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_16rem] lg:gap-16 print:block">
          <div className="max-w-3xl min-w-0">
            {toc.length > 2 && (
              <nav aria-label="On this page" className="mb-10 rounded-2xl border border-slate-200 bg-white/70 p-5 md:p-6 print:hidden">
                <p className="font-display text-[0.98rem] font-bold text-ink">On this page</p>
                <ol className="mt-3 grid gap-x-8 gap-y-1.5 text-[0.95rem] sm:grid-cols-2">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} onClick={jumpTo(t.id)} className="text-navy-900 hover:text-brand-500 hover:underline">{t.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            {children}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start print:hidden">
            <p className="font-display text-[0.98rem] font-bold text-ink">Our policies</p>
            <ul className="mt-3 grid gap-2 border-l-2 border-slate-200 pl-4 text-[0.98rem]">
              {POLICIES.map((p) => {
                const active = p.to === pathname
                return (
                  <li key={p.to}>
                    <Link
                      to={p.to}
                      aria-current={active ? 'page' : undefined}
                      className={`link-grow hover:text-brand-500 ${active ? 'font-bold text-brand-500' : 'text-navy-900'}`}
                    >
                      {p.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <p className="mt-8 text-[0.95rem] text-pretty">
              Questions about any of this? Call{' '}
              <a href={`tel:${BIZ.phone}`} className="font-bold whitespace-nowrap text-navy-900 hover:text-brand-500">{BIZ.phoneDisplay}</a>{' '}
              or email{' '}
              <a href={`mailto:${BIZ.email2}`} className="font-bold break-all text-navy-900 hover:text-brand-500">{BIZ.email2}</a>.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}

/* Policy text stays still — no fade-ins on paragraphs people need to read. */
export function LegalSection({ title, id, children }) {
  return (
    <section
      id={id || slug(title)}
      className="mb-10 scroll-mt-28 border-t border-slate-200 pt-7 first-of-type:border-t-0 first-of-type:pt-0 print:mb-6 print:break-inside-avoid-page"
    >
      <h2 className="text-[1.4rem] font-bold text-ink">{title}</h2>
      <div className="mt-3 grid gap-3 text-[1.03rem] text-pretty text-body">{children}</div>
    </section>
  )
}

export function LegalList({ items }) {
  return (
    <ul className="grid gap-2 pl-5">
      {items.map((x, i) => (
        <li key={i} className="list-disc text-pretty marker:text-gold-600">{x}</li>
      ))}
    </ul>
  )
}

/**
 * Simple table for "what / why" style disclosures.
 * On phones each row becomes a stacked card with the column label shown inline.
 */
export function LegalTable({ head, rows }) {
  return (
    <table className="w-full border-collapse text-left text-[0.97rem] max-sm:block">
      <thead className="max-sm:sr-only">
        <tr>
          {head.map((h) => (
            <th key={h} scope="col" className="border-b-2 border-slate-300 py-2 pr-4 align-bottom font-bold text-ink">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="max-sm:grid max-sm:gap-3">
        {rows.map((r, i) => (
          <tr key={i} className="align-top max-sm:block max-sm:rounded-xl max-sm:border max-sm:border-slate-200 max-sm:bg-white/70 max-sm:p-4">
            {r.map((cell, j) => (
              <td
                key={j}
                className={`border-b border-slate-200 py-2.5 pr-4 text-pretty max-sm:block max-sm:border-0 max-sm:p-0 ${j === 0 ? 'font-semibold text-ink' : 'max-sm:mt-2'}`}
              >
                {j > 0 && <span className="block text-[0.8rem] font-bold tracking-wide text-slate-500 uppercase sm:hidden">{head[j]}</span>}
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** The grievance / contact block, identical on every policy page. */
export function GrievanceContact() {
  const a = 'font-semibold text-brand-500 hover:underline'
  return (
    <address className="rounded-2xl border border-slate-200 bg-white/70 p-5 not-italic md:p-6">
      <p className="font-bold text-ink">Grievance Officer: {BIZ.owner}</p>
      <p className="mt-1">{BIZ.name}</p>
      <p>{BIZ.addressOneLine}, India</p>
      <p className="mt-2">
        Email: <a href={`mailto:${BIZ.email2}`} className={`${a} [overflow-wrap:anywhere]`}>{BIZ.email2}</a>
      </p>
      <p>
        Alternate email: <a href={`mailto:${BIZ.email}`} className={`${a} [overflow-wrap:anywhere]`}>{BIZ.email}</a>
      </p>
      <p>
        Phone / WhatsApp: <a href={`tel:${BIZ.phone}`} className={`${a} whitespace-nowrap`}>{BIZ.phoneDisplay}</a>
      </p>
      <p>Office hours: {BIZ.hours}</p>
    </address>
  )
}

export const legalLink = 'font-semibold text-brand-500 hover:underline'
