import { useState } from 'react';

import { useDrivingHistoryQuery } from '../api/drivingHistory';

export const useDrivingHistory = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useDrivingHistoryQuery({ page, size: pageSize });

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  };

  return {
    drivingHistory: {
      data,
      isLoading,
      error
    },
    pagination: {
      currentPage: page + 1,
      pageSize,
      totalElements: data?.pageInfo.total ?? 0,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange
    }
  };
};
