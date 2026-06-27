// drizzle/schema.ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Companies table
export const companies = sqliteTable("companies", {
  id: integer("id").primaryKey(),
  type: integer("type").notNull(),
  company: text("company").unique().notNull(),
  address: text("address"),
  ntn: text("ntn"),
  salesTaxNo: text("salesTaxNo"),
});
