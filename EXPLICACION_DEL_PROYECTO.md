# Explicación completa del proyecto ObraTech Web

> Documento de estudio para comprender el proyecto y aprender a construir una aplicación parecida.
>
> Esta explicación describe el estado actual del código. No es necesario conocer Next.js de antemano, pero ayuda tener nociones básicas de HTML, CSS, JavaScript y React.

---

## 1. Qué hace el proyecto y cuál es su objetivo

ObraTech Web es un sitio comercial para una empresa de reparaciones, pintura, instalaciones y remodelaciones en Bogotá y la Sabana.

Su objetivo principal no es vender ni calcular precios automáticamente. Su objetivo es:

1. Explicar qué servicios ofrece ObraTech.
2. Dar confianza mediante fotografías, proyectos, garantía y preguntas frecuentes.
3. Ayudar al visitante a describir su problema aunque no conozca el nombre del oficio.
4. Recoger el nombre, teléfono, zona y necesidad del visitante.
5. Guardar esa solicitud para que ObraTech pueda contactarlo.
6. Llevar la conversación final y la cotización a WhatsApp.

El proyecto tiene tres partes principales:

- **Sitio público:** la página que ve el cliente.
- **Asesor del hogar:** un chat guiado por reglas.
- **Panel administrativo:** permite consultar solicitudes y editar contenido e imágenes.

El recorrido comercial más importante es:

```text
Visitante abre la página
        ↓
Lee servicios y proyectos
        ↓
Usa el chat, el formulario o WhatsApp
        ↓
El servidor valida los datos
        ↓
La solicitud se guarda en data/leads.json
        ↓
ObraTech la consulta en /admin
        ↓
ObraTech contacta al cliente por WhatsApp
```

### Lo que el proyecto no es

- No usa una base de datos como PostgreSQL o MySQL.
- No tiene un cotizador automático. El valor se arma por WhatsApp.
- No utiliza una inteligencia artificial externa ni de pago.
- No tiene usuarios, roles o cuentas independientes.
- No procesa pagos.
- No agenda trabajos automáticamente.
- No reemplaza la valoración humana del trabajo.

---

## 2. Tecnologías utilizadas

### Next.js 16

Next.js es el framework principal. Organiza las páginas, ejecuta código en el servidor, crea las APIs y optimiza imágenes y fuentes.

Este proyecto usa el **App Router**. En este sistema, la ubicación de un archivo dentro de `app/` determina su URL:

```text
app/page.tsx                    → /
app/admin/page.tsx              → /admin
app/privacidad/page.tsx         → /privacidad
app/api/leads/route.ts          → /api/leads
```

### React 19

React divide la interfaz en componentes reutilizables. Por ejemplo:

- `Hero` representa la portada.
- `ContactForm` representa el formulario.
- `SiteAssistant` representa el chat.
- `AdminApp` representa el panel administrativo.

### TypeScript

TypeScript añade tipos a JavaScript. Sirve para detectar errores antes de ejecutar el programa.

Ejemplo:

```ts
export type SiteZona = {
  nombre: string;
  detalle: string;
};
```

Esto indica que una zona debe tener dos textos: `nombre` y `detalle`. Si el código intentara guardar un número en `nombre`, TypeScript advertiría el problema.

### Tailwind CSS 4

Tailwind permite aplicar estilos mediante clases directamente en JSX:

```tsx
<p className="text-sm text-white/60 leading-relaxed">
  Texto de ejemplo
</p>
```

Paso a paso:

1. `text-sm` usa un tamaño de texto pequeño.
2. `text-white/60` usa blanco con 60 % de opacidad.
3. `leading-relaxed` aumenta el espacio entre líneas.

Además, `app/globals.css` define variables y clases reutilizables como `btn-primary`, `section-title` y `panel`.

### Sharp

`sharp` procesa imágenes en el servidor. Verifica que un archivo sea realmente una imagen, lo redimensiona y lo convierte a WebP.

### Lucide React

`lucide-react` aporta iconos como flechas, herramientas, ubicación, teléfono y escudo. Evita tener que dibujar cada icono manualmente.

### APIs nativas de Node.js

El servidor también usa:

- `fs`: leer y escribir archivos.
- `path`: construir rutas compatibles con el sistema operativo.
- `crypto`: firmar datos y comparar secretos de manera segura.

---

## 3. Estructura general de carpetas y archivos

Se omiten `node_modules/` y `.next/` porque son carpetas generadas. No contienen código de negocio escrito para ObraTech.

```text
obratech-web/
├── app/
│   ├── admin/
│   │   └── page.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   ├── content/route.ts
│   │   │   ├── images/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── assistant/route.ts
│   │   └── leads/route.ts
│   ├── diseno/
│   │   └── page.tsx
│   ├── privacidad/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── admin/
│   │   └── admin-app.tsx
│   ├── sections/
│   │   ├── contact-form.tsx
│   │   ├── faq-coverage.tsx
│   │   ├── final-cta.tsx
│   │   ├── hero.tsx
│   │   ├── process.tsx
│   │   ├── projects.tsx
│   │   ├── services.tsx
│   │   ├── site-footer.tsx
│   │   ├── testimonials.tsx
│   │   ├── top-bar.tsx
│   │   ├── trust-bar.tsx
│   │   └── why-us.tsx
│   ├── logo.tsx
│   ├── mobile-action-bar.tsx
│   ├── open-assistant-button.tsx
│   ├── section-heading.tsx
│   ├── site-assistant.tsx
│   ├── site-header.tsx
│   ├── site-json-ld.tsx
│   ├── site-shell.tsx
│   └── whatsapp-link.tsx
├── data/
│   ├── site.json
│   └── leads.json
├── lib/
│   ├── admin-auth.ts
│   ├── assistant-local.ts
│   ├── compress-image.ts
│   ├── content.ts
│   ├── site-store.ts
│   └── state-signature.ts
├── public/
│   ├── images/
│   │   ├── uploads/.gitkeep
│   │   ├── hero-pintor.png
│   │   ├── logo.png
│   │   ├── logo-icon.svg
│   │   ├── nosotros-destacada.jpg
│   │   ├── nosotros-fondo.jpeg
│   │   ├── proyecto1.jpeg
│   │   ├── proyecto2.jpeg
│   │   ├── proyecto3.jpeg
│   │   └── servicio-*.jpg
│   ├── file.svg
│   ├── vercel.svg
│   └── window.svg
├── scripts/
│   ├── abrir-puerto-dev.ps1
│   ├── chat-100-users.ts
│   ├── dev-lan.mjs
│   ├── dev-stop.mjs
│   └── verify-security.ts
├── INFORME-PARA-IMPRIMIR/
│   ├── README.md
│   └── manual-tecnico.html
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── DOCUMENTACION-ADMIN.md
├── DOCUMENTACION-CHAT.md
├── DOCUMENTACION-UI.md
├── DOCUMENTACION.md
├── README.md
├── env.example
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

### Carpetas generadas

#### `node_modules/`

Contiene las librerías instaladas por npm. Se vuelve a crear con `npm install`.

#### `.next/`

Contiene el resultado de desarrollo y compilación de Next.js. Se vuelve a crear con `npm run dev` o `npm run build`.

Ninguna de estas carpetas debe editarse manualmente ni subirse a Git.

---

## 4. Archivos raíz y configuración

### `package.json`

Describe el proyecto, sus librerías y los comandos disponibles.

Comandos principales:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test:chat": "npx tsx scripts/chat-100-users.ts",
  "test:security": "npx tsx scripts/verify-security.ts"
}
```

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: crea la versión de producción.
- `npm start`: sirve una versión previamente compilada.
- `npm run lint`: busca errores y malas prácticas.
- `npm run test:chat`: simula 101 conversaciones.
- `npm run test:security`: prueba la firma del chat y el saneado del contenido.

