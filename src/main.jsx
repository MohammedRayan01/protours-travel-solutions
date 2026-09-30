import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const container = document.getElementById('root')

// Pre-rendered pages (scripts/prerender.mjs) ship real HTML inside #root for
// crawlers. The client app renders fresh over it rather than hydrating: the
// animation layer sets its own start states on mount, so a clean render is
// simpler and can't produce hydration mismatches.
createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Reveal once the live app has painted (see the data-ssr rule in index.html).
requestAnimationFrame(() => requestAnimationFrame(() => container.removeAttribute('data-ssr')))
