'use client';
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";

export default function TestValidationPage() {
    const { user, isLoading, canAccessIdeaValidation } = useAuth();

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-4">Teste de Validação</h1>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Informações do Usuário:</h2>
                        <pre className="bg-gray-100 p-4 rounded text-sm">
                            {JSON.stringify({ 
                                user, 
                                isLoading, 
                                canAccess: canAccessIdeaValidation() 
                            }, null, 2)}
                        </pre>
                        
                        <div className="mt-4">
                            <p><strong>Usuário logado:</strong> {user ? 'Sim' : 'Não'}</p>
                            <p><strong>Role:</strong> {user?.role || 'N/A'}</p>
                            <p><strong>Pode acessar validação:</strong> {canAccessIdeaValidation() ? 'Sim' : 'Não'}</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
