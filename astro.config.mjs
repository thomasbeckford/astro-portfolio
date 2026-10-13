// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://tebeck.dev',
  // old portfolio pages — keep shared links working
  redirects: {
    '/about': '/#contact',
    '/projects': '/#sites',
    '/companies': '/cv',
    '/skills': '/cv',
  },
  vite: { plugins: [tailwindcss()] },
})
