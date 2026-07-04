/**
 * Przepiśnik LowStyleLife — semantic design tokens.
 * Synced with the web artifact's LIGHT MODE (Soft lavender & cream palette).
 *
 * The dark welcome screen uses its own gradient and is not driven by these tokens.
 * Everything inside the app (kitchen, creator, recipe list) is cream + lavender.
 */

const colors = {
  light: {
    // Base
    background: "#fdf8ef",     // hsl(42 60% 97%) — warm cream
    foreground: "#34284b",     // deep purple-grey

    // Cards (slightly cooler/lavender tint)
    card: "#fffdfb",
    cardForeground: "#34284b",
    cardBorder: "#ebe3ef",

    // Primary — lavender
    primary: "#8b4fd1",
    primaryForeground: "#ffffff",

    // Secondary — soft cream
    secondary: "#f6efe1",
    secondaryForeground: "#4b3a66",

    // Muted
    muted: "#f4eee0",
    mutedForeground: "#8b8198",

    // Accent — soft lavender wash
    accent: "#ebdcf5",
    accentForeground: "#4b3a66",

    // Highlight — gold (tytuł, podświetlenia kategorii)
    gold: "#b88a2c",

    // States
    destructive: "#dc2626",
    destructiveForeground: "#ffffff",

    border: "#ebe3ef",
    input: "#e6d8f0",

    // Text helpers
    text: "#34284b",
    tint: "#8b4fd1",
    subtle: "#a387bf",
  },

  radius: 16,
};

export default colors;
