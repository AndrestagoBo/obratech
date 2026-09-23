import { Check, Clock, FileText, MapPin, ShieldCheck, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Los badges se editan como texto libre desde el panel, así que el icono se
// deduce de lo que diga. Si no coincide con nada, queda el chulo genérico.
const ICON_RULES: { icon: LucideIcon; words: string[] }[] = [
  { icon: ShieldCheck, words: ["garantía", "garantia", "respaldo", "seguro"] },
  { icon: FileText, words: ["cotización", "cotizacion", "cotizar", "presupuesto", "sin costo"] },
  { icon: Wrench, words: ["oficio", "contacto", "servicio", "trabajo", "reparaci"] },
  { icon: MapPin, words: ["bogotá", "bogota", "sabana", "zona", "cobertura"] },
  { icon: Clock, words: ["lun", "sáb", "sab", "horario", "a.m.", "p.m."] },
];

function badgeIcon(badge: string): LucideIcon {
  const text = badge.toLowerCase();
  return ICON_RULES.find((rule) => rule.words.some((w) => text.includes(w)))?.icon ?? Check;
}

export function TrustBar({ badges }: { badges: string[] }) {
  return (
    <div className="border-y border-white/10 bg-black">
      <ul className="max-w-[1400px] mx-auto px-5 md:px-8 grid sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => {
          const Icon = badgeIcon(badge);
          return (
            <li
              key={badge}
              className="flex items-center gap-3 py-5 lg:py-6 text-sm text-white/80 border-b border-white/10 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:border-white/10 lg:px-6 first:lg:pl-0 last:lg:border-r-0 last:lg:pr-0"
            >
              <Icon className="w-4 h-4 shrink-0 text-brand" aria-hidden />
              <span>{badge}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
