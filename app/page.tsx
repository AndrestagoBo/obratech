import { SiteShell } from "@/components/site-shell";
import { readSiteContent } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const site = await readSiteContent();
  return <SiteShell site={site} contacto />;
}
