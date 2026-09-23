# ObraTech Bogotá — Documentación del proyecto

Sitio web de **ObraTech Bogotá**: servicios para el hogar y obra (reparar, pintar, instalar, fachadas, impermeabilización, remodelar). La cotización **no** se hace en la web: se arma por **WhatsApp** después de un chat o un formulario.

Estado actual: **validación comercial**. Congelar features nuevas. Probar con 5 personas reales.

Guías:
- Asesor del hogar (motor, embudo, API): [DOCUMENTACION-CHAT.md](./DOCUMENTACION-CHAT.md)
- Panel admin (login, leads, fotos, contenido): [DOCUMENTACION-ADMIN.md](./DOCUMENTACION-ADMIN.md)
- Interfaz (marca, color, componentes): [DOCUMENTACION-UI.md](./DOCUMENTACION-UI.md)

---

## 1. Qué es y qué no es

### Qué es
- Landing pública en Next.js.
- Asesor del hogar (motor de reglas, **sin IA de pago**).
- Captura de leads (chat + formulario) → archivo JSON → panel `/admin`.
- Contenido editable desde admin (textos, fotos, WhatsApp, zonas, FAQ).
- Cotización humana por WhatsApp.

### Qué no es (a propósito)
- No es un cotizador automático. No hay precios en la web ni en el chat.
- No hay IA pagada, Flask, MySQL ni pagos.
- La “plataforma inteligente hogar” es **visión**, no este stack.

---

## 2. Cómo correrlo

```bash
npm install
npm run dev
```

| URL | Qué es |
|-----|--------|
| http://localhost:3000 | Sitio público |
| http://localhost:3000/admin | Panel (fotos, contenido, solicitudes) |
| http://localhost:3000/diseno | Misma home **sin** chat, barra móvil ni formulario |
| http://localhost:3000/admin/recuperar | Elegir otra contraseña, solo en este computador |

Build de producción: `npm run build` y `npm start`.

---

## 3. Stack

| Pieza | Versión / detalle |
|--------|-------------------|
| Next.js | 16.2.2 (App Router) |
| React | 19 |
| Tailwind | 4 (`app/globals.css`) |
| Tipografía | Space Grotesk |
| Iconos | lucide-react |
| Datos | JSON en disco (`data/`) |
| Chat | Reglas en `lib/assistant-local.ts` |

No hay base de datos. Los leads y el contenido viven en archivos. **Vercel con filesystem efímero no sirve** para persistir `leads.json` ni fotos subidas.

---

## 4. Producto (decisiones cerradas)

1. **Cotizar por WhatsApp**, no con calculadora en la web.
2. Chat = clasificar el problema + pedir zona + nombre/celular → guardar lead → abrir WhatsApp con el resumen.
3. Cobertura: Bogotá y la Sabana se atienden. Kennedy, Bosa, Soacha, Ciudad Bolívar, Usme, Tunjuelito, Rafael Uribe, San Cristóbal y Patio Bonito se registran igual, pero el chat avisa que primero se revisa si se puede ir. Engativá y Fontibón quedan “por confirmar”. En textos públicos **no** se dice “peligroso” ni se afirma que solo se cubre el norte.
4. Tono: hogar + obra, no solo impermeabilización estructural.
5. Marca: negro / blanco / naranja quemado `#e85d04`.

---

## 5. Flujo del cliente

```
Visita la web
    ├─ Asesor del hogar          → clasifica → zona → confirma → nombre + celular
    ├─ Formulario (#contacto)    → nombre, teléfono, zona, servicio, mensaje
    └─ Botón WhatsApp            → wa.me con mensaje listo
              ↓
         data/leads.json
              ↓
         /admin → Solicitudes
              ↓
         Ustedes cotizan por WhatsApp
```

Duplicados: mismo teléfono + mismo origen (chat o formulario) en **30 minutos** actualiza el lead, no crea otro. Máximo **200** leads en el archivo.

---

## 6. Páginas

### Pública `/`
Orden de secciones:

