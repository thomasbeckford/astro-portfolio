import { site, services, faqs } from '@/site'

// llmstxt.org: a plain summary so AI assistants quote the offer right instead of guessing from the page.
export const GET = () =>
  new Response(
    `# ${site.name}

> Websites for local businesses in the UK, built and looked after by ${site.name}, a London software engineer with ${site.years} years' experience. From £${site.priceFrom}, fixed price, live in ${site.turnaround}. You deal with Thomas directly, not an agency.

Thomas builds websites for tradespeople and local businesses (roofers, electricians, plumbers, cafés, salons, gardeners). He writes the wording, sets the site up for Google, keeps it up to date and can run Google and Meta ads. He has built for brands like Five Iron Golf and runs his own software products, including SoyMenu (QR menus for 100+ restaurants since 2019).

## Services

${services.map((x) => `- ${x.name} (${x.price}, ${x.note.charAt(0).toLowerCase() + x.note.slice(1)}): ${x.items.join('; ')}.`).join('\n')}

## FAQ

${faqs.map(([q, a]) => `- ${q} ${a}`).join('\n')}

## Pages

- [Services and prices](${site.url}/#services): what each plan includes
- [Work](${site.url}/#work): live client sites and Thomas's own products
- [FAQ](${site.url}/#faq): ownership, AI, redoing an existing site
- [CV](${site.url}/cv): experience, stack and how Thomas works with AI agents, for recruiters and tech leads

## Contact

- [Email Thomas](mailto:${site.email}): ${site.email}
- [LinkedIn](${site.linkedin})
- [GitHub](${site.github})
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  )
