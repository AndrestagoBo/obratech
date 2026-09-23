type Cubeta = { count: number; resetAt: number };

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

/** Cuenta cada petición. Deja pasar `max` dentro de la ventana y luego rechaza. */
export function limitePorVentana(max: number, ventanaMs: number) {
  const hits = new Map<string, Cubeta>();
  return function allow(ip: string) {
    const now = Date.now();
    const current = hits.get(ip);
    if (!current || now > current.resetAt) {
      hits.set(ip, { count: 1, resetAt: now + ventanaMs });
      return true;
    }
    if (current.count >= max) return false;
    current.count += 1;
    return true;
  };
}

/**
 * Solo cuenta intentos fallidos. `bloqueado` no suma; `registrar` sí;
 * `limpiar` olvida la IP (se usa cuando la contraseña es correcta).
 */
export function limitePorFallos(max: number, ventanaMs: number) {
  const fallos = new Map<string, Cubeta>();
  return {
    bloqueado(ip: string) {
      const actual = fallos.get(ip);
      if (!actual) return false;
      if (Date.now() > actual.resetAt) {
        fallos.delete(ip);
        return false;
      }
      return actual.count >= max;
    },
    registrar(ip: string) {
      const now = Date.now();
      const actual = fallos.get(ip);
      if (!actual || now > actual.resetAt) {
        fallos.set(ip, { count: 1, resetAt: now + ventanaMs });
        return;
      }
      actual.count += 1;
    },
    limpiar(ip: string) {
      fallos.delete(ip);
    },
  };
}
