import { QueryClient } from "@tanstack/react-query";

/**
 * Default stale time: 5 minutes. Data is considered fresh for this period.
 * Prevents refetching on every mount when navigating.
 */
const STALE_TIME_MS = 5 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      gcTime: 10 * 60 * 1000, // 10 min (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** Query keys used across the app for cache invalidation */
export const queryKeys = {
  user: ["user"] as const,
  tasks: ["tasks"] as const,
  taskHistory: ["user", "tasks", "history"] as const,
  badges: ["user", "badges"] as const,
  states: ["states"] as const,
  colleges: (stateId: string) => ["colleges", stateId] as const,
  leaderboard: (scope: string, scopeId?: string, period?: string) =>
    ["leaderboard", scope, scopeId ?? "", period ?? "all"] as const,
};
