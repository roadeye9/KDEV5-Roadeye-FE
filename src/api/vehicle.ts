import { axiosInstance } from "./axiosInstance";

export type PageInfo = { 
    page: number;
    size: number;
    total: number;
}

export type PagedModel<T> = {
    data: T[];
    pageInfo: PageInfo;
}

export type Response<T> = {
    data: T;
}

export type Vehicle = {
    id: number;
    name: string;
    licenseNumber: string;
    imageUrl: string;
}


type SystemType = { 
    createAt: string;
    updatedAt: string; 
}

export type VehilceSearchResponse = PagedModel<Vehicle & SystemType>;


export type PageRequest = {
    page: number;
    size: number;
}


const combine = (path: string, request: PageRequest) => path + '?' + Object.entries(request).map(([key, value]) => `${key}=${value}`).join('&');



export const getVehicles = async (pageRequest: PageRequest) => {
    const {data} = await axiosInstance.get<VehilceSearchResponse>(combine('/cars', pageRequest));

    return data;
}

export const postVehicle = async (vehicle: Omit<Vehicle, 'id'> & {mileageInitial: number}) => {
    await axiosInstance.post('/cars', vehicle);
}

export const getVehicle = async (id: number) => {
    const {data: {data}} = await axiosInstance.get<Response<Vehicle>>(`/cars/${id}`);

    return data;
}

export const deleteVehicle = async (id: number) => {
    await axiosInstance.delete(`/cars/${id}`);
}

export const patchVehicle = async ({id, vehicle} : {id: number, vehicle: Pick<Vehicle, 'name' | 'imageUrl'>}) => {
    await axiosInstance.patch(`/cars/${id}`, vehicle);
}

// TODO: search ignition
// TODO count ignition 
