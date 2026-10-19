// Full example sites (/templates/<slug>): made-up businesses, each with its own look, built from the section kit in
// components/kit. `sections` picks which kit sections the demo shows and in what order. Media is free stock
// (src/assets/templates/CREDITS.md): photos in src/assets/templates/<slug>/1..4.jpg, video in public/templates/<slug>/.
// Nothing here is a claim about a real business: no reviews, ratings or stats. Numbers sit in Ofcom's drama range.
export type Section = 'marquee' | 'intro' | 'services' | 'band' | 'gallery' | 'collage' | 'projects' | 'faq' | 'steps' | 'areas' | 'contact' | 'tiles' | 'pinned' | 'split' | 'rail' | 'venues' | 'live' | 'tournaments' | 'menu' | 'clubhouse' | 'count' | 'prices'
type Item = { title: string; text: string; points?: string[] } // points: what's included, on the stack cards
export interface Demo {
  slug: string
  trade: string
  name: string
  mark: string // the giant wordmark
  tel: string
  look: string[] // tags on the home's #sites card
  font: 'archivo' | 'anton' | 'geist' | 'oswald' | 'shoulders'
  colors: { bg: string; fg: string; muted: string; accent: string; onAccent: string; panel: string; alt: string }
  hero: { variant: 'wordmark' | 'scale' | 'letters' | 'poster' | 'cover' | 'product' | 'campaign' | 'booking'; kicker: string; head?: string; lede: string; cta: string }
  marquee?: string[]
  intro: { label: string; text: string }
  gallery?: string[] // captions for photos 1..4
  collage?: string // headline among floating photos 1..5
  projects?: { title: string; kind: string }[] // full-screen panels over photos 6..8, or the rail's cards over photos 3..8
  tiles?: Item[] // bento tiles over photos 2..5, under the intro as heading
  split?: Item[] // two half-screen photos 1..2
  venues?: { name: string; city: string; text: string; has: string[]; lat: number; lon: number }[] // a brand with several sites: kit/Venues sorts them by distance from you
  teams?: string[] // made-up team names for the live scores and the cup draw (kit/Live, kit/Tournaments)
  bays?: { name: string; when: string; price: number }[] // price a bay per hour, split per head by kit/Prices
  included?: string[] // what comes with a bay (kit/Prices)
  events?: { title: string; day: number; time: string; text: string }[] // weekly, day 0 = Sunday, UK time (kit/Tournaments)
  menu?: { tab: string; needs?: string; items: { name: string; text: string; price: string; tags?: ('V' | 'VG' | 'GF')[]; only?: string[] }[] }[] // one menu for every venue (kit/Menu): `needs` hides a list where a venue lacks that (its `has`), `only` keeps an item to some venues
  faq?: { q: string; a: string }[] // beside photos 5..7
  services: { variant: 'stack' | 'rows'; label: string; items: Item[] }
  band: string
  steps: Item[]
  areas: string[]
  contact: string
  sections: Section[]
  sentence?: boolean // headings in sentence case instead of the kit's capitals
  page?: 'games' | 'hotel' // a page of its own (components/demos) instead of the kit's hero and sections
  cookies?: true | string // a cookie banner that looks the part and sets nothing (kit/Cookies); a string is its heading
  curtain?: boolean // opening grid of blocks (kit/Curtain); defaults to on with the poster hero only
}

