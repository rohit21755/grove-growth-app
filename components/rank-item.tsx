import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface RankItemProps {
  avatar: string;
  name: string;
  points: number;
  level: number;
  rank: number;
  /** User ID for navigation to profile */
  userId?: string;
  onPress?: () => void;
}

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=user";

function getAvatarUri(avatar: string | undefined): string {
  const u = typeof avatar === "string" ? avatar.trim() : "";
  return u ? u : DEFAULT_AVATAR;
}

export default function RankItem({
  avatar,
  name,
  points,
  level,
  rank,
  userId,
  onPress,
}: RankItemProps) {
  const router = useRouter();
  const avatarUri = getAvatarUri(avatar);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (userId) {
      router.push({
        pathname: "/user-profile/[id]",
        params: { id: userId },
      });
    }
  };

  const content = (
    <>
      <View style={styles.left}>
        <View>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.meta}>
            {points.toLocaleString()}pts · Lvl{level}
          </Text>
        </View>
      </View>
      <LinearGradient
        colors={["#2E2E2E", "#1C1C1C"]}
        style={styles.iconWrapper}
      >
        <Ionicons name="sparkles-outline" size={22} color="#9FC4FF" />
      </LinearGradient>
    </>
  );

  if (userId || onPress) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.container, pressed && { opacity: 0.8 }]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A1A1A",
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  rankBadge: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#2B2B2B",
    alignItems: "center",
    justifyContent: "center",
  },

  rankText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  meta: {
    color: "#A1A1AA",
    fontSize: 12,
    marginTop: 2,
  },

  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
