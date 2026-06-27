// db.ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import * as SQLite from "expo-sqlite";
import migrations from "../drizzle/migrations";

let dbInstance: ReturnType<typeof drizzle> | null = null;

export const getDB = () => {
  if (!dbInstance) {
    const sqlite = SQLite.openDatabaseSync("app.db");
    dbInstance = drizzle(sqlite);
  }
  return dbInstance;
};

export const runMigrations = async () => {
  const db = getDB();
  await migrate(db, migrations);
  console.log("✅ Migrations applied");
};
