// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://tebeck.dev',
  // old portfolio pages — keep shared links working
  redirects: {
    '/about': '/#about',
    '/projects': '/#work',
    '/companies': '/#about',
    '/skills': '/',
  },
  vite: { plugins: [tailwindcss()] },
})
