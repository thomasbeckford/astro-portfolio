// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://tebeck.vercel.app',
  // old portfolio pages — keep shared links working
  redirects: {
    '/about': '/#about',
    '/projects': '/#work',
    '/companies': '/#about',
    '/skills': '/',
  },
  vite: { plugins: [tailwindcss()] },
})
