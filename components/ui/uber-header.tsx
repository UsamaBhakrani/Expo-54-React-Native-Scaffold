import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { uberColors, uberSpacing, uberRounded, uberTypography } from "@/constants/theme";

type UberHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
};

export function UberHeader({ title, subtitle, showBack = true, rightAction }: UberHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {showBack ? (
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={uberColors.ink} />
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}

      <View style={styles.titleArea}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {rightAction ? (
        <View style={styles.rightArea}>{rightAction}</View>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: uberSpacing.lg,
    paddingVertical: uberSpacing.md,
    gap: uberSpacing.md,
    backgroundColor: uberColors.canvas,
    borderBottomWidth: 1,
    borderBottomColor: uberColors.canvasSoft,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: uberRounded.full,
    backgroundColor: uberColors.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  backPlaceholder: {
    width: 36,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: uberTypography.bodyMdStrong.fontWeight,
    lineHeight: uberTypography.bodyMdStrong.lineHeight,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
    color: uberColors.ink,
  },
  subtitle: {
    fontSize: uberTypography.bodySm.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.bodySm.fontFamily,
    marginTop: 1,
  },
  rightArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: uberSpacing.sm,
  },
});
