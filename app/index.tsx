import { GlobalStyle } from "@/assets/styles/GlobalStyle";
import { GradientButton } from "@/components/ui/gradient-button";
import { Colors } from "@/constants/theme";
import { type Href, router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Landing() {
  function handleClick() {
    router.push("/login");
  }

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <View style={styles.badgeContainer}>
        <Image
          source={require("@/assets/images/badge3.png")}
          style={styles.badge}
        />
      </View>
      <View style={styles.content}>
        <Text style={GlobalStyle.textHeading}>One app,</Text>
        <Text style={GlobalStyle.textHeading}>all your Groving</Text>
        <View style={styles.roleHint}>
          <Text style={GlobalStyle.textRegular}>
            What's your role? You can add another account at any time
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.buttonSlot}>
            <GradientButton
              title="Ambassador"
              onPress={() => router.push("/register" as Href)}
              borderRadius={18}
            />
          </View>
          <View style={styles.buttonSlot}>
            <GradientButton
              title="State Lead"
              onPress={() => console.log("signup")}
              borderRadius={18}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <Text style={GlobalStyle.textRegular}>Already have an account?</Text>
          <Pressable onPress={handleClick}>
            <Text style={[GlobalStyle.textRegular, styles.loginLink]}>
              Log in
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  badgeContainer: {
    width: "auto",
    height: "auto",
    alignItems: "center",
    marginTop: "55%",
  },
  badge: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  content: {
    marginTop: 112,
    alignItems: "center",
  },
  roleHint: {
    marginTop: 16,
  },
  buttonRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  buttonSlot: {
    flex: 1,
  },
  loginRow: {
    marginTop: 16,
    flexDirection: "row",
  },
  loginLink: {
    color: "white",
    marginLeft: 4,
    fontWeight: "400",
  },
});
