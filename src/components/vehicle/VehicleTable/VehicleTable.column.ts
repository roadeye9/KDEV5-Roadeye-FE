export interface VehicleTableColumn {
    name: string;
    displayName: string;
    hidden?: boolean;
}

export const VEHICLE_TABLE_COLUMNS: VehicleTableColumn[] = [
    {
        name: 'id',
        displayName: 'ID',
    },
    {
        name: 'name',
        displayName: '차량명',
    },
    {
        name: 'licenseNumber',
        displayName: '번호판',
    },
 
    {
        name: 'createdAt',
        displayName: '생성일',
    },
    {
        name: 'updatedAt',
        displayName: '수정일',
    },
   
]; 