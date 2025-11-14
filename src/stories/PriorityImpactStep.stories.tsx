import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta = {
  title: 'Deprecated/PriorityImpactStep (removed)',
  parameters: {
    docs: {
      description: {
        component: 'Priority/Impact step was removed in the new two-step flow.'
      }
    }
  }
};

export default meta;

export const Info: StoryObj = {
  render: () => (
    <div style={{ padding: 16 }}>
      <p>PriorityImpactStep foi removido. O fluxo agora possui apenas 2 etapas.</p>
    </div>
  )
};
