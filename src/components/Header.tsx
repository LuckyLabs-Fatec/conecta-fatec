import Image from "next/image";
import { Button } from "./Button";
import Link from "next/link";

export const Header = () => (
  <header className="bg-[#CB2616] text-white p-4 flex items-center justify-between">
    <span className="flex items-center">
      <Image src="/logo.svg" alt="Logo" width={40} height={40} className="inline-block mr-2" />
      <h1 className="text-2xl font-bold">Fatec Conecta</h1>
    </span>
    <Link href="/login">
      <Button label="Login" onClick={() => {}} variant="secondary" size="medium" />
    </Link>
  </header>
);