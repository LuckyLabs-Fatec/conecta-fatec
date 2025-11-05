import type { Meta, StoryObj } from '@storybook/nextjs';

import { Step } from '@/presentation/components';

import { Lightbulb } from 'lucide-react';

const meta = {
    title: 'Molecules/Step',
    component: Step,
    tags: ['autodocs'],
    argTypes: {
        icon: {
            control: { type: 'object' },
        },
        title: {
            control: { type: 'text' },
        },
        description: {
            control: { type: 'text' },
        },
    },
    args: {
        icon: <Lightbulb size={32} color="#DA3115" />,
        title: 'Envie sua ideia',
        description: 'Compartilhe sua ideia ou sugestão para melhorar a comunidade acadêmica.',
    },
} satisfies Meta<typeof Step>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};