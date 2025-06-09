import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from '@nextui-org/react';
import { Reservation } from '@/api/reservation';
import moment from 'moment';
import { ReservePurpose, RESERVE_PURPOSE_LABELS } from '@/types/reservation';

interface ReservationDetailModalProps {
    reservation: Reservation | null;
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
}

const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
    reservation,
    isOpen,
    onClose,
    onApprove,
    onReject
}) => {
    if (!reservation) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            size="2xl"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h3 className="text-xl">예약 상세 정보</h3>
                    <p className="text-sm text-gray-500">예약 ID: {reservation.reservationId}</p>
                </ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">차량 정보</h4>
                                <p className="mt-1 text-lg">{reservation.carName}</p>
                                <p className="text-sm text-gray-600">{reservation.licenseNumber}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">예약자</h4>
                                <p className="mt-1">{reservation.reserverName}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">사용 목적</h4>
                                <Chip className="mt-1" size="sm" variant="flat" color="primary">
                                    {RESERVE_PURPOSE_LABELS[reservation.reserveReason as ReservePurpose]}
                                </Chip>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">예약 시간</h4>
                                <div className="mt-1 space-y-1">
                                    <p>시작: {moment(reservation.rentStartAt).format('YYYY-MM-DD HH:mm')}</p>
                                    <p>종료: {moment(reservation.rentEndAt).format('YYYY-MM-DD HH:mm')}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">예약 신청 시간</h4>
                                <p className="mt-1">{moment(reservation.reservedAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">현재 상태</h4>
                                <Chip 
                                    className="mt-1" 
                                    size="sm" 
                                    variant="flat" 
                                    color={
                                        reservation.reserveStatus === 'REQUESTED' ? 'warning' :
                                        reservation.reserveStatus === 'APPROVED' ? 'success' : 'danger'
                                    }
                                >
                                    {
                                        reservation.reserveStatus === 'REQUESTED' ? '대기중' :
                                        reservation.reserveStatus === 'APPROVED' ? '승인됨' : '거절됨'
                                    }
                                </Chip>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {reservation.reserveStatus === 'REQUESTED' && (
                        <>
                            <Button color="danger" variant="light" onPress={onReject}>
                                거절하기
                            </Button>
                            <Button color="primary" onPress={onApprove}>
                                승인하기
                            </Button>
                        </>
                    )}
                    <Button color="default" variant="light" onPress={onClose}>
                        닫기
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReservationDetailModal; 