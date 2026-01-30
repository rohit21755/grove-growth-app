import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

/** User shape from LoginResponse / RegisterResponse / auth APIs */
export type User = {
  id: string;
  name: string;
  email: string;
  state_id: string;
  college_id: string;
  state_name?: string;
  college_name?: string;
  role: string;
  xp: number;
  level: number;
  avatar_url?: string;
  [key: string]: unknown;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
  initialize: () => Promise<void>;
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  initialized: false,
  setAuth: async (token, user) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    } catch (error) {
      console.error("Failed to save auth data:", error);
      // Still update state even if storage fails
      set({ token, user, isAuthenticated: true });
    }
  },
  updateUser: async (user) => {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.error("Failed to update user in store:", error);
      set({ user });
    }
  },
  clearAuth: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
    set({ token: null, user: null, isAuthenticated: false });
  },
  initialize: async () => {
    if (get().initialized) return;

    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userStr = await SecureStore.getItemAsync(USER_KEY);

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          set({ token, user, isAuthenticated: true, initialized: true });
        } catch (parseError) {
          console.error("Failed to parse user data:", parseError);
          // Clear invalid data
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          await SecureStore.deleteItemAsync(USER_KEY);
          set({ initialized: true });
        }
      } else {
        set({ initialized: true });
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set({ initialized: true });
    }
  },
}));
