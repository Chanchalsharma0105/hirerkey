import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Drawer,
  Input,
  Divider,
} from '@mui/joy';
import { colors, radii, shadows, layout } from '../../theme/tokens';

export interface MobileAppShellProps {
  children: React.ReactNode;
  activeNavTab?: string;
  onSelectNavTab?: (tab: string) => void;
  title?: string;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  children,
  activeNavTab = 'dashboard',
  onSelectNavTab,
  title = 'Dashboard',
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
        </svg>
      ),
    },
    {
      id: 'offboarding',
      label: 'Departures',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      ),
    },
    {
      id: 'hyiq',
      label: 'HyIQ AI',
      isCenterAi: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="6" width="16" height="12" rx="3" fill="#FFFFFF" />
          <circle cx="8.5" cy="11.5" r="1.5" fill="#7C3AED" />
          <circle cx="15.5" cy="11.5" r="1.5" fill="#38BDF8" />
          <path d="M10 15h4" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="2" x2="12" y2="6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'approvals',
      label: 'Approvals',
      badge: 5,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: colors.surfaces.ground,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        pb: layout.mobileBottomNavHeight, // Space for bottom dock
      }}
    >
      {/* 1. Mobile Topbar Header */}
      <Box
        sx={{
          height: layout.mobileHeaderHeight,
          backgroundColor: '#FFFFFF',
          borderBottom: `1px solid ${colors.neutral[200]}`,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        {/* Left: Drawer Trigger + Brand Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconButton
            size="sm"
            variant="plain"
            onClick={() => setDrawerOpen(true)}
            sx={{
              color: colors.neutral[700],
              padding: '6px',
              minWidth: '36px',
              minHeight: '36px',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Box
              sx={{
                width: '26px',
                height: '26px',
                borderRadius: '7px',
                backgroundColor: colors.primary[500],
                display: 'grid',
                placeItems: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '14px',
              }}
            >
              H
            </Box>
            <Typography level="title-md" sx={{ fontWeight: 800, color: colors.neutral[900], fontSize: '16px' }}>
              Hirerkey
            </Typography>
          </Box>
        </Box>

        {/* Right: Notifications & Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Badge badgeContent={17} color="primary" size="sm">
            <IconButton
              size="sm"
              variant="plain"
              sx={{
                color: colors.neutral[600],
                minWidth: '36px',
                minHeight: '36px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </IconButton>
          </Badge>

          <Avatar
            size="sm"
            sx={{
              backgroundColor: colors.primary[100],
              color: colors.primary[700],
              fontWeight: 700,
              fontSize: '12px',
              border: `1.5px solid ${colors.primary[300]}`,
            }}
          >
            CS
          </Avatar>
        </Box>
      </Box>

      {/* 2. Main Body Content */}
      <Box sx={{ flex: 1, padding: '16px 14px' }}>
        {children}
      </Box>

      {/* 3. Mobile Floating Bottom Navigation Dock */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: layout.mobileBottomNavHeight,
          backgroundColor: '#FFFFFF',
          borderTop: `1px solid ${colors.neutral[200]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 200,
          boxShadow: shadows.mobileDock,
          padding: '0 8px',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeNavTab === item.id;

          if (item.isCenterAi) {
            return (
              <Box
                key={item.id}
                component="button"
                onClick={() => onSelectNavTab && onSelectNavTab(item.id)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transform: 'translateY(-10px)',
                }}
              >
                <Box
                  sx={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: colors.hyiq.gradient,
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
                    transition: 'transform 0.16s ease',
                    '&:active': { transform: 'scale(0.92)' },
                  }}
                >
                  {item.icon}
                </Box>
                <Typography level="badge" sx={{ color: colors.primary[600], fontSize: '10.5px' }}>
                  {item.label}
                </Typography>
              </Box>
            );
          }

          return (
            <Box
              key={item.id}
              component="button"
              onClick={() => onSelectNavTab && onSelectNavTab(item.id)}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                height: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? colors.primary[500] : colors.neutral[400],
                transition: 'color 0.16s ease',
                position: 'relative',
              }}
            >
              <Box sx={{ position: 'relative' }}>
                {item.icon}
                {item.badge && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-8px',
                      backgroundColor: colors.primary[500],
                      color: '#FFFFFF',
                      fontSize: '9px',
                      fontWeight: 700,
                      borderRadius: '6px',
                      padding: '1px 4px',
                      lineHeight: 1,
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
              </Box>
              <Typography
                level="caption"
                sx={{
                  color: isActive ? colors.primary[600] : colors.neutral[500],
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '11px',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* 4. Slide-Out Navigation Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="md"
        sx={{
          '& .MuiDrawer-content': {
            backgroundColor: '#FFFFFF',
            padding: '20px 16px',
            width: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        }}
      >
        <Box>
          {/* Drawer Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box
                sx={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: colors.primary[500],
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FFFFFF',
                  fontWeight: 800,
                }}
              >
                H
              </Box>
              <Typography level="title-md" sx={{ fontWeight: 800, color: colors.neutral[900] }}>
                Hirerkey Menu
              </Typography>
            </Box>
            <IconButton size="sm" variant="plain" onClick={() => setDrawerOpen(false)}>
              ✕
            </IconButton>
          </Box>

          {/* Drawer Search */}
          <Input
            placeholder="Search menus (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 1.5 }} />

          {/* Category Links */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Box
              onClick={() => {
                onSelectNavTab && onSelectNavTab('dashboard');
                setDrawerOpen(false);
              }}
              sx={{
                padding: '10px 12px',
                borderRadius: radii.md,
                backgroundColor: activeNavTab === 'dashboard' ? colors.primary[50] : 'transparent',
                color: activeNavTab === 'dashboard' ? colors.primary[600] : colors.neutral[700],
                fontWeight: activeNavTab === 'dashboard' ? 700 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              Dashboard
            </Box>

            <Box
              onClick={() => {
                onSelectNavTab && onSelectNavTab('offboarding');
                setDrawerOpen(false);
              }}
              sx={{
                padding: '10px 12px',
                borderRadius: radii.md,
                backgroundColor: activeNavTab === 'offboarding' ? colors.primary[50] : 'transparent',
                color: activeNavTab === 'offboarding' ? colors.primary[600] : colors.neutral[700],
                fontWeight: activeNavTab === 'offboarding' ? 700 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              Offboarding Management
            </Box>

            <Box
              sx={{
                padding: '10px 12px',
                borderRadius: radii.md,
                color: colors.neutral[700],
                fontWeight: 500,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              Performance & Appraisals
            </Box>

            <Box
              sx={{
                padding: '10px 12px',
                borderRadius: radii.md,
                color: colors.neutral[700],
                fontWeight: 500,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              Pulse Surveys
            </Box>

            <Box
              sx={{
                padding: '10px 12px',
                borderRadius: radii.md,
                color: colors.neutral[700],
                fontWeight: 500,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              Property Settings
            </Box>
          </Box>
        </Box>

        {/* Drawer Footer Workspace Switcher */}
        <Box
          sx={{
            padding: '10px 12px',
            borderRadius: radii.lg,
            border: `1px solid ${colors.neutral[200]}`,
            backgroundColor: colors.surfaces.surfaceAlt,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar size="sm" sx={{ backgroundColor: colors.primary[500], color: '#fff', fontSize: '11px' }}>
              HH
            </Avatar>
            <Box>
              <Typography level="body-xs" sx={{ fontWeight: 700, color: colors.neutral[900] }}>
                Habtoor Hospitality
              </Typography>
              <Typography level="caption" sx={{ color: colors.neutral[500] }}>
                Dubai HQ • 482 Staff
              </Typography>
            </Box>
          </Box>
          <Typography level="body-xs" sx={{ color: colors.neutral[400] }}>
            ↕
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
};
