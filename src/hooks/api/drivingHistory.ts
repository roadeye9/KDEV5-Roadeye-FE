import { axiosInstance } from '@/api/axiosInstance';
import { getDrivingHistory, getDrivingHistoryPath } from '@/api/drivingHistory';
import { PageRequest } from '@/api/drivingHistory';
import { useQuery } from '@tanstack/react-query';

export interface DrivingHistoryQueryParams {
    page: number;
    size: number;
}

export const DRIVING_HISTORY_QUERY_KEY = {
    all: ['driving-history'] as const,
    list: (params: PageRequest) => [...DRIVING_HISTORY_QUERY_KEY.all, 'list', params] as const,
    path: (id: number) => [...DRIVING_HISTORY_QUERY_KEY.all, 'path', id] as const,
};

export const useDrivingHistoryQuery = (params: DrivingHistoryQueryParams) => {
    return useQuery({
        queryKey: DRIVING_HISTORY_QUERY_KEY.list(params),
        queryFn: () => getDrivingHistory(params),
    });
};

export const useDrivingHistoryPathQuery = (id: number) => {
    return useQuery({
        queryKey: DRIVING_HISTORY_QUERY_KEY.path(id),
        queryFn: () => getDrivingHistoryPath(id),
    });
};