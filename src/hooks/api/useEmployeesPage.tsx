import { useState } from 'react';

import { useEmployeesPageQuery } from './employees';

export const useEmployeesPage = (status: 'ALL' | 'ACTIVE' | 'DISABLED') => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { data, ...others } = useEmployeesPageQuery({ page, size, status });

  return {
    data: data.content,
    pagination: {
      current: page + 1,
      size,
      totalElements: data.page.totalElements,
    },
    ...others,
    previousPage: () => setPage(page - 1),
    nextPage: () => setPage(page + 1),
    hasNextPage: () => page < data.page.totalPages - 1,
    changePage: (newPage: number) => setPage(newPage),
    changePageSize: (newSize: number) => {
      if (newSize !== size) {
        setPage(0);
        setSize(newSize);
      }
    },
  } as const;
};