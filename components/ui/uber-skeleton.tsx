import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, type ViewStyle } from "react-native";

import { uberColors, uberRounded, uberSpacing } from "@/constants/theme";

type SkeletonVariant = "rect" | "circle" | "pill";

type UberSkeletonProps = {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number;
  style?: ViewStyle;
};

export function UberSkeleton({
  variant = "rect",
  width = "100%",
  height = 16,
  style,
}: UberSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  const borderRadius =
    variant === "circle"
      ? 9999
      : variant === "pill"
      ? 999
      : uberRounded.md;

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: uberColors.canvasSoft,
          opacity,
        },
        style,
      ]}
    />
  );
}

// ─── Composed skeleton blocks ──────────────────────────────────────

type SkeletonCardProps = {
  variant?: "list" | "stats" | "chart" | "form";
};

export function SkeletonCard({ variant = "list" }: SkeletonCardProps) {
  switch (variant) {
    case "stats":
      return (
        <View style={styles.statsRow}>
          {[0, 1, 2, 3].map((i) => (
            <UberSkeleton
              key={i}
              variant="rect"
              width="48%"
              height={76}
              style={{ borderRadius: uberRounded.lg }}
            />
          ))}
        </View>
      );
    case "chart":
      return (
        <View style={styles.chartBlock}>
          <UberSkeleton variant="pill" width={340} height={220} />
        </View>
      );
    case "list":
      return (
        <View style={styles.listBlock}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.listItem}>
              <UberSkeleton variant="circle" width={40} height={40} />
              <View style={styles.listItemContent}>
                <UberSkeleton width="70%" height={14} />
                <UberSkeleton width="45%" height={12} style={{ marginTop: uberSpacing.xxs }} />
              </View>
            </View>
          ))}
        </View>
      );
    case "form":
      return (
        <View style={styles.listBlock}>
          {[0, 1, 2, 3].map((i) => (
            <UberSkeleton key={i} variant="rect" height={52} style={{ marginBottom: uberSpacing.md }} />
          ))}
        </View>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: uberSpacing.sm,
  },
  chartBlock: {
    alignItems: "center",
    paddingVertical: uberSpacing.md,
  },
  listBlock: {
    gap: uberSpacing.sm,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: uberSpacing.md,
    padding: uberSpacing.lg,
  },
  listItemContent: {
    flex: 1,
    gap: 2,
  },
});
