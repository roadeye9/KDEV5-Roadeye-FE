import { axiosInstance } from "./axiosInstance";
import { PagedModel, PageRequest } from "./vehicle";

export interface Reservation {
    reservationId: number;
    carId: number;
    carName: string;
    licenseNumber: string;
    reserverName: string;
    rentStartAt: string;
    rentEndAt: string;
    reserveStatus: string;  
    reserveReason: string;
    approverName: string;
    rejectReason: string;
}

export interface CreateReservationRequest {
    carId: number;
    rentStartAt: string;
    rentEndAt: string;
    reserveReason: string;
    reservedAt: string;
}

export const RESERVATION_QUERY_KEY = {
    all: ['reservations'] as const,
    add: ['reservation-add'] as const,
    approve: ['reservation-approve'] as const,
    car: (id: number) => ['reservation-car', id] as const,
    list: (params: PageRequest) => [...RESERVATION_QUERY_KEY.all, 'list', params] as const,
};

// 차량 예약 조회 단 현재 시간 이후 기준
export const getReservationsByCarWithAfterNow = async (carId: number) => {
    const {data} = await axiosInstance.get<PagedModel<Reservation>>(`/reservation/${carId}?sort=createdAt,desc`);
    return data.data;
};

export const createReservation = async (request: CreateReservationRequest): Promise<void> => {
    await axiosInstance.post('/reservation', request);
};

// 전체 예약 목록 조회
export const getReservations = async (params: PageRequest) => {
    const { data } = await axiosInstance.get<PagedModel<Reservation>>(`/reservation?page=${params.page}&size=${params.size}&sort=createdAt,desc`);
    return data;
};

// 예약 상태 변경
export const updateReservationStatus = async (reservationId: number, status: string): Promise<void> => {
    await axiosInstance.patch(`/reservation/${reservationId}/status`, { status });
};

export const approveReservation = async (reservationId: number): Promise<void> => {
    await axiosInstance.patch(`/reservation/${reservationId}/approve`);
}





