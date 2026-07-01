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
import { SkeletonCard } from "@/components/ui/uber-skeleton";
import { getAllSuppliers, getSupplierBalance, type Supplier } from "@/db/index";
import { uberColors, uberRounded, uberSpacing, uberTypography } from "@/constants/theme";
import { UberEmptyState } from "@/components/ui/uber-empty-state";

export default function SuppliersScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [supplierList, setSupplierList] = useState<
    (Supplier & { balance: number })[]
  >([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    getAllSuppliers().then((suppliers) => {
      Promise.all(
        suppliers.map((s) =>
          getSupplierBalance(
            s.id,
            startDate || undefined,
            endDate || undefined,
          ).then((balance) => ({ ...s, balance })),
        ),
      ).then((data) => {
        setSupplierList(data);
        setLoading(false);
      });
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
      <View style={styles.supplierIcon}>
        <Ionicons name="business-outline" size={20} color={uberColors.ink} />
      </View>
      <View style={styles.supplierInfo}>
        <Text style={styles.supplierName}>{item.companyName}</Text>
        {item.contactName ? (
          <Text style={styles.supplierDetail}>{item.contactName}</Text>
        ) : null}
      </View>
      <View style={styles.balanceSection}>
        <Text
          style={[
            styles.balanceAmount,
            item.balance > 0 && styles.balanceDebit,
            item.balance < 0 && styles.balanceCredit,
          ]}
        >
          {item.balance > 0
            ? `Rs ${item.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            : item.balance < 0
              ? `-Rs ${Math.abs(item.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : "Rs 0.00"}
        </Text>
        <Text style={styles.balanceLabel}>
          {item.balance > 0 ? "Dr" : item.balance < 0 ? "Cr" : ""}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={uberColors.mute} />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="displayLg">Suppliers</ThemedText>

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          {loading ? (
            <SkeletonCard variant="list" />
          ) : (
            <FlatList
              data={supplierList}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderSupplier}
              ListEmptyComponent={
                <UberEmptyState
                  icon="briefcase-outline"
                  title="No suppliers yet"
                  description="Tap the + button on the home screen to add your first supplier."
                />
              }
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </ThemedView>
      </TabAnimatedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: uberSpacing.lg, gap: uberSpacing.md },
  listContent: { flexGrow: 1, gap: uberSpacing.sm, paddingBottom: 24 },
  supplierCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.lg,
    padding: uberSpacing.lg,
    gap: uberSpacing.md,
  },
  supplierCardPressed: { opacity: 0.7 },
  supplierIcon: {
    width: 40,
    height: 40,
    borderRadius: uberRounded.full,
    backgroundColor: uberColors.canvas,
    alignItems: "center",
    justifyContent: "center",
  },
  supplierInfo: { flex: 1, gap: 2 },
  supplierName: {
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: "600",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  supplierDetail: {
    fontSize: uberTypography.bodySm.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.bodySm.fontFamily,
  },
  balanceSection: { alignItems: "flex-end", gap: 1 },
  balanceAmount: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: "700",
    fontFamily: "UberMoveText, monospace",
  },
  balanceDebit: { color: uberColors.ink },
  balanceCredit: { color: uberColors.body },
  balanceLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: uberColors.mute,
    textTransform: "uppercase",
    fontFamily: uberTypography.caption.fontFamily,
  },
});
