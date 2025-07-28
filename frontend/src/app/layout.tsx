// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Multi Mídia Outdoor | Paracatu",
  description:
    "A maior cobertura em Outdoor de Paracatu. Grandes ideias merecem Grandes Formatos.",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
