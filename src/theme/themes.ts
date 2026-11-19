
import { colors } from "./colors";

export const lightTheme = {
  mode: "light" as const,

  // Brand colors
  brand: colors.forest,
  primary: colors.forest,
  accent: colors.golden,
  secondary: colors.terracotta,

  // Backgrounds
  background: colors.sand,
  surface: colors.neutral.white,
  surfaceSecondary: "#EDE0CF",

  // Text
  text: colors.forest,
  textSecondary: "#625D53",
  textMuted: "#82786B",
  textOnPrimary: colors.neutral.white,
  textOnAccent: colors.forest,

  // UI
  border: "#E4D5C2",
  divider: "#E4D5C2",
  icon: colors.forest,
  overlay: "rgba(15, 61, 58, 0.45)",

  // Status
  success: "#39875A",
  error: "#D94F55",
  warning: "#D99A38",

  // Music player
  playerBackground: "#E8D8C3",
  progressTrack: "#D4C5B2",
  progressFill: colors.golden,
};

export const darkTheme = {
  mode: "dark" as const,

  // Brand colors
  brand: colors.forest,
  primary: colors.golden,
  accent: colors.golden,
  secondary: colors.terracotta,

  // Backgrounds
  background: "#102A28",
  surface: "#1B3936",
  surfaceSecondary: "#24504A",

  // Text
  text: colors.sand,
  textSecondary: "#C4C5B9",
  textMuted: "#92988C",
  textOnPrimary: colors.forest,
  textOnAccent: colors.forest,

  // UI
  border: "#35534E",
  divider: "#2A4843",
  icon: colors.sand,
  overlay: "rgba(0, 0, 0, 0.65)",

  // Status
  success: "#83C99A",
  error: "#FF777D",
  warning: "#E9B75D",

  // Music player
  playerBackground: "#24504A",
  progressTrack: "#45635B",
  progressFill: colors.golden,
};

export type AppTheme = typeof lightTheme | typeof darkTheme;
export type ThemeMode = "light" | "dark" | "system";
