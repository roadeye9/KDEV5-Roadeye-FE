import { Employee } from './auth';
import { axiosInstance } from './axiosInstance';

export interface CreateEmployeeRequest {
  loginId: string;
  password: string;
  name: string;
  position: string;
}

export interface UpdateEmployeeRequest {
  status?: 'ACTIVE' | 'DISABLED';
}

interface PageRequest {
  page: number;
  size: number;
  sort?: string[];
}

interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

interface EmployeeStatusCount {
  totalEmployee: number;
  activeEmployee: number;
  inactiveEmployee: number;
  adminEmployee: number;
  normalEmployee: number;
}

export type Response<T> = {
  data: T;
};

export interface PageResponse<T> {
  content: T[];
  page: PageInfo;
}

export const getEmployeePage = async (
  payload: { status?: 'ALL' | 'ACTIVE' | 'DISABLED' },
  pageRequest: PageRequest,
) => {
  if (payload.status === 'ALL') {
    delete payload.status;
  }
  const response = await axiosInstance.get<PageResponse<Employee>>('/employees', {
    params: { ...pageRequest, ...payload }
  });
  return response.data;
};

export const getEmployee = async (employeeId: number): Promise<Employee> => {
  const response = await axiosInstance.get<Employee>(`/employees/${employeeId}`);
  return response.data;
};

export const getEmployeeCount = async (): Promise<EmployeeStatusCount> => {
  const { data } = await axiosInstance.get<Response<EmployeeStatusCount>>('/employees/status/count');
  return data.data;
};

export const createEmployee = async (employeeData: CreateEmployeeRequest) => {
  await axiosInstance.post<Employee>('/employees', employeeData);
};

export const updateEmployee = async (
  employeeId: number,
  payload: UpdateEmployeeRequest
): Promise<Employee> => {
  const response = await axiosInstance.put<Employee>(`/employees/${employeeId}`, payload);
  return response.data;
};

export const deleteEmployee = async (employeeId: number) => {
  await axiosInstance.delete(`/employees/${employeeId}`);
};