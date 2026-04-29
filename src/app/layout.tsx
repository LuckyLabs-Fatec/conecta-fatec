import type { Metadata } from "next";
import { Noto_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/presentation/components";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fatec Conecta",
  description: "Fatec Conecta - Desenvolvido por LuckyLabs no Curso de DSM da Fatec Votorantim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${montserrat.variable} antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
