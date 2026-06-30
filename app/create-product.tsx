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

import { UberButton } from "@/components/ui/uber-button";
import { UberHeader } from "@/components/ui/uber-header";
import { UberInput } from "@/components/ui/uber-input";
import PickerModal from "@/components/ui/picker-modal";
import type { PickerItem } from "@/components/ui/picker-modal";
import { getAllSuppliers, getNextSku, insertProduct, type Supplier } from "@/db/index";
import {
  uberColors,
  uberRounded,
  uberSpacing,
  uberTypography,
} from "@/constants/theme";

export const options = { headerShown: false };

export default function CreateProductScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supplierOptions, setSupplierOptions] = useState<PickerItem[]>([]);
  const [showSupplierPicker, setShowSupplierPicker] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    supplierId: "",
    notes: "",
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
    // Auto-populate SKU from last ID
    getNextSku().then((sku) =>
      setForm((prev) => ({ ...prev, sku })),
    );
  }, [loadSuppliers]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert("Missing details", "Product name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await insertProduct({
        name: form.name.trim(),
        sku: form.sku.trim() || null,
        price: form.price ? Number(form.price) : null,
        stock: form.stock ? Number(form.stock) : null,
        supplierId: form.supplierId ? Number(form.supplierId) : null,
        notes: form.notes.trim() || null,
      });
      Alert.alert("Product created", "Your new product has been saved.");
      router.back();
    } catch {
      Alert.alert("Error", "Unable to save the product right now.");
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
      <UberHeader title="New product" subtitle="Add a new product" />
      <ScrollView contentContainerStyle={styles.container}>
        <UberInput
          label="Product name"
          value={form.name}
          onChangeText={(v) => handleChange("name", v)}
          placeholder="Wireless Mouse"
        />
        <UberInput
          label="SKU"
          value={form.sku}
          onChangeText={(v) => handleChange("sku", v)}
          placeholder="WM-001"
        />
        <View style={styles.inlineRow}>
          <UberInput
            label="Price"
            value={form.price}
            onChangeText={(v) => handleChange("price", v)}
            placeholder="0.00"
            keyboardType="decimal-pad"
            containerStyle={{ flex: 1 }}
          />
          <UberInput
            label="Stock"
            value={form.stock}
            onChangeText={(v) => handleChange("stock", v)}
            placeholder="100"
            keyboardType="number-pad"
            containerStyle={{ flex: 1 }}
          />
        </View>
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
            label={isSubmitting ? "Saving..." : "Create product"}
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