### `package-lock.json`

Registra las versiones exactas de todas las dependencias. Gracias a él, dos computadores pueden instalar prácticamente el mismo árbol de paquetes.

### `tsconfig.json`

Configura TypeScript.

Opciones importantes:

- `"strict": true`: activa comprobaciones estrictas.
- `"noEmit": true`: TypeScript comprueba, pero Next.js genera los archivos.
- `"resolveJsonModule": true`: permite importar JSON.
- `"@/*": ["./*"]`: crea el alias `@/`.

Por eso:

```ts
import { readSiteContent } from "@/lib/site-store";
```

significa lo mismo que importar desde la carpeta raíz hacia `lib/site-store`.

### `next.config.ts`

Configura Next.js. Actualmente restringe las calidades aceptadas por `next/image`:

```ts
const nextConfig = {
  images: {
    qualities: [75, 90],
  },
};
```

### `postcss.config.mjs`

Conecta Tailwind CSS con el procesamiento CSS de Next.js.

### `eslint.config.mjs`

Activa las reglas recomendadas de Next.js, TypeScript y Core Web Vitals.

### `env.example`

Es una plantilla de variables de entorno:

- `ADMIN_PASSWORD`: contraseña del panel.
- `ADMIN_SECRET`: secreto para firmar cookies y estados del chat.
- `NEXT_PUBLIC_SITE_URL`: dominio público real.

Las claves reales deben estar en `.env.local` o en la configuración privada del servidor, nunca en `env.example`.

### `.gitignore`

Evita que Git guarde:

- dependencias;
- compilaciones;
- variables secretas;
- `data/leads.json`, que contiene teléfonos;
- archivos temporales de escritura.

### `README.md` y `DOCUMENTACION*.md`

Son guías de operación y mantenimiento:

- `README.md`: inicio rápido.
- `DOCUMENTACION.md`: visión general.
- `DOCUMENTACION-CHAT.md`: motor conversacional.
- `DOCUMENTACION-ADMIN.md`: panel administrativo.
- `DOCUMENTACION-UI.md`: diseño y accesibilidad.

### `INFORME-PARA-IMPRIMIR/`

Contiene un manual técnico HTML y sus instrucciones de impresión. No participa en la ejecución del sitio.

### `AGENTS.md` y `CLAUDE.md`

Contienen instrucciones para asistentes de programación que trabajen sobre el repositorio. No se cargan en la página web.

---

## 5. Cómo funciona el sistema de rutas

Next.js convierte carpetas y archivos de `app/` en rutas.

### Rutas de páginas

| URL | Archivo | Función |
|---|---|---|
| `/` | `app/page.tsx` | Página comercial principal |
| `/admin` | `app/admin/page.tsx` | Panel administrativo |
| `/privacidad` | `app/privacidad/page.tsx` | Política de datos |
| `/diseno` | `app/diseno/page.tsx` | Vista del diseño sin chat ni formulario |
| Cualquier ruta inexistente | `app/not-found.tsx` | Página 404 |
| `/robots.txt` | `app/robots.ts` | Instrucciones para buscadores |
| `/sitemap.xml` | `app/sitemap.ts` | URLs indexables |

### Rutas de API

| Método | URL | Propósito |
|---|---|---|
| `POST` | `/api/assistant` | Procesar un mensaje del chat |
| `POST` | `/api/leads` | Guardar el formulario público |
| `GET` | `/api/leads` | Listar solicitudes para el admin |
| `PATCH` | `/api/leads` | Cambiar el estado de una solicitud |
| `POST` | `/api/admin/login` | Iniciar sesión |
| `POST` | `/api/admin/logout` | Cerrar sesión |
| `GET` | `/api/admin/me` | Saber si la cookie es válida |
| `GET` | `/api/admin/content` | Leer el contenido editable |
| `PUT` | `/api/admin/content` | Guardar el contenido editable |
| `GET` | `/api/admin/images` | Listar imágenes |
| `POST` | `/api/admin/images` | Subir una imagen |
| `DELETE` | `/api/admin/images` | Eliminar una imagen subida |

### Navegación dentro de la página

`NAV_LINKS` contiene enlaces como:

```ts
export const NAV_LINKS = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#proceso", label: "Cómo funciona" },
  { href: "/#proyectos", label: "Proyectos" },
];
```

El enlace `/#servicios` busca un elemento con `id="servicios"`:

```tsx
<section id="servicios">
```

Esto se llama navegación por **anclas**.

---

## 6. Server Components y Client Components

Esta diferencia es fundamental para entender el proyecto.

### Server Components

Por defecto, los componentes de `app/` se ejecutan en el servidor. Pueden leer archivos y preparar HTML, pero no pueden usar `useState`, eventos del navegador o `window`.

Ejemplo: `app/page.tsx`.

```tsx
export default async function HomePage() {
  const site = await readSiteContent();
  return <Hero heroImage={site.heroImage} />;
}
```

Paso a paso:

1. Llega una petición para `/`.
2. Next.js ejecuta `HomePage` en el servidor.
3. `readSiteContent()` lee `data/site.json`.
4. El servidor pasa los datos a los componentes como propiedades.
5. Next.js envía la página al navegador.

La página usa:

```ts
export const dynamic = "force-dynamic";
```

Esto indica que debe procesarse dinámicamente. Así, al cambiar `site.json`, la siguiente recarga obtiene el contenido nuevo.

### Client Components

Los archivos que comienzan con:

```ts
"use client";
```

pueden usar hooks, eventos y APIs del navegador.

En este proyecto son Client Components:

- `SiteHeader`
- `TopBar`
- `ContactForm`
- `SiteAssistant`
- `OpenAssistantButton`
- `MobileActionBar`
- `AdminApp`

