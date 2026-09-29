import crypto from 'node:crypto'

/**
 * Vercel serverless function — verifies the signature Razorpay Checkout
 * hands back after a payment, so a tampered client-side response can't
 * be trusted as proof of payment.
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    return res.status(500).json({ error: 'Payment gateway is not configured yet.' })
  }

  const { orderId, paymentId, signature } = req.body || {}
  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({ error: 'Missing verification fields.' })
  }

  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  const valid =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))

  return res.status(valid ? 200 : 400).json({ valid })
}
