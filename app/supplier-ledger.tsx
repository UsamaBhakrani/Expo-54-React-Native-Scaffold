import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DateRangePicker from "@/components/DateRangePicker";
import {
  getSupplierById,
  getTransactionsBySupplier,
  getSupplierBalance,
  updateSupplierTransaction,
  type Supplier,
  type SupplierTransaction,
} from "@/db/index";

export const options = { headerShown: false };

export default function SupplierLedgerScreen() {
  const { id, startDate: initialStart, endDate: initialEnd } =
    useLocalSearchParams<{
      id: string;
      startDate?: string;
      endDate?: string;
    }>();
  const router = useRouter();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [transactions, setTransactions] = useState<SupplierTransaction[]>([]);
  const [balanceDisplay, setBalanceDisplay] = useState(0);
  const [startDate, setStartDate] = useState(initialStart ?? "");
  const [endDate, setEndDate] = useState(initialEnd ?? "");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    narration: "",
    debit: "",
    credit: "",
  });

  const loadData = useCallback(() => {
    if (!id) return;
    getSupplierById(Number(id)).then((sup: Supplier | undefined) =>
      setSupplier(sup ?? null),
    );

    getTransactionsBySupplier(
      Number(id),
      startDate || undefined,
      endDate || undefined,
    ).then((txns) => setTransactions(txns));

    getSupplierBalance(
      Number(id),
      startDate || undefined,
      endDate || undefined,
    ).then((bal) => setBalanceDisplay(bal));
  }, [id, startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const startEditing = (txn: SupplierTransaction) => {
    setEditingId(txn.id);
    setEditForm({
      date: txn.date,
      narration: txn.narration,
      debit: txn.debit ? String(txn.debit) : "",
      credit: txn.credit ? String(txn.credit) : "",
    });
  };

  const saveEdit = () => {
    if (editingId === null) return;
    updateSupplierTransaction(editingId, {
      date: editForm.date,
      narration: editForm.narration,
      debit: editForm.debit ? Number(editForm.debit) : null,
      credit: editForm.credit ? Number(editForm.credit) : null,
    });
    setEditingId(null);
    loadData();
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const formatCurrency = (val: number | null) => {
    if (val === null || val === undefined) return "—";
    return val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const renderTransaction = ({ item }: { item: SupplierTransaction }) => {
    const isEditing = editingId === item.id;

    if (isEditing) {
      return (
        <View style={styles.editRow}>
          <TextInput
            style={[styles.editInput, { width: 72 }]}
            value={editForm.date}
            onChangeText={(v) => setEditForm((f) => ({ ...f, date: v }))}
            placeholder="YYYY-MM-DD"
          />
          <TextInput
            style={[styles.editInput, styles.editNarration]}
            value={editForm.narration}
            onChangeText={(v) => setEditForm((f) => ({ ...f, narration: v }))}
          />
          <TextInput
            style={[styles.editInput, styles.editAmount]}
            value={editForm.debit}
            onChangeText={(v) => setEditForm((f) => ({ ...f, debit: v }))}
            keyboardType="decimal-pad"
            placeholder="0"
          />
          <TextInput
            style={[styles.editInput, styles.editAmount]}
            value={editForm.credit}
            onChangeText={(v) => setEditForm((f) => ({ ...f, credit: v }))}
            keyboardType="decimal-pad"
            placeholder="0"
          />
          <View style={styles.editActions}>
            <Pressable onPress={saveEdit} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>✓</Text>
            </Pressable>
            <Pressable onPress={cancelEdit} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>✕</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <Pressable
        style={styles.transactionRow}
        onPress={() => startEditing(item)}
      >
        <Text style={styles.dateCell}>{item.date}</Text>
        <Text style={styles.narrationCell} numberOfLines={2}>
          {item.narration}
        </Text>
        <Text style={[styles.amountCell, styles.debitCell]}>
          {item.debit ? formatCurrency(item.debit) : "—"}
        </Text>
        <Text style={[styles.amountCell, styles.creditCell]}>
          {item.credit ? formatCurrency(item.credit) : "—"}
        </Text>
        <Text style={[styles.amountCell, styles.balanceCell]}>
          {formatCurrency(item.balance)}
        </Text>
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>No transactions yet</Text>
      <Text style={styles.emptyText}>
        Transactions for this supplier will appear here once recorded.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              {supplier?.companyName ?? "Supplier Ledger"}
            </Text>
            {supplier?.contactName ? (
              <Text style={styles.headerSubtitle}>
                {supplier.contactName}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Balance Card */}
        <View
          style={[
            styles.balanceCard,
            balanceDisplay > 0 && styles.balanceCardDebit,
            balanceDisplay < 0 && styles.balanceCardCredit,
          ]}
        >
          <Text style={styles.balanceCardLabel}>Balance</Text>
          <Text
            style={[
              styles.balanceCardAmount,
              balanceDisplay > 0 && styles.balanceDebitText,
              balanceDisplay < 0 && styles.balanceCreditText,
            ]}
          >
            {balanceDisplay > 0
              ? `$${balanceDisplay.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : balanceDisplay < 0
              ? `-$${Math.abs(balanceDisplay).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : "$0.00"}
          </Text>
          <Text style={styles.balanceCardLabel}>
            {balanceDisplay > 0
              ? "You are owed (Debit)"
              : balanceDisplay < 0
              ? "You owe (Credit)"
              : "Settled"}
          </Text>
        </View>

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.dateCol]}>Date</Text>
          <Text style={[styles.tableHeaderCell, styles.narrationCol]}>
            Narration
          </Text>
          <Text style={[styles.tableHeaderCell, styles.amountCol]}>Debit</Text>
          <Text style={[styles.tableHeaderCell, styles.amountCol]}>Credit</Text>
          <Text style={[styles.tableHeaderCell, styles.amountCol]}>Bal</Text>
        </View>

        <FlatList
          data={transactions}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTransaction}
          ListEmptyComponent={renderEmpty}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  headerSubtitle: { fontSize: 13, color: "#64748b", marginTop: 1 },
  balanceCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  balanceCardDebit: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  balanceCardCredit: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  balanceCardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  balanceCardAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0f172a",
    marginVertical: 4,
  },
  balanceDebitText: { color: "#dc2626" },
  balanceCreditText: { color: "#16a34a" },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateCol: { width: 72 },
  narrationCol: { flex: 1 },
  amountCol: { width: 64, textAlign: "right" },
  transactionRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  dateCell: {
    width: 72,
    fontSize: 11,
    color: "#475569",
    fontFamily: "monospace",
  },
  narrationCell: { flex: 1, fontSize: 13, color: "#0f172a", paddingRight: 8 },
  amountCell: { width: 64, fontSize: 12, fontFamily: "monospace", textAlign: "right" },
  debitCell: { color: "#dc2626" },
  creditCell: { color: "#16a34a" },
  balanceCell: { color: "#0f172a", fontWeight: "600" },
  listContent: { flexGrow: 1, paddingBottom: 24 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 80,
  },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: "#64748b", marginTop: 6 },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  // Edit mode styles
  editRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#fffbeb",
    borderBottomWidth: 1,
    borderBottomColor: "#fde68a",
    alignItems: "center",
    gap: 4,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 11,
    fontFamily: "monospace",
    backgroundColor: "#fff",
  },
  editNarration: { flex: 1 },
  editAmount: { width: 56, textAlign: "right" },
  editActions: { gap: 4, alignItems: "center" },
  saveBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  cancelBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#94a3b8",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
