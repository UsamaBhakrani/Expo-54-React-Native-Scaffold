import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeDashboard from "@/components/home/home-dashboard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TabAnimatedView from "@/components/ui/tab-animated-view";
import { useTabDirection } from "@/components/ui/tab-direction";
import { runMigrations } from "@/db/config";

export default function HomeScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();

  useEffect(() => {
    if (isFocused) setIndex(0);
  }, [isFocused, setIndex]);

  useEffect(() => {
    runMigrations().catch((err) => {
      console.error("Error running migrations:", err);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Home</ThemedText>
          <HomeDashboard />
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
    padding: 16,
    gap: 16,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 16,
    lineHeight: 26,
  },
});
