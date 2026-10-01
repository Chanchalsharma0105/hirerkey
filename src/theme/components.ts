/**
 * Hirerkey™ Design System — MUI Joy UI Component Style Overrides
 * 
 * Implements:
 * - Mobile Touch Optimization (min 44px tap targets, responsive inputs, bottom sheets)
 * - View 2 Aesthetic (Floating island surfaces, Bento card styles, HyIQ purple-to-blue AI)
 * - Offboarding Flow Aesthetic (Signature #F9FAFB grey input fields, #EEEBFF lavender table headers)
 */

import { tabClasses, tabListClasses } from '@mui/joy';
import { colors, radii, shadows } from './tokens';

export const components = {
  /* ================= BUTTON ================= */
  JoyButton: {
    defaultProps: {
      size: 'md',
      variant: 'solid',
      color: 'primary',
    },
    styleOverrides: {
      root: ({ theme, ownerState }: any) => {
        const isDark = theme.palette.mode === 'dark';
        return {
          minHeight: '40px', // Standard desktop
          fontSize: '13px',
          fontWeight: 600,
          borderRadius: radii.lg,
          textTransform: 'none',
          cursor: 'pointer',
          letterSpacing: '-0.01em',
          transition: 'all 160ms cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '8px 16px',

          // Mobile touch target enhancement
          '@media (max-width: 600px)': {
            minHeight: '44px',
            fontSize: '14px',
          },

          // Primary Solid (Hirerkey Purple #7C3AED)
          ...(ownerState.variant === 'solid' && ownerState.color === 'primary' && {
            backgroundColor: colors.primary[500],
            color: '#FFFFFF',
            boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)',
            '&:hover': {
              backgroundColor: colors.primary[600],
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)',
            },
            '&:active': {
              transform: 'scale(0.98)',
              backgroundColor: colors.primary[700],
            },
          }),

          // Secondary / Neutral Outlined
          ...(ownerState.variant === 'outlined' && {
            backgroundColor: isDark ? colors.navy.darkCard : '#FFFFFF',
            color: isDark ? '#F1F5F9' : colors.neutral[700],
            border: `1px solid ${isDark ? colors.navy.darkBorder : colors.neutral[200]}`,
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
            '&:hover': {
              backgroundColor: isDark ? '#2D3748' : colors.neutral[50],
              borderColor: colors.neutral[300],
              color: isDark ? '#FFFFFF' : colors.neutral[900],
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'scale(0.98)',
              backgroundColor: colors.neutral[100],
            },
          }),

          // Soft Purple Variant
          ...(ownerState.variant === 'soft' && ownerState.color === 'primary' && {
            backgroundColor: colors.primary[50],
            color: colors.primary[600],
            border: `1px solid ${colors.primary[100]}`,
            '&:hover': {
              backgroundColor: colors.primary[100],
              color: colors.primary[700],
            },
          }),
        };
      },
    },
  },

  /* ================= INPUT & TEXTAREA ================= */
  // Signature Offboarding / Exit Interview / Pulse Survey subtle grey styling (#F9FAFB)
  JoyInput: {
    defaultProps: {
      size: 'md',
    },
    styleOverrides: {
      root: ({ theme }: any) => {
        const isDark = theme.palette.mode === 'dark';
        return {
          backgroundColor: isDark ? colors.navy.darkCard : colors.surfaces.surfaceAlt, // #F9FAFB
          border: `1px solid ${isDark ? colors.navy.darkBorder : colors.neutral[200]}`, // #E2E8F0
          borderRadius: radii.lg, // 10px
          boxShadow: 'none',
          minHeight: '42px',
          padding: '0 12px',
          transition: 'all 180ms ease',

          '@media (max-width: 600px)': {
            minHeight: '44px',
          },

          '& input': {
            fontSize: '14px',
            fontWeight: 400,
            color: isDark ? '#F8FAFC' : colors.neutral[900],
          },
          '& input::placeholder': {
            fontSize: '13px',
            fontWeight: 400,
            opacity: 1,
            color: colors.neutral[400],
          },
          '&:hover': {
            borderColor: isDark ? '#475569' : colors.neutral[300],
            backgroundColor: isDark ? colors.navy.darkCard : '#FFFFFF',
          },
          '&:focus-within': {
            backgroundColor: isDark ? colors.navy.darkCard : '#FFFFFF',
            borderColor: colors.primary[500],
            boxShadow: `0 0 0 3px rgba(124, 58, 237, 0.12)`,
          },
        };
      },
    },
  },

  JoyTextarea: {
    defaultProps: {
      size: 'md',
    },
    styleOverrides: {
      root: ({ theme }: any) => {
        const isDark = theme.palette.mode === 'dark';
        return {
          backgroundColor: isDark ? colors.navy.darkCard : colors.surfaces.surfaceAlt,
          border: `1px solid ${isDark ? colors.navy.darkBorder : colors.neutral[200]}`,
          borderRadius: radii.lg,
          boxShadow: 'none',
          padding: '10px 12px',
          minHeight: '90px',
          transition: 'all 180ms ease',

          '& textarea': {
            fontSize: '14px',
            fontWeight: 400,
            color: isDark ? '#F8FAFC' : colors.neutral[900],
          },
          '& textarea::placeholder': {
            fontSize: '13px',
            fontWeight: 400,
            color: colors.neutral[400],
          },
          '&:hover': {
            borderColor: colors.neutral[300],
            backgroundColor: isDark ? colors.navy.darkCard : '#FFFFFF',
          },
          '&:focus-within': {
            backgroundColor: isDark ? colors.navy.darkCard : '#FFFFFF',
            borderColor: colors.primary[500],
            boxShadow: `0 0 0 3px rgba(124, 58, 237, 0.12)`,
          },
        };
      },
    },
  },

  JoySelect: {
    styleOverrides: {
      root: ({ theme }: any) => {
        const isDark = theme.palette.mode === 'dark';
        return {
          backgroundColor: isDark ? colors.navy.darkCard : colors.surfaces.surfaceAlt,
          border: `1px solid ${isDark ? colors.navy.darkBorder : colors.neutral[200]}`,
          borderRadius: radii.lg,
          minHeight: '42px',
          fontSize: '14px',
          fontWeight: 400,
          color: isDark ? '#F8FAFC' : colors.neutral[900],
          '@media (max-width: 600px)': {
            minHeight: '44px',
          },
          '&:hover': {
            borderColor: colors.neutral[300],
          },
          '&:focus-within': {
            borderColor: colors.primary[500],
            boxShadow: `0 0 0 3px rgba(124, 58, 237, 0.12)`,
          },
        };
      },
    },
  },

  /* ================= FORM LABEL ================= */
  JoyFormLabel: {
    styleOverrides: {
      root: {
        fontSize: '13px',
        fontWeight: 600,
        color: colors.neutral[700],
        marginBottom: '6px',
      },
    },
  },

  /* ================= CARD ================= */
  JoyCard: {
    styleOverrides: {
      root: ({ theme, ownerState }: any) => {
        const isDark = theme.palette.mode === 'dark';
        return {
          backgroundColor: isDark ? colors.navy.darkCard : colors.surfaces.surface,
          border: `1px solid ${isDark ? colors.navy.darkBorder : colors.surfaces.level2}`,
          borderRadius: radii.card, // 18px (View 2 Card Radius)
          padding: '20px',
          boxShadow: shadows.card,
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',

          '@media (max-width: 600px)': {
            padding: '16px',
            borderRadius: '16px',
          },

          // Dark Navy Highlight Card (View 2 Bento Card)
          ...(ownerState.variant === 'solid' && ownerState.color === 'neutral' && {
            background: `linear-gradient(145deg, ${colors.navy.cardStart} 0%, ${colors.navy.cardEnd} 100%)`,
            color: '#FFFFFF',
            border: 'none',
            boxShadow: shadows.kpiHighlight,
          }),
        };
      },
    },
  },

  /* ================= TABLE ================= */
  // Signature Offboarding / Dashboard Table (Lavender Head #EEEBFF + Row Hover #EDE9FE)
  JoyTable: {
    defaultProps: {
      size: 'md',
      stickyHeader: true,
    },
    styleOverrides: {
      root: ({ theme }: any) => {
        const isDark = theme.palette.mode === 'dark';
        return {
          border: 'none',
          '--TableCell-paddingX': '14px',
          '--TableCell-paddingY': '12px',
          borderRadius: radii.lg,
          '& thead th': {
            fontSize: '12.5px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            borderBottom: `1px solid ${colors.neutral[200]}`,
            color: colors.primary[600],
            backgroundColor: isDark ? '#261F42' : colors.surfaces.tableHead, // #EEEBFF
          },
          '& tbody tr': {
            backgroundColor: isDark ? colors.navy.darkCard : '#FFFFFF',
            transition: 'background-color 160ms ease',
            '& td': {
              fontSize: '13px',
              fontWeight: 400,
              color: isDark ? '#E2E8F0' : colors.neutral[700],
              borderBottom: `1px solid ${isDark ? '#2D3748' : colors.neutral[100]}`,
            },
            '&:hover': {
              backgroundColor: isDark ? '#35295B' : colors.primary[100], // #EDE9FE
            },
          },
        };
      },
    },
  },

  /* ================= TABS ================= */
  // Signature Offboarding Tab Bar (#EEE9FD Container + Pill Active Tab)
  JoyTabs: {
    styleOverrides: {
      root: ({ theme }: any) => ({
        backgroundColor: 'transparent',
        [`& .${tabClasses.root}`]: {
          fontSize: '13px',
          fontWeight: 600,
          borderRadius: radii.md,
          padding: '8px 14px',
          color: colors.neutral[600],
          transition: 'all 180ms cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '36px',
          cursor: 'pointer',

          '@media (max-width: 600px)': {
            minHeight: '40px',
            padding: '8px 12px',
            fontSize: '12.5px',
          },

          '&:hover': {
            color: colors.primary[600],
            backgroundColor: 'rgba(124, 58, 237, 0.06)',
          },
        },
        [`& .${tabClasses.root}[aria-selected="true"]`]: {
          backgroundColor: colors.primary[500],
          color: '#FFFFFF !important',
          boxShadow: '0 2px 8px rgba(124, 58, 237, 0.35)',
        },
        [`& .${tabListClasses.root}`]: {
          backgroundColor: colors.surfaces.tabContainer, // #EEE9FD
          borderRadius: radii.lg,
          padding: '4px',
          gap: '4px',
          border: 'none',
        },
      }),
    },
  },

  JoyTab: {
    defaultProps: {
      disableIndicator: true,
    },
  },

  /* ================= CHIP ================= */
  JoyChip: {
    styleOverrides: {
      root: ({ theme, ownerState }: any) => ({
        fontSize: '11.5px',
        fontWeight: 600,
        borderRadius: radii.pill,
        padding: '2px 8px',
        lineHeight: 1.3,
        letterSpacing: '0.01em',

        // Status: Notice Period Countdown (Amber)
        ...(ownerState.color === 'warning' && {
          backgroundColor: colors.warning.bg,
          color: colors.warning[700],
          border: `1px solid ${colors.warning.border}`,
        }),

        // Status: Success / Active (Green)
        ...(ownerState.color === 'success' && {
          backgroundColor: colors.success.bg,
          color: colors.success[700],
          border: `1px solid ${colors.success.border}`,
        }),

        // Status: Serving Notice / Primary (Purple)
        ...(ownerState.color === 'primary' && {
          backgroundColor: colors.primary[100],
          color: colors.primary[600],
          border: `1px solid ${colors.primary[200]}`,
        }),

        // Status: Critical / Terminated (Red)
        ...(ownerState.color === 'danger' && {
          backgroundColor: colors.danger.bg,
          color: colors.danger[600],
          border: `1px solid ${colors.danger.border}`,
        }),
      }),
    },
  },

  /* ================= BADGE ================= */
  JoyBadge: {
    styleOverrides: {
      badge: {
        backgroundColor: colors.primary[500],
        color: '#FFFFFF',
        fontSize: '10px',
        fontWeight: 700,
        padding: '1px 5px',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(124, 58, 237, 0.35)',
      },
    },
  },

  /* ================= ALERT ================= */
  JoyAlert: {
    defaultProps: {
      variant: 'soft',
    },
    styleOverrides: {
      root: ({ ownerState }: any) => ({
        borderRadius: radii.md,
        padding: '10px 14px',
        fontSize: '13px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',

        ...(ownerState.color === 'primary' && {
          backgroundColor: colors.primary[50],
          borderColor: colors.primary[200],
          color: colors.primary[700],
        }),
        ...(ownerState.color === 'success' && {
          backgroundColor: colors.success[50],
          borderColor: colors.success[200],
          color: colors.success[700],
        }),
        ...(ownerState.color === 'warning' && {
          backgroundColor: colors.warning[50],
          borderColor: colors.warning[200],
          color: colors.warning[700],
        }),
        ...(ownerState.color === 'danger' && {
          backgroundColor: colors.danger[50],
          borderColor: colors.danger[200],
          color: colors.danger[700],
        }),
        ...(ownerState.color === 'info' && {
          backgroundColor: colors.info[50],
          borderColor: colors.info[200],
          color: colors.info[700],
        }),
      }),
    },
  },

  /* ================= MODAL & BOTTOM SHEET ================= */
  JoyModalDialog: {
    styleOverrides: {
      root: ({ ownerState }: any) => {
        // Mobile Bottom Sheet Dialog
        if (ownerState.layout === 'bottom') {
          return {
            width: '100%',
            maxWidth: '100%',
            margin: 0,
            borderRadius: radii.bottomSheet, // 20px 20px 0 0
            padding: '24px 20px 32px 20px',
            boxShadow: '0 -10px 40px rgba(15, 23, 42, 0.16)',
            animation: 'htsBottomSheetSlideUp 260ms cubic-bezier(0.16, 1, 0.3, 1) both',
          };
        }

        // Center Modal Dialog
        return {
          borderRadius: '16px',
          boxShadow: '0 20px 50px -10px rgba(15, 23, 42, 0.25)',
          animation: 'htsModalSlideInRight 220ms ease-out both',
          padding: '24px',
        };
      },
    },
  },

  /* ================= TOOLTIP ================= */
  JoyTooltip: {
    styleOverrides: {
      root: {
        backgroundColor: colors.neutral[900], // Dark Slate #0F172A
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: 500,
        borderRadius: radii.sm,
        padding: '5px 10px',
        boxShadow: shadows.md,
      },
    },
  },

  /* ================= AVATAR ================= */
  JoyAvatar: {
    styleOverrides: {
      root: {
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '50%',
        fontWeight: 600,
      },
    },
  },

  /* ================= MENU ================= */
  JoyMenu: {
    defaultProps: {
      size: 'sm',
      modifiers: [
        { name: 'flip', options: { padding: 8 } },
        { name: 'preventOverflow', options: { altAxis: true, tether: false, padding: 8 } },
      ],
    },
    styleOverrides: {
      root: {
        padding: '6px',
        zIndex: 15000,
        borderRadius: radii.lg,
        boxShadow: shadows.lg,
        border: `1px solid ${colors.neutral[200]}`,
        minWidth: 190,
        '& .MuiMenuItem-root': {
          borderRadius: radii.md,
          fontSize: '13px',
          padding: '8px 12px',
          '&:hover': {
            backgroundColor: colors.primary[50],
            color: colors.primary[600],
          },
        },
      },
    },
  },
};
