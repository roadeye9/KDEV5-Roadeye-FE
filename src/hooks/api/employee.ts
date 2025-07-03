import { getMy } from '@/api/auth';
import { createEmployee, getEmployees, updateEmployee, UpdateEmployeeRequest } from '@/api/employee';
import { queryClient } from '@/app';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';

export interface EmployeeQueryParams {
    page: number;
    size: number;
    sort?: string[];
    status?: string;
}

export const EMPLOYEE_QUERY_KEY = {
    all: ['employees'] as const,
    add: ['employee-add'] as const,
    update: ['employee-update'] as const,
    my: ['employee-my'] as const,
    list: (params: EmployeeQueryParams) => [...EMPLOYEE_QUERY_KEY.all, 'list', params] as const,
};

export const useEmployeeQuery = (params: EmployeeQueryParams) => {
    return useQuery({
        queryKey: EMPLOYEE_QUERY_KEY.list(params),
        queryFn: () => getEmployees(params, { status: params.status }),
    });
};

export const useEmployeeMyQuery = () => {
    return useSuspenseQuery({
        queryKey: EMPLOYEE_QUERY_KEY.my,
        queryFn: getMy,
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

export const useUpdateEmployeeMutation = () => {
    return useMutation({
        mutationKey: EMPLOYEE_QUERY_KEY.update,
        mutationFn: ({ employeeId, payload }: { employeeId: number, payload: UpdateEmployeeRequest }) =>
            updateEmployee(employeeId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY.all });
        }
    })
}