export const demos: Demo[] = [
  {
    slug: 'golf',
    trade: 'Golf bar',
    name: 'Overgrown',
    mark: 'Overgrown',
    tel: '07700 900420',
    look: ['Booking by venue', 'Find your nearest', 'Live scores', 'Price per player', 'Tournaments', 'Menu by venue'],
    font: 'oswald',
    colors: { bg: '#0b1d12', fg: '#eef2e2', muted: '#9fb5a2', accent: '#7ee2a8', onAccent: '#0b1d12', panel: '#12301d', alt: '#eef2e2' },
    hero: { variant: 'booking', kicker: 'Golf simulators · Jungle bar · Kitchen', head: 'Into the rough', lede: 'Simulator bays hidden in a jungle of real plants, with a kitchen and a long bar. No clubs, no experience and no dress code needed.', cta: 'Find a bay' },
    intro: { label: 'Live from the bays', text: 'Every bay keeps score on screen, and the scores land here as they’re played.' },
    teams: ['The Mulligans', 'Bunker Mentality', 'Tee Party', 'Sand Trappers', 'Birdie Brains', 'The Back Nine', 'Rough Diamonds', 'Grip It and Sip It', 'Lost Balls', 'Chip Happens', 'Par for the Course', 'The Fairway Fiends', 'Tee Total', 'Putt Pirates', 'Wedge Issue', 'Slice Squad'],
    bays: [
      { name: 'Off-peak', when: 'Mon to Fri, before 5pm', price: 30 },
      { name: 'Peak', when: 'Evenings and weekends', price: 48 },
      { name: 'Late', when: 'Fri and Sat, after 10pm', price: 40 },
    ],
    included: ['Clubs, balls and gloves', 'A host to show you how', 'Food and drinks to your bay', 'Left-handed clubs too'],
    events: [
      { title: 'Thursday scramble', day: 4, time: '19:00', text: 'Teams of four, nine holes, best ball counts. Food’s included.' },
      { title: 'Closest to the pin', day: 5, time: '21:00', text: 'One shot each on a par 3. The nearest the flag wins a round for the table.' },
      { title: 'Sunday long drive', day: 0, time: '15:00', text: 'Three swings each. The longest carry goes on the board for the month.' },
      { title: 'League night', day: 2, time: '19:30', text: 'Teams of four, ten weeks, one cup. The final is played at Merchant City.' },
    ],
    menu: [
      { tab: 'Food', needs: 'Kitchen', items: [
        { name: 'Smash burger', text: 'Two patties, American cheese, pickles and house sauce.', price: '13.50' },
        { name: 'Halloumi burger', text: 'Grilled halloumi, hot honey, slaw.', price: '12.00', tags: ['V'] },
        { name: 'Jackfruit tacos', text: 'Three tacos, pineapple salsa, lime.', price: '10.50', tags: ['VG'] },
        { name: 'Jerk wings', text: 'Ten wings, charred, with a scotch bonnet dip.', price: '9.50', tags: ['GF'] },
        { name: 'Loaded fries', text: 'Cheese sauce, crispy onions, jalapeños.', price: '7.00', tags: ['V'] },
        { name: 'Sharing board', text: 'Wings, sliders, fries and dips for four.', price: '32.00', only: ['Shoreditch', 'Northern Quarter', 'Merchant City'] },
      ] },
      { tab: 'Cocktails', items: [
        { name: 'Rough rum punch', text: 'Two rums, pineapple, lime and allspice.', price: '11.00', tags: ['VG', 'GF'] },
        { name: 'Monstera mule', text: 'Vodka, ginger beer, lime and mint.', price: '10.50', tags: ['VG', 'GF'] },
        { name: 'Back nine negroni', text: 'Gin, bitter and sweet vermouth, orange.', price: '11.00', tags: ['VG', 'GF'] },
        { name: 'Mango spritz', text: 'Mango, prosecco and soda. In the garden, summer only.', price: '10.00', tags: ['VG', 'GF'], only: ['Clapham'] },
        { name: 'Clubhouse old fashioned', text: 'Bourbon, demerara and bitters, stirred.', price: '12.00', tags: ['VG', 'GF'] },
      ] },
      { tab: 'Beer', items: [
        { name: 'House lager', text: 'Crisp and cold, by the pint.', price: '6.20', tags: ['VG'] },
        { name: 'Pale ale', text: 'Citrus and pine, from a brewery down the road. Different at every venue.', price: '6.50', tags: ['VG'] },
        { name: 'IPA', text: 'Hazy, tropical, 6.2%.', price: '6.80', tags: ['VG'] },
        { name: 'Stout', text: 'Coffee and chocolate, on nitro.', price: '6.40' },
        { name: 'Apple cider', text: 'Dry and cloudy.', price: '6.00', tags: ['VG', 'GF'] },
      ] },
      { tab: 'No and low', items: [
        { name: 'Virgin punch', text: 'Pineapple, lime, allspice and soda.', price: '6.00', tags: ['VG', 'GF'] },
        { name: 'Alcohol-free lager', text: '0.0%, by the bottle.', price: '5.00', tags: ['VG'] },
        { name: 'Zero G&T', text: 'Alcohol-free gin, tonic and cucumber.', price: '7.00', tags: ['VG', 'GF'] },
        { name: 'Homemade lemonade', text: 'Lemon, mint and a little sugar.', price: '4.00', tags: ['VG', 'GF'] },
      ] },
    ],
    venues: [
      { name: 'Shoreditch', city: 'London', text: 'Two floors of bays under the railway arches.', has: ['Bays', 'Kitchen', 'Bar', 'Private room'], lat: 51.5265, lon: -0.0786 },
      { name: 'Clapham', city: 'London', text: 'Bays, a long bar and a garden for summer.', has: ['Bays', 'Kitchen', 'Bar', 'Garden'], lat: 51.4622, lon: -0.1383 },
      { name: 'Northern Quarter', city: 'Manchester', text: 'An old textile warehouse, now full of bays.', has: ['Bays', 'Kitchen', 'Bar', 'Private room'], lat: 53.4838, lon: -2.236 },
      { name: 'Call Lane', city: 'Leeds', text: 'Bays upstairs, bar downstairs, open till late.', has: ['Bays', 'Bar'], lat: 53.7951, lon: -1.5404 },
      { name: 'Harbourside', city: 'Bristol', text: 'Bays looking out over the water.', has: ['Bays', 'Kitchen', 'Bar'], lat: 51.4497, lon: -2.601 },
      { name: 'Merchant City', city: 'Glasgow', text: 'Our biggest room, with a stage for the league final.', has: ['Bays', 'Kitchen', 'Bar', 'Private room'], lat: 55.859, lon: -4.2449 },
    ],
    services: { variant: 'rows', label: 'Parties', items: [] },
    band: 'Bad swings welcome',
    steps: [],
    areas: ['London', 'Manchester', 'Leeds', 'Bristol', 'Glasgow'],
    contact: 'Bring the team',
    sections: ['live', 'band', 'prices', 'count', 'tournaments', 'menu', 'venues', 'clubhouse'],
    cookies: true,
  },
  {
    slug: 'hotel',
    trade: 'Hotel group',
    name: 'Latchkey Hotels',
    mark: 'Latchkey',
    tel: '07700 900421',
    look: ['Price calendar', 'Map of hotels', 'Room plans', 'Door code by text', 'Light'],
    font: 'geist',
    colors: { bg: '#eef0ec', fg: '#16201c', muted: '#56615b', accent: '#2147c9', onAccent: '#ffffff', panel: '#e1e5df', alt: '#16201c' },
    hero: { variant: 'booking', kicker: 'Small hotels in seven cities', head: 'Wake up somewhere new', lede: 'Each one in an old building that used to be something else, in the part of town you’d want to walk around. Breakfast is on us.', cta: 'Find a room' },
    intro: { label: 'A key, not a lobby', text: 'No queue at a desk. Your door code comes by text the morning you arrive, and someone’s always downstairs if you want them.' },
    venues: [
      { name: 'Bloomsbury', city: 'London', text: 'A row of Georgian townhouses, knocked through.', has: ['Garden', 'Bar'], lat: 51.5226, lon: -0.125 },
      { name: 'Old Town', city: 'Edinburgh', text: 'A printworks off the Royal Mile.', has: ['Bar', 'Reading room'], lat: 55.9496, lon: -3.191 },
      { name: 'Jordaan', city: 'Amsterdam', text: 'Three canal houses side by side.', has: ['Bikes', 'Canal view'], lat: 52.3756, lon: 4.8833 },
      { name: 'Vesterbro', city: 'Copenhagen', text: 'A meatpacking hall, now rooms and a bakery.', has: ['Bakery', 'Bikes', 'Sauna'], lat: 55.6698, lon: 12.548 },
      { name: 'Le Marais', city: 'Paris', text: 'A hat maker’s workshop round a courtyard.', has: ['Courtyard', 'Bar'], lat: 48.859, lon: 2.362 },
      { name: 'Gràcia', city: 'Barcelona', text: 'An old cinema, with a pool on the roof.', has: ['Roof pool', 'Bar'], lat: 41.4036, lon: 2.1567 },
      { name: 'Alfama', city: 'Lisbon', text: 'A tiled merchant’s house above the river.', has: ['Roof terrace', 'River view'], lat: 38.7114, lon: -9.13 },
    ],
    services: { variant: 'rows', label: 'Rooms', items: [{ title: 'Snug', text: '' }, { title: 'Classic', text: '' }, { title: 'Corner suite', text: '' }] },
    band: 'Stay another night',
    steps: [],
    areas: ['London', 'Edinburgh', 'Amsterdam', 'Copenhagen', 'Paris', 'Barcelona', 'Lisbon'],
    contact: 'Bring everyone',
    sections: [],
    page: 'hotel',
    cookies: 'Cookies before you check in?',
  },
  {
    slug: 'games',
    trade: 'Games bar',
    name: 'Double Out Games Club',
    mark: 'Double Out',
    tel: '07700 900422',
    look: ['Dartboard you can throw at', 'Game picker', 'Oche availability', 'Party builder', 'Dark'],
    font: 'shoulders',
    colors: { bg: '#0f1115', fg: '#f3f1ea', muted: '#9b9ea6', accent: '#ff5a36', onAccent: '#0f1115', panel: '#181b21', alt: '#f3f1ea' },
    hero: { variant: 'booking', kicker: 'Darts · Shuffleboard · Ping pong · Karaoke', head: 'Step up to the oche', lede: 'Darts that keep the score for you, more games under one roof, a kitchen and a long bar. Come with friends, leave with a rivalry.', cta: 'Book an oche' },
    intro: { label: 'Pick your game', text: 'Seven ways to settle it, from a straight 501 to a karaoke booth.' },
    venues: [
      { name: 'Borough', city: 'London', text: 'Under the railway, two minutes from the market.', has: ['Shuffleboard', 'Karaoke'], lat: 51.5035, lon: -0.0911 },
      { name: 'Camden', city: 'London', text: 'An old piano factory by the canal.', has: ['Ping pong'], lat: 51.539, lon: -0.1426 },
      { name: 'Deansgate', city: 'Manchester', text: 'Our biggest, with a stage for league finals.', has: ['Shuffleboard', 'Karaoke'], lat: 53.4794, lon: -2.249 },
      { name: 'Digbeth', city: 'Birmingham', text: 'A custard factory’s old boiler room.', has: ['Ping pong', 'Karaoke'], lat: 52.4751, lon: -1.8826 },
      { name: 'Ropewalks', city: 'Liverpool', text: 'Three floors of a warehouse, games on every one.', has: ['Shuffleboard', 'Ping pong'], lat: 53.401, lon: -2.98 },
      { name: 'Quayside', city: 'Newcastle', text: 'On the river, under the bridges.', has: ['Shuffleboard'], lat: 54.969, lon: -1.606 },
    ],
    services: { variant: 'rows', label: 'Games', items: [{ title: '501', text: '' }, { title: 'Killer', text: '' }, { title: 'Shanghai', text: '' }] },
    band: 'Treble or nothing',
    steps: [],
    areas: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Newcastle'],
    contact: 'Bring the office',
    sections: [],
    page: 'games',
    cookies: 'Cookies before the first leg?',
  },
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
        { title: 'EV chargers', text: 'A charger on your drive, installed and registered, with the paperwork for your grant.', points: ['Survey before the quote', 'Smart charger with app control', 'Grant paperwork done for you'] },
        { title: 'Fuse boards', text: 'Old fuse box swapped for a modern consumer unit that trips before anything gets hurt.', points: ['RCD protection on every circuit', 'Usually done in a day', 'Certificate emailed the same week'] },
        { title: 'Rewires', text: 'Full or partial rewires, planned room by room so you can keep living in the house.', points: ['No need to move out', 'Walls patched, ready for paint', 'Tested and certified at the end'] },
        { title: 'EICR reports', text: 'Landlord and homebuyer safety checks, written up the same week.', points: ['Landlords and homebuyers', 'Report in plain English', 'Clear list of what needs fixing'] },
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
  {
    slug: 'decorator',
    trade: 'Decorator',
    name: 'Two Coats Decorating',
    mark: 'Two Coats',
    tel: '07700 900416',
    look: ['Bright', 'Playful', 'Questions'],
    font: 'geist',
    colors: { bg: '#fde871', fg: '#141414', muted: '#4d4729', accent: '#b8360a', onAccent: '#fde871', panel: '#fff6c4', alt: '#ff5a1f' },
    hero: { variant: 'scale', kicker: 'Painter and decorator · Bromley', head: 'Fresh walls, without the mess.', lede: 'Painting, wallpapering and woodwork across Bromley. Furniture covered, lines sharp, floors spotless.', cta: 'Get a quote' },
    marquee: ['Interiors', 'Exteriors', 'Wallpaper', 'Woodwork', 'Colour advice', 'Two coats, always'],
    intro: { label: 'How we work', text: 'We move the furniture, cover the floors and fill every crack before a drop of paint goes on. Then two full coats, every time.' },
    faq: [
      { q: 'Do I need to move the furniture?', a: 'No. We move it, cover it and put it back where it was.' },
      { q: 'How long does a room take?', a: 'Most rooms take one or two days, prep included. You get the dates before we start.' },
      { q: 'Do you supply the paint?', a: 'We can, or we use yours. Either way the price is agreed up front.' },
      { q: 'What about the mess?', a: 'Floors covered, dust sheets down, and we hoover before we leave.' },
      { q: 'Can we stay in the house?', a: 'Yes. We do one room at a time so the rest of the house stays usable.' },
    ],
    services: {
      variant: 'stack',
      label: 'What we do',
      items: [
        { title: 'Painting', text: 'Walls, ceilings and woodwork, prepped properly and finished in two coats.', points: ['Furniture moved and covered', 'Cracks filled and sanded', 'Two full coats as standard'] },
        { title: 'Wallpaper', text: 'Lining paper to bold patterns, hung straight and matched at every seam.', points: ['Old paper stripped', 'Walls lined where needed', 'Patterns matched at the seams'] },
        { title: 'Prep and woodwork', text: 'Skirting, doors and frames sanded, filled and finished in gloss or satin.', points: ['Sanded and filled', 'Sharp lines, no bleed', 'Low-odour paint on request'] },
        { title: 'Colour advice', text: 'Not sure on the colour? We bring samples and paint test patches on your walls.', points: ['Samples on your own walls', 'Seen in daylight and lamplight', 'Included with every job'] },
      ],
    },
    band: 'Two coats. No shortcuts.',
    steps: [
      { title: 'Send photos', text: 'Tell us the rooms. We reply the same day.' },
      { title: 'Fixed price', text: 'A written quote with the paint and the dates.' },
      { title: 'Painted, tidied', text: 'Two coats, furniture back, floors hoovered.' },
    ],
    areas: ['Bromley', 'Beckenham', 'Shortlands', 'Hayes', 'Bickley', 'Petts Wood'],
    contact: 'Let’s get painting',
    sections: ['marquee', 'intro', 'services', 'band', 'faq', 'steps', 'areas', 'contact'],
  },
  {
    slug: 'joiner',
    trade: 'Joiner',
    name: 'Hewn Joinery',
    mark: 'Hewn',
    tel: '07700 900417',
    look: ['Moody', 'Cinematic', 'Big type'],
    font: 'archivo',
    colors: { bg: '#0d0f0e', fg: '#f2ede4', muted: '#9c978d', accent: '#ff6a1a', onAccent: '#0d0f0e', panel: '#171a19', alt: '#2fa39b' },
    curtain: true,
    hero: { variant: 'cover', kicker: 'Bespoke joinery · Bromley', lede: 'Kitchens, staircases and fitted furniture, made to measure in our workshop and fitted by the people who built them.', cta: 'Start a project' },
    intro: { label: 'The workshop', text: 'Every piece is drawn, cut and finished in one small workshop, then fitted by the same hands that made it.' },
    gallery: ['In the workshop', 'Kitchens', 'Staircases', 'Fitted furniture'],
    services: {
      variant: 'rows',
      label: 'What we make',
      items: [
        { title: 'Kitchens', text: 'Solid wood kitchens, drawn to your room and built to last.' },
        { title: 'Staircases', text: 'New stairs, or old ones rebuilt with new treads and handrails.' },
        { title: 'Fitted furniture', text: 'Wardrobes, alcove units and shelving that fit wall to wall.' },
        { title: 'Doors', text: 'Timber doors made to match the house, hung and finished.' },
      ],
    },
    band: 'Measured twice. Made once.',
    steps: [
      { title: 'Visit and measure', text: 'We come out, measure up and talk it through.' },
      { title: 'Drawing and price', text: 'A drawing and a fixed price before any wood is cut.' },
      { title: 'Made and fitted', text: 'Built in the workshop, fitted by the people who made it.' },
    ],
    areas: ['Bromley', 'Chislehurst', 'Sevenoaks', 'Beckenham', 'Orpington', 'Keston'],
    contact: 'Got a project?',
    sections: ['intro', 'gallery', 'services', 'band', 'steps', 'areas', 'contact'],
  },
  {
    slug: 'builder',
    trade: 'Builder',
    name: 'Ironside Build',
    mark: 'Ironside',
    tel: '07700 900419',
    look: ['Black and volt', 'Campaign', 'Big type'],
    font: 'anton',
    colors: { bg: '#0a0a0a', fg: '#fafafa', muted: '#a3a3a3', accent: '#d4ff3a', onAccent: '#0a0a0a', panel: '#161616', alt: '#ffffff' },
    hero: { variant: 'campaign', kicker: 'Extensions and lofts · Bromley', head: 'Build the room you’re missing', lede: 'Rear extensions and loft conversions across Bromley, from drawings and Building Control to the last coat of plaster.', cta: 'Start your build' },
    intro: { label: 'Who we are', text: 'A small building firm that runs every job itself, start to finish.' },
    split: [
      { title: 'Extensions', text: 'Rear, side return and wraparound. More kitchen, more light.' },
      { title: 'Lofts', text: 'Dormers and roof lights. A bedroom and shower room where the boxes were.' },
    ],
    services: {
      variant: 'rows',
      label: 'What we build',
      items: [
        { title: 'Rear extensions', text: 'Single storey or double, with the steel, the roof and the bifolds.' },
        { title: 'Loft conversions', text: 'Dormer, hip to gable or roof lights, with the stairs to match.' },
        { title: 'Side returns', text: 'The alley down the side turned into kitchen.' },
        { title: 'Garage conversions', text: 'An office, gym or bedroom where the car never went.' },
      ],
    },
    projects: [
      { title: 'Rear extension, doors in', kind: 'Extension' },
      { title: 'Single storey, flat roof', kind: 'Extension' },
      { title: 'Opening through to the new room', kind: 'Structural' },
      { title: 'New walls going up', kind: 'Brickwork' },
      { title: 'Loft, ready to move in', kind: 'Loft' },
      { title: 'New roof on', kind: 'Roofing' },
    ],
    band: 'Built bigger. Built right.',
    steps: [
      { title: 'Site visit', text: 'We look at the house, talk through the build and what it needs.' },
      { title: 'Drawings and price', text: 'Plans, Building Control and a fixed price, in writing.' },
      { title: 'Built and signed off', text: 'One team on site until the inspector signs it off.' },
    ],
    areas: ['Bromley', 'Beckenham', 'Orpington', 'Petts Wood', 'Hayes', 'Chislehurst'],
    contact: 'Let’s build',
    sections: ['split', 'services', 'rail', 'steps', 'areas', 'contact'],
  },
]


// Not listed in demos (no page): the home's lead and dashboard animations (LeadDemo, DashDemo) still show Dave’s.
export const plumber: Demo = {
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
      { title: 'Emergency call-outs', text: 'Burst pipe or no hot water? Day or night, seven days a week.', points: ['Price agreed on the phone', 'Water off and safe first', 'Proper fix, not a patch'] },
      { title: 'Boilers', text: 'Repairs, yearly services and new boilers fitted, with the warranty registered for you.', points: ['Repairs and yearly services', 'New boilers fitted', 'Warranty registered for you'] },
      { title: 'Bathrooms', text: 'From a new tap to the whole room, planned with you and finished on the date we agreed.', points: ['From one tap to the whole room', 'One team, start to finish', 'Finished on the agreed date'] },
      { title: 'Leaks and blockages', text: 'Found, fixed and explained, so it doesn’t come back.', points: ['Found without ripping things up', 'Fixed and explained', 'Left clean and dry'] },
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
}
