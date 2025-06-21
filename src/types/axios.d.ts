import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    useTenant?: boolean;
    useAuth?: boolean;
  }
} 