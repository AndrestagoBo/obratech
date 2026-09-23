import { whatsappCustomUrl, whatsappUrl } from "@/lib/content";
import type { SiteContent } from "@/lib/site-store";

export type AssistantKind =
  | "locativa"
  | "pintura"
  | "plomeria"
  | "electricidad"
  | "instalaciones"
  | "remodelaciones"
  | "fachadas"
  | "impermeabilizacion"
  | "otro";

export type JobItem = {
  kind: AssistantKind;
  trabajo: string;
  step: number;
  answers: string[];
  requiereVisita?: boolean;
  riesgo?: boolean;
  especial?: boolean;
  servicios?: string[];
};

export type AssistantState = {
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
  history?: AssistantState[];
};

export type AssistantCta = { label: string; href: string };
export type AssistantChip = { label: string; message: string };
export type AssistantReply = {
  text: string;
  ctas: AssistantCta[];
  state: AssistantState;
  chips: AssistantChip[];
};

const KINDS: AssistantKind[] = [
  "plomeria",
  "electricidad",
  "instalaciones",
  "pintura",
  "fachadas",
  "impermeabilizacion",
  "remodelaciones",
  "locativa",
  "otro",
];

const KIND_LABEL: Record<AssistantKind, string> = {
  locativa: "Reparaciones locativas",
  pintura: "Pintura",
  plomeria: "Plomería",
  electricidad: "Electricidad",
  instalaciones: "Instalaciones",
  remodelaciones: "Remodelación",
  fachadas: "Fachada / exterior",
  impermeabilizacion: "Impermeabilización",
  otro: "Diagnóstico / por clasificar",
};

export const START_CHIPS: AssistantChip[] = [
  { label: "Reparar algo", message: "Necesito reparar algo en la casa" },
  { label: "Pintar", message: "Quiero pintar" },
  { label: "Impermeabilizar", message: "Quiero impermeabilizar" },
  { label: "Plomería", message: "Tengo un problema de plomería" },
  { label: "Electricidad", message: "Tengo un problema eléctrico" },
  { label: "Instalar algo", message: "Quiero instalar algo" },
  { label: "Remodelar", message: "Quiero remodelar" },
  { label: "Tengo varias cosas pendientes", message: "Tengo varias cosas pendientes en el apartamento" },
  { label: "No sé qué necesito", message: "No sé qué necesito" },
];

export const WELCOME = "Hola. ¿Qué necesita tu hogar?";

const ZONA_CHIPS: AssistantChip[] = [
  { label: "Bogotá", message: "Estoy en Bogotá" },
  { label: "Sabana", message: "Estoy en la Sabana" },
  { label: "Otra zona", message: "Estoy en otra zona por confirmar" },
];

const ZONA_REVISION_MSG =
  "En esa zona revisamos primero si podemos atenderte. Podemos registrar la solicitud y confirmarlo al coordinar.";

const FUERA_COBERTURA: [string, string][] = [
  ["kennedy", "Kennedy"],
  ["bosa", "Bosa"],
  ["soacha", "Soacha"],
  ["ciudad bolivar", "Ciudad Bolívar"],
  ["usme", "Usme"],
  ["tunjuelito", "Tunjuelito"],
  ["rafael uribe", "Rafael Uribe Uribe"],
  ["san cristobal", "San Cristóbal"],
  ["patio bonito", "Patio Bonito"],
  ["ciudad kennedy", "Kennedy"],
];

const EXTRA_ZONAS: [string, string][] = [
  ["usaquen", "Usaquén"],
  ["cedritos", "Cedritos"],
  ["suba", "Suba"],
  ["country", "Country"],
  ["chico", "Chicó"],
  ["chapinero", "Chapinero"],
  ["teusaquillo", "Teusaquillo"],
  ["rosales", "Rosales"],
  ["chia", "Chía"],
  ["cajica", "Cajicá"],
  ["calera", "La Calera"],
  ["cota", "Cota"],
  ["sopo", "Sopó (por confirmar)"],
  ["zipaquira", "Zipaquirá (por confirmar)"],
  ["engativa", "Engativá (por confirmar)"],
  ["fontibon", "Fontibón (por confirmar)"],
  ["mosquera", "Mosquera (por confirmar)"],
  ["funza", "Funza (por confirmar)"],
  ["norte", "Bogotá"],
  ["centro", "Bogotá"],
  ["sabana", "Sabana"],
];

const DETECTORS: { kind: AssistantKind; words: string[] }[] = [
  {
    kind: "plomeria",
    words: [
      "fuga",
      "gotea",
      "plomer",
      "griferia",
      "sifon",
      "sanitario",
      "inodoro",
      "ducha",
      "lavamano",
      "lavaplato",
      "lavaplatos",
      "fregadero",
      "llave de agua",
      "tuberia",
      "goteo",
      "averia",
      "tapado",
      "obstruid",
    ],
  },
  {
    kind: "electricidad",
    words: [
      "lampara",
      "bombillo",
      "bombilla",
      "interruptor",
      "tomacorriente",
      "enchufe",
      "plafon",
      "ventilador",
      "luminaria",
      "electric",
      "cortocircuito",
      "corto circuito",
      "hay un corto",
      "un corto",
      "en corto",
      "corto electrico",
      "circuito",
      "breaker",
      "tapones",
      "chispa",
      "se va la luz",
      "se fue la luz",
      "no hay luz",
      "punto electrico",
      "punto nuevo",
      "cables pelados",
      "cable pelado",
      "cables descubiertos",
      "espejo con luz",
    ],
  },
  {
    kind: "instalaciones",
    words: ["cortina", "persiana", "espejo", "cuadro", "repisa", "soporte de tv", "televisor"],
  },
  {
    kind: "impermeabilizacion",
    words: ["impermeabil", "cubierta", "jardinera", "gotera", "se filtra"],
  },
  {
    kind: "fachadas",
    words: ["lavar fachada", "lavado de fachada", "mantenimiento de fachada"],
  },
  {
    kind: "pintura",
    words: ["pintar", "pintura"],
  },
  {
    kind: "remodelaciones",
    words: ["remodel", "reforma", "renovar"],
  },
  {
    kind: "locativa",
    words: [
      "reparar",
      "arreglar",
      "locativ",
      "pañete",
      "panete",
      "estuco",
      "resane",
      "puerta",
      "techo",
      "pared",
      "ajuste",
      "drywall",
      "bisagra",
      "ventana",
      "baldosa",
      "mueble",
      "gotera",
      "se filtra",
      "filtracion",
      "humedad",
      "piso",
      "cieloraso",
      "cielo raso",
    ],
  },
  {
    kind: "otro",
    words: ["mancha", "negra", "humedad", "moho", "no se que necesito"],
  },
];

type Step = { text: string; chips: AssistantChip[] };

const ELECTRIC_RISK_MSG =
  "Por seguridad, este tipo de situación requiere revisión prioritaria. No intentaremos diagnosticarla mediante el chat. Podemos registrar tu solicitud para que el equipo revise el caso.";
const ELECTRIC_PUNTO_MSG =
  "Este trabajo puede requerir una revisión del punto eléctrico antes de definir el servicio.";
const ELECTRIC_NUEVO_MSG =
  "Crear un punto nuevo puede implicar intervenir la instalación. Este trabajo puede requerir revisión antes de definir el servicio.";

type ElectricFamily = "iluminacion" | "puntos" | "ventilador" | "fallas" | "apagon" | "mixto" | "otro";

function hasExposedCables(text: string) {
  return (
    hasAny(text, ["cables pelados", "cable pelado", "cables descubiertos", "cable descubierto"]) ||
    (hasAny(text, ["cable", "cables"]) && hasAny(text, ["pelado", "pelados", "descubierto", "descubiertos"]))
  );
}

function isElectricRisk(text: string) {
  return (
    hasExposedCables(text) ||
    hasAny(text, [
      "chispa",
      "olor a quemado",
      "quemado",
      "se calienta",
      "calentamiento",
      "cortocircuito",
      "corto circuito",
      "hay un corto",
      "un corto",
      "en corto",
      "corto electrico",
      "se dispara",
      "descarga",
      "humo",
      "se van los tapones",
    ])
  );
}

function detectElectricPlace(text: string): string | undefined {
  const rows: [string[], string][] = [
    [["sala", "estar"], "Sala"],
    [["habitacion", "alcoba", "cuarto"], "Habitación"],
    [["cocina"], "Cocina"],
    [["bano"], "Baño"],
    [["exterior", "terraza", "patio", "jardin"], "Exterior"],
  ];
  for (const [words, label] of rows) {
    if (hasAny(text, words)) return label;
  }
  return undefined;
}

function detectElectricQty(text: string): number | undefined {
  if (hasAny(text, ["tres o mas", "3 o mas", "varias lamparas"])) return 3;
  if (hasAny(text, ["tres"]) || /\b3\b/.test(text)) return 3;
  if (hasAny(text, ["dos"]) || /\b2\b/.test(text)) return 2;
  if (hasAny(text, ["una lampara", "un lampara", "1 lampara", "una luminaria"])) return 1;
  return undefined;
}

function detectElectricItems(text: string): string[] {
  const items: string[] = [];
  const install = hasAny(text, ["instalar", "poner", "colocar"]);
  const change = hasAny(text, ["cambiar", "reemplazar"]);
  const qty = detectElectricQty(text);

  if (hasAny(text, ["lampara", "luminaria", "plafon", "bombillo", "bombilla"])) {
    if (change && !install) {
      items.push(qty && qty > 1 ? `Cambio de ${qty} luminarias` : "Cambio de luminaria");
    } else {
      items.push(qty && qty > 1 ? `Instalación de ${qty} lámparas` : "Instalación de lámparas");
    }
  }
  if (hasAny(text, ["espejo"])) items.push("Instalación de iluminación");
  if (hasAny(text, ["interruptor"])) {
    const n = hasAny(text, ["dos interruptor", "2 interruptor"]) ? 2 : hasAny(text, ["tres interruptor", "3 interruptor"]) ? 3 : undefined;
    items.push(n && n > 1 ? `Cambio de ${n} interruptores` : change || !install ? "Cambio de interruptores" : "Instalación de interruptores");
  }
  if (hasAny(text, ["tomacorriente", "enchufe"]) || hasAny(text, ["otro tomacorriente"])) {
    items.push(hasAny(text, ["nuevo", "otro tomacorriente", "poner"]) && !change ? "Instalación de tomacorriente" : "Cambio de tomacorriente");
  }
  if (hasAny(text, ["ventilador"])) items.push("Instalación de ventilador");
  return items;
}

function electricFamily(text: string): ElectricFamily | undefined {
  const items = detectElectricItems(text);
  if (items.length > 1) return "mixto";
  if (hasAny(text, ["se fue la luz", "se va la luz", "no hay luz", "toda la casa", "toda la vivienda", "apagon"])) {
    return "apagon";
  }
  if (hasAny(text, ["ventilador"])) return "ventilador";
  if (hasAny(text, ["reparar una falla", "falla electric", "no funciona", "dejo de", "no enciende", "no sirve"])) {
    return "fallas";
  }
  if (hasAny(text, ["interruptor", "tomacorriente", "enchufe", "punto nuevo"])) return "puntos";
  if (hasAny(text, ["lampara", "luminaria", "plafon", "bombillo", "bombilla", "iluminacion", "espejo con luz"])) {
    return "iluminacion";
  }
  if (hasAny(text, ["otro trabajo electric"])) return "otro";
  if (items.length === 1) {
    if (items[0].toLowerCase().includes("ventilador")) return "ventilador";
    if (items[0].toLowerCase().includes("interruptor") || items[0].toLowerCase().includes("tomacorriente")) return "puntos";
    return "iluminacion";
  }
  return undefined;
}

function electricTrabajo(family: ElectricFamily, text: string, items: string[]): string {
  if (items.length) return items.join(", ");
  if (family === "iluminacion") return hasAny(text, ["cambiar"]) ? "Cambio de luminaria" : "Instalación de lámpara";
  if (family === "puntos") return "Interruptor / tomacorriente";
  if (family === "ventilador") return "Instalación de ventilador";
  if (family === "fallas") return "Reparación eléctrica";
  if (family === "apagon") return "Falla de energía en la vivienda";
  if (family === "mixto") return "Varios trabajos eléctricos";
  return "Trabajo eléctrico";
}

function jobKnown(job?: JobItem) {
  return fold([job?.trabajo ?? "", ...(job?.answers ?? [])].join(" "));
}

function isPlomeriaFuga(text: string) {
  return hasAny(text, ["fuga", "gotea", "goteo", "chorrea", "se sale el agua"]);
}

function isPlomeriaInstalacion(text: string) {
  return hasAny(text, ["instalar", "instalacion", "cambiar grifer", "poner sanitario", "poner lavamanos"]);
}

function isPlomeriaDano(text: string) {
  return hasAny(text, ["dano", "averia", "roto", "rota", "tapado", "obstru", "no baja", "no cierra", "no sale agua"]);
}

function isPlomeriaBano(text: string) {
  return hasAny(text, ["bano", "sanitario", "inodoro", "ducha", "lavamano"]);
}

function isPlomeriaCocina(text: string) {
  return hasAny(text, ["cocina", "lavaplato", "lavaplatos", "fregadero"]);
}

function isRepairHumedad(text: string) {
  return hasAny(text, [
    "humedad",
    "agua",
    "mojado",
    "filtracion",
    "gotera",
    "mancha",
    "se filtra",
    "entro agua",
    "lluvia",
    "gotea",
  ]);
}

function repairElements(text: string): string[] {
  const found: string[] = [];
  if (hasAny(text, ["pared", "muro"])) found.push("pared");
  if (hasAny(text, ["techo", "cieloraso", "cielo raso"])) found.push("techo");
  if (
    hasAny(text, ["puerta", "bisagra", "chapa", "cerradura"]) &&
    !hasAny(text, ["del mueble", "reparar un mueble"])
  ) {
    found.push("puerta");
  }
  if (hasAny(text, ["ventana"])) found.push("ventana");
  if (hasAny(text, ["piso", "enchape", "baldosa", "ceramica", "porcelanato"])) found.push("piso");
  if (hasAny(text, ["mueble", "cajon", "closet", "gabinete"])) found.push("mueble");
  if (hasAny(text, ["drywall", "estuco", "panete", "pañete", "resane"])) {
    if (!found.includes("pared") && !found.includes("techo")) found.push("drywall");
  }
  return found;
}

function repairFamily(text: string): string | undefined {
  if (hasAny(text, ["son la pared y el techo"])) return "mixto";
  if (hasAny(text, ["es el techo"]) && !hasAny(text, ["es la pared"])) return "techo";
  if (hasAny(text, ["es la pared"]) && !hasAny(text, ["es el techo"])) return "pared";

  if (hasAny(text, ["son puerta y ventana"])) return "mixto";
  if (hasAny(text, ["es una ventana"]) && !hasAny(text, ["es una puerta"])) return "ventana";
  if (hasAny(text, ["es una puerta"]) && !hasAny(text, ["es una ventana"])) return "puerta";

  if (hasAny(text, ["pared o el techo", "pared o techo"])) return "pared_techo";
  if (hasAny(text, ["puerta o ventana"])) return "puerta_ventana";
  const els = repairElements(text);
  if (els.length > 1) return "mixto";
  if (els[0]) return els[0];
  if (hasAny(text, ["otra cosa que hay que reparar"])) return "otro";
  return undefined;
}

function repairServices(text: string): string[] {
  const out: string[] = [];
  const els = repairElements(text);
  const humedad = isRepairHumedad(text);
  const surface =
    els.includes("pared") ||
    els.includes("techo") ||
    els.includes("drywall") ||
    hasAny(text, ["estuco", "panete", "grieta", "hueco", "resane"]);

  if (humedad) out.push("Posible humedad");
  if (hasAny(text, ["se filtra", "gotera", "filtracion"])) out.push("Revisión de humedad");
  if (surface || els.includes("puerta") || els.includes("ventana") || els.includes("piso") || els.includes("mueble")) {
    out.push("Reparación locativa");
  }
  if (
    hasAny(text, ["pintura"]) ||
    ((els.includes("pared") || els.includes("techo") || els.includes("drywall")) &&
      hasAny(text, ["estuco", "panete", "humedad", "mancha", "desprend"]))
  ) {
    out.push("Pintura");
  }
  if (els.includes("piso") || hasAny(text, ["enchape", "baldosa"])) out.push("Enchapes");
  if (els.includes("drywall") || hasAny(text, ["drywall"])) out.push("Drywall");
  if (els.includes("puerta") || els.includes("mueble") || els.includes("ventana")) {
    out.push("Carpintería / ajustes");
  }
  if (hasAny(text, ["fuga", "tuberia", "grifer", "sanitario"]) && !els.includes("techo")) out.push("Plomería");
  if (hasAny(text, ["interruptor", "tomacorriente", "lampara", "bombillo"])) out.push("Electricidad");
  if (!out.length) out.push("Reparación locativa");
  return [...new Set(out)];
}

function repairTrabajo(family: string, text: string): string {
  const labels: Record<string, string> = {
    pared: "Pared",
    techo: "Techo",
    pared_techo: "Pared / techo",
    puerta: "Puerta",
    ventana: "Ventana",
    puerta_ventana: "Puerta / ventana",
    piso: "Piso / enchape",
    mueble: "Mueble",
    drywall: "Drywall / estuco / pañete",
    otro: "Reparación",
  };
  if (family === "mixto") {
    const els = repairElements(text);
    if (els.length) return els.map((el) => labels[el] ?? el).join(", ");
    return "Varias reparaciones";
  }
  return labels[family] ?? "Reparación";
}

function remodelSpaces(text: string): string[] {
  if (
    hasAny(text, [
      "apartamento completo",
      "apto completo",
      "todo el apartamento",
      "remodelar el apartamento",
      "remodelar apartamento",
      "remodelacion de apartamento",
      "renovar el apartamento",
      "casa completa",
      "toda la vivienda",
    ])
  ) {
    return ["apartamento"];
  }
  const found: string[] = [];
  if (hasAny(text, ["bano"])) found.push("baño");
  if (hasAny(text, ["cocina"])) found.push("cocina");
  if (hasAny(text, ["habitacion", "alcoba", "una habitacion"])) found.push("habitación");
  if (hasAny(text, ["sala", "comedor"])) found.push("sala");
  if (hasAny(text, ["otro espacio"])) found.push("otro");
  return found;
}

function remodelFamily(text: string): string | undefined {
  const spaces = remodelSpaces(text);
  if (spaces[0] === "apartamento") return "apartamento";
  if (spaces.length > 1) return "mixto";
  if (spaces[0]) return spaces[0];
  return undefined;
}

function remodelTrabajo(family: string, text: string): string {
  if (family === "mixto") {
    const spaces = remodelSpaces(text).filter((s) => s !== "apartamento");
    if (spaces.length) return `Remodelación de ${spaces.join(" y ")}`;
    return "Remodelación de varios espacios";
  }
  const labels: Record<string, string> = {
    baño: "Remodelación de baño",
    cocina: "Remodelación de cocina",
    habitación: "Remodelación de habitación",
    sala: "Remodelación de sala / comedor",
    apartamento: "Remodelación de apartamento",
    otro: "Remodelación",
  };
  return labels[family] ?? "Remodelación";
}

function remodelServices(text: string): string[] {
  const family = remodelFamily(text);
  if (family === "mixto") {
    return remodelSpaces(text).map((space) => remodelTrabajo(space, space));
  }
  return [remodelTrabajo(family || "otro", text)];
}

