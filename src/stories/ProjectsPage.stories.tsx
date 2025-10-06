import type { Meta, StoryObj } from '@storybook/nextjs';
import ProjectsPage from '@/app/acompanhar-projetos/page';

const meta: Meta<typeof ProjectsPage> = {
  title: 'Pages/ProjectsPage',
  component: ProjectsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Página para acompanhar o progresso dos projetos desenvolvidos pelos estudantes da Fatec baseados nas sugestões da comunidade.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectsPage>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Estado padrão da página de acompanhamento de projetos com projetos de exemplo em diferentes status.',
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
        story: 'Visualização mobile da página de projetos com layout responsivo.',
      },
    },
  },
};