1. Top bar (zona + teléfono + horario; se oculta al scroll > 24px)
2. Header sticky (logo PNG, menú, WhatsApp en botón secundario)
3. Hero (naranja: “Cuéntanos qué necesitas”; al lado, WhatsApp)
4. Proyectos (“Trabajos reales.”). Foto de antes opcional
5. Barra de confianza (distintivos)
6. Servicios (seis oficios de `serviciosInicio` + tres tarjetas de exteriores)
7. Proceso (4 pasos)
8. Por qué ObraTech (franja corta, foto y fondo)
9. Testimonios (si `mostrarTestimonios`)
10. Cobertura + FAQ
11. Cierre con un solo botón, el del asesor
12. Formulario
13. Footer
14. Asesor y, en el teléfono, barra “Cuéntanos” + WhatsApp. No hay botón flotante de WhatsApp.

Menú (`lib/content.ts` `NAV_LINKS`): Servicios, Cómo funciona, Proyectos, Cobertura, Contacto. Los href son `/#…` para que funcionen también desde `/privacidad`.

### Admin `/admin`

Guía completa: [DOCUMENTACION-ADMIN.md](./DOCUMENTACION-ADMIN.md).

No indexable (`robots: noindex`). Login con cookie `httpOnly` (`obratech_admin`, 7 días). Pestaña inicial: **Solicitudes**.

- **Solicitudes** — leads de chat y formulario; estados Nuevo / Contactar / Cotizando / Cerrado. “Contactar” abre WhatsApp al cliente. “Solo nuevas” filtra el resto.
- **Fotos** — subir (se comprimen a WebP). Se elige el lugar de la página y después la foto. Borrar solo `/uploads`.
- **Contenido** — WhatsApp, teléfono, distintivos, por qué ObraTech, proyectos, lista de la home, exteriores, zonas, FAQ. Testimonios plegados mientras estén apagados. Saltos a Proyectos, Zonas y Preguntas.
- **Contraseña** — se cambia dentro del panel. “Olvidé la contraseña” solo funciona en localhost.

Si hay cambios sin guardar, el panel lo avisa. Al guardar, muestra el texto que devolvió el servidor.

Contraseña: `ADMIN_PASSWORD`. **No hay valor por defecto**: si la variable falta, o si tiene alguno de los valores de ejemplo, el login responde error y nadie entra. Además el login permite **6 intentos fallidos por IP cada 15 minutos**.

### `/diseno`
Copia visual de la home **sin** chat, barra móvil ni formulario. Útil para mostrar o capturar el diseño. Tampoco se indexa.

---

## 7. Asesor del hogar

La guía completa (árboles, prefill, WhatsApp, API, cómo cambiar reglas) está en [DOCUMENTACION-CHAT.md](./DOCUMENTACION-CHAT.md).

Archivos: `components/site-assistant.tsx`, `lib/assistant-local.ts`, `app/api/assistant/route.ts`. **Sin IA de pago.**

Sesión en `sessionStorage` (`obratech-assistant-v16`, `CHAT_REVISION` 16). Al cambiar reglas, se sube la versión para no reutilizar chats viejos.

### Conversación (resumen)
1. Qué necesita (chips o texto libre; puede ser varios trabajos).
2. Detalle mínimo por trabajo.
3. Zona.
4. Resumen → confirmar.
5. Nombre + celular (ej. `Laura 3001234567`).
6. Guarda lead `source: "chat"` y ofrece WhatsApp con el contexto.

### Cobertura en el chat
**No hay rechazo duro.** El mensaje público **no nombra** exclusiones.

- **ok:** Bogotá norte, Chapinero/Teusaquillo, Sabana norte (Chía, Cajicá, Cota, La Calera).
- **pending:** Engativá, Fontibón, Sopó, Zipaquirá, Mosquera, Funza, “otra zona”.
- **review:** Kennedy, Bosa, Soacha, Ciudad Bolívar, Usme, etc. Dice cobertura principal y que pueden revisar si es posible atender.

