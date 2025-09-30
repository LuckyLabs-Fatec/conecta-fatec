import Image from "next/image";

export interface LoginAsideProps {
  title?: string;
  description?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
}

export const LoginAside = ({
  title = "Fatec Conecta",
  description = "Conectando a comunidade com soluções acadêmicas inovadoras. Transforme problemas reais em projetos estudantis.",
  logoSrc = "/logo.svg",
  logoAlt = "Logo Fatec Conecta",
  logoWidth = 80,
  logoHeight = 80
}: LoginAsideProps) => {
  return (
    <aside 
      className="hidden md:flex md:w-1/2 bg-[#CB2616] p-8 h-screen text-white flex-col items-center justify-center gap-6"
      aria-label="Seção de identidade visual do Fatec Conecta"
    >
      <div className="text-center">
        <Image 
          src={logoSrc} 
          alt={logoAlt} 
          width={logoWidth} 
          height={logoHeight} 
          className="mx-auto mb-4" 
        />
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-red-100 text-lg max-w-md leading-relaxed">
          {description}
        </p>
      </div>
    </aside>
  );
};