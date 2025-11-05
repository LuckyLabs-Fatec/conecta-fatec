'use client';
import { Header } from "@/presentation/components";
import Link from "next/link";

export default function TermsPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">
                            Termos e Condições de Uso
                        </h1>
                        
                        <div className="prose max-w-none">
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Aceite dos Termos</h2>
                                <p className="text-gray-600 mb-4">
                                    Ao acessar e usar o Fatec Conecta, você concorda em cumprir e estar vinculado aos termos e condições de uso descritos abaixo. Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Sobre o Fatec Conecta</h2>
                                <p className="text-gray-600 mb-4">
                                    O Fatec Conecta é uma plataforma desenvolvida pela Lucky Labs em parceria com a Fatec Votorantim, que tem como objetivo conectar a comunidade local com estudantes para o desenvolvimento de soluções inovadoras para problemas cotidianos.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Tipos de Usuário</h2>
                                <p className="text-gray-600 mb-4">Nossa plataforma oferece três tipos de acesso:</p>
                                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                    <li><strong>Membro da Comunidade:</strong> Pode sugerir ideias de melhoria para a comunidade</li>
                                    <li><strong>Mediador:</strong> Responsável por analisar e fazer a triagem das ideias submetidas</li>
                                    <li><strong>Coordenação:</strong> Responsável por atribuir projetos aprovados às turmas da Fatec</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Responsabilidades do Usuário</h2>
                                <p className="text-gray-600 mb-4">Ao usar nossa plataforma, você se compromete a:</p>
                                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                    <li>Fornecer informações verdadeiras e precisas</li>
                                    <li>Manter a confidencialidade de suas credenciais de acesso</li>
                                    <li>Usar a plataforma de forma respeitosa e construtiva</li>
                                    <li>Não submeter conteúdo ofensivo, discriminatório ou ilegal</li>
                                    <li>Respeitar os direitos de propriedade intelectual</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Propriedade Intelectual</h2>
                                <p className="text-gray-600 mb-4">
                                    As ideias submetidas na plataforma permanecem de propriedade de seus criadores. No entanto, ao submeter uma ideia, você concede à Fatec Votorantim e seus estudantes o direito de desenvolver soluções baseadas nessas ideias para fins educacionais e de benefício da comunidade.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Limitação de Responsabilidade</h2>
                                <p className="text-gray-600 mb-4">
                                    O Fatec Conecta é uma plataforma educacional. Não garantimos que todas as ideias submetidas serão implementadas ou que os projetos desenvolvidos atenderão completamente às expectativas dos usuários.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Modificações dos Termos</h2>
                                <p className="text-gray-600 mb-4">
                                    Reservamos o direito de modificar estes termos a qualquer momento. As alterações serão comunicadas através da plataforma e entrarão em vigor imediatamente após a publicação.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Contato</h2>
                                <p className="text-gray-600 mb-4">
                                    Para dúvidas sobre estes termos, entre em contato conosco através do email: 
                                    <a href="mailto:contato@fatecconecta.com" className="text-[#CB2616] hover:underline ml-1">
                                        contato@fatecconecta.com
                                    </a>
                                </p>
                            </section>

                            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-500">
                                    Última atualização: Dezembro de 2024
                                </p>
                                <Link 
                                    href="/cadastro/usuario"
                                    className="inline-block mt-4 bg-[#CB2616] hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
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
