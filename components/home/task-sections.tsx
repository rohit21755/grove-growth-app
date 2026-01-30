import { Colors, FontFamily } from "@/constants/theme";
import { useTasksQuery } from "@/hooks/use-tasks-api";
import { useAuthStore } from "@/store/auth-store";
import type { Task, UserTaskStatus } from "@/types/tasks";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import TaskCard from "../task-card";
import Dropdown from "../ui/dropdown";

/** Can user open submit flow? (not_started or rejected and task not ended) */
function canSubmit(task: Task): boolean {
  const us = task.user_status ?? "not_started";
  const taskEnded = task.status === "ended";
  if (us === "not_started") return !taskEnded;
  if (us === "rejected") return !taskEnded;
  return false;
}

export default function TaskSections() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useTasksQuery({ enabled: isAuthenticated });
  const [filter, setFilter] = useState<"Completed" | "Ongoing">("Ongoing");

  const filteredTasks = useMemo(() => {
    if (filter === "Completed") {
      return tasks.filter((t) => t.user_status === "completed");
    }
    return tasks.filter((t) => t.user_status !== "completed");
  }, [tasks, filter]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Dropdown
          list={["Completed", "Ongoing"]}
          selected={filter}
          setSelected={(value) => setFilter(value as "Completed" | "Ongoing")}
        />
        <Pressable onPress={() => router.push("/all-tasks")}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>
      <View style={styles.taskCardsContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.dark.tint} />
            <Text style={styles.loadingText}>Loading tasks...</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Couldn't load tasks</Text>
            <Pressable style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : filteredTasks.length === 0 ? (
          <Text style={styles.emptyText}>
            {filter === "Completed" ? "No completed tasks" : "No ongoing tasks"}
          </Text>
        ) : (
          filteredTasks.map((task: Task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              points={task.xp}
              userStatus={(task.user_status ?? "not_started") as UserTaskStatus}
              taskStatus={task.status}
              endAt={task.end_at}
              onPress={
                canSubmit(task)
                  ? () =>
                      router.push(
                        `/task-rules?taskId=${encodeURIComponent(task.id)}`,
                      )
                  : undefined
              }
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  taskCardsContainer: {
    marginTop: 16,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  emptyText: {
    color: Colors.dark.tabIconDefault,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    marginTop: 8,
  },
  errorContainer: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    color: Colors.dark.tabIconDefault,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryText: {
    color: Colors.dark.tint,
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontFamily: FontFamily.regular,
  },
});
