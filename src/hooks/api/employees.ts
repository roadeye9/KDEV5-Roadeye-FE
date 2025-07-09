import { keepPreviousData, useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { getMy, type Employee } from '@/api/auth';
import {
  createEmployee,
  getEmployee,
  getEmployeePage,
  updateEmployee,
  UpdateEmployeeRequest
} from '@/api/employee';
import { queryClient } from '@/app';

export interface EmployeeQueryParams {
  page: number;
  size: number;
  sort?: string[];
  status?: string;
}

export const EMPLOYEE_QUERY_KEY = {
  list: ['employees'] as const,
  details: (employeeId: number) => [EMPLOYEE_QUERY_KEY.list, employeeId] as const,
  add: ['employee', 'add'] as const,
  update: ['employee', 'update'] as const,
  my: ['employee', 'my'] as const,
};

export const useEmployeesPageQuery = ({ page, size, status }: { page: number, size: number, status: 'ALL' | 'ACTIVE' | 'DISABLED' }) => {
  return useQuery({
    queryKey: ['employee', { page, size, status} ],
    queryFn: () => getEmployeePage({ status }, { page, size }),
    placeholderData: keepPreviousData
  });
};

export const useEmployeeQuery = (employeeId: string | number) => {
  const id = typeof employeeId === 'string' ? Number.parseInt(employeeId) : employeeId;
  return useSuspenseQuery({
    queryKey: EMPLOYEE_QUERY_KEY.details(id),
    queryFn: () => getEmployee(id)
  });
};

export const useEmployeeMyQuery = () => {
  return useSuspenseQuery({
    queryKey: EMPLOYEE_QUERY_KEY.my,
    queryFn: getMy
  });
};

export const useEmployeeMutation = () => {
  return useMutation({
    mutationKey: EMPLOYEE_QUERY_KEY.add,
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY.list });
    }
  });
};

export const useUpdateEmployeeMutation = (employeeId: number) => {
  return useMutation({
    mutationKey: EMPLOYEE_QUERY_KEY.update,
    mutationFn: (payload: UpdateEmployeeRequest) => updateEmployee(employeeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY.details(employeeId) });
    }
  });
};
