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

// Christmas offer, also to get the first proven case studies. 🤔 End date not decided yet: remove after Christmas.
// Hosting is on Thomas, for every site. The domain he buys too, registered in the client's name, and they pay him back at cost.
// 🤔 Host on a plan that allows commercial use (Vercel Hobby doesn't).
export const carePrice = 19
// One-off add-on: a Payload CMS panel so the client edits words, photos and prices; Thomas keeps design and structure.
// 🤔 Payload needs a server and a database: check it still fits free hosting before selling it.
export const cmsPrice = 150

export const christmasOffer = { price: 149, note: 'in exchange for a testimonial and a case study on this site' }

// TODO: monthly price for ads once decided.
export const services = [
  { name: 'Website', price: `From £${site.priceFrom}`, note: `One-off, fixed price: about £${Math.round(site.priceFrom / 365)} a day over a year. You pay once you're happy with it.`, items: ['Design and all the wording', 'Mobile-first, fast, set up for Google', 'Call, WhatsApp and enquiry buttons', 'Free hosting, no monthly fee', 'Your domain, in your name'] },
  { name: 'Edit it yourself', price: `+£${cmsPrice}, one-off`, note: 'Your own editing panel, built with Payload CMS', items: ['Log in and change words, photos and prices', 'No monthly fee to make changes', 'I look after the design, the content is yours'] },
  { name: 'Care plan', price: `From £${carePrice} a month`, note: 'Optional, cancel any time', items: ['Changes by message: prices, photos, services', 'Backups and security updates', 'Monthly check on speed and Google'] },
  { name: 'Ads', price: 'Monthly', note: 'Plus your ad budget', items: ['Google Business profile set up and kept fresh', 'Google and Meta ads set up and managed', 'A plain-English report each month'] },
  { name: 'Animation', price: 'On quote', note: 'Want people to stop scrolling and look?', items: ['Scroll effects and motion', 'Interactive and 3D bits', 'Still fast on a phone'] },
  { name: 'Rescue', price: 'On quote', note: "Built something with AI or no-code and it's stuck, buggy or insecure?", items: ['Security and code review', 'Fix the bugs, stabilise it', 'Rebuild or scale what needs it'] },
]

export const steps = [
  { n: '01', title: 'Send one message', text: 'WhatsApp or email. Tell me what you do and where. Two minutes, no forms, no calls unless you want one.' },
  { n: '02', title: `See it in ${site.turnaround}`, text: 'I write the words, pick the photos and build it. You get a link to the real site on your phone.' },
  { n: '03', title: 'Pay when you’re happy', text: 'Tell me what to change. Nothing goes live until you say yes in writing (a WhatsApp counts), and only then you pay. No deposit.' },
]

export const faqs = [
  ['How long does it take?', `Usually ${site.turnaround} from your first message to a live site. You see it before it goes live.`],
  ["What's the Christmas offer?", `Over Christmas the website is £${christmasOffer.price} instead of £${site.priceFrom}, ${christmasOffer.note}. Same site, same care, just cheaper while I build up reviews.`],
  ['I already have a website. Can you redo it?', 'Yes. I rebuild it and move your web address across, so you keep your domain and email.'],
  ['Do I need to write anything?', 'No. Tell me about your business in your own words and I write it up. You approve everything before it goes live.'],
  ['Who owns the website?', 'You do. The domain is registered in your name, not mine.'],
  ['Can I change the website myself?', `That's what the Edit it yourself add-on is for (£${cmsPrice}, one-off). I set up Payload CMS, an editing panel for your site: you log in, change the words, photos and prices, and press publish. No code, no monthly fee. I look after the design and anything that needs a developer.`],
  ['Do I pay for hosting?', "Hosting is on me: free, for as long as the site is with me. The only yearly cost is your domain: I buy it for you, in your name, and you pay me back what it costs, no markup."],
  ["I'm on Checkatrade. Do I still need a website?", "It helps. On Checkatrade you sit in a list next to your competitors, and the profile isn't yours. Your own site is just you, under your name, and it's the place to send people from your van, your cards and Google."],
  ['Can you get me to the top of Google?', "Nobody can honestly promise that. I build the site fast and set up properly for Google, and the Ads plan looks after your Google Business profile, which is what shows up when people nearby search for what you do."],
  ['Do I have to take the care plan or ads?', 'No. They are optional. Plenty of clients just want the site.'],
  ['Do you use AI?', "Yes. Claude Code, Codex and the like, for repetitive coding, like a builder uses a power drill. I decide what gets built, check every line and test it on real phones. I also build AI-powered features for clients: chatbots, automation, agentic tools."],
  ['What do you build it with?', "Whatever fits the job, not one tool for everything. A site that's mostly words and photos, like most trade sites, I build with Astro, so it loads fast even on one bar of signal. Bookings, payments or customer logins get Next.js or TanStack Start, a proper database like Postgres, and Stripe. Apps get React Native. No Wix or WordPress page builders. You don't need to know any of this: you get a fast site that can grow with you."],
  ['Where are you based?', 'London. I work with businesses across the UK, and everything can be done remotely.'],
  ['Are there ongoing costs?', `The website is a one-off price and hosting is free. The only yearly cost is your domain, at cost. The care plan (from £${carePrice} a month) and ads are optional, cancel any time.`],
  ['What if I don\'t like it?', 'You don\'t pay until you\'re happy with the site. No deposit upfront.'],
]
