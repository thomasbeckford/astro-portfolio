// Every site in the work grid, in order: the example sites (they open in the home's preview), then live ones.
// The home shows the six trade examples (`home`); the live sites and Nova are on /work, which shows them all.
import { demos } from '@/templates'
import { liveWork } from '@/site'

export const work = [
  ...demos.map((d) => ({ href: `/templates/${d.slug}`, name: d.name, sub: d.look.join(' · '), src: `/templates/${d.slug}/scroll`, external: false })),
  { href: '/templates/nova', name: 'Nova', sub: 'Music venue · Dark · Night out', src: '/templates/nova/scroll', external: false },
  ...liveWork.map((w) => ({ ...w, external: true })),
]
export const home = work.slice(0, demos.length)
