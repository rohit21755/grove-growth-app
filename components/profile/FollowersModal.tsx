import { FontFamily } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export interface FollowersModalProps {
  visible: boolean;
  onClose: () => void;
  count?: number;
}

export default function FollowersModal({
  visible,
  onClose,
  count = 0,
}: FollowersModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Followers</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color="#9BA1A6" />
            </Pressable>
          </View>
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
          >
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={48} color="#6B7280" />
              <Text style={styles.emptyText}>
                {count > 0
                  ? `${count} follower${count === 1 ? "" : "s"}`
                  : "No followers yet"}
              </Text>
              {count > 0 && (
                <Text style={styles.hintText}>Full list coming soon</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
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
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#3A3A3E",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: FontFamily.bold,
    color: "#FFFFFF",
  },
  list: {
    maxHeight: 400,
  },
  listContent: {
    padding: 20,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: "#6B7280",
  },
  hintText: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: "#6B7280",
    opacity: 0.8,
  },
});
