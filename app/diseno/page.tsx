import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { readSiteContent } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Diseño",
  robots: { index: false, follow: false },
};

export default async function DisenoPage() {
  const site = await readSiteContent();
  return <SiteShell site={site} />;
}
