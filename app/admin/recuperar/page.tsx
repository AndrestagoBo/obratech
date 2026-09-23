import type { Metadata } from "next";
import { RecoverForm } from "@/components/admin/recover-form";

export const metadata: Metadata = {
  title: "Recuperar contraseña | ObraTech",
  robots: { index: false, follow: false },
};

export default function RecuperarPage() {
  return (
    <div id="contenido">
      <RecoverForm />
    </div>
  );
}
