import AppHeader from "@/components/app-header";
import Collectibles from "@/components/profile/Collectibles";
import FollowersModal from "@/components/profile/FollowersModal";
import FollowingModal from "@/components/profile/FollowingModal";
import ProfileHeader from "@/components/profile/header";
import Refferals from "@/components/profile/refferals";
import UserActivity from "@/components/profile/UserActivity";
import SegmentedSwitch from "@/components/segment-switch";
import { GradientButton } from "@/components/ui/gradient-button";
import { Colors, FontFamily } from "@/constants/theme";
import { useUserProfileApi } from "@/hooks/use-user-profile-api";
import { useAuthStore } from "@/store/auth-store";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = id ?? "";

  const currentUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const initialized = useAuthStore((s) => s.initialized);

  const [selected, setSelected] = useState<
    "Activity" | "Collectibles" | "Refferals"
  >("Activity");
  const [profile, setProfile] = useState<Awaited<
    ReturnType<ReturnType<typeof useUserProfileApi>["getUser"]>
  > | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const [followingModalVisible, setFollowingModalVisible] = useState(false);

  const { getUser, followUser, unfollowUser } = useUserProfileApi();

  const loadProfile = useCallback(async () => {
    if (!userId?.trim()) return null;
    setProfileLoaded(false);
    const data = await getUser(userId);
    setProfile(data);
    setProfileLoaded(true);
    if (data?.is_following !== undefined) {
      setIsFollowing(Boolean(data.is_following));
    }
    return data;
  }, [userId, getUser]);

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/");
    }
  }, [initialized, isAuthenticated, router]);

  useEffect(() => {
    if (userId?.trim()) {
      setProfile(null);
      loadProfile();
    }
  }, [userId, loadProfile]);

  useFocusEffect(
    useCallback(() => {
      if (userId?.trim() && profileLoaded) {
        loadProfile();
      }
    }, [userId, profileLoaded, loadProfile]),
  );

  const handleFollow = async () => {
    if (!userId?.trim() || isFollowLoading) return;
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        const res = await unfollowUser(userId);
        if (res) {
          setIsFollowing(false);
          loadProfile();
        } else {
          Alert.alert("Error", "Failed to unfollow.");
        }
      } else {
        const res = await followUser(userId);
        if (res) {
          setIsFollowing(true);
          loadProfile();
        } else {
          Alert.alert("Error", "Failed to follow.");
        }
      }
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (!initialized || !isAuthenticated) {
    return null;
  }

  if (!userId?.trim()) {
    return (
      <View
        style={[styles.container, { backgroundColor: Colors.dark.background }]}
      >
        <AppHeader type="title" title="Profile" />
        <View style={styles.center}>
          <Text style={styles.errorText}>Invalid user</Text>
        </View>
      </View>
    );
  }

  const user = profile?.user;
  const displayName = user?.name ?? "User";
  const profileError = profileLoaded && !user;
  const avatar =
    typeof user?.avatar_url === "string" && user.avatar_url.trim()
      ? user.avatar_url
      : null;
  const followersCount = profile?.followers_count ?? 0;
  const followingCount = profile?.following_count ?? 0;
  const completedTasks = profile?.completed_tasks ?? [];
  const isOwnProfile = currentUser?.id === userId;

  if (profileError) {
    return (
      <View
        style={[styles.container, { backgroundColor: Colors.dark.background }]}
      >
        <AppHeader type="title" title="Profile" />
        <View style={styles.center}>
          <Text style={styles.errorText}>User not found</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.retryText}>Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!profileLoaded || !profile) {
    return (
      <View
        style={[styles.container, { backgroundColor: Colors.dark.background }]}
      >
        <AppHeader type="title" title="Profile" />
        <View style={styles.center}>
          <ActivityIndicator size="small" color={Colors.dark.tint} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <AppHeader type="title" title={displayName} />
      <View style={styles.content}>
        <ProfileHeader
          avatar={avatar ?? undefined}
          username={displayName}
          followers={followersCount}
          following={followingCount}
          stateName={user?.state_name}
          collegeName={user?.college_name ?? profile?.college_name}
          onFollowersPress={() => setFollowersModalVisible(true)}
          onFollowingPress={() => setFollowingModalVisible(true)}
        />

        {!isOwnProfile && (
          <View style={styles.followBtn}>
            <GradientButton
              title={isFollowing ? "Following" : "Follow"}
              onPress={handleFollow}
              borderRadius={12}
              disabled={isFollowLoading}
            />
          </View>
        )}

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
          >
            {selected === "Activity" && (
              <UserActivity completedTasks={completedTasks} />
            )}
            {selected === "Collectibles" && <Collectibles />}
            {selected === "Refferals" && <Refferals />}
          </ScrollView>
        </View>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  content: {
    marginTop: 24,
    padding: 16,
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  errorText: {
    color: Colors.dark.tabIconDefault,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  retryText: {
    color: Colors.dark.tint,
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
  },
  followBtn: {
    marginTop: 16,
    marginBottom: 8,
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
