import ChartCard from "@/components/home/chart-card";
import StatsCapsules from "@/components/home/stats-capsules";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const cards = [
  {
    title: "Expenses",
    subtitle: "Monthly spend",
    value: "$18.8K",
    caption: "Tap to preview values",
    color: "#7c3aed",
    data: [4200, 3900, 4800, 4350, 4700, 5100, 4950],
  },
  {
    title: "Cashflow",
    subtitle: "Net inflow",
    value: "$12.4K",
    caption: "Swipe between categories",
    color: "#0ea5e9",
    data: [3100, 2900, 3350, 3500, 3650, 3900, 4200],
  },
  {
    title: "Payments",
    subtitle: "Collected this week",
    value: "$5.8K",
    caption: "Tap the chart for details",
    color: "#22c55e",
    data: [700, 850, 900, 950, 800, 1050, 1200],
  },
  {
    title: "Stock",
    subtitle: "On hand inventory",
    value: "1.2K units",
    caption: "Tap for current SKU details",
    color: "#f97316",
    data: [1200, 1150, 1180, 1210, 1190, 1225, 1240],
  },
];

export default function HomeDashboard() {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <StatsCapsules />
        <View style={styles.grid}>
          {cards.map((card) => (
            <ChartCard key={card.title} {...card} />
          ))}
        </View>
      </ScrollView>

      <Pressable
        accessibilityLabel="Create new invoice"
        onPress={() => router.push("/create-invoice")}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  hero: {
    width: "100%",
    marginBottom: 16,
  },
  heading: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
  },
  description: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 22,
  },
  grid: {
    width: "100%",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
