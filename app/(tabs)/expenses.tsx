import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TabAnimatedView from "@/components/ui/tab-animated-view";
import { useTabDirection } from "@/components/ui/tab-direction";

export default function ExpensesScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();

  useEffect(() => {
    if (isFocused) setIndex(3);
  }, [isFocused, setIndex]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Expenses</ThemedText>
          <ThemedText style={styles.description}>
            Track your spendings by category and date. Review expense history to
            keep budgets on target.
          </ThemedText>
        </ThemedView>
      </TabAnimatedView>
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
