/**
 * ============================================================================
 * THEME.JS - JavaScript Color & Style Tokens
 * ============================================================================
 *
 * This file provides a JavaScript mirror of CSS variables defined in
 * src/styles/theme.css. Used for:
 *
 * 1. Recharts and other charting libraries (can't read CSS variables)
 * 2. Inline SVG and dynamic color generation
 * 3. JavaScript-based styling and conditionals
 *
 * CRITICAL: When updating colors in theme.css, update the corresponding
 * values here to maintain consistency across the application.
 * ============================================================================
 */

/**
 * Color palette (HSL values for conversion)
 * Format: { h, s, l } for HSL, or hex string for convenience
 */
export const colors = {
  /* Primary Brand (Emerald) */
  primary: {
    DEFAULT: "#10B981", // hsl(160 84% 39%)
    dark: "#059669", // hsl(160 94% 30%)
    light: "#6EE7B7", // hsl(160 84% 60%)
    rgb: "rgb(16 185 129)",
    hsl: "hsl(160 84% 39%)",
  },

  /* Backgrounds & Surfaces */
  background: {
    DEFAULT: "#F3F5F7",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    dashboard: "#F0FDF9", // ✅ matches --dashboard-bg mint
  },

  /* Text & Foreground */
  foreground: "#0F172A", // hsl(222 47% 11%)
  muted: "#8BA3B4", // hsl(212 17% 47%)

  /* Semantic Colors */
  secondary: "#FAFBF9", // hsl(165 60% 94%)
  accent: "#F0FDF9", // hsl(160 60% 93%)
  destructive: "#DC2626", // hsl(0 74% 51%) - kept vivid for destructive buttons/actions

  /* Status Palette (Attendance) */
  status: {
    present: "#16A34A", // hsl(142 71% 45%) - green
    late: "#F59E0B", // hsl(38 92% 50%) - amber
    absent: "#C46464", // hsl(0 45% 58%) - desaturated to match the pastel palette
    leave: "#8B5CF6", // hsl(258 90% 66%) - purple
    holiday: "#0EA5E9", // hsl(199 89% 48%) - blue
    pending: "#64748B", // hsl(215 16% 47%) - slate
  },

  /* Borders & Rings */
  border: "#D9F5E9", // hsl(156 63% 91%)
  input: "#DFE5EB", // hsl(214 20% 86%)
  ring: "#10B981", // hsl(160 84% 39%) - primary
};

/**
 * Brand color scale (emerald ramp)
 * Useful for additional variations in UI
 */
export const colorScale = {
  50: "#F0FDF9",
  100: "#D9F5E9",
  200: "#A7F3D0",
  300: "#6EE7B7",
  400: "#34D399",
  500: "#10B981", // primary
  600: "#059669", // primary-dark
  700: "#047857",
  800: "#065F46",
  900: "#064E3B",
  950: "#022C22",
};

/**
 * Glassmorphism effect tokens
 * Adjust these values to uniformly change the glass effect across all panels
 */
export const glass = {
  /* Background opacity (0-1) */
  bgOpacity: 0.4,

  /* Border opacity (0-1) */
  borderOpacity: 0.6,

  /* Backdrop blur (px) */
  blur: "12px",

  /* Inner gradient opacity for depth */
  innerOpacity: 0.5,

  /* Prebuilt style object for dynamic glass panels */
  style: {
    backdropFilter: "blur(12px)",
    backgroundColor: `rgba(255, 255, 255, ${0.4})`,
    borderColor: `rgba(255, 255, 255, ${0.6})`,
    border: `1px solid rgba(255, 255, 255, ${0.6})`,
  },
};

/**
 * Shadow definitions for elevation
 */
export const shadows = {
  soft: "0 1px 2px rgba(15, 23, 42, 0.06), 0 4px 16px rgba(15, 23, 42, 0.06)",
  raised: "0 10px 30px -12px rgba(16, 185, 129, 0.28)",
  glow: `0 0 0 1px rgba(16, 185, 129, 0.18), 0 12px 32px -12px rgba(16, 185, 129, 0.45)`,
  lg: "0 20px 48px rgba(0, 0, 0, 0.12)",
};

/**
 * Gradient definitions
 */
export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary.DEFAULT}, ${colors.primary.dark})`,
  surface: "linear-gradient(160deg, rgb(255, 255, 255), hsl(165 74% 98%))",
  accent: `linear-gradient(135deg, ${colors.accent}, rgba(16, 185, 129, 0.8))`,
};

/**
 * Border radius tokens
 */
export const radius = {
  DEFAULT: "0.75rem",
  lg: "1rem",
  md: "0.5rem",
  sm: "0.375rem",
};

/**
 * Easing functions for animations
 */
export const easing = {
  smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
};

/**
 * ============================================================================
 * RECHARTS TOOLTIP STYLE
 * ============================================================================
 *
 * Prebuilt tooltip styling for Recharts charts.
 * Applies glass-panel effect and primary brand colors.
 *
 * Usage:
 * <Tooltip content={<CustomTooltip />} />
 *
 * Or in a custom tooltip component:
 * <div style={{ ...chartTooltipStyle }}>
 *   {children}
 * </div>
 */
export const chartTooltipStyle = {
  backgroundColor: colors.background.surface,
  borderRadius: radius.DEFAULT,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.raised,
  padding: "8px 12px",
  backdropFilter: "blur(12px)",
};

/**
 * ============================================================================
 * CHART COLOR PALETTE
 * ============================================================================
 *
 * Color arrays for Recharts bar/line charts with consistent theming
 */
export const chartColors = [
  colors.primary.DEFAULT, // Primary emerald
  colors.status.present, // Green (present)
  colors.status.late, // Amber (late)
  colors.status.absent, // Red (absent)
  colors.status.leave, // Purple (leave)
  colors.status.holiday, // Blue (holiday)
  colors.accent, // Light accent
];

/**
 * Status badge color mapping
 */
export const statusColors = {
  present: colors.status.present,
  late: colors.status.late,
  absent: colors.status.absent,
  leave: colors.status.leave,
  holiday: colors.status.holiday,
  pending: colors.status.pending,
};

/**
 * ============================================================================
 * HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} RGB color string "rgb(r g b)"
 */
export const hslToRgb = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);
  return `rgb(${r} ${g} ${b})`;
};

/**
 * Get a color by status name
 * @param {string} status - Status key (present, late, absent, etc.)
 * @returns {string} Hex color code
 */
export const getStatusColor = (status) => {
  return statusColors[status] || colors.muted;
};

/**
 * Apply opacity to a hex color
 * @param {string} hex - Hex color code
 * @param {number} opacity - Opacity (0-1)
 * @returns {string} RGBA color string
 */
export const hexToRgba = (hex, opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default {
  colors,
  colorScale,
  glass,
  shadows,
  gradients,
  radius,
  easing,
  chartTooltipStyle,
  chartColors,
  statusColors,
  hslToRgb,
  getStatusColor,
  hexToRgba,
};
