/**
 * Simula al menos 100 clientes hablando con el asesor local.
 * Ejecutar: npx tsx scripts/chat-100-users.ts
 */
import {
  answerLocally,
  type AssistantKind,
  type AssistantReply,
  type AssistantState,
} from "../lib/assistant-local";
import type { SiteContent } from "../lib/site-store";

const site: SiteContent = {
  whatsappNumber: "573001112233",
  phoneDisplay: "300 111 2233",
  siteName: "ObraTech",
  heroImage: "",
  nosotrosImage: "",
  nosotrosFondo: "",
  badges: [],
  serviciosInicio: [],
  servicios: [],
  proyectos: [],
  testimonios: [],
  mostrarTestimonios: false,
  porqueNosotros: [],
  faq: [],
  zonas: [
    { nombre: "Bogotá", detalle: "Confirmamos barrio al coordinar" },
    { nombre: "Sabana", detalle: "Confirmamos municipio al coordinar" },
  ],
};

type Mode = "full" | "opener" | "script";

type Expect = {
  kinds?: AssistantKind[];
  kindsInclude?: AssistantKind[];
  kindsExclude?: AssistantKind[];
  jobCount?: number;
  riesgo?: boolean;
  especial?: boolean;
  visita?: boolean;
  cobertura?: "ok" | "review" | "pending";
  zonaIncludes?: string;
  zonaUnsetAfterOpener?: boolean;
  textIncludes?: string[];
  textExcludes?: string[];
  reachesContact?: boolean;
  canGoBack?: boolean;
};

type UserCase = {
  id: number;
  person: string;
  opener: string;
  script?: string[];
  zonaMessage?: string;
  mode?: Mode;
  expect: Expect;
  group: string;
};

type Fail = { id: number; person: string; opener: string; reason: string };

const SKIP_CHIP = /^(atrás|atras|editar|ejemplo)$/i;

function phoneFor(id: number) {
  return `3001${String(id).padStart(6, "0")}`;
}

function kindsOf(state: AssistantState) {
  return state.jobs.map((job) => job.kind);
}

function chipBy(chips: { label: string; message: string }[], pattern: RegExp) {
  return chips.find((chip) => pattern.test(chip.label) || pattern.test(chip.message));
}

function pickNext(reply: AssistantReply, user: UserCase): string | null {
  const state = reply.state;
  if (state.name && state.phone) return null;
  if (state.confirmed) return `${user.person} ${phoneFor(user.id)}`;

  const chips = (reply.chips ?? []).filter((chip) => !SKIP_CHIP.test(chip.label));
  const confirm = chips.find((chip) => /correcto/i.test(chip.label));
  if (confirm) return confirm.message;

  const asksZona =
    !state.zona &&
    (/zona|barrio|municipio|inmueble/i.test(reply.text) ||
      chips.some((chip) => /bogot|sabana|otra zona/i.test(chip.label)));
  if (asksZona) return user.zonaMessage ?? "Estoy en Suba";

  const said = `${user.opener} ${(user.script ?? []).join(" ")}`.toLowerCase();

  if (/sigue apareciendo|humedad sigue/i.test(reply.text) && /sigue apareciendo|sigue saliendo/i.test(said)) {
    const yes = chipBy(chips, /sí|si,|sigue apareciendo/i);
    if (yes) return yes.message;
  }

  if (/altura/i.test(reply.text)) {
    const meters = said.match(/(\d+)\s*metros/);
    if (meters) {
      const n = Number(meters[1]);
      const height =
        n >= 10
          ? chipBy(chips, /más de 10|mas de 10/i)
          : n >= 6
            ? chipBy(chips, /6 a 10|6 y 10/i)
            : n >= 3
              ? chipBy(chips, /3 a 6|3 y 6|hasta 5/i)
              : chipBy(chips, /menos de 3|planta baja/i);
      if (height) return height.message;
    }
  }

  const asksRisk = /peligro|chispa/i.test(reply.text);
  if (asksRisk) {
    const no = chips.find((chip) => /^(no|no sé|no se)/i.test(chip.label) || /no hay/i.test(chip.label));
    if (no) return no.message;
  }

  const prefer = chips.find((chip) => /no s[eé]|est[aá] bien|solo necesita|interior|superficie normal/i.test(chip.label));
  if (prefer) return prefer.message;
  if (chips.length) return chips[0].message;
  if (/nombre|celular/i.test(reply.text)) return `${user.person} ${phoneFor(user.id)}`;
  return "No sé";
}

