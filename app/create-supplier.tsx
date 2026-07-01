import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import UberConfirmModal from "@/components/ui/uber-confirm-modal";
import { SafeAreaView } from "react-native-safe-area-context";

import { UberButton } from "@/components/ui/uber-button";
import { UberHeader } from "@/components/ui/uber-header";
import { UberInput } from "@/components/ui/uber-input";
import { insertSupplier, updateSupplier, deleteSupplier, getSupplierById } from "@/db/index";
import { uberColors, uberSpacing } from "@/constants/theme";

export const options = { headerShown: false };

export default function CreateSupplierScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isEditing = !!id;
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.companyName.trim()) {
      Alert.alert("Missing details", "Supplier company name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const data = {
        companyName: form.companyName.trim(),
        contactName: form.contactName.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        notes: form.notes.trim() || null,
      };
      if (isEditing) {
        await updateSupplier(Number(id), data);
        Alert.alert("Supplier updated", "Changes have been saved.");
      } else {
        await insertSupplier(data);
        Alert.alert("Supplier created", "Your new supplier has been saved.");
      }
      router.back();
    } catch {
      Alert.alert("Error", "Unable to save the supplier right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSupplier(Number(id));
      setShowDeleteModal(false);
      Alert.alert("Deleted", "Supplier has been removed.");
      router.back();
    } catch {
      Alert.alert("Error", "Unable to delete this supplier.");
    }
  };

  useEffect(() => {
    if (id) {
      getSupplierById(Number(id)).then((s) => {
        if (s) {
          setForm({
            companyName: s.companyName,
            contactName: s.contactName ?? "",
            email: s.email ?? "",
            phone: s.phone ?? "",
            address: s.address ?? "",
            notes: s.notes ?? "",
          });
        }
        setIsLoading(false);
      });
    }
  }, [id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <UberConfirmModal
        visible={showDeleteModal}
        title="Delete supplier"
        message="Are you sure you want to delete this supplier? This cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
      <UberHeader title={isEditing ? "Edit supplier" : "New supplier"} subtitle={isEditing ? "Update supplier details" : "Add a new supplier"} />
      <ScrollView contentContainerStyle={styles.container}>
        <UberInput
          label="Company name"
          value={form.companyName}
          onChangeText={(v) => handleChange("companyName", v)}
          placeholder="Northwind Supply"
        />
        <UberInput
          label="Contact name"
          value={form.contactName}
          onChangeText={(v) => handleChange("contactName", v)}
          placeholder="Alex Morgan"
        />
        <UberInput
          label="Email"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          placeholder="supplier@example.com"
          keyboardType="email-address"
        />
        <UberInput
          label="Phone"
          value={form.phone}
          onChangeText={(v) => handleChange("phone", v)}
          placeholder="+1 234 567 890"
          keyboardType="phone-pad"
        />
        <UberInput
          label="Address"
          value={form.address}
          onChangeText={(v) => handleChange("address", v)}
          placeholder="42 Market Road"
        />
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
            label={isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create supplier"}
            onPress={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </View>
        {isEditing && (
          <UberButton
            variant="danger"
            label="Delete supplier"
            icon="trash-outline"
            onPress={() => setShowDeleteModal(true)}
          />
        )}
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
  textArea: { minHeight: 100 },
  buttonStack: {
    flexDirection: "column",
    gap: uberSpacing.sm,
    marginTop: uberSpacing.lg,
  },
});
