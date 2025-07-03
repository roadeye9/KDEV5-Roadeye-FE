import { SignInForm } from '@/hooks/pages/useSignIn';

import { axiosInstance } from './axiosInstance';

export interface Employee {
  employeeId: number;
  tenantId: number;
  loginId: string;
  name: string;
  position: string;
  createdAt: string;
  status: string;
}

export const signIn = async (form: SignInForm) => {
  await axiosInstance.post('/auth/sign-in', form, {
    headers: {
      'X-Company-Id': form.tenantId
    },
    useTenant: false
  });
};

export const getMy = async (): Promise<Employee> => {
  const response = await axiosInstance.get<Employee>('/employees/my', {
    useTenant: true
  });
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

  return {
    ...ret,
    isExpired: () => ret.expireAt < Date.now()
  };
};
