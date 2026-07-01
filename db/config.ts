import { initDatabase } from "./index";

// Re-exports and utilities built on top of db/index.ts
export {
  getDb,
  getSqliteDb,
  initDatabase,
  // Customers
  insertCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  // Suppliers
  insertSupplier,
  updateSupplier,
  getAllSuppliers,
  getSupplierById,
  deleteSupplier,
  // Products
  insertProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  // Invoices
  insertInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoicesByCustomer,
  getCustomerBalance,
  getInvoicesGroupedByStatus,
  // Expenses
  insertExpense,
  updateExpense,
  deleteExpense,
  getAllExpenses,
  getExpenseById,
  getExpensesByDateRange,
  getExpensesByCategory,
  getExpensesGroupedByCategory,
  // Export
  exportDataAsJson,
  getSchemaSQL,
  // Supplier Transactions
  insertSupplierTransaction,
  updateSupplierTransaction,
  deleteSupplierTransaction,
  getTransactionsBySupplier,
  getLastTransactionBySupplier,
  getSupplierBalance,
  getTotalSupplierBalance,
  getAllSupplierTransactions,
} from "./index";

// Run all pending migrations (creates tables if they don't exist)
export const runMigrations = () => {
  initDatabase();
  console.log("✅ Database tables initialized");
};
