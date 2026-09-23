import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  createAdminToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { clientIp, limitePorFallos } from "@/lib/rate-limit";

// Solo se cuentan los intentos fallidos, y se borran al acertar. Vive en
// memoria, así que se reinicia con el servidor: frena la fuerza bruta pero no
// sustituye a la protección del proveedor de hosting.
const fallos = limitePorFallos(6, 15 * 60 * 1000);

export async function POST(request: Request) {
  const ip = clientIp(request);

  if (fallos.bloqueado(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera 15 minutos." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password ?? "";

  let correcta: boolean;
  try {
    correcta = verifyAdminPassword(password);
  } catch (error) {
    console.error("[admin/login] configuración inválida:", error);
    return NextResponse.json(
      { error: "El servidor no tiene la contraseña configurada." },
      { status: 500 },
    );
  }

  if (!correcta) {
    fallos.registrar(ip);
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  fallos.limpiar(ip);

  const token = createAdminToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieOptions(token));
  return response;
}
