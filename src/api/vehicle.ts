import { axiosInstance } from "./axiosInstance";

interface PageInfo  {
    page: number;
    size: number;
    total: number;
}

export interface ListModel<T> {
    data: T[];
}

export type Response<T> = {
    data: T;
}

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
}

export type CarIgnitionStatus = "ON" | "OFF"
export type EntityLifecycleStatus = "ACTIVE" | "DISABLED"

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
}

export type VehicleDetailsListResponse = ListModel<VehicleDetails & SystemType>;


export type PageRequest = {
    page: number;
    size: number;
}


const combine = (path: string, request: PageRequest) => path + '?' + Object.entries(request).map(([key, value]) => `${key}=${value}`).join('&');



export const getVehicles = async (pageRequest: PageRequest, params: { status?: "ON" | "OFF" | null }) => {
    const response = await axiosInstance.get<PageResponse<Vehicle>>('/cars/search/ignition', {
        params: { ...pageRequest, ...params },
    });
    return response.data;
}

export const getVehiclesAll = async () => {
    const { data } = await axiosInstance.get<VehicleDetailsListResponse>('/cars/all');

    return data.data;
}

export const getVehiclesByStatus = async (status: "ON" | "OFF" | null) => {
  const { data } = await axiosInstance.get<VehicleDetailsListResponse>("/cars/ignition", {
    params: { status },
  });

  return data.data;
};

export const postVehicle = async (vehicle: Omit<Vehicle, 'id'> & { mileageInitial: number }) => {
    await axiosInstance.post('/cars', vehicle);
}

export const getVehicle = async (id: number) => {
    const { data: { data } } = await axiosInstance.get<Response<Vehicle>>(`/cars/${id}`);

    return data;
}

export const deleteVehicle = async (id: number) => {
    await axiosInstance.delete(`/cars/${id}`);
}

export const patchVehicle = async ({ id, vehicle }: { id: number, vehicle: Pick<Vehicle, 'name' | 'imageUrl'> }) => {
    await axiosInstance.patch(`/cars/${id}`, vehicle);
}

export interface Period {
    start: string;
    end: string;
}
