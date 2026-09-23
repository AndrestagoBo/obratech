import { NextResponse } from "next/server";
import { errorDeClave, recuperacionLocal, saveAdminPassword } from "@/lib/admin-password";
import { clientIp, limitePorVentana } from "@/lib/rate-limit";

const intentos = limitePorVentana(5, 15 * 60 * 1000);

export async function POST(request: Request) {
  if (!recuperacionLocal(request)) {
    return NextResponse.json(
      { error: "Ábrela en este computador, entrando por localhost." },
      { status: 403 },
    );
  }

  if (!intentos(clientIp(request))) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera 15 minutos." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    password?: string;
    confirm?: string;
  } | null;
  const password = body?.password ?? "";
  const confirm = body?.confirm ?? "";

  if (password !== confirm) {
    return NextResponse.json({ error: "Las dos contraseñas no coinciden." }, { status: 400 });
  }

  const error = errorDeClave(password);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  await saveAdminPassword(password);
  return NextResponse.json({ ok: true });
}
