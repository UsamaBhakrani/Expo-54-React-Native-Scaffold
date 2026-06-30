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
import { UberButton } from "@/components/ui/uber-button";
import { UberHeader } from "@/components/ui/uber-header";
import { UberInput } from "@/components/ui/uber-input";
import PickerModal from "@/components/ui/picker-modal";
import type { PickerItem } from "@/components/ui/picker-modal";
import {
  getAllSuppliers,
  getLastTransactionBySupplier,
  getNextPurchaseNumber,
  insertSupplierTransaction,
  type Supplier,
} from "@/db/index";
import {
  uberColors,
  uberRounded,
  uberSpacing,
  uberTypography,
} from "@/constants/theme";

export const options = { headerShown: false };

export default function CreatePurchaseScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supplierOptions, setSupplierOptions] = useState<PickerItem[]>([]);
  const [showSupplierPicker, setShowSupplierPicker] = useState(false);
  const [form, setForm] = useState({
    supplierId: "",
    purchaseNumber: "",
    date: new Date().toISOString().slice(0, 10),
    narration: "",
    debit: "",
    credit: "",
  });

  const loadSuppliers = useCallback(() => {
    getAllSuppliers().then((suppliers: Supplier[]) =>
      setSupplierOptions(
        suppliers.map((s) => ({
          id: String(s.id),
          label: s.companyName,
          subtitle: s.contactName ?? undefined,
        })),
      ),
    );
  }, []);

  useEffect(() => {
    loadSuppliers();
    // Auto-populate purchase number from last ID
    getNextPurchaseNumber().then((purchaseNumber) =>
      setForm((prev) => ({ ...prev, purchaseNumber })),
    );
  }, [loadSuppliers]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.supplierId) {
      Alert.alert("Missing details", "Please select a supplier.");
      return;
    }
    if (!form.narration.trim()) {
      Alert.alert("Missing details", "Narration is required.");
      return;
    }
    const debitVal = Number(form.debit) || 0;
    const creditVal = Number(form.credit) || 0;
    if (debitVal === 0 && creditVal === 0) {
      Alert.alert("Missing details", "Enter a debit or credit amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const lastTxns = await getLastTransactionBySupplier(
        Number(form.supplierId),
      );
      const prevBalance = lastTxns[0]?.balance ?? 0;
      const newBalance = prevBalance + debitVal - creditVal;
      await insertSupplierTransaction({
        supplierId: Number(form.supplierId),
        purchaseNumber: form.purchaseNumber.trim() || null,
        date: form.date,
        narration: form.narration.trim(),
        debit: debitVal || null,
        credit: creditVal || null,
        balance: newBalance,
      });
      Alert.alert("Purchase recorded", "The transaction has been saved.");
      router.back();
    } catch {
      Alert.alert("Error", "Unable to save the transaction right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PickerModal
        visible={showSupplierPicker}
        data={supplierOptions}
        selectedId={form.supplierId}
        onSelect={(item) => {
          handleChange("supplierId", item.id);
          setShowSupplierPicker(false);
        }}
        onClose={() => {
          setShowSupplierPicker(false);
          loadSuppliers();
        }}
        title="Select Supplier"
        emptyText="No suppliers found. Create one first."
      />
      <UberHeader title="Record purchase" subtitle="Create a Purchase" />
      <ScrollView contentContainerStyle={styles.container}>
        <UberInput
          label="Purchase number"
          value={form.purchaseNumber}
          onChangeText={(v) => handleChange("purchaseNumber", v)}
          placeholder="PUR-1"
        />
        <View style={styles.formGroup}>
          <Text style={styles.label}>Supplier</Text>
          <Pressable
            style={styles.pickerButton}
            onPress={() => setShowSupplierPicker(true)}
          >
            <Text
              style={[
                styles.pickerButtonText,
                !form.supplierId && styles.pickerPlaceholder,
              ]}
            >
              {form.supplierId ? "Selected supplier" : "Select a supplier"}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </Pressable>
        </View>
        <DatePickerField
          label="Date"
          value={form.date}
          onChange={(v) => handleChange("date", v)}
        />
        <UberInput
          label="Narration"
          value={form.narration}
          onChangeText={(v) => handleChange("narration", v)}
          placeholder="Purchase of office supplies"
        />
        <View style={styles.inlineRow}>
          <UberInput
            label="Debit (amount due)"
            value={form.debit}
            onChangeText={(v) => handleChange("debit", v)}
            placeholder="0.00"
            keyboardType="decimal-pad"
            containerStyle={{ flex: 1 }}
          />
          <UberInput
            label="Credit (amount paid)"
            value={form.credit}
            onChangeText={(v) => handleChange("credit", v)}
            placeholder="0.00"
            keyboardType="decimal-pad"
            containerStyle={{ flex: 1 }}
          />
        </View>
        <View style={styles.buttonStack}>
          <UberButton
            variant="subtle"
            label="Cancel"
            onPress={() => router.back()}
          />
          <UberButton
            variant="primary"
            label={isSubmitting ? "Saving..." : "Record purchase"}
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
