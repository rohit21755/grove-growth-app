import { useApi } from "@/contexts/api-context";
import { queryKeys } from "@/lib/query-client";
import type { User } from "@/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/** File for multipart upload – React Native FormData expects { uri, name, type } */
export type FileForUpload = {
  uri: string;
  name?: string;
  type: string;
};

async function uploadResumeFn(
  api: ReturnType<typeof useApi>,
  file: FileForUpload,
): Promise<User | null> {
  const formData = new FormData();
  formData.append("resume", {
    uri: file.uri,
    name: file.name ?? "resume.pdf",
    type: file.type,
  } as unknown as Blob);
  const data = await api.request<User>("/user/resume", {
    method: "POST",
    body: formData,
  });
  return data && typeof data === "object" && "id" in data ? data : null;
}

async function updateResumeFn(
  api: ReturnType<typeof useApi>,
  file: FileForUpload,
): Promise<User | null> {
  const formData = new FormData();
  formData.append("resume", {
    uri: file.uri,
    name: file.name ?? "resume.pdf",
    type: file.type,
  } as unknown as Blob);
  const data = await api.request<User>("/user/resume", {
    method: "PUT",
    body: formData,
  });
  return data && typeof data === "object" && "id" in data ? data : null;
}

async function uploadProfilePicFn(
  api: ReturnType<typeof useApi>,
  file: FileForUpload,
): Promise<User | null> {
  const formData = new FormData();
  formData.append("profile_pic", {
    uri: file.uri,
    name: file.name ?? "profile.jpg",
    type: file.type,
  } as unknown as Blob);
  const data = await api.request<User>("/user/profile-pic", {
    method: "POST",
    body: formData,
  });
  return data && typeof data === "object" && "id" in data ? data : null;
}

async function updateProfilePicFn(
  api: ReturnType<typeof useApi>,
  file: FileForUpload,
): Promise<User | null> {
  const formData = new FormData();
  formData.append("profile_pic", {
    uri: file.uri,
    name: file.name ?? "profile.jpg",
    type: file.type,
  } as unknown as Blob);
  const data = await api.request<User>("/user/profile-pic", {
    method: "PUT",
    body: formData,
  });
  return data && typeof data === "object" && "id" in data ? data : null;
}

/**
 * User file upload APIs (resume, profile picture).
 * - uploadResume(file) – POST /user/resume
 * - updateResume(file) – PUT /user/resume
 * - uploadProfilePic(file) – POST /user/profile-pic
 * - updateProfilePic(file) – PUT /user/profile-pic
 * On success, mutations invalidate user-related queries and optionally call onUserUpdate(user).
 */
export function useUserFilesApi(options?: {
  onUserUpdate?: (user: User) => void;
}) {
  const api = useApi();
  const queryClient = useQueryClient();
  const onUserUpdate = options?.onUserUpdate;

  const invalidateUser = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user });
  }, [queryClient]);

  const uploadResume = useCallback(
    async (file: FileForUpload): Promise<User | null> => {
      const user = await uploadResumeFn(api, file);
      if (user) {
        invalidateUser();
        onUserUpdate?.(user);
      }
      return user;
    },
    [api, invalidateUser, onUserUpdate],
  );

  const updateResume = useCallback(
    async (file: FileForUpload): Promise<User | null> => {
      const user = await updateResumeFn(api, file);
      if (user) {
        invalidateUser();
        onUserUpdate?.(user);
      }
      return user;
    },
    [api, invalidateUser, onUserUpdate],
  );

  const uploadProfilePic = useCallback(
    async (file: FileForUpload): Promise<User | null> => {
      const user = await uploadProfilePicFn(api, file);
      if (user) {
        invalidateUser();
        onUserUpdate?.(user);
      }
      return user;
    },
    [api, invalidateUser, onUserUpdate],
  );

  const updateProfilePic = useCallback(
    async (file: FileForUpload): Promise<User | null> => {
      const user = await updateProfilePicFn(api, file);
      if (user) {
        invalidateUser();
        onUserUpdate?.(user);
      }
      return user;
    },
    [api, invalidateUser, onUserUpdate],
  );

  return {
    uploadResume,
    updateResume,
    uploadProfilePic,
    updateProfilePic,
  };
}

/** Mutations wrapper for useUserFilesApi (e.g. for loading/error state) */
export function useUserFilesMutations(options?: {
  onUserUpdate?: (user: User) => void;
}) {
  const api = useApi();
  const queryClient = useQueryClient();
  const onUserUpdate = options?.onUserUpdate;

  const uploadResumeMutation = useMutation({
    mutationFn: (file: FileForUpload) => uploadResumeFn(api, file),
    onSuccess: (user) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: queryKeys.user });
        onUserUpdate?.(user);
      }
    },
  });

  const updateResumeMutation = useMutation({
    mutationFn: (file: FileForUpload) => updateResumeFn(api, file),
    onSuccess: (user) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: queryKeys.user });
        onUserUpdate?.(user);
      }
    },
  });

  const uploadProfilePicMutation = useMutation({
    mutationFn: (file: FileForUpload) => uploadProfilePicFn(api, file),
    onSuccess: (user) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: queryKeys.user });
        onUserUpdate?.(user);
      }
    },
  });

  const updateProfilePicMutation = useMutation({
    mutationFn: (file: FileForUpload) => updateProfilePicFn(api, file),
    onSuccess: (user) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: queryKeys.user });
        onUserUpdate?.(user);
      }
    },
  });

  return {
    uploadResumeMutation,
    updateResumeMutation,
    uploadProfilePicMutation,
    updateProfilePicMutation,
  };
}
