import { FontFamily } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export interface AddReferralModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (email: string) => void;
}

export default function AddReferralModal({
  visible,
  onClose,
  onSubmit,
}: AddReferralModalProps) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (visible) setEmail("");
  }, [visible]);

  const handleSubmit = () => {
    onSubmit?.(email.trim());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>Add referral</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color="#9BA1A6" />
            </Pressable>
          </View>
          <Text style={styles.hint}>
            Enter the email of the person you want to refer
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#6B7280"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
          <Pressable style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Send invite</Text>
          </Pressable>
        </Pressable>
      </Pressable>
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
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#2A2A2D",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: FontFamily.regular,
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: "#6D5FFD",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FontFamily.semiBold,
  },
});
