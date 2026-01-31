import SubmissionCard from "@/components/submission-card";
import { Colors, FontFamily } from "@/constants/theme";
import { useTaskHistoryQuery } from "@/hooks/use-task-history-api";
import { useTasksQuery } from "@/hooks/use-tasks-api";
import { useAuthStore } from "@/store/auth-store";
import type { Task } from "@/types/tasks";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

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

export default function ProfileActivity() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: tasks = [] } = useTasksQuery({ enabled: isAuthenticated });
  const {
    data: submissions = [],
    isLoading,
    isError,
    refetch,
  } = useTaskHistoryQuery({ enabled: isAuthenticated });

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) refetch();
    }, [isAuthenticated, refetch]),
  );

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

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={Colors.dark.tint} />
        <Text style={styles.loadingText}>Loading completed tasks...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Couldn&apos;t load completed tasks</Text>
        <Pressable style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (approvedWithTasks.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No completed tasks yet</Text>
      </View>
    );
  }

  return (
    <View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: 32,
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  errorText: {
    color: Colors.dark.tabIconDefault,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  retryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryText: {
    color: Colors.dark.tint,
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
  },
  emptyText: {
    color: Colors.dark.tabIconDefault,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
});
