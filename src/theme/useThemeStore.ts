
import { create } from "zustand";
import { useColorScheme } from "react-native";

import {
  lightTheme,
  darkTheme,
  type AppTheme,
  type ThemeMode,
} from "./themes";

interface ThemeState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeMode: "system",

  setThemeMode: (mode) => set({ themeMode: mode }),
}));

// Custom hook to get the currently active theme
export const useAppTheme = (): {
  theme: AppTheme;
  themeMode: ThemeMode;
} => {
  const themeMode = useThemeStore((state) => state.themeMode);
  const systemTheme = useColorScheme();

  const activeMode =
    themeMode === "system" ? systemTheme : themeMode;

  const theme = activeMode === "dark" ? darkTheme : lightTheme;

  return {
    theme,
    themeMode,
  };
};
