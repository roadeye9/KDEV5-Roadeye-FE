import { Employee } from "@/api/auth";


interface EmployeeTableColumn {
    name: keyof Employee
    displayName: string;
    hidden?: boolean;
}


export const EMPLOYEE_TABLE_COLUMNS: EmployeeTableColumn[] = [
    {
        name: "employeeId",
        displayName: "직원 아이디"
    },
    {
        name: "tenantId",          
        displayName: "테넌트 아이디", 
        hidden: true,
    },
    {
        name: "loginId",
        displayName: "로그인 아이디"
    },
    {
        name: "name",
        displayName: "이름"
    },
    {
        name: "position",
        displayName: "직책"
    }
]