import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { uberColors, uberRounded, uberSpacing, uberTypography, uberShadows } from "@/constants/theme";

export default function ModalScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={20} color={uberColors.ink} />
          </Pressable>
          <Text style={styles.title}>Modal</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>This is a modal</Text>
          <Text style={styles.cardBody}>
            Modals follow the Uber design specification with a white surface,
            rounded corners, and a subtle drop shadow.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            onPress={() => router.back()}
          >
            <Text style={styles.actionBtnText}>Go back</Text>
          </Pressable>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: uberColors.canvas,
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
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: uberRounded.full,
    backgroundColor: uberColors.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: uberTypography.bodyMdStrong.fontWeight,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
    color: uberColors.ink,
    textAlign: "center",
  },
  headerSpacer: {
    width: 36,
  },
  // ─── Modal Card (ex-modal-card spec) ───────────────────────────
  card: {
    backgroundColor: uberColors.canvas,
    borderRadius: uberRounded.xl,
    padding: uberSpacing["2xl"],
    alignItems: "center",
    gap: uberSpacing.md,
    ...uberShadows.level2,
  },
  cardTitle: {
    fontSize: uberTypography.displayMd.fontSize,
    fontWeight: uberTypography.displayMd.fontWeight,
    fontFamily: uberTypography.displayMd.fontFamily,
    color: uberColors.ink,
    textAlign: "center",
  },
  cardBody: {
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: uberTypography.bodyMd.fontWeight,
    fontFamily: uberTypography.bodyMd.fontFamily,
    color: uberColors.body,
    textAlign: "center",
    lineHeight: uberTypography.bodyMd.lineHeight,
  },
  actionBtn: {
    backgroundColor: uberColors.primary,
    borderRadius: uberRounded.pill,
    paddingVertical: uberSpacing.md,
    paddingHorizontal: uberSpacing["2xl"],
    width: "100%",
    alignItems: "center",
  },
  actionBtnPressed: {
    backgroundColor: uberColors.blackElevated,
  },
  actionBtnText: {
    fontSize: uberTypography.buttonMd.fontSize,
    fontWeight: uberTypography.buttonMd.fontWeight,
    fontFamily: uberTypography.buttonMd.fontFamily,
    color: uberColors.onPrimary,
  },
});
