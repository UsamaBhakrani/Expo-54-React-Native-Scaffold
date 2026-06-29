import { useEffect, useState } from "react";

import { evolu, useAppEvolu } from "@/db/evolu-provider";

import * as Evolu from "@evolu/common";
import { useQuery } from "@evolu/react";

const supplierCountQuery = evolu.createQuery((db) =>
  db.selectFrom("supplier").selectAll().where("isDeleted", "is not", Evolu.sqliteTrue),
);

export function SeedButton() {
  const { insert } = useAppEvolu();
  const existing = useQuery(supplierCountQuery);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (seeded || (existing as any[])?.length > 0) return;

    // Customers
    insert("customer", { name: "Acme Corporation", email: "info@acme.com", phone: "+1-555-0100", address: "123 Business Ave, New York, NY", notes: "Key account" });
    insert("customer", { name: "Global Trade Inc.", email: "contact@globaltrade.com", phone: "+1-555-0101", address: "456 Commerce Dr, Los Angeles, CA", notes: null });
    insert("customer", { name: "Prime Solutions Ltd", email: "hello@primesol.com", phone: "+1-555-0102", address: "789 Market St, Chicago, IL", notes: "Monthly invoices" });

    // Suppliers
    insert("supplier", { companyName: "Northwind Supply Co", contactName: "Alice Johnson", email: "alice@northwind.com", phone: "+1-555-0200", address: "12 Industrial Pkwy, Houston, TX", notes: "Main hardware supplier" });
    insert("supplier", { companyName: "Pacific Raw Materials", contactName: "Bob Chen", email: "bob@pacificrm.com", phone: "+1-555-0201", address: "34 Warehouse Row, Seattle, WA", notes: null });
    insert("supplier", { companyName: "Elite Parts Distributors", contactName: "Carol Davis", email: "carol@eliteparts.com", phone: "+1-555-0202", address: "56 Logistics Blvd, Miami, FL", notes: "Electronics specialist" });

    // Products
    insert("product", { name: "Wireless Mouse", sku: "WM-001", price: 29.99, stock: 150, supplierId: null, notes: "Ergonomic design" });
    insert("product", { name: "Mechanical Keyboard", sku: "MK-002", price: 89.99, stock: 75, supplierId: null, notes: null });

    // Expenses
    insert("expense", { title: "Office Rent - March", category: "Rent", amount: 2500, expenseDate: "2026-03-01", notes: null });
    insert("expense", { title: "Internet Service", category: "Utilities", amount: 199.99, expenseDate: "2026-03-05", notes: "Monthly fiber connection" });
    insert("expense", { title: "Coffee Supplies", category: "Office Supplies", amount: 45.50, expenseDate: "2026-03-10", notes: null });

    // Invoices
    insert("invoice", { invoiceNumber: "INV-2026-001", customerId: null, customerName: "Acme Corporation", customerEmail: "info@acme.com", issueDate: "2026-03-01", dueDate: "2026-03-30", amount: 5200, status: "paid", notes: "Q1 consulting fees" });
    insert("invoice", { invoiceNumber: "INV-2026-002", customerId: null, customerName: "Global Trade Inc.", customerEmail: "contact@globaltrade.com", issueDate: "2026-03-10", dueDate: "2026-04-09", amount: 3800, status: "sent", notes: null });

    setSeeded(true);
    console.log("✅ Seed data inserted");
  }, [existing, seeded, insert]);

  return null;
}