function play(user: UserCase) {
  let reply = answerLocally(user.opener, site);
  const opener = reply;
  const transcript = [user.opener];
  const mode = user.mode ?? "full";
  const extra = user.script ?? [];

  for (const message of extra) {
    transcript.push(message);
    reply = answerLocally(message, site, reply.state);
  }

  if (mode === "full") {
    for (let i = 0; i < 28; i++) {
      const next = pickNext(reply, user);
      if (!next) break;
      transcript.push(next);
      reply = answerLocally(next, site, reply.state);
      if (reply.state.name && reply.state.phone) break;
    }
  }

  return { opener, reply, transcript };
}

function check(user: UserCase, opener: AssistantReply, final: AssistantReply): string[] {
  const reasons: string[] = [];
  const target = user.mode === "opener" ? opener.state : final.state;
  const got = kindsOf(target);
  const exp = user.expect;

  if (exp.kinds && JSON.stringify(got) !== JSON.stringify(exp.kinds)) {
    reasons.push(`kinds: esperado [${exp.kinds.join(", ")}], obtuvo [${got.join(", ") || "ninguno"}]`);
  }
  if (exp.kindsInclude) {
    for (const kind of exp.kindsInclude) {
      if (!got.includes(kind)) reasons.push(`falta kind ${kind} (obtuvo [${got.join(", ") || "ninguno"}])`);
    }
  }
  if (exp.kindsExclude) {
    for (const kind of exp.kindsExclude) {
      if (got.includes(kind)) reasons.push(`no debía ser ${kind} (obtuvo [${got.join(", ")}])`);
    }
  }
  if (exp.jobCount !== undefined && target.jobs.length !== exp.jobCount) {
    reasons.push(`jobs: esperado ${exp.jobCount}, obtuvo ${target.jobs.length}`);
  }
  if (exp.riesgo !== undefined) {
    const riesgo = target.jobs.some((job) => job.riesgo);
    if (riesgo !== exp.riesgo) reasons.push(`riesgo: esperado ${exp.riesgo}, obtuvo ${riesgo}`);
  }
  if (exp.especial !== undefined) {
    const especial = target.jobs.some((job) => job.especial);
    if (especial !== exp.especial) reasons.push(`especial: esperado ${exp.especial}, obtuvo ${especial}`);
  }
  if (exp.visita !== undefined) {
    const visita = target.jobs.some((job) => job.requiereVisita);
    if (visita !== exp.visita) reasons.push(`visita: esperado ${exp.visita}, obtuvo ${visita}`);
  }
  if (exp.cobertura && target.cobertura !== exp.cobertura) {
    reasons.push(`cobertura: esperado ${exp.cobertura}, obtuvo ${target.cobertura ?? "vacío"}`);
  }
  if (exp.zonaIncludes && !(target.zona ?? "").toLowerCase().includes(exp.zonaIncludes.toLowerCase())) {
    reasons.push(`zona: esperado incluir "${exp.zonaIncludes}", obtuvo "${target.zona ?? "vacío"}"`);
  }
  if (exp.zonaUnsetAfterOpener && opener.state.zona) {
    reasons.push(`zona no debía asignarse en el primer mensaje, obtuvo "${opener.state.zona}"`);
  }
  const text = (user.mode === "opener" ? opener.text : final.text).toLowerCase();
  for (const needle of exp.textIncludes ?? []) {
    if (!text.includes(needle.toLowerCase())) reasons.push(`texto debía incluir "${needle}"`);
  }
  for (const needle of exp.textExcludes ?? []) {
    if (text.includes(needle.toLowerCase())) reasons.push(`texto no debía incluir "${needle}"`);
  }
  if (exp.reachesContact && !(final.state.name && final.state.phone)) {
    reasons.push("no llegó a nombre y celular");
  }
  if (exp.canGoBack && !(final.state.history && final.state.history.length > 0)) {
    reasons.push("se esperaba historial para ir atrás");
  }
  return reasons;
}

