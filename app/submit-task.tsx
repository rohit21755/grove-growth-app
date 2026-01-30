import { FileUpload } from "@/components/ui/file-upload";
import { GradientButton } from "@/components/ui/gradient-button";
import { Colors, FontFamily } from "@/constants/theme";
import { useSubmissionsApi, type ProofFile } from "@/hooks/use-submissions-api";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function SubmitTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ taskId: string }>();
  const taskId = params.taskId ?? "";
  const { submitTask } = useSubmissionsApi();

  const [proofFile, setProofFile] = useState<ProofFile | null>(null);
  const [proofType, setProofType] = useState<"image" | "video">("image");
  const [proofText, setProofText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access your photo library is required to upload proof.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setProofFile({
      uri: asset.uri,
      name: asset.fileName ?? "proof.jpg",
      type: asset.mimeType ?? "image/jpeg",
    });
  };

  const handlePickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access your photo library is required to upload proof.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setProofFile({
      uri: asset.uri,
      name: asset.fileName ?? "proof.mp4",
      type: asset.mimeType ?? "video/mp4",
    });
  };

  const handleSubmit = async () => {
    if (!taskId) {
      Alert.alert("Error", "Task ID is required");
      return;
    }

    if (!proofFile?.uri) {
      Alert.alert("Proof required", `Please upload a ${proofType} file.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitTask({
        taskId,
        file: {
          uri: proofFile.uri,
          name: proofFile.name,
          type:
            proofType === "image"
              ? proofFile.type || "image/jpeg"
              : proofFile.type || "video/mp4",
        },
      });
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const apiErr = err as { message?: string; data?: string };
      const message =
        typeof apiErr.data === "string"
          ? apiErr.data
          : (apiErr.message ?? "Failed to submit task. Please try again.");
      Alert.alert("Submission Failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    router.back();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Submit Task</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Submission</Text>
          <Text style={styles.sectionDescription}>
            Upload your proof to complete this task
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Proof Type</Text>
          <View style={styles.proofTypeRow}>
            <View style={styles.proofTypeSlot}>
              <GradientButton
                title="Image"
                onPress={() => {
                  setProofType("image");
                  setProofFile(null);
                }}
                borderRadius={12}
                filled={proofType === "image"}
              />
            </View>
            <View style={styles.proofTypeSlot}>
              <GradientButton
                title="Video"
                onPress={() => {
                  setProofType("video");
                  setProofFile(null);
                }}
                borderRadius={12}
                filled={proofType === "video"}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          {proofType === "image" ? (
            <FileUpload
              label="Upload Image"
              type="image"
              onPress={handlePickImage}
              imageUri={proofFile?.uri ?? null}
              fileName={proofFile?.name ?? null}
            />
          ) : (
            <FileUpload
              label="Upload Video"
              type="document"
              onPress={handlePickVideo}
              fileName={proofFile?.name ?? null}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Additional Notes (Optional)</Text>
          <TextInput
            style={styles.textArea}
            value={proofText}
            onChangeText={setProofText}
            placeholder="Add any additional information about your submission"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.submitSection}>
          <GradientButton
            title={isSubmitting ? "Submitting..." : "Submit Task"}
            onPress={handleSubmit}
            disabled={isSubmitting}
            borderRadius={18}
            filled
          />
        </View>
      </ScrollView>

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseSuccess}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseSuccess}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submission successful</Text>
            <Text style={styles.modalText}>
              Your task has been submitted for review.
            </Text>
            <GradientButton
              title="Done"
              onPress={handleCloseSuccess}
              borderRadius={18}
              filled
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backText: {
    color: Colors.dark.tint,
    fontSize: 16,
    fontFamily: FontFamily.regular,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontFamily: FontFamily.semiBold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontFamily: FontFamily.semiBold,
    marginBottom: 8,
  },
  sectionDescription: {
    color: Colors.dark.tabIconDefault,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    color: "rgba(191, 191, 191, 1)",
    fontSize: 14,
    fontFamily: FontFamily.regular,
    marginBottom: 12,
  },
  proofTypeRow: {
    flexDirection: "row",
    gap: 12,
  },
  proofTypeSlot: {
    flex: 1,
  },
  textArea: {
    width: "100%",
    minHeight: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: Colors.dark.text,
    fontSize: 14,
    backgroundColor: "#2a2a2a",
    textAlignVertical: "top",
    fontFamily: FontFamily.regular,
  },
  submitSection: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#1D1D1D",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontFamily: FontFamily.semiBold,
    marginBottom: 8,
  },
  modalText: {
    color: Colors.dark.tabIconDefault,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    textAlign: "center",
    marginBottom: 24,
  },
});
