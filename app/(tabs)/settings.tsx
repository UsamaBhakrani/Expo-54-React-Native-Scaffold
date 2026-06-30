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

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={[styles.container, isDark && styles.containerDark]}>
          <ThemedText type="title">Settings</ThemedText>

          {/* Appearance */}
          <View style={[styles.section, isDark && styles.sectionDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              Appearance
            </Text>
            <View style={styles.themeOptions}>
              {THEME_OPTIONS.map((opt) => {
                const isSelected = colorMode === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    style={[
                      styles.themeOption,
                      isDark && styles.themeOptionDark,
                      isSelected && styles.themeOptionSelected,
                      isSelected && isDark && styles.themeOptionSelectedDark,
                    ]}
                    onPress={() => setColorMode(opt.value)}
                  >
                    <Ionicons
                      name={opt.icon as any}
                      size={22}
                      color={
                        isSelected
                          ? isDark
                            ? "#fff"
                            : "#fff"
                          : isDark
                          ? "#94a3b8"
                          : "#64748b"
                      }
                    />
                    <Text
                      style={[
                        styles.themeOptionLabel,
                        isDark && styles.textDark,
                        isSelected && styles.themeOptionLabelSelected,
                        isSelected && isDark && styles.themeOptionLabelSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={isDark ? "#22c55e" : "#22c55e"}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Seed Database */}
          <View style={[styles.section, isDark && styles.sectionDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              Data
            </Text>
            <Pressable
              style={[styles.seedButton, isDark && styles.seedButtonDark]}
              onPress={async () => {
                try {
                  await seedDatabase();
                  Alert.alert("Seeded", "Sample data has been added to the database.");
                } catch (e) {
                  Alert.alert("Error", "Failed to seed database.");
                }
              }}
            >
              <Ionicons name="flask-outline" size={20} color="#fff" />
              <Text style={styles.seedButtonText}>Seed with sample data</Text>
            </Pressable>
            <Pressable
              style={[styles.dangerButton, isDark && styles.dangerButtonDark]}
              onPress={() => {
                Alert.alert(
                  "Purge Database",
                  "This will delete ALL data from the database. This cannot be undone. Are you sure?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Purge",
                      style: "destructive",
                      onPress: () => {
                        try {
                          purgeDatabase();
                          Alert.alert("Purged", "All database records have been deleted.");
                        } catch (e) {
                          Alert.alert("Error", "Failed to purge database.");
                        }
                      },
                    },
                  ],
                );
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.dangerButtonText}>Purge all data</Text>
            </Pressable>
            <Text
              style={[styles.sectionHint, isDark && styles.textMutedDark]}
            >
              Populates the database with sample suppliers, customers,
              expenses, products, invoices, and transactions for testing.
            </Text>
          </View>

          {/* App Info */}
          <View style={[styles.section, isDark && styles.sectionDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              About
            </Text>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, isDark && styles.textMutedDark]}>
                App
              </Text>
              <Text style={[styles.infoValue, isDark && styles.textDark]}>
                My App
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, isDark && styles.textMutedDark]}>
                Version
              </Text>
              <Text style={[styles.infoValue, isDark && styles.textDark]}>
                1.0.0
              </Text>
            </View>
          </View>
        </ThemedView>
      </TabAnimatedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  safeAreaDark: { backgroundColor: "#0f172a" },
  container: { flex: 1, padding: 16, gap: 20 },
  containerDark: { backgroundColor: "#0f172a" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionDark: { backgroundColor: "#1e293b" },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionHint: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 18,
  },
  themeOptions: { flexDirection: "row", gap: 8 },
  themeOption: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "transparent",
  },
  themeOptionDark: { backgroundColor: "#334155" },
  themeOptionSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#1d4ed8",
  },
  themeOptionSelectedDark: {
    backgroundColor: "#2563eb",
    borderColor: "#3b82f6",
  },
  themeOptionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  themeOptionLabelSelected: { color: "#fff" },
  textDark: { color: "#f1f5f9" },
  textMutedDark: { color: "#94a3b8" },
  seedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    paddingVertical: 12,
  },
  seedButtonDark: { backgroundColor: "#6d28d9" },
  seedButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 12,
  },
  dangerButtonDark: { backgroundColor: "#b91c1c" },
  dangerButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: { fontSize: 15, color: "#64748b" },
  infoValue: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
});
