import { BIZ } from '../data/site.js'
import { LegalLayout, LegalSection, LegalList } from '../components/legal.jsx'

export default function RefundPolicy() {
  return (
    <LegalLayout eyebrow="Legal" title="Cancellation & Refund Policy" updated="26 September 2026">
      <LegalSection title="1. General principle">
        <p>
          Because flights, hotels, visas and tour packages are booked through third-party airlines, hotels,
          visa authorities and other suppliers, cancellation and refund terms depend on that supplier's own
          policy at the time of booking. We will always tell you the exact cancellation terms and any
          non-refundable portion before you pay — never after.
        </p>
      </LegalSection>

      <LegalSection title="2. Flights">
        <LegalList
          items={[
            'Refund eligibility and cancellation fees are set by the airline\'s fare rules, not by us.',
            'Airline cancellation/date-change fees, and any fare difference, are deducted from your refund.',
            'Our service fee (where charged) for booking or cancelling is separate from the airline\'s charges and is non-refundable once the booking is issued.',
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Hotels">
        <LegalList
          items={[
            'Free-cancellation bookings can be cancelled up to the deadline shown at the time of booking for a full refund of the hotel amount.',
            'Non-refundable / discounted rates cannot be cancelled for a refund once booked — this is disclosed to you before you pay.',
            'Cancellations after the free-cancellation deadline are subject to the hotel\'s own cancellation charge, typically one or more nights\' stay.',
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Tour packages">
        <LegalList
          items={[
            '30+ days before departure: full refund minus any non-refundable components already paid to airlines/hotels (visa fees, train/ferry tickets, etc.).',
            '15–29 days before departure: 50% of the package cost is refundable, minus non-refundable components.',
            '7–14 days before departure: 25% of the package cost is refundable, minus non-refundable components.',
            'Less than 7 days before departure, or no-show: no refund, as suppliers are paid in full by this point.',
          ]}
        />
        <p>These slabs are general guidance — the exact figure for your booking is confirmed in writing at the time of booking, since it depends on what has already been paid to suppliers.</p>
      </LegalSection>

      <LegalSection title="5. Visa and passport services">
        <p>
          Visa and passport government fees, once submitted to the embassy/consulate/passport office, are
          non-refundable regardless of the outcome of your application — this is a government charge, not
          ours. Our service fee for preparing and filing your application is non-refundable once we have
          begun processing your file. If a visa is rejected, we will assist you in understanding the reason
          and re-applying where possible, at no extra service fee for the first re-attempt.
        </p>
      </LegalSection>

      <LegalSection title="6. Umrah packages">
        <p>
          Umrah packages follow the same tiered cancellation schedule as tour packages (Section 4) once
          flights and Haram-area hotels are confirmed and paid for, since these are largely non-refundable
          close to the group's departure date. Group co-ordinator and visa charges already paid to Saudi
          authorities are non-refundable.
        </p>
      </LegalSection>

      <LegalSection title="7. How refunds are paid">
        <p>
          Approved refunds for online payments are issued to the original payment method via Razorpay, and
          typically reflect in your account within 7–10 business days after we confirm the refund amount
          with the supplier — the exact timeline depends on your bank or card network. Refunds for offline
          payments (bank transfer/cash) are made by bank transfer to your account.
        </p>
      </LegalSection>

      <LegalSection title="8. How to request a cancellation">
        <p>
          Message us on WhatsApp or email{' '}
          <a href={`mailto:${BIZ.email2}`} className="font-semibold text-brand-500 hover:underline">{BIZ.email2}</a>{' '}
          with your booking details. We will confirm the applicable refund amount in writing before
          processing it — nothing is deducted without you seeing the breakdown first.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
