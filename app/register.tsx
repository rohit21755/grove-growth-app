import Dropdown from "@/components/ui/dropdown";
import { FileUpload } from "@/components/ui/file-upload";
import { GenericInput } from "@/components/ui/generic-input";
import { GradientButton } from "@/components/ui/gradient-button";
import { InputPlaceholder } from "@/components/ui/input-placeholder";
import { Colors, FontFamily } from "@/constants/theme";
import { ApiError, useApi } from "@/contexts/api-context";
import { useAuthApi } from "@/hooks/use-auth-api";
import { useCollegesQuery, useStatesQuery } from "@/hooks/use-states-api";
import { useAuthStore } from "@/store/auth-store";
import type { College, State } from "@/types/states";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function RegisterScreen() {
  const { register } = useAuthApi();
  const { setAuth } = useAuthStore();
  const api = useApi();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: state (first dropdown) and college (second dropdown)
  const [stateId, setStateId] = useState<string | null>(null);
  const [collegeId, setCollegeId] = useState<string | null>(null);

  const { data: states = [], isLoading: statesLoading } = useStatesQuery({
    enabled: step === 2,
  });
  const stateOptions = useMemo(
    () => states.map((s: State) => ({ label: s.name, value: s.id })),
    [states],
  );

  const { data: colleges = [], isLoading: collegesLoading } = useCollegesQuery(
    stateId,
    { enabled: !!stateId?.trim() },
  );
  const collegeOptions = useMemo(
    () => colleges.map((c: College) => ({ label: c.name, value: c.id })),
    [colleges],
  );

  // Clear college when state changes
  useEffect(() => {
    setCollegeId(null);
  }, [stateId]);

  // Step 3 (optional)
  const [referralCode, setReferralCode] = useState("");
  const [resumeFile, setResumeFile] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const goNext = useCallback(() => {
    if (step < 3) setStep(step + 1);
  }, [step]);

  const goPrevious = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const handleStateSelect = useCallback((id: string) => {
    setStateId(id);
    setCollegeId(null);
  }, []);

  const handleUploadResume = () => {
    // TODO: integrate expo-document-picker
    // For now, placeholder - replace with actual file picker
    setResumeFile({
      uri: "file://placeholder.pdf",
      name: "Resume.pdf",
      type: "application/pdf",
    });
  };

  const handleUploadProfilePic = () => {
    // TODO: integrate expo-image-picker
    // For now, placeholder - replace with actual image picker
    setProfilePicFile({
      uri: "https://via.placeholder.com/400",
      name: "profile.jpg",
      type: "image/jpeg",
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!stateId || !collegeId) {
      setError("Please select state and college");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        state_id: stateId,
        college_id: collegeId,
        referral_code: referralCode.trim() || undefined,
        resume: resumeFile,
        profile_pic: profilePicFile,
      });

      // Update auth store and API context
      await setAuth(response.token, response.user);
      api.setAuthToken(response.token);

      // Navigate to home/dashboard
      router.replace("/(tabs)");
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage =
        typeof apiError.data === "string"
          ? apiError.data
          : apiError.message || "Registration failed. Please try again.";
      setError(errorMessage);
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    name,
    email,
    password,
    stateId,
    collegeId,
    referralCode,
    resumeFile,
    profilePicFile,
    register,
    setAuth,
    api,
  ]);

  const passwordsMatch = password === confirmPassword;
  const canStep1Next =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    passwordsMatch;
  const canStep2Next = Boolean(stateId && collegeId);
  const isNextDisabled =
    (step === 1 && !canStep1Next) || (step === 2 && !canStep2Next);

  return (
    <View style={[styles.screen, { backgroundColor: Colors.dark.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          {/* <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>Register</Text> */}
          <Text style={styles.stepIndicator}>Step {step} of 3</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && (
            <View style={styles.step}>
              <GenericInput
                label="Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
              <GenericInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <GenericInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <GenericInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <Text style={styles.errorText}>Passwords do not match</Text>
              )}
            </View>
          )}

          {step === 2 && (
            <View style={styles.step}>
              {statesLoading ? (
                <InputPlaceholder label="State" />
              ) : (
                <Dropdown
                  label="State"
                  placeholder="Select your state"
                  options={stateOptions}
                  value={stateId}
                  onSelect={handleStateSelect}
                />
              )}
              {collegesLoading ? (
                <InputPlaceholder label="College" />
              ) : (
                <Dropdown
                  label="College"
                  placeholder={
                    stateId ? "Select your college" : "Select a state first"
                  }
                  options={collegeOptions}
                  value={collegeId}
                  onSelect={setCollegeId}
                />
              )}
            </View>
          )}

          {step === 3 && (
            <View style={styles.step}>
              <Text style={styles.optionalHint}>(Optional)</Text>
              <GenericInput
                label="Referral code"
                placeholder="Enter referral code if you have one"
                value={referralCode}
                onChangeText={setReferralCode}
              />
              <FileUpload
                label="Resume"
                fileName={resumeFile?.name ?? null}
                onPress={handleUploadResume}
                type="document"
              />
              <FileUpload
                label="Profile Picture"
                fileName={profilePicFile?.name ?? null}
                imageUri={profilePicFile?.uri ?? null}
                onPress={handleUploadProfilePic}
                type="image"
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <View style={styles.buttonSlot}>
              <GradientButton
                title={step === 1 ? "Back" : "Previous"}
                onPress={step === 1 ? () => router.back() : goPrevious}
                borderRadius={18}
              />
            </View>
            <View style={styles.buttonSlot}>
              <GradientButton
                title={
                  step === 3
                    ? isSubmitting
                      ? "Submitting..."
                      : "Submit"
                    : "Next"
                }
                onPress={step === 3 ? handleSubmit : goNext}
                borderRadius={18}
                disabled={isNextDisabled || isSubmitting}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  backText: {
    color: "#9BA1A6",
    fontSize: 16,
  },
  title: {
    color: "#ECEDEE",
    fontSize: 24,
    fontWeight: "700",
  },
  stepIndicator: {
    color: "#9BA1A6",
    fontSize: 14,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  step: {
    paddingTop: 8,
  },
  optionalHint: {
    color: "#9BA1A6",
    fontSize: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: -16,
    marginBottom: 8,
    fontFamily: FontFamily.regular,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  buttonSlot: {
    flex: 1,
  },
});
