import { Colors, FontFamily } from "@/constants/theme";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export interface ProfileHeaderProps {
  avatar: string | ImageSourcePropType;
  username: string;
  followers: number;
  following: number;
  onAddBio?: () => void;
  onSettings?: () => void;
  onMore?: () => void;
}

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=user";

function getAvatarSource(
  avatar: string | ImageSourcePropType,
): { uri: string } | ImageSourcePropType {
  if (typeof avatar === "string") {
    const u = avatar.trim();
    return u ? { uri: u } : { uri: DEFAULT_AVATAR };
  }
  return avatar;
}

export default function ProfileHeader({
  avatar,
  username,
  followers,
  following,
  onAddBio,
  onSettings,
  onMore,
}: ProfileHeaderProps) {
  const avatarSource = getAvatarSource(avatar);

  return (
    <View style={styles.container}>
      <View style={styles.topIcons}>
        {/* <Pressable onPress={onSettings} style={styles.iconBtn}>
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </Pressable>
        <Pressable onPress={onMore} style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
        </Pressable> */}
      </View>

      <Image source={avatarSource} style={styles.avatar} />

      <Text style={styles.username}>{username}</Text>

      <View style={styles.statsRow}>
        <Text style={styles.statText}>
          {followers} <Text style={styles.statLabel}>followers</Text>
        </Text>
        <Text style={styles.statText}>
          {following} <Text style={styles.statLabel}>following</Text>
        </Text>
      </View>

      <Pressable onPress={onAddBio}>
        <Text style={styles.addBio}>+ Add your bio</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: 12,
    paddingBottom: 12,
    alignItems: "center",
  },
  topIcons: {
    position: "absolute",
    top: 10,
    right: 16,
    flexDirection: "row",
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16,
  },
  username: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: FontFamily.bold,
    color: Colors.dark.text,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 12,
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
  addBio: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FontFamily.regular,
  },
});
