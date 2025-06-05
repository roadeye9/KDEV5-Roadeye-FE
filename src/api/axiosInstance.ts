import axios from "axios";
import { checkAndTenantId, delayFulfilled, waitingFulfilled } from "./interceptor";
// import {NETWORK} from "@/constants/api";
// import {checkAndSetToken, delayFulfilled, handleTokenError, waitingFulfilled} from "@/api/Interceptors";

export const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API}/api`,
    timeout: 5000,
    withCredentials: true,
    useAuth: true,
    useTenant: true
})

axiosInstance.interceptors.request.use(checkAndTenantId);
axiosInstance.interceptors.request.use(delayFulfilled);

axiosInstance.interceptors.response.use(waitingFulfilled);