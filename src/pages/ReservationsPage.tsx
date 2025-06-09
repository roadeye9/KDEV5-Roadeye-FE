import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Button, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, ButtonGroup } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { RESERVATION_QUERY_KEY, Reservation, getReservations, updateReservationStatus } from '@/api/reservation';
import moment from 'moment';
import { MoreVertical, List, Calendar, LayoutGrid } from 'lucide-react';
import { VehicleTimeline } from '@/components/vehicle/VehicleTimeline';
import { ReservePurpose, RESERVE_PURPOSE_LABELS } from '@/types/reservation';
import EmptyState from '@/components/vehicle/EmptyState';
import KanbanBoard from '@/components/reservation/KanbanBoard';

const STATUS_COLORS = {
    REQUESTED: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
} as const;

const STATUS_LABELS = {
    REQUESTED: '대기중',
    APPROVED: '승인됨',
    REJECTED: '거절됨',
} as const;

type ViewMode = 'table' | 'timeline' | 'kanban';

const ReservationsPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [viewMode, setViewMode] = useState<ViewMode>('kanban');

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

    // 타임라인에 표시할 이벤트 데이터 변환
    const timelineEvents = (reservationsData?.data || []).map(reservation => ({
        id: reservation.reservationId,
        start: reservation.rentStartAt,
        end: reservation.rentEndAt,
        title: `[${reservation.carName}] ${RESERVE_PURPOSE_LABELS[reservation.reserveReason as ReservePurpose]} - ${reservation.reserverName}`,
        color: getStatusColor(reservation.reserveStatus)
    }));

    const renderTableView = () => (
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
                        <TableCell>{RESERVE_PURPOSE_LABELS[item.reserveReason as ReservePurpose]}</TableCell>
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
    );

    const renderTimelineView = () => (
        <div className="h-[600px]">
            {timelineEvents.length === 0 ? (
                <EmptyState message="등록된 예약이 없습니다." />
            ) : (
                <VehicleTimeline events={timelineEvents} />
            )}
        </div>
    );

    const renderKanbanView = () => (
        <KanbanBoard 
            reservations={reservationsData?.data || []}
            onStatusChange={handleStatusChange}
        />
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-[400px]">
                    <div className="text-lg">로딩 중...</div>
                </div>
            );
        }

        switch (viewMode) {
            case 'table':
                return renderTableView();
            case 'timeline':
                return renderTimelineView();
            case 'kanban':
                return renderKanbanView();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Card className="m-0 rounded-none min-h-screen p-3">
                <CardHeader className="flex justify-between bg-white shadow-sm z-10">
                    <h1 className="text-2xl font-bold">전체 예약 관리</h1>
                    <ButtonGroup>
                        <Button
                            isIconOnly
                            variant={viewMode === 'timeline' ? 'solid' : 'light'}
                            onClick={() => setViewMode('timeline')}
                        >
                            <Calendar size={20} />
                        </Button>
                        <Button
                            isIconOnly
                            variant={viewMode === 'table' ? 'solid' : 'light'}
                            onClick={() => setViewMode('table')}
                        >
                            <List size={20} />
                        </Button>
                        <Button
                            isIconOnly
                            variant={viewMode === 'kanban' ? 'solid' : 'light'}
                            onClick={() => setViewMode('kanban')}
                        >
                            <LayoutGrid size={20} />
                        </Button>
                    </ButtonGroup>
                </CardHeader>
                <CardBody className="p-0">
                    {renderContent()}
                </CardBody>
            </Card>
        </div>
    );
};

// 예약 상태별 색상
const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
        case 'REQUESTED':
            return '#FFF3E0';  // Light Orange
        case 'APPROVED':
            return '#E8F5E9';  // Light Green
        case 'REJECTED':
            return '#FFEBEE';  // Light Red
        default:
            return '#E2E8F0';  // Default Gray
    }
};

export default ReservationsPage; 