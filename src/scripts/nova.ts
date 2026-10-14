// Nova example: the "next Friday" dates, countdown, sticky nav and trailer dialog. The page renders the dates at
// build time with the same function and this script refreshes them in the visitor's clock, so the demo never goes stale.

// The show runs 9pm to 3am, so it stays "this" Friday until 3am Saturday.
export const nextFriday = (now = new Date()) => {
  const d = new Date(now.getTime() - 6 * 3600e3)
  d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7))
  d.setHours(21, 0, 0, 0)
  if (now.getTime() > d.getTime() + 6 * 3600e3) d.setDate(d.getDate() + 7)
  return d
}
export const fmt = {
  long: (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), // Fri, Oct 16
  label: (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // Oct 16
}
// The venue's clock: a Date whose fields read London wall time, so "9pm Friday" means London's for every visitor.
// ponytail: wall-time diff is off by an hour only across a DST change, and those land on Sundays.
export const londonNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }))
// Friday itself, or the small hours after it while the show is still on.
export const tonight = (now: Date, fri: Date) => now.toDateString() === fri.toDateString() || now > fri

export function init() {
  const dates = (now: Date, fri: Date) => {
    document.querySelectorAll<HTMLElement>('[data-date]').forEach((el) => {
      const d = new Date(fri)
      d.setDate(d.getDate() + Number(el.dataset.date))
      el.textContent = fmt[el.dataset.fmt as keyof typeof fmt](d)
    })
    const when = document.querySelector<HTMLElement>('[data-when]')
    if (when) when.textContent = tonight(now, fri) ? 'Tonight' : 'This Friday'
  }
  let fri = nextFriday(londonNow())
  dates(londonNow(), fri)

  // Countdown to doors, by the minute. Past 9pm it says so; after the show it rolls on to next week.
  const cd = document.querySelector<HTMLElement>('[data-countdown]')
  if (cd) {
    const tick = () => {
      const now = londonNow()
      const f = nextFriday(now)
      if (f.getTime() !== fri.getTime()) dates(now, (fri = f))
      const m = Math.max(0, Math.ceil((fri.getTime() - now.getTime()) / 60e3))
      cd.querySelectorAll<HTMLElement>('[data-unit]').forEach((u) => {
        const v = { d: Math.floor(m / 1440), h: Math.floor(m / 60) % 24, m: m % 60 }[u.dataset.unit as 'd' | 'h' | 'm']
        u.textContent = String(v).padStart(2, '0')
      })
      cd.toggleAttribute('data-live', m === 0)
    }
    tick()
    setInterval(tick, 30e3)
  }

  // Header turns to glass once the page moves.
  const head = document.querySelector<HTMLElement>('[data-head]')
  if (head) {
    const stick = () => head.toggleAttribute('data-stuck', scrollY > 40)
    stick()
    addEventListener('scroll', stick, { passive: true })
  }

  // Trailer: native dialog, closes on the backdrop too, and never keeps playing hidden.
  const dlg = document.querySelector<HTMLDialogElement>('#trailer')
  if (dlg) {
    const vid = dlg.querySelector('video')!
    document.querySelectorAll('[data-trailer]').forEach((b) => b.addEventListener('click', () => { dlg.showModal(); vid.play().catch(() => {}) }))
    // Backdrop closes it, but not the end of a drag that started on the video's timeline.
    let down: EventTarget | null = null
    dlg.addEventListener('pointerdown', (e) => (down = e.target))
    dlg.addEventListener('click', (e) => e.target === dlg && down === dlg && dlg.close())
    dlg.addEventListener('close', () => vid.pause())
  }
}
