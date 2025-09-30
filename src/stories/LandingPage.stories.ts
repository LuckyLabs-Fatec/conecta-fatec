import type { Meta, StoryObj } from '@storybook/nextjs';

import LandingPage from '@/app/page';

const meta = {
    title: 'Landing Page',
    component: LandingPage,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};