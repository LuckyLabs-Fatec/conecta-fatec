'use client';
import { Button } from "@/presentation/components";
import { Header } from "@/presentation/components";
import { ClipboardList, Library, Hammer } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/presentation/hooks/useAuth";

export default function LandingPage() {
  const { user, canSuggestIdeas } = useAuth();

  return (
    <>
      <Header />
      <main>
        <section
          className="relative flex flex-col items-center justify-center text-center p-8 gap-6 min-h-[500px] bg-black"
          aria-labelledby="hero-title"
          role="banner"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')"
            }}
            aria-hidden="true"
            role="img"
            aria-label="Imagem de fundo com estudantes colaborando em projetos, simbolizando a inovação e parceria entre comunidade e universidade"
          />
          <div className="absolute inset-0 bg-black opacity-40" aria-hidden="true" />
          <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto">
            <h1 id="hero-title" className="text-white text-4xl font-bold">Fatec Conecta</h1>
            <p className="text-white text-xl">
              Transforme os desafios da sua comunidade em projetos estudantis inovadores.
              Conectamos problemas reais com soluções acadêmicas desenvolvidas pelos alunos da Fatec Votorantim.
            </p>
            <nav className="flex gap-4 flex-wrap justify-center" aria-label="Ações principais">
              {canSuggestIdeas() && (
                <>
                  <Link href="/submeter-proposta">
                    <Button
                      label="Sugira uma ideia de melhoria"
                      onClick={() => { }}
                      variant="primary"
                      size="large"
                      aria-describedby="sugira-ideia-desc"
                    />
                  </Link>
                  <span id="sugira-ideia-desc" className="sr-only">
                    Acesse o formulário para sugerir melhorias para sua comunidade
                  </span>
                </>
              )}
              {!user && (
                <>
                  <Link href="/submeter-proposta">
                    <Button
                      label="Sugira uma ideia de melhoria"
                      onClick={() => { }}
                      variant="primary"
                      size="large"
                      aria-describedby="sugira-ideia-desc-guest"
                    />
                  </Link>
                  <span id="sugira-ideia-desc-guest" className="sr-only">
                    Acesse o formulário para sugerir melhorias para sua comunidade
                  </span>
                </>
              )}

            </nav>
          </div>
        </section>

        <section
          className="flex flex-col items-center bg-gray-100 text-center p-8 gap-6"
          aria-labelledby="mission-title"
        >
          <h2 id="mission-title" className="text-3xl font-bold">Nossa Missão</h2>
          <p className="text-gray-500 text-xl max-w-4xl">
            O Fatec Conecta cria um espaço colaborativo onde a comunidade pode expor desafios cotidianos, e estudantes da Fatec Votorantim desenvolvem soluções inovadoras. Contribuímos para os Objetivos de Desenvolvimento Sustentável da ONU: ODS-16 (Paz, Justiça e Instituições Eficazes) e ODS-17 (Parcerias e Meios de Implementação).
          </p>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            role="list"
            aria-label="Objetivos de Desenvolvimento Sustentável da ONU"
          >
            <article
              className="bg-white p-4 rounded-lg shadow-md"
              role="listitem"
              aria-labelledby="ods-16-title"
            >
              <h3 id="ods-16-title" className="font-bold text-[var(--cps-blue-base)] mb-2">ODS-16</h3>
              <p className="text-sm text-gray-600" aria-describedby="ods-16-title">
                Paz, Justiça e Instituições Eficazes
              </p>
            </article>
            <article
              className="bg-white p-4 rounded-lg shadow-md"
              role="listitem"
              aria-labelledby="ods-17-title"
            >
              <h3 id="ods-17-title" className="font-bold text-[var(--cps-blue-base)] mb-2">ODS-17</h3>
              <p className="text-sm text-gray-600" aria-describedby="ods-17-title">
                Parcerias e Meios de Implementação
              </p>
            </article>
          </div>
          <Link href="/submeter-proposta">
            <Button
              label="Sugira uma ideia de melhoria"
              onClick={() => { }}
              variant="primary"
              size="large"
              aria-describedby="mission-cta-desc"
            />
          </Link>
          <span id="mission-cta-desc" className="sr-only">
            Comece a fazer a diferença relatando um problema da sua comunidade
          </span>
        </section>

        <section
          className="flex flex-col items-center bg-neutral-900 text-center p-10 gap-8"
          aria-labelledby="how-it-works-title"
        >
          <h2 id="how-it-works-title" className="text-neutral-50 text-2xl font-bold">Como Funciona</h2>
          <ol
            className="relative w-full max-w-4xl text-left border-l border-neutral-700 pl-6 md:pl-10 space-y-10 md:space-y-12"
            aria-label="Linha do tempo do processo Fatec Conecta"
          >
            <li className="relative">
              <header className="flex items-center gap-3 text-neutral-200">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[#DA3115] text-neutral-50 shadow-sm">
                  <ClipboardList size={18} className="text-neutral-50" aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-neutral-100">Sugestão da Comunidade</h3>
              </header>
              <p className="mt-2 text-neutral-300 leading-relaxed">
                Cidadãos e organizações locais enviam ideias de melhoria e relatam desafios reais da cidade.
              </p>
            </li>
            <li className="relative">
              <header className="flex items-center gap-3 text-neutral-200">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[#DA3115] text-neutral-50 shadow-sm">
                  <Library size={18} className="text-neutral-50" aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-neutral-100">Análise Acadêmica</h3>
              </header>
              <p className="mt-2 text-neutral-300 leading-relaxed">
                Mediação e coordenação analisam e priorizam as sugestões. As turmas transformam as ideias em escopo de projeto.
              </p>
            </li>
            <li className="relative">
              <header className="flex items-center gap-3 text-neutral-200">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[#DA3115] text-neutral-50 shadow-sm">
                  <Hammer size={18} className="text-neutral-50" aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-neutral-100">Desenvolvimento de Soluções</h3>
              </header>
              <p className="mt-2 text-neutral-300 leading-relaxed">
                Estudantes desenvolvem protótipos e soluções aplicadas, acompanhando resultados e impacto na comunidade.
              </p>
            </li>
          </ol>
          <div className="mt-8">
            <p className="text-neutral-200 text-lg mb-4">
              Acompanhe o progresso dos projetos em desenvolvimento e veja como suas ideias se transformam em soluções reais.
            </p>
            <Link href="/acompanhar-projetos">
              <Button
                label="Acompanhar Projetos"
                onClick={() => { }}
                variant="secondary"
                size="large"
                aria-describedby="track-projects-desc"
              />
            </Link>
            <span id="track-projects-desc" className="sr-only">
              Veja o andamento dos projetos em desenvolvimento pelos estudantes da Fatec
            </span>
          </div>
        </section>

        <section
          className="flex flex-col items-center bg-gray-100 text-center p-8 gap-6"
          aria-labelledby="cta-title"
        >
          <h2 id="cta-title" className="text-3xl font-bold text-gray-800">Faça Parte da Mudança</h2>
          <p className="text-gray-500 text-xl max-w-3xl">
            Sua voz importa! Compartilhe suas ideias de melhoria para a comunidade e ajude os estudantes da Fatec a criar soluções que fazem a diferença. Juntos, construímos uma sociedade mais justa e eficaz.
          </p>
          <Link href="/submeter-proposta">
            <Button
              label="Sugira uma Ideia de Melhoria"
              onClick={() => { }}
              variant="primary"
              size="large"
              aria-describedby="final-cta-desc"
            />
          </Link>
          <span id="final-cta-desc" className="sr-only">
            Acesse o formulário para iniciar o processo de sugestão de melhorias comunitárias
          </span>
        </section>
      </main>

      <footer
        className="bg-[var(--cps-blue-base)] text-white text-center p-4"
        role="contentinfo"
        aria-label="Informações do rodapé"
      >
        <p>
          <span aria-label="Copyright">&copy;</span> 2025 Fatec Conecta - Uma parceria entre Lucky Labs e Fatec Votorantim.
        </p>
      </footer>
    </>
  );
}
