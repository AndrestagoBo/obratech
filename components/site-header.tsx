"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoObraTech } from "@/components/logo";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { NAV_LINKS } from "@/lib/content";

export function SiteHeader({ whatsappNumber }: { whatsappNumber: string }) {
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsNavScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`border-b border-white/10 bg-black/90 backdrop-blur-md transition-all duration-300 ${
          isNavScrolled ? "py-3" : "py-4"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0" aria-label="ObraTech Bogotá - Inicio">
            <LogoObraTech preload />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.72rem] font-semibold text-white/80 hover:text-white transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
            <WhatsAppLink number={whatsappNumber} className="btn-ghost !py-2.5 !px-4 !text-[0.65rem]">
              WhatsApp
            </WhatsAppLink>
          </nav>

          <button
            type="button"
            className="lg:hidden text-white min-h-11 min-w-11 inline-flex items-center justify-center"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-nav"
            className="lg:hidden border-t border-white/10 bg-black px-5 py-6 flex flex-col gap-5"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-white min-h-11 inline-flex items-center"
              >
                {link.label}
              </a>
            ))}
            <WhatsAppLink
              number={whatsappNumber}
              onClick={() => setMobileMenuOpen(false)}
              className="btn-ghost justify-center"
            >
              WhatsApp
            </WhatsAppLink>
          </div>
        )}
      </div>
    </header>
  );
}