function remodelChangeItems(family: string, text: string): string[] {
  if (hasAny(text, ["todo el bano", "bano completo", "toda la cocina", "cocina completa", "todo el espacio", "todos los espacios", "renovar completamente"])) {
    return family === "baño" ? ["Todo el baño"] : family === "cocina" ? ["Toda la cocina"] : ["Todos los espacios"];
  }
  const catalog: Record<string, [string, string[]][]> = {
    baño: [
      ["Enchapes", ["enchape"]],
      ["Piso", ["piso"]],
      ["Sanitario", ["sanitario", "inodoro"]],
      ["Lavamanos", ["lavamano"]],
      ["Ducha", ["ducha"]],
      ["Grifería", ["grifer"]],
      ["Mueble", ["mueble"]],
      ["Iluminación", ["iluminacion"]],
      ["Distribución", ["distribucion"]],
    ],
    cocina: [
      ["Mesones", ["meson", "cubierta de cocina"]],
      ["Muebles", ["mueble"]],
      ["Enchapes", ["enchape"]],
      ["Piso", ["piso"]],
      ["Lavaplatos", ["lavaplato", "fregadero"]],
      ["Grifería", ["grifer"]],
      ["Iluminación", ["iluminacion"]],
      ["Distribución", ["distribucion"]],
    ],
    habitación: [
      ["Piso", ["piso"]],
      ["Pintura", ["pintura", "pintar"]],
      ["Iluminación", ["iluminacion"]],
      ["Muebles", ["mueble"]],
      ["Distribución", ["distribucion"]],
    ],
    sala: [
      ["Piso", ["piso"]],
      ["Pintura", ["pintura", "pintar"]],
      ["Iluminación", ["iluminacion"]],
      ["Muebles", ["mueble"]],
      ["Distribución", ["distribucion"]],
    ],
    apartamento: [
      ["Cocina", ["intervenir la cocina", "la cocina"]],
      ["Baño", ["intervenir el bano", "el bano"]],
      ["Sala", ["sala"]],
      ["Habitaciones", ["habitacion"]],
      ["Pisos", ["piso"]],
      ["Pintura", ["pintura", "pintar"]],
    ],
    mixto: [
      ["Enchapes", ["enchape"]],
      ["Piso", ["piso"]],
      ["Aparatos", ["sanitario", "lavamano", "ducha", "lavaplato", "aparato"]],
      ["Muebles / mesones", ["mueble", "meson"]],
      ["Iluminación", ["iluminacion"]],
      ["Distribución", ["distribucion"]],
    ],
    otro: [
      ["Acabados", ["acabado", "enchape", "piso", "pintura"]],
      ["Instalaciones", ["instalacion", "grifer", "iluminacion"]],
      ["Distribución", ["distribucion"]],
    ],
  };
  const rows = catalog[family] ?? catalog.otro;
  const found = rows.filter(([, words]) => hasAny(text, words)).map(([label]) => label);
  return [...new Set(found)];
}

function parseRemodelArea(text: string): string | undefined {
  const t = fold(text);
  const bySide = t.match(/(\d+(?:[.,]\d+)?)\s*(?:x|por)\s*(\d+(?:[.,]\d+)?)/);
  if (bySide) {
    const width = Number(bySide[1].replace(",", "."));
    const length = Number(bySide[2].replace(",", "."));
    if (width > 0 && length > 0 && width < 80 && length < 80) {
      const area = Math.round(width * length * 10) / 10;
      return `Tamaño: ${width} x ${length} m (${area} m²)`;
    }
  }
  const byArea = t.match(/(\d+(?:[.,]\d+)?)\s*(?:m2|metros cuadrados|mts2|mt2)/);
  if (byArea) {
    const area = Number(byArea[1].replace(",", "."));
    if (area > 0 && area < 2000) return `Tamaño: ${area} m²`;
  }
  if (hasAny(t, ["espacio pequeno", "es pequeno"])) return "Tamaño: espacio pequeño";
  if (hasAny(t, ["espacio mediano", "es mediano"])) return "Tamaño: espacio mediano";
  if (hasAny(t, ["espacio grande", "es grande"])) return "Tamaño: espacio grande";
  return undefined;
}

function remodelAlcance(text: string): string | undefined {
  if (
    hasAny(text, [
      "remodelacion completa",
      "una remodelacion completa",
      "renovar completamente",
      "renovacion general",
      "todo el bano",
      "toda la cocina",
      "todos los espacios",
    ])
  ) {
    return "Alcance: Remodelación completa";
  }
  if (hasAny(text, ["cambiar algunas", "parcial", "algunas cosas"])) return "Alcance: Remodelación parcial";
  if (hasAny(text, ["no estoy seguro del alcance"])) return "Alcance: por confirmar";
  return undefined;
}

function remodelObjetivo(text: string): string | undefined {
  if (hasAny(text, ["modernizar"])) return "Objetivo: modernizar";
  if (hasAny(text, ["mejorar acabados"])) return "Objetivo: mejorar acabados";
  if (hasAny(text, ["cambiar completamente el espacio"])) return "Objetivo: cambiar completamente el espacio";
  if (hasAny(text, ["solucionar problemas"])) return "Objetivo: solucionar problemas actuales";
  if (hasAny(text, ["aprovechar mejor"])) return "Objetivo: aprovechar mejor el espacio";
  return undefined;
}

function isRemodelStructural(text: string) {
  return hasAny(text, ["distribucion", "ampliar", "ampliacion", "estructural", "derribar", "tirar muro", "modificar la estructura"]);
}

function paintSpaces(text: string): string[] {
  if (
    hasAny(text, [
      "apartamento completo",
      "casa completa",
      "todo el apartamento",
      "toda la casa",
      "toda la vivienda",
      "pintar el apartamento",
      "pintura de apartamento",
      "espacio: apartamento",
    ])
  ) {
    return ["apartamento"];
  }
  const found: string[] = [];
  if (hasAny(text, ["habitacion", "alcoba", "una habitacion", "el cuarto", "un cuarto"])) found.push("habitación");
  if (hasAny(text, ["sala", "comedor"])) found.push("sala");
  if (hasAny(text, ["techo", "cieloraso", "cielo raso"])) found.push("techo");
  if (hasAny(text, ["puerta", "reja"])) found.push("puertas");
  if (hasAny(text, ["fachada"])) found.push("fachada");
  if (hasAny(text, ["culata"])) found.push("culata");
  if (hasAny(text, ["patio"])) found.push("patio");
  if (hasAny(text, ["terraza"])) found.push("terraza");
  if (hasAny(text, ["pintura exterior", "trabajo exterior"])) found.push("exterior");
  return found;
}

function paintFamily(text: string): string | undefined {
  if (hasAny(text, ["otra superficie para pintar", "pintar otro"])) return "otro";
  const spaces = paintSpaces(text);
  if (spaces[0] === "apartamento") return "apartamento";
  if (spaces.includes("fachada")) return "fachada";
  if (spaces.includes("culata") || spaces.includes("patio") || spaces.includes("terraza")) return "exterior";
  if (hasAny(text, ["exterior"]) && !spaces.includes("habitación") && !spaces.includes("sala")) return "exterior";
  if (spaces.length > 1) return "mixto";
  if (spaces[0]) return spaces[0];
  return undefined;
}

function paintPlace(text: string): "interior" | "exterior" | "ambos" | undefined {
  if (hasAny(text, ["interior y exterior", "ambos"])) return "ambos";
  if (hasAny(text, ["fachada", "culata", "exterior", "terraza", "patio", "reja"])) return "exterior";
  if (hasAny(text, ["interior", "habitacion", "sala", "apartamento", "alcoba", "el cuarto"])) return "interior";
  if (hasAny(text, ["techo"]) && !hasAny(text, ["exterior"])) return "interior";
  return undefined;
}

function paintTrabajo(family: string, text: string): string {
  if (family === "mixto") {
    const spaces = paintSpaces(text);
    if (spaces.length) return `Pintura de ${spaces.join(", ")}`;
    return "Pintura de varias superficies";
  }
  const labels: Record<string, string> = {
    habitación: "Pintura de habitación",
    sala: "Pintura de sala / comedor",
    apartamento: "Pintura de apartamento",
    techo: "Pintura de techo",
    puertas: "Pintura de puertas / rejas",
    fachada: "Pintura de fachada",
    culata: "Pintura de culata",
    patio: "Pintura de patio",
    terraza: "Pintura de terraza",
    exterior: "Pintura exterior",
    otro: "Pintura",
  };
  return labels[family] ?? "Pintura";
}

function paintServices(text: string): string[] {
  const out = ["Pintura"];
  if (hasAny(text, ["fachada"])) out[0] = "Pintura de fachada";
  if (hasAny(text, ["resane", "algunos resanes"])) out.push("Resanes");
  if (hasAny(text, ["deteriorada", "reparacion importante", "desprend"])) out.push("Reparación");
  if (hasAny(text, ["grieta", "fisura"])) out.push("Tratamiento de fisuras");
  if (hasAny(text, ["humedad", "mancha", "moho", "negra"])) out.push("Posible humedad");
  return [...new Set(out)];
}

function parsePaintArea(text: string): string | undefined {
  const t = fold(text);
  if (hasAny(t, ["altura", "menos de 3", "3 a 6", "6 a 10", "mas de 10"])) return undefined;
  const m2 = t.match(/(\d+(?:[.,]\d+)?)\s*(?:m2|metros cuadrados|mts2|mt2)/);
  if (m2) {
    const area = Number(m2[1].replace(",", "."));
    if (area > 0 && area < 5000) return `Área: ${area} m²`;
  }
  const meters = t.match(/(\d+(?:[.,]\d+)?)\s*metros(?!\s*de altura)/);
  if (meters && !hasAny(t, ["altura"])) {
    const area = Number(meters[1].replace(",", "."));
    if (area >= 8 && area < 5000) return `Área: ${area} m²`;
  }
  const bare = t.match(/\b(\d{2,4})\b/);
  if (bare && hasAny(t, ["m2", "metro", "area", "pintar"])) {
    const area = Number(bare[1]);
    if (area >= 8 && area < 5000) return `Área: ${area} m²`;
  }
  return undefined;
}

function paintEstado(text: string): string | undefined {
  if (hasAny(text, ["solo necesita pintura", "esta bien", "superficie normal"])) return "Estado: solo necesita pintura";
  if (hasAny(text, ["pintura deteriorada"])) return "Estado: pintura deteriorada";
  if (hasAny(text, ["bastante deteriorada", "reparacion importante"])) return "Estado: bastante deteriorada";
  if (hasAny(text, ["algunos resanes", "tiene resanes", "resane"])) return "Estado: algunos resanes";
  if (hasAny(text, ["fisura"])) return "Estado: tiene fisuras";
  if (hasAny(text, ["grieta"])) return "Estado: tiene grietas";
  if (hasAny(text, ["humedad", "mancha"])) return "Estado: humedad o manchas";
  if (hasAny(text, ["no estoy seguro como esta", "no estoy seguro del estado"])) return "Estado: por confirmar";
  return undefined;
}

function isPaintHumedad(text: string) {
  return hasAny(text, ["humedad", "mancha", "moho", "negra por humedad", "pared negra"]);
}

function isPaintGrietas(text: string) {
  return hasAny(text, ["grieta", "fisura", "desprend"]);
}

function isPaintExteriorFamily(family: string | undefined) {
  return family === "fachada" || family === "exterior" || family === "culata" || family === "patio" || family === "terraza";
}

function waterproofPlace(text: string): string | undefined {
  if (hasAny(text, ["cubierta", "techo", "cieloraso", "cielo raso"])) return "techo";
  if (hasAny(text, ["terraza"])) return "terraza";
  if (hasAny(text, ["fachada", "culata", "muro exterior"])) return "fachada";
  if (hasAny(text, ["patio", "jardinera", "zona exterior"])) return "patio";
  if (hasAny(text, ["otro lugar para impermeabil", "impermeabilizar otro"])) return "otro";
  return undefined;
}

function waterproofProblem(text: string): string | undefined {
  if (hasAny(text, ["prevenir", "prevencion", "antes de que"])) return "prevencion";
  if (hasAny(text, ["se filtra", "filtracion", "gotera"])) return "filtracion";
  if (hasAny(text, ["mancha"])) return "manchas";
  if (hasAny(text, ["desprend"])) return "desprendimiento";
  if (hasAny(text, ["humedad"])) return "humedad";
  return undefined;
}

function waterproofTrabajo(place: string): string {
  const labels: Record<string, string> = {
    techo: "Impermeabilización de techo / cubierta",
    terraza: "Impermeabilización de terraza",
    fachada: "Impermeabilización de fachada",
    patio: "Impermeabilización de patio / exterior",
    otro: "Impermeabilización",
  };
  return labels[place] ?? "Impermeabilización";
}

function waterproofServices(text: string): string[] {
  const out = ["Impermeabilización"];
  if (hasAny(text, ["grieta", "fisura", "resane", "desprend", "deterior"])) out.push("Resanes");
  if (hasAny(text, ["pintura deteriorada", "desprend", "luego pintar", "y pintar"])) out.push("Pintura");
  return [...new Set(out)];
}

function isWaterproofPreventive(text: string) {
  return waterproofProblem(text) === "prevencion";
}

function isWaterproofEasyAccess(text: string) {
  return hasAny(text, ["facil acceso", "acceso es sencillo", "altura: facil"]);
}

function waterproofEstado(text: string): string | undefined {
  if (hasAny(text, ["buen estado", "esta en buen estado"])) return "Estado: buen estado";
  if (hasAny(text, ["pintura deteriorada"])) return "Estado: pintura deteriorada";
  if (hasAny(text, ["grieta", "fisura"])) return "Estado: grietas o fisuras";
  if (hasAny(text, ["desprend"])) return "Estado: material desprendido";
  if (hasAny(text, ["muy deteriorada"])) return "Estado: muy deteriorada";
  if (hasAny(text, ["no estoy seguro como esta", "no estoy seguro del estado"])) return "Estado: por confirmar";
  return undefined;
}

function waterproofCuando(text: string): string | undefined {
  if (hasAny(text, ["despues de llover", "despues de la lluvia"])) return "Cuándo: después de llover";
  if (hasAny(text, ["cuando llueve"])) return "Cuándo: cuando llueve";
  if (hasAny(text, ["todo el tiempo", "siempre"])) return "Cuándo: todo el tiempo";
  if (hasAny(text, ["no presenta aun", "todavia no"])) return "Cuándo: no presenta aún";
  if (hasAny(text, ["no estoy seguro cuando"])) return "Cuándo: por confirmar";
  return undefined;
}

function inferWaterproofStep(step: Step, known: string): string | undefined {
  const t = fold(step.text);
  if (t.includes("quieres impermeabilizar") || t.includes("necesitas proteger")) {
    const place = waterproofPlace(known);
    return place ? `Zona: ${waterproofTrabajo(place).replace(/^impermeabilización de /i, "")}` : undefined;
  }
  if (t.includes("que esta ocurriendo") || t.includes("que problema")) {
    const problem = waterproofProblem(known);
    if (problem === "prevencion") return "Problema: prevención";
    if (problem === "filtracion") return "Problema: filtración";
    if (problem === "humedad") return "Problema: humedad";
    if (problem === "manchas") return "Problema: manchas";
    if (problem === "desprendimiento") return "Problema: se desprende el acabado";
    return undefined;
  }
  if (t.includes("cuando notas") || t.includes("cuando aparece")) {
    return waterproofCuando(known);
  }
  if (t.includes("como esta actualmente la superficie")) {
    return waterproofEstado(known);
  }
  if (t.includes("metros cuadrados")) {
    if (hasAny(known, ["no se la medida", "no se los metros"])) return "Área: se revisa al cotizar";
    if (hasAny(known, ["menos de 50"])) return "Área: menos de 50 m²";
    if (hasAny(known, ["50 y 150", "entre 50"])) return "Área: 50 a 150 m²";
    if (hasAny(known, ["mas de 150"])) return "Área: más de 150 m²";
    return parsePaintArea(known);
  }
  if (t.includes("altura considerable") || t.includes("facil acceso")) {
    if (hasAny(known, ["facil acceso"])) return "Altura: fácil acceso";
    if (hasAny(known, ["esta en altura", "en altura"])) return "Altura: está en altura";
    if (hasAny(known, ["no estoy seguro de la altura", "no estoy seguro si es de facil"])) return "Altura: por confirmar";
    return undefined;
  }
  if (t.includes("acceso al lugar")) {
    if (hasAny(known, ["requiere equipo"])) return "Acceso: requiere equipo";
    if (hasAny(known, ["acceso es sencillo", "si, el acceso"])) return "Acceso: sencillo";
    if (hasAny(known, ["no estoy seguro del acceso"])) return "Acceso: por confirmar";
    return undefined;
  }
  return undefined;
}

function prefillWaterproof(job: JobItem, text: string): JobItem {
  const known = fold([text, job.trabajo, ...job.answers].join(" "));
  const place = waterproofPlace(known);
  let trabajo = job.trabajo;
  let servicios = job.servicios;
  if (place) {
    trabajo = waterproofTrabajo(place);
    servicios = waterproofServices(known);
  }

  let answers = [...job.answers];
  let step = job.step;
  for (let i = 0; i < 12; i++) {
    const probe: JobItem = { ...job, trabajo, answers, step, servicios };
    const steps = stepsOf("impermeabilizacion", probe);
    if (step >= steps.length) break;
    const inferred = inferWaterproofStep(steps[step], known);
    if (!inferred) break;
    if (answers.some((a) => fold(a) === fold(inferred))) {
      step += 1;
      continue;
    }
    answers = [...answers, inferred];
    step += 1;
  }

  const visita = true;
  const especial =
    job.especial ||
    hasAny(known, ["esta en altura", "en altura", "requiere equipo", "trabajo en altura"]);
  return { ...job, trabajo, answers, step, servicios, requiereVisita: visita, especial };
}

function noticeAfterWaterproof(last: string) {
  const q = fold(last);
  if (hasAny(q, ["no se la medida", "no se los metros"])) {
    return "No hay problema. Podemos revisar las medidas antes de preparar la cotización.\n\n";
  }
  if (hasAny(q, ["esta en altura", "requiere equipo"])) {
    return "Como hay una condición de altura o acceso, el caso pasa a revisión antes de cotizar. No afirmamos la causa de la humedad.\n\n";
  }
  if (hasAny(q, ["se filtra", "gotera", "filtracion", "cuando llueve"])) {
    return "Queda registrado cuándo aparece el problema. No afirmamos de dónde viene la filtración; el equipo lo mira al cotizar.\n\n";
  }
  return "";
}

