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
