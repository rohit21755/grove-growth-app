import { FontFamily } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";

// Gradient colors matching your design
const GRADIENT_COLORS: [string, string, string] = [
  "#1C519D",
  "#33167F",
  "#1D1D1D",
];

export type GradientButtonProps = {
  title: string;
  onPress: () => void;
  /** When true, button is non-interactive and visually dimmed */
  disabled?: boolean;
  /** Width of the gradient border in pixels. Default: 2 */
  borderWidth?: number;
  /** Border radius. Default: 18 */
  borderRadius?: number;
  /** Whether to fill the button with gradient background. Default: false (border only) */
  filled?: boolean;
  /** Custom background color when not filled. Default: #1D1D1D */
  backgroundColor?: string;
  /** Custom style for the button container */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
};

export function GradientButton({
  title,
  onPress,
  disabled = false,
  borderWidth = 1.5,
  borderRadius = 56,
  filled = false,
  backgroundColor = "#1D1D1D",
  style,
  textStyle,
}: GradientButtonProps) {
  const innerBorderRadius = borderRadius - borderWidth;

  // Use LinearGradient for all platforms (works on web too)
  if (filled) {
    // Filled button: gradient background with optional border
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        style={({ pressed }) => [
          styles.container,
          {
            borderRadius,
            opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          },
          style,
        ]}
        android_ripple={undefined}
        disabled={disabled}
      >
        <LinearGradient
          colors={GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius }]}
        >
          <View style={[styles.content, { borderRadius: innerBorderRadius }]}>
            <Text style={[styles.title, textStyle]}>{title}</Text>
          </View>
        </LinearGradient>
      </Pressable>
    );
  }

  // Border-only button: gradient border with solid background
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.container,
        {
          borderRadius,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
      android_ripple={undefined}
      disabled={disabled}
    >
      <View style={[{ borderRadius, overflow: "hidden" }]}>
        <LinearGradient
          colors={GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientBorder, { borderRadius }]}
        >
          <View
            style={[
              styles.content,
              {
                borderRadius: innerBorderRadius,
                backgroundColor,
                margin: borderWidth,
              },
            ]}
          >
            <Text style={[styles.title, textStyle]}>{title}</Text>
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    minHeight: 28,
    width: "100%",
  },
  gradientBorder: {
    padding: 0,
    minHeight: 28,
    width: "100%",
  },
  gradient: {
    padding: 0,
    minHeight: 28,
    width: "100%",
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 28,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: "#fff",
  },
});
