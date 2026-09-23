# ObraTech — Asesor del hogar

Guía del chat público. Fuente de verdad: el código, no un modelo de IA.

La cotización **nunca** se cierra en la web. El chat clasifica el problema, pide zona y contacto, guarda un lead y abre WhatsApp con el resumen.

Tono: **tuteo** (“¿Qué necesita tu hogar?”). El resto del sitio usa usted.

Documentación de producto: [DOCUMENTACION.md](./DOCUMENTACION.md). Interfaz: [DOCUMENTACION-UI.md](./DOCUMENTACION-UI.md).

---

## 1. Qué es y qué no es

**Qué es**
- Widget “Asesor del hogar” en la home `/`.
- Motor de **reglas + chips** en `lib/assistant-local.ts` (~3.200 líneas).
- Uno o varios trabajos por conversación.
- Lead `source: "chat"` en `data/leads.json`.
- Mensaje de WhatsApp armado con el contexto.

**Qué no es**
- No cotiza ni da precios.
- No diagnostica fallas eléctricas de riesgo (chispa, humo, olor a quemado).
- No afirma la causa de humedades.
- No corre en `/diseno`.
- No usa IA de pago: todo son reglas locales. `GROQ_API_KEY` no aplica.

---

## 2. Arquitectura

```
Hero / Servicios / FAQ / CTA / barra móvil
        │  evento "obratech-open-assistant"
        ▼
components/site-assistant.tsx     UI + sessionStorage v17
        │  POST { message, state, sig }
        ▼
app/api/assistant/route.ts        40 requests / 10 min por IP
        │  answerLocally()
        ▼
lib/assistant-local.ts            motor que corre
        │  si confirmed + nombre + celular válido
        ▼
lib/site-store.ts → appendLead()  data/leads.json
        │
        ▼
CTA wa.me con el resumen
```

| Archivo | Rol |
|---------|-----|
| `components/site-assistant.tsx` | Panel, burbujas, chips, persistencia, Atrás / Limpiar |
| `components/open-assistant-button.tsx` | Evento global `obratech-open-assistant` |
| `components/mobile-action-bar.tsx` | En móvil: botón “Asesor” (el launcher desktop está oculto) |
| `app/api/assistant/route.ts` | API, rate limit, guardado de lead |
| `lib/assistant-local.ts` | Estados, detección, preguntas, WhatsApp |
| `lib/site-store.ts` | Leads y `site.json` (aliases de zona) |
| `lib/content.ts` | `whatsappUrl` / `whatsappCustomUrl` |
| `app/page.tsx` | Monta `<SiteAssistant key="assistant-hogar-v9" />` |
| `scripts/chat-100-users.ts` | Simulación de conversaciones (`npm run test:chat`) |

**Cómo se abre**
- Hero (CTA “Cuéntanos qué necesitas”)
- Lista de servicios (cada oficio)
- FAQ / cobertura
- CTA final
- Barra inferior móvil (“Asesor”)
- Botón desktop abajo-izquierda (“Asesor del hogar”)

---

## 3. Interfaz

- **Desktop:** botón fijo abajo-izquierda (`hidden md:inline-flex`). Panel ~22.5 rem, `z-50`.
- **Móvil:** el launcher del widget está oculto; se abre desde la barra inferior. Con el chat abierto, el panel sube para no tapar esa barra (`bottom-[max(5rem,…)]` + `safe-area`).
- Header del panel: “Asesor del hogar”, **Atrás**, **Limpiar**, **×**.
- Accesibilidad: `role="dialog"`, `aria-modal`, trap de Tab, Escape cierra, `aria-live="polite"`. Al abrir, focus al input; al cerrar, al launcher.
- Placeholder según el paso (`assistantInputHint`).
- Chip “Atrás” se envía en silencio (`send(..., true)`): no pinta burbuja de usuario.
- CTA WhatsApp siempre presente. Tras guardar el lead pasa a “Continuar por WhatsApp”.
- Enlaces `http` se abren en pestaña nueva; anclas internas cierran el panel.

---

## 4. Sesión en el navegador

| Clave | Valor actual |
|-------|----------------|
| `sessionStorage` | `obratech-assistant-v17` |
| `CHAT_REVISION` | `17` |

Al cargar:
1. Borra claves viejas `v1`…`v15`.
2. Restaura solo si `revision === 17` **y** el primer mensaje incluye `"Qué necesita tu hogar"`.
3. Si no, resetea al welcome.

