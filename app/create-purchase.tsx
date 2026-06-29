import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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

const supplierQuery = evolu.createQuery((db) =>
  db
    .selectFrom("supplier")
    .select(["id", "companyName"])
    .where("isDeleted", "is not", Evolu.sqliteTrue),
);

export default function CreatePurchaseScreen() {
  const router = useRouter();
  const { insert } = useAppEvolu();
  const supplierList = useQuery(supplierQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSupplierPicker, setShowSupplierPicker] = useState(false);
  const [form, setForm] = useState({
    supplierId: "",
    date: new Date().toISOString().slice(0, 10),
    narration: "",
    debit: "",
    credit: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const suppliers = (supplierList as unknown as { id: string; companyName: string }[]) || [];
  const selectedSupplier = suppliers.find((s) => s.id === form.supplierId);

  // Query last transaction for balance calculation
  const lastTxnQuery = useMemo(
    () =>
      evolu.createQuery((db) =>
        db
          .selectFrom("supplierTransaction")
          .select(["balance"])
          .where("supplierId", "=", form.supplierId || ("" as any))
          .where("isDeleted", "is not", Evolu.sqliteTrue)
          .orderBy("createdAt", "desc")
          .limit(1),
      ),
    [form.supplierId],
  );
  const lastTxns = useQuery(lastTxnQuery);
  const lastBalance = (lastTxns?.[0] as { balance: number } | undefined)?.balance ?? 0;

  const handleSubmit = () => {
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
      const balance = lastBalance + debitVal - creditVal;
      insert("supplierTransaction", {
        supplierId: form.supplierId,
        date: form.date.trim() || new Date().toISOString().slice(0, 10),
        narration: form.narration.trim(),
        debit: debitVal || null,
        credit: creditVal || null,
        balance,
      });
      Alert.alert("Purchase recorded", "The transaction has been saved.");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to save the purchase right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PickerModal
        visible={showSupplierPicker}
        data={suppliers.map((s) => ({ id: s.id, label: s.companyName }))}
        selectedId={form.supplierId}
        onSelect={(item) => {
          handleChange("supplierId", item.id);
          setShowSupplierPicker(false);
        }}
        onClose={() => setShowSupplierPicker(false)}
        title="Select Supplier"
        emptyText="No suppliers found. Create one first."
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Record Purchase</Text>
        <Text style={styles.subtitle}>Record a debit or credit transaction for a supplier.</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Supplier</Text>
          <Pressable style={styles.pickerButton} onPress={() => setShowSupplierPicker(true)}>
            <Text style={[styles.pickerButtonText, !selectedSupplier && styles.pickerPlaceholder]}>
              {selectedSupplier ? selectedSupplier.companyName : "Select a supplier"}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </Pressable>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput style={styles.input} value={form.date} onChangeText={(v) => handleChange("date", v)} placeholder="YYYY-MM-DD" />
        </View>
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
        <View style={styles.balanceHint}>
          <Text style={styles.balanceHintText}>
            Current balance: {lastBalance.toFixed(2)}. After this transaction: {(lastBalance + (Number(form.debit) || 0) - (Number(form.credit) || 0)).toFixed(2)}
          </Text>
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
  balanceHint: { backgroundColor: "#f0f9ff", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#bae6fd" },
  balanceHintText: { fontSize: 13, color: "#0369a1", lineHeight: 18 },
  button: { marginTop: 8, backgroundColor: "#0891b2", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
