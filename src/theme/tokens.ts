/**
 * Hirerkey™ Design System — Core Design Tokens
 * 
 * Synthesizes:
 * 1. Dashboard Revamp View 2 (Donezo aesthetics, #7C3AED theme purple, Bento cards, HyIQ AI)
 * 2. Offboarding Flow (Grey input fields #F9FAFB, signature table header #EEEBFF, multi-metric cards)
 * 3. Mobile-First Ergonomics (44px touch targets, mobile bottom sheets, bottom dock navigation)
 */

export const colors = {
  // Brand Primary (Hirerkey Purple)
  primary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#7C3AED', // Primary Brand Base
    600: '#6D28D9', // Hover state
    700: '#5B21B6', // Active / Pressed
    800: '#4C1D95',
    900: '#3B1578',
    main: '#7C3AED',
    hover: '#6D28D9',
    softBg: 'rgba(124, 58, 237, 0.08)',
    border: 'rgba(124, 58, 237, 0.25)',
  },

  // Info (Sky / Cerulean Blue)
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    main: '#3B82F6',
  },

  // Success (Emerald Green)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#16A34A',
    600: '#10B981',
    700: '#047857',
    800: '#065F46',
    main: '#16A34A',
    trend: '#10B981',
    bg: '#DCFCE7',
    border: '#86EFAC',
  },

  // Warning (Amber / Gold)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    main: '#F59E0B',
    bg: '#FEF3C7',
    border: '#FDE68A',
  },

  // Danger / Critical (Crimson Red)
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    main: '#DC2626',
    bg: '#FEE2E2',
    border: '#FCA5A5',
  },

  // Neutrals & Slate Grays
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Hirerkey Dark Shell & Bento Highlights
  navy: {
    shell: '#001741', // Desktop dark navigation rail
    cardStart: '#1E1B4B', // View 2 Bento Highlight Card Gradient start
    cardEnd: '#171030', // View 2 Bento Highlight Card Gradient end
    darkSurface: '#0F172A',
    darkCard: '#1E293B',
    darkBorder: '#334155',
  },

  // HyIQ AI Assistant Tokens (View 2 Exact Specs)
  hyiq: {
    gradient: 'linear-gradient(90deg, #7C3AED 0%, #5B5BF7 50%, #3B82F6 100%)',
    borderGradient: 'linear-gradient(135deg, rgba(167, 139, 250, 0.75), rgba(103, 232, 249, 0.8))',
    glow: '0 4px 18px -2px rgba(124, 58, 237, 0.16)',
    softPurple: '#8B5CF6',
    indigo: '#6366F1',
    blue: '#3B82F6',
    cyan: '#38BDF8',
  },

  // Backgrounds & Surface Tiers
  surfaces: {
    ground: '#F4F5F7', // View 2 soft canvas background
    surface: '#FFFFFF', // Elevated card surface
    surfaceAlt: '#F9FAFB', // Offboarding input field grey
    level1: '#F1F5F9', // Subtle divider fill
    level2: '#E2E8F0', // Border lines
    tableHead: '#EEEBFF', // Signature table header
    tableHeadText: '#7C3AED',
    tabContainer: '#EEE9FD', // Signature tab pill container
  },
};

export const radii = {
  xs: '3px',
  sm: '5px',
  md: '8px',
  lg: '10px',
  xl: '14px',
  card: '18px', // View 2 KPI cards
  bento: '20px', // View 2 Bento cards
  bottomSheet: '20px 20px 0 0', // Mobile bottom sheet
  pill: '9999px', // Chips, capsules, pill buttons
};

export const shadows = {
  xs: '0 1px 2px rgba(15, 23, 42, 0.04)',
  sm: '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
  md: '0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
  lg: '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
  card: '0 2px 8px rgba(15, 23, 42, 0.04)',
  cardHover: '0 8px 24px -4px rgba(15, 23, 42, 0.1)',
  kpiHighlight: '0 8px 24px -2px rgba(30, 27, 75, 0.35)',
  purpleGlow: '0 4px 16px rgba(124, 58, 237, 0.35)',
  mobileDock: '0 -4px 24px rgba(15, 23, 42, 0.08), 0 -1px 3px rgba(15, 23, 42, 0.04)',
};

export const layout = {
  touchTargetMin: '44px',
  mobileHeaderHeight: '56px',
  mobileBottomNavHeight: '64px',
  mobilePaddingX: '16px',
  mobilePaddingY: '14px',
  maxContentWidth: '1480px',
};
