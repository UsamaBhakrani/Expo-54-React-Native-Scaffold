import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DateRangePicker from "@/components/DateRangePicker";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TabAnimatedView from "@/components/ui/tab-animated-view";
import { useTabDirection } from "@/components/ui/tab-direction";
import { getExpensesGroupedByCategory } from "@/db/index";

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

  const loadData = useCallback(() => {
    const s = startDate || undefined;
    const e = endDate || undefined;
    getExpensesGroupedByCategory(s, e).then((result) => {
      setGroups(result);
      const all = result.reduce((sum, g) => sum + g.total, 0);
      setTotalExpenses(all);
    });
  }, [startDate, endDate]);

  useEffect(() => {
    if (isFocused) {
      loadData();
      setIndex(3);
    }
  }, [isFocused, loadData, setIndex]);

  const openExpenseDetail = (id: number) => {
    router.push(`/expense-detail?id=${id}` as any);
  };

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
            color="#64748b"
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

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Ionicons name="card-outline" size={48} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>No expenses found</Text>
      <Text style={styles.emptyText}>
        {startDate || endDate
          ? "No expenses in this date range."
          : "Tap the + button to add your first expense."}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Expenses</ThemedText>

          {/* Total Expenses Card */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>
              {startDate || endDate ? "Total (filtered)" : "Total Expenses"}
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
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </ThemedView>
      </TabAnimatedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16, gap: 12 },
  totalCard: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    marginTop: 4,
  },
  listContent: { flexGrow: 1, gap: 8, paddingBottom: 24 },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  categoryCardPressed: { opacity: 0.7 },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryInfo: { flex: 1, gap: 2 },
  categoryName: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
  categoryCount: { fontSize: 12, color: "#94a3b8" },
  categoryTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#dc2626",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 80,
  },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: "#64748b" },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
