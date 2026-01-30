/**
 * WebSocket message types from server (WSMessage envelope).
 */

export type WSMessageType =
  | "notification"
  | "chat"
  | "leaderboard"
  | "task"
  | "system"
  | "leaderboard_data"
  | "leaderboard_update"
  | "ping";

export type WSMessage<T = unknown> = {
  type: WSMessageType | string;
  payload?: T;
  data?: T;
};

export type NotificationType =
  | "task_assigned"
  | "task_approved"
  | "task_rejected"
  | "new_follower"
  | "new_comment"
  | "new_reaction";

export type NotificationPayload = {
  id?: string;
  type?: NotificationType | string;
  title?: string;
  message?: string;
  data?: Record<string, unknown>;
  created_at?: string;
};

export type LeaderboardEntry = {
  rank?: number;
  user_id?: string;
  user_name?: string;
  user_avatar?: string;
  xp?: number;
  level?: number;
  state_name?: string;
  college_name?: string;
};

export type LeaderboardDataPayload = {
  type?: "leaderboard_data";
  scope?: "pan-india" | "state" | "college";
  scope_id?: string;
  entries?: LeaderboardEntry[];
};

export type LeaderboardUpdatePayload = {
  type?: "leaderboard_update";
  scope?: "pan-india" | "state" | "college";
  scope_id?: string;
  timestamp?: number;
};