const NAMES = [
  "Laura", "Camilo", "Valentina", "Andrés", "Mariana", "Santiago", "Daniela", "Juan", "Carolina", "Felipe",
  "Natalia", "Diego", "Paola", "Sebastián", "Andrea", "Mateo", "Catalina", "Julián", "Sofía", "Nicolás",
  "Alejandra", "David", "Camila", "Tomás", "Isabella", "Miguel", "Juliana", "Esteban", "Gabriela", "Samuel",
  "Manuela", "Daniel", "Sara", "Carlos", "Lucía", "Alejandro", "Elena", "Pedro", "Ana", "Ricardo",
  "Diana", "Óscar", "Paula", "Iván", "Mónica", "Jorge", "Claudia", "Fernando", "Patricia", "Héctor",
];

const users: UserCase[] = [];

function add(group: string, person: string, opener: string, expect: Expect, extra?: Partial<UserCase>) {
  users.push({
    id: users.length + 1,
    person,
    opener,
    expect,
    group,
    zonaMessage: extra?.zonaMessage ?? "Estoy en Suba",
    mode: extra?.mode,
    script: extra?.script,
  });
}

function nameAt() {
  return NAMES[users.length % NAMES.length];
}

// --- Golden paths ---
add("pintura", "Laura", "Quiero pintar", { kinds: ["pintura"], reachesContact: true });
add("pintura", "Camilo", "Quiero pintar la habitación", { kindsInclude: ["pintura"], kindsExclude: ["locativa"], reachesContact: true });
add("pintura", "Valentina", "Necesito pintar la sala, unos 20 m2", { kindsInclude: ["pintura"], reachesContact: true });
add("pintura", "Andrés", "Quiero pintar el apartamento", { kindsInclude: ["pintura"], reachesContact: true });
add("pintura", "Mariana", "Quiero pintar el techo de la habitación", { kindsInclude: ["pintura"], reachesContact: true });
add("pintura", "Santiago", "Quiero pintar la fachada", { kindsInclude: ["pintura"], kindsExclude: ["fachadas"], reachesContact: true });
add("pintura", "Daniela", "Pintar la culata del edificio", { kindsInclude: ["pintura"], kindsExclude: ["fachadas"] }, { mode: "opener" });
add("pintura", "Juan", "Quiero pintar puertas y rejas", { kindsInclude: ["pintura"], reachesContact: true });
add("pintura", "Carolina", "Quiero pintar pero la pared tiene humedad", { kindsInclude: ["pintura"], kindsExclude: ["locativa"], reachesContact: true });
add("pintura", "Felipe", "Pintar habitación con grietas", { kindsInclude: ["pintura"], reachesContact: true });

add("plomeria", "Natalia", "Tengo un problema de plomería", { kinds: ["plomeria"], reachesContact: true });
add("plomeria", "Diego", "Hay una fuga en el baño", { kindsInclude: ["plomeria"], kindsExclude: ["remodelaciones"], reachesContact: true });
add("plomeria", "Paola", "El sanitario no baja", { kindsInclude: ["plomeria"], reachesContact: true });
add("plomeria", "Sebastián", "Gotea la llave de la cocina", { kindsInclude: ["plomeria"], reachesContact: true });
add("plomeria", "Andrea", "El lavamanos está tapado", { kindsInclude: ["plomeria"], reachesContact: true });
add("plomeria", "Mateo", "Se dañó la ducha", { kindsInclude: ["plomeria"], reachesContact: true });
add("plomeria", "Catalina", "Hay un goteo en el sifón", { kindsInclude: ["plomeria"], reachesContact: true });
add("plomeria", "Julián", "Necesito cambiar la grifería del lavaplato", { kindsInclude: ["plomeria"], reachesContact: true });

