// Media for the example sites: photos through astro:assets (missing ones are simply skipped), videos from public/.
import type { ImageMetadata } from 'astro'
const pics = import.meta.glob<{ default: ImageMetadata }>('/src/assets/templates/*/*.jpg', { eager: true })
export const photos = (slug: string) =>
  Object.entries(pics)
    .filter(([k]) => k.includes(`/templates/${slug}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, m]) => m.default)
export const clip = (slug: string, name: 'hero' | 'band' | 'card') => ({ src: `/templates/${slug}/${name}`, poster: `/templates/${slug}/${name === 'card' ? 'hero' : name}.jpg` })
// Rough glyph width (in em) per display font, to size a one-line wordmark to the viewport width.
const glyph = { archivo: 0.9, anton: 0.47, geist: 0.6 }
export const fit = (text: string, font: keyof typeof glyph, max = 30) => `min(${max}vw, ${(92 / (text.length * glyph[font])).toFixed(2)}vw)`
