import AppHeader from "@/components/app-header";
import ProfileActivity from "@/components/profile/activity";
import AddReferralModal from "@/components/profile/AddReferralModal";
import Collectibles from "@/components/profile/Collectibles";
import FollowersModal from "@/components/profile/FollowersModal";
import FollowingModal from "@/components/profile/FollowingModal";
import ProfileHeader from "@/components/profile/header";
import ProfileActionSheet from "@/components/profile/ProfileActionSheet";
import Refferals from "@/components/profile/refferals";
import SettingsModal from "@/components/profile/SettingsModal";
import UploadResumeModal from "@/components/profile/UploadResumeModal";
import SegmentedSwitch from "@/components/segment-switch";
import { Colors } from "@/constants/theme";
import { useUserApi } from "@/hooks/use-user-api";
import { useUserFilesApi } from "@/hooks/use-user-files-api";
import { useUserProfileApi } from "@/hooks/use-user-profile-api";
import { useAuthStore } from "@/store/auth-store";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const initialized = useAuthStore((s) => s.initialized);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [selected, setSelected] = useState<
    "Activity" | "Collectibles" | "Refferals"
  >("Activity");
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [addReferralVisible, setAddReferralVisible] = useState(false);
  const [uploadResumeModalVisible, setUploadResumeModalVisible] =
    useState(false);
  const [uploadResumeIsUpdate, setUploadResumeIsUpdate] = useState(false);
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const [followingModalVisible, setFollowingModalVisible] = useState(false);

  const { getMe } = useUserApi();
  const { getUser } = useUserProfileApi();
  const { uploadResume, updateResume, uploadProfilePic, updateProfilePic } =
    useUserFilesApi({
      onUserUpdate: (u) => updateUser(u),
    });

  const displayName = user?.name ?? "User";
  const avatar =
    typeof user?.avatar_url === "string" && user.avatar_url.trim()
      ? user.avatar_url
      : null;
  const hasResume = Boolean(
    typeof user?.resume_url === "string" && user.resume_url.trim(),
  );
  const hasProfilePic = Boolean(
    typeof user?.avatar_url === "string" && user.avatar_url.trim(),
  );
  const followersCount =
    typeof user?.followers_count === "number" ? user.followers_count : 0;
  const followingCount =
    typeof user?.following_count === "number" ? user.following_count : 0;

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/");
    }
  }, [initialized, isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated || !user?.id) return;
      getMe().then((u) => u && updateUser(u));
      getUser(user.id).then((profile) => {
        const current = useAuthStore.getState().user;
        if (!profile || !current) return;
        const updates: Record<string, unknown> = {};
        if (typeof profile.followers_count === "number")
          updates.followers_count = profile.followers_count;
        if (typeof profile.following_count === "number")
          updates.following_count = profile.following_count;
        if (Object.keys(updates).length > 0) {
          updateUser({ ...current, ...updates });
        }
      });
    }, [isAuthenticated, user?.id, getMe, getUser, updateUser]),
  );

  const handleLogout = async () => {
    await clearAuth();
    router.replace("/");
  };

  const handleViewResume = () => {
    const url = typeof user?.resume_url === "string" ? user.resume_url : "";
    if (url) WebBrowser.openBrowserAsync(url);
    else Alert.alert("Error", "No resume found.");
  };

  const handlePickProfilePic = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access your photos is required.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    const payload = {
      uri: asset.uri,
      name: asset.fileName ?? "profile.jpg",
      type: asset.mimeType ?? "image/jpeg",
    };
    const updated = hasProfilePic
      ? await updateProfilePic(payload)
      : await uploadProfilePic(payload);
    if (updated) {
      Alert.alert("Success", "Profile picture updated.");
    } else {
      Alert.alert("Error", "Failed to update profile picture.");
    }
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
          followers={followersCount}
          following={followingCount}
          stateName={user?.state_name as string | undefined}
          collegeName={user?.college_name as string | undefined}
          onAvatarPress={handlePickProfilePic}
          onFollowersPress={() => setFollowersModalVisible(true)}
          onFollowingPress={() => setFollowingModalVisible(true)}
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
        onAddReferral={() => {
          setActionSheetVisible(false);
          setAddReferralVisible(true);
        }}
        hasResume={hasResume}
        onUploadResume={() => {
          setActionSheetVisible(false);
          setUploadResumeIsUpdate(false);
          setUploadResumeModalVisible(true);
        }}
        onResume={() => {
          setActionSheetVisible(false);
          handleViewResume();
        }}
        onUpdateResume={() => {
          setActionSheetVisible(false);
          setUploadResumeIsUpdate(true);
          setUploadResumeModalVisible(true);
        }}
      />

      <AddReferralModal
        visible={addReferralVisible}
        onClose={() => setAddReferralVisible(false)}
        onSubmit={(email) => {
          console.log("Add referral email:", email);
        }}
      />

      <UploadResumeModal
        visible={uploadResumeModalVisible}
        onClose={() => setUploadResumeModalVisible(false)}
        onUpload={uploadResume}
        onUpdate={updateResume}
        isUpdate={uploadResumeIsUpdate}
      />

      <FollowersModal
        visible={followersModalVisible}
        onClose={() => setFollowersModalVisible(false)}
        count={followersCount}
      />

      <FollowingModal
        visible={followingModalVisible}
        onClose={() => setFollowingModalVisible(false)}
        count={followingCount}
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
