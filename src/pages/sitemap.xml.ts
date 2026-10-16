import { site } from '@/site'

// ponytail: a handful of indexable pages, so no sitemap integration. Add @astrojs/sitemap when there are more.
// No lastmod: a build date changes every deploy and Google learns to ignore it.
const pages = ['/', '/work', '/cv', '/privacy']

export const GET = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${site.url}${p}</loc></url>`).join('\n')}
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml' } },
  )
