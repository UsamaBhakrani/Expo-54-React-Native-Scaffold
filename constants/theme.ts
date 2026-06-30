/**
 * Uber-inspired Design System Tokens
 *
 * Based on DESIGN-uber.md — a black-and-white duet with pill-shaped
 * interactive elements, geometric display sans for headlines, and
 * editorial restraint.
 */

// ─── Colors ────────────────────────────────────────────────────────
export const uberColors = {
  primary: "#000000",
  onPrimary: "#ffffff",
  ink: "#000000",
  body: "#5e5e5e",
  mute: "#afafaf",
  hairlineMid: "#4b4b4b",
  canvas: "#ffffff",
  canvasSoft: "#efefef",
  canvasSofter: "#f3f3f3",
  surfacePressed: "#e2e2e2",
  link: "#0000ee",
  onDark: "#ffffff",
  blackElevated: "#282828",
} as const;

// ─── Typography ────────────────────────────────────────────────────
export const uberTypography = {
  displayXxl: {
    fontFamily: "UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 52,
    fontWeight: "700" as const,
    lineHeight: 64,
  },
  displayXl: {
    fontFamily: "UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 36,
    fontWeight: "700" as const,
    lineHeight: 44,
  },
  displayLg: {
    fontFamily: "UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
  },
  displayMd: {
    fontFamily: "UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 32,
  },
  displaySm: {
    fontFamily: "UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 20,
    fontWeight: "700" as const,
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: "UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 18,
    fontWeight: "500" as const,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: "UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodyMdStrong: {
    fontFamily: "UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  bodySm: {
    fontFamily: "UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  bodySmStrong: {
    fontFamily: "UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 16,
  },
  caption: {
    fontFamily: "UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  buttonLarge: {
    fontFamily: "UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 18,
    fontWeight: "500" as const,
    lineHeight: 24,
  },
  buttonMd: {
    fontFamily: "UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif",
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
} as const;

// ─── Border Radius ─────────────────────────────────────────────────
export const uberRounded = {
  none: 0,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
  pillTab: 36,
  full: 9999,
} as const;

// ─── Spacing ───────────────────────────────────────────────────────
export const uberSpacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
} as const;

// ─── Shadows ───────────────────────────────────────────────────────
export const uberShadows = {
  level0: {},
  level1: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  level2: {
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  level3: {
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
} as const;

// ─── Component Styles (functions for dynamic use) ──────────────────

export const uberButtons = {
  primary: {
    backgroundColor: uberColors.primary,
    borderRadius: uberRounded.pill,
    paddingVertical: uberSpacing.md,
    paddingHorizontal: uberSpacing.md,
  },
  secondary: {
    backgroundColor: uberColors.canvas,
    borderRadius: uberRounded.pill,
    paddingVertical: uberSpacing.md,
    paddingHorizontal: uberSpacing.md,
    borderWidth: 1,
    borderColor: uberColors.canvasSoft,
  },
  subtle: {
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.pill,
    paddingVertical: uberSpacing.md,
    paddingHorizontal: uberSpacing.lg,
  },
  large: {
    backgroundColor: uberColors.primary,
    borderRadius: uberRounded.xl,
    paddingVertical: uberSpacing.lg,
    paddingHorizontal: uberSpacing.xl,
  },
} as const;

export const uberCards = {
  content: {
    backgroundColor: uberColors.canvas,
    borderRadius: uberRounded.xl,
    padding: uberSpacing["2xl"],
  },
  elevated: {
    backgroundColor: uberColors.canvas,
    borderRadius: uberRounded.xl,
    padding: uberSpacing["2xl"],
    ...uberShadows.level1,
  },
  soft: {
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.xl,
    padding: uberSpacing["2xl"],
  },
} as const;

export const uberInputs = {
  default: {
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.md,
    padding: uberSpacing.lg,
  },
  onSoft: {
    backgroundColor: uberColors.canvasSofter,
    borderRadius: uberRounded.md,
    padding: uberSpacing.lg,
  },
} as const;

// ─── Legacy Colors (for backward compat with hook) ─────────────────
export const Colors = {
  light: {
    text: uberColors.ink,
    background: uberColors.canvas,
    tint: uberColors.primary,
    icon: uberColors.body,
    tabIconDefault: uberColors.body,
    tabIconSelected: uberColors.primary,
  },
  dark: {
    text: uberColors.onDark,
    background: uberColors.primary,
    tint: uberColors.onDark,
    icon: uberColors.mute,
    tabIconDefault: uberColors.mute,
    tabIconSelected: uberColors.onDark,
  },
} as const;

export const Fonts = {
  sans: "UberMoveText, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  display:
    "UberMove, UberMoveText, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
} as const;
