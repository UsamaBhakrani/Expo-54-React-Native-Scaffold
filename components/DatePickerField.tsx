import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type DatePickerFieldProps = {
  label: string;
  value: string; // YYYY-MM-DD format
  onChange: (dateString: string) => void;
  placeholder?: string;
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
  label,
  value,
  onChange,
  placeholder = "Select date",
}: DatePickerFieldProps) {
  const [show, setShow] = useState(false);
  const currentDate = parseDate(value);

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }
    if (selectedDate) {
      onChange(formatDate(selectedDate));
    }
  };

  const handleDismiss = () => {
    setShow(false);
  };

  const displayValue = value || placeholder;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.pickerButton} onPress={() => setShow(true)}>
        <Text style={[styles.pickerText, !value && styles.placeholder]}>
          {displayValue}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </Pressable>

      {Platform.OS === "ios" ? (
        <Modal
          visible={show}
          transparent
          animationType="fade"
          onRequestClose={handleDismiss}
        >
          <Pressable style={styles.overlay} onPress={handleDismiss}>
            <Pressable style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <Pressable onPress={handleDismiss}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Text style={styles.iosPickerTitle}>{label}</Text>
                <Pressable onPress={() => setShow(false)}>
                  <Text style={styles.doneText}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={currentDate}
                mode="date"
                display="spinner"
                onChange={handleChange}
                themeVariant="light"
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : show ? (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#334155" },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  pickerText: { fontSize: 15, color: "#0f172a", flex: 1 },
  placeholder: { color: "#94a3b8" },
  icon: { fontSize: 16, marginLeft: 8 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  iosPickerContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  iosPickerTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  cancelText: { fontSize: 16, color: "#64748b" },
  doneText: { fontSize: 16, color: "#2563eb", fontWeight: "600" },
});
