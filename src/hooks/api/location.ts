import { getLocationHistory } from "@/api/location";
import { useQuery } from "@tanstack/react-query";

export const DRIVING_HISTORY_QUERY_KEY = {
    all: ['driving-history'] as const,
    list: (carId: number) => [...DRIVING_HISTORY_QUERY_KEY.all, 'car', carId] as const,
  };
  

  export const useDrivingHistoryQuery = (carId: number) => {
    return useQuery({
      queryKey: DRIVING_HISTORY_QUERY_KEY.list(carId),
      queryFn: () => getLocationHistory(carId),
      enabled: carId > 0,  // carId가 0보다 클 때만 쿼리 실행하게 하는 옵션 (선택사항)
    });
  };