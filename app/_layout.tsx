import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { EvoluAppProvider } from "@/db/evolu-provider";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <EvoluAppProvider>
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
          <Stack.Screen name="supplier-ledger" options={{ headerShown: false }} />
          <Stack.Screen name="create-purchase" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </EvoluAppProvider>
    </ThemeProvider>
  );
}
