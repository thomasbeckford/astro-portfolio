// Full example sites (/templates/<slug>): made-up businesses, each with its own look, built from the section kit in
// components/kit. `sections` picks which kit sections the demo shows and in what order. Media is free stock
// (src/assets/templates/CREDITS.md): photos in src/assets/templates/<slug>/1..4.jpg, video in public/templates/<slug>/.
// Nothing here is a claim about a real business: no reviews, ratings or stats. Numbers sit in Ofcom's drama range.
export type Section = 'marquee' | 'intro' | 'services' | 'band' | 'gallery' | 'collage' | 'projects' | 'steps' | 'areas' | 'contact'
type Item = { title: string; text: string }
export interface Demo {
  slug: string
  trade: string
  name: string
  mark: string // the giant wordmark
  tel: string
  look: string[] // tags on the gallery card
  font: 'archivo' | 'anton' | 'geist'
  colors: { bg: string; fg: string; muted: string; accent: string; onAccent: string; panel: string; alt: string }
  hero: { variant: 'wordmark' | 'scale' | 'letters' | 'poster'; kicker: string; head?: string; lede: string; cta: string }
  marquee?: string[]
  intro: { label: string; text: string }
  gallery?: string[] // captions for photos 1..4
  collage?: string // headline among floating photos 1..5
  projects?: { title: string; kind: string }[] // full-screen panels over photos 6..8
  services: { variant: 'stack' | 'rows'; label: string; items: Item[] }
  band: string
  steps: Item[]
  areas: string[]
  contact: string
  sections: Section[]
}

