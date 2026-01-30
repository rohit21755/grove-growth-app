import { useApi } from "@/contexts/api-context";
import { useCallback } from "react";

/** GET /user/{id} response (UserProfile from api.yml) */
export type UserProfile = {
  user?: {
    id: string;
    name: string;
    email?: string;
    state_name?: string;
    college_name?: string;
    xp?: number;
    level?: number;
    avatar_url?: string;
    [key: string]: unknown;
  };
  completed_tasks?: unknown[];
  following_count?: number;
  followers_count?: number;
  state_name?: string;
  college_name?: string;
  [key: string]: unknown;
};

/** POST /user/{id}/follow and /user/{id}/unfollow response */
export type FollowResponse = {
  message: string;
  following_id: string;
};

/**
 * User profile and follow APIs.
 * - getUser(id) – GET /user/{id}
 * - followUser(id) – POST /user/{id}/follow
 * - unfollowUser(id) – POST /user/{id}/unfollow
 */
export function useUserProfileApi() {
  const api = useApi();

  const getUser = useCallback(
    async (userId: string): Promise<UserProfile | null> => {
      if (!userId?.trim()) return null;
      const data = await api.get<UserProfile>(
        `/user/${encodeURIComponent(userId)}`,
      );
      return data && typeof data === "object" ? data : null;
    },
    [api],
  );

  const followUser = useCallback(
    async (userId: string): Promise<FollowResponse | null> => {
      if (!userId?.trim()) return null;
      const data = await api.post<FollowResponse>(
        `/user/${encodeURIComponent(userId)}/follow`,
      );
      return data && typeof data === "object" ? data : null;
    },
    [api],
  );

  const unfollowUser = useCallback(
    async (userId: string): Promise<FollowResponse | null> => {
      if (!userId?.trim()) return null;
      const data = await api.post<FollowResponse>(
        `/user/${encodeURIComponent(userId)}/unfollow`,
      );
      return data && typeof data === "object" ? data : null;
    },
    [api],
  );

  return { getUser, followUser, unfollowUser };
}
