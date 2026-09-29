/**
 * Vercel serverless function — creates a Razorpay order.
 * The key secret only ever lives here, never in the frontend bundle.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Payment gateway is not configured yet.' })
  }

  const { amount, packageName, tier } = req.body || {}
  const rupees = Number(amount)
  if (!Number.isFinite(rupees) || rupees <= 0) {
    return res.status(400).json({ error: 'Invalid amount.' })
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(rupees * 100), // paise
        currency: 'INR',
        notes: {
          package: packageName || '',
          tier: tier || '',
        },
      }),
    })

    const data = await r.json()
    if (!r.ok) {
      return res.status(r.status).json({ error: data?.error?.description || 'Could not create order.' })
    }

    return res.status(200).json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId,
    })
  } catch {
    return res.status(500).json({ error: 'Payment gateway error. Please try again.' })
  }
}
