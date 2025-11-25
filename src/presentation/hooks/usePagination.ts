import { useCallback, useMemo, useState } from 'react';

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 50],
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const next = useCallback(() => setPage(p => Math.min(totalPages, p + 1)), [totalPages]);
  const prev = useCallback(() => setPage(p => Math.max(1, p - 1)), []);
  const reset = useCallback(() => setPage(1), []);

  const setTotals = useCallback((newTotal: number, newTotalPages: number) => {
    setTotal(newTotal);
    setTotalPages(Math.max(1, newTotalPages));
    setPage(p => Math.min(Math.max(1, newTotalPages), p));
  }, []);

  const api = useMemo(() => ({
    page,
    setPage,
    pageSize,
    setPageSize: (size: number) => {
      setPage(1);
      setPageSize(size);
    },
    total,
    totalPages,
    setTotal,
    setTotalPages,
    setTotals,
    hasPrev,
    hasNext,
    next,
    prev,
    reset,
    pageSizeOptions,
  }), [page, pageSize, total, totalPages, hasPrev, hasNext, next, prev, reset, setTotals, pageSizeOptions]);

  return api;
}
