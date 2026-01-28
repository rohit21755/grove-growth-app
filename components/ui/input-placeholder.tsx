import { FontFamily } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type InputPlaceholderProps = {
  label?: string;
};

export function InputPlaceholder({ label }: InputPlaceholderProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputPlaceholder}>
        <ActivityIndicator color="#9BA1A6" size="small" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 24,
  },
  label: {
    color: "rgba(191, 191, 191, 1)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    fontFamily: FontFamily.semiBold,
  },
  inputPlaceholder: {
    width: "100%",
    minHeight: 32,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2a2a2a",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: "#9BA1A6",
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
});