**Al cambiar reglas o el texto de bienvenida, hay que subir `STORAGE_KEY` y `CHAT_REVISION`** (y agregar la clave vieja a `OLD_KEYS`). Si no, el usuario sigue un embudo viejo.

Es `sessionStorage` (se pierde al cerrar la pestaña). La página `/privacidad` lo menciona.

---

## 5. Embudo (máquina de estados)

### Estado (`AssistantState`)

```ts
{
  jobs: JobItem[];
  current: number;
  zona?: string;
  cobertura?: "ok" | "pending" | "review";
  confirmed?: boolean;
  listedMulti?: boolean;
  listedUnknown?: boolean;
  name?: string;
  phone?: string;
  leadSaved?: boolean;
  history?: AssistantState[];  // hasta 20 snapshots para Atrás
}
```

Cada `JobItem`: `kind`, `trabajo`, `step`, `answers[]`, flags `requiereVisita` / `riesgo` / `especial`, `servicios[]`.

### Pasos

```
1. Welcome
   "Hola. ¿Qué necesita tu hogar?"
   chips: Reparar / Pintar / Plomería / Electricidad /
          Instalar / Remodelar / Varias cosas / No sé

2. Detalle por trabajo (stepsOf)
   Si hay varios: "Detectamos N necesidades: … Vamos una por una."

3. Zona
   "¿En qué zona está el inmueble?"
   chips: Bogotá | Sabana | Otra zona

4. Resumen
   "¿La información es correcta?"
   chips: Sí, es correcto | Editar

5. Contacto
   nombre y celular
   chip ejemplo: Laura 3001234567

6. Lead + WhatsApp
   "Perfecto, {nombre}. Hemos recibido tu solicitud."
   CTA: Continuar por WhatsApp
   chip: Otra solicitud  →  resetea a welcome
```

### Comandos

| Texto | Efecto |
|-------|--------|
| `empezar de nuevo` / `otra solicitud` / `reiniciar` | Estado vacío + welcome |
| `Quiero volver atrás` / `me equivoqué` / `paso anterior` | Pop de `history` |
| En el resumen: `editar` / `corregir` / `no es` | También cuenta como atrás |
| Saludo corto (`hola`, `buenas`…) sin jobs | Vuelve a mostrar welcome |
| Pregunta de precio, sola, con un trabajo abierto | No avanza el paso. Repite la pregunta y dice que el valor se cotiza por WhatsApp |
| Precio y problema en el mismo mensaje | Avanza y antepone que el valor se cotiza por WhatsApp |
| “gracias” u otro cierre corto tras guardar | No abre otra solicitud |

Orden en `answerLocally`: **Atrás y reset van antes** de clasificar. Una zona fuera de cobertura **no** interrumpe si el usuario está respondiendo el detalle de un trabajo (salvo frases cortas que solo son lugar).

---

## 6. Categorías (`AssistantKind`)

| Kind | Etiqueta | Cómo entra |
|------|----------|------------|
| `locativa` | Reparaciones locativas | Reparar, pared, techo, humedad, gotera, puerta, piso… |
| `pintura` | Pintura | pintar / pintura; fachada/culata sin “impermeabil” |
| `plomeria` | Plomería | fuga, gotea, sanitario, grifería, tubería… |
| `electricidad` | Electricidad | lámpara, interruptor, toma, breaker, chispa… |
| `instalaciones` | Instalaciones | cortina, persiana, espejo, cuadro, TV |
| `remodelaciones` | Remodelación | remodel / reforma / renovar; o “baño” si no hay plomería |
| `fachadas` | Fachada / exterior | impermeabil, cubierta, jardinera, trabajo en altura |
| `otro` | Diagnóstico / por clasificar | “no sé”, mancha/moho, o texto libre ≥ 10 caracteres |

### Conflictos que el detector resuelve (no deja ambos)

- Pintura + fachadas → **pintura**.
- Electricidad + instalaciones → **electricidad**.
- Electricidad + locativa (sin pared/techo/pañete) → **electricidad**.
- Plomería + otro → **plomería**.
- Locativa + otro (sin pintura) → **locativa**.
- Locativa + remodelación: gana **locativa** si habla de reparar/daño; gana **remodelación** si habla de remodelar.
- Pintura explícita → quita locativa y otro.
- Gotera/techo/pared + plomería **sin** piezas de baño/cocina → **locativa**.

Si el usuario elige un chip de inicio (`chipKind`) y el texto no matchea detectores, igual crea ese job.

Varios trabajos: **remodelación primero**. Los demás acortan `trabajo` a una etiqueta corta.

