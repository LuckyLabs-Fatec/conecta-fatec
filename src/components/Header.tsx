'use client';
import Image from "next/image";

export const Header = () => (
  <header className="bg-[#CB2616] text-white p-4 flex items-center justify-between">
    <span aria-describedby="logo-description" className="flex items-center">
      <Image src="/logo.svg" alt="Logo" width={40} height={40} className="inline-block mr-2" />
      <h1 className="text-2xl font-bold">Fatec Conecta</h1>
    </span>
  </header>
);