// Drawn grass for the golf demo (kit/Grass, kit/Clubhouse) as SVG paths, built at build time from a seed so every build
// draws the same blades. Units are the SVG's own (viewBox).
export const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const f = (n: number) => n.toFixed(1)
// A strip of grass w wide and h tall: thin blades of varying height, each bending over a little towards its tip.
export const grass = (r: () => number, w: number, h: number, count: number) => {
  let d = ''
  for (let i = 0; i < count; i++) {
    const x = (i / count) * w + r() * (w / count), bh = h * (0.35 + r() * 0.65), lean = (r() - 0.5) * bh * 0.7, bw = 1.2 + r() * 2.4
    d += `M${f(x - bw)} ${h}Q${f(x - bw * 0.5 + lean * 0.2)} ${f(h - bh * 0.6)} ${f(x + lean)} ${f(h - bh)}Q${f(x + bw * 0.5 + lean * 0.2)} ${f(h - bh * 0.55)} ${f(x + bw)} ${h}Z`
  }
  return d
}
