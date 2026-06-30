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
import { ExpenseCategoryPicker } from "@/components/ui/expense-category-picker";
import { UberButton } from "@/components/ui/uber-button";
import { UberEmptyState } from "@/components/ui/uber-empty-state";
import { UberHeader } from "@/components/ui/uber-header";
import {
  uberColors,
  uberRounded,
  uberSpacing,
  uberTypography,
} from "@/constants/theme";
import {
  deleteExpense,
  getExpenseById,
  getExpensesByCategory,
  updateExpense,
  type Expense,
} from "@/db/index";

export const options = { headerShown: false };

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
      getExpensesByCategory(decodeURIComponent(category)).then(
        setCategoryExpenses,
      );
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
    Alert.alert(
      "Delete expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteExpense(Number(id));
            router.back();
          },
        },
      ],
    );
  };

  // Category list view
  if (category !== undefined && !id) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <UberHeader
          title={
            category
              ? `${decodeURIComponent(category)} Expenses`
              : "Uncategorized"
          }
        />
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
                $
                {item.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <UberEmptyState icon="card-outline" title="No expenses found" />
          }
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    );
  }

  // Single expense detail
  return (
    <SafeAreaView style={styles.safeArea}>
      <UberHeader
        title="Expense details"
        rightAction={
          <Pressable
            style={styles.editBtn}
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <Text style={styles.editBtnText}>
              {isEditing ? "Save" : "Edit"}
            </Text>
          </Pressable>
        }
      />
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
        {isEditing ? (
          <View style={styles.formGroup}>
            <ExpenseCategoryPicker
              value={form.category}
              onChange={(v) => handleChange("category", v)}
            />
          </View>
        ) : (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={[styles.input, styles.inputReadonly]}
              value={form.category}
              editable={false}
            />
          </View>
        )}
        <View style={styles.inlineRow}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputReadonly]}
              value={form.amount}
              onChangeText={(v) => handleChange("amount", v)}
              keyboardType="decimal-pad"
              editable={isEditing}
            />
          </View>
          <View style={{ flex: 1 }}>
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
            style={[
              styles.input,
              styles.textArea,
              !isEditing && styles.inputReadonly,
            ]}
            value={form.notes}
            onChangeText={(v) => handleChange("notes", v)}
            multiline
            numberOfLines={4}
            editable={isEditing}
          />
        </View>
        {isEditing && (
          <UberButton
            variant="danger"
            label="Delete expense"
            icon="trash-outline"
            onPress={handleDelete}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: uberColors.canvas },
  listContent: { padding: uberSpacing.lg, gap: uberSpacing.sm },
  container: {
    padding: uberSpacing.lg,
    paddingBottom: 40,
    gap: uberSpacing.lg,
  },
  formGroup: { gap: uberSpacing.xs },
  label: {
    fontSize: uberTypography.bodySmStrong.fontSize,
    fontWeight: uberTypography.bodySmStrong.fontWeight,
    color: uberColors.ink,
    fontFamily: uberTypography.bodySmStrong.fontFamily,
  },
  input: {
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.md,
    padding: uberSpacing.lg,
    fontSize: uberTypography.bodyMd.fontSize,
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  inputReadonly: {
    backgroundColor: uberColors.canvasSofter,
    color: uberColors.body,
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  inlineRow: { flexDirection: "row", gap: uberSpacing.md },
  editBtn: {
    backgroundColor: uberColors.primary,
    borderRadius: uberRounded.pill,
    paddingHorizontal: uberSpacing.lg,
    paddingVertical: uberSpacing.sm,
  },
  editBtnText: {
    color: uberColors.onPrimary,
    fontWeight: "500",
    fontSize: uberTypography.bodyMd.fontSize,
  },
  expenseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.lg,
    padding: uberSpacing.lg,
    gap: uberSpacing.md,
  },
  expenseCardPressed: { opacity: 0.7 },
  expenseTitle: {
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: "600",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  expenseDate: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: "700",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
  },
});
