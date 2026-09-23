import Link from "next/link";
import { MapPin, Clock, Phone } from "lucide-react";
import { LogoObraTech } from "@/components/logo";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { NAV_LINKS } from "@/lib/content";
import type { SiteEmpresa } from "@/lib/site-store";

export function SiteFooter({
  phoneDisplay,
  whatsappNumber,
  empresa,
}: {
  phoneDisplay: string;
  whatsappNumber: string;
  empresa?: SiteEmpresa;
}) {
  const telHref = `tel:+${phoneDisplay.replace(/\D/g, "")}`;
  const identidad = [
    empresa?.razonSocial,
    empresa?.nit ? `NIT ${empresa.nit}` : undefined,
    empresa?.desde ? `Operando desde ${empresa.desde}` : undefined,
  ].filter(Boolean);

  return (
    <footer className="bg-black text-white/55 py-14 md:py-16 border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-12 gap-10 mb-14">
          <div className="md:col-span-5">
            <LogoObraTech />
            <p className="mt-5 text-sm leading-relaxed max-w-sm text-white/65">
              Reparaciones, pintura, instalaciones y remodelaciones en Bogotá. Cotización por WhatsApp.
            </p>
            {identidad.length ? (
              <ul className="mt-5 space-y-1 text-sm text-white/50">
                {identidad.map((linea) => (
                  <li key={linea}>{linea}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-white text-[0.65rem] font-bold uppercase tracking-[0.24em] mb-4">
              Menú
            </h4>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-white text-[0.65rem] font-bold uppercase tracking-[0.24em] mb-4">
              Contacto
            </h4>
            <a
              href={telHref}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Phone size={14} /> {phoneDisplay}
            </a>
            <WhatsAppLink
              number={whatsappNumber}
              className="mt-2 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              Escribir por WhatsApp
            </WhatsAppLink>
            <p className="mt-3 flex items-center gap-2 text-sm">
              <Clock size={14} /> Lun a Sáb, 7 a.m. — 6 p.m.
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm">
              <MapPin size={14} /> Bogotá y Sabana
            </p>
          </div>
        </div>
        <div className="text-sm border-t border-white/10 pt-7 flex flex-col sm:flex-row gap-2 sm:justify-between text-white/60">
          <span>© {new Date().getFullYear()} ObraTech Bogotá</span>
          <Link href="/privacidad" className="hover:text-white transition-colors">
            Datos personales
          </Link>
        </div>
      </div>
    </footer>
  );
}
