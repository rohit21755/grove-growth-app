import { useApi } from "@/contexts/api-context";
import type { User } from "@/store/auth-store";
import { useAuthStore } from "@/store/auth-store";
import { useCallback } from "react";

/** POST /user/xp response */
export type AddXPResponse = {
  xp_awarded: number;
  new_total_xp: number;
  xp_log_id?: string;
};

/**
 * GET /user/me – current user profile (xp, level, etc.).
 * POST /user/xp – add XP (e.g. after wheel spin); updates auth store on success.
 */
export function useUserApi() {
  const api = useApi();
  const updateUser = useAuthStore((s) => s.updateUser);

  const getMe = useCallback(async (): Promise<User | null> => {
    const data = await api.get<User>("/user/me");
    return data && typeof data === "object" && "id" in data ? data : null;
  }, [api]);

  const addXP = useCallback(
    async (xp: number): Promise<AddXPResponse | null> => {
      if (xp <= 0) return null;
      const data = await api.post<AddXPResponse>("/user/xp", { xp });
      if (
        data &&
        typeof data === "object" &&
        typeof data.new_total_xp === "number"
      ) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          updateUser({ ...currentUser, xp: data.new_total_xp });
        }
        return data;
      }
      return null;
    },
    [api, updateUser],
  );

  return { getMe, addXP };
}
