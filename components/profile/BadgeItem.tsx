import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

export interface BadgeItemProps {
  image: ImageSourcePropType;
}

export default function BadgeItem({ image }: BadgeItemProps) {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: "#1C1C1E",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
