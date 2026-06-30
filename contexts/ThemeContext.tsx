import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type ColorMode = "light" | "dark" | "system";

type ThemeContextValue = {
  colorMode: ColorMode;
  resolvedTheme: "light" | "dark";
  setColorMode: (mode: ColorMode) => void;
};

const STORAGE_KEY = "app_color_mode";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? "light";
  const [colorMode, setColorModeState] = useState<ColorMode>("system");

  // Load saved preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setColorModeState(saved);
      }
    });
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const resolvedTheme = colorMode === "system" ? systemScheme : colorMode;

  const value = useMemo(
    () => ({ colorMode, resolvedTheme, setColorMode }),
    [colorMode, resolvedTheme, setColorMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}
