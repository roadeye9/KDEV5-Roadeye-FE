import { axiosInstance } from './axiosInstance';

interface PageInfo {
  page: number;
  size: number;
  total: number;
}

export interface ListModel<T> {
  data: T[];
}

export interface CreateVehicleRequest {
  name: string;
  licenseNumber: string;
  mileageInitial: number;
}

export interface UpdateVehicleRequest {
  name: string;
}

export type Response<T> = {
  data: T;
};

export interface PageResponse<T> {
  data: T[];
  pageInfo: PageInfo;
}

export type Vehicle = {
  id: number;
  name: string;
  licenseNumber: string;
  imageUrl: string;
  createAt: string;
  latitude: number;
  longitude: number;
  mileageCurrent?: number;
  ignitionStatus?: string;
};

export type CarIgnitionStatus = 'ON' | 'OFF';
export type EntityLifecycleStatus = 'ACTIVE' | 'DISABLED';

export type VehicleDetails = Vehicle & {
  latitude: number;
  longitude: number;
  mileageInitial: number;
  mileageCurrent: number;
  batteryVoltage: number;
  ignitionStatus: CarIgnitionStatus;
  activeTransactionId: string | null;
  speed: number;
  direction: number;
  name: string;
  licenseNumber: string;
  ignitionOnTime: string;
};

type SystemType = {
  createAt: string;
  updatedAt: string;
};

export type VehicleDetailsListResponse = ListModel<VehicleDetails & SystemType>;

export type PageRequest = {
  page: number;
  size: number;
};

export const getVehicles = async (
  pageRequest: PageRequest,
  params: { status?: 'ON' | 'OFF' | null }
) => {
  const response = await axiosInstance.get<PageResponse<Vehicle>>('/cars/search/ignition', {
    params: { ...pageRequest, ...params }
  });
  return response.data;
};

export const getVehiclesAll = async () => {
  const { data } = await axiosInstance.get<VehicleDetailsListResponse>('/cars/all');

  return data.data;
};

export const getVehiclesByStatus = async (status: 'ON' | 'OFF' | null) => {
  const { data } = await axiosInstance.get<VehicleDetailsListResponse>('/cars/ignition', {
    params: { status }
  });

  return data.data;
};

export const createVehicle = async (vehicle: CreateVehicleRequest) => {
  await axiosInstance.post<Vehicle>('/cars', vehicle);
};

export const getVehicle = async (id: number) => {
  const { data } = await axiosInstance.get<Response<VehicleDetails>>(`/cars/${id}`);

  return data.data;
};

export const deleteVehicle = async (id: number) => {
  await axiosInstance.delete(`/cars/${id}`);
};

export const updateVehicle = async (id: number, vehicle: UpdateVehicleRequest): Promise<Vehicle> => {
  const response = await axiosInstance.patch<Vehicle>(`/cars/${id}`, vehicle);
  return response.data;
};

export interface Period {
  start: string;
  end: string;
}
