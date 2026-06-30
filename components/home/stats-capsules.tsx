import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { uberColors, uberRounded, uberSpacing, uberTypography } from "@/constants/theme";

export type StatsCapsule = {
  title: string;
  value: string;
  color: string;
};

type Props = {
  data?: StatsCapsule[];
};

const FALLBACK_DATA: StatsCapsule[] = [
  { title: "Suppliers", value: "0", color: uberColors.primary },
  { title: "Customers", value: "0", color: uberColors.primary },
  { title: "Expenses", value: "$0", color: uberColors.primary },
  { title: "Invoices", value: "0", color: uberColors.primary },
];

export default function StatsCapsules({ data }: Props) {
  const capsules = data ?? FALLBACK_DATA;

  return (
    <View style={styles.container}>
      {capsules.map((capsule) => (
        <View
          key={capsule.title}
          style={styles.capsule}
        >
          <Text style={styles.title}>{capsule.title}</Text>
          <Text style={styles.value}>{capsule.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: uberSpacing.sm,
  },
  capsule: {
    width: "48%",
    paddingVertical: uberSpacing.lg,
    paddingHorizontal: uberSpacing.lg,
    borderRadius: uberRounded.lg,
    backgroundColor: uberColors.canvasSoft,
    justifyContent: "center",
  },
  title: {
    fontSize: uberTypography.caption.fontSize,
    fontWeight: uberTypography.bodySmStrong.fontWeight,
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
    marginBottom: uberSpacing.xxs,
  },
  value: {
    fontSize: uberTypography.displaySm.fontSize,
    fontWeight: uberTypography.displaySm.fontWeight,
    color: uberColors.ink,
    fontFamily: uberTypography.displaySm.fontFamily,
  },
});
