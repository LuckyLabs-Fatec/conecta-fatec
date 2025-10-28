# Fatec Conecta

Projeto desenvolvido durante o PI do curso de Desenvolvimento de Software Multiplataforma da Fatec Votorantim

## Tecnologias Utilizadas
- Next.js
- TypeScript
- Tailwind CSS
- Storybook
- Base UI

## Como Rodar o Projeto
1. Clone o repositório:
   ```bash
   git clone
   ```
2. Navegue até o diretório do projeto:
    ```bash
    cd conecta-fatec
    ```
3. Instale as dependências:
    ```bash
    npm install
    ```
4. Configure a URL da API (opcional):
   Crie um arquivo `.env.local` na pasta `conecta-fatec` (mesmo nível do `package.json`) e defina a URL base da API (por padrão será `http://localhost:3000`).
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   ```
5. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
6. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o projeto em ação.

## Como Rodar o Storybook

1. Certifique-se de que todas as dependências estão instaladas (veja o passo 3 acima).
2. Inicie o Storybook:
    ```bash
    npm run storybook
    ```
3. Abra [http://localhost:6006](http://localhost:6006) no seu navegador para ver o Storybook.

## Estrutura do Projeto
- `src/app`: Contém as páginas da aplicação.
- `src/components`: Contém os componentes reutilizáveis da aplicação.
- `src/stories`: Contém os arquivos de Storybook para os componentes.
- `public`: Contém os arquivos estáticos, como imagens e fontes.
- `src/domain/auth`: Cliente de autenticação (login/cadastro) integrado à API.
- `src/domain/config.ts`: Configuração de URL base para a API.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.
