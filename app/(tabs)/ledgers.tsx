import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TabAnimatedView from "@/components/ui/tab-animated-view";
import { useTabDirection } from "@/components/ui/tab-direction";

export default function LedgersScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();

  useEffect(() => {
    if (isFocused) setIndex(1);
  }, [isFocused, setIndex]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Ledgers</ThemedText>
          <ThemedText style={styles.description}>
            Review and update your financial ledgers. All your entries are
            organized by date and category.
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
