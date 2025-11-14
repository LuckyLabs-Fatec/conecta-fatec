import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta = {
  title: 'Deprecated/ProblemDetailsStep (removed)',
  parameters: {
    docs: {
      description: {
        component: 'ProblemDetailsStep foi substituído pelo novo passo de detalhes (título, descrição e anexos).'
      }
    }
  }
};

export default meta;

export const Info: StoryObj = {
  render: () => (
    <div style={{ padding: 16 }}>
      <p>ProblemDetailsStep removido em favor do novo ImprovementDetailsStep.</p>
    </div>
  )
};
