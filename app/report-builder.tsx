import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { shareAsync, isAvailableAsync } from "expo-sharing";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DateRangePicker from "@/components/DateRangePicker";
import { UberHeader } from "@/components/ui/uber-header";
import {
  getAllExpenses,
  getAllInvoices,
  getAllProducts,
  getAllSuppliers,
  getAllCustomers,
  getAllSupplierTransactions,
  getExpensesGroupedByCategory,
  getExpensesByDateRange,
  getSupplierBalance,
  type Expense,
  type Invoice,
  type Product,
  type Supplier,
  type Customer,
  type SupplierTransaction,
} from "@/db/index";
import {
  uberColors,
  uberRounded,
  uberSpacing,
  uberTypography,
  uberShadows,
} from "@/constants/theme";

export const options = { headerShown: false };

type ReportType = {
  id: string;
  label: string;
  icon: string;
  description: string;
  supportsDateRange: boolean;
};

const REPORT_TYPES: ReportType[] = [
  {
    id: "expenses",
    label: "Expenses",
    icon: "cash-outline",
    description: "Expenses grouped by category with totals",
    supportsDateRange: true,
  },
  {
    id: "suppliers",
    label: "Suppliers",
    icon: "briefcase-outline",
    description: "All supplier transactions with balances",
    supportsDateRange: true,
  },
  {
    id: "invoices",
    label: "Invoices",
    icon: "document-text-outline",
    description: "All customer invoices with amounts and statuses",
    supportsDateRange: true,
  },
  {
    id: "products",
    label: "Products",
    icon: "cube-outline",
    description: "Product inventory with prices and stock levels",
    supportsDateRange: false,
  },
  {
    id: "summary",
    label: "Full Summary",
    icon: "stats-chart-outline",
    description: "Comprehensive business overview with all data",
    supportsDateRange: true,
  },
];

