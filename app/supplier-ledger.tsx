import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UberConfirmModal from "@/components/ui/uber-confirm-modal";

import DateRangePicker from "@/components/DateRangePicker";
import {
  getSupplierById, getTransactionsBySupplier, getSupplierBalance,
  updateSupplierTransaction, deleteSupplierTransaction, deleteSupplier,
  type Supplier, type SupplierTransaction,
} from "@/db/index";
import { uberColors, uberRounded, uberSpacing, uberTypography, uberShadows } from "@/constants/theme";
import { UberEmptyState } from "@/components/ui/uber-empty-state";
import { UberHeader } from "@/components/ui/uber-header";

export const options = { headerShown: false };

export default function SupplierLedgerScreen() {
  const { id, startDate: initialStart, endDate: initialEnd } = useLocalSearchParams<{
    id: string; startDate?: string; endDate?: string;
  }>();
  const router = useRouter();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [transactions, setTransactions] = useState<SupplierTransaction[]>([]);
  const [balanceDisplay, setBalanceDisplay] = useState(0);
  const [startDate, setStartDate] = useState(initialStart ?? "");
  const [endDate, setEndDate] = useState(initialEnd ?? "");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ date: "", narration: "", debit: "", credit: "" });
  const [showDeleteSupplierModal, setShowDeleteSupplierModal] = useState(false);
  const [showDeleteTxnModal, setShowDeleteTxnModal] = useState(false);
  const [pendingDeleteTxnId, setPendingDeleteTxnId] = useState<number | null>(null);

  const loadData = useCallback(() => {
    if (!id) return;
    getSupplierById(Number(id)).then((sup: Supplier | undefined) => setSupplier(sup ?? null));
    getTransactionsBySupplier(Number(id), startDate || undefined, endDate || undefined).then(setTransactions);
    getSupplierBalance(Number(id), startDate || undefined, endDate || undefined).then(setBalanceDisplay);
  }, [id, startDate, endDate]);

  useEffect(() => { loadData(); }, [loadData]);

  const startEditing = (txn: SupplierTransaction) => {
    setEditingId(txn.id);
    setEditForm({
      date: txn.date, narration: txn.narration,
      debit: txn.debit ? String(txn.debit) : "", credit: txn.credit ? String(txn.credit) : "",
    });
  };

  const saveEdit = () => {
    if (editingId === null) return;
    updateSupplierTransaction(editingId, {
      date: editForm.date, narration: editForm.narration,
      debit: editForm.debit ? Number(editForm.debit) : null,
      credit: editForm.credit ? Number(editForm.credit) : null,
    });
    setEditingId(null);
    loadData();
  };

  const cancelEdit = () => setEditingId(null);

  const handleDeleteSupplierConfirm = async () => {
    try {
      await deleteSupplier(Number(id));
      setShowDeleteSupplierModal(false);
      router.back();
    } catch {
      Alert.alert("Error", "Unable to delete supplier.");
    }
  };

  const handleDeleteTransaction = (txnId: number) => {
    setPendingDeleteTxnId(txnId);
    setShowDeleteTxnModal(true);
  };

  const handleDeleteTxnConfirm = async () => {
    if (pendingDeleteTxnId === null) return;
    try {
      await deleteSupplierTransaction(pendingDeleteTxnId);
      setShowDeleteTxnModal(false);
      setPendingDeleteTxnId(null);
      loadData();
    } catch {
      Alert.alert("Error", "Unable to delete transaction.");
    }
  };

  const formatCurrency = (val: number | null) => {
    if (val === null || val === undefined) return "—";
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getBalanceText = () => {
    if (balanceDisplay > 0) return `Rs ${balanceDisplay.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    if (balanceDisplay < 0) return `-Rs ${Math.abs(balanceDisplay).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    return "Rs 0.00";
  };

  const getBalanceLabel = () => {
    if (balanceDisplay > 0) return "You are owed (Debit)";
    if (balanceDisplay < 0) return "You owe (Credit)";
    return "Settled";
  };

  const renderTransaction = ({ item }: { item: SupplierTransaction }) => {
    const isEditing = editingId === item.id;

    if (isEditing) {
      return (
        <View style={styles.editRow}>
          <TextInput style={[styles.editInput, { width: 72 }]} value={editForm.date} onChangeText={(v) => setEditForm((f) => ({ ...f, date: v }))} placeholder="YYYY-MM-DD" />
          <TextInput style={[styles.editInput, styles.editNarration]} value={editForm.narration} onChangeText={(v) => setEditForm((f) => ({ ...f, narration: v }))} />
          <TextInput style={[styles.editInput, { width: 56 }]} value={editForm.debit} onChangeText={(v) => setEditForm((f) => ({ ...f, debit: v }))} keyboardType="decimal-pad" placeholder="0" />
          <TextInput style={[styles.editInput, { width: 56 }]} value={editForm.credit} onChangeText={(v) => setEditForm((f) => ({ ...f, credit: v }))} keyboardType="decimal-pad" placeholder="0" />
          <View style={styles.editActions}>
            <Pressable onPress={saveEdit} style={styles.saveBtn}><Text style={styles.saveBtnText}>✓</Text></Pressable>
            <Pressable onPress={cancelEdit} style={styles.cancelBtn}><Text style={styles.cancelBtnText}>✕</Text></Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.transactionRow}>
        <Pressable style={{ flex: 1, flexDirection: "row" }} onPress={() => startEditing(item)}>
          <Text style={styles.dateCell}>{item.date}</Text>
          <Text style={styles.narrationCell} numberOfLines={2}>{item.narration}</Text>
          <Text style={[styles.amountCell, styles.debitCell]}>{item.debit ? formatCurrency(item.debit) : "—"}</Text>
          <Text style={[styles.amountCell, styles.creditCell]}>{item.credit ? formatCurrency(item.credit) : "—"}</Text>
          <Text style={[styles.amountCell, styles.balanceCell]}>{formatCurrency(item.balance)}</Text>
        </Pressable>
        <Pressable onPress={() => handleDeleteTransaction(item.id)} style={styles.deleteTxnBtn}>
          <Ionicons name="close-circle" size={16} color={uberColors.mute} />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <UberConfirmModal
        visible={showDeleteSupplierModal}
        title="Delete supplier"
        message="Are you sure? This will also delete all supplier transactions."
        onConfirm={handleDeleteSupplierConfirm}
        onCancel={() => setShowDeleteSupplierModal(false)}
      />
      <UberConfirmModal
        visible={showDeleteTxnModal}
        title="Delete transaction"
        message="Are you sure? This cannot be undone."
        onConfirm={handleDeleteTxnConfirm}
        onCancel={() => {
          setShowDeleteTxnModal(false);
          setPendingDeleteTxnId(null);
        }}
      />
      <UberHeader
        title={supplier?.companyName ?? "Supplier Ledger"}
        subtitle={supplier?.contactName ?? undefined}
        rightAction={
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerBtn}
              onPress={() => router.push(`/create-supplier?id=${id}` as any)}
            >
              <Ionicons name="pencil-outline" size={18} color={uberColors.ink} />
            </Pressable>
            <Pressable
              style={styles.headerBtnDanger}
              onPress={() => setShowDeleteSupplierModal(true)}
            >
              <Ionicons name="trash-outline" size={18} color={uberColors.onPrimary} />
            </Pressable>
          </View>
        }
      />
      <View style={styles.content}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{getBalanceLabel()}</Text>
          <Text style={styles.balanceAmount}>{getBalanceText()}</Text>
        </View>

        <DateRangePicker startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} />

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: 72 }]}>Date</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Narration</Text>
          <Text style={[styles.tableHeaderCell, { width: 64, textAlign: "right" }]}>Debit</Text>
          <Text style={[styles.tableHeaderCell, { width: 64, textAlign: "right" }]}>Credit</Text>
          <Text style={[styles.tableHeaderCell, { width: 64, textAlign: "right" }]}>Bal</Text>
        </View>

        <FlatList
          data={transactions}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTransaction}
          ListEmptyComponent={<UberEmptyState icon="document-text-outline" title="No transactions yet" description="Transactions for this supplier will appear here once recorded." />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: uberColors.canvas },
  content: { flex: 1, paddingHorizontal: uberSpacing.lg, gap: uberSpacing.md },
  balanceCard: {
    marginTop: uberSpacing.md,
    backgroundColor: uberColors.primary, borderRadius: uberRounded.xl,
    padding: uberSpacing["2xl"], alignItems: "center",
  },
  balanceLabel: {
    fontSize: uberTypography.caption.fontSize, fontWeight: "500",
    color: uberColors.mute, fontFamily: uberTypography.caption.fontFamily,
  },
  balanceAmount: {
    fontSize: uberTypography.displayMd.fontSize, fontWeight: uberTypography.displayMd.fontWeight,
    color: uberColors.onDark, fontFamily: uberTypography.displayMd.fontFamily,
    marginVertical: uberSpacing.xxs,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: uberSpacing.md, paddingVertical: uberSpacing.sm,
    backgroundColor: uberColors.canvasSoft, borderRadius: uberRounded.md,
  },
  tableHeaderCell: {
    fontSize: uberTypography.caption.fontSize, fontWeight: "700",
    color: uberColors.body, fontFamily: uberTypography.caption.fontFamily,
  },
  transactionRow: {
    flexDirection: "row",
    paddingHorizontal: uberSpacing.lg, paddingVertical: uberSpacing.md,
    borderBottomWidth: 1, borderBottomColor: uberColors.canvasSoft,
    backgroundColor: uberColors.canvas, alignItems: "center",
  },
  dateCell: {
    width: 72, fontSize: uberTypography.caption.fontSize,
    color: uberColors.body, fontFamily: "UberMoveText, monospace",
  },
  narrationCell: {
    flex: 1, fontSize: uberTypography.bodySm.fontSize,
    color: uberColors.ink, paddingRight: uberSpacing.sm,
    fontFamily: uberTypography.bodySm.fontFamily,
  },
  amountCell: {
    width: 64, fontSize: uberTypography.caption.fontSize,
    fontFamily: "UberMoveText, monospace", textAlign: "right",
  },
  debitCell: { color: uberColors.ink },
  creditCell: { color: uberColors.body },
  balanceCell: { color: uberColors.ink, fontWeight: "600" },
  listContent: { flexGrow: 1, paddingBottom: 24 },
  editRow: {
    flexDirection: "row", paddingHorizontal: uberSpacing.sm, paddingVertical: uberSpacing.sm,
    backgroundColor: uberColors.canvasSoft, borderBottomWidth: 1,
    borderBottomColor: uberColors.surfacePressed, alignItems: "center", gap: uberSpacing.xxs,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: uberSpacing.sm,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: uberRounded.full,
    backgroundColor: uberColors.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBtnDanger: {
    width: 36,
    height: 36,
    borderRadius: uberRounded.full,
    backgroundColor: "#dc2626",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteTxnBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: uberSpacing.xs,
  },
  editInput: {
    borderWidth: 1, borderColor: uberColors.mute, borderRadius: uberRounded.md,
    paddingHorizontal: uberSpacing.xs, paddingVertical: uberSpacing.xxs,
    fontSize: uberTypography.caption.fontSize, fontFamily: "UberMoveText, monospace",
    backgroundColor: uberColors.canvas, color: uberColors.ink,
  },
  editNarration: { flex: 1 },
  editActions: { gap: uberSpacing.xxs, alignItems: "center" },
  saveBtn: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: uberColors.ink, alignItems: "center", justifyContent: "center",
  },
  saveBtnText: { color: uberColors.onDark, fontSize: 12, fontWeight: "700" },
  cancelBtn: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: uberColors.body, alignItems: "center", justifyContent: "center",
  },
  cancelBtnText: { color: uberColors.onDark, fontSize: 12, fontWeight: "700" },
});
