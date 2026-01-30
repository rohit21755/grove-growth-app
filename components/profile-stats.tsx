import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

function formatOrdinal(n: number): string {
  const s = String(n);
  if (s.endsWith("11") || s.endsWith("12") || s.endsWith("13")) return s + "th";
  if (s.endsWith("1")) return s + "st";
  if (s.endsWith("2")) return s + "nd";
  if (s.endsWith("3")) return s + "rd";
  return s + "th";
}

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=user";

function getAvatarUri(avatar: string | undefined): string {
  const u = typeof avatar === "string" ? avatar.trim() : "";
  return u ? u : DEFAULT_AVATAR;
}

interface ProfileStatsProps {
  avatar: string;
  points: number;
  username: string;
  rank: string;
  level: number;
  levelProgress: number; // 0–100
}

export default function ProfileStats({
  avatar,
  points,
  username,
  rank,
  level,
  levelProgress,
}: ProfileStatsProps) {
  const radius = 26;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (circumference * levelProgress) / 100;
  const avatarUri = getAvatarUri(avatar);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="settings-outline" size={20} color="#fff" />
        </View>

        <Image source={{ uri: avatarUri }} style={styles.avatar} />

        <View style={styles.progressWrapper}>
          <Svg width={60} height={60}>
            <Circle
              cx="30"
              cy="30"
              r={radius}
              stroke="#2A2A2A"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx="30"
              cy="30"
              r={radius}
              stroke="#9ED0FF"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      </View>

      <Text style={styles.points}>{points.toLocaleString()}pt</Text>

      <Text style={styles.meta}>
        {username}
        {rank !== "—" ? (
          <>
            {" "}
            · <Text style={styles.star}>★</Text> {formatOrdinal(Number(rank))}{" "}
            Place
          </>
        ) : (
          <> · Rank: —</>
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  progressWrapper: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  levelText: {
    position: "absolute",
    color: "#C7F0B3",
    fontSize: 16,
    fontWeight: "700",
  },

  points: {
    marginTop: 20,
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
  },

  meta: {
    marginTop: 4,
    color: "#A1A1AA",
    fontSize: 14,
    fontWeight: "600",
  },

  star: {
    color: "#FFD166",
  },
});
