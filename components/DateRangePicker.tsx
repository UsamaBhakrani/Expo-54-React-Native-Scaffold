import { Pressable, StyleSheet, Text, View } from "react-native";

import DatePickerField from "@/components/DatePickerField";

type Props = {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
};

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  const presets = [
    { label: "7D", days: 7 },
    { label: "30D", days: 30 },
    { label: "90D", days: 90 },
    { label: "1Y", days: 365 },
    { label: "All", days: 0 },
  ];

  const applyPreset = (days: number) => {
    if (days === 0) {
      onStartDateChange("");
      onEndDateChange("");
      return;
    }
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onStartDateChange(start.toISOString().slice(0, 10));
    onEndDateChange(end.toISOString().slice(0, 10));
  };

  const clearFilter = () => {
    onStartDateChange("");
    onEndDateChange("");
  };

  const hasFilter = startDate || endDate;

  return (
    <View style={styles.container}>
      <View style={styles.presets}>
        {presets.map((p) => (
          <Pressable
            key={p.label}
            style={[
              styles.presetBtn,
              p.label === "All" && !hasFilter && styles.presetBtnActive,
            ]}
            onPress={() => applyPreset(p.days)}
          >
            <Text
              style={[
                styles.presetText,
                p.label === "All" && !hasFilter && styles.presetTextActive,
              ]}
            >
              {p.label}
            </Text>
          </Pressable>
        ))}
        {hasFilter ? (
          <Pressable style={styles.clearBtn} onPress={clearFilter}>
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.inputRow}>
        <DatePickerField
          label="From"
          value={startDate}
          onChange={onStartDateChange}
          placeholder="Start date"
        />
        <DatePickerField
          label="To"
          value={endDate}
          onChange={onEndDateChange}
          placeholder="End date"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  presets: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  presetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  presetBtnActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  presetText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  presetTextActive: {
    color: "#fff",
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "700",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: "monospace",
    backgroundColor: "#fff",
  },
});
