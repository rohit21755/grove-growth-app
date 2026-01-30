import AppHeader from "@/components/app-header";
import RewardCollection from "@/components/reward/collections";
import SpinWheel from "@/components/reward/SpinWheel";
import Calendar from "@/components/task/calendar";
import { Colors } from "@/constants/theme";
import { getStreakDateStrings, useStreakApi } from "@/hooks/use-streak-api";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function RewardsScreen() {
  const { streakCheckIn } = useStreakApi();
  const [streakData, setStreakData] = useState<{
    streak_days: number;
    streak_started_at: string;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      streakCheckIn()
        .then((data) => {
          if (!cancelled && data && typeof data.streak_days === "number") {
            setStreakData({
              streak_days: data.streak_days,
              streak_started_at: data.streak_started_at ?? "",
            });
          }
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }, [streakCheckIn]),
  );

  const streakDates = useMemo(() => {
    if (!streakData?.streak_started_at || streakData.streak_days < 1) return [];
    return getStreakDateStrings(
      streakData.streak_started_at,
      streakData.streak_days,
    );
  }, [streakData?.streak_started_at, streakData?.streak_days]);

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <AppHeader type="title" title="Rewards" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <RewardCollection />
        <Calendar
          onSelectDate={(date) => {}}
          selectedDate={new Date()}
          streakDates={streakDates}
        />
        <View style={styles.wheelWrapper}>
          <SpinWheel />
        </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  wheelWrapper: {
    marginTop: 24,
    minHeight: 480,
  },
});
