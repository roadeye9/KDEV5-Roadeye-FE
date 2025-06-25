import { axiosInstance } from "./axiosInstance";

export type PageInfo = {
    page: number;
    size: number;
    total: number;
}

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
}

export interface PageResponse<T> {
    data: T[];
    pageInfo: PageInfo;
}

export type DrivingHistory = {
    id: number;
    vehicleId: number;
    driverId: number;
    startAt: string;
    endAt: string;
    distance: number;
    fuelConsumption: number;
}

export type PageRequest = {
    page: number;
    size: number;
}

export type DrivingHistoryListResponse = ListModel<DrivingHistory>;

export const getDrivingHistory = async (pageRequest: PageRequest) => {
    const { data } = await axiosInstance.get<PageResponse<DrivingHistory>>(`/driving-history?page=${pageRequest.page}&size=${pageRequest.size}`);
    return data;
}

export const getDrivingHistoryAll = async () => {
    const { data } = await axiosInstance.get<DrivingHistoryListResponse>('/driving-history/all');
    return data;
}