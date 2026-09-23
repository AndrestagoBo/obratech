import Image from "next/image";
import type { SiteProyecto } from "@/lib/site-store";

export function Projects({ proyectos }: { proyectos: SiteProyecto[] }) {
  return (
    <section id="proyectos" className="bg-black px-5 pt-8 pb-16 md:px-8 md:pt-12 md:pb-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6 flex items-end justify-between gap-6 md:mb-8">
          <div>
            <p className="section-eyebrow mb-3">Proyectos</p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Trabajos reales.</h2>
          </div>
          <p className="hidden max-w-xs text-sm text-white/60 md:block">Bogotá y la Sabana.</p>
        </div>

        <div className="grid md:grid-cols-12 gap-4">
          {proyectos.map((proy, index) => {
            const span =
              index === 0
                ? "md:col-span-7 min-h-[24rem] md:min-h-[42rem]"
                : index === 1
                  ? "md:col-span-5 min-h-[18rem] md:min-h-[42rem]"
                  : "md:col-span-12 min-h-[20rem] md:min-h-[32rem]";

            const antes = proy.antes?.trim();

            return (
              <figure
                key={`${proy.image}-${proy.title}`}
                className={`group relative overflow-hidden bg-surface ${
                  antes ? "md:col-span-12 min-h-[28rem] md:min-h-[36rem]" : span
                }`}
              >
                {antes ? (
                  <div className="absolute inset-0 grid grid-rows-2 md:grid-rows-1 md:grid-cols-2">
                    <div className="relative min-h-0">
                      <Image
                        src={antes}
                        alt={`Antes: ${proy.title}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <span className="absolute left-4 top-4 bg-black/75 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white">
                        Antes
                      </span>
                    </div>
                    <div className="relative min-h-0 border-t border-white/20 md:border-t-0 md:border-l md:border-white/20">
                      <Image
                        src={proy.image}
                        alt={`Después: ${proy.title}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <span className="absolute left-4 top-4 bg-black/75 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white">
                        Después
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Image
                      src={proy.image}
                      alt={proy.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 70vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  </>
                )}
                <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-black/55">
                  <p className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    {proy.title}
                  </p>
                  {proy.resultado ? (
                    <p className="mt-2 text-sm text-white/80">{proy.resultado}</p>
                  ) : null}
                  <p className="text-sm text-white/60 mt-2">{proy.city}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
