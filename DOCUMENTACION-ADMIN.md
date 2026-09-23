# ObraTech — Panel admin

Guía de `/admin`: login, solicitudes, fotos y contenido.

La cotización sigue siendo por WhatsApp. El panel sirve para **ver leads**, **cambiar textos/fotos** y **escribirle al cliente**. No hay usuarios ni roles: una sola contraseña.

Documentación de producto: [DOCUMENTACION.md](./DOCUMENTACION.md). Chat: [DOCUMENTACION-CHAT.md](./DOCUMENTACION-CHAT.md). Interfaz: [DOCUMENTACION-UI.md](./DOCUMENTACION-UI.md).

---

## 1. Qué es y qué no es

**Qué es**
- Página `http://localhost:3000/admin` (en producción: `https://tudominio.com/admin`).
- Tres pestañas: **Solicitudes**, **Fotos**, **Contenido**.
- Login con cookie `httpOnly` (7 días).
- Datos en disco: `data/site.json` (contenido) y `data/leads.json` (solicitudes, gitignored).
- Fotos nuevas en `public/images/uploads/`.

**Qué no es**
- No es un CMS con varios usuarios.
- No borra leads ni edita el chat.
- No edita el nombre del sitio ni la razón social. Esos campos siguen en `site.json`.
- No hay cotizador ni precios.
- No se indexa (`robots: noindex`).
- No sustituye WhatsApp: al pasar un lead a “Contactar” **abre WhatsApp** con un mensaje listo.

---

## 2. Cómo entrar

1. Abrir `/admin`.
2. Contraseña = `ADMIN_PASSWORD` del `.env` / `.env.local`.
3. Si esa variable no existe, o si tiene alguno de los valores de ejemplo, el login responde error y **nadie puede entrar**. No hay contraseña por defecto.
4. Tras 6 intentos fallidos desde la misma IP hay que esperar 15 minutos.
5. **Olvidé la contraseña** abre `/admin/recuperar`. Solo funciona en este computador, entrando por localhost. La nueva queda en `data/admin-password.json` y reemplaza a `ADMIN_PASSWORD`.
6. Ya dentro, el botón **Contraseña** pide la actual y una nueva de al menos 10 caracteres.

Tras entrar, la pestaña inicial es **Solicitudes**.

**Salir:** botón “Salir” → `POST /api/admin/logout` (borra la cookie).  
**Ver sitio:** abre la home en otra pestaña.

---

## 3. Arquitectura

```
/admin  (app/admin/page.tsx, noindex)
    │
    ▼
components/admin/admin-app.tsx     UI (login + 3 pestañas)
    │
    ├─ POST /api/admin/login       cookie obratech_admin
    ├─ GET  /api/admin/me          ¿hay sesión?
    ├─ POST /api/admin/logout
    ├─ GET/PUT /api/admin/content  data/site.json
    ├─ GET/POST/DELETE /api/admin/images
    ├─ POST /api/admin/password    cambiar clave estando dentro
    ├─ POST /api/admin/recover     solo localhost
    └─ GET/PATCH /api/leads        data/leads.json
```

| Archivo | Rol |
|---------|-----|
| `app/admin/page.tsx` | Ruta + `robots: noindex` |
| `components/admin/admin-app.tsx` | Todo el panel (cliente) |
| `lib/admin-auth.ts` | Contraseña, HMAC, cookie |
| `lib/admin-password.ts` | Hash en `data/admin-password.json` y recuperación local |
| `components/admin/recover-form.tsx` | Formulario de `/admin/recuperar` |
| `lib/site-store.ts` | Leer/escribir JSON y listar fotos |
| `lib/compress-image.ts` | Comprime en el **navegador** a WebP ~1920 px |
| `app/api/admin/*` | APIs autenticadas |
| `app/api/leads/route.ts` | GET/PATCH admin; POST es el formulario público |

La home es `dynamic = "force-dynamic"`: al guardar contenido, **recarga la web** (no hace falta `npm run build` otra vez).

