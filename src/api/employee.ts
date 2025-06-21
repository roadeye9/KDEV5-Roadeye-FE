import { Employee } from './auth';
import { axiosInstance } from './axiosInstance';

interface CreateEmployeeRequest {
  loginId: string;
  password: string;
  name: string;
  position: string;
}

export interface UpdateEmployeeRequest {
  name: string;
  position: string;
  status: 'ENABLE' | 'DISABLE';
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

export interface PageResponse<T> {
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


export const updateEmployee = async (employeeId: number, payload: UpdateEmployeeRequest): Promise<Employee> => {
    const response = await axiosInstance.put<Employee>(`/employees/${employeeId}`, payload, {
        useTenant: true,
    });
    return response.data;
};

export const deleteEmployee = async (employeeId: number) => {
    await axiosInstance.delete(`/employees/${employeeId}`, {
        useTenant: true,
    });
};

export const getEmployees = async (pageRequest: PageRequest, payload: { status?: string }): Promise<PageResponse<Employee>> => {
    const response = await axiosInstance.get<PageResponse<Employee>>('/employees', {
        params: { ...pageRequest, ...payload },
        useTenant: true,
    });
    return response.data;
};

export const signIn = async (signInRequest: SignInRequest): Promise<SignInResponse> => {
    const response = await axiosInstance.post<SignInResponse>('/employees/sign-in', signInRequest);
    return response.data;
};
