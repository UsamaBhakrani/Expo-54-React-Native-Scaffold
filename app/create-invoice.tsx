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

import PickerModal from "@/components/ui/picker-modal";
import { evolu, useAppEvolu } from "@/db/evolu-provider";

import * as Evolu from "@evolu/common";
import { useQuery } from "@evolu/react";

export const options = { headerShown: false };

const customerQuery = evolu.createQuery((db) =>
  db
    .selectFrom("customer")
    .select(["id", "name", "email"])
    .where("isDeleted", "is not", Evolu.sqliteTrue),
);

export default function CreateInvoiceScreen() {
  const router = useRouter();
  const { insert } = useAppEvolu();
  const customerList = useQuery(customerQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [form, setForm] = useState({
    invoiceNumber: "",
    customerId: "",
    customerName: "",
    customerEmail: "",
    issueDate: "",
    dueDate: "",
    amount: "",
    status: "draft",
    notes: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const customers = (customerList as unknown as { id: string; name: string; email: string | null }[]) || [];

  const selectCustomer = (item: { id: string; label: string; subtitle?: string }) => {
    const customer = customers.find((c) => c.id === item.id);
    if (customer) {
      setForm((prev) => ({
        ...prev,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email || "",
      }));
    }
    setShowCustomerPicker(false);
  };

  const handleSubmit = () => {
    const { invoiceNumber, customerName, amount } = form;
    if (!invoiceNumber.trim() || !customerName.trim() || !amount.trim()) {
      Alert.alert("Missing details", "Invoice number, customer name, and amount are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      insert("invoice", {
        invoiceNumber: invoiceNumber.trim(),
        customerId: form.customerId || null,
        customerName: customerName.trim(),
        customerEmail: form.customerEmail.trim() || null,
        issueDate: form.issueDate.trim() || new Date().toISOString().slice(0, 10),
        dueDate: form.dueDate.trim() || new Date().toISOString().slice(0, 10),
        amount: Number(form.amount),
        status: form.status.trim() || "draft",
        notes: form.notes.trim() || null,
      });
      Alert.alert("Invoice created", "Your new invoice has been saved.");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to save the invoice right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PickerModal
        visible={showCustomerPicker}
        data={customers.map((c) => ({ id: c.id, label: c.name, subtitle: c.email || undefined }))}
        selectedId={form.customerId}
        onSelect={selectCustomer}
        onClose={() => setShowCustomerPicker(false)}
        title="Select Customer"
        emptyText="No customers found. Create one first."
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create invoice</Text>
        <Text style={styles.subtitle}>Add the invoice details below.</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Customer</Text>
          <Pressable style={styles.pickerButton} onPress={() => setShowCustomerPicker(true)}>
            <Text style={[styles.pickerButtonText, !form.customerName && styles.pickerPlaceholder]}>
              {form.customerName || "Select a customer"}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </Pressable>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Invoice number</Text>
          <TextInput style={styles.input} value={form.invoiceNumber} onChangeText={(v) => handleChange("invoiceNumber", v)} placeholder="INV-1001" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Customer name</Text>
          <TextInput style={styles.input} value={form.customerName} onChangeText={(v) => handleChange("customerName", v)} placeholder="Acme Ltd" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Customer email</Text>
          <TextInput style={styles.input} value={form.customerEmail} onChangeText={(v) => handleChange("customerEmail", v)} placeholder="customer@example.com" keyboardType="email-address" />
        </View>
        <View style={styles.inlineRow}>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Issue date</Text>
            <TextInput style={styles.input} value={form.issueDate} onChangeText={(v) => handleChange("issueDate", v)} placeholder="YYYY-MM-DD" />
          </View>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Due date</Text>
            <TextInput style={styles.input} value={form.dueDate} onChangeText={(v) => handleChange("dueDate", v)} placeholder="YYYY-MM-DD" />
          </View>
        </View>
        <View style={styles.inlineRow}>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Amount</Text>
            <TextInput style={styles.input} value={form.amount} onChangeText={(v) => handleChange("amount", v)} placeholder="0.00" keyboardType="decimal-pad" />
          </View>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Status</Text>
            <TextInput style={styles.input} value={form.status} onChangeText={(v) => handleChange("status", v)} placeholder="draft" />
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput style={[styles.input, styles.textArea]} value={form.notes} onChangeText={(v) => handleChange("notes", v)} placeholder="Optional notes" multiline numberOfLines={4} />
        </View>
        <Pressable style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.buttonText}>{isSubmitting ? "Saving..." : "Create invoice"}</Text>
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
  pickerButton: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: "#fff" },
  pickerButtonText: { fontSize: 15, color: "#0f172a" },
  pickerPlaceholder: { color: "#94a3b8" },
  pickerArrow: { fontSize: 10, color: "#64748b" },
  button: { marginTop: 8, backgroundColor: "#2563eb", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
