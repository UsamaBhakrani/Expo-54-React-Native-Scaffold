import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

const db = SQLite.openDatabaseSync("app.db");

import { runMigrations } from "@/db/config";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect } from "react";

export default function RootLayout() {
  useDrizzleStudio(db);
  const colorScheme = useColorScheme();

  useEffect(() => {
    runMigrations();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="onboarding">
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
        <Stack.Screen name="create-invoice" options={{ headerShown: false }} />
        <Stack.Screen name="create-customer" options={{ headerShown: false }} />
        <Stack.Screen name="create-expense" options={{ headerShown: false }} />
        <Stack.Screen name="create-supplier" options={{ headerShown: false }} />
        <Stack.Screen name="create-product" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
