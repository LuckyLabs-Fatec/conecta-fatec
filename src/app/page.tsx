'use client';
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { Step } from "@/components/Step";
import { Lightbulb, CheckCircle, Code } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
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
              backgroundImage: "url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')"
            }}
            aria-hidden="true"
            role="img"
            aria-label="Imagem de fundo com peças de quebra-cabeça conectadas, simbolizando a união entre comunidade e universidade"
          />
          <div className="absolute inset-0 bg-black opacity-40" aria-hidden="true" />
          <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto">
            <h1 id="hero-title" className="text-white text-4xl font-bold">Fatec Conecta</h1>
            <p className="text-white text-xl">
              Transforme os desafios da sua comunidade em projetos estudantis inovadores. 
              Conectamos problemas reais com soluções acadêmicas desenvolvidas pelos alunos da Fatec Votorantim.
            </p>
            <nav className="flex gap-4 flex-wrap justify-center" aria-label="Ações principais">
              <Link href="/sugerir-melhoria">
                <Button 
                  label="Sugira uma ideia de melhoria" 
                  onClick={() => {}} 
                  variant="primary" 
                  size="large"
                  aria-describedby="sugira-ideia-desc"
                />
              </Link>
              <span id="sugira-ideia-desc" className="sr-only">
                Acesse o formulário para sugerir melhorias para sua comunidade
              </span>
              <Button 
                label="Conheça o projeto" 
                onClick={() => {}} 
                variant="secondary" 
                size="large"
                aria-describedby="conheca-projeto-desc"
              />
              <span id="conheca-projeto-desc" className="sr-only">
                Saiba mais sobre os objetivos e funcionamento do Fatec Conecta
              </span>
            </nav>
          </div>
        </section>
        
        <section 
          className="flex flex-col items-center bg-gray-100 text-center p-8 gap-6"
          aria-labelledby="mission-title"
        >
          <h2 id="mission-title" className="text-3xl font-bold">Nossa Missão</h2>
          <p className="text-gray-500 text-xl max-w-4xl">
            Com investimento da Lucky Labs, o Fatec Conecta cria um espaço colaborativo onde a comunidade pode expor desafios cotidianos, e estudantes da Fatec Votorantim desenvolvem soluções inovadoras. Contribuímos para os Objetivos de Desenvolvimento Sustentável da ONU: ODS-16 (Paz, Justiça e Instituições Eficazes) e ODS-17 (Parcerias e Meios de Implementação).
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
              <h3 id="ods-16-title" className="font-bold text-red-600 mb-2">ODS-16</h3>
              <p className="text-sm text-gray-600" aria-describedby="ods-16-title">
                Paz, Justiça e Instituições Eficazes
              </p>
            </article>
            <article 
              className="bg-white p-4 rounded-lg shadow-md"
              role="listitem"
              aria-labelledby="ods-17-title"
            >
              <h3 id="ods-17-title" className="font-bold text-red-600 mb-2">ODS-17</h3>
              <p className="text-sm text-gray-600" aria-describedby="ods-17-title">
                Parcerias e Meios de Implementação
              </p>
            </article>
          </div>
          <Link href="/sugerir-melhoria">
            <Button 
              label="Sugira uma ideia de melhoria" 
              onClick={() => {}} 
              variant="primary" 
              size="large"
              aria-describedby="mission-cta-desc"
            />
          </Link>
          <span id="mission-cta-desc" className="sr-only">
            Comece a fazer a diferença sugerindo ideias de melhoria para sua comunidade
          </span>
        </section>

        <section 
          className="flex flex-col items-center bg-[#313131] text-center p-8 gap-6"
          aria-labelledby="how-it-works-title"
        >
          <h2 id="how-it-works-title" className="text-white text-2xl font-bold">Como Funciona</h2>
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
            role="list"
            aria-label="Processo de funcionamento do Fatec Conecta"
          >
            <div role="listitem">
              <Step 
                icon={<Lightbulb size={32} color="#DA3115" aria-hidden="true" />} 
                title="Sugira Melhorias" 
                description="A comunidade compartilha ideias de melhorias e desafios cotidianos em nossa plataforma." 
              />
            </div>
            <div role="listitem">
              <Step 
                icon={<CheckCircle size={32} color="#DA3115" aria-hidden="true" />} 
                title="Análise Acadêmica" 
                description="Estudantes da Fatec Votorantim analisam as sugestões e identificam oportunidades de projetos." 
              />
            </div>
            <div role="listitem">
              <Step 
                icon={<Code size={32} color="#DA3115" aria-hidden="true" />} 
                title="Desenvolvimento de Soluções" 
                description="Alunos desenvolvem projetos estudantis inovadores para implementar as melhorias sugeridas." 
              />
            </div>
          </div>
          <div className="mt-8">
            <p className="text-white text-lg mb-4">
              Acompanhe o progresso dos projetos em desenvolvimento e veja como suas ideias se transformam em soluções reais.
            </p>
            <Link href="/acompanhar-projetos">
              <Button 
                label="Acompanhar Projetos" 
                onClick={() => {}} 
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
          <h2 id="cta-title" className="text-3xl font-bold">Faça Parte da Mudança</h2>
          <p className="text-gray-500 text-xl max-w-3xl">
            Sua voz importa! Compartilhe suas ideias de melhoria para a comunidade e ajude os estudantes da Fatec a criar soluções que fazem a diferença. Juntos, construímos uma sociedade mais justa e eficaz.
          </p>
          <Link href="/sugerir-melhoria">
            <Button 
              label="Sugira uma Ideia de Melhoria" 
              onClick={() => {}} 
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
        className="bg-gray-800 text-white text-center p-4"
        role="contentinfo"
        aria-label="Informações do rodapé"
      >
        <p>
          <span aria-label="Copyright">&copy;</span> 2025 Fatec Conecta - Uma iniciativa Lucky Labs. 
          Todos os direitos reservados.
        </p>
      </footer>
    </>
  );
}
