import React from "react";
import { StyleSheet, View, type ViewProps, type ViewStyle } from "react-native";

import { uberCards, uberRounded, uberSpacing, uberColors } from "@/constants/theme";

type UberCardVariant = "content" | "elevated" | "soft" | "dark" | "form";

type UberCardProps = ViewProps & {
  variant?: UberCardVariant;
  padding?: keyof typeof paddingMap;
};

const paddingMap = {
  none: 0,
  sm: uberSpacing.sm,
  md: uberSpacing.md,
  lg: uberSpacing.lg,
  xl: uberSpacing.xl,
  "2xl": uberSpacing["2xl"],
  "3xl": uberSpacing["3xl"],
} as const;

export function UberCard({
  variant = "content",
  padding = "2xl",
  style,
  children,
  ...rest
}: UberCardProps) {
  const p = paddingMap[padding];
  const variantStyle = variantStyles[variant];

  return (
    <View
      style={[
        {
          padding: p,
        },
        variantStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const variantStyles: Record<UberCardVariant, ViewStyle> = {
  content: {
    backgroundColor: uberColors.canvas,
    borderRadius: uberRounded.xl,
  },
  elevated: {
    backgroundColor: uberColors.canvas,
    borderRadius: uberRounded.xl,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  soft: {
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.xl,
  },
  dark: {
    backgroundColor: uberColors.primary,
    borderRadius: uberRounded.xl,
  },
  form: {
    backgroundColor: uberColors.canvas,
    borderRadius: uberRounded.xl,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
};
