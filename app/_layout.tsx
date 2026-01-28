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
import { useEffect } from "react";
import "react-native-reanimated";

import { ApiProvider, useApi } from "@/contexts/api-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/auth-store";

SplashScreen.preventAutoHideAsync();

function AuthSync() {
  const { token, initialize } = useAuthStore();
  const { setAuthToken } = useApi();

  useEffect(() => {
    // Initialize auth store (loads token from secure store)
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Sync token to API context whenever it changes
    setAuthToken(token);
  }, [token, setAuthToken]);

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
      <ApiProvider>
        <AuthSync />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
      </ApiProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
