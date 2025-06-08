import React from 'react';
import { Card, CardBody, CardHeader, Spinner } from '@nextui-org/react';
import { VehicleReservationList } from '@/components/vehicle/VehicleReservationList';
import { MyReservationList } from '@/components/vehicle/MyReservationList';
import { useVehicleQuery } from '@/hooks/api/vehicle';

const VehicleReservationPage = () => {
    const { data: vehiclesData, isLoading } = useVehicleQuery({ page: 0, size: 100 });
    const vehicles = vehiclesData?.data || [];

    // TODO: Implement reservation hooks and handlers
    const handleReserve = (vehicleId: number) => {
        console.log('Reserve vehicle:', vehicleId);
    };

    const handleCancelReservation = (reservationId: number) => {
        console.log('Cancel reservation:', reservationId);
    };

    // TODO: Replace with actual reservation data
    const mockReservations = [
        {
            id: 1,
            vehicleName: '테스트 차량',
            startDate: '2024-03-20',
            endDate: '2024-03-21',
            status: 'PENDING' as const
        }
    ];

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
                    <CardHeader className="flex justify-between">
                        <h2 className="text-xl">예약 가능한 차량</h2>
                    </CardHeader>
                    <CardBody>
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

                <Card>
                    <CardHeader>
                        <h2 className="text-xl">나의 예약 현황</h2>
                    </CardHeader>
                    <CardBody>
                        <MyReservationList 
                            reservations={mockReservations}
                            onCancel={handleCancelReservation}
                        />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default VehicleReservationPage; 