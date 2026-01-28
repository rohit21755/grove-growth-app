import { API_BASE_URL, API_DEFAULT_HEADERS } from "@/constants/api";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestConfig = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  /** Override base URL for this request */
  baseUrl?: string;
};

export type ApiError = {
  message: string;
  status?: number;
  data?: unknown;
};

type ApiContextValue = {
  /** Auth token; when set, sent as Bearer in Authorization header */
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  /** Base URL for all requests */
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  /** Low-level request. Throws on non-2xx; returns parsed JSON or null. */
  request: <T = unknown>(
    path: string,
    config?: RequestConfig,
  ) => Promise<T | null>;
  get: <T = unknown>(
    path: string,
    config?: Omit<RequestConfig, "method" | "body">,
  ) => Promise<T | null>;
  post: <T = unknown>(
    path: string,
    body?: unknown,
    config?: Omit<RequestConfig, "method" | "body">,
  ) => Promise<T | null>;
  put: <T = unknown>(
    path: string,
    body?: unknown,
    config?: Omit<RequestConfig, "method" | "body">,
  ) => Promise<T | null>;
  patch: <T = unknown>(
    path: string,
    body?: unknown,
    config?: Omit<RequestConfig, "method" | "body">,
  ) => Promise<T | null>;
  delete: <T = unknown>(
    path: string,
    config?: Omit<RequestConfig, "method" | "body">,
  ) => Promise<T | null>;
};

const ApiContext = createContext<ApiContextValue | null>(null);

function buildUrl(base: string, path: string): string {
  const baseTrimmed = base.replace(/\/$/, "");
  const pathTrimmed = path.startsWith("/") ? path : `/${path}`;
  return `${baseTrimmed}${pathTrimmed}`;
}

export function ApiProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [baseUrl, setBaseUrlState] = useState(API_BASE_URL);

  const setAuthToken = useCallback((token: string | null) => {
    setAuthTokenState(token);
  }, []);

  const setBaseUrl = useCallback((url: string) => {
    setBaseUrlState(url);
  }, []);

  const request = useCallback(
    async <T = unknown,>(
      path: string,
      config: RequestConfig = {},
    ): Promise<T | null> => {
      const {
        method = "GET",
        headers: customHeaders = {},
        body,
        baseUrl: overrideBase,
      } = config;

      const url = buildUrl(overrideBase ?? baseUrl, path);
      const isFormData = body instanceof FormData;
      const headers: Record<string, string> = {
        ...(isFormData ? {} : API_DEFAULT_HEADERS),
        ...customHeaders,
      };

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const init: RequestInit = {
        method,
        headers,
      };

      if (body != null && method !== "GET") {
        if (isFormData) {
          init.body = body;
        } else {
          init.body = typeof body === "string" ? body : JSON.stringify(body);
        }
      }

      const res = await fetch(url, init);
      const text = await res.text();
      let data: T | null = null;
      if (text) {
        try {
          data = JSON.parse(text) as T;
        } catch {
          // non-JSON response; caller can handle via status
        }
      }

      if (!res.ok) {
        const error: ApiError = {
          message: res.statusText || "Request failed",
          status: res.status,
          data: data ?? text,
        };
        throw error;
      }

      return data;
    },
    [baseUrl, authToken],
  );

  const get = useCallback(
    <T = unknown,>(
      path: string,
      config?: Omit<RequestConfig, "method" | "body">,
    ) => request<T>(path, { ...config, method: "GET" }),
    [request],
  );

  const post = useCallback(
    <T = unknown,>(
      path: string,
      body?: unknown,
      config?: Omit<RequestConfig, "method" | "body">,
    ) =>
      request<T>(path, {
        ...config,
        method: "POST",
        body,
      }),
    [request],
  );

  const put = useCallback(
    <T = unknown,>(
      path: string,
      body?: unknown,
      config?: Omit<RequestConfig, "method" | "body">,
    ) =>
      request<T>(path, {
        ...config,
        method: "PUT",
        body,
      }),
    [request],
  );

  const patch = useCallback(
    <T = unknown,>(
      path: string,
      body?: unknown,
      config?: Omit<RequestConfig, "method" | "body">,
    ) =>
      request<T>(path, {
        ...config,
        method: "PATCH",
        body,
      }),
    [request],
  );

  const deleteRequest = useCallback(
    <T = unknown,>(
      path: string,
      config?: Omit<RequestConfig, "method" | "body">,
    ) => request<T>(path, { ...config, method: "DELETE" }),
    [request],
  );

  const value = useMemo<ApiContextValue>(
    () => ({
      authToken,
      setAuthToken,
      baseUrl,
      setBaseUrl,
      request,
      get,
      post,
      put,
      patch,
      delete: deleteRequest,
    }),
    [
      authToken,
      setAuthToken,
      baseUrl,
      setBaseUrl,
      request,
      get,
      post,
      put,
      patch,
      deleteRequest,
    ],
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi(): ApiContextValue {
  const ctx = useContext(ApiContext);
  if (!ctx) {
    throw new Error("useApi must be used within ApiProvider");
  }
  return ctx;
}
