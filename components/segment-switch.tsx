import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SegmentedSwitchProps {
  list: string[];
  selected: string;
  onSelected: (value: string) => void;
}

export default function SegmentedSwitch({
  list,
  selected,
  onSelected,
}: SegmentedSwitchProps) {
  return (
    <View style={styles.container}>
      {list.map((item) => {
        const isActive = item === selected;

        if (isActive) {
          return (
            <LinearGradient
              key={item}
              colors={["#6B4EFF", "#4A2EDB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.activeTab}
            >
              <Pressable onPress={() => onSelected(item)}>
                <Text style={styles.activeText}>{item}</Text>
              </Pressable>
            </LinearGradient>
          );
        }

        return (
          <Pressable
            key={item}
            style={styles.inactiveTab}
            onPress={() => onSelected(item)}
          >
            <Text style={styles.inactiveText}>{item}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1D1D1D",
    borderRadius: 999,
    padding: 5,
    marginTop: 10,
    alignSelf: "center",
    alignItems: "center",
  },

  activeTab: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  inactiveTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  activeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "AnekOdia-Regular",
    lineHeight: 20,
  },

  inactiveText: {
    color: "#C7C7C7",
    fontSize: 14,
    fontFamily: "AnekOdia-Regular",
    lineHeight: 20,
  },
});
