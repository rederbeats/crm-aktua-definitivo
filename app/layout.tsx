import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Aktua Home",
  description: "CRM privado de Aktua Home con Vercel y Supabase"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
