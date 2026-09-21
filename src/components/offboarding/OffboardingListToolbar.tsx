import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
  Divider,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
  Checkbox,
  RadioGroup,
  Radio,
  Tooltip,
  Sheet,
} from '@mui/joy';
import {
  FiRefreshCw,
  FiDownload,
  FiX,
  FiFilter,
  FiChevronDown,
  FiCheck,
  FiSliders,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiUser,
  FiBriefcase,
  FiCheckCircle,
} from 'react-icons/fi';
import { OffboardingScope, OffboardingCase } from './types';

export interface OffboardingListToolbarProps {
  cases?: OffboardingCase[];
  totalCount?: number;
  inProgressCount?: number;
  closedCount?: number;
  scope: OffboardingScope;
  onScopeChange: (scope: OffboardingScope) => void;

  // Multi-select and Filter states
  selectedStatuses: string[];
  onStatusesChange: (statuses: string[]) => void;
  selectedDepartments: string[];
  onDepartmentsChange: (depts: string[]) => void;
  availableDepartments: string[];
  selectedReasons: string[];
  onReasonsChange: (reasons: string[]) => void;
  selectedEmployee: string;
  onEmployeeChange: (employee: string) => void;
  availableEmployees: { id: number; name: string; seat: string }[];
  selectedSuccessor: 'all' | 'assigned' | 'none';
  onSuccessorChange: (succ: 'all' | 'assigned' | 'none') => void;
  selectedDateRange: 'all' | '7_days' | '30_days' | '60_days';
  onDateRangeChange: (range: 'all' | '7_days' | '30_days' | '60_days') => void;

