"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { compressImageFile } from "@/lib/compress-image";
import type { SiteContent, SiteLead, LeadStatus } from "@/lib/site-store";

function contenidoDelPanel(contentJson: SiteContent): SiteContent {
  return {
    ...contentJson,
    faq: contentJson.faq ?? [],
    zonas: contentJson.zonas ?? [],
    badges: contentJson.badges ?? [],
    porqueNosotros: contentJson.porqueNosotros ?? [],
    serviciosInicio: contentJson.serviciosInicio ?? [],
    mostrarTestimonios: contentJson.mostrarTestimonios === true,
    testimonios: contentJson.testimonios ?? [],
  };
}

type ImageItem = { url: string; name: string; folder: string };
type Tab = "fotos" | "contenido" | "leads";
type FotoDestino =
  | { id: string; tipo: "campo"; field: "heroImage" | "nosotrosImage" | "nosotrosFondo"; nombre: string; detalle: string }
  | { id: string; tipo: "servicio"; index: number; nombre: string; detalle: string }
  | { id: string; tipo: "proyecto"; index: number; campo: "image" | "antes"; nombre: string; detalle: string };

function leadWhatsAppHref(lead: Pick<SiteLead, "phone" | "name" | "servicio" | "services" | "zona" | "message">) {
  const digits = lead.phone.replace(/\D/g, "");
  if (digits.length < 7) return null;
  const number = digits.length === 10 ? `57${digits}` : digits;
  const services = (lead.services?.length ? lead.services : [lead.servicio]).filter(Boolean).join(", ");
  const detail = lead.message?.trim();
  const parts = [
    `Hola ${lead.name}, te escribimos de ObraTech.`,
    services ? `Recibimos tu solicitud de ${services}.` : "Recibimos tu solicitud.",
    lead.zona ? `Zona: ${lead.zona}.` : "",
    detail ? `Detalle:\n${detail.length > 400 ? `${detail.slice(0, 397)}...` : detail}` : "",
    "¿Tienes un momento para coordinar?",
  ].filter(Boolean);
  return `https://wa.me/${number}?text=${encodeURIComponent(parts.join("\n\n"))}`;
}

