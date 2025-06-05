import { axiosInstance } from './axiosInstance';
import { useMutation } from '@tanstack/react-query';

interface CreateEmployeeRequest {
  loginId: string;
  password: string;
  name: string;
  position: string;
}

interface Employee {
  employeeId: number;
  tenantId: number;
  loginId: string;
  name: string;
  position: string;
}

interface UpdateEmployeeRequest {
  name: string;
  position: string;
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

interface PageResponse<T> {
    content: T[];
    page: PageInfo;
}

interface SignInRequest {
    loginId: string;
    password: string;
}

interface SignInResponse {
    accessToken: string;
    refreshToken: string;
}

export const createEmployee = async (employeeData: CreateEmployeeRequest) => {
    await axiosInstance.post<Employee>('/employees', employeeData, {
        useTenant: true,
    });
};

export const updateEmployee = async (employeeId: number, employeeData: UpdateEmployeeRequest) => {
    await axiosInstance.put<Employee>(`/employees/${employeeId}`, employeeData, {
        useTenant: true,
    });
};

export const deleteEmployee = async (employeeId: number) => {
    await axiosInstance.delete(`/employees/${employeeId}`, {
        useTenant: true,
    });
};

export const getEmployees = async (pageRequest: PageRequest): Promise<PageResponse<Employee>> => {
    const response = await axiosInstance.get<PageResponse<Employee>>('/employees', {
        params: pageRequest,
        useTenant: true,
    });
    return response.data;
};

export const signIn = async (signInRequest: SignInRequest): Promise<SignInResponse> => {
    const response = await axiosInstance.post<SignInResponse>('/employees/sign-in', signInRequest);
    return response.data;
};