Un Server Component puede renderizar un Client Component y pasarle datos serializables, como textos, números, booleanos, listas y objetos sencillos.

---

## 7. Construcción de la página principal

`app/page.tsx` funciona como compositor de la home.

Fragmento simplificado:

```tsx
const site = await readSiteContent();

return <SiteShell site={site} contacto />;
```

`SiteShell` arma la home y `/diseno`. La página pública le pasa `contacto` para incluir formulario, asesor y barra móvil.

Orden actual:

1. `TopBar`
2. `SiteHeader`
3. `Hero`
4. `Projects`
5. `TrustBar`
6. `Services`
7. `Process`
8. `WhyUs`
9. `Testimonials`, solo si están activos
10. `FaqCoverage`
11. `FinalCta`
12. `ContactForm`, solo en la home pública
13. `SiteFooter`
14. `SiteAssistant` y `MobileActionBar`, solo en la home pública

### Flujo de propiedades

Los datos bajan desde `HomePage` hacia los componentes:

```text
data/site.json
      ↓
readSiteContent()
      ↓
HomePage
      ↓
props
      ├── Hero recibe heroImage y whatsappNumber
      ├── Projects recibe proyectos
      ├── FaqCoverage recibe faq
      └── ContactForm recibe phoneDisplay y zonas
```

Este patrón se llama **flujo de datos unidireccional**.

---

## 8. Componentes visuales importantes

### `app/layout.tsx`

Es la envoltura global de todas las páginas.

Responsabilidades:

- define el idioma `es`;
- carga la fuente Space Grotesk;
- configura metadatos SEO;
- añade el enlace para saltar al contenido;
- inserta datos estructurados;
- importa `globals.css`.

`metadataBase` usa `NEXT_PUBLIC_SITE_URL`. El dominio debe existir antes del build para que las URLs de SEO no apunten a `localhost`.

### `SiteHeader`

Es el encabezado fijo.

Estados:

```ts
const [isNavScrolled, setIsNavScrolled] = useState(false);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

- `isNavScrolled` cambia el tamaño del encabezado al hacer scroll.
- `mobileMenuOpen` abre o cierra el menú móvil.

También escucha `Escape` para cerrar el menú y bloquea el scroll de la página mientras el menú está abierto.

### `TopBar`

Muestra teléfono, horario y cobertura. Usa el scroll para ocultarse:

```ts
const onScroll = () => setHidden(window.scrollY > 24);
```

Cuando el usuario baja más de 24 píxeles, `hidden` pasa a `true` y las clases CSS reducen su altura.

### `Hero`

Es la portada:

- imagen grande optimizada con `next/image`;
- degradados para mejorar la lectura;
- título y descripción;
- botón para abrir el asesor;
- botón para abrir WhatsApp.

`fill` hace que la imagen llene su contenedor. `sizes="100vw"` ayuda al navegador a elegir un tamaño apropiado. `preload` prioriza la imagen porque es visible desde el inicio.

### `TrustBar`

Renderiza distintivos como garantía, cotización y cobertura.

`badgeIcon()` analiza las palabras de cada distintivo y elige un icono:

```ts
function badgeIcon(badge: string): LucideIcon {
  const text = badge.toLowerCase();
  return ICON_RULES.find((rule) =>
    rule.words.some((word) => text.includes(word))
  )?.icon ?? Check;
}
```

Paso a paso:

1. Convierte el texto a minúsculas.
2. Busca una regla que contenga una palabra coincidente.
3. Devuelve el icono de esa regla.
4. Si no encuentra ninguna, usa `Check`.

### `Services`

Tiene dos grupos:

- servicios comunes del hogar, definidos en `site.serviciosInicio`;
- trabajos exteriores, obtenidos desde `site.servicios`.

Los servicios comunes son botones que abren el asesor. Actualmente no envían automáticamente cuál se pulsó: solo abren el chat para iniciar la conversación.

### `Process`

Recorre `PROCESO_TRABAJO` con `.map()` y crea cuatro pasos.

`.map()` toma cada objeto de una lista y devuelve un elemento JSX:

```tsx
{PROCESO_TRABAJO.map((paso) => (
  <li key={paso.paso}>{paso.titulo}</li>
))}
```

### `Projects`

Recibe la lista de proyectos desde `site.json`. Van justo después del hero, con el título “Trabajos reales.”. Si un proyecto trae `antes`, muestra antes y después. Si trae `resultado`, esa línea va bajo el título.

### `WhyUs`

Muestra una franja corta: la foto de `nosotrosImage`, el fondo de `nosotrosFondo` con un velo oscuro, y los puntos de `porqueNosotros`. Cada punto tiene título, descripción e icono de verificación.

### `Testimonials`

Filtra testimonios incompletos u ocultos:

```ts
const published = testimonios.filter(
  (item) => item.visible !== false && item.texto.trim() && item.name.trim()
);
```

Luego aplica una salida temprana:

```ts
if (!visible || !featured) return null;
```

Si la opción global está apagada o no hay un testimonio válido, el componente no muestra nada.

### `FaqCoverage`

Usa elementos HTML nativos `<details>` y `<summary>`. Esto permite abrir y cerrar respuestas sin estado de React.

Es un buen ejemplo de una regla útil: no siempre se necesita JavaScript; a veces HTML ya resuelve el problema.

### `ContactForm`

Recoge:

- nombre;
- teléfono;
- zona;
- servicio;
- mensaje opcional;
- `company`, un campo invisible contra bots.

Envía los datos a `POST /api/leads`.

### `FinalCta`

Repite las dos acciones comerciales principales: abrir el asesor o escribir por WhatsApp.

### `SiteFooter`

Contiene navegación, contacto, horario, cobertura y enlace de privacidad.

Los datos legales se muestran solo si están llenos:

```ts
const identidad = [
  empresa?.razonSocial,
  empresa?.nit ? `NIT ${empresa.nit}` : undefined,
].filter(Boolean);
```

`filter(Boolean)` elimina cadenas vacías, `undefined`, `null` y otros valores falsos.

### `SectionHeading`

Centraliza el aspecto de los encabezados de sección. Recibe `eyebrow`, `title`, `lead`, `align` y `size`. Evita repetir la misma estructura en cada sección.

### `LogoObraTech`

Encapsula `next/image` para que todas las apariciones del logo compartan dimensiones, texto alternativo y estilos.

### Componentes de WhatsApp

- `WhatsAppLink`: crea un enlace seguro a `wa.me`.
- `MobileActionBar`: barra fija del teléfono, con “Cuéntanos” y WhatsApp. No hay botón flotante de WhatsApp.

`whatsappUrl()` usa `encodeURIComponent()` para que espacios, tildes y signos viajen correctamente dentro de una URL.

### `OpenAssistantButton`

No importa directamente el chat. Emite un evento del navegador:

```ts
export function openAssistant() {
  window.dispatchEvent(new Event(OPEN_ASSISTANT_EVENT));
}
```

`SiteAssistant` escucha el mismo evento. Esto permite abrir el chat desde muchos lugares sin pasar una función a través de todos los componentes.

### `SiteJsonLd`

Genera JSON-LD de tipo `HomeAndConstructionBusiness`. Google puede usarlo para entender nombre, teléfono, cobertura y horario del negocio.

`dangerouslySetInnerHTML` se usa aquí para insertar JSON dentro de `<script>`. Es aceptable porque el objeto se construye en el servidor, no se inserta HTML escrito directamente por un visitante.

---

## 9. Hooks de React utilizados

Un hook es una función especial de React. Permite que un componente recuerde datos, reaccione a cambios o conserve referencias.

### `useState`

Sirve para guardar estado local.

```ts
const [status, setStatus] = useState<
  "idle" | "sending" | "ok" | "error"
