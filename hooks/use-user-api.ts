import { useApi } from "@/contexts/api-context";
import type { User } from "@/store/auth-store";
import { useCallback } from "react";

/**
 * GET /user/me – current user profile (xp, level, etc.).
 */
export function useUserApi() {
  const api = useApi();

  const getMe = useCallback(async (): Promise<User | null> => {
    const data = await api.get<User>("/user/me");
    return data && typeof data === "object" && "id" in data ? data : null;
  }, [api]);

  return { getMe };
}