El kind `fachadas` casi no llega al usuario: impermeabilización cae ahí, pero si también hay “pintura” se descarta fachadas.

---

## 7. Árboles de preguntas

El árbol **cambia** según respuestas previas (`stepsOf(kind, job)`). El `step` es el índice en ese árbol **recalculado**, no una lista fija.

### 7.1 Plomería

1. ¿Qué ocurre? Fuga / Instalación / Daño
2. ¿Dónde? Baño / Cocina / Otro

Luego, según tipo + lugar:
- **Fuga cocina:** ¿todo el tiempo o al usar? → ¿debajo del mueble o cerca de la llave?
- **Fuga baño:** ¿sanitario / ducha / lavamanos / tubería / no sé? → ¿cuándo aparece?
- **Fuga otro:** lavadero / tubería / tanque → ¿cuándo?
- **Instalación:** qué pieza (varía baño vs cocina) → ¿ya tiene el producto?
- **Daño:** qué falla → ¿desde cuándo?

Si el primer mensaje ya dice “fuga en el baño”, **salta** tipo y lugar.  
“No sale agua” / “pieza rota” marca `requiereVisita`.

### 7.2 Electricidad (familias)

`iluminacion` · `puntos` · `ventilador` · `fallas` · `apagon` · `mixto` · `otro`

- Iluminación: cantidad → lugar → ¿ya hay punto eléctrico?
- Puntos: ¿nuevo o reemplazo? → lugar
- Ventilador: punto eléctrico → suministro → lugar
- Fallas: ¿solo ese punto o varios? → ¿olor/ruido/calor? → lugar
- Apagón: ¿toda la vivienda? → ¿tablero apagado?
- Mixto: tipo + conexión + lugar
- Otro: tipo + lugar

**Riesgo** (`riesgo: true`, `step: 99`) si hay chispa, olor a quemado, calentamiento, cortocircuito, humo, cables pelados, “se van los tapones”, o “sí” a señales de alarma.

No diagnostica por chat. Mensaje: se registra para revisión prioritaria. El árbol queda vacío (pasa a zona).

Avisos:
- Sin punto eléctrico → puede requerir revisión.
- Punto nuevo → puede intervenir la instalación.

### 7.3 Instalaciones

1. Qué instalar (cortinas, persianas, repisas, espejos, cuadros, TV, otro)
2. ¿Ya tiene el producto?

### 7.4 Locativa (reparar)

1. Qué elemento (pared/techo, puerta/ventana, piso, mueble, drywall, otro)
2. Desambiguar pared vs techo, o puerta vs ventana si eligió el chip mixto
3. Problema específico según elemento
4. “Cuéntanos qué ocurrió” (texto libre; chip “Ya lo expliqué”)
5. Si hay humedad/mancha: ¿después de la lluvia? ¿sigue apareciendo?
6. Material (puerta/ventana), alcance (piso), empotrado (mueble)
7. Tamaño del daño (superficies)
8. Condición especial: altura / peligroso / no

Servicios derivados: Reparación locativa, Pintura, Enchapes, Drywall, Carpintería, Posible humedad; a veces Plomería o Electricidad.

Visita si: humedad activa, gotera, gran parte, varias piezas, altura, peligroso, “no estoy seguro”.

### 7.5 Pintura

1. Qué pintar (habitación, sala, apto, techo, puertas, fachada, otro)
2. Interior / exterior / ambos (si no es fachada ni apto)
3. Si es exterior genérico: fachada, culata, patio, terraza, rejas
4. Si es apartamento: ¿todo o algunas áreas? + ¿cuántas habitaciones?
5. Fachada/exterior: m² + altura
6. Estado de la superficie (chips distintos interior vs fachada)
7. Si hay grietas: ¿pequeñas o desprendimiento?
8. Si hay humedad: ¿sigue o es mancha antigua?
9. Interior: m² (o se revisa al cotizar)
10. Exterior: ¿acceso sencillo o requiere equipo?

Visita/especial si: fachada, altura ≥ 6 m, equipo, humedad activa, deterioro fuerte.

No promete que pintar quite la humedad si esta sigue apareciendo.

### 7.6 Fachadas (kind `fachadas`)

Poco usado (el detector suele mandar a pintura).

1. m²
2. Altura (planta baja / hasta 5 m / más de 5 m)

Al responder altura marca `especial` + `requiereVisita`.

### 7.7 Remodelación

