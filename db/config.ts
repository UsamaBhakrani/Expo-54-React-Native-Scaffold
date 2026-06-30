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
  // Suppliers
  insertSupplier,
  updateSupplier,
  getAllSuppliers,
  getSupplierById,
  // Products
  insertProduct,
  getAllProducts,
  // Invoices
  insertInvoice,
  getAllInvoices,
  // Expenses
  insertExpense,
  updateExpense,
  deleteExpense,
  getAllExpenses,
  getExpenseById,
  getExpensesByDateRange,
  getExpensesByCategory,
  getExpensesGroupedByCategory,
  // Supplier Transactions
  insertSupplierTransaction,
  updateSupplierTransaction,
  getTransactionsBySupplier,
  getLastTransactionBySupplier,
  getSupplierBalance,
} from "./index";

// Run all pending migrations (creates tables if they don't exist)
export const runMigrations = () => {
  initDatabase();
  console.log("✅ Database tables initialized");
};
