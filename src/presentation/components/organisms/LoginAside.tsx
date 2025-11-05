export interface LoginAsideProps {
  title?: string;
  description?: string;
}

export const LoginAside = ({
  title = "Fatec Conecta",
  description = "Conectando a comunidade com soluções acadêmicas inovadoras. Transforme problemas reais em projetos estudantis.",
}: LoginAsideProps) => {
  return (
    <aside 
      className="h-auto hidden md:flex md:w-1/2 bg-[#b20000] p-8 text-white flex-col items-center justify-center gap-6"
      aria-label="Seção de identidade visual do Fatec Conecta"
    >
      <div className="text-center">
  <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-montserrat), sans-serif', color: '#FCFCFC' }}>{title}</h1>
        <p className="text-red-100 text-lg max-w-md leading-relaxed">
          {description}
        </p>
      </div>
    </aside>
  );
};
