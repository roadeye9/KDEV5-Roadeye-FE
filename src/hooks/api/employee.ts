import { Employee } from '@/api/auth';
import { getEmployees } from '@/api/employee';
import { useQuery } from '@tanstack/react-query';

export interface EmployeeQueryParams {
    page: number;
    size: number;
    sort?: string[];
}

export const EMPLOYEE_QUERY_KEY = {
    all: ['employees'] as const,
    list: (params: EmployeeQueryParams) => [...EMPLOYEE_QUERY_KEY.all, 'list', params] as const,
};

export const useEmployeeQuery = (params: EmployeeQueryParams) => {
    return useQuery({
        queryKey: EMPLOYEE_QUERY_KEY.list(params),
        queryFn: () => getEmployees(params),
    });
};