function formatCurrency(val: number): string {
  return val.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function buildExpensesHTML(
  grouped: { category: string | null; total: number; count: number }[],
  expenses: Expense[],
  startDate?: string,
  endDate?: string,
): string {
  const dateRange = startDate && endDate ? `(${startDate} to ${endDate})` : "(All time)";
  const grandTotal = grouped.reduce((sum, g) => sum + g.total, 0);

  const rows = grouped
    .map(
      (g) => `
    <tr>
      <td>${g.category ?? "Uncategorized"}</td>
      <td style="text-align:center">${g.count}</td>
      <td style="text-align:right;font-weight:600">Rs ${formatCurrency(g.total)}</td>
    </tr>`,
    )
    .join("");

  const detailRows = expenses
    .map(
      (e) => `
    <tr>
      <td style="color:#5e5e5e">${e.expenseDate ?? "—"}</td>
      <td>${e.title}</td>
      <td style="color:#5e5e5e">${e.category ?? "—"}</td>
      <td style="text-align:right;font-weight:600">Rs ${formatCurrency(e.amount)}</td>
    </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,Helvetica Neue,Arial,sans-serif;color:#000;padding:40px 32px;background:#fff}
  h1{font-size:28px;font-weight:700;margin-bottom:4px}
  .meta{color:#5e5e5e;font-size:14px;margin-bottom:24px}
  .summary-cards{display:flex;gap:12px;margin-bottom:28px}
  .card{background:#000;border-radius:12px;padding:20px 24px;flex:1}
  .card-label{color:#afafaf;font-size:12px;margin-bottom:4px}
  .card-value{color:#fff;font-size:22px;font-weight:700}
  h2{font-size:18px;font-weight:700;margin:24px 0 12px}
  table{width:100%;border-collapse:collapse;margin-bottom:20px}
  th{background:#efefef;padding:10px 12px;font-size:12px;font-weight:700;color:#5e5e5e;text-align:left}
  td{padding:10px 12px;font-size:14px;border-bottom:1px solid #efefef}
  .footer{color:#afafaf;font-size:11px;text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #efefef}
</style></head><body>
<h1>Expenses Report</h1>
<p class="meta">Generated on ${new Date().toLocaleDateString()} &middot; ${dateRange}</p>
<div class="summary-cards">
  <div class="card"><div class="card-label">Total Expenses</div><div class="card-value">Rs ${formatCurrency(grandTotal)}</div></div>
  <div class="card"><div class="card-label">Categories</div><div class="card-value">${grouped.length}</div></div>
  <div class="card"><div class="card-label">Entries</div><div class="card-value">${expenses.length}</div></div>
</div>
<h2>By Category</h2>
<table><thead><tr><th>Category</th><th style="text-align:center">Count</th><th style="text-align:right">Total</th></tr></thead><tbody>${rows}</tbody></table>
<h2>All Entries</h2>
<table><thead><tr><th>Date</th><th>Title</th><th>Category</th><th style="text-align:right">Amount</th></tr></thead><tbody>${detailRows}</tbody></table>
<div class="footer">My App &middot; Generated by Report Builder</div>
</body></html>`;
}

function buildSuppliersHTML(
  suppliers: (Supplier & { balance: number })[],
  transactions: SupplierTransaction[],
  startDate?: string,
  endDate?: string,
): string {
  const dateRange = startDate && endDate ? `(${startDate} to ${endDate})` : "(All time)";
  const totalBalance = suppliers.reduce((sum, s) => sum + s.balance, 0);
  const netTrans =
    transactions.reduce((sum, t) => sum + (t.debit ?? 0) - (t.credit ?? 0), 0);

  const supplierRows = suppliers
    .map(
      (s) => `
    <tr>
      <td>${s.companyName}</td>
      <td style="color:#5e5e5e">${s.contactName ?? "—"}</td>
      <td style="text-align:right;font-weight:600">Rs ${formatCurrency(s.balance)}</td>
    </tr>`,
    )
    .join("");

  const txnRows = transactions
    .map(
      (t) => `
    <tr>
      <td style="color:#5e5e5e">${t.date}</td>
      <td>${t.narration}</td>
      <td style="text-align:right">${t.debit ? "Rs " + formatCurrency(t.debit) : "—"}</td>
      <td style="text-align:right">${t.credit ? "Rs " + formatCurrency(t.credit) : "—"}</td>
      <td style="text-align:right;font-weight:600">Rs ${formatCurrency(t.balance)}</td>
    </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,Helvetica Neue,Arial,sans-serif;color:#000;padding:40px 32px;background:#fff}
  h1{font-size:28px;font-weight:700;margin-bottom:4px}
  .meta{color:#5e5e5e;font-size:14px;margin-bottom:24px}
  .summary-cards{display:flex;gap:12px;margin-bottom:28px}
  .card{background:#000;border-radius:12px;padding:20px 24px;flex:1}
  .card-label{color:#afafaf;font-size:12px;margin-bottom:4px}
  .card-value{color:#fff;font-size:22px;font-weight:700}
  h2{font-size:18px;font-weight:700;margin:24px 0 12px}
  table{width:100%;border-collapse:collapse;margin-bottom:20px}
  th{background:#efefef;padding:10px 12px;font-size:12px;font-weight:700;color:#5e5e5e;text-align:left}
  td{padding:10px 12px;font-size:14px;border-bottom:1px solid #efefef}
  .footer{color:#afafaf;font-size:11px;text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #efefef}
</style></head><body>
<h1>Supplier Report</h1>
<p class="meta">Generated on ${new Date().toLocaleDateString()} &middot; ${dateRange}</p>
<div class="summary-cards">
  <div class="card"><div class="card-label">Total Balance</div><div class="card-value">Rs ${formatCurrency(totalBalance)}</div></div>
  <div class="card"><div class="card-label">Suppliers</div><div class="card-value">${suppliers.length}</div></div>
  <div class="card"><div class="card-label">Net Flow</div><div class="card-value">Rs ${formatCurrency(netTrans)}</div></div>
</div>
<h2>Supplier Summary</h2>
<table><thead><tr><th>Company</th><th>Contact</th><th style="text-align:right">Balance</th></tr></thead><tbody>${supplierRows}</tbody></table>
${transactions.length > 0 ? `<h2>All Transactions</h2>
<table><thead><tr><th>Date</th><th>Narration</th><th style="text-align:right">Debit</th><th style="text-align:right">Credit</th><th style="text-align:right">Balance</th></tr></thead><tbody>${txnRows}</tbody></table>` : ""}
<div class="footer">My App &middot; Generated by Report Builder</div>
</body></html>`;
}

function buildInvoicesHTML(
  invoices: Invoice[],
  startDate?: string,
  endDate?: string,
): string {
  const dateRange = startDate && endDate ? `(${startDate} to ${endDate})` : "(All time)";
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const unpaidAmount = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const statusCounts: Record<string, number> = {};
  invoices.forEach((inv) => {
    statusCounts[inv.status] = (statusCounts[inv.status] || 0) + 1;
  });
  const statusSummary = Object.entries(statusCounts)
    .map(
      ([status, count]) =>
        `<tr><td style="text-transform:capitalize">${status}</td><td style="text-align:center">${count}</td></tr>`,
    )
    .join("");

  const invoiceRows = invoices
    .map(
      (inv) => `
    <tr>
      <td style="color:#5e5e5e">${inv.issueDate}</td>
      <td>${inv.invoiceNumber}</td>
      <td>${inv.customerName}</td>
      <td style="text-align:right;font-weight:600">Rs ${formatCurrency(inv.amount)}</td>
      <td style="text-transform:capitalize">${inv.status}</td>
    </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,Helvetica Neue,Arial,sans-serif;color:#000;padding:40px 32px;background:#fff}
  h1{font-size:28px;font-weight:700;margin-bottom:4px}
  .meta{color:#5e5e5e;font-size:14px;margin-bottom:24px}
  .summary-cards{display:flex;gap:12px;margin-bottom:28px}
  .card{background:#000;border-radius:12px;padding:20px 24px;flex:1}
  .card-label{color:#afafaf;font-size:12px;margin-bottom:4px}
  .card-value{color:#fff;font-size:22px;font-weight:700}
  h2{font-size:18px;font-weight:700;margin:24px 0 12px}
  table{width:100%;border-collapse:collapse;margin-bottom:20px}
  th{background:#efefef;padding:10px 12px;font-size:12px;font-weight:700;color:#5e5e5e;text-align:left}
  td{padding:10px 12px;font-size:14px;border-bottom:1px solid #efefef}
  .footer{color:#afafaf;font-size:11px;text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #efefef}
</style></head><body>
<h1>Invoices Report</h1>
<p class="meta">Generated on ${new Date().toLocaleDateString()} &middot; ${dateRange}</p>
<div class="summary-cards">
  <div class="card"><div class="card-label">Total Amount</div><div class="card-value">Rs ${formatCurrency(totalAmount)}</div></div>
  <div class="card"><div class="card-label">Receivables</div><div class="card-value">Rs ${formatCurrency(unpaidAmount)}</div></div>
  <div class="card"><div class="card-label">Invoices</div><div class="card-value">${invoices.length}</div></div>
</div>
<h2>By Status</h2>
<table><thead><tr><th>Status</th><th style="text-align:center">Count</th></tr></thead><tbody>${statusSummary}</tbody></table>
<h2>All Invoices</h2>
<table><thead><tr><th>Date</th><th>Number</th><th>Customer</th><th style="text-align:right">Amount</th><th>Status</th></tr></thead><tbody>${invoiceRows}</tbody></table>
<div class="footer">My App &middot; Generated by Report Builder</div>
</body></html>`;
}

function buildProductsHTML(products: Product[]): string {
  const totalValue = products.reduce(
    (sum, p) => sum + (p.price ?? 0) * (p.stock ?? 0),
    0,
  );
  const inStock = products.filter(
    (p) => p.stock !== null && p.stock !== undefined && p.stock > 0,
  ).length;

  const rows = products
    .map(
      (p) => `
    <tr>
      <td>${p.name}</td>
      <td style="color:#5e5e5e">${p.sku ?? "—"}</td>
      <td style="text-align:right">${p.price ? "Rs " + formatCurrency(p.price) : "—"}</td>
      <td style="text-align:center">${p.stock ?? "—"}</td>
      <td style="text-align:right;font-weight:600">${p.price && p.stock ? "Rs " + formatCurrency(p.price * p.stock) : "—"}</td>
    </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,Helvetica Neue,Arial,sans-serif;color:#000;padding:40px 32px;background:#fff}
  h1{font-size:28px;font-weight:700;margin-bottom:4px}
  .meta{color:#5e5e5e;font-size:14px;margin-bottom:24px}
  .summary-cards{display:flex;gap:12px;margin-bottom:28px}
  .card{background:#000;border-radius:12px;padding:20px 24px;flex:1}
  .card-label{color:#afafaf;font-size:12px;margin-bottom:4px}
  .card-value{color:#fff;font-size:22px;font-weight:700}
  h2{font-size:18px;font-weight:700;margin:24px 0 12px}
  table{width:100%;border-collapse:collapse;margin-bottom:20px}
  th{background:#efefef;padding:10px 12px;font-size:12px;font-weight:700;color:#5e5e5e;text-align:left}
  td{padding:10px 12px;font-size:14px;border-bottom:1px solid #efefef}
  .footer{color:#afafaf;font-size:11px;text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #efefef}
</style></head><body>
<h1>Products Report</h1>
<p class="meta">Generated on ${new Date().toLocaleDateString()}</p>
<div class="summary-cards">
  <div class="card"><div class="card-label">Inventory Value</div><div class="card-value">Rs ${formatCurrency(totalValue)}</div></div>
  <div class="card"><div class="card-label">Products</div><div class="card-value">${products.length}</div></div>
  <div class="card"><div class="card-label">In Stock</div><div class="card-value">${inStock}</div></div>
</div>
<h2>All Products</h2>
<table><thead><tr><th>Name</th><th>SKU</th><th style="text-align:right">Price</th><th style="text-align:center">Stock</th><th style="text-align:right">Value</th></tr></thead><tbody>${rows}</tbody></table>
<div class="footer">My App &middot; Generated by Report Builder</div>
</body></html>`;
}

function buildSummaryHTML(
  expenses: Expense[],
  suppliers: (Supplier & { balance: number })[],
  invoices: Invoice[],
  products: Product[],
  customers: Customer[],
  startDate?: string,
  endDate?: string,
): string {
  const dateRange = startDate && endDate ? `(${startDate} to ${endDate})` : "(All time)";
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBalance = suppliers.reduce((sum, s) => sum + s.balance, 0);
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const receivables = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,Helvetica Neue,Arial,sans-serif;color:#000;padding:40px 32px;background:#fff}
  h1{font-size:28px;font-weight:700;margin-bottom:4px}
  .meta{color:#5e5e5e;font-size:14px;margin-bottom:24px}
  .summary-cards{display:flex;gap:12px;margin-bottom:28px;flex-wrap:wrap}
  .card{background:#000;border-radius:12px;padding:20px 24px;min-width:180px;flex:1}
  .card-label{color:#afafaf;font-size:12px;margin-bottom:4px}
  .card-value{color:#fff;font-size:22px;font-weight:700}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:28px}
  .section{background:#f3f3f3;border-radius:12px;padding:20px}
  h2{font-size:16px;font-weight:700;margin-bottom:12px}
  .stat-row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px;border-bottom:1px solid #e2e2e2}
  .stat-label{color:#5e5e5e}
  .stat-value{font-weight:600}
  .footer{color:#afafaf;font-size:11px;text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #efefef}
</style></head><body>
<h1>Business Summary Report</h1>
<p class="meta">Generated on ${new Date().toLocaleDateString()} &middot; ${dateRange}</p>
<div class="summary-cards">
  <div class="card"><div class="card-label">Total Expenses</div><div class="card-value">Rs ${formatCurrency(totalExpenses)}</div></div>
  <div class="card"><div class="card-label">Receivables</div><div class="card-value">Rs ${formatCurrency(receivables)}</div></div>
  <div class="card"><div class="card-label">Supplier Balance</div><div class="card-value">Rs ${formatCurrency(totalBalance)}</div></div>
</div>
<div class="grid">
  <div class="section">
    <h2>Expenses</h2>
    <div class="stat-row"><span class="stat-label">Total</span><span class="stat-value">Rs ${formatCurrency(totalExpenses)}</span></div>
    <div class="stat-row"><span class="stat-label">Entries</span><span class="stat-value">${expenses.length}</span></div>
  </div>
  <div class="section">
    <h2>Suppliers</h2>
    <div class="stat-row"><span class="stat-label">Total</span><span class="stat-value">${suppliers.length}</span></div>
    <div class="stat-row"><span class="stat-label">Net Balance</span><span class="stat-value">Rs ${formatCurrency(totalBalance)}</span></div>
  </div>
  <div class="section">
    <h2>Invoices</h2>
    <div class="stat-row"><span class="stat-label">Total Invoiced</span><span class="stat-value">Rs ${formatCurrency(totalInvoiced)}</span></div>
    <div class="stat-row"><span class="stat-label">Receivables</span><span class="stat-value">Rs ${formatCurrency(receivables)}</span></div>
  </div>
  <div class="section">
    <h2>Products</h2>
    <div class="stat-row"><span class="stat-label">Products</span><span class="stat-value">${products.length}</span></div>
    <div class="stat-row"><span class="stat-label">Customers</span><span class="stat-value">${customers.length}</span></div>
  </div>
</div>
<div class="footer">My App &middot; Generated by Report Builder</div>
</body></html>`;
}

export default function ReportBuilderScreen() {
  const [selectedType, setSelectedType] = useState("expenses");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedReport = REPORT_TYPES.find((r) => r.id === selectedType)!;

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      let html = "";
      let filename = `Report-${selectedType}`;

      switch (selectedType) {
        case "expenses": {
          const [grouped, detailExpenses] = await Promise.all([
            getExpensesGroupedByCategory(
              startDate || undefined,
              endDate || undefined,
            ),
            startDate || endDate
              ? getExpensesByDateRange(startDate!, endDate!)
              : getAllExpenses(),
          ]);
          html = buildExpensesHTML(
            grouped,
            detailExpenses,
            startDate || undefined,
            endDate || undefined,
          );
          filename = "Expenses-Report";
          break;
        }
        case "suppliers": {
          const [allSuppliers, allTransactions] = await Promise.all([
            getAllSuppliers(),
            getAllSupplierTransactions(
              startDate || undefined,
              endDate || undefined,
            ),
          ]);
          const suppliersWithBalance = await Promise.all(
            allSuppliers.map(async (s) => {
              const bal = await getSupplierBalance(
                s.id,
                startDate || undefined,
                endDate || undefined,
              );
              return { ...s, balance: bal };
            }),
          );
          html = buildSuppliersHTML(
            suppliersWithBalance,
            allTransactions,
            startDate || undefined,
            endDate || undefined,
          );
          filename = "Supplier-Report";
          break;
        }
        case "invoices": {
          const allInvoices = await getAllInvoices();
          const filtered = startDate || endDate
            ? allInvoices.filter((inv) => {
                const d = inv.issueDate;
                if (startDate && d < startDate) return false;
                if (endDate && d > endDate) return false;
                return true;
              })
            : allInvoices;
          html = buildInvoicesHTML(
            filtered,
            startDate || undefined,
            endDate || undefined,
          );
          filename = "Invoices-Report";
          break;
        }
        case "products": {
          const allProducts = await getAllProducts();
          html = buildProductsHTML(allProducts);
          filename = "Products-Report";
          break;
        }
        case "summary": {
          const [exp, supps, invs, prods, custs] = await Promise.all([
            getAllExpenses(),
            getAllSuppliers(),
            getAllInvoices(),
            getAllProducts(),
            getAllCustomers(),
          ]);
          const suppsWithBalance = await Promise.all(
            supps.map(async (s) => {
              const bal = await getSupplierBalance(
                s.id,
                startDate || undefined,
                endDate || undefined,
              );
              return { ...s, balance: bal };
            }),
          );
          html = buildSummaryHTML(
            exp,
            suppsWithBalance,
            invs,
            prods,
            custs,
            startDate || undefined,
            endDate || undefined,
          );
          filename = "Business-Summary";
          break;
        }
      }

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      const sharingAvailable = await isAvailableAsync();

      if (sharingAvailable) {
        await shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
          dialogTitle: `Export ${filename}`,
        });
      } else {
        Alert.alert("PDF Generated", `File saved at: ${uri}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF report.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedType, startDate, endDate]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <UberHeader title="Report Builder" subtitle="Generate and export PDF reports" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Report Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Type</Text>
          <View style={styles.reportOptions}>
            {REPORT_TYPES.map((report) => {
              const isSelected = selectedType === report.id;
              return (
                <Pressable
                  key={report.id}
                  style={({ pressed }) => [
                    styles.reportOption,
                    isSelected && styles.reportOptionSelected,
                    pressed && !isSelected && styles.reportOptionPressed,
                  ]}
                  onPress={() => setSelectedType(report.id)}
                >
                  <View style={[styles.reportIcon, isSelected && styles.reportIconSelected]}>
                    <Ionicons
                      name={report.icon as any}
                      size={18}
                      color={isSelected ? uberColors.onPrimary : uberColors.ink}
                    />
                  </View>
                  <View style={styles.reportTextWrap}>
                    <Text style={[styles.reportLabel, isSelected && styles.reportLabelSelected]}>
                      {report.label}
                    </Text>
                    <Text style={[styles.reportDesc, isSelected && styles.reportDescSelected]}>
                      {report.description}
                    </Text>
                  </View>
                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={18} color={uberColors.onPrimary} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Date Range Filter */}
        {selectedReport.supportsDateRange ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date Range (optional)</Text>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </View>
        ) : null}

        {/* Generate Button */}
        <Pressable
          style={({ pressed }) => [
            styles.generateButton,
            pressed && styles.generateButtonPressed,
            isGenerating && styles.generateButtonDisabled,
          ]}
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color={uberColors.onPrimary} />
          ) : (
            <Ionicons name="document-outline" size={18} color={uberColors.onPrimary} />
          )}
          <Text style={styles.generateButtonText}>
            {isGenerating ? "Generating PDF..." : "Generate PDF Report"}
          </Text>
        </Pressable>

        <Text style={styles.hint}>
          The PDF will be generated with a professional layout and you can save or share it.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: uberColors.canvas },
  content: {
    padding: uberSpacing.lg,
    paddingBottom: 40,
    gap: uberSpacing.xl,
  },
  section: {
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.xl,
    padding: uberSpacing.lg,
    gap: uberSpacing.md,
  },
  sectionTitle: {
    fontSize: uberTypography.caption.fontSize,
    fontWeight: "700",
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
  },
  reportOptions: { gap: uberSpacing.sm },
  reportOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: uberSpacing.md,
    paddingVertical: uberSpacing.md,
    paddingHorizontal: uberSpacing.md,
    borderRadius: uberRounded.lg,
    backgroundColor: uberColors.canvas,
  },
  reportOptionSelected: {
    backgroundColor: uberColors.primary,
  },
  reportOptionPressed: { opacity: 0.7 },
  reportIcon: {
    width: 36,
    height: 36,
    borderRadius: uberRounded.full,
    backgroundColor: uberColors.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  reportIconSelected: { backgroundColor: uberColors.blackElevated },
  reportTextWrap: { flex: 1, gap: 2 },
  reportLabel: {
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: "600",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  reportLabelSelected: { color: uberColors.onPrimary },
  reportDesc: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
  },
  reportDescSelected: { color: uberColors.mute },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: uberSpacing.sm,
    backgroundColor: uberColors.primary,
    borderRadius: uberRounded.pill,
    paddingVertical: uberSpacing.lg,
    ...uberShadows.level2,
  },
  generateButtonPressed: { opacity: 0.85 },
  generateButtonDisabled: { opacity: 0.6 },
  generateButtonText: {
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
});
