import { BIZ } from '../data/site.js'
import { LegalLayout, LegalSection, LegalList } from '../components/legal.jsx'

export default function Terms() {
  return (
    <LegalLayout eyebrow="Legal" title="Terms & Conditions" updated="26 September 2026">
      <LegalSection title="1. About these terms">
        <p>
          These Terms & Conditions govern your use of the {BIZ.name} website and any flight, hotel, tour
          package, visa, passport, cruise or Umrah service booked with us, whether online, over WhatsApp,
          by phone, or in person at our Bengaluru office. By making a booking or an online payment with us,
          you agree to these terms.
        </p>
      </LegalSection>

      <LegalSection title="2. Bookings and pricing">
        <p>
          We don't publish prices on this website; every booking is quoted to you individually. Package
          quotes are per person on twin sharing unless stated otherwise. Airfares, hotel rates, visa fees and package prices are set by airlines, hotels,
          visa authorities and our suppliers, and can change without notice until a booking is fully paid and
          confirmed. We will always confirm the final price with you in writing (WhatsApp or email) before
          you pay.
        </p>
        <p>
          A booking is confirmed only once payment is received and we have issued a confirmation (ticket,
          hotel voucher, visa receipt or booking confirmation). An enquiry or a quote is not a confirmed
          booking.
        </p>
      </LegalSection>

      <LegalSection title="3. Payments">
        <p>
          Online payments on this website are processed through Razorpay, a PCI-DSS compliant payment
          gateway. We do not store your card, UPI or net banking credentials on our servers — they are
          handled entirely by Razorpay and your bank.
        </p>
        <LegalList
          items={[
            'Accepted methods include major domestic and international debit/credit cards (Visa, Mastercard, American Express, Diners Club/Discover, RuPay), UPI, net banking and supported wallets.',
            'International cards are supported; the charge is processed in Indian Rupees (INR) and your card network/issuing bank converts it to your local currency at their prevailing exchange rate, which may include a currency-conversion fee charged by your bank.',
            'For phone/WhatsApp bookings, we may also accept bank transfer or cash at our office — these are confirmed manually and are not processed through the online gateway.',
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Travel documents and eligibility">
        <p>
          You are responsible for holding a valid passport (with the minimum validity required by your
          destination), correct visa, and any health/insurance documents required for your trip. We provide
          guidance and processing assistance, but final approval of visas and immigration decisions rests
          with the respective government authority and is outside our control.
        </p>
      </LegalSection>

      <LegalSection title="5. Our liability">
        <p>
          We act as a booking agent between you and airlines, hotels, visa authorities and other travel
          suppliers. We are not liable for delays, cancellations, schedule changes, denied boarding, denied
          visas, strikes, weather, natural events or other circumstances beyond our reasonable control. Where
          a supplier is at fault, our assistance is limited to helping you pursue the remedy that supplier
          offers (rebooking, refund, compensation as applicable).
        </p>
      </LegalSection>

      <LegalSection title="6. Changes to these terms">
        <p>
          We may update these terms from time to time to reflect changes in our services, the law, or our
          payment provider's requirements. The "Last updated" date above shows when this page last changed.
          Continuing to use the site or book with us after an update means you accept the revised terms.
        </p>
      </LegalSection>

      <LegalSection title="7. Governing law">
        <p>
          These terms are governed by the laws of India. Any dispute will be subject to the exclusive
          jurisdiction of the courts in Bengaluru, Karnataka.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact us">
        <p>
          For any question about these terms, write to us at{' '}
          <a href={`mailto:${BIZ.email2}`} className="font-semibold text-brand-500 hover:underline">{BIZ.email2}</a>{' '}
          or call {BIZ.phoneDisplay}.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
