import { tabClasses, tabListClasses } from '@mui/joy';
import { extendTheme } from '@mui/joy/styles';

const primary = {
  50: '#F5F3FF',
  100: '#EDE9FE',
  200: '#DDD6FE',
  300: '#C4B5FD',
  400: '#A78BFA',
  500: '#7C3AED',
  600: '#6D28D9',
  700: '#5B21B6',
  800: '#4C1D95',
  900: '#3B1578',
};

/**
 * Informational blue.
 *
 * Joy ships primary / neutral / success / warning / danger and no blue — this
 * theme's `primary` is purple — so the middle tier of a three-step scale (the
 * medium SLA tier, between green and red) had nowhere to come from but a
 * literal hex at the call site. Declared here so it is a token like any other.
 */
const info = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  500: '#3B82F6',
  600: '#2563EB',
  700: '#1D4ED8',
};

export const existingTheme = extendTheme({
  fontFamily: {
    body: 'Inter, system-ui, sans-serif',
    display: 'Inter, system-ui, sans-serif',
  },
  fontSize: {
    xxsm: '10px',
  },
  radius: {
    xs: '3px',
    sm: '5px',
    md: '6px',
    lg: '8px',
    xl: '10px',
    xxl: '15px',
    /** Fully rounded — chips and pills, which have no fixed-px radius. */
    pill: '999px',
  },

  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
  },

  typography: {
    h1: { fontFamily: 'var(--font-primary)', fontSize: '24px', fontWeight: 600, lineHeight: '1.3' },
    h2: { fontFamily: 'var(--font-primary)', fontSize: '20px', fontWeight: 600, lineHeight: '1.35' },
    h3: { fontFamily: 'var(--font-primary)', fontSize: '18px', fontWeight: 500, lineHeight: '1.4' },
    h4: { fontFamily: 'var(--font-primary)', fontSize: '16px', fontWeight: 500, lineHeight: '1.45' },

    'title-lg': {
      fontFamily: 'var(--font-primary)',
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '1.4',
    },
    'title-md': {
      fontFamily: 'var(--font-primary)',
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '1.45',
    },
    'title-sm': {
      fontFamily: 'var(--font-primary)',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '1.5',
    },

    /* ---------- Body Text ---------- */
    'body-lg': {
      fontFamily: 'var(--font-primary)',
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: '1.6',
    },
    'body-md': {
      fontFamily: 'var(--font-primary)',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '1.55',
    },
    'body-sm': {
      fontFamily: 'var(--font-primary)',
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: '1.5',
    },
    'body-xs': {
      fontFamily: 'var(--font-primary)',
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '1.45',
    },
  },

  colorSchemes: {
    light: {
      palette: {
        primary,
        info,
        accent: primary[500],
        background: {
          body: '#FFF',
          surface: '#F9FAFB',
          level1: '#F3F4F6',
          level2: '#E5E7EB',
          card: '#FFFFFF',
        },
        text: {
          primary: '#2C2C2C',
          secondary: '#696969',
        },
      },
    },
    dark: {
      palette: {
        primary,
        info,
        accent: '#2563eb',
        background: {
          body: '#121212',
          surface: '#1A1A1A',
          level1: '#1F1F1F',
          level2: '#2A2A2A',
          card: '#1F1F1F',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#CCCCCC',
        },
      },
    },
  },

  components: {
    /* ================= ALERT ================= */
    JoyAlert: {
      defaultProps: {
        variant: 'soft',
      },
      styleOverrides: {
        root: ({ ownerState }: any) => ({
          boxSizing: 'border-box',
          maxWidth: '100%',
          marginBottom: '0.5rem',
          textAlign: 'start',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          border: '1px solid',
          borderColor: 'rgb(237 233 254)',
          backgroundColor: '#ffe4c4',
          color: '#a0522d',

          '& .MuiAlert-startDecorator': {
            alignSelf: 'flex-start',
            marginTop: '2px',
          },

          ...((ownerState.variant === 'primary' || ownerState.color === 'primary') && {
            backgroundColor: '#eff6ff',
            border: '1px solid',
            borderColor: '#9cc1ff',
            color: '#0c59da',
            borderRadius: 'sm',
            padding: '10px 10px',
            fontWeight: 500,

            '& .MuiAlert-startDecorator': {
              color: '#1557d6',
              alignSelf: 'flex-start',
              marginTop: '2px',
            },
          }),
        }),
      },
    },
    JoyModal: {
      defaultProps: {
        keepMounted: true,
      },
      styleOverrides: {
        root: {
          '& .MuiModal-backdrop': {
            animation: 'htsModalBackdropFadeIn 220ms ease-out both',
          },
          '&.MuiModal-hidden': {
            visibility: 'hidden',
            pointerEvents: 'none',
          },
          '&.MuiModal-hidden .MuiModal-backdrop': {
            animation: 'htsModalBackdropFadeOut 180ms ease-in both',
          },
        },
      },
    },
    JoyModalDialog: {
      styleOverrides: {
        root: ({ ownerState }: any) => {
          if (ownerState.layout !== 'center') {
            return {};
          }

          return {
            animation: 'htsModalSlideInRight 220ms ease-out both',
            willChange: 'transform, opacity',
            '.MuiModal-hidden &': {
              opacity: 0,
              animation: 'htsModalSlideOutToRight 150ms ease-in both',
            },
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
              '.MuiModal-hidden &': {
                animation: 'none',
              },
            },
          };
        },
      },
    },
    JoyMenu: {
      defaultProps: {
        size: 'sm',
        modifiers: [
          { name: 'flip', options: { padding: 8 } },
          { name: 'preventOverflow', options: { altAxis: true, tether: false, padding: 8 } },
        ],
      },
      styleOverrides: {
        root: ({ theme }: any) => {
          return {
            padding: '4px',
            zIndex: 15000,
            '--ListItemDecorator-size': '24px',
            '--ListDivider-gap': '4px',
            gap: 2,
            minWidth: 180,
            maxHeight: 'calc(100dvh - 16px)',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            '& .MuiMenuItem-root': {
              borderRadius: theme.radius.md,
            },
          };
        },
      },
    },
    JoyTooltip: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--tooltip-bg)',
          color: 'var(--tooltip-text)',
          maxWidth: 'min(320px, calc(100vw - 32px))',
          whiteSpace: 'normal',
          wordBreak: 'normal',
          overflowWrap: 'break-word',
          lineHeight: 1.45,
          '&[data-popper-reference-hidden]': {
            visibility: 'hidden',
            pointerEvents: 'none',
            opacity: 0,
          },
          '&[data-popper-escaped]': {
            visibility: 'hidden',
            pointerEvents: 'none',
            opacity: 0,
          },
        },
      },
    },
    JoyAvatar: {
      styleOverrides: {
        root: ({ ownerState }: any) => ({
          border: '1px solid #e7e7e7',
          borderRadius: '50%',

          ...(ownerState.size === 'xs' && {
            width: 22,
            height: 22,
            fontSize: '0.75rem',
          }),

          '& img': {
            objectFit: 'cover',
            imageOrientation: 'from-image',
          },
        }),
      },
    },

    /* ================= TABLE ================= */
    JoyTable: {
      defaultProps: {
        size: 'sm',
        stickyHeader: true,
      },
      styleOverrides: {
        root: ({ theme }: any) => {
          const isDark = theme.palette.mode === 'dark';
          return {
            border: 'none',
            '--TableCell-paddingX': '1rem',
            '--TableCell-paddingY': '0.6rem',
            borderRadius: theme.radius.md,
            '& thead th': {
              fontSize: '13px',
              fontWeight: 500,
              borderBottom: '2px solid',
              borderColor: theme.vars.palette.divider,
              color: theme.palette.text.secondary,
              backgroundColor: isDark ? 'auto' : '#eeebff',
            },

            '& tbody tr': {
              '& td': {
                fontSize: '13px',
                fontWeight: 400,
                color: theme.palette.text.primary,
              },
              transition: 'all 0.2s ease',
              backgroundColor: isDark ? theme.palette.background.level1 : '#ffffff',

              '&:nth-of-type(even)': {
                backgroundColor: isDark ? '#1a1a2e' : '#fafbfc',
              },

              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: theme.shadow.sm,
                backgroundColor: isDark ? '#3b2d6b' : '#ede9fe',
              },
            },

            '& tbody td': {
              borderBottom: isDark ? '1px solid #2a2a3d' : '1px solid #f1f5f9',
            },
          };
        },
      },
    },

    /* ================= BUTTON ================= */
    JoyButton: {
      defaultProps: {
        size: 'sm',
        variant: 'solid',
        color: 'primary',
      },
      styleOverrides: {
        root: ({ theme, ownerState }: any) => {
          const color = theme.palette[ownerState.color || 'primary'];
          const isDark = theme.palette.mode === 'dark';
          return {
            borderRadius: theme.radius.md,
            fontSize: '12px',
            textTransform: 'none',
            cursor: 'pointer',
            transition: 'all 120ms ease-in-out',

            '&:hover': {
              ...(ownerState.variant === 'solid' && {
                backgroundColor: isDark ? color[400] : color[600],
              }),
              scale: 1.03,
              transform: 'translateY(-1px)',
              backgroundColor: '#6d28d9 !important',
              color: '#fff !important',
              '& .MuiTypography-root, & .JoyTypography-root': { color: 'inherit' },
              boxShadow: `0 3px 4px rgba(var(--joy-palette-primary-mainChannel) / 0.25),0 0 0 1px rgba(var(--joy-palette-primary-mainChannel) / 0.35)`,
            },
            ...(ownerState.variant === 'secondary' && {
              backgroundColor: '#F3F4F6',
              color: '#5B21B6',
              borderRadius: theme.radius.md,
              border: '1px solid rgba(229, 231, 235, 1)',
              '&:hover': {
                transform: 'translateY(-1px)',
                fontSize: '12.6px',
                backgroundColor: '#E5E7EB !important',
                color: '#5B21B6',
                boxShadow: `0 3px 4px rgba(var(--joy-palette-primary-mainChannel) / 0.25),0 0 0 1px rgba(var(--joy-palette-primary-mainChannel) / 0.35)`,
              },
              '&:active': {
                backgroundColor: '#E5E7EB',
              },
              '&.Mui-disabled': {
                opacity: 0.6,
                cursor: 'not-allowed',
              },
            }),
          };
        },
      },
    },

    /* ================= CHIP ================= */
    JoyChip: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          fontSize: '12px',
          fontWeight: 400,
          borderRadius: theme.radius.sm,
        }),
      },
    },

    /* ================= TABS ================= */
    JoyTabs: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          padding: 5,
          background: 'transparent',
          [`& .${tabClasses.root}`]: {
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: theme.radius.md,
            transition: '0.2s',

            '&:hover': {
              backgroundColor: theme.palette.primary[500],
              color: '#fff',
            },
          },
          [` .${tabListClasses.root}`]: {
            boxShadow: 'none',
            borderBottom: '0px',
            background: 'transparent',
          },

          [`& .${tabClasses.root}[aria-selected="true"]`]: {
            backgroundColor: theme.palette.primary[500],
            color: '#fff',
            boxShadow: theme.shadow.sm,
          },
        }),
      },
    },

    JoyTab: {
      defaultProps: {
        disableIndicator: true,
      },
    },

    JoyTabList: {
      styleOverrides: {
        root: {
          gap: 10,
        },
      },
    },

    /* ================= INPUT ================= */
    JoyInput: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          background: 'white',
          boxShadow: 'none',
          '& input': { fontSize: '14px', fontWeight: 400 },
          '& input::placeholder': {
            fontSize: '12px',
            fontWeight: 300,
            opacity: 1,
            color: '#696969',
          },
          '&:focus-within': {
            borderColor: theme.palette.primary[500],
            boxShadow: `0 0 0 2px ${theme.palette.primary[100]}`,
          },
        }),
      },
    },

    /* ================= TEXTAREA ================= */
    JoyTextarea: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          background: 'white',
          boxShadow: 'none',
          '& textarea': { fontSize: '14px', fontWeight: 400 },
          '& textarea::placeholder': { fontSize: '12px', fontWeight: 300, color: '#696969' },
          borderRadius: theme.radius.md,
          '&:focus-within': {
            borderColor: theme.palette.primary[500],
            boxShadow: `0 0 0 2px ${theme.palette.primary[100]}`,
          },
          minHeight: '100px',
        }),
      },
    },

    /* ================= SELECT ================= */
    JoySelect: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          '& .joy-select__button': { fontSize: '14px', fontWeight: 400 },
          '&:focus-within .joy-select__button': {
            boxShadow: `0 0 0 2px ${theme.palette.primary[100]}`,
          },
        }),
      },
    },

    /* ================= FORM LABEL ================= */
    JoyFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '15px',
          fontWeight: 500,
        },
      },
    },

    /* ================= TYPOGRAPHY ================= */
    JoyTypography: {
      styleOverrides: {
        root: ({ ownerState }: any) => {
          const font = 'var(--font-primary)';

          if (ownerState?.level === 'h1') {
            return {
              fontFamily: font,
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: '1.3',
            };
          }

          if (ownerState?.level === 'h2') {
            return {
              fontFamily: font,
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '1.35',
            };
          }

          if (ownerState?.level === 'h3') {
            return {
              fontFamily: font,
              fontWeight: 500,
              fontSize: '18px',
              lineHeight: '1.4',
            };
          }

          if (ownerState?.level === 'h4') {
            return {
              fontFamily: font,
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '1.45',
            };
          }

          return {};
        },
      },
    },

    JoySkeleton: {
      defaultProps: {
        animation: 'wave',
      },
    },
    JoyDialogTitle: {
      styleOverrides: {
        root: {
          paddingTop: '25px',
        },
      },
    },
  },
});

export default existingTheme;
