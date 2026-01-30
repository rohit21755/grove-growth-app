import { useApi } from "@/contexts/api-context";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";

/** GET /user/badges – one item in the array (UserBadge from api.yml) */
export type UserBadge = {
  user_id?: string;
  badge_id?: string;
  earned_at?: string;
  badge?: {
    id: string;
    name: string;
    xp?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

function normalizeBadges(data: unknown): UserBadge[] {
  if (Array.isArray(data)) return data as UserBadge[];
  if (data && typeof data === "object" && "data" in data) {
    const d = (data as { data: unknown }).data;
    return Array.isArray(d) ? (d as UserBadge[]) : [];
  }
  return [];
}

async function fetchMyBadges(
  api: ReturnType<typeof useApi>,
): Promise<UserBadge[]> {
  const data = await api.get<unknown>("/user/badges");
  return normalizeBadges(data);
}

type UseMyBadgesQueryOptions = {
  enabled?: boolean;
};

/**
 * GET /user/badges – list of badges earned by the authenticated user.
 */
export function useMyBadgesQuery(options?: UseMyBadgesQueryOptions) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.badges,
    queryFn: () => fetchMyBadges(api),
    enabled: options?.enabled ?? true,
  });
}
