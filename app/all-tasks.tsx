import AppHeader from "@/components/app-header";
import SegmentedSwitch from "@/components/segment-switch";
import SubmissionCard from "@/components/submission-card";
import TaskCard from "@/components/task-card";
import { Colors, FontFamily } from "@/constants/theme";
import { useTaskHistoryQuery } from "@/hooks/use-task-history-api";
import { useTasksQuery } from "@/hooks/use-tasks-api";
import { useAuthStore } from "@/store/auth-store";
import type { Task, UserTaskStatus } from "@/types/tasks";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const SEGMENT_OPTIONS = ["All", "Ongoing", "Completed"] as const;
type Segment = (typeof SEGMENT_OPTIONS)[number];

function canSubmit(task: Task): boolean {
  const us = task.user_status ?? "not_started";
  const taskEnded = task.status === "ended";
  if (us === "not_started") return !taskEnded;
  if (us === "rejected") return !taskEnded;
  return false;
}

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

export default function AllTasksScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const initialized = useAuthStore((s) => s.initialized);
  const [selected, setSelected] = useState<Segment>("All");

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
    enabled:
      isAuthenticated && (selected === "Completed" || selected === "All"),
  });

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        refetch();
        if (selected === "Completed" || selected === "All") refetchHistory();
      }
    }, [isAuthenticated, refetch, selected, refetchHistory]),
  );

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/");
    }
  }, [initialized, isAuthenticated, router]);

  const showLoading =
    isLoading || (isAuthenticated && isPending && tasks.length === 0);

  /** Ongoing tasks sorted by nearest end_at */
  const ongoingTasks = useMemo(() => {
    const ongoing = tasks.filter((t) => t.user_status !== "completed");
    return [...ongoing].sort((a, b) => {
      const timeA = a.end_at ? new Date(a.end_at).getTime() : Infinity;
      const timeB = b.end_at ? new Date(b.end_at).getTime() : Infinity;
      return timeA - timeB;
    });
  }, [tasks]);

  /** Approved submissions with task info for Completed */
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

  const showHistoryLoading =
    (selected === "Completed" || selected === "All") && historyLoading;
  const showHistoryError =
    (selected === "Completed" || selected === "All") && historyError;

  if (!initialized || !isAuthenticated) {
    return null;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <AppHeader type="title" title="All Tasks" />
      <View style={styles.segmentWrapper}>
        <SegmentedSwitch
          list={[...SEGMENT_OPTIONS]}
          selected={selected}
          onSelected={(value) => setSelected(value as Segment)}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {selected === "Ongoing" ? (
          showLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.dark.tint} />
              <Text style={styles.loadingText}>Loading tasks...</Text>
            </View>
          ) : isError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Couldn&apos;t load tasks</Text>
              <Pressable style={styles.retryButton} onPress={() => refetch()}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : ongoingTasks.length === 0 ? (
            <Text style={styles.emptyText}>No ongoing tasks</Text>
          ) : (
            ongoingTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                points={task.xp}
                userStatus={
                  (task.user_status ?? "not_started") as UserTaskStatus
                }
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
          )
        ) : selected === "Completed" ? (
          showHistoryLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.dark.tint} />
              <Text style={styles.loadingText}>Loading completed...</Text>
            </View>
          ) : showHistoryError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Couldn&apos;t load completed tasks
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
        ) : (
          /* All: show ongoing then completed */
          <>
            {showLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.dark.tint} />
                <Text style={styles.loadingText}>Loading tasks...</Text>
              </View>
            ) : isError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Couldn&apos;t load tasks</Text>
                <Pressable style={styles.retryButton} onPress={() => refetch()}>
                  <Text style={styles.retryText}>Retry</Text>
                </Pressable>
              </View>
            ) : (
              <>
                {ongoingTasks.length > 0 && (
                  <Text style={styles.sectionTitle}>Ongoing</Text>
                )}
                {ongoingTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    points={task.xp}
                    userStatus={
                      (task.user_status ?? "not_started") as UserTaskStatus
                    }
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
                ))}
                {(selected === "All" ? showHistoryLoading : false) ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={Colors.dark.tint} />
                    <Text style={styles.loadingText}>Loading completed...</Text>
                  </View>
                ) : approvedWithTasks.length > 0 ? (
                  <>
                    <Text style={styles.sectionTitle}>Completed</Text>
                    {approvedWithTasks.map(({ submission, task }) => (
                      <SubmissionCard
                        key={submission.id}
                        title={task.title}
                        description={task.description}
                        image={submission.proof_url}
                        responses={1}
                        points={task.xp}
                        dateLabel={formatDateLabel(submission.updated_at)}
                      />
                    ))}
                  </>
                ) : null}
                {ongoingTasks.length === 0 &&
                  approvedWithTasks.length === 0 &&
                  !showLoading && (
                    <Text style={styles.emptyText}>No tasks yet</Text>
                  )}
              </>
            )}
          </>
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
  segmentWrapper: {
    marginTop: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontFamily: FontFamily.bold,
    marginBottom: 12,
    marginTop: 8,
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
