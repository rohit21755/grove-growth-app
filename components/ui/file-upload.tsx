import { FontFamily } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type FileUploadProps = {
  label: string;
  fileName?: string | null;
  onPress: () => void;
  type: "document" | "image";
  /** Optional image URI for preview when type is "image" */
  imageUri?: string | null;
};

export function FileUpload({
  label,
  fileName,
  onPress,
  type,
  imageUri,
}: FileUploadProps) {
  const hasFile = Boolean(fileName || imageUri);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        hasFile && styles.hasFile,
      ]}
      onPress={onPress}
    >
      {type === "image" && imageUri ? (
        <View style={styles.imagePreview}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
          />
          <View style={styles.imageOverlay}>
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.changeText}>Change photo</Text>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {type === "document" ? (
              <Ionicons name="document-text" size={32} color="#9BA1A6" />
            ) : (
              <Ionicons name="image-outline" size={32} color="#9BA1A6" />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>{label}</Text>
            {hasFile ? (
              <Text style={styles.fileName} numberOfLines={1}>
                {fileName}
              </Text>
            ) : (
              <Text style={styles.hint}>
                {type === "document"
                  ? "Tap to upload PDF, DOC, or DOCX"
                  : "Tap to upload image"}
              </Text>
            )}
          </View>
          <Ionicons
            name={hasFile ? "checkmark-circle" : "add-circle-outline"}
            size={24}
            color={hasFile ? "#4CAF50" : "#9BA1A6"}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3a3a3a",
    borderStyle: "dashed",
    backgroundColor: "#2a2a2a",
    marginBottom: 20,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.8,
  },
  hasFile: {
    borderColor: "#4CAF50",
    borderStyle: "solid",
    backgroundColor: "#1a2a1a",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  label: {
    color: "#ECEDEE",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FontFamily.semiBold,
  },
  fileName: {
    color: "#4CAF50",
    fontSize: 12,
    fontFamily: FontFamily.regular,
  },
  hint: {
    color: "#9BA1A6",
    fontSize: 12,
    fontFamily: FontFamily.regular,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  changeText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
  },
});
