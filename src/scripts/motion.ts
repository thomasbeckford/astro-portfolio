// Scroll motion for /templates: Lenis smooth scroll driving GSAP ScrollTrigger, plus effects switched on by data
// attributes so the kit sections stay markup only. Reduced motion gets none of it: native scroll, static layout,
// videos on their poster (CSS keeps the marquee still too).
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
gsap.registerPlugin(ScrollTrigger, SplitText)

const all = <T extends Element = HTMLElement>(sel: string) => [...document.querySelectorAll<T & Element>(sel)] as T[]
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
// Small answers to a tap or a change, so the page feels alive. None under reduced motion.
const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'
const pop = (el: Element) => reduced || el.animate([{ transform: 'scale(0.92)' }, { transform: 'none' }], { duration: 320, easing: ease })
const rise = (els: Element[]) => reduced || els.slice(0, 12).forEach((el, i) => el.animate([{ transform: 'translateY(0.75rem)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, delay: i * 30, easing: ease, fill: 'backwards' }))
// Reorder children and let each slide from where it was to where it lands (FLIP).
const flip = (parent: Element, reorder: () => void) => {
  const kids = [...parent.children], before = new Map(kids.map((k) => [k, k.getBoundingClientRect()]))
  reorder()
  if (reduced) return
  kids.forEach((k) => {
    const a = before.get(k)!, b = k.getBoundingClientRect()
    if (a.left !== b.left || a.top !== b.top) k.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)` }, { transform: 'none' }], { duration: 600, easing: ease })
  })
}
// Home navbar: the link of the section in view carries aria-current, which draws its mint stroke (CSS).
const navLinks = all<HTMLAnchorElement>('.nav-link')
if (navLinks.length) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const link = navLinks.find((a) => a.hash === `#${e.target.id}`)
    if (e.isIntersecting) navLinks.forEach((a) => a === link ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'))
    else link?.removeAttribute('aria-current')
  }), { rootMargin: '-45% 0px -50% 0px' }) // a thin band mid-screen: one section at a time
  navLinks.forEach((a) => { const s = document.querySelector(a.hash); if (s) io.observe(s) })
}

// The hero intro (below) holds the headline letters until the panel has moved aside.
let introGate = Promise.resolve()

// Videos only play while on screen, and never under reduced motion (they keep their poster).
const videos = all<HTMLVideoElement>('video[data-auto]')
if (!reduced) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { const v = e.target as HTMLVideoElement; if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }), { rootMargin: '200px' })
  videos.forEach((v) => io.observe(v))
}

