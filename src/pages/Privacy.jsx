import { BIZ } from '../data/site.js'
import { LegalLayout, LegalSection, LegalList } from '../components/legal.jsx'

export default function Privacy() {
  return (
    <LegalLayout eyebrow="Legal" title="Privacy Policy" updated="26 September 2026">
      <LegalSection title="1. What this covers">
        <p>
          This policy explains what personal information {BIZ.name} collects when you use this website,
          message us on WhatsApp, or book a travel service with us, and how we use, store and protect it.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <LegalList
          items={[
            'Contact details — name, phone number, email address, sent when you fill an enquiry form or message us.',
            'Booking and travel details — destination, travel dates, number of travellers, and where relevant, passport and visa information needed to process flights, hotels or visas.',
            'Payment information — handled directly by Razorpay when you pay online. We receive only the payment status, amount, and a payment/order ID — never your full card, UPI or bank details.',
            'Technical information — standard web data such as browser type and pages visited, used only to keep the site working correctly.',
          ]}
        />
      </LegalSection>

      <LegalSection title="3. How we use your information">
        <LegalList
          items={[
            'To prepare quotes, process bookings, and issue tickets, vouchers or visa documents.',
            'To contact you about your booking — confirmations, document requests, schedule changes.',
            'To meet legal requirements from airlines, hotels, visa authorities and payment regulators.',
            'To respond to enquiries you send us directly.',
          ]}
        />
        <p>We do not sell your personal information to anyone.</p>
      </LegalSection>

      <LegalSection title="4. Who we share it with">
        <LegalList
          items={[
            'Razorpay, our payment gateway, to process online payments securely (PCI-DSS compliant).',
            'Airlines, hotels, visa/consulate authorities and other travel suppliers, strictly as needed to complete your specific booking.',
            'Government or regulatory authorities, only where required by law.',
          ]}
        />
        <p>We do not share your data with third parties for their own marketing purposes.</p>
      </LegalSection>

      <LegalSection title="5. Data security">
        <p>
          Payment data is handled entirely within Razorpay's PCI-DSS compliant systems — we never see or
          store your card, UPI or net banking credentials. Other personal information you share with us
          (for bookings, visas, enquiries) is kept only as long as needed to provide the service and meet
          our legal/accounting obligations, and access is limited to our staff who need it to assist you.
        </p>
      </LegalSection>

      <LegalSection title="6. Your choices">
        <p>
          You can ask us at any time what personal information we hold about you, ask us to correct it, or
          ask us to delete it where we are not legally required to retain it (for example, completed booking
          records needed for tax purposes). Contact us using the details below.
        </p>
      </LegalSection>

      <LegalSection title="7. Changes to this policy">
        <p>
          We may update this policy as our services or legal obligations change. The "Last updated" date
          above reflects the most recent change.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact us">
        <p>
          For any privacy question, write to{' '}
          <a href={`mailto:${BIZ.email2}`} className="font-semibold text-brand-500 hover:underline">{BIZ.email2}</a>{' '}
          or call {BIZ.phoneDisplay}.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
