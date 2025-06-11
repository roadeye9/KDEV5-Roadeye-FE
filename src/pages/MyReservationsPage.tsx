import React from 'react';
import { Card, CardBody, CardHeader, Spinner, Button, Chip } from '@nextui-org/react';
import { useReservationMutation, useReservationByMe } from '@/hooks/api/reservation';
import dayjs from 'dayjs';
import { ReservePurpose } from '@/types/reservation';
import { MyReservation } from '@/api/reservation';
import { useNavigate } from 'react-router-dom';

const RESERVE_PURPOSE_LABELS: Record<ReservePurpose, string> = {
    [ReservePurpose.COMMUTE]: '집↔직장 정기 이동',
    [ReservePurpose.BUSINESS_TRIP]: '업무상 임시 출장',
    [ReservePurpose.PERSONAL]: '개인적 용무',
    [ReservePurpose.OTHER]: '그 외 기타 목적'
};

const MyReservationsPage = () => {
    const navigate = useNavigate();
    const { data: reservationsData, isLoading, refetch } = useReservationByMe({page: 0, size: 10});
    const { mutate: updateReservation, isPending: isUpdating } = useReservationMutation();

    const handleCancelReservation = (reservationId: number) => {
        if (window.confirm('예약을 취소하시겠습니까?')) {
            updateReservation({
                carId: reservationId,
                rentStartAt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
                rentEndAt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
                reservedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
                reserveReason: 'CANCELED'
            }, {
                onSuccess: () => {
                    refetch();
                }
            });
        }
    };

    const handleViewDriveHistory = (reservationId: number) => {
        navigate(`/manage/drive-history/${reservationId}`);
    };

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'REQUESTED':
                return <Chip color="warning">대기중</Chip>;
            case 'APPROVED':
                return <Chip color="success">승인됨</Chip>;
            case 'REJECTED':
                return <Chip color="danger">거절됨</Chip>;
            default:
                return <Chip>{status}</Chip>;
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">내 예약 현황</h1>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Spinner size="g" />
                    </div>
                ) : !reservationsData?.data || reservationsData.data.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        예약 내역이 없습니다.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reservationsData.data.map((reservation: MyReservation) => (
                            <Card key={reservation.reservationId} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold">
                                                {reservation.carName}
                                            </h3>
                                            {getStatusChip(reservation.reserveStatus)}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {dayjs(reservation.rentStartAt).format('YYYY-MM-DD HH:mm')} ~ {dayjs(reservation.rentEndAt).format('YYYY-MM-DD HH:mm')}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            사용 목적: {RESERVE_PURPOSE_LABELS[reservation.reserveReason as ReservePurpose]}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            차량 번호: {reservation.licenseNumber}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {reservation.reserveStatus === 'REQUESTED' && (
                                            <Button 
                                                color="danger" 
                                                variant="light"
                                                onPress={() => handleCancelReservation(reservation.reservationId)}
                                                isLoading={isUpdating}
                                            >
                                                예약 취소
                                            </Button>
                                        )}
                                        {reservation.reserveStatus === 'APPROVED' && (
                                            <Button
                                                color="primary"
                                                variant="flat"
                                                onPress={() => handleViewDriveHistory(reservation.reservationId)}
                                            >
                                                주행 이력
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReservationsPage; 