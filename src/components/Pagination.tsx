import React from 'react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  pageSize,
  pageSizeOptions = [6, 9, 12, 24],
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 sm:items-center justify-between ${className ?? ''}`}>
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="px-3 py-2 border rounded-lg text-sm disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">
          Página {page} de {Math.max(1, totalPages)}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(Math.max(1, Math.min(totalPages, page + 1)))}
          className="px-3 py-2 border rounded-lg text-sm disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span>Itens por página</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-2 py-1 border rounded-lg"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
