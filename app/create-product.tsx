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

export const options = {
  headerShown: false,
};

export default function CreateProductScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    notes: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      Alert.alert("Missing details", "Product name is required.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert("Product created", "Your new product has been saved.");
      router.back();
    }, 300);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create product</Text>
        <Text style={styles.subtitle}>Add the product details below.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Product name</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(value) => handleChange("name", value)}
            placeholder="Wireless Mouse"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>SKU</Text>
          <TextInput
            style={styles.input}
            value={form.sku}
            onChangeText={(value) => handleChange("sku", value)}
            placeholder="WM-001"
          />
        </View>

        <View style={styles.inlineRow}>
          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={form.price}
              onChangeText={(value) => handleChange("price", value)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.formGroup, styles.flexHalf]}>
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={styles.input}
              value={form.stock}
              onChangeText={(value) => handleChange("stock", value)}
              placeholder="100"
              keyboardType="number-pad"
            />
          </View>
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
            {isSubmitting ? "Saving..." : "Create product"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 8,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  inlineRow: {
    flexDirection: "row",
    gap: 12,
  },
  flexHalf: {
    flex: 1,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#f97316",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
