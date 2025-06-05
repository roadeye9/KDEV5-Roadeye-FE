import EmployeeTable from "@/components/EmployeeTable";
import { EmployeeHeader } from "@/components/employee/EmployeeHeader";
import { EmployeeFooter } from "@/components/employee/EmployeeFooter";

export const EmployeePage = () => {
    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)] divide-y divide-gray-200">
            <div className="border-b border-gray-200">
                <EmployeeHeader />
            </div>
            <div className="flex-1">
                <EmployeeTable />
            </div>
            <div className="border-t border-gray-200">
                <EmployeeFooter />
            </div>
        </div>
    );
}

export default EmployeePage;