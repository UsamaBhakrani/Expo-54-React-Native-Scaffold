import { useThemeContext } from "@/contexts/ThemeContext";

export function useColorScheme() {
  const { resolvedTheme } = useThemeContext();
  return resolvedTheme;
}
