import { Link } from 'react-router-dom'
import { Reveal, SplitHeading } from './motion.jsx'
import { Stamp } from './fx.jsx'
import { BIZ } from '../data/site.js'

const POLICIES = [
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/refund-policy', label: 'Cancellation & Refund Policy' },
]

/** Shared header + prose shell for the policy pages (Terms, Privacy, Refund). */
export function LegalLayout({ eyebrow, title, updated, children }) {
  return (
    <>
      {/* A calm, paper-toned header: the page is for reading, not for show. */}
      <section className="paper relative overflow-hidden border-b border-slate-200 bg-sand pt-14 pb-12 md:pt-20 md:pb-16">
        <div className="wrap relative flex items-end justify-between gap-8">
          <div className="max-w-3xl">
            <Reveal y={14}><span className="eyebrow">{eyebrow}</span></Reveal>
            <SplitHeading as="h1" className="h-sec mt-4 text-balance">{title}</SplitHeading>
            <p className="mt-4 text-[0.98rem] text-body">
              Last updated {updated} · {BIZ.name}
            </p>
          </div>
          <div className="hidden shrink-0 md:block">
            <Stamp top="Pro Tours" main="Please read" bottom="Bengaluru" tone="navy" rotate={-7} />
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_15rem] lg:gap-16">
          <div className="max-w-3xl">{children}</div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-display text-[0.98rem] font-bold text-ink">Our policies</p>
            <ul className="mt-3 grid gap-2 border-l-2 border-slate-200 pl-4 text-[0.98rem]">
              {POLICIES.map((p) => (
                <li key={p.to}>
                  <Link to={p.to} className="link-grow text-navy-900 hover:text-brand-500">{p.label}</Link>
                </li>
              ))}
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
export function LegalSection({ title, children }) {
  return (
    <div className="mb-10 border-t border-slate-200 pt-7 first:border-t-0 first:pt-0">
      <h2 className="text-[1.4rem] font-bold text-ink">{title}</h2>
      <div className="mt-3 grid gap-3 text-[1.03rem] text-pretty text-body">{children}</div>
    </div>
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
