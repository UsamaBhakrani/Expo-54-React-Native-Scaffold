import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import {
  uberColors,
  uberRounded,
  uberSpacing,
  uberTypography,
} from "@/constants/theme";

type UberInputProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  variant?: "default" | "onSoft";
  containerStyle?: ViewStyle;
};

export function UberInput({
  label,
  hint,
  error,
  variant = "default",
  containerStyle,
  style,
  ...rest
}: UberInputProps) {
  const bgColor =
    variant === "default" ? uberColors.canvasSoft : uberColors.canvasSofter;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: bgColor },
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={uberColors.mute}
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: uberSpacing.xs,
  },
  label: {
    fontSize: uberTypography.bodySmStrong.fontSize,
    fontWeight: uberTypography.bodySmStrong.fontWeight,
    lineHeight: uberTypography.bodySmStrong.lineHeight,
    fontFamily: uberTypography.bodySmStrong.fontFamily,
    color: uberColors.ink,
  },
  input: {
    borderRadius: uberRounded.md,
    padding: uberSpacing.lg,
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: uberTypography.bodyMd.fontWeight,
    lineHeight: uberTypography.bodyMd.lineHeight,
    fontFamily: uberTypography.bodyMd.fontFamily,
    color: uberColors.ink,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#dc2626",
  },
  error: {
    fontSize: uberTypography.caption.fontSize,
    color: "#dc2626",
    fontFamily: uberTypography.caption.fontFamily,
  },
  hint: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
  },
});
