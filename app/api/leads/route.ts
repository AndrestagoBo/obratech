import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { clientIp, limitePorVentana } from "@/lib/rate-limit";
import { appendLead, readLeads, updateLeadStatus, type LeadStatus } from "@/lib/site-store";

const allow = limitePorVentana(8, 15 * 60 * 1000);

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json({ leads: await readLeads() });
}

export async function POST(request: Request) {
  if (!allow(clientIp(request))) {
    return NextResponse.json({ error: "Demasiados envíos. Intente más tarde." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (clean(body.company, 80)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 30);
  const zona = clean(body.zona, 60);
  const servicio = clean(body.servicio, 80);
  const message = clean(body.message, 500);

  if (name.length < 2 || phone.replace(/\D/g, "").length < 7) {
    return NextResponse.json({ error: "Nombre y teléfono son obligatorios." }, { status: 400 });
  }

  const result = await appendLead({
    name,
    phone,
    zona,
    servicio,
    services: servicio ? [servicio] : [],
    message,
    source: "formulario",
    status: "new",
  });

  return NextResponse.json({ ok: true, created: result.created, id: result.lead.id });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { id?: string; status?: string } | null;
  const id = clean(body?.id, 80);
  const status = body?.status as LeadStatus | undefined;
  if (!id || !status || !["new", "contact", "quoting", "done"].includes(status)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const lead = await updateLeadStatus(id, status);
  if (!lead) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true, lead });
}
