import { PageRequest } from "@/api/vehicle";
import { CreateReservationRequest, RESERVATION_QUERY_KEY, createReservation, getReservationsByCarWithAfterNow } from "@/api/reservation";
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

