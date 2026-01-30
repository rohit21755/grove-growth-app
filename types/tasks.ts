/**
 * Types for GET /tasks API (TaskWithUserStatus from api.yml).
 * Each task includes user_status and submission_id for the authenticated user.
 */

/** Task status: ongoing = submission open; ended = past end_at; completed = e.g. admin closed */
export type TaskStatus = "ongoing" | "ended" | "completed";

/** User-specific status from GET /tasks */
export type UserTaskStatus =
  | "completed" // submission approved
  | "viewing" // submitted, under review (DB pending)
  | "rejected" // rejected, may resubmit if task not ended
  | "not_started"; // not submitted

export type Task = {
  id: string;
  title: string;
  description: string;
  xp: number;
  type: string;
  proof_type: string;
  priority: string;
  start_at: string | null;
  end_at: string | null;
  is_flash: boolean;
  is_weekly: boolean;
  created_by: string;
  created_at: string;
  /** Task-level status: ongoing | ended | completed */
  status?: TaskStatus;
  /** User's status for this task */
  user_status?: UserTaskStatus;
  /** Submission ID when user has submitted; empty when not_started */
  submission_id?: string;
  [key: string]: unknown;
};

/** Task with user_status – return type of GET /tasks */
export type TaskWithUserStatus = Task;
