'use client';
import { Header } from "@/presentation/components";
import { TermsContent } from "@/presentation/components/legal/LegalContent";
import Link from "next/link";

export default function TermsPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-[var(--cps-silver-base)] py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-[30px] shadow-[var(--cps-shadow-1)] p-8">
                        <h1 className="text-3xl font-bold text-[var(--cps-blue-base)] mb-6">
                            Termos e Condições de Uso
                        </h1>
                        
                        <div>
                            <TermsContent />

                            <div className="mt-8 pt-6 border-t border-[var(--cps-gray-light)] text-center">
                                <p className="text-sm text-[var(--cps-gray-text)]">
                                    Última atualização: Dezembro de 2024
                                </p>
                                <Link 
                                    href="/cadastro/usuario"
                                    className="inline-block mt-4 bg-[var(--cps-red-base)] hover:bg-[var(--cps-red-dark-10)] text-white px-6 py-2 rounded-[30px] transition-colors"
                                >
                                    Voltar ao Cadastro
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
