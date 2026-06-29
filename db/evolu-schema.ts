import * as Evolu from "@evolu/common";

// ---- Branded IDs for each table ----

export const CustomerId = Evolu.id("Customer");
export type CustomerId = Evolu.InferType<typeof CustomerId>;

export const SupplierId = Evolu.id("Supplier");
export type SupplierId = Evolu.InferType<typeof SupplierId>;

export const ProductId = Evolu.id("Product");
export type ProductId = Evolu.InferType<typeof ProductId>;

export const InvoiceId = Evolu.id("Invoice");
export type InvoiceId = Evolu.InferType<typeof InvoiceId>;

export const ExpenseId = Evolu.id("Expense");
export type ExpenseId = Evolu.InferType<typeof ExpenseId>;

export const SupplierTransactionId = Evolu.id("SupplierTransaction");
export type SupplierTransactionId = Evolu.InferType<typeof SupplierTransactionId>;

// ---- Evolu Database Schema ----

export const Schema = {
  customer: {
    id: CustomerId,
    name: Evolu.NonEmptyString100,
    email: Evolu.nullOr(Evolu.NonEmptyString100),
    phone: Evolu.nullOr(Evolu.NonEmptyString100),
    address: Evolu.nullOr(Evolu.NonEmptyString100),
    notes: Evolu.nullOr(Evolu.NonEmptyString100),
  },
  supplier: {
    id: SupplierId,
    companyName: Evolu.NonEmptyString100,
    contactName: Evolu.nullOr(Evolu.NonEmptyString100),
    email: Evolu.nullOr(Evolu.NonEmptyString100),
    phone: Evolu.nullOr(Evolu.NonEmptyString100),
    address: Evolu.nullOr(Evolu.NonEmptyString100),
    notes: Evolu.nullOr(Evolu.NonEmptyString100),
  },
  product: {
    id: ProductId,
    name: Evolu.NonEmptyString100,
    sku: Evolu.nullOr(Evolu.NonEmptyString100),
    price: Evolu.nullOr(Evolu.Number),
    stock: Evolu.nullOr(Evolu.Number),
    supplierId: Evolu.nullOr(SupplierId),
    notes: Evolu.nullOr(Evolu.NonEmptyString100),
  },
  invoice: {
    id: InvoiceId,
    invoiceNumber: Evolu.NonEmptyString100,
    customerId: Evolu.nullOr(CustomerId),
    customerName: Evolu.NonEmptyString100,
    customerEmail: Evolu.nullOr(Evolu.NonEmptyString100),
    issueDate: Evolu.NonEmptyString100,
    dueDate: Evolu.NonEmptyString100,
    amount: Evolu.Number,
    status: Evolu.NonEmptyString100,
    notes: Evolu.nullOr(Evolu.NonEmptyString100),
  },
  expense: {
    id: ExpenseId,
    title: Evolu.NonEmptyString100,
    category: Evolu.nullOr(Evolu.NonEmptyString100),
    amount: Evolu.Number,
    expenseDate: Evolu.nullOr(Evolu.NonEmptyString100),
    notes: Evolu.nullOr(Evolu.NonEmptyString100),
  },
  supplierTransaction: {
    id: SupplierTransactionId,
    supplierId: SupplierId,
    date: Evolu.NonEmptyString100,
    narration: Evolu.NonEmptyString100,
    debit: Evolu.nullOr(Evolu.Number),
    credit: Evolu.nullOr(Evolu.Number),
    balance: Evolu.Number,
  },
} as const satisfies Evolu.EvoluSchema;

export type AppEvoluSchema = typeof Schema;
