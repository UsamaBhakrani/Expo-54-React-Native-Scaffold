import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function LedgersScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Ledgers</ThemedText>
        <ThemedText style={styles.description}>
          Review and update your financial ledgers. All your entries are
          organized by date and category.
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
