import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { shareAsync, isAvailableAsync } from "expo-sharing";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UberConfirmModal from "@/components/ui/uber-confirm-modal";

import { UberHeader } from "@/components/ui/uber-header";
import {
  getInvoiceById,
  getCustomerById,
  deleteInvoice,
  type Invoice,
  type Customer,
} from "@/db/index";
import {
  uberColors,
  uberRounded,
  uberSpacing,
  uberTypography,
  uberShadows,
} from "@/constants/theme";

export const options = { headerShown: false };

function formatCurrency(val: number): string {
  return val.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function buildInvoiceHTML(invoice: Invoice, customer?: Customer): string {
  const statusColor =
    invoice.status === "paid"
      ? "#5e5e5e"
      : invoice.status === "overdue"
        ? "#000000"
        : "#afafaf";

  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,Helvetica Neue,Arial,sans-serif;color:#000;padding:40px 32px;background:#fff}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #000}
  .brand h1{font-size:24px;font-weight:700;margin-bottom:2px}
  .brand p{color:#5e5e5e;font-size:12px}
  .status-badge{background:#000;color:#fff;padding:6px 16px;border-radius:999px;font-size:12px;font-weight:600;text-transform:capitalize}
  .address-section{display:flex;gap:40px;margin-bottom:28px}
  .address-block{flex:1}
  .address-block h3{font-size:11px;font-weight:700;color:#afafaf;text-transform:uppercase;margin-bottom:6px;letter-spacing:0.5px}
  .address-block p{font-size:14px;color:#000;line-height:20px}
  .invoice-meta{display:flex;gap:32px;margin-bottom:28px;background:#f3f3f3;border-radius:12px;padding:16px 20px}
  .meta-item{flex:1}
  .meta-label{font-size:11px;font-weight:700;color:#afafaf;text-transform:uppercase;margin-bottom:2px}
  .meta-value{font-size:14px;font-weight:600;color:#000}
  table{width:100%;border-collapse:collapse;margin-bottom:20px}
  th{background:#efefef;padding:10px 12px;font-size:11px;font-weight:700;color:#5e5e5e;text-align:left;text-transform:uppercase;letter-spacing:0.5px}
  td{padding:12px;font-size:14px;border-bottom:1px solid #efefef}
  .amount{text-align:right;font-weight:700}
  .total-row{background:#000}
  .total-row td{color:#fff;font-size:16px;font-weight:700;padding:14px 12px;border:none}
  .footer{color:#afafaf;font-size:11px;text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #efefef}
  .notes{margin-top:24px;padding:16px;background:#f9f9f9;border-radius:8px;font-size:13px;color:#5e5e5e;line-height:18px}
</style></head><body>
<div class="header">
  <div class="brand">
    <h1>INVOICE</h1>
    <p>${invoice.invoiceNumber}</p>
  </div>
  <div class="status-badge" style="background:${statusColor}">${invoice.status}</div>
</div>
<div class="address-section">
  <div class="address-block">
    <h3>Bill To</h3>
    <p><strong>${invoice.customerName}</strong></p>
    ${invoice.customerEmail ? `<p>${invoice.customerEmail}</p>` : ""}
    ${customer?.phone ? `<p>${customer.phone}</p>` : ""}
    ${customer?.address ? `<p>${customer.address}</p>` : ""}
  </div>
  <div class="address-block">
    <h3>From</h3>
    <p><strong>My App</strong></p>
    <p>Invoice Management System</p>
  </div>
</div>
<div class="invoice-meta">
  <div class="meta-item">
    <div class="meta-label">Issue Date</div>
    <div class="meta-value">${invoice.issueDate}</div>
  </div>
  <div class="meta-item">
    <div class="meta-label">Due Date</div>
    <div class="meta-value">${invoice.dueDate}</div>
  </div>
  <div class="meta-item">
    <div class="meta-label">Amount</div>
    <div class="meta-value">Rs ${formatCurrency(invoice.amount)}</div>
  </div>
</div>
<table>
  <thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>
    <tr><td>Invoice: ${invoice.invoiceNumber}</td><td class="amount">Rs ${formatCurrency(invoice.amount)}</td></tr>
  </tbody>
  <tfoot>
    <tr class="total-row"><td>Total</td><td class="amount">Rs ${formatCurrency(invoice.amount)}</td></tr>
  </tfoot>
</table>
${invoice.notes ? `<div class="notes"><strong>Notes:</strong><br/>${invoice.notes}</div>` : ""}
<div class="footer">My App &middot; Generated on ${new Date().toLocaleDateString()}</div>
</body></html>`;
}

export default function InvoicePdfScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    getInvoiceById(Number(id)).then((inv) => {
      setInvoice(inv ?? null);
      if (inv?.customerId) {
        getCustomerById(inv.customerId).then((results) => {
          setCustomer(results[0] ?? null);
        });
      }
    });
  }, [id]);

  const handleShare = useCallback(async () => {
    if (!invoice) return;
    setIsGenerating(true);
    try {
      const html = buildInvoiceHTML(invoice, customer ?? undefined);
      const { uri } = await Print.printToFileAsync({ html, base64: false });

      const sharingAvailable = await isAvailableAsync();
      if (sharingAvailable) {
        await shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
          dialogTitle: `Share Invoice ${invoice.invoiceNumber}`,
        });
      } else {
        Alert.alert("PDF Saved", `Invoice saved at: ${uri}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate invoice PDF.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }, [invoice, customer]);

  if (!invoice) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <UberHeader title="Invoice" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading invoice...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDeleteInvoiceConfirm = async () => {
    try {
      await deleteInvoice(Number(id));
      setShowDeleteModal(false);
      router.back();
    } catch {
      Alert.alert("Error", "Unable to delete invoice.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <UberConfirmModal
        visible={showDeleteModal}
        title="Delete invoice"
        message="Are you sure you want to delete this invoice? This cannot be undone."
        onConfirm={handleDeleteInvoiceConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
      <UberHeader
        title={`Invoice ${invoice.invoiceNumber}`}
        subtitle={invoice.customerName}
        rightAction={
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerBtn}
              onPress={() => router.push(`/create-invoice?id=${id}` as any)}
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
        {/* Invoice Preview Card */}
        <View style={styles.previewCard}>
          <View style={styles.invoiceHeader}>
            <View>
              <Text style={styles.invoiceLabel}>INVOICE</Text>
              <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: invoice.status === "paid" ? uberColors.body : uberColors.primary }]}>
              <Text style={styles.statusText}>{invoice.status}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailGrid}>
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Customer</Text>
              <Text style={styles.detailValue}>{invoice.customerName}</Text>
              {customer?.email ? <Text style={styles.detailSub}>{customer.email}</Text> : null}
            </View>
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Issue Date</Text>
              <Text style={styles.detailValue}>{invoice.issueDate}</Text>
              <Text style={styles.detailLabel}>Due Date</Text>
              <Text style={styles.detailValue}>{invoice.dueDate}</Text>
            </View>
          </View>

          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>Rs {formatCurrency(invoice.amount)}</Text>
          </View>

          {invoice.notes ? (
            <View style={styles.notesSection}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.notesText}>{invoice.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* Share Button */}
        <Pressable
          style={({ pressed }) => [
            styles.shareButton,
            pressed && styles.shareButtonPressed,
            isGenerating && styles.shareButtonDisabled,
          ]}
          onPress={handleShare}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color={uberColors.onPrimary} />
          ) : (
            <Ionicons name="share-outline" size={18} color={uberColors.onPrimary} />
          )}
          <Text style={styles.shareButtonText}>
            {isGenerating ? "Generating PDF..." : "Share Invoice as PDF"}
          </Text>
        </Pressable>

        <Text style={styles.hint}>
          Opens the share sheet to send via WhatsApp, email, or save to files.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: uberColors.canvas },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: {
    fontSize: uberTypography.bodyMd.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  content: {
    flex: 1,
    padding: uberSpacing.lg,
    gap: uberSpacing.lg,
  },
  previewCard: {
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.xl,
    padding: uberSpacing.lg,
    gap: uberSpacing.md,
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  invoiceLabel: {
    fontSize: uberTypography.displaySm.fontSize,
    fontWeight: uberTypography.displaySm.fontWeight,
    color: uberColors.ink,
    fontFamily: uberTypography.displaySm.fontFamily,
  },
  invoiceNumber: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: uberSpacing.md,
    paddingVertical: uberSpacing.xxs,
    borderRadius: uberRounded.pill,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: uberColors.onPrimary,
    fontFamily: uberTypography.caption.fontFamily,
    textTransform: "capitalize",
  },
  divider: {
    height: 1,
    backgroundColor: uberColors.surfacePressed,
  },
  detailGrid: {
    flexDirection: "row",
    gap: uberSpacing.lg,
  },
  detailBlock: { flex: 1, gap: 2 },
  detailLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: uberColors.mute,
    fontFamily: uberTypography.caption.fontFamily,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: uberSpacing.xs,
  },
  detailValue: {
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: "600",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  detailSub: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
  },
  amountCard: {
    backgroundColor: uberColors.primary,
    borderRadius: uberRounded.lg,
    padding: uberSpacing.lg,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: uberTypography.caption.fontSize,
    fontWeight: "500",
    color: uberColors.mute,
    fontFamily: uberTypography.caption.fontFamily,
  },
  amountValue: {
    fontSize: uberTypography.displayMd.fontSize,
    fontWeight: uberTypography.displayMd.fontWeight,
    color: uberColors.onDark,
    fontFamily: uberTypography.displayMd.fontFamily,
    marginTop: uberSpacing.xxs,
  },
  notesSection: {
    backgroundColor: uberColors.canvas,
    borderRadius: uberRounded.md,
    padding: uberSpacing.md,
    gap: uberSpacing.xs,
  },
  notesText: {
    fontSize: uberTypography.bodySm.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.bodySm.fontFamily,
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: uberSpacing.sm,
    backgroundColor: uberColors.primary,
    borderRadius: uberRounded.pill,
    paddingVertical: uberSpacing.lg,
    ...uberShadows.level2,
  },
  shareButtonPressed: { opacity: 0.85 },
  shareButtonDisabled: { opacity: 0.6 },
  shareButtonText: {
    color: uberColors.onPrimary,
    fontSize: uberTypography.buttonMd.fontSize,
    fontWeight: "500",
    fontFamily: uberTypography.buttonMd.fontFamily,
  },
  hint: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.mute,
    textAlign: "center",
    fontFamily: uberTypography.caption.fontFamily,
    lineHeight: 18,
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
});
