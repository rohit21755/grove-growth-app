import ProfileCard from "@/components/home/profile-card";
import TaskSections from "@/components/home/task-sections";
import { Colors } from "@/constants/theme";
import { useTasksQuery } from "@/hooks/use-tasks-api";
import { useUserApi } from "@/hooks/use-user-api";
import { useAuthStore } from "@/store/auth-store";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";

const USER_REFRESH_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

export default function HomeScreen() {
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const { refetch } = useTasksQuery({ enabled: true });
  const { getMe } = useUserApi();

  useFocusEffect(
    useCallback(() => {
      refetch();
      getMe()
        .then((freshUser) => {
          if (freshUser) updateUser(freshUser);
        })
        .catch(() => {});
    }, [refetch, getMe, updateUser]),
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    const refreshUser = () => {
      getMe()
        .then((freshUser) => {
          if (freshUser) updateUser(freshUser);
        })
        .catch(() => {});
    };
    const intervalId = setInterval(refreshUser, USER_REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [isAuthenticated, getMe, updateUser]);

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <ProfileCard
        name={user?.name}
        points={user?.xp}
        rank={user?.rank as number | undefined}
        level={user?.level}
        profilePicture={user?.avatar_url as string | undefined}
      />
      <TaskSections />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  content: {
    alignItems: "center",
  },
  welcome: {
    marginTop: 8,
    color: Colors.dark.text,
  },
});
