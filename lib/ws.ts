import {
    WS_BASE_URL,
    WS_CONNECT_PATH,
    WS_LEADERBOARD_PATH,
} from "@/constants/ws";

/**
 * Build WebSocket URL for authenticated connect (ws.yml – /connect).
 * Requires JWT via query param.
 */
export function buildConnectUrl(token: string): string {
  const base = WS_BASE_URL.replace(/\/$/, "");
  const path = WS_CONNECT_PATH.startsWith("/")
    ? WS_CONNECT_PATH
    : `/${WS_CONNECT_PATH}`;
  const cleanToken = token.replace(/^Bearer\s+/i, "").trim();
  return `${base}${path}?token=${encodeURIComponent(cleanToken)}`;
}

export type WsLeaderboardScope = "pan-india" | "state" | "college";
export type WsLeaderboardPeriod = "all" | "weekly" | "monthly";

export type BuildLeaderboardWsUrlParams = {
  type?: WsLeaderboardScope;
  scope_id?: string;
  period?: WsLeaderboardPeriod;
};

/**
 * Build WebSocket URL for leaderboard (ws.yml – /leaderboard).
 * No auth. Query params: type (pan-india | state | college), scope_id (when type is state or college), period (all | weekly | monthly).
 */
export function buildLeaderboardWsUrl(
  params: BuildLeaderboardWsUrlParams = {},
): string {
  const base = WS_BASE_URL.replace(/\/$/, "");
  const path = WS_LEADERBOARD_PATH.startsWith("/")
    ? WS_LEADERBOARD_PATH
    : `/${WS_LEADERBOARD_PATH}`;
  const search = new URLSearchParams();
  if (params.type) search.set("type", params.type);
  if (params.scope_id?.trim()) search.set("scope_id", params.scope_id.trim());
  if (params.period && params.period !== "all")
    search.set("period", params.period);
  const qs = search.toString();
  return qs ? `${base}${path}?${qs}` : `${base}${path}`;
}
