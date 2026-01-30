import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Monday = 0, Sunday = 6 */
function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // Sun=0, Mon=1, ..., Sat=6
  const diff = day === 0 ? -6 : 1 - day; // Monday is 1
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDates(monday: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

/** Index of today in Mon..Sun (0–6) */
function getTodayIndex(): number {
  const today = new Date();
  const day = today.getDay(); // Sun=0, Mon=1, ..., Sat=6
  return day === 0 ? 6 : day - 1; // Mon=0, Tue=1, ..., Sun=6
}

export default function WeeklyDateSelector({
  startDate,
}: {
  startDate?: Date;
}) {
  const monday = useMemo(
    () =>
      startDate ? getMondayOfWeek(startDate) : getMondayOfWeek(new Date()),
    [startDate],
  );
  const weekDates = useMemo(() => getWeekDates(monday), [monday]);
  const todayIndex = useMemo(() => getTodayIndex(), []);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(todayIndex);

  const handlePress = (index: number) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <View style={styles.container}>
      {weekDates.map((date, index) => {
        const isSelected = selectedIndex !== null && index === selectedIndex;

        return (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => handlePress(index)}
          >
            <Text style={styles.dayText}>{DAYS[index]}</Text>

            <View
              style={[styles.dateCircle, isSelected && styles.activeCircle]}
            >
              <Text
                style={[styles.dateText, isSelected && styles.activeDateText]}
              >
                {date.getDate()}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  item: {
    alignItems: "center",
    gap: 6,
  },
  dayText: {
    fontSize: 12,
    color: "#9CA3AF", // gray
  },
  dateCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F2933", // dark background
  },
  activeCircle: {
    backgroundColor: "#6D5FFD", // purple
  },
  dateText: {
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "500",
  },
  activeDateText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
