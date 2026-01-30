import { useApi } from "@/contexts/api-context";
import { useCallback } from "react";

/** POST /user/streak/check-in response */
export type StreakCheckInResponse = {
  streak_days: number;
  streak_started_at: string;
  [key: string]: unknown;
};

/** POST /user/streak/redeem response */
export type RedeemStreakResponse = {
  streak_days: number;
  xp_reward: number;
  badges_awarded?: string[];
  [key: string]: unknown;
};

/**
 * Streak APIs.
 * - streakCheckIn() – POST /user/streak/check-in
 * - redeemStreak() – POST /user/streak/redeem
 */
export function useStreakApi() {
  const api = useApi();

  const streakCheckIn =
    useCallback(async (): Promise<StreakCheckInResponse | null> => {
      const data = await api.post<StreakCheckInResponse>(
        "/user/streak/check-in",
      );
      return data && typeof data === "object" ? data : null;
    }, [api]);

  const redeemStreak =
    useCallback(async (): Promise<RedeemStreakResponse | null> => {
      const data = await api.post<RedeemStreakResponse>("/user/streak/redeem");
      return data && typeof data === "object" ? data : null;
    }, [api]);

  return { streakCheckIn, redeemStreak };
}
