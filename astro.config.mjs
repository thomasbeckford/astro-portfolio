// @ts-check
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  site: 'https://tebeck.vercel.com',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
})
