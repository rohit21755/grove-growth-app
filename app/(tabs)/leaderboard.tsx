import AppHeader from "@/components/app-header";
import ProfileStats from "@/components/profile-stats";
import RankItem from "@/components/rank-item";
import Dropdown from "@/components/ui/dropdown";
import { Colors, FontFamily } from "@/constants/theme";
import {
  useLeaderboardQuery,
  type LeaderboardFilter,
  type LeaderboardPeriod,
} from "@/hooks/use-leaderboard-api";
import { useAuthStore } from "@/store/auth-store";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=user";
const XP_PER_LEVEL = 2000;

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "State", value: "state" },
  { label: "College", value: "college" },
] as const;

const PERIOD_OPTIONS = [
  { label: "All time", value: "all" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
] as const;

export default function LeaderboardScreen() {
  const user = useAuthStore((s) => s.user);
  const xp = user?.xp ?? 0;
  const levelProgress = Math.min(100, (xp / XP_PER_LEVEL) * 100);

  const [filter, setFilter] = useState<LeaderboardFilter>("all");
  const [period, setPeriod] = useState<LeaderboardPeriod>("all");

  const {
    data: leaderboardData,
    isLoading,
    isError,
    refetch,
  } = useLeaderboardQuery({
    filter,
    period,
    stateId: filter === "state" ? (user?.state_id ?? null) : null,
    collegeId: filter === "college" ? (user?.college_id ?? null) : null,
    enabled:
      filter === "all" ||
      (filter === "state" && !!user?.state_id) ||
      (filter === "college" && !!user?.college_id),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const entries: LeaderboardEntry[] = leaderboardData?.entries ?? [];
  const myEntry = useMemo(
    () => (user?.id ? entries.find((e) => e.id === user.id) : null),
    [entries, user?.id],
  );
  const rankDisplay = myEntry ? String(myEntry.rank) : "—";

  useEffect(() => {
    console.log("Leaderboard entire", {
      filter,
      period,
      userStateId: user?.state_id,
      userCollegeId: user?.college_id,
      isLoading,
      isError,
      leaderboardData,
      entries,
      myEntry,
      rankDisplay,
    });
  }, [
    filter,
    period,
    user?.state_id,
    user?.college_id,
    isLoading,
    isError,
    leaderboardData,
    entries,
    myEntry,
    rankDisplay,
  ]);

  const onFilterSelect = (value: string) => {
    setFilter(value as LeaderboardFilter);
  };

  const onPeriodSelect = (value: string) => {
    setPeriod(value as LeaderboardPeriod);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <AppHeader type="title" title="Leaderboard" />
      <ProfileStats
        avatar={user?.avatar_url ?? DEFAULT_AVATAR}
        points={xp}
        username={user?.name ?? "You"}
        rank={rankDisplay}
        level={user?.level ?? 1}
        levelProgress={levelProgress}
      />

      <View style={styles.filtersRow}>
        <Dropdown
          label="Filter"
          placeholder="Select filter"
          options={[...FILTER_OPTIONS]}
          value={filter}
          onSelect={onFilterSelect}
        />
        <Dropdown
          label="Period"
          placeholder="Select period"
          options={[...PERIOD_OPTIONS]}
          value={period}
          onSelect={onPeriodSelect}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.dark.tint} />
            <Text style={styles.loadingText}>Loading leaderboard...</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Couldn't load leaderboard</Text>
            <Text style={styles.retryText} onPress={() => refetch()}>
              Retry
            </Text>
          </View>
        ) : filter === "state" && !user?.state_id ? (
          <Text style={styles.emptyText}>Your state is not set</Text>
        ) : filter === "college" && !user?.college_id ? (
          <Text style={styles.emptyText}>Your college is not set</Text>
        ) : entries.length === 0 ? (
          <Text style={styles.emptyText}>No entries yet</Text>
        ) : (
          entries.map((entry) => (
            <RankItem
              key={entry.id}
              avatar={entry.profile_image ?? DEFAULT_AVATAR}
              name={entry.name}
              points={entry.xp}
              level={entry.level ?? 1}
              rank={entry.rank}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  filtersRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    flexWrap: "wrap",
  },
  scroll: {
    flex: 1,
    marginTop: 16,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  errorContainer: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
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
  emptyText: {
    color: Colors.dark.tabIconDefault,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
});
