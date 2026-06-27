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

export const options = {
  headerShown: false,
};

export default function CreateExpenseScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    notes: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.amount.trim()) {
      Alert.alert("Missing details", "Expense title and amount are required.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert("Expense created", "Your new expense has been saved.");
      router.back();
    }, 300);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create expense</Text>
        <Text style={styles.subtitle}>Add the expense details below.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Expense title</Text>
          <TextInput
            style={styles.input}
            value={form.title}
            onChangeText={(value) => handleChange("title", value)}
            placeholder="Office Supplies"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={form.category}
            onChangeText={(value) => handleChange("category", value)}
            placeholder="Operations"
          />
        </View>

        <View style={styles.inlineRow}>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={form.amount}
              onChangeText={(value) => handleChange("amount", value)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={form.date}
              onChangeText={(value) => handleChange("date", value)}
              placeholder="YYYY-MM-DD"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.notes}
            onChangeText={(value) => handleChange("notes", value)}
            placeholder="Optional notes"
            multiline
            numberOfLines={4}
          />
        </View>

        <Pressable
          style={styles.button}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Saving..." : "Create expense"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 8,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  inlineRow: {
    flexDirection: "row",
    gap: 12,
  },
  flexHalf: {
    flex: 1,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
