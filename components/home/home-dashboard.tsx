import ChartCard from "@/components/home/chart-card";
import StatsCapsules from "@/components/home/stats-capsules";
import type { StatsCapsule } from "@/components/home/stats-capsules";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getAllSuppliers,
  getAllCustomers,
  getAllExpenses,
  getAllInvoices,
} from "@/db/index";

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

const menuOptions = [
  {
    label: "Create Invoice",
    icon: "document-text-outline",
    route: "/create-invoice",
    color: "#2563eb",
  },
  {
    label: "Create Customer",
    icon: "people-outline",
    route: "/create-customer",
    color: "#7c3aed",
  },
  {
    label: "Create Supplier",
    icon: "briefcase-outline",
    route: "/create-supplier",
    color: "#0f766e",
  },
  {
    label: "Create Product",
    icon: "cube-outline",
    route: "/create-product",
    color: "#f97316",
  },
  {
    label: "Create Expense",
    icon: "cash-outline",
    route: "/create-expense",
    color: "#dc2626",
  },
  {
    label: "Create Purchase",
    icon: "cart-outline",
    route: "/create-purchase",
    color: "#0891b2",
  },
];

export default function HomeDashboard() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [capsules, setCapsules] = useState<StatsCapsule[]>([]);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const menuTranslateY = useRef(new Animated.Value(20)).current;
  const fabRotation = useRef(new Animated.Value(0)).current;

  const loadStats = useCallback(() => {
    Promise.all([
      getAllSuppliers(),
      getAllCustomers(),
      getAllExpenses(),
      getAllInvoices(),
    ]).then(([suppliers, customers, expenses, invoices]) => {
      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      setCapsules([
        {
          title: "Suppliers",
          value: String(suppliers.length),
          color: "#0f766e",
        },
        {
          title: "Customers",
          value: String(customers.length),
          color: "#7c3aed",
        },
        {
          title: "Expenses",
          value: `$${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 0 })}`,
          color: "#dc2626",
        },
        {
          title: "Invoices",
          value: String(invoices.length),
          color: "#2563eb",
        },
      ]);
    });
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: isMenuOpen ? 1 : 0,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(menuTranslateY, {
        toValue: isMenuOpen ? 0 : 20,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fabRotation, {
        toValue: isMenuOpen ? 1 : 0,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fabRotation, isMenuOpen, menuTranslateY, overlayOpacity]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleSelect = (route: string) => {
    setIsMenuOpen(false);
    router.push(route as any);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <StatsCapsules data={capsules.length > 0 ? capsules : undefined} />
        <View style={styles.grid}>
          {cards.map((card) => (
            <ChartCard key={card.title} {...card} />
          ))}
        </View>
      </ScrollView>

      {isMenuOpen ? (
        <Pressable
          style={styles.overlay}
          onPress={() => setIsMenuOpen(false)}
        />
      ) : null}

      <Animated.View
        pointerEvents={isMenuOpen ? "auto" : "none"}
        style={[
          styles.menuContainer,
          {
            opacity: overlayOpacity,
            transform: [{ translateY: menuTranslateY }],
          },
        ]}
      >
        {menuOptions.map((option) => (
          <Pressable
            key={option.label}
            accessibilityLabel={option.label}
            onPress={() => handleSelect(option.route)}
            style={styles.menuItem}
          >
            <View style={[styles.menuIcon, { backgroundColor: option.color }]}>
              <Ionicons name={option.icon as never} size={18} color="#fff" />
            </View>
            <Text style={styles.menuText}>{option.label}</Text>
          </Pressable>
        ))}
      </Animated.View>

      <Pressable
        accessibilityLabel={
          isMenuOpen ? "Close actions menu" : "Open actions menu"
        }
        onPress={toggleMenu}
        style={styles.fab}
      >
        <Animated.View
          style={{
            transform: [
              {
                rotate: fabRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "45deg"],
                }),
              },
            ],
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Animated.View>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(254, 254, 254, 0.47)",
  },
  menuContainer: {
    position: "absolute",
    right: 16,
    bottom: 92,
    width: 220,
    padding: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "600",
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
    zIndex: 2,
  },
});
