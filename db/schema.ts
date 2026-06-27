// drizzle/schema.ts
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Companies table
export const companies = sqliteTable("companies", {
  id: integer("id").primaryKey(),
  type: integer("type").notNull(),
  company: text("company").unique().notNull(),
  address: text("address"),
  ntn: text("ntn"),
  salesTaxNo: text("salesTaxNo"),
});

// Invoices table
export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey(),
  invoiceNumber: text("invoiceNumber").notNull().unique(),
  customerName: text("customerName").notNull(),
  customerEmail: text("customerEmail"),
  issueDate: text("issueDate").notNull(),
  dueDate: text("dueDate").notNull(),
  amount: real("amount").notNull(),
  status: text("status").notNull().default("draft"),
  notes: text("notes"),
});

// Customers table
export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
});

// Suppliers table
export const suppliers = sqliteTable("suppliers", {
  id: integer("id").primaryKey(),
  companyName: text("companyName").notNull(),
  contactName: text("contactName"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
});

// Products table
export const products = sqliteTable("products", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku"),
  price: real("price"),
  stock: integer("stock"),
  notes: text("notes"),
});

// Expenses table
export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category"),
  amount: real("amount").notNull(),
  expenseDate: text("expenseDate"),
  notes: text("notes"),
});
