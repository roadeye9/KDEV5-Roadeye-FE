import { axiosInstance } from './axiosInstance';
import { CarIgnitionStatus, EntityLifecycleStatus } from './vehicle';

export type PageInfo = {
  page: number;
  size: number;
  total: number;
};

export interface PagedModel<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
}

export interface ListModel<T> {
  data: T[];
}

export type Response<T> = {
  data: T;
};

export type Dashboard = {
  totalVehicles: number;
  totalDrivers: number;
  totalTrips: number;
  totalFuelConsumption: number;
  totalDistance: number;
  totalTime: number;
};

export interface DrivingLogCount {
  month: string; // "2025-01" 형태
  count: number;
}

export const getCarIgnitionCount = async (
  status: CarIgnitionStatus,
  lifecycleStatus: EntityLifecycleStatus
): Promise<number> => {
  const { data } = await axiosInstance.get('/cars/count/ignition', {
    params: {
      status,
      lifecycleStatus
    }
  });
  return data.data; // assuming the response shape is { data: number }
};

export const getDrivingLogMonthlyCount = async (): Promise<DrivingLogCount[]> => {
  const { data } = await axiosInstance.get<ListModel<DrivingLogCount>>('/dashboard/month');
  return data.data;
};
