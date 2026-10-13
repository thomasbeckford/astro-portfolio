// One page per trade at /websites-for-{trade}, plus /website-redesign. Only what's really true for that audience: no
// invented clients, reviews or stats. The demo phone reuses the hero's look, so `trade` must match a name in trades.ts.
// `quote` marks a page priced on quote: no offer price, no "from £". The other optional fields override wording that
// the trade pages build from `plural`.

export const landings = [
  {
    path: 'websites-for-electricians',
    trade: 'Electrician',
    role: 'an electrician',
    plural: 'electricians',
    title: 'Websites for electricians',
    head: 'Websites for electricians that bring in the',
    mark: 'rewires, not the time-wasters.',
    lede: "People hiring an electrician want three things fast: are you registered, do you cover their area, and roughly what will it cost. A good site answers all three before they ring.",
    needs: [
      ['Your registration, checkable', 'Your NICEIC or NAPIT number with a link to the register, so customers can check you in seconds. Fuse boards and rewires have to be signed off under Part P, and careful people check.'],
      ['Price guides', '"Fuse boards from £…", "EICR from £…". A rough number up front filters out the calls that were never going to book.'],
      ['Landlord work', 'A clear EICR section. Landlords in England need one at least every five years, and they search for it by name.'],
      ['EV chargers on their own', 'Chargers are a separate search with their own buyers. They get their own section, not a line in a list.'],
      ['Your patch, named', 'The towns and postcodes you cover, written out. "Electrician in Croydon" is a search, and Google needs the word Croydon on your site.'],
      ['Call in one tap', 'A big call button and WhatsApp on every screen. Most of your visitors are on a phone, often with the power off.'],
    ],
    faqs: [
      ["I get enough work from word of mouth. Why bother?", "Word of mouth still ends in a Google search. Someone hears your name, looks you up, and either finds a proper site with your registration on it or a Facebook page from 2019. The site is what turns the recommendation into a call."],
      ['Can you show my NICEIC or NAPIT registration?', "Yes. Your logo, your number and a link to your entry on the register. I only show schemes you're actually on."],
      ['Should I put prices on my site?', "Guide prices, yes: \"from\" figures for your common jobs. You still quote properly on the day, but people who can't afford a rewire stop ringing about one."],
      ['I mostly do commercial work. Does that change anything?', 'The wording and the photos. Commercial buyers want to see the kind of sites you work on and your insurance, so the site leads with that.'],
    ],
  },
  {
    path: 'websites-for-plumbers',
    trade: 'Plumber',
    role: 'a plumber',
    plural: 'plumbers',
    title: 'Websites for plumbers',
    head: 'Websites for plumbers that ring when the',
    mark: 'boiler goes.',
    lede: "Most plumbing jobs start with a panic and a phone. Your site has one job: look trustworthy in five seconds and put your number under their thumb.",
    needs: [
      ['Emergency first', 'If you do call-outs, it says so at the top with the hours you actually cover, and the call button is the biggest thing on the page.'],
      ['Gas Safe, shown properly', "If you do gas work, your Gas Safe number and a link to check it. It's the law for gas work and the first thing people look for."],
      ['Boilers, front and centre', 'Boiler installs are the big jobs. Brands you fit, warranty you can offer, and a way to ask for a quote with a photo of the old one.'],
      ['Landlord gas safety checks', 'Landlords need one every year and search for "gas safety certificate" by name. A clear section catches them.'],
      ['Real bathrooms', 'Before and after photos of your own jobs. Stock photos of a bathroom you never touched put people off.'],
      ['Call-out radius', 'How far you travel for an emergency, by town. Someone with water through the ceiling wants to know you actually come to them.'],
    ],
    faqs: [
      ['Will a website get me more emergency call-outs?', "Only if people can find you and reach you fast. The site loads quickly on a phone, puts your number at the top, and names the areas you cover, so you show up when someone nearby searches with a leak."],
      ["I don't do gas. Is that a problem?", "Not at all. Then the site doesn't mention Gas Safe, it leads with what you do: leaks, bathrooms, kitchens, drainage. I only show what's true."],
      ['Can people send me a photo of the problem?', 'Yes. The WhatsApp button opens a chat with you, so they can send a photo of the leak or the boiler plate before you go out.'],
      ['Can I change my call-out hours myself?', 'Yes, two ways: with the Edit it yourself add-on you change them in your own editing panel, or with the care plan you send me a message and I do it.'],
    ],
  },
  {
    path: 'websites-for-roofers',
    trade: 'Roofer',
    role: 'a roofer',
    plural: 'roofers',
    title: 'Websites for roofers',
    head: 'Websites for roofers that prove you’re',
    mark: 'not a cowboy.',
    lede: "Homeowners are wary of roofers before they've met you. Your site's job is to remove that doubt: real jobs, real guarantees, a real person behind the number.",
    needs: [
      ['Your own jobs, in photos', 'Before and after shots of roofs you did, with the town. This beats any amount of wording.'],
      ['Guarantees in writing', 'What your guarantee covers and for how long, said plainly. Insurance and any memberships you hold, like NFRC or CompetentRoofer.'],
      ['Leak? Say what happens next', 'If you do emergency repairs, say so up top with a call button. Storm nights are when people search.'],
      ['Free roof check', 'If you offer one, it becomes the main button. It is the easiest yes for a nervous customer.'],
      ['Flat roofs, re-roofs, repairs', 'Each one clearly named. People search for the job, not for "roofer".'],
      ['Jobs by town', 'Your photos tagged with where the job was. It shows Google, and the neighbours, that you work on their street.'],
    ],
    faqs: [
      ["I don't have good photos of my work.", "Send me what you've got from your phone. If they're thin, take a few on your next jobs before the site goes live. No stock photos of other people's roofs."],
      ['Should I mention insurance work?', "If you do it, yes. People with storm damage search for roofers who deal with insurers, and it's a reason to call you over someone else."],
      ['Can you get me reviews?', "I can't write them, and nobody honest will. The site links to your Google reviews and makes it easy for happy customers to leave one."],
      ['Is a roofing site different from other trades?', 'Mostly in what it has to prove. Roofing has more cowboys than most, so the site leans on photos, guarantees and a real name.'],
    ],
  },
  {
    // 🤔 Pricing "On quote" and this copy are a draft: Thomas hasn't confirmed either yet.
    path: 'website-redesign',
    trade: 'Redesign',
    role: 'a business with an old website',
    plural: 'businesses with an old website',
    title: 'Website redesign',
    quote: true,
    ask: "Hi Thomas, my website's old and I'd like a quote to rebuild it.",
    needsHead: 'What a rebuild covers.',
    caption: 'A made-up business, before and after.',
    head: 'Old website? Rebuilt for',
    mark: 'the phone in their hand.',
    lede: "A site built years ago often looks fine on a desk and falls apart on a phone, which is where most people find you now. I rebuild it, keep your web address and email, and make sure your old links still land somewhere.",
    needs: [
      ['Same web address, same email', 'I move your domain across and keep your email working. Customers type the same address they always did.'],
      ['Old links keep working', 'Every old page address points to its new one, so Google results, bookmarks and links on other sites still land on the right page.'],
      ['Built for phones first', 'Designed for a thumb first, then scaled up to a desk. Big call and WhatsApp buttons on every screen.'],
      ['Fast on a weak signal', 'No heavy page builder underneath. Pages load quickly on a phone with one bar of signal.'],
      ['Your words, tidied', 'I keep what still works from your old site and rewrite what reads dated. You approve every word before it goes live.'],
      ['Yours, in your name', 'I make sure the domain is registered in your name. If you ever leave, the site and the address go with you.'],
    ],
    faqs: [
      ['Will I lose my place on Google?', "A rebuild done carelessly can drop you, usually because old page addresses break. I map every old address to its new page so Google follows you across. Nobody can promise rankings, but this is how you avoid losing them."],
      ['Do I keep my email?', 'Yes. Email and website are separate parts of your domain. I move the website and check your email still arrives before and after.'],
      ['Can you keep my photos and text?', "Yes. Send me what matters, or I take it from the old site. Anything that reads dated I rewrite, and you approve it."],
      ['How much does a redesign cost?', 'It depends on what is there now: a five-page site and a fifty-page one are different jobs. Send me your web address and I come back with a fixed price.'],
    ],
  },
]

export type Landing = (typeof landings)[number]
