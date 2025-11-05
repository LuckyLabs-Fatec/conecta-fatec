import type { Meta, StoryObj } from '@storybook/nextjs';

import { Button } from '@/presentation/components';

const meta = {
    title: 'Atoms/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        onClick: { action: 'clicked' },
        variant: {
            control: { type: 'select' },
            options: ['primary', 'secondary'],
        },
    },
    args: {
        label: 'Button',
        variant: 'primary',
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        label: 'Primary Button',
        variant: 'primary',
        onClick: () => {},
        size: 'medium',
    },
};

export const Secondary: Story = {
    args: {
        label: 'Secondary Button',
        variant: 'secondary',
        onClick: () => {},
        size: 'medium',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled Button',
        disabled: true,
        onClick: () => {},
        size: 'medium',
    },
};