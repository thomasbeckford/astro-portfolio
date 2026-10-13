# Rediseño del home: showcase futurista

Fecha: 2026-10-12 · Estado: borrador para revisión · Proyecto: tebeck (sitio de Thomas Beckford)

## 1. Objetivo

El home pasa de sitio "básico" a showcase de producto: que se vea como trabajo de alguien
que sabe lo que hace. Las landings `/websites-for-*` siguen sobrias y pensadas para convertir.

Decisiones ya tomadas con Thomas:
- Rol: **C**. Home = showcase. Landings = conversión, sin cambio de estilo.
- Hero: **teléfono 3D** que cambia de trade al scrollear, más **titular animado** (SplitText).
- Dirección: **futurista oscuro** (fondo casi negro, grilla fina, mono en etiquetas, el color
  de cada trade como glow).
- Contenido: **B**. Mismo copy validado, re-escenificado, con recortes. Cookie se restiliza.

Criterios de éxito (medibles):
- Mobile (390px, 4G simulado): LCP < 2.5 s, Lighthouse performance ≥ 90.
- CTA de WhatsApp o mail visible sin scrollear, en mobile y desktop.
- Cero contenido nuevo inventado. El copy sale del actual o de una propuesta explícita de Thomas.
- `prefers-reduced-motion`: todo se ve completo y legible sin animación.

## 2. Principios de implementación

- Mismo stack: Astro, Tailwind 4, sin frameworks de UI.
- Sin three.js ni WebGL. El teléfono 3D es CSS (`perspective`, `transform-style: preserve-3d`).
- Animación con **GSAP + ScrollTrigger + SplitText** (gratis desde la adquisición de Webflow).
  Es la única dependencia nueva: `gsap`, con pnpm.
- JS solo en el home. Las landings siguen siendo HTML estático sin scripts.
- Sin cookies ni terceros. El sitio no pide consentimiento y debe seguir así.
- El texto es HTML real. SplitText no puede dejar el titular solo en JS. Va con `aria-label`
  para lectores de pantalla y para SEO.

## 3. Hero

- **Titular**: frase grande con SplitText, entrada por línea o por letra. Se dispara una vez.
- **Teléfono 3D**: `TradeSite` dentro de un marco CSS 3D. Con scroll (ScrollTrigger `scrub`)
  rota ~20° y hace zoom leve. Al pasar cada tramo cambia de trade (Electrician, Plumber, Roofer…)
  y la página cambia el acento a ese color.
- **Form "probá tu sitio"**: vive en el hero. Al escribir trade y nombre, el teléfono se
  personaliza y gira hacia el resultado. Mantiene `#try-site`, `data-k` y `data-trade`.
- **CTA**: WhatsApp y mail arriba, siempre visibles. El badge fijo actual se mantiene.
- **Mobile**: el teléfono no hace scrub pesado. Un giro de entrada y, después, cambio de trade
  al tocar. (Se confirma en el plan con medición.)

## 4. Secciones (propuesta B)

| Sección actual | Propuesta | Notas |
|---|---|---|
| Hero (form + Cookie) | Hero 3D + form | Ver §3 |
| Track record + marquee | Una sola franja fina | Se quita el marquee si no aporta. Pendiente de Thomas |
| `#how` (3 pasos + garantía) | Sección pinned: un paso por pantalla | Garantía en una línea, mismo copy |
| `#services` | 3 cards con precio | Mismo copy y precios |
| Banner "No tracking cookies" | Nota en FAQ o footer | Se elimina como bloque propio. Pendiente de Thomas |
| `#work` | Cards de sitios **reales** | Nada de demos con reseñas falsas (ver §8) |
| `#about` | Texto + foto, con entrada en reveal | Mismo copy |
| `#faq` "Ask Cookie" | Cookie restilizado + FAQ | Ver §5 |
| Contacto | Igual, con estilo nuevo | Sin cambio de copy |

## 5. Cookie restilizado

- Mismo personaje, mismas frases (`try-quip` y FAQ). Cambia solo el estilo: contorno de
  neón o look holográfico con la paleta oscura.
- Reacciona al cursor (leve inclinación) y al scroll. En mobile y con reduced-motion, estático.
- Sin cambio de copy. Sin cambio de nombre.

## 6. Movimiento y accesibilidad

- `prefers-reduced-motion: reduce`: no hay scrub ni SplitText animado. Estados finales directos.
- Todo el texto legible sin JS. Si GSAP falla, el sitio sigue mostrando contenido.
- Contraste AA sobre fondo oscuro. Acentos por trade revisados contra el fondo.
- Foco visible en todos los controles.

## 7. Performance y presupuesto

- Medir antes y después: JS de la home, LCP, CLS, INP en mobile.
- Hipótesis 🤔: GSAP + ScrollTrigger + SplitText ≈ 40–50 KB gzip. Se confirma con build.
- Imágenes con `astro:assets` y tamaños explícitos. Sin video.
- Si el teléfono 3D empeora LCP, se reduce el efecto antes de sacar la idea.

## 8. Restricciones heredadas

- Sin datos falsos: fechas, reseñas, métricas o clientes inventados. Los PNG de demo con reseñas
  falsas ya se quitaron por eso y no vuelven.
- Dominio actual `tebeck.vercel.app` (cambio pendiente, no bloquea este trabajo).
- Estilo de código y lint del repo (`eslint` vía `rtk proxy pnpm exec eslint`).

## 9. Fuera de alcance

- Video generado (no hay video real en este flujo; ver conversación).
- three.js o WebGL.
- Cambios de copy o de precios.
- Cambios en las landings, salvo el nav compartido si hace falta.
- Dominio, garantía post-lanzamiento y cualquier decisión de negocio pendiente.

## 10. Prerrequisito

Los cambios sin commitear (landings, garantía, refactor de `TradeSite`) se commitean o se
separan **antes** de empezar. Así el rediseño queda en su propio diff.

## 11. Verificación

- `pnpm build` limpio, y lint limpio.
- Playwright: 390px y 1440px, sin scroll horizontal, con capturas de cada sección.
- Prueba de reduced-motion (`browser_emulate_media`).
- Lighthouse mobile antes y después.
- Revisión por subagente independiente (bugs, regresiones, accesibilidad, SEO).

## 12. Preguntas abiertas (para Thomas)

1. ¿Commiteamos la base actual antes de arrancar? (Sección 10.)
2. ¿Se va el marquee y el banner de cookies, o los mantenemos?
3. ¿Dominio nuevo antes del lanzamiento o después?
4. Garantía post-lanzamiento: duración y exclusiones (sigue pendiente).
