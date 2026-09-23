import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopBar } from "@/components/sections/top-bar";
import { readSiteContent } from "@/lib/site-store";

export const metadata: Metadata = {
  title: "Datos personales",
  robots: { index: true, follow: true },
};

export default async function PrivacidadPage() {
  const site = await readSiteContent();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar phoneDisplay={site.phoneDisplay} />
      <SiteHeader whatsappNumber={site.whatsappNumber} />
      <main id="contenido" className="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <p className="section-eyebrow mb-4">Legal</p>
        <h1 className="section-title-sm">Datos personales</h1>
        <div className="mt-8 space-y-6 text-sm md:text-base text-white/70 leading-relaxed">
          <p>
            ObraTech Bogotá trata datos personales según la Ley 1581 de 2012 y el Decreto 1377 de
            2013. Responsable: ObraTech Bogotá. Contacto: {site.phoneDisplay}.
          </p>
          <p>
            Recogemos nombre, celular, zona y descripción del trabajo cuando usas el asesor, el
            formulario o WhatsApp. La finalidad es contactarte, cotizar y coordinar el servicio.
            No vendemos tus datos a terceros.
          </p>
          <p>
            Conservamos la solicitud el tiempo necesario para atenderla y cumplir obligaciones
            legales. Puedes conocer, actualizar o suprimir tus datos, o revocar la autorización,
            escribiéndonos por WhatsApp o al {site.phoneDisplay}.
          </p>
          <p>
            El sitio usa almacenamiento local del chat en tu navegador para no perder la
            conversación. No usamos publicidad de terceros.
          </p>
        </div>
        <p className="mt-10">
          <Link href="/" className="btn-ghost">
            Volver al inicio
          </Link>
        </p>
      </main>
      <SiteFooter
        phoneDisplay={site.phoneDisplay}
        whatsappNumber={site.whatsappNumber}
        empresa={site.empresa}
      />
    </div>
  );
}
