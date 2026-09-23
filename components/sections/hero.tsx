import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { OpenAssistantButton } from "@/components/open-assistant-button";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.428 2.021 13.96 1 11.33 1 5.893 1 1.47 5.371 1.466 10.799c-.001 1.685.453 3.328 1.314 4.767l-.101.484-1.036 3.793 3.882-1.018.493-.292zM17.522 14.34c-.328-.164-1.94-.957-2.242-1.067-.302-.11-.522-.164-.742.164-.22.328-.851 1.067-1.043 1.286-.192.219-.384.247-.712.083-.328-.164-1.386-.51-2.641-1.627-.976-.87-1.635-1.947-1.826-2.275-.192-.328-.02-.505.144-.668.148-.147.328-.384.493-.575.164-.192.219-.328.328-.547.11-.219.055-.411-.027-.575-.082-.164-.742-1.787-1.017-2.45-.269-.648-.542-.56-.742-.57h-.633c-.22 0-.577.082-.879.411-.302.328-1.153 1.123-1.153 2.738 0 1.615 1.18 3.176 1.344 3.395.164.22 2.322 3.546 5.625 4.975.785.34 1.398.543 1.877.696.79.25 1.511.215 2.08.13.634-.094 1.94-.794 2.214-1.56.274-.767.274-1.423.192-1.56-.082-.137-.302-.219-.63-.383z" />
    </svg>
  );
}

export function Hero({
  heroImage,
  whatsappNumber,
}: {
  heroImage: string;
  whatsappNumber: string;
}) {
  return (
    <section className="relative flex min-h-[36rem] items-end overflow-hidden bg-black lg:min-h-[100svh]">
      <Image
        src={heroImage}
        alt="Técnico de ObraTech pintando en un hogar de Bogotá"
        fill
        preload
        sizes="100vw"
        className="object-cover object-[78%_center] lg:object-[70%_center] hero-image"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black from-0% via-black/75 via-[48%] to-transparent to-[82%] lg:via-black/80 lg:via-[42%] lg:to-[78%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />

      <div className="relative z-10 w-full px-5 pt-8 pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:px-8 md:pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-xl">
            <p className="hero-animate hero-delay-1 mb-5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/45">
              Bogotá · Sabana
            </p>
            <h1 className="hero-animate hero-delay-2 font-heading text-[clamp(2rem,6vw,4.35rem)] font-semibold tracking-[-0.045em] text-white leading-[1.02]">
              Soluciones para tu hogar.
              <br />
              Sin complicaciones.
            </h1>
            <div className="hero-animate hero-delay-3 mt-6 max-w-md space-y-3 text-base text-white/70 leading-relaxed md:text-lg">
              <p>Reparaciones, pintura, instalaciones y remodelaciones en Bogotá.</p>
              <p>No necesitas saber qué profesional necesitas. Cuéntanos qué problema tienes.</p>
            </div>
            <div className="hero-animate hero-delay-3 mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <OpenAssistantButton className="btn-primary">
                Cuéntanos qué necesitas <ArrowRight className="arrow-animate w-4 h-4" />
              </OpenAssistantButton>
              <WhatsAppLink
                number={whatsappNumber}
                className="inline-flex h-11 items-center gap-2 border border-white/25 px-4 text-sm font-medium tracking-normal text-white/90 transition-colors hover:border-white/50 hover:bg-white/5"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </WhatsAppLink>
            </div>
            <p className="hero-animate hero-delay-3 mt-4 text-sm text-white/55">
              Te escribimos el mismo día, de lunes a sábado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
