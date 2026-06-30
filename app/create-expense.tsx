import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DatePickerField from "@/components/DatePickerField";
import { UberButton } from "@/components/ui/uber-button";
import { UberHeader } from "@/components/ui/uber-header";
import { UberInput } from "@/components/ui/uber-input";
import { ExpenseCategoryPicker } from "@/components/ui/expense-category-picker";
import { insertExpense } from "@/db/index";
import { uberColors, uberSpacing } from "@/constants/theme";

export const options = { headerShown: false };

export default function CreateExpenseScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "", category: "", amount: "",
    expenseDate: new Date().toISOString().slice(0, 10), notes: "",
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
        category: form.category || null,
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
      <UberHeader title="New expense" subtitle="Record a new expense" />
      <ScrollView contentContainerStyle={styles.container}>
        <UberInput label="Expense title" value={form.title} onChangeText={(v) => handleChange("title", v)} placeholder="Office Supplies" />

        <View style={styles.section}>
          <UberInput
            label="Amount"
            value={form.amount}
            onChangeText={(v) => handleChange("amount", v)}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.section}>
          <ExpenseCategoryPicker
            value={form.category}
            onChange={(v) => handleChange("category", v)}
          />
        </View>

        <DatePickerField label="Date" value={form.expenseDate} onChange={(v) => handleChange("expenseDate", v)} />

        <UberInput label="Notes" value={form.notes} onChangeText={(v) => handleChange("notes", v)} placeholder="Optional notes" multiline numberOfLines={4} containerStyle={styles.textArea} />

        <View style={styles.buttonStack}>
          <UberButton variant="subtle" label="Cancel" onPress={() => router.back()} />
          <UberButton variant="primary" label={isSubmitting ? "Saving..." : "Create expense"} onPress={handleSubmit} disabled={isSubmitting} loading={isSubmitting} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: uberColors.canvas },
  container: { padding: uberSpacing.lg, paddingBottom: 40, gap: uberSpacing.lg },
  section: { gap: uberSpacing.sm },
  textArea: { minHeight: 100 },
  buttonStack: { flexDirection: "column", gap: uberSpacing.sm, marginTop: uberSpacing.lg },
});
