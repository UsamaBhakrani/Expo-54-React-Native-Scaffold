import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DatePickerField from "@/components/DatePickerField";
import {
  getExpenseById,
  getExpensesByCategory,
  updateExpense,
  deleteExpense,
  type Expense,
} from "@/db/index";

export const options = { headerShown: false };

// Shows either a single expense detail or a filtered list by category
export default function ExpenseDetailScreen() {
  const { id, category } = useLocalSearchParams<{
    id: string;
    category?: string;
  }>();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [expense, setExpense] = useState<Expense | null>(null);
  const [categoryExpenses, setCategoryExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    expenseDate: "",
    notes: "",
  });

  useEffect(() => {
    if (id) {
      getExpenseById(Number(id)).then((e) => {
        if (e) {
          setExpense(e);
          setForm({
            title: e.title,
            category: e.category ?? "",
            amount: String(e.amount),
            expenseDate: e.expenseDate ?? "",
            notes: e.notes ?? "",
          });
        }
      });
    } else if (category !== undefined) {
      getExpensesByCategory(decodeURIComponent(category)).then(setCategoryExpenses);
    }
  }, [id, category]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.amount.trim()) {
      Alert.alert("Missing details", "Expense title and amount are required.");
      return;
    }
    if (id) {
      updateExpense(Number(id), {
        title: form.title.trim(),
        category: form.category.trim() || null,
        amount: Number(form.amount),
        expenseDate: form.expenseDate.trim() || null,
        notes: form.notes.trim() || null,
      });
    }
    Alert.alert("Expense updated", "Changes have been saved.");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!id) return;
    Alert.alert("Delete expense", "Are you sure you want to delete this expense?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteExpense(Number(id));
          router.back();
        },
      },
    ]);
  };

  // If viewing by category, show filtered list
  if (category !== undefined && !id) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {category ? `${decodeURIComponent(category)} Expenses` : "Uncategorized"}
          </Text>
        </View>
        <FlatList
          data={categoryExpenses}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.expenseCard,
                pressed && styles.expenseCardPressed,
              ]}
              onPress={() =>
                router.push(`/expense-detail?id=${item.id}` as any)
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.expenseTitle}>{item.title}</Text>
                <Text style={styles.expenseDate}>{item.expenseDate}</Text>
              </View>
              <Text style={styles.expenseAmount}>
                ${item.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No expenses found</Text>
            </View>
          }
          contentContainerStyle={{ padding: 16, gap: 8 }}
        />
      </SafeAreaView>
    );
  }

  // Single expense detail view
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </Pressable>
        <Text style={styles.headerTitle}>Expense Details</Text>
        <Pressable
          style={styles.editBtn}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <Text style={styles.editBtnText}>{isEditing ? "Save" : "Edit"}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputReadonly]}
            value={form.title}
            onChangeText={(v) => handleChange("title", v)}
            editable={isEditing}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputReadonly]}
            value={form.category}
            onChangeText={(v) => handleChange("category", v)}
            editable={isEditing}
          />
        </View>
        <View style={styles.inlineRow}>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputReadonly]}
              value={form.amount}
              onChangeText={(v) => handleChange("amount", v)}
              keyboardType="decimal-pad"
              editable={isEditing}
            />
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
          <TextInput
            style={[styles.input, styles.textArea, !isEditing && styles.inputReadonly]}
            value={form.notes}
            onChangeText={(v) => handleChange("notes", v)}
            multiline
            numberOfLines={4}
            editable={isEditing}
          />
        </View>

        {isEditing ? (
          <Pressable style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#fff" />
            <Text style={styles.deleteBtnText}>Delete Expense</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700", color: "#0f172a" },
  editBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  container: { padding: 20, paddingBottom: 40, gap: 12 },
  formGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#334155" },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#0f172a",
  },
  inputReadonly: {
    backgroundColor: "#f8fafc",
    color: "#475569",
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  inlineRow: { flexDirection: "row", gap: 12 },
  flexHalf: { flex: 1 },
  deleteBtn: {
    marginTop: 16,
    flexDirection: "row",
    backgroundColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  deleteBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  expenseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  expenseCardPressed: { opacity: 0.7, backgroundColor: "#f1f5f9" },
  expenseTitle: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
  expenseDate: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#dc2626",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 80,
  },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: "#64748b", marginTop: 6 },
});
