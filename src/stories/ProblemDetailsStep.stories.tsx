import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProblemDetailsStep } from '../components/ProblemDetailsStep';

const meta: Meta<typeof ProblemDetailsStep> = {
  title: 'Organisms/Form Steps/ProblemDetailsStep',
  component: ProblemDetailsStep,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Primeiro passo do formulário de relato de problemas, onde o usuário seleciona a categoria, título e descrição do problema.',
      },
    },
  },
  argTypes: {
    formData: {
      description: 'Dados do formulário para categoria, título e descrição',
      control: { type: 'object' },
    },
    errors: {
      description: 'Objeto com mensagens de erro para validação',
      control: { type: 'object' },
    },
    onChange: {
      description: 'Função callback chamada quando um campo é alterado',
      action: 'changed',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProblemDetailsStep>;

export const Default: Story = {
  args: {
    formData: {
      category: '',
      title: '',
      description: '',
    },
    errors: {},
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(`Field ${field} changed to:`, e.target.value);
    },
  },
};

export const WithSelectedCategory: Story = {
  args: {
    formData: {
      category: 'infraestrutura',
      title: 'Buraco na Rua das Flores',
      description: 'Há um grande buraco na Rua das Flores que está causando acidentes.',
    },
    errors: {},
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(`Field ${field} changed to:`, e.target.value);
    },
  },
};

export const WithErrors: Story = {
  args: {
    formData: {
      category: '',
      title: '',
      description: '',
    },
    errors: {
      category: 'Selecione uma categoria',
      title: 'Título é obrigatório',
      description: 'Descrição é obrigatória',
    },
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(`Field ${field} changed to:`, e.target.value);
    },
  },
};

export const PartiallyFilled: Story = {
  args: {
    formData: {
      category: 'seguranca',
      title: 'Falta de iluminação na praça',
      description: '',
    },
    errors: {
      description: 'Descrição é obrigatória',
    },
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(`Field ${field} changed to:`, e.target.value);
    },
  },
};
