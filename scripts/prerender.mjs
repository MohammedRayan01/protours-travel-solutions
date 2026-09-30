/* ============================================================
   Pre-render every route to static HTML after `vite build`.

   Why: the site is a React SPA. Google renders JavaScript, but most
   AI/answer engines (ChatGPT, Perplexity, Claude…), link-preview bots
   (WhatsApp, Facebook, LinkedIn) and many other crawlers read only the
   raw HTML — for them every page was an empty <div id="root">. This
   writes one HTML file per route with the page's real content and its
   own <title>, description, canonical, Open Graph and JSON-LD, plus a
   real 404.html and a fresh sitemap.xml.

   The browser still boots the normal client app on top (main.jsx).
   ============================================================ */
import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, ROUTES, NOT_FOUND, SITE, OG_IMAGE, metaFor, canonicalFor, jsonLdFor } =
  await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

const template = await readFile(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<!--seo:start-->') || !template.includes('<div id="root"></div>')) {
  throw new Error('index.html is missing the <!--seo:start--> markers or the empty #root — cannot pre-render.')
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function headFor(p, { notFound = false } = {}) {
  const [title, desc] = notFound ? NOT_FOUND : metaFor(p)
  const url = canonicalFor(notFound ? '/' : p)
  const ld = JSON.stringify(jsonLdFor(notFound ? '/404' : p)).replace(/</g, '\\u003c')
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<meta name="robots" content="${notFound ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}" />`,
    notFound ? '' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Pro Tours &amp; Travel Solutions" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Pro Tours &amp; Travel Solutions, travel agency in Bengaluru" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    `<script type="application/ld+json">${ld}</script>`,
  ].filter(Boolean).join('\n    ')
}

function page(p, body, opts) {
  return template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n    ${headFor(p, opts)}\n    <!--seo:end-->`)
    .replace('<div id="root"></div>', `<div id="root" data-ssr>${body}</div>`)
}

const outFile = (p) => (p === '/' ? 'index.html' : `${p.slice(1)}.html`)

const done = []
for (const p of Object.keys(ROUTES)) {
  const body = await render(p)
  if (body.length < 2000) throw new Error(`Pre-render of ${p} produced suspiciously little HTML (${body.length} bytes).`)
  await writeFile(path.join(dist, outFile(p)), page(p, body), 'utf8')
  done.push(`${p} (${Math.round(body.length / 1024)} KB)`)
}

// A real 404: Vercel serves dist/404.html with a 404 status for unknown URLs.
await writeFile(path.join(dist, '404.html'), page('/404', await render('/__not-found__'), { notFound: true }), 'utf8')

// Sitemap generated from the same route list, so it can never miss a page.
const today = new Date().toISOString().slice(0, 10)
const priority = (p) => (p === '/' ? '1.0' : ['/terms', '/privacy', '/refund-policy', '/disclaimer'].includes(p) ? '0.3' : '0.8')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(ROUTES).map((p) => `  <url><loc>${canonicalFor(p)}</loc><lastmod>${today}</lastmod><priority>${priority(p)}</priority></url>`).join('\n')}
</urlset>
`
await writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8')

await rm(ssrDir, { recursive: true, force: true })
console.log(`Pre-rendered ${done.length} routes + 404 for ${SITE}:\n  ${done.join('\n  ')}`)
