import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { readFileSync } from "fs";
import { mkdir, rename, writeFile } from "fs/promises";
import path from "path";

const FILE = path.join(process.cwd(), "data", "admin-password.json");

const QUEMADAS = new Set([
  "obratech2026",
  "obratech-change-me",
  "obratech-dev-secret",
  "REEMPLAZAR_por_una_clave_larga_y_aleatoria",
  "REEMPLAZAR_por_otro_secreto_largo_y_aleatorio",
]);

type StoredPassword = { salt: string; hash: string };

export function readStoredPassword(): StoredPassword | null {
  try {
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as Partial<StoredPassword>;
    if (!parsed.salt || !parsed.hash) return null;
    return { salt: parsed.salt, hash: parsed.hash };
  } catch {
    return null;
  }
}

export function passwordMatches(input: string, stored: StoredPassword) {
  const actual = scryptSync(input, stored.salt, 32);
  const expected = Buffer.from(stored.hash, "base64url");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function errorDeClave(password: string) {
  if (password.length < 10) return "Usa al menos 10 caracteres.";
  if (password.length > 200) return "Es demasiado larga.";
  if (QUEMADAS.has(password)) return "Esa contraseña no sirve. Elige otra.";
  return null;
}

export async function saveAdminPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(password, salt, 32).toString("base64url");
  await mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify({ salt, hash }, null, 2), "utf8");
  await rename(tmp, FILE);
}

/** Solo el navegador abierto en este computador, por localhost. */
export function recuperacionLocal(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (
    forwarded &&
    forwarded !== "127.0.0.1" &&
    forwarded !== "::1" &&
    forwarded !== "::ffff:127.0.0.1"
  ) {
    return false;
  }
  const host = (request.headers.get("host") ?? "").toLowerCase().replace(/:\d+$/, "");
  const nombre = host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
  return nombre === "localhost" || nombre === "127.0.0.1" || nombre === "::1";
}
