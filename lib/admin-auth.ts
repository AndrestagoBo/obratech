import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { passwordMatches, readStoredPassword } from "@/lib/admin-password";

const COOKIE_NAME = "obratech_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// Valores que alguna vez estuvieron en env.example o en el código. Cualquiera
// que lea el repositorio los conoce, así que no pueden servir como credencial.
const VALORES_QUEMADOS = new Set([
  "obratech2026",
  "obratech-change-me",
  "obratech-dev-secret",
  "REEMPLAZAR_por_una_clave_larga_y_aleatoria",
  "REEMPLAZAR_por_otro_secreto_largo_y_aleatorio",
]);

function requireEnv(name: "ADMIN_PASSWORD" | "ADMIN_SECRET") {
  const value = process.env[name];
  if (!value || VALORES_QUEMADOS.has(value)) {
    throw new Error(
      `${name} no está configurada con un valor propio. Copia env.example a .env.local y pon un valor largo y aleatorio.`,
    );
  }
  return value;
}

function sign(value: string) {
  return createHmac("sha256", requireEnv("ADMIN_SECRET")).update(value).digest("hex");
}

/** Comparación en tiempo constante para no filtrar la clave por el tiempo de respuesta. */
export function verifyAdminPassword(input: string) {
  const stored = readStoredPassword();
  if (stored) return passwordMatches(input, stored);
  const expected = requireEnv("ADMIN_PASSWORD");
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createAdminToken() {
  const payload = `admin:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined | null) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  try {
    // sign() lanza si falta ADMIN_SECRET: eso deja la sesión cerrada, que es
    // el lado seguro por el que fallar.
    const expected = sign(payload);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b) && payload.startsWith("admin:");
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(COOKIE_NAME)?.value);
}

export function adminCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export function clearAdminCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
