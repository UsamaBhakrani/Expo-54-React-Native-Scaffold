import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { uberColors, uberTypography } from "@/constants/theme";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "displayXxl"
    | "displayXl"
    | "displayLg"
    | "displayMd"
    | "displaySm"
    | "bodyLg"
    | "bodyMd"
    | "bodyMdStrong"
    | "bodySm"
    | "bodySmStrong"
    | "caption"
    | "buttonLarge"
    | "buttonMd";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "displayXxl" ? styles.displayXxl : undefined,
        type === "displayXl" ? styles.displayXl : undefined,
        type === "displayLg" ? styles.displayLg : undefined,
        type === "displayMd" ? styles.displayMd : undefined,
        type === "displaySm" ? styles.displaySm : undefined,
        type === "bodyLg" ? styles.bodyLg : undefined,
        type === "bodyMd" ? styles.bodyMd : undefined,
        type === "bodyMdStrong" ? styles.bodyMdStrong : undefined,
        type === "bodySm" ? styles.bodySm : undefined,
        type === "bodySmStrong" ? styles.bodySmStrong : undefined,
        type === "caption" ? styles.caption : undefined,
        type === "buttonLarge" ? styles.buttonLarge : undefined,
        type === "buttonMd" ? styles.buttonMd : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: uberTypography.bodyMd.fontSize,
    lineHeight: uberTypography.bodyMd.lineHeight,
    fontWeight: uberTypography.bodyMd.fontWeight,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  defaultSemiBold: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    lineHeight: uberTypography.bodyMdStrong.lineHeight,
    fontWeight: uberTypography.bodyMdStrong.fontWeight,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
  },
  title: {
    fontSize: uberTypography.displayLg.fontSize,
    fontWeight: uberTypography.displayLg.fontWeight,
    lineHeight: uberTypography.displayLg.lineHeight,
    fontFamily: uberTypography.displayLg.fontFamily,
  },
  subtitle: {
    fontSize: uberTypography.displaySm.fontSize,
    fontWeight: uberTypography.displaySm.fontWeight,
    lineHeight: uberTypography.displaySm.lineHeight,
    fontFamily: uberTypography.displaySm.fontFamily,
  },
  link: {
    lineHeight: 30,
    fontSize: uberTypography.bodyMd.fontSize,
    color: uberColors.link,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },

  // ─── Uber Typography ─────────────────────────────────────────
  displayXxl: {
    fontSize: uberTypography.displayXxl.fontSize,
    fontWeight: uberTypography.displayXxl.fontWeight,
    lineHeight: uberTypography.displayXxl.lineHeight,
    fontFamily: uberTypography.displayXxl.fontFamily,
  },
  displayXl: {
    fontSize: uberTypography.displayXl.fontSize,
    fontWeight: uberTypography.displayXl.fontWeight,
    lineHeight: uberTypography.displayXl.lineHeight,
    fontFamily: uberTypography.displayXl.fontFamily,
  },
  displayLg: {
    fontSize: uberTypography.displayLg.fontSize,
    fontWeight: uberTypography.displayLg.fontWeight,
    lineHeight: uberTypography.displayLg.lineHeight,
    fontFamily: uberTypography.displayLg.fontFamily,
  },
  displayMd: {
    fontSize: uberTypography.displayMd.fontSize,
    fontWeight: uberTypography.displayMd.fontWeight,
    lineHeight: uberTypography.displayMd.lineHeight,
    fontFamily: uberTypography.displayMd.fontFamily,
  },
  displaySm: {
    fontSize: uberTypography.displaySm.fontSize,
    fontWeight: uberTypography.displaySm.fontWeight,
    lineHeight: uberTypography.displaySm.lineHeight,
    fontFamily: uberTypography.displaySm.fontFamily,
  },
  bodyLg: {
    fontSize: uberTypography.bodyLg.fontSize,
    fontWeight: uberTypography.bodyLg.fontWeight,
    lineHeight: uberTypography.bodyLg.lineHeight,
    fontFamily: uberTypography.bodyLg.fontFamily,
  },
  bodyMd: {
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: uberTypography.bodyMd.fontWeight,
    lineHeight: uberTypography.bodyMd.lineHeight,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  bodyMdStrong: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: uberTypography.bodyMdStrong.fontWeight,
    lineHeight: uberTypography.bodyMdStrong.lineHeight,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
  },
  bodySm: {
    fontSize: uberTypography.bodySm.fontSize,
    fontWeight: uberTypography.bodySm.fontWeight,
    lineHeight: uberTypography.bodySm.lineHeight,
    fontFamily: uberTypography.bodySm.fontFamily,
  },
  bodySmStrong: {
    fontSize: uberTypography.bodySmStrong.fontSize,
    fontWeight: uberTypography.bodySmStrong.fontWeight,
    lineHeight: uberTypography.bodySmStrong.lineHeight,
    fontFamily: uberTypography.bodySmStrong.fontFamily,
  },
  caption: {
    fontSize: uberTypography.caption.fontSize,
    fontWeight: uberTypography.caption.fontWeight,
    lineHeight: uberTypography.caption.lineHeight,
    fontFamily: uberTypography.caption.fontFamily,
  },
  buttonLarge: {
    fontSize: uberTypography.buttonLarge.fontSize,
    fontWeight: uberTypography.buttonLarge.fontWeight,
    lineHeight: uberTypography.buttonLarge.lineHeight,
    fontFamily: uberTypography.buttonLarge.fontFamily,
  },
  buttonMd: {
    fontSize: uberTypography.buttonMd.fontSize,
    fontWeight: uberTypography.buttonMd.fontWeight,
    lineHeight: uberTypography.buttonMd.lineHeight,
    fontFamily: uberTypography.buttonMd.fontFamily,
  },
});
