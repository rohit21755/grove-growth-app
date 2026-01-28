import { useApi } from "@/contexts/api-context";
import type { User } from "@/store/auth-store";
import { useCallback } from "react";

/** Request body for POST /auth/register (multipart/form-data) */
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  state_id: string;
  college_id: string;
  referral_code?: string;
  resume?: { uri: string; name: string; type: string } | null;
  profile_pic?: { uri: string; name: string; type: string } | null;
};

/** Response from POST /auth/register (201) */
export type RegisterResponse = {
  token: string;
  user: User;
};

/** Request body for POST /auth/login (application/json) */
export type LoginRequest = {
  email: string;
  password: string;
};

/** Response from POST /auth/login (200) */
export type LoginResponse = {
  token: string;
  user: User;
};

/**
 * Hook for authentication API calls.
 * Uses zustand (auth store) + expo-secure-store for token persistence.
 */
export function useAuthApi() {
  const api = useApi();

  const login = useCallback(
    async (data: LoginRequest): Promise<LoginResponse> => {
      const response = await api.post<LoginResponse>("/auth/login", {
        email: data.email.trim(),
        password: data.password,
      });

      if (!response) {
        throw new Error("Login failed: No response from server");
      }

      return response;
    },
    [api],
  );

  const register = useCallback(
    async (data: RegisterRequest): Promise<RegisterResponse> => {
      const formData = new FormData();

      // Required
      formData.append("name", data.name.trim());
      formData.append("email", data.email.trim());
      formData.append("password", data.password);
      formData.append("state_id", data.state_id);
      formData.append("college_id", data.college_id);

      // Optional
      if (data.referral_code?.trim()) {
        formData.append("referral_code", data.referral_code.trim());
      }

      // Optional files (React Native: FormData.append accepts { uri, name, type })
      if (data.resume) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formData.append("resume", data.resume as any);
      }
      if (data.profile_pic) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formData.append("profile_pic", data.profile_pic as any);
      }

      const response = await api.post<RegisterResponse>(
        "/auth/register",
        formData,
        { headers: {} },
      );

      if (!response) {
        throw new Error("Registration failed: No response from server");
      }

      return response;
    },
    [api],
  );

  return { login, register };
}
