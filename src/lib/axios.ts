import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { SERVER_URL } from "@/lib/constants";
import { setCachedSession } from "@/lib/session-storage";

type ErrorResponseBody = {
  message?: string;
  statusCode?: number;
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export class ApiHttpError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "ApiHttpError";
    this.statusCode = statusCode;
  }
}

export function isApiHttpError(error: unknown): error is ApiHttpError {
  return error instanceof ApiHttpError;
}

function normalizeApiError(error: unknown) {
  if (error instanceof ApiHttpError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const responseBody = error.response?.data as ErrorResponseBody | undefined;
    const statusCode = error.response?.status ?? responseBody?.statusCode;
    const message =
      responseBody?.message ??
      error.message ??
      "요청 처리 중 오류가 발생했습니다.";

    return new ApiHttpError(message, statusCode);
  }

  if (error instanceof Error) {
    return new ApiHttpError(error.message);
  }

  return new ApiHttpError("요청 처리 중 오류가 발생했습니다.");
}

export const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

export const publicApi = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

publicApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error)),
);

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const statusCode = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";
    const isRefreshRequest = requestUrl.includes("/auth/refresh");

    if (!originalRequest || statusCode !== 401 || isRefreshRequest) {
      return Promise.reject(normalizeApiError(error));
    }

    if (originalRequest._retry) {
      return Promise.reject(normalizeApiError(error));
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post("/auth/refresh")
          .then(() => undefined)
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;
      return api(originalRequest);
    } catch (refreshError) {
      setCachedSession(null);
      return Promise.reject(normalizeApiError(refreshError));
    }
  },
);

export default api;
