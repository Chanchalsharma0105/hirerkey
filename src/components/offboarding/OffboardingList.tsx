import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Modal,
  ModalDialog,
  ModalClose,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Button,
  Drawer,
  Divider,
  Chip,
  Textarea,
  Avatar,
} from '@mui/joy';
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiUser,
  FiCalendar,
  FiClock,
  FiArrowRight,
  FiCornerUpLeft,
} from 'react-icons/fi';
import { OffboardingListToolbar } from './OffboardingListToolbar';
import { OffboardingTable } from './OffboardingTable';
import { OffboardingCaseDetail } from './OffboardingCaseDetail';
import { OffboardingUserView } from './OffboardingUserView';
import { HirerkeyDashboardShell } from './HirerkeyDashboardShell';
import { OffboardingCase, OffboardingScope, REASONS_LIST, STAGE_CONFIGS } from './types';
import { INITIAL_OFFBOARDING_CASES } from './mockData';

export interface OffboardingListProps {
  initialCases?: OffboardingCase[];
  onOpenCase?: (caseId: number) => void;
  withDashboardShell?: boolean;
}

export const OffboardingList: React.FC<OffboardingListProps> = ({
  initialCases = INITIAL_OFFBOARDING_CASES,
  onOpenCase,
  withDashboardShell = true,
}) => {
  const [cases, setCases] = useState<OffboardingCase[]>(initialCases);
  const [scope, setScope] = useState<OffboardingScope>('progress');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedSuccessor, setSelectedSuccessor] = useState<'all' | 'assigned' | 'none'>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<'all' | '7_days' | '30_days' | '60_days'>('all');
  const [sortBy, setSortBy] = useState<'lwd' | 'name' | 'stage'>('lwd');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Screen View State (Screen 1: List, Screen 2: Case Workspace, Screen 4: User's View)
  const [currentView, setCurrentView] = useState<'list' | 'case' | 'user'>('list');
  const [selectedCaseId, setSelectedCaseId] = useState<number>(1);

  // Modal & Drawer State
  const [isStartModalOpen, setIsStartModalOpen] = useState<boolean>(false);
  const [selectedCaseForDrawer, setSelectedCaseForDrawer] = useState<OffboardingCase | null>(null);
  const [withdrawModalCase, setWithdrawModalCase] = useState<OffboardingCase | null>(null);
  const [withdrawReason, setWithdrawReason] = useState<string>('');

  // Available presets for Start Offboarding modal
  const AVAILABLE_START_EMPLOYEES = [
    { name: 'Sara Khan', title: 'Front Desk Manager', seat: 'FDM-01', department: 'Front Office' },
    { name: 'Rahul Mehta', title: 'Sous Chef', seat: 'SC-02', department: 'Kitchen' },
    { name: 'Leena Joseph', title: 'Housekeeping Supervisor', seat: 'HKS-03', department: 'Housekeeping' },
    { name: 'Carlos Gomez', title: 'Senior Bartender', seat: 'BAR-02', department: 'Food & Beverage' },
  ];

  // Start Offboarding Form State - Authentic Hirerkey flow (resignation received via email)
  const [startForm, setStartForm] = useState({
    employeeName: 'Sara Khan',
    title: 'Front Desk Manager',
    seat: 'FDM-01',
    department: 'Front Office',
    reason: 'resignation',
    noticeGivenDate: '2026-09-15',
    lastWorkingDay: '2026-10-15',
    successor: 'Omar Haddad',
  });

  // Unique departments list
  const departments = useMemo(() => {
    return Array.from(new Set(cases.map((c) => c.department)));
  }, [cases]);

  // Available employees for filter
  const availableEmployees = useMemo(() => {
    return cases.map((c) => ({ id: c.id, name: c.name, seat: c.seat }));
  }, [cases]);

  // Compute active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += selectedStatuses.length;
    count += selectedDepts.length;
    count += selectedReasons.length;
    if (selectedEmployee !== 'all') count += 1;
    if (selectedSuccessor !== 'all') count += 1;
    if (selectedDateRange !== 'all') count += 1;
    return count;
  }, [selectedStatuses, selectedDepts, selectedReasons, selectedEmployee, selectedSuccessor, selectedDateRange]);

  // Check if any filter or search query is currently active
  const hasActiveFilters = useMemo(() => {
    return activeFilterCount > 0 || searchQuery.trim() !== '';
  }, [activeFilterCount, searchQuery]);

  const handleClearFilters = () => {
    setSelectedStatuses([]);
    setSelectedDepts([]);
    setSelectedReasons([]);
    setSelectedEmployee('all');
    setSelectedSuccessor('all');
    setSelectedDateRange('all');
    setSearchQuery('');
    setPage(1);
    setToastMessage('All filters have been reset.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRemoveFilter = (filterType: string, val?: string) => {
    if (filterType === 'status' && val) {
      setSelectedStatuses((prev) => prev.filter((s) => s !== val));
    } else if (filterType === 'department' && val) {
      setSelectedDepts((prev) => prev.filter((d) => d !== val));
    } else if (filterType === 'reason' && val) {
      setSelectedReasons((prev) => prev.filter((r) => r !== val));
    } else if (filterType === 'employee') {
      setSelectedEmployee('all');
    } else if (filterType === 'successor') {
      setSelectedSuccessor('all');
    } else if (filterType === 'dateRange') {
      setSelectedDateRange('all');
    } else if (filterType === 'search') {
      setSearchQuery('');
    }
    setPage(1);
  };

  const handleSortChange = (newSort: 'lwd' | 'name' | 'stage', newOrder: 'asc' | 'desc') => {
    setSortBy(newSort);
    setSortOrder(newOrder);
    setPage(1);
  };

  // Helper to parse days remaining for date range filter
  const getDaysRemaining = (c: OffboardingCase): number => {
    if (c.dueText) {
      const lower = c.dueText.toLowerCase();
      if (lower.includes('today')) return 0;
      const matchIn = lower.match(/in\s+(\d+)\s+day/);
      if (matchIn) return parseInt(matchIn[1], 10);
      const matchAgo = lower.match(/left\s+(\d+)\s+day/);
      if (matchAgo) return -parseInt(matchAgo[1], 10);
    }
    if (c.lastWorkingDay) {
      const parsed = new Date(c.lastWorkingDay);
      if (!isNaN(parsed.getTime())) {
        const refDate = new Date('2026-09-15');
        return Math.round((parsed.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
      }
    }
    return 999;
  };

  // Map numeric stage to stage key
  const getStageKey = (stage: number): string => {
    switch (stage) {
      case 0:
        return 'notice_initiated';
      case 1:
        return 'serving_notice';
      case 2:
        return 'clearing';
      case 3:
        return 'closed';
      default:
        return 'notice_initiated';
    }
  };

  // Filtered and sorted cases
  const filteredCases = useMemo(() => {
    const list = cases.filter((c) => {
      // Status multi-select
      if (selectedStatuses.length > 0) {
        const stageKey = getStageKey(c.stage);
        if (!selectedStatuses.includes(stageKey)) return false;
      }

      // Department multi-select
      if (selectedDepts.length > 0) {
        if (!selectedDepts.includes(c.department)) return false;
      }

      // Exit Reason multi-select
      if (selectedReasons.length > 0) {
        if (!selectedReasons.includes(c.reason)) return false;
      }

      // Employee filter
      if (selectedEmployee !== 'all' && c.name !== selectedEmployee) {
        return false;
      }

      // Successor coverage filter
      if (selectedSuccessor === 'assigned' && !c.successor) return false;
      if (selectedSuccessor === 'none' && c.successor) return false;

      // Date range window filter
      if (selectedDateRange !== 'all') {
        const days = getDaysRemaining(c);
        if (selectedDateRange === '7_days' && (days < 0 || days > 7)) return false;
        if (selectedDateRange === '30_days' && (days < 0 || days > 30)) return false;
        if (selectedDateRange === '60_days' && (days < 0 || days > 60)) return false;
      }

      // Global Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.seat.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q)
        );
      }

      return true;
    });

    // Apply sorting
    return list.sort((a, b) => {
      if (sortBy === 'name') {
        const comp = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? comp : -comp;
      }
      if (sortBy === 'stage') {
        const comp = a.stage - b.stage;
        return sortOrder === 'asc' ? comp : -comp;
      }
      // Default: Last working day
      const daysA = getDaysRemaining(a);
      const daysB = getDaysRemaining(b);
      return sortOrder === 'asc' ? daysA - daysB : daysB - daysA;
    });
  }, [
    cases,
    scope,
    selectedStatuses,
    selectedDepts,
    selectedReasons,
    selectedEmployee,
    selectedSuccessor,
    selectedDateRange,
    searchQuery,
    sortBy,
    sortOrder,
  ]);

  // Auto-clamp page if it exceeds totalPages
  const totalPages = Math.max(1, Math.ceil(filteredCases.length / rowsPerPage));
  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [totalPages, page]);

  // Action handlers
  const handleOpenCase = (caseId: number) => {
    setSelectedCaseId(caseId);
    setCurrentView('case');
    const target = cases.find((c) => c.id === caseId);
    if (target) {
      setSelectedCaseForDrawer(target);
    }
    if (onOpenCase) {
      onOpenCase(caseId);
    }
  };

  const handleSendExitInterview = (caseId: number) => {
    const target = cases.find((c) => c.id === caseId);
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId ? { ...c, exitInterviewStatus: 'sent' } : c
      )
    );
    setToastMessage(`Exit interview feedback survey sent to ${target?.name}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleViewVacancies = (caseId: number) => {
    const target = cases.find((c) => c.id === caseId);
    setToastMessage(
      `Cross-linking to seat ${target?.seat} in Vacancies › Leaving soon.`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleWithdrawOffboarding = (caseId: number) => {
    const target = cases.find((c) => c.id === caseId);
    if (target) {
      setWithdrawModalCase(target);
      setWithdrawReason('');
    }
  };

  const handleConfirmWithdraw = () => {
    if (!withdrawModalCase) return;
    const targetId = withdrawModalCase.id;
    const targetName = withdrawModalCase.name;
    const reasonText = withdrawReason.trim() || 'Resignation retracted';
    setCases((prev) => prev.filter((c) => c.id !== targetId));
    setWithdrawModalCase(null);
    setToastMessage(`✓ Offboarding withdrawn for ${targetName} (${reasonText}). Active employment reinstated.`);
    setTimeout(() => setToastMessage(null), 3500);
  };


  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage('Offboarding cases synchronized with live departures.');
      setTimeout(() => setToastMessage(null), 3000);
    }, 600);
  };

  const handleOpenDrawer = (caseId: number) => {
    const target = cases.find((c) => c.id === caseId);
    if (target) {
      setSelectedCaseForDrawer(target);
    }
  };

  const handleCreateOffboarding = () => {
    const newId = Math.max(...cases.map((c) => c.id), 0) + 1;
    const isImmediate = startForm.reason === 'termination' || startForm.reason === 'death_in_service';
    const newCase: OffboardingCase = {
      id: newId,
      name: startForm.employeeName,
      initials: startForm.employeeName.split(' ').map((n) => n[0]).join(''),
      title: startForm.title,
      seat: startForm.seat,
      department: startForm.department,
      reason: startForm.reason as any,
      noticeGivenDate: startForm.noticeGivenDate,
      lastWorkingDay: startForm.lastWorkingDay,
      dueText: isImmediate ? 'Left today' : 'In 30 days',
      dueTone: isImmediate ? 'bad' : 'neu',
      stage: isImmediate ? 2 : 0, // 0 = notice initiated, 2 = clearing if immediate
      successor: startForm.successor === 'none' ? null : startForm.successor,
      manager: 'James Cole · Hotel Manager',
      joinDate: '15 Sep 2024',
      serviceLength: '2 yrs 0 mos',
      leaveBalance: 10.0,
      currency: 'AED',
      handover: [
        {
          key: 'Handover SOPs',
          title: 'Department operational briefing',
          subtitle: 'Handoff critical files and responsibilities',
          done: false,
          tag: 'Operations',
        },
      ],
      clearance: [
        {
          dept: 'IT',
          title: 'Accounts & access deactivation',
          source: 'Clearance checklist',
          mandatory: true,
          approver: 'Zaid Al-Harbi',
          notes: 'Scheduled for LWD.',
          done: false,
          status: 'pending',
        },
        {
          dept: 'Finance',
          title: 'Salary advance & dues audit',
          source: 'Clearance checklist',
          mandatory: true,
          approver: 'Amina El-Sayed',
          notes: 'Pending check.',
          done: false,
          status: 'pending',
        },
        {
          dept: 'Admin',
          title: 'ID card and locker return',
          source: 'Assets & Equipment',
          mandatory: true,
          approver: 'Tariq Mansoor',
          notes: 'Locker return pending.',
          done: false,
          status: 'pending',
        },
        {
          dept: 'Line manager',
          title: 'Operational sign-off',
          source: 'Clearance checklist',
          mandatory: false,
          approver: 'James Cole',
          notes: 'Sign-off pending.',
          done: false,
          status: 'pending',
        },
      ],
      exitInterviewStatus: 'not_sent',
      settlement: {
        status: 'pending',
        leaveDays: 10.0,
        encashmentAmount: '3,500',
        recoveriesAmount: '0',
        netPayable: '3,500',
        currency: 'AED',
        lettersGenerated: false,
      },
    };

    setCases((prev) => [newCase, ...prev]);
    setIsStartModalOpen(false);
    setToastMessage(`Offboarding initiated for ${newCase.name} (${newCase.seat}).`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const renderScreenSwitcherBar = () => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        pb: 1.5,
        borderBottom: '1px solid #E5E7EF',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          size="sm"
          variant={currentView === 'list' ? 'solid' : 'plain'}
          onClick={() => setCurrentView('list')}
          sx={{
            fontFamily: 'Inter, system-ui, sans-serif',
            bgcolor: currentView === 'list' ? '#7C3AED' : 'transparent',
            color: currentView === 'list' ? '#FFFFFF' : '#5B6173',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '12.5px',
            '&:hover': {
              bgcolor: currentView === 'list' ? '#6D28D9' : '#EDE9FE',
              color: currentView === 'list' ? '#FFFFFF' : '#7C3AED',
            },
          }}
        >
          Screen 1: Offboarding List
        </Button>
        <Button
          size="sm"
          variant={currentView === 'case' ? 'solid' : 'plain'}
          onClick={() => {
            setSelectedCaseId(1);
            setCurrentView('case');
          }}
          sx={{
            fontFamily: 'Inter, system-ui, sans-serif',
            bgcolor: currentView === 'case' ? '#7C3AED' : 'transparent',
            color: currentView === 'case' ? '#FFFFFF' : '#5B6173',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '12.5px',
            '&:hover': {
              bgcolor: currentView === 'case' ? '#6D28D9' : '#EDE9FE',
              color: currentView === 'case' ? '#FFFFFF' : '#7C3AED',
            },
          }}
        >
          Screen 2: Leaver Case Workspace (Sara Khan)
        </Button>
        <Button
          size="sm"
          variant={currentView === 'user' ? 'solid' : 'plain'}
          onClick={() => setCurrentView('user')}
          sx={{
            fontFamily: 'Inter, system-ui, sans-serif',
            bgcolor: currentView === 'user' ? '#7C3AED' : 'transparent',
            color: currentView === 'user' ? '#FFFFFF' : '#5B6173',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '12.5px',
            '&:hover': {
              bgcolor: currentView === 'user' ? '#6D28D9' : '#EDE9FE',
              color: currentView === 'user' ? '#FFFFFF' : '#7C3AED',
            },
          }}
        >
          Screen 4: User's View
        </Button>
      </Box>
    </Box>
  );

  const caseContent = (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        bgcolor: '#F8FAFC',
        borderRadius: '16px',
        p: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {renderScreenSwitcherBar()}
      <OffboardingCaseDetail
        caseData={activeCase}
        onBack={() => setCurrentView('list')}
        onUpdateCase={(updated) => {
          setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        }}
      />
    </Box>
  );

  const listContent = (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        bgcolor: '#F8FAFC',
        borderRadius: '16px',
        p: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Screen Switcher Bar */}
      {renderScreenSwitcherBar()}
      {/* 1. Header, KPIs & Operational Toolbar */}
      <OffboardingListToolbar
        cases={cases}
        totalCount={filteredCases.length}
        scope={scope}
        onScopeChange={(newScope) => {
          setScope(newScope);
          setPage(1);
        }}
        selectedStatuses={selectedStatuses}
        onStatusesChange={(statuses) => {
          setSelectedStatuses(statuses);
          setPage(1);
        }}
        selectedDepartments={selectedDepts}
        onDepartmentsChange={(depts) => {
          setSelectedDepts(depts);
          setPage(1);
        }}
        availableDepartments={departments}
        selectedReasons={selectedReasons}
        onReasonsChange={(reasons) => {
          setSelectedReasons(reasons);
          setPage(1);
        }}
        selectedEmployee={selectedEmployee}
        onEmployeeChange={(emp) => {
          setSelectedEmployee(emp);
          setPage(1);
        }}
        availableEmployees={availableEmployees}
        selectedSuccessor={selectedSuccessor}
        onSuccessorChange={(succ) => {
          setSelectedSuccessor(succ);
          setPage(1);
        }}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={(range) => {
          setSelectedDateRange(range);
          setPage(1);
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
        searchQuery={searchQuery}
        onClearSearch={() => {
          setSearchQuery('');
          setPage(1);
        }}
        onClearFilters={handleClearFilters}
        onRemoveFilter={handleRemoveFilter}
        onStartOffboarding={() => setIsStartModalOpen(true)}
        onExport={() => {
          setToastMessage(`Exporting ${filteredCases.length} offboarding records to CSV...`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. Main Data Table */}
      <OffboardingTable
        cases={filteredCases}
        onOpenCase={handleOpenCase}
        onQuickView={handleOpenDrawer}
        onSendExitInterview={handleSendExitInterview}
        onViewVacancies={handleViewVacancies}
        onWithdrawOffboarding={handleWithdrawOffboarding}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      {/* 3. Toast Notification Alert */}
      {toastMessage && (
        <Alert
          variant="soft"
          color="success"
          startDecorator={<FiCheckCircle size={16} />}
          sx={{
            fontFamily: 'Inter, system-ui, sans-serif',
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            borderRadius: '10px',
            fontSize: '13px',
            bgcolor: '#E3FBE3',
            color: '#1F7A1F',
            border: '1px solid #C4F3C4',
            boxShadow: '0 8px 24px rgba(0,23,65,0.12)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {toastMessage}
        </Alert>
      )}

      {/* 4. Start Offboarding Modal Dialog (Joy UI) */}
      <Modal
        open={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(3px)',
          p: { xs: 2, sm: 3, md: 4 },
          overflowY: 'auto',
        }}
      >
        <ModalDialog
          variant="outlined"
          sx={{
            width: '100%',
            maxWidth: 600,
            maxHeight: 'calc(100vh - 64px)',
            overflowY: 'auto',
            borderRadius: '16px',
            p: { xs: 2.5, sm: 3 },
            borderColor: 'neutral.outlinedBorder',
            boxShadow: '0 24px 48px -12px rgba(0, 23, 65, 0.25)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <ModalClose sx={{ borderRadius: '8px' }} />
          <Typography
            level="h3"
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              color: '#111827',
              mb: 0.5,
            }}
          >
            Start Offboarding
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              color: 'text.secondary',
              fontSize: '13px',
              mb: 2.5,
            }}
          >
            Initiate employee exit flow, calculate notice periods, and assign vacancy handovers.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Employee Selector */}
            <FormControl required>
              <FormLabel sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600, fontSize: '12.5px' }}>
                Employee & Seat
              </FormLabel>
              <Select
                value={startForm.employeeName}
                onChange={(_, val) => {
                  if (!val) return;
                  const emp = AVAILABLE_START_EMPLOYEES.find((e) => e.name === val);
                  if (emp) {
                    setStartForm((prev) => ({
                      ...prev,
                      employeeName: emp.name,
                      title: emp.title,
                      seat: emp.seat,
                      department: emp.department,
                    }));
                  }
                }}
                sx={{ fontFamily: 'Inter, system-ui, sans-serif', height: 38, borderRadius: '8px', fontSize: '13px' }}
              >
                <Option value="Sara Khan">Sara Khan · Front Desk Manager (FDM-01)</Option>
                <Option value="Rahul Mehta">Rahul Mehta · Sous Chef (SC-02)</Option>
                <Option value="Leena Joseph">Leena Joseph · Housekeeping Supervisor (HKS-03)</Option>
                <Option value="Carlos Gomez">Carlos Gomez · Senior Bartender (BAR-02)</Option>
              </Select>
            </FormControl>

            {/* Departure Reason Radio Group */}
            <FormControl required>
              <FormLabel sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600, fontSize: '12.5px', mb: 0.5 }}>
                Reason for Departure
              </FormLabel>
              <RadioGroup
                value={startForm.reason}
                onChange={(e) => {
                  const val = e.target.value;
                  const isImm = val === 'termination' || val === 'death_in_service';
                  setStartForm((prev) => ({
                    ...prev,
                    reason: val,
                    lastWorkingDay: isImm ? '2026-09-15' : '2026-10-15',
                  }));
                }}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.25,
                }}
              >
                {REASONS_LIST.map((r) => {
                  const isSelected = startForm.reason === r.value;
                  return (
                    <Box
                      key={r.value}
                      component="label"
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        p: 1.25,
                        borderRadius: '10px',
                        border: '1.5px solid',
                        borderColor: isSelected ? '#7C3AED' : '#E5E7EF',
                        bgcolor: isSelected ? '#F5F3FF' : 'background.surface',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Radio
                        value={r.value}
                        sx={{ mt: 0.25, '& .MuiRadio-radio': { bgcolor: isSelected ? '#7C3AED' : 'inherit' } }}
                      />
                      <Box>
                        <Typography
                          level="title-sm"
                          sx={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontWeight: 600,
                            fontSize: '13px',
                            color: isSelected ? '#5B21B6' : '#111827',
                          }}
                        >
                          {r.label}
                        </Typography>
                        <Typography
                          level="body-xs"
                          sx={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            color: 'text.secondary',
                            fontSize: '12px',
                          }}
                        >
                          {r.help}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </RadioGroup>
            </FormControl>

            {/* Date Inputs Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <FormControl required>
                <FormLabel sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600, fontSize: '12px' }}>
                  Notice Given On
                </FormLabel>
                <Input
                  type="date"
                  value={startForm.noticeGivenDate}
                  onChange={(e) => setStartForm((prev) => ({ ...prev, noticeGivenDate: e.target.value }))}
                  sx={{ fontFamily: 'Inter, system-ui, sans-serif', height: 38, borderRadius: '8px', fontSize: '13px' }}
                />
              </FormControl>

              <FormControl required>
                <FormLabel sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600, fontSize: '12px' }}>
                  Last Working Day
                </FormLabel>
                <Input
                  type="date"
                  value={startForm.lastWorkingDay}
                  disabled={startForm.reason === 'termination' || startForm.reason === 'death_in_service'}
                  onChange={(e) => setStartForm((prev) => ({ ...prev, lastWorkingDay: e.target.value }))}
                  sx={{ fontFamily: 'Inter, system-ui, sans-serif', height: 38, borderRadius: '8px', fontSize: '13px' }}
                />
              </FormControl>
            </Box>

            {/* Successor Selector */}
            <FormControl>
              <FormLabel sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600, fontSize: '12px' }}>
                Successor / Interim Cover
              </FormLabel>
              <Select
                value={startForm.successor}
                onChange={(_, val) => val && setStartForm((prev) => ({ ...prev, successor: val }))}
                sx={{ fontFamily: 'Inter, system-ui, sans-serif', height: 38, borderRadius: '8px', fontSize: '13px' }}
              >
                <Option value="Omar Haddad">Omar Haddad · Asst. Front Office Manager</Option>
                <Option value="Meera Das">Meera Das · Lead Floor Supervisor</Option>
                <Option value="none">Leave seat open (Requires Vacancy Posting)</Option>
              </Select>
            </FormControl>

            {/* Notice Routing Warning Alert */}
            <Alert
              variant="soft"
              color={startForm.reason === 'termination' || startForm.reason === 'death_in_service' ? 'danger' : 'primary'}
              startDecorator={<FiClock size={16} />}
              sx={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '12.5px',
                borderRadius: '8px',
                bgcolor: startForm.reason === 'termination' || startForm.reason === 'death_in_service' ? '#FEF2F2' : '#F5F3FF',
                color: startForm.reason === 'termination' || startForm.reason === 'death_in_service' ? '#991B1B' : '#5B21B6',
                border: '1px solid',
                borderColor: startForm.reason === 'termination' || startForm.reason === 'death_in_service' ? '#FCA5A5' : '#DDD6FE',
              }}
            >
              {startForm.reason === 'termination'
                ? 'Terminations take effect immediately. System access will be suspended today and position marked vacant.'
                : startForm.reason === 'death_in_service'
                ? 'Death in service takes effect immediately. System access is suspended, seat opened for succession, and statutory final settlement workflow initialized.'
                : 'Resignation notice received via email. HR initiation starts the notice period and handover tracking.'}
            </Alert>

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25, mt: 1 }}>
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setIsStartModalOpen(false)}
                sx={{ fontFamily: 'Inter, system-ui, sans-serif', borderRadius: '8px' }}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                onClick={handleCreateOffboarding}
                sx={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  bgcolor: '#7C3AED',
                  borderRadius: '8px',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#6D28D9' },
                }}
              >
                {startForm.reason === 'termination' || startForm.reason === 'death_in_service' ? 'Exit Immediately' : 'Submit & Start Notice'}
              </Button>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Withdraw Offboarding Modal Dialog (Joy UI) */}
      <Modal
        open={Boolean(withdrawModalCase)}
        onClose={() => setWithdrawModalCase(null)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
        }}
      >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="withdraw-dialog-title"
          aria-describedby="withdraw-dialog-description"
          sx={{
            maxWidth: 540,
            width: '100%',
            borderRadius: '16px',
            p: 3,
            boxShadow: '0 24px 56px -12px rgba(0, 23, 65, 0.28)',
            border: '1px solid #E5E7EF',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  bgcolor: '#FEE2E2',
                  color: '#DC2626',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <FiCornerUpLeft size={18} />
              </Box>
              <Box>
                <Typography id="withdraw-dialog-title" level="title-lg" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '18px' }}>
                  Withdraw Offboarding
                </Typography>
                <Typography id="withdraw-dialog-description" level="body-xs" sx={{ color: '#64748B', mt: 0.25 }}>
                  Cancel departure process for <strong>{withdrawModalCase?.name}</strong> and reinstate active employment.
                </Typography>
              </Box>
            </Box>
            <ModalClose sx={{ position: 'static' }} />
          </Box>

          {/* Employee Summary Card */}
          {withdrawModalCase && (
            <Box
              sx={{
                bgcolor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '10px',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#FEE2E2',
                  color: '#991B1B',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: '1px solid #FCA5A5',
                  width: 38,
                  height: 38,
                }}
              >
                {withdrawModalCase.avatarInitials}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography level="body-sm" sx={{ fontWeight: 700, color: '#7F1D1D' }}>
                  {withdrawModalCase.name} · {withdrawModalCase.role} ({withdrawModalCase.seatCode})
                </Typography>
                <Typography level="body-xs" sx={{ color: '#991B1B', mt: 0.25 }}>
                  Stage: <strong>{STAGE_CONFIGS[withdrawModalCase.stage]?.label}</strong> &bull; Last Working Day: <strong>{withdrawModalCase.lastWorkingDay}</strong>
                </Typography>
              </Box>
            </Box>
          )}

          {/* Reason for Withdrawing (Textbox) */}
          <FormControl sx={{ mb: 2.5 }}>
            <FormLabel sx={{ fontWeight: 600, fontSize: '13px', color: '#0F172A', mb: 0.75 }}>
              Reason for Withdrawing <Typography component="span" sx={{ color: '#DC2626' }}>*</Typography>
            </FormLabel>
            <Textarea
              minRows={4}
              placeholder="Document the rationale, manager discussion, or retraction agreement..."
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              sx={{
                borderRadius: '8px',
                fontSize: '13px',
                fontFamily: 'Inter, system-ui, sans-serif',
                lineHeight: 1.5,
              }}
            />
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25 }}>
            <Button variant="outlined" color="neutral" onClick={() => setWithdrawModalCase(null)} sx={{ borderRadius: '8px' }}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmWithdraw}
              sx={{
                bgcolor: '#DC2626',
                color: '#FFF',
                borderRadius: '8px',
                fontWeight: 600,
                '&:hover': { bgcolor: '#B91C1C' },
                display: 'flex',
                gap: 1,
              }}
            >
              <FiCornerUpLeft size={14} />
              Confirm Withdrawal
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* 5. Case Quick View Drawer (Joy UI) */}
      <Drawer
        open={Boolean(selectedCaseForDrawer)}
        anchor="right"
        onClose={() => setSelectedCaseForDrawer(null)}
        slotProps={{ content: { sx: { width: { xs: '100%', sm: 460 }, p: 3, fontFamily: 'Inter, system-ui, sans-serif' } } }}
      >
        {selectedCaseForDrawer && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography level="title-md" sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700, color: '#111827' }}>
                Departure Case Summary
              </Typography>
              <ModalClose sx={{ position: 'static' }} />
            </Box>

            <Divider />

            {/* Profile Overview */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  bgcolor: '#EDE9FE',
                  color: '#7C3AED',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                {selectedCaseForDrawer.initials}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography level="title-sm" sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                  {selectedCaseForDrawer.name}
                </Typography>
                <Typography level="body-xs" sx={{ fontFamily: 'Inter, system-ui, sans-serif', color: 'text.secondary' }}>
                  {selectedCaseForDrawer.title} · {selectedCaseForDrawer.department}
                </Typography>
                <Typography level="body-xs" sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#7C3AED', fontWeight: 600 }}>
                  {selectedCaseForDrawer.seat}
                </Typography>
              </Box>
              <Chip size="sm" sx={{ fontFamily: 'Inter, system-ui, sans-serif', bgcolor: '#EDE9FE', color: '#7C3AED', fontWeight: 600 }}>
                Stage {selectedCaseForDrawer.stage + 1}
              </Chip>
            </Box>

            {/* Key Departure Parameters */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, py: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <Typography level="body-sm" sx={{ color: 'text.secondary', fontFamily: 'Inter, system-ui, sans-serif' }}>Last Working Day:</Typography>
                <Typography level="body-sm" sx={{ fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif' }}>{selectedCaseForDrawer.lastWorkingDay}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <Typography level="body-sm" sx={{ color: 'text.secondary', fontFamily: 'Inter, system-ui, sans-serif' }}>Countdown Status:</Typography>
                <Chip size="sm" sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600 }}>{selectedCaseForDrawer.dueText}</Chip>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <Typography level="body-sm" sx={{ color: 'text.secondary', fontFamily: 'Inter, system-ui, sans-serif' }}>Successor Assigned:</Typography>
                <Typography level="body-sm" sx={{ fontWeight: 600, color: selectedCaseForDrawer.successor ? '#16A34A' : '#DC2626', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {selectedCaseForDrawer.successor || 'No Successor (Coverage Needed)'}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Handover & Clearance Progress */}
            <Typography level="title-sm" sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700, fontSize: '13.5px' }}>
              Clearance & Task Checklist
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {(selectedCaseForDrawer.clearance || [
                { dept: 'IT', title: 'Company laptop and email credentials handover', done: false },
                { dept: 'Admin', title: 'Access card, locker key and parking pass returned', done: false },
                { dept: 'Finance', title: 'Salary advances and company expense settlement', done: true },
              ]).map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 1.25,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: item.done ? '#BBF7D0' : '#E2E8F0',
                    bgcolor: item.done ? '#F0FDF4' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Box>
                    <Typography level="body-xs" sx={{ fontWeight: 600, color: 'text.tertiary', fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {item.dept}
                    </Typography>
                    <Typography level="body-sm" sx={{ fontSize: '12.5px', color: 'text.primary', fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={item.done ? 'success' : 'neutral'}
                    sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', fontWeight: 600 }}
                  >
                    {item.done ? 'Signed' : 'Pending'}
                  </Chip>
                </Box>
              ))}
            </Box>

            {/* Footer Buttons */}
            <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="neutral"
                fullWidth
                onClick={() => setSelectedCaseForDrawer(null)}
                sx={{ fontFamily: 'Inter, system-ui, sans-serif', borderRadius: '8px' }}
              >
                Close Drawer
              </Button>
              <Button
                variant="solid"
                fullWidth
                endDecorator={<FiArrowRight size={15} />}
                onClick={() => {
                  const targetId = selectedCaseForDrawer.id;
                  setSelectedCaseForDrawer(null);
                  handleOpenCase(targetId);
                }}
                sx={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  bgcolor: '#7C3AED',
                  borderRadius: '8px',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#6D28D9' },
                }}
              >
                Full Case View
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );

  const userContent = (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        bgcolor: '#F8FAFC',
        borderRadius: '16px',
        p: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {renderScreenSwitcherBar()}
      <OffboardingUserView
        caseData={cases.find((c) => c.name === 'Sara Khan') || cases[0]}
        onBackToAdmin={() => setCurrentView('list')}
      />
    </Box>
  );

  const currentContent =
    currentView === 'case' ? caseContent : currentView === 'user' ? userContent : listContent;

  if (withDashboardShell) {
    return (
      <HirerkeyDashboardShell
        activeMenuKey="offboarding"
        caseName={
          currentView === 'case'
            ? `${activeCase.name} (${activeCase.seat})`
            : currentView === 'user'
            ? 'My Offboarding (Sara Khan)'
            : null
        }
        onBackToDepartures={() => setCurrentView('list')}
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
      >
        {currentContent}
      </HirerkeyDashboardShell>
    );
  }

  return currentContent;
};
