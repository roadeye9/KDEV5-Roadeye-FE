import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { getDrivingHistory, getDrivingHistoryPage, getDrivingHistoryPath, PageRequest } from '@/api/drivingHistory';

export interface DrivingHistoryQueryParams {
  page: number;
  size: number;
}

export const DRIVING_HISTORY_QUERY_KEY = {
  all: ['driving-history'] as const,
  detail: (id: number) => [...DRIVING_HISTORY_QUERY_KEY.all, 'detail', id] as const,
  list: (params: PageRequest) => [...DRIVING_HISTORY_QUERY_KEY.all, 'list', params] as const,
  path: (id: number) => [...DRIVING_HISTORY_QUERY_KEY.all, 'path', id] as const
};

export const useDrivingHistoryPageQuery = (params: DrivingHistoryQueryParams) => {
  return useQuery({
    queryKey: DRIVING_HISTORY_QUERY_KEY.list(params),
    queryFn: () => getDrivingHistoryPage(params)
  });
};

export const useDrivingHistoryQuery = (id: number) => {
  return useSuspenseQuery({
    queryKey: DRIVING_HISTORY_QUERY_KEY.detail(id),
    queryFn: () => getDrivingHistory(id)
  });
};

export const useDrivingHistoryPathQuery = (id: number) => {
  return useSuspenseQuery({
    queryKey: DRIVING_HISTORY_QUERY_KEY.path(id),
    queryFn: () => getDrivingHistoryPath(id)
  });
};
