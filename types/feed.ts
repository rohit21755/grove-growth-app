/** FeedItem from GET /user/{id} completed_tasks (api.yml) */
export type FeedItem = {
  id: string;
  submission_id: string;
  user_id: string;
  task_id: string;
  user_name?: string;
  user_avatar?: string;
  task_title: string;
  task_xp?: number;
  proof_url: string;
  reaction_count?: number;
  comment_count?: number;
  created_at: string;
  [key: string]: unknown;
};
