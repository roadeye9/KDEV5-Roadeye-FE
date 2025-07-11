import { useQuery } from "@tanstack/react-query";
import { getDailyStatistics, getMonthlyStatistics } from "@/api/statistics";

export const STATISTICS_QUERY_KEY = {
    daily: ['statistics', 'daily'] as const,
    monthly: ['statistics', 'monthly'] as const,
};

export const useDailyStatisticsQuery = ({ date }: { date: string }) => {
    return useQuery({
        queryKey: [STATISTICS_QUERY_KEY.daily, { date }],
        queryFn: () => getDailyStatistics(date)
    });
};

export const useMonthlyStatisticsQuery = ({}) => {
    return useQuery({
        queryKey: STATISTICS_QUERY_KEY.monthly,
        queryFn: () => getMonthlyStatistics()
    });
};