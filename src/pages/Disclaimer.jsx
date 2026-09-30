import { Link } from 'react-router-dom'
import { BIZ } from '../data/site.js'
import { LegalLayout, LegalSection, LegalList, legalLink as a } from '../components/legal.jsx'

export default function Disclaimer() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Disclaimer"
      updated="30 September 2026"
      intro="What you can and cannot rely on from this website. Your written quote and booking confirmation always take priority over anything shown here."
    >
      <LegalSection title="1. Information on this website">
        <p>
          We work to keep this website accurate and up to date, but it is general information, not a
          contract or an offer. Itineraries, inclusions, hotel names, durations and descriptions are
          examples of what we can arrange and may change. The details that apply to you are the ones in
          your written quote and confirmation from {BIZ.name}.
        </p>
      </LegalSection>

      <LegalSection title="2. No published prices">
        <p>
          We don't publish prices on this website; every booking is quoted to you individually, based on your
          dates, group and choices at the time you ask.
        </p>
      </LegalSection>

      <LegalSection title="3. Photos">
        <p>
          Some photos are stock images (for example, from Unsplash) used to show a destination. They are
          representative only and may not show the exact hotel, room, ship or view you will get.
        </p>
      </LegalSection>

      <LegalSection title="4. Visas, passports and entry rules">
        <LegalList
          items={[
            'Visa, passport, transit and health entry rules are set by governments and change often. Anything on this site about documents or processing times is general guidance only — always check the official embassy, consulate or government website before you travel.',
            'Visa decisions are made solely by the embassy, consulate or immigration authority concerned. We cannot guarantee that a visa will be granted, or how long it will take.',
            'Passport services are assistance only. Passport Seva / the Ministry of External Affairs decides every application.',
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Hajj and Umrah">
        <p>
          Umrah and Hajj arrangements are subject to the rules and decisions of the Saudi authorities
          (including the Ministry of Hajj and Umrah and its Nusuk platform) and, for Hajj from India, to the
          Government of India’s Hajj Policy and the Haj Committee of India or registered Hajj Group
          Organisers. These rules, quotas and dates can change at short notice. Nothing on this website is a
          promise of a Hajj seat, visa or permit.
        </p>
      </LegalSection>

      <LegalSection title="6. Accreditation and suppliers">
        <p>
          {BIZ.name} is an IATA-accredited travel agent. Mentioning an airline, hotel, cruise line, visa
          centre or other company on this site does not mean that company endorses us. Their names and logos
          belong to them. Services are provided by those suppliers under their own terms.
        </p>
      </LegalSection>

      <LegalSection title="7. Reviews and testimonials">
        <p>
          Testimonials describe individual travellers’ own experiences. Every trip is different, and a past
          experience is not a guarantee of the same outcome for yours.
        </p>
      </LegalSection>

      <LegalSection title="8. Links and third-party services">
        <p>
          This site links to and loads content from other services — WhatsApp, Google Maps, Instagram,
          payment and government websites. We do not control them and are not responsible for their content,
          availability or privacy practices. See our <Link to="/privacy" className={a}>Privacy Policy</Link>{' '}
          for the list of services the site uses.
        </p>
      </LegalSection>

      <LegalSection title="9. Not professional advice">
        <p>
          Nothing on this site is legal, immigration, medical, tax or financial advice. For health and
          vaccination questions, speak to your doctor; for immigration questions, the relevant embassy.
        </p>
      </LegalSection>

      <LegalSection title="10. Limits of our responsibility">
        <p>
          To the extent the law allows, we are not liable for any loss arising from relying on general
          information on this website rather than on your written quote and confirmation. This does not
          limit your rights under the Consumer Protection Act, 2019, or our responsibilities set out in our{' '}
          <Link to="/terms" className={a}>Terms &amp; Conditions</Link> and{' '}
          <Link to="/refund-policy" className={a}>Cancellation &amp; Refund Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection title="11. Spotted a mistake?">
        <p>
          Please tell us on {BIZ.phoneDisplay} or at{' '}
          <a href={`mailto:${BIZ.email2}`} className={a}>{BIZ.email2}</a> and we will correct it.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
