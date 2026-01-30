import { BellIcon, RewardsTabIcon } from "@/components/icons/tab-icons";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export type ProfileCardProps = {
  name?: string;
  points?: number;
  rank?: number;
  level?: number;
  profilePicture?: string;
};

export default function ProfileCard({
  name,
  points = 0,
  rank,
  level = 0,
  profilePicture,
}: ProfileCardProps) {
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <LinearGradient
      colors={["#1C519D", "#33167F", "#1D1D1D"]}
      locations={[0, 0.25, 1]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.card}
    >
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.helloText}>Hello, {name ?? "User"}</Text>
        </View>

        <BellIcon color="#fff" size={22} />
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.label}>Total Points</Text>
          <Text style={styles.points}>{points}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="trending-up" size={14} color="#C7C7C7" />
            {rank != null && <Text style={styles.metaText}> Rank #{rank}</Text>}
            <Text style={styles.metaText}> Level {level}</Text>
          </View>
        </View>

        <View style={styles.trophyWrapper}>
          <RewardsTabIcon color="#fff" size={28} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    width: "100%",
    minHeight: 160,
    justifyContent: "space-between",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B5BDB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  helloText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  bottomRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  label: {
    color: "#C7C7C7",
    fontSize: 12,
  },

  points: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "700",
    // marginVertical: ,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  metaText: {
    color: "#C7C7C7",
    fontSize: 13,
  },

  trophyWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },
});
