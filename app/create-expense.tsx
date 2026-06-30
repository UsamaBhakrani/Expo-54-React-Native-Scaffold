import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DatePickerField from "@/components/DatePickerField";
import { insertExpense } from "@/db/index";

export const options = { headerShown: false };

export default function CreateExpenseScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    expenseDate: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.amount.trim()) {
      Alert.alert("Missing details", "Expense title and amount are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await insertExpense({
        title: form.title.trim(),
        category: form.category.trim() || null,
        amount: Number(form.amount),
        expenseDate: form.expenseDate.trim() || null,
        notes: form.notes.trim() || null,
      });
      Alert.alert("Expense created", "Your new expense has been saved.");
      router.back();
    } catch {
      Alert.alert("Error", "Unable to save the expense right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create expense</Text>
        <Text style={styles.subtitle}>Add the expense details below.</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Expense title</Text>
          <TextInput style={styles.input} value={form.title} onChangeText={(v) => handleChange("title", v)} placeholder="Office Supplies" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput style={styles.input} value={form.category} onChangeText={(v) => handleChange("category", v)} placeholder="Operations" />
        </View>
        <View style={styles.inlineRow}>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Amount</Text>
            <TextInput style={styles.input} value={form.amount} onChangeText={(v) => handleChange("amount", v)} placeholder="0.00" keyboardType="decimal-pad" />
          </View>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <DatePickerField
              label="Date"
              value={form.expenseDate}
              onChange={(v) => handleChange("expenseDate", v)}
            />
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput style={[styles.input, styles.textArea]} value={form.notes} onChangeText={(v) => handleChange("notes", v)} placeholder="Optional notes" multiline numberOfLines={4} />
        </View>
        <Pressable style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.buttonText}>{isSubmitting ? "Saving..." : "Create expense"}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 20, paddingBottom: 40, gap: 12 },
  title: { fontSize: 28, fontWeight: "700", color: "#0f172a" },
  subtitle: { fontSize: 15, color: "#475569", marginBottom: 8 },
  formGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#334155" },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#fff" },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  inlineRow: { flexDirection: "row", gap: 12 },
  flexHalf: { flex: 1 },
  button: { marginTop: 8, backgroundColor: "#dc2626", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