>("idle");
```

Aquí:

1. `status` contiene el valor actual.
2. `setStatus` cambia ese valor.
3. El valor inicial es `"idle"`.
4. TypeScript limita los valores permitidos.
5. Cuando se llama `setStatus`, React vuelve a renderizar el componente.

Usos importantes:

- menú abierto o cerrado;
- chat abierto o cerrado;
- texto escrito en el chat;
- estado del envío del formulario;
- autenticación del administrador;
- pestaña seleccionada;
- lista de imágenes, solicitudes y contenido;
- mensajes de error.

### Actualización basada en el estado anterior

```ts
setItems((prev) => [
  ...prev,
  { role: "user", text: message },
]);
```

Paso a paso:

1. React entrega el valor anterior en `prev`.
2. `...prev` copia los mensajes anteriores.
3. Se añade el mensaje nuevo.
4. React guarda la nueva lista.

Esto evita trabajar con una copia desactualizada del estado.

### `useEffect`

Ejecuta efectos que ocurren fuera del renderizado puro.

Ejemplo:

```ts
useEffect(() => {
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

Paso a paso:

1. Después de montar el componente, registra el evento.
2. El arreglo vacío `[]` indica que se hace una sola vez.
3. La función retornada es la limpieza.
4. Al desmontar el componente se elimina el evento.

Sin limpieza, cada montaje podría dejar otro listener activo.

Usos en el proyecto:

- escuchar el scroll;
- consultar si existe una sesión admin;
- restaurar el chat desde `sessionStorage`;
- guardar cambios del chat en `sessionStorage`;
- enfocar el campo del chat;
- mover el scroll al mensaje más reciente;
- cerrar menús con `Escape`;
- mantener el foco dentro del diálogo del chat;
- escuchar el evento que abre el asesor.

### Dependencias de `useEffect`

```ts
useEffect(() => {
  if (open) inputRef.current?.focus();
}, [open]);
```

El efecto se ejecuta cuando cambia `open`. Si pasa a `true`, enfoca el campo.

### `useRef`

Conserva una referencia sin provocar renderizados.

```ts
const inputRef = useRef<HTMLInputElement>(null);
```

Después se conecta al elemento:

```tsx
<input ref={inputRef} />
```

Y se usa así:

```ts
inputRef.current?.focus();
```

El proyecto usa referencias para:

- enfocar campos;
- desplazarse al final del chat;
- controlar el diálogo;
- regresar el foco al botón que abrió el chat;
- limpiar un `<input type="file">`;
- trabajar con el área de pegado del admin.

### `useCallback`

`AdminApp` envuelve `loadAll`:

```ts
const loadAll = useCallback(async () => {
  // cargar contenido, imágenes y leads
}, []);
```

`useCallback` conserva la identidad de la función entre renderizados. Esto es útil porque `loadAll` es una dependencia del `useEffect` inicial. Sin él, se crearía una función nueva en cada render.

### Hooks que no se usan

No se usan `useMemo`, `useReducer` ni Context. El estado está concentrado en los componentes que lo necesitan.

---

## 10. El asesor del hogar

El asesor está dividido en tres capas:

```text
components/site-assistant.tsx
        Interfaz del chat
                ↓
app/api/assistant/route.ts
        API, validación y guardado
                ↓
lib/assistant-local.ts
        Motor de reglas y estados
```

### Estado del chat

```ts
export type AssistantState = {
  jobs: JobItem[];
  current: number;
  zona?: string;
  cobertura?: "ok" | "pending" | "review";
  confirmed?: boolean;
  name?: string;
  phone?: string;
  leadSaved?: boolean;
  history?: AssistantState[];
};
```

Interpretación:

- `jobs`: trabajos detectados.
- `current`: trabajo que se está preguntando.
- `zona`: barrio o municipio.
- `cobertura`: evaluación de cobertura.
- `confirmed`: el cliente aprobó el resumen.
- `name` y `phone`: contacto.
- `leadSaved`: evita guardar dos veces.
- `history`: estados anteriores para el botón Atrás.

### Tipos de trabajo

`AssistantKind` admite:

- locativa;
- pintura;
- plomería;
- electricidad;
- instalaciones;
- remodelaciones;
- fachadas;
- impermeabilización;
- otro.

### No es inteligencia artificial

El motor aplica reglas:

1. normaliza el texto;
2. busca palabras y expresiones;
3. clasifica uno o varios trabajos;
4. elige preguntas según el tipo;
5. acumula respuestas;
6. pregunta ubicación;
7. muestra un resumen;
8. pide confirmación;
9. pide nombre y celular.

La función central es:

```ts
export function answerLocally(
  question: string,
  site: SiteContent,
  previous: AssistantState = { jobs: [], current: 0 },
): AssistantReply
```

Recibe:

- el mensaje nuevo;
- el contenido del sitio;
- el estado anterior.

Devuelve:

- texto de respuesta;
- botones rápidos;
- llamadas a la acción;
- estado actualizado.

### Recorrido de `answerLocally()`

En términos sencillos:

```text
¿Quiere reiniciar?
    sí → estado vacío
    no ↓
¿Quiere volver atrás?
    sí → recuperar history
    no ↓
¿El mensaje contiene zona?
    sí → guardar cobertura
    no ↓
¿Está respondiendo una pregunta del trabajo?
    sí → aplicar respuesta
    no ↓
¿Ya terminó detalles y confirmó resumen?
    sí → pedir o procesar contacto
    no ↓
Detectar nuevos trabajos
    ↓
Calcular la siguiente pregunta
```

### Funciones importantes del motor

#### `cleanAssistantState(raw)`

No confía directamente en el objeto recibido del navegador. Comprueba tipos, recorta textos y limita el historial a 20 estados.

#### `assistantInputHint(state)`

Decide el placeholder apropiado:

- “Nombre y celular”
- “Barrio o municipio”
- “¿Es correcto?”
- “¿Qué necesita tu hogar?”

#### `assistantCanGoBack(state)`

Permite volver solo si existe historial y la solicitud todavía no fue guardada.

#### `buildLeadFields(state)`

Convierte el estado conversacional al formato de una solicitud.

#### `shouldSaveLead(state)`

Comprueba:

```ts
return Boolean(
  state.confirmed &&
    state.name &&
    state.phone &&
    validPhone(state.phone) &&
    state.jobs.length &&
    !state.leadSaved
);
```

Todos los requisitos deben cumplirse.

#### `nextStep(site, state)`

Decide qué debe ocurrir a continuación:

- preguntar detalles;
- pedir zona;
- mostrar resumen;
- pedir contacto;
- informar que la solicitud ya quedó registrada.

### Persistencia en el navegador

`SiteAssistant` guarda en:

```text
sessionStorage["obratech-assistant-v17"]
```

Se guardan mensajes, estado, revisión y firma. `sessionStorage` dura mientras la pestaña esté abierta.

`CHAT_REVISION` sirve para invalidar conversaciones antiguas cuando cambian las reglas. Las claves viejas se eliminan desde `OLD_KEYS`.

### Firma del estado

El navegador puede modificar su propio `sessionStorage`. Por eso el servidor firma el estado.

```text
Servidor genera estado
        ↓
signState(estado)
        ↓
Responde { state, sig }
        ↓
Navegador devuelve { message, state, sig }
        ↓
verifiedState() recalcula la firma
        ↓
Si coincide: acepta
Si no coincide: inicia estado vacío
```

La firma es un HMAC SHA-256 con `ADMIN_SECRET`.

Esto evita que alguien fabrique directamente:

```json
{
  "confirmed": true,
  "name": "Nombre falso",
  "phone": "3000000000"
}
```

y consiga guardar una solicitud sin recorrer el flujo.

---

## 11. Flujo completo de una conversación

Supongamos que el usuario escribe: “Necesito pintar la sala”.

### Paso 1: evento de interfaz

El formulario del chat llama:

```ts
void send(input);
```

### Paso 2: petición HTTP

`send()` ejecuta:

```ts
fetch("/api/assistant", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message, state, sig }),
});
```

El navegador transforma el objeto en JSON y lo envía.

### Paso 3: entrada a la API

`app/api/assistant/route.ts`:

1. verifica el límite por IP;
2. lee el JSON;
3. limpia el mensaje;
4. rechaza mensajes vacíos;
5. lee `site.json`;
6. verifica la firma del estado;
7. llama `answerLocally()`.

### Paso 4: motor de reglas

El motor detecta “pintar” y crea un `JobItem` de tipo `pintura`. Después decide cuál es la siguiente pregunta.

### Paso 5: respuesta

La API firma el nuevo estado y devuelve algo conceptualmente parecido a:

```json
{
  "text": "¿Qué quieres pintar?",
  "chips": [],
  "state": {
    "jobs": [{ "kind": "pintura", "step": 0 }]
  },
  "sig": "firma-hmac"
}
```

### Paso 6: actualización visual

El cliente:

- guarda `state`;
- guarda `sig`;
- añade el mensaje a `items`;
- vuelve a renderizar;
- desplaza el chat al final.

### Paso 7: final del flujo

Cuando hay trabajo, zona, confirmación, nombre y teléfono válidos:

1. `shouldSaveLead()` devuelve `true`.
2. La API llama `appendLead()`.
3. Se guarda en `data/leads.json`.
4. El estado marca `leadSaved: true`.
5. El usuario recibe confirmación y enlace a WhatsApp.

---

## 12. Formulario público y API de solicitudes

### Frontend: `ContactForm`

El formulario no guarda cada campo en `useState`. Usa el propio elemento HTML y crea:

```ts
const data = new FormData(form);
```

Luego envía:

```ts
body: JSON.stringify({
  name: data.get("name"),
  phone: data.get("phone"),
  zona: data.get("zona"),
  servicio: data.get("servicio"),
  message: data.get("message"),
  company: data.get("company"),
})
```

### Backend: `POST /api/leads`

El servidor:

1. aplica máximo 8 envíos por IP cada 15 minutos;
2. analiza el JSON;
3. revisa el campo trampa `company`;
4. normaliza espacios y longitudes;
5. exige nombre y al menos 7 dígitos;
6. llama `appendLead()`;
7. devuelve identificador y si creó o actualizó.

### Honeypot

El campo `company` está oculto para personas. Algunos bots llenan todos los campos. Si viene lleno, la API responde como si todo hubiera funcionado, pero no guarda.

### Estados visuales

`ContactForm` utiliza:

- `idle`: esperando;
- `sending`: enviando;
- `ok`: enviado;
- `error`: ocurrió un problema.

También trata de manera distinta:

- error de red;
- respuesta 429;
- error de validación del servidor.

---

## 13. Persistencia en archivos JSON

### `data/site.json`

Contiene el contenido público:

- teléfono y WhatsApp;
- rutas de imágenes;
- distintivos;
- servicios;
- proyectos;
- testimonios;
- razones para elegir la empresa;
- preguntas frecuentes;
- zonas;
- identidad legal opcional;
- `serviciosInicio`, los seis oficios de la home.

No hay bloque de cotizador.

### `data/leads.json`

Contiene solicitudes privadas:

```ts
export type SiteLead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  zona: string;
  servicio: string;
  services: string[];
  message: string;
  source: "chat" | "formulario";
  status: "new" | "contact" | "quoting" | "done";
};
```

### `readSiteContent()`

Lee texto, ejecuta `JSON.parse()` y aplica valores por defecto para FAQ, zonas y testimonios.

### `sanitizeSiteContent()`

Convierte una entrada desconocida en un `SiteContent` válido.

Patrones útiles:

```ts
function text(value: unknown, max: number) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}
```

Paso a paso:

1. Recibe un valor de tipo desconocido.
2. Solo acepta cadenas.
3. Elimina espacios exteriores.
4. limita la longitud.
5. Si no era texto, devuelve cadena vacía.

`objectList()` aplica una transformación segura a cada objeto de una lista. Los elementos inválidos se descartan.

### Escritura atómica

`writeSiteContent()` y la escritura de leads usan:

```text
1. Escribir archivo.tmp
2. Terminar la escritura completa
3. Renombrar archivo.tmp al nombre real
```

Si el proceso se interrumpe durante el paso 1, el archivo anterior permanece intacto.

### Cola de solicitudes

Las operaciones sobre leads se encadenan con una promesa:

```ts
let colaLeads: Promise<unknown> = Promise.resolve();

function enCola<T>(tarea: () => Promise<T>): Promise<T> {
  const resultado = colaLeads.then(tarea, tarea);
  colaLeads = resultado.catch(() => undefined);
  return resultado;
}
```

Esto evita que dos solicitudes simultáneas dentro del mismo proceso lean la misma versión y luego se sobrescriban.

No sustituye una base de datos: varios procesos o servidores independientes no compartirían esa cola.

### Duplicados

`appendLead()` considera duplicado:

- mismo teléfono normalizado;
- mismo origen;
- dentro de 30 minutos.

En ese caso actualiza el registro reciente en vez de crear otro. El archivo conserva como máximo 200 solicitudes.

---

## 14. Panel administrativo

### Entrada

`app/admin/page.tsx` solo configura metadatos y renderiza `AdminApp`.

`AdminApp` es un Client Component grande porque contiene:

- login;
- carga de datos;
- pestañas;
- solicitudes;
- imágenes;
- edición de contenido.

### Inicio de sesión

Al montar, consulta:

```ts
fetch("/api/admin/me")
```

Si la cookie es válida, ejecuta `loadAll()`.

### `loadAll()`

Carga en paralelo:

```ts
const [contentRes, imagesRes, leadsRes] = await Promise.all([
  fetch("/api/admin/content"),
  fetch("/api/admin/images"),
  fetch("/api/leads"),
]);
```

`Promise.all()` espera varias promesas al mismo tiempo. Es más rápido que esperar una petición y luego iniciar la siguiente.

### Pestaña Solicitudes

Permite:

- ver nombre, teléfono, zona, servicio y mensaje;
- distinguir chat de formulario;
- cambiar estados;
- abrir WhatsApp con un mensaje preparado.

`leadWhatsAppHref()` normaliza el teléfono, compone párrafos y codifica el mensaje.

### Pestaña Fotos

Admite:

- seleccionar archivo;
- arrastrar y soltar;
- pegar desde el portapapeles;
- comprimir;
- subir;
- seleccionar;
- asignar a hero, servicios o proyectos;
- eliminar imágenes dentro de `uploads`.

La asignación primero cambia el estado local. Solo queda persistida cuando se pulsa Guardar.

### Pestaña Contenido

Edita el objeto `SiteContent` en memoria y lo envía completo mediante:

```ts
fetch("/api/admin/content", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(content),
});
```

El servidor no guarda ciegamente el objeto: exige listas principales y ejecuta `sanitizeSiteContent()`.

---

## 15. Autenticación y seguridad del admin

### Contraseña

`verifyAdminPassword()` lee `ADMIN_PASSWORD`. No existe una contraseña por defecto válida.

La comparación usa `timingSafeEqual()`:

```ts
const a = Buffer.from(input);
const b = Buffer.from(expected);
if (a.length !== b.length) return false;
return timingSafeEqual(a, b);
```

Esta función evita comparaciones carácter por carácter cuyo tiempo pueda revelar información.

### Rate limit del login

Permite 6 fallos por IP en 15 minutos. El contador está en un `Map` en memoria.

Es una protección básica. Se pierde al reiniciar y no se comparte entre servidores.

### Token y cookie

Al entrar:

```text
payload = "admin:" + fecha
firma = HMAC(payload, ADMIN_SECRET)
token = payload + "." + firma
```

La cookie:

- se llama `obratech_admin`;
- es `httpOnly`;
- usa `SameSite=lax`;
- es `secure` en producción;
- dura 7 días.

`httpOnly` impide leerla con JavaScript del navegador.

### APIs protegidas

Las rutas administrativas ejecutan:

```ts
if (!(await isAdminAuthenticated())) {
  return NextResponse.json(
    { error: "No autorizado" },
    { status: 401 }
  );
}
```

El código HTTP `401` significa que falta una autenticación válida.

### Límites actuales

- La fecha está incluida en el token, pero su antigüedad no se comprueba internamente.
- Cambiar `ADMIN_SECRET` invalida las sesiones.
- `robots.txt` y `noindex` no protegen `/admin`; solo afectan buscadores.
- En producción se necesita HTTPS.

---

## 16. Subida y procesamiento de imágenes

La subida tiene dos etapas.

### Etapa 1: navegador

`compressImageFile()`:

1. abre la imagen con `createImageBitmap`;
2. calcula un tamaño máximo de 1920 píxeles;
3. dibuja en un `<canvas>`;
4. intenta crear WebP;
5. si no puede, intenta JPEG;
6. devuelve el archivo comprimido.

Esto reduce el tráfico enviado al servidor.

### Etapa 2: servidor

`POST /api/admin/images`:

1. comprueba autenticación;
2. exige un archivo;
3. limita a 8 MB;
4. entrega los bytes a `sharp`;
5. comprueba dimensiones y formato real;
6. aplica rotación;
7. limita a 2400 × 2400 sin agrandar;
8. convierte a WebP con calidad 82;
9. escribe en `public/images/uploads/`.

Fragmento:

```ts
webp = await imagen
  .rotate()
  .resize({
    width: 2400,
    height: 2400,
    fit: "inside",
    withoutEnlargement: true,
  })
  .webp({ quality: 82 })
  .toBuffer();
```

Reprocesar también elimina metadatos EXIF que podrían incluir ubicación GPS.

### Eliminación segura

La API solo acepta rutas con la forma:

```text
/images/uploads/nombre-del-archivo
```

Después usa `path.resolve()` y `path.relative()` para confirmar que la ruta final sigue dentro de `uploads`.

---

## 17. CSS, diseño responsive y accesibilidad

### Variables de diseño

`app/globals.css` define:

```css
:root {
  --background: #0a0a0a;
  --foreground: #f5f5f5;
  --surface: #111111;
  --brand: #e85d04;
}
```

Esto facilita cambiar colores centrales sin buscar cada aparición.

### Clases compartidas

- `.section-pad`: separación vertical.
- `.section-title`: título grande.
- `.section-title-sm`: título mediano.
- `.section-lead`: introducción.
- `.panel`: superficie con borde.
- `.btn-primary`: botón naranja.
- `.btn-ghost`: botón oscuro con borde.

### Responsive

Clases como `md:` y `lg:` aplican estilos desde determinados anchos:

```tsx
className="grid md:grid-cols-2 lg:grid-cols-4"
```

- móvil: una columna;
- desde `md`: dos;
- desde `lg`: cuatro.

### Accesibilidad

El proyecto incluye:

- enlace “Ir al contenido”;
- estados `focus-visible`;
- `aria-label`;
- `aria-live` para mensajes;
- `role="dialog"` en el chat;
- cierre con Escape;
- trampa de foco;
- botones de al menos 44 píxeles aproximadamente;
- inputs de 16 píxeles para evitar zoom automático en iPhone;
- `prefers-reduced-motion`.

La regla:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

respeta a usuarios que pidieron menos movimiento en su sistema.

---

## 18. SEO

### Metadatos

`app/layout.tsx` define:

- título;
- descripción;
- iconos;
- Open Graph;
- idioma;
- color del navegador.

Open Graph controla cómo se presenta el enlace al compartirlo en redes y aplicaciones.

### Sitemap

`app/sitemap.ts` publica `/` y `/privacidad`.

### Robots

`app/robots.ts` pide a buscadores no rastrear:

- `/admin`;
- `/api/`;
- `/diseno`.

Esto no es seguridad. Una persona todavía puede abrir `/admin`; la contraseña es la protección real.

### Datos estructurados

`SiteJsonLd` informa a buscadores que se trata de un negocio de construcción y hogar, con teléfono, horario y área de servicio.

---

## 19. Códigos HTTP usados

Las APIs devuelven códigos que describen el resultado:

| Código | Significado en el proyecto |
|---|---|
| `200` | La acción funcionó |
| `400` | Los datos enviados son inválidos |
| `401` | Falta autenticación válida |
| `404` | El recurso no existe |
| `429` | Se superó el límite de intentos |
| `500` | Error o configuración inválida del servidor |

El frontend comprueba `res.ok`. Es `true` para respuestas exitosas y `false` para errores HTTP.

Un error HTTP no hace que `fetch()` lance automáticamente una excepción. Por eso se necesitan dos controles:

```ts
try {
  const res = await fetch(...);
  if (!res.ok) {
    // El servidor respondió, pero informó un error.
  }
} catch {
  // No hubo conexión o la petición no pudo completarse.
}
```

---

## 20. Scripts de desarrollo y pruebas

### `scripts/dev-lan.mjs`

Busca una dirección IPv4 local e inicia Next.js en `0.0.0.0:3001`, para abrir el sitio desde un celular conectado a la misma Wi-Fi.

### `scripts/dev-stop.mjs`

Busca procesos escuchando en puertos 3000 y 3001 y los detiene en Windows.

### `scripts/abrir-puerto-dev.ps1`

Configura el firewall de Windows para permitir el puerto de desarrollo local.

### `scripts/chat-100-users.ts`

Simula 101 casos de conversación. Comprueba clasificaciones, riesgos, cobertura y llegada al contacto.

No prueba la interfaz visual ni HTTP; llama directamente al motor.

### `scripts/verify-security.ts`

Comprueba:

- que las firmas sobreviven el viaje por JSON;
- que un estado inventado se descarta;
- que el saneado conserva una forma válida;
- que sanear dos veces produce el mismo resultado.

### Qué falta para una suite más completa

Sería útil estudiar y añadir más adelante:

- pruebas HTTP de las APIs;
- pruebas de interfaz con Playwright;
- pruebas de subida de archivos;
- pruebas de concurrencia;
- integración continua en GitHub Actions u otro servicio.

---

## 21. Cómo se conecta todo el proyecto

### Mapa arquitectónico

```text
                       ┌─────────────────────────┐
                       │      data/site.json     │
                       │ contenido público       │
                       └───────────┬─────────────┘
                                   │ readSiteContent()
                    ┌──────────────┼───────────────┐
                    ↓              ↓               ↓
              app/page.tsx   SiteJsonLd     API del chat
                    │
                    ↓ props
       ┌────────────┼───────────────────────────┐
       ↓            ↓                           ↓
   Secciones   ContactForm                SiteAssistant
                    │                           │
                    ↓ POST /api/leads           ↓ POST /api/assistant
                    │                           │
                    └────────────┬──────────────┘
                                 ↓
                           appendLead()
                                 ↓
                       ┌────────────────────┐
                       │  data/leads.json   │
                       └─────────┬──────────┘
                                 │ GET /api/leads
                                 ↓
                            AdminApp
                                 │
                     PATCH estado / WhatsApp
```

### Relación del panel con el contenido

```text
AdminApp modifica content en useState
                ↓
PUT /api/admin/content
                ↓
sanitizeSiteContent()
                ↓
writeSiteContent()
                ↓
data/site.json
                ↓
Recargar la home
                ↓
readSiteContent()
                ↓
Contenido actualizado
```

### Relación del panel con imágenes

```text
Archivo elegido
      ↓
compressImageFile() en navegador
      ↓
FormData
      ↓
POST /api/admin/images
      ↓
sharp en servidor
      ↓
public/images/uploads/*.webp
      ↓
Admin asigna URL a un campo
      ↓
Guardar contenido
      ↓
site.json referencia la nueva URL
```

---

## 22. Conceptos de JavaScript y TypeScript presentes

### Desestructuración

```ts
const { name, phone } = lead;
```

Extrae propiedades de un objeto.

### Spread

```ts
setContent({ ...content, zonas });
```

Crea un objeto nuevo copiando `content` y reemplazando `zonas`. En React no se recomienda modificar el objeto anterior directamente.

### Encadenamiento opcional

```ts
empresa?.razonSocial
```

Si `empresa` no existe, devuelve `undefined` en vez de lanzar error.

### Fusión nula

```ts
parsed.state ?? { jobs: [], current: 0 }
```

Usa el valor derecho solo si el izquierdo es `null` o `undefined`.

### Operador ternario

```ts
visible ? <section>...</section> : null
```

Es una forma corta de `if/else`.

### `async` y `await`

```ts
const site = await readSiteContent();
```

`await` pausa esa función hasta que la promesa termine. Solo puede usarse en una función `async` o en contextos compatibles.

### Métodos de listas

- `.map()`: transforma cada elemento.
- `.filter()`: conserva elementos que cumplen una condición.
- `.find()`: devuelve el primer elemento coincidente.
- `.findIndex()`: devuelve su posición.
- `.some()`: comprueba si al menos uno coincide.
- `.flatMap()`: transforma y aplana listas.
- `.slice()`: copia o recorta.

### Uniones de tipos

```ts
type LeadStatus = "new" | "contact" | "quoting" | "done";
```

Impide usar estados arbitrarios.

### Genéricos

```ts
function objectList<T>(...): T[]
```

`T` representa un tipo que se decide al llamar la función. La misma utilidad puede producir listas de servicios, proyectos o zonas conservando sus tipos.

---

## 23. Cómo construir un proyecto parecido desde cero

Un orden razonable de aprendizaje e implementación sería:

### Etapa 1: página estática

1. Crear proyecto Next.js.
2. Crear `app/layout.tsx`.
3. Crear `app/page.tsx`.
4. Dividir la home en componentes.
5. Añadir Tailwind y estilos globales.
6. Hacer el diseño responsive.

### Etapa 2: datos

1. Definir tipos TypeScript.
2. Crear `data/site.json`.
3. Crear `readSiteContent()`.
4. Pasar datos desde la página a los componentes.

### Etapa 3: formulario

1. Crear un Client Component.
2. Capturar `onSubmit`.
3. Crear `POST /api/leads`.
4. Validar en frontend y servidor.
5. Guardar inicialmente en un archivo.
6. Mostrar estados de carga y error.

### Etapa 4: admin

1. Crear `/admin`.
2. Crear login.
3. Crear cookie segura.
4. Proteger APIs.
5. Crear formularios de edición.
6. Sanear todo en el servidor.

### Etapa 5: chat guiado

1. Definir el estado.
2. Crear pocas categorías.
3. Crear función pura `answer(state, message)`.
4. Probarla sin interfaz.
5. Crear UI.
6. Añadir historial.
7. Firmar el estado.
8. Añadir pruebas.

### Etapa 6: producción

1. Migrar datos importantes a una base de datos.
2. Guardar imágenes en almacenamiento de objetos.
3. Configurar HTTPS.
4. Añadir backups.
5. Añadir logs y monitoreo.
6. Añadir límites persistentes.

---

## 24. Conceptos que conviene estudiar

### Fundamentos web

1. HTML semántico.
2. Formularios HTML.
3. CSS, Flexbox y Grid.
4. Responsive design.
5. Accesibilidad y ARIA.
6. HTTP, métodos y códigos de estado.
7. JSON.

### JavaScript

1. Variables, funciones y alcance.
2. Objetos y listas.
3. Desestructuración y spread.
4. Métodos `map`, `filter`, `find` y `some`.
5. Promesas.
6. `async` y `await`.
7. Manejo de errores con `try/catch`.
8. Eventos del navegador.
9. `sessionStorage`.
10. Inmutabilidad.

### TypeScript

1. Tipos primitivos.
2. `type` e `interface`.
3. Uniones literales.
4. Propiedades opcionales.
5. Genéricos.
6. `unknown` frente a `any`.
7. Narrowing o refinamiento de tipos.
8. Tipos importados con `import type`.

### React

1. Componentes y props.
2. JSX.
3. Renderizado condicional.
4. Listas y `key`.
5. Estado con `useState`.
6. Efectos y limpieza con `useEffect`.
7. Referencias con `useRef`.
8. Memorización de funciones con `useCallback`.
9. Formularios controlados y no controlados.
10. Flujo de datos unidireccional.

### Next.js

1. App Router.
2. Layouts y páginas.
3. Server y Client Components.
4. Route Handlers.
5. Metadata.
6. Rutas dinámicas y estáticas.
7. `next/image`.
8. `next/font`.
9. Variables de entorno.
10. Compilación y despliegue.

### Backend y seguridad

1. Validación en servidor.
2. Cookies y sesiones.
3. HMAC y firmas.
4. Rate limiting.
5. CSRF y XSS.
6. Sanitización.
7. Escrituras atómicas.
8. Condiciones de carrera.
9. Gestión de secretos.
10. Privacidad de datos personales.

### Persistencia

1. Sistemas de archivos.
2. Bases de datos relacionales.
3. Transacciones.
4. Índices.
5. Migraciones.
6. Almacenamiento de objetos para imágenes.
7. Backups y restauración.

### Pruebas

1. Pruebas unitarias.
2. Pruebas de integración.
3. Pruebas end-to-end.
4. Mocks.
5. Casos límite.
6. Integración continua.

---

## 25. Fortalezas del proyecto

- Separación clara entre páginas, componentes, APIs y lógica.
- Tipos TypeScript para contenido y solicitudes.
- Motor del chat probado con numerosos casos.
- Firma HMAC para evitar estados inventados.
- Validación y saneado del contenido.
- Escritura atómica de JSON.
- Cola de operaciones sobre solicitudes dentro del proceso.
- Contraseña sin valores por defecto válidos.
- Límite de intentos en login, formulario y chat.
- Procesamiento real de imágenes con Sharp.
- Buenas medidas de accesibilidad.
- SEO, sitemap y datos estructurados.
- Mensajes de error comprensibles.

---

## 26. Limitaciones y decisiones importantes

### Persistencia en archivos

Funciona para una validación pequeña y un único proceso, pero no es equivalente a una base de datos.

Para publicar se necesita:

- disco persistente;
- permisos de escritura;
- un solo proceso escritor o una base de datos;
- backups.

### Rate limits en memoria

Se reinician con el servidor y no se comparten entre instancias. Para producción con tráfico real conviene Redis o protección del proveedor.

### Fotos dentro de `public/`

Los archivos escritos después de iniciar un servidor de producción pueden no quedar disponibles inmediatamente como recursos estáticos según cómo Next.js y el hosting empaqueten `public/`. Una solución robusta es almacenamiento externo o una ruta dedicada para servir archivos.

### Sesión admin

La cookie dura siete días, pero el timestamp incluido en el token no se usa para comprobar su edad. Rotar `ADMIN_SECRET` invalida sesiones.

### Chat basado en reglas

Es predecible y no cuesta por mensaje, pero mantener muchas reglas en un único archivo grande se vuelve difícil. Una evolución natural sería dividir detectores, preguntas y flujos por servicio.

### Datos legales y comerciales

Los campos de empresa están vacíos y los testimonios permanecen ocultos. Son decisiones de contenido, no errores técnicos.

---

## 27. Resumen mental para recordar el proyecto

Si solo se recuerda una idea, debe ser esta:

```text
Next.js organiza páginas y APIs.
React construye la interfaz.
site.json alimenta el contenido público.
leads.json guarda las solicitudes.
El chat transforma mensajes en un estado estructurado.
Las APIs validan y conectan el navegador con los archivos.
El admin permite leer y modificar esos datos.
WhatsApp es el canal donde se termina la cotización.
```

La home es principalmente una composición de componentes que reciben datos. Las partes interactivas llevan `"use client"` y usan hooks. Las APIs son la frontera de confianza: reciben datos del navegador, los validan y solo después llaman a la lógica del servidor. `lib/` contiene la mayor parte de las reglas reutilizables. `data/` reemplaza temporalmente a una base de datos.

Comprender este proyecto consiste en seguir los datos:

1. ¿Dónde nacen?
2. ¿Qué componente los recoge?
3. ¿Qué API los recibe?
4. ¿Qué función los valida o transforma?
5. ¿Dónde se guardan?
6. ¿Qué componente los vuelve a mostrar?

Si se puede responder esas seis preguntas para el formulario, el chat, el contenido y las imágenes, ya se entiende la arquitectura esencial de ObraTech Web.

