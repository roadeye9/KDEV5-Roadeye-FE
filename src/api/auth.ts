import { axiosInstance } from './axiosInstance';

export interface Employee {
  employeeId: number;
  tenantId: number;
  loginId: string;
  name: string;
  position: string;
  createdAt: string;
  status: 'ACTIVE' | 'DISABLED';
}

export const signIn = async (form: { 
  companyId: number; 
  username: string; 
  password: string
}) => {
  await axiosInstance.post('/auth/sign-in', form, {
    headers: {
      'X-Company-Id': form.companyId
    },
  });
};

export const signOut = async () => {
  return await axiosInstance.post('/auth/sign-out');
};

export const getMy = async (): Promise<Employee> => {
  const response = await axiosInstance.get<Employee>('/employees/my');
  return response.data;
};

export const getSessionInfo = async () => {
  const { data: { data } } = await axiosInstance.get<{
    data: {
      createdAt: string;
      lastAccessedAt: string;
      expireAt: string;
    }
  }>('/session/my');
  const ret = {
    createdAt: Date.parse(data.createdAt),
    lastAccessedAt: Date.parse(data.lastAccessedAt),
    expireAt: Date.parse(data.expireAt),
  } as const;

  return ret;
};
