import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert, FlatList, Pressable, StyleSheet, Text, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UberConfirmModal from "@/components/ui/uber-confirm-modal";

import DateRangePicker from "@/components/DateRangePicker";
import {
  getProductById,
  getSupplierById,
  getTransactionsBySupplier,
  getSupplierBalance,
  deleteProduct,
  type Product,
  type Supplier,
  type SupplierTransaction,
} from "@/db/index";
import { uberColors, uberRounded, uberSpacing, uberTypography } from "@/constants/theme";
import { UberEmptyState } from "@/components/ui/uber-empty-state";
import { UberHeader } from "@/components/ui/uber-header";

export const options = { headerShown: false };

export default function ProductPurchasesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [transactions, setTransactions] = useState<SupplierTransaction[]>([]);
  const [balanceDisplay, setBalanceDisplay] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadData = useCallback(() => {
    if (!id) return;
    getProductById(Number(id)).then((prod) => {
      setProduct(prod ?? null);
      if (prod?.supplierId) {
        getSupplierById(prod.supplierId).then((sup) => setSupplier(sup ?? null));
        getTransactionsBySupplier(prod.supplierId, startDate || undefined, endDate || undefined).then(setTransactions);
        getSupplierBalance(prod.supplierId, startDate || undefined, endDate || undefined).then(setBalanceDisplay);
      } else {
        setTransactions([]);
        setBalanceDisplay(0);
      }
    });
  }, [id, startDate, endDate]);

  useEffect(() => { loadData(); }, [loadData]);

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
    if (balanceDisplay > 0) return "Supplier balance (Debit)";
    if (balanceDisplay < 0) return "Supplier balance (Credit)";
    return "Settled";
  };

  const renderTransaction = ({ item }: { item: SupplierTransaction }) => (
    <View style={styles.transactionRow}>
      <Text style={styles.dateCell}>{item.date}</Text>
      <Text style={styles.narrationCell} numberOfLines={2}>{item.narration}</Text>
      <Text style={[styles.amountCell, styles.debitCell]}>{item.debit ? formatCurrency(item.debit) : "—"}</Text>
      <Text style={[styles.amountCell, styles.creditCell]}>{item.credit ? formatCurrency(item.credit) : "—"}</Text>
      <Text style={[styles.amountCell, styles.balanceCell]}>{formatCurrency(item.balance)}</Text>
    </View>
  );

  const handleDeleteProductConfirm = async () => {
    try {
      await deleteProduct(Number(id));
      setShowDeleteModal(false);
      router.back();
    } catch {
      Alert.alert("Error", "Unable to delete this product.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <UberConfirmModal
        visible={showDeleteModal}
        title="Delete product"
        message="Are you sure you want to delete this product? This cannot be undone."
        onConfirm={handleDeleteProductConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
      <UberHeader
        title={product?.name ?? "Product Purchases"}
        rightAction={
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerBtn}
              onPress={() => router.push(`/create-product?id=${id}` as any)}
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
        {/* Product Info Card */}
        <View style={styles.productCard}>
          <View style={styles.productIcon}>
            <Ionicons name="cube-outline" size={22} color={uberColors.ink} />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product?.name ?? "Loading..."}</Text>
            {product?.sku ? <Text style={styles.productSku}>SKU: {product.sku}</Text> : null}
            <View style={styles.productMetaRow}>
              {product?.price ? (
                <Text style={styles.productPrice}>
                  Rs ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
              ) : null}
              {product?.stock !== null && product?.stock !== undefined ? (
                <View style={styles.stockBadge}>
                  <Text style={styles.stockText}>{product.stock} units</Text>
                </View>
              ) : null}
            </View>
          </View>
          {supplier ? (
            <Pressable
              style={styles.supplierLink}
              onPress={() => router.push(`/supplier-ledger?id=${supplier.id}` as any)}
            >
              <Text style={styles.supplierLinkLabel}>{supplier.companyName}</Text>
              <Ionicons name="chevron-forward" size={14} color={uberColors.mute} />
            </Pressable>
          ) : null}
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{getBalanceLabel()}</Text>
          <Text style={styles.balanceAmount}>{getBalanceText()}</Text>
        </View>

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        {/* Table Header */}
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
          ListEmptyComponent={
            <UberEmptyState
              icon="cube-outline"
              title="No purchases yet"
              description={supplier ? "Purchases for this product's supplier will appear here." : "This product has no supplier linked."}
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
  productCard: {
    marginTop: uberSpacing.md,
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.xl,
    padding: uberSpacing.lg,
    gap: uberSpacing.sm,
  },
  productIcon: {
    width: 44,
    height: 44,
    borderRadius: uberRounded.full,
    backgroundColor: uberColors.canvas,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: { gap: 2 },
  productName: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: "600",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
  },
  productSku: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
  },
  productMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: uberSpacing.sm,
    marginTop: uberSpacing.xxs,
  },
  productPrice: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: "700",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
  },
  stockBadge: {
    backgroundColor: uberColors.canvas,
    borderRadius: uberRounded.pill,
    paddingHorizontal: uberSpacing.sm,
    paddingVertical: 2,
  },
  stockText: {
    fontSize: 11,
    fontWeight: "700",
    color: uberColors.ink,
    fontFamily: uberTypography.caption.fontFamily,
  },
  supplierLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: uberSpacing.xs,
    marginTop: uberSpacing.xs,
  },
  supplierLinkLabel: {
    fontSize: uberTypography.bodySm.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.bodySm.fontFamily,
  },
  balanceCard: {
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
});
