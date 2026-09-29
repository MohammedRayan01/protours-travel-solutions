import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Runs the /api/*.js serverless functions inside the Vite dev server, so
 * `npm run dev` behaves like Vercel without needing the Vercel CLI.
 * Production builds are untouched — this only patches configureServer.
 */
function razorpayDevApi() {
  const mount = (server, route, file) => {
    server.middlewares.use(route, async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        return res.end('Method not allowed')
      }
      let raw = ''
      req.on('data', (c) => { raw += c })
      req.on('end', async () => {
        try {
          req.body = raw ? JSON.parse(raw) : {}
          res.status = (code) => { res.statusCode = code; return res }
          res.json = (obj) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(obj))
          }
          const mod = await server.ssrLoadModule(file)
          await mod.default(req, res)
        } catch (e) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Dev API error: ' + e.message }))
        }
      })
    })
  }

  return {
    name: 'razorpay-dev-api',
    configureServer(server) {
      mount(server, '/api/create-order', '/api/create-order.js')
      mount(server, '/api/verify-payment', '/api/verify-payment.js')
    },
  }
}

export default defineConfig(({ mode }) => {
  // Vite only auto-injects VITE_-prefixed vars into client code; loadEnv with
  // an empty prefix pulls in RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET from
  // .env.local too, so the dev API middleware above can read them.
  const env = loadEnv(mode, process.cwd(), '')
  if (!process.env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_ID) process.env.RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID
  if (!process.env.RAZORPAY_KEY_SECRET && env.RAZORPAY_KEY_SECRET) process.env.RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET

  return {
    plugins: [react(), tailwindcss(), razorpayDevApi()],
    server: { port: 5173, open: true },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          // Keep the big, rarely-changing libraries in their own cacheable chunks.
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
            gsap: ['gsap', '@gsap/react'],
            icons: ['lucide-react'],
          },
        },
      },
    },
  }
})