Límite API: 40 mensajes / 10 min por IP (en memoria del proceso).

---

## 8. Formulario

`components/sections/contact-form.tsx` → `POST /api/leads`.

Campos: nombre, teléfono, zona, servicio, mensaje. Honeypot `company` (si viene lleno, responde OK y no guarda).

Límite: 8 envíos / 15 min por IP.

---

## 9. Leads

Archivo: `data/leads.json` (**gitignored**; tiene teléfonos).

| Campo | Valores |
|--------|---------|
| `source` | `chat` \| `formulario` |
| `status` | `new` \| `contact` \| `quoting` \| `done` |
| `services` | lista de trabajos |
| `zona` | texto |

Admin: `GET /api/leads` y `PATCH /api/leads` (solo autenticado).

---

## 10. Contenido del sitio

`data/site.json` — lo edita `/admin` (pestaña Contenido).

Incluye: WhatsApp, teléfono, nombre, portada, foto y fondo de Nosotros, distintivos, `serviciosInicio` (los seis oficios de la home), tarjetas de servicio, proyectos (`image`, `antes` opcional, `resultado` opcional), testimonios, por qué nosotros, FAQ y zonas. No hay bloque `cotizador`.

Fallbacks de FAQ/zonas: `lib/site-store.ts`.

---

## 11. APIs

| Método | Ruta | Auth | Función |
|--------|------|------|---------|
| POST | `/api/assistant` | no | Chat + guardar lead |
| POST | `/api/leads` | no | Formulario |
| GET | `/api/leads` | admin | Listar |
| PATCH | `/api/leads` | admin | Estado |
| POST | `/api/admin/login` | — | Cookie |
| POST | `/api/admin/logout` | — | Cerrar |
| GET | `/api/admin/me` | cookie | Sesión |
| GET/PUT | `/api/admin/content` | admin | `site.json` |
| GET/POST/DELETE | `/api/admin/images` | admin | Fotos (upload máx. 8 MB) |
| POST | `/api/admin/password` | admin | Cambiar la contraseña dentro del panel |
| POST | `/api/admin/recover` | solo localhost | Elegir otra contraseña sin estar dentro |
| GET | `/api/media/:file` | no | Servir una foto de `uploads` subida después de `next start` |

Uploads: `public/images/uploads/`. Solo se pueden borrar archivos de esa carpeta.

`PUT /api/admin/content` pasa todo por `sanitizeSiteContent()`: cada campo se valida y se convierte a su tipo correcto, lo que llega roto se descarta y los campos que romperían el render (imágenes, WhatsApp, nombre) conservan su valor anterior en vez de quedar vacíos. El archivo se escribe en un temporal y se renombra encima, así que un corte a mitad no deja `site.json` partido.

`POST /api/admin/images` decodifica la foto con `sharp` en vez de creerle al tipo declarado. Si no se puede decodificar, se rechaza. Lo que sí es imagen se reprocesa a WebP de máximo 2400 px, lo que también borra los metadatos EXIF (incluida la ubicación GPS).

`POST /api/assistant` exige la firma que el servidor emitió en el turno anterior (`lib/state-signature.ts`). Sin firma válida la conversación arranca de cero, así que no se pueden fabricar solicitudes mandando un estado con `confirmed`, `name` y `phone` ya puestos.

---

## 12. Mapa de archivos

