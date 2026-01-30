import { useApi } from "@/contexts/api-context";
import { queryKeys } from "@/lib/query-client";
import type {
    LeaderboardEntry,
    LeaderboardResponse,
    LeaderboardScope,
} from "@/types/leaderboard";
import { useQuery } from "@tanstack/react-query";

/** Backend may return user_id, user_name, user_avatar – normalize to id, name, profile_image */
function normalizeEntry(raw: Record<string, unknown>): LeaderboardEntry {
  return {
    id: (raw.user_id ?? raw.id) as string,
    name: (raw.user_name ?? raw.name) as string,
    rank: (raw.rank as number) ?? 0,
    xp: (raw.xp as number) ?? 0,
    profile_image: (raw.user_avatar ?? raw.profile_image) as string | undefined,
    level: (raw.level as number) | undefined,
    state_id: raw.state_id as string | undefined,
    state_name: raw.state_name as string | undefined,
    college_id: raw.college_id as string | undefined,
    college_name: raw.college_name as string | undefined,
  };
}

function normalizeLeaderboardResponse(
  data: unknown,
): LeaderboardResponse | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const rawEntries = Array.isArray(d.entries) ? d.entries : [];
  const entries: LeaderboardEntry[] = rawEntries.map((e) =>
    normalizeEntry(
      typeof e === "object" && e !== null ? (e as Record<string, unknown>) : {},
    ),
  );
  return {
    entries,
    type: (d.type as LeaderboardScope) ?? "pan-india",
    scope_id: typeof d.scope_id === "string" ? d.scope_id : undefined,
    page: typeof d.page === "number" ? d.page : undefined,
    page_size: typeof d.page_size === "number" ? d.page_size : undefined,
    total: typeof d.total === "number" ? d.total : undefined,
  };
}

export type LeaderboardPeriod = "all" | "weekly" | "monthly";

function buildQueryParams(
  scope: "all" | "state" | "college",
  stateId: string | null | undefined,
  collegeId: string | null | undefined,
  period: LeaderboardPeriod,
): string {
  const params = new URLSearchParams();
  if (period !== "all") params.set("period", period);
  if (scope === "state" && stateId?.trim()) params.set("state_id", stateId);
  if (scope === "college" && collegeId?.trim())
    params.set("college_id", collegeId);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function fetchLeaderboard(
  api: ReturnType<typeof useApi>,
  scope: "all" | "state" | "college",
  stateId: string | null | undefined,
  collegeId: string | null | undefined,
  period: LeaderboardPeriod,
): Promise<LeaderboardResponse | null> {
  if (scope === "all") {
    const qs = buildQueryParams(scope, stateId, collegeId, period);
    const data = await api.get<unknown>(`/leaderboard/pan-india${qs}`);
    return normalizeLeaderboardResponse(data);
  }
  if (scope === "state" && stateId?.trim()) {
    const qs = buildQueryParams(scope, stateId, collegeId, period);
    const data = await api.get<unknown>(`/leaderboard/state${qs}`);
    return normalizeLeaderboardResponse(data);
  }
  if (scope === "college" && collegeId?.trim()) {
    const qs = buildQueryParams(scope, stateId, collegeId, period);
    const data = await api.get<unknown>(`/leaderboard/college${qs}`);
    return normalizeLeaderboardResponse(data);
  }
  return null;
}

export type LeaderboardFilter = "all" | "state" | "college";

type UseLeaderboardQueryOptions = {
  filter: LeaderboardFilter;
  period?: LeaderboardPeriod;
  stateId?: string | null;
  collegeId?: string | null;
  enabled?: boolean;
};

/**
 * Hook for leaderboard API (pan-india, state, college) with optional period (all, weekly, monthly).
 * filter "all" → GET /leaderboard/pan-india?period=...
 * filter "state" → GET /leaderboard/state?state_id=...&period=...
 * filter "college" → GET /leaderboard/college?college_id=...&period=...
 */
export function useLeaderboardQuery(options: UseLeaderboardQueryOptions) {
  const api = useApi();
  const {
    filter,
    period = "all",
    stateId = null,
    collegeId = null,
    enabled = true,
  } = options;

  const scopeKey =
    filter === "all"
      ? "pan-india"
      : filter === "state"
        ? (stateId ?? "")
        : (collegeId ?? "");

  return useQuery({
    queryKey: queryKeys.leaderboard(filter, scopeKey, period),
    queryFn: () => fetchLeaderboard(api, filter, stateId, collegeId, period),
    enabled:
      enabled &&
      (filter === "all" ||
        (filter === "state" && !!stateId?.trim()) ||
        (filter === "college" && !!collegeId?.trim())),
  });
}
