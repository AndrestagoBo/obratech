import { readSiteContent } from "@/lib/site-store";

export async function SiteJsonLd() {
  const site = await readSiteContent();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const phone = site.whatsappNumber.startsWith("57")
    ? `+${site.whatsappNumber}`
    : site.phoneDisplay.replace(/\s/g, "");

  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.siteName,
    url: siteUrl,
    telephone: phone,
    image: `${siteUrl}${site.heroImage}`,
    areaServed: [
      { "@type": "City", name: "Bogotá" },
      { "@type": "AdministrativeArea", name: "Sabana de Bogotá" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "07:00",
      closes: "18:00",
    },
    priceRange: "$$",
    description:
      "Reparaciones, pintura, instalaciones y remodelaciones en Bogotá. Cotización por WhatsApp.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
