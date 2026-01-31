import { Colors, FontFamily } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import {
    Image,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export interface ProfileHeaderProps {
  /** Profile pic URL – when empty, shows first char of username */
  avatar?: string | ImageSourcePropType | null;
  username: string;
  followers: number;
  following: number;
  stateName?: string;
  collegeName?: string;
  onAvatarPress?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
}

function hasValidAvatar(
  avatar: string | ImageSourcePropType | null | undefined,
): avatar is string | ImageSourcePropType {
  if (avatar == null) return false;
  if (typeof avatar === "string") return avatar.trim().length > 0;
  return true;
}

export default function ProfileHeader({
  avatar,
  username,
  followers,
  following,
  stateName,
  collegeName,
  onAvatarPress,
  onFollowersPress,
  onFollowingPress,
}: ProfileHeaderProps) {
  const hasAvatar = hasValidAvatar(avatar);
  const initial = username?.charAt(0)?.toUpperCase() ?? "?";
  const hasStateOrCollege = stateName?.trim() || collegeName?.trim();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onAvatarPress}
        style={({ pressed }) => [
          styles.avatarWrap,
          pressed && { opacity: 0.9 },
        ]}
      >
        {hasAvatar ? (
          <Image
            source={typeof avatar === "string" ? { uri: avatar } : avatar}
            style={styles.avatar}
          />
        ) : (
          <LinearGradient
            colors={["#3958A1", "#47368F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.avatar, styles.avatarInitial]}
          >
            <Text style={styles.avatarInitialText}>{initial}</Text>
          </LinearGradient>
        )}
      </Pressable>

      <Text style={styles.username}>{username}</Text>

      {hasStateOrCollege && (
        <Text style={styles.stateCollege} numberOfLines={2}>
          {[stateName, collegeName].filter(Boolean).join(" • ")}
        </Text>
      )}

      <View style={styles.statsRow}>
        <Pressable
          onPress={onFollowersPress}
          style={({ pressed }) => pressed && { opacity: 0.7 }}
        >
          <Text style={styles.statText}>
            {followers} <Text style={styles.statLabel}>followers</Text>
          </Text>
        </Pressable>
        <Pressable
          onPress={onFollowingPress}
          style={({ pressed }) => pressed && { opacity: 0.7 }}
        >
          <Text style={styles.statText}>
            {following} <Text style={styles.statLabel}>following</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    alignItems: "center",
  },
  avatarWrap: {
    marginBottom: 12,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  avatarInitial: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitialText: {
    color: "#FFFFFF",
    fontSize: 56,
    fontWeight: "700",
    fontFamily: FontFamily.bold,
  },
  username: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: FontFamily.bold,
    color: Colors.dark.text,
    marginBottom: 4,
    textAlign: "center",
  },
  stateCollege: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: "#6B7280",
    marginBottom: 10,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 40,
  },
  statText: {
    color: "#D4D4D4",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FontFamily.regular,
  },
  statLabel: {
    color: "#A1A1AA",
    fontWeight: "400",
  },
});
