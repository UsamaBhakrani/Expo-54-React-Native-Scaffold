import ChartCard from "@/components/home/chart-card";
import StatsCapsules from "@/components/home/stats-capsules";
import type { StatsCapsule } from "@/components/home/stats-capsules";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
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

const CHART_MODES = [
  {
    id: "Expenses",
    label: "Expenses",
    icon: "trending-down",
    color: "#7c3aed",
  },
  {
    id: "Cashflow",
    label: "Cashflow",
    icon: "swap-horizontal",
    color: "#0ea5e9",
  },
  {
    id: "Payments",
    label: "Payments",
    icon: "card",
    color: "#22c55e",
  },
  {
    id: "Stock",
    label: "Stock",
    icon: "cube",
    color: "#f97316",
  },
];

const TAB_WIDTH = 80;

const chartData: Record<string, { subtitle: string; value: string; caption: string; data: number[] }> = {
  Expenses: {
    subtitle: "Monthly spend",
    value: "$18.8K",
    caption: "Tap to preview values",
    data: [4200, 3900, 4800, 4350, 4700, 5100, 4950],
  },
  Cashflow: {
    subtitle: "Net inflow",
    value: "$12.4K",
    caption: "Swipe between categories",
    data: [3100, 2900, 3350, 3500, 3650, 3900, 4200],
  },
  Payments: {
    subtitle: "Collected this week",
    value: "$5.8K",
    caption: "Tap the chart for details",
    data: [700, 850, 900, 950, 800, 1050, 1200],
  },
  Stock: {
    subtitle: "On hand inventory",
    value: "1.2K units",
    caption: "Tap for current SKU details",
    data: [1200, 1150, 1180, 1210, 1190, 1225, 1240],
  },
};

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
  const [activeMode, setActiveMode] = useState("Expenses");
  const [tabLayouts, setTabLayouts] = useState<{ x: number; width: number }[]>([]);
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(TAB_WIDTH)).current;
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

  const selected = chartData[activeMode];
  const activeColor = CHART_MODES.find((m) => m.id === activeMode)?.color ?? "#7c3aed";
  const activeIndex = CHART_MODES.findIndex((m) => m.id === activeMode);

  // Animate indicator when active tab changes
  useEffect(() => {
    if (tabLayouts[activeIndex]) {
      const { x, width } = tabLayouts[activeIndex];
      Animated.parallel([
        Animated.timing(indicatorAnim, {
          toValue: x,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(indicatorWidth, {
          toValue: width,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeIndex, tabLayouts, indicatorAnim, indicatorWidth]);

  const onTabLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => {
      const updated = [...prev];
      updated[index] = { x, width };
      return updated;
    });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <StatsCapsules data={capsules.length > 0 ? capsules : undefined} />

        {/* Gluestack-style tab bar with animated indicator */}
        <View style={styles.tabBarWrapper}>
          <View style={styles.tabBar}>
            <Animated.View
              style={[
                styles.tabIndicator,
                {
                  transform: [{ translateX: indicatorAnim }],
                  width: indicatorWidth,
                  backgroundColor: activeColor,
                },
              ]}
            />
            {CHART_MODES.map((mode, index) => {
              const isActive = activeMode === mode.id;
              return (
                <Pressable
                  key={mode.id}
                  style={styles.tabTrigger}
                  onLayout={(e) => onTabLayout(index, e)}
                  onPress={() => setActiveMode(mode.id)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isActive && { color: activeColor, fontWeight: "700" },
                    ]}
                  >
                    {mode.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Single chart card for the active mode */}
        <ChartCard
          key={activeMode}
          title={activeMode}
          subtitle={selected.subtitle}
          value={selected.value}
          caption={selected.caption}
          data={selected.data}
          color={activeColor}
        />
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
  tabBarWrapper: {
    width: "100%",
    marginTop: 8,
    marginBottom: 4,
  },
  tabBar: {
    flexDirection: "row",
    position: "relative",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 3,
  },
  tabIndicator: {
    position: "absolute",
    top: 3,
    bottom: 3,
    left: 3,
    borderRadius: 8,
  },
  tabTrigger: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
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
