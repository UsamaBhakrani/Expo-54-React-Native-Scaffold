import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DatePickerField from "@/components/DatePickerField";
import type { PickerItem } from "@/components/ui/picker-modal";
import PickerModal from "@/components/ui/picker-modal";
import { UberButton } from "@/components/ui/uber-button";
import { UberHeader } from "@/components/ui/uber-header";
import { UberInput } from "@/components/ui/uber-input";
import {
  uberColors,
  uberRounded,
  uberSpacing,
  uberTypography,
} from "@/constants/theme";
import { getAllCustomers, getNextInvoiceNumber, insertInvoice, type Customer } from "@/db/index";

export const options = { headerShown: false };

const today = new Date().toISOString().slice(0, 10);

export default function CreateInvoiceScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerOptions, setCustomerOptions] = useState<PickerItem[]>([]);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [form, setForm] = useState({
    invoiceNumber: "",
    customerId: "",
    customerName: "",
    customerEmail: "",
    issueDate: today,
    dueDate: today,
    amount: "",
    status: "draft",
    notes: "",
  });

  const loadCustomers = useCallback(() => {
    getAllCustomers().then((customers: Customer[]) =>
      setCustomerOptions(
        customers.map((c) => ({
          id: String(c.id),
          label: c.name,
          subtitle: c.email ?? undefined,
        })),
      ),
    );
  }, []);

  useEffect(() => {
    loadCustomers();
    // Auto-populate invoice number from last ID
    getNextInvoiceNumber().then((num) =>
      setForm((prev) => ({ ...prev, invoiceNumber: num })),
    );
  }, [loadCustomers]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { invoiceNumber, customerName, amount } = form;
    if (!invoiceNumber.trim() || !customerName.trim() || !amount.trim()) {
      Alert.alert(
        "Missing details",
        "Invoice number, customer name, and amount are required.",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await insertInvoice({
        invoiceNumber: form.invoiceNumber.trim(),
        customerId: form.customerId ? Number(form.customerId) : null,
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim() || null,
        issueDate: form.issueDate.trim() || today,
        dueDate: form.dueDate.trim() || today,
        amount: Number(form.amount),
        status: form.status.trim() || "draft",
        notes: form.notes.trim() || null,
      });
      Alert.alert("Invoice created", "Your new invoice has been saved.");
      router.back();
    } catch {
      Alert.alert("Error", "Unable to save the invoice right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PickerModal
        visible={showCustomerPicker}
        data={customerOptions}
        selectedId={form.customerId}
        onSelect={(item) => {
          handleChange("customerId", item.id);
          const customer = customerOptions.find((c) => c.id === item.id);
          if (customer) handleChange("customerName", customer.label);
          setShowCustomerPicker(false);
        }}
        onClose={() => {
          setShowCustomerPicker(false);
          loadCustomers();
        }}
        title="Select Customer"
        emptyText="No customers found. Create one first."
      />
      <UberHeader title="New invoice" subtitle="Create a new invoice" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Customer</Text>
          <Pressable
            style={styles.pickerButton}
            onPress={() => setShowCustomerPicker(true)}
          >
            <Text
              style={[
                styles.pickerButtonText,
                !form.customerName && styles.pickerPlaceholder,
              ]}
            >
              {form.customerName || "Select a customer"}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </Pressable>
        </View>
        <UberInput
          label="Invoice number"
          value={form.invoiceNumber}
          onChangeText={(v) => handleChange("invoiceNumber", v)}
          placeholder="INV-1001"
        />
        <UberInput
          label="Customer name"
          value={form.customerName}
          onChangeText={(v) => handleChange("customerName", v)}
          placeholder="Acme Ltd"
        />
        <UberInput
          label="Customer email"
          value={form.customerEmail}
          onChangeText={(v) => handleChange("customerEmail", v)}
          placeholder="customer@example.com"
          keyboardType="email-address"
        />
        <View style={styles.inlineRow}>
          <View style={{ flex: 1 }}>
            <DatePickerField
              label="Issue date"
              value={form.issueDate}
              onChange={(v) => handleChange("issueDate", v)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <DatePickerField
              label="Due date"
              value={form.dueDate}
              onChange={(v) => handleChange("dueDate", v)}
            />
          </View>
        </View>
        <View style={styles.inlineRow}>
          <UberInput
            label="Amount"
            value={form.amount}
            onChangeText={(v) => handleChange("amount", v)}
            placeholder="0.00"
            keyboardType="decimal-pad"
            containerStyle={{ flex: 1 }}
          />
          <UberInput
            label="Status"
            value={form.status}
            onChangeText={(v) => handleChange("status", v)}
            placeholder="draft"
            containerStyle={{ flex: 1 }}
          />
        </View>
        <UberInput
          label="Notes"
          value={form.notes}
          onChangeText={(v) => handleChange("notes", v)}
          placeholder="Optional notes"
          multiline
          numberOfLines={4}
          containerStyle={styles.textArea}
        />
        <View style={styles.buttonStack}>
          <UberButton
            variant="subtle"
            label="Cancel"
            onPress={() => router.back()}
          />
          <UberButton
            variant="primary"
            label={isSubmitting ? "Saving..." : "Create invoice"}
            onPress={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: uberColors.canvas },
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
  textArea: { minHeight: 100 },
  inlineRow: { flexDirection: "row", gap: uberSpacing.md },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.md,
    padding: uberSpacing.lg,
  },
  pickerButtonText: {
    fontSize: uberTypography.bodyMd.fontSize,
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  pickerPlaceholder: { color: uberColors.mute },
  pickerArrow: { fontSize: 10, color: uberColors.body },
  buttonStack: {
    flexDirection: "column",
    gap: uberSpacing.sm,
    marginTop: uberSpacing.lg,
  },
});
