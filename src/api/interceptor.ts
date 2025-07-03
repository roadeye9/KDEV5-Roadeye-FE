import { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export interface ErrorResponseData {
  statusCode: number;
  message: string;
  code: number;
}

export class HTTPError {
  constructor(readonly statusCode: number, readonly message: string, readonly code: number) {
  }
}

export const checkAndTenantId = (config: InternalAxiosRequestConfig) => {
  if (!config.useTenant || !config.headers) return config;

  const tenantId = localStorage.getItem("tenantId");

  if (!tenantId) {
    window.location.href = "/auth"
    throw new Error("테넌트 아이디가 없습니다.");
  }

  config.headers["X-Company-Id"] = tenantId;
  return config;

}

export const delayFulfilled = (config: InternalAxiosRequestConfig) => ({
  ...config,
  p0: performance.now(),
});

export const waitingFulfilled = async (response: AxiosResponse) => {
  const minimumDelay = 1000;
  const latency = performance.now() - response.config.p0;
  const shouldNotDelay = minimumDelay < latency;

  if (shouldNotDelay) {
    return response;
  }

  const remainder = minimumDelay - latency;
  const [responseWithDelay] = await Promise.all([
    response,
    new Promise((resolve) => setTimeout(resolve, remainder)),
  ]);
  return responseWithDelay;
}
