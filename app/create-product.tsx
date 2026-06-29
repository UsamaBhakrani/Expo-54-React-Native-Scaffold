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

const supplierQuery = evolu.createQuery((db) =>
  db.selectFrom("supplier").select(["id", "companyName"]).where("isDeleted", "is not", Evolu.sqliteTrue),
);

export default function CreateProductScreen() {
  const router = useRouter();
  const { insert } = useAppEvolu();
  const supplierList = useQuery(supplierQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSupplierPicker, setShowSupplierPicker] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    supplierId: "",
    notes: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const suppliers = (supplierList as unknown as { id: string; companyName: string }[]) || [];

  const selectedSupplier = suppliers.find((s) => s.id === form.supplierId);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      Alert.alert("Missing details", "Product name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      insert("product", {
        name: form.name.trim(),
        sku: form.sku.trim() || null,
        price: form.price ? Number(form.price) : null,
        stock: form.stock ? Number(form.stock) : null,
        supplierId: form.supplierId || null,
        notes: form.notes.trim() || null,
      });
      Alert.alert("Product created", "Your new product has been saved.");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to save the product right now.");
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
        <Text style={styles.title}>Create product</Text>
        <Text style={styles.subtitle}>Add the product details below.</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Product name</Text>
          <TextInput style={styles.input} value={form.name} onChangeText={(v) => handleChange("name", v)} placeholder="Wireless Mouse" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>SKU</Text>
          <TextInput style={styles.input} value={form.sku} onChangeText={(v) => handleChange("sku", v)} placeholder="WM-001" />
        </View>
        <View style={styles.inlineRow}>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Price</Text>
            <TextInput style={styles.input} value={form.price} onChangeText={(v) => handleChange("price", v)} placeholder="0.00" keyboardType="decimal-pad" />
          </View>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Stock</Text>
            <TextInput style={styles.input} value={form.stock} onChangeText={(v) => handleChange("stock", v)} placeholder="100" keyboardType="number-pad" />
          </View>
        </View>
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
          <Text style={styles.label}>Notes</Text>
          <TextInput style={[styles.input, styles.textArea]} value={form.notes} onChangeText={(v) => handleChange("notes", v)} placeholder="Optional notes" multiline numberOfLines={4} />
        </View>
        <Pressable style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.buttonText}>{isSubmitting ? "Saving..." : "Create product"}</Text>
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
  button: { marginTop: 8, backgroundColor: "#f97316", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
