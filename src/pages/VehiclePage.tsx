import { VehicleHeader } from "@/components/vehicle/VehicleHeader/VehicleHeader";
import VehicleTable from "@/components/vehicle/VehicleTable/VehicleTable";
import { useVehicle } from "@/hooks/pages/useVehicle";

const VehiclePage = () => {

    const {vehicles, pagination} = useVehicle();
    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)] divide-y divide-gray-200">
            <div className="border-b border-gray-200">
                <VehicleHeader />
            </div>
            <div className="flex-1">
                <VehicleTable
                    vehicles={vehicles.data == null ? [] : vehicles.data.data}
                    pageSize={pagination.pageSize}
                    currentPage={pagination.currentPage}
                />
            </div>
            <div className="border-t border-gray-200">
                {/* <EmployeeFooter
                    totalEmployees={pagination.totalElements}
                    pageSize={pagination.pageSize}
                    currentPage={pagination.currentPage}
                    onPageChange={pagination.onPageChange}
                /> */}
            </div>
        </div>)
}

export default VehiclePage;