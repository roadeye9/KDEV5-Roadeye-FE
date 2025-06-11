import { getReservationByAvailable, PageRequest, Period } from "@/api/vehicle";
import { CreateReservationRequest, RESERVATION_QUERY_KEY, approveReservation, createReservation, getReservationsByCarWithAfterNow } from "@/api/reservation";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useReservationMutation = () => {
    return useMutation<void, Error, CreateReservationRequest>({
        mutationKey: RESERVATION_QUERY_KEY.add,
        mutationFn: createReservation,
    });
};

export const useEmployeeQuery = (carId: number) => {
    return useQuery({
        queryKey: RESERVATION_QUERY_KEY.car(carId),
        queryFn: () => getReservationsByCarWithAfterNow(carId),
    });
};

export const useReservationHooks = () => {
    return useMutation({
        mutationKey: RESERVATION_QUERY_KEY.approve,
        mutationFn: approveReservation,
    })
}

export const useReservationByAvailable = (period: Period, page: PageRequest) => {
    return useQuery({
        queryKey: RESERVATION_QUERY_KEY.available(period, page),
        queryFn: () => getReservationByAvailable(period, page),
    })
}