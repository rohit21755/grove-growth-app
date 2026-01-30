import { GradientButton } from "@/components/ui/gradient-button";
import { Colors, FontFamily } from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const RULES_TEXT = `
Privacy & Rules for Task Submission

1. By submitting a task, you confirm that the proof (image/video) you upload is your own work and accurately represents completion of the task.

2. Submissions may be reviewed by moderators. False or misleading proof may result in rejection and could affect your account standing.

3. Do not upload content that violates community guidelines, including but not limited to: inappropriate material, copyrighted content without permission, or content that harms others.

4. Your submission data (proof and notes) will be stored and processed in accordance with our privacy policy. We use this data solely to verify task completion and improve our services.

5. You can only submit each task once. Ensure your proof is complete before submitting.
`.trim();

export default function TaskRulesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ taskId: string }>();
  const taskId = params.taskId ?? "";
  const [agreed, setAgreed] = useState(false);

  const handleProcess = () => {
    if (!agreed) {
      Alert.alert(
        "Accept required",
        "Please read and accept the privacy and rules to continue.",
      );
      return;
    }
    if (!taskId) {
      Alert.alert("Error", "Task not found.");
      return;
    }
    router.push(`/submit-task?taskId=${encodeURIComponent(taskId)}`);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Task Rules</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.rulesTitle}>Privacy & Rules</Text>
        <Text style={styles.rulesText}>{RULES_TEXT}</Text>

        <Pressable
          style={styles.checkboxRow}
          onPress={() => setAgreed((prev) => !prev)}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I have read and agree to the privacy policy and submission rules
          </Text>
        </Pressable>

        <View style={styles.buttonSection}>
          <GradientButton
            title="Process"
            onPress={handleProcess}
            borderRadius={18}
          />
        </View>
      </ScrollView>
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
  rulesTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontFamily: FontFamily.semiBold,
    marginBottom: 16,
  },
  rulesText: {
    color: Colors.dark.tabIconDefault,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    lineHeight: 22,
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.dark.tabIconDefault,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    borderColor: Colors.dark.tint,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  checkmark: {
    color: Colors.dark.tint,
    fontSize: 14,
    fontWeight: "700",
  },
  checkboxLabel: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  buttonSection: {
    marginTop: 8,
  },
});
