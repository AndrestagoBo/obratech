import { PROCESO_TRABAJO } from "@/lib/content";
import { SectionHeading } from "@/components/section-heading";

export function Process() {
  return (
    <section id="proceso" className="section-pad border-t border-white/10 bg-surface">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading
          size="sm"
          eyebrow="Cómo funciona"
          title="Cuatro pasos."
          lead="Del problema a la solución. Sin vueltas."
        />

        <ol className="grid md:grid-cols-4 border-t border-white/10">
          {PROCESO_TRABAJO.map((p) => (
            <li
              key={p.paso}
              className="py-8 md:py-10 md:pr-8 md:border-r md:border-white/10 last:border-r-0 last:pr-0"
            >
              <div className="flex items-center gap-3 mb-6">
                <p.icon className="w-5 h-5 text-brand" aria-hidden />
                <span className="text-brand text-sm font-bold tracking-tight">{p.paso}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-3 leading-tight">
                {p.titulo}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">{p.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
