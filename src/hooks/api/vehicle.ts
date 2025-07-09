import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';

import {
  CarIgnitionStatus,
  deleteVehicle,
  getVehicle,
  getVehicles,
  getVehiclesAll,
  getVehiclesByStatus,
  PageRequest,
  updateVehicle,
  createVehicle,
  UpdateVehicleRequest
} from '@/api/vehicle';
import { queryClient } from '@/app';

const REFETCH_INTERVAL = Number(import.meta.env.VITE_REFETCH_INTERVAL_MS);

export const VEHICLE_QUERY_KEY = {
  all: ['vehicles'] as const,
  allDetails: ['vehicles-details'] as const,
  add: ['vehicle-add'] as const,
  delete: ['vehicle-delete'] as const,
  update: ['vehicle-update'] as const,
  list: (params: PageRequest) => [...VEHICLE_QUERY_KEY.all, 'list', params] as const,
  byStatus: (status: 'ON' | 'OFF' | null) => ['vehicle', 'byStatus', status] as const
};

export interface VehicleQueryParams extends PageRequest {
  status?: 'ON' | 'OFF' | null;
  ignitionStatus?: CarIgnitionStatus;
}

export const useVehicleQuery = (params: VehicleQueryParams) => {
  return useSuspenseQuery({
    queryKey: VEHICLE_QUERY_KEY.list(params),
    queryFn: () => getVehicles(params, { status: params.status })
  });
};

export const useVehicleAllQuery = () => {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEY.allDetails,
    queryFn: getVehiclesAll,
    refetchInterval: REFETCH_INTERVAL
  });
};

export const useVehicleByStatusQuery = (status: 'ON' | 'OFF' | null, isActive: boolean = false) => {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEY.byStatus(status),
    queryFn: () => getVehiclesByStatus(status),
    refetchInterval: isActive ? REFETCH_INTERVAL : false
  });
};

export const useVehicleMutation = () => {
  return useMutation({
    mutationKey: VEHICLE_QUERY_KEY.add,
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEY.all });
    }
  });
};

export const useVehicleDeleteMutation = () => {
  return useMutation({
    mutationKey: VEHICLE_QUERY_KEY.delete,
    mutationFn: deleteVehicle
  });
};

export const useVehicleUpdateMutation = () => {
  return useMutation({
    mutationKey: VEHICLE_QUERY_KEY.update,
    mutationFn: ({ id, vehicle }: { id: number, vehicle: UpdateVehicleRequest }) => updateVehicle(id, vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEY.all });
    }
  });
};

export const useVehicleDetailQuery = (vehicleId: number | null, options = {}) => {
  return useSuspenseQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => getVehicle(vehicleId!),
    ...options,
  });
};
