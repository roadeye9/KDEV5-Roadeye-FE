import { Employee } from '@/api/auth';
import { createEmployee, getEmployees } from '@/api/employee';
import { queryClient } from '@/app';
import { useMutation, useQuery} from '@tanstack/react-query';

export interface EmployeeQueryParams {
    page: number;
    size: number;
    sort?: string[];
}

export const EMPLOYEE_QUERY_KEY = {
    all: ['employees'] as const,
    add: ['employee-add'] as const,
    list: (params: EmployeeQueryParams) => [...EMPLOYEE_QUERY_KEY.all, 'list', params] as const,
};

export const useEmployeeQuery = (params: EmployeeQueryParams) => {
    return useQuery({
        queryKey: EMPLOYEE_QUERY_KEY.list(params),
        queryFn: () => getEmployees(params),
    });
};

export const useEmployeeMutation = () => {
    return useMutation({
        mutationKey: EMPLOYEE_QUERY_KEY.add,    
        mutationFn: createEmployee,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: EMPLOYEE_QUERY_KEY.list({ page: 0, size: 20 }) });
        }
    })
}