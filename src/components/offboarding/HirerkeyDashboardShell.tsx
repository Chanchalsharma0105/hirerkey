import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Input,
  Breadcrumbs,
  Link as JoyLink,
  Button,
  Badge,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Tooltip,
} from '@mui/joy';
import {
  FiGrid,
  FiUserPlus,
  FiUsers,
  FiTarget,
  FiAward,
  FiGitBranch,
  FiActivity,
  FiCpu,
  FiBriefcase,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiHome,
} from 'react-icons/fi';

export interface HirerkeyDashboardShellProps {
  children: React.ReactNode;
  activeMenuKey?: string;
  onSelectMenu?: (menuKey: string) => void;
  caseName?: string | null;
  onBackToDepartures?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const HirerkeyDashboardShell: React.FC<HirerkeyDashboardShellProps> = ({
  children,
  activeMenuKey = 'offboarding',
  onSelectMenu,
  caseName = null,
  onBackToDepartures,
  searchQuery: controlledSearchQuery,
  onSearchChange,
}) => {
  // Sidebar collapsed state (72px rail vs 260px drawer)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Accordion open states
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    onboarding: false,
    employees: true, // Employees is open by default
    performance: false,
    appraisal: false,
    workflows: false,
    surveys: false,
    intelligence: false,
    workplace: false,
  });

  // Header state
  const [localSearchQuery, setLocalSearchQuery] = useState<string>('');
  const isControlledSearch = controlledSearchQuery !== undefined;
  const currentSearch = isControlledSearch ? controlledSearchQuery : localSearchQuery;

  const handleSearchChange = (val: string) => {
    if (!isControlledSearch) {
      setLocalSearchQuery(val);
    }
    onSearchChange?.(val);
  };

  const [isClockedIn, setIsClockedIn] = useState<boolean>(true);
  const [activeWorkspace, setActiveWorkspace] = useState<'admin' | 'employee'>('admin');

  const toggleGroup = (key: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMenuClick = (key: string) => {
    if (onSelectMenu) {
      onSelectMenu(key);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        bgcolor: '#F8FAFC',
        fontFamily: 'Inter, system-ui, sans-serif',
        position: 'relative',
      }}
    >
      {/* 1. AUTHENTIC HIRERKEY COLLAPSIBLE SIDEBAR */}
      <Box
        component="aside"
        sx={{
          width: isCollapsed ? '72px' : '260px',
          minWidth: isCollapsed ? '72px' : '260px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          bgcolor: '#001741',
          color: '#94A3B8',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          transition: 'width 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), min-width 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          boxShadow: '2px 0 16px rgba(0, 23, 65, 0.15)',
          userSelect: 'none',
          overflow: 'visible',
          flexShrink: 0,
        }}
      >
        {/* Sidebar Header & Brand Logo */}
        <Box
          sx={{
            height: '70px',
            px: isCollapsed ? 1 : 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
          }}
        >
          <Box
            onClick={() => onBackToDepartures && onBackToDepartures()}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              cursor: 'pointer',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Monogram Brand Mark */}
            <Box
              sx={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                display: 'grid',
                placeItems: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '15px',
                letterSpacing: '-0.02em',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                flexShrink: 0,
              }}
            >
              hy
            </Box>
            {!isCollapsed && (
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '18px',
                  letterSpacing: '-0.02em',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                hirerkey
              </Typography>
            )}
          </Box>

          {/* Sidebar Collapse Toggle Button */}
          <IconButton
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            sx={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              bgcolor: isCollapsed ? '#7C3AED' : 'rgba(255, 255, 255, 0.08)',
              border: '1px solid',
              borderColor: isCollapsed ? '#6D28D9' : 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              position: isCollapsed ? 'absolute' : 'initial',
              right: isCollapsed ? '-14px' : 'initial',
              top: isCollapsed ? '21px' : 'initial',
              zIndex: 120,
              boxShadow: isCollapsed ? '0 2px 8px rgba(0,0,0,0.35)' : 'none',
              '&:hover': {
                bgcolor: '#7C3AED',
                transform: 'scale(1.08)',
              },
              transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            {isCollapsed ? <FiChevronRight size={15} /> : <FiChevronLeft size={15} />}
          </IconButton>
        </Box>

        {/* Sidebar Nav List */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            p: '14px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255, 255, 255, 0.15)', borderRadius: '4px' },
          }}
        >
          {/* 1. Dashboard */}
          <Tooltip title={isCollapsed ? 'Dashboard' : ''} placement="right">
            <Box
              onClick={() => handleMenuClick('dashboard')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                p: '9px 12px',
                borderRadius: '10px',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '13.5px',
                fontWeight: 500,
                gap: 1.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  transform: isCollapsed ? 'scale(1.06)' : 'translateX(4px)',
                },
              }}
            >
              <FiGrid size={18} color="#A5B4FC" />
              {!isCollapsed && <Typography sx={{ color: 'inherit', fontSize: '13.5px', fontWeight: 500 }}>Dashboard</Typography>}
            </Box>
          </Tooltip>

          {/* 2. Onboarding (Accordion) */}
          <Tooltip title={isCollapsed ? 'Onboarding' : ''} placement="right">
            <Box>
              <Box
                onClick={() => toggleGroup('onboarding')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  p: '9px 12px',
                  borderRadius: '10px',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    transform: isCollapsed ? 'scale(1.06)' : 'translateX(4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FiUserPlus size={18} color="#A5B4FC" />
                  {!isCollapsed && <Typography sx={{ color: 'inherit', fontSize: '13.5px', fontWeight: 500 }}>Onboarding</Typography>}
                </Box>
                {!isCollapsed && (
                  <Box sx={{ transform: openGroups.onboarding ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                    <FiChevronDown size={14} />
                  </Box>
                )}
              </Box>

              {!isCollapsed && openGroups.onboarding && (
                <Box sx={{ pl: '36px', pr: 1, py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  <Typography
                    onClick={() => handleMenuClick('orientation')}
                    sx={{
                      p: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' },
                    }}
                  >
                    Orientation
                  </Typography>
                  <Typography
                    onClick={() => handleMenuClick('departmentTour')}
                    sx={{
                      p: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' },
                    }}
                  >
                    Department Tour
                  </Typography>
                </Box>
              )}
            </Box>
          </Tooltip>

          {/* 3. Employees (Accordion - OPEN & PRE-SELECTED) */}
          <Tooltip title={isCollapsed ? 'All Employees' : ''} placement="right">
            <Box>
              <Box
                onClick={() => toggleGroup('employees')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  p: '9px 12px',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    transform: isCollapsed ? 'scale(1.06)' : 'translateX(4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FiUsers size={18} color="#C4B5FD" />
                  {!isCollapsed && <Typography sx={{ color: '#FFFFFF', fontSize: '13.5px', fontWeight: 600 }}>Employees</Typography>}
                </Box>
                {!isCollapsed && (
                  <Box sx={{ transform: openGroups.employees ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                    <FiChevronDown size={14} color="#C4B5FD" />
                  </Box>
                )}
              </Box>

              {!isCollapsed && openGroups.employees && (
                <Box sx={{ pl: '36px', pr: 1, py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {/* Active */}
                  <Typography
                    onClick={() => handleMenuClick('activeUsers')}
                    sx={{
                      p: '7px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: activeMenuKey === 'activeUsers' ? '#FFFFFF' : '#94A3B8',
                      bgcolor: activeMenuKey === 'activeUsers' ? '#7C3AED' : 'transparent',
                      fontWeight: activeMenuKey === 'activeUsers' ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' },
                    }}
                  >
                    Active
                  </Typography>

                  {/* Pre-boarding */}
                  <Typography
                    onClick={() => handleMenuClick('preUsers')}
                    sx={{
                      p: '7px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: activeMenuKey === 'preUsers' ? '#FFFFFF' : '#94A3B8',
                      bgcolor: activeMenuKey === 'preUsers' ? '#7C3AED' : 'transparent',
                      fontWeight: activeMenuKey === 'preUsers' ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' },
                    }}
                  >
                    Pre-boarding
                  </Typography>

                  {/* Off-boarding: PRE-SELECTED */}
                  <Box
                    onClick={() => {
                      handleMenuClick('offboarding');
                      if (onBackToDepartures) onBackToDepartures();
                    }}
                    sx={{
                      p: '7px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#FFFFFF',
                      bgcolor: '#7C3AED',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.45)',
                      transition: 'all 0.2s',
                      position: 'relative',
                      '&:hover': { bgcolor: '#6D28D9' },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: '-12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '4px',
                        height: '16px',
                        borderRadius: '4px',
                        bgcolor: '#FFFFFF',
                      },
                    }}
                  >
                    <Typography sx={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>Off-boarding</Typography>
                    <Chip size="sm" variant="soft" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#FFF', fontSize: '11px', fontWeight: 700 }}>
                      4
                    </Chip>
                  </Box>
                </Box>
              )}
            </Box>
          </Tooltip>

          {/* 4. Performance Tools (Accordion) */}
          <Tooltip title={isCollapsed ? 'Performance Tools' : ''} placement="right">
            <Box>
              <Box
                onClick={() => toggleGroup('performance')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  p: '9px 12px',
                  borderRadius: '10px',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', transform: isCollapsed ? 'scale(1.06)' : 'translateX(4px)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FiTarget size={18} color="#A5B4FC" />
                  {!isCollapsed && <Typography sx={{ color: 'inherit', fontSize: '13.5px', fontWeight: 500 }}>Performance Tools</Typography>}
                </Box>
                {!isCollapsed && (
                  <Box sx={{ transform: openGroups.performance ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                    <FiChevronDown size={14} />
                  </Box>
                )}
              </Box>
              {!isCollapsed && openGroups.performance && (
                <Box sx={{ pl: '36px', pr: 1, py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>1-on-1 Check-ins</Typography>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>Key Job Responsibility</Typography>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>Key Performance Objective</Typography>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>Create Appraisals</Typography>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>Training Resources</Typography>
                </Box>
              )}
            </Box>
          </Tooltip>

          {/* 5. Appraisal */}
          <Tooltip title={isCollapsed ? 'Appraisal' : ''} placement="right">
            <Box>
              <Box
                onClick={() => toggleGroup('appraisal')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  p: '9px 12px',
                  borderRadius: '10px',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', transform: isCollapsed ? 'scale(1.06)' : 'translateX(4px)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FiAward size={18} color="#A5B4FC" />
                  {!isCollapsed && <Typography sx={{ color: 'inherit', fontSize: '13.5px', fontWeight: 500 }}>Appraisal</Typography>}
                </Box>
                {!isCollapsed && (
                  <Box sx={{ transform: openGroups.appraisal ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                    <FiChevronDown size={14} />
                  </Box>
                )}
              </Box>
              {!isCollapsed && openGroups.appraisal && (
                <Box sx={{ pl: '36px', pr: 1, py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>Manager Review</Typography>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>Side-by-Side Review</Typography>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>HR Final Review</Typography>
                </Box>
              )}
            </Box>
          </Tooltip>

          {/* 6. Workflows */}
          <Tooltip title={isCollapsed ? 'Workflows' : ''} placement="right">
            <Box>
              <Box
                onClick={() => toggleGroup('workflows')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  p: '9px 12px',
                  borderRadius: '10px',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', transform: isCollapsed ? 'scale(1.06)' : 'translateX(4px)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FiGitBranch size={18} color="#A5B4FC" />
                  {!isCollapsed && <Typography sx={{ color: 'inherit', fontSize: '13.5px', fontWeight: 500 }}>Workflows</Typography>}
                </Box>
                {!isCollapsed && (
                  <Box sx={{ transform: openGroups.workflows ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                    <FiChevronDown size={14} />
                  </Box>
                )}
              </Box>
              {!isCollapsed && openGroups.workflows && (
                <Box sx={{ pl: '36px', pr: 1, py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>Training Module</Typography>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>Assessment</Typography>
                </Box>
              )}
            </Box>
          </Tooltip>

          {/* 7. Pulse Surveys */}
          <Tooltip title={isCollapsed ? 'Pulse Surveys' : ''} placement="right">
            <Box>
              <Box
                onClick={() => toggleGroup('surveys')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  p: '9px 12px',
                  borderRadius: '10px',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', transform: isCollapsed ? 'scale(1.06)' : 'translateX(4px)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FiActivity size={18} color="#A5B4FC" />
                  {!isCollapsed && <Typography sx={{ color: 'inherit', fontSize: '13.5px', fontWeight: 500 }}>Pulse Surveys</Typography>}
                </Box>
                {!isCollapsed && (
                  <Box sx={{ transform: openGroups.surveys ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                    <FiChevronDown size={14} />
                  </Box>
                )}
              </Box>
              {!isCollapsed && openGroups.surveys && (
                <Box sx={{ pl: '36px', pr: 1, py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>Manage Pulse Surveys</Typography>
                </Box>
              )}
            </Box>
          </Tooltip>

          {/* 8. Intelligence */}
          <Tooltip title={isCollapsed ? 'Intelligence' : ''} placement="right">
            <Box>
              <Box
                onClick={() => toggleGroup('intelligence')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  p: '9px 12px',
                  borderRadius: '10px',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', transform: isCollapsed ? 'scale(1.06)' : 'translateX(4px)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FiCpu size={18} color="#A5B4FC" />
                  {!isCollapsed && <Typography sx={{ color: 'inherit', fontSize: '13.5px', fontWeight: 500 }}>Intelligence</Typography>}
                </Box>
                {!isCollapsed && (
                  <Box sx={{ transform: openGroups.intelligence ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                    <FiChevronDown size={14} />
                  </Box>
                )}
              </Box>
              {!isCollapsed && openGroups.intelligence && (
                <Box sx={{ pl: '36px', pr: 1, py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>Knowledge Hub</Typography>
                </Box>
              )}
            </Box>
          </Tooltip>

          {/* 9. Workplace */}
          <Tooltip title={isCollapsed ? 'Workplace' : ''} placement="right">
            <Box>
              <Box
                onClick={() => toggleGroup('workplace')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  p: '9px 12px',
                  borderRadius: '10px',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', transform: isCollapsed ? 'scale(1.06)' : 'translateX(4px)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FiBriefcase size={18} color="#A5B4FC" />
                  {!isCollapsed && <Typography sx={{ color: 'inherit', fontSize: '13.5px', fontWeight: 500 }}>Workplace</Typography>}
                </Box>
                {!isCollapsed && (
                  <Box sx={{ transform: openGroups.workplace ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                    <FiChevronDown size={14} />
                  </Box>
                )}
              </Box>
              {!isCollapsed && openGroups.workplace && (
                <Box sx={{ pl: '36px', pr: 1, py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '6px 10px', borderRadius: '8px', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' } }}>
                    <Typography sx={{ fontSize: '13px', color: '#94A3B8' }}>Pending Approvals</Typography>
                    <Chip size="sm" variant="soft" color="danger" sx={{ fontSize: '10px', fontWeight: 700 }}>3</Chip>
                  </Box>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>Shift Roster</Typography>
                  <Typography sx={{ p: '6px 10px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' } }}>Team Attendance</Typography>
                </Box>
              )}
            </Box>
          </Tooltip>
        </Box>
      </Box>

      {/* 2. MAIN CONTENT AREA & HEADER */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#F8FAFC',
          overflowX: 'hidden',
          transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Authentic Top Navigation Header */}
        <Box
          component="header"
          sx={{
            height: '72px',
            bgcolor: 'rgba(248, 250, 252, 0.96)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #E5E7EF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, md: 3 },
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          {/* Left: Sidebar Toggle + Search + Dynamic Breadcrumbs */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <IconButton
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={() => setIsCollapsed(!isCollapsed)}
              sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
              title="Toggle Sidebar (⌘B)"
            >
              {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
            </IconButton>

            <Input
              placeholder="Search..."
              value={currentSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              startDecorator={<FiSearch size={16} color="#64748B" />}
              endDecorator={<Chip size="sm" variant="soft" sx={{ fontSize: '10px', fontWeight: 600 }}>⌘K</Chip>}
              sx={{
                width: 300,
                display: { xs: 'none', lg: 'flex' },
                bgcolor: '#FFFFFF',
                borderRadius: '10px',
                fontFamily: 'Inter, system-ui, sans-serif',
                '&:focus-within': { borderColor: '#7C3AED' },
              }}
            />

            <Breadcrumbs separator="›" sx={{ pl: 0, fontSize: '12.5px', fontWeight: 500, color: '#64748B' }}>
              <JoyLink
                onClick={() => onBackToDepartures && onBackToDepartures()}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748B', textDecoration: 'none', cursor: 'pointer', '&:hover': { color: '#7C3AED' } }}
              >
                <FiHome size={13} /> Home
              </JoyLink>
              <Typography sx={{ color: '#475569' }}>Employees</Typography>
              <JoyLink
                onClick={() => onBackToDepartures && onBackToDepartures()}
                sx={{ color: caseName ? '#475569' : '#7C3AED', fontWeight: caseName ? 500 : 600, textDecoration: 'none', cursor: 'pointer' }}
              >
                Off-boarding
              </JoyLink>
              {caseName && (
                <Typography sx={{ color: '#7C3AED', fontWeight: 600 }}>{caseName}</Typography>
              )}
            </Breadcrumbs>
          </Box>

          {/* Right: Ask HyIQ + Attendance + Notifications + Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            {/* Ask HyIQ Trigger Button */}
            <Button
              variant="outlined"
              size="sm"
              sx={{
                borderRadius: '12px',
                bgcolor: '#FFFFFF',
                borderColor: '#DDD6FE',
                color: '#4B5563',
                fontWeight: 600,
                gap: 1,
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.08)',
                '&:hover': { bgcolor: '#F5F3FF', borderColor: '#C4B5FD' },
              }}
            >
              <Box
                sx={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #A855F7 0%, #6366F1 100%)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FFFFFF',
                  fontSize: '11px',
                }}
              >
                ✨
              </Box>
              Ask HyIQ
              <Chip size="sm" variant="soft" color="primary" sx={{ fontSize: '10px', height: '18px' }}>
                ⌘⇧Space
              </Chip>
            </Button>

            {/* Attendance Status Pill */}
            <Box
              onClick={() => setIsClockedIn(!isClockedIn)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                px: 1.5,
                py: 0.6,
                bgcolor: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  bgcolor: isClockedIn ? '#10B981' : '#F59E0B',
                  boxShadow: isClockedIn ? '0 0 0 4px rgba(16, 185, 129, 0.2)' : 'none',
                }}
              />
              {isClockedIn ? 'Clocked In · 09:15 AM' : 'Clocked Out'}
            </Box>

            {/* Notification Bell */}
            <IconButton
              size="sm"
              variant="outlined"
              color="neutral"
              sx={{ bgcolor: '#FFFFFF', borderRadius: '8px', position: 'relative' }}
            >
              <Badge badgeContent={3} color="danger" size="sm">
                <FiBell size={18} />
              </Badge>
            </IconButton>

            <Divider orientation="vertical" sx={{ height: '22px', my: 'auto' }} />

            {/* User Profile Pill & Dropdown */}
            <Dropdown>
              <MenuButton
                variant="plain"
                sx={{
                  p: '4px 12px 4px 4px',
                  borderRadius: '24px',
                  border: '1px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { bgcolor: '#F8FAFC' },
                }}
              >
                <Box
                  sx={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    bgcolor: '#7C3AED',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '12px',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  CS
                </Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Chanchal Sharma
                </Typography>
                <FiChevronDown size={14} color="#64748B" />
              </MenuButton>

              <Menu placement="bottom-end" size="sm" sx={{ width: '240px', borderRadius: '14px', p: 1 }}>
                <MenuItem sx={{ gap: 1.25, fontSize: '13px' }}>
                  <FiUser size={15} /> My Profile
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick('property_settings')} sx={{ gap: 1.25, fontSize: '13px' }}>
                  <FiSettings size={15} /> Property Settings
                </MenuItem>
                <MenuItem sx={{ gap: 1.25, fontSize: '13px', color: '#DC2626' }}>
                  <FiLogOut size={15} /> Logout
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                {/* 3D Neumorphic Pill Toggle */}
                <Box sx={{ px: 1, py: 0.5 }}>
                  <Typography level="body-xs" sx={{ fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 1 }}>
                    Switch Workspace
                  </Typography>
                  <Box
                    onClick={() => setActiveWorkspace(activeWorkspace === 'admin' ? 'employee' : 'admin')}
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '36px',
                      bgcolor: '#ECECF2',
                      borderRadius: '18px',
                      boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.08), inset -3px -3px 6px rgba(255,255,255,0.95)',
                      p: '3px',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', px: 1 }}>
                      <Typography sx={{ flex: 1, textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#8C8C9E' }}>
                        EMPLOYEE
                      </Typography>
                      <Typography sx={{ flex: 1, textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#8C8C9E' }}>
                        ADMIN
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '3px',
                        left: activeWorkspace === 'employee' ? '3px' : 'calc(50% + 1px)',
                        width: 'calc(50% - 4px)',
                        height: '30px',
                        borderRadius: '15px',
                        bgcolor: '#7C3AED',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '11px',
                        letterSpacing: '0.05em',
                        transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                      }}
                    >
                      {activeWorkspace.toUpperCase()}
                    </Box>
                  </Box>
                </Box>
              </Menu>
            </Dropdown>
          </Box>
        </Box>

        {/* Workspace Body */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