---

## 4. Login y cookie

| Pieza | Valor |
|-------|--------|
| Cookie | `obratech_admin` |
| Tipo | `httpOnly`, `SameSite=lax`, `path=/` |
| `secure` | solo si `NODE_ENV === production` |
| Duración | 7 días |
| Token | `admin:{timestamp}.{hmac}` firmado con `ADMIN_SECRET` (obligatoria: si falta, la sesión no valida y no se puede entrar) |

`GET /api/admin/me` solo dice `{ authenticated: true/false }`.  
Si `GET /api/admin/content` o `/api/admin/images` responden 401, el panel vuelve al login.

La contraseña se compara con `timingSafeEqual`, no con `===`, para no filtrarla por el tiempo de respuesta.

**Límites**
- Login: **6 intentos fallidos por IP cada 15 minutos** (429). El contador se borra al acertar. Vive en memoria, así que se reinicia con el servidor y no se comparte entre procesos: frena la fuerza bruta, no la reemplaza la protección del hosting.
- El token no se invalida al cambiar la contraseña si **no** cambias `ADMIN_SECRET`. Cambia ambos al publicar.
- El token lleva timestamp pero **no se comprueba su edad**: una copia del token sigue valiendo hasta que cambies `ADMIN_SECRET`. La cookie sí caduca a los 7 días.
- Un solo “usuario”: quien tenga la clave.

Variables (`env.example` → copiar a `.env.local` en local, `.env` en el servidor):

```
ADMIN_PASSWORD=una-clave-fuerte
ADMIN_SECRET=otro-secreto-para-firmar-la-cookie
NEXT_PUBLIC_SITE_URL=https://dominio-real.com
```

---

## 5. Pestaña Solicitudes

Fuente: chat (`source: "chat"`) y formulario (`source: "formulario"`). Archivo `data/leads.json` (máx. 200). Duplicado: mismo teléfono + mismo origen en **30 minutos** actualiza el lead, no crea otro.

Tabla: cliente (nombre, teléfono, fecha, mensaje), servicio(s), zona, origen, estado.

**Solo nuevas** oculta las que no están en Nuevo. **Ver todas** las devuelve. El número del botón es el de solicitudes nuevas.

### Estados

| Valor | En el select | Qué implica |
|-------|----------------|-------------|
| `new` | Nuevo | Recién llegado. Badge naranja en la pestaña = cantidad de nuevos |
| `contact` | Contactar | Al elegirlo **abre WhatsApp** del cliente |
| `quoting` | Cotizando | Seguimiento |
| `done` | Cerrado | Terminó |

Botón **WhatsApp** en la fila:
- Si el estado no es “Contactar”, primero pasa a `contact` y abre WhatsApp.
- Si ya está en “Contactar”, solo abre WhatsApp.

Mensaje que arma el panel (hacia el **cliente**, no hacia ObraTech):

```
Hola {nombre}, te escribimos de ObraTech.
Recibimos tu solicitud de {servicios}.
Zona: {zona}.
¿Tienes un momento para coordinar?
```

El `wa.me` usa `57` + 10 dígitos si el teléfono tiene 10 números.

PATCH: `PATCH /api/leads` `{ id, status }` (solo autenticado). No hay borrar lead desde la UI.

---

## 6. Pestaña Fotos

Lista **todas** las imágenes de `public/images/` (incluidas las de plantilla: hero, servicios, proyectos). Solo se pueden **borrar** las de `/images/uploads/`.

### Subir

1. Elegir archivo, arrastrar, o clic en la zona y **Ctrl+V / Cmd+V**.
2. En el navegador se comprime (`compressImageFile`): lado mayor 1920 px, WebP calidad 0.82 (GIF no se toca).
3. `POST /api/admin/images` (máx. **8 MB** ya comprimido).
4. Queda en `public/images/uploads/{timestamp}-{id}.{ext}`.

### Poner una foto en la página