1. Espacio: baño, cocina, habitación, sala, apto completo, otro (puede ser mixto)
2. Qué cambiar (catálogo distinto por espacio; admite varios)
3. Parcial vs completa
4. ¿Instalaciones funcionan? (no se pregunta en apto completo)
5. Objetivo (modernizar, acabados, cambio total, problemas, espacio)
6. Tamaño (acepta `2 x 2`, `50 m2`, o pequeño/mediano/grande)
7. Cuándo (ya, próximo mes, 1–3 meses, planeando)

Siempre `requiereVisita: true`. `especial` si habla de distribución / ampliar / estructural.

### 7.8 Otro / diagnóstico

1. ¿La mancha es después de la lluvia o permanente?
2. ¿Interior o exterior?

Siempre visita. El resumen dice que no hace falta nombrar el oficio.

---

## 8. Prefill (saltar preguntas)

Si el usuario escribe una frase larga (“quiero pintar la fachada de 80 m²”), `prefillPaint` / `prefillRepair` / `prefillElectric` / `prefillRemodel` recorren el árbol y **rellenan pasos** cuyo texto ya está en el mensaje (`infer*Step`).

Normalización `fold()`: minúsculas, sin tildes, sin puntuación. `hasAny`: palabras ≥ 5 caracteres por `includes`; las cortas por token exacto.

Texto libre de reparación (`isRepairNarrative`): ≥ 24 caracteres y que **no** sea un chip conocido → se guarda como “Qué ocurrió: …” y se salta esa pregunta.

---

## 9. Cobertura

**No hay rechazo duro.** El chat no dice “no cubrimos esa zona”.

| Detección | `cobertura` | Mensaje al usuario |
|-----------|-------------|-------------------|
| Usaquén, Cedritos, Suba, Chapinero, Teusaquillo, Chía, Cajicá, Cota, La Calera, “Bogotá”, “norte”, etc. | `ok` | Sigue el flujo |
| Engativá, Fontibón, Sopó, Zipaquirá, Mosquera, Funza, “otra zona”, “por confirmar” | `pending` | En el resumen: “zona por confirmar” |
| Kennedy, Bosa, Soacha, Ciudad Bolívar, Usme, Tunjuelito, Rafael Uribe, San Cristóbal, Patio Bonito, “Bogotá sur” | `review` | “En esa zona revisamos primero si podemos atenderte. Podemos registrar la solicitud y confirmarlo al coordinar.” **No** dice “peligroso” ni nombra la localidad |

Aliases extra salen de `site.zonas` (admin). Primero busca barrios concretos, después genéricos (`norte`, `sabana`, `bogota`) para no pisar.

Chips de zona: `Estoy en Bogotá` / `Estoy en la Sabana` / `Estoy en otra zona por confirmar`.

---

## 10. Confirmación, contacto y lead

**Confirmar resumen:** el texto debe matchear `es correcto` / `si el resumen` / `correcto` / `confirmo` (el chip “Sí, es correcto” sirve).

**Teléfono válido** (`validPhone`):
- 10 dígitos que empiezan por `3`, o
- ≥ 12 dígitos que empiezan por `57`, o
- cualquier otro con ≥ 10 dígitos.

`parseContact` extrae dígitos y nombre (quita “me llamo”, “soy”, “celular”, etc.). Ejemplo: `Laura 3001234567`.

**Se guarda el lead cuando** (`shouldSaveLead`):

`confirmed && name && phone válido && hay jobs && !leadSaved`

La API entonces:
1. `appendLead(buildLeadFields(state))`
2. Marca `leadSaved: true`
3. Vuelve a llamar `answerLocally("ok", …)` para chips/CTAs finales
4. Sustituye el texto:
   - creado: solicitud registrada + WhatsApp
   - duplicado 30 min: “Ya teníamos tu solicitud reciente; la actualizamos”
   - error de disco: no bloquea; invita igual a WhatsApp

### Campos del lead

| Campo | Origen |
|-------|--------|
| `name` | parseado o `"Cliente chat"` |
| `phone` | dígitos |
| `zona` | detectada |
| `services` | `job.servicios` o etiqueta del kind |
| `servicio` | join de services, máx. 80 |
| `message` | frase de remodel/pintura o `jobLine` de cada trabajo, máx. 500 |
| `source` | `"chat"` |
| `status` | `"new"` |

Duplicados: mismo teléfono + mismo origen en **30 minutos** → actualiza, no crea otro. Máximo **200** leads.

Tras `leadSaved` no se puede deshacer el registro. “Otra solicitud” o “Empezar de nuevo” abren un chat nuevo. Si la persona describe otro trabajo (un chip o un oficio detectado), también empieza una conversación nueva y puede guardarse un segundo lead. “Gracias” y otras frases cortas de cierre no lo hacen.

