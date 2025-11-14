import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta = {
  title: 'Deprecated/LocationStep (removed)',
  parameters: {
    docs: {
      description: {
        component: 'Location step has been removed in favor of a two-step flow.'
      }
    }
  }
};

export default meta;

export const Info: StoryObj = {
  render: () => (
    <div style={{ padding: 16 }}>
      <p>LocationStep foi removido. O fluxo agora possui apenas 2 etapas.</p>
    </div>
  )
};
