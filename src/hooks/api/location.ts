import { useQuery } from '@tanstack/react-query';

import { getLocationHistory } from '@/api/location';

const REFETCH_INTERVAL = Number(import.meta.env.VITE_REFETCH_INTERVAL_MS) || 30000; // 20 seconds

export const DRIVING_HISTORY_QUERY_KEY = {
  all: ['driving-history'] as const,
  list: (carId: number) => [...DRIVING_HISTORY_QUERY_KEY.all, 'car', carId] as const
};

export const useDrivingHistoryQuery = (carId: number) => {
  return useQuery({
    queryKey: DRIVING_HISTORY_QUERY_KEY.list(carId),
    queryFn: () => getLocationHistory(carId),
    refetchInterval: REFETCH_INTERVAL,
  });
};
