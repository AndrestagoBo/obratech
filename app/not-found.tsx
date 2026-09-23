import Link from "next/link";
import { LogoObraTech } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-5 md:px-8 py-6 border-b border-white/10">
        <Link href="/" aria-label="ObraTech Bogotá - Inicio">
          <LogoObraTech />
        </Link>
      </header>
      <main id="contenido" className="flex-1 flex flex-col justify-center px-5 md:px-8 py-20 max-w-[1400px] mx-auto w-full">
        <p className="section-eyebrow mb-4">404</p>
        <h1 className="section-title-sm max-w-xl">Esta página no existe.</h1>
        <p className="section-lead">Vuelve al inicio y cuéntanos qué necesita tu hogar.</p>
        <p className="mt-8">
          <Link href="/" className="btn-primary">
            Ir al inicio
          </Link>
        </p>
      </main>
    </div>
  );
}
