/**
 * Submission schema from POST /tasks/{id}/submit response (201) – api.yml.
 */
export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Submission = {
  id: string;
  task_id: string;
  user_id: string;
  proof_url: string;
  status: SubmissionStatus;
  admin_comment?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
};
