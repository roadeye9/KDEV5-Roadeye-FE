import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { checkAndTenantId, delayFulfilled, waitingFulfilled } from "./interceptor";
// import {NETWORK} from "@/constants/api";
// import {checkAndSetToken, delayFulfilled, handleTokenError, waitingFulfilled} from "@/api/Interceptors";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 5000,
    withCredentials: true,
    useAuth: true,
    useTenant: true,
})

axiosInstance.interceptors.request.use(checkAndTenantId);
axiosInstance.interceptors.request.use(delayFulfilled);

axiosInstance.interceptors.response.use(
    (response) => {
        waitingFulfilled(response);
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 403) {
            toast.error('인증 실패', {
                description: '세션이 만료되었거나 접근 권한이 없습니다. 다시 로그인해주세요.',
            });

            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        }
        
        return Promise.reject(error);
    }
);