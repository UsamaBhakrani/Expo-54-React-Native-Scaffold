import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { uberColors, uberRounded, uberSpacing, uberTypography, uberShadows } from "@/constants/theme";

type UberConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
};

export default function UberConfirmModal({
  visible,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive = true,
}: UberConfirmModalProps) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 9,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
    }
  }, [visible, fadeAnim, scaleAnim]);

  if (!visible) return null;

  return (
    <View style={[styles.overlay, { paddingTop: insets.top }]}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Icon */}
        <View style={[styles.iconCircle, destructive && styles.iconCircleDanger]}>
          <Ionicons
            name={destructive ? "trash-outline" : "warning-outline"}
            size={24}
            color={destructive ? "#dc2626" : uberColors.ink}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Message */}
        <Text style={styles.message}>{message}</Text>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.cancelBtn, pressed && styles.cancelBtnPressed]}
            onPress={onCancel}
          >
            <Text style={styles.cancelBtnText}>{cancelLabel}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.confirmBtn,
              destructive ? styles.confirmBtnDanger : styles.confirmBtnPrimary,
              pressed && (destructive ? styles.confirmBtnDangerPressed : styles.confirmBtnPrimaryPressed),
            ]}
            onPress={onConfirm}
          >
            <Ionicons
              name={destructive ? "trash-outline" : "checkmark-outline"}
              size={16}
              color={uberColors.onPrimary}
            />
            <Text style={styles.confirmBtnText}>{confirmLabel}</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
    padding: uberSpacing["2xl"],
  },
  // ─── Modal Card (ex-modal-card spec) ───────────────────────────
  card: {
    backgroundColor: uberColors.canvas,
    borderRadius: uberRounded.xl,
    padding: uberSpacing["2xl"],
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    gap: uberSpacing.md,
    ...uberShadows.level2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: uberColors.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: uberSpacing.xs,
  },
  iconCircleDanger: {
    backgroundColor: "#fef2f2",
  },
  title: {
    fontSize: uberTypography.displaySm.fontSize,
    fontWeight: uberTypography.displaySm.fontWeight,
    fontFamily: uberTypography.displaySm.fontFamily,
    color: uberColors.ink,
    textAlign: "center",
  },
  message: {
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: uberTypography.bodyMd.fontWeight,
    fontFamily: uberTypography.bodyMd.fontFamily,
    color: uberColors.body,
    textAlign: "center",
    lineHeight: uberTypography.bodyMd.lineHeight,
  },
  actions: {
    flexDirection: "row",
    gap: uberSpacing.sm,
    marginTop: uberSpacing.sm,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.pill,
    paddingVertical: uberSpacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnPressed: {
    backgroundColor: uberColors.surfacePressed,
  },
  cancelBtnText: {
    fontSize: uberTypography.buttonMd.fontSize,
    fontWeight: uberTypography.buttonMd.fontWeight,
    fontFamily: uberTypography.buttonMd.fontFamily,
    color: uberColors.ink,
  },
  confirmBtn: {
    flex: 1,
    flexDirection: "row",
    borderRadius: uberRounded.pill,
    paddingVertical: uberSpacing.md,
    alignItems: "center",
    justifyContent: "center",
    gap: uberSpacing.xs,
  },
  confirmBtnDanger: {
    backgroundColor: "#dc2626",
  },
  confirmBtnDangerPressed: {
    backgroundColor: "#b91c1c",
  },
  confirmBtnPrimary: {
    backgroundColor: uberColors.primary,
  },
  confirmBtnPrimaryPressed: {
    backgroundColor: uberColors.blackElevated,
  },
  confirmBtnText: {
    fontSize: uberTypography.buttonMd.fontSize,
    fontWeight: uberTypography.buttonMd.fontWeight,
    fontFamily: uberTypography.buttonMd.fontFamily,
    color: uberColors.onPrimary,
  },
});
