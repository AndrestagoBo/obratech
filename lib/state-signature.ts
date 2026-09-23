import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cleanAssistantState, type AssistantState } from "@/lib/assistant-local";

let cached: string | null = null;

/**
 * Si no hay ADMIN_SECRET se usa un secreto aleatorio del proceso. El chat
 * sigue funcionando; lo único que pasa es que las conversaciones en curso
 * vuelven a empezar cuando se reinicia el servidor.
 */
function secret() {
  if (!cached) cached = process.env.ADMIN_SECRET || randomBytes(32).toString("hex");
  return cached;
}

/**
 * cleanAssistantState arma siempre las mismas claves en el mismo orden y es
 * idempotente, así que su salida en JSON sirve como forma canónica: el cliente
 * puede devolver el estado tal cual lo recibió y la firma vuelve a cuadrar.
 */
function canonical(state: AssistantState) {
  return JSON.stringify(cleanAssistantState(state));
}

export function signState(state: AssistantState) {
  return createHmac("sha256", secret()).update(canonical(state)).digest("hex");
}

/**
 * Devuelve el estado que mandó el cliente solo si viene con la firma que el
 * servidor emitió en el turno anterior. Sin firma válida se arranca de cero,
 * de modo que nadie puede inventar un estado con `confirmed`, `name` y `phone`
 * para colar una solicitud sin haber conversado.
 *
 * El primer mensaje llega sin firma y cae en este mismo camino, que es
 * justamente lo que corresponde: conversación nueva.
 */
export function verifiedState(raw: unknown, signature: unknown): AssistantState {
  if (typeof signature === "string" && signature.length === 64) {
    const state = cleanAssistantState(raw);
    const expected = Buffer.from(signState(state));
    const provided = Buffer.from(signature);
    if (provided.length === expected.length && timingSafeEqual(provided, expected)) {
      return state;
    }
  }
  return { jobs: [], current: 0 };
}
