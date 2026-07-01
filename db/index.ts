import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import {
  customers,
  suppliers,
  products,
  invoices,
  expenses,
  supplierTransactions,
} from "./schema";

// ---- Database Initialization ----

let db: ReturnType<typeof drizzle> | null = null;
let sqliteDb: SQLite.SQLiteDatabase | null = null;

export function getDb() {
  if (!db) {
    sqliteDb = SQLite.openDatabaseSync("my-app.db");
    db = drizzle(sqliteDb);
  }
  return db;
}

export function getSqliteDb() {
  if (!sqliteDb) {
    sqliteDb = SQLite.openDatabaseSync("my-app.db");
    db = drizzle(sqliteDb);
  }
  return sqliteDb;
}

// Create tables if they don't exist
export function initDatabase() {
  const sdb = getSqliteDb();
  sdb.execSync(`
    CREATE TABLE IF NOT EXISTS customer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS supplier (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      contact_name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT,
      price REAL,
      stock REAL,
      supplier_id INTEGER,
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS invoice (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT NOT NULL,
      customer_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      issue_date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL,
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS expense (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      amount REAL NOT NULL,
      expense_date TEXT,
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS supplier_transaction (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      narration TEXT NOT NULL,
      debit REAL,
      credit REAL,
      balance REAL NOT NULL,
      purchase_number TEXT
    );
  `);
}

// Drop all data (for purge button)
export function purgeDatabase() {
  const sdb = getSqliteDb();
  sdb.execSync(`
    DELETE FROM customer;
    DELETE FROM supplier;
    DELETE FROM product;
    DELETE FROM invoice;
    DELETE FROM expense;
    DELETE FROM supplier_transaction;
  `);
}

// ---- Customer CRUD ----

export type NewCustomer = typeof customers.$inferInsert;
export type Customer = typeof customers.$inferSelect;

export function insertCustomer(data: Omit<NewCustomer, "id">) {
  return getDb().insert(customers).values(data).execute();
}

export function getAllCustomers() {
  return getDb().select().from(customers).execute();
}

export function getCustomerById(id: number) {
  return getDb().select().from(customers).where(eq(customers.id, id)).execute();
}

export function updateCustomer(id: number, data: Partial<NewCustomer>) {
  return getDb().update(customers).set(data).where(eq(customers.id, id)).execute();
}

export function deleteCustomer(id: number) {
  return getDb().delete(customers).where(eq(customers.id, id)).execute();
}

// ---- Supplier CRUD ----

export type NewSupplier = typeof suppliers.$inferInsert;
export type Supplier = typeof suppliers.$inferSelect;

export function insertSupplier(data: Omit<NewSupplier, "id">) {
  return getDb().insert(suppliers).values(data).execute();
}

export function updateSupplier(id: number, data: Partial<NewSupplier>) {
  return getDb().update(suppliers).set(data).where(eq(suppliers.id, id)).execute();
}

export function getAllSuppliers() {
  return getDb().select().from(suppliers).execute();
}

export async function getSupplierById(id: number) {
  const results = await getDb().select().from(suppliers).where(eq(suppliers.id, id)).execute();
  return results[0];
}

export function deleteSupplier(id: number) {
  return getDb().delete(suppliers).where(eq(suppliers.id, id)).execute();
}

// ---- Auto-increment helpers ----

export async function getNextInvoiceNumber(): Promise<string> {
  const result = await getDb()
    .select({ maxId: sql<number>`COALESCE(MAX(id), 0) + 1` })
    .from(invoices)
    .execute();
  const next = result[0]?.maxId ?? 1;
  return `INV-${String(next).padStart(4, "0")}`;
}

export async function getNextSku(): Promise<string> {
  const result = await getDb()
    .select({ maxId: sql<number>`COALESCE(MAX(id), 0) + 1` })
    .from(products)
    .execute();
  const next = result[0]?.maxId ?? 1;
  return `SKU-${String(next).padStart(4, "0")}`;
}

export async function getNextPurchaseNumber(): Promise<string> {
  const result = await getDb()
    .select({ maxId: sql<number>`COALESCE(MAX(id), 0) + 1` })
    .from(supplierTransactions)
    .execute();
  const next = result[0]?.maxId ?? 1;
  return `PUR-${String(next).padStart(4, "0")}`;
}

// ---- Product CRUD ----

export type NewProduct = typeof products.$inferInsert;
export type Product = typeof products.$inferSelect;

export function insertProduct(data: Omit<NewProduct, "id">) {
  return getDb().insert(products).values(data).execute();
}

