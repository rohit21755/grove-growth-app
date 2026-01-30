import { useApi } from "@/contexts/api-context";
import { queryKeys } from "@/lib/query-client";
import type { Submission } from "@/types/submission";
import { useQuery } from "@tanstack/react-query";

function normalizeSubmissionList(data: unknown): Submission[] {
  if (Array.isArray(data)) return data as Submission[];
  if (data && typeof data === "object" && "data" in data) {
    const d = (data as { data: unknown }).data;
    return Array.isArray(d) ? (d as Submission[]) : [];
  }
  return [];
}

async function fetchTaskHistory(
  api: ReturnType<typeof useApi>,
): Promise<Submission[]> {
  const data = await api.get<unknown>("/user/tasks/history");
  return normalizeSubmissionList(data);
}

type UseTaskHistoryQueryOptions = {
  enabled?: boolean;
};

/**
 * Hook for GET /user/tasks/history – list of user submissions (approved, rejected, pending).
 * Use with status === "approved" for completed-task cards that show proof.
 */
export function useTaskHistoryQuery(options?: UseTaskHistoryQueryOptions) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.taskHistory,
    queryFn: () => fetchTaskHistory(api),
    enabled: options?.enabled ?? true,
  });
}