add("electricidad", "Sofía", "Tengo un problema eléctrico", { kinds: ["electricidad"], riesgo: false, reachesContact: true });
add("electricidad", "Nicolás", "Quiero instalar una lámpara en la sala", { kindsInclude: ["electricidad"], kindsExclude: ["instalaciones"], riesgo: false, reachesContact: true });
add("electricidad", "Alejandra", "Cambiar el bombillo del techo", { kindsInclude: ["electricidad"], riesgo: false, reachesContact: true });
add("electricidad", "David", "El interruptor de la habitación no funciona", { kindsInclude: ["electricidad"], riesgo: false, reachesContact: true });
add("electricidad", "Camila", "Necesito otro tomacorriente en la cocina", { kindsInclude: ["electricidad"], riesgo: false, reachesContact: true });
add("electricidad", "Tomás", "Instalar un ventilador de techo", { kindsInclude: ["electricidad"], riesgo: false, reachesContact: true });
add("electricidad", "Isabella", "Se fue la luz de toda la casa", { kindsInclude: ["electricidad"], visita: true, reachesContact: true });

add("riesgo", "Miguel", "Hay chispas en el tomacorriente", { kindsInclude: ["electricidad"], riesgo: true, visita: true, reachesContact: true });
add("riesgo", "Juliana", "Huele a quemado cerca del breaker", { kindsInclude: ["electricidad"], riesgo: true, reachesContact: true });
add("riesgo", "Esteban", "Hay un cortocircuito en la cocina", { kindsInclude: ["electricidad"], riesgo: true, reachesContact: true });
add("riesgo", "Gabriela", "Salen chispas y humo del enchufe", { kindsInclude: ["electricidad"], riesgo: true, reachesContact: true });
add("riesgo", "Samuel", "Los cables están pelados", { kindsInclude: ["electricidad"], riesgo: true }, { mode: "opener" });

add("falso-positivo", "Manuela", "El pasillo es corto", { kindsExclude: ["electricidad"], riesgo: false }, { mode: "opener" });
add("falso-positivo", "Daniel", "Necesito un tubo corto para el mueble", { kindsExclude: ["electricidad"], riesgo: false }, { mode: "opener" });
add("falso-positivo", "Sara", "Quiero cortinas en la sala", { kinds: ["instalaciones"], kindsExclude: ["electricidad"], riesgo: false, reachesContact: true });
add("falso-positivo", "Carlos", "Quiero pintar una pared norte", { kindsInclude: ["pintura"], zonaUnsetAfterOpener: true }, { mode: "opener" });
add("falso-positivo", "Lucía", "Hay humedad en la pared norte del patio", { zonaUnsetAfterOpener: true }, { mode: "opener" });
add("falso-positivo", "Alejandro", "El calor de la cocina es fuerte", { kindsExclude: ["electricidad"], riesgo: false }, { mode: "opener" });

add("locativa", "Elena", "Necesito reparar algo en la casa", { kinds: ["locativa"], reachesContact: true });
add("locativa", "Pedro", "Se dañó la puerta de la habitación", { kindsInclude: ["locativa"], reachesContact: true });
add("locativa", "Ana", "La pared tiene el pañete suelto", { kindsInclude: ["locativa"], reachesContact: true });
add("locativa", "Ricardo", "Hay que resanar el techo", { kindsInclude: ["locativa"], reachesContact: true });
add("locativa", "Diana", "Se despegó el enchape del piso", { kindsInclude: ["locativa"], reachesContact: true });
add("locativa", "Óscar", "El mueble de la cocina está dañado", { kindsInclude: ["locativa"], reachesContact: true });
add("locativa", "Paula", "Tengo humedad en la pared y sigue apareciendo", { kindsInclude: ["locativa"], visita: true, reachesContact: true });
add("locativa", "Iván", "Se quebró el drywall del techo", { kindsInclude: ["locativa"], reachesContact: true });
add("locativa", "Mónica", "Necesito reparar la pared y también la puerta", { kindsInclude: ["locativa"], jobCount: 1, reachesContact: true });

