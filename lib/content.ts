import {
  Award,
  Building,
  Droplets,
  FileText,
  HardHat,
  MessageCircle,
  Paintbrush,
  Plug,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { SiteContent, SiteServicio } from "@/lib/site-store";

export const NAV_LINKS = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#proceso", label: "Cómo funciona" },
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#cobertura", label: "Cobertura" },
  { href: "/#contacto", label: "Contacto" },
] as const;

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  locativa: Wrench,
  impermeabilizacion: Droplets,
  fachadas: Paintbrush,
  remodelaciones: Building,
  pintura: Paintbrush,
  plomeria: Droplets,
  electricidad: Plug,
  instalaciones: Wrench,
};

export function withServiceIcons(servicios: SiteServicio[]) {
  return servicios.map((s) => ({
    ...s,
    icon: SERVICE_ICONS[s.id] ?? Building,
  }));
}

export function whatsappUrl(number: string, servicio?: string) {
  const baseMsg = "Hola ObraTech Bogotá, vi su página.";
  const serviceMsg = servicio
    ? ` Necesito ayuda con: ${servicio}.`
    : " Necesito resolver algo en el hogar.";
  return `https://wa.me/${number}?text=${encodeURIComponent(baseMsg + serviceMsg)}`;
}

export function whatsappCustomUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const PROCESO_TRABAJO: {
  paso: string;
  titulo: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  {
    paso: "01",
    titulo: "Cuéntanos qué necesitas",
    desc: "Sin términos técnicos. El problema en tus palabras basta.",
    icon: MessageCircle,
  },
  {
    paso: "02",
    titulo: "Entendemos el trabajo",
    desc: "Organizamos la solicitud y vemos qué hace falta.",
    icon: FileText,
  },
  {
    paso: "03",
    titulo: "Te contactamos",
    desc: "Revisamos el alcance y armamos la cotización por WhatsApp.",
    icon: HardHat,
  },
  {
    paso: "04",
    titulo: "Lo resolvemos",
    desc: "Coordinamos la ejecución cuando el alcance está claro.",
    icon: Award,
  },
];

export type { SiteContent };
