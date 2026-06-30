import {
  insertCustomer,
  insertSupplier,
  getAllSuppliers,
  getAllCustomers,
  insertProduct,
  insertExpense,
  insertInvoice,
  insertSupplierTransaction,
} from "./index";

export async function seedDatabase() {
  // ---- Customers ----
  const customerData = [
    { name: "Acme Corp", email: "billing@acme.com", phone: "+1 555-0101", address: "100 Industrial Blvd, Suite 200", notes: "Enterprise customer, net 60 terms" },
    { name: "Globex Inc", email: "ap@globex.io", phone: "+1 555-0102", address: "42 Innovation Drive", notes: "Priority account" },
    { name: "Initech", email: "accounts@initech.co", phone: "+1 555-0103", address: "8 Business Park Road", notes: "" },
    { name: "Hooli", email: "finance@hooli.com", phone: "+1 555-0104", address: "1 Hooli Plaza", notes: "Large enterprise" },
    { name: "Cyberdyne Systems", email: "orders@cyberdyne.com", phone: "+1 555-0105", address: "901 Tech Park", notes: "Monthly subscription" },
  ];
  for (const c of customerData) {
    await insertCustomer(c);
  }

  // ---- Suppliers ----
  const supplierData = [
    { companyName: "Northwind Supply", contactName: "Alex Morgan", email: "alex@northwind.com", phone: "+1 555-0201", address: "200 Commerce St", notes: "Office supplies" },
    { companyName: "Global Traders", contactName: "Sarah Chen", email: "sarah@globaltraders.com", phone: "+1 555-0202", address: "55 Market Square", notes: "International shipping" },
    { companyName: "TechParts Ltd", contactName: "Mike Rivera", email: "mike@techparts.io", phone: "+1 555-0203", address: "33 Electronics Ave", notes: "Hardware components" },
    { companyName: "Paper & Co", contactName: "Emily Watson", email: "emily@paperco.com", phone: "+1 555-0204", address: "12 Stationery Row", notes: "Printing materials" },
  ];
  for (const s of supplierData) {
    await insertSupplier(s);
  }

  // Fetch real IDs for relationships
  const suppliers = await getAllSuppliers();
  const customers = await getAllCustomers();

  // ---- Products ----
  const productList = [
    { name: "Wireless Mouse", sku: "WM-001", price: 29.99, stock: 150, supplierId: null as number | null, notes: "Ergonomic design" },
    { name: "Mechanical Keyboard", sku: "KB-200", price: 89.99, stock: 75, supplierId: null as number | null, notes: "Cherry MX switches" },
    { name: "USB-C Hub", sku: "UC-050", price: 49.99, stock: 200, supplierId: null as number | null, notes: "7-port with HDMI" },
    { name: "Monitor Stand", sku: "MS-100", price: 39.99, stock: 45, supplierId: null as number | null, notes: "Adjustable height" },
    { name: "Noise-Canceling Headphones", sku: "NC-300", price: 199.99, stock: 30, supplierId: null as number | null, notes: "Wireless, 30hr battery" },
  ];
  for (let i = 0; i < productList.length; i++) {
    const s = suppliers[i % suppliers.length];
    await insertProduct({ ...productList[i], supplierId: s?.id ?? null });
  }

  // ---- Supplier Transactions ----
  if (suppliers.length > 0) {
    const txns = [
      { supplierId: suppliers[0].id, date: "2026-06-01", narration: "Office supplies order", debit: 1500, credit: null, balance: 1500 },
      { supplierId: suppliers[0].id, date: "2026-06-10", narration: "Payment received", debit: null, credit: 1000, balance: 500 },
      { supplierId: suppliers[0].id, date: "2026-06-15", narration: "Additional order", debit: 800, credit: null, balance: 1300 },
      { supplierId: suppliers.length > 1 ? suppliers[1].id : suppliers[0].id, date: "2026-06-05", narration: "Electronics components", debit: 3500, credit: null, balance: 3500 },
      { supplierId: suppliers.length > 1 ? suppliers[1].id : suppliers[0].id, date: "2026-06-12", narration: "Partial payment", debit: null, credit: 2000, balance: 1500 },
      { supplierId: suppliers.length > 2 ? suppliers[2].id : suppliers[0].id, date: "2026-06-08", narration: "Raw materials", debit: 5000, credit: null, balance: 5000 },
      { supplierId: suppliers.length > 2 ? suppliers[2].id : suppliers[0].id, date: "2026-06-18", narration: "Payment", debit: null, credit: 3000, balance: 2000 },
    ];
    for (const t of txns) {
      await insertSupplierTransaction(t);
    }
  }

  // ---- Expenses ----
  const expenseData = [
    { title: "Office Rent", category: "Rent", amount: 4500, expenseDate: "2026-06-01", notes: "Monthly rent" },
    { title: "Internet Service", category: "Utilities", amount: 250, expenseDate: "2026-06-02", notes: "Business fiber" },
    { title: "Cleaning Service", category: "Facilities", amount: 400, expenseDate: "2026-06-03", notes: "Weekly cleaning" },
    { title: "Printer Paper", category: "Office Supplies", amount: 85, expenseDate: "2026-06-05", notes: "10 cases" },
    { title: "Cloud Servers", category: "Technology", amount: 1200, expenseDate: "2026-06-07", notes: "AWS monthly" },
    { title: "Team Lunch", category: "Meals", amount: 320, expenseDate: "2026-06-10", notes: "Quarterly team event" },
    { title: "Software Licenses", category: "Technology", amount: 890, expenseDate: "2026-06-12", notes: "Adobe Creative Suite" },
    { title: "Electricity Bill", category: "Utilities", amount: 580, expenseDate: "2026-06-15", notes: "Monthly" },
    { title: "Shipping Costs", category: "Logistics", amount: 340, expenseDate: "2026-06-18", notes: "Customer deliveries" },
    { title: "Consulting Fee", category: "Professional Services", amount: 2500, expenseDate: "2026-06-20", notes: "Tax advisory" },
  ];
  for (const e of expenseData) {
    await insertExpense(e);
  }

  // ---- Invoices ----
  const invoiceData = [
    { invoiceNumber: "INV-1001", customerId: null as number | null, customerName: "Acme Corp", customerEmail: "billing@acme.com", issueDate: "2026-06-01", dueDate: "2026-07-01", amount: 12500, status: "paid", notes: "Q2 consulting" },
    { invoiceNumber: "INV-1002", customerId: null, customerName: "Globex Inc", customerEmail: "ap@globex.io", issueDate: "2026-06-05", dueDate: "2026-07-05", amount: 8400, status: "sent", notes: "Software license renewal" },
    { invoiceNumber: "INV-1003", customerId: null, customerName: "Initech", customerEmail: "accounts@initech.co", issueDate: "2026-06-10", dueDate: "2026-07-10", amount: 3200, status: "draft", notes: "Hardware order" },
    { invoiceNumber: "INV-1004", customerId: null, customerName: "Hooli", customerEmail: "finance@hooli.com", issueDate: "2026-06-15", dueDate: "2026-07-15", amount: 22000, status: "paid", notes: "Annual maintenance" },
    { invoiceNumber: "INV-1005", customerId: null, customerName: "Cyberdyne Systems", customerEmail: "orders@cyberdyne.com", issueDate: "2026-06-20", dueDate: "2026-07-20", amount: 5600, status: "sent", notes: "Monthly retainer" },
  ];
  for (const inv of invoiceData) {
    const c = customers.find((cust) => cust.name === inv.customerName);
    await insertInvoice({ ...inv, customerId: c?.id ?? null });
  }

  return true;
}
