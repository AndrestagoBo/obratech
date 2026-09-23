import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";

export const metadata: Metadata = {
  title: "Admin | ObraTech",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div id="contenido">
      <AdminApp />
    </div>
  );
}
