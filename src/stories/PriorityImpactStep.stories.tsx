import type { Meta, StoryObj } from '@storybook/nextjs';
import { PriorityImpactStep } from '../components/PriorityImpactStep';

const meta: Meta<typeof PriorityImpactStep> = {
  title: 'Organisms/Form Steps/PriorityImpactStep',
  component: PriorityImpactStep,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Terceiro passo do formulário de relato de problemas, onde o usuário define a prioridade, impacto e pode adicionar fotos.',
      },
    },
  },
  argTypes: {
    formData: {
      description: 'Dados do formulário com prioridade, pessoas afetadas, frequência e imagens',
      control: { type: 'object' },
    },
    errors: {
      description: 'Objeto com mensagens de erro para validação',
      control: { type: 'object' },
    },
    onChange: {
      description: 'Função callback chamada quando um campo é alterado',
      action: 'changed',
    },
    onImageUpload: {
      description: 'Função callback para upload de imagens',
      action: 'image-uploaded',
    },
    onRemoveImage: {
      description: 'Função callback para remoção de imagens',
      action: 'image-removed',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PriorityImpactStep>;

export const Default: Story = {
  args: {
    formData: {
      priority: 'media',
      affectedPeople: '',
      frequency: 'unica',
      images: [],
    },
    errors: {},
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      console.log(`Field ${field} changed to:`, e.target.value);
    },
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('Images uploaded:', e.target.files);
    },
    onRemoveImage: (index: number) => {
      console.log('Remove image at index:', index);
    },
  },
};

export const WithHighPriority: Story = {
  args: {
    formData: {
      priority: 'alta',
      affectedPeople: 'Cerca de 200 moradores da rua e pedestres que passam pelo local diariamente',
      frequency: 'constante',
      images: [],
    },
    errors: {},
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      console.log(`Field ${field} changed to:`, e.target.value);
    },
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('Images uploaded:', e.target.files);
    },
    onRemoveImage: (index: number) => {
      console.log('Remove image at index:', index);
    },
  },
};

export const WithUrgentPriority: Story = {
  args: {
    formData: {
      priority: 'urgente',
      affectedPeople: 'Estudantes e motoristas - risco de acidentes graves',
      frequency: 'diaria',
      images: [],
    },
    errors: {},
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      console.log(`Field ${field} changed to:`, e.target.value);
    },
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('Images uploaded:', e.target.files);
    },
    onRemoveImage: (index: number) => {
      console.log('Remove image at index:', index);
    },
  },
};

export const WithErrors: Story = {
  args: {
    formData: {
      priority: 'media',
      affectedPeople: '',
      frequency: 'unica',
      images: [],
    },
    errors: {
      affectedPeople: 'Informe quantas pessoas são afetadas',
    },
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      console.log(`Field ${field} changed to:`, e.target.value);
    },
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('Images uploaded:', e.target.files);
    },
    onRemoveImage: (index: number) => {
      console.log('Remove image at index:', index);
    },
  },
};

export const LowPriorityComplete: Story = {
  args: {
    formData: {
      priority: 'baixa',
      affectedPeople: 'Alguns moradores da região, não é urgente mas seria bom resolver',
      frequency: 'semanal',
      images: [],
    },
    errors: {},
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      console.log(`Field ${field} changed to:`, e.target.value);
    },
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('Images uploaded:', e.target.files);
    },
    onRemoveImage: (index: number) => {
      console.log('Remove image at index:', index);
    },
  },
};
