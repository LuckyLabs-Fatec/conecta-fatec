import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input, InputProps } from '@/presentation/components';
import { useState } from 'react';

const meta = {
    title: 'Atoms/Input',
    component: Input,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Componente de input reutilizável baseado no Base UI Field, usado em formulários do Fatec Conecta.',
            },
        },
    },
    argTypes: {
        label: {
            control: { type: 'text' },
            description: 'Rótulo do campo de entrada',
        },
        id: {
            control: { type: 'text' },
            description: 'ID único do campo para acessibilidade',
        },
        type: {
            control: { type: 'select' },
            options: ['text', 'email', 'password', 'tel', 'url', 'search'],
            description: 'Tipo do input HTML',
        },
        placeholder: {
            control: { type: 'text' },
            description: 'Texto de exemplo exibido quando o campo está vazio',
        },
        required: {
            control: { type: 'boolean' },
            description: 'Se o campo é obrigatório',
        },
        disabled: {
            control: { type: 'boolean' },
            description: 'Se o campo está desabilitado',
        },
        error: {
            control: { type: 'text' },
            description: 'Mensagem de erro a ser exibida',
        },
        description: {
            control: { type: 'text' },
            description: 'Texto de ajuda exibido abaixo do rótulo',
        },
    },
    args: {
        label: 'Email',
        id: 'email',
        type: 'email',
        placeholder: 'Digite seu email',
        required: false,
        disabled: false,
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
    args: {
        required: true,
    },
};

export const WithDescription: Story = {
    args: {
        label: 'Email',
        description: 'Utilizamos seu email para enviar atualizações sobre seus problemas reportados',
        placeholder: 'exemplo@email.com',
    },
};

export const WithError: Story = {
    args: {
        error: 'Por favor, insira um email válido',
        value: 'email-invalido',
    },
};

export const Password: Story = {
    args: {
        label: 'Senha',
        id: 'password',
        type: 'password',
        placeholder: 'Digite sua senha',
        required: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        value: 'Campo desabilitado',
    },
};

export const LongLabel: Story = {
    args: {
        label: 'Endereço completo onde o problema foi identificado',
        id: 'address',
        placeholder: 'Rua, número, bairro, cidade',
        description: 'Seja o mais específico possível para ajudar os estudantes a localizar o problema',
    },
};

// Controlled Input Story
const ControlledInputTemplate = (args: InputProps) => {
    const [value, setValue] = useState('');
    
    return (
        <Input
            {...args}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};

export const Controlled: Story = {
    render: ControlledInputTemplate,
    args: {
        label: 'Campo Controlado',
        id: 'controlled',
        placeholder: 'Digite algo...',
    },
};

export const ValidationStates: Story = {
    render: () => (
        <div className="space-y-6">
            <Input
                label="Campo Normal"
                id="normal"
                placeholder="Estado normal"
            />
            <Input
                label="Campo com Sucesso"
                id="success"
                placeholder="Validação bem-sucedida"
                value="email@valido.com"
                className="border-green-500 focus:ring-green-500 focus:border-green-500"
            />
            <Input
                label="Campo com Erro"
                id="error"
                placeholder="Campo com erro"
                error="Este campo é obrigatório"
                value=""
            />
            <Input
                label="Campo Desabilitado"
                id="disabled"
                placeholder="Campo desabilitado"
                disabled={true}
                value="Não editável"
            />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Diferentes estados visuais do componente Input',
            },
        },
    },
};

export const FormExample: Story = {
    render: () => (
        <form className="space-y-4 max-w-md">
            <Input
                label="Nome completo"
                id="name"
                placeholder="Digite seu nome completo"
                required={true}
            />
            <Input
                label="Email"
                id="email-form"
                type="email"
                placeholder="exemplo@email.com"
                description="Nunca compartilharemos seu email"
                required={true}
            />
            <Input
                label="Telefone"
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                description="Formato: (xx) xxxxx-xxxx"
            />
            <Input
                label="Senha"
                id="password-form"
                type="password"
                placeholder="Mínimo 8 caracteres"
                required={true}
            />
        </form>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Exemplo de uso do Input em um formulário completo',
            },
        },
    },
};