/**
 * Hirerkey™ Design System — Typography System
 * 
 * Scaled for high legibility across mobile touchscreens and desktop views.
 * Primary Font: 100% Inter font family
 * Monospace Font: JetBrains Mono for Seat codes (FDM-01), currency (AED), and technical IDs.
 */

export const fontFamilies = {
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  display: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  code: "'JetBrains Mono', ui-monospace, Menlo, monospace",
};

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

export const typography = {
  // Hero & KPI Metrics (View 2 Large Numbers)
  'display-1': {
    fontFamily: fontFamilies.display,
    fontSize: '32px',
    fontWeight: fontWeights.extrabold,
    lineHeight: '1.1',
    letterSpacing: '-0.025em',
  },
  'display-2': {
    fontFamily: fontFamilies.display,
    fontSize: '26px',
    fontWeight: fontWeights.extrabold,
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
  },

  // Standard Headings
  h1: {
    fontFamily: fontFamilies.display,
    fontSize: '22px',
    fontWeight: fontWeights.bold,
    lineHeight: '1.3',
    letterSpacing: '-0.015em',
  },
  h2: {
    fontFamily: fontFamilies.display,
    fontSize: '18px',
    fontWeight: fontWeights.semibold,
    lineHeight: '1.35',
  },
  h3: {
    fontFamily: fontFamilies.display,
    fontSize: '16px',
    fontWeight: fontWeights.semibold,
    lineHeight: '1.4',
  },
  h4: {
    fontFamily: fontFamilies.display,
    fontSize: '15px',
    fontWeight: fontWeights.semibold,
    lineHeight: '1.45',
  },

  // Joy UI Titles
  'title-lg': {
    fontFamily: fontFamilies.display,
    fontSize: '16px',
    fontWeight: fontWeights.semibold,
    lineHeight: '1.4',
  },
  'title-md': {
    fontFamily: fontFamilies.display,
    fontSize: '14px',
    fontWeight: fontWeights.semibold,
    lineHeight: '1.45',
  },
  'title-sm': {
    fontFamily: fontFamilies.display,
    fontSize: '13px',
    fontWeight: fontWeights.semibold,
    lineHeight: '1.5',
  },

  // Body Texts
  'body-lg': {
    fontFamily: fontFamilies.body,
    fontSize: '15px',
    fontWeight: fontWeights.regular,
    lineHeight: '1.6',
  },
  'body-md': {
    fontFamily: fontFamilies.body,
    fontSize: '14px',
    fontWeight: fontWeights.regular,
    lineHeight: '1.55',
  },
  'body-sm': {
    fontFamily: fontFamilies.body,
    fontSize: '13px',
    fontWeight: fontWeights.regular,
    lineHeight: '1.5',
  },
  'body-xs': {
    fontFamily: fontFamilies.body,
    fontSize: '12px',
    fontWeight: fontWeights.regular,
    lineHeight: '1.45',
  },

  // Micro Tags & Badges
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: '11px',
    fontWeight: fontWeights.medium,
    lineHeight: '1.35',
  },
  badge: {
    fontFamily: fontFamilies.display,
    fontSize: '10px',
    fontWeight: fontWeights.bold,
    lineHeight: '1.2',
    letterSpacing: '0.02em',
  },

  // JetBrains Mono Monospace Scales (Codes, Currency, Seats)
  'mono-md': {
    fontFamily: fontFamilies.code,
    fontSize: '13px',
    fontWeight: fontWeights.medium,
    lineHeight: '1.4',
    letterSpacing: '-0.01em',
  },
  'mono-sm': {
    fontFamily: fontFamilies.code,
    fontSize: '12px',
    fontWeight: fontWeights.medium,
    lineHeight: '1.4',
  },
};
