import { ArrowRight } from "lucide-react";
import { OpenAssistantButton } from "@/components/open-assistant-button";

export function FinalCta() {
  return (
    <section className="border-t border-white/10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8 md:py-16">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Cuéntanos el problema.</h2>
          <p className="mt-2 max-w-xl text-white/60">Te decimos qué implica y decides con calma.</p>
        </div>
        <OpenAssistantButton className="btn-primary shrink-0">
          Cuéntanos qué necesitas <ArrowRight className="arrow-animate h-4 w-4" />
        </OpenAssistantButton>
      </div>
    </section>
  );
}
