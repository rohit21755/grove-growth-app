import { FontFamily } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SegmentedSwitch from "./segment-switch";

export type HeaderType = "title" | "segment" | "month";

export type AppHeaderProps = {
  type: HeaderType;
  title?: string;
  segmentList?: string[];
  selected?: string;
  onSelect?: (value: string) => void;
  monthText?: string;
  onMonthPress?: () => void;
  onBackPress?: () => void;
  /** When both provided, show settings + three-dots instead of avatar (e.g. on profile) */
  onSettings?: () => void;
  onMore?: () => void;
};

export default function AppHeader({
  type,
  title,
  segmentList,
  selected,
  onSelect,
  monthText,
  onMonthPress,
  onBackPress,
  onSettings,
  onMore,
}: AppHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";
  const showSettingsAndMore = onSettings != null && onMore != null;

  const handleBack = onBackPress ?? (() => router.back());

  return (
    <View style={styles.container}>
      <Pressable style={styles.iconButton} onPress={handleBack}>
        <Ionicons name="chevron-back" size={18} color="#fff" />
      </Pressable>

      {type === "title" && title != null && (
        <Text style={styles.title}>{title}</Text>
      )}

      {type === "segment" &&
        segmentList != null &&
        selected != null &&
        onSelect != null && (
          <SegmentedSwitch
            list={segmentList}
            selected={selected}
            onSelected={onSelect}
          />
        )}

      {type === "month" && (
        <Pressable style={styles.monthContainer} onPress={onMonthPress}>
          <Text style={styles.monthText}>{monthText}</Text>
          <Ionicons name="chevron-down" size={18} color="#C7C7C7" />
        </Pressable>
      )}

      {showSettingsAndMore ? (
        <View style={styles.rightIcons}>
          <Pressable style={styles.iconButton} onPress={onSettings}>
            <Ionicons name="settings-outline" size={18} color="#fff" />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={onMore}>
            <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={() => router.push("/profile" as const)}>
          <LinearGradient
            colors={["#3958A1", "#47368F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </LinearGradient>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2A2A2D",
    borderWidth: 1,
    borderColor: "#3A3A3E",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: FontFamily.bold,
    fontWeight: "800",
  },
  monthContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  monthText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
