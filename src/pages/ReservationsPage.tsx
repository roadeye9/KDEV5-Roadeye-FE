import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Button, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { RESERVATION_QUERY_KEY, Reservation, getReservations, updateReservationStatus } from '@/api/reservation';
import moment from 'moment';
import { MoreVertical } from 'lucide-react';

const STATUS_COLORS = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
    COMPLETED: 'default'
} as const;

const STATUS_LABELS = {
    PENDING: '대기중',
    APPROVED: '승인됨',
    REJECTED: '거절됨',
    COMPLETED: '완료됨'
} as const;

const ReservationsPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // 전체 예약 목록 조회
    const { data: reservationsData, isLoading } = useQuery({
        queryKey: RESERVATION_QUERY_KEY.list({ page: page - 1, size: rowsPerPage }),
        queryFn: () => getReservations({ page: page - 1, size: rowsPerPage })
    });

    const handleStatusChange = async (reservationId: number, status: string) => {
        try {
            await updateReservationStatus(reservationId, status);
            // 목록 새로고침
            window.location.reload();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader className="flex justify-between">
                    <h1 className="text-2xl font-bold">전체 예약 관리</h1>
                </CardHeader>
                <CardBody>
                    <Table
                        aria-label="예약 목록"
                        bottomContent={
                            <div className="flex justify-between items-center">
                                <Pagination
                                    total={Math.ceil((reservationsData?.totalElements || 0) / rowsPerPage)}
                                    page={page}
                                    onChange={setPage}
                                />
                            </div>
                        }
                    >
                        <TableHeader>
                            <TableColumn>차량</TableColumn>
                            <TableColumn>예약자</TableColumn>
                            <TableColumn>시작 시간</TableColumn>
                            <TableColumn>종료 시간</TableColumn>
                            <TableColumn>목적</TableColumn>
                            <TableColumn>상태</TableColumn>
                            <TableColumn>관리</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {(reservationsData?.data || []).map((item) => (
                                <TableRow key={item.reservationId}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{item.carName}</div>
                                            <div className="text-sm text-gray-500">{item.licenseNumber}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.reserverName}</TableCell>
                                    <TableCell>{moment(item.rentStartAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                                    <TableCell>{moment(item.rentEndAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                                    <TableCell>{item.reserveReason}</TableCell>
                                    <TableCell>
                                        <Chip
                                            color={STATUS_COLORS[item.reserveStatus as keyof typeof STATUS_COLORS]}
                                            variant="flat"
                                            size="sm"
                                        >
                                            {STATUS_LABELS[item.reserveStatus as keyof typeof STATUS_LABELS]}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button isIconOnly variant="light" size="sm">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu>
                                                <DropdownItem
                                                    key="approve"
                                                    onClick={() => handleStatusChange(item.reservationId, 'APPROVED')}
                                                    className="text-success"
                                                >
                                                    승인
                                                </DropdownItem>
                                                <DropdownItem
                                                    key="reject"
                                                    onClick={() => handleStatusChange(item.reservationId, 'REJECTED')}
                                                    className="text-danger"
                                                >
                                                    거절
                                                </DropdownItem>
                                                <DropdownItem
                                                    key="timeline"
                                                    onClick={() => navigate(`/manage/vehicle-reservation/${item.carId}/timeline`)}
                                                >
                                                    타임라인 보기
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
};

export default ReservationsPage; 