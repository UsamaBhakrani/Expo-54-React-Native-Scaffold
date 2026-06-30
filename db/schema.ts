import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const customers = sqliteTable("customer", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
});

export const suppliers = sqliteTable("supplier", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
});

export const products = sqliteTable("product", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  sku: text("sku"),
  price: real("price"),
  stock: real("stock"),
  supplierId: integer("supplier_id"),
  notes: text("notes"),
});

export const invoices = sqliteTable("invoice", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceNumber: text("invoice_number").notNull(),
  customerId: integer("customer_id"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  issueDate: text("issue_date").notNull(),
  dueDate: text("due_date").notNull(),
  amount: real("amount").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
});

export const expenses = sqliteTable("expense", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category"),
  amount: real("amount").notNull(),
  expenseDate: text("expense_date"),
  notes: text("notes"),
});

export const supplierTransactions = sqliteTable("supplier_transaction", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  supplierId: integer("supplier_id").notNull(),
  date: text("date").notNull(),
  narration: text("narration").notNull(),
  debit: real("debit"),
  credit: real("credit"),
  balance: real("balance").notNull(),
});
