import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";

export type SiteServicio = {
  id: string;
  title: string;
  desc: string;
  bgImage: string;
};

export type SiteProyecto = {
  title: string;
  city: string;
  image: string;
  /** Foto del antes. Si falta, el proyecto se muestra con una sola imagen. */
  antes?: string;
  /** Qué se hizo, en una línea. Si falta, no se muestra. */
  resultado?: string;
};

export type SiteTestimonio = {
  name: string;
  barrio: string;
  proyecto: string;
  texto: string;
  rating: number;
  visible?: boolean;
};

export type SiteFaq = {
  q: string;
  a: string;
};

export type SiteZona = {
  nombre: string;
  detalle: string;
};

// Identidad legal para el pie. Cada campo se pinta solo si está lleno, así que
// se puede publicar el sitio con esto incompleto.
export type SiteEmpresa = {
  razonSocial?: string;
  nit?: string;
  desde?: string;
};

export type SiteServicioInicio = {
  id: string;
  title: string;
  desc: string;
};

export type SiteContent = {
  whatsappNumber: string;
  phoneDisplay: string;
  siteName: string;
  heroImage: string;
  nosotrosImage: string;
  nosotrosFondo: string;
  badges: string[];
  serviciosInicio: SiteServicioInicio[];
  servicios: SiteServicio[];
  proyectos: SiteProyecto[];
  testimonios: SiteTestimonio[];
  mostrarTestimonios: boolean;
  porqueNosotros: { t: string; d: string }[];
  faq: SiteFaq[];
  zonas: SiteZona[];
  empresa?: SiteEmpresa;
};

export type LeadSource = "chat" | "formulario";
export type LeadStatus = "new" | "contact" | "quoting" | "done";

export type SiteLead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  zona: string;
  servicio: string;
  services: string[];
  message: string;
  source: LeadSource;
  status: LeadStatus;
};

const DEFAULT_INICIO: SiteServicioInicio[] = [
  { id: "pintura", title: "Pintura", desc: "Una habitación o el apartamento entero." },
  { id: "locativa", title: "Reparaciones", desc: "Paredes, puertas, techos, humedad puntual." },
  { id: "plomeria", title: "Plomería", desc: "Gotea, no baja, hay que cambiar la grifería." },
  { id: "electricidad", title: "Electricidad", desc: "Lámpara, toma, interruptor, corto." },
  { id: "instalaciones", title: "Instalaciones", desc: "Cortinas, espejo, TV, repisa." },
  { id: "remodelaciones", title: "Remodelar", desc: "Baño, cocina, un cambio de mayor alcance." },
];

const DEFAULT_FAQ: SiteFaq[] = [
  {
    q: "¿Qué tipo de trabajos realizan?",
    a: "Reparaciones locativas, pintura, plomería, electricidad, instalaciones y remodelaciones. También fachadas, impermeabilización y trabajos exteriores.",
  },
  {
    q: "¿Pueden resolver varios trabajos en una misma visita?",
    a: "Sí. Cuéntanos todo lo pendiente; organizamos la solicitud y coordinamos lo que se pueda en una misma visita.",
  },
  {
    q: "¿Cómo solicito una cotización?",
    a: "Usa el asesor del hogar o WhatsApp. No hay precios automáticos en la web: el valor depende del alcance, la zona y el acceso.",
  },
  {
    q: "¿Cotizar tiene algún costo?",
    a: "Cotizar por WhatsApp no cuesta. Si el trabajo necesita revisión en sitio para medir el alcance, la visita técnica tiene costo y te confirmamos el valor antes de agendarla.",
  },
  {
    q: "¿El trabajo tiene garantía?",
    a: "Sí. El trabajo terminado tiene garantía de 6 meses. Si algo falla por la ejecución, lo corregimos.",
  },
  {
    q: "¿Atienden fuera de Bogotá?",
    a: "Atendemos Bogotá y la Sabana. Al escribirnos confirmamos el barrio o municipio.",
  },
  {
    q: "¿Tengo que saber qué profesional necesito?",
    a: "No. Cuéntanos qué problema tienes y el asesor te ayuda a identificar el tipo de servicio.",
  },
  {
    q: "¿Cómo se coordina el trabajo?",
    a: "Registramos la solicitud, te escribimos por WhatsApp, definimos el alcance y coordinamos la ejecución.",
  },
];

