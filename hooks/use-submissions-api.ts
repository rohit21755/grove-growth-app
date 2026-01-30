import { useApi } from "@/contexts/api-context";
import { queryKeys } from "@/lib/query-client";
import type { Submission } from "@/types/submission";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/** Proof file for multipart/form-data. uri is local file URI (file:// or content://). */
export type ProofFile = {
  uri: string;
  name?: string;
  type: string;
};

export type SubmitTaskPayload = {
  taskId: string;
  file: ProofFile;
};

async function submitTaskFn(
  api: ReturnType<typeof useApi>,
  payload: SubmitTaskPayload,
): Promise<Submission | null> {
  const { taskId, file } = payload;
  const formData = new FormData();

  // React Native FormData expects { uri, name, type } for file upload
  formData.append("proof", {
    uri: file.uri,
    name:
      file.name ?? (file.type.startsWith("video") ? "proof.mp4" : "proof.jpg"),
    type: file.type,
  } as unknown as Blob);

  return api.request<Submission>(
    `/tasks/${encodeURIComponent(taskId)}/submit`,
    {
      method: "POST",
      body: formData,
    },
  );
}

/**
 * Hook for task submission with TanStack Query mutation.
 * - submitTask(taskId, file) — POST /tasks/{id}/submit with multipart/form-data (proof file).
 * - On success, invalidates tasks query so the list refetches.
 */
export function useSubmissionsApi() {
  const api = useApi();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: SubmitTaskPayload) => submitTaskFn(api, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.taskHistory });
    },
  });

  return {
    submitTask: mutation.mutateAsync,
    submitTaskMutation: mutation,
  };
}
