import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/presentation/components";
import { ReactQueryProvider } from "@/presentation/providers/ReactQueryProvider";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["100", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fatec Conecta | Centro Paula Souza",
  description: "Fatec Conecta - plataforma acadêmica da Fatec Votorantim alinhada à identidade visual do Centro Paula Souza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.variable} ${robotoSlab.variable} antialiased`}>
        <ReactQueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
