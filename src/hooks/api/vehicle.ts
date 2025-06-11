import { deleteVehicle, getVehicles, getVehiclesAll, PageRequest, patchVehicle, postVehicle } from "@/api/vehicle";
import { useMutation, useQuery } from "@tanstack/react-query";

export const VEHICLE_QUERY_KEY = {
    all: ['vehicles'] as const,
    allDetails: ['vehicles-details'] as const,
    add: ['vehicle-add'] as const,
    delete: ['vehicle-delete'] as const,
    patch: ['vehicle-patch'] as const,
    list: (params: PageRequest) => [...VEHICLE_QUERY_KEY.all, 'list', params] as const,
}

export const useVehicleQuery = (params: PageRequest) => {
    return useQuery({
        queryKey: VEHICLE_QUERY_KEY.list(params),
        queryFn: () => getVehicles(params),
    });
}

export const useVehicleAllQuery = () => {
    return useQuery({
        queryKey: VEHICLE_QUERY_KEY.allDetails,
        queryFn: getVehiclesAll,
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

