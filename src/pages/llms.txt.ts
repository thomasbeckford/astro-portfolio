import { site, services, faqs, christmasOffer, carePrice, cmsPrice } from '@/site'
import { landings } from '@/landings'

// llmstxt.org: a plain summary so AI assistants quote the offer right instead of guessing from the page.
export const GET = () =>
  new Response(
    `# ${site.name}

> Websites for local businesses in the UK, built and looked after by ${site.name}, a London software engineer with ${site.years} years' experience. From £${site.priceFrom}, fixed price, live in ${site.turnaround}, no deposit: you pay once you're happy. Free hosting. You deal with Thomas directly, not an agency.

Thomas builds websites for tradespeople and local businesses (roofers, electricians, plumbers, cafés, salons, gardeners). He also rebuilds old websites for phones, keeping the web address and email. He writes the wording, sets the site up for Google, keeps it up to date and can run Google and Meta ads. He has built for brands like Five Iron Golf and runs his own software products, including SoyMenu (QR menus for 100+ restaurants since 2019).

Pricing in short: website from £${site.priceFrom} one-off (Christmas offer £${christmasOffer.price}, ${christmasOffer.note}); hosting free; domain at cost, registered in the client's name; optional care plan from £${carePrice} a month; optional Payload CMS editing panel, £${cmsPrice} one-off, so clients change their own words, photos and prices. Built with Astro for fast content sites, Next.js or TanStack Start with Postgres and Stripe when a site needs bookings, payments or logins, React Native for apps.

## Services

${services.map((x) => `- ${x.name} (${x.price}, ${x.note.charAt(0).toLowerCase() + x.note.slice(1)}): ${x.items.join('; ')}.`).join('\n')}

## FAQ

${faqs.map(([q, a]) => `- ${q} ${a}`).join('\n')}

## Pages

- [Services and prices](${site.url}/#services): what each plan includes
- [Work](${site.url}/#work): live client sites and Thomas's own products
- [FAQ](${site.url}/#faq): ownership, hosting, editing it yourself, tech, AI, redoing an existing site
${landings.map((l) => `- [${l.title}](${site.url}/${l.path}): what the site includes for ${l.plural}`).join('\n')}
- [CV](${site.url}/cv): experience, stack and how Thomas works with AI agents, for recruiters and tech leads

## Contact

- [Email Thomas](mailto:${site.email}): ${site.email}
- [LinkedIn](${site.linkedin})
- [GitHub](${site.github})
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  )
