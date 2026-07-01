import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { uberColors, uberRounded, uberShadows, uberSpacing, uberTypography } from "@/constants/theme";

type DatePickerFieldProps = {
  label: string;
  value: string;
  onChange: (dateString: string) => void;
  placeholder?: string;
  compact?: boolean;
};

function parseDate(dateString: string): Date {
  const d = new Date(dateString + "T00:00:00");
  return isNaN(d.getTime()) ? new Date() : d;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DatePickerField({
  label, value, onChange, placeholder = "Select date", compact = false,
}: DatePickerFieldProps) {
  const [show, setShow] = useState(false);
  const currentDate = parseDate(value);

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShow(false);
    if (selectedDate) onChange(formatDate(selectedDate));
  };

  const handleDismiss = () => setShow(false);
  const displayValue = value || placeholder;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
      <Pressable style={({ pressed }) => [styles.pickerButton, compact && styles.pickerButtonCompact, pressed && styles.pickerButtonPressed]} onPress={() => setShow(true)}>
        <Ionicons name="calendar-outline" size={compact ? 13 : 16} color={uberColors.mute} />
        <Text style={[styles.pickerText, !value && styles.placeholder, compact && styles.pickerTextCompact]}>
          {displayValue}
        </Text>
        <Ionicons name="chevron-down" size={compact ? 11 : 14} color={uberColors.mute} />
      </Pressable>

      {Platform.OS === "ios" ? (
        <Modal visible={show} transparent animationType="fade" onRequestClose={handleDismiss}>
          <Pressable style={styles.overlay} onPress={handleDismiss}>
            <Pressable style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <Pressable onPress={handleDismiss}><Text style={styles.cancelText}>Cancel</Text></Pressable>
                <Text style={styles.iosPickerTitle}>{label}</Text>
                <Pressable onPress={() => setShow(false)}><Text style={styles.doneText}>Done</Text></Pressable>
              </View>
              <DateTimePicker value={currentDate} mode="date" display="spinner" onChange={handleChange} themeVariant="light" />
            </Pressable>
          </Pressable>
        </Modal>
      ) : show ? (
        <DateTimePicker value={currentDate} mode="date" display="default" onChange={handleChange} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: uberSpacing.xs },
  label: {
    fontSize: uberTypography.bodySmStrong.fontSize,
    fontWeight: uberTypography.bodySmStrong.fontWeight,
    color: uberColors.ink,
    fontFamily: uberTypography.bodySmStrong.fontFamily,
  },
  labelCompact: {
    fontSize: 11,
    color: uberColors.body,
  },

  pickerButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: uberSpacing.sm,
    backgroundColor: uberColors.canvasSoft, borderRadius: uberRounded.md,
    padding: uberSpacing.lg,
  },
  pickerButtonPressed: {
    backgroundColor: uberColors.surfacePressed,
  },
  pickerButtonCompact: {
    paddingVertical: uberSpacing.sm,
    paddingHorizontal: uberSpacing.md,
    borderRadius: uberRounded.pill,
  },

  pickerText: {
    fontSize: uberTypography.bodyMd.fontSize, color: uberColors.ink,
    fontFamily: uberTypography.bodyMd.fontFamily, flex: 1,
  },
  pickerTextCompact: {
    fontSize: uberTypography.caption.fontSize,
  },
  placeholder: { color: uberColors.mute },

  // Uber black/white iOS picker overlay
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end",
  },
  iosPickerContainer: {
    backgroundColor: uberColors.canvas,
    borderTopLeftRadius: uberRounded.xl, borderTopRightRadius: uberRounded.xl,
    paddingBottom: 34,
    ...uberShadows.level2,
    shadowOffset: { width: 0, height: -4 },
  },
  iosPickerHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: uberSpacing.lg, paddingVertical: uberSpacing.lg,
    borderBottomWidth: 1, borderBottomColor: uberColors.canvasSoft,
  },
  iosPickerTitle: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: uberTypography.bodyMdStrong.fontWeight,
    color: uberColors.ink, fontFamily: uberTypography.bodyMdStrong.fontFamily,
  },
  cancelText: {
    fontSize: uberTypography.bodyMd.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  doneText: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: uberTypography.bodyMdStrong.fontWeight,
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
  },
});
