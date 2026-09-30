import { Reveal, SplitHeading } from './motion.jsx'
import { Orbs, Grain, FlightPath } from './fx.jsx'

/** Shared header + prose shell for the policy pages (Terms, Privacy, Refund). */
export function LegalLayout({ eyebrow, title, updated, children }) {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950 pt-36 pb-14 md:pt-44 md:pb-20">
        <Orbs className="opacity-80" />
        <Grain />
        {/* a flight route drifting across the right of the header (desktop only) */}
        <div aria-hidden="true" className="pointer-events-none absolute top-1/2 right-0 -z-[1] hidden w-[58%] max-w-[760px] -translate-y-1/2 opacity-55 md:block">
          <FlightPath
            d="M 20 250 C 220 230, 380 60, 620 120 S 980 250, 1180 40"
            start="top 100%"
            end="bottom top"
          />
        </div>
        <span aria-hidden="true" className="hero-hairline pointer-events-none absolute inset-x-0 bottom-0 h-px" />
        <div className="wrap relative">
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
