import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Chip } from '@nextui-org/react';

interface Reservation {
    id: number;
    vehicleName: string;
    startDate: string;
    endDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
}

interface MyReservationListProps {
    reservations: Reservation[];
    onCancel: (reservationId: number) => void;
}

const STATUS_MAP = {
    PENDING: { label: '대기중', color: 'warning' },
    APPROVED: { label: '승인됨', color: 'success' },
    REJECTED: { label: '거절됨', color: 'danger' },
    COMPLETED: { label: '완료됨', color: 'default' },
} as const;

export const MyReservationList: React.FC<MyReservationListProps> = ({
    reservations,
    onCancel
}) => {
    return (
        <Table aria-label="예약 현황 테이블">
            <TableHeader>
                <TableColumn>차량</TableColumn>
                <TableColumn>시작일</TableColumn>
                <TableColumn>종료일</TableColumn>
                <TableColumn>상태</TableColumn>
                <TableColumn>관리</TableColumn>
            </TableHeader>
            <TableBody>
                {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                        <TableCell>{reservation.vehicleName}</TableCell>
                        <TableCell>{new Date(reservation.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(reservation.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Chip
                                color={STATUS_MAP[reservation.status].color as any}
                                size="sm"
                            >
                                {STATUS_MAP[reservation.status].label}
                            </Chip>
                        </TableCell>
                        <TableCell>
                            {reservation.status === 'PENDING' && (
                                <Button
                                    color="danger"
                                    size="sm"
                                    variant="light"
                                    onPress={() => onCancel(reservation.id)}
                                >
                                    취소
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}; 