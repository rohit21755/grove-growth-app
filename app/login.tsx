import { GenericInput } from "@/components/ui/generic-input";
import { GradientButton } from "@/components/ui/gradient-button";
import { Colors, FontFamily } from "@/constants/theme";
import { ApiError, useApi } from "@/contexts/api-context";
import { useAuthApi } from "@/hooks/use-auth-api";
import { useAuthStore } from "@/store/auth-store";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function LoginScreen() {
  const { login } = useAuthApi();
  const { setAuth } = useAuthStore();
  const api = useApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await login({ email: email.trim(), password });

      await setAuth(response.token, response.user);
      api.setAuthToken(response.token);

      router.replace("/(tabs)");
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage =
        typeof apiError.data === "string"
          ? apiError.data
          : apiError.message || "Invalid email or password";
      setError(errorMessage);
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, login, setAuth, api]);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  return (
    <View style={[styles.screen, { backgroundColor: Colors.dark.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>Log in</Text>
          <Text style={styles.subtitle}>
            Use your email and password to sign in
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <GenericInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <GenericInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <GradientButton
            title={isSubmitting ? "Signing in..." : "Log in"}
            onPress={handleLogin}
            borderRadius={18}
            disabled={!canSubmit || isSubmitting}
          />
          <Pressable
            onPress={() => router.push("/register")}
            style={styles.registerLink}
          >
            <Text style={styles.registerLinkText}>
              Don't have an account? Register
            </Text>
          </Pressable>
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
    paddingBottom: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
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
  subtitle: {
    color: "#9BA1A6",
    fontSize: 14,
    marginTop: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  form: {
    paddingTop: 8,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    fontFamily: FontFamily.regular,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 16,
  },
  registerLink: {
    alignSelf: "center",
    paddingVertical: 8,
  },
  registerLinkText: {
    color: "#9BA1A6",
    fontSize: 14,
  },
});
