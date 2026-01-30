import { FontFamily } from "@/constants/theme";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export default function SettingsModal({
  visible,
  onClose,
  onLogout,
}: SettingsModalProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <View style={styles.optionsContainer}>
            <Pressable style={styles.option} onPress={handleLogout}>
              <Text style={styles.optionText}>Logout</Text>
            </Pressable>
            <Pressable style={styles.cancelOption} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 0,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  optionsContainer: {
    paddingHorizontal: 0,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FontFamily.bold,
    textAlign: "center",
  },
  cancelOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "#A855F7",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FontFamily.bold,
    textAlign: "center",
  },
});
