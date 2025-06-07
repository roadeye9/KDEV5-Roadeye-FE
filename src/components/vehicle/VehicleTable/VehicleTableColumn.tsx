import { Vehicle } from '@/api/vehicle';
import { Button, Image } from '@nextui-org/react';

interface VehicleTableColumnProps {
    vehicle: Vehicle;
    columnKey: string;
}

export const VehicleTableColumn = ({ vehicle, columnKey }: VehicleTableColumnProps) => {
    const cellValue = vehicle[columnKey as keyof Vehicle];

    switch (columnKey) {
        case 'imageUrl':
            return cellValue ? (
                <div className="relative">
                    <Image
                        src={cellValue as string}
                        alt={vehicle.name}
                        className="object-cover"
                    />
                </div>
            ) : null;
        
        case 'actions':
            return (
                <div></div>
            );
        
        default:
            return <span>{cellValue}</span>;
    }
}; 