add("remodelar", "Jorge", "Quiero remodelar", { kinds: ["remodelaciones"], visita: true, reachesContact: true });
add("remodelar", "Claudia", "Quiero remodelar el baño", { kindsInclude: ["remodelaciones"], visita: true, reachesContact: true });
add("remodelar", "Fernando", "Quiero reformar la cocina", { kindsInclude: ["remodelaciones"], visita: true, reachesContact: true });
add("remodelar", "Patricia", "Voy a renovar el apartamento", { kindsInclude: ["remodelaciones"], visita: true, reachesContact: true });
add("remodelar", "Héctor", "Quiero remodelar cocina y baño", { kindsInclude: ["remodelaciones"], jobCount: 1, visita: true, reachesContact: true });

add("instalaciones", "Laura", "Quiero instalar algo", { kinds: ["instalaciones"], reachesContact: true });
add("instalaciones", "Camilo", "Instalar un espejo en el baño", { kindsInclude: ["instalaciones"], reachesContact: true });
add("instalaciones", "Valentina", "Necesito colgar un cuadro", { kindsInclude: ["instalaciones"], reachesContact: true });
add("instalaciones", "Andrés", "Instalar una repisa en la sala", { kindsInclude: ["instalaciones"], reachesContact: true });
add("instalaciones", "Mariana", "Soporte de TV en la habitación", { kindsInclude: ["instalaciones"], reachesContact: true });
add("instalaciones", "Santiago", "Instalar persianas", { kindsInclude: ["instalaciones"], reachesContact: true });

add("multi", "Daniela", "Quiero pintar y también hay una fuga en el baño", { kindsInclude: ["pintura", "plomeria"], reachesContact: true });
add("multi", "Juan", "Tengo varias cosas pendientes en el apartamento", { textIncludes: ["todo de una vez"] }, { mode: "script", script: [] });
add("multi", "Carolina", "Quiero pintar y cambiar las lámparas", { kindsInclude: ["pintura", "electricidad"], reachesContact: true });
add("multi", "Felipe", "Remodelar el baño y pintar la habitación", { kindsInclude: ["remodelaciones", "pintura"], jobCount: 2, reachesContact: true });

add("cobertura", "Natalia", "Quiero pintar", { kindsInclude: ["pintura"], cobertura: "ok", zonaIncludes: "Suba", reachesContact: true }, { zonaMessage: "Estoy en Suba" });
add("cobertura", "Diego", "Quiero pintar", { kindsInclude: ["pintura"], cobertura: "ok", zonaIncludes: "Cedritos", reachesContact: true }, { zonaMessage: "Estoy en Cedritos" });
add("cobertura", "Paola", "Quiero pintar", { kindsInclude: ["pintura"], cobertura: "ok", zonaIncludes: "Chía", reachesContact: true }, { zonaMessage: "Estoy en Chía" });
add("cobertura", "Sebastián", "Quiero pintar", { kindsInclude: ["pintura"], cobertura: "review", reachesContact: true }, { zonaMessage: "Estoy en Kennedy" });
add("cobertura", "Andrea", "Quiero pintar", { kindsInclude: ["pintura"], cobertura: "review", reachesContact: true }, { zonaMessage: "Estoy en Bosa" });
add("cobertura", "Mateo", "Quiero pintar", { kindsInclude: ["pintura"], cobertura: "review", reachesContact: true }, { zonaMessage: "Estoy en Soacha" });
add("cobertura", "Catalina", "Quiero pintar", { kindsInclude: ["pintura"], cobertura: "pending", reachesContact: true }, { zonaMessage: "Estoy en Engativá" });

