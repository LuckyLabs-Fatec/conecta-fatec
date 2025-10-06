import type { Meta, StoryObj } from '@storybook/nextjs';
import RegisterPage from '@/app/cadastro/usuario/page';

const meta: Meta<typeof RegisterPage> = {
  title: 'Pages/RegisterPage',
  component: RegisterPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Página de cadastro de usuários com diferentes tipos de perfil: membro da comunidade, mediador e coordenação.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RegisterPage>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Estado padrão da página de cadastro com formulário completo e seleção de tipo de usuário.',
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Visualização mobile da página de cadastro com layout responsivo.',
      },
    },
  },
};
