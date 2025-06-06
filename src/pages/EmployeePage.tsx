import EmployeeTable from "@/components/EmployeeTable/EmployeeTable";
import { EmployeeHeader } from "@/components/employee/EmployeeHeader";
import { EmployeeFooter } from "@/components/EmployeeTable/EmployeeFooter";
import { useEmployee } from "@/hooks/pages/useEmployee";

export const EmployeePage = () => {
    const { employees, pagination } = useEmployee();
    
    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)] divide-y divide-gray-200">
            <div className="border-b border-gray-200">
                <EmployeeHeader />
            </div>
            <div className="flex-1">
                <EmployeeTable 
                    employees={employees.data == null ? [] : employees.data.content}
                    pageSize={pagination.pageSize}
                    currentPage={pagination.currentPage}
                />
            </div>
            <div className="border-t border-gray-200">
                <EmployeeFooter 
                    totalEmployees={pagination.totalElements}
                    pageSize={pagination.pageSize}
                    currentPage={pagination.currentPage}
                    onPageChange={pagination.onPageChange}
                />
            </div>
        </div>
    );
}

export default EmployeePage;