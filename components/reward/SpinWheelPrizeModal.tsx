import { LinearGradient } from "expo-linear-gradient";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface Prize {
  label?: string;
  name?: string;
  title?: string;
  prize_name?: string;
  value?: number;
  points?: number;
  xp?: number;
  xp_reward?: number;
  reward_points?: number;
  amount?: number;
  reward?: { points?: number; xp?: number; value?: number };
}

interface SpinWheelPrizeModalProps {
  visible: boolean;
  onClose: () => void;
  prize?: Prize | null;
}

export default function SpinWheelPrizeModal({
  visible,
  onClose,
  prize,
}: SpinWheelPrizeModalProps) {
  if (!prize) return null;

  const prizeLabel =
    prize.label ??
    prize.name ??
    prize.title ??
    prize.prize_name ??
    "Congratulations!";
  const prizeValue =
    prize.value ??
    prize.points ??
    prize.xp ??
    prize.xp_reward ??
    prize.reward_points ??
    prize.amount ??
    (prize.reward &&
      (prize.reward.points ?? prize.reward.xp ?? prize.reward.value)) ??
    0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          <LinearGradient
            colors={["#79008C", "#1C519D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalGradient}
          >
            <View style={styles.content}>
              <Text style={styles.title}>Congratulations!</Text>
              <Text style={styles.prizeLabel}>{prizeLabel}</Text>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>+{prizeValue}</Text>
                <Text style={styles.pointsLabel}>Points</Text>
              </View>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    maxWidth: 350,
    borderRadius: 20,
    overflow: "hidden",
  },
  modalGradient: {
    padding: 24,
    borderRadius: 20,
  },
  content: {
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 26, 0.9)",
    borderRadius: 16,
    padding: 24,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  prizeLabel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  pointsContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  pointsText: {
    color: "#FFD700",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 4,
  },
  pointsLabel: {
    color: "#C7C7C7",
    fontSize: 14,
    fontWeight: "500",
  },
  closeButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 120,
  },
  closeButtonText: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
