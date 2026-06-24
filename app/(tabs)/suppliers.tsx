import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function SuppliersScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Suppliers</ThemedText>
        <ThemedText style={styles.description}>
          Keep supplier contacts and purchase details in one place. Add new
          suppliers and manage existing vendors.
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
    marginTop: 16,
  },
});
