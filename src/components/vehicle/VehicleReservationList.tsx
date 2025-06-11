import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Image, Tooltip } from '@nextui-org/react';
import { Vehicle } from '@/api/vehicle';
import { useNavigate } from 'react-router-dom';
import { useReservationMutation } from '@/hooks/api/reservation';

interface VehicleReservationListProps {
    vehicles: Vehicle[];
    onReserve: (vehicleId: number) => void;
}

export const VehicleReservationList: React.FC<VehicleReservationListProps> = ({
    vehicles,
    onReserve
}) => {
    const navigate = useNavigate();
    return (
        <Table 
            aria-label="차량 목록 테이블"
            classNames={{
                wrapper: "min-h-[400px]",
            }}
        >
            <TableHeader>
                <TableColumn>이미지</TableColumn>
                <TableColumn>차량명</TableColumn>
                <TableColumn>번호판</TableColumn>
                <TableColumn>관리</TableColumn>
            </TableHeader>
            <TableBody>
                {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                        <TableCell>
                            {vehicle.imageUrl ? (
                                <div className="w-40 h-40">
                                    <Image
                                        src={vehicle.imageUrl}
                                        alt={vehicle.name}
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400">No Image</span>
                                </div>
                            )}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold">{vehicle.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Tooltip content="차량 번호">
                                <span className="cursor-help">{vehicle.licenseNumber}</span>
                            </Tooltip>
                        </TableCell>
                        <TableCell>
                            <Button 
                                color="primary"
                                onPress={() => onReserve(vehicle.id)}
                                size="sm"
                            >
                                예약하기
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}; 