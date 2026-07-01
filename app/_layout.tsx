import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { initDatabase } from "@/db/index";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";

const sqliteDb = SQLite.openDatabaseSync("my-app.db");

export default function RootLayout() {
  useDrizzleStudio(sqliteDb);
  initDatabase();

  return (
    <ThemeProvider>
      <InnerRoot />
    </ThemeProvider>
  );
}

function InnerRoot() {
  const colorScheme = useColorScheme();

  return (
    <NavThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack initialRouteName="onboarding">
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="create-invoice" options={{ headerShown: false }} />
        <Stack.Screen name="create-customer" options={{ headerShown: false }} />
        <Stack.Screen name="create-expense" options={{ headerShown: false }} />
        <Stack.Screen name="create-supplier" options={{ headerShown: false }} />
        <Stack.Screen name="create-product" options={{ headerShown: false }} />
        <Stack.Screen name="supplier-ledger" options={{ headerShown: false }} />
        <Stack.Screen name="create-purchase" options={{ headerShown: false }} />
        <Stack.Screen name="expense-detail" options={{ headerShown: false }} />
        <Stack.Screen name="product-purchases" options={{ headerShown: false }} />
        <Stack.Screen name="customer-ledger" options={{ headerShown: false }} />
        <Stack.Screen name="report-builder" options={{ headerShown: false }} />
        <Stack.Screen name="invoice-pdf" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </NavThemeProvider>
  );
}
