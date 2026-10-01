/**
 * Hirerkey™ Unified MUI Joy UI Theme
 * 
 * Synthesizes Dashboard Revamp View 2 + Offboarding Flow into a production-grade
 * theme system optimized for mobile touchscreens and modern enterprise SaaS.
 */

import { extendTheme } from '@mui/joy/styles';
import { colors, radii, shadows, layout } from './tokens';
import { fontFamilies, typography } from './typography';
import { components } from './components';

export const hirerkeyTheme = extendTheme({
  fontFamily: {
    body: fontFamilies.body,
    display: fontFamilies.display,
    code: fontFamilies.code,
  },

  radius: {
    xs: radii.xs,
    sm: radii.sm,
    md: radii.md,
    lg: radii.lg,
    xl: radii.xl,
    card: radii.card,
    bento: radii.bento,
    bottomSheet: radii.bottomSheet,
    pill: radii.pill,
  },

  shadow: {
    sm: shadows.sm,
    md: shadows.md,
    lg: shadows.lg,
    card: shadows.card,
    kpiHighlight: shadows.kpiHighlight,
    purpleGlow: shadows.purpleGlow,
  },

  typography,

  colorSchemes: {
    light: {
      palette: {
        primary: colors.primary,
        info: colors.info,
        success: colors.success,
        warning: colors.warning,
        danger: colors.danger,
        neutral: colors.neutral,
        accent: colors.primary[500],
        background: {
          body: colors.surfaces.ground, // #F4F5F7 (View 2 soft canvas)
          surface: colors.surfaces.surface, // #FFFFFF (Clean card surface)
          level1: colors.surfaces.level1, // #F1F5F9
          level2: colors.surfaces.level2, // #E2E8F0
          card: colors.surfaces.surface,
          tableHead: colors.surfaces.tableHead, // #EEEBFF
        },
        text: {
          primary: colors.neutral[900], // #0F172A
          secondary: colors.neutral[500], // #64748B
          tertiary: colors.neutral[400], // #94A3B8
        },
        divider: colors.neutral[200], // #E2E8F0
      },
    },

    dark: {
      palette: {
        primary: colors.primary,
        info: colors.info,
        success: colors.success,
        warning: colors.warning,
        danger: colors.danger,
        neutral: colors.neutral,
        accent: colors.primary[400],
        background: {
          body: colors.navy.darkSurface, // #0F172A
          surface: colors.navy.darkCard, // #1E293B
          level1: '#1A2234',
          level2: '#283548',
          card: colors.navy.darkCard,
          tableHead: '#261F42',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#94A3B8',
          tertiary: '#64748B',
        },
        divider: colors.navy.darkBorder,
      },
    },
  },

  components,
});

// Backward compatibility alias
export const theme = hirerkeyTheme;
export default hirerkeyTheme;

export { existingTheme } from './existingTheme';
export { colors, radii, shadows, layout, typography, fontFamilies };

