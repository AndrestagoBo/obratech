"use client";

import { useState } from "react";
import Link from "next/link";

export function RecoverForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirm }),
    });
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      setError(data?.error || "No se pudo guardar la contraseña.");
      return;
    }
    setPassword("");
    setConfirm("");
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="glass w-full max-w-md p-8 space-y-5">
        <div>
          <p className="text-brand text-xs uppercase tracking-[0.24em] mb-2">ObraTech</p>
          <h1 className="text-3xl font-bold tracking-tight">Recuperar contraseña</h1>
          <p className="text-white/40 text-sm mt-2">
            Elige una contraseña nueva. Solo se puede hacer desde este computador, entrando por localhost.
          </p>
        </div>
        {done ? (
          <p className="text-sm text-white/80">
            Listo. Entra al panel con la contraseña que acabas de guardar. La anterior ya no sirve.
          </p>
        ) : (
          <>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña nueva"
              autoComplete="new-password"
              className="w-full bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-brand"
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repítela"
              autoComplete="new-password"
              className="w-full bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-brand"
            />
            {error ? <p className="text-brand text-sm">{error}</p> : null}
            <button type="submit" className="btn-primary w-full justify-center">
              Guardar contraseña
            </button>
          </>
        )}
        <Link href="/admin" className="block text-center text-xs text-white/40 hover:text-white">
          Volver a entrar
        </Link>
      </form>
    </div>
  );
}
