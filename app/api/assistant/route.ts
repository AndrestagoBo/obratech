import { NextResponse } from "next/server";
import { answerLocally, buildLeadFields, shouldSaveLead } from "@/lib/assistant-local";
import { clientIp, limitePorVentana } from "@/lib/rate-limit";
import { appendLead, readSiteContent } from "@/lib/site-store";
import { signState, verifiedState } from "@/lib/state-signature";

const allow = limitePorVentana(40, 10 * 60 * 1000);

export async function POST(request: Request) {
  if (!allow(clientIp(request))) {
    return NextResponse.json({ error: "Demasiadas consultas. Intente en unos minutos." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as
    | { message?: string; state?: unknown; sig?: unknown }
    | null;
  const message = String(body?.message ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);

  if (!message) {
    return NextResponse.json({ error: "Escriba una pregunta." }, { status: 400 });
  }

  const site = await readSiteContent();
  const reply = answerLocally(message, site, verifiedState(body?.state, body?.sig));

  if (shouldSaveLead(reply.state)) {
    try {
      const result = await appendLead(buildLeadFields(reply.state));
      reply.state = { ...reply.state, leadSaved: true };
      const done = answerLocally("ok", site, reply.state);
      reply.ctas = done.ctas;
      reply.chips = done.chips;
      reply.text = result.created
        ? `Perfecto, ${reply.state.name}. Hemos recibido tu solicitud.\n\nTu solicitud quedó registrada. Puedes continuar la conversación por WhatsApp para coordinar la atención.`
        : `Perfecto, ${reply.state.name}. Ya teníamos tu solicitud reciente; la actualizamos. Puedes continuar por WhatsApp.`;
    } catch {
      reply.text =
        "Tengo tus datos, pero no pude guardar ahora. Igual puedes escribir por WhatsApp con el resumen.";
    }
  }

  // La firma se calcula al final, ya con todas las mutaciones aplicadas.
  return NextResponse.json({ ...reply, sig: signState(reply.state) });
}
