"use client";

import { useEffect, useState } from "react";

export function TopBar({ phoneDisplay }: { phoneDisplay: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`bg-black text-white/70 text-[0.7rem] px-5 md:px-8 border-b border-white/10 overflow-hidden transition-all duration-300 ${
        hidden ? "max-h-0 py-0 border-0 opacity-0" : "max-h-12 py-2 opacity-100"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
        <span>Hogar · Bogotá y Sabana</span>
        <div className="flex gap-6">
          <a
            href={`tel:+${phoneDisplay.replace(/\D/g, "")}`}
            className="hover:text-white transition-colors"
          >
            {phoneDisplay}
          </a>
          <span>Lun — Sáb 7–18</span>
        </div>
      </div>
    </div>
  );
}
