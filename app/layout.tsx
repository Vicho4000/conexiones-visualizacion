import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conexiones · Soledad, red de apoyo y bienestar",
  description: "Visualización colaborativa de patrones agregados.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
