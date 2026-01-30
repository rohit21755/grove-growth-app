import { HapticTab } from "@/components/haptic-tab";
import {
    HomeTabIcon,
    LeaderboardTabIcon,
    RewardsTabIcon,
    TasksTabIcon,
} from "@/components/icons/tab-icons";
import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import { router, Tabs } from "expo-router";
import { useEffect } from "react";

export default function TabsLayout() {
  const { isAuthenticated, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/");
    }
  }, [initialized, isAuthenticated]);

  if (!initialized || !isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.tabIconSelected,
        tabBarInactiveTintColor: Colors.dark.tabIconDefault,
        tabBarStyle: { backgroundColor: Colors.dark.background },
        headerStyle: { backgroundColor: Colors.dark.background },
        headerTintColor: Colors.dark.text,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <HomeTabIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: "Tasks",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TasksTabIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <LeaderboardTabIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <RewardsTabIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
