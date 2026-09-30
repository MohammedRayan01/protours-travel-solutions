/* Build-time only: renders a route to static HTML for scripts/prerender.mjs.
   `prerenderToNodeStream` waits for every lazy() route chunk to resolve, so
   the output contains the page's real content, not the loading fallback. */
import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'

export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  )
  let html = ''
  for await (const chunk of prelude) html += chunk
  return html
}

export { ROUTES, NOT_FOUND, SITE, OG_IMAGE, metaFor, canonicalFor, jsonLdFor } from './seo.js'
