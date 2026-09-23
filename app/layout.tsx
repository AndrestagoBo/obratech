import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteJsonLd } from "@/components/site-json-ld";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ObraTech Bogotá | Soluciones para tu hogar",
    template: "%s | ObraTech Bogotá",
  },
  description:
    "Reparaciones, pintura, instalaciones y remodelaciones en Bogotá. No necesitas saber qué profesional buscar: cuéntanos el problema y cotizamos por WhatsApp.",
  applicationName: "ObraTech Bogotá",
  icons: {
    icon: [{ url: "/images/logo-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/images/logo-icon.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "ObraTech Bogotá",
    title: "ObraTech Bogotá",
    description:
      "Soluciones para tu hogar, sin complicaciones. Cuéntanos el problema; cotizamos por WhatsApp.",
    images: [{ url: "/images/hero-pintor.png", width: 1024, height: 576, alt: "ObraTech" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <a href="#contenido" className="skip-link">
          Ir al contenido
        </a>
        <SiteJsonLd />
        {children}
      </body>
    </html>
  );
}
