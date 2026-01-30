import { API_BASE_URL } from "@/constants/api";

/**
 * WebSocket base URL derived from API base.
 * e.g. http://192.168.29.39:8080/api → ws://192.168.29.39:8080/ws
 */
function getWsBaseUrl(): string {
  const env = typeof process !== "undefined" && process.env?.EXPO_PUBLIC_WS_URL;
  if (env && typeof env === "string") return env;

  const base = API_BASE_URL.replace(/\/api\/?$/, "").trim();
  const ws = base.replace(/^http/, "ws");
  return `${ws}/ws`;
}

export const WS_BASE_URL = getWsBaseUrl();

/** Authenticated connect path – requires JWT */
export const WS_CONNECT_PATH = "/connect";

/** Leaderboard path – no auth */
export const WS_LEADERBOARD_PATH = "/leaderboard";
