'use client';
import { Header } from "@/presentation/components";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">
                            Política de Privacidade
                        </h1>
                        
                        <div className="prose max-w-none">
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Informações que Coletamos</h2>
                                <p className="text-gray-600 mb-4">
                                    Coletamos as seguintes informações quando você se cadastra e usa nossa plataforma:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                    <li><strong>Informações de Cadastro:</strong> Nome, email, telefone e tipo de usuário</li>
                                    <li><strong>Informações Profissionais:</strong> Departamento (para coordenação) ou especialização (para mediadores)</li>
                                    <li><strong>Conteúdo Submetido:</strong> Ideias, descrições, imagens e comentários</li>
                                    <li><strong>Dados de Uso:</strong> Logs de acesso, páginas visitadas e interações na plataforma</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Como Usamos suas Informações</h2>
                                <p className="text-gray-600 mb-4">Utilizamos suas informações para:</p>
                                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                    <li>Criar e gerenciar sua conta na plataforma</li>
                                    <li>Facilitar a comunicação entre comunidade, mediadores e coordenação</li>
                                    <li>Processar e acompanhar ideias submetidas</li>
                                    <li>Melhorar nossos serviços e experiência do usuário</li>
                                    <li>Enviar atualizações sobre projetos e ideias</li>
                                    <li>Garantir a segurança da plataforma</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Compartilhamento de Informações</h2>
                                <p className="text-gray-600 mb-4">
                                    Suas informações podem ser compartilhadas nas seguintes situações:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                    <li><strong>Com a Fatec Votorantim:</strong> Para fins educacionais e desenvolvimento de projetos</li>
                                    <li><strong>Entre usuários da plataforma:</strong> Informações necessárias para colaboração em projetos</li>
                                    <li><strong>Dados públicos:</strong> Ideias aprovadas podem ser visíveis publicamente na plataforma</li>
                                    <li><strong>Compliance legal:</strong> Quando exigido por lei ou autoridades competentes</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Proteção de Dados</h2>
                                <p className="text-gray-600 mb-4">
                                    Implementamos medidas de segurança adequadas para proteger suas informações:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                    <li>Criptografia de dados sensíveis</li>
                                    <li>Controle de acesso baseado em roles</li>
                                    <li>Monitoramento de segurança contínuo</li>
                                    <li>Backup regular dos dados</li>
                                    <li>Atualizações regulares de segurança</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Seus Direitos (LGPD)</h2>
                                <p className="text-gray-600 mb-4">
                                    De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                    <li><strong>Acesso:</strong> Solicitar informações sobre o tratamento de seus dados</li>
                                    <li><strong>Correção:</strong> Solicitar a correção de dados incompletos ou inexatos</li>
                                    <li><strong>Eliminação:</strong> Solicitar a exclusão de dados desnecessários</li>
                                    <li><strong>Portabilidade:</strong> Solicitar a transferência de dados para outro provedor</li>
                                    <li><strong>Oposição:</strong> Opor-se ao tratamento de dados em certas situações</li>
                                    <li><strong>Revogação:</strong> Revogar o consentimento a qualquer momento</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Cookies e Tecnologias Similares</h2>
                                <p className="text-gray-600 mb-4">
                                    Utilizamos cookies e tecnologias similares para:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                    <li>Manter você logado na plataforma</li>
                                    <li>Lembrar suas preferências</li>
                                    <li>Analisar o uso da plataforma</li>
                                    <li>Melhorar a experiência do usuário</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Retenção de Dados</h2>
                                <p className="text-gray-600 mb-4">
                                    Mantemos seus dados pelo tempo necessário para cumprir os propósitos descritos nesta política, 
                                    ou conforme exigido por lei. Dados de projetos concluídos podem ser mantidos para fins 
                                    históricos e educacionais.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Alterações nesta Política</h2>
                                <p className="text-gray-600 mb-4">
                                    Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
                                    através da plataforma ou por email.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Contato</h2>
                                <p className="text-gray-600 mb-4">
                                    Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-600 mb-2">
                                        <strong>Email:</strong> 
                                        <a href="mailto:privacidade@fatecconecta.com" className="text-[#CB2616] hover:underline ml-1">
                                            privacidade@fatecconecta.com
                                        </a>
                                    </p>
                                    <p className="text-gray-600 mb-2">
                                        <strong>Encarregado de Dados:</strong> Lucky Labs
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Endereço:</strong> Fatec Votorantim - Av. Boa Vista, 780, Votorantim/SP
                                    </p>
                                </div>
                            </section>

                            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-500 mb-4">
                                    Última atualização: Dezembro de 2024
                                </p>
                                <Link 
                                    href="/cadastro/usuario"
                                    className="inline-block bg-[#CB2616] hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
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
