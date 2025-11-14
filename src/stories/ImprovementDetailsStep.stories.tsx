import type { Meta, StoryObj } from '@storybook/nextjs';
import { ImprovementDetailsStep } from '../presentation/components/ImprovementDetailsStep';

const meta: Meta<typeof ImprovementDetailsStep> = {
  title: 'Organisms/Form Steps/ImprovementDetailsStep',
  component: ImprovementDetailsStep,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Primeiro passo: Título, Descrição e Anexos (opcionais)'
      }
    }
  },
  argTypes: {
    formData: { control: { type: 'object' } },
    errors: { control: { type: 'object' } },
    onChange: { action: 'changed' },
    onAttachmentUpload: { action: 'attachments-uploaded' },
    onRemoveAttachment: { action: 'attachment-removed' }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof ImprovementDetailsStep>;

export const Default: Story = {
  args: {
    formData: {
      title: '',
      description: '',
      attachments: []
    },
    errors: {},
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(`Field ${field} changed to:`, (e.target as HTMLInputElement).value);
    },
    onAttachmentUpload: (files: FileList | null) => {
      console.log('Attachments uploaded:', files);
    },
    onRemoveAttachment: (index: number) => {
      console.log('Remove attachment at index:', index);
    }
  }
};

export const WithValues: Story = {
  args: {
    formData: {
      title: 'Criação de horta comunitária',
      description: 'Implementar uma horta na praça central com apoio da comunidade.',
      attachments: []
    },
    errors: {},
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(`Field ${field} changed to:`, (e.target as HTMLInputElement).value);
    },
    onAttachmentUpload: (files: FileList | null) => {
      console.log('Attachments uploaded:', files);
    },
    onRemoveAttachment: (index: number) => {
      console.log('Remove attachment at index:', index);
    }
  }
};
