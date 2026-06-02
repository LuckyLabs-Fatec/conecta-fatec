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
      className="h-auto hidden md:flex md:w-1/2 bg-[var(--cps-red-base)] p-10 text-white flex-col items-center justify-center gap-8"
      aria-label="Seção de identidade visual do Fatec Conecta"
    >
      <div className="max-w-md text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-white/80">
          Centro Paula Souza
        </p>
        <h1 className="mb-4 text-4xl font-bold !text-white">
          {title}
        </h1>
        <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-[var(--cps-blue-highlight)]" aria-hidden="true" />
        <p className="text-lg leading-relaxed text-white/90">
          {description}
        </p>
      </div>
    </aside>
  );
};
