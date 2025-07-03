import axios, { AxiosError } from 'axios';

import { checkAndTenantId, delayFulfilled, waitingFulfilled } from './interceptor';

const BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 100000,
  withCredentials: true,
  useAuth: true,
  useTenant: true
});

axiosInstance.interceptors.request.use(checkAndTenantId);
axiosInstance.interceptors.request.use(delayFulfilled);

axiosInstance.interceptors.response.use(
  (response) => {
    waitingFulfilled(response);
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 403) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }

    return Promise.reject(error);
  }
);