export function getAllProducts() {
  return getDb().select().from(products).execute();
}

export async function getProductById(id: number) {
  const results = await getDb().select().from(products).where(eq(products.id, id)).execute();
  return results[0];
}

export function updateProduct(id: number, data: Partial<NewProduct>) {
  return getDb().update(products).set(data).where(eq(products.id, id)).execute();
}

export function deleteProduct(id: number) {
  return getDb().delete(products).where(eq(products.id, id)).execute();
}

// ---- Invoice CRUD ----

export type NewInvoice = typeof invoices.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;

export function insertInvoice(data: Omit<NewInvoice, "id">) {
  return getDb().insert(invoices).values(data).execute();
}

export function getAllInvoices() {
  return getDb().select().from(invoices).execute();
}

export async function getInvoiceById(id: number) {
  const results = await getDb().select().from(invoices).where(eq(invoices.id, id)).execute();
  return results[0];
}

export function updateInvoice(id: number, data: Partial<NewInvoice>) {
  return getDb().update(invoices).set(data).where(eq(invoices.id, id)).execute();
}

export function deleteInvoice(id: number) {
  return getDb().delete(invoices).where(eq(invoices.id, id)).execute();
}

export function getInvoicesByCustomer(customerId: number, startDate?: string, endDate?: string) {
  const conditions = [eq(invoices.customerId, customerId)];
  if (startDate) conditions.push(gte(invoices.issueDate, startDate));
  if (endDate) conditions.push(lte(invoices.issueDate, endDate));

  return getDb()
    .select()
    .from(invoices)
    .where(and(...conditions))
    .orderBy(desc(invoices.issueDate))
    .execute();
}

export async function getCustomerBalance(customerId: number, startDate?: string, endDate?: string) {
  const conditions = [eq(invoices.customerId, customerId)];
  if (startDate) conditions.push(gte(invoices.issueDate, startDate));
  if (endDate) conditions.push(lte(invoices.issueDate, endDate));

  const allInvoices = await getDb()
    .select()
    .from(invoices)
    .where(and(...conditions))
    .execute();

  // Balance = total amount of unpaid invoices (not marked paid)
  return allInvoices.reduce((sum, inv) => {
    if (inv.status !== "paid") return sum + inv.amount;
    return sum;
  }, 0);
}

