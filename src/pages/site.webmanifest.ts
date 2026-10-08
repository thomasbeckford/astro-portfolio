import { site } from '@/site'

export const GET = () =>
  Response.json({
    name: `${site.name} — ${site.role}`,
    short_name: site.name,
    start_url: '/',
    display: 'standalone',
    background_color: '#eceef4',
    theme_color: '#eceef4',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  })
