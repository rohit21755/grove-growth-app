import { FontFamily } from "@/constants/theme";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export interface ProfileActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onCopyLink?: () => void;
  onShareProfile?: () => void;
  onAddReferral?: () => void;
  /** Upload resume – shown when user has no resume */
  onUploadResume?: () => void;
  /** Resume – view/resume, shown when user has resume */
  onResume?: () => void;
  /** Update resume – shown when user has resume */
  onUpdateResume?: () => void;
  /** Whether user has uploaded a resume */
  hasResume?: boolean;
}

export default function ProfileActionSheet({
  visible,
  onClose,
  onCopyLink,
  onShareProfile,
  onAddReferral,
  onUploadResume,
  onResume,
  onUpdateResume,
  hasResume = false,
}: ProfileActionSheetProps) {
  const handleAction = (action?: () => void) => {
    if (action) {
      action();
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
            <Pressable
              style={styles.option}
              onPress={() => handleAction(onCopyLink)}
            >
              <Text style={styles.optionText}>Copy link</Text>
            </Pressable>
            <Pressable
              style={styles.option}
              onPress={() => handleAction(onShareProfile)}
            >
              <Text style={styles.optionText}>Share profile</Text>
            </Pressable>
            <Pressable
              style={styles.option}
              onPress={() => handleAction(onAddReferral)}
            >
              <Text style={styles.optionText}>Add referral</Text>
            </Pressable>
            {hasResume ? (
              <>
                <Pressable
                  style={styles.option}
                  onPress={() => handleAction(onResume)}
                >
                  <Text style={styles.optionText}>Resume</Text>
                </Pressable>
                <Pressable
                  style={styles.option}
                  onPress={() => handleAction(onUpdateResume)}
                >
                  <Text style={styles.optionText}>Update resume</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                style={styles.option}
                onPress={() => handleAction(onUploadResume)}
              >
                <Text style={styles.optionText}>Upload resume</Text>
              </Pressable>
            )}
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
