import { GlobalStyle } from "@/assets/styles/GlobalStyle";
import AppHeader from "@/components/app-header";
import { Colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export default function RewardsScreen() {
  return (
    <View
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <AppHeader type="title" title="Rewards" />
      <Text style={[GlobalStyle.textRegular, styles.placeholder]}>
        Your rewards will appear here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  placeholder: {
    marginTop: 8,
  },
});
