import { AnekOdia_400Regular } from "@expo-google-fonts/anek-odia/400Regular";
import { AnekOdia_600SemiBold } from "@expo-google-fonts/anek-odia/600SemiBold";
import { AnekOdia_700Bold } from "@expo-google-fonts/anek-odia/700Bold";
import { useFonts } from "@expo-google-fonts/anek-odia/useFonts";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import "react-native-reanimated";

import { ApiProvider, useApi } from "@/contexts/api-context";
import { WsProvider } from "@/contexts/ws-context";
import { useAuthApi } from "@/hooks/use-auth-api";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import { QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

function AuthSync() {
  const { token, initialize, setAuth } = useAuthStore();
  const { setAuthToken, setRefreshTokenHandler } = useApi();
  const { refreshToken } = useAuthApi();

  const refreshRef = useRef({ refreshToken, setAuth });
  refreshRef.current = { refreshToken, setAuth };

  useEffect(() => {
    // Initialize auth store (loads token from secure store)
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Sync token to API context whenever it changes
    setAuthToken(token);
  }, [token, setAuthToken]);

  useEffect(() => {
    // Register 401 handler once; handler reads latest refreshToken/setAuth via ref to avoid loop
    setRefreshTokenHandler(async (oldToken) => {
      try {
        const { refreshToken: refresh, setAuth: setAuthState } =
          refreshRef.current;
        const res = await refresh(oldToken);
        await setAuthState(res.token, res.user);
        return res.token;
      } catch {
        return null;
      }
    });
    return () => setRefreshTokenHandler(null);
  }, [setRefreshTokenHandler]);

  return null;
}

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    AnekOdia_400Regular,
    AnekOdia_600SemiBold,
    AnekOdia_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <AuthSync />
          <WsProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen
                name="task-rules"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="submit-task"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="profile" options={{ headerShown: false }} />
              <Stack.Screen name="all-tasks" options={{ headerShown: false }} />
              <Stack.Screen
                name="user-profile"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
          </WsProvider>
        </ApiProvider>
      </QueryClientProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
