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
    const tl = gsap.timeline({ paused: true, repeat: sites.length - 1, repeatDelay: 0.2, repeatRefresh: true, defaults: { ease: 'power2.inOut' } })
    // Fade out whatever shows (the live site from the markup, or the last loop's) before painting the next one.
    tl.to(card, { autoAlpha: 0, duration: 0.4 })
      .call(() => { i = (i + 1) % sites.length; show(sites[i]); input.textContent = old; label.textContent = 'Publish changes' })
      .set(site, { autoAlpha: 0 }).set(panel, { autoAlpha: 1 })
      .set(btn, { backgroundColor: 'rgba(0,0,0,0.1)', color: '#222' }).set(field, { boxShadow: '0 0 0 0px #2563eb' })
      .set(live, { boxShadow: '0 0 0 0em transparent' })
      .set(cursor, { autoAlpha: 0, scale: 1, x: () => st.offsetWidth * 0.75, y: () => st.offsetHeight * 0.9 })
      .fromTo(card, { yPercent: -8, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', immediateRender: false })
      .fromTo(st.querySelectorAll('[data-pd-row]'), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.4 }, '-=0.2')
      .to(cursor, { autoAlpha: 1, duration: 0.2 })
      .to(cursor, { x: () => at(field, 0.7).x, y: () => at(field, 0.7).y, duration: 0.9 })
      .call(click)
      .set(field, { boxShadow: '0 0 0 2px #2563eb' }, '+=0.15')
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
  // Enquiry alerts (LeadDemo): a tap on WhatsApp, the phone pings, the row lands in the sheet, three days on the reminder
  // comes, the row is marked Won. Same cursor and offset helper as the publish demo.
  all('[data-leads]').forEach((st) => {
    const q = (s: string) => st.querySelector<HTMLElement>(s)!
    const site = q('[data-ld-site]'), sheet = q('[data-ld-sheet]'), wa = q('[data-ld-wa]'), row = q('[data-ld-row]'), status = q('[data-ld-status]')
    const ping = q('[data-ld-note="ld-ping"]'), nudge = q('[data-ld-note="ld-nudge"]'), later = q('[data-ld-later]'), cursor = q('[data-ld-cursor]')
    const at = (el: HTMLElement, fx = 0.5, fy = 0.5) => {
      let x = el.offsetWidth * fx, y = el.offsetHeight * fy, e: HTMLElement | null = el
      while (e && e !== st) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent as HTMLElement | null }
      return { x, y }
    }
    const click = () => gsap.to(cursor, { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1 })
    const mark = (won: boolean) => { status.textContent = won ? 'Won' : 'New'; gsap.set(status, { backgroundColor: won ? '#dcfce7' : '#fef3c7', color: won ? '#166534' : '#92400e' }) }
    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.2, repeatRefresh: true, defaults: { ease: 'power2.inOut' } })
    tl.to([sheet, ping], { autoAlpha: 0, duration: 0.4 })
      .call(() => mark(false))
      .set([row, nudge, later], { autoAlpha: 0 }).set(row, { backgroundColor: 'rgba(29,78,216,0)' })
      .set(cursor, { autoAlpha: 0, scale: 1, x: () => st.offsetWidth * 0.8, y: () => st.offsetHeight * 0.95 })
      .to(site, { autoAlpha: 1, duration: 0.5 })
      .to(cursor, { autoAlpha: 1, duration: 0.2 })
      .to(cursor, { x: () => at(wa, 0.6).x, y: () => at(wa, 0.6).y, duration: 0.9 })
      .call(click)
      // The owner's side: the sheet with the ping dropping in, then the new row.
      .to(cursor, { autoAlpha: 0, duration: 0.2 }, '+=0.3')
      .to(site, { autoAlpha: 0, duration: 0.4 }, '<')
      .to(sheet, { autoAlpha: 1, duration: 0.4 }, '<')
      .fromTo(ping, { y: '-1.5em', autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.6)', immediateRender: false }, '+=0.2')
      .fromTo(row, { x: '-1em', autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', immediateRender: false }, '+=0.3')
      .to(row, { backgroundColor: 'rgba(29,78,216,0.08)', duration: 0.3 }, '<')
      .to(ping, { y: '-1.5em', autoAlpha: 0, duration: 0.4 }, '+=1.6')
      // Nobody replied: three days on, the 9:00 reminder.
      .fromTo(later, { scale: 0.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, immediateRender: false }, '+=0.3')
      .to(later, { autoAlpha: 0, duration: 0.3 }, '+=1')
      .fromTo(nudge, { y: '-1.5em', autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.6)', immediateRender: false })
      .to(nudge, { y: '-1.5em', autoAlpha: 0, duration: 0.4 }, '+=1.6')
      // They call back, and mark it.
      .set(cursor, { x: () => at(status).x + 40, y: () => at(status).y + 50 })
      .to(cursor, { autoAlpha: 1, duration: 0.2 })
      .to(cursor, { x: () => at(status).x, y: () => at(status).y, duration: 0.7 })
      .call(click)
      .call(() => mark(true), [], '+=0.1')
      .to(row, { backgroundColor: 'rgba(22,163,74,0.08)', duration: 0.3 }, '<')
      .to(cursor, { autoAlpha: 0, duration: 0.3 }, '+=0.4')
      .to({}, { duration: 1.4 })
    ScrollTrigger.create({ trigger: st, start: 'top 90%', end: 'bottom 10%', onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) })
    cleanups.push(() => { status.textContent = 'New'; status.removeAttribute('style') })
  })
  // Dashboards (DashDemo): the cursor picks "This month", the answers count up from 0, the bars grow, the late invoice lights up.
  all('[data-dash]').forEach((st) => {
    const q = (s: string) => st.querySelector<HTMLElement>(s)!
    const week = q('[data-dd-week]'), month = q('[data-dd-month]'), cursor = q('[data-dd-cursor]'), late = q('[data-dd-card="late"]')
    const nums = [...st.querySelectorAll<HTMLElement>('[data-dd-num]')], bars = [...st.querySelectorAll<HTMLElement>('[data-dd-bar]')]
    const at = (el: HTMLElement, fx = 0.5, fy = 0.5) => {
      let x = el.offsetWidth * fx, y = el.offsetHeight * fy, e: HTMLElement | null = el
      while (e && e !== st) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent as HTMLElement | null }
      return { x, y }
    }
    const show = (n: HTMLElement, v: number) => (n.textContent = v.toLocaleString('en-GB', { minimumFractionDigits: +n.dataset.dp!, maximumFractionDigits: +n.dataset.dp! }))
    const pick = (on: HTMLElement, off: HTMLElement) => { gsap.set(on, { backgroundColor: '#fff', color: '#18181b', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,.08)' }); gsap.set(off, { backgroundColor: 'rgba(255,255,255,0)', color: 'rgba(0,0,0,.5)', fontWeight: 400, boxShadow: 'none' }) }
    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.2, repeatRefresh: true, defaults: { ease: 'power2.inOut' } })
    tl.call(() => { pick(week, month); nums.forEach((n) => show(n, 0)) })
      .set(bars, { scaleY: 0.04 }).set(late, { boxShadow: '0 0 0 0 rgba(217,119,6,0)' })
      .set(cursor, { autoAlpha: 0, scale: 1, x: () => st.offsetWidth * 0.55, y: () => st.offsetHeight * 0.9 })
      .to(cursor, { autoAlpha: 1, duration: 0.2 }, '+=0.4')
      .to(cursor, { x: () => at(month, 0.5).x, y: () => at(month, 0.6).y, duration: 0.9 })
      .to(cursor, { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1 })
      .call(() => pick(month, week))
      .to(cursor, { autoAlpha: 0, duration: 0.3 }, '+=0.2')
      .to(bars, { scaleY: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '<')
    nums.forEach((n) => { const o = { v: 0 }; tl.fromTo(o, { v: 0 }, { v: +n.dataset.ddNum!, duration: 1.2, ease: 'power2.out', onUpdate: () => show(n, o.v) }, '<') })
    tl.to(late, { boxShadow: '0 0 0 .25em rgba(217,119,6,.35)', duration: 0.4, yoyo: true, repeat: 3 }, '+=0.3')
      .to({}, { duration: 2 })
    ScrollTrigger.create({ trigger: st, start: 'top 90%', end: 'bottom 10%', onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) })
    cleanups.push(() => { nums.forEach((n) => show(n, +n.dataset.ddNum!)); [week, month].forEach((e) => e.removeAttribute('style')) })
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
  // Hero name: letters rise in one by one.
  all('[data-letters]').forEach((el) => {
    SplitText.create(el, { type: 'words,chars', mask: 'chars', onSplit: (s) => {
      el.style.visibility = 'visible' // a page may hold it hidden until now, so it never flashes whole
      const t = gsap.from(s.chars, { paused: true, yPercent: 110, rotate: 6, duration: 1.1, ease: 'expo.out', stagger: 0.05, delay: parseFloat(el.dataset.delay ?? (document.querySelector('[data-curtain]') ? '0.7' : '0.15')) }) // wait out the curtain
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

// Fonts change line breaks and heights: re-measure once they're in.
document.fonts.ready.then(() => ScrollTrigger.refresh())
