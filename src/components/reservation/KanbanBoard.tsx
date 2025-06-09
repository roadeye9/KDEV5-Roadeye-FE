import React, { useState } from 'react';
import { Card, CardBody, Chip } from '@nextui-org/react';
import { Reservation } from '@/api/reservation';
import moment from 'moment';
import { ReservePurpose, RESERVE_PURPOSE_LABELS } from '@/types/reservation';
import ReservationDetailModal from './ReservationDetailModal';
import { useReservationHooks } from '@/hooks/api/reservation';
import { RESERVATION_QUERY_KEY } from '@/api/reservation';
import { queryClient } from '@/app';

interface KanbanBoardProps {
    reservations: Reservation[];
    onStatusChange: (reservationId: number, status: string) => Promise<void>;
}

const COLUMN_STYLES = {
    REQUESTED: {
        title: '대기중',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
    },
    APPROVED: {
        title: '승인됨',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
    },
    REJECTED: {
        title: '거절됨',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
    }
} as const;

const KanbanBoard: React.FC<KanbanBoardProps> = ({ reservations, onStatusChange }) => {
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { mutate: approveReservation } = useReservationHooks();

    // 예약을 상태별로 그룹화
    const groupedReservations = reservations.reduce((acc, reservation) => {
        const status = reservation.reserveStatus;
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(reservation);
        return acc;
    }, {} as Record<string, Reservation[]>);

    const handleCardClick = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedReservation(null);
    };

    const handleApprove = async () => {
        if (selectedReservation) {
            approveReservation(selectedReservation.reservationId, {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey: RESERVATION_QUERY_KEY.list({ page: 0, size: 10 }) });
                    handleModalClose();
                }
            });
            handleModalClose();
        }
    };

    const handleReject = async () => {
        if (selectedReservation) {
            await onStatusChange(selectedReservation.reservationId, 'REJECTED');
            handleModalClose();
        }
    };

    const renderReservationCard = (reservation: Reservation) => (
        <Card 
            key={reservation.reservationId}
            className="mb-3 cursor-pointer w-full"
            shadow='none'
            isPressable
            onPress={() => handleCardClick(reservation)}
        >
            <CardBody className="p-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">{reservation.carName}</span>
                        <Chip size="sm" variant="flat" color="primary">
                            {RESERVE_PURPOSE_LABELS[reservation.reserveReason as ReservePurpose]}
                        </Chip>
                    </div>
                    <div className="text-sm text-gray-500">
                        예약자: {reservation.reserverName}
                    </div>
                    <div className="text-xs text-gray-400">
                        <div>시작: {moment(reservation.rentStartAt).format('YYYY-MM-DD HH:mm')}</div>
                        <div>종료: {moment(reservation.rentEndAt).format('YYYY-MM-DD HH:mm')}</div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );

    return (
        <>
            <div className="grid grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
                {Object.entries(COLUMN_STYLES).map(([status, style]) => (
                    <div 
                        key={status}
                        className={`flex flex-col rounded-lg p-4 ${style.bgColor} border ${style.borderColor}`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">{style.title}</h3>
                            <span className="text-sm text-gray-500">
                                {groupedReservations[status]?.length || 0}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {groupedReservations[status]?.map(renderReservationCard) || null}
                        </div>
                    </div>
                ))}
            </div>
            <ReservationDetailModal
                reservation={selectedReservation}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </>
    );
};

export default KanbanBoard; 