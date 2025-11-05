import type { Meta, StoryObj } from '@storybook/nextjs';
import { ContactInfoStep } from '../presentation/components/ContactInfoStep';

const meta: Meta<typeof ContactInfoStep> = {
  title: 'Organisms/Form Steps/ContactInfoStep',
  component: ContactInfoStep,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Quarto e último passo do formulário de relato de problemas, onde o usuário informa seus dados de contato.',
      },
    },
  },
  argTypes: {
    formData: {
      description: 'Dados do formulário com informações de contato',
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
    onAllowContactChange: {
      description: 'Função callback para alteração da permissão de contato',
      action: 'allow-contact-changed',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContactInfoStep>;

export const Default: Story = {
  args: {
    formData: {
      contactInfo: {
        name: '',
        email: '',
        phone: '',
        allowContact: true,
      },
    },
    errors: {},
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
    onAllowContactChange: (checked: boolean) => {
      console.log('Allow contact changed to:', checked);
    },
  },
};

export const WithFilledData: Story = {
  args: {
    formData: {
      contactInfo: {
        name: 'Maria Silva',
        email: 'maria.silva@email.com',
        phone: '(15) 99999-9999',
        allowContact: true,
      },
    },
    errors: {},
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
    onAllowContactChange: (checked: boolean) => {
      console.log('Allow contact changed to:', checked);
    },
  },
};

export const WithErrors: Story = {
  args: {
    formData: {
      contactInfo: {
        name: '',
        email: 'email-invalido',
        phone: '',
        allowContact: true,
      },
    },
    errors: {
      name: 'Nome é obrigatório',
      email: 'Email deve ter um formato válido',
    },
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
    onAllowContactChange: (checked: boolean) => {
      console.log('Allow contact changed to:', checked);
    },
  },
};

export const WithoutContactPermission: Story = {
  args: {
    formData: {
      contactInfo: {
        name: 'João Santos',
        email: 'joao@email.com',
        phone: '',
        allowContact: false,
      },
    },
    errors: {},
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
    onAllowContactChange: (checked: boolean) => {
      console.log('Allow contact changed to:', checked);
    },
  },
};

export const MinimalInfo: Story = {
  args: {
    formData: {
      contactInfo: {
        name: 'Ana Costa',
        email: 'ana@email.com',
        phone: '',
        allowContact: true,
      },
    },
    errors: {},
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
    onAllowContactChange: (checked: boolean) => {
      console.log('Allow contact changed to:', checked);
    },
  },
};