function stepsOf(kind: AssistantKind, job?: JobItem): Step[] {
  if (kind === "plomeria") {
    const known = jobKnown(job);
    const tipo: Step = {
      text: "¿Qué está ocurriendo?",
      chips: [
        { label: "Fuga", message: "Es una fuga" },
        { label: "Instalación", message: "Necesito una instalación de plomería" },
        { label: "Daño / avería", message: "Hay un daño o avería" },
      ],
    };
    const lugar: Step = {
      text: "¿Dónde ocurre?",
      chips: [
        { label: "Baño", message: "Ocurre en el baño" },
        { label: "Cocina", message: "Ocurre en la cocina" },
        { label: "Otro lugar", message: "Ocurre en otro lugar" },
      ],
    };
    const cuandoFuga: Step = {
      text: "¿La fuga aparece todo el tiempo o solo cuando usas el agua?",
      chips: [
        { label: "Todo el tiempo", message: "La fuga aparece todo el tiempo" },
        { label: "Solo al usar", message: "Solo cuando uso el agua" },
        { label: "No sé", message: "No sé cuándo aparece la fuga" },
      ],
    };
    const specifics: Step[] = [];
    if (isPlomeriaFuga(known)) {
      if (isPlomeriaCocina(known)) {
        specifics.push(
          {
            text: "¿La fuga aparece todo el tiempo o solamente cuando utilizas el lavaplatos / la llave?",
            chips: [
              { label: "Todo el tiempo", message: "La fuga aparece todo el tiempo" },
              { label: "Solo al usar", message: "Solo cuando utilizo el lavaplatos" },
              { label: "No sé", message: "No sé cuándo aparece la fuga" },
            ],
          },
          {
            text: "¿La fuga está debajo del mueble o cerca de la llave?",
            chips: [
              { label: "Debajo del mueble", message: "Está debajo del mueble" },
              { label: "Cerca de la llave", message: "Está cerca de la llave" },
              { label: "No sé", message: "No sé exactamente dónde está la fuga" },
            ],
          },
        );
      } else if (isPlomeriaBano(known)) {
        specifics.push(
          {
            text: "¿En qué punto del baño está la fuga?",
            chips: [
              { label: "Sanitario", message: "La fuga es en el sanitario" },
              { label: "Ducha", message: "La fuga es en la ducha" },
              { label: "Lavamanos", message: "La fuga es en el lavamanos" },
              { label: "Tubería", message: "La fuga es en la tubería" },
              { label: "No sé", message: "No sé en qué punto del baño está la fuga" },
            ],
          },
          cuandoFuga,
        );
      } else {
        specifics.push(
          {
            text: "¿En qué punto está la fuga?",
            chips: [
              { label: "Lavadero", message: "La fuga es en el lavadero" },
              { label: "Tubería", message: "La fuga es en la tubería" },
              { label: "Tanque", message: "La fuga es en el tanque" },
              { label: "No sé", message: "No sé en qué punto está la fuga" },
            ],
          },
          cuandoFuga,
        );
      }
    } else if (isPlomeriaInstalacion(known)) {
      const queInstalar: AssistantChip[] = isPlomeriaBano(known)
        ? [
            { label: "Grifería", message: "Hay que instalar o cambiar grifería" },
            { label: "Sanitario", message: "Hay que instalar o cambiar el sanitario" },
            { label: "Lavamanos", message: "Hay que instalar o cambiar el lavamanos" },
            { label: "Ducha", message: "Hay que instalar o cambiar la ducha" },
            { label: "Otro", message: "Hay que instalar otra pieza de plomería" },
          ]
        : isPlomeriaCocina(known)
          ? [
              { label: "Grifería", message: "Hay que instalar o cambiar grifería" },
              { label: "Lavaplatos", message: "Hay que instalar o cambiar el lavaplatos" },
              { label: "Sifón", message: "Hay que instalar o cambiar el sifón" },
              { label: "Otro", message: "Hay que instalar otra pieza de plomería" },
            ]
          : [
              { label: "Grifería", message: "Hay que instalar o cambiar grifería" },
              { label: "Sanitario", message: "Hay que instalar o cambiar el sanitario" },
              { label: "Lavaplatos", message: "Hay que instalar o cambiar el lavaplatos" },
              { label: "Tubería", message: "Hay que instalar o cambiar tubería" },
              { label: "Otro", message: "Hay que instalar otra pieza de plomería" },
            ];
      specifics.push(
        { text: "¿Qué hay que instalar o cambiar?", chips: queInstalar },
        {
          text: "¿Ya tienes el producto o también hay que conseguirlo?",
          chips: [
            { label: "Ya lo tengo", message: "Ya tengo el producto, solo instalación" },
            { label: "Hay que conseguirlo", message: "Necesito suministro e instalación" },
            { label: "No sé", message: "No sé si ya tengo el producto" },
          ],
        },
      );
    } else if (isPlomeriaDano(known) || (job?.answers?.length ?? 0) > 0) {
      specifics.push(
        {
          text: "¿Qué está fallando?",
          chips: [
            { label: "No sale agua", message: "No sale agua" },
            { label: "Tapado", message: "Está tapado" },
            { label: "Pieza rota", message: "Hay una pieza rota" },
            { label: "No cierra", message: "La llave no cierra bien" },
            { label: "Otro", message: "Es otro daño de plomería" },
          ],
        },
        {
          text: "¿Desde cuándo ocurre?",
          chips: [
            { label: "Hoy", message: "Empezó hoy" },
            { label: "Hace días", message: "Hace varios días" },
            { label: "Más de una semana", message: "Hace más de una semana" },
            { label: "No sé", message: "No sé desde cuándo" },
          ],
        },
      );
    }
    return [tipo, lugar, ...specifics];
  }
  if (kind === "pintura") {
    const known = jobKnown(job);
    const family = paintFamily(known);
    const place = paintPlace(known);
    const espacio: Step = {
      text: "¿Qué quieres pintar? Puedes elegir o escribirlo.",
      chips: [
        { label: "Una habitación", message: "Quiero pintar una habitación" },
        { label: "Sala / comedor", message: "Quiero pintar la sala y el comedor" },
        { label: "Apartamento / casa", message: "Quiero pintar todo el apartamento" },
        { label: "Techo", message: "Quiero pintar el techo" },
        { label: "Puertas / rejas", message: "Quiero pintar puertas o rejas" },
        { label: "Fachada", message: "Quiero pintar la fachada" },
        { label: "Otro", message: "Es otra superficie para pintar" },
      ],
    };
    if (!family) return [espacio];

    const extra: Step[] = [];
    const exteriorish = isPaintExteriorFamily(family) || place === "exterior" || place === "ambos";
    const interiorish = family === "habitación" || family === "sala" || family === "apartamento" || family === "techo";

    if (!place && family !== "fachada" && family !== "apartamento") {
      extra.push({
        text: "¿El trabajo es interior o exterior?",
        chips: [
          { label: "Interior", message: "Es un trabajo interior" },
          { label: "Exterior", message: "Es un trabajo exterior" },
          { label: "Ambos", message: "Es interior y exterior" },
        ],
      });
    }

    if ((family === "exterior" || place === "exterior") && family !== "fachada" && !hasAny(known, ["culata", "patio", "terraza", "reja"])) {
      extra.push({
        text: "¿Qué parte exterior quieres pintar?",
        chips: [
          { label: "Fachada", message: "Quiero pintar la fachada" },
          { label: "Culata", message: "Quiero pintar la culata" },
          { label: "Patio", message: "Quiero pintar el patio" },
          { label: "Terraza", message: "Quiero pintar la terraza" },
          { label: "Rejas", message: "Quiero pintar las rejas" },
          { label: "Otro", message: "Es otra parte exterior" },
        ],
      });
    }

    if (family === "apartamento") {
      extra.push({
        text: "¿Quieres pintar todas las paredes y techos o solo algunas áreas?",
        chips: [
          { label: "Todo", message: "Quiero pintar todo: paredes y techos" },
          { label: "Algunas habitaciones", message: "Solo algunas habitaciones" },
          { label: "Solo paredes", message: "Solo paredes" },
          { label: "Solo techos", message: "Solo techos" },
          { label: "No estoy seguro", message: "No estoy seguro qué áreas pintar" },
        ],
      });
      if (!hasAny(known, ["es 1 habitacion", "son 2 habitaciones", "son 3 habitaciones", "4 o mas habitaciones", "no se cuantas habitaciones"])) {
        extra.push({
          text: "¿Cuántas habitaciones aproximadamente?",
          chips: [
            { label: "1", message: "Es 1 habitación" },
            { label: "2", message: "Son 2 habitaciones" },
            { label: "3", message: "Son 3 habitaciones" },
            { label: "4 o más", message: "Son 4 o más habitaciones" },
            { label: "No sé", message: "No sé cuántas habitaciones" },
          ],
        });
      }
    }

    const facade = family === "fachada" || (exteriorish && family !== "puertas" && !interiorish);

    if (facade) {
      extra.push({
        text: "¿Aproximadamente cuántos metros cuadrados tiene? Si no lo sabes, no hay problema.",
        chips: [
          { label: "No sé", message: "No sé la medida del área" },
          { label: "Menos de 50 m²", message: "Tiene menos de 50 m²" },
          { label: "50 a 150 m²", message: "Tiene entre 50 y 150 m²" },
          { label: "Más de 150 m²", message: "Tiene más de 150 m²" },
        ],
      });
      extra.push({
        text: "¿A qué altura está la zona que se debe pintar?",
        chips: [
          { label: "Menos de 3 m", message: "Menos de 3 metros de altura" },
          { label: "3 a 6 m", message: "Entre 3 y 6 metros de altura" },
          { label: "6 a 10 m", message: "Entre 6 y 10 metros de altura" },
          { label: "Más de 10 m", message: "Más de 10 metros de altura" },
          { label: "No sé", message: "No sé la altura" },
        ],
      });
    }

    extra.push({
      text: "¿Cómo está actualmente la superficie?",
      chips: facade
        ? [
            { label: "Solo pintura", message: "Solo necesita pintura" },
            { label: "Pintura deteriorada", message: "La pintura está deteriorada" },
            { label: "Tiene resanes", message: "Tiene resanes" },
            { label: "Tiene fisuras", message: "Tiene fisuras" },
            { label: "Tiene humedad", message: "Tiene humedad" },
            { label: "No estoy seguro", message: "No estoy seguro del estado" },
          ]
        : [
            { label: "Está bien", message: "Está bien, solo necesita pintura" },
            { label: "Algunos resanes", message: "Tiene algunos resanes" },
            { label: "Deteriorada", message: "Está bastante deteriorada" },
            { label: "Humedad / manchas", message: "Tiene humedad o manchas" },
            { label: "No estoy seguro", message: "No estoy seguro de cómo está la superficie" },
          ],
    });

    if (isPaintGrietas(known) && !hasAny(known, ["grietas pequenas", "desprendimiento"])) {
      extra.push({
        text: "¿Las grietas son pequeñas o hay partes de la pared que se han desprendido?",
        chips: [
          { label: "Grietas pequeñas", message: "Son grietas pequeñas" },
          { label: "Hay desprendimiento", message: "Hay desprendimiento" },
          { label: "No estoy seguro", message: "No estoy seguro del estado de las grietas" },
        ],
      });
    }

    if (isPaintHumedad(known)) {
      extra.push({
        text: "¿La humedad todavía aparece o es una mancha antigua?",
        chips: [
          { label: "Sigue apareciendo", message: "La humedad sigue apareciendo" },
          { label: "Mancha antigua", message: "Es una mancha antigua" },
          { label: "No estoy seguro", message: "No estoy seguro si la humedad continúa" },
        ],
      });
    }

    if (!facade) {
      extra.push({
        text:
          family === "apartamento"
            ? "¿Sabes aproximadamente cuántos metros cuadrados tiene el apartamento? Si lo sabes, escríbelo."
            : "¿Sabes aproximadamente cuántos metros cuadrados se van a pintar? Si lo sabes, escríbelo (por ejemplo 50 m²).",
        chips: [
          { label: "No sé", message: "No sé la medida del área" },
          { label: "Menos de 30 m²", message: "Son menos de 30 m²" },
          { label: "30 a 80 m²", message: "Son entre 30 y 80 m²" },
          { label: "Más de 80 m²", message: "Son más de 80 m²" },
        ],
      });
    }

    if (facade || place === "exterior" || place === "ambos") {
      extra.push({
        text: "¿El acceso a la zona es sencillo?",
        chips: [
          { label: "Sí", message: "El acceso es sencillo" },
          { label: "Requiere equipo", message: "El acceso requiere equipo" },
          { label: "No estoy seguro", message: "No estoy seguro del acceso" },
        ],
      });
    }

    return [espacio, ...extra];
  }
  if (kind === "impermeabilizacion") {
    const known = jobKnown(job);
    const lugar: Step = {
      text: "¿Qué quieres impermeabilizar?",
      chips: [
        { label: "Techo / cubierta", message: "Quiero impermeabilizar el techo o la cubierta" },
        { label: "Terraza", message: "Quiero impermeabilizar la terraza" },
        { label: "Fachada / muro", message: "Quiero impermeabilizar la fachada o un muro exterior" },
        { label: "Patio / exterior", message: "Quiero impermeabilizar el patio o una zona exterior" },
        { label: "Otro", message: "Quiero impermeabilizar otro lugar" },
      ],
    };
    const problema: Step = {
      text: "¿Qué está ocurriendo?",
      chips: [
        { label: "Se filtra agua", message: "Se filtra agua" },
        { label: "Hay humedad", message: "Hay humedad" },
        { label: "Aparecen manchas", message: "Aparecen manchas" },
        { label: "Se desprende el acabado", message: "Se desprende la pintura o el acabado" },
        { label: "Quiero prevenir", message: "Quiero prevenir filtraciones" },
        { label: "Otro", message: "Es otro problema de impermeabilización" },
      ],
    };
    const cuando: Step = {
      text: "¿Cuándo notas el problema?",
      chips: [
        { label: "Cuando llueve", message: "Cuando llueve" },
        { label: "Después de llover", message: "Después de llover" },
        { label: "Todo el tiempo", message: "Todo el tiempo" },
        { label: "No presenta aún", message: "No presenta aún" },
        { label: "No estoy seguro", message: "No estoy seguro cuándo aparece" },
      ],
    };
    const estado: Step = {
      text: "¿Cómo está actualmente la superficie?",
      chips: [
        { label: "Buen estado", message: "Está en buen estado" },
        { label: "Pintura deteriorada", message: "Tiene pintura deteriorada" },
        { label: "Grietas o fisuras", message: "Tiene grietas o fisuras" },
        { label: "Material desprendido", message: "Hay material desprendido" },
        { label: "Muy deteriorada", message: "Está muy deteriorada" },
        { label: "No estoy seguro", message: "No estoy seguro del estado" },
      ],
    };
    const area: Step = {
      text: "¿Sabes aproximadamente cuántos metros cuadrados se deben impermeabilizar?",
      chips: [
        { label: "Menos de 50 m²", message: "Tiene menos de 50 metros cuadrados" },
        { label: "50 a 150 m²", message: "Tiene entre 50 y 150 metros cuadrados" },
        { label: "Más de 150 m²", message: "Tiene más de 150 metros cuadrados" },
        { label: "No sé", message: "No sé los metros cuadrados" },
      ],
    };
    const altura: Step = {
      text: "¿La zona está a una altura considerable o es de fácil acceso?",
      chips: [
        { label: "Fácil acceso", message: "Es de fácil acceso" },
        { label: "Está en altura", message: "Está en altura" },
        { label: "No estoy seguro", message: "No estoy seguro de la altura" },
      ],
    };
    const acceso: Step = {
      text: "¿El acceso al lugar es sencillo?",
      chips: [
        { label: "Sí", message: "Sí, el acceso es sencillo" },
        { label: "Requiere equipo", message: "Requiere equipo" },
        { label: "No estoy seguro", message: "No estoy seguro del acceso" },
      ],
    };
    const steps: Step[] = [lugar, problema];
    if (!isWaterproofPreventive(known)) steps.push(cuando);
    steps.push(estado, area, altura);
    if (!isWaterproofEasyAccess(known)) steps.push(acceso);
    return steps;
  }
  if (kind === "fachadas") {
    return [
      {
        text: "¿Sabes aproximadamente cuántos metros cuadrados tiene?",
        chips: [
          { label: "Menos de 50 m²", message: "Tiene menos de 50 metros cuadrados" },
          { label: "50 a 150 m²", message: "Tiene entre 50 y 150 metros cuadrados" },
          { label: "Más de 150 m²", message: "Tiene más de 150 metros cuadrados" },
          { label: "No sé", message: "No sé los metros cuadrados" },
        ],
      },
      {
        text: "¿A qué altura aproximadamente se encuentra la zona que hay que pintar o intervenir?",
        chips: [
          { label: "Planta baja", message: "Es planta baja, sin altura" },
          { label: "Hasta 5 m", message: "Hasta 5 metros de altura" },
          { label: "Más de 5 m", message: "Más de 5 metros de altura" },
          { label: "No sé", message: "No sé la altura" },
        ],
      },
    ];
  }
  if (kind === "electricidad") {
    const known = jobKnown(job);
    const family = electricFamily(known);
    const tipo: Step = {
      text: "¿Qué necesitas hacer?",
      chips: [
        { label: "Instalar una lámpara", message: "Necesito instalar una lámpara" },
        { label: "Instalar interruptor/toma", message: "Necesito instalar un interruptor o tomacorriente" },
        { label: "Instalar ventilador", message: "Necesito instalar un ventilador" },
        { label: "Reparar una falla", message: "Necesito reparar una falla eléctrica" },
        { label: "Cambiar una luminaria", message: "Necesito cambiar una luminaria" },
        { label: "Otro", message: "Es otro trabajo eléctrico" },
      ],
    };
    const lugar: Step = {
      text: "¿Dónde se encuentra el elemento?",
      chips: [
        { label: "Sala", message: "Está en la sala" },
        { label: "Habitación", message: "Está en la habitación" },
        { label: "Cocina", message: "Está en la cocina" },
        { label: "Baño", message: "Está en el baño" },
        { label: "Exterior", message: "Está en el exterior" },
        { label: "Otro", message: "Está en otro espacio" },
      ],
    };
    const conexion: Step = {
      text: "¿En el punto donde irá el trabajo ya existe una conexión eléctrica?",
      chips: [
        { label: "Sí", message: "Sí, el punto eléctrico ya está disponible" },
        { label: "No", message: "No, no hay punto eléctrico" },
        { label: "No estoy seguro", message: "No estoy seguro si hay punto eléctrico" },
      ],
    };
    if (job?.riesgo || isElectricRisk(known)) {
      return [];
    }
    if (family === "iluminacion") {
      const cambiar = hasAny(known, ["cambiar una luminaria", "cambiar luminaria"]);
      return [
        tipo,
        {
          text: cambiar ? "¿Cuántas luminarias necesitas cambiar?" : "¿Cuántas lámparas necesitas instalar?",
          chips: [
            { label: "1", message: cambiar ? "Necesito 1 luminaria" : "Necesito 1 lámpara" },
            { label: "2", message: cambiar ? "Necesito 2 luminarias" : "Necesito 2 lámparas" },
            { label: "3 o más", message: cambiar ? "Necesito 3 o más luminarias" : "Necesito 3 o más lámparas" },
          ],
        },
        lugar,
        conexion,
      ];
    }
    if (family === "puntos") {
      return [
        tipo,
        {
          text: "¿Es un punto nuevo o vas a reemplazar uno existente?",
          chips: [
            { label: "Reemplazar", message: "Voy a reemplazar uno existente" },
            { label: "Punto nuevo", message: "Quiero instalar un punto nuevo" },
            { label: "No estoy seguro", message: "No estoy seguro si es nuevo o reemplazo" },
          ],
        },
        lugar,
      ];
    }
    if (family === "ventilador") {
      return [
        tipo,
        conexion,
        {
          text: "¿El ventilador ya lo tienes o necesitas suministro e instalación?",
          chips: [
            { label: "Ya lo tengo", message: "Ya tengo el producto, solo instalación" },
            { label: "Hay que conseguirlo", message: "Necesito suministro e instalación" },
          ],
        },
        lugar,
      ];
    }
    if (family === "fallas") {
      return [
        tipo,
        {
          text: "¿El problema ocurre solamente en ese punto o también en otros?",
          chips: [
            { label: "Solo en ese", message: "El problema es solo en ese punto" },
            { label: "En varios", message: "El problema está en varios puntos" },
            { label: "No estoy seguro", message: "No estoy seguro si es solo ese punto" },
          ],
        },
        {
          text: "¿El interruptor o tablero eléctrico presenta alguna señal de alarma, ruido, olor a quemado o calentamiento?",
          chips: [
            { label: "Sí", message: "Sí, hay ruido, olor a quemado o calentamiento" },
            { label: "No", message: "No hay señales de alarma" },
            { label: "No estoy seguro", message: "No estoy seguro si hay señales de alarma" },
          ],
        },
        lugar,
      ];
    }
    if (family === "apagon") {
      return [
        tipo,
        {
          text: "¿La falla afecta toda la vivienda o solamente una zona?",
          chips: [
            { label: "Toda la vivienda", message: "Afecta toda la vivienda" },
            { label: "Una zona", message: "Afecta solamente una zona" },
            { label: "No sé", message: "No sé si afecta toda la vivienda" },
          ],
        },
        {
          text: "¿El tablero eléctrico muestra algún interruptor apagado?",
          chips: [
            { label: "Sí", message: "Sí, hay un interruptor apagado en el tablero" },
            { label: "No", message: "No hay interruptores apagados" },
            { label: "No sé", message: "No sé cómo está el tablero" },
          ],
        },
      ];
    }
    if (family === "mixto") {
      return [tipo, conexion, lugar];
    }
    if (family === "otro") {
      return [tipo, lugar];
    }
    return [tipo];
  }
  if (kind === "instalaciones") {
    return [
      {
        text: "¿Qué necesitas instalar?",
        chips: [
          { label: "Cortinas", message: "Quiero instalar cortinas" },
          { label: "Persianas", message: "Quiero instalar persianas" },
          { label: "Repisas", message: "Quiero instalar repisas" },
          { label: "Espejos", message: "Quiero instalar espejos" },
          { label: "Cuadros", message: "Quiero instalar cuadros" },
          { label: "Soporte de TV", message: "Quiero instalar un soporte de TV" },
          { label: "Otro", message: "Quiero instalar otra cosa" },
        ],
      },
      {
        text: "¿Ya tienes el producto o también hay que conseguirlo?",
        chips: [
          { label: "Ya lo tengo", message: "Ya tengo el producto, solo instalación" },
          { label: "Hay que conseguirlo", message: "Necesito suministro e instalación" },
          { label: "No sé", message: "No sé si ya tengo el producto" },
        ],
      },
    ];
  }
  if (kind === "locativa") {
    const known = jobKnown(job);
    const family = repairFamily(known);
    const elemento: Step = {
      text: "¿Qué necesitas reparar? Puedes elegir una opción o escribir tu problema.",
      chips: [
        { label: "Pared / techo", message: "Necesito reparar una pared o el techo" },
        { label: "Puerta / ventana", message: "Necesito reparar una puerta o ventana" },
        { label: "Piso / enchape", message: "Necesito reparar piso o enchape" },
        { label: "Mueble", message: "Necesito reparar un mueble" },
        { label: "Drywall / estuco / pañete", message: "Necesito reparar drywall, estuco o pañete" },
        { label: "Otro", message: "Es otra cosa que hay que reparar" },
      ],
    };
    const ocurrido: Step = {
      text: "Cuéntanos brevemente qué ocurrió. Puedes escribirlo con tus palabras.",
      chips: [
        { label: "Ya lo expliqué", message: "Ya expliqué lo que ocurrió" },
        { label: "Hubo un golpe", message: "Hubo un golpe" },
        { label: "Se desprendió", message: "Se desprendió material" },
        { label: "Entró agua", message: "Entró agua" },
      ],
    };
    const tamano: Step = {
      text: "¿Qué tan grande es el daño?",
      chips: [
        { label: "Pequeño / puntual", message: "El daño es pequeño o puntual" },
        { label: "Una parte", message: "Afecta una parte de la superficie" },
        { label: "Gran parte", message: "Afecta gran parte" },
        { label: "No estoy seguro", message: "No estoy seguro del tamaño del daño" },
      ],
    };
    const humedadQ: Step = {
      text: "¿El problema de humedad sigue apareciendo actualmente?",
      chips: [
        { label: "Sí", message: "Sí, la humedad sigue apareciendo" },
        { label: "No", message: "No, la humedad ya no aparece" },
        { label: "No estoy seguro", message: "No estoy seguro si la humedad continúa" },
      ],
    };
    const lluviaQ: Step = {
      text: "¿La mancha aparece después de la lluvia o permanece todo el tiempo?",
      chips: [
        { label: "Después de la lluvia", message: "Aparece después de la lluvia" },
        { label: "Permanente", message: "Está presente de forma permanente" },
        { label: "No sé", message: "No sé cuándo aparece la mancha" },
      ],
    };
    const riesgoQ: Step = {
      text: "¿El daño presenta alguna condición especial?",
      chips: [
        { label: "No", message: "No hay una condición especial" },
        { label: "Está en altura", message: "El daño está en altura" },
        { label: "Puede ser peligroso", message: "Puede ser peligroso" },
        { label: "No estoy seguro", message: "No estoy seguro si hay una condición especial" },
      ],
    };
    const extra: Step[] = [];
    const needsWallRoof = family === "pared_techo" || hasAny(known, ["pared o el techo", "pared o techo"]);
    const needsDoorWin = family === "puerta_ventana" || hasAny(known, ["puerta o ventana"]);
    if (needsWallRoof) {
      extra.push({
        text: "¿Es la pared o el techo?",
        chips: [
          { label: "Pared", message: "Es la pared" },
          { label: "Techo", message: "Es el techo" },
          { label: "Ambos", message: "Son la pared y el techo" },
        ],
      });
    }
    if (needsDoorWin) {
      extra.push({
        text: "¿Es una puerta o una ventana?",
        chips: [
          { label: "Puerta", message: "Es una puerta" },
          { label: "Ventana", message: "Es una ventana" },
          { label: "Ambas", message: "Son puerta y ventana" },
        ],
      });
    }
    if (family === "pared" || family === "drywall") {
      extra.push({
        text: "¿Qué problema tiene la pared o la superficie?",
        chips: [
          { label: "Grietas / fisuras", message: "Hay grietas o fisuras" },
          { label: "Estuco desprendido", message: "El estuco está desprendido" },
          { label: "Pañete dañado", message: "El pañete está dañado" },
          { label: "Huecos / golpes", message: "Hay huecos o golpes" },
          { label: "Humedad / manchas", message: "Hay humedad o manchas" },
          { label: "Pintura deteriorada", message: "La pintura está deteriorada" },
          { label: "Otro", message: "Es otro problema en la pared" },
        ],
      });
    }
    if (family === "techo") {
      extra.push({
        text: "¿Qué está ocurriendo en el techo?",
        chips: [
          { label: "Se cayó material", message: "Se cayó material del techo" },
          { label: "Está agrietado", message: "El techo está agrietado" },
          { label: "Hay una mancha", message: "Hay una mancha en el techo" },
          { label: "Hay humedad", message: "Hay humedad en el techo" },
          { label: "Se filtra agua", message: "Se filtra agua cuando llueve" },
          { label: "Otro", message: "Es otro problema en el techo" },
        ],
      });
    }
    if (family === "puerta" || family === "ventana") {
      extra.push({
        text: "¿Qué problema presenta?",
        chips: [
          { label: "No cierra bien", message: "No cierra bien" },
          { label: "Está caída", message: "Está caída" },
          { label: "Bisagra dañada", message: "La bisagra está dañada" },
          { label: "Chapa / cerradura", message: "Hay un problema de chapa o cerradura" },
          { label: "Está rota", message: "Está rota" },
          { label: "Otro", message: "Es otro problema" },
        ],
      });
    }
    if (family === "piso") {
      extra.push({
        text: "¿Qué problema tiene el piso o el enchape?",
        chips: [
          { label: "Está quebrado", message: "Está quebrado" },
          { label: "Se despegó", message: "Se despegó" },
          { label: "Está levantado", message: "Está levantado" },
          { label: "Tiene humedad", message: "Tiene humedad" },
          { label: "Pieza dañada", message: "Hay una pieza dañada" },
          { label: "Otro", message: "Es otro problema en el piso" },
        ],
      });
    }
    if (family === "mueble") {
      extra.push({
        text: "¿Qué parte necesita reparación?",
        chips: [
          { label: "Puerta", message: "La puerta del mueble" },
          { label: "Bisagra", message: "La bisagra del mueble" },
          { label: "Cajón", message: "El cajón" },
          { label: "Estructura", message: "La estructura del mueble" },
          { label: "Otro", message: "Es otra parte del mueble" },
        ],
      });
    }
    if (family) extra.push(ocurrido);
    if (family && (isRepairHumedad(known) || hasAny(known, ["mancha"]))) {
      if (hasAny(known, ["mancha"])) extra.push(lluviaQ);
      extra.push(humedadQ);
    }
    if (family === "puerta" || family === "ventana") {
      extra.push({
        text: "¿Es de madera, metálica o de otro material?",
        chips: [
          { label: "Madera", message: "Es de madera" },
          { label: "Metal", message: "Es metálica" },
          { label: "Vidrio", message: "Es de vidrio" },
          { label: "Otro", message: "Es de otro material" },
          { label: "No sé", message: "No sé el material" },
        ],
      });
    }
    if (family === "piso") {
      extra.push({
        text: "¿Es una zona pequeña o hay varias piezas afectadas?",
        chips: [
          { label: "Zona pequeña", message: "Es una zona pequeña" },
          { label: "Varias piezas", message: "Hay varias piezas afectadas" },
          { label: "No sé", message: "No sé cuántas piezas están afectadas" },
        ],
      });
    }
    if (family === "mueble") {
      extra.push({
        text: "¿El mueble está empotrado o es independiente?",
        chips: [
          { label: "Empotrado", message: "Está empotrado" },
          { label: "Independiente", message: "Es independiente" },
          { label: "No sé", message: "No sé si está empotrado" },
        ],
      });
    }
    const surface =
      family === "pared" ||
      family === "techo" ||
      family === "drywall" ||
      family === "piso" ||
      family === "mixto" ||
      family === "otro";
    if (surface) extra.push(tamano);
    if (family) extra.push(riesgoQ);
    return [elemento, ...extra];
  }
  if (kind === "remodelaciones") {
    const known = jobKnown(job);
    const family = remodelFamily(known);
    const espacio: Step = {
      text: "¿Dónde quieres remodelar? Puedes elegir o nombrar más de un espacio.",
      chips: [
        { label: "Baño", message: "Quiero remodelar el baño" },
        { label: "Cocina", message: "Quiero remodelar la cocina" },
        { label: "Habitación", message: "Quiero remodelar una habitación" },
        { label: "Sala / comedor", message: "Quiero remodelar la sala o el comedor" },
        { label: "Apartamento completo", message: "Quiero remodelar el apartamento completo" },
        { label: "Otro", message: "Quiero remodelar otro espacio" },
      ],
    };
    if (!family) return [espacio];

    const cambioChips =
      family === "baño"
        ? [
            { label: "Enchapes", message: "Quiero cambiar enchapes" },
            { label: "Piso", message: "Quiero cambiar el piso" },
            { label: "Sanitario", message: "Quiero cambiar el sanitario" },
            { label: "Lavamanos", message: "Quiero cambiar el lavamanos" },
            { label: "Ducha", message: "Quiero cambiar la ducha" },
            { label: "Grifería", message: "Quiero cambiar la grifería" },
            { label: "Mueble", message: "Quiero cambiar el mueble" },
            { label: "Iluminación", message: "Quiero cambiar la iluminación" },
            { label: "Distribución", message: "Quiero cambiar la distribución" },
            { label: "Todo el baño", message: "Quiero cambiar todo el baño" },
          ]
        : family === "cocina"
          ? [
              { label: "Mesones", message: "Quiero cambiar los mesones" },
              { label: "Muebles", message: "Quiero cambiar los muebles" },
              { label: "Enchapes", message: "Quiero cambiar enchapes" },
              { label: "Piso", message: "Quiero cambiar el piso" },
              { label: "Lavaplatos", message: "Quiero cambiar el lavaplatos" },
              { label: "Grifería", message: "Quiero cambiar la grifería" },
              { label: "Iluminación", message: "Quiero cambiar la iluminación" },
              { label: "Distribución", message: "Quiero cambiar la distribución" },
              { label: "Todo", message: "Quiero cambiar toda la cocina" },
            ]
          : family === "apartamento"
            ? [
                { label: "Cocina", message: "Quiero intervenir la cocina" },
                { label: "Baño", message: "Quiero intervenir el baño" },
                { label: "Sala", message: "Quiero intervenir la sala" },
                { label: "Habitaciones", message: "Quiero intervenir las habitaciones" },
                { label: "Pisos", message: "Quiero cambiar los pisos" },
                { label: "Pintura", message: "Quiero incluir pintura" },
                { label: "Todos", message: "Quiero intervenir todos los espacios" },
              ]
            : family === "mixto"
              ? [
                  { label: "Acabados", message: "Quiero cambiar acabados (enchapes, piso, pintura)" },
                  { label: "Aparatos", message: "Quiero cambiar aparatos (sanitario, lavamanos, ducha, lavaplatos)" },
                  { label: "Muebles / mesones", message: "Quiero cambiar muebles o mesones" },
                  { label: "Distribución", message: "Quiero cambiar la distribución" },
                  { label: "Todo", message: "Quiero renovar completamente los espacios" },
                ]
              : [
                  { label: "Piso", message: "Quiero cambiar el piso" },
                  { label: "Pintura", message: "Quiero incluir pintura" },
                  { label: "Iluminación", message: "Quiero cambiar la iluminación" },
                  { label: "Muebles", message: "Quiero cambiar muebles" },
                  { label: "Distribución", message: "Quiero cambiar la distribución" },
                  { label: "Todo", message: "Quiero renovar completamente el espacio" },
                ];

    const cambioText =
      family === "baño"
        ? "¿Qué quieres cambiar en el baño? Puedes elegir o nombrar varios."
        : family === "cocina"
          ? "¿Qué quieres cambiar en la cocina? Puedes elegir o nombrar varios."
          : family === "apartamento"
            ? "¿Qué espacios quieres intervenir?"
            : family === "mixto"
              ? "¿Qué quieres cambiar en esos espacios? Puedes nombrar varios."
              : "¿Qué quieres cambiar? Puedes elegir o escribirlo.";

    const extra: Step[] = [
      { text: cambioText, chips: cambioChips },
      {
        text:
          family === "apartamento"
            ? "¿Buscas una remodelación parcial o una renovación general?"
            : "¿Quieres hacer una remodelación parcial o renovar completamente el espacio?",
        chips: [
          { label: "Algunas cosas", message: "Quiero cambiar algunas cosas" },
          { label: "Remodelación completa", message: "Quiero una remodelación completa" },
          { label: "No estoy seguro", message: "No estoy seguro del alcance" },
        ],
      },
    ];

    if (family !== "apartamento") {
      extra.push(
        family === "baño"
          ? {
              text: "¿Actualmente funcionan el sanitario, el lavamanos y la ducha?",
              chips: [
                { label: "Sí", message: "Sí, sanitario, lavamanos y ducha funcionan" },
                { label: "Algunos problemas", message: "Algunos presentan problemas" },
                { label: "No", message: "No, las instalaciones no funcionan" },
                { label: "No estoy seguro", message: "No estoy seguro si las instalaciones funcionan" },
              ],
            }
          : {
              text: "¿El espacio está actualmente en uso y tiene las instalaciones funcionando?",
              chips: [
                { label: "Sí", message: "Sí, el espacio está en uso y las instalaciones funcionan" },
                { label: "No", message: "No, las instalaciones no están funcionando" },
                { label: "No estoy seguro", message: "No estoy seguro si las instalaciones funcionan" },
              ],
            },
      );
    }

    extra.push({
      text: "¿Qué quieres conseguir con la remodelación?",
      chips: [
        { label: "Modernizar", message: "Quiero modernizar" },
        { label: "Mejorar acabados", message: "Quiero mejorar acabados" },
        { label: "Cambio total", message: "Quiero cambiar completamente el espacio" },
        { label: "Solucionar problemas", message: "Quiero solucionar problemas actuales" },
        { label: "Aprovechar espacio", message: "Quiero aprovechar mejor el espacio" },
        { label: "Otro", message: "Tengo otro objetivo" },
      ],
    });

    extra.push({
      text:
        family === "apartamento"
          ? "¿Aproximadamente cuántos metros cuadrados tiene el apartamento? Si no lo sabes, no hay problema."
          : "¿Sabes aproximadamente cuánto mide el espacio? Si lo sabes, escríbelo (por ejemplo 2 x 2 metros).",
      chips: [
        { label: "No sé", message: "No sé el tamaño" },
        { label: "Pequeño", message: "Es un espacio pequeño" },
        { label: "Mediano", message: "Es un espacio mediano" },
        { label: "Grande", message: "Es un espacio grande" },
      ],
    });

    extra.push({
      text: "¿Cuándo te gustaría realizar la remodelación?",
      chips: [
        { label: "Lo antes posible", message: "Lo antes posible" },
        { label: "Próximo mes", message: "El próximo mes" },
        { label: "En 1–3 meses", message: "En 1 a 3 meses" },
        { label: "Todavía planeando", message: "Todavía estoy planeando" },
      ],
    });

    return [espacio, ...extra];
  }
  return [
    {
      text: "No hay problema. Cuéntame un poco más. ¿La mancha o el problema aparece después de la lluvia o está presente de forma permanente?",
      chips: [
        { label: "Después de la lluvia", message: "Aparece después de la lluvia" },
        { label: "Permanente", message: "Está presente de forma permanente" },
        { label: "No sé", message: "No sé cuándo aparece" },
      ],
    },
    {
      text: "¿La pared o la zona está en el interior o en el exterior?",
      chips: [
        { label: "Interior", message: "Está en el interior" },
        { label: "Exterior", message: "Está en el exterior" },
      ],
    },
  ];
}

