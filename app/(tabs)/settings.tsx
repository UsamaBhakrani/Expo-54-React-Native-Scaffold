import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TabAnimatedView from "@/components/ui/tab-animated-view";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { purgeDatabase } from "@/db/index";
import { seedDatabase } from "@/db/seed-data";
import { uberColors, uberRounded, uberSpacing, uberTypography } from "@/constants/theme";
import { UberSkeleton } from "@/components/ui/uber-skeleton";
import { useEffect, useState } from "react";

type ThemeOption = "light" | "dark" | "system";

const THEME_OPTIONS: { value: ThemeOption; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "sunny-outline" },
  { value: "dark", label: "Dark", icon: "moon-outline" },
  { value: "system", label: "System", icon: "settings-outline" },
];

export default function SettingsScreen() {
  const { colorMode, setColorMode } = useThemeContext();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulate a brief load to show skeleton, then reveal
    const timer = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="displayLg">Settings</ThemedText>

          {!ready ? (
            <View style={{ gap: uberSpacing.lg }}>
              <UberSkeleton variant="rect" width="100%" height={160} style={{ borderRadius: uberRounded.xl }} />
              <UberSkeleton variant="rect" width="100%" height={160} style={{ borderRadius: uberRounded.xl }} />
              <UberSkeleton variant="rect" width="100%" height={100} style={{ borderRadius: uberRounded.xl }} />
            </View>
          ) : (
            <>
              {/* Appearance */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Appearance</Text>
                <View style={styles.themeOptions}>
                  {THEME_OPTIONS.map((opt) => {
                    const isSelected = colorMode === opt.value;
                    return (
                      <Pressable
                        key={opt.value}
                        style={[
                          styles.themeOption,
                          isSelected && styles.themeOptionSelected,
                        ]}
                        onPress={() => setColorMode(opt.value)}
                      >
                        <Ionicons
                          name={opt.icon as any}
                          size={20}
                          color={isSelected ? uberColors.onPrimary : uberColors.ink}
                        />
                        <Text
                          style={[
                            styles.themeOptionLabel,
                            isSelected && styles.themeOptionLabelSelected,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Data */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data</Text>
                <Pressable style={({ pressed }) => [styles.seedButton, pressed && styles.pressedBlack]} onPress={async () => {
                  try {
                    await seedDatabase();
                    Alert.alert("Seeded", "Sample data has been added to the database.");
                  } catch {
                    Alert.alert("Error", "Failed to seed database.");
                  }
                }}>
                  <Ionicons name="flask-outline" size={18} color={uberColors.onPrimary} />
                  <Text style={styles.seedButtonText}>Seed with sample data</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.dangerButton, pressed && styles.pressedDanger]}
                  onPress={() => {
                    Alert.alert(
                      "Purge Database",
                      "This will delete ALL data. This cannot be undone. Are you sure?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Purge", style: "destructive",
                          onPress: () => {
                            try {
                              purgeDatabase();
                              Alert.alert("Purged", "All database records have been deleted.");
                            } catch {
                              Alert.alert("Error", "Failed to purge database.");
                            }
                          },
                        },
                      ],
                    );
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color={uberColors.onPrimary} />
                  <Text style={styles.dangerButtonText}>Purge all data</Text>
                </Pressable>
                <Text style={styles.sectionHint}>
                  Populates the database with sample suppliers, customers, expenses, products, invoices, and transactions for testing.
                </Text>
              </View>

              {/* About */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>App</Text>
                  <Text style={styles.infoValue}>My App</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Version</Text>
                  <Text style={styles.infoValue}>1.0.0</Text>
                </View>
              </View>
            </>
          )}
        </ThemedView>
      </TabAnimatedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: uberSpacing.lg, gap: uberSpacing.xl },
  section: {
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.xl,
    padding: uberSpacing.lg,
    gap: uberSpacing.md,
  },
  sectionTitle: {
    fontSize: uberTypography.caption.fontSize,
    fontWeight: "700",
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
  },
  sectionHint: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.mute,
    lineHeight: 18,
    fontFamily: uberTypography.caption.fontFamily,
  },
  themeOptions: { flexDirection: "row", gap: uberSpacing.sm },
  themeOption: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: uberSpacing.xs,
    paddingVertical: uberSpacing.md,
    paddingHorizontal: uberSpacing.sm,
    borderRadius: uberRounded.pill,
    backgroundColor: uberColors.canvas,
    borderWidth: 1,
    borderColor: uberColors.canvasSoft,
  },
  themeOptionSelected: {
    backgroundColor: uberColors.primary,
    borderColor: uberColors.primary,
  },
  themeOptionLabel: {
    fontSize: uberTypography.caption.fontSize,
    fontWeight: "600",
    color: uberColors.ink,
    fontFamily: uberTypography.caption.fontFamily,
  },
  themeOptionLabelSelected: { color: uberColors.onPrimary },
  seedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: uberSpacing.sm,
    backgroundColor: uberColors.primary,
    borderRadius: uberRounded.pill,
    paddingVertical: uberSpacing.md,
  },
  pressedBlack: {
    backgroundColor: uberColors.blackElevated,
  },
  pressedDanger: {
    backgroundColor: "#b91c1c",
  },
  seedButtonText: {
    color: uberColors.onPrimary,
    fontWeight: "500",
    fontSize: uberTypography.buttonMd.fontSize,
    fontFamily: uberTypography.buttonMd.fontFamily,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: uberSpacing.sm,
    backgroundColor: "#dc2626",
    borderRadius: uberRounded.pill,
    paddingVertical: uberSpacing.md,
  },
  dangerButtonText: {
    color: uberColors.onPrimary,
    fontWeight: "500",
    fontSize: uberTypography.buttonMd.fontSize,
    fontFamily: uberTypography.buttonMd.fontFamily,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: uberTypography.bodySm.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.bodySm.fontFamily,
  },
  infoValue: {
    fontSize: uberTypography.bodySm.fontSize,
    fontWeight: "600",
    color: uberColors.ink,
    fontFamily: uberTypography.bodySm.fontFamily,
  },
});
