import { CarIgnitionStatus, deleteVehicle, EntityLifecycleStatus, getVehicles, getVehiclesAll, getVehiclesByStatus, PageRequest, patchVehicle, postVehicle, getVehicle } from "@/api/vehicle";
import { useMutation, useQuery } from "@tanstack/react-query";

const REFETCH_INTERVAL = Number(import.meta.env.VITE_REFETCH_INTERVAL_MS);

export const VEHICLE_QUERY_KEY = {
    all: ['vehicles'] as const,
    allDetails: ['vehicles-details'] as const,
    add: ['vehicle-add'] as const,
    delete: ['vehicle-delete'] as const,
    patch: ['vehicle-patch'] as const,
    list: (params: PageRequest) => [...VEHICLE_QUERY_KEY.all, 'list', params] as const,
    byStatus: (status: "ON" | "OFF") => ['vehicle', 'byStatus', status] as const,
}

export interface VehicleQueryParams extends PageRequest {
    status?: EntityLifecycleStatus;
    ignitionStatus?: CarIgnitionStatus;
}

export const useVehicleQuery = (params: VehicleQueryParams) => {
    return useQuery({
        queryKey: VEHICLE_QUERY_KEY.list(params),
        queryFn: () => getVehicles(params),
    });
}

export const useVehicleAllQuery = () => {
    return useQuery({
        queryKey: VEHICLE_QUERY_KEY.allDetails,
        queryFn: getVehiclesAll,
        refetchInterval: REFETCH_INTERVAL,
    });
}

export const useVehicleByStatusQuery = (status: "ON" | "OFF") => {
    return useQuery({
        queryKey: VEHICLE_QUERY_KEY.byStatus(status),
        queryFn: () => getVehiclesByStatus(status),
    });
}

export const useVehicleMutation = () => {
    return useMutation({
        mutationKey: VEHICLE_QUERY_KEY.add,
        mutationFn: postVehicle,
    });
}

export const useVehicleDeleteMutation = () => {
    return useMutation({
        mutationKey: VEHICLE_QUERY_KEY.delete,
        mutationFn: deleteVehicle,
    });
}

export const useVehiclePatchMutation = () => {
    return useMutation({
        mutationKey: VEHICLE_QUERY_KEY.patch,
        mutationFn: patchVehicle,
    });
}

export const useVehicleDetailQuery = (vehicleId: number | null, options = {}) => {
    return useQuery({
        queryKey: ["vehicle", vehicleId],
        queryFn: () => getVehicle(vehicleId!),
        enabled: !!vehicleId,
        ...options,
    });
};

