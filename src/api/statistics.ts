import { axiosInstance } from "./axiosInstance";

export type Response<T> = {
    data: T;
};

export interface HourlyStatistics {
    hour: string;
    vehicleCount: number;
}

export interface DailyStatistics {
    date: string;
    distance: number;
    duration: number;
    totalDrivingCount: number;
    hourlyStatisticsInfos: HourlyStatistics[];
}

export interface MonthlyStatistics {
    month: string;
    totalDrivingCount: number;
    hourlyStatisticsInfos: HourlyStatistics[];
}

export const getDailyStatistics = async (date: string) => {
    const { data } = await axiosInstance.get<Response<DailyStatistics>>(`/dashboard/daily?date=${date}`);
    return data.data;
};

export const getMonthlyStatistics = async () => {
    const { data } = await axiosInstance.get<Response<MonthlyStatistics>>('/statistics/monthly');
    return data.data;
};