/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#0A0A0A',
        secondary: '#2C2C2C',
        accent: '#00B8D9',
        neutral: '#A6A6A6',
        darkBlue: '#1E2A47',
        lightGray: '#A6A6A6',
        cyan: '#00B8D9',
      },
    },
  },
  plugins: [],
}
