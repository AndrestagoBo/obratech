"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const SERVICIO_OPTIONS = [
  "Reparaciones / locativa",
  "Plomería",
  "Electricidad",
  "Instalaciones",
  "Pintura",
  "Fachadas / exterior",
  "Impermeabilización",
  "Remodelación",
  "Varias cosas / no sé",
];

export function ContactForm({
  phoneDisplay,
  zonas,
}: {
  phoneDisplay: string;
  zonas: { nombre: string }[];
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const telHref = `tel:+${phoneDisplay.replace(/\D/g, "")}`;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    let res: Response;
    try {
      res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          zona: data.get("zona"),
          servicio: data.get("servicio"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });
    } catch {
      setError("No hay conexión. Revisa tus datos o escríbenos por WhatsApp.");
      setStatus("error");
      return;
    }

    if (!res.ok) {
      if (res.status === 429) {
        setError("Ya enviaste varias solicitudes. Espera unos minutos o escríbenos por WhatsApp.");
        setStatus("error");
        return;
      }
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error || "No se pudo enviar. Llámanos o intenta más tarde.");
      setStatus("error");
      return;
    }

    form.reset();
    setStatus("ok");
  };

  return (
    <section id="contacto" className="section-pad bg-black border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <SectionHeading
            size="sm"
            eyebrow="Otra opción"
            title="Si prefieres dejar datos."
            lead="Nombre, teléfono y qué necesitas. Te escribimos para coordinar."
          />
          <a href={telHref} className="btn-ghost inline-flex mt-2">
            Llamar {phoneDisplay}
          </a>
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-7 panel p-6 md:p-8 space-y-4">
          <div className="hidden" aria-hidden>
            <label>
              Empresa
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm font-semibold text-white/80">
              Nombre
              <input
                required
                name="name"
                className="mt-2 w-full bg-white/5 border border-white/15 px-4 py-3 text-base text-white focus:border-brand"
              />
            </label>
            <label className="block text-sm font-semibold text-white/80">
              Teléfono
              <input
                required
                name="phone"
                type="tel"
                className="mt-2 w-full bg-white/5 border border-white/15 px-4 py-3 text-base text-white focus:border-brand"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm font-semibold text-white/80">
              Zona
              <select
                name="zona"
                className="mt-2 w-full bg-white/5 border border-white/15 px-4 py-3 text-base text-white focus:border-brand"
              >
                {zonas.map((z) => (
                  <option key={z.nombre} value={z.nombre} className="bg-black">
                    {z.nombre}
                  </option>
                ))}
                <option value="Otra (por confirmar)" className="bg-black">
                  Otra (por confirmar)
                </option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-white/80">
              Servicio
              <select
                name="servicio"
                className="mt-2 w-full bg-white/5 border border-white/15 px-4 py-3 text-base text-white focus:border-brand"
              >
                {SERVICIO_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-black">
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-semibold text-white/80">
            Mensaje (opcional)
            <textarea
              name="message"
              rows={4}
              className="mt-2 w-full bg-white/5 border border-white/15 px-4 py-3 text-base text-white focus:border-brand"
            />
          </label>

          <p className="text-xs text-white/60 leading-relaxed">
            Al enviar aceptas que ObraTech te contacte sobre esta solicitud. Tratamos tus datos
            según la{" "}
            <Link href="/privacidad" className="underline decoration-white/30 hover:text-white">
              política de datos personales
            </Link>
            .
          </p>

          <div aria-live="polite">
            {error ? <p className="text-sm text-brand">{error}</p> : null}
            {status === "ok" ? (
              <p className="text-sm text-white/80">
                Listo. Te escribimos o llamamos para coordinar.
              </p>
            ) : null}
          </div>

          <button type="submit" className="btn-primary" disabled={status === "sending"}>
            {status === "sending" ? "Enviando..." : "Enviar solicitud"}
            <ArrowRight className="arrow-animate w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
}
