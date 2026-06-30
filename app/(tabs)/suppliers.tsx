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
import { getAllSuppliers, getSupplierBalance, type Supplier } from "@/db/index";

export default function SuppliersScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [supplierList, setSupplierList] = useState<
    (Supplier & { balance: number })[]
  >([]);

  const loadData = useCallback(() => {
    getAllSuppliers().then((suppliers) => {
      Promise.all(
        suppliers.map((s) =>
          getSupplierBalance(
            s.id,
            startDate || undefined,
            endDate || undefined,
          ).then((balance) => ({ ...s, balance })),
        ),
      ).then(setSupplierList);
    });
  }, [startDate, endDate]);

  useEffect(() => {
    if (isFocused) {
      loadData();
      setIndex(2);
    }
  }, [isFocused, loadData, setIndex]);

  const openLedger = (id: number) => {
    router.push(
      `/supplier-ledger?id=${id}&startDate=${startDate}&endDate=${endDate}` as any,
    );
  };

  const renderSupplier = ({
    item,
  }: {
    item: Supplier & { balance: number };
  }) => (
    <Pressable
      style={({ pressed }) => [
        styles.supplierCard,
        pressed && styles.supplierCardPressed,
      ]}
      onPress={() => openLedger(item.id)}
    >
      <View style={styles.supplierAvatar}>
        <Ionicons name="business-outline" size={22} color="#0f766e" />
      </View>
      <View style={styles.supplierInfo}>
        <Text style={styles.supplierName}>{item.companyName}</Text>
        {item.contactName ? (
          <Text style={styles.supplierDetail}>{item.contactName}</Text>
        ) : null}
        {item.email || item.phone ? (
          <Text style={styles.supplierSubDetail}>
            {[item.email, item.phone].filter(Boolean).join(" · ")}
          </Text>
        ) : null}
      </View>
      <View style={styles.balanceSection}>
        <Text
          style={[
            styles.balanceAmount,
            item.balance > 0 && styles.balanceDebit,
            item.balance < 0 && styles.balanceCredit,
            item.balance === 0 && styles.balanceZero,
          ]}
        >
          {item.balance > 0
            ? `$${item.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            : item.balance < 0
              ? `-$${Math.abs(item.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : "$0.00"}
        </Text>
        <Text style={styles.balanceLabel}>
          {item.balance > 0 ? "Dr" : item.balance < 0 ? "Cr" : ""}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
    </Pressable>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Ionicons name="briefcase-outline" size={48} color="#94a3b8" />
      <ThemedText style={styles.emptyTitle}>No suppliers yet</ThemedText>
      <ThemedText style={styles.emptyText}>
        Tap the + button on the home screen to add your first supplier.
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Suppliers</ThemedText>

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          <FlatList
            data={supplierList}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderSupplier}
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
  listContent: { flexGrow: 1, gap: 10, paddingBottom: 24 },
  supplierCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  supplierCardPressed: { opacity: 0.7, backgroundColor: "#f1f5f9" },
  supplierAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
  },
  supplierInfo: { flex: 1, gap: 2 },
  supplierName: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  supplierDetail: { fontSize: 13, color: "#475569" },
  supplierSubDetail: { fontSize: 12, color: "#94a3b8", marginTop: 1 },
  balanceSection: { alignItems: "flex-end", gap: 1 },
  balanceAmount: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  balanceDebit: { color: "#dc2626" },
  balanceCredit: { color: "#16a34a" },
  balanceZero: { color: "#94a3b8" },
  balanceLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
