import { NextResponse } from "next/server";
import { isAdminAuthenticated, verifyAdminPassword } from "@/lib/admin-auth";
import { errorDeClave, saveAdminPassword } from "@/lib/admin-password";
import { clientIp, limitePorFallos } from "@/lib/rate-limit";

const fallos = limitePorFallos(6, 15 * 60 * 1000);

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const ip = clientIp(request);
  if (fallos.bloqueado(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera 15 minutos." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    current?: string;
    password?: string;
    confirm?: string;
  } | null;
  const current = body?.current ?? "";
  const password = body?.password ?? "";
  const confirm = body?.confirm ?? "";

  let actualOk = false;
  try {
    actualOk = verifyAdminPassword(current);
  } catch {
    return NextResponse.json(
      { error: "El servidor no tiene la contraseña configurada." },
      { status: 500 },
    );
  }

  if (!actualOk) {
    fallos.registrar(ip);
    return NextResponse.json({ error: "La contraseña actual no coincide." }, { status: 401 });
  }

  if (password !== confirm) {
    return NextResponse.json({ error: "Las dos contraseñas no coinciden." }, { status: 400 });
  }

  const error = errorDeClave(password);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  await saveAdminPassword(password);
  fallos.limpiar(ip);
  return NextResponse.json({ ok: true });
}
