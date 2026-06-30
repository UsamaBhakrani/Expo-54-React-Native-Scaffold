import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";

import { uberColors, uberSpacing, uberTypography } from "@/constants/theme";

type UberEmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  style?: ViewStyle;
};

export function UberEmptyState({
  icon = "cube-outline",
  title,
  description,
  style,
}: UberEmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon} size={48} color={uberColors.mute} />
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: uberSpacing.sm,
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: uberTypography.bodyMdStrong.fontWeight,
    color: uberColors.body,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
    marginTop: uberSpacing.sm,
  },
  description: {
    fontSize: uberTypography.bodySm.fontSize,
    color: uberColors.mute,
    textAlign: "center",
    fontFamily: uberTypography.bodySm.fontFamily,
    lineHeight: uberTypography.bodySm.lineHeight,
  },
});
