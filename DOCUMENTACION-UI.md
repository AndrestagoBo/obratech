# ObraTech — Documentación de la interfaz gráfica

Sistema visual de la web pública y el panel admin. Fuente de verdad: `app/globals.css` y los componentes en `components/`.

Para ver el sitio **sin chat ni formulario**: [http://localhost:3000/diseno](http://localhost:3000/diseno).

La documentación de producto y APIs está en [DOCUMENTACION.md](./DOCUMENTACION.md). El asesor: [DOCUMENTACION-CHAT.md](./DOCUMENTACION-CHAT.md). El panel: [DOCUMENTACION-ADMIN.md](./DOCUMENTACION-ADMIN.md).

---

## 1. Principio

ObraTech se ve **oscura, geométrica y escasa**. Negro casi puro, blanco, y **un solo acento**: naranja quemado. El naranja es el botón “Cuéntanos qué necesitas”. WhatsApp va en botón secundario.

No hay bordes redondeados grandes, sombras suaves tipo SaaS, ni púrpura. Es obra / hogar, no fintech.

| Hacer | No hacer |
|--------|----------|
| Negro, blanco, naranja | Más de un color de marca |
| Tipografía grande y corta | Párrafos largos en títulos |
| Foto a sangre con velo negro | Foto plana sin contraste de texto |
| Un CTA naranja + WhatsApp en ghost | Varios botones naranja en la misma vista |
| Paneles sólidos `#111` | Cards con sombra y radio 16px |
| Asesor y, en el teléfono, barra inferior | Un botón flotante de WhatsApp |

---

## 2. Marca

**Nombre:** Obra**Tech** — “Obra” en blanco, “Tech” en naranja (`text-brand`).

**Logo** (`components/logo.tsx`):
- Archivo real: `public/images/logo.png` (icono 3D naranja/blanco + “ObraTech” + “BOGOTÁ” + tagline).
- Fondo negro en el PNG. En header/footer se usa `mix-blend-lighten` para que el negro desaparezca: **solo funciona sobre fondo oscuro**. Por eso el header es `bg-black/90`, no glass transparente.
- `withText` está en el tipo pero **no se usa**: siempre se pinta el PNG completo.
- Altura actual: `h-10` / `md:h-11`, `width: auto`. A esa altura el tagline “SOLUCIONES PARA TU HOGAR” es ilegible.
- Favicon: `public/images/logo-icon.svg` (cuadrado naranja redondeado, **no** es el icono del PNG).

**Uso:**
- Header y footer: PNG con `mix-blend-lighten`.
- Hero: wordmark HTML (`Obra` blanco + `Tech` naranja), no el PNG.
- Deuda: recorte transparente (icono + wordmark + Bogotá) para no depender de mix-blend.

---

## 3. Color

Tokens en `:root` (`app/globals.css`). En Tailwind: `bg-background`, `text-brand`, `bg-surface`, etc.

| Token | Hex / valor | Uso |
|--------|-------------|-----|
| `--background` | `#0a0a0a` | Fondo de página |
| `--surface` | `#111111` | Paneles, FAQ, proceso, form |
| `--foreground` | `#f5f5f5` | Texto por defecto |
| `--ink` | `#ffffff` | Títulos |
| `--muted` | `#8a8a8a` | Texto secundario (poco usado) |
| `--line` | `rgba(255,255,255,0.12)` | Bordes de panel |
| `--brand` | `#e85d04` | CTA, “Tech”, selección |
| `--brand-hover` | `#ff7a1a` | Hover del CTA |
| `--brand-deep` | `#c2410c` | Acento más oscuro |
| `--glass` | `rgba(255,255,255,0.06)` | Clase `.glass` (admin, no el header público) |
| `--glass-border` | `rgba(255,255,255,0.14)` | Borde del glass |

### Blancos (opacidad sobre negro)

| Clase típica | Opacidad | Uso |
|--------------|----------|-----|
| `text-white` | 100% | Títulos, botones ghost |
| `text-white/80` | 80% | Citas, éxito de form |
| `text-white/70` | 70% | Lead del hero, nav |
| `text-white/65` | 65% | Descripciones, leads de sección |
| `text-white/50` | 50% | Meta (barrio, horario) |
| `text-white/45` | 45% | Eyebrow, “Bogotá” del logo |
| `text-white/40` | 40% | Labels de form, disclaimer chat |

Los de 40–45% **no pasan WCAG AA** en texto chico. Subir a ≥55% si se publica.

### Regla del naranja
- Botón primario (“Cuéntanos”): fondo naranja, texto **negro** (no blanco). WhatsApp no usa ese fondo.
- Palabra “Tech”, hover de ghost, focus de inputs: naranja.
- No pintar fondos de sección enteros de naranja.
- Selección de texto: fondo brand, texto negro.

---

## 4. Tipografía

Una sola familia: **Space Grotesk** (`--font-space` en `app/layout.tsx`). Títulos y cuerpo usan la misma fuente; el peso y el tamaño hacen la jerarquía.

| Rol | Clase / tamaño | Peso | Tracking | Color |
|-----|----------------|------|----------|--------|
| Marca hero | `clamp(2rem, 9vw, 7.5rem)` | 700 | -0.06em | blanco + brand |
| H1 (frase) | `clamp(1.35rem, 3.4vw, 2.35rem)` | 500 | -0.03em | blanco |
| Título de sección | `.section-title` `clamp(2.75rem, 8vw, 6.5rem)` | 700 | -0.05em | blanco |
| Título chico | `.section-title-sm` `clamp(1.85rem, 5vw, 3.15rem)` | 700 | -0.045em | blanco |
| Eyebrow | `.section-eyebrow` 0.7rem | 600 | 0.22em, mayúsculas | blanco 45% |
| Lead | `.section-lead` 1.05rem | 400 | — | blanco 68%, max 28rem |
| Cuerpo | 0.875–1rem | 400 | -0.02em (body) | blanco 65–80% |
| Botón | 0.75rem | 700 | 0.12em, mayúsculas | negro o blanco |
| Nav | 0.68rem | 600 | — | blanco 70% |
| Label form | 0.65rem | 700 | 0.2em, mayúsculas | blanco 40% |

Títulos de sección: **frases cortas** (“Cuatro pasos.”, “Obra real.”). El lead explica.

Componente: `SectionHeading` — `eyebrow` + `title` + `lead` opcional. Tamaños `lg` (default) y `sm`. Alineación left / right / center.

---

## 5. Layout

- Ancho máximo: **1400px** (`max-w-[1400px]`).
- Padding horizontal: `px-5` (20px) móvil, `md:px-8` (32px) desktop.
- Grid de 12 columnas en desktop (`lg:grid-cols-12`).
- Padding vertical de sección: `.section-pad` → 5rem móvil, 8rem desde `md`.
- Separadores: `border-t border-white/10` o fondo `bg-black` alternado, no un tercer color.

Fotos de servicios/proyectos: `object-cover` + velo `from-black/90` para que el texto blanco se lea.

---

## 6. Componentes

### Botones

`.btn-primary` — naranja, texto negro, padding 1rem 1.6rem, uppercase. Hover: `#ff7a1a` + sube 3px.

`.btn-ghost` — borde blanco 28%, texto blanco. Hover: borde brand + fondo naranja 12%.

Grupo típico: **WhatsApp (primary) + Dejar datos / Formulario (ghost)**.

Flecha `ArrowRight` con clase `.arrow-animate`: se corre 5px al hover del padre.

### Panel y glass

`.panel` — fondo `#111`, borde `white/12`. Sin radio. Usado en proceso, testimonios, FAQ, form, CTA final.

`.glass` — blur 18px, fondo blanco 6%. Usado en `/admin`, no en el header público (ese es `bg-black/90`).

### Inputs

Fondo `white/5`, borde `white/15`, padding `px-4 py-3`. Inputs a 16px. Hay `:focus-visible` global (anillo brand) en `globals.css`.

Labels envuelven el campo (accesible). Selects con `option` fondo negro.

### FAQ

`<details>` + `<summary>` sin marker nativo. Título semibold; al abrir, el `+` rota 45°. Cuerpo blanco 70%.

---

## 7. Secciones de la home (de arriba a abajo)

| Sección | Archivo | Notas visuales |
|---------|---------|----------------|
| Top bar | `top-bar.tsx` | Negro, 0.7rem, `text-white/70`. Se oculta al scroll > 24px |
| Header | `site-header.tsx` | Sticky z-50, `bg-black/90`. Hamburguesa &lt; `lg`. CTA “WhatsApp”. Menú: Servicios, Cómo funciona, Proyectos, Cobertura, Contacto |
| Hero | `hero.tsx` | Foto `heroImage` (hoy `hero-pintor.png`). Naranja: “Cuéntanos qué necesitas”. WhatsApp al lado, ghost. Debajo: “Te escribimos el mismo día, de lunes a sábado.” |
| Proyectos | `projects.tsx` | Justo después del hero. Título “Trabajos reales.”. Si hay `antes`, antes y después; si hay `resultado`, una línea bajo el título |
| Trust | `trust-bar.tsx` | Una línea de distintivos separados por ` · ` |
| Servicios | `services.tsx` | Foto de reparaciones + seis oficios de `serviciosInicio` que abren el asesor; debajo 3 fotos de exteriores |
| Proceso | `process.tsx` | 2×2 paneles, número gigante blanco 20%, icono lucide |
| Nosotros | `why-us.tsx` | Franja. Foto a la izquierda, dos puntos con check. `nosotrosFondo` de fondo, con velo oscuro |
| Testimonios | `testimonials.tsx` | 3 columnas. Avatar = iniciales en cuadrado `white/10`. Solo si `mostrarTestimonios` |
| Cobertura + FAQ | `faq-coverage.tsx` | Zonas a la izq., preguntas a la der. |
| CTA | `final-cta.tsx` | Una línea y un solo botón naranja, el del asesor |
| Contacto | `contact-form.tsx` | Form en panel; no está en `/diseno` |
| Footer | `site-footer.tsx` | Logo, menú (`NAV_LINKS`), teléfono, horario, zona |
| Asesor | `site-assistant.tsx` | Fijo abajo-izquierda, z-50. Ver [DOCUMENTACION-CHAT.md](./DOCUMENTACION-CHAT.md) |
| Barra móvil | `mobile-action-bar.tsx` | `md:hidden`. “Cuéntanos” en naranja y WhatsApp al lado |

IDs de ancla: `#servicios` `#proceso` `#proyectos` `#nosotros` `#cobertura` `#contacto`.

---

## 8. Asesor y barra del teléfono

- Desktop: botón “Asesor del hogar” abajo a la izquierda (negro, borde blanco 40%).
- Teléfono: ese botón se oculta. La barra inferior tiene “Cuéntanos” en naranja y WhatsApp al lado.
- No hay botón flotante de WhatsApp.
- Chat abierto: panel ~22.5rem, `bg-surface`, header negro, burbujas usuario naranja (`bg-brand text-black`), asistente negro con borde. Chips con borde. `role="dialog"`, placeholder según el paso, `env(safe-area-inset-bottom)`.
- Detalle del motor: [DOCUMENTACION-CHAT.md](./DOCUMENTACION-CHAT.md).

---

## 9. Motion

Curva: `cubic-bezier(0.22, 1, 0.36, 1)`.

| Efecto | Dónde |
|--------|--------|
| `fadeInUp` 0.9s, delays 0.08 / 0.2 / 0.34 | Textos del hero |
| `slowZoom` 22s 1 → 1.08 | Foto del hero |
| TranslateY -3px | Botones |
| Scale 1.05, 700ms | Hover de fotos |
| Flecha +5px | Links con `.arrow-animate` |

`prefers-reduced-motion: reduce` **sí está implementado** (`app/globals.css`): anula `scroll-behavior`, deja animaciones y transiciones en 0.01 ms, y desactiva la entrada del hero dejándolo visible en su posición final.

---

## 10. Breakpoints (uso real)

| Ancho | Comportamiento |
|-------|----------------|
| &lt; 640px (`sm`) | Form en una columna; top bar apilado |
| ≥ 768px (`md`) | Sección padding 8rem; servicios 2 col; proceso 2 col; proyectos mosaic |
| ≥ 1024px (`lg`) | Hero 100svh; nav desktop; panel del hero; why-us split foto/texto |

El menú hamburguesa se esconde desde `lg`, no desde `md`.

---

## 11. Admin (`/admin`)

Misma paleta (negro + naranja). No es un design system aparte. Cómo usarlo: [DOCUMENTACION-ADMIN.md](./DOCUMENTACION-ADMIN.md).

- Login: campo + botón primary.
- Tabs (orden real): Solicitudes / Fotos / Contenido. Activa = `bg-brand text-black`. Badge naranja = leads `new`.
- Tabla de leads: texto sm, estados en select; Contactar abre WhatsApp.
- Fotos: lugares de la página arriba, biblioteca abajo. Cambiar y luego elegir la foto. Guardar para aplicar. Aviso si quedó sin guardar.

`robots: noindex`. No hace falta que se vea “de marca” para clientes.

---

## 12. Imágenes

Carpeta: `public/images/`.

| Archivo | Uso |
|---------|-----|
| `hero-pintor.png` | Hero (el archivo lo decide `heroImage` en `site.json`) |
| `nosotros-fondo.jpeg` | Fondo de la franja Nosotros |
| `servicio-locativos.jpg` | Reparaciones |
| `servicio-fachadas.jpg` | Pintura / fachadas |
| `servicio-impermeabilizacion.jpg` | Impermeabilización |
| `servicio-remodelaciones.jpg` | Remodelaciones |
| `proyecto1–3.jpeg` | Portafolio |
| `nosotros-destacada.jpg` | Why us |
| `logo.png` | Header y footer (`mix-blend-lighten`) |
| `logo-icon.svg` | Favicon (cuadrado naranja, no es el icono del PNG) |
| `uploads/` | Subidas desde admin |

Todas las fotos de sección van con `next/image`, `fill`, `object-cover` y velo negro inferior. Calidad hero: 90, `priority`.

---

## 13. Copy visual (tono)

- Títulos: frases de 2–5 palabras, punto final a veces (“Cuatro pasos.”).
- CTA principal: **Cuéntanos qué necesitas**. WhatsApp es secundario. El formulario queda más abajo.
- Chat: tuteo (“¿Qué necesita tu hogar?”). Resto del sitio: usted. Unificar cuando se pulan textos.

---

## 14. Archivos a tocar si cambia el look

| Qué | Dónde |
|-----|--------|
| Colores, botones, títulos | `app/globals.css` |
| Fuente | `app/layout.tsx` |
| Logo | `components/logo.tsx` + `public/images/logo.png` |
| Encabezados de sección | `components/section-heading.tsx` |
| Hero | `components/sections/hero.tsx` |
| Header | `components/site-header.tsx` |
| Chat UI | `components/site-assistant.tsx` |
| Contenido (fotos, textos) | `/admin` o `data/site.json` |

No duplicar hex sueltos: usar `text-brand`, `bg-background`, `border-white/10`.

---

## 15. Deuda visual (no es el look actual)

Documentado para no olvidarlo; **no forma parte del sistema hoy**:

1. Recorte transparente del logo (quitar mix-blend y el tagline ilegible en header). Además, el PNG actual es texto blanco: desaparece sobre fondos claros y al imprimir.
2. Unificar usted/tú entre sitio y chat.

Ya está hecho (no repetir como deuda): skip-link, `scroll-margin-top` en `main [id]`, `focus-visible` en botones/inputs, inputs a 16px, safe-area en flotantes, CTA del nav “WhatsApp”, `role="dialog"` y placeholder del chat, `prefers-reduced-motion`, y labels del formulario a `text-white/80`.
