import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Monday = 0, Sunday = 6 */
function getDayIndex(date: Date): number {
  const day = date.getDay(); // Sun=0, Mon=1, ..., Sat=6
  return day === 0 ? 6 : day - 1;
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = getDayIndex(d);
  d.setDate(d.getDate() - diff);
  return d;
}

/** All dates to show in the calendar grid: from Monday of first week to Sunday of last week */
function getCalendarDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startMonday = getMondayOfWeek(first);
  const endSunday = getMondayOfWeek(last);
  endSunday.setDate(endSunday.getDate() + 6);

  const days: (Date | null)[] = [];
  const cursor = new Date(startMonday);

  while (cursor <= endSunday) {
    const d = new Date(cursor);
    days.push(d);
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isCurrentMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Format date as YYYY-MM-DD for streak set lookup */
function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export type CalendarProps = {
  /** Called when user selects a date */
  onSelectDate?: (date: Date) => void;
  /** Optional controlled selected date */
  selectedDate?: Date | null;
  /** Set of dates (YYYY-MM-DD) that are part of the streak – will be marked on the calendar */
  streakDates?: Set<string> | string[];
};

export default function Calendar({
  onSelectDate,
  selectedDate: controlledSelected,
  streakDates = [],
}: CalendarProps) {
  const now = useMemo(() => new Date(), []);
  const viewDate = useMemo(
    () => new Date(now.getFullYear(), now.getMonth(), 1),
    [now.getFullYear(), now.getMonth()],
  );
  const [internalSelected, setInternalSelected] = useState<Date | null>(null);

  const selectedDate =
    controlledSelected !== undefined ? controlledSelected : internalSelected;

  const streakSet = useMemo(() => {
    if (Array.isArray(streakDates)) return new Set(streakDates);
    return streakDates;
  }, [streakDates]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const calendarDays = useMemo(
    () => getCalendarDays(year, month),
    [year, month],
  );
  const rows = useMemo(() => {
    const r: (Date | null)[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      r.push(calendarDays.slice(i, i + 7));
    }
    return r;
  }, [calendarDays]);
  const today = useMemo(() => new Date(), []);

  const handlePress = (date: Date) => {
    const next = new Date(date);
    if (controlledSelected === undefined) {
      setInternalSelected(next);
    }
    onSelectDate?.(next);
  };

  return (
    <View style={styles.container}>
      {/* Month header – current month only, no navigation */}
      <View style={styles.header}>
        <Text style={styles.monthTitle}>
          {MONTH_NAMES[month]} {year}
        </Text>
      </View>

      {/* Day headers */}
      <View style={styles.dayHeaderRow}>
        {DAY_HEADERS.map((day) => (
          <View key={day} style={styles.dayHeaderCell}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Grid: rows of 7 days */}
      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((date, colIndex) => {
              if (!date) {
                return (
                  <View
                    key={`empty-${rowIndex}-${colIndex}`}
                    style={styles.cell}
                  />
                );
              }
              const isSelected = selectedDate
                ? isSameDay(date, selectedDate)
                : false;
              const isToday = isSameDay(date, today);
              const isOtherMonth = !isCurrentMonth(date, year, month);
              const isStreakDay = streakSet.has(toYMD(date));

              return (
                <TouchableOpacity
                  key={date.toISOString()}
                  style={styles.cell}
                  onPress={() => handlePress(date)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.dateCircle,
                      isSelected && styles.activeCircle,
                      isStreakDay && !isSelected && styles.streakCircle,
                      isToday &&
                        !isSelected &&
                        !isStreakDay &&
                        styles.todayCircle,
                      isToday &&
                        !isSelected &&
                        isStreakDay &&
                        styles.todayBorderOnly,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        isOtherMonth && styles.otherMonthText,
                        isSelected && styles.activeDateText,
                        isStreakDay && !isSelected && styles.streakDateText,
                        isToday &&
                          !isSelected &&
                          !isOtherMonth &&
                          !isStreakDay &&
                          styles.todayText,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  dayHeaderRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: "center",
  },
  dayHeaderText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  grid: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  dateCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F2933",
  },
  activeCircle: {
    backgroundColor: "#6D5FFD",
  },
  todayCircle: {
    borderWidth: 1.5,
    borderColor: "#6D5FFD",
    backgroundColor: "transparent",
  },
  todayBorderOnly: {
    borderWidth: 1.5,
    borderColor: "#6D5FFD",
  },
  streakCircle: {
    backgroundColor: "#668863",
  },
  streakDateText: {
    color: "#FFFFFF",
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
  otherMonthText: {
    color: "#6B7280",
  },
  todayText: {
    color: "#E5E7EB",
  },
});
