import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useVehicleQuery } from '@/hooks/api/vehicle';
import { VehicleTimeline } from '@/components/vehicle/VehicleTimeline';
import { useReservationMutation, useEmployeeQuery } from '@/hooks/api/reservation';
import moment from 'moment';
import { toast } from 'react-hot-toast';
import EmptyState from '@/components/vehicle/EmptyState';
import { ReservePurpose, RESERVE_PURPOSE_LABELS } from '@/types/reservation';

const VehicleTimelinePage = () => {
    const { vehicleId } = useParams();
    const navigate = useNavigate();
    const { data: vehiclesData } = useVehicleQuery({ page: 0, size: 100 });
    const vehicle = vehiclesData?.data?.find(v => v.id === Number(vehicleId));
    
    // 예약 목록 조회
    const { data: reservations } = useEmployeeQuery(Number(vehicleId));
    
    // 예약 생성 mutation
    const { mutate: createReservation, isPending } = useReservationMutation();

    const [formData, setFormData] = useState({
        startTime: '',
        endTime: '',
        purpose: ''
    });

    const handleBack = () => {
        navigate('/manage/vehicle-reservation');
    };

    const handleReserve = () => {
        if (!vehicleId) return;
        
        // 입력값 검증
        if (!formData.startTime || !formData.endTime || !formData.purpose) {
            toast.error('모든 필드를 입력해주세요.');
            return;
        }

        // 시작 시간이 현재보다 이전인지 확인
        if (moment(formData.startTime).isBefore(moment())) {
            toast.error('시작 시간은 현재 시간 이후여야 합니다.');
            return;
        }

        // 종료 시간이 시작 시간보다 이전인지 확인
        if (moment(formData.endTime).isBefore(moment(formData.startTime))) {
            toast.error('종료 시간은 시작 시간 이후여야 합니다.');
            return;
        }

        createReservation(
            {
                carId: Number(vehicleId),
                rentStartAt: formData.startTime,
                rentEndAt: formData.endTime,
                reserveReason: formData.purpose,
                reservedAt: moment().toISOString()
            },
            {
                onSuccess: () => {
                    toast.success('예약이 신청되었습니다.');
                    setFormData({
                        startTime: '',
                        endTime: '',
                        purpose: ''
                    });
                },
                onError: (error) => {
                    toast.error('예약 신청에 실패했습니다.');
                    console.error('Reservation error:', error);
                }
            }
        );
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!vehicle) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">차량을 찾을 수 없습니다</h1>
                    <Button color="primary" onPress={handleBack}>
                        돌아가기
                    </Button>
                </div>
            </div>
        );
    }

    // 타임라인에 표시할 이벤트 데이터 변환
    const timelineEvents = reservations?.map(reservation => ({
        id: reservation.reservationId,
        start: reservation.rentStartAt,
        end: reservation.rentEndAt,
        title: `${RESERVE_PURPOSE_LABELS[reservation.reserveReason as ReservePurpose]} - ${reservation.reserverName}`,
        color: getStatusColor(reservation.reserveStatus)
    })) || [];

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">차량 예약 - {vehicle.name}</h1>
                        <p className="text-default-500">{vehicle.licenseNumber}</p>
                    </div>
                    <Button color="primary" variant="light" onPress={handleBack}>
                        목록으로
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl">예약 현황</h2>
                            </CardHeader>
                            <CardBody>
                                <div className="h-[600px]">
                                    {timelineEvents.length === 0 ? (
                                        <EmptyState />
                                    ) : (
                                        <VehicleTimeline events={timelineEvents} />
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl">예약 신청</h2>
                            </CardHeader>
                            <CardBody>
                                <form className="flex flex-col gap-4" onSubmit={(e) => {
                                    e.preventDefault();
                                    handleReserve();
                                }}>
                                    <Input
                                        type="datetime-local"
                                        label="시작 시간"
                                        placeholder="시작 시간을 선택하세요"
                                        value={formData.startTime}
                                        onValueChange={(value) => handleInputChange('startTime', value)}
                                        isRequired
                                        isDisabled={isPending}
                                    />
                                    <Input
                                        type="datetime-local"
                                        label="종료 시간"
                                        placeholder="종료 시간을 선택하세요"
                                        value={formData.endTime}
                                        onValueChange={(value) => handleInputChange('endTime', value)}
                                        isRequired
                                        isDisabled={isPending}
                                    />
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
                                    <Button 
                                        color="primary" 
                                        type="submit"
                                        isLoading={isPending}
                                    >
                                        예약하기
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 예약 상태별 색상
const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
        case 'PENDING':
            return '#FFF3E0';  // Light Orange
        case 'APPROVED':
            return '#E8F5E9';  // Light Green
        case 'REJECTED':
            return '#FFEBEE';  // Light Red
        case 'COMPLETED':
            return '#F5F5F5';  // Light Gray
        default:
            return '#E2E8F0';  // Default Gray
    }
};

export default VehicleTimelinePage; 