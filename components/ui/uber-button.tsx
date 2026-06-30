import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { uberColors, uberRounded, uberSpacing, uberTypography } from "@/constants/theme";

type UberButtonVariant =
  | "primary"
  | "secondary"
  | "subtle"
  | "floating"
  | "large"
  | "danger"
  | "ghost";

type UberButtonProps = PressableProps & {
  variant?: UberButtonVariant;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const pressedVariants: Partial<Record<UberButtonVariant, ViewStyle>> = {
  primary: { backgroundColor: uberColors.blackElevated },
  secondary: { backgroundColor: uberColors.surfacePressed },
  subtle: { backgroundColor: uberColors.surfacePressed },
  floating: { backgroundColor: uberColors.surfacePressed },
  large: { backgroundColor: uberColors.blackElevated },
  danger: { backgroundColor: "#b91c1c" },
  ghost: { backgroundColor: uberColors.canvasSoft },
};

export function UberButton({
  variant = "primary",
  label,
  icon,
  iconPosition = "left",
  fullWidth = true,
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...rest
}: UberButtonProps) {
  const btnStyle = [baseStyles.base, variantStyles[variant], fullWidth && baseStyles.fullWidth, disabled && baseStyles.disabled, style].filter(Boolean) as ViewStyle[];
  const txtStyle = [baseStyles.text, variantTextStyles[variant], disabled && baseStyles.textDisabled, textStyle].filter(Boolean) as TextStyle[];

  const iconColor =
    variant === "primary" || variant === "large" || variant === "danger"
      ? uberColors.onPrimary
      : uberColors.ink;

  return (
    <Pressable
      style={({ pressed }) => [
        btnStyle,
        pressed && pressedVariants[variant],
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Text style={txtStyle}>Loading...</Text>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons name={icon} size={18} color={iconColor} />
          )}
          <Text style={txtStyle}>{label}</Text>
          {icon && iconPosition === "right" && (
            <Ionicons name={icon} size={18} color={iconColor} />
          )}
        </>
      )}
    </Pressable>
  );
}

const baseStyles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: uberSpacing.sm,
    borderRadius: uberRounded.pill,
    paddingVertical: uberSpacing.md,
    paddingHorizontal: uberSpacing.md,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: uberTypography.buttonMd.fontSize,
    fontWeight: uberTypography.buttonMd.fontWeight,
    lineHeight: uberTypography.buttonMd.lineHeight,
    fontFamily: uberTypography.buttonMd.fontFamily,
    textAlign: "center",
  },
  textDisabled: {
    opacity: 0.5,
  },
});

const variantStyles: Record<UberButtonVariant, ViewStyle> = {
  primary: { backgroundColor: uberColors.primary },
  secondary: {
    backgroundColor: uberColors.canvas,
    borderWidth: 1,
    borderColor: uberColors.canvasSoft,
  },
  subtle: { backgroundColor: uberColors.canvasSoft },
  floating: {
    backgroundColor: uberColors.canvas,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  large: {
    backgroundColor: uberColors.primary,
    borderRadius: uberRounded.xl,
    paddingVertical: uberSpacing.lg,
    paddingHorizontal: uberSpacing.xl,
  },
  danger: { backgroundColor: "#dc2626" },
  ghost: { backgroundColor: "transparent", paddingVertical: uberSpacing.sm },
};

const variantTextStyles: Record<UberButtonVariant, TextStyle> = {
  primary: { color: uberColors.onPrimary },
  secondary: { color: uberColors.ink },
  subtle: { color: uberColors.ink },
  floating: { color: uberColors.ink },
  large: {
    color: uberColors.onPrimary,
    fontSize: uberTypography.buttonLarge.fontSize,
    lineHeight: uberTypography.buttonLarge.lineHeight,
  },
  danger: { color: uberColors.onPrimary },
  ghost: { color: uberColors.ink },
};
