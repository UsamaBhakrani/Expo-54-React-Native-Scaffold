import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type StatsCapsule = {
  title: string;
  value: string;
  color: string;
};

const CAPSULES_DATA: StatsCapsule[] = [
  {
    title: "Cashflow",
    value: "$12.4K",
    color: "#0ea5e9",
  },
  {
    title: "Expenses",
    value: "$18.8K",
    color: "#7c3aed",
  },
  {
    title: "Payments",
    value: "$5.8K",
    color: "#22c55e",
  },
  {
    title: "Stock",
    value: "1.2K units",
    color: "#f97316",
  },
];

export default function StatsCapsules() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={styles.container}>
      {CAPSULES_DATA.map((capsule) => (
        <View
          key={capsule.title}
          style={[
            styles.capsule,
            {
              backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
              borderLeftColor: capsule.color,
            },
          ]}
        >
          <Text
            style={[styles.title, { color: isDark ? "#e5e7eb" : "#374151" }]}
          >
            {capsule.title}
          </Text>
          <Text style={[styles.value, { color: capsule.color }]}>
            {capsule.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 8,
  },
  container: {
    flexDirection: "row",
    gap: 12,
  },
  capsule: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    minWidth: 140,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
