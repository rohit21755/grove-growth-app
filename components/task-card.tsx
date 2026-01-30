import type { TaskStatus, UserTaskStatus } from "@/types/tasks";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

const USER_STATUS_LABEL: Record<UserTaskStatus, string> = {
  completed: "Completed",
  viewing: "Under review",
  rejected: "Resubmit",
  not_started: "Submit",
};

interface TaskCardProps {
  title: string;
  description: string;
  points: number;
  userStatus?: UserTaskStatus;
  taskStatus?: TaskStatus;
  endAt?: string | null;
  onPress?: () => void;
  onSocialPress?: () => void;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

export default function TaskCard({
  title,
  description,
  points,
  userStatus = "not_started",
  taskStatus,
  endAt,
  onPress,
  onSocialPress,
}: TaskCardProps) {
  const statusLabel = USER_STATUS_LABEL[userStatus];
  const dateStr = formatDate(endAt);

  const content = (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.footer}>
        <LinearGradient
          colors={["#130538", "#1C519D"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.socialBorder}
        >
          <Pressable
            style={styles.socialButton}
            onPress={onSocialPress}
            disabled={userStatus === "completed"}
          >
            <Text style={styles.socialText}>{statusLabel}</Text>
          </Pressable>
        </LinearGradient>
        <View style={styles.metaRow}>
          {dateStr ? <Text style={styles.metaText}>{dateStr}</Text> : null}
          <View style={styles.points}>
            <Text style={styles.pointsText}>+{points} xp</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
      >
        {content}
      </Pressable>
    );
  }
  return content;
}
const styles = StyleSheet.create({
  /* CARD */
  card: {
    backgroundColor: "#242426",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "AnekOdia-ExtraBold",
    fontWeight: "bold",
  },

  /* POINTS */
  points: {
    backgroundColor: "#37363B",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },

  pointsText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  description: {
    color: "#C7C7C7",
    fontSize: 12,
    marginTop: 8,
    fontFamily: "AnekOdia-Regular",
  },

  metaRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  metaText: {
    color: "#C7C7C7",
    fontSize: 12,
    marginTop: 4,
  },

  footer: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  /* SOCIAL BUTTON */
  socialBorder: {
    padding: 1.5,
    borderRadius: 999,
  },

  socialButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#130538",
  },

  socialText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "AnekOdia-Regular",
  },
});