1. En **Fotos de la página**, pulsar **Cambiar** en el lugar (portada, Nosotros, fondo, tarjeta o proyecto, incluido el antes).
2. Hacer clic en una foto de **Todas las fotos**. Cada miniatura dice en qué lugar se usa.
3. Eso **solo cambia el borrador**. Hay que pulsar **Guardar** (`PUT /api/admin/content`).
4. Si hay cambios sin guardar, el panel lo dice arriba. Al recargar `/admin` se pierden.
5. Recargar la home para verlo.

El antes de un proyecto puede quedar vacío. **Quitar** lo deja sin esa foto.

### Borrar

Solo uploads. Pide confirmación. No borra el archivo de plantilla (`hero-fondo.jpg`, `logo.png`, etc.).

---

## 7. Pestaña Contenido

Un solo **Guardar contenido** al final escribe todo `data/site.json`.

### Lo que sí se edita

Arriba hay saltos a **Proyectos**, **Zonas** y **Preguntas**.

| Bloque | Campos |
|--------|--------|
| Contacto | WhatsApp (**solo dígitos, con 57**, ej. `573156670450`) y teléfono visible (`+57 315 667 0450`) |
| Distintivos | Los textos de la barra que va después de los proyectos. Se pueden agregar y quitar |
| Por qué ObraTech | Título y texto de cada punto de la franja. Se pueden agregar y quitar |
| Proyectos | título, ciudad, foto del después, foto del antes (opcional), una línea de qué se hizo (opcional); se pueden **agregar** |
| Testimonios | Interruptor **Mostrar en la web**. Mientras está apagado, la lista va plegada y se abre con **Editar los textos**. Por ítem: visible, nombre, barrio, proyecto, 1–5, texto |
| Lista de la home | Los seis oficios que se ven en Servicios y abren el asesor (`serviciosInicio`: título y descripción; el `id` no se cambia) |
| Exteriores | Fachadas, impermeabilización, remodelaciones y la foto grande de reparaciones (`servicios`) |
| Zonas | nombre y detalle; se pueden agregar y quitar |
| FAQ | pregunta y respuesta; se pueden agregar y quitar |

WhatsApp mal escrito (sin `57`, con espacios) rompe todos los botones `wa.me` del sitio.

Si se borran todas las zonas o todas las preguntas y se guarda, el servidor restaura las de siempre. El panel adopta ese contenido y las vuelve a mostrar. Lo mismo pasa si se borra toda la lista de la home.

Testimonios: si no son reales, dejar **Mostrar en la web** apagado. Hoy está en `false`.

### Lo que no se edita en el panel

- `siteName` y `empresa` (razón social, NIT)
- Textos fijos del código: nav, proceso, copy del hero, reglas del chat

**Zonas** y **FAQ** sí se pueden agregar y quitar desde el panel, no solo editar.

Zonas del admin alimentan aliases del chat (`detectZona`). Cambiar nombres sin cuidado puede cambiar cómo el asesor etiqueta barrios. Ver [DOCUMENTACION-CHAT.md](./DOCUMENTACION-CHAT.md) §9.

---

## 8. APIs

| Método | Ruta | Auth | Función |
|--------|------|------|---------|
| POST | `/api/admin/login` | — | Cookie si la clave coincide (6 intentos / 15 min por IP) |
| POST | `/api/admin/logout` | — | Borra cookie |
| GET | `/api/admin/me` | cookie | `{ authenticated }` |
| GET | `/api/admin/content` | admin | `site.json` |
| PUT | `/api/admin/content` | admin | Guardar. Exige listas en `servicios`, `faq`, `zonas`, `badges`, `proyectos`; sanea todo lo demás |
| GET | `/api/admin/images` | admin | Lista `public/images/**` |
| POST | `/api/admin/images` | admin | Subir (FormData `file`, máx. 8 MB, se decodifica y reprocesa a WebP) |
| DELETE | `/api/admin/images` | admin | Borrar solo `/images/uploads/{archivo}` (bloquea `..`) |
| POST | `/api/admin/password` | admin | Contraseña actual + nueva. La nueva se guarda como hash |
| POST | `/api/admin/recover` | solo localhost | Nueva contraseña sin sesión. Rechaza si la petición no viene de localhost |
| GET | `/api/media/:file` | no | Lee una foto de uploads. `next.config.ts` reescribe `/images/uploads/:file` hacia aquí |
| GET | `/api/leads` | admin | Listar |
| PATCH | `/api/leads` | admin | Estado |
| POST | `/api/leads` | no | Formulario público (honeypot `company`, 8 envíos / 15 min por IP) |

