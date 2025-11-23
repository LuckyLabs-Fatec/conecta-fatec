import type { Meta, StoryObj } from '@storybook/nextjs';
import { ContactInfoStep } from '../presentation/components/ContactInfoStep';

const meta: Meta<typeof ContactInfoStep> = {
  title: 'Organisms/Form Steps/ContactInfoStep',
  component: ContactInfoStep,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Segundo e último passo do formulário de sugestão, com emails e telefones de contato.',
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
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContactInfoStep>;

export const Default: Story = {
  args: {
    formData: {
      contact: {
        primaryEmail: 'usuario@exemplo.com',
        secondaryEmail: '',
        primaryPhone: '',
        secondaryPhone: '',
        details: '',
        primaryPhoneIsWhatsapp: false,
      },
    },
    errors: {},
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
  },
};

export const WithFilledData: Story = {
  args: {
    formData: {
      contact: {
        primaryEmail: 'maria@exemplo.com',
        secondaryEmail: 'alternativo@exemplo.com',
        primaryPhone: '(15) 99999-9999',
        secondaryPhone: '(11) 98888-7777',
        details: 'Ligar à tarde',
        primaryPhoneIsWhatsapp: false,
      },
    },
    errors: {},
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
  },
};

export const WithErrors: Story = {
  args: {
    formData: {
      contact: {
        primaryEmail: 'email-invalido',
        secondaryEmail: 'invalid',
        primaryPhone: '',
        secondaryPhone: '',
        details: '',
        primaryPhoneIsWhatsapp: false,
      },
    },
    errors: {
      primaryEmail: 'Email principal inválido',
      secondaryEmail: 'Email opcional inválido',
      primaryPhone: 'Telefone principal é obrigatório',
    },
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
  },
};

export const MinimalInfo: Story = {
  args: {
    formData: {
      contact: {
        primaryEmail: 'ana@exemplo.com',
        secondaryEmail: '',
        primaryPhone: '(15) 90000-0000',
        secondaryPhone: '',
        details: '',
        primaryPhoneIsWhatsapp: false,
      },
    },
    errors: {},
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(`Field ${field}.${subField} changed to:`, e.target.value);
    },
  },
};
