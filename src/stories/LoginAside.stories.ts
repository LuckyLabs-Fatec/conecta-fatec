import type { Meta, StoryObj } from '@storybook/nextjs';
import { LoginAside } from '@/components/LoginAside';

const meta = {
    title: 'LoginAside',
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
        logoSrc: {
            control: { type: 'text' },
            description: 'Caminho da imagem do logo',
        },
        logoAlt: {
            control: { type: 'text' },
            description: 'Texto alternativo para o logo (acessibilidade)',
        },
        logoWidth: {
            control: { type: 'number', min: 40, max: 200, step: 10 },
            description: 'Largura do logo em pixels',
        },
        logoHeight: {
            control: { type: 'number', min: 40, max: 200, step: 10 },
            description: 'Altura do logo em pixels',
        },
    },
    args: {
        title: 'Fatec Conecta',
        description: 'Conectando a comunidade com soluções acadêmicas inovadoras. Transforme problemas reais em projetos estudantis.',
        logoSrc: '/logo.svg',
        logoAlt: 'Logo Fatec Conecta',
        logoWidth: 80,
        logoHeight: 80,
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

export const WithLargerLogo: Story = {
    args: {
        logoWidth: 120,
        logoHeight: 120,
    },
};

export const WithSmallerLogo: Story = {
    args: {
        logoWidth: 60,
        logoHeight: 60,
    },
};

export const WithLongDescription: Story = {
    args: {
        description: 'O Fatec Conecta é uma iniciativa da Lucky Labs que visa criar uma ponte entre os desafios da comunidade e as soluções acadêmicas. Nossa plataforma permite que cidadãos relatem problemas do dia a dia, enquanto estudantes da Fatec Votorantim desenvolvem projetos inovadores para resolvê-los, contribuindo para os Objetivos de Desenvolvimento Sustentável da ONU.',
    },
};