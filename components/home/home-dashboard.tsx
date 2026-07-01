import ChartCard from "@/components/home/chart-card";
import type { StatsCapsule } from "@/components/home/stats-capsules";
import StatsCapsules from "@/components/home/stats-capsules";
import { SkeletonCard } from "@/components/ui/uber-skeleton";
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
  uberColors,
  uberRounded,
  uberShadows,
  uberSpacing,
  uberTypography,
} from "@/constants/theme";
import {
  getAllCustomers,
  getAllExpenses,
  getAllInvoices,
  getAllSuppliers,
  getTotalSupplierBalance,
} from "@/db/index";

const CHART_MODES = [
  {
    id: "Expenses",
    label: "Expenses",
    icon: "trending-down",
    color: "#000000",
  },
  {
    id: "Cashflow",
    label: "Cashflow",
    icon: "swap-horizontal",
    color: "#000000",
  },
];

const TAB_WIDTH = 80;

const chartData: Record<
  string,
  { subtitle: string; value: string; caption: string; data: number[] }
> = {
  Expenses: {
    subtitle: "Monthly spend",
    value: "Rs 18.8K",
    caption: "Tap to preview values",
    data: [4200, 3900, 4800, 4350, 4700, 5100, 4950],
  },
  Cashflow: {
    subtitle: "Net inflow",
    value: "Rs 12.4K",
    caption: "Swipe between categories",
    data: [3100, 2900, 3350, 3500, 3650, 3900, 4200],
  },
};

const menuOptions = [
  {
    label: "Create Invoice",
    icon: "document-text-outline",
    route: "/create-invoice",
    color: "#000000",
  },
  {
    label: "Create Customer",
    icon: "people-outline",
    route: "/create-customer",
    color: "#000000",
  },
  {
    label: "Create Supplier",
    icon: "briefcase-outline",
    route: "/create-supplier",
    color: "#000000",
  },
  {
    label: "Create Product",
    icon: "cube-outline",
    route: "/create-product",
    color: "#000000",
  },
  {
    label: "Create Expense",
    icon: "cash-outline",
    route: "/create-expense",
    color: "#000000",
  },
  {
    label: "Create Purchase",
    icon: "cart-outline",
    route: "/create-purchase",
    color: "#000000",
  },
];

export default function HomeDashboard() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [capsules, setCapsules] = useState<StatsCapsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState("Expenses");
  const [tabLayouts, setTabLayouts] = useState<{ x: number; width: number }[]>(
    [],
  );
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(TAB_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const menuTranslateY = useRef(new Animated.Value(20)).current;
  const fabRotation = useRef(new Animated.Value(0)).current;

  const loadStats = useCallback(() => {
    setLoading(true);
    Promise.all([
      getAllSuppliers(),
      getAllCustomers(),
      getAllExpenses(),
      getAllInvoices(),
      getTotalSupplierBalance(),
    ]).then(([suppliers, customers, expenses, invoices, owedToSuppliers]) => {
      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
      const receivables = invoices
        .filter((inv) => inv.status !== "paid")
        .reduce((sum, inv) => sum + inv.amount, 0);
      const fmt = (n: number) =>
        n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

      setCapsules([
        {
          title: "Owed to Suppliers",
          value: `Rs ${fmt(Math.max(owedToSuppliers, 0))}`,
          subtitle: `${suppliers.length} supplier${suppliers.length !== 1 ? "s" : ""}`,
          color: uberColors.primary,
        },
        {
          title: "Receivables",
          value: `Rs ${fmt(receivables)}`,
          subtitle: `${customers.length} customer${customers.length !== 1 ? "s" : ""}`,
          color: uberColors.primary,
        },
        {
          title: "Expenses",
          value: `Rs ${fmt(totalExpenses)}`,
          subtitle: `${expenses.length} entr${expenses.length !== 1 ? "ies" : "y"}`,
          color: uberColors.primary,
        },
        {
          title: "Invoiced",
          value: `Rs ${fmt(totalInvoiced)}`,
          subtitle: `${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}`,
          color: uberColors.primary,
        },
      ]);
      setLoading(false);
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
  const activeColor = "#000000";
  const activeIndex = CHART_MODES.findIndex((m) => m.id === activeMode);

  useEffect(() => {
    if (tabLayouts[activeIndex]) {
      const { x, width } = tabLayouts[activeIndex];
      Animated.parallel([
        Animated.timing(indicatorAnim, {
          toValue: x,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(indicatorWidth, {
          toValue: width,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
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
        {loading ? (
          <>
            <SkeletonCard variant="stats" />
            <View style={{ marginTop: uberSpacing.sm }} />
            <SkeletonCard variant="chart" />
          </>
        ) : (
          <>
            <StatsCapsules data={capsules.length > 0 ? capsules : undefined} />

            {/* Uber-style tab bar with animated pill indicator */}
            <View style={styles.tabBarWrapper}>
              <View style={styles.tabBar}>
                <Animated.View
                  style={[
                    styles.tabIndicator,
                    {
                      transform: [{ translateX: indicatorAnim }],
                      width: indicatorWidth,
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
                          isActive && styles.tabTextActive,
                        ]}
                      >
                        {mode.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <ChartCard
              key={activeMode}
              title={activeMode}
              subtitle={selected.subtitle}
              value={selected.value}
              caption={selected.caption}
              data={selected.data}
              color={activeColor}
            />
          </>
        )}
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
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
          >
            <View style={styles.menuIcon}>
              <Ionicons
                name={option.icon as never}
                size={18}
                color={uberColors.ink}
              />
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
          <Ionicons name="add" size={26} color={uberColors.onPrimary} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    paddingVertical: uberSpacing["2xl"],
    paddingHorizontal: uberSpacing.lg,
    alignItems: "center",
  },
  tabBarWrapper: {
    width: "100%",
    marginTop: uberSpacing.sm,
    marginBottom: uberSpacing.xxs,
  },
  tabBar: {
    flexDirection: "row",
    position: "relative",
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.pill,
    padding: 3,
  },
  tabIndicator: {
    position: "absolute",
    top: 3,
    bottom: 3,
    left: 3,
    borderRadius: uberRounded.pillTab,
    backgroundColor: uberColors.primary,
  },
  tabTrigger: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: uberSpacing.sm,
    paddingHorizontal: uberSpacing.xxs,
    zIndex: 1,
  },
  tabText: {
    fontSize: uberTypography.bodySmStrong.fontSize,
    fontWeight: uberTypography.bodySmStrong.fontWeight,
    color: uberColors.body,
    fontFamily: uberTypography.bodySmStrong.fontFamily,
  },
  tabTextActive: {
    color: uberColors.onPrimary,
    fontWeight: "700",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  menuContainer: {
    position: "absolute",
    right: uberSpacing.lg,
    bottom: 92,
    width: 220,
    padding: uberSpacing.sm,
    borderRadius: uberRounded.xl,
    backgroundColor: uberColors.canvas,
    gap: uberSpacing.sm,
    ...uberShadows.level2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: uberSpacing.md,
    paddingVertical: uberSpacing.sm,
    paddingHorizontal: uberSpacing.sm,
    borderRadius: uberRounded.pill,
  },
  menuItemPressed: {
    backgroundColor: uberColors.canvasSoft,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: uberColors.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    color: uberColors.ink,
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: "500",
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  fab: {
    position: "absolute",
    right: uberSpacing.xl,
    bottom: uberSpacing["2xl"],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: uberColors.primary,
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
