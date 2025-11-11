// Theme color constants
export const THEME_COLORS = {
  primary: '#FF8C42', // Light orange primary
  secondary: '#FFB366', // Lighter orange secondary
  accent: '#FFD9B3', // Very light orange accent
} as const;

export type ThemeColors = typeof THEME_COLORS;

