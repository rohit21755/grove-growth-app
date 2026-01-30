import { FontFamily } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    Image,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export interface ReferralCardProps {
  name: string;
  subtitle: string;
  avatar: string | ImageSourcePropType;
  onActionPress?: () => void;
}

function getAvatarSource(
  avatar: string | ImageSourcePropType,
): { uri: string } | ImageSourcePropType {
  if (typeof avatar === "string") return { uri: avatar };
  return avatar;
}

export default function ReferralCard({
  name,
  subtitle,
  avatar,
  onActionPress,
}: ReferralCardProps) {
  const avatarSource = getAvatarSource(avatar);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image source={avatarSource} style={styles.avatar} />

        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <Pressable style={styles.action} onPress={onActionPress}>
        <MaterialCommunityIcons
          name="star-four-points"
          size={22}
          color="#9CFFB8"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1C1C1C",
    padding: 12,
    borderRadius: 18,
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
  name: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FontFamily.semiBold,
  },
  subtitle: {
    color: "#A1A1AA",
    fontSize: 12,
    marginTop: 2,
    fontFamily: FontFamily.regular,
  },
  action: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#242424",
    justifyContent: "center",
    alignItems: "center",
  },
});
