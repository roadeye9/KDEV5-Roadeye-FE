import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Spinner, Button, DateRangePicker, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem } from '@nextui-org/react';
import { VehicleReservationList } from '@/components/vehicle/VehicleReservationList';
import { MyReservationList } from '@/components/vehicle/MyReservationList';
import { useVehicleQuery } from '@/hooks/api/vehicle';
import { useReservationByAvailable, useReservationMutation } from '@/hooks/api/reservation';
import dayjs from 'dayjs';
import { parseDateTime, CalendarDateTime } from '@internationalized/date';
import { ReservePurpose } from '@/types/reservation';

const RESERVE_PURPOSE_LABELS: Record<ReservePurpose, string> = {
    [ReservePurpose.COMMUTE]: '집↔직장 정기 이동',
    [ReservePurpose.BUSINESS_TRIP]: '업무상 임시 출장',
    [ReservePurpose.PERSONAL]: '개인적 용무',
    [ReservePurpose.OTHER]: '그 외 기타 목적'
}; 

const VehicleReservationPage = () => {
    const now = dayjs();
    const [dateRange, setDateRange] = useState<{ start: CalendarDateTime; end: CalendarDateTime }>({
        start: parseDateTime(`${now.format('YYYY-MM-DD')}T00:00:00`),
        end: parseDateTime(`${now.add(1, 'day').format('YYYY-MM-DD')}T23:59:59`)
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        purpose: ''
    });

    const { data: vehiclesData, isLoading, refetch } = useReservationByAvailable({ 
        start: dateRange?.start ? dayjs(dateRange.start.toString()).format('YYYY-MM-DDTHH:mm:ss') : now.format('YYYY-MM-DDTHH:mm:ss'),
        end: dateRange?.end ? dayjs(dateRange.end.toString()).format('YYYY-MM-DDTHH:mm:ss') : now.add(1, 'day').format('YYYY-MM-DDTHH:mm:ss')
    }, { page: 0, size: 20});

    const {mutate: reserveVehicle, isPending} = useReservationMutation();
    const vehicles = vehiclesData?.data || [];

    const handleSearch = () => {
        refetch();
    };

    const handleDateRangeChange = (value: { start: CalendarDateTime; end: CalendarDateTime } | null) => {
        if (value) {
            setDateRange(value);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleReserve = (vehicleId: number) => {
        setSelectedVehicleId(vehicleId);
        setIsModalOpen(true);
    };

    const handleConfirmReservation = () => {
        if (!selectedVehicleId || !formData.purpose) return;

        reserveVehicle({
            carId: selectedVehicleId,
            rentStartAt: dayjs(dateRange.start.toString()).format('YYYY-MM-DDTHH:mm:ss'),
            rentEndAt: dayjs(dateRange.end.toString()).format('YYYY-MM-DDTHH:mm:ss'),
            reservedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            reserveReason: formData.purpose
        }, {
            onSuccess: () => {
                setIsModalOpen(false);
                setSelectedVehicleId(null);
                setFormData({ purpose: '' });
                refetch();
            }
        });
    };

    const handleCancelReservation = (reservationId: number) => {
        console.log('Cancel reservation:', reservationId);
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">차량 예약 신청</h1>
                    <div className="text-sm text-gray-500">
                        총 {vehicles.length}대의 차량
                    </div>
                </div>
                
                <Card>
                    <CardHeader>
                        <h2 className="text-xl">예약 가능한 차량</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="flex gap-4 mb-4">
                            <DateRangePicker
                                value={dateRange}
                                onChange={handleDateRangeChange}
                                className="max-w-xl"
                            />
                        </div>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <Spinner size="lg" />
                            </div>
                        ) : vehicles.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                예약 가능한 차량이 없습니다.
                            </div>
                        ) : (
                            <VehicleReservationList 
                                vehicles={vehicles}
                                onReserve={handleReserve}
                            />
                        )}
                    </CardBody>
                </Card>

                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    placement="center"
                >
                    <ModalContent>
                        <ModalHeader>차량 예약</ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <div className="text-sm text-gray-600">
                                    <p>예약 기간: {dateRange.start.toString()} ~ {dateRange.end.toString()}</p>
                                </div>
                                <Select
                                    label="사용 목적"
                                    placeholder="사용 목적을 선택하세요"
                                    selectedKeys={formData.purpose ? [formData.purpose] : []}
                                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                                    isRequired
                                    isDisabled={isPending}
                                >
                                    {Object.entries(RESERVE_PURPOSE_LABELS).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={() => setIsModalOpen(false)}>
                                취소
                            </Button>
                            <Button color="primary" onPress={handleConfirmReservation} isLoading={isPending}>
                                예약하기
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Card>
                    <CardHeader>
                        <h2 className="text-xl">나의 예약 현황</h2>
                    </CardHeader>
                    <CardBody>
                        <MyReservationList 
                            reservations={[]}
                            onCancel={handleCancelReservation}
                        />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default VehicleReservationPage; 