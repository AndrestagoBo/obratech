"use client";

import { WhatsAppLink } from "@/components/whatsapp-link";
import { openAssistant } from "@/components/open-assistant-button";

export function MobileActionBar({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-black pb-[env(safe-area-inset-bottom)]">
      <div className="grid min-h-12 grid-cols-[1.4fr_1fr]">
        <button
          type="button"
          onClick={openAssistant}
          className="min-h-11 bg-brand py-3.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-black"
        >
          Cuéntanos
        </button>
        <WhatsAppLink
          number={whatsappNumber}
          className="flex min-h-11 items-center justify-center py-3.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/80"
          aria-label="Abrir WhatsApp"
        >
          WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}
