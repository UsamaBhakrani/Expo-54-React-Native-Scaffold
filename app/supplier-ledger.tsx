import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { evolu } from "@/db/evolu-provider";

import * as Evolu from "@evolu/common";
import { useQuery } from "@evolu/react";

export const options = { headerShown: false };

type TransactionRow = {
  id: string;
  supplierId: string;
  date: string;
  narration: string;
  debit: number | null;
  credit: number | null;
  balance: number;
};

export default function SupplierLedgerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const supplierQuery = useMemo(
    () =>
      evolu.createQuery((db) =>
        db
          .selectFrom("supplier")
          .select(["companyName", "contactName"])
          .where("id", "=", (id ?? "") as any)
          .where("isDeleted", "is not", Evolu.sqliteTrue),
      ),
    [id],
  );
  const supplierData = useQuery(supplierQuery);
  const supplier = (supplierData?.[0] as { companyName: string; contactName: string | null } | undefined) ?? null;

  const txnQuery = useMemo(
    () =>
      evolu.createQuery((db) =>
        db
          .selectFrom("supplierTransaction")
          .selectAll()
          .where("supplierId", "=", (id ?? "") as any)
          .where("isDeleted", "is not", Evolu.sqliteTrue)
          .orderBy("date", "asc"),
      ),
    [id],
  );
  const transactions = useQuery(txnQuery);
  const txnList = (transactions as unknown as TransactionRow[]) || [];

  const formatCurrency = (val: number | null) => {
    if (val === null || val === undefined) return "—";
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const renderTransaction = ({ item }: { item: TransactionRow }) => (
    <View style={styles.transactionRow}>
      <Text style={styles.dateCell}>{item.date}</Text>
      <Text style={styles.narrationCell} numberOfLines={2}>{item.narration}</Text>
      <Text style={[styles.amountCell, styles.debitCell]}>{item.debit ? formatCurrency(item.debit) : "—"}</Text>
      <Text style={[styles.amountCell, styles.creditCell]}>{item.credit ? formatCurrency(item.credit) : "—"}</Text>
      <Text style={[styles.amountCell, styles.balanceCell]}>{formatCurrency(item.balance)}</Text>
    </View>
  );

  const renderEmptyLedger = () => { return (
      <View style={styles.emptyState}>
        <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
        <Text style={styles.emptyTitle}>No transactions yet</Text>
        <Text style={styles.emptyText}>Transactions for this supplier will appear here once recorded.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{supplier?.companyName ?? "Supplier Ledger"}</Text>
            {supplier?.contactName ? <Text style={styles.headerSubtitle}>{supplier.contactName}</Text> : null}
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.dateCol]}>Date</Text>
          <Text style={[styles.tableHeaderCell, styles.narrationCol]}>Narration</Text>
          <Text style={[styles.tableHeaderCell, styles.amountCol]}>Debit</Text>
          <Text style={[styles.tableHeaderCell, styles.amountCol]}>Credit</Text>
          <Text style={[styles.tableHeaderCell, styles.amountCol]}>Balance</Text>
        </View>

        <FlatList
          data={txnList}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          ListEmptyComponent={renderEmptyLedger}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center" },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  headerSubtitle: { fontSize: 13, color: "#64748b", marginTop: 1 },
  tableHeader: { flexDirection: "row", paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#f1f5f9", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  tableHeaderCell: { fontSize: 12, fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  dateCol: { width: 76 },
  narrationCol: { flex: 1 },
  amountCol: { width: 72, textAlign: "right" },
  transactionRow: { flexDirection: "row", paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f1f5f9", backgroundColor: "#fff", alignItems: "center" },
  dateCell: { width: 76, fontSize: 12, color: "#475569", fontFamily: "monospace" },
  narrationCell: { flex: 1, fontSize: 13, color: "#0f172a", paddingRight: 8 },
  amountCell: { width: 72, fontSize: 12, fontFamily: "monospace", textAlign: "right" },
  debitCell: { color: "#dc2626" },
  creditCell: { color: "#16a34a" },
  balanceCell: { color: "#0f172a", fontWeight: "600" },
  listContent: { flexGrow: 1, paddingBottom: 24 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 80 },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: "#64748b", marginTop: 6 },
  emptyText: { fontSize: 14, color: "#94a3b8", textAlign: "center", paddingHorizontal: 40 },
});
