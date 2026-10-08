// Facts about Thomas and the offer. The page, the JSON-LD and /llms.txt all read from here, so they never disagree.

export const site = {
  name: 'Thomas Beckford',
  role: 'Senior Full-Stack Engineer & AI Engineer',
  url: 'https://tebeck.vercel.app', // TODO: swap for a real domain when bought
  email: 'tebeckford@gmail.com',
  linkedin: 'https://www.linkedin.com/in/thomas-beckford-07520775/',
  github: 'https://github.com/thomasbeckford',
  priceFrom: 399,
  turnaround: 'about a week',
  years: '10+',
  phone: '+44 7917 628713',
}

export const whatsapp = (text: string) => `https://wa.me/${site.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`

// Limited launch offer to get the first few proven case studies. Remove once slots are gone.
export const foundingOffer = { slots: 5, price: 149, note: 'in exchange for a testimonial and a case study on this site' }

// TODO: monthly prices for care and ads once decided.
export const services = [
  { name: 'Website', price: `From £${site.priceFrom}`, note: `One-off, fixed price: about £${Math.round(site.priceFrom / 365)} a day over a year. You pay once you're happy with it.`, items: ['Design and all the wording', 'Mobile-first, fast, set up for Google', 'Call, WhatsApp and enquiry buttons', 'Your domain, in your name'] },
  { name: 'Care plan', price: 'Monthly', note: 'Cancel any time', items: ['Hosting, SSL and backups', 'Changes by message: prices, photos, services', 'Monthly check on speed and Google'] },
  { name: 'Ads', price: 'Monthly', note: 'Plus your ad budget', items: ['Google Business profile set up and kept fresh', 'Google and Meta ads set up and managed', 'A plain-English report each month'] },
  { name: 'Rescue', price: 'On quote', note: "Built something with AI or no-code and it's stuck, buggy or insecure?", items: ['Security and code review', 'Fix the bugs, stabilise it', 'Rebuild or scale what needs it'] },
]

export const faqs = [
  ['How long does it take?', `Usually ${site.turnaround} from your first message to a live site. You see it before it goes live.`],
  ["What's the founding offer?", `The first ${foundingOffer.slots} clients get the website for £${foundingOffer.price} instead of £${site.priceFrom}, ${foundingOffer.note}. Same site, same care, just cheaper while I build up reviews.`],
  ['I already have a website. Can you redo it?', 'Yes. I rebuild it and move your web address across, so you keep your domain and email.'],
  ['Do I need to write anything?', 'No. Tell me about your business in your own words and I write it up. You approve everything before it goes live.'],
  ['Who owns the website?', 'You do. The domain is registered in your name, not mine.'],
  ["I'm on Checkatrade. Do I still need a website?", "It helps. On Checkatrade you sit in a list next to your competitors, and the profile isn't yours. Your own site is just you, under your name, and it's the place to send people from your van, your cards and Google."],
  ['Can you get me to the top of Google?', "Nobody can honestly promise that. I build the site fast and set up properly for Google, and the Ads plan looks after your Google Business profile, which is what shows up when people nearby search for what you do."],
  ['Do I have to take the care plan or ads?', 'No. They are optional. Plenty of clients just want the site.'],
  ['Do you use AI?', "Yes. Claude Code, Codex and the like, for repetitive coding, like a builder uses a power drill. I decide what gets built, check every line and test it on real phones. I also build AI-powered features for clients: chatbots, automation, agentic tools."],
  ['Where are you based?', 'London. I work with businesses across the UK, and everything can be done remotely.'],
  ['Are there ongoing costs?', 'Only if you want them. The website itself is a one-off price. Care plan and ads are optional monthly add-ons, cancel any time.'],
  ['What if I don\'t like it?', 'You don\'t pay until you\'re happy with the site. No deposit upfront.'],
]