export const demos: Demo[] = [
  {
    slug: 'electrician',
    trade: 'Electrician',
    name: 'Bright Spark Electrical',
    mark: 'Bright Spark',
    tel: '07700 900413',
    look: ['Bold', 'Video', 'High energy'],
    font: 'archivo',
    colors: { bg: '#0b0b0c', fg: '#f5f3ea', muted: '#a3a39b', accent: '#ffe14d', onAccent: '#0b0b0c', panel: '#17171a', alt: '#ff5a1f' },
    hero: { variant: 'wordmark', kicker: 'Part P registered · Bromley', lede: 'Rewires, fuse boards and EV chargers across Bromley. On time, fixed price, left tidy.', cta: 'Get a quote' },
    marquee: ['EV chargers', 'Fuse boards', 'Full rewires', 'Lighting', 'EICR certificates', 'Smoke alarms'],
    intro: { label: 'Who we are', text: 'A local electrician who answers the phone, gives you a fixed price before starting and tests everything before leaving.' },
    services: {
      variant: 'stack',
      label: 'What we do',
      items: [
        { title: 'EV chargers', text: 'A charger on your drive, installed and registered, with the paperwork for your grant.' },
        { title: 'Fuse boards', text: 'Old fuse box swapped for a modern consumer unit that trips before anything gets hurt.' },
        { title: 'Rewires', text: 'Full or partial rewires, planned room by room so you can keep living in the house.' },
        { title: 'EICR reports', text: 'Landlord and homebuyer safety checks, written up the same week.' },
      ],
    },
    band: 'Safe. Certified. Tidy.',
    steps: [
      { title: 'Tell us the job', text: 'Call or send a photo. We reply the same day.' },
      { title: 'Fixed price', text: 'You get the price in writing before we start.' },
      { title: 'Done and certified', text: 'Tested, certificate emailed, mess taken away.' },
    ],
    areas: ['Bromley', 'Beckenham', 'Orpington', 'Chislehurst', 'West Wickham', 'Hayes'],
    contact: 'Got a job?',
    sections: ['marquee', 'intro', 'services', 'band', 'steps', 'areas', 'contact'],
  },
  {
    slug: 'plumber',
    trade: 'Plumber',
    name: 'Dave’s Plumbing',
    mark: 'Dave’s',
    tel: '07700 900412',
    look: ['Clean', 'Calm', 'Card stack'],
    font: 'geist',
    colors: { bg: '#f4f6fb', fg: '#0d1b3e', muted: '#55607a', accent: '#1d4ed8', onAccent: '#ffffff', panel: '#ffffff', alt: '#22d3ee' },
    hero: { variant: 'scale', kicker: 'Gas Safe registered · Bromley', head: 'Leak? Boiler down? We’re on our way.', lede: 'Emergency call-outs, boilers and bathrooms across Bromley. Price agreed before we start.', cta: 'Get a fixed price' },
    intro: { label: 'How we work', text: 'We tell you the price on the phone, turn up when we said we would, and leave the place cleaner than we found it.' },
    services: {
      variant: 'stack',
      label: 'Services',
      items: [
        { title: 'Emergency call-outs', text: 'Burst pipe or no hot water? Day or night, seven days a week.' },
        { title: 'Boilers', text: 'Repairs, yearly services and new boilers fitted, with the warranty registered for you.' },
        { title: 'Bathrooms', text: 'From a new tap to the whole room, planned with you and finished on the date we agreed.' },
        { title: 'Leaks and blockages', text: 'Found, fixed and explained, so it doesn’t come back.' },
      ],
    },
    band: 'Water where it should be.',
    steps: [
      { title: 'Call or message', text: 'Tell us what’s wrong. A photo helps.' },
      { title: 'Price agreed', text: 'Before we pick up a spanner.' },
      { title: 'Fixed, tidied', text: 'We test it with you and clean up.' },
    ],
    areas: ['Bromley', 'Beckenham', 'Penge', 'Sydenham', 'Catford', 'Eltham'],
    contact: 'Need a plumber today?',
    sections: ['intro', 'services', 'band', 'steps', 'areas', 'contact'],
  },
  {
    slug: 'roofer',
    trade: 'Roofer',
    name: 'Kestrel Roofing',
    mark: 'Kestrel',
    tel: '07700 900414',
    look: ['Dark', 'Dramatic', 'Big type'],
    font: 'anton',
    colors: { bg: '#0e0f11', fg: '#ecebe7', muted: '#8d8f94', accent: '#ff5d4d', onAccent: '#0e0f11', panel: '#1a1c1f', alt: '#ecebe7' },
    hero: { variant: 'letters', kicker: 'Roofing · Bromley and Kent', lede: 'Repairs, re-roofs and flat roofs across Bromley, with a written guarantee.', cta: 'Book a free roof check' },
    intro: { label: 'Before you spend a penny', text: 'We get up there, take photos and show you exactly what is wrong. Then you decide.' },
    gallery: ['Slate and tile', 'Flat roofs', 'Chimneys and leadwork', 'Gutters and fascias'],
    services: {
      variant: 'rows',
      label: 'What we fix',
      items: [
        { title: 'Repairs', text: 'Slipped tiles, leaks and storm damage, sorted fast.' },
        { title: 'Re-roofs', text: 'Stripped back and rebuilt, with a written guarantee.' },
        { title: 'Flat roofs', text: 'Rubber and felt roofs for extensions and garages.' },
        { title: 'Leadwork', text: 'Chimney flashing and valleys that stay watertight.' },
      ],
    },
    band: 'Up in all weathers.',
    steps: [
      { title: 'Free roof check', text: 'We come out, look properly, take photos.' },
      { title: 'Written quote', text: 'What needs doing, what can wait, what it costs.' },
      { title: 'Guaranteed', text: 'Work done, guarantee in writing.' },
    ],
    areas: ['Bromley', 'Sevenoaks', 'Orpington', 'Dartford', 'Sidcup', 'Swanley'],
    contact: 'Free roof check',
    sections: ['intro', 'gallery', 'services', 'band', 'steps', 'contact'],
  },
  {
    slug: 'landscaper',
    trade: 'Landscaper',
    name: 'Larkspur Gardens',
    mark: 'Larkspur',
    tel: '07700 900415',
    look: ['Photo-led', 'Collage', 'Fresh'],
    font: 'geist',
    colors: { bg: '#0f1a12', fg: '#f1efe6', muted: '#9aa79b', accent: '#d6ff4a', onAccent: '#0f1a12', panel: '#17241a', alt: '#f1efe6' },
    hero: { variant: 'poster', kicker: 'Garden design and landscaping · Bromley', head: 'From bare plot to finished garden.', lede: 'Patios, lawns and planting for gardens you actually use.', cta: 'Book a garden visit' },
    intro: { label: 'About', text: 'One small team designs, builds and plants every garden, so nothing gets lost between trades.' },
    collage: 'Gardens worth going outside for.',
    projects: [
      { title: 'Formal garden and pond', kind: 'Garden design' },
      { title: 'Lawn and borders', kind: 'Planting' },
      { title: 'Gravel and planters', kind: 'Landscaping' },
    ],
    services: {
      variant: 'rows',
      label: 'What we do',
      items: [
        { title: 'Garden design', text: 'A drawn plan and a planting list before anything gets dug.' },
        { title: 'Patios and paths', text: 'Laid on a proper base so they stay level and drain.' },
        { title: 'Lawns', text: 'New turf, or a tired lawn brought back.' },
        { title: 'Fencing and decking', text: 'Built for the weather, finished neatly.' },
      ],
    },
    band: 'Grown, not just built.',
    steps: [
      { title: 'Garden visit', text: 'We walk the garden with you and listen.' },
      { title: 'Plan and price', text: 'A drawing and a fixed price, in writing.' },
      { title: 'Built and planted', text: 'We build, plant and leave it tidy.' },
    ],
    areas: ['Bromley', 'Beckenham', 'Chislehurst', 'Petts Wood', 'Orpington', 'Keston'],
    contact: 'Let’s plan your garden',
    sections: ['collage', 'projects', 'services', 'band', 'steps', 'areas', 'contact'],
  },
]
