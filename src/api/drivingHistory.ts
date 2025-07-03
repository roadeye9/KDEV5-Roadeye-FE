import { axiosInstance } from './axiosInstance';

export type PageInfo = {
  page: number;
  size: number;
  total: number;
};

export interface ListModel<T> {
  data: T[];
}

export type Response<T> = {
  data: T;
};

export interface PageResponse<T> {
  data: T[];
  pageInfo: PageInfo;
}

export type DrivingHistory = {
  id: number;
  status: string;
  txUid: string[];
  previousMileageSum: number;
  driveStartedAt: string;
  previoustLatitude: number;
  previoustLongitude: number;
  nextMileageSum: number;
  driveEndedAt: string;
  nextLatitude: number;
  nextLongitude: number;
  carName: string;
  licenseNumber: string;
  driverName: string;
};

export type PageRequest = {
  page: number;
  size: number;
};

export type DrivingHistoryPath = {
  latitude: number;
  longitude: number;
};
export type DrivingHistoryListResponse = ListModel<DrivingHistory>;

export const getDrivingHistory = async (pageRequest: PageRequest) => {
  const response = await axiosInstance.get<PageResponse<DrivingHistory>>('/driving', {
    params: pageRequest,
    useTenant: true
  });
  return response.data;
};

export const getDrivingHistoryAll = async () => {
  const { data } = await axiosInstance.get<DrivingHistoryListResponse>('/driving-history/all');
  return data;
};

export const getDrivingHistoryPath = async (id: number) => {
  const { data } = await axiosInstance.get<ListModel<DrivingHistoryPath>>(`/driving/${id}`);
  return data;
};
