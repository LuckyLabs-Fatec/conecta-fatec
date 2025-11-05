import type { Meta, StoryObj } from '@storybook/nextjs';
import { LoginAside } from '@/presentation/components';

const meta = {
    title: 'Organisms/LoginAside',
    component: LoginAside,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Componente lateral da página de login que exibe a identidade visual e missão do Fatec Conecta.',
            },
        },
    },
    argTypes: {
        title: {
            control: { type: 'text' },
            description: 'Título principal exibido na seção lateral',
        },
        description: {
            control: { type: 'text' },
            description: 'Descrição do projeto exibida abaixo do título',
        },
    },
    args: {
        title: 'Fatec Conecta',
        description: 'Conectando a comunidade com soluções acadêmicas inovadoras. Transforme problemas reais em projetos estudantis.',
        
    },
} satisfies Meta<typeof LoginAside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomContent: Story = {
    args: {
        title: 'Projeto Conecta',
        description: 'Uma plataforma inovadora que conecta estudantes, comunidade e instituições para criar soluções sustentáveis e eficazes.',
    },
};

export const WithLongDescription: Story = {
    args: {
        description: 'O Fatec Conecta é uma iniciativa da Lucky Labs que visa criar uma ponte entre os desafios da comunidade e as soluções acadêmicas. Nossa plataforma permite que cidadãos relatem problemas do dia a dia, enquanto estudantes da Fatec Votorantim desenvolvem projetos inovadores para resolvê-los, contribuindo para os Objetivos de Desenvolvimento Sustentável da ONU.',
    },
};