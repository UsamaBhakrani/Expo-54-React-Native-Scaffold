import { Pressable, StyleSheet, Text, View } from "react-native";

import DatePickerField from "@/components/DatePickerField";
import {
  uberColors,
  uberRounded,
  uberSpacing,
  uberTypography,
} from "@/constants/theme";

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
            style={({ pressed }) => [
              styles.presetBtn,
              p.label === "All" && !hasFilter && styles.presetBtnActive,
              pressed && styles.presetBtnPressed,
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
          <Pressable
            style={({ pressed }) => [styles.clearBtn, pressed && styles.clearBtnPressed]}
            onPress={clearFilter}
          >
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.inputRow}>
        <DatePickerField
          compact
          label="From"
          value={startDate}
          onChange={onStartDateChange}
          placeholder="Start date"
        />
        <DatePickerField
          compact
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
  container: { gap: uberSpacing.sm },
  presets: { flexDirection: "row", gap: uberSpacing.xs, alignItems: "center" },
  presetBtn: {
    paddingHorizontal: uberSpacing.md,
    paddingVertical: uberSpacing.xs,
    borderRadius: uberRounded.pill,
    backgroundColor: uberColors.canvasSoft,
  },
  presetBtnActive: { backgroundColor: uberColors.primary },
  presetBtnPressed: { opacity: 0.7 },
  presetText: {
    fontSize: uberTypography.caption.fontSize,
    fontWeight: "600",
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
  },
  presetTextActive: { color: uberColors.onPrimary },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: uberRounded.full,
    backgroundColor: uberColors.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtnPressed: { backgroundColor: uberColors.surfacePressed },
  clearText: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.ink,
    fontWeight: "700",
  },
  inputRow: { flexDirection: "column", gap: uberSpacing.md },
});
