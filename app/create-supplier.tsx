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

import { useAppEvolu } from "@/db/evolu-provider";

export const options = { headerShown: false };

export default function CreateSupplierScreen() {
  const router = useRouter();
  const { insert } = useAppEvolu();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      insert("supplier", {
        companyName: form.companyName.trim(),
        contactName: form.contactName.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        notes: form.notes.trim() || null,
      });
      Alert.alert("Supplier created", "Your new supplier has been saved.");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to save the supplier right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create supplier</Text>
        <Text style={styles.subtitle}>Add the supplier details below.</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Company name</Text>
          <TextInput
            style={styles.input}
            value={form.companyName}
            onChangeText={(value) => handleChange("companyName", value)}
            placeholder="Northwind Supply"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Contact name</Text>
          <TextInput
            style={styles.input}
            value={form.contactName}
            onChangeText={(value) => handleChange("contactName", value)}
            placeholder="Alex Morgan"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(value) => handleChange("email", value)}
            placeholder="supplier@example.com"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(value) => handleChange("phone", value)}
            placeholder="+1 234 567 890"
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={form.address}
            onChangeText={(value) => handleChange("address", value)}
            placeholder="42 Market Road"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.notes}
            onChangeText={(value) => handleChange("notes", value)}
            placeholder="Optional notes"
            multiline
            numberOfLines={4}
          />
        </View>
        <Pressable
          style={styles.button}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Saving..." : "Create supplier"}
          </Text>
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
  input: {
    borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#fff",
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  button: {
    marginTop: 8, backgroundColor: "#0f766e", borderRadius: 12,
    paddingVertical: 14, alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
