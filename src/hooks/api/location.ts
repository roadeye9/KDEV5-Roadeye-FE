import { useQuery } from '@tanstack/react-query';

import { getLocationHistoryOfCar } from '@/api/location';

export const DRIVING_HISTORY_QUERY_KEY = {
  all: ['driving-history'] as const,
  list: (carId: number) => [...DRIVING_HISTORY_QUERY_KEY.all, 'car', carId] as const
};

export const useDrivingHistoryOfCarQuery = (carId: number) => {
  return useQuery({
    queryKey: DRIVING_HISTORY_QUERY_KEY.list(carId),
    queryFn: () => getLocationHistoryOfCar(carId),
  });
};
