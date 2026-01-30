/**
 * Leaderboard types from api.yml (GET /leaderboard/pan-india, /state, /college).
 */

export type LeaderboardEntry = {
  id: string;
  name: string;
  rank: number;
  xp: number;
  profile_image?: string;
  level?: number;
  state_id?: string;
  state_name?: string;
  college_id?: string;
  college_name?: string;
  [key: string]: unknown;
};

export type LeaderboardScope = "pan-india" | "state" | "college";

export type LeaderboardResponse = {
  entries: LeaderboardEntry[];
  type: LeaderboardScope;
  scope_id?: string;
  page?: number;
  page_size?: number;
  total?: number;
};
