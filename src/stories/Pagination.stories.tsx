import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Pagination, PaginationProps } from '@/presentation/components';

const meta = {
  title: 'Molecules/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Componente de paginação reutilizável com seleção de itens por página.',
      },
    },
    layout: 'padded',
  },
  argTypes: {
    page: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    pageSize: { control: { type: 'number' } },
    pageSizeOptions: { control: { type: 'object' } },
  },
  args: {
    page: 1,
    totalPages: 10,
    pageSize: 9,
    pageSizeOptions: [6, 9, 12, 24],
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
} satisfies Meta<typeof Pagination>;

export default meta;

// Controlled template to showcase interactions
function ControlledPaginationTemplate(args: PaginationProps) {
  const [page, setPage] = useState(args.page);
  const [pageSize, setPageSize] = useState(args.pageSize);

  return (
    <Pagination
      {...args}
      page={page}
      pageSize={pageSize}
      onPageChange={(p) => setPage(p)}
      onPageSizeChange={(s) => {
        setPageSize(s);
        setPage(1);
      }}
    />
  );
}

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
};

export const Controlled: Story = {
  render: (args) => <ControlledPaginationTemplate {...args} />,
  args: {
    totalPages: 5,
    pageSize: 6,
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
};