if (!reduced) {
  // Lenis smooths wheel scrolling only; touch keeps the phone's own scroll.
  const lenis = new Lenis({ anchors: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

const mm = gsap.matchMedia()
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const cleanups: (() => void)[] = []
  // Opening curtain: blocks step away from the bottom-left corner.
  all('[data-curtain]').forEach((c) => {
    gsap.to(c.children, { scaleY: 0, duration: 0.5, ease: 'power3.inOut', stagger: { grid: 'auto', from: [0, 1], amount: 0.7 }, onComplete: () => c.remove() })
  })
  // Poster hero: the video shrinks to a card while the giant name rises into the header and hands over to it.
  all('[data-poster]').forEach((hero) => {
    const media = hero.querySelector<HTMLElement>('[data-poster-media]')!
    const mark = hero.querySelector<HTMLElement>('[data-poster-mark]')!
    const nav = document.querySelector<HTMLElement>('[data-nav-mark]')
    const word = mark.firstElementChild as HTMLElement
    const s = () => 24 / parseFloat(getComputedStyle(mark).fontSize)
    const phone = () => innerWidth < 768
    if (nav) gsap.set(nav, { autoAlpha: 0 })
    const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true } })
    tl.fromTo(media, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: () => (innerWidth < 768 ? 'inset(22% 6% 22% 6%)' : 'inset(18% 26% 18% 26%)'), ease: 'none' }, 0)
      .to(hero.querySelectorAll('[data-poster-marks]'), { autoAlpha: 0, ease: 'none', duration: 0.2 }, 0)
      .to(hero.querySelectorAll('[data-poster-copy]'), { autoAlpha: 0, y: -40, ease: 'none', duration: 0.35 }, 0)
      .to(mark, {
        y: () => 18 - mark.offsetTop,
        scale: s,
        transformOrigin: () => (phone() ? '0% 0%' : '50% 0%'),
        x: () => (phone() ? 16 - ((mark.offsetWidth - word.offsetWidth) / 2) * s() : 0),
        ease: 'none',
      }, 0)
      .to(mark, { autoAlpha: 0, duration: 0.08 }, 0.92)
    if (nav) tl.to(nav, { autoAlpha: 1, duration: 0.08 }, 0.92)
  })
  // Edit → Publish → Live (PublishDemo, hero): the panel builds, a new button label gets typed, Publish is pressed, the
  // card turns into the live site. Each loop is the next example site. Cursor targets come from layout offsets.
  all('[data-publish]').forEach((st) => {
    type Site = { img: string; name: string; mark: string; kicker: string; head: string; cta: string; items: string[]; css: string; es?: { kicker: string; head: string; cta: string; items: string[] } }
    const sites: Site[] = JSON.parse(st.dataset.publish!)
    const q = (s: string) => st.querySelector<HTMLElement>(s)!
    const theme = q('[data-pd-theme]'), card = q('[data-pd-card]'), panel = q('[data-pd-panel]'), site = q('[data-pd-site]'), cursor = q('[data-pd-cursor]')
    const caret = q('[data-pd-caret]'), field = q('[data-pd-field]'), btn = q('[data-pd-publish]'), label = q('[data-pd-label]'), live = q('[data-pd-live]')
    const esb = q('[data-pd-lang]'), code = q('[data-pd-code]'), words = st.querySelectorAll('[data-pd-site] [data-pd-out], [data-pd-code]')
    const img = q('[data-pd-img]') as HTMLImageElement, input = q('[data-pd-in="cta"]'), old = st.dataset.pdOld!
    const at = (el: HTMLElement, fx = 0.5, fy = 0.5) => {
      let x = el.offsetWidth * fx, y = el.offsetHeight * fy, e: HTMLElement | null = el
      while (e && e !== st) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent as HTMLElement | null }
      return { x, y }
    }
    // Paints site i into the panel and the live card; the button keeps its old label until it is typed.
    let i = sites.length - 1 // the first loop steps to 0; never out of range for renders before that
    const show = (s: Site) => {
      theme.style.cssText = s.css
      if (s.img) img.src = s.img
      const put = (k: string, v: string) => st.querySelectorAll<HTMLElement>(`[data-pd-out="${k}"],[data-pd-in="${k}"]`).forEach((el) => (el.textContent = v))
      put('initial', s.mark[0]); put('mark', s.mark); put('name', s.name); put('kicker', s.kicker); put('head', s.head); put('cta', s.cta)
      for (let n = 0; n < 3; n++) put(`item${n}`, s.items[n] ?? '')
      code.textContent = 'EN'
    }
    // The live site only: the panel keeps the English it was edited in.
    const spanish = () => { const e = sites[i].es; if (!e) return
      const put = (k: string, v: string) => st.querySelectorAll<HTMLElement>(`[data-pd-site] [data-pd-out="${k}"]`).forEach((el) => (el.textContent = v))
      put('kicker', e.kicker); put('head', e.head); put('cta', e.cta); for (let n = 0; n < 3; n++) put(`item${n}`, e.items[n] ?? '')
      code.textContent = 'ES' }
    const typed = { n: 0 }
    const click = () => gsap.to(cursor, { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1 })
    gsap.set(card, { autoAlpha: 0 }) // the markup's live site never shows first: the loop opens on the panel
    const tl = gsap.timeline({ paused: true, repeat: sites.length - 1, repeatDelay: 0.2, repeatRefresh: true, defaults: { ease: 'power2.inOut' } })
    // Fade out whatever shows (the live site from the markup, or the last loop's) before painting the next one.
    tl.to(card, { autoAlpha: 0, duration: 0.4 })
      .call(() => { i = (i + 1) % sites.length; show(sites[i]); input.textContent = old; label.textContent = 'Publish changes' })
      .set(site, { autoAlpha: 0 }).set(panel, { autoAlpha: 1 })
      .set(btn, { backgroundColor: 'rgba(0,0,0,0.1)', color: '#222' }).set(field, { boxShadow: '0 0 0 0px #b4532f' })
      .set(live, { boxShadow: '0 0 0 0em transparent' })
      .set(cursor, { autoAlpha: 0, scale: 1, x: () => st.offsetWidth * 0.75, y: () => st.offsetHeight * 0.9 })
      .fromTo(card, { yPercent: -8, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', immediateRender: false })
      .fromTo(st.querySelectorAll('[data-pd-row]'), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.4 }, '-=0.2')
      .to(cursor, { autoAlpha: 1, duration: 0.2 })
      .to(cursor, { x: () => at(field, 0.7).x, y: () => at(field, 0.7).y, duration: 0.9 })
      .call(click)
      .set(field, { boxShadow: '0 0 0 2px #b4532f' }, '+=0.15')
      .call(() => { input.textContent = '' })
      .set(caret, { opacity: 1 })
      .fromTo(typed, { n: 0 }, { n: 1, duration: 0.9, ease: 'none', onUpdate: () => { const t = sites[i].cta; input.textContent = t.slice(0, Math.round(typed.n * t.length)) } })
      .set(caret, { opacity: 0 })
      .set(btn, { backgroundColor: '#222', color: '#fff' })
      .to(cursor, { x: () => at(btn).x, y: () => at(btn).y, duration: 0.8 }, '+=0.2')
      .call(click)
      .call(() => { label.textContent = 'Publishing…' }, [], '+=0.15')
      .to(cursor, { autoAlpha: 0, duration: 0.3 }, '+=0.5')
      .to(panel, { autoAlpha: 0, duration: 0.4 }, '<')
      .to(site, { autoAlpha: 1, duration: 0.4 }, '<')
      .fromTo(live, { boxShadow: '0 0 0 0em transparent' }, { boxShadow: '0 0 0 .35em rgba(255,255,255,0.35)', duration: 0.4, yoyo: true, repeat: 3 }, '+=0.1')
      // Then the same site in Spanish: the visitor's language switch.
      .set(cursor, { x: () => at(esb).x + 40, y: () => at(esb).y + 60 }, '+=0.3')
      .to(cursor, { autoAlpha: 1, duration: 0.2 })
      .to(cursor, { x: () => at(esb).x, y: () => at(esb).y, duration: 0.6 })
      .call(click)
      .to(words, { autoAlpha: 0, duration: 0.2 }, '+=0.1')
      .call(spanish)
      .to(words, { autoAlpha: 1, duration: 0.3 })
      .to(cursor, { autoAlpha: 0, duration: 0.3 }, '+=0.3')
      .to({}, { duration: 1.6 })
    ScrollTrigger.create({ trigger: st, start: 'top 90%', end: 'bottom 10%', onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) })
    st.addEventListener('pd:restart', () => tl.restart()) // the hero intro starts it over once it shows
    // Reduced motion switched on mid-loop: gsap reverts the tweens, not the text, so put the first site back whole.
    cleanups.push(() => { show(sites[0]); label.textContent = 'Publish changes' })
  })
  // Collage photos drifting at their own speed.
  all('[data-speed]').forEach((el) => {
    const d = parseFloat(el.dataset.speed!) * 120
    gsap.fromTo(el, { y: d }, { y: -d, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } })
  })
  // Hero intro (pattern from onfuel.io; the page set data-intro): the panel opens large and centred on an empty hero, and
  // as soon as it has built it moves into its slot (it keeps playing there), the letters rise and the rest fades in. A scroll ends it early.
  const intro = document.documentElement.hasAttribute('data-intro') && document.querySelector<HTMLElement>('#hero [data-publish]')
  if (intro) {
    let open = () => {}
    introGate = new Promise((res) => (open = res))
    // Measure once the fonts are in (the headline's font sets the hero's height, so the slot moves), and skip the intro
    // when a reload has put the page back further down.
    document.fonts.ready.then(() => {
      if (scrollY > 10) { document.documentElement.removeAttribute('data-intro'); open(); return }
      const copy = all('#hero [data-intro-copy]')
      const r = intro.getBoundingClientRect()
      const w = Math.min(innerWidth * 0.62, innerHeight * 0.6 * (r.width / r.height))
      gsap.set(copy, { autoAlpha: 0 })
      // Start the demo over with the card empty, so the example site from the markup never flashes before the panel builds.
      gsap.set(intro.querySelector('[data-pd-card]'), { autoAlpha: 0 })
      intro.dispatchEvent(new Event('pd:restart'))
      gsap.set(intro, { visibility: 'visible', zIndex: 30, scale: w / r.width, x: innerWidth / 2 - (r.left + r.width / 2), y: innerHeight / 2 - (r.top + r.height / 2) })
      document.documentElement.removeAttribute('data-intro')
      let done = false
      const out = () => {
        if (done) return
        done = true
        removeEventListener('scroll', early)
        gsap.timeline({ onComplete: () => { gsap.set(intro, { clearProps: 'zIndex' }); ScrollTrigger.refresh() } })
          .to(intro, { x: 0, y: 0, scale: 1, duration: 0.9, ease: 'expo.inOut' })
          .call(open, [], 0.35)
          .to(copy, { autoAlpha: 1, duration: 0.6, stagger: 0.12 }, 0.6)
      }
      const early = () => scrollY > 10 && out()
      addEventListener('scroll', early, { passive: true })
      gsap.delayedCall(1.6, out) // once the panel has built
    })
  }
  // Golf hero's jungle: the nearest leaves part on arrival, then every layer is pushed out and up as you scroll in,
  // the nearest the most.
  all('[data-jungle]').forEach((el) => {
    const side = Number(el.dataset.side), push = { far: 10, mid: 25, near: 40 }[el.dataset.jungle as 'far' | 'mid' | 'near']
    if (el.dataset.jungle === 'near') gsap.from(el, { xPercent: -side * 25, rotate: side * 8, duration: 1.8, ease: 'expo.out', delay: 0.1 })
    gsap.to(el, { x: () => side * push * innerWidth / 100, scale: 1 + push / 80, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } })
  })
  // Hero name: letters rise in one by one.
  all('[data-letters]').forEach((el) => {
    // data-letters="wide": phones get the headline whole and at once, only the ringing word moves.
    if (el.dataset.letters === 'wide' && !matchMedia('(min-width: 640px)').matches) {
      const ring = [...el.querySelectorAll('span')].find((w) => w.textContent === el.dataset.ring)
      return void setTimeout(() => ring?.classList.add('ringing'), 800)
    }
    SplitText.create(el, { type: 'words,chars', mask: 'chars', onSplit: (s) => {
      el.style.visibility = 'visible' // a page may hold it hidden until now, so it never flashes whole
      // data-ring="word": that word starts ringing once everything has landed (.ringing in global.css).
      const ring = s.words.find((w) => w.textContent === el.dataset.ring)
      const t = gsap.from(s.chars, { paused: true, yPercent: 110, rotate: 6, duration: 1.1, ease: 'expo.out', stagger: 0.05, delay: parseFloat(el.dataset.delay ?? (document.querySelector('[data-curtain]') ? '0.7' : '0.15')), onComplete: () => ring?.classList.add('ringing') }) // wait out the curtain
      introGate.then(() => t.play())
      return t
    } })
  })
  // Headings: words slide up out of a mask when they come into view.
  all('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines,words',
      aria: 'none',
      mask: 'lines',
      autoSplit: true,
      onSplit: (s) => gsap.from(s.words, { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.035, scrollTrigger: { trigger: el, start: 'top 85%' } }),
    })
  })
  // Statements: words light up as you read down.
  all('[data-scrub]').forEach((el) => {
    SplitText.create(el, { type: 'words', aria: 'none', onSplit: (s) => gsap.fromTo(s.words, { opacity: 0.16 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } }) })
  })
  // Hero media that starts full-bleed and shrinks into a rounded card.
  all('[data-shrink]').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, { clipPath: 'inset(7% 5% 7% 5% round 28px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
  })
  // Hero photo that starts as an inset rounded card and opens out to full width.
  all('[data-grow]').forEach((el) => {
    gsap.fromTo(el, { clipPath: () => (innerWidth < 768 ? 'inset(0% 4% 0% 4% round 24px)' : 'inset(0% 14% 0% 14% round 32px)') }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 10%', scrub: true, invalidateOnRefresh: true } })
  })
  // Media drifting slower than the page inside its frame.
  all('[data-parallax]').forEach((el) => {
    gsap.fromTo(el, { yPercent: -19.35 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
  })
  // Sticky card stack: each card sinks back and dims as the next one slides over it.
  all('[data-stack]').forEach((stack) => {
    const cards = [...stack.children] as HTMLElement[]
    cards.slice(0, -1).forEach((card, i) => {
      const next = cards[i + 1]
      gsap.timeline({ scrollTrigger: { trigger: next, start: 'top bottom', end: () => `top top+=${parseFloat(getComputedStyle(next).top) || 0}`, scrub: true, invalidateOnRefresh: true } })
        .to(card, { scale: 0.9 + i * 0.02, ease: 'none' }, 0)
        .to(card.querySelector('[data-dim]'), { opacity: 0.45, ease: 'none' }, 0)
    })
  })
  // League cup: the tournament plays itself out from both ends. Each round's cards land, the scores count up,
  // the losers fade and the winners light, then the lines grow toward the next round. The final lands last and glows.
  all('[data-cup]').forEach((cup) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: cup, start: 'top 70%' } })
    const fg = getComputedStyle(cup).color, fmt = (n: number) => (n < 0 ? `−${-n}` : n === 0 ? 'E' : `+${n}`)
    for (let far = 3; far >= 0; far--) {
      const at = (3 - far) * 1.1
      cup.querySelectorAll<HTMLElement>(`[data-cup-col="${far}"]`).forEach((col) => {
        const side = Number(col.dataset.side), games = col.querySelectorAll('[data-cup-game]')
        if (!far) return void tl.from(games, { opacity: 0, scale: 0.85, duration: 0.9, ease: 'back.out(2)' }, at)
          .fromTo(games, { boxShadow: '0 0 0px -10px var(--accent)' }, { boxShadow: '0 0 60px -6px var(--accent)', duration: 1.2, ease: 'sine.inOut', repeat: 4, yoyo: true }, at + 0.9)
        tl.from(games, { opacity: 0, x: -side * 40, duration: 0.6, ease: 'expo.out', stagger: 0.05 }, at)
        col.querySelectorAll<HTMLElement>('[data-score]').forEach((el) => {
          const n = { v: 0 }
          cleanups.push(() => void (el.textContent = fmt(Number(el.dataset.score))))
          tl.to(n, { v: Number(el.dataset.score), duration: 0.5, ease: 'power2.out', onUpdate: () => void (el.textContent = fmt(Math.round(n.v))) }, at + 0.3)
        })
        tl.from(col.querySelectorAll('[data-cup-side="lose"]'), { opacity: 1, duration: 0.4 }, at + 0.8)
          .from(col.querySelectorAll('[data-cup-side="win"]'), { color: fg, duration: 0.4 }, at + 0.8)
          .fromTo(col.querySelectorAll('[data-cup-pair]'), { '--draw': 0 }, { '--draw': 1, duration: 0.4, ease: 'power2.inOut' }, at + 0.9)
      })
    }
  })
  // Club stripes: each band sweeps across from alternating sides as it comes into view.
  all('[data-stripes]').forEach((el) => {
    gsap.set(el, { visibility: 'visible' })
    gsap.from(el.children, { scaleX: 0, transformOrigin: (i: number) => (i % 2 ? 'right' : 'left'), duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 90%' } })
  })
  // Images and cards fading up as they arrive.
  all('[data-rise]').forEach((el) => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
  })
  return () => cleanups.forEach((f) => f())
})