const DEFAULT_ZONAS: SiteZona[] = [
  { nombre: "Bogotá", detalle: "Confirmamos barrio al coordinar" },
  { nombre: "Sabana", detalle: "Confirmamos municipio al coordinar" },
];

const DATA_PATH = path.join(process.cwd(), "data", "site.json");
const LEADS_PATH = path.join(process.cwd(), "data", "leads.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "uploads");

export function getDataPath() {
  return DATA_PATH;
}

export function getUploadDir() {
  return UPLOAD_DIR;
}

function clampRating(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 5;
  return Math.min(5, Math.max(1, Math.round(n)));
}

function normalizeTestimonios(rows: unknown): SiteTestimonio[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((row) => row && typeof row === "object")
    .map((row) => {
      const item = row as Partial<SiteTestimonio>;
      return {
        name: String(item.name ?? "").slice(0, 80),
        barrio: String(item.barrio ?? "").slice(0, 80),
        proyecto: String(item.proyecto ?? "").slice(0, 80),
        texto: String(item.texto ?? "").slice(0, 400),
        rating: clampRating(item.rating),
        visible: item.visible !== false,
      };
    });
}

// `cache` de React junta las llamadas de una misma visita. El layout (datos de
// Google) y la página leen site.json una sola vez; la siguiente visita vuelve
// a leer el archivo, así que un cambio del panel se ve enseguida.
export const readSiteContent = cache(async function readSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw) as Partial<SiteContent>;
  return {
    ...parsed,
    serviciosInicio: parsed.serviciosInicio?.length ? parsed.serviciosInicio : DEFAULT_INICIO,
    faq: parsed.faq?.length ? parsed.faq : DEFAULT_FAQ,
    zonas: parsed.zonas?.length ? parsed.zonas : DEFAULT_ZONAS,
    testimonios: normalizeTestimonios(parsed.testimonios),
    mostrarTestimonios: parsed.mostrarTestimonios === true,
  } as SiteContent;
});

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function textList(rows: unknown, max: number, limit: number) {
  if (!Array.isArray(rows)) return [];
  return rows
    .slice(0, limit)
    .map((row) => text(row, max))
    .filter(Boolean);
}

