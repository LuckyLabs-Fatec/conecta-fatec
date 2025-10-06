import type { Meta, StoryObj } from '@storybook/nextjs';
import ValidateIdeasPage from '@/app/validar-ideias/page';

const meta: Meta<typeof ValidateIdeasPage> = {
  title: 'Pages/ValidateIdeasPage',
  component: ValidateIdeasPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Página para mediadores e coordenação validarem ideias submetidas pela comunidade e atribuí-las a turmas.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ValidateIdeasPage>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Estado padrão da página de validação de ideias com exemplos de ideias em diferentes status.',
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
        story: 'Visualização mobile da página de validação com layout responsivo.',
      },
    },
  },
};