export function AdminApp() {
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("leads");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [destino, setDestino] = useState<FotoDestino | null>(null);
  const [leads, setLeads] = useState<SiteLead[]>([]);
  const [savedJson, setSavedJson] = useState("");
  const [soloNuevas, setSoloNuevas] = useState(false);
  const [cambiandoClave, setCambiandoClave] = useState(false);
  const [claveActual, setClaveActual] = useState("");
  const [claveNueva, setClaveNueva] = useState("");
  const [claveConfirm, setClaveConfirm] = useState("");
  const [claveError, setClaveError] = useState("");
  const [testimoniosAbiertos, setTestimoniosAbiertos] = useState(false);
  const pasteRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAll = useCallback(async () => {
    const [contentRes, imagesRes, leadsRes] = await Promise.all([
      fetch("/api/admin/content"),
      fetch("/api/admin/images"),
      fetch("/api/leads"),
    ]);
    if (!contentRes.ok || !imagesRes.ok) {
      setAuthenticated(false);
      return;
    }
    const contentJson = contenidoDelPanel((await contentRes.json()) as SiteContent);
    const imagesJson = (await imagesRes.json()) as { images: ImageItem[] };
    setContent(contentJson);
    setSavedJson(JSON.stringify(contentJson));
    setImages(imagesJson.images);
    if (leadsRes.ok) {
      const leadsJson = (await leadsRes.json()) as { leads: SiteLead[] };
      setLeads(leadsJson.leads ?? []);
    }
    setAuthenticated(true);
  }, []);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then(async (data: { authenticated: boolean }) => {
        if (data.authenticated) {
          await loadAll();
        }
      })
      .finally(() => setAuthLoading(false));
  }, [loadAll]);

  const sinGuardar = content !== null && savedJson !== "" && JSON.stringify(content) !== savedJson;

  useEffect(() => {
    if (!sinGuardar) return;
    const onLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [sinGuardar]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setLoginError(data?.error || "Contraseña incorrecta");
      return;
    }
    await loadAll();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setContent(null);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setStatus("Comprimiendo y subiendo...");
    try {
      const compressed = await compressImageFile(file);
      const form = new FormData();
      form.append("file", compressed);
      const res = await fetch("/api/admin/images", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Error al subir");
        return;
      }
      const originalMb = (file.size / 1024 / 1024).toFixed(1);
      const finalKb = Math.round(compressed.size / 1024);
      setStatus(
        destino
          ? `Foto subida (${originalMb} MB → ${finalKb} KB). Haz clic en ella para ponerla en ${destino.nombre}.`
          : `Foto subida (${originalMb} MB → ${finalKb} KB). Pulsa Cambiar en la parte de la página y luego haz clic en esta foto.`,
      );
      setSelectedUrl(data.url);
      await loadAll();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setStatus("No se pudo comprimir o subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if ([...e.dataTransfer.types].includes("Files")) setIsDragging(true);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const onDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = [...e.dataTransfer.files].find((item) => item.type.startsWith("image/"));
    if (!file) {
      setStatus("Suelta una imagen (jpg, png, webp)");
      return;
    }
    void uploadFile(file);
  };

  const onPaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) await uploadFile(file);
        break;
      }
    }
  };

  const deleteImage = async (url: string) => {
    if (!url.startsWith("/images/uploads/")) {
      setStatus("Esa foto vino con el sitio. Solo se pueden borrar las que subiste.");
      return;
    }
    if (!confirm("¿Eliminar esta imagen?")) return;
    const res = await fetch("/api/admin/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      setStatus("No se pudo eliminar");
      return;
    }
    setStatus("Imagen eliminada");
    if (selectedUrl === url) setSelectedUrl("");
    await loadAll();
  };

  const saveContent = async () => {
    if (!content) return;
    setStatus("Guardando...");
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    const data = (await res.json().catch(() => null)) as { error?: string; content?: SiteContent } | null;
    if (!res.ok) {
      setStatus(data?.error || "No se pudo guardar");
      return;
    }
    if (data?.content) {
      const listo = contenidoDelPanel(data.content);
      setContent(listo);
      setSavedJson(JSON.stringify(listo));
    } else {
      setSavedJson(JSON.stringify(content));
    }
    setStatus("Guardado. Recarga la web para ver cambios.");
  };

  const guardarClave = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaveError("");
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current: claveActual, password: claveNueva, confirm: claveConfirm }),
    });
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      setClaveError(data?.error || "No se pudo cambiar la contraseña.");
      return;
    }
    setClaveActual("");
    setClaveNueva("");
    setClaveConfirm("");
    setCambiandoClave(false);
    setStatus("Contraseña actualizada. La anterior ya no sirve.");
  };

  const ponerFoto = (url: string, target: FotoDestino) => {
    if (!content) return;
    if (target.tipo === "campo") {
      setContent({ ...content, [target.field]: url });
    } else if (target.tipo === "servicio") {
      const servicios = [...content.servicios];
      servicios[target.index] = { ...servicios[target.index], bgImage: url };
      setContent({ ...content, servicios });
    } else {
      const proyectos = [...content.proyectos];
      proyectos[target.index] = { ...proyectos[target.index], [target.campo]: url };
      setContent({ ...content, proyectos });
    }
    setSelectedUrl(url);
    setStatus(`Lista en ${target.nombre}. Pulsa Guardar para verla en la web.`);
  };

  const quitarAntes = (index: number) => {
    if (!content) return;
    const proyectos = content.proyectos.map((proyecto, i) => {
      if (i !== index) return proyecto;
      const siguiente = { ...proyecto };
      delete siguiente.antes;
      return siguiente;
    });
    setContent({ ...content, proyectos });
    setStatus("Se quitó la foto del antes. Pulsa Guardar para verlo en la web.");
  };

  const openLeadWhatsApp = (lead: SiteLead) => {
    const href = leadWhatsAppHref(lead);
    if (!href) {
      setStatus("No hay un WhatsApp válido para este número");
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const handleLeadStatus = async (lead: SiteLead, status: LeadStatus) => {
    const res = await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, status }),
    });
    if (!res.ok) {
      setStatus("No se pudo actualizar el estado");
      return;
    }
    setLeads((prev) => prev.map((item) => (item.id === lead.id ? { ...item, status } : item)));
    if (status === "contact") openLeadWhatsApp(lead);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="glass w-full max-w-md p-8 space-y-5">
          <div>
            <p className="text-brand text-xs uppercase tracking-[0.24em] mb-2">ObraTech</p>
            <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
            <p className="text-white/40 text-sm mt-2">Edita textos, fotos y solicitudes.</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-brand"
          />
          {loginError ? <p className="text-brand text-sm">{loginError}</p> : null}
          <button type="submit" className="btn-primary w-full justify-center">
            Entrar
          </button>
          <Link href="/admin/recuperar" className="block text-center text-sm text-white/70 hover:text-white">
            Olvidé la contraseña
          </Link>
          <Link href="/" className="block text-center text-xs text-white/40 hover:text-white">
            Volver al sitio
          </Link>
        </form>
      </div>
    );
  }

  if (!content) return null;

  const nuevas = leads.filter((lead) => (lead.status || "new") === "new");
  const newLeadCount = nuevas.length;
  const solicitudes = soloNuevas ? nuevas : leads;

  const lugares: { destino: FotoDestino; url: string }[] = [
    {
      destino: {
        id: "hero",
        tipo: "campo",
        field: "heroImage",
        nombre: "Portada",
        detalle: "La foto grande al entrar al sitio.",
      },
      url: content.heroImage,
    },
    {
      destino: {
        id: "nosotros",
        tipo: "campo",
        field: "nosotrosImage",
        nombre: "Nosotros",
        detalle: "La foto junto a «Por qué ObraTech».",
      },
      url: content.nosotrosImage,
    },
    {
      destino: {
        id: "fondo",
        tipo: "campo",
        field: "nosotrosFondo",
        nombre: "Fondo de Nosotros",
        detalle: "Se ve detrás de esa sección.",
      },
      url: content.nosotrosFondo,
    },
    ...content.servicios.map((servicio, index) => ({
      destino: {
        id: `servicio-${servicio.id}`,
        tipo: "servicio" as const,
        index,
        nombre: servicio.title,
        detalle: servicio.id === "locativa" ? "La foto grande de Servicios." : "Tarjeta de exteriores.",
      },
      url: servicio.bgImage,
    })),
    ...content.proyectos.flatMap((proyecto, index) => [
      {
        destino: {
          id: `proyecto-${index}`,
          tipo: "proyecto" as const,
          index,
          campo: "image" as const,
          nombre: proyecto.title || `Proyecto ${index + 1}`,
          detalle: "La foto del trabajo terminado.",
        },
        url: proyecto.image,
      },
      {
        destino: {
          id: `antes-${index}`,
          tipo: "proyecto" as const,
          index,
          campo: "antes" as const,
          nombre: `Antes · ${proyecto.title || `Proyecto ${index + 1}`}`,
          detalle: "Opcional. Si la dejas vacía, solo se ve el después.",
        },
        url: proyecto.antes || "",
      },
    ]),
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 sticky top-0 z-40 glass">
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-brand text-[0.65rem] uppercase tracking-[0.24em]">ObraTech Admin</p>
            <h1 className="text-xl font-bold tracking-tight">Panel de edición</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="btn-ghost !py-2 !px-3 !text-[0.65rem]" target="_blank">
              Ver sitio
            </a>
            <button
              type="button"
              onClick={() => {
                setCambiandoClave((abierto) => !abierto);
                setClaveError("");
              }}
              className="btn-ghost !py-2 !px-3 !text-[0.65rem]"
            >
              Contraseña
            </button>
            <button type="button" onClick={handleLogout} className="btn-ghost !py-2 !px-3 !text-[0.65rem]">
              Salir
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-5 pb-4 flex gap-2">
          {(
            [
              ["leads", "Solicitudes"],
              ["fotos", "Fotos"],
              ["contenido", "Contenido"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.18em] font-bold border transition-colors inline-flex items-center gap-2 ${
                tab === id ? "bg-brand text-black border-brand" : "border-white/15 text-white/60"
              }`}
            >
              {label}
              {id === "leads" && newLeadCount > 0 ? (
                <span
                  className={`min-w-5 px-1.5 py-0.5 text-[0.65rem] tracking-normal ${
                    tab === id ? "bg-black text-brand" : "bg-brand text-black"
                  }`}
                >
                  {newLeadCount}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {cambiandoClave ? (
          <form onSubmit={(e) => void guardarClave(e)} className="max-w-6xl mx-auto px-5 pb-4 space-y-3">
            <p className="text-sm text-white/55">La contraseña nueva reemplaza a la anterior.</p>
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                type="password"
                value={claveActual}
                onChange={(e) => setClaveActual(e.target.value)}
                placeholder="Contraseña actual"
                autoComplete="current-password"
                className="bg-white/5 border border-white/15 px-3 py-2"
              />
              <input
                type="password"
                value={claveNueva}
                onChange={(e) => setClaveNueva(e.target.value)}
                placeholder="Nueva, mínimo 10 caracteres"
                autoComplete="new-password"
                className="bg-white/5 border border-white/15 px-3 py-2"
              />
              <input
                type="password"
                value={claveConfirm}
                onChange={(e) => setClaveConfirm(e.target.value)}
                placeholder="Repite la nueva"
                autoComplete="new-password"
                className="bg-white/5 border border-white/15 px-3 py-2"
              />
            </div>
            {claveError ? <p className="text-sm text-brand">{claveError}</p> : null}
            <button type="submit" className="btn-primary !py-2">
              Guardar contraseña
            </button>
          </form>
        ) : null}
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8 space-y-6">
        {sinGuardar ? (
          <p className="text-sm border border-white/20 bg-white/5 px-4 py-3">Hay cambios sin guardar.</p>
        ) : null}
        {status ? (
          <p className="text-sm text-brand border border-brand/30 bg-brand/10 px-4 py-3">{status}</p>
        ) : null}

        {tab === "fotos" && (
          <section className="space-y-6">
            <div
              ref={pasteRef}
              tabIndex={0}
              onPaste={onPaste}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`glass p-6 md:p-8 outline-none transition-colors ${
                isDragging ? "border-brand bg-brand/10" : "focus:border-brand"
              }`}
            >
              <h2 className="text-2xl font-bold tracking-tight mb-2">Subir una foto</h2>
              <p className="text-white/45 text-sm mb-5">
                {isDragging
                  ? "Suelta la imagen aquí."
                  : "Arrastra una foto o elige un archivo. También puedes hacer clic en este recuadro y pegarla con Ctrl+V."}
              </p>
              <label className="btn-primary cursor-pointer">
                {uploading ? "Subiendo..." : "Elegir archivo"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadFile(file);
                  }}
                />
              </label>
            </div>

            <div className="glass p-6 space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Fotos de la página</h2>
                  <p className="mt-1 text-sm text-white/55">
                    Pulsa Cambiar en el lugar que quieres y después haz clic en una foto de abajo.
                  </p>
                </div>
                <button type="button" className="btn-primary" onClick={() => void saveContent()}>
                  Guardar
                </button>
              </div>
              {destino ? (
                <p className="border border-brand/40 bg-brand/10 px-4 py-3 text-sm">
                  Ahora haz clic en la foto para <span className="font-bold">{destino.nombre}</span>.
                  <button type="button" className="ml-3 text-white/70 underline" onClick={() => setDestino(null)}>
                    Cancelar
                  </button>
                </p>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {lugares.map(({ destino: lugar, url }) => (
                  <div
                    key={lugar.id}
                    className={`border p-3 ${destino?.id === lugar.id ? "border-brand" : "border-white/10"}`}
                  >
                    <div className="relative mb-3 h-28 overflow-hidden bg-white/5">
                      {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <p className="flex h-full items-center justify-center text-sm text-white/40">Sin foto</p>
                      )}
                    </div>
                    <p className="font-bold tracking-tight">{lugar.nombre}</p>
                    <p className="mt-1 text-sm text-white/55">{lugar.detalle}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn-ghost !py-2 !text-[0.65rem]"
                        onClick={() => setDestino(lugar)}
                      >
                        Cambiar
                      </button>
                      {lugar.tipo === "proyecto" && lugar.campo === "antes" && url ? (
                        <button
                          type="button"
                          className="btn-ghost !py-2 !text-[0.65rem]"
                          onClick={() => quitarAntes(lugar.index)}
                        >
                          Quitar
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-bold tracking-tight">Todas las fotos</h2>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {images.map((img) => {
                  const usos = lugares.filter((lugar) => lugar.url === img.url).map((lugar) => lugar.destino.nombre);
                  return (
                    <div
                      key={img.url}
                      className={`border text-left ${
                        destino && selectedUrl === img.url ? "border-brand" : "border-white/10"
                      }`}
                    >
                      <button type="button" className="block w-full text-left" onClick={() => {
                        setSelectedUrl(img.url);
                        if (!destino) {
                          setStatus("Pulsa Cambiar en el lugar de la página y después vuelve a hacer clic en esta foto.");
                          return;
                        }
                        ponerFoto(img.url, destino);
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.name} className="h-32 w-full object-cover bg-white/5" />
                        <span className="block p-2 text-[10px] text-white/45 break-all">{img.name}</span>
                      </button>
                      {usos.length ? (
                        <p className="px-2 pb-2 text-[10px] uppercase tracking-[0.14em] text-brand">{usos.join(" · ")}</p>
                      ) : null}
                      {img.url.startsWith("/images/uploads/") ? (
                        <button
                          type="button"
                          className="px-2 pb-2 text-[10px] text-brand"
                          onClick={() => void deleteImage(img.url)}
                        >
                          Borrar
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {tab === "contenido" && (
          <section className="space-y-6">
            <nav className="flex flex-wrap gap-2">
              {(
                [
                  ["admin-proyectos", "Proyectos"],
                  ["admin-zonas", "Zonas"],
                  ["admin-preguntas", "Preguntas"],
                ] as const
              ).map(([id, label]) => (
                <a key={id} href={`#${id}`} className="btn-ghost !py-2 !px-3 !text-[0.65rem]">
                  {label}
                </a>
              ))}
            </nav>
            <div className="glass p-6 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Contacto</h2>
              <label className="block text-xs uppercase tracking-[0.18em] text-white/40">
                WhatsApp (solo números, con 57)
                <input
                  className="mt-2 w-full bg-white/5 border border-white/15 px-3 py-2"
                  value={content.whatsappNumber}
                  onChange={(e) => setContent({ ...content, whatsappNumber: e.target.value })}
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.18em] text-white/40">
                Teléfono visible
                <input
                  className="mt-2 w-full bg-white/5 border border-white/15 px-3 py-2"
                  value={content.phoneDisplay}
                  onChange={(e) => setContent({ ...content, phoneDisplay: e.target.value })}
                />
              </label>
            </div>

            <div className="glass p-6 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Badges (barra de confianza)</h2>
              <p className="text-sm text-white/55">Aparecen después de los proyectos.</p>
              {content.badges.map((badge, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1 bg-white/5 border border-white/15 px-3 py-2"
                    value={badge}
                    onChange={(e) => {
                      const badges = [...content.badges];
                      badges[i] = e.target.value;
                      setContent({ ...content, badges });
                    }}
                    placeholder="Texto del badge"
                  />
                  <button
                    type="button"
                    className="btn-ghost !py-2 !px-3 shrink-0"
                    onClick={() =>
                      setContent({
                        ...content,
                        badges: content.badges.filter((_, index) => index !== i),
                      })
                    }
                  >
                    Quitar
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-ghost !py-2"
                onClick={() => setContent({ ...content, badges: [...content.badges, ""] })}
              >
                + Agregar badge
              </button>
            </div>

            <div className="glass p-6 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Por qué nosotros</h2>
              <p className="text-sm text-white/55">Franja corta después de los pasos. Cada fila es un punto.</p>
              {content.porqueNosotros.map((item, i) => (
                <div key={i} className="space-y-2 border border-white/10 p-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-white/50 hover:text-white"
                      onClick={() =>
                        setContent({
                          ...content,
                          porqueNosotros: content.porqueNosotros.filter((_, index) => index !== i),
                        })
                      }
                    >
                      Quitar
                    </button>
                  </div>
                  <input
                    className="w-full bg-white/5 border border-white/15 px-3 py-2"
                    value={item.t}
                    onChange={(e) => {
                      const porqueNosotros = [...content.porqueNosotros];
                      porqueNosotros[i] = { ...item, t: e.target.value };
                      setContent({ ...content, porqueNosotros });
                    }}
                    placeholder="Título"
                  />
                  <textarea
                    className="w-full bg-white/5 border border-white/15 px-3 py-2 min-h-16"
                    value={item.d}
                    onChange={(e) => {
                      const porqueNosotros = [...content.porqueNosotros];
                      porqueNosotros[i] = { ...item, d: e.target.value };
                      setContent({ ...content, porqueNosotros });
                    }}
                    placeholder="Descripción"
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn-ghost !py-2"
                onClick={() =>
                  setContent({
                    ...content,
                    porqueNosotros: [...content.porqueNosotros, { t: "", d: "" }],
                  })
                }
              >
                + Agregar tarjeta
              </button>
            </div>

            <div id="admin-proyectos" className="glass scroll-mt-36 p-6 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Proyectos</h2>
              {content.proyectos.map((p, i) => (
                <div key={i} className="space-y-2 border border-white/10 p-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-white/50 hover:text-white"
                      onClick={() =>
                        setContent({
                          ...content,
                          proyectos: content.proyectos.filter((_, index) => index !== i),
                        })
                      }
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      className="bg-white/5 border border-white/15 px-3 py-2"
                      value={p.title}
                      onChange={(e) => {
                        const proyectos = [...content.proyectos];
                        proyectos[i] = { ...p, title: e.target.value };
                        setContent({ ...content, proyectos });
                      }}
                      placeholder="Título"
                    />
                    <input
                      className="bg-white/5 border border-white/15 px-3 py-2"
                      value={p.city}
                      onChange={(e) => {
                        const proyectos = [...content.proyectos];
                        proyectos[i] = { ...p, city: e.target.value };
                        setContent({ ...content, proyectos });
                      }}
                      placeholder="Ciudad"
                    />
                    <input
                      className="bg-white/5 border border-white/15 px-3 py-2 text-xs"
                      value={p.image}
                      onChange={(e) => {
                        const proyectos = [...content.proyectos];
                        proyectos[i] = { ...p, image: e.target.value };
                        setContent({ ...content, proyectos });
                      }}
                      placeholder="Foto del después"
                    />
                    <input
                      className="bg-white/5 border border-white/15 px-3 py-2 text-xs"
                      value={p.antes ?? ""}
                      onChange={(e) => {
                        const proyectos = [...content.proyectos];
                        const antes = e.target.value;
                        proyectos[i] = antes ? { ...p, antes } : { ...p, antes: undefined };
                        setContent({ ...content, proyectos });
                      }}
                      placeholder="Foto del antes (opcional)"
                    />
                    <input
                      className="bg-white/5 border border-white/15 px-3 py-2 md:col-span-2"
                      value={p.resultado ?? ""}
                      onChange={(e) => {
                        const proyectos = [...content.proyectos];
                        const resultado = e.target.value;
                        proyectos[i] = resultado
                          ? { ...p, resultado }
                          : { ...p, resultado: undefined };
                        setContent({ ...content, proyectos });
                      }}
                      placeholder="Qué se hizo (opcional). Ej: cubierta que filtraba"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-ghost !py-2"
                onClick={() =>
                  setContent({
                    ...content,
                    proyectos: [
                      ...content.proyectos,
                      { title: "Nuevo proyecto", city: "Bogotá", image: selectedUrl || "/images/proyecto1.jpeg" },
                    ],
                  })
                }
              >
                + Agregar proyecto
              </button>
            </div>

            <div className="glass p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Testimonios</h2>
                  <p className="mt-1 text-sm text-white/55 max-w-xl">
                    Si no son de clientes reales, déjalos apagados. La web no muestra la sección.
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={content.mostrarTestimonios === true}
                    onChange={(e) => setContent({ ...content, mostrarTestimonios: e.target.checked })}
                  />
                  Mostrar en la web
                </label>
              </div>
              {content.mostrarTestimonios || testimoniosAbiertos ? (
              <>
              {content.testimonios.map((t, i) => (
                <div key={i} className="space-y-2 border border-white/10 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-xs text-white/70">
                      <input
                        type="checkbox"
                        checked={t.visible !== false}
                        onChange={(e) => {
                          const testimonios = [...content.testimonios];
                          testimonios[i] = { ...t, visible: e.target.checked };
                          setContent({ ...content, testimonios });
                        }}
                      />
                      Visible
                    </label>
                    <button
                      type="button"
                      className="text-xs text-white/50 hover:text-white"
                      onClick={() =>
                        setContent({
                          ...content,
                          testimonios: content.testimonios.filter((_, index) => index !== i),
                        })
                      }
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-2">
                    <input
                      className="bg-white/5 border border-white/15 px-3 py-2"
                      value={t.name}
                      onChange={(e) => {
                        const testimonios = [...content.testimonios];
                        testimonios[i] = { ...t, name: e.target.value };
                        setContent({ ...content, testimonios });
                      }}
                      placeholder="Nombre"
                    />
                    <input
                      className="bg-white/5 border border-white/15 px-3 py-2"
                      value={t.barrio}
                      onChange={(e) => {
                        const testimonios = [...content.testimonios];
                        testimonios[i] = { ...t, barrio: e.target.value };
                        setContent({ ...content, testimonios });
                      }}
                      placeholder="Barrio"
                    />
                    <input
                      className="bg-white/5 border border-white/15 px-3 py-2"
                      value={t.proyecto}
                      onChange={(e) => {
                        const testimonios = [...content.testimonios];
                        testimonios[i] = { ...t, proyecto: e.target.value };
                        setContent({ ...content, testimonios });
                      }}
                      placeholder="Proyecto"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[0.65rem] uppercase tracking-[0.14em] text-white/45">Calificación</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          className={`h-8 w-8 text-sm border ${
                            n <= (t.rating || 5) ? "border-brand text-brand" : "border-white/15 text-white/40"
                          }`}
                          onClick={() => {
                            const testimonios = [...content.testimonios];
                            testimonios[i] = { ...t, rating: n };
                            setContent({ ...content, testimonios });
                          }}
                          aria-label={`${n} de 5`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="w-full bg-white/5 border border-white/15 px-3 py-2 min-h-20"
                    value={t.texto}
                    onChange={(e) => {
                      const testimonios = [...content.testimonios];
                      testimonios[i] = { ...t, texto: e.target.value };
                      setContent({ ...content, testimonios });
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn-ghost !py-2 !text-[0.65rem]"
                onClick={() =>
                  setContent({
                    ...content,
                    testimonios: [
                      ...content.testimonios,
                      {
                        name: "",
                        barrio: "",
                        proyecto: "",
                        texto: "",
                        rating: 5,
                        visible: true,
                      },
                    ],
                  })
                }
              >
                + Agregar testimonio
              </button>
              </>
              ) : (
                <button type="button" className="btn-ghost !py-2" onClick={() => setTestimoniosAbiertos(true)}>
                  Editar los textos
                </button>
              )}
            </div>

            <div className="glass p-6 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Lista de la home</h2>
              <p className="text-sm text-white/55">
                Estos textos son los que se ven en Servicios y abren el asesor. Si los borras todos, al guardar vuelven los de siempre.
              </p>
              {(content.serviciosInicio ?? []).map((s, i) => (
                <div key={s.id || i} className="space-y-2 border border-white/10 p-3">
                  <input
                    className="w-full bg-white/5 border border-white/15 px-3 py-2"
                    value={s.title}
                    onChange={(e) => {
                      const serviciosInicio = [...content.serviciosInicio];
                      serviciosInicio[i] = { ...s, title: e.target.value };
                      setContent({ ...content, serviciosInicio });
                    }}
                    placeholder="Título"
                  />
                  <input
                    className="w-full bg-white/5 border border-white/15 px-3 py-2"
                    value={s.desc}
                    onChange={(e) => {
                      const serviciosInicio = [...content.serviciosInicio];
                      serviciosInicio[i] = { ...s, desc: e.target.value };
                      setContent({ ...content, serviciosInicio });
                    }}
                    placeholder="Descripción"
                  />
                </div>
              ))}
            </div>

            <div className="glass p-6 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Exteriores</h2>
              <p className="text-sm text-white/55">
                Fachadas, impermeabilización y remodelaciones. La foto de reparaciones del hogar es la imagen grande de Servicios.
              </p>
              {content.servicios.map((s, i) => (
                <div key={s.id} className="space-y-2 border border-white/10 p-3">
                  <input
                    className="w-full bg-white/5 border border-white/15 px-3 py-2"
                    value={s.title}
                    onChange={(e) => {
                      const servicios = [...content.servicios];
                      servicios[i] = { ...s, title: e.target.value };
                      setContent({ ...content, servicios });
                    }}
                  />
                  <textarea
                    className="w-full bg-white/5 border border-white/15 px-3 py-2 min-h-20"
                    value={s.desc}
                    onChange={(e) => {
                      const servicios = [...content.servicios];
                      servicios[i] = { ...s, desc: e.target.value };
                      setContent({ ...content, servicios });
                    }}
                  />
                  <input
                    className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs"
                    value={s.bgImage}
                    onChange={(e) => {
                      const servicios = [...content.servicios];
                      servicios[i] = { ...s, bgImage: e.target.value };
                      setContent({ ...content, servicios });
                    }}
                  />
                </div>
              ))}
            </div>

            <div id="admin-zonas" className="glass scroll-mt-36 p-6 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Zonas de cobertura</h2>
              {content.zonas.map((z, i) => (
                <div key={i} className="space-y-2 border border-white/10 p-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-white/50 hover:text-white"
                      onClick={() =>
                        setContent({
                          ...content,
                          zonas: content.zonas.filter((_, index) => index !== i),
                        })
                      }
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      className="bg-white/5 border border-white/15 px-3 py-2"
                      value={z.nombre}
                      onChange={(e) => {
                        const zonas = [...content.zonas];
                        zonas[i] = { ...z, nombre: e.target.value };
                        setContent({ ...content, zonas });
                      }}
                      placeholder="Zona"
                    />
                    <input
                      className="bg-white/5 border border-white/15 px-3 py-2"
                      value={z.detalle}
                      onChange={(e) => {
                        const zonas = [...content.zonas];
                        zonas[i] = { ...z, detalle: e.target.value };
                        setContent({ ...content, zonas });
                      }}
                      placeholder="Barrios / municipios"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-ghost !py-2"
                onClick={() =>
                  setContent({
                    ...content,
                    zonas: [...content.zonas, { nombre: "", detalle: "" }],
                  })
                }
              >
                + Agregar zona
              </button>
            </div>

            <div id="admin-preguntas" className="glass scroll-mt-36 p-6 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Preguntas frecuentes</h2>
              {content.faq.map((item, i) => (
                <div key={i} className="space-y-2 border border-white/10 p-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-white/50 hover:text-white"
                      onClick={() =>
                        setContent({
                          ...content,
                          faq: content.faq.filter((_, index) => index !== i),
                        })
                      }
                    >
                      Quitar
                    </button>
                  </div>
                  <input
                    className="w-full bg-white/5 border border-white/15 px-3 py-2"
                    value={item.q}
                    onChange={(e) => {
                      const faq = [...content.faq];
                      faq[i] = { ...item, q: e.target.value };
                      setContent({ ...content, faq });
                    }}
                    placeholder="Pregunta"
                  />
                  <textarea
                    className="w-full bg-white/5 border border-white/15 px-3 py-2 min-h-20"
                    value={item.a}
                    onChange={(e) => {
                      const faq = [...content.faq];
                      faq[i] = { ...item, a: e.target.value };
                      setContent({ ...content, faq });
                    }}
                    placeholder="Respuesta"
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn-ghost !py-2"
                onClick={() =>
                  setContent({
                    ...content,
                    faq: [...content.faq, { q: "", a: "" }],
                  })
                }
              >
                + Agregar pregunta
              </button>
            </div>

            <button type="button" className="btn-primary" onClick={() => void saveContent()}>
              Guardar contenido
            </button>
          </section>
        )}

        {tab === "leads" && (
          <section className="space-y-4">
            <div className="glass p-6 overflow-x-auto">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold tracking-tight">Solicitudes</h2>
                <button
                  type="button"
                  className="btn-ghost !py-2 !px-3 !text-[0.65rem]"
                  onClick={() => setSoloNuevas((activo) => !activo)}
                >
                  {soloNuevas ? "Ver todas" : `Solo nuevas (${newLeadCount})`}
                </button>
              </div>
              <p className="text-white/45 text-sm mb-6">
                Formulario y chat. Al pasar a Contactar se abre WhatsApp con un mensaje listo.
              </p>
              {solicitudes.length === 0 ? (
                <p className="text-white/40 text-sm">
                  {leads.length === 0 ? "Aún no hay solicitudes." : "No hay solicitudes nuevas."}
                </p>
              ) : (
                <table className="w-full min-w-[44rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/15 text-white/45 text-xs uppercase tracking-[0.14em]">
                      <th className="py-3 pr-3 font-medium">Cliente</th>
                      <th className="py-3 pr-3 font-medium">Servicio</th>
                      <th className="py-3 pr-3 font-medium">Zona</th>
                      <th className="py-3 pr-3 font-medium">Origen</th>
                      <th className="py-3 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitudes.map((lead) => {
                      const whatsappHref = leadWhatsAppHref(lead);
                      return (
                      <tr key={lead.id} className="border-b border-white/10 align-top">
                        <td className="py-4 pr-3">
                          <p className="font-bold text-white">{lead.name}</p>
                          {whatsappHref ? (
                            <a
                              href={whatsappHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand mt-1 inline-block hover:underline"
                            >
                              {lead.phone}
                            </a>
                          ) : (
                            <p className="text-brand mt-1">{lead.phone}</p>
                          )}
                          <p className="text-[0.65rem] text-white/35 mt-2">
                            {new Date(lead.createdAt).toLocaleString("es-CO")}
                          </p>
                          {lead.message ? (
                            <p className="text-xs text-white/55 mt-2 max-w-xs leading-relaxed">
                              {lead.message}
                            </p>
                          ) : null}
                        </td>
                        <td className="py-4 pr-3 text-white/80">
                          {(lead.services?.length ? lead.services : [lead.servicio]).join(", ")}
                        </td>
                        <td className="py-4 pr-3 text-white/70">{lead.zona || "—"}</td>
                        <td className="py-4 pr-3">
                          <span
                            className={`inline-block px-2 py-1 text-[0.65rem] uppercase tracking-[0.12em] ${
                              lead.source === "chat"
                                ? "border border-brand/50 text-brand"
                                : "border border-white/25 text-white/60"
                            }`}
                          >
                            {lead.source === "chat" ? "Chat" : "Formulario"}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col gap-2 items-start">
                            <select
                              value={lead.status || "new"}
                              onChange={(e) =>
                                void handleLeadStatus(lead, e.target.value as LeadStatus)
                              }
                              className="bg-black border border-white/20 px-2 py-2 text-xs text-white outline-none focus:border-brand"
                            >
                              <option value="new">Nuevo</option>
                              <option value="contact">Contactar</option>
                              <option value="quoting">Cotizando</option>
                              <option value="done">Cerrado</option>
                            </select>
                            <button
                              type="button"
                              className="btn-ghost !py-1.5 !px-2 !text-[0.65rem]"
                              onClick={() => {
                                if ((lead.status || "new") !== "contact") {
                                  void handleLeadStatus(lead, "contact");
                                  return;
                                }
                                openLeadWhatsApp(lead);
                              }}
                            >
                              WhatsApp
                            </button>
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