function objectList<T>(
  rows: unknown,
  limit: number,
  map: (row: Record<string, unknown>) => T | null,
): T[] {
  if (!Array.isArray(rows)) return [];
  const out: T[] = [];
  for (const row of rows.slice(0, limit)) {
    if (!row || typeof row !== "object" || Array.isArray(row)) continue;
    const item = map(row as Record<string, unknown>);
    if (item) out.push(item);
  }
  return out;
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Convierte cualquier entrada en un SiteContent con la forma correcta. Lo que
 * llegue mal se descarta o se reemplaza, nunca se guarda tal cual: así el panel
 * no puede dejar la home en un estado que reviente al renderizar.
 *
 * `previous` es el contenido ya guardado. Los campos que rompen el render si
 * quedan vacíos (imágenes, WhatsApp, nombre) conservan su valor anterior en vez
 * de borrarse.
 */
export function sanitizeSiteContent(raw: unknown, previous?: SiteContent): SiteContent {
  const input = (raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}) as Record<
    string,
    unknown
  >;

  const required = (key: keyof SiteContent, max: number) =>
    text(input[key], max) || text(previous?.[key], max);

  const faq = objectList<SiteFaq>(input.faq, 40, (row) => {
    const q = text(row.q, 200);
    return q ? { q, a: text(row.a, 1500) } : null;
  });

  const zonas = objectList<SiteZona>(input.zonas, 40, (row) => {
    const nombre = text(row.nombre, 80);
    return nombre ? { nombre, detalle: text(row.detalle, 200) } : null;
  });

  const rawEmpresa = (
    input.empresa && typeof input.empresa === "object" ? input.empresa : {}
  ) as Record<string, unknown>;

  return {
    whatsappNumber: required("whatsappNumber", 20),
    phoneDisplay: required("phoneDisplay", 40),
    siteName: required("siteName", 60),
    heroImage: required("heroImage", 300),
    nosotrosImage: required("nosotrosImage", 300),
    nosotrosFondo: required("nosotrosFondo", 300),
    badges: textList(input.badges, 60, 8),
    serviciosInicio: (() => {
      const rows = objectList<SiteServicioInicio>(input.serviciosInicio, 8, (row) => {
        const title = text(row.title, 80);
        if (!title) return null;
        return {
          id: text(row.id, 40) || slug(title),
          title,
          desc: text(row.desc, 200),
        };
      });
      return rows.length ? rows : DEFAULT_INICIO;
    })(),
    servicios: objectList<SiteServicio>(input.servicios, 12, (row) => {
      const title = text(row.title, 80);
      if (!title) return null;
      return {
        id: text(row.id, 40) || slug(title),
        title,
        desc: text(row.desc, 400),
        bgImage: text(row.bgImage, 300),
      };
    }),
    proyectos: objectList<SiteProyecto>(input.proyectos, 12, (row) => {
      const title = text(row.title, 80);
      if (!title) return null;
      const antes = text(row.antes, 300);
      const resultado = text(row.resultado, 120);
      return {
        title,
        city: text(row.city, 60),
        image: text(row.image, 300),
        ...(antes ? { antes } : {}),
        ...(resultado ? { resultado } : {}),
      };
    }),
    testimonios: normalizeTestimonios(input.testimonios),
    mostrarTestimonios: input.mostrarTestimonios === true,
    porqueNosotros: objectList<{ t: string; d: string }>(input.porqueNosotros, 8, (row) => {
      const t = text(row.t, 80);
      return t ? { t, d: text(row.d, 400) } : null;
    }),
    faq: faq.length ? faq : DEFAULT_FAQ,
    zonas: zonas.length ? zonas : DEFAULT_ZONAS,
    empresa: {
      razonSocial: text(rawEmpresa.razonSocial, 120),
      nit: text(rawEmpresa.nit, 40),
      desde: text(rawEmpresa.desde, 20),
    },
  };
}

