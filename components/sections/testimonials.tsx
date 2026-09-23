import { SectionHeading } from "@/components/section-heading";
import type { SiteTestimonio } from "@/lib/site-store";

function RatingMarks({ value }: { value: number }) {
  const n = Math.min(5, Math.max(1, Math.round(value)));
  return (
    <p className="flex items-center gap-1" aria-label={`Calificación ${n} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-4 ${i <= n ? "bg-brand" : "bg-white/20"}`}
        />
      ))}
    </p>
  );
}

export function Testimonials({
  visible = true,
  testimonios,
}: {
  visible?: boolean;
  testimonios: SiteTestimonio[];
}) {
  const published = testimonios.filter((item) => item.visible !== false && item.texto.trim() && item.name.trim());
  const [featured, ...rest] = published;

  if (!visible || !featured) return null;

  return (
    <section id="testimonios" className="section-pad border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading size="sm" eyebrow="Clientes" title="Lo dicen ellos." />

        <figure className="border-t border-white/10 pt-8 md:pt-10 max-w-3xl">
          <RatingMarks value={featured.rating} />
          <blockquote className="mt-4 text-2xl md:text-4xl font-medium tracking-tight text-white leading-[1.2]">
            “{featured.texto}”
          </blockquote>
          <figcaption className="mt-6 text-sm text-white/60">
            {featured.name} · {featured.barrio}
            {featured.proyecto ? ` · ${featured.proyecto}` : ""}
          </figcaption>
        </figure>

        {rest.length ? (
          <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-8 md:gap-16 border-t border-white/10 pt-8">
            {rest.map((testimonio) => (
              <figure key={`${testimonio.name}-${testimonio.barrio}`}>
                <RatingMarks value={testimonio.rating} />
                <blockquote className="mt-3 text-lg md:text-xl leading-relaxed text-white/80">
                  “{testimonio.texto}”
                </blockquote>
          <figcaption className="mt-4 text-sm text-white/60">
                  {testimonio.name} · {testimonio.barrio}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
