import { Reveal, SplitHeading } from './motion.jsx'

/** Shared header + prose shell for the policy pages (Terms, Privacy, Refund). */
export function LegalLayout({ eyebrow, title, updated, children }) {
  return (
    <>
      <section className="bg-navy-950 pt-36 pb-14 md:pt-44 md:pb-20">
        <div className="wrap">
          <Reveal><span className="eyebrow eyebrow-light">{eyebrow}</span></Reveal>
          <SplitHeading as="h1" className="h-sec mt-4 !text-white text-balance">{title}</SplitHeading>
          <Reveal delay={0.12}>
            <p className="mt-4 text-[0.95rem] text-white/55">Last updated: {updated}</p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="wrap">
          <div className="mx-auto max-w-3xl">{children}</div>
        </div>
      </section>
    </>
  )
}

export function LegalSection({ title, children }) {
  return (
    <Reveal>
      <div className="mb-10">
        <h2 className="text-[1.4rem] font-bold text-ink">{title}</h2>
        <div className="mt-3 grid gap-3 text-[1.03rem] text-pretty text-body">{children}</div>
      </div>
    </Reveal>
  )
}

export function LegalList({ items }) {
  return (
    <ul className="grid gap-2 pl-5">
      {items.map((x, i) => (
        <li key={i} className="list-disc text-pretty">{x}</li>
      ))}
    </ul>
  )
}