export async function writeSiteContent(content: unknown): Promise<SiteContent> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  const previous = await readSiteContent().catch(() => undefined);
  const normalized = sanitizeSiteContent(content, previous);

  // Se escribe en un archivo aparte y se renombra encima. El renombrado es
  // atómico, así que un corte a mitad deja el site.json anterior intacto en vez
  // de un archivo partido que tumbaría el sitio.
  const tmp = `${DATA_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(normalized, null, 2), "utf8");
  await fs.rename(tmp, DATA_PATH);

  return normalized;
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

function normalizeLead(raw: Partial<SiteLead> & { name: string; phone: string }): SiteLead {
  const services =
    Array.isArray(raw.services) && raw.services.length
      ? raw.services.map((s) => String(s).slice(0, 80)).filter(Boolean)
      : raw.servicio
        ? [String(raw.servicio).slice(0, 80)]
        : [];
  const source: LeadSource = raw.source === "chat" ? "chat" : "formulario";
  const status: LeadStatus =
    raw.status === "contact" || raw.status === "quoting" || raw.status === "done" ? raw.status : "new";

  return {
    id: raw.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: raw.createdAt || new Date().toISOString(),
    name: String(raw.name ?? "").slice(0, 80),
    phone: String(raw.phone ?? "").slice(0, 30),
    zona: String(raw.zona ?? "").slice(0, 60),
    servicio: String(raw.servicio || services.join(", ") || "Consulta").slice(0, 80),
    services,
    message: String(raw.message ?? "").slice(0, 500),
    source,
    status,
  };
}

export async function readLeads(): Promise<SiteLead[]> {
  try {
    const raw = await fs.readFile(LEADS_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteLead>[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object" && item.name && item.phone)
      .map((item) => normalizeLead(item as Partial<SiteLead> & { name: string; phone: string }));
  } catch {
    return [];
  }
}

export type AppendLeadInput = {
  name: string;
  phone: string;
  zona: string;
  servicio?: string;
  services?: string[];
  message: string;
  source: LeadSource;
  status?: LeadStatus;
};

/**
 * Las operaciones sobre leads se encadenan. Cada una lee, modifica y escribe,
 * así que dos solicitudes que lleguen a la vez se pisarían: la segunda leería
 * el archivo antes de que la primera lo guardara y borraría ese lead. La cola
 * las serializa dentro del proceso.
 */
let colaLeads: Promise<unknown> = Promise.resolve();

function enCola<T>(tarea: () => Promise<T>): Promise<T> {
  const resultado = colaLeads.then(tarea, tarea);
  colaLeads = resultado.catch(() => undefined);
  return resultado;
}

// Mismo criterio que site.json: temporal + rename. leads.json no está en git,
// así que un archivo partido aquí sería una pérdida irrecuperable.
async function writeLeads(leads: SiteLead[]) {
  await fs.mkdir(path.dirname(LEADS_PATH), { recursive: true });
  const tmp = `${LEADS_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(leads.slice(0, 200), null, 2), "utf8");
  await fs.rename(tmp, LEADS_PATH);
}

export async function appendLead(lead: AppendLeadInput): Promise<{ lead: SiteLead; created: boolean }> {
  return enCola(async () => {
    const leads = await readLeads();
    const phoneKey = normalizePhone(lead.phone);
    const services =
      lead.services?.length
        ? lead.services
        : lead.servicio
          ? [lead.servicio]
          : [];
    const servicio = (lead.servicio || services.join(", ") || "Consulta").slice(0, 80);

    const duplicate = leads.find((item) => {
      if (normalizePhone(item.phone) !== phoneKey) return false;
      if (item.source !== lead.source) return false;
      const age = Date.now() - new Date(item.createdAt).getTime();
      return age < 30 * 60 * 1000;
    });

    if (duplicate) {
      duplicate.name = lead.name.slice(0, 80);
      duplicate.zona = lead.zona.slice(0, 60);
      duplicate.servicio = servicio;
      duplicate.services = services.map((s) => s.slice(0, 80));
      duplicate.message = lead.message.slice(0, 500);
      if (!duplicate.status) duplicate.status = "new";
      await writeLeads(leads);
      return { lead: duplicate, created: false };
    }

    const entry = normalizeLead({
      name: lead.name,
      phone: lead.phone,
      zona: lead.zona,
      servicio,
      services,
      message: lead.message,
      source: lead.source,
      status: lead.status ?? "new",
    });
    leads.unshift(entry);
    await writeLeads(leads);
    return { lead: entry, created: true };
  });
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  return enCola(async () => {
    const leads = await readLeads();
    const lead = leads.find((item) => item.id === id);
    if (!lead) return null;
    lead.status = status;
    await writeLeads(leads);
    return lead;
  });
}

export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function listUploadedImages() {
  await ensureUploadDir();
  const imagesRoot = path.join(process.cwd(), "public", "images");
  const entries: { url: string; name: string; folder: string }[] = [];

  async function walk(dir: string, folderLabel: string) {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        await walk(full, item.name);
        continue;
      }
      if (!/\.(jpe?g|png|webp|gif|avif)$/i.test(item.name)) continue;
      const rel = path.relative(path.join(process.cwd(), "public"), full).replace(/\\/g, "/");
      entries.push({ url: `/${rel}`, name: item.name, folder: folderLabel });
    }
  }

  await walk(imagesRoot, "images");
  return entries.sort((a, b) => a.name.localeCompare(b.name));
}
