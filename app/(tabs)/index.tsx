import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeDashboard from "@/components/home/home-dashboard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TabAnimatedView from "@/components/ui/tab-animated-view";
import { useTabDirection } from "@/components/ui/tab-direction";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function HomeScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  useEffect(() => {
    if (isFocused) setIndex(0);
  }, [isFocused, setIndex]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText type="title">Home</ThemedText>
            <Pressable
              style={[styles.avatarBtn, isDark && styles.avatarBtnDark]}
              onPress={() => router.push("/settings" as any)}
              accessibilityLabel="Open settings"
            >
              <Ionicons name="person-circle" size={32} color={isDark ? "#94a3b8" : "#64748b"} />
            </Pressable>
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBtnDark: {
    backgroundColor: "#1e293b",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 16,
    lineHeight: 26,
  },
});