---

## 11. WhatsApp

Siempre hay un CTA. Con jobs + nombre el texto se personaliza:

- **Remodelación:** “Hola, soy {nombre}. Quiero remodelar {espacio}…”
- **Pintura:** “Necesito pintar {espacio} de mi vivienda…”
- **Solo electricidad:** trabajo + lugar + nota de riesgo/visita + celular
- **Resto:** lista numerada kind + trabajo + cada answer

URL: `https://wa.me/{numero}?text=…` (`whatsappCustomUrl`). El número sale de `site.json` / admin.

---

## 12. API `POST /api/assistant`

**Body:** `{ message: string, state?: AssistantState, sig?: string }`

**Límites:**
- Mensaje recortado a **500** caracteres (el motor luego a 400).
- **40** requests / **10 min** por IP (`x-forwarded-for` o `"local"`). El mapa vive **en memoria del proceso** (se pierde al reiniciar; con varios workers cada uno tiene su contador).
- Estado sanitizado con `cleanAssistantState` (kinds válidos, recortes, history ≤ 20) y verificado contra `sig`.

**Respuesta:** `{ text, chips, ctas, state, sig }` o `{ error }` (400 / 429).

Sin autenticación. El cliente **reenvía el state entero** en cada turno (el servidor no guarda la conversación).

### Firma del estado

Como el estado viaja por el cliente, va firmado (`lib/state-signature.ts`):

1. El servidor responde con `sig`, un HMAC SHA-256 del estado que él mismo produjo.
2. El cliente lo guarda junto al estado y lo reenvía tal cual en el turno siguiente.
3. `verifiedState()` recalcula el HMAC. Si no coincide, **descarta lo que llegó** y arranca la conversación de cero.

Así nadie puede mandar un estado con `confirmed`, `name` y `phone` ya puestos para colar una solicitud sin haber conversado. El primer mensaje llega sin firma y cae por el mismo camino, que es lo que corresponde.

La forma canónica que se firma es `JSON.stringify(cleanAssistantState(state))`. Funciona porque `cleanAssistantState` arma siempre las mismas claves en el mismo orden y es idempotente, así que el estado sobrevive el ida y vuelta por JSON. **Si se le agregan campos, hay que mantener esa propiedad.**

El secreto es `ADMIN_SECRET`. Si falta, se usa uno aleatorio por proceso: el chat funciona igual, pero las conversaciones en curso se reinician al reiniciar el servidor.

Lo que la firma **no** frena es el spam desde el flujo normal: alguien puede conversar de verdad y dejar datos falsos. Contra eso está el rate limit (40 turnos / 10 min por IP) y la deduplicación de 30 minutos.

---

## 13. Atrás

Cada mensaje de usuario (salvo reset/atrás) empuja un snapshot a `history` (máx. 20).  
Atrás deshabilitado si no hay history o si `leadSaved`.

---

## 14. Cómo tocar las reglas

1. Editar **solo** `lib/assistant-local.ts` (detectores, `stepsOf`, textos, cobertura).
2. Subir `CHAT_REVISION` y `STORAGE_KEY` en `site-assistant.tsx`.
3. Probar con chips **y** con frases libres (el prefill es donde más se rompe).
4. Correr `npm run test:chat` (`scripts/chat-100-users.ts`).
5. Casos mínimos a mano: pintura, plomería, instalación, locativa, remodelación, eléctrico con chispa, zona Kennedy, varios trabajos.
6. No introducir IA de pago (Groq u otra): el motor es de reglas a propósito.

Corregir reglas **después** de anotar errores reales, no a ojo.

---

## 15. Deuda y riesgos

- Rate limit en RAM: no sirve igual detrás de varios procesos.
- Detección por substring: “corto” dispara riesgo eléctrico; “norte” puede etiquetar zona genérica.
- Kind `fachadas` casi no se usa.
- El PNG del logo y el header no forman parte de este motor; ver [DOCUMENTACION-UI.md](./DOCUMENTACION-UI.md).

**Lo que está resuelto a propósito**
- Un solo flujo: clasificar → zona → confirmar → contacto → WhatsApp.
- Varios oficios en una solicitud.
- Seguridad eléctrica: no diagnostica chispa/humo.
- Humedad: no promete que pintar la quite.
- Sin precios en el chat.
- Atrás + Limpiar + persistencia de sesión.
- Duplicados de lead a 30 min.
- Textos de cobertura sin nombrar exclusiones en público.
