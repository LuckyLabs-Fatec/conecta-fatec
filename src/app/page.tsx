'use client';
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";

export default function LandingPage() {
  return (
    <>
      <Header />
      <section className="flex flex-col items-center bg-black text-center p-8 gap-6">
        <h1 className="text-white text-4xl font-bold">Fatec Conecta</h1>
        <p className="text-white text-2xl">Conectar comunidade e Fatec Votorantim, desenvolvendo soluções inovadoras e colaborativas com base em demandas reais.</p>
        <Button label="Saiba mais" onClick={() => {}} variant="secondary" size="large" />
      </section>
      <section className="flex flex-col items-center bg-gray-100 text-center p-8 gap-6">
        <h1 className="text-3xl font-bold">Nossa Missão</h1>
        <p className="text-gray-500 text-2xl">O Fatec Conecta visa criar um ambiente colaborativo ao integrar as demandas da sociedade e transformar ideias e sugestões da comunidade em projetos, promovendo ações desenvolvidas pelos alunos da Fatec Votorantim.</p>
        <Button label="Envie sua ideia" onClick={() => {}} variant="primary" size="large" />
      </section>
    </>
  );
}