PUT de contenido pasa todo por `sanitizeSiteContent()` en `lib/site-store.ts`: valida y convierte cada campo, descarta las filas rotas, y si WhatsApp, el nombre o alguna imagen llegan vacíos conserva el valor anterior. Después escribe en un temporal y lo renombra encima, de modo que un corte a mitad no parte `site.json`. Un JSON raro ya no puede romper la home; lo que sí puede es borrar contenido, así que sigue conviniendo guardar con cuidado.

POST de imágenes no le cree al tipo declarado ni a la extensión: decodifica el archivo con `sharp`. Si no es una imagen de verdad, lo rechaza. Lo que sí lo es se reprocesa a WebP de máximo 2400 px, y de paso se le quitan los metadatos EXIF (que pueden traer la ubicación GPS de la foto). Todos los archivos nuevos quedan con extensión `.webp`.

---

## 9. Uso diario (equipo)

1. Entrar a `/admin`.
2. **Solicitudes:** leads `Nuevo` → **WhatsApp** o estado Contactar.
3. Cotizar por WhatsApp (no hay precios en el panel).
4. Pasar a Cotizando / Cerrado.
5. Fotos o textos: editar → Guardar. Si el aviso “Hay cambios sin guardar” sigue visible, todavía no quedó en disco. Recargar la web pública.

Si “Guardado” y la home no cambia: recarga forzada (caché) o el servidor no está persistiendo `data/` (típico de Vercel efímero).

---

## 10. Disco y hosting

| Ruta | Qué hay | Git |
|------|---------|-----|
| `data/site.json` | Contenido público | sí (con el repo) |
| `data/leads.json` | Teléfonos | **no** (`.gitignore`) |
| `data/admin-password.json` | Hash de la contraseña elegida en el panel | **no** |
| `public/images/uploads/` | Subidas | `.gitkeep` sí; archivos nuevos no hace falta commitearlos |
| `public/images/*.jpg` etc. | Plantilla | sí |

Hace falta **disco persistente**. Si el proceso se recrea sin volumen, se pierden leads y uploads.

Permisos de escritura: el usuario de Node debe poder escribir en `data/` y `public/images/uploads/`.

---

## 11. Seguridad (antes de dominio público)

1. `ADMIN_PASSWORD` y `ADMIN_SECRET` largos y aleatorios en `.env`. Ya no hay fallbacks en el código: el login rechaza los valores de ejemplo y falla si las variables no están.
2. HTTPS para que `secure` de la cookie sirva.
3. No commitear `.env` ni `leads.json`.
4. `/admin` noindex; igual cualquiera puede abrir la URL si conoce el path. `robots.txt` y `noindex` no protegen nada: solo le piden a los buscadores que no lo muestren. La protección real es la contraseña.
5. Login limitado a 6 intentos por IP cada 15 minutos, pero en memoria. En internet conviene además la protección de fuerza bruta del proveedor.

---

## 12. Deuda (no es el producto hoy)

- Un solo password, sin 2FA ni usuarios.
- No hay rate limit en login.
- El token HMAC no tiene expiración propia (solo `maxAge` de la cookie).
- Contenido: no se pueden agregar FAQ/zonas desde la UI.
- Asignar foto sin guardar se pierde al recargar el admin.
- Compresión WebP depende del navegador (`canvas.toBlob`).
