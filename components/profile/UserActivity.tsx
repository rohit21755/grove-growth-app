import SubmissionCard from "@/components/submission-card";
import { Colors, FontFamily } from "@/constants/theme";
import type { FeedItem } from "@/types/feed";
import { StyleSheet, Text, View } from "react-native";

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

interface UserActivityProps {
  completedTasks: FeedItem[];
}

export default function UserActivity({ completedTasks }: UserActivityProps) {
  if (completedTasks.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No completed tasks yet</Text>
      </View>
    );
  }

  return (
    <View>
      {completedTasks.map((item) => (
        <SubmissionCard
          key={item.id}
          title={item.task_title}
          description=""
          image={item.proof_url}
          responses={item.reaction_count ?? item.comment_count ?? 1}
          points={item.task_xp ?? 0}
          dateLabel={formatDateLabel(item.created_at)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.dark.tabIconDefault,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
});