```
app/
  page.tsx                 Home
  layout.tsx               Fuente, SEO, skip-link, favicon
  globals.css              Tokens y componentes visuales
  privacidad/page.tsx      Datos personales (Ley 1581)
  diseno/page.tsx          Vista solo diseño
  admin/page.tsx           Panel
  admin/recuperar/         Recuperar contraseña en localhost
  api/assistant/           Chat
  api/leads/               Leads
  api/admin/               Login, contenido, imágenes, contraseña
  api/media/               Fotos de uploads tras el arranque
components/
  site-header.tsx
  site-assistant.tsx
  logo.tsx
  sections/                Hero, servicios, proceso, proyectos, etc.
  admin/admin-app.tsx
lib/
  assistant-local.ts       Motor de reglas (el que corre)
  site-store.ts            JSON de sitio y leads
  admin-password.ts        Hash y cambio de contraseña
  rate-limit.ts            Límites de login, formulario y chat
  content.ts               Nav, proceso, iconos
  admin-auth.ts            Cookie y contraseña
data/
  site.json                Contenido público
  leads.json               Solicitudes (no se commitea)
  admin-password.json      Contraseña del panel, si se cambió (no se commitea)
public/images/             Fotos, logo.png, logo-icon.svg
scripts/
  chat-100-users.ts        Simulación del asesor (`npm run test:chat`)
  verify-security.ts       Firma del chat y saneado (`npm run test:security`)
```

---

## 13. Diseño (sistema visual)

La guía completa de interfaz (marca, color, tipo, secciones y motion) está en [DOCUMENTACION-UI.md](./DOCUMENTACION-UI.md). Vista sin chat: `/diseno`.

---

## 14. Variables de entorno

Crear `.env` (gitignored):

```
ADMIN_PASSWORD=una-clave-fuerte
ADMIN_SECRET=otro-secreto-para-firmar-la-cookie
NEXT_PUBLIC_SITE_URL=https://dominio-real.com
```

Las dos son **obligatorias**: `lib/admin-auth.ts` ya no tiene valores por defecto y rechaza los del ejemplo, así que sin ellas el panel simplemente no deja entrar. Genera cada una con:

```
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

`ADMIN_SECRET` también firma el estado del chat (`lib/state-signature.ts`). Si falta, el chat sigue funcionando con un secreto aleatorio por proceso; lo único que pasa es que las conversaciones en curso se reinician cuando se reinicia el servidor. Cambiar `ADMIN_SECRET` cierra todas las sesiones del panel.

`NEXT_PUBLIC_SITE_URL` es el dominio real del sitio. Si falta, las imágenes al compartir el enlace, la URL canónica, el sitemap y los datos para Google apuntan a `localhost:3000`. Tiene que estar definida **antes de correr `npm run build`**: `robots.txt` y `sitemap.xml` se generan estáticos y el dominio queda incrustado, así que ponerla solo en el servidor no alcanza.

El chat no usa ninguna IA de pago, así que **no hacen falta** `GROQ_API_KEY` ni `ASSISTANT_MODEL`.

---

## 15. Antes de publicar (bloqueadores)

1. WhatsApp real de ObraTech en admin / `site.json` (ahora hay un número de prueba).
2. `ADMIN_PASSWORD` y `ADMIN_SECRET` largos y aleatorios en `.env` (ya no hay fallback en el código).
3. Hosting con disco persistente (no Vercel efímero) para `data/` y `public/images/uploads/`.
4. Testimonios reales o quitar la sección.
5. Política de tratamiento de datos (Ley 1581) + enlace en form y footer.

Pulido recomendado (no bloquea las 5 pruebas): contraste de labels, `prefers-reduced-motion`, recorte transparente del logo (el PNG actual tiene fondo negro y tagline ilegible en el header).

---

## 16. Plan de validación (5 personas)

Probar, cada una, un caso distinto: pintura, plomería, instalación, locativa, remodelación.

Anotar:

- ¿El chat clasificó bien?
- ¿El lead apareció en `/admin`?
- ¿WhatsApp abrió con el resumen?
- ¿Contacto en &lt; 15 min?
- ¿Cotización / cierre?

Corregir reglas del chat **después** de anotar errores, no a ojo.

---

## 17. Vista de diseño

- `/diseno` — la misma home, solo para revisión visual. No tiene chat, formulario ni barra móvil.

---

## 18. Comandos

```bash
npm run dev      # desarrollo
npm run build    # producción
npm run start    # servir build
npm run lint     # eslint
npm run test:chat # simula conversaciones del asesor
npm run test:security # firma del chat, anti-forja y saneado de contenido
```