export function getInvoicesGroupedByStatus(customerId: number, startDate?: string, endDate?: string) {
  const conditions = [eq(invoices.customerId, customerId)];
  if (startDate) conditions.push(gte(invoices.issueDate, startDate));
  if (endDate) conditions.push(lte(invoices.issueDate, endDate));

  const query = getDb()
    .select({
      status: invoices.status,
      total: sql<number>`SUM(${invoices.amount})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(invoices);

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  return query
    .groupBy(invoices.status)
    .orderBy(desc(sql`SUM(${invoices.amount})`))
    .execute();
}

// ---- Expense CRUD ----

export type NewExpense = typeof expenses.$inferInsert;
export type Expense = typeof expenses.$inferSelect;

export function insertExpense(data: Omit<NewExpense, "id">) {
  return getDb().insert(expenses).values(data).execute();
}

export function updateExpense(id: number, data: Partial<NewExpense>) {
  return getDb().update(expenses).set(data).where(eq(expenses.id, id)).execute();
}

export function deleteExpense(id: number) {
  return getDb().delete(expenses).where(eq(expenses.id, id)).execute();
}

export function getAllExpenses() {
  return getDb().select().from(expenses).execute();
}

export async function getExpenseById(id: number) {
  const results = await getDb().select().from(expenses).where(eq(expenses.id, id)).execute();
  return results[0];
}

export function getExpensesByDateRange(startDate: string, endDate: string) {
  return getDb()
    .select()
    .from(expenses)
    .where(
      and(
        gte(expenses.expenseDate, startDate),
        lte(expenses.expenseDate, endDate),
      ),
    )
    .orderBy(desc(expenses.expenseDate))
    .execute();
}

export function getExpensesByCategory(category: string) {
  return getDb()
    .select()
    .from(expenses)
    .where(eq(expenses.category, category))
    .orderBy(desc(expenses.expenseDate))
    .execute();
}

export function getExpensesGroupedByCategory(startDate?: string, endDate?: string) {
  const conditions = [];
  if (startDate) conditions.push(gte(expenses.expenseDate, startDate));
  if (endDate) conditions.push(lte(expenses.expenseDate, endDate));

  const query = getDb()
    .select({
      category: expenses.category,
      total: sql<number>`SUM(${expenses.amount})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(expenses);

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  return query
    .groupBy(expenses.category)
    .orderBy(desc(sql`SUM(${expenses.amount})`))
    .execute();
}

// ---- Supplier Transaction CRUD ----

export type NewSupplierTransaction = typeof supplierTransactions.$inferInsert;
export type SupplierTransaction = typeof supplierTransactions.$inferSelect;

export function insertSupplierTransaction(data: Omit<NewSupplierTransaction, "id">) {
  return getDb().insert(supplierTransactions).values(data).execute();
}

export function updateSupplierTransaction(id: number, data: Partial<NewSupplierTransaction>) {
  return getDb().update(supplierTransactions).set(data).where(eq(supplierTransactions.id, id)).execute();
}

export function deleteSupplierTransaction(id: number) {
  return getDb().delete(supplierTransactions).where(eq(supplierTransactions.id, id)).execute();
}

export function getTransactionsBySupplier(supplierId: number, startDate?: string, endDate?: string) {
  const conditions = [eq(supplierTransactions.supplierId, supplierId)];
  if (startDate) conditions.push(gte(supplierTransactions.date, startDate));
  if (endDate) conditions.push(lte(supplierTransactions.date, endDate));

  return getDb()
    .select()
    .from(supplierTransactions)
    .where(and(...conditions))
    .orderBy(supplierTransactions.date)
    .execute();
}

export function getLastTransactionBySupplier(supplierId: number, startDate?: string, endDate?: string) {
  const conditions = [eq(supplierTransactions.supplierId, supplierId)];
  if (startDate) conditions.push(gte(supplierTransactions.date, startDate));
  if (endDate) conditions.push(lte(supplierTransactions.date, endDate));

  return getDb()
    .select()
    .from(supplierTransactions)
    .where(and(...conditions))
    .orderBy(desc(supplierTransactions.date))
    .limit(1)
    .execute();
}

export async function getSupplierBalance(supplierId: number, startDate?: string, endDate?: string) {
  const conditions = [eq(supplierTransactions.supplierId, supplierId)];
  if (startDate) conditions.push(gte(supplierTransactions.date, startDate));
  if (endDate) conditions.push(lte(supplierTransactions.date, endDate));

  const result = await getDb()
    .select({
      balance: sql<number>`SUM(${supplierTransactions.debit}) - SUM(${supplierTransactions.credit})`,
    })
    .from(supplierTransactions)
    .where(and(...conditions))
    .execute();

  return result[0]?.balance ?? 0;
}

export function getAllSupplierTransactions(startDate?: string, endDate?: string) {
  const conditions: ReturnType<typeof gte>[] = [];
  if (startDate) conditions.push(gte(supplierTransactions.date, startDate));
  if (endDate) conditions.push(lte(supplierTransactions.date, endDate));

  const query = getDb()
    .select()
    .from(supplierTransactions);

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  return query.orderBy(supplierTransactions.date).execute();
}

export async function getTotalSupplierBalance() {
  const result = await getDb()
    .select({
      balance: sql<number>`SUM(${supplierTransactions.debit}) - SUM(${supplierTransactions.credit})`,
    })
    .from(supplierTransactions)
    .execute();

  return result[0]?.balance ?? 0;
}

// ---- Export / Data Portability ----

/** Fetch all records from every table as a structured JSON string. */
export async function exportDataAsJson(): Promise<string> {
  const allCustomers = await getAllCustomers();
  const allSuppliers = await getAllSuppliers();
  const allProducts = await getAllProducts();
  const allInvoices = await getAllInvoices();
  const allExpenses = await getAllExpenses();
  const allTransactions = await getAllSupplierTransactions();

  const payload = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    data: {
      customers: allCustomers,
      suppliers: allSuppliers,
      products: allProducts,
      invoices: allInvoices,
      expenses: allExpenses,
      supplierTransactions: allTransactions,
    },
  };

  return JSON.stringify(payload, null, 2);
}

/** Return the full CREATE TABLE SQL schema as a text string. */
export function getSchemaSQL(): string {
  return `-- My App Database Schema
-- Exported on ${new Date().toISOString()}

CREATE TABLE IF NOT EXISTS customer (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS supplier (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sku TEXT,
  price REAL,
  stock REAL,
  supplier_id INTEGER,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS invoice (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT NOT NULL,
  customer_id INTEGER,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  issue_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS expense (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT,
  amount REAL NOT NULL,
  expense_date TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS supplier_transaction (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  narration TEXT NOT NULL,
  debit REAL,
  credit REAL,
  balance REAL NOT NULL,
  purchase_number TEXT
);
`;
}
