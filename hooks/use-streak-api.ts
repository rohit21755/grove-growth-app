import { useApi } from "@/contexts/api-context";
import { useCallback } from "react";

/** POST /user/streak/check-in response */
export type StreakCheckInResponse = {
  streak_days: number;
  streak_started_at: string;
  [key: string]: unknown;
};

const IST_TIMEZONE = "Asia/Kolkata";

/** Build list of YYYY-MM-DD dates for the current streak (for calendar marking).
 * Converts API timestamp to IST so the correct calendar date is used
 * (e.g. "2025-01-29T18:30:00Z" = Jan 30 00:00 IST → marks Jan 30). */
export function getStreakDateStrings(
  streakStartedAt: string,
  streakDays: number,
): string[] {
  if (!streakStartedAt || streakDays < 1) return [];
  const startDate = new Date(streakStartedAt);
  if (Number.isNaN(startDate.getTime())) return [];

  // Get first streak day as YYYY-MM-DD in IST
  const istDateStr = startDate.toLocaleDateString("en-CA", {
    timeZone: IST_TIMEZONE,
  }); // "2025-01-30"
  const parts = istDateStr.split("-");
  if (parts.length !== 3) return [];
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-based for Date
  const day = parseInt(parts[2], 10);

  const out: string[] = [];
  for (let i = 0; i < streakDays; i++) {
    const d = new Date(year, month, day + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    out.push(`${y}-${m}-${dd}`);
  }
  return out;
}

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
