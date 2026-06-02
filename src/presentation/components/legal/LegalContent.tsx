export function TermsContent() {
    return (
        <div className="prose max-w-none">
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">1. Aceite dos Termos</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    Ao acessar e usar o Fatec Conecta, você concorda em cumprir e estar vinculado aos termos e condições de uso descritos abaixo. Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">2. Sobre o Fatec Conecta</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    O Fatec Conecta é uma plataforma desenvolvida pela Lucky Labs em parceria com a Fatec Votorantim, que tem como objetivo conectar a comunidade local com estudantes para o desenvolvimento de soluções inovadoras para problemas cotidianos.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">3. Tipos de Usuário</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">Nossa plataforma oferece três tipos de acesso:</p>
                <ul className="list-disc list-inside text-[var(--cps-gray-text)] mb-4 space-y-2">
                    <li><strong>Membro da Comunidade:</strong> Pode sugerir ideias de melhoria para a comunidade</li>
                    <li><strong>Mediador:</strong> Responsável por analisar e fazer a triagem das ideias submetidas</li>
                    <li><strong>Coordenação:</strong> Responsável por atribuir projetos aprovados às turmas da Fatec</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">4. Responsabilidades do Usuário</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">Ao usar nossa plataforma, você se compromete a:</p>
                <ul className="list-disc list-inside text-[var(--cps-gray-text)] mb-4 space-y-2">
                    <li>Fornecer informações verdadeiras e precisas</li>
                    <li>Manter a confidencialidade de suas credenciais de acesso</li>
                    <li>Usar a plataforma de forma respeitosa e construtiva</li>
                    <li>Não submeter conteúdo ofensivo, discriminatório ou ilegal</li>
                    <li>Respeitar os direitos de propriedade intelectual</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">5. Propriedade Intelectual</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    As ideias submetidas na plataforma permanecem de propriedade de seus criadores. No entanto, ao submeter uma ideia, você concede à Fatec Votorantim e seus estudantes o direito de desenvolver soluções baseadas nessas ideias para fins educacionais e de benefício da comunidade.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">6. Limitação de Responsabilidade</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    O Fatec Conecta é uma plataforma educacional. Não garantimos que todas as ideias submetidas serão implementadas ou que os projetos desenvolvidos atenderão completamente às expectativas dos usuários.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">7. Modificações dos Termos</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    Reservamos o direito de modificar estes termos a qualquer momento. As alterações serão comunicadas através da plataforma e entrarão em vigor imediatamente após a publicação.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">8. Contato</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    Para dúvidas sobre estes termos, entre em contato conosco através do email:
                    <a href="mailto:contato@fatecconecta.com" className="text-[var(--cps-red-base)] hover:underline ml-1">
                        contato@fatecconecta.com
                    </a>
                </p>
            </section>
        </div>
    );
}

export function PrivacyContent() {
    return (
        <div className="prose max-w-none">
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">1. Informações que Coletamos</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    Coletamos as seguintes informações quando você se cadastra e usa nossa plataforma:
                </p>
                <ul className="list-disc list-inside text-[var(--cps-gray-text)] mb-4 space-y-2">
                    <li><strong>Informações de Cadastro:</strong> Nome, email, telefone e tipo de usuário</li>
                    <li><strong>Informações Profissionais:</strong> Departamento (para coordenação) ou especialização (para mediadores)</li>
                    <li><strong>Conteúdo Submetido:</strong> Ideias, descrições, imagens e comentários</li>
                    <li><strong>Dados de Uso:</strong> Logs de acesso, páginas visitadas e interações na plataforma</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">2. Como Usamos suas Informações</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">Utilizamos suas informações para:</p>
                <ul className="list-disc list-inside text-[var(--cps-gray-text)] mb-4 space-y-2">
                    <li>Criar e gerenciar sua conta na plataforma</li>
                    <li>Facilitar a comunicação entre comunidade, mediadores e coordenação</li>
                    <li>Processar e acompanhar ideias submetidas</li>
                    <li>Melhorar nossos serviços e experiência do usuário</li>
                    <li>Enviar atualizações sobre projetos e ideias</li>
                    <li>Garantir a segurança da plataforma</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">3. Compartilhamento de Informações</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    Suas informações podem ser compartilhadas nas seguintes situações:
                </p>
                <ul className="list-disc list-inside text-[var(--cps-gray-text)] mb-4 space-y-2">
                    <li><strong>Com a Fatec Votorantim:</strong> Para fins educacionais e desenvolvimento de projetos</li>
                    <li><strong>Entre usuários da plataforma:</strong> Informações necessárias para colaboração em projetos</li>
                    <li><strong>Dados públicos:</strong> Ideias aprovadas podem ser visíveis publicamente na plataforma</li>
                    <li><strong>Compliance legal:</strong> Quando exigido por lei ou autoridades competentes</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">4. Proteção de Dados</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    Implementamos medidas de segurança adequadas para proteger suas informações:
                </p>
                <ul className="list-disc list-inside text-[var(--cps-gray-text)] mb-4 space-y-2">
                    <li>Criptografia de dados sensíveis</li>
                    <li>Controle de acesso baseado em roles</li>
                    <li>Monitoramento de segurança contínuo</li>
                    <li>Backup regular dos dados</li>
                    <li>Atualizações regulares de segurança</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">5. Seus Direitos (LGPD)</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
                </p>
                <ul className="list-disc list-inside text-[var(--cps-gray-text)] mb-4 space-y-2">
                    <li><strong>Acesso:</strong> Solicitar informações sobre o tratamento de seus dados</li>
                    <li><strong>Correção:</strong> Solicitar a correção de dados incompletos ou inexatos</li>
                    <li><strong>Eliminação:</strong> Solicitar a exclusão de dados desnecessários</li>
                    <li><strong>Portabilidade:</strong> Solicitar a transferência de dados para outro provedor</li>
                    <li><strong>Oposição:</strong> Opor-se ao tratamento de dados em certas situações</li>
                    <li><strong>Revogação:</strong> Revogar o consentimento a qualquer momento</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">6. Cookies e Tecnologias Similares</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    Utilizamos cookies e tecnologias similares para:
                </p>
                <ul className="list-disc list-inside text-[var(--cps-gray-text)] mb-4 space-y-2">
                    <li>Manter você logado na plataforma</li>
                    <li>Lembrar suas preferências</li>
                    <li>Analisar o uso da plataforma</li>
                    <li>Melhorar a experiência do usuário</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">7. Retenção de Dados</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    Mantemos seus dados pelo tempo necessário para cumprir os propósitos descritos nesta política,
                    ou conforme exigido por lei. Dados de projetos concluídos podem ser mantidos para fins
                    históricos e educacionais.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">8. Alterações nesta Política</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas
                    através da plataforma ou por email.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">9. Contato</h2>
                <p className="text-[var(--cps-gray-text)] mb-4">
                    Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
                </p>
                <div className="bg-[var(--cps-silver-base)] p-4 rounded-[30px]">
                    <p className="text-[var(--cps-gray-text)] mb-2">
                        <strong>Email:</strong>
                        <a href="mailto:privacidade@fatecconecta.com" className="text-[var(--cps-red-base)] hover:underline ml-1">
                            privacidade@fatecconecta.com
                        </a>
                    </p>
                    <p className="text-[var(--cps-gray-text)] mb-2">
                        <strong>Encarregado de Dados:</strong> Lucky Labs
                    </p>
                    <p className="text-[var(--cps-gray-text)]">
                        <strong>Endereço:</strong> Fatec Votorantim - Av. Boa Vista, 780, Votorantim/SP
                    </p>
                </div>
            </section>
        </div>
    );
}