// Horizontal gallery: pinned and scrolled sideways on wide screens; a plain vertical list on phones.
mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
  const vw = () => document.documentElement.clientWidth
  const sections = all('[data-hscroll]')
  sections.forEach((section) => {
    const track = section.querySelector<HTMLElement>('[data-track]')!
    section.style.overflow = 'hidden'
    gsap.to(track, { x: () => -(track.scrollWidth - vw()), ease: 'none', scrollTrigger: { trigger: section, pin: true, refreshPriority: 1, start: 'top top', end: () => `+=${track.scrollWidth - vw()}`, scrub: true, invalidateOnRefresh: true } })
  })
  return () => sections.forEach((s) => (s.style.overflow = ''))
})

// Pinned steps: the sticky photo shows the step in the middle of the screen. Content, not effect, so it runs under
// reduced motion too (the crossfade is CSS, motion-safe only).
all('[data-pinned]').forEach((sec) => {
  const pics = [...sec.querySelectorAll<HTMLElement>('[data-pin-pic]')]
  sec.querySelectorAll('[data-pin-step]').forEach((step, i) => ScrollTrigger.create({ trigger: step, start: 'top center', end: 'bottom center', onToggle: (st) => st.isActive && pics.forEach((p, j) => p.classList.toggle('opacity-0', j !== i)) }))
})
// Rail arrows: step the track by most of its width.
all('[data-rail]').forEach((rail) => {
  const track = rail.querySelector<HTMLElement>('[data-rail-track]')!
  const go = (dir: number) => track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' })
  rail.querySelector('[data-rail-prev]')?.addEventListener('click', () => go(-1))
  rail.querySelector('[data-rail-next]')?.addEventListener('click', () => go(1))
  rail.querySelector('[data-rail-buttons]')?.classList.replace('hidden', 'flex') // useless without JS
})
// Miles between two lat/lon points (haversine), for the ticket's "Near me" and the venues list.
const rad = (n: number) => (n * Math.PI) / 180
const miles = (a: number, b: number, c: number, d: number) => 7917.6 * Math.asin(Math.sqrt(Math.sin(rad(c - a) / 2) ** 2 + Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(rad(d - b) / 2) ** 2))
// Booking bar: an example site can't book, so it says so instead. Dates start today.
all<HTMLFormElement>('form[data-book]').forEach((form) => {
  const date = form.querySelector<HTMLInputElement>('input[type=date]')!
  const now = new Date()
  const iso = (t: Date) => [t.getFullYear(), t.getMonth() + 1, t.getDate()].map((n) => String(n).padStart(2, '0')).join('-') // local, not UTC
  date.min = date.value = iso(now)
  // The next four days as chips; the date field turns into an "Other date" chip that opens the browser's calendar.
  const days = form.querySelector('[data-book-days]'), other = form.querySelector<HTMLElement>('[data-book-other]')
  if (days && other) {
    const chip = 'relative cursor-pointer rounded-full border border-white/20 px-3.5 py-1.5 text-sm font-semibold tracking-normal whitespace-nowrap text-white normal-case transition-colors hover:border-(--accent) aria-pressed:border-(--accent) aria-pressed:bg-(--accent) aria-pressed:text-(--on-accent) focus-visible:outline-2 focus-visible:outline-(--accent) has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-(--accent)'
    const short = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric' })
    const label = other.querySelector('span')!
    const chips = [0, 1, 2, 3].map((i) => {
      const t = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i), b = document.createElement('button')
      b.type = 'button'; b.className = chip; b.dataset.date = iso(t); b.textContent = ['Tonight', 'Tomorrow'][i] ?? short.format(t)
      b.addEventListener('click', () => { date.value = b.dataset.date!; sync(); pop(b) })
      return b
    })
    const sync = () => {
      chips.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.date === date.value)))
      const picked = !chips.some((b) => b.dataset.date === date.value) && date.value
      other.setAttribute('aria-pressed', String(!!picked))
      label.textContent = picked ? short.format(new Date(`${date.value}T12:00`)) : 'Other date'
    }
    other.className = chip; label.hidden = false
    date.className = 'absolute inset-0 size-full cursor-pointer opacity-0'
    const pick = () => { try { date.showPicker() } catch {} }
    date.addEventListener('click', pick)
    date.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick() } }) // the field is invisible, so no typing into it blind
    date.addEventListener('change', sync)
    days.prepend(...chips); sync()
  }
  // Near me: distance to each venue, worked out here in the browser; nearest first and picked.
  const near = form.querySelector<HTMLButtonElement>('[data-book-near]'), row = form.querySelector('[data-book-venues]')
  row?.addEventListener('change', (e) => pop((e.target as HTMLElement).closest('label')!))
  if (near && row && 'geolocation' in navigator) {
    near.hidden = false
    near.addEventListener('click', () => {
      near.disabled = true
      const note = form.parentElement!.querySelector('[data-book-note]')!
      navigator.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lon } }) => {
        near.disabled = false
        const cards = ([...row.children] as HTMLElement[]).map((el) => ({ el, mi: miles(lat, lon, Number(el.dataset.lat), Number(el.dataset.lon)) })).sort((a, b) => a.mi - b.mi)
        if (!cards.length) return
        flip(row, () => { row.scrollTo({ left: 0 }); cards.forEach(({ el, mi }) => { row.append(el); el.querySelector('[data-book-dist]')!.textContent = ` · ${mi < 1 ? 'under a mile' : `${Math.round(mi).toLocaleString('en-GB')} mi`}` }) })
        const first = cards[0].el.querySelector('input')!
        first.checked = true
        pop(cards[0].el)
        note.textContent = `Nearest: ${first.value}.`
      }, (err) => {
        near.disabled = false
        note.textContent = err.code === err.PERMISSION_DENIED ? 'Location is off for this site. Pick a venue above.' : 'Couldn’t find you just now. Try again in a moment.'
      }, { timeout: 10000, maximumAge: 600000 })
    })
  }
  // Players: − and + around the number, kept within its min and max.
  const players = form.querySelector<HTMLInputElement>('input[name=players]')!
  form.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) => {
    b.hidden = false
    b.addEventListener('click', () => {
      const to = String(Math.min(+players.max, Math.max(+players.min, +players.value + +b.dataset.step!)))
      if (to === players.value) return void (reduced || players.animate([{ transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'none' }], { duration: 180 })) // at the limit: a nudge
      players.value = to
      if (!reduced) players.animate([{ transform: `translateY(${-+b.dataset.step! * 0.6}em)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }) // + comes up from below, − drops from above
    })
  })
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const venue = new FormData(form).get('venue')
    const note = form.parentElement!.querySelector('[data-book-note]')! // under the bar, outside the form
    note.textContent = '' // so pressing again is announced again
    requestAnimationFrame(() => { note.textContent = `This is an example site, so nothing gets booked. On a real one, the free bays at ${venue} would show here.`; rise([note]) })
  })
})
// The party enquiry: same date floor as the ticket, and an honest answer instead of sending anything.
all<HTMLFormElement>('form[data-enquiry]').forEach((form) => {
  const now = new Date()
  form.querySelector<HTMLInputElement>('input[type=date]')!.min = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, '0')).join('-')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const venue = new FormData(form).get('venue')
    const note = form.querySelector('[data-enquiry-note]')!
    note.textContent = ''
    requestAnimationFrame(() => note.textContent = `This is an example site, so nothing gets sent. On a real one, the host at ${venue} would get this and reply by email.`)
  })
})
// Tabs (live scores, menu): arrow keys move along, the chosen panel shows. Hidden without JS, when every panel shows.
const tabs = (list: HTMLElement, pick: (i: number) => void) => {
  list.classList.replace('hidden', 'flex')
  const btns = [...list.querySelectorAll<HTMLButtonElement>('[role=tab]')]
  let ready = false
  const go = (i: number, focus = false) => {
    btns.forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; document.getElementById(b.getAttribute('aria-controls')!)!.hidden = i !== j })
    if (focus) btns[i].focus()
    if (ready) rise([...document.getElementById(btns[i].getAttribute('aria-controls')!)!.querySelectorAll('li:not([hidden])')])
    ready = true
    pick(i)
    ScrollTrigger.refresh()
  }
  btns.forEach((b, i) => {
    b.addEventListener('click', () => go(i))
    b.addEventListener('keydown', (e) => { const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (k) go((i + k + btns.length) % btns.length, true) })
  })
  go(0)
}
const par = (s: number) => (s < 0 ? `−${-s}` : s === 0 ? 'E' : `+${s}`) // as kit/Live writes it
// Live scores: every few seconds a bay on the board in view finishes a hole, and the rows slide to their new places.
// Made-up play (kit/Live says so); pausable, and only ticking while on screen.
all('[data-live]').forEach((sec) => {
  const feed = sec.querySelector('[data-live-feed]')!
  const pause = sec.querySelector<HTMLButtonElement>('[data-live-pause]')!
  const names = [...sec.querySelectorAll('[role=tab]')].map((b) => b.textContent)
  let board = 0, seen = false, paused = false
  tabs(sec.querySelector('[data-live-tabs]')!, (i) => board = i)
  pause.classList.replace('hidden', 'flex')
  pause.addEventListener('click', () => { paused = !paused; pause.setAttribute('aria-pressed', String(paused)); pause.querySelector('[data-live-pause-label]')!.textContent = paused ? 'Play' : 'Pause' })
  new IntersectionObserver(([e]) => seen = e.isIntersecting).observe(sec)
  setInterval(() => {
    if (paused || !seen || document.hidden) return
    const list = sec.querySelectorAll('[data-live-board] ol')[board]
    const rows = [...list.children] as HTMLElement[]
    let open = rows.filter((r) => Number(r.dataset.thru) < 9)
    if (!open.length) { rows.forEach((r) => { r.dataset.thru = '0'; r.dataset.score = '0' }); open = rows } // round over, next teams on
    const row = open[Math.floor(Math.random() * open.length)]
    const roll = Math.random(), delta = roll < 0.05 ? -2 : roll < 0.35 ? -1 : roll < 0.8 ? 0 : 1
    const thru = Number(row.dataset.thru) + 1, score = Number(row.dataset.score) + delta
    Object.assign(row.dataset, { thru: String(thru), score: String(score) })
    const before = new Map(rows.map((r) => [r, r.getBoundingClientRect().top]))
    rows.sort((a, b) => Number(a.dataset.score) - Number(b.dataset.score) || Number(b.dataset.thru) - Number(a.dataset.thru)).forEach((r, i) => {
      list.append(r)
      r.querySelector('[data-live-pos]')!.textContent = String(i + 1)
      r.querySelector('[data-live-thru]')!.textContent = r.dataset.thru!
      const cell = r.querySelector<HTMLElement>('[data-live-score]')!
      cell.textContent = par(Number(r.dataset.score))
      cell.classList.toggle('text-(--accent)', Number(r.dataset.score) < 0)
    })
    feed.textContent = `${row.dataset.team}: ${['eagle', 'birdie', 'par', 'bogey'][delta + 2]} on ${thru} at ${names[board]}`
    if (reduced) return
    rows.forEach((r) => { const dy = before.get(r)! - r.getBoundingClientRect().top; if (dy) r.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }) })
    row.querySelector('[data-live-score]')!.animate([{ background: 'var(--accent)', color: 'var(--on-accent)' }, {}], { duration: 1400, easing: 'ease-out' })
  }, 2500)
})
// Tournaments: time to the next one, counted in UK time wherever you are. By the minute.
const countdowns = all('[data-countdown]')
if (countdowns.length) {
  const tick = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]))
    const now = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday) * 1440 + Number(p.hour) * 60 + Number(p.minute)
    countdowns.forEach((el) => {
      const [h, m] = el.dataset.time!.split(':').map(Number)
      const left = (((Number(el.dataset.day) * 1440 + h * 60 + m - now) % 10080) + 10080) % 10080 // ponytail: a week of minutes; out by an hour across a clock change
      const [dd, hh, mm] = [Math.floor(left / 1440), Math.floor((left % 1440) / 60), left % 60]
      el.textContent = left < 120 ? (left ? `Starts in ${hh ? `${hh}h ` : ''}${mm}m` : 'Starting now') : `Next in ${dd ? `${dd}d ` : ''}${hh}h ${mm}m`
    })
  }
  tick()
  setInterval(tick, 30000)
}
// Prices: the slider splits each bay's price between however many of you there are; the numbers roll the way it moved.
all('[data-prices]').forEach((sec) => {
  const range = sec.querySelector<HTMLInputElement>('[data-prices-range]')!
  const n = sec.querySelector<HTMLElement>('[data-prices-n]')!
  const cards = all('[data-price]').filter((c) => sec.contains(c))
  let was = Number(range.value)
  const roll = (el: Element, up: boolean) => reduced || el.animate([{ transform: `translateY(${up ? '-' : ''}0.5em)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 280, easing: ease })
  range.addEventListener('input', () => {
    const k = Number(range.value)
    if (k === was) return
    n.textContent = String(k)
    range.setAttribute('aria-valuetext', `${k} player${k > 1 ? 's' : ''}`)
    roll(n, k > was)
    cards.forEach((c) => {
      const each = c.querySelector('[data-prices-each]')!
      each.textContent = `£${(Number(c.dataset.price) / k).toFixed(2).replace(/\.00$/, '')}`
      c.querySelector('[data-prices-with]')!.textContent = k > 1 ? ` with ${k}` : ' on your own'
      roll(each, k < was) // more players, smaller share: it drops in from above
    })
    sec.querySelector('[data-prices-say]')!.textContent = cards.map((c) => `${c.querySelector('h3')!.textContent} ${c.querySelector('[data-prices-each]')!.textContent} each`).join(', ')
    was = k
  })
})
// Menu: one for every venue. The venue picked drops what it doesn't serve; a tab per list, the photo follows it, and
// diet filters hide what doesn't fit (vegan counts as vegetarian).
all('[data-menu]').forEach((sec) => {
  const lists = all('[data-menu-list]').filter((l) => sec.contains(l))
  sec.querySelectorAll('[data-menu-heading]').forEach((h) => h.classList.add('sr-only'))
  sec.querySelectorAll('[data-menu-only]').forEach((o) => o.remove()) // the venue picker says it instead
  tabs(sec.querySelector('[data-menu-tabs]')!, (i) => sec.querySelectorAll('[data-menu-pic]').forEach((p, j) => p.classList.toggle('opacity-0', i !== j)))
  const pickVenue = sec.querySelector<HTMLElement>('[data-menu-venue]')!
  const venue = pickVenue.querySelector('select')!
  pickVenue.classList.replace('hidden', 'flex')
  const bar = sec.querySelector<HTMLElement>('[data-menu-diets]')!
  bar.classList.replace('hidden', 'flex')
  const btns = [...bar.querySelectorAll<HTMLButtonElement>('[data-diet]')]
  const apply = () => {
    const want = btns.filter((x) => x.getAttribute('aria-pressed') === 'true').map((x) => x.dataset.diet!)
    const has = venue.selectedOptions[0].dataset.has!.split('|')
    lists.forEach((l) => {
      const open = !l.dataset.needs || has.includes(l.dataset.needs)
      const items = [...l.querySelectorAll<HTMLElement>('[data-tags]')]
      items.forEach((it) => {
        const tags = it.dataset.tags!.split(' ')
        it.hidden = !open || (!!it.dataset.only && !it.dataset.only.split('|').includes(venue.value)) || !want.every((w) => tags.includes(w) || (w === 'V' && tags.includes('VG')))
      })
      const empty = l.querySelector<HTMLElement>('[data-menu-empty]')!
      empty.hidden = items.some((it) => !it.hidden)
      empty.textContent = open ? 'Nothing on this list fits. Try another tab, or clear the filter.' : `No kitchen at ${venue.value}, so it’s drinks only. Food’s welcome from next door.`
    })
    ScrollTrigger.refresh()
  }
  const shown = () => rise(lists.filter((l) => !l.hidden).flatMap((l) => [...l.querySelectorAll('li:not([hidden]), [data-menu-empty]:not([hidden])')]))
  venue.addEventListener('change', () => { apply(); shown() })
  btns.forEach((b) => b.addEventListener('click', () => { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); apply(); pop(b); shown() }))
  apply()
})
// Venues: distance from you, in the browser only. Sorts the list, marks the nearest and puts you on the map.
all('[data-venues]').forEach((sec) => {
  const geo = sec.querySelector<HTMLElement>('[data-geo]')!
  if (!('geolocation' in navigator)) return
  geo.classList.replace('hidden', 'flex')
  const go = geo.querySelector<HTMLButtonElement>('[data-geo-go]')!
  const note = geo.querySelector('[data-geo-note]')!
  const list = sec.querySelector('[data-geo-list]')!
  go.addEventListener('click', () => {
    go.disabled = true
    note.textContent = 'Finding you…'
    navigator.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lon } }) => {
      go.disabled = false
      const rows = ([...list.children] as HTMLElement[]).map((li) => ({ li, mi: miles(lat, lon, Number(li.dataset.lat), Number(li.dataset.lon)) })).sort((a, b) => a.mi - b.mi)
      flip(list, () => rows.forEach(({ li }) => list.append(li)))
      rows.forEach(({ li, mi }, i) => {
        li.querySelector('[data-geo-dist]')!.textContent = mi < 1 ? 'Under a mile' : `${Math.round(mi).toLocaleString('en-GB')} miles`
        li.querySelector<HTMLElement>('[data-geo-near]')!.hidden = i > 0
      })
      note.textContent = `Nearest: ${rows[0].li.querySelector('h3')!.textContent}, ${rows[0].mi < 1 ? 'under a mile' : `${Math.round(rows[0].mi).toLocaleString('en-GB')} miles`} away.`
      // You on the map, held to its edge when you're off it, with a line to the nearest.
      const map = sec.querySelector<SVGSVGElement>('[data-geo-map]')!
      const box = JSON.parse(map.dataset.box!)
      const W = box.w * box.k * 100, H = box.h * 100
      const x = Math.min(W, Math.max(0, (lon - box.lon) * box.k * 100)), y = Math.min(H, Math.max(0, (box.lat - lat) * 100))
      const near = rows[0].li.dataset
      const you = map.querySelector<SVGGElement>('[data-geo-you]')!
      you.removeAttribute('hidden')
      you.querySelector('[data-geo-dot]')!.setAttribute('cx', String(x))
      you.querySelector('[data-geo-dot]')!.setAttribute('cy', String(y))
      Object.entries({ x1: x, y1: y, x2: (Number(near.lon) - box.lon) * box.k * 100, y2: (box.lat - Number(near.lat)) * 100 }).forEach(([k, v]) => you.querySelector('[data-geo-line]')!.setAttribute(k, String(v)))
      const label = you.querySelector('[data-geo-label]')!
      label.setAttribute('x', String(x > W * 0.6 ? x - 12 : x + 12))
      label.setAttribute('y', String(y + 4))
      label.setAttribute('text-anchor', x > W * 0.6 ? 'end' : 'start')
      ScrollTrigger.refresh()
    }, (err) => {
      go.disabled = false
      note.textContent = err.code === err.PERMISSION_DENIED ? 'Location is off for this site, so here they are in the usual order.' : 'Couldn’t find you just now. Try again in a moment.'
    }, { timeout: 10000, maximumAge: 600000 })
  })
})
// "Book" picks that venue on the ticket on the way back up.
all('[data-book-venue]').forEach((a) => a.addEventListener('click', () => {
  const radio = [...document.querySelectorAll<HTMLInputElement>('form[data-book] input[name=venue]')].find((r) => r.value === a.dataset.bookVenue)
  if (!radio) return
  radio.checked = true
  const card = radio.closest('label')!
  setTimeout(() => { // after the jump to #book: bring the card into its row (phones scroll it sideways), and answer the pick
    const row = card.parentElement!
    row.scrollTo({ left: card.offsetLeft - row.offsetLeft - 4, behavior: reduced ? 'auto' : 'smooth' })
    radio.focus({ preventScroll: true })
    pop(card)
  }) // after the jump to #book, which would drop it; keyboard users land where the page went
}))
// Ball count: worked out from the clock (kit/Counter has the start and rate), so a reload doesn't go backwards. Each
// tile whose digit changes flips. Pausable, and only ticking while on screen.
all('[data-count]').forEach((sec) => {
  const [base, from, every] = ['count', 'countFrom', 'countEvery'].map((k) => Number(sec.dataset[k]))
  const text = sec.querySelector('[data-count-text]')!, tiles = sec.querySelector<HTMLElement>('[data-count-tiles]')!
  const pause = sec.querySelector<HTMLButtonElement>('[data-count-pause]')!
  let seen = false, paused = false
  pause.hidden = false
  pause.addEventListener('click', () => { paused = !paused; pause.textContent = paused ? 'Play' : 'Pause' })
  new IntersectionObserver(([e]) => seen = e.isIntersecting).observe(sec)
  const tick = (flip = true) => {
    const n = (base + Math.floor((Date.now() - from) / every)).toLocaleString('en-GB')
    if (n === text.textContent) return
    text.textContent = n
    let cells = [...tiles.children] as HTMLElement[]
    if (cells.length !== n.length) { // a digit more than at build time: tiles cut from the ones there
      const [tile, comma] = [cells.find((c) => c.firstElementChild)!, cells.find((c) => !c.firstElementChild)!]
      tiles.replaceChildren(...[...n].map((ch) => (ch === ',' ? comma : tile).cloneNode(true) as HTMLElement))
      cells = [...tiles.children] as HTMLElement[]
    }
    ;[...n].forEach((ch, i) => {
      const digit = cells[i].firstElementChild
      if (!digit || digit.textContent === ch) return
      digit.textContent = ch
      if (flip && !reduced) digit.animate([{ transform: 'rotateX(90deg)', opacity: 0.4 }, { transform: 'none', opacity: 1 }], { duration: 350, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' })
    })
  }
  tick(false) // catching up from build time: no flip for that
  const since = sec.querySelector('[data-count-since]'), arrived = Date.now()
  if (since) since.textContent = 'Live'
  setInterval(() => { if (since && seen && !paused && !document.hidden) since.textContent = `+${Math.floor((Date.now() - arrived) / every).toLocaleString('en-GB')} since you got here` }, 1000)
  setInterval(() => { if (seen && !paused && !document.hidden) tick() }, 1000)
})
// Cookie banner: looks the part, sets nothing. Any choice puts it away. Not inside the home's preview window.
const cookies = document.getElementById('cookies')
if (cookies && self === top) {
  const prefs = document.getElementById('cookies-prefs')!
  const more = cookies.querySelector<HTMLButtonElement>('[data-cookies-more]')!
  const close = () => {
    document.getElementById('main')!.focus({ preventScroll: true }) // focus was in the banner; don't leave it on <body>
    if (reduced) return void (cookies.hidden = true)
    cookies.animate([{}, { transform: 'translateY(1.5rem)', opacity: 0 }], { duration: 300, easing: 'ease-in', fill: 'forwards' }).finished.then(() => cookies.hidden = true)
  }
  setTimeout(() => {
    cookies.hidden = false
    if (!reduced) cookies.animate([{ transform: 'translateY(1.5rem)', opacity: 0 }, {}], { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' })
  }, 1500)
  more.addEventListener('click', () => {
    if (!prefs.hidden) return close() // second press saves what's switched
    prefs.hidden = false
    more.setAttribute('aria-expanded', 'true')
    more.textContent = 'Save choices'
  })
  cookies.querySelectorAll<HTMLButtonElement>('[data-cookies-done]').forEach((b) => b.addEventListener('click', () => {
    prefs.querySelectorAll<HTMLInputElement>('input:not(:disabled)').forEach((i) => i.checked = b.dataset.cookiesDone === 'all')
    close()
  }))
}

// Fonts change line breaks and heights: re-measure once they're in.
document.fonts.ready.then(() => ScrollTrigger.refresh())
