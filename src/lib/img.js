/**
 * Responsive image props for Unsplash URLs.
 *
 *   <img {...photo(url, { sizes: '(min-width: 1024px) 50vw, 100vw' })} alt="…" />
 *
 * Unsplash resizes on the fly from its `w` query param, so we can hand the
 * browser a srcset and let it download only the width the layout needs —
 * a phone no longer pulls the 1800px desktop hero. `auto=format` already
 * serves AVIF/WebP where supported. Non-Unsplash URLs (e.g. the owner's own
 * photos in /public/photos) pass through untouched.
 */
const DEFAULT_WIDTHS = [480, 768, 1080, 1440, 1920]

export function photo(url, { widths = DEFAULT_WIDTHS, sizes = '100vw', quality } = {}) {
  if (!url || !/images\.unsplash\.com/.test(url)) return { src: url, sizes }
  const at = (w) => {
    const u = new URL(url)
    u.searchParams.set('w', String(w))
    u.searchParams.set('auto', 'format')
    u.searchParams.set('fit', 'crop')
    if (quality) u.searchParams.set('q', String(quality))
    return u.toString()
  }
  const mid = widths[Math.min(2, widths.length - 1)]
  return {
    src: at(mid),
    srcSet: widths.map((w) => `${at(w)} ${w}w`).join(', '),
    sizes,
  }
}