add("flujo", "Julián", "Hola", { textIncludes: ["hogar"] }, { mode: "opener" });
add("flujo", "Sofía", "¿Cuánto cuesta pintar?", { textIncludes: ["precios automáticos"] }, { mode: "opener" });
add("flujo", "Nicolás", "No sé qué necesito", { textIncludes: ["qué ves"] }, { mode: "opener" });
add("flujo", "Alejandra", "Quiero pintar", { kinds: ["pintura"], canGoBack: true }, { mode: "script", script: ["Una habitación", "Quiero volver atrás"] });
add("flujo", "David", "Necesito reparar algo en la casa", { kinds: ["locativa"] }, { mode: "script", script: ["Pared o techo", "me equivoqué"] });
add("flujo", "Camila", "Buenos días", { textIncludes: ["hogar"] }, { mode: "opener" });
add("flujo", "Tomás", "Empezar de nuevo", { textIncludes: ["hogar"], kinds: [] }, { mode: "opener" });

add("fachadas", "Juliana", "Pintar fachada de 8 metros de altura", { kindsInclude: ["pintura"], especial: true, reachesContact: true });
add("impermeabil", "Isabella", "Hay que impermeabilizar la cubierta", { kindsInclude: ["impermeabilizacion"], kindsExclude: ["fachadas", "pintura"], visita: true, reachesContact: true });
add("impermeabil", "Miguel", "La jardinera se filtra", { kindsInclude: ["impermeabilizacion"], kindsExclude: ["fachadas", "pintura"], visita: true, reachesContact: true });
add("impermeabil", "Helena", "Quiero impermeabilizar y luego pintar la terraza", { kindsInclude: ["impermeabilizacion", "pintura"], jobCount: 2, reachesContact: true });

add("humedad", "Esteban", "Tengo una gotera en el techo", { kindsInclude: ["impermeabilizacion"], kindsExclude: ["plomeria", "fachadas"], reachesContact: true });
add("humedad", "Gabriela", "Se filtra agua por la pared", { kindsInclude: ["impermeabilizacion"], kindsExclude: ["plomeria"], reachesContact: true });
add("humedad", "Samuel", "Hay moho en la pared del baño", { kindsExclude: ["electricidad"], jobCount: 1 }, { mode: "opener" });

add("messy", "Manuela", "se me daño la llave del lavamanos y gotea mucho", { kindsInclude: ["plomeria"], reachesContact: true });
add("messy", "Daniel", "no enciende la lampara de la alcoba", { kindsInclude: ["electricidad"], riesgo: false, reachesContact: true });
add("messy", "Sara", "quiero pintar el cuarto de mi hijo, no se los metros", { kindsInclude: ["pintura"], reachesContact: true });
add("messy", "Carlos", "el inodoro se tapa cada rato", { kindsInclude: ["plomeria"], reachesContact: true });
add("messy", "Lucía", "necesito cambiar 3 lamparas de la sala", { kindsInclude: ["electricidad"], riesgo: false, reachesContact: true });
add("messy", "Alejandro", "hay que arreglar la puerta que no cierra", { kindsInclude: ["locativa"], reachesContact: true });
add("messy", "Elena", "remodelar el baño que está viejo, cambiar piso y grifería", { kindsInclude: ["remodelaciones"], visita: true, reachesContact: true });
add("messy", "Pedro", "instalar cortinas roller en dos ventanas", { kindsInclude: ["instalaciones"], reachesContact: true });
add("messy", "Ana", "pintar el exterior del patio", { kindsInclude: ["pintura"], reachesContact: true });
add("messy", "Ricardo", "hay una mancha de humedad y quiero pintar encima", { kindsInclude: ["pintura"], reachesContact: true });
add("messy", "Diana", "se van los tapones cuando prendo la ducha eléctrica", { kindsInclude: ["electricidad"], riesgo: true }, { mode: "opener" });
add("messy", "Óscar", "quiero un punto nuevo para la nevera", { kindsInclude: ["electricidad"], reachesContact: true });
add("messy", "Paula", "el piso de la cocina se levantó", { kindsInclude: ["locativa"], reachesContact: true });
add("messy", "Iván", "necesito estuco en una pared antes de pintar", { kindsInclude: ["pintura"], kindsExclude: ["electricidad"] }, { mode: "opener" });
add("messy", "Mónica", "hay trabajo en altura en la fachada", { kindsInclude: ["pintura"], kindsExclude: ["plomeria"] }, { mode: "opener" });

