import { FontFamily } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const GlobalStyle = StyleSheet.create({
  textHeading: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    color: "#ECEDEE",
    textAlign: "center",
    fontWeight: 800,
  },
  textRegular: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: "#9BA1A6",
    textAlign: "center",
  },
});
