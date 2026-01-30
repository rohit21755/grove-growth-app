import { useApi } from "@/contexts/api-context";
import { queryKeys } from "@/lib/query-client";
import type { Task } from "@/types/tasks";
import { useQuery } from "@tanstack/react-query";

function normalizeTaskList(data: unknown): Task[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "tasks" in data) {
    const t = (data as { tasks: unknown }).tasks;
    return Array.isArray(t) ? t : [];
  }
  if (data && typeof data === "object" && "data" in data) {
    const d = (data as { data: unknown }).data;
    return Array.isArray(d) ? d : [];
  }
  return [];
}

async function fetchTasks(api: ReturnType<typeof useApi>): Promise<Task[]> {
  const data = await api.get<unknown>("/tasks");
  return normalizeTaskList(data);
}

type UseTasksQueryOptions = {
  /** When false, the query will not run (e.g. when user is not logged in). */
  enabled?: boolean;
};

/**
 * Hook for tasks API with TanStack Query caching.
 * GET /tasks – returns tasks with user_status (TaskWithUserStatus).
 */
export function useTasksQuery(options?: UseTasksQueryOptions) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: () => fetchTasks(api),
    enabled: options?.enabled ?? true,
  });
}
