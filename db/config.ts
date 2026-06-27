// db.ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import * as SQLite from "expo-sqlite";
import migrations from "../drizzle/migrations";

let dbInstance: ReturnType<typeof drizzle> | null = null;
let migrationsPromise: Promise<void> | null = null;

const fallbackSchemaSql = `
  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY,
    type INTEGER NOT NULL,
    company TEXT UNIQUE NOT NULL,
    address TEXT,
    ntn TEXT,
    salesTaxNo TEXT
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY,
    invoiceNumber TEXT NOT NULL UNIQUE,
    customerName TEXT NOT NULL,
    customerEmail TEXT,
    issueDate TEXT NOT NULL,
    dueDate TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY,
    companyName TEXT NOT NULL,
    contactName TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT,
    price REAL,
    stock INTEGER,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    amount REAL NOT NULL,
    expenseDate TEXT,
    notes TEXT
  );
`;

export const getDB = () => {
  if (!dbInstance) {
    const sqlite = SQLite.openDatabaseSync("app.db");
    dbInstance = drizzle(sqlite);
  }
  return dbInstance;
};

export const runMigrations = async () => {
  if (migrationsPromise) {
    return migrationsPromise;
  }

  migrationsPromise = (async () => {
    const db = getDB();

    try {
      await migrate(db, migrations);
      console.log("✅ Migrations applied");
    } catch (error) {
      console.warn("Drizzle migration failed, applying fallback schema", error);
      const sqlite = SQLite.openDatabaseSync("app.db");
      sqlite.execSync(fallbackSchemaSql);
      console.log("✅ Fallback schema initialized");
    }
  })();

  return migrationsPromise;
};
