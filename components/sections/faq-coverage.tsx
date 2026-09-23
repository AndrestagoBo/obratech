import { ArrowRight } from "lucide-react";
import { OpenAssistantButton } from "@/components/open-assistant-button";
import { SectionHeading } from "@/components/section-heading";
import type { SiteFaq } from "@/lib/site-store";

export function FaqCoverage({ faq }: { faq: SiteFaq[] }) {
  return (
    <section id="cobertura" className="section-pad border-t border-white/10 bg-surface">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              size="sm"
              eyebrow="Cobertura"
              title="Dónde llegamos."
              lead="Bogotá y la Sabana. Confirmamos el barrio al coordinar."
            />
            <OpenAssistantButton className="btn-ghost mt-2">
              Consultar cobertura <ArrowRight className="arrow-animate w-4 h-4" />
            </OpenAssistantButton>
          </div>

          <div className="lg:col-span-7 lg:pt-4">
            <p className="section-eyebrow mb-6">Preguntas</p>
            <div className="space-y-0 border-t border-white/10">
              {faq.map((item) => (
                <details key={item.q} className="group py-5 border-b border-white/10">
                  <summary className="cursor-pointer list-none text-lg md:text-xl font-semibold tracking-tight text-white flex items-start justify-between gap-4">
                    <span>{item.q}</span>
                    <span
                      aria-hidden
                      className="text-white/60 shrink-0 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm md:text-base text-white/65 leading-relaxed max-w-2xl">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
