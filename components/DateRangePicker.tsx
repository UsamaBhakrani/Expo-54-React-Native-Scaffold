import React, { useState } from "react";
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
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const presets = [
    { label: "7D", days: 7 },
    { label: "30D", days: 30 },
    { label: "90D", days: 90 },
    { label: "1Y", days: 365 },
    { label: "All", days: 0 },
  ];

  const applyPreset = (days: number) => {
    setActivePreset(days);
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
    setActivePreset(null);
    onStartDateChange("");
    onEndDateChange("");
  };

  // Clear active preset when user manually edits a date via the picker
  const handleStartDateChange = (date: string) => {
    setActivePreset(null);
    onStartDateChange(date);
  };
  const handleEndDateChange = (date: string) => {
    setActivePreset(null);
    onEndDateChange(date);
  };

  const hasFilter = startDate || endDate;

  return (
    <View style={styles.container}>
      <View style={styles.presets}>
        {presets.map((p) => {
          const isActive = p.days === activePreset;
          return (
            <Pressable
              key={p.label}
              style={({ pressed }) => [
                styles.presetBtn,
                isActive && styles.presetBtnActive,
                pressed && styles.presetBtnPressed,
              ]}
              onPress={() => applyPreset(p.days)}
            >
              <Text
                style={[
                  styles.presetText,
                  isActive && styles.presetTextActive,
                ]}
              >
                {p.label}
              </Text>
            </Pressable>
          );
        })}
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
          onChange={handleStartDateChange}
          placeholder="Start date"
        />
        <DatePickerField
          compact
          label="To"
          value={endDate}
          onChange={handleEndDateChange}
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
    paddingHorizontal: uberSpacing.lg,
    paddingVertical: uberSpacing.sm,
    borderRadius: uberRounded.pill,
    backgroundColor: uberColors.canvasSoft,
  },
  presetBtnActive: { backgroundColor: uberColors.primary },
  presetBtnPressed: { opacity: 0.7 },
  presetText: {
    fontSize: uberTypography.bodySmStrong.fontSize,
    fontWeight: uberTypography.bodySmStrong.fontWeight,
    color: uberColors.body,
    fontFamily: uberTypography.bodySmStrong.fontFamily,
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