  // Sorting
  sortBy?: 'lwd' | 'name' | 'stage';
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sort: 'lwd' | 'name' | 'stage', order: 'asc' | 'desc') => void;

  // Active filter state and reset
  hasActiveFilters?: boolean;
  activeFilterCount?: number;
  searchQuery?: string;
  onClearSearch?: () => void;
  onClearFilters?: () => void;
  onRemoveFilter?: (filterType: string, val?: string) => void;

  // Actions
  onStartOffboarding: () => void;
  onExport?: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const OffboardingListToolbar: React.FC<OffboardingListToolbarProps> = ({
  cases,
  totalCount,
  inProgressCount,
  closedCount,
  scope,
  onScopeChange,
  selectedStatuses,
  onStatusesChange,
  selectedDepartments,
  onDepartmentsChange,
  availableDepartments,
  selectedReasons,
  onReasonsChange,
  selectedEmployee,
  onEmployeeChange,
  availableEmployees,
  selectedSuccessor,
  onSuccessorChange,
  selectedDateRange,
  onDateRangeChange,
  sortBy = 'lwd',
  sortOrder = 'asc',
  onSortChange,
  hasActiveFilters = false,
  activeFilterCount = 0,
  searchQuery = '',
  onClearSearch,
  onClearFilters,
  onRemoveFilter,
  onStartOffboarding,
  onExport,
  onRefresh,
  isRefreshing = false,
}) => {
  // Staged filter state for Apply behavior in Filter Popover
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [stagedStatuses, setStagedStatuses] = useState<string[]>(selectedStatuses);
  const [stagedDepartments, setStagedDepartments] = useState<string[]>(selectedDepartments);
  const [stagedReasons, setStagedReasons] = useState<string[]>(selectedReasons);
  const [stagedEmployee, setStagedEmployee] = useState<string>(selectedEmployee);
  const [stagedSuccessor, setStagedSuccessor] = useState<'all' | 'assigned' | 'none'>(selectedSuccessor);
  const [stagedDateRange, setStagedDateRange] = useState<'all' | '7_days' | '30_days' | '60_days'>(selectedDateRange);

  // Sync staged state when popover opens or prop changes
  useEffect(() => {
    setStagedStatuses(selectedStatuses);
    setStagedDepartments(selectedDepartments);
    setStagedReasons(selectedReasons);
    setStagedEmployee(selectedEmployee);
    setStagedSuccessor(selectedSuccessor);
    setStagedDateRange(selectedDateRange);
  }, [selectedStatuses, selectedDepartments, selectedReasons, selectedEmployee, selectedSuccessor, selectedDateRange, filterMenuOpen]);

  const handleApplyFilters = () => {
    onStatusesChange(stagedStatuses);
    onDepartmentsChange(stagedDepartments);
    onReasonsChange(stagedReasons);
    onEmployeeChange(stagedEmployee);
    onSuccessorChange(stagedSuccessor);
    onDateRangeChange(stagedDateRange);
    setFilterMenuOpen(false);
  };

  const handleResetStaged = () => {
    setStagedStatuses([]);
    setStagedDepartments([]);
    setStagedReasons([]);
    setStagedEmployee('all');
    setStagedSuccessor('all');
    setStagedDateRange('all');
  };

  // Toggle helper for multi-select arrays
  const toggleArrayItem = (list: string[], item: string): string[] => {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  // Compute counts from cases if not directly provided
  const computedInProgress = inProgressCount !== undefined
    ? inProgressCount
    : (cases ? cases.filter((c) => c.stage < 3).length : 0);

  const computedClosed = closedCount !== undefined
    ? closedCount
    : (cases ? cases.filter((c) => c.stage === 3).length : 0);

  const displayCount = totalCount !== undefined
    ? totalCount
    : (cases ? cases.length : 0);

  // Friendly status labels
  const statusLabels: Record<string, string> = {
    notice_initiated: 'Notice initiated',
    serving_notice: 'Serving notice',
    clearing: 'Exit clearance',
    closed: 'Closed',
  };

  // Friendly reason labels
  const reasonLabels: Record<string, string> = {
    resignation: 'Resignation',
    retirement: 'Retirement',
    termination: 'Termination',
    death_in_service: 'Death in service',
    end_of_contract: 'End of contract',
  };

  const dateLabels: Record<string, string> = {
    '7_days': 'Next 7 days',
    '30_days': 'Next 30 days',
    '60_days': 'Next 60 days',
  };

  return (
    <>
      {/* 1. Authentic Hirerkey SubHeader Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          p: { xs: 1, md: 1.25 },
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        {/* Left Side: Filter, Sort, Refresh */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {/* 1. AUTHENTIC HIRERKEY FILTER DROPDOWN */}
          <Dropdown open={filterMenuOpen} onOpenChange={(_, isOpen) => setFilterMenuOpen(isOpen)}>
            <Tooltip title="Filter departures">
              <MenuButton
                slots={{ root: Button }}
                slotProps={{
                  root: {
                    size: 'sm',
                    variant: activeFilterCount > 0 ? 'soft' : 'outlined',
                    color: activeFilterCount > 0 ? 'primary' : 'neutral',
                    startDecorator: <FiFilter size={14} />,
                    endDecorator: <FiChevronDown size={12} />,
                    sx: {
                      fontFamily: 'Inter, system-ui, sans-serif',
                      height: '32px',
                      fontSize: '12.5px',
                      fontWeight: activeFilterCount > 0 ? 600 : 500,
                      bgcolor: activeFilterCount > 0 ? '#EDE9FE' : '#FFFFFF',
                      color: activeFilterCount > 0 ? '#7C3AED' : '#334155',
                      borderColor: activeFilterCount > 0 ? '#DDD6FE' : '#E2E8F0',
                      '&:hover': {
                        bgcolor: activeFilterCount > 0 ? '#DDD6FE' : '#F8FAFC',
                      },
                    },
                  },
                }}
              >
                Filter
                {activeFilterCount > 0 && (
                  <Chip
                    size="sm"
                    variant="solid"
                    sx={{
                      bgcolor: '#7C3AED',
                      color: '#ffffff',
                      height: '18px',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      px: '5px',
                      ml: 0.25,
                    }}
                  >
                    {activeFilterCount}
                  </Chip>
                )}
              </MenuButton>
            </Tooltip>

            {/* Filter Dropdown Popover */}
            <Menu
              placement="bottom-end"
              sx={{
                width: { xs: 320, sm: 380 },
                maxHeight: 520,
                p: 0,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 23, 65, 0.12)',
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                zIndex: 1300,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Filter Popover Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.5,
                  bgcolor: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiSliders size={14} color="#7C3AED" />
                  <Typography level="title-sm" sx={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>
                    Filter Departures
                  </Typography>
                  {activeFilterCount > 0 && (
                    <Chip size="sm" variant="soft" color="primary" sx={{ fontSize: '10.5px', height: '18px', px: '5px' }}>
                      {activeFilterCount} active
                    </Chip>
                  )}
                </Box>
                <Button
                  size="sm"
                  variant="plain"
                  color="neutral"
                  onClick={handleResetStaged}
                  sx={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', p: 0, minHeight: 'unset', '&:hover': { color: '#DC2626' } }}
                >
                  Reset all
                </Button>
              </Box>

              {/* Scrollable Filter Form Controls */}
              <Box sx={{ p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* 1. Status Multi-select */}
                <Box>
                  <Typography level="body-xs" sx={{ fontWeight: 700, color: '#64748B', mb: 1, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Status
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    {[
                      { key: 'notice_initiated', label: 'Notice initiated' },
                      { key: 'serving_notice', label: 'Serving notice' },
                      { key: 'clearing', label: 'Exit clearance' },
                      ...(scope === 'closed' ? [{ key: 'closed', label: 'Closed' }] : []),
                    ].map((st) => {
                      const checked = stagedStatuses.includes(st.key);
                      return (
                        <Box
                          key={st.key}
                          onClick={() => setStagedStatuses(toggleArrayItem(stagedStatuses, st.key))}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 0.75,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            bgcolor: checked ? '#F5F3FF' : 'transparent',
                            border: `1px solid ${checked ? '#DDD6FE' : 'transparent'}`,
                            '&:hover': { bgcolor: '#F8FAFC' },
                          }}
                        >
                          <Checkbox size="sm" checked={checked} readOnly sx={{ pointerEvents: 'none' }} />
                          <Typography level="body-xs" sx={{ fontSize: '12px', fontWeight: checked ? 600 : 400, color: checked ? '#7C3AED' : '#334155' }}>
                            {st.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                <Divider sx={{ bgcolor: '#F1F5F9' }} />

                {/* 2. Department Multi-select */}
                <Box>
                  <Typography level="body-xs" sx={{ fontWeight: 700, color: '#64748B', mb: 1, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Department
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    {availableDepartments.map((dept) => {
                      const checked = stagedDepartments.includes(dept);
                      return (
                        <Box
                          key={dept}
                          onClick={() => setStagedDepartments(toggleArrayItem(stagedDepartments, dept))}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 0.75,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            bgcolor: checked ? '#F5F3FF' : 'transparent',
                            border: `1px solid ${checked ? '#DDD6FE' : 'transparent'}`,
                            '&:hover': { bgcolor: '#F8FAFC' },
                          }}
                        >
                          <Checkbox size="sm" checked={checked} readOnly sx={{ pointerEvents: 'none' }} />
                          <Typography level="body-xs" sx={{ fontSize: '12px', fontWeight: checked ? 600 : 400, color: checked ? '#7C3AED' : '#334155' }}>
                            {dept}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                <Divider sx={{ bgcolor: '#F1F5F9' }} />

                {/* 3. Exit Reason / Scenario Multi-select */}
                <Box>
                  <Typography level="body-xs" sx={{ fontWeight: 700, color: '#64748B', mb: 1, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Exit Scenario
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {[
                      { key: 'resignation', label: 'Resignation (voluntary)' },
                      { key: 'retirement', label: 'Retirement' },
                      { key: 'termination', label: 'Termination' },
                      { key: 'death_in_service', label: 'Death in service' },
                    ].map((reason) => {
                      const checked = stagedReasons.includes(reason.key);
                      return (
                        <Box
                          key={reason.key}
                          onClick={() => setStagedReasons(toggleArrayItem(stagedReasons, reason.key))}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 0.75,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            bgcolor: checked ? '#F5F3FF' : 'transparent',
                            border: `1px solid ${checked ? '#DDD6FE' : 'transparent'}`,
                            '&:hover': { bgcolor: '#F8FAFC' },
                          }}
                        >
                          <Checkbox size="sm" checked={checked} readOnly sx={{ pointerEvents: 'none' }} />
                          <Typography level="body-xs" sx={{ fontSize: '12px', fontWeight: checked ? 600 : 400, color: checked ? '#7C3AED' : '#334155' }}>
                            {reason.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                <Divider sx={{ bgcolor: '#F1F5F9' }} />

                {/* 4. Employee Filter */}
                <Box>
                  <Typography level="body-xs" sx={{ fontWeight: 700, color: '#64748B', mb: 1, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Employee
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box
                      onClick={() => setStagedEmployee('all')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 0.75,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        bgcolor: stagedEmployee === 'all' ? '#F5F3FF' : 'transparent',
                        border: `1px solid ${stagedEmployee === 'all' ? '#DDD6FE' : 'transparent'}`,
                        '&:hover': { bgcolor: '#F8FAFC' },
                      }}
                    >
                      <Typography level="body-xs" sx={{ fontSize: '12px', fontWeight: stagedEmployee === 'all' ? 600 : 400, color: stagedEmployee === 'all' ? '#7C3AED' : '#334155' }}>
                        All employees
                      </Typography>
                      {stagedEmployee === 'all' && <FiCheck size={14} color="#7C3AED" />}
                    </Box>
                    {availableEmployees.map((emp) => (
                      <Box
                        key={emp.id}
                        onClick={() => setStagedEmployee(emp.name)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 0.75,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          bgcolor: stagedEmployee === emp.name ? '#F5F3FF' : 'transparent',
                          border: `1px solid ${stagedEmployee === emp.name ? '#DDD6FE' : 'transparent'}`,
                          '&:hover': { bgcolor: '#F8FAFC' },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography level="body-xs" sx={{ fontSize: '12px', fontWeight: stagedEmployee === emp.name ? 600 : 400, color: stagedEmployee === emp.name ? '#7C3AED' : '#334155' }}>
                            {emp.name}
                          </Typography>
                          <Typography level="body-xs" sx={{ fontSize: '11px', color: '#94A3B8' }}>
                            ({emp.seat})
                          </Typography>
                        </Box>
                        {stagedEmployee === emp.name && <FiCheck size={14} color="#7C3AED" />}
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ bgcolor: '#F1F5F9' }} />

                {/* 5. Succession Coverage */}
                <Box>
                  <Typography level="body-xs" sx={{ fontWeight: 700, color: '#64748B', mb: 1, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Succession Coverage
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'assigned', label: 'Successor assigned' },
                      { key: 'none', label: 'No successor' },
                    ].map((succ) => {
                      const isSel = stagedSuccessor === succ.key;
                      return (
                        <Button
                          key={succ.key}
                          size="sm"
                          variant={isSel ? 'soft' : 'outlined'}
                          color={isSel ? 'primary' : 'neutral'}
                          onClick={() => setStagedSuccessor(succ.key as any)}
                          sx={{
                            fontSize: '11.5px',
                            fontWeight: isSel ? 600 : 400,
                            borderRadius: '6px',
                            height: '28px',
                            flex: 1,
                            bgcolor: isSel ? '#EDE9FE' : '#FFFFFF',
                            color: isSel ? '#7C3AED' : '#475569',
                            borderColor: isSel ? '#DDD6FE' : '#E2E8F0',
                          }}
                        >
                          {succ.label}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>

                <Divider sx={{ bgcolor: '#F1F5F9' }} />

                {/* 6. Date Range Window */}
                <Box>
                  <Typography level="body-xs" sx={{ fontWeight: 700, color: '#64748B', mb: 1, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Last Working Day Window
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    {[
                      { key: 'all', label: 'All dates' },
                      { key: '7_days', label: 'Next 7 days' },
                      { key: '30_days', label: 'Next 30 days' },
                      { key: '60_days', label: 'Next 60 days' },
                    ].map((d) => {
                      const isSel = stagedDateRange === d.key;
                      return (
                        <Button
                          key={d.key}
                          size="sm"
                          variant={isSel ? 'soft' : 'outlined'}
                          color={isSel ? 'primary' : 'neutral'}
                          onClick={() => setStagedDateRange(d.key as any)}
                          sx={{
                            fontSize: '11.5px',
                            fontWeight: isSel ? 600 : 400,
                            borderRadius: '6px',
                            height: '28px',
                            bgcolor: isSel ? '#EDE9FE' : '#FFFFFF',
                            color: isSel ? '#7C3AED' : '#475569',
                            borderColor: isSel ? '#DDD6FE' : '#E2E8F0',
                          }}
                        >
                          {d.label}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              </Box>

              {/* Popover Footer with Apply & Reset Actions */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  bgcolor: '#F8FAFC',
                  borderTop: '1px solid #E2E8F0',
                }}
              >
                <Button
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  onClick={() => setFilterMenuOpen(false)}
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    borderRadius: '6px',
                    height: '30px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  onClick={handleApplyFilters}
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    bgcolor: '#7C3AED',
                    color: '#ffffff',
                    borderRadius: '6px',
                    height: '30px',
                    px: 2,
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(124, 58, 237, 0.25)',
                    '&:hover': { bgcolor: '#6D28D9' },
                  }}
                >
                  Apply filters
                </Button>
              </Box>
            </Menu>
          </Dropdown>

          {/* 2. AUTHENTIC HIRERKEY SORT DROPDOWN (matching zs pattern) */}
          <Dropdown>
            <Tooltip title="Sort departures">
              <MenuButton
                slots={{ root: Button }}
                slotProps={{
                  root: {
                    size: 'sm',
                    variant: 'outlined',
                    color: 'neutral',
                    startDecorator: sortOrder === 'asc' ? <FiArrowUp size={13} /> : <FiArrowDown size={13} />,
                    endDecorator: <FiChevronDown size={12} />,
                    sx: {
                      fontFamily: 'Inter, system-ui, sans-serif',
                      height: '32px',
                      fontSize: '12.5px',
                      fontWeight: 500,
                      bgcolor: '#FFFFFF',
                      color: '#334155',
                      borderColor: '#E2E8F0',
                      '&:hover': { bgcolor: '#F8FAFC' },
                    },
                  },
                }}
              >
                Sort
              </MenuButton>
            </Tooltip>
            <Menu
              placement="bottom-end"
              sx={{
                minWidth: 210,
                p: 0.75,
                borderRadius: '10px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                border: '1px solid #E2E8F0',
                zIndex: 1300,
              }}
            >
              <Typography level="body-xs" sx={{ px: 1.5, py: 0.75, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', fontSize: '10.5px' }}>
                Sort departures by
              </Typography>
              {[
                { key: 'lwd', order: 'asc', label: 'Last Working Day (Earliest)' },
                { key: 'lwd', order: 'desc', label: 'Last Working Day (Latest)' },
                { key: 'name', order: 'asc', label: 'Employee Name (A–Z)' },
                { key: 'name', order: 'desc', label: 'Employee Name (Z–A)' },
                { key: 'stage', order: 'asc', label: 'Stage (Progressive)' },
              ].map((opt) => {
                const isCurrent = sortBy === opt.key && sortOrder === opt.order;
                return (
                  <MenuItem
                    key={`${opt.key}-${opt.order}`}
                    selected={isCurrent}
                    onClick={() => onSortChange?.(opt.key as any, opt.order as any)}
                    sx={{
                      fontSize: '12.5px',
                      fontWeight: isCurrent ? 600 : 400,
                      color: isCurrent ? '#7C3AED' : '#334155',
                      bgcolor: isCurrent ? '#F5F3FF' : 'transparent',
                      borderRadius: '6px',
                      py: 0.85,
                      px: 1.25,
                      my: 0.25,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      '&:hover': { bgcolor: '#F8FAFC' },
                    }}
                  >
                    {opt.label}
                    {isCurrent && <FiCheck size={14} color="#7C3AED" />}
                  </MenuItem>
                );
              })}
            </Menu>
          </Dropdown>

          {/* 3. Refresh Action Button */}
          <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={onRefresh}
            loading={isRefreshing}
            sx={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              bgcolor: '#FFFFFF',
              borderColor: '#E2E8F0',
              '&:hover': { bgcolor: '#F8FAFC' },
            }}
            title="Refresh departures"
          >
            <FiRefreshCw size={14} />
          </IconButton>
        </Box>

        {/* Right: Export and Start Offboarding Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={onExport}
            startDecorator={<FiDownload size={13} />}
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              borderRadius: '8px',
              height: '32px',
              fontSize: '12.5px',
              fontWeight: 500,
              bgcolor: '#FFFFFF',
              color: '#334155',
              borderColor: '#E2E8F0',
              '&:hover': { bgcolor: '#F8FAFC' },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* 2. Below the bar and above the table: No. of Records & Active Filter Chips */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          mt: 1.25,
          mb: 0.5,
          px: 0.25,
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        {/* Left: Summary Count & Active Filter Indicator Chips */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', flex: 1 }}>
          <Typography
            level="body-sm"
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#334155',
              mr: 0.5,
            }}
          >
            {displayCount} {displayCount === 1 ? 'record' : 'records'}
          </Typography>

          {/* Active Filter Chips with Individual ✕ Dismissal */}
          {hasActiveFilters && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
              {/* Status Chips */}
              {selectedStatuses.map((st) => (
                <Chip
                  key={st}
                  size="sm"
                  variant="soft"
                  color="primary"
                  endDecorator={
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="primary"
                      onClick={() => onRemoveFilter ? onRemoveFilter('status', st) : onStatusesChange(selectedStatuses.filter((s) => s !== st))}
                      sx={{ width: 14, height: 14, minHeight: 14, p: 0, '&:hover': { bgcolor: 'transparent' } }}
                    >
                      <FiX size={10} />
                    </IconButton>
                  }
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    bgcolor: '#EDE9FE',
                    color: '#7C3AED',
                    height: '24px',
                  }}
                >
                  Status: {statusLabels[st] || st}
                </Chip>
              ))}

              {/* Department Chips */}
              {selectedDepartments.map((dept) => (
                <Chip
                  key={dept}
                  size="sm"
                  variant="soft"
                  color="primary"
                  endDecorator={
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="primary"
                      onClick={() => onRemoveFilter ? onRemoveFilter('department', dept) : onDepartmentsChange(selectedDepartments.filter((d) => d !== dept))}
                      sx={{ width: 14, height: 14, minHeight: 14, p: 0, '&:hover': { bgcolor: 'transparent' } }}
                    >
                      <FiX size={10} />
                    </IconButton>
                  }
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    bgcolor: '#EDE9FE',
                    color: '#7C3AED',
                    height: '24px',
                  }}
                >
                  Dept: {dept}
                </Chip>
              ))}

              {/* Reason Chips */}
              {selectedReasons.map((r) => (
                <Chip
                  key={r}
                  size="sm"
                  variant="soft"
                  color="primary"
                  endDecorator={
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="primary"
                      onClick={() => onRemoveFilter ? onRemoveFilter('reason', r) : onReasonsChange(selectedReasons.filter((item) => item !== r))}
                      sx={{ width: 14, height: 14, minHeight: 14, p: 0, '&:hover': { bgcolor: 'transparent' } }}
                    >
                      <FiX size={10} />
                    </IconButton>
                  }
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    bgcolor: '#EDE9FE',
                    color: '#7C3AED',
                    height: '24px',
                  }}
                >
                  Type: {reasonLabels[r] || r}
                </Chip>
              ))}

              {/* Employee Chip */}
              {selectedEmployee !== 'all' && (
                <Chip
                  size="sm"
                  variant="soft"
                  color="primary"
                  endDecorator={
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="primary"
                      onClick={() => onRemoveFilter ? onRemoveFilter('employee') : onEmployeeChange('all')}
                      sx={{ width: 14, height: 14, minHeight: 14, p: 0, '&:hover': { bgcolor: 'transparent' } }}
                    >
                      <FiX size={10} />
                    </IconButton>
                  }
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    bgcolor: '#EDE9FE',
                    color: '#7C3AED',
                    height: '24px',
                  }}
                >
                  Employee: {selectedEmployee}
                </Chip>
              )}

              {/* Successor Coverage Chip */}
              {selectedSuccessor !== 'all' && (
                <Chip
                  size="sm"
                  variant="soft"
                  color="primary"
                  endDecorator={
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="primary"
                      onClick={() => onRemoveFilter ? onRemoveFilter('successor') : onSuccessorChange('all')}
                      sx={{ width: 14, height: 14, minHeight: 14, p: 0, '&:hover': { bgcolor: 'transparent' } }}
                    >
                      <FiX size={10} />
                    </IconButton>
                  }
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    bgcolor: '#EDE9FE',
                    color: '#7C3AED',
                    height: '24px',
                  }}
                >
                  Coverage: {selectedSuccessor === 'assigned' ? 'Successor assigned' : 'No successor'}
                </Chip>
              )}

              {/* Date Window Chip */}
              {selectedDateRange !== 'all' && (
                <Chip
                  size="sm"
                  variant="soft"
                  color="primary"
                  endDecorator={
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="primary"
                      onClick={() => onRemoveFilter ? onRemoveFilter('dateRange') : onDateRangeChange('all')}
                      sx={{ width: 14, height: 14, minHeight: 14, p: 0, '&:hover': { bgcolor: 'transparent' } }}
                    >
                      <FiX size={10} />
                    </IconButton>
                  }
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    bgcolor: '#EDE9FE',
                    color: '#7C3AED',
                    height: '24px',
                  }}
                >
                  Date: {dateLabels[selectedDateRange] || selectedDateRange}
                </Chip>
              )}

              {/* Search Query Chip */}
              {searchQuery && searchQuery.trim() !== '' && (
                <Chip
                  size="sm"
                  variant="soft"
                  color="primary"
                  endDecorator={
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="primary"
                      onClick={() => onRemoveFilter ? onRemoveFilter('search') : onClearSearch?.()}
                      sx={{ width: 14, height: 14, minHeight: 14, p: 0, '&:hover': { bgcolor: 'transparent' } }}
                    >
                      <FiX size={10} />
                    </IconButton>
                  }
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    bgcolor: '#EDE9FE',
                    color: '#7C3AED',
                    height: '24px',
                  }}
                >
                  Search: &ldquo;{searchQuery}&rdquo;
                </Chip>
              )}

              {/* Clear all action */}
              {onClearFilters && (
                <Button
                  size="sm"
                  variant="plain"
                  color="danger"
                  onClick={onClearFilters}
                  startDecorator={<FiX size={12} />}
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    height: '24px',
                    fontSize: '11px',
                    fontWeight: 600,
                    px: 0.75,
                    color: '#DC2626',
                    '&:hover': { bgcolor: '#FEF2F2' },
                  }}
                >
                  Clear all
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
