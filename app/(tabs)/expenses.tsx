import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DateRangePicker from "@/components/DateRangePicker";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TabAnimatedView from "@/components/ui/tab-animated-view";
import { useTabDirection } from "@/components/ui/tab-direction";
import { SkeletonCard, UberSkeleton } from "@/components/ui/uber-skeleton";
import { getExpensesGroupedByCategory } from "@/db/index";
import { uberColors, uberRounded, uberSpacing, uberTypography } from "@/constants/theme";
import { UberEmptyState } from "@/components/ui/uber-empty-state";

export default function ExpensesScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groups, setGroups] = useState<
    { category: string | null; total: number; count: number }[]
  >([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    const s = startDate || undefined;
    const e = endDate || undefined;
    getExpensesGroupedByCategory(s, e).then((result) => {
      setGroups(result);
      const all = result.reduce((sum, g) => sum + g.total, 0);
      setTotalExpenses(all);
      setLoading(false);
    });
  }, [startDate, endDate]);

  useEffect(() => {
    if (isFocused) {
      loadData();
      setIndex(3);
    }
  }, [isFocused, loadData, setIndex]);

  const openCategoryExpenses = (category: string | null) => {
    router.push(
      `/expense-detail?category=${encodeURIComponent(category ?? "")}` as any,
    );
  };

  const renderCategory = ({
    item,
  }: {
    item: { category: string | null; total: number; count: number };
  }) => (
    <Pressable
      style={({ pressed }) => [
        styles.categoryCard,
        pressed && styles.categoryCardPressed,
      ]}
      onPress={() => openCategoryExpenses(item.category)}
    >
      <View style={styles.categoryHeader}>
        <View style={styles.categoryIcon}>
          <Ionicons
            name={
              item.category === "Rent"
                ? "home-outline"
                : item.category === "Utilities"
                ? "flash-outline"
                : item.category === "Office Supplies"
                ? "cube-outline"
                : "card-outline"
            }
            size={18}
            color={uberColors.ink}
          />
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>
            {item.category ?? "Uncategorized"}
          </Text>
          <Text style={styles.categoryCount}>{item.count} entries</Text>
        </View>
        <Text style={styles.categoryTotal}>
          ${item.total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="displayLg">Expenses</ThemedText>

          {loading ? (
            <>
              {/* Skeleton for total card */}
              <UberSkeleton variant="rect" width="100%" height={100} style={{ borderRadius: uberRounded.xl }} />
              <SkeletonCard variant="list" />
            </>
          ) : (
            <>
              {/* Total — Uber black card */}
              <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>
                  {startDate || endDate ? "Total (filtered)" : "Total expenses"}
                </Text>
                <Text style={styles.totalValue}>
                  ${totalExpenses.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>

              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />

              <FlatList
                data={groups}
                keyExtractor={(item) => item.category ?? "__uncategorized"}
                renderItem={renderCategory}
                ListEmptyComponent={
                  <UberEmptyState
                    icon="card-outline"
                    title="No expenses found"
                    description={
                      startDate || endDate
                        ? "No expenses in this date range."
                        : "Tap the + button on the home screen to add your first expense."
                    }
                  />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </ThemedView>
      </TabAnimatedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: uberSpacing.lg, gap: uberSpacing.md },
  totalCard: {
    backgroundColor: uberColors.primary,
    borderRadius: uberRounded.xl,
    padding: uberSpacing["2xl"],
    alignItems: "center",
  },
  totalLabel: {
    fontSize: uberTypography.caption.fontSize,
    fontWeight: "500",
    color: uberColors.mute,
    fontFamily: uberTypography.caption.fontFamily,
  },
  totalValue: {
    fontSize: uberTypography.displayMd.fontSize,
    fontWeight: uberTypography.displayMd.fontWeight,
    color: uberColors.onDark,
    fontFamily: uberTypography.displayMd.fontFamily,
    marginTop: uberSpacing.xxs,
  },
  listContent: { flexGrow: 1, gap: uberSpacing.sm, paddingBottom: 24 },
  categoryCard: {
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.lg,
    padding: uberSpacing.lg,
  },
  categoryCardPressed: { opacity: 0.7 },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: uberSpacing.md,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: uberRounded.full,
    backgroundColor: uberColors.canvas,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryInfo: { flex: 1, gap: 2 },
  categoryName: {
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: "600",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  categoryCount: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
  },
  categoryTotal: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: "700",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
  },
});
