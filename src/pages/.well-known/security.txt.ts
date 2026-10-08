import { site } from '@/site'

// RFC 9116. Expires must be under a year away, so it's refreshed on every build.
const expires = new Date(Date.now() + 300 * 864e5).toISOString()
export const GET = () =>
  new Response(`Contact: mailto:${site.email}\nExpires: ${expires}\nPreferred-Languages: en, es\nCanonical: ${site.url}/.well-known/security.txt\n`)
