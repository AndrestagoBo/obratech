import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { OpenAssistantButton } from "@/components/open-assistant-button";
import type { SiteServicioInicio } from "@/lib/site-store";

type ExteriorItem = {
  id: string;
  title: string;
  desc: string;
  bgImage: string;
};

export function Services({
  hogarImage,
  inicio,
  exteriores,
}: {
  hogarImage: string;
  inicio: SiteServicioInicio[];
  exteriores: ExteriorItem[];
}) {
  return (
    <section id="servicios" className="section-pad px-5 md:px-8 max-w-[1400px] mx-auto">
      <div className="grid lg:grid-cols-12 gap-8 mb-10 md:mb-12">
        <div className="lg:col-span-8">
          <SectionHeading
            eyebrow="Servicios"
            title="Para tu hogar."
            lead="Toca el que se parezca a tu caso y te preguntamos el resto."
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
        <div className="relative min-h-[22rem] lg:min-h-[36rem] lg:col-span-5 overflow-hidden bg-surface">
          <Image
            src={hogarImage}
            alt="Trabajos en el hogar"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 right-6 text-sm text-white/80">
            Un contacto para lo puntual y para lo grande.
          </p>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-end">
          {inicio.map((s, index) => (
            <OpenAssistantButton
              key={s.id}
              className="group w-full text-left py-5 md:py-6 border-t border-white/10 grid grid-cols-[3.5rem_1fr] md:grid-cols-[4.5rem_1fr_auto] gap-3 md:gap-6 items-baseline"
            >
              <span className="text-lg md:text-xl font-bold text-white/25 tracking-tighter tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-2xl md:text-4xl font-bold tracking-tight text-white group-hover:text-brand transition-colors">
                  {s.title}
                </span>
                <span className="block mt-1 text-sm text-white/55 leading-relaxed md:hidden">
                  {s.desc}
                </span>
              </span>
              <span className="hidden md:block text-sm text-white/60 max-w-[16rem] text-right leading-relaxed group-hover:text-white/80 transition-colors">
                {s.desc}
              </span>
            </OpenAssistantButton>
          ))}
          <div className="pt-8 mt-2 grid sm:grid-cols-2 gap-8 border-t border-white/10">
            <div>
              <p className="section-eyebrow mb-2">Soluciones rápidas</p>
              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                Cortinas · lámparas · repisas · espejos · grifería · tomas
              </p>
            </div>
            <div>
              <p className="section-eyebrow mb-2">Proyectos</p>
              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                Pintura de apartamento · baño · cocina
              </p>
            </div>
          </div>
        </div>
      </div>

      {exteriores.length ? (
        <div className="mt-16 md:mt-24">
          <p className="section-eyebrow mb-4">Exteriores</p>
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3 max-w-xl leading-[1.05]">
            Fachadas y cubiertas.
          </h3>
          <p className="text-white/60 text-sm md:text-base max-w-md mb-8">
            Pintura exterior, impermeabilización y trabajos especiales. No es lo mismo que colgar
            una cortina: lo vemos aparte.
          </p>
          <div className="grid md:grid-cols-12 gap-3 md:gap-4">
            {exteriores.map((s, index) => (
              <article
                key={s.id}
                className={`relative overflow-hidden bg-surface min-h-[16rem] ${
                  index === 0 ? "md:col-span-7 md:min-h-[22rem]" : "md:col-span-5 md:min-h-[22rem]"
                } ${index === 2 ? "md:col-span-12 md:min-h-[16rem]" : ""}`}
              >
                <Image
                  src={s.bgImage}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-2xl md:text-3xl font-bold tracking-tight text-white">{s.title}</p>
                  <p className="mt-1 text-sm text-white/65">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
