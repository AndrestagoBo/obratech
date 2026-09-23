import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readSiteContent, writeSiteContent } from "@/lib/site-store";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const content = await readSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Contenido inválido" }, { status: 400 });
  }

  // El saneado de writeSiteContent garantiza la forma del archivo. Esta
  // comprobación existe solo para avisarle al panel que mandó algo incompleto
  // en vez de guardarlo a medias en silencio.
  const faltantes = (["servicios", "faq", "zonas", "badges", "proyectos"] as const).filter(
    (key) => !Array.isArray((body as Record<string, unknown>)[key]),
  );
  if (faltantes.length) {
    return NextResponse.json(
      { error: `Estos campos deben ser listas: ${faltantes.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const content = await writeSiteContent(body);
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    console.error("[admin/content] no se pudo guardar:", error);
    return NextResponse.json({ error: "No se pudo guardar el contenido" }, { status: 500 });
  }
}
