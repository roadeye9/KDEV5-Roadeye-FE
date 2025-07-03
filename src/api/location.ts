import { axiosInstance } from './axiosInstance';

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

export type DrivingHistory = {
  id: number;
  status: 'InProgress' | 'Ended';
  txUid: string;
  previousMileageSum: number;
  driveStartedAt: string; // ISO 날짜 문자열
  previousLatitude: number;
  previousLongitude: number;
  nextMileageSum: number | null;
  driveEndedAt: string | null;
  nextLatitude: number | null;
  nextLongitude: number | null;
};

export type DrivingLocationDetail = {
  id: number;
  drivingId: number;
  latitude: number;
  longitude: number;
  datetime: string; // LocalDateTime → string
  speed: number;
  createdAt: string; // LocalDateTime → string
};

export const getLocationHistory = async (id: number) => {
  const { data } = await axiosInstance.get<ListModel<DrivingLocationDetail>>(`/driving/car/${id}`);

  return data.data;
};
