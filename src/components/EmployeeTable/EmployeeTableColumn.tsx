import { Employee } from "@/api/auth"


interface EmployeeTableColumnProps {
    employee: Employee
    columnKey: React.Key
}

export const EmployeeTableColumn: React.FC<EmployeeTableColumnProps> = ({employee, columnKey}) => {
    
    const cellValue = employee[columnKey as keyof Employee];
    const cellKey = columnKey as keyof Employee;

    console.debug(cellValue, cellKey); 

    switch(cellKey) {
        case "employeeId":
            return <div>{cellValue}</div>
        case "tenantId":
            return <div>{cellValue}</div>
        case "loginId":
            return <div>{cellValue}</div>
        case "name":
            return <div>{cellValue}</div>
        case "position":
            return <div>{cellValue}</div>
        default:
            return <div>{cellValue}</div>
    }
}