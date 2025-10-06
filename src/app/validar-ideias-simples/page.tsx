'use client';
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";

export default function ValidateIdeasSimplePage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#CB2616] mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Validar Ideias - Versão Simples
                        </h1>
                        <p className="text-gray-600">
                            Esta é uma versão simplificada para testar o acesso.
                        </p>
                        
                        <div className="mt-4 bg-white p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-2">Debug Info:</h2>
                            <p><strong>Usuário:</strong> {user?.name || 'Não logado'}</p>
                            <p><strong>Role:</strong> {user?.role || 'N/A'}</p>
                            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