add("zona-barrio", "Jorge", "Quiero pintar", { kindsInclude: ["pintura"], zonaIncludes: "Usaquén", cobertura: "ok", reachesContact: true }, { zonaMessage: "Estoy en Usaquén" });
add("zona-barrio", "Claudia", "Quiero pintar", { kindsInclude: ["pintura"], zonaIncludes: "Chapinero", reachesContact: true }, { zonaMessage: "Estoy en Chapinero" });
add("zona-barrio", "Fernando", "Quiero pintar", { kindsInclude: ["pintura"], zonaIncludes: "Cota", reachesContact: true }, { zonaMessage: "Estoy en Cota" });
add("zona-barrio", "Patricia", "Quiero pintar", { kindsInclude: ["pintura"], cobertura: "review", reachesContact: true }, { zonaMessage: "Estoy en Usme" });
add("zona-barrio", "Héctor", "Quiero pintar", { kindsInclude: ["pintura"], cobertura: "pending", reachesContact: true }, { zonaMessage: "Estoy en Fontibón" });

// Casos generados para completar el mínimo. Si los escritos a mano ya lo
// alcanzan, estos bucles no agregan nada.
const TARGET = 100;

const paintRooms = ["la habitación", "la sala", "el estudio", "el pasillo"];
for (const room of paintRooms) {
  if (users.length >= TARGET) break;
  add(
    "pintura-gen",
    nameAt(),
    `Quiero pintar ${room}`,
    { kindsInclude: ["pintura"], kindsExclude: ["locativa", "electricidad"], reachesContact: true },
    { zonaMessage: users.length % 2 === 0 ? "Estoy en Suba" : "Estoy en Cedritos" },
  );
}

while (users.length < TARGET) {
  const i = users.length;
  add(
    "plomeria-gen",
    nameAt(),
    i % 2 === 0 ? "Gotea el lavaplato" : "Hay una fuga en la ducha",
    { kindsInclude: ["plomeria"], kindsExclude: ["electricidad"], reachesContact: true },
  );
}

if (users.length < TARGET) {
  throw new Error(`Se esperaban al menos ${TARGET} usuarios, hay ${users.length}`);
}

const fails: Fail[] = [];
const byGroup = new Map<string, { ok: number; fail: number }>();
let crashed = 0;

for (const user of users) {
  const bucket = byGroup.get(user.group) ?? { ok: 0, fail: 0 };
  try {
    const { opener, reply } = play(user);
    const reasons = check(user, opener, reply);
    if (reasons.length) {
      bucket.fail += 1;
      for (const reason of reasons) {
        fails.push({ id: user.id, person: user.person, opener: user.opener, reason });
      }
    } else {
      bucket.ok += 1;
    }
  } catch (error) {
    crashed += 1;
    bucket.fail += 1;
    fails.push({
      id: user.id,
      person: user.person,
      opener: user.opener,
      reason: `excepción: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
  byGroup.set(user.group, bucket);
}

const passed = [...byGroup.values()].reduce((sum, row) => sum + row.ok, 0);
const failedUsers = [...byGroup.values()].reduce((sum, row) => sum + row.fail, 0);

console.log(`Prueba de ${users.length} usuarios — asesor ObraTech\n`);
console.log(`Resultado: ${passed} bien · ${failedUsers} con fallos · ${crashed} excepciones`);
console.log("");
console.log("Por grupo:");
for (const [group, row] of [...byGroup.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const mark = row.fail ? "FAIL" : "OK  ";
  console.log(`  ${mark}  ${group.padEnd(16)} ${row.ok}/${row.ok + row.fail}`);
}

if (fails.length) {
  console.log("\nFallos:");
  const seen = new Set<number>();
  for (const fail of fails) {
    if (!seen.has(fail.id)) {
      seen.add(fail.id);
      console.log(`\n  #${fail.id} ${fail.person}`);
      console.log(`     "${fail.opener}"`);
    }
    console.log(`     · ${fail.reason}`);
  }
  process.exitCode = 1;
} else {
  console.log(`\nLos ${users.length} usuarios cerraron el flujo como se esperaba.`);
}
