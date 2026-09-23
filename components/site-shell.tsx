import { SiteHeader } from "@/components/site-header";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { TopBar } from "@/components/sections/top-bar";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Projects } from "@/components/sections/projects";
import { Testimonials } from "@/components/sections/testimonials";
import { FaqCoverage } from "@/components/sections/faq-coverage";
import { ContactForm } from "@/components/sections/contact-form";
import { WhyUs } from "@/components/sections/why-us";
import { FinalCta } from "@/components/sections/final-cta";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteAssistant } from "@/components/site-assistant";
import { withServiceIcons } from "@/lib/content";
import type { SiteContent } from "@/lib/site-store";

export function SiteShell({ site, contacto = false }: { site: SiteContent; contacto?: boolean }) {
  const servicios = withServiceIcons(site.servicios);
  const hogarImage = servicios.find((s) => s.id === "locativa")?.bgImage || site.heroImage;
  const exteriores = servicios.filter((s) =>
    ["fachadas", "impermeabilizacion", "remodelaciones"].includes(s.id),
  );

  return (
    <div
      className={`min-h-screen bg-background text-foreground${contacto ? " pb-[6.75rem] md:pb-0" : ""}`}
    >
      <TopBar phoneDisplay={site.phoneDisplay} />
      <SiteHeader whatsappNumber={site.whatsappNumber} />
      <main id="contenido">
        <Hero heroImage={site.heroImage} whatsappNumber={site.whatsappNumber} />
        <Projects proyectos={site.proyectos} />
        <TrustBar badges={site.badges} />
        <Services hogarImage={hogarImage} inicio={site.serviciosInicio} exteriores={exteriores} />
        <Process />
        <WhyUs items={site.porqueNosotros} image={site.nosotrosImage} fondo={site.nosotrosFondo} />
        <Testimonials visible={site.mostrarTestimonios} testimonios={site.testimonios} />
        <FaqCoverage faq={site.faq} />
        <FinalCta />
        {contacto ? <ContactForm phoneDisplay={site.phoneDisplay} zonas={site.zonas} /> : null}
      </main>
      <SiteFooter
        phoneDisplay={site.phoneDisplay}
        whatsappNumber={site.whatsappNumber}
        empresa={site.empresa}
      />
      {contacto ? (
        <>
          <SiteAssistant key="assistant-hogar-v9" whatsappNumber={site.whatsappNumber} />
          <MobileActionBar whatsappNumber={site.whatsappNumber} />
        </>
      ) : null}
    </div>
  );
}
