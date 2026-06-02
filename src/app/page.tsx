'use client';

import { Button } from "@/presentation/components";
import { Header } from "@/presentation/components";
import { ClipboardList, Library, Hammer, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/presentation/hooks/useAuth";

export default function LandingPage() {
  const { user, canSuggestIdeas } = useAuth();

  return (
    <>
      <Header />
      <main className="bg-[var(--cps-silver-base)]">
        <section
          className="relative overflow-hidden bg-white"
          aria-labelledby="hero-title"
          role="banner"
        >
          <div className="absolute inset-y-0 left-0 w-2 bg-[var(--cps-red-base)]" aria-hidden="true" />
          <div className="mx-auto grid min-h-[520px] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:px-10">
            <div className="flex min-w-0 flex-col items-start gap-6">
              <p className="max-w-full rounded-[30px] bg-[var(--cps-feedback-cancelled-light)] px-4 py-2 text-sm font-medium uppercase tracking-wide text-[var(--cps-red-base)]">
                Centro Paula Souza | Fatec Votorantim
              </p>
              <div>
                <h1 id="hero-title" className="max-w-3xl text-4xl font-bold text-[var(--cps-blue-base)] md:text-5xl">
                  Fatec Conecta
                </h1>
                <p className="mt-5 max-w-2xl text-xl leading-8 text-[var(--cps-gray-text)]">
                  Transforme desafios da comunidade em projetos acadêmicos claros, acompanháveis e conectados à formação dos estudantes.
                </p>
              </div>
              <nav className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:flex-wrap" aria-label="Ações principais">
                {(canSuggestIdeas() || !user) && (
                  <>
                    <Link href="/submeter-proposta">
                      <Button
                        label="Sugira uma ideia de melhoria"
                        onClick={() => { }}
                        variant="primary"
                        size="large"
                        aria-describedby="sugira-ideia-desc"
                        className="w-full sm:w-auto"
                      />
                    </Link>
                    <span id="sugira-ideia-desc" className="sr-only">
                      Acesse o formulário para sugerir melhorias para sua comunidade
                    </span>
                  </>
                )}
                <Link href="/acompanhar-projetos" className="inline-flex w-full items-center justify-center gap-2 rounded-[30px] border border-[var(--cps-blue-base)] bg-white px-7 py-3 text-lg font-medium text-[var(--cps-blue-base)] shadow-[var(--cps-shadow-1)] transition-colors hover:bg-[var(--cps-gray-hover)] sm:w-auto">
                  Acompanhar projetos
                  <ArrowRight size={20} aria-hidden="true" />
                </Link>
              </nav>
            </div>

            <div className="cps-card min-w-0 p-6 sm:p-8">
              <p className="text-sm font-medium uppercase tracking-wide text-[var(--cps-red-base)]">
                Fluxo institucional
              </p>
              <h2 className="mt-3 text-xl font-bold text-[var(--cps-blue-base)] sm:text-2xl">
                Da demanda local ao projeto aplicado
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  ['1', 'Comunidade registra uma necessidade real.'],
                  ['2', 'Mediação organiza e qualifica a proposta.'],
                  ['3', 'Estudantes acompanham e desenvolvem a solução.'],
                ].map(([step, text]) => (
                  <div key={step} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--cps-blue-base)] text-sm font-bold text-white">
                      {step}
                    </span>
                    <p className="text-[var(--cps-gray-text)]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="flex flex-col items-center bg-[var(--cps-silver-base)] px-6 py-12 text-center"
          aria-labelledby="mission-title"
        >
          <h2 id="mission-title" className="text-3xl font-bold text-[var(--cps-blue-base)]">Nossa Missão</h2>
          <p className="mt-4 max-w-4xl text-xl leading-8 text-[var(--cps-gray-text)]">
            O Fatec Conecta cria um espaço colaborativo onde a comunidade pode expor desafios cotidianos, e estudantes da Fatec Votorantim desenvolvem soluções inovadoras. Contribuímos para os Objetivos de Desenvolvimento Sustentável da ONU: ODS-16 (Paz, Justiça e Instituições Eficazes) e ODS-17 (Parcerias e Meios de Implementação).
          </p>
          <div
            className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2"
            role="list"
            aria-label="Objetivos de Desenvolvimento Sustentável da ONU"
          >
            <article
              className="cps-card p-6"
              role="listitem"
              aria-labelledby="ods-16-title"
            >
              <h3 id="ods-16-title" className="mb-2 font-bold text-[var(--cps-blue-base)]">ODS-16</h3>
              <p className="text-sm text-[var(--cps-gray-text)]" aria-describedby="ods-16-title">
                Paz, Justiça e Instituições Eficazes
              </p>
            </article>
            <article
              className="cps-card p-6"
              role="listitem"
              aria-labelledby="ods-17-title"
            >
              <h3 id="ods-17-title" className="mb-2 font-bold text-[var(--cps-blue-base)]">ODS-17</h3>
              <p className="text-sm text-[var(--cps-gray-text)]" aria-describedby="ods-17-title">
                Parcerias e Meios de Implementação
              </p>
            </article>
          </div>
          <Link href="/submeter-proposta" className="mt-8">
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
          className="flex flex-col items-center bg-white px-6 py-14 text-center"
          aria-labelledby="how-it-works-title"
        >
          <h2 id="how-it-works-title" className="text-3xl font-bold text-[var(--cps-blue-base)]">Como Funciona</h2>
          <ol
            className="relative mt-10 w-full max-w-4xl space-y-8 border-l border-[var(--cps-gray-light)] pl-6 text-left md:pl-10"
            aria-label="Linha do tempo do processo Fatec Conecta"
          >
            <li className="relative">
              <header className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--cps-blue-base)] text-white shadow-[var(--cps-shadow-1)]">
                  <ClipboardList size={20} aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-[var(--cps-blue-base)]">Sugestão da Comunidade</h3>
              </header>
              <p className="mt-2 leading-relaxed text-[var(--cps-gray-text)]">
                Cidadãos e organizações locais enviam ideias de melhoria e relatam desafios reais da cidade.
              </p>
            </li>
            <li className="relative">
              <header className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--cps-blue-base)] text-white shadow-[var(--cps-shadow-1)]">
                  <Library size={20} aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-[var(--cps-blue-base)]">Análise Acadêmica</h3>
              </header>
              <p className="mt-2 leading-relaxed text-[var(--cps-gray-text)]">
                Mediação e coordenação analisam e priorizam as sugestões. As turmas transformam as ideias em escopo de projeto.
              </p>
            </li>
            <li className="relative">
              <header className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--cps-blue-base)] text-white shadow-[var(--cps-shadow-1)]">
                  <Hammer size={20} aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-[var(--cps-blue-base)]">Desenvolvimento de Soluções</h3>
              </header>
              <p className="mt-2 leading-relaxed text-[var(--cps-gray-text)]">
                Estudantes desenvolvem protótipos e soluções aplicadas, acompanhando resultados e impacto na comunidade.
              </p>
            </li>
          </ol>
          <div className="mt-8">
            <p className="mb-4 text-lg text-[var(--cps-gray-text)]">
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
          className="flex flex-col items-center bg-[var(--cps-silver-base)] px-6 py-12 text-center"
          aria-labelledby="cta-title"
        >
          <h2 id="cta-title" className="text-3xl font-bold text-[var(--cps-blue-base)]">Faça Parte da Mudança</h2>
          <p className="max-w-3xl text-xl leading-8 text-[var(--cps-gray-text)]">
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
        className="bg-[var(--cps-blue-base)] p-4 text-center text-white"
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