function fold(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(text: string, words: string[]) {
  const tokens = text.split(" ");
  return words.some((word) => {
    const w = fold(word);
    if (!w) return false;
    if (w.length >= 5) return text.includes(w);
    return tokens.includes(w);
  });
}

function inferElectricStep(step: Step, text: string): string | undefined {
  const t = fold(step.text);
  if (t.includes("que necesitas hacer")) {
    const family = electricFamily(text);
    if (!family) return undefined;
    return electricTrabajo(family, text, detectElectricItems(text));
  }
  if (t.includes("cuantas lamparas") || t.includes("cuantas luminarias")) {
    const n = detectElectricQty(text);
    if (!n) return undefined;
    if (n >= 3) return t.includes("luminaria") ? "Necesito 3 o más luminarias" : "Necesito 3 o más lámparas";
    return t.includes("luminaria") ? `Necesito ${n} luminaria${n > 1 ? "s" : ""}` : `Necesito ${n} lámpara${n > 1 ? "s" : ""}`;
  }
  if (t.includes("donde se encuentra")) {
    const place = detectElectricPlace(text);
    return place ? `Lugar: ${place}` : undefined;
  }
  if (t.includes("conexion electrica") || t.includes("ya existe una conexion")) {
    if (hasAny(text, ["ya existe", "ya hay punto", "punto ya", "si hay conexion"])) return "Punto eléctrico existente: Sí";
    if (hasAny(text, ["no hay punto", "no existe punto", "sin punto"])) return "Punto eléctrico existente: No";
    return undefined;
  }
  if (t.includes("punto nuevo") || t.includes("reemplazar uno existente")) {
    if (hasAny(text, ["reemplazar", "existente"]) && !hasAny(text, ["punto nuevo", "otro tomacorriente"])) {
      return "Tipo de punto: reemplazo";
    }
    if (hasAny(text, ["punto nuevo", "otro tomacorriente", "nuevo punto"])) return "Tipo de punto: nuevo";
    return undefined;
  }
  if (t.includes("ya lo tienes") || t.includes("suministro")) {
    if (hasAny(text, ["ya lo tengo", "ya tengo"])) return "Producto: ya lo tiene";
    if (hasAny(text, ["conseguirlo", "suministro"])) return "Producto: hay que conseguirlo";
    return undefined;
  }
  if (t.includes("toda la vivienda") || t.includes("solamente una zona")) {
    if (hasAny(text, ["toda la casa", "toda la vivienda", "en toda"])) return "Afecta toda la vivienda";
    if (hasAny(text, ["una zona", "solo una", "solamente una"])) return "Afecta solamente una zona";
    return undefined;
  }
  return undefined;
}

function prefillElectric(job: JobItem, text: string): JobItem {
  const known = fold([text, job.trabajo, ...job.answers].join(" "));
  if (job.riesgo || isElectricRisk(known)) {
    return {
      ...job,
      trabajo: job.trabajo && job.trabajo !== text ? job.trabajo : "Revisión eléctrica por seguridad",
      answers: job.answers.length ? job.answers : [text.slice(0, 120)],
      step: 99,
      riesgo: true,
      requiereVisita: true,
      servicios: job.servicios?.length ? job.servicios : ["Revisión eléctrica"],
    };
  }

  const items = detectElectricItems(known);
  const family = electricFamily(known);
  let trabajo = job.trabajo;
  let servicios = job.servicios;
  if (family) {
    trabajo = electricTrabajo(family, known, items);
    servicios = items.length ? items : [trabajo];
  }
  const visita = family === "apagon" || family === "mixto" || family === "otro";

  let answers = [...job.answers];
  let step = job.step;
  for (let i = 0; i < 10; i++) {
    const probe: JobItem = { ...job, trabajo, answers, step, servicios };
    const steps = stepsOf("electricidad", probe);
    if (step >= steps.length) break;
    const inferred = inferElectricStep(steps[step], known);
    if (!inferred) break;
    answers = [...answers, inferred];
    step += 1;
  }

  return { ...job, trabajo, answers, step, servicios, requiereVisita: job.requiereVisita || visita };
}

function noticeAfterRepair(job: JobItem, last: string) {
  const q = fold([last, job.trabajo, ...job.answers].join(" "));
  if (hasAny(q, ["se filtra", "gotera", "humedad sigue", "filtracion"])) {
    return "Este caso puede requerir revisión. No afirmamos la causa de la humedad; el equipo lo mira al cotizar.\n\n";
  }
  if (job.especial || hasAny(q, ["altura"])) {
    return "Como hay una condición especial (por ejemplo altura), el caso pasa a revisión antes de cotizar.\n\n";
  }
  return "";
}

function noticeAfterElectric(job: JobItem, last: string) {
  if (job.riesgo) return ELECTRIC_RISK_MSG + "\n\n";
  const q = fold(last);
  if (hasAny(q, ["no hay punto", "punto electrico existente no"])) return ELECTRIC_PUNTO_MSG + "\n\n";
  if (hasAny(q, ["punto nuevo", "tipo de punto nuevo"])) return ELECTRIC_NUEVO_MSG + "\n\n";
  if (hasAny(q, ["no estoy seguro si hay punto", "no estoy seguro si es nuevo"])) {
    return "Como el punto eléctrico no está confirmado, el equipo lo revisará antes de definir el servicio.\n\n";
  }
  return "";
}

function inferRepairStep(step: Step, known: string, job: JobItem): string | undefined {
  const t = fold(step.text);
  if (t.includes("que necesitas reparar")) {
    const family = repairFamily(known);
    if (!family) return undefined;
    if (hasAny(known, ["reparar algo en la casa"]) && family !== "pared" && family !== "techo" && family !== "puerta") {
      return undefined;
    }
    return `Elemento: ${repairTrabajo(family, known)}`;
  }
  if (t.includes("pared o el techo")) {
    if (hasAny(known, ["ambos", "pared y el techo"])) return "Elemento: Pared y techo";
    if (hasAny(known, ["techo"]) && !hasAny(known, ["pared"])) return "Elemento: Techo";
    if (hasAny(known, ["pared"]) && !hasAny(known, ["techo"])) return "Elemento: Pared";
    return undefined;
  }
  if (t.includes("puerta o una ventana")) {
    if (hasAny(known, ["ambas", "puerta y ventana"])) return "Elemento: Puerta y ventana";
    if (hasAny(known, ["ventana"]) && !hasAny(known, ["puerta"])) return "Elemento: Ventana";
    if (hasAny(known, ["puerta"]) && !hasAny(known, ["ventana"])) return "Elemento: Puerta";
    return undefined;
  }
  if (t.includes("problema tiene la pared") || t.includes("ocurriendo en el techo") || t.includes("problema presenta") || t.includes("problema tiene el piso")) {
    if (hasAny(known, ["grieta", "fisura"])) return "Problema: grietas / fisuras";
    if (hasAny(known, ["estuco"])) return "Problema: estuco desprendido";
    if (hasAny(known, ["panete", "pañete"])) return "Problema: pañete dañado";
    if (hasAny(known, ["hueco", "golpe"])) return "Problema: huecos / golpes";
    if (hasAny(known, ["humedad", "mancha"])) return "Problema: humedad / manchas";
    if (hasAny(known, ["pintura"])) return "Problema: pintura deteriorada";
    if (hasAny(known, ["se cayo", "cayo material"])) return "Problema: se cayó material";
    if (hasAny(known, ["agrietado"])) return "Problema: está agrietado";
    if (hasAny(known, ["se filtra", "gotera"])) return "Problema: se filtra agua";
    if (hasAny(known, ["bisagra"])) return "Problema: bisagra dañada";
    if (hasAny(known, ["chapa", "cerradura"])) return "Problema: chapa / cerradura";
    if (hasAny(known, ["no cierra"])) return "Problema: no cierra bien";
    if (hasAny(known, ["quebrado"])) return "Problema: está quebrado";
    if (hasAny(known, ["despego", "despeg"])) return "Problema: se despegó";
    if (hasAny(known, ["levantado"])) return "Problema: está levantado";
    return undefined;
  }
  if (t.includes("madera, metalica") || t.includes("otro material")) {
    if (hasAny(known, ["madera"])) return "Material: madera";
    if (hasAny(known, ["metal"])) return "Material: metal";
    if (hasAny(known, ["vidrio"])) return "Material: vidrio";
    return undefined;
  }
  if (t.includes("zona pequena") || t.includes("varias piezas")) {
    if (hasAny(known, ["varias"])) return "Alcance: varias piezas";
    if (hasAny(known, ["pequena", "puntual"])) return "Alcance: zona pequeña";
    return undefined;
  }
  if (t.includes("parte necesita reparacion")) {
    if (hasAny(known, ["cajon"])) return "Parte: cajón";
    if (hasAny(known, ["bisagra"])) return "Parte: bisagra";
    if (hasAny(known, ["estructura"])) return "Parte: estructura";
    if (hasAny(known, ["puerta"])) return "Parte: puerta";
    return undefined;
  }
  if (t.includes("empotrado")) {
    if (hasAny(known, ["empotrado"])) return "Mueble empotrado";
    if (hasAny(known, ["independiente"])) return "Mueble independiente";
    return undefined;
  }
  if (t.includes("que ocurrio")) {
    if (!isRepairNarrative(job.trabajo) && !job.answers.some((a) => isRepairNarrative(a))) {
      return undefined;
    }
    const seed = isRepairNarrative(job.trabajo)
      ? job.trabajo
      : job.answers.find((a) => isRepairNarrative(a)) ?? "";
    if (seed.length >= 24) return `Qué ocurrió: ${seed.slice(0, 120)}`;
    return undefined;
  }
  return undefined;
}

function isRepairNarrative(value: string) {
  const seed = fold(value);
  if (seed.length < 24) return false;
  if (
    seed.startsWith("elemento ") ||
    seed.startsWith("problema ") ||
    seed.startsWith("material ") ||
    seed.startsWith("alcance ") ||
    seed.startsWith("parte ") ||
    seed.startsWith("que ocurrio ")
  ) {
    return false;
  }
  const chips = [
    "necesito reparar algo en la casa",
    "necesito reparar una pared o el techo",
    "necesito reparar una puerta o ventana",
    "necesito reparar piso o enchape",
    "necesito reparar un mueble",
    "necesito reparar drywall estuco o panete",
    "es otra cosa que hay que reparar",
    "es la pared",
    "es el techo",
    "son la pared y el techo",
    "es una puerta",
    "es una ventana",
    "son puerta y ventana",
    "es de madera",
    "es metalica",
    "es de vidrio",
    "es de otro material",
    "no se el material",
    "es una zona pequena",
    "hay varias piezas afectadas",
    "no se cuantas piezas estan afectadas",
    "la puerta del mueble",
    "la bisagra del mueble",
    "el cajon",
    "la estructura del mueble",
    "es otra parte del mueble",
    "esta empotrado",
    "es independiente",
    "no se si esta empotrado",
    "ya explique lo que ocurrio",
    "el dano es pequeno o puntual",
    "afecta una parte de la superficie",
    "afecta gran parte",
    "no estoy seguro del tamano del dano",
    "si la humedad sigue apareciendo",
    "no la humedad ya no aparece",
    "no estoy seguro si la humedad continua",
    "aparece despues de la lluvia",
    "esta presente de forma permanente",
    "no se cuando aparece la mancha",
    "no hay una condicion especial",
    "el dano esta en altura",
    "puede ser peligroso",
    "no estoy seguro si hay una condicion especial",
  ];
  return !chips.includes(seed);
}

function prefillRepair(job: JobItem, text: string): JobItem {
  const known = fold([text, job.trabajo, ...job.answers].join(" "));
  const family = repairFamily(known);
  let trabajo = job.trabajo;
  let servicios = job.servicios;
  let answers = [...job.answers];
  if (family && family !== "pared_techo" && family !== "puerta_ventana") {
    if (isRepairNarrative(job.trabajo) && !answers.some((a) => fold(a).startsWith("que ocurrio"))) {
      answers = [...answers, `Qué ocurrió: ${job.trabajo.slice(0, 120)}`];
    }
    trabajo = repairTrabajo(family, known);
    servicios = repairServices(known);
  }

  const narrative = isRepairNarrative(job.trabajo) ? job.trabajo : isRepairNarrative(text) ? text : "";

  let step = job.step;
  for (let i = 0; i < 12; i++) {
    const probe: JobItem = { ...job, trabajo: narrative || trabajo, answers, step, servicios };
    const steps = stepsOf("locativa", { ...job, trabajo, answers, step, servicios });
    if (step >= steps.length) break;
    const asked = fold(steps[step].text);
    if (asked.includes("que ocurrio") && answers.some((a) => fold(a).startsWith("que ocurrio"))) {
      step += 1;
      continue;
    }
    const inferred = inferRepairStep(steps[step], known, probe);
    if (!inferred) break;
    answers = [...answers, inferred];
    step += 1;
  }

  const visita =
    job.requiereVisita ||
    hasAny(known, ["se filtra", "gotera", "gran parte", "altura", "peligroso", "humedad sigue"]);
  return { ...job, trabajo, answers, step, servicios, requiereVisita: visita };
}

function inferRemodelStep(step: Step, known: string, family: string | undefined): string | undefined {
  const t = fold(step.text);
  if (t.includes("donde quieres remodelar")) {
    if (!family) return undefined;
    return `Espacio: ${remodelTrabajo(family, known).replace(/^Remodelación de /i, "")}`;
  }
  if (t.includes("quieres cambiar") || t.includes("espacios quieres intervenir")) {
    if (!family) return undefined;
    const items = remodelChangeItems(family, known);
    if (!items.length) return undefined;
    return `Cambios: ${items.join(", ")}`;
  }
  if (t.includes("parcial") || t.includes("renovar completamente") || t.includes("renovacion general")) {
    return remodelAlcance(known);
  }
  if (t.includes("funcionan el sanitario") || t.includes("instalaciones funcionando") || t.includes("instalaciones funcionan")) {
    if (hasAny(known, ["algunos presentan problemas"])) return "Instalaciones: algunos presentan problemas";
    if (hasAny(known, ["no, las instalaciones"])) return "Instalaciones: no funcionan";
    if (hasAny(known, ["si, sanitario", "si, el espacio esta en uso"])) return "Instalaciones: sí, funcionan";
    if (hasAny(known, ["no estoy seguro si las instalaciones"])) return "Instalaciones: por confirmar";
    return undefined;
  }
  if (t.includes("conseguir con la remodelacion")) {
    return remodelObjetivo(known);
  }
  if (t.includes("cuanto mide") || t.includes("metros cuadrados")) {
    if (hasAny(known, ["no se el tamano"])) return "Tamaño: se revisa al cotizar";
    return parseRemodelArea(known);
  }
  if (t.includes("cuando te gustaria")) {
    if (hasAny(known, ["lo antes posible"])) return "Urgencia: lo antes posible";
    if (hasAny(known, ["proximo mes"])) return "Urgencia: próximo mes";
    if (hasAny(known, ["1 a 3 meses", "1-3 meses"])) return "Urgencia: en 1 a 3 meses";
    if (hasAny(known, ["todavia estoy planeando"])) return "Urgencia: todavía está planeando";
    return undefined;
  }
  return undefined;
}

function prefillRemodel(job: JobItem, text: string): JobItem {
  const known = fold([text, job.trabajo, ...job.answers].join(" "));
  const family = remodelFamily(known);
  let trabajo = job.trabajo;
  let servicios = job.servicios;
  if (family) {
    trabajo = remodelTrabajo(family, known);
    servicios = remodelServices(known);
  }

  let answers = [...job.answers];
  let step = job.step;
  for (let i = 0; i < 12; i++) {
    const probe: JobItem = { ...job, trabajo, answers, step, servicios };
    const steps = stepsOf("remodelaciones", probe);
    if (step >= steps.length) break;
    const inferred = inferRemodelStep(steps[step], known, family);
    if (!inferred) break;
    if (answers.some((a) => fold(a) === fold(inferred))) {
      step += 1;
      continue;
    }
    answers = [...answers, inferred];
    step += 1;
  }

  return {
    ...job,
    trabajo,
    answers,
    step,
    servicios,
    requiereVisita: true,
    especial: job.especial || isRemodelStructural(known),
  };
}

function noticeAfterRemodel(last: string) {
  const q = fold(last);
  if (hasAny(q, ["no se el tamano"])) {
    return "No hay problema. Podemos revisar las medidas cuando preparemos la cotización.\n\n";
  }
  if (hasAny(q, ["distribucion", "ampliar", "estructural", "remodelacion completa"])) {
    return "Este tipo de proyecto requiere revisión. La cotización se hace por WhatsApp, sin precio automático.\n\n";
  }
  return "";
}

function inferPaintStep(step: Step, known: string, family: string | undefined): string | undefined {
  const t = fold(step.text);
  if (t.includes("que quieres pintar")) {
    if (!family) return undefined;
    return `Espacio: ${paintTrabajo(family, known).replace(/^pintura(?: de)? /i, "")}`;
  }
  if (t.includes("interior o exterior")) {
    const place = paintPlace(known);
    if (!place) return undefined;
    return `Lugar: ${place}`;
  }
  if (t.includes("parte exterior")) {
    if (hasAny(known, ["fachada"])) return "Parte exterior: fachada";
    if (hasAny(known, ["culata"])) return "Parte exterior: culata";
    if (hasAny(known, ["patio"])) return "Parte exterior: patio";
    if (hasAny(known, ["terraza"])) return "Parte exterior: terraza";
    if (hasAny(known, ["reja"])) return "Parte exterior: rejas";
    return undefined;
  }
  if (t.includes("paredes y techos") || t.includes("algunas areas")) {
    if (hasAny(known, ["paredes y techos"])) return "Alcance: todo (paredes y techos)";
    if (hasAny(known, ["algunas habitaciones"])) return "Alcance: algunas habitaciones";
    if (hasAny(known, ["solo paredes"])) return "Alcance: solo paredes";
    if (hasAny(known, ["solo techos"])) return "Alcance: solo techos";
    return undefined;
  }
  if (t.includes("cuantas habitaciones")) {
    if (hasAny(known, ["4 o mas"])) return "Habitaciones: 4 o más";
    if (hasAny(known, ["son 3"])) return "Habitaciones: 3";
    if (hasAny(known, ["son 2"])) return "Habitaciones: 2";
    if (hasAny(known, ["es 1 habitacion"])) return "Habitaciones: 1";
    return undefined;
  }
  if (t.includes("como esta actualmente")) {
    return paintEstado(known);
  }
  if (t.includes("grietas son pequenas")) {
    if (hasAny(known, ["grietas pequenas"])) return "Grietas: pequeñas";
    if (hasAny(known, ["desprendimiento"])) return "Grietas: hay desprendimiento";
    return undefined;
  }
  if (t.includes("humedad todavia") || t.includes("mancha antigua")) {
    if (hasAny(known, ["sigue apareciendo"])) return "Humedad: sigue apareciendo";
    if (hasAny(known, ["mancha antigua"])) return "Humedad: mancha antigua";
    if (hasAny(known, ["no estoy seguro si la humedad"])) return "Humedad: por confirmar";
    return undefined;
  }
  if (t.includes("metros cuadrados")) {
    if (hasAny(known, ["no se la medida"])) return "Área: se revisa al cotizar";
    if (hasAny(known, ["menos de 50"])) return "Área: menos de 50 m²";
    if (hasAny(known, ["50 y 150", "entre 50"])) return "Área: 50 a 150 m²";
    if (hasAny(known, ["mas de 150"])) return "Área: más de 150 m²";
    if (hasAny(known, ["menos de 30"])) return "Área: menos de 30 m²";
    if (hasAny(known, ["30 y 80", "entre 30"])) return "Área: 30 a 80 m²";
    if (hasAny(known, ["mas de 80"])) return "Área: más de 80 m²";
    return parsePaintArea(known);
  }
  if (t.includes("que altura")) {
    if (hasAny(known, ["mas de 10"])) return "Altura: más de 10 m";
    if (hasAny(known, ["6 y 10", "6 a 10"])) return "Altura: 6 a 10 m";
    if (hasAny(known, ["3 y 6", "3 a 6"])) return "Altura: 3 a 6 m";
    if (hasAny(known, ["menos de 3"])) return "Altura: menos de 3 m";
    if (hasAny(known, ["no se la altura"])) return "Altura: por confirmar";
    return undefined;
  }
  if (t.includes("acceso a la zona")) {
    if (hasAny(known, ["requiere equipo"])) return "Acceso: requiere equipo";
    if (hasAny(known, ["acceso es sencillo"])) return "Acceso: sencillo";
    if (hasAny(known, ["no estoy seguro del acceso"])) return "Acceso: por confirmar";
    return undefined;
  }
  return undefined;
}

function prefillPaint(job: JobItem, text: string): JobItem {
  const known = fold([text, job.trabajo, ...job.answers].join(" "));
  const family = paintFamily(known);
  let trabajo = job.trabajo;
  let servicios = job.servicios;
  if (family) {
    trabajo = paintTrabajo(family, known);
    servicios = paintServices(known);
  }

  let answers = [...job.answers];
  let step = job.step;
  for (let i = 0; i < 12; i++) {
    const probe: JobItem = { ...job, trabajo, answers, step, servicios };
    const steps = stepsOf("pintura", probe);
    if (step >= steps.length) break;
    const inferred = inferPaintStep(steps[step], known, family);
    if (!inferred) break;
    if (answers.some((a) => fold(a) === fold(inferred))) {
      step += 1;
      continue;
    }
    answers = [...answers, inferred];
    step += 1;
  }

  const visita =
    job.requiereVisita ||
    family === "fachada" ||
    isPaintExteriorFamily(family) ||
    hasAny(known, [
      "sigue apareciendo",
      "bastante deteriorada",
      "desprendimiento",
      "mas de 10",
      "6 y 10",
      "requiere equipo",
      "no se la altura",
      "no estoy seguro si la humedad",
    ]);
  const especial =
    job.especial ||
    hasAny(known, ["mas de 10", "6 y 10", "6 a 10", "requiere equipo", "trabajo en altura"]);
  return { ...job, trabajo, answers, step, servicios, requiereVisita: visita, especial };
}

function noticeAfterPaint(last: string) {
  const q = fold(last);
  if (hasAny(q, ["no se la medida"])) {
    return "No hay problema. Podemos revisar las medidas al preparar la cotización.\n\n";
  }
  if (hasAny(q, ["sigue apareciendo", "humedad sigue"])) {
    return "Antes de definir la pintura puede ser necesario revisar el origen de la humedad. No prometemos que solo con pintar se solucione.\n\n";
  }
  if (hasAny(q, ["mas de 10", "requiere equipo", "6 y 10"])) {
    return "Por la altura o el acceso, este trabajo requiere revisión. La cotización se hace por WhatsApp, sin precio automático.\n\n";
  }
  return "";
}

function newJob(kind: AssistantKind, trabajo: string): JobItem {
  const visita = kind === "fachadas" || kind === "impermeabilizacion" || kind === "remodelaciones" || kind === "otro";
  const job: JobItem = {
    kind,
    trabajo: trabajo.slice(0, 180),
    step: 0,
    answers: [],
    requiereVisita: visita,
  };
  if (kind === "electricidad") {
    return prefillElectric(job, trabajo);
  }
  if (kind === "locativa") {
    return prefillRepair(job, trabajo);
  }
  if (kind === "pintura") {
    return prefillPaint(job, trabajo);
  }
  if (kind === "impermeabilizacion") {
    return prefillWaterproof(job, trabajo);
  }
  if (kind === "remodelaciones") {
    return prefillRemodel(job, trabajo);
  }
  if (kind === "plomeria") {
    const t = fold(trabajo);
    const tipo = isPlomeriaFuga(t)
      ? "Fuga"
      : isPlomeriaInstalacion(t)
        ? "Instalación de plomería"
        : isPlomeriaDano(t)
          ? "Daño / avería"
          : "";
    if (tipo) {
      job.trabajo = tipo;
      job.answers = [tipo];
      job.step = 1;
      const lugar = isPlomeriaBano(t) ? "Baño" : isPlomeriaCocina(t) ? "Cocina" : "";
      if (lugar) {
        job.answers.push(lugar);
        job.step = 2;
      }
    }
  }
  return job;
}

export function cleanAssistantState(raw: unknown): AssistantState {
  if (!raw || typeof raw !== "object") return { jobs: [], current: 0 };
  const input = raw as Record<string, unknown>;
  const jobs: JobItem[] = [];
  if (Array.isArray(input.jobs)) {
    for (const row of input.jobs) {
      if (!row || typeof row !== "object") continue;
      const item = row as Record<string, unknown>;
      const kind = item.kind as AssistantKind;
      if (!KINDS.includes(kind)) continue;
      const trabajo = String(item.trabajo ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180);
      if (!trabajo) continue;
      const answers = Array.isArray(item.answers)
        ? item.answers.map((a) => String(a).slice(0, 120)).filter(Boolean)
        : item.detail
          ? [String(item.detail).slice(0, 120)]
          : [];
      const step = Number(item.step);
      jobs.push({
        kind,
        trabajo,
        step: Number.isFinite(step) ? Math.max(0, step) : answers.length,
        answers,
        requiereVisita: item.requiereVisita === true,
        riesgo: item.riesgo === true,
        especial: item.especial === true,
        servicios: Array.isArray(item.servicios)
          ? item.servicios.map((s) => String(s).slice(0, 80)).filter(Boolean)
          : undefined,
      });
    }
  }
  const zona = String(input.zona ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  const name = String(input.name ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  const phone = String(input.phone ?? "")
    .replace(/\D/g, "")
    .slice(0, 15);
  const current = Number(input.current);
  const cobertura =
    input.cobertura === "pending" || input.cobertura === "review" || input.cobertura === "ok"
      ? input.cobertura
      : undefined;
  return {
    jobs,
    current: Number.isFinite(current) && current >= 0 ? Math.min(current, Math.max(jobs.length - 1, 0)) : 0,
    zona: zona || undefined,
    cobertura,
    confirmed: input.confirmed === true,
    listedMulti: input.listedMulti === true,
    listedUnknown: input.listedUnknown === true,
    name: name.length >= 2 ? name : undefined,
    phone: phone.length >= 7 ? phone : undefined,
    leadSaved: input.leadSaved === true,
    history: Array.isArray(input.history)
      ? input.history.slice(-20).map((row) => {
          const snap = cleanAssistantState({ ...(row as object), history: undefined });
          return { ...snap, history: undefined };
        })
      : undefined,
  };
}

function jobLine(job: JobItem) {
  const bits = [KIND_LABEL[job.kind], job.trabajo, ...job.answers].filter(Boolean);
  if (job.especial) bits.push("trabajo especial: requiere revisión");
  if (job.riesgo) bits.push("revisión prioritaria por seguridad");
  else if (job.requiereVisita) bits.push("requiere revisión / cotización");
  return bits.join(" · ");
}

export function buildLeadFields(state: AssistantState) {
  const services = state.jobs.flatMap((job) =>
    job.servicios?.length ? job.servicios : [KIND_LABEL[job.kind]],
  );
  const servicio = (services.join(", ") || "Chat hogar").slice(0, 80);
  const remodelJob = state.jobs.find((job) => job.kind === "remodelaciones");
  const waterJob = state.jobs.find((job) => job.kind === "impermeabilizacion");
  const paintJob = state.jobs.find((job) => job.kind === "pintura");
  const message = (
    remodelJob
      ? [
          remodelLeadSentence(remodelJob),
          ...state.jobs.filter((job) => job.kind !== "remodelaciones").map(jobLine),
        ].join(" | ")
      : waterJob
        ? [
            waterproofLeadSentence(waterJob),
            ...state.jobs.filter((job) => job.kind !== "impermeabilizacion").map(jobLine),
          ].join(" | ")
      : paintJob
        ? [
            paintLeadSentence(paintJob),
            ...state.jobs.filter((job) => job.kind !== "pintura").map(jobLine),
          ].join(" | ")
        : state.jobs.map(jobLine).join(" | ")
  ).slice(0, 500);
  return {
    name: (state.name || "Cliente chat").slice(0, 80),
    phone: (state.phone || "").slice(0, 30),
    zona: (state.zona || "").slice(0, 60),
    servicio,
    services,
    message: message || "Solicitud desde el asesor del hogar",
    source: "chat" as const,
    status: "new" as const,
  };
}

export function shouldSaveLead(state: AssistantState) {
  return Boolean(
    state.confirmed &&
      state.name &&
      state.phone &&
      validPhone(state.phone) &&
      state.jobs.length &&
      !state.leadSaved,
  );
}

function validPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("3")) return true;
  if (digits.length >= 12 && digits.startsWith("57")) return true;
  return digits.length >= 10;
}

function parseContact(original: string, previous: AssistantState) {
  const digits = original.replace(/\D/g, "");
  let phone = previous.phone;
  if (digits.length >= 10) {
    phone = digits.startsWith("57") && digits.length >= 12 ? digits.slice(-10) : digits.slice(0, 12);
  } else if (digits.length >= 7 && !previous.phone) {
    phone = digits;
  }

  let name = previous.name;
  const namePart = original
    .replace(/(\+?\d[\d\s\-()]{6,}\d)/g, " ")
    .replace(/\b(me llamo|soy|nombre|mi nombre es|celular|telefono|tel|whatsapp|es)\b/gi, " ")
    .replace(/[^\p{L}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (namePart.length >= 2) name = namePart.slice(0, 80);

  return { name, phone };
}

function zonaAliases(site: SiteContent) {
  const rows: { alias: string; label: string }[] = EXTRA_ZONAS.map(([alias, label]) => ({ alias, label }));
  for (const zona of site.zonas) {
    rows.push({ alias: fold(zona.nombre), label: zona.nombre });
    for (const part of zona.detalle.split(/[,/]+/)) {
      const alias = fold(part);
      if (alias.length >= 3 && alias !== "y" && alias !== "alrededores" && !alias.includes("confirmamos")) {
        rows.push({ alias, label: `${part.trim()} (${zona.nombre})` });
      }
    }
  }
  return rows.sort((a, b) => b.alias.length - a.alias.length);
}

function detectFueraCobertura(q: string): string | undefined {
  const rows = [...FUERA_COBERTURA].sort((a, b) => b[0].length - a[0].length);
  for (const [alias, label] of rows) {
    if (alias.length >= 5) {
      if (q.includes(alias)) return label;
    } else if (q.split(" ").includes(alias)) {
      return label;
    }
  }
  if (hasAny(q, ["bogota sur", "sur de bogota", "sur bogota"])) return "Bogotá sur";
  return undefined;
}

function isSurfaceDirection(q: string, alias: string) {
  if (!["norte", "sur", "centro", "oriente", "occidente"].includes(alias)) return false;
  return hasAny(q, [
    `pared ${alias}`,
    `muro ${alias}`,
    `lado ${alias}`,
    `fachada ${alias}`,
    `ventana ${alias}`,
    `parte ${alias}`,
    `esquina ${alias}`,
    `patio ${alias}`,
    `habitacion ${alias}`,
    `cuarto ${alias}`,
  ]);
}

function hasPlaceIntent(q: string) {
  return hasAny(q, [
    "estoy",
    "vivo",
    "queda",
    "barrio",
    "municipio",
    "en bogota",
    "en la sabana",
    "en el norte",
    "en el centro",
    "bogota norte",
    "sabana norte",
  ]);
}

function looksLikePlaceOnly(q: string) {
  return (
    q.split(" ").filter(Boolean).length <= 4 &&
    !hasAny(q, ["mueble", "llave", "fuga", "pint", "lampara", "cortina", "humedad", "estuco", "pared", "puerta", "techo", "moho"])
  );
}

function detectZona(q: string, site: SiteContent): string | undefined {
  if (hasAny(q, ["otra zona", "otra parte", "por confirmar"])) return "otra zona (por confirmar)";
  const generic = new Set(["norte", "centro", "sabana", "bogota", "bogota norte"]);
  const aliases = zonaAliases(site);
  for (const group of [aliases.filter((r) => !generic.has(r.alias)), aliases.filter((r) => generic.has(r.alias))]) {
    for (const { alias, label } of group) {
      const hit = alias.length >= 5 ? q.includes(alias) : q.split(" ").includes(alias);
      if (!hit) continue;
      if (isSurfaceDirection(q, alias)) continue;
      if (generic.has(alias) && !hasPlaceIntent(q) && !looksLikePlaceOnly(q)) continue;
      return label;
    }
  }
  return undefined;
}

const SHORT_JOB: Record<AssistantKind, string> = {
  locativa: "Reparación locativa",
  pintura: "Pintura",
  plomeria: "Fuga / plomería",
  electricidad: "Electricidad",
  instalaciones: "Instalación",
  remodelaciones: "Remodelación",
  fachadas: "Fachada / exterior",
  impermeabilizacion: "Impermeabilización",
  otro: "Diagnóstico de humedad / problema",
};

function detectJobs(q: string, original: string): JobItem[] {
  let found: JobItem[] = [];
  const seen = new Set<AssistantKind>();
  for (const detector of DETECTORS) {
    if (seen.has(detector.kind)) continue;
    const hit = hasAny(q, detector.words) || (detector.kind === "electricidad" && hasExposedCables(q));
    if (!hit) continue;
    seen.add(detector.kind);
    found.push(newJob(detector.kind, original));
  }
  if (
    hasAny(q, ["bano"]) &&
    !seen.has("plomeria") &&
    !seen.has("remodelaciones") &&
    !seen.has("locativa") &&
    !seen.has("otro") &&
    !hasAny(q, ["humedad", "moho", "mancha", "gotera", "pared", "techo"])
  ) {
    found.push(newJob("remodelaciones", original));
  }
  if (hasAny(q, ["fachada", "culata"]) && !seen.has("pintura") && !hasAny(q, ["impermeabil"])) {
    found.push(newJob("pintura", original));
    seen.add("pintura");
  }
  if (seen.has("impermeabilizacion") && seen.has("locativa") && !hasAny(q, ["puerta", "mueble", "drywall", "ventana"])) {
    found = found.filter((job) => job.kind !== "locativa");
    seen.delete("locativa");
  }
  if (seen.has("impermeabilizacion") && seen.has("otro")) {
    found = found.filter((job) => job.kind !== "otro");
    seen.delete("otro");
  }
  if (seen.has("fachadas") && seen.has("pintura") && !seen.has("impermeabilizacion")) {
    found = found.filter((job) => job.kind !== "fachadas");
    seen.delete("fachadas");
  }
  if (seen.has("electricidad") && seen.has("instalaciones")) {
    return found.filter((job) => job.kind !== "instalaciones");
  }
  if (
    seen.has("electricidad") &&
    seen.has("locativa") &&
    !hasAny(q, ["panete", "estuco", "resane", "puerta", "pared", "techo", "pañete"])
  ) {
    return found.filter((job) => job.kind !== "locativa");
  }
  if (seen.has("plomeria") && seen.has("otro")) {
    return found.filter((job) => job.kind !== "otro");
  }
  if (seen.has("locativa") && seen.has("otro") && !seen.has("pintura")) {
    return found.filter((job) => job.kind !== "otro");
  }
  if (
    seen.has("locativa") &&
    seen.has("remodelaciones") &&
    hasAny(q, ["reparar", "arreglar", "dano", "quebr", "despeg", "levant"]) &&
    !hasAny(q, ["remodel", "reforma", "renovar"])
  ) {
    return found.filter((job) => job.kind !== "remodelaciones");
  }
  if (seen.has("locativa") && seen.has("remodelaciones") && hasAny(q, ["remodel", "reforma", "renovar"])) {
    return found.filter((job) => job.kind !== "locativa");
  }
  if (seen.has("pintura") && hasAny(q, ["pintar", "pintura"])) {
    return found.filter((job) => job.kind !== "locativa" && job.kind !== "otro");
  }
  if (
    seen.has("locativa") &&
    seen.has("plomeria") &&
    hasAny(q, ["techo", "pared", "gotera", "se filtra", "mancha"]) &&
    !hasAny(q, ["llave", "sanitario", "grifer", "lavamano", "ducha", "sifon", "lavaplato"])
  ) {
    return found.filter((job) => job.kind !== "plomeria");
  }
  if (found.length > 1) {
    found.sort(
      (a, b) =>
        Number(b.kind === "impermeabilizacion") - Number(a.kind === "impermeabilizacion") ||
        Number(b.kind === "remodelaciones") - Number(a.kind === "remodelaciones"),
    );
    for (const job of found) {
      if (
        job.kind === "electricidad" ||
        job.kind === "locativa" ||
        job.kind === "remodelaciones" ||
        job.kind === "pintura" ||
        job.kind === "impermeabilizacion"
      ) {
        continue;
      }
      job.trabajo = SHORT_JOB[job.kind];
    }
  }
  return found;
}

function chipKind(q: string): AssistantKind | undefined {
  if (hasAny(q, ["problema de plomeria"])) return "plomeria";
  if (hasAny(q, ["corto circuito", "cortocircuito", "problema electric"])) return "electricidad";
  if (hasAny(q, ["quiero instalar"])) return "instalaciones";
  if (hasAny(q, ["quiero impermeabilizar"])) return "impermeabilizacion";
  if (hasAny(q, ["quiero pintar", "pintar la fachada", "trabajo en la fachada"])) return "pintura";
  if (hasAny(q, ["quiero remodelar"])) return "remodelaciones";
  if (hasAny(q, ["reparar algo", "locativ"])) return "locativa";
  return undefined;
}

function jobOpen(job: JobItem) {
  return job.step < stepsOf(job.kind, job).length;
}

export function assistantInputHint(state: AssistantState): string {
  if (state.leadSaved) return "Otra solicitud o un comentario";
  if (state.confirmed && !state.name && !state.phone) return "Nombre y celular";
  if (state.confirmed && !state.name) return "Tu nombre";
  if (state.confirmed && (!state.phone || state.phone.replace(/\D/g, "").length < 10)) {
    return "Celular de 10 dígitos";
  }
  if (state.jobs.some((job) => jobOpen(job))) return "Responde, elige o escribe atrás";
  if (state.jobs.length && !state.zona) return "Barrio o municipio. Atrás para corregir";
  if (state.jobs.length && !state.confirmed) return "¿Es correcto? Atrás para corregir";
  return "¿Qué necesita tu hogar?";
}

function applyAnswer(job: JobItem, q: string, original: string): JobItem {
  const answer = original.slice(0, 120);
  const next: JobItem = {
    ...job,
    answers: [...job.answers, answer],
    step: job.step + 1,
  };

  if (job.kind === "pintura") {
    const asked = questionFor(job);
    const askedText = fold(asked?.text ?? "");
    const known = fold([job.trabajo, ...next.answers].join(" "));
    const family = paintFamily(known);
    if (family) {
      next.trabajo = paintTrabajo(family, known);
      next.servicios = paintServices(known);
    }
    if (askedText.includes("que quieres pintar") && family) {
      next.answers[next.answers.length - 1] = `Espacio: ${paintTrabajo(family, known).replace(/^pintura(?: de)? /i, "")}`;
    }
    if (askedText.includes("interior o exterior")) {
      const place = paintPlace(q);
      next.answers[next.answers.length - 1] = place ? `Lugar: ${place}` : original;
    }
    if (askedText.includes("parte exterior")) {
      next.answers[next.answers.length - 1] = inferPaintStep({ text: asked?.text ?? "", chips: [] }, q, family) ?? `Parte exterior: ${original}`;
    }
    if (askedText.includes("como esta actualmente")) {
      next.answers[next.answers.length - 1] = paintEstado(q) ?? `Estado: ${original}`;
    }
    if (askedText.includes("metros cuadrados")) {
      if (hasAny(q, ["no se la medida"])) next.answers[next.answers.length - 1] = "Área: se revisa al cotizar";
      else next.answers[next.answers.length - 1] = parsePaintArea(q) ?? inferPaintStep(asked ?? { text: "", chips: [] }, q, family) ?? `Área: ${original}`;
    }
    if (askedText.includes("que altura")) {
      next.answers[next.answers.length - 1] = inferPaintStep({ text: asked?.text ?? "", chips: [] }, q, family) ?? `Altura: ${original}`;
    }
    if (askedText.includes("acceso a la zona")) {
      next.answers[next.answers.length - 1] = inferPaintStep({ text: asked?.text ?? "", chips: [] }, q, family) ?? `Acceso: ${original}`;
    }
    if (askedText.includes("grietas son pequenas")) {
      next.answers[next.answers.length - 1] = inferPaintStep({ text: asked?.text ?? "", chips: [] }, q, family) ?? original;
    }
    if (askedText.includes("humedad todavia") || askedText.includes("mancha antigua")) {
      next.answers[next.answers.length - 1] = inferPaintStep({ text: asked?.text ?? "", chips: [] }, q, family) ?? original;
    }
    next.servicios = paintServices(known);
    next.requiereVisita =
      next.requiereVisita ||
      family === "fachada" ||
      isPaintExteriorFamily(family) ||
      hasAny(q, ["sigue apareciendo", "bastante deteriorada", "desprendimiento", "mas de 10", "requiere equipo"]);
    next.especial = next.especial || hasAny(q, ["mas de 10", "6 y 10", "6 a 10", "requiere equipo"]);
    if (hasAny(q, ["no se la altura", "no estoy seguro del acceso", "no estoy seguro si la humedad"])) {
      next.requiereVisita = true;
    }
    return prefillPaint(next, original);
  }
  if (job.kind === "impermeabilizacion") {
    const asked = questionFor(job);
    const askedText = fold(asked?.text ?? "");
    const known = fold([job.trabajo, ...next.answers].join(" "));
    const place = waterproofPlace(known);
    if (place) {
      next.trabajo = waterproofTrabajo(place);
      next.servicios = waterproofServices(known);
    }
    if (askedText.includes("quieres impermeabilizar") || askedText.includes("necesitas proteger")) {
      next.answers[next.answers.length - 1] =
        inferWaterproofStep({ text: asked?.text ?? "", chips: [] }, known) ?? `Zona: ${original}`;
    }
    if (askedText.includes("que esta ocurriendo") || askedText.includes("que problema")) {
      next.answers[next.answers.length - 1] =
        inferWaterproofStep({ text: asked?.text ?? "", chips: [] }, known) ?? `Problema: ${original}`;
    }
    if (askedText.includes("cuando notas") || askedText.includes("cuando aparece")) {
      next.answers[next.answers.length - 1] = waterproofCuando(q) ?? `Cuándo: ${original}`;
    }
    if (askedText.includes("como esta actualmente la superficie")) {
      next.answers[next.answers.length - 1] = waterproofEstado(q) ?? `Estado: ${original}`;
    }
    if (askedText.includes("metros cuadrados")) {
      if (hasAny(q, ["no se la medida", "no se los metros"])) next.answers[next.answers.length - 1] = "Área: se revisa al cotizar";
      else next.answers[next.answers.length - 1] = parsePaintArea(q) ?? inferWaterproofStep(asked ?? { text: "", chips: [] }, known) ?? `Área: ${original}`;
    }
    if (askedText.includes("altura considerable") || askedText.includes("facil acceso")) {
      next.answers[next.answers.length - 1] =
        inferWaterproofStep({ text: asked?.text ?? "", chips: [] }, fold(q)) ?? `Altura: ${original}`;
    }
    if (askedText.includes("acceso al lugar")) {
      next.answers[next.answers.length - 1] =
        inferWaterproofStep({ text: asked?.text ?? "", chips: [] }, fold(q)) ?? `Acceso: ${original}`;
    }
    next.servicios = waterproofServices(known);
    next.requiereVisita = true;
    if (hasAny(q, ["esta en altura", "en altura", "requiere equipo"])) {
      next.especial = true;
    }
    if (hasAny(q, ["no estoy seguro de la altura", "no estoy seguro del acceso"])) {
      next.requiereVisita = true;
    }
    return prefillWaterproof(next, original);
  }
  if (job.kind === "fachadas" && job.step === 1) {
    next.especial = true;
    next.requiereVisita = true;
    next.riesgo = hasAny(q, ["mas de", "10", "altura", "5 m", "metros"]);
  }
  if (job.kind === "locativa") {
    if (isRepairNarrative(job.trabajo) && !next.answers.some((a) => fold(a).startsWith("que ocurrio"))) {
      next.answers = [`Qué ocurrió: ${job.trabajo.slice(0, 120)}`, ...next.answers];
    }
    const asked = questionFor(job);
    const askedText = fold(asked?.text ?? "");
    const known = fold([job.trabajo, ...next.answers].join(" "));
    if (askedText.includes("que necesitas reparar") || askedText.includes("pared o el techo") || askedText.includes("puerta o una ventana")) {
      const family = repairFamily(known);
      if (family) {
        next.trabajo = repairTrabajo(family, known);
        next.servicios = repairServices(known);
      }
    }
    next.servicios = repairServices(known);
    if (hasAny(q, ["humedad sigue", "sigue apareciendo"]) && !hasAny(q, ["no, la humedad"])) {
      next.requiereVisita = true;
    }
    if (askedText.includes("humedad sigue") && hasAny(q, ["si"])) next.requiereVisita = true;
    if (hasAny(q, ["se filtra", "gotera", "filtracion"])) next.requiereVisita = true;
    if (hasAny(q, ["gran parte"])) next.requiereVisita = true;
    if (hasAny(q, ["varias piezas"])) next.requiereVisita = true;
    if (hasAny(q, ["altura"])) {
      next.especial = true;
      next.requiereVisita = true;
    }
    if (hasAny(q, ["peligroso"])) {
      next.riesgo = true;
      next.requiereVisita = true;
    }
    if (hasAny(q, ["no estoy seguro si hay una condicion", "no estoy seguro si la humedad"])) {
      next.requiereVisita = true;
    }
    return prefillRepair(next, original);
  }
  if (job.kind === "remodelaciones") {
    const asked = questionFor(job);
    const askedText = fold(asked?.text ?? "");
    const known = fold([job.trabajo, ...next.answers].join(" "));
    const family = remodelFamily(known);
    if (family) {
      next.trabajo = remodelTrabajo(family, known);
      next.servicios = remodelServices(known);
    }
    if (askedText.includes("quieres cambiar") || askedText.includes("espacios quieres intervenir")) {
      const items = family ? remodelChangeItems(family, q) : [];
      next.answers[next.answers.length - 1] = items.length ? `Cambios: ${items.join(", ")}` : `Cambios: ${original}`;
    }
    if (askedText.includes("parcial") || askedText.includes("renovacion general")) {
      next.answers[next.answers.length - 1] = remodelAlcance(q) ?? `Alcance: ${original}`;
    }
    if (askedText.includes("funcionan el sanitario") || askedText.includes("instalaciones funcionando")) {
      if (hasAny(q, ["no estoy seguro"])) next.answers[next.answers.length - 1] = "Instalaciones: por confirmar";
      else if (hasAny(q, ["algunos presentan"])) next.answers[next.answers.length - 1] = "Instalaciones: algunos presentan problemas";
      else if (hasAny(q, ["no, las instalaciones"])) next.answers[next.answers.length - 1] = "Instalaciones: no funcionan";
      else if (hasAny(q, ["si"])) next.answers[next.answers.length - 1] = "Instalaciones: sí, funcionan";
    }
    if (askedText.includes("conseguir con la remodelacion")) {
      next.answers[next.answers.length - 1] = remodelObjetivo(q) ?? `Objetivo: ${original}`;
    }
    if (askedText.includes("cuanto mide") || askedText.includes("metros cuadrados")) {
      if (hasAny(q, ["no se el tamano"])) next.answers[next.answers.length - 1] = "Tamaño: se revisa al cotizar";
      else next.answers[next.answers.length - 1] = parseRemodelArea(q) ?? `Tamaño: ${original}`;
    }
    if (askedText.includes("cuando te gustaria")) {
      next.answers[next.answers.length - 1] =
        inferRemodelStep({ text: asked?.text ?? "", chips: [] }, q, family) ?? `Urgencia: ${original}`;
    }
    next.requiereVisita = true;
    next.especial = next.especial || isRemodelStructural(known);
    return prefillRemodel(next, original);
  }
  if (job.kind === "otro") {
    next.requiereVisita = true;
  }
  const asked = job.kind === "electricidad" ? questionFor(job) : null;
  const electricKnown = fold([job.trabajo, ...job.answers, q].join(" "));
  if (job.kind === "electricidad") {
    const askedText = fold(asked?.text ?? "");
    if (askedText.includes("donde se encuentra")) {
      const place = detectElectricPlace(q);
      next.answers[next.answers.length - 1] = `Lugar: ${place ?? original}`;
    } else if (askedText.includes("conexion electrica") || askedText.includes("ya existe una conexion")) {
      if (hasAny(q, ["no estoy seguro"])) next.answers[next.answers.length - 1] = "Punto eléctrico existente: por confirmar";
      else if (hasAny(q, ["no hay punto", "no, no hay"])) next.answers[next.answers.length - 1] = "Punto eléctrico existente: No";
      else if (hasAny(q, ["si"])) next.answers[next.answers.length - 1] = "Punto eléctrico existente: Sí";
    } else if (askedText.includes("punto nuevo") || askedText.includes("reemplazar uno existente")) {
      if (hasAny(q, ["no estoy seguro"])) next.answers[next.answers.length - 1] = "Tipo de punto: por confirmar";
      else if (hasAny(q, ["punto nuevo", "nuevo"])) next.answers[next.answers.length - 1] = "Tipo de punto: nuevo";
      else if (hasAny(q, ["reemplazar", "existente"])) next.answers[next.answers.length - 1] = "Tipo de punto: reemplazo";
    }

    if (isElectricRisk(electricKnown) || (askedText.includes("senal de alarma") && hasAny(q, ["si", "olor", "ruido", "quemado", "calent", "chispa"]))) {
      next.riesgo = true;
      next.requiereVisita = true;
      next.trabajo = "Revisión eléctrica por seguridad";
      next.servicios = ["Revisión eléctrica"];
      next.step = 99;
      return next;
    }
    if (askedText.includes("senal de alarma") && hasAny(q, ["no estoy seguro"])) next.requiereVisita = true;
    if (askedText.includes("solamente en ese punto") && hasAny(q, ["varios", "no estoy seguro"])) next.requiereVisita = true;
    if (hasAny(q, ["no hay punto", "punto nuevo", "no estoy seguro si hay punto", "no estoy seguro si es nuevo"])) {
      next.requiereVisita = true;
    }
    const family = electricFamily(electricKnown);
    if (family === "apagon" || family === "mixto" || family === "otro") next.requiereVisita = true;
    return prefillElectric(next, original);
  }
  if (job.kind === "plomeria" && job.step === 0) {
    if (isPlomeriaFuga(q)) next.trabajo = "Fuga";
    else if (isPlomeriaInstalacion(q)) next.trabajo = "Instalación de plomería";
    else if (isPlomeriaDano(q)) next.trabajo = "Daño / avería";
  }
  if (job.kind === "plomeria" && isPlomeriaDano(fold([job.trabajo, ...job.answers, q].join(" "))) && hasAny(q, ["no sale agua", "pieza rota", "roto"])) {
    next.requiereVisita = true;
  }
  return next;
}

function questionFor(job: JobItem): Step | null {
  const steps = stepsOf(job.kind, job);
  return steps[job.step] ?? null;
}

function remodelSummary(job: JobItem) {
  const alcance = job.answers.find((a) => /^alcance:/i.test(a))?.replace(/^alcance:\s*/i, "");
  const cambios = job.answers.find((a) => /^cambios:/i.test(a))?.replace(/^cambios:\s*/i, "");
  const tamano = job.answers.find((a) => /^tamaño:/i.test(a))?.replace(/^tamaño:\s*/i, "");
  const objetivo = job.answers.find((a) => /^objetivo:/i.test(a))?.replace(/^objetivo:\s*/i, "");
  const instalaciones = job.answers.find((a) => /^instalaciones:/i.test(a))?.replace(/^instalaciones:\s*/i, "");
  const urgencia = job.answers.find((a) => /^urgencia:/i.test(a))?.replace(/^urgencia:\s*/i, "");
  return [
    `Proyecto: ${job.trabajo}`,
    alcance ? `Alcance: ${alcance}` : "",
    cambios ? `Trabajos previstos: ${cambios}` : "",
    tamano ? `Tamaño aproximado: ${tamano}` : "",
    objetivo ? `Objetivo: ${objetivo}` : "",
    instalaciones ? `Estado actual: ${instalaciones}` : "",
    urgencia ? `Cuándo: ${urgencia}` : "",
    "Cotización: se realiza por WhatsApp",
    "Requiere revisión: Sí. Tipo: proyecto.",
    job.especial ? "Nota: hay un cambio de distribución o estructura; se revisa al cotizar." : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function remodelLeadSentence(job: JobItem) {
  const cambios = job.answers.find((a) => /^cambios:/i.test(a))?.replace(/^cambios:\s*/i, "");
  const alcanceRaw = job.answers.find((a) => /^alcance:/i.test(a))?.replace(/^alcance:\s*/i, "") ?? "";
  const tamano = job.answers.find((a) => /^tamaño:/i.test(a))?.replace(/^tamaño:\s*/i, "") ?? "";
  const objetivo = job.answers.find((a) => /^objetivo:/i.test(a))?.replace(/^objetivo:\s*/i, "");
  const space = job.trabajo.replace(/^remodelación de /i, "").toLowerCase();
  const alcance = fold(alcanceRaw).includes("completa")
    ? "Remodelación completa"
    : fold(alcanceRaw).includes("parcial")
      ? "Remodelación parcial"
      : job.trabajo;
  const m2 = tamano.match(/(\d+(?:[.,]\d+)?)\s*m²/i);
  const size = m2 ? ` de aproximadamente ${m2[1]} m²` : "";
  const include = cambios ? ` Incluye ${cambios.toLowerCase()}.` : "";
  const goal = objetivo ? ` Objetivo: ${objetivo}.` : "";
  return `${alcance} de ${space}${size}.${include}${goal}`.replace(/\s+/g, " ").trim();
}

function remodelWhatsappText(job: JobItem, state: AssistantState) {
  const alcance = fold(job.answers.find((a) => /^alcance:/i.test(a)) ?? "");
  const cambios = job.answers.find((a) => /^cambios:/i.test(a))?.replace(/^cambios:\s*/i, "");
  const tamano = job.answers.find((a) => /^tamaño:/i.test(a))?.replace(/^tamaño:\s*/i, "") ?? "";
  const objetivo = job.answers.find((a) => /^objetivo:/i.test(a))?.replace(/^objetivo:\s*/i, "");
  const m2 = tamano.match(/(\d+(?:[.,]\d+)?)\s*m²/i);
  const sizeBit = m2 ? ` de aproximadamente ${m2[1]} m²` : tamano && !fold(tamano).includes("se revisa") ? ` (${tamano})` : "";
  const name = state.name ? `Hola, soy ${state.name}.` : "Hola ObraTech.";
  const zona = state.zona ? ` en ${state.zona}` : "";
  const verb = alcance.includes("completa") ? "remodelar completamente" : "remodelar";
  const space = job.trabajo.replace(/^remodelación de /i, "").toLowerCase();
  const changeBit = cambios ? ` Quiero cambiar ${cambios.toLowerCase()}.` : "";
  const goalBit = objetivo ? ` El objetivo es ${objetivo.toLowerCase()}.` : "";
  return `${name} Quiero ${verb} ${space}${sizeBit}${zona}.${changeBit}${goalBit} Hice la solicitud mediante el asesor de ObraTech y quisiera continuar con la cotización.`;
}

function paintSummary(job: JobItem) {
  const espacio = job.answers.find((a) => /^espacio:/i.test(a))?.replace(/^espacio:\s*/i, "") ?? job.trabajo.replace(/^pintura de /i, "");
  const area = job.answers.find((a) => /^área:/i.test(a) || /^area:/i.test(a))?.replace(/^(área|area):\s*/i, "");
  const estado = job.answers.find((a) => /^estado:/i.test(a))?.replace(/^estado:\s*/i, "");
  const humedad = job.answers.find((a) => /^humedad:/i.test(a))?.replace(/^humedad:\s*/i, "");
  const altura = job.answers.find((a) => /^altura:/i.test(a))?.replace(/^altura:\s*/i, "");
  const acceso = job.answers.find((a) => /^acceso:/i.test(a))?.replace(/^acceso:\s*/i, "");
  const services = job.servicios?.length ? job.servicios.join(", ") : "Pintura";
  const humedadNote =
    humedad && fold(humedad).includes("sigue")
      ? "Pintura + revisión por posible humedad. No afirmamos que pintar solucione la causa."
      : humedad
        ? `Humedad: ${humedad}`
        : "";
  return [
    `Servicio: ${services}`,
    `Espacio: ${espacio}`,
    area ? `Área aproximada: ${area}` : "",
    estado ? `Estado: ${estado}` : "",
    humedadNote,
    altura ? `Altura: ${altura}` : "",
    acceso ? `Acceso: ${acceso}` : "",
    job.requiereVisita || job.especial ? "Requiere revisión: Sí. Cotización por WhatsApp, sin precio automático." : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function paintLeadSentence(job: JobItem) {
  const espacio = (job.answers.find((a) => /^espacio:/i.test(a))?.replace(/^espacio:\s*/i, "") ?? job.trabajo.replace(/^pintura de /i, "")).toLowerCase();
  const area = job.answers.find((a) => /^área:/i.test(a) || /^area:/i.test(a))?.replace(/^(área|area):\s*/i, "");
  const estado = job.answers.find((a) => /^estado:/i.test(a))?.replace(/^estado:\s*/i, "");
  const size = area && !fold(area).includes("se revisa") ? `, aproximadamente ${area}` : "";
  const stateBit = estado && !fold(estado).includes("solo necesita") ? ` La superficie requiere ${estado}.` : "";
  return `Pintura de ${espacio}${size}.${stateBit}`.replace(/\s+/g, " ").trim();
}

function paintWhatsappText(job: JobItem, state: AssistantState) {
  const espacio = (job.answers.find((a) => /^espacio:/i.test(a))?.replace(/^espacio:\s*/i, "") ?? job.trabajo.replace(/^pintura de /i, "")).toLowerCase();
  const area = job.answers.find((a) => /^área:/i.test(a) || /^area:/i.test(a))?.replace(/^(área|area):\s*/i, "");
  const estado = job.answers.find((a) => /^estado:/i.test(a))?.replace(/^estado:\s*/i, "");
  const name = state.name ? `Hola, soy ${state.name}.` : "Hola ObraTech.";
  const zona = state.zona ? ` Estoy en ${state.zona}.` : "";
  const size = area && !fold(area).includes("se revisa") ? `, aproximadamente ${area}` : "";
  const stateBit = estado && !fold(estado).includes("solo necesita") ? ` La superficie requiere ${estado}.` : "";
  return `${name} Necesito pintar ${espacio} de mi vivienda${size}.${stateBit}${zona} Hice la solicitud mediante el asesor de ObraTech y quisiera continuar con la cotización.`;
}

function waterproofSummary(job: JobItem) {
  const zona = job.answers.find((a) => /^zona:/i.test(a))?.replace(/^zona:\s*/i, "") ?? job.trabajo.replace(/^impermeabilización de /i, "");
  const problema = job.answers.find((a) => /^problema:/i.test(a))?.replace(/^problema:\s*/i, "");
  const cuando = job.answers.find((a) => /^cuándo:/i.test(a) || /^cuando:/i.test(a))?.replace(/^(cuándo|cuando):\s*/i, "");
  const estado = job.answers.find((a) => /^estado:/i.test(a))?.replace(/^estado:\s*/i, "");
  const area = job.answers.find((a) => /^área:/i.test(a) || /^area:/i.test(a))?.replace(/^(área|area):\s*/i, "");
  const altura = job.answers.find((a) => /^altura:/i.test(a))?.replace(/^altura:\s*/i, "");
  const acceso = job.answers.find((a) => /^acceso:/i.test(a))?.replace(/^acceso:\s*/i, "");
  const problemaLine = [problema, cuando].filter(Boolean).join(" ");
  return [
    `Servicio: ${job.servicios?.length ? job.servicios.join(", ") : "Impermeabilización"}`,
    `Zona: ${zona}`,
    problemaLine ? `Problema: ${problemaLine}` : "",
    area ? `Área aproximada: ${area}` : "",
    estado ? `Estado: ${estado}` : "",
    altura ? `Acceso / altura: ${altura}` : "",
    acceso ? `Acceso: ${acceso}` : "",
    "Requiere revisión: Sí. Cotización por WhatsApp, sin precio automático. No afirmamos la causa de la humedad.",
    job.especial ? "Nota: hay una condición de altura o acceso; se revisa al cotizar." : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function waterproofLeadSentence(job: JobItem) {
  const zona = (job.answers.find((a) => /^zona:/i.test(a))?.replace(/^zona:\s*/i, "") ?? job.trabajo.replace(/^impermeabilización de /i, "")).toLowerCase();
  const problema = job.answers.find((a) => /^problema:/i.test(a))?.replace(/^problema:\s*/i, "");
  const cuando = job.answers.find((a) => /^cuándo:/i.test(a) || /^cuando:/i.test(a))?.replace(/^(cuándo|cuando):\s*/i, "");
  const estado = job.answers.find((a) => /^estado:/i.test(a))?.replace(/^estado:\s*/i, "");
  const area = job.answers.find((a) => /^área:/i.test(a) || /^area:/i.test(a))?.replace(/^(área|area):\s*/i, "");
  const size = area && !fold(area).includes("se revisa") ? ` de aproximadamente ${area}` : "";
  const issue = [problema, cuando].filter(Boolean).join(" ");
  const issueBit = issue ? ` Presenta ${issue.toLowerCase()}.` : "";
  const stateBit = estado && !fold(estado).includes("buen estado") ? ` Superficie: ${estado}.` : "";
  return `Impermeabilización de ${zona}${size}.${issueBit}${stateBit}`.replace(/\s+/g, " ").trim();
}

function waterproofWhatsappText(job: JobItem, state: AssistantState) {
  const zonaTrabajo = (job.answers.find((a) => /^zona:/i.test(a))?.replace(/^zona:\s*/i, "") ?? job.trabajo.replace(/^impermeabilización de /i, "")).toLowerCase();
  const problema = job.answers.find((a) => /^problema:/i.test(a))?.replace(/^problema:\s*/i, "");
  const cuando = job.answers.find((a) => /^cuándo:/i.test(a) || /^cuando:/i.test(a))?.replace(/^(cuándo|cuando):\s*/i, "");
  const estado = job.answers.find((a) => /^estado:/i.test(a))?.replace(/^estado:\s*/i, "");
  const area = job.answers.find((a) => /^área:/i.test(a) || /^area:/i.test(a))?.replace(/^(área|area):\s*/i, "");
  const name = state.name ? `Hola, soy ${state.name}.` : "Hola ObraTech.";
  const barrio = state.zona ? ` en ${state.zona}` : "";
  const size = area && !fold(area).includes("se revisa") ? ` de aproximadamente ${area}` : "";
  const issue = [problema, cuando].filter(Boolean).join(" ");
  const issueBit = issue ? ` Actualmente presenta ${issue.toLowerCase()}` : "";
  const cracks = estado && (fold(estado).includes("grieta") || fold(estado).includes("fisura")) ? " y algunas grietas en la superficie" : "";
  const end = issueBit || cracks ? "." : "";
  return `${name} Necesito impermeabilizar ${zonaTrabajo}${size}${barrio}.${issueBit}${cracks}${end} Hice la solicitud mediante el asesor de ObraTech y quisiera continuar con la cotización.`.replace(/\.\./g, ".");
}

function listNeeds(jobs: JobItem[]) {
  return jobs.map((job) => KIND_LABEL[job.kind].toLowerCase()).join(", ");
}

function summaryText(state: AssistantState) {
  const blocks = state.jobs.map((job) => {
    if (job.kind === "locativa") {
      const known = fold([job.trabajo, ...job.answers].join(" "));
      const problema = job.answers.find((a) => /^problema:/i.test(a))?.replace(/^problema:\s*/i, "");
      const ocurrido = job.answers.find((a) => /^qué ocurrió:/i.test(a));
      const humedadContinua = hasAny(known, ["humedad sigue", "sigue apareciendo"]) && !hasAny(known, ["ya no aparece"]);
      const estado = humedadContinua
        ? "El problema de humedad continúa"
        : hasAny(known, ["ya no aparece"])
          ? "La humedad ya no aparece"
          : "";
      return [
        `Servicio: ${job.servicios?.length ? job.servicios.join(", ") : "Reparación locativa"}`,
        `Elemento: ${job.trabajo}`,
        problema ? `Problema: ${problema}` : ocurrido ? ocurrido : "",
        estado ? `Estado: ${estado}` : "",
        job.requiereVisita || job.especial || job.riesgo
          ? "Requiere revisión: Sí. No afirmamos la causa; el equipo lo mira al cotizar."
          : "",
        job.especial ? "Nota: hay una condición especial (por ejemplo altura)." : "",
      ]
        .filter(Boolean)
        .join("\n");
    }
    if (job.kind === "remodelaciones") return remodelSummary(job);
    if (job.kind === "pintura") return paintSummary(job);
    if (job.kind === "impermeabilizacion") return waterproofSummary(job);
    const serviceLine = job.servicios?.length ? job.servicios.join(", ") : KIND_LABEL[job.kind];
    const details = job.answers.filter((a) => fold(a) !== fold(job.trabajo));
    const detailLine = details.length ? `\nDetalles: ${details.join(". ")}` : "";
    const riskNote =
      job.kind === "electricidad" && job.riesgo
        ? "\nNota: revisión prioritaria por seguridad. Sin diagnóstico ni cotización automática."
        : job.kind === "electricidad" && job.requiereVisita
          ? "\nNota: puede requerir revisión de la instalación. Sin precio automático."
          : "";
    return `Servicio: ${serviceLine}\nTrabajo: ${job.trabajo}${detailLine}${
      job.especial ? "\nNota: trabajo especial, requiere revisión de acceso. Sin precio automático." : ""
    }${riskNote    }${
      job.kind === "otro" ? "\nEstado: requiere revisión. No hace falta nombrar el oficio." : ""
    }`;
  });
  const zona = state.zona ? `\nZona: ${state.zona}` : "";
  const cover =
    state.cobertura === "review"
      ? "\nCobertura: por confirmar si es posible atender."
      : state.cobertura === "pending"
        ? "\nCobertura: zona por confirmar."
        : "";
  const multi =
    state.jobs.length > 1
      ? `\nDetectamos ${state.jobs.length} necesidades en tu hogar. El equipo puede revisar todos los trabajos en una sola solicitud.\n`
      : "";
  const heading = state.jobs.some((job) => job.kind === "remodelaciones")
    ? "Resumen de tu proyecto:"
    : "Resumen de tu solicitud:";
  const photoNote = state.jobs.some((job) => job.kind === "remodelaciones")
    ? "\nPara preparar mejor la cotización, podrás enviar fotografías directamente por WhatsApp."
    : "";
  return `${heading}\n\n${blocks.join("\n\n")}${zona}${cover}${multi}${photoNote}\n\n¿La información es correcta?`;
}

function whatsappCta(site: SiteContent, state: AssistantState): AssistantCta {
  const label = state.leadSaved ? "Continuar por WhatsApp" : "WhatsApp";
  if (!state.jobs.length) {
    return { label, href: whatsappUrl(site.whatsappNumber) };
  }

  const remodelJob = state.jobs.find((job) => job.kind === "remodelaciones");
  if (remodelJob && state.name) {
    const extras = state.jobs.filter((job) => job.kind !== "remodelaciones");
    const extraLine = extras.length
      ? ` También necesito: ${extras.map((job) => (job.servicios?.length ? job.servicios.join(", ") : job.trabajo)).join("; ")}.`
      : "";
    const text = remodelWhatsappText(remodelJob, state).replace(
      " Hice la solicitud",
      `${extraLine} Hice la solicitud`,
    );
    return { label, href: whatsappCustomUrl(site.whatsappNumber, text) };
  }

  const waterJob = state.jobs.find((job) => job.kind === "impermeabilizacion");
  if (waterJob && state.name) {
    const extras = state.jobs.filter((job) => job.kind !== "impermeabilizacion");
    const extraLine = extras.length
      ? ` También necesito: ${extras.map((job) => (job.servicios?.length ? job.servicios.join(", ") : job.trabajo)).join("; ")}.`
      : "";
    const text = waterproofWhatsappText(waterJob, state).replace(
      " Hice la solicitud",
      `${extraLine} Hice la solicitud`,
    );
    return { label, href: whatsappCustomUrl(site.whatsappNumber, text) };
  }

  const paintJob = state.jobs.find((job) => job.kind === "pintura");
  if (paintJob && state.name) {
    return { label, href: whatsappCustomUrl(site.whatsappNumber, paintWhatsappText(paintJob, state)) };
  }

  const onlyElectric = state.jobs.length === 1 && state.jobs[0].kind === "electricidad";
  if (onlyElectric && state.name) {
    const job = state.jobs[0];
    const lugar = job.answers.find((a) => /^lugar:/i.test(a))?.replace(/^lugar:\s*/i, "");
    const puntoSi = job.answers.some((a) => /punto eléctrico existente:\s*sí/i.test(a));
    const parts = [
      `Hola, soy ${state.name}. ${job.trabajo}${lugar ? ` en ${lugar.toLowerCase()}` : ""}${state.zona ? ` de mi vivienda en ${state.zona}` : ""}.`,
    ];
    if (puntoSi) parts.push("Ya existe el punto eléctrico donde se instalará.");
    if (job.riesgo) parts.push("El caso quedó marcado para revisión por seguridad. No se intentó un diagnóstico por el chat.");
    else if (job.requiereVisita) parts.push("El equipo debe revisar la instalación antes de cotizar.");
    parts.push("Realicé la solicitud mediante el asesor de ObraTech y quisiera continuar con la cotización.");
    if (state.phone) parts.push(`Celular: ${state.phone}.`);
    return { label, href: whatsappCustomUrl(site.whatsappNumber, parts.join(" ")) };
  }

  const needLine = state.jobs
    .map((job) => `${KIND_LABEL[job.kind]}${job.answers[0] ? ` (${job.answers[0]})` : ""}`)
    .join(", ");

  const lines = [
    state.name ? `Hola, soy ${state.name}.` : "Hola ObraTech.",
    `Necesito: ${needLine}${state.zona ? `. Estoy en ${state.zona}.` : "."}`,
    "",
    "El chat me indicó estos detalles:",
  ];

  state.jobs.forEach((job, index) => {
    lines.push(`${index + 1}. ${KIND_LABEL[job.kind]} — ${job.trabajo}`);
    job.answers.forEach((a) => lines.push(`   · ${a}`));
    if (job.especial) lines.push("   · Trabajo especial: revisar acceso antes de cotizar");
    if (job.riesgo) lines.push("   · Revisión prioritaria por seguridad");
  });

  if (state.phone) lines.push("", `Celular: ${state.phone}`);
  if (state.leadSaved) lines.push("La solicitud ya quedó registrada en el sistema.");
  lines.push("", "Quisiera continuar con la cotización.");

  return { label, href: whatsappCustomUrl(site.whatsappNumber, lines.join("\n")) };
}

function currentJob(state: AssistantState) {
  return state.jobs[state.current];
}

function allDetailed(state: AssistantState) {
  return state.jobs.length > 0 && state.jobs.every((job) => !jobOpen(job));
}

function snapshotOf(state: AssistantState): AssistantState {
  return {
    jobs: state.jobs.map((job) => ({
      ...job,
      answers: [...job.answers],
      servicios: job.servicios ? [...job.servicios] : undefined,
    })),
    current: state.current,
    zona: state.zona,
    cobertura: state.cobertura,
    confirmed: state.confirmed,
    listedMulti: state.listedMulti,
    listedUnknown: state.listedUnknown,
    name: state.name,
    phone: state.phone,
    leadSaved: state.leadSaved,
  };
}

function goBackState(state: AssistantState): AssistantState | undefined {
  const history = state.history ?? [];
  if (!history.length) return undefined;
  const last = history[history.length - 1];
  return { ...snapshotOf(last), history: history.slice(0, -1) };
}

function isBackIntent(q: string, state: AssistantState) {
  if (q === "atras" || q === "volver" || q.endsWith(" atras")) return true;
  if (hasAny(q, ["volver atras", "quiero volver atras", "me equivoque", "paso anterior", "quiero editar el resumen"])) {
    return true;
  }
  if (!state.confirmed && allDetailed(state) && state.zona && hasAny(q, ["editar", "corregir", "no es"])) return true;
  return false;
}

export function assistantCanGoBack(state: AssistantState) {
  return Boolean(state.history?.length) && !state.leadSaved;
}

const BACK_CHIP: AssistantChip = { label: "Atrás", message: "Quiero volver atrás" };

function withBackChip(state: AssistantState, chips: AssistantChip[]): AssistantChip[] {
  if (!assistantCanGoBack(state)) return chips;
  if (chips.some((chip) => fold(chip.label) === "atras")) return chips;
  return [...chips, BACK_CHIP];
}

function funnelChips(state: AssistantState): AssistantChip[] {
  if (!state.jobs.length) {
    if (state.listedUnknown) return withBackChip(state, []);
    if (state.listedMulti) {
      return withBackChip(
        state,
        START_CHIPS.filter((chip) => !chip.label.toLowerCase().includes("varias")),
      );
    }
    return withBackChip(state, START_CHIPS);
  }
  const job = currentJob(state);
  if (job && jobOpen(job)) return withBackChip(state, questionFor(job)?.chips ?? []);
  if (!state.zona) return withBackChip(state, ZONA_CHIPS);
  if (!state.confirmed) {
    return withBackChip(state, [
      { label: "Sí, es correcto", message: "Sí, el resumen es correcto" },
      { label: "Editar", message: "Quiero volver atrás" },
    ]);
  }
  if (!state.name || !state.phone) {
    return withBackChip(state, [{ label: "Ejemplo", message: "Laura 3001234567" }]);
  }
  return [{ label: "Otra solicitud", message: "Empezar de nuevo" }];
}

function isPriceAsk(q: string) {
  if (hasAny(q, ["cuanto mide", "cuantos metro", "cuantas habitacion", "cuantas", "cuantos"])) return false;
  return hasAny(q, [
    "precio",
    "cuesta",
    "cotiz",
    "cuanto cuesta",
    "cuanto vale",
    "cuanto sale",
    "cuanto cobran",
    "que valor",
  ]);
}

function priceOnly(q: string) {
  if (!isPriceAsk(q)) return false;
  let rest = ` ${q} `;
  for (const phrase of [
    "cuanto cuesta",
    "cuanto vale",
    "cuanto sale",
    "cuanto cobran",
    "que valor",
    "cotizacion",
    "cotizar",
    "cotiz",
    "precios",
    "precio",
    "cuestan",
    "cuesta",
  ]) {
    rest = rest.split(phrase).join(" ");
  }
  return rest.replace(/\s+/g, " ").trim().length < 12;
}

function isClosingRemark(q: string) {
  const fillers = new Set([
    "gracias",
    "muchas",
    "ok",
    "vale",
    "listo",
    "perfecto",
    "bueno",
    "dale",
    "entendido",
    "de",
    "acuerdo",
  ]);
  const words = q.split(" ").filter(Boolean);
  return words.length > 0 && words.length <= 4 && words.every((word) => fillers.has(word));
}

function reply(text: string, site: SiteContent, state: AssistantState): AssistantReply {
  const ctas = [whatsappCta(site, state)];
  return { text, state, chips: funnelChips(state), ctas };
}

export function answerLocally(
  question: string,
  site: SiteContent,
  previous: AssistantState = { jobs: [], current: 0 },
): AssistantReply {
  const q = fold(question);
  const original = question.replace(/\s+/g, " ").trim().slice(0, 400);

  if (hasAny(q, ["empezar de nuevo", "otra solicitud", "reiniciar"])) {
    return reply(WELCOME, site, { jobs: [], current: 0 });
  }

  if (isBackIntent(q, previous)) {
    const restored = goBackState(previous);
    if (!restored) {
      return reply("Aún no hay un paso anterior. Elige una opción o escribe el problema.", site, previous);
    }
    return nextStep(site, restored, "Listo, volvemos al paso anterior.\n\n");
  }

  if (q.length < 2) {
    return reply("Cuéntame el problema en una frase. También puedes elegir una opción.", site, previous);
  }

  if (previous.leadSaved && !isClosingRemark(q) && !priceOnly(q)) {
    const detected = detectJobs(q, original);
    if (chipKind(q) || detected.length) {
      return answerLocally(question, site, { jobs: [], current: 0 });
    }
  }

  const state: AssistantState = {
    jobs: previous.jobs.map((job) => ({
      ...job,
      answers: [...job.answers],
      servicios: job.servicios ? [...job.servicios] : undefined,
    })),
    current: previous.current ?? 0,
    zona: previous.zona,
    cobertura: previous.cobertura,
    confirmed: previous.confirmed,
    listedMulti: previous.listedMulti,
    listedUnknown: previous.listedUnknown,
    name: previous.name,
    phone: previous.phone,
    leadSaved: previous.leadSaved,
    history: [...(previous.history ?? []), snapshotOf(previous)].slice(-20),
  };

  const job = currentJob(state);
  const answeringJob = Boolean(job && jobOpen(job) && !state.confirmed);

  const fuera = detectFueraCobertura(q);
  if (fuera && !answeringJob) {
    state.zona = fuera;
    state.cobertura = "review";
    if (allDetailed(state) && state.jobs.length) {
      return reply(`${ZONA_REVISION_MSG}\n\n${summaryText(state)}`, site, state);
    }
    return reply(ZONA_REVISION_MSG, site, state);
  }

  const zona = detectZona(q, site);
  const onlyPlace =
    Boolean(zona) &&
    q.split(" ").length <= 4 &&
    !hasAny(q, ["mueble", "llave", "fuga", "pint", "lampara", "cortina", "humedad", "estuco"]);
  if (zona && (!answeringJob || onlyPlace)) {
    state.zona = zona;
    if (zona.includes("por confirmar")) {
      state.cobertura = "pending";
    } else if (state.cobertura !== "review") {
      state.cobertura = "ok";
    }
    if (answeringJob && onlyPlace) {
      return nextStep(site, state);
    }
  }

  if (hasAny(q, ["hola", "buenas", "buenos dias", "buenas tardes"]) && q.split(" ").length <= 4 && !state.jobs.length) {
    return reply(WELCOME, site, state);
  }

  if (hasAny(q, ["no se que necesito"])) {
    state.listedUnknown = true;
    if (!state.jobs.length && original.length < 40) {
      return reply(
        "No hay problema. Cuéntame un poco más. ¿Qué ves o qué está fallando en el hogar?",
        site,
        state,
      );
    }
  }

  if (hasAny(q, ["varias cosas", "varios pendientes", "arreglar varias"])) {
    state.listedMulti = true;
    const detected = detectJobs(q, original);
    if (detected.length) {
      state.jobs = detected;
      state.current = 0;
    } else if (!state.jobs.length) {
      return reply("Claro. Cuéntame todo de una vez, aunque sean trabajos diferentes.", site, state);
    }
  }

  if (job && jobOpen(job) && !state.confirmed && priceOnly(q)) {
    const ask = questionFor(job);
    return reply(
      `Aquí no hay precios automáticos. El equipo cotiza por WhatsApp.\n\n${ask?.text ?? "Seguimos con la misma pregunta."}`,
      site,
      previous,
    );
  }

  if (job && jobOpen(job) && !state.confirmed) {
    if (!(zona && q.split(" ").length <= 3 && !hasAny(q, ["mueble", "llave", "fuga", "pint", "metro"]))) {
      const answered = applyAnswer(job, q, original);
      state.jobs[state.current] = answered;
      const pending = state.jobs.findIndex((item) => jobOpen(item));
      state.current = pending >= 0 ? pending : state.current;
      const updated = state.jobs[state.current];
      if (updated?.especial && !jobOpen(updated) && !state.zona) {
        return reply(
          "Por las características del trabajo, necesitaremos revisar las condiciones de acceso antes de definir la cotización. ¿En qué barrio o municipio está el inmueble?",
          site,
          state,
        );
      }
      const priceNote =
        isPriceAsk(q) && !priceOnly(q)
          ? "El valor se cotiza por WhatsApp, sin precio automático.\n\n"
          : "";
      const notice =
        answered.kind === "electricidad"
          ? noticeAfterElectric(answered, original)
          : answered.kind === "locativa"
            ? noticeAfterRepair(answered, original)
            : answered.kind === "remodelaciones"
              ? noticeAfterRemodel(original)
              : answered.kind === "pintura"
                ? noticeAfterPaint(original)
                : answered.kind === "impermeabilizacion"
                  ? noticeAfterWaterproof(original)
                  : "";
      return nextStep(site, state, priceNote + notice);
    }
  }

  if (state.jobs.length && allDetailed(state) && state.zona && !state.confirmed) {
    if (hasAny(q, ["es correcto", "si el resumen", "correcto", "confirmo"])) {
      state.confirmed = true;
      const remodel = state.jobs.some((item) => item.kind === "remodelaciones");
      const paint = state.jobs.some((item) => item.kind === "pintura");
      const water = state.jobs.some((item) => item.kind === "impermeabilizacion");
      return reply(
        remodel
          ? "Perfecto. Para que podamos revisar tu proyecto y preparar la cotización, indícanos tu nombre y celular."
          : paint || water
            ? "Perfecto. Para que podamos contactarte y preparar la cotización, indícanos tu nombre y celular."
            : "Perfecto. Para que podamos revisar la solicitud y contactarte, indícanos tu nombre y celular.",
        site,
        state,
      );
    }
  }

  if (state.confirmed && !state.leadSaved) {
    const contact = parseContact(original, state);
    if (contact.name) state.name = contact.name;
    if (contact.phone) state.phone = contact.phone;

    if (!state.name && !state.phone) {
      return reply("Necesito nombre y celular. Ejemplo: Laura 3001234567.", site, state);
    }
    if (!state.name) {
      return reply("Me falta el nombre.", site, state);
    }
    if (!state.phone || !validPhone(state.phone)) {
      return reply("Me falta un celular válido (10 dígitos, ej. 3001234567).", site, state);
    }

    return reply(
      `Perfecto, ${state.name}. Hemos recibido tu solicitud.`,
      site,
      state,
    );
  }

  if (hasAny(q, ["precio", "cuesta", "valor", "cotiz", "cuanto"])) {
    return reply(
      "Aquí no hay precios automáticos. Completamos el resumen y el equipo cotiza por WhatsApp.",
      site,
      state,
    );
  }

  const fromChip = chipKind(q);
  const detected = detectJobs(q, original);
  if (fromChip && !detected.length) {
    detected.push(newJob(fromChip, original));
  }
  if (state.listedUnknown && !detected.length && original.length >= 8) {
    detected.push(newJob("otro", original));
  }

  if (detected.length) {
    for (const item of detected) {
      if (!state.jobs.some((jobItem) => jobItem.kind === item.kind)) state.jobs.push(item);
    }
    if (detected.length > 1) state.listedMulti = true;
    state.current = state.jobs.findIndex((item) => jobOpen(item));
    if (state.current < 0) state.current = 0;
  }

  if (!state.jobs.length && original.length >= 10 && !zona) {
    state.jobs.push(newJob("otro", original));
  }

  const electricDoneRisk =
    state.jobs.some((item) => item.kind === "electricidad" && item.riesgo && !jobOpen(item)) &&
    !state.jobs.some((item) => jobOpen(item));
  const riskNotice = electricDoneRisk ? ELECTRIC_RISK_MSG + "\n\n" : "";
  return nextStep(site, state, riskNotice);
}

function nextStep(site: SiteContent, state: AssistantState, prefix = ""): AssistantReply {
  if (!state.jobs.length) {
    return reply(WELCOME, site, state);
  }

  const open = state.jobs.find((job) => jobOpen(job));
  if (open) {
    state.current = state.jobs.indexOf(open);
    const ask = questionFor(open);
    const pendingCount = state.jobs.filter((job) => jobOpen(job)).length;
    const intro =
      state.jobs.length > 1 && pendingCount === state.jobs.length
        ? `Detectamos ${state.jobs.length} necesidades: ${listNeeds(state.jobs)}. Vamos una por una.\n\n`
        : "";
    return reply(prefix + intro + (ask?.text ?? "Cuéntame un poco más de ese trabajo."), site, state);
  }

  if (!state.zona) {
    return reply(prefix + "¿En qué zona está el inmueble?", site, state);
  }

  if (!state.confirmed) {
    return reply(prefix + summaryText(state), site, state);
  }

  if (!state.name || !state.phone) {
    const remodel = state.jobs.some((item) => item.kind === "remodelaciones");
    const paint = state.jobs.some((item) => item.kind === "pintura");
    const water = state.jobs.some((item) => item.kind === "impermeabilizacion");
    return reply(
      remodel
        ? "Perfecto. Para que podamos revisar tu proyecto y preparar la cotización, indícanos tu nombre y celular."
        : paint || water
          ? "Perfecto. Para que podamos contactarte y preparar la cotización, indícanos tu nombre y celular."
          : "Perfecto. Para que podamos revisar la solicitud y contactarte, indícanos tu nombre y celular.",
      site,
      state,
    );
  }

  return reply(
    state.leadSaved
      ? "Tu solicitud quedó registrada. Puedes continuar la conversación por WhatsApp para coordinar la atención."
      : `Perfecto, ${state.name}. Hemos recibido tu solicitud.`,
    site,
    state,
  );
}
