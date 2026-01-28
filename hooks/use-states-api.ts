import { useApi } from "@/contexts/api-context";
import type { College, State } from "@/types/states";
import { useCallback } from "react";

/**
 * Hook for states and colleges API.
 * - getStates: GET /states
 * - getCollegesByState: GET /states/{stateId}/colleges
 */
export function useStatesApi() {
  const api = useApi();

  const getStates = useCallback(async (): Promise<State[]> => {
    console.log(api.baseUrl);
    const data = await api.get<State[]>("/states");
    return Array.isArray(data) ? data : [];
  }, [api]);

  const getCollegesByState = useCallback(
    async (stateId: string): Promise<College[]> => {
      if (!stateId.trim()) {
        throw new Error("State ID is required");
      }
      const data = await api.get<College[]>(
        `/states/${encodeURIComponent(stateId)}/colleges`,
      );
      return Array.isArray(data) ? data : [];
    },
    [api],
  );

  return { getStates, getCollegesByState };
}
