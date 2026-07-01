import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";import {
  Alert, FlatList, Pressable, StyleSheet, Text, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UberConfirmModal from "@/components/ui/uber-confirm-modal";

import DateRangePicker from "@/components/DateRangePicker";
import { UberEmptyState } from "@/components/ui/uber-empty-state";
import { UberHeader } from "@/components/ui/uber-header";
import {
  uberColors,
  uberRounded,
  uberSpacing,
  uberTypography,
} from "@/constants/theme";
import {
  deleteCustomer,
  getCustomerById,
  getInvoicesByCustomer,
  type Customer,
  type Invoice,
} from "@/db/index";

export const options = { headerShown: false };

const STATUS_FILTERS = [
  { label: "All", status: "" },
  { label: "Draft", status: "draft" },
  { label: "Sent", status: "sent" },
  { label: "Paid", status: "paid" },
  { label: "Overdue", status: "overdue" },
];

export default function CustomerLedgerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadData = useCallback(() => {
    if (!id) return;
    getCustomerById(Number(id)).then((results) => {
      setCustomer(results[0] ?? null);
    });
    getInvoicesByCustomer(
      Number(id),
      startDate || undefined,
      endDate || undefined,
    ).then(setInvoices);
  }, [id, startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Show unpaid invoices for "All", or invoices matching the selected status
  const displayInvoices = activeStatus
    ? invoices.filter((inv) => inv.status === activeStatus)
    : invoices.filter((inv) => inv.status !== "paid");

  const filteredTotal = displayInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0,
  );

  const formatCurrency = (val: number) => {
    return val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return uberColors.body;
      case "draft":
        return uberColors.mute;
      case "overdue":
        return uberColors.ink;
      default:
        return uberColors.ink;
    }
  };

  const renderInvoice = ({ item }: { item: Invoice }) => (
    <Pressable
      style={({ pressed }) => [
        styles.invoiceRow,
        pressed && styles.invoiceRowPressed,
      ]}
      onPress={() => router.push(`/invoice-pdf?id=${item.id}` as any)}
    >
      <View style={styles.invoiceLeft}>
        <Text style={styles.invoiceNumber}>{item.invoiceNumber}</Text>
        <Text style={styles.invoiceDate}>{item.issueDate}</Text>
      </View>
      <View style={styles.invoiceCenter}>
        <Text style={styles.invoiceAmount}>
          Rs ${formatCurrency(item.amount)}
        </Text>
        <Text
          style={[styles.invoiceStatus, { color: getStatusColor(item.status) }]}
        >
          {item.status}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={14} color={uberColors.mute} />
    </Pressable>
  );

  const handleDeleteCustomerConfirm = async () => {
    try {
      await deleteCustomer(Number(id));
      setShowDeleteModal(false);
      router.back();
    } catch {
      Alert.alert("Error", "Unable to delete this customer.");
    }
  };  return (
    <SafeAreaView style={styles.safeArea}>
      <UberConfirmModal
        visible={showDeleteModal}
        title="Delete customer"
        message="Are you sure you want to delete this customer and all their invoices? This cannot be undone."
        onConfirm={handleDeleteCustomerConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
      <UberHeader
        title={customer?.name ?? "Customer Ledger"}
        subtitle={customer?.email ?? undefined}
        rightAction={
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerBtn}
              onPress={() => router.push(`/create-customer?id=${id}` as any)}
            >
              <Ionicons name="pencil-outline" size={18} color={uberColors.ink} />
            </Pressable>
            <Pressable
              style={styles.headerBtnDanger}
              onPress={() => setShowDeleteModal(true)}
            >
              <Ionicons name="trash-outline" size={18} color={uberColors.onPrimary} />
            </Pressable>
          </View>
        }
      />

      <View style={styles.content}>
        {/* Receivables Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>
            {activeStatus ? `${activeStatus} total` : "Total receivables"}
          </Text>
          <Text style={styles.balanceAmount}>
            Rs ${formatCurrency(filteredTotal)}
          </Text>
          <Text style={styles.balanceCount}>
            {displayInvoices.length} invoice
            {displayInvoices.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Status Pill Filters */}
        <View style={styles.statusRow}>
          {STATUS_FILTERS.map((f) => {
            const isActive = activeStatus === f.status;
            return (
              <Pressable
                key={f.label}
                style={({ pressed }) => [
                  styles.statusPill,
                  isActive && styles.statusPillActive,
                  pressed && !isActive && styles.statusPillPressed,
                ]}
                onPress={() => setActiveStatus(f.status)}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    isActive && styles.statusPillTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <FlatList
          data={displayInvoices}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderInvoice}
          ListEmptyComponent={
            <UberEmptyState
              icon="document-text-outline"
              title={
                activeStatus
                  ? `No ${activeStatus} invoices`
                  : "No outstanding invoices"
              }
              description={
                startDate || endDate
                  ? "No invoices in this date range."
                  : "Create an invoice for this customer to get started."
              }
            />
          }
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
    backgroundColor: uberColors.primary,
    borderRadius: uberRounded.xl,
    padding: uberSpacing["2xl"],
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: uberTypography.caption.fontSize,
    fontWeight: "500",
    color: uberColors.mute,
    fontFamily: uberTypography.caption.fontFamily,
  },
  balanceAmount: {
    fontSize: uberTypography.displayMd.fontSize,
    fontWeight: uberTypography.displayMd.fontWeight,
    color: uberColors.onDark,
    fontFamily: uberTypography.displayMd.fontFamily,
    marginVertical: uberSpacing.xxs,
  },
  balanceCount: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.mute,
    fontFamily: uberTypography.caption.fontFamily,
    opacity: 0.7,
  },
  statusRow: {
    flexDirection: "row",
    gap: uberSpacing.xs,
    flexWrap: "wrap",
  },
  statusPill: {
    paddingHorizontal: uberSpacing.lg,
    paddingVertical: uberSpacing.sm,
    borderRadius: uberRounded.pill,
    backgroundColor: uberColors.canvasSoft,
  },
  statusPillActive: { backgroundColor: uberColors.primary },
  statusPillPressed: { opacity: 0.7 },
  statusPillText: {
    fontSize: uberTypography.bodySmStrong.fontSize,
    fontWeight: uberTypography.bodySmStrong.fontWeight,
    color: uberColors.body,
    fontFamily: uberTypography.bodySmStrong.fontFamily,
  },
  statusPillTextActive: { color: uberColors.onPrimary },
  invoiceRow: {
    flexDirection: "row",
    paddingHorizontal: uberSpacing.lg,
    paddingVertical: uberSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: uberColors.canvasSoft,
    backgroundColor: uberColors.canvas,
    alignItems: "center",
    gap: uberSpacing.md,
  },
  invoiceRowPressed: { opacity: 0.7 },
  invoiceLeft: { flex: 1, gap: 2 },
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
  invoiceNumber: {
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: "600",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  invoiceDate: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
  },
  invoiceCenter: { alignItems: "flex-end", gap: 2 },
  invoiceAmount: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: "700",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
  },
  invoiceStatus: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: uberTypography.caption.fontFamily,
    textTransform: "capitalize",
  },
  listContent: { flexGrow: 1, paddingBottom: 24 },
});
