import { Text, View } from "react-native";
export default function RewardCollection() {
  return (
    <>
      <View
        style={{
          marginTop: 16,
          padding: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 24,
            fontWeight: "700",
          }}
        >
          Your Collection
        </Text>
        <Text
          style={{
            color: "#8C8C8C",
            fontSize: 12,
            fontWeight: "700",
          }}
        >
          Congratulations You've unlocked 12 Badges
        </Text>
        {/* Top Three badges*/}
        <View
          style={{
            backgroundColor: "#1B1B1B",
            borderRadius: 16,
          }}
        ></View>
      </View>
    </>
  );
}
