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
import { uberColors, uberRounded, uberSpacing } from "@/constants/theme";

export default function HomeScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();
  const router = useRouter();

  useEffect(() => {
    if (isFocused) setIndex(0);
  }, [isFocused, setIndex]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText type="displayLg">Home</ThemedText>
            <Pressable
              style={styles.avatarBtn}
              onPress={() => router.push("/settings" as any)}
              accessibilityLabel="Open settings"
            >
              <Ionicons name="person-circle" size={28} color={uberColors.body} />
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
    padding: uberSpacing.lg,
    gap: uberSpacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: uberRounded.full,
    backgroundColor: uberColors.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
