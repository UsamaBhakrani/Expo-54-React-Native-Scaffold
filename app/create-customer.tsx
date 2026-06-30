import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UberButton } from "@/components/ui/uber-button";
import { UberHeader } from "@/components/ui/uber-header";
import { UberInput } from "@/components/ui/uber-input";
import { uberColors, uberSpacing } from "@/constants/theme";
import { insertCustomer } from "@/db/index";

export const options = { headerShown: false };

export default function CreateCustomerScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert("Missing details", "Customer name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await insertCustomer({
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        notes: form.notes.trim() || null,
      });
      Alert.alert("Customer created", "Your new customer has been saved.");
      router.back();
    } catch {
      Alert.alert("Error", "Unable to save the customer right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <UberHeader title="New customer" subtitle="Add a new customer" />
      <ScrollView contentContainerStyle={styles.container}>
        <UberInput
          label="Customer name"
          value={form.name}
          onChangeText={(v) => handleChange("name", v)}
          placeholder="Acme Client"
        />
        <UberInput
          label="Email"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          placeholder="customer@example.com"
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
          placeholder="123 Main Street"
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
            label={isSubmitting ? "Saving..." : "Create customer"}
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
  textArea: { minHeight: 100 },
  buttonStack: {
    flexDirection: "column",
    gap: uberSpacing.sm,
    marginTop: uberSpacing.lg,
  },
});
