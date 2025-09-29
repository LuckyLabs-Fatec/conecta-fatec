import type { Meta, StoryObj } from '@storybook/nextjs';

import { fn } from 'storybook/test';

import { Header } from '@/components/Header';

const meta = {
  title: 'Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
