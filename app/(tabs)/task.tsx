import AppHeader from "@/components/app-header";
import SegmentedSwitch from "@/components/segment-switch";
import SubmissionCard from "@/components/submission-card";
import TaskCard from "@/components/task-card";
import DateStrip from "@/components/task/date-strip";
import { Colors, FontFamily } from "@/constants/theme";
import { useTaskHistoryQuery } from "@/hooks/use-task-history-api";
import { useTasksQuery } from "@/hooks/use-tasks-api";
import { useAuthStore } from "@/store/auth-store";
import type { Task, UserTaskStatus } from "@/types/tasks";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const SEGMENT_OPTIONS = ["Ongoing", "Completed"] as const;

/** Can user open submit flow? (not_started or rejected and task not ended) */
function canSubmit(task: Task): boolean {
  const us = task.user_status ?? "not_started";
  const taskEnded = task.status === "ended";
  if (us === "not_started") return !taskEnded;
  if (us === "rejected") return !taskEnded;
  return false;
}

export default function TaskScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [selected, setSelected] = useState<string>(SEGMENT_OPTIONS[0]);

  const {
    data: tasks = [],
    isLoading,
    isPending,
    isError,
    refetch,
  } = useTasksQuery({ enabled: isAuthenticated });

  const {
    data: submissions = [],
    isLoading: historyLoading,
    isError: historyError,
    refetch: refetchHistory,
  } = useTaskHistoryQuery({
    enabled: isAuthenticated && selected === "Completed",
  });

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        refetch();
        if (selected === "Completed") refetchHistory();
      }
    }, [isAuthenticated, refetch, selected, refetchHistory]),
  );

  const showLoading =
    isLoading || (isAuthenticated && isPending && tasks.length === 0);

  const filteredTasks = useMemo(() => {
    if (selected === "Completed") {
      return tasks.filter((t) => t.user_status === "completed");
    }
    // Ongoing: sort by nearest deadline first, show only 3
    const ongoing = tasks.filter((t) => t.user_status !== "completed");
    const byDeadline = [...ongoing].sort((a, b) => {
      const timeA = a.end_at ? new Date(a.end_at).getTime() : Infinity;
      const timeB = b.end_at ? new Date(b.end_at).getTime() : Infinity;
      return timeA - timeB;
    });
    return byDeadline.slice(0, 3);
  }, [tasks, selected]);

  /** Approved submissions with task info for Completed section */
  const approvedWithTasks = useMemo(() => {
    const approved = submissions.filter((s) => s.status === "approved");
    return approved
      .map((s) => {
        const task = tasks.find((t) => t.id === s.task_id);
        if (!task) return null;
        return { submission: s, task };
      })
      .filter(
        (x): x is { submission: (typeof submissions)[0]; task: Task } =>
          x != null,
      )
      .sort(
        (a, b) =>
          new Date(b.submission.updated_at).getTime() -
          new Date(a.submission.updated_at).getTime(),
      );
  }, [submissions, tasks]);

  function formatDateLabel(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "";
    }
  }

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <AppHeader type="title" title="Tasks" />
      <SegmentedSwitch
        list={[...SEGMENT_OPTIONS]}
        selected={selected}
        onSelected={setSelected}
      />
      <View
        style={{
          marginVertical: 12,
        }}
      ></View>
      <DateStrip />

      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderSpacer} />
        <Pressable
          onPress={() => {
            refetch();
            if (selected === "Completed") refetchHistory();
          }}
        >
          <Text style={styles.viewAllText}>View all</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {selected === "Completed" ? (
          historyLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.dark.tint} />
              <Text style={styles.loadingText}>Loading completed...</Text>
            </View>
          ) : historyError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Couldn't load completed tasks
              </Text>
              <Pressable
                style={styles.retryButton}
                onPress={() => refetchHistory()}
              >
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : approvedWithTasks.length === 0 ? (
            <Text style={styles.emptyText}>No completed tasks</Text>
          ) : (
            approvedWithTasks.map(({ submission, task }) => (
              <SubmissionCard
                key={submission.id}
                title={task.title}
                description={task.description}
                image={submission.proof_url}
                responses={1}
                points={task.xp}
                dateLabel={formatDateLabel(submission.updated_at)}
              />
            ))
          )
        ) : showLoading ? (
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
          <Text style={styles.emptyText}>No ongoing tasks</Text>
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

        {selected === "Ongoing" && (
          <View style={styles.belowTasks}>
            <Text style={styles.specialEventsTitle}>Special Events</Text>
            <Pressable style={styles.imageButton} onPress={() => {}}>
              <Image
                source={require("@/assets/images/weekly-vibe.png")}
                style={styles.belowTasksImage}
                resizeMode="contain"
              />
            </Pressable>
            <Pressable style={styles.imageButton} onPress={() => {}}>
              <Image
                source={require("@/assets/images/trivia-tuesday.png")}
                style={styles.belowTasksImage}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  sectionHeaderSpacer: {
    flex: 1,
  },
  viewAllText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  belowTasks: {
    marginTop: 24,
    gap: 16,
    width: "100%",
    alignSelf: "stretch",
  },
  specialEventsTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontFamily: FontFamily.bold,
    marginBottom: 4,
  },
  imageButton: {
    width: "100%",
    alignSelf: "stretch",
    height: 185,
    borderRadius: 20,
    backgroundColor: "#242426",
    overflow: "hidden",
  },
  belowTasksImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
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
});
