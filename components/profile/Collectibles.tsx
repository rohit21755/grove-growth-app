import BadgeItem from "@/components/profile/BadgeItem";
import { StyleSheet, View } from "react-native";

export default function Collectibles() {
  return (
    <View style={styles.container}>
      <View style={styles.badgesContainer}>
        <BadgeItem image={require("@/assets/images/badge3.png")} />
        <BadgeItem image={require("@/assets/images/badge3.png")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  badgesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
});
