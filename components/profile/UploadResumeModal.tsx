import { FontFamily } from "@/constants/theme";
import type { FileForUpload } from "@/hooks/use-user-files-api";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export interface UploadResumeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpload: (file: FileForUpload) => Promise<unknown>;
  onUpdate?: (file: FileForUpload) => Promise<unknown>;
  /** When true, uses onUpdate instead of onUpload */
  isUpdate?: boolean;
}

export default function UploadResumeModal({
  visible,
  onClose,
  onUpload,
  onUpdate,
  isUpdate = false,
}: UploadResumeModalProps) {
  const [selectedFile, setSelectedFile] = useState<FileForUpload | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePickFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      setSelectedFile({
        uri: file.uri,
        name: file.name ?? "resume.pdf",
        type: file.mimeType ?? "application/pdf",
      });
    } catch {
      setSelectedFile(null);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const uploadFn = isUpdate && onUpdate ? onUpdate : onUpload;
      const result = await uploadFn(selectedFile);
      if (result) {
        setSelectedFile(null);
        onClose();
      } else {
        Alert.alert("Error", "Failed to save resume. Please try again.");
      }
    } catch {
      Alert.alert("Error", "Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, isUpdate, onUpdate, onUpload, onClose]);

  const handleClose = useCallback(() => {
    if (!isUploading) {
      setSelectedFile(null);
      onClose();
    }
  }, [isUploading, onClose]);

  const title = isUpdate ? "Update resume" : "Upload resume";
  const submitLabel = isUpdate ? "Update" : "Upload";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable
              onPress={handleClose}
              hitSlop={12}
              disabled={isUploading}
            >
              <Ionicons name="close" size={24} color="#9BA1A6" />
            </Pressable>
          </View>
          <Text style={styles.hint}>
            Select a PDF file (max 10MB). Your resume will be visible to
            recruiters.
          </Text>
          <Pressable
            style={[styles.selectBtn, selectedFile && styles.selectBtnFilled]}
            onPress={handlePickFile}
            disabled={isUploading}
          >
            <Ionicons
              name="document-text-outline"
              size={24}
              color={selectedFile ? "#4CAF50" : "#9BA1A6"}
            />
            <Text
              style={[
                styles.selectBtnText,
                selectedFile && styles.selectBtnTextFilled,
              ]}
              numberOfLines={1}
            >
              {selectedFile?.name ?? "Select PDF file"}
            </Text>
            {selectedFile && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            )}
          </Pressable>
          <Pressable
            style={[
              styles.submitBtn,
              (!selectedFile || isUploading) && styles.submitBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>{submitLabel}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: FontFamily.bold,
    color: "#FFFFFF",
  },
  hint: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: "#9BA1A6",
    marginBottom: 16,
  },
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#2A2A2D",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
    borderStyle: "dashed",
  },
  selectBtnFilled: {
    borderColor: "#4CAF50",
    borderStyle: "solid",
  },
  selectBtnText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: "#9BA1A6",
  },
  selectBtnTextFilled: {
    color: "#ECEDEE",
  },
  submitBtn: {
    backgroundColor: "#6D5FFD",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FontFamily.semiBold,
  },
});
