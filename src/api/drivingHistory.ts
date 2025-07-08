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

export const getDrivingHistoryPage = async (pageRequest: PageRequest) => {
  const response = await axiosInstance.get<PageResponse<DrivingHistory>>('/driving', {
    params: pageRequest
  });
  const ret = response.data;
  return {
    ...ret,
    data: ret.data.map((d) => ({
      ...d,
      driveStartedAt: new Date(d.driveStartedAt),
      driveEndedAt: new Date(d.driveEndedAt)
    }))
  } as const
};

export const getDrivingHistory = async (id: number) => {
  const { data } = await axiosInstance.get<Response<DrivingHistory>>(`/driving/${id}`);
  const ret = data.data;
  return {
    ...ret,
    driveStartedAt: new Date(ret.driveStartedAt),
    driveEndedAt: new Date(ret.driveEndedAt)
  } as const
};

export const getDrivingHistoryPath = async (id: number) => {
  const { data } = await axiosInstance.get<ListModel<DrivingHistoryPath>>(`/driving/${id}/path`);
  return data.data;
};
