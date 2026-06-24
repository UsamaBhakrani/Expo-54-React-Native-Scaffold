import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Home</ThemedText>
        <ThemedText style={styles.subtitle}>
          Your dashboard is ready. Use the tabs to browse ledgers, suppliers,
          and expenses.
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
  subtitle: {
    fontSize: 18,
    marginTop: 16,
    lineHeight: 26,
  },
});
