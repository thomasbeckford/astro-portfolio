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
  // Collage photos drifting at their own speed.
  all('[data-speed]').forEach((el) => {
    const d = parseFloat(el.dataset.speed!) * 120
    gsap.fromTo(el, { y: d }, { y: -d, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } })
  })
  // Hero name: letters rise in one by one.
  all('[data-letters]').forEach((el) => {
    SplitText.create(el, { type: 'words,chars', mask: 'chars', onSplit: (s) => gsap.from(s.chars, { yPercent: 110, rotate: 6, duration: 1.1, ease: 'expo.out', stagger: 0.05, delay: parseFloat(el.dataset.delay ?? '0.15') }) })
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
