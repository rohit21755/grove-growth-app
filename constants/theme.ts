/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

/** Anek Odia – applied globally */
export const FontFamily = {
  regular: "AnekOdia_400Regular",
  medium: "AnekOdia_500Medium",
  semiBold: "AnekOdia_600SemiBold",
  bold: "AnekOdia_700Bold",
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: FontFamily.regular,
    serif: FontFamily.regular,
    rounded: FontFamily.regular,
    mono: FontFamily.regular,
  },
  default: {
    sans: FontFamily.regular,
    serif: FontFamily.regular,
    rounded: FontFamily.regular,
    mono: FontFamily.regular,
  },
  web: {
    sans: `"${FontFamily.regular}", system-ui, sans-serif`,
    serif: `"${FontFamily.regular}", serif`,
    rounded: `"${FontFamily.regular}", sans-serif`,
    mono: `"${FontFamily.regular}", monospace`,
  },
});
