# Mock Logins (Perfis)

Use estes logins para acessar o sistema com perfis diferentes. A autenticação no app mapeia automaticamente o perfil pelo email/senha informados.

- Comunidade
  - Email: comunidade@fatecconecta.com
  - Senha: 123456
  - Permissões: sugerir ideias, ver as próprias ideias que foram submetidas

- Estudante
  - Email: estudante@fatecconecta.com
  - Senha: 123456
  - Permissões: sugerir ideias, visualizar ideias aguardando desenvolvimento

- Mediador
  - Email: mediador@fatecconecta.com
  - Senha: 123456
  - Permissões: validar ideias (acesso a /validar-ideias)

- Coordenação
  - Email: coordenacao@fatecconecta.com
  - Senha: 123456
  - Permissões: validar ideias e atribuir projetos às turmas

Observações:
- Se você usar um email diferente dos listados acima, o sistema assume o perfil "comunidade" por padrão.
- Os dados de mock também estão disponíveis no código em `src/domain/auth/mockUsers.ts`.
