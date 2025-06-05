import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    useAuth: boolean;  
    /**
     * 회사 식별 값을 포함시킬지
     */
    useTenant: boolean;
  }

  export interface InternalAxiosRequestConfig {
    p0: number;
  }
}