# Pro Tours & Travel Solutions — Website

Premium travel agency website built on a modern React stack.

## Stack

| Layer | Choice |
|---|---|
| Build | **Vite 7** |
| UI | **React 19** |
| Routing | **React Router 7** |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` config) |
| Type | **Cabinet Grotesk** (Fontshare) + **Cormorant Garamond** (Google) |
| Scroll animation | **GSAP 3.15** + **ScrollTrigger** + **SplitText** |
| Smooth scroll | **Lenis 1.3** |
| UI animation | **Framer Motion 12** |
| Icons | **Lucide React** |

### How the two animation libraries divide up

They are not redundant — each does what it is best at:

- **GSAP + ScrollTrigger + Lenis** own everything tied to scroll position: reveals,
  parallax, split-text headlines, counters, the progress bar, the hero timeline.
- **Framer Motion** stays for discrete UI state: page transitions, the mobile drawer,
  the accordion, the package-grid layout shuffle.

Lenis is driven by GSAP's ticker (`gsap.ticker.add`) and pushes every frame into
`ScrollTrigger.update()`, so scroll position and tween playheads advance on the same
frame. That single detail is what stops scrubbed and pinned sections from juddering.
`lagSmoothing(0)` is set so a dropped frame does not desync them.

## Typography

Matched to the reference site the client shared (sanjutoursandtravels.in), which
pairs a geometric grotesk with an editorial serif:

| Token | Face | Used for |
|---|---|---|
| `--font-sans` / `--font-display` | **Cabinet Grotesk** 300–900 | Everything: body, headings, UI, buttons |
| `--font-accent` | **Cormorant Garamond** 600/700 + italics | Emphasis phrases and pull-quotes only |

Body carries `letter-spacing: -0.01em` and headings `-0.025em`, matching the
reference's tighter setting.

Two helper classes in `src/index.css`:

- **`.accent`** — the serif *italic*, sized up 1.12em because Cormorant runs small
  beside a grotesk at the same px. Used for the gold phrase in the hero headline
  ("all your travel needs") and on the Umrah page.
- **`.quote`** — the same serif upright at 1.18rem, for review pull-quotes. Upright
  rather than italic because a full paragraph of italic serif is tiring to read.

Cabinet Grotesk loads from `api.fontshare.com`, Cormorant from Google Fonts; both
are preconnected in `index.html`.

## Run it

```bash
cd "C:\Users\Mohammed Rayhan\protours-app"
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Page order (as specified)

Navigation: **Home · Services · Packages · Hajj & Umrah · Visa & Passport · Contact · About**
— About sits last, after Contact.

Homepage section order:

1. **Hero** — full-bleed rotating photography, fully submerged under gradient, glassmorphism panels
2. **Quick enquiry** — glass card overlapping the hero
3. **Services** — all 8; Flight Booking and Hotel Booking lead as large image cards
4. **Destinations**
5. **Featured packages**
6. **Google-verified reviews**
7. **Stats — 16+ years**
8. **Who we are** — the Bengaluru travel desk block, last
9. FAQ → CTA

The old "IATA-standard / 24×7 support / transparent pricing" row has been removed.

## Editing content

Everything lives in two data files — no need to touch components:

- **`src/data/site.js`** — business details (`BIZ`), navigation (`NAV`), hero slides, the 8 services,
  destinations, all packages with their Economy/Deluxe/Premium tiers, reviews, stats, FAQs.
- **`src/data/visas.js`** — the full visa reference (100+ countries, 9 regions).

Change the phone number once in `BIZ` and it updates the top bar, mobile drawer, footer, floating
buttons and every WhatsApp deep link across the site.

## Key features

- **Glassmorphism** throughout — `glass`, `glass-strong`, `glass-light` utilities in `src/index.css`
- **Umrah page** sits fully submerged in Makkah/Madinah imagery with a fixed background layer;
  all content floats in glass
- **Packages** — Economy / Deluxe / Premium tier selector; every card re-prices live. Plus category filters
- **Visa page** — searchable, filterable database of 100+ countries by region and entry type
- **Three-line animated hamburger** → full-height slide-in drawer on mobile
- **Floating actions** — WhatsApp (with pulse halo), **Instagram**, Call, and back-to-top
- **Larger type** — root font size raised to 17px with a fluid `clamp()` scale
- **Lenis inertial smooth scrolling**, synced to GSAP's ticker and ScrollTrigger
- **Scroll progress bar**, **magnetic buttons**, **pointer-tilt cards**, **parallax** headers
- **SplitText** headline reveals — words rise out of masked lines
- Route-level **code splitting**, `prefers-reduced-motion` support, semantic HTML and ARIA labels

## Animation building blocks

All in `src/components/motion.jsx`, all ScrollTrigger-backed:

| Component | What it does |
|---|---|
| `<Reveal>` | Fade-and-rise as it enters view. Used site-wide. |
| `<Stagger>` | One trigger animates a container's children in sequence. |
| `<SplitHeading>` | SplitText word reveal out of a masked line. |
| `<Parallax speed>` | Scrubbed layer drift. |
| `<Magnetic>` | Button leans toward the cursor, springs back. |
| `<TiltCard>` | Subtle 3D tilt toward the pointer. |
| `<CountUp>` | Number animation on scroll. |
| `<PinnedPanels>` | Pin + horizontal scrub (desktop only). |
| `<ScrollProgress>` | Reading-progress bar. |

Every one degrades to a static, fully-visible state under `prefers-reduced-motion`.

## Forms

Forms have no backend. On submit the fields serialise into a formatted message and open WhatsApp
pre-filled, so enquiries land directly in the owner's chat. To move to a server later, replace the
`submit` handler in `src/components/EnquiryForm.jsx` with a `fetch()`.

## Note on this machine's setup

Windows Application Control blocks Rollup's native binary (`@rollup/rollup-win32-x64-msvc`), which
made both `vite dev` and `vite build` fail. `package.json` therefore contains:

```json
"overrides": { "rollup": "npm:@rollup/wasm-node@^4.52.4" }
```

This swaps in Rollup's official WebAssembly build — same output, no native binary. On a machine
without that policy you can remove the override and reinstall.

## Before going live

1. **Photos** are Unsplash stock — replace with the client's own photography.
2. **Logo** — the globe mark is a placeholder; drop in the real logo file.
3. **Prices** — Economy/Deluxe/Premium figures are realistic placeholders; confirm with the client.
4. **Stats** — "Since 2009", "16+ years", "10,000+ travellers" and the 98% visa success rate are
   inferred. The 4.5★ Google rating is real. Verify the rest before publishing.
5. **Visa data** — indicative and hand-maintained; review before it is relied on publicly.
6. **Deploy** — `npm run build` then upload `dist/`. Add a SPA rewrite rule (all routes → `index.html`).
