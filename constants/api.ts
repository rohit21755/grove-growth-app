/**
 * API base URL. Set EXPO_PUBLIC_API_URL in .env for production.
 */
export const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_URL) ||
  "http://192.168.29.39:8080/api";

export const API_DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;
