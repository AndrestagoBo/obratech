import Image from "next/image";
import { Check } from "lucide-react";

export function WhyUs({
  items,
  image,
  fondo,
}: {
  items: { t: string; d: string }[];
  image: string;
  fondo?: string;
}) {
  return (
    <section id="nosotros" className="relative overflow-hidden border-t border-white/10 bg-black">
      {fondo ? (
        <>
          <Image src={fondo} alt="" fill className="object-cover opacity-35" sizes="100vw" />
          <div className="absolute inset-0 bg-black/80" />
        </>
      ) : null}
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-8 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-12">
        <div className="relative min-h-[14rem] overflow-hidden lg:col-span-4 lg:min-h-[18rem]">
          <Image
            src={image}
            alt="Trabajo en un hogar con ObraTech"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 34vw"
          />
        </div>

        <div className="lg:col-span-8">
          <p className="section-eyebrow mb-3">Por qué ObraTech</p>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Un contacto. Varias soluciones.
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item.t} className="grid grid-cols-[1.75rem_1fr] gap-3">
                <Check className="mt-0.5 h-5 w-5 text-brand" aria-hidden />
                <div>
                  <h3 className="font-bold tracking-tight text-white">{item.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">{item.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
