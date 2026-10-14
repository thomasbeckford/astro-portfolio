// Trades for the home's chat. `style` and the demo fields fed the old trade landings' phone preview (removed 2026-10-14).
// `neon` is the home showcase's page accent while that trade is on the phone: the bright twin of that design's colour, readable on near-black.
// Phone numbers sit in Ofcom's drama range (07700 900xxx), so they're never real.
export const trades = [
  {
    name: 'Electrician', style: 'volt', neon: '#facc15', quip: 'Ooh, sparky.', demo: 'Bright Spark Electrical', head: 'Sparks you can trust.', lede: 'Rewires, fuse boards and EV chargers across {area}. Certified and insured.', cta: 'Get a quote',
    points: ['Part P registered', 'All work guaranteed', 'Serving {area} and nearby'],
    extra: { label: 'What we do', items: ['EV chargers', 'Fuse boards', 'Rewires', 'Lighting'], chips: true },
  },
  {
    name: 'Plumber', style: 'flow', neon: '#22d3ee', quip: 'Mind the pipes.', demo: 'Dave’s Plumbing', head: 'Leak? Boiler down? We’re on our way.', lede: 'Emergency call-outs, boilers and bathrooms across {area}.', cta: 'Get a fixed price',
    points: ['Gas Safe registered', 'Price agreed before we start', 'Serving {area} and nearby'],
    extra: { label: 'Emergency call-out', items: ['Day or night, seven days a week'] },
  },
  {
    name: 'Roofer', style: 'slate', neon: '#f87171', quip: 'Heights? I’ll hover.', demo: 'Kestrel Roofing', head: 'Roof leaking? Fixed properly, first time.', lede: 'Repairs, re-roofs and flat roofs across {area}, with a written guarantee.', cta: 'Book a free roof check',
    points: ['Free, no-obligation quotes', 'Fully insured', 'Serving {area} and nearby'],
    extra: { label: 'Free roof check', items: ['Photos of your roof the same day'] },
  },
  {
    name: 'Café', style: 'brew', neon: '#fb923c', quip: 'I run on coffee too.', demo: 'The Corner Café', head: 'Proper coffee. Proper breakfast.', lede: 'Your local in {area}. Open from 7, seven days a week.', cta: 'See the full menu',
    points: ['Dogs welcome', 'Seats outside', 'Takeaway all day'],
    extra: { label: 'On the menu', items: ['Flat white|£3.20', 'Full English|£9.50', 'Bacon roll|£4.50'] },
  },
  {
    name: 'Salon', style: 'bloom', neon: '#f472b6', quip: 'Can you do chrome?', demo: 'Bloom & Co', head: 'Walk in. Walk out wow.', lede: 'Cuts, colour and nails in {area}. Book online in seconds.', cta: 'Book online',
    points: ['Walk-ins welcome', 'Bridal and events', 'Gift vouchers'],
    extra: { label: 'Free today', items: ['10:30', '12:15', '15:45'], chips: true },
  },
  {
    name: 'Gardener', style: 'grove', neon: '#a3e635', quip: 'Lovely. I’ll bring the tea.', demo: 'Green Thumb Gardens', head: 'Gardens you’ll want to sit in.', lede: 'Lawns, hedges and full makeovers across {area}.', cta: 'Get a free quote',
    points: ['Free quotes', 'Green waste taken away', 'Serving {area} and nearby'],
    extra: { label: 'Opening hours', items: ['Mon to Sat, 8am to 5pm'] },
  },
  {
    // Not a trade: the "my site's old" pick. `pick` is its button label; the phone wipes a dated site into a new one.
    name: 'Redesign', pick: 'My site’s old', style: 'redo', neon: '#60a5fa', quip: 'Vintage. Older than me.', demo: 'Hartley & Sons', head: 'Same business. Brand new site.', lede: 'Everything we do across {area}, easy to find on a phone.', cta: 'Get in touch',
    points: ['Local and family run', 'Free quotes', 'Serving {area} and nearby'],
    extra: { label: 'Before and after', items: [] },
  },
]
export type Trade = (typeof trades)[number]
