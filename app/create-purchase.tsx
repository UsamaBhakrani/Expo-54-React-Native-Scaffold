import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
import PickerModal from "@/components/ui/picker-modal";
import type { PickerItem } from "@/components/ui/picker-modal";
import {
  getAllSuppliers,
  getLastTransactionBySupplier,
  insertSupplierTransaction,
  type Supplier,
} from "@/db/index";

export const options = { headerShown: false };

export default function CreatePurchaseScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supplierOptions, setSupplierOptions] = useState<PickerItem[]>([]);
  const [showSupplierPicker, setShowSupplierPicker] = useState(false);
  const [form, setForm] = useState({
    supplierId: "",
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
      // Calculate running balance from last transaction
      const lastTxns = await getLastTransactionBySupplier(Number(form.supplierId));
      const prevBalance = lastTxns[0]?.balance ?? 0;
      const newBalance = prevBalance + debitVal - creditVal;

      await insertSupplierTransaction({
        supplierId: Number(form.supplierId),
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
        onClose={() => { setShowSupplierPicker(false); loadSuppliers(); }}
        title="Select Supplier"
        emptyText="No suppliers found. Create one first."
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Record Purchase</Text>
        <Text style={styles.subtitle}>Record a debit or credit transaction for a supplier.</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Supplier</Text>
          <Pressable style={styles.pickerButton} onPress={() => setShowSupplierPicker(true)}>
            <Text style={[styles.pickerButtonText, !form.supplierId && styles.pickerPlaceholder]}>
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
        <View style={styles.formGroup}>
          <Text style={styles.label}>Narration</Text>
          <TextInput style={styles.input} value={form.narration} onChangeText={(v) => handleChange("narration", v)} placeholder="Purchase of office supplies" />
        </View>
        <View style={styles.inlineRow}>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Debit (amount due)</Text>
            <TextInput style={[styles.input, styles.debitInput]} value={form.debit} onChangeText={(v) => handleChange("debit", v)} placeholder="0.00" keyboardType="decimal-pad" />
          </View>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Credit (amount paid)</Text>
            <TextInput style={[styles.input, styles.creditInput]} value={form.credit} onChangeText={(v) => handleChange("credit", v)} placeholder="0.00" keyboardType="decimal-pad" />
          </View>
        </View>
        <Pressable style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.buttonText}>{isSubmitting ? "Saving..." : "Record purchase"}</Text>
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
  debitInput: { borderColor: "#fca5a5" },
  creditInput: { borderColor: "#86efac" },
  inlineRow: { flexDirection: "row", gap: 12 },
  flexHalf: { flex: 1 },
  pickerButton: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: "#fff" },
  pickerButtonText: { fontSize: 15, color: "#0f172a" },
  pickerPlaceholder: { color: "#94a3b8" },
  pickerArrow: { fontSize: 10, color: "#64748b" },
  button: { marginTop: 8, backgroundColor: "#0891b2", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
