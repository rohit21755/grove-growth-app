import AppHeader from "@/components/app-header";
import ProfileActivity from "@/components/profile/activity";
import Collectibles from "@/components/profile/Collectibles";
import ProfileHeader from "@/components/profile/header";
import ProfileActionSheet from "@/components/profile/ProfileActionSheet";
import Refferals from "@/components/profile/refferals";
import SettingsModal from "@/components/profile/SettingsModal";
import SegmentedSwitch from "@/components/segment-switch";
import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  const { user, isAuthenticated, initialized, clearAuth } = useAuthStore();
  const [selected, setSelected] = useState<
    "Activity" | "Collectibles" | "Refferals"
  >("Activity");
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const displayName = user?.name ?? "User";
  const avatar = user?.email
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3958A1&color=fff`
    : "";

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/");
    }
  }, [initialized, isAuthenticated]);

  const handleLogout = async () => {
    await clearAuth();
    router.replace("/");
  };

  if (!initialized || !isAuthenticated) {
    return null;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <AppHeader
        type="title"
        title="Profile"
        onSettings={() => setSettingsModalVisible(true)}
        onMore={() => setActionSheetVisible(true)}
      />
      <View style={styles.content}>
        <ProfileHeader
          avatar={avatar}
          username={displayName}
          followers={100}
          following={100}
          onAddBio={() => {}}
          onSettings={() => setSettingsModalVisible(true)}
          onMore={() => setActionSheetVisible(true)}
        />
        <View style={styles.segmentWrapper}>
          <SegmentedSwitch
            list={["Activity", "Collectibles", "Refferals"]}
            selected={selected}
            onSelected={(value) =>
              setSelected(value as "Activity" | "Collectibles" | "Refferals")
            }
          />
        </View>
        <View style={styles.panel}>
          <ScrollView
            style={styles.panelScroll}
            contentContainerStyle={styles.panelScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {selected === "Activity" && <ProfileActivity />}
            {selected === "Collectibles" && <Collectibles />}
            {selected === "Refferals" && <Refferals />}
          </ScrollView>
        </View>
      </View>

      <ProfileActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        onCopyLink={() => {}}
        onShareProfile={() => {}}
        onAddReferral={() => {}}
        onEditInfo={() => {}}
        onResumes={() => {}}
      />
      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        onLogout={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  content: {
    marginTop: 48,
    padding: 16,
    flex: 1,
  },
  segmentWrapper: {
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  panel: {
    marginTop: 12,
    flex: 1,
  },
  panelScroll: {
    flex: 1,
  },
  panelScrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});
