import type { Meta, StoryObj } from '@storybook/nextjs';
import { LocationStep } from '../presentation/components/LocationStep';

const meta: Meta<typeof LocationStep> = {
  title: 'Organisms/Form Steps/LocationStep',
  component: LocationStep,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Segundo passo do formulário de relato de problemas, onde o usuário informa a localização do problema.',
      },
    },
  },
  argTypes: {
    formData: {
      description: 'Dados do formulário com informações de localização',
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
type Story = StoryObj<typeof LocationStep>;

export const Default: Story = {
  args: {
    formData: {
      location: {
        address: '',
        neighborhood: '',
        city: 'Votorantim',
      },
    },
    errors: {},
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
  },
};

export const WithFilledData: Story = {
  args: {
    formData: {
      location: {
        address: 'Rua das Flores, 123',
        neighborhood: 'Centro',
        city: 'Votorantim',
      },
    },
    errors: {},
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
  },
};

export const WithErrors: Story = {
  args: {
    formData: {
      location: {
        address: '',
        neighborhood: '',
        city: 'Votorantim',
      },
    },
    errors: {
      address: 'Endereço é obrigatório',
      neighborhood: 'Bairro é obrigatório',
    },
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
  },
};

export const PartiallyFilled: Story = {
  args: {
    formData: {
      location: {
        address: 'Rua das Palmeiras',
        neighborhood: '',
        city: 'Votorantim',
      },
    },
    errors: {
      neighborhood: 'Bairro é obrigatório',
    },
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
  },
};
