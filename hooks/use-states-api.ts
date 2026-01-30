import { useApi } from "@/contexts/api-context";
import { queryKeys } from "@/lib/query-client";
import type { College, State } from "@/types/states";
import { useQuery } from "@tanstack/react-query";

async function fetchStates(api: ReturnType<typeof useApi>): Promise<State[]> {
  const data = await api.get<State[]>("/states");
  return Array.isArray(data) ? data : [];
}

async function fetchCollegesByState(
  api: ReturnType<typeof useApi>,
  stateId: string,
): Promise<College[]> {
  if (!stateId.trim()) return [];
  const data = await api.get<College[]>(
    `/states/${encodeURIComponent(stateId)}/colleges`,
  );
  return Array.isArray(data) ? data : [];
}

type UseStatesQueryOptions = {
  enabled?: boolean;
};

/**
 * Hook for states list with TanStack Query caching.
 * - useStatesQuery(options?): returns { data, isLoading, isError, refetch }
 */
export function useStatesQuery(options?: UseStatesQueryOptions) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.states,
    queryFn: () => fetchStates(api),
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook for colleges by state with TanStack Query caching.
 * - useCollegesQuery(stateId, options?): returns { data, isLoading, isError, refetch }
 */
export function useCollegesQuery(
  stateId: string | null,
  options?: UseStatesQueryOptions,
) {
  const api = useApi();
  const enabled = (options?.enabled ?? true) && !!stateId?.trim();

  return useQuery({
    queryKey: queryKeys.colleges(stateId ?? ""),
    queryFn: () => fetchCollegesByState(api, stateId!),
    enabled,
  });
}

/**
 * Legacy imperative API for backward compatibility (e.g. register screen).
 * Prefer useStatesQuery() and useCollegesQuery() for new code.
 */
export function useStatesApi() {
  const api = useApi();

  const getStates = async (): Promise<State[]> => fetchStates(api);
  const getCollegesByState = async (stateId: string): Promise<College[]> =>
    fetchCollegesByState(api, stateId);

  return { getStates, getCollegesByState };
}
