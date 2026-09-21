import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Table,
  Checkbox,
  Select,
  Option,
  Switch,
  Alert,
} from '@mui/joy';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiFileText,
  FiSend,
  FiUserCheck,
  FiShield,
  FiDollarSign,
  FiExternalLink,
  FiEdit3,
  FiLayers,
  FiCheck,
} from 'react-icons/fi';
import { OffboardingCase, CaseTabKey, ClearanceItem, HandoverItem } from './types';

export interface OffboardingCaseDetailProps {
  caseData: OffboardingCase;
  onBack: () => void;
  onUpdateCase?: (updatedCase: OffboardingCase) => void;
}

export const OffboardingCaseDetail: React.FC<OffboardingCaseDetailProps> = ({
  caseData: initialCase,
  onBack,
  onUpdateCase,
}) => {
  const [activeTab, setActiveTab] = useState<CaseTabKey>('overview');
  const [caseItem, setCaseItem] = useState<OffboardingCase>(initialCase);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setCaseItem(initialCase);
  }, [initialCase]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Handover Toggle
  const handleToggleHandover = (index: number) => {
    const updatedHandover = [...(caseItem.handover || [])];
    if (updatedHandover[index]) {
      updatedHandover[index] = {
        ...updatedHandover[index],
        done: !updatedHandover[index].done,
      };
      const updated = { ...caseItem, handover: updatedHandover };
      setCaseItem(updated);
      onUpdateCase?.(updated);
      showToast('Handover item updated.');
    }
  };

  // Clearance Toggle
  const handleToggleClearance = (index: number) => {
    const updatedClearance = [...(caseItem.clearance || [])];
    if (updatedClearance[index]) {
      const isDone = !updatedClearance[index].done;
      updatedClearance[index] = {
        ...updatedClearance[index],
        done: isDone,
        status: isDone ? 'approved' : 'pending',
      };
      const updated = { ...caseItem, clearance: updatedClearance };
      setCaseItem(updated);
      onUpdateCase?.(updated);
      showToast(
        updatedClearance[index].dept + ' clearance sign-off ' + (isDone ? 'recorded.' : 'revoked.')
      );
    }
  };

  // Notice Confirmation Action (HR acknowledges notice period and begins operational handover)
  const handleAcknowledgeNotice = () => {
    const updated: OffboardingCase = {
      ...caseItem,
      stage: 1,
      dueText: caseItem.dueText || 'In 29 days',
    };
    setCaseItem(updated);
    onUpdateCase?.(updated);
    showToast('Notice period acknowledged for ' + caseItem.name + '. Serving notice countdown is active.');
  };

  // Simulate Last Day Action
  const handleSimulateLastDay = () => {
    showToast(
      'Simulation active for ' + caseItem.name + ': System access will terminate and final settlement route to payroll.'
    );
  };

  // Close Case Action
  const handleCloseCase = () => {
    const updated: OffboardingCase = {
      ...caseItem,
      stage: 3,
      dueText: 'Closed & Archived',
      dueTone: 'ok',
    };
    setCaseItem(updated);
    onUpdateCase?.(updated);
    showToast('Case closed for ' + caseItem.name + '. Profile moved to Employees › Exit.');
  };

  // Exit Interview Actions
  const handleSendExitSurvey = () => {
    const updated: OffboardingCase = {
      ...caseItem,
      exitInterviewStatus: 'sent',
    };
    setCaseItem(updated);
    onUpdateCase?.(updated);
    showToast('Exit interview survey dispatched to ' + caseItem.name + ' personal inbox.');
  };

  const handleMarkSurveySubmitted = () => {
    const updated: OffboardingCase = {
      ...caseItem,
      exitInterviewStatus: 'completed',
    };
    setCaseItem(updated);
    onUpdateCase?.(updated);
    showToast('Exit interview responses recorded for ' + caseItem.name + '.');
  };

  const handleSkipSurvey = () => {
    const updated: OffboardingCase = {
      ...caseItem,
      exitInterviewStatus: 'skipped',
    };
    setCaseItem(updated);
    onUpdateCase?.(updated);
    showToast('Exit interview skipped (waived) for ' + caseItem.name + '.');
  };

  // Settlement Status Change
  const handleSettlementStatusChange = (newStatus: 'pending' | 'in_progress' | 'paid' | 'waived') => {
    const defaultSettlement = {
      status: 'pending' as const,
      leaveDays: 10,
      encashmentAmount: '3,500',
      recoveriesAmount: '0',
      netPayable: '3,500',
      currency: 'AED',
      lettersGenerated: false,
    };
    const currentSettlement = caseItem.settlement || defaultSettlement;
    const updated: OffboardingCase = {
      ...caseItem,
      settlement: {
        ...currentSettlement,
        status: newStatus,
      },
    };
    setCaseItem(updated);
    onUpdateCase?.(updated);
    showToast('Final settlement status updated to ' + newStatus.replace('_', ' ') + '.');
  };

  // Letters Toggle
  const handleToggleLetters = (checked: boolean) => {
    const defaultSettlement = {
      status: 'pending' as const,
      leaveDays: 10,
      encashmentAmount: '3,500',
      recoveriesAmount: '0',
      netPayable: '3,500',
      currency: 'AED',
      lettersGenerated: false,
    };
    const currentSettlement = caseItem.settlement || defaultSettlement;
    const updated: OffboardingCase = {
      ...caseItem,
      settlement: {
        ...currentSettlement,
        lettersGenerated: checked,
      },
    };
    setCaseItem(updated);
    onUpdateCase?.(updated);
    showToast(
      'Relieving & Experience certificates marked ' + (checked ? 'issued.' : 'pending.')
    );
  };

  // Calculations
  const handoverItems = caseItem.handover || [];
  const pendingHandoverCount = handoverItems.filter((i) => !i.done).length;

  const clearanceItems = caseItem.clearance || [];
  const approvedClearanceCount = clearanceItems.filter((i) => i.done).length;
  const totalClearanceCount = clearanceItems.length;
  const clearancePct =
    totalClearanceCount > 0
      ? Math.round((approvedClearanceCount / totalClearanceCount) * 100)
      : 0;

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        bgcolor: '#F8FAFC',
        borderRadius: '16px',
        p: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 3.5,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif !important',
      }}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <Alert
          color="primary"
          variant="solid"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)',
            fontFamily: 'Inter, system-ui, sans-serif',
            bgcolor: '#7C3AED',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '13.5px',
          }}
        >
          {toastMsg}
        </Alert>
      )}

      {/* Top Header & Breadcrumb Bar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="plain"
            size="sm"
            onClick={onBack}
            startDecorator={<FiArrowLeft />}
            sx={{
              color: '#5B6173',
              fontWeight: 600,
              fontSize: '13px',
              px: 1.2,
              borderRadius: '8px',
              '&:hover': { bgcolor: '#EDE9FE', color: '#7C3AED' },
            }}
          >
            Back to departures
          </Button>
          <Divider orientation="vertical" sx={{ height: 20 }} />
          <Typography level="body-xs" sx={{ color: '#8A90A2', fontWeight: 500 }}>
            Employees &rsaquo; Offboarding &rsaquo;{' '}
            <strong style={{ color: '#111827' }}>
              {caseItem.name} ({caseItem.seat})
            </strong>
          </Typography>
        </Box>

        {/* Quick Lifecycle Action Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {caseItem.stage === 0 && (
            <Button
              size="sm"
              variant="solid"
              onClick={handleAcknowledgeNotice}
              startDecorator={<FiCheckCircle />}
              sx={{
                bgcolor: '#7C3AED',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
                '&:hover': { bgcolor: '#6D28D9' },
              }}
            >
              Acknowledge notice period
            </Button>
          )}

          {caseItem.stage < 3 && (
            <>
              <Button
                size="sm"
                variant="outlined"
                onClick={handleSimulateLastDay}
                startDecorator={<FiClock />}
                sx={{
                  borderColor: '#DDD6FE',
                  color: '#7C3AED',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '13px',
                  '&:hover': { bgcolor: '#F5F3FF', borderColor: '#C4B5FD' },
                }}
              >
                Simulate last day
              </Button>
              <Button
                size="sm"
                variant="outlined"
                color="danger"
                onClick={handleCloseCase}
                sx={{
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Close case
              </Button>
            </>
          )}

          {caseItem.stage === 3 && (
            <Chip
              size="md"
              variant="soft"
              color="success"
              startDecorator={<FiCheck />}
              sx={{ fontWeight: 600, fontSize: '12.5px' }}
            >
              Case Closed & Archived
            </Chip>
          )}
        </Box>
      </Box>

      {/* Leaver Profile Header Card */}
      <Card
        variant="outlined"
        sx={{
          bgcolor: '#FFFFFF',
          borderColor: '#E5E7EF',
          borderRadius: '16px',
          p: { xs: 2.5, md: '24px 28px 22px' },
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 20px -4px rgba(124, 58, 237, 0.06)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* Top Accent Gradient Line */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #7C3AED 0%, #8B5CF6 35%, #A78BFA 70%, #DDD6FE 100%)',
          }}
        />

        {/* Top Tier: Leaver Identity */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)',
              color: '#6D28D9',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '19px',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '2px solid #FFFFFF',
              boxShadow: '0 0 0 2px #DDD6FE, 0 4px 12px rgba(124, 58, 237, 0.12)',
            }}
          >
            {caseItem.initials}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                {caseItem.name}
              </Typography>
              <Chip
                size="sm"
                variant="outlined"
                sx={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600,
                  fontSize: '11.5px',
                  bgcolor: '#F8FAFC',
                  borderColor: '#E2E8F0',
                  color: '#475569',
                  borderRadius: '6px',
                  px: 1,
                  lineHeight: 1.4,
                }}
              >
                {caseItem.seat}
              </Chip>
              <Chip
                size="sm"
                variant="soft"
                color={
                  caseItem.stage === 1
                    ? 'primary'
                    : caseItem.stage === 0
                    ? 'warning'
                    : caseItem.stage === 2
                    ? 'danger'
                    : 'success'
                }
                startDecorator={
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'currentColor',
                    }}
                  />
                }
                sx={{
                  fontWeight: 600,
                  fontSize: '12px',
                  px: 1.4,
                  py: 0.4,
                  borderRadius: '999px',
                }}
              >
                {caseItem.stage === 1
                  ? 'Serving notice'
                  : caseItem.stage === 0
                  ? 'Notice initiated'
                  : caseItem.stage === 2
                  ? 'Exited · clearing'
                  : 'Closed'}
              </Chip>
            </Box>
            <Typography
              level="body-sm"
              sx={{
                color: '#64748B',
                mt: 0.6,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
                fontSize: '13px',
              }}
            >
              <span>{caseItem.title}</span>
              <span style={{ color: '#CBD5E1' }}>&bull;</span>
              <span>{caseItem.department}</span>
              <span style={{ color: '#CBD5E1' }}>&bull;</span>
              <Box
                component="span"
                sx={{
                  bgcolor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#0F172A',
                  fontWeight: 600,
                  fontSize: '12px',
                  px: 0.9,
                  py: 0.15,
                  borderRadius: '5px',
                }}
              >
                {caseItem.reason === 'resignation'
                  ? 'Resigned (voluntary)'
                  : caseItem.reason === 'retirement'
                  ? 'Retirement'
                  : caseItem.reason === 'termination'
                  ? 'Terminated'
                  : 'Death in service'}
              </Box>
              <span style={{ color: '#CBD5E1' }}>&bull;</span>
              <span>
                Last working day: <strong style={{ color: '#0F172A' }}>{caseItem.lastWorkingDay}</strong>
              </span>
            </Typography>
          </Box>
        </Box>

        {/* Bottom Tier: 4 Modern Mini-Metric Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 1.75,
            pt: 2.25,
            borderTop: '1px solid #F1F5F9',
          }}
        >
          {/* Card 1: Line Manager */}
          <Box
            sx={{
              bgcolor: '#FAF8FF',
              border: '1px solid #EDE9FE',
              borderRadius: '12px',
              p: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 1,
              minWidth: 0,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#F5F3FF',
                borderColor: '#DDD6FE',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.08)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Line Manager
              </Typography>
              <FiUserCheck size={13} color="#8B5CF6" />
            </Box>
            <Box sx={{ minHeight: 28, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {caseItem.manager || 'James Cole · Hotel Manager'}
              </Typography>
            </Box>
          </Box>

          {/* Card 2: Service Length */}
          <Box
            sx={{
              bgcolor: '#FAF8FF',
              border: '1px solid #EDE9FE',
              borderRadius: '12px',
              p: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 1,
              minWidth: 0,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#F5F3FF',
                borderColor: '#DDD6FE',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.08)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Service Length
              </Typography>
              <FiClock size={13} color="#8B5CF6" />
            </Box>
            <Box sx={{ minHeight: 28, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                {caseItem.serviceLength || '5 yrs 6 mos'}
              </Typography>
            </Box>
          </Box>

          {/* Card 3: Successor Cover */}
          <Box
            sx={{
              bgcolor: '#FAF8FF',
              border: '1px solid #EDE9FE',
              borderRadius: '12px',
              p: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 1,
              minWidth: 0,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#F5F3FF',
                borderColor: '#DDD6FE',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.08)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Successor Cover
              </Typography>
              <FiShield size={13} color={caseItem.successor ? '#16A34A' : '#DC2626'} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, minWidth: 0, minHeight: 28 }}>
              <Typography
                sx={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: caseItem.successor ? '#15803D' : '#DC2626',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {caseItem.successor || 'No successor'}
              </Typography>
              <Chip
                size="sm"
                variant="soft"
                color={caseItem.successor ? 'success' : 'danger'}
                startDecorator={caseItem.successor ? <FiCheck size={11} /> : <FiAlertTriangle size={11} />}
                sx={{
                  fontWeight: 600,
                  fontSize: '11px',
                  px: 0.9,
                  py: 0.2,
                  borderRadius: '999px',
                  flexShrink: 0,
                }}
              >
                {caseItem.successor ? 'Assigned' : 'Vacant'}
              </Chip>
            </Box>
          </Box>

          {/* Card 4: Notice Countdown */}
          <Box
            sx={{
              bgcolor: '#FAF8FF',
              border: '1px solid #EDE9FE',
              borderRadius: '12px',
              p: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 1,
              minWidth: 0,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#F5F3FF',
                borderColor: '#DDD6FE',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.08)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Notice Countdown
              </Typography>
              <FiClock size={13} color="#8B5CF6" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 28 }}>
              <Chip
                size="sm"
                variant="soft"
                color={
                  caseItem.dueTone === 'bad'
                    ? 'danger'
                    : caseItem.dueTone === 'warn'
                    ? 'warning'
                    : 'neutral'
                }
                startDecorator={
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'currentColor',
                    }}
                  />
                }
                sx={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 700,
                  fontSize: '12px',
                  px: 1.25,
                  py: 0.4,
                  borderRadius: '8px',
                  letterSpacing: '-0.01em',
                }}
              >
                {caseItem.dueText}
              </Chip>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Signature Operational Tab Bar */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          border: '1px solid #E5E7EF',
          borderRadius: '14px',
          p: '6px 10px',
          mb: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px -2px rgba(124, 58, 237, 0.04)',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            overflowX: 'auto',
            flexWrap: 'nowrap',
            minWidth: 0,
            flex: 1,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
          }}
        >
          {/* Tab 1: Overview */}
          <Button
            size="sm"
            variant="plain"
            onClick={() => setActiveTab('overview')}
            startDecorator={<FiLayers />}
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              background:
                activeTab === 'overview'
                  ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                  : 'transparent',
              color: activeTab === 'overview' ? '#FFFFFF' : '#4B5563',
              borderRadius: '10px',
              fontWeight: activeTab === 'overview' ? 600 : 500,
              fontSize: '13px',
              px: 2.25,
              py: '9px',
              whiteSpace: 'nowrap',
              boxShadow:
                activeTab === 'overview'
                  ? '0 4px 12px rgba(124, 58, 237, 0.28), 0 1px 2px rgba(124, 58, 237, 0.18)'
                  : 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background:
                  activeTab === 'overview'
                    ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                    : '#FAF8FF',
                color: activeTab === 'overview' ? '#FFFFFF' : '#7C3AED',
                transform: 'translateY(-0.5px)',
              },
            }}
          >
            Overview & Timeline
          </Button>

          {/* Tab 2: Handover */}
          <Button
            size="sm"
            variant="plain"
            onClick={() => setActiveTab('handover')}
            startDecorator={<FiEdit3 />}
            endDecorator={
              <Chip
                size="sm"
                variant="soft"
                sx={{
                  fontFamily: 'JetBrains Mono, monospace',
                  bgcolor:
                    activeTab === 'handover'
                      ? 'rgba(255, 255, 255, 0.22)'
                      : '#EDE9FE',
                  color: activeTab === 'handover' ? '#FFFFFF' : '#6D28D9',
                  border:
                    activeTab === 'handover'
                      ? '1px solid rgba(255, 255, 255, 0.35)'
                      : '1px solid #DDD6FE',
                  fontWeight: 700,
                  fontSize: '11px',
                  minHeight: 18,
                  px: 0.9,
                  borderRadius: '999px',
                  transition: 'all 0.2s ease',
                }}
              >
                {pendingHandoverCount}
              </Chip>
            }
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              background:
                activeTab === 'handover'
                  ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                  : 'transparent',
              color: activeTab === 'handover' ? '#FFFFFF' : '#4B5563',
              borderRadius: '10px',
              fontWeight: activeTab === 'handover' ? 600 : 500,
              fontSize: '13px',
              px: 2.25,
              py: '9px',
              whiteSpace: 'nowrap',
              boxShadow:
                activeTab === 'handover'
                  ? '0 4px 12px rgba(124, 58, 237, 0.28), 0 1px 2px rgba(124, 58, 237, 0.18)'
                  : 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background:
                  activeTab === 'handover'
                    ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                    : '#FAF8FF',
                color: activeTab === 'handover' ? '#FFFFFF' : '#7C3AED',
                transform: 'translateY(-0.5px)',
              },
            }}
          >
            Handover & Succession
          </Button>

          {/* Tab 3: Clearance */}
          <Button
            size="sm"
            variant="plain"
            onClick={() => setActiveTab('clearance')}
            startDecorator={<FiShield />}
            endDecorator={
              <Chip
                size="sm"
                variant="soft"
                sx={{
                  fontFamily: 'JetBrains Mono, monospace',
                  bgcolor:
                    activeTab === 'clearance'
                      ? 'rgba(255, 255, 255, 0.22)'
                      : '#EDE9FE',
                  color: activeTab === 'clearance' ? '#FFFFFF' : '#6D28D9',
                  border:
                    activeTab === 'clearance'
                      ? '1px solid rgba(255, 255, 255, 0.35)'
                      : '1px solid #DDD6FE',
                  fontWeight: 700,
                  fontSize: '11px',
                  minHeight: 18,
                  px: 0.9,
                  borderRadius: '999px',
                  transition: 'all 0.2s ease',
                }}
              >
                {approvedClearanceCount}/{totalClearanceCount}
              </Chip>
            }
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              background:
                activeTab === 'clearance'
                  ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                  : 'transparent',
              color: activeTab === 'clearance' ? '#FFFFFF' : '#4B5563',
              borderRadius: '10px',
              fontWeight: activeTab === 'clearance' ? 600 : 500,
              fontSize: '13px',
              px: 2.25,
              py: '9px',
              whiteSpace: 'nowrap',
              boxShadow:
                activeTab === 'clearance'
                  ? '0 4px 12px rgba(124, 58, 237, 0.28), 0 1px 2px rgba(124, 58, 237, 0.18)'
                  : 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background:
                  activeTab === 'clearance'
                    ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                    : '#FAF8FF',
                color: activeTab === 'clearance' ? '#FFFFFF' : '#7C3AED',
                transform: 'translateY(-0.5px)',
              },
            }}
          >
            Clearance Checklist
          </Button>

          {/* Tab 4: Exit Interview */}
          <Button
            size="sm"
            variant="plain"
            onClick={() => setActiveTab('interview')}
            startDecorator={<FiSend />}
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              background:
                activeTab === 'interview'
                  ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                  : 'transparent',
              color: activeTab === 'interview' ? '#FFFFFF' : '#4B5563',
              borderRadius: '10px',
              fontWeight: activeTab === 'interview' ? 600 : 500,
              fontSize: '13px',
              px: 2.25,
              py: '9px',
              whiteSpace: 'nowrap',
              boxShadow:
                activeTab === 'interview'
                  ? '0 4px 12px rgba(124, 58, 237, 0.28), 0 1px 2px rgba(124, 58, 237, 0.18)'
                  : 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background:
                  activeTab === 'interview'
                    ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                    : '#FAF8FF',
                color: activeTab === 'interview' ? '#FFFFFF' : '#7C3AED',
                transform: 'translateY(-0.5px)',
              },
            }}
          >
            Exit Interview
          </Button>

          {/* Tab 5: Final Settlement */}
          <Button
            size="sm"
            variant="plain"
            onClick={() => setActiveTab('settlement')}
            startDecorator={<FiDollarSign />}
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              background:
                activeTab === 'settlement'
                  ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                  : 'transparent',
              color: activeTab === 'settlement' ? '#FFFFFF' : '#4B5563',
              borderRadius: '10px',
              fontWeight: activeTab === 'settlement' ? 600 : 500,
              fontSize: '13px',
              px: 2.25,
              py: '9px',
              whiteSpace: 'nowrap',
              boxShadow:
                activeTab === 'settlement'
                  ? '0 4px 12px rgba(124, 58, 237, 0.28), 0 1px 2px rgba(124, 58, 237, 0.18)'
                  : 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background:
                  activeTab === 'settlement'
                    ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                    : '#FAF8FF',
                color: activeTab === 'settlement' ? '#FFFFFF' : '#7C3AED',
                transform: 'translateY(-0.5px)',
              },
            }}
          >
            Final Settlement
          </Button>
        </Box>

        {/* Beautiful 5 Operational Lifecycles Badge */}
        <Box
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            alignItems: 'center',
            gap: 0.85,
            background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)',
            border: '1px solid #DDD6FE',
            color: '#6D28D9',
            fontSize: '11.5px',
            fontWeight: 600,
            px: 1.5,
            py: 0.6,
            borderRadius: '999px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: '0 1px 2px rgba(124, 58, 237, 0.05)',
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: '#7C3AED',
              boxShadow: '0 0 0 2.5px rgba(124, 58, 237, 0.2)',
              flexShrink: 0,
            }}
          />
          5 Operational Lifecycles
        </Box>
      </Box>

      {/* ======================================================================
          TAB PANEL 1: OVERVIEW & TIMELINE
          ====================================================================== */}
      {activeTab === 'overview' && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.25fr 1fr' },
            gap: 3.5,
          }}
        >
          {/* Left Column: Vertical Chronological Departure Tracker */}
          <Card
            variant="outlined"
            sx={{
              bgcolor: '#FFFFFF',
              borderColor: '#E5E7EF',
              borderRadius: '16px',
              overflow: 'hidden',
              p: 0,
            }}
          >
            <Box
              sx={{
                bgcolor: '#EEEBFF',
                px: 2.5,
                py: 1.5,
                borderBottom: '1px solid #DDD6FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography level="title-sm" sx={{ fontWeight: 700, color: '#7C3AED' }}>
                Departure & Clearance Timeline
              </Typography>
              <Chip size="sm" variant="solid" sx={{ bgcolor: '#7C3AED', color: '#FFFFFF' }}>
                Step 3 of 6 Active
              </Chip>
            </Box>

            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Step 1 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: '#DCFCE7',
                      color: '#16A34A',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: '13px',
                    }}
                  >
                    ✓
                  </Box>
                  <Box sx={{ width: 2, height: 40, bgcolor: '#DCFCE7', my: 0.5 }} />
                </Box>
                <Box>
                  <Typography level="title-sm" sx={{ fontWeight: 700, color: '#111827' }}>
                    1. Offboarding Initiated
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#5B6173' }}>
                    Recorded on {caseItem.noticeGivenDate || '14 Sep 2026'} &bull; Resignation received via email.
                  </Typography>
                </Box>
              </Box>

              {/* Step 2 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: caseItem.stage >= 1 ? '#DCFCE7' : '#FEF3C7',
                      color: caseItem.stage >= 1 ? '#16A34A' : '#92400E',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: '13px',
                    }}
                  >
                    {caseItem.stage >= 1 ? '✓' : '2'}
                  </Box>
                  <Box
                    sx={{
                      width: 2,
                      height: 40,
                      bgcolor: caseItem.stage >= 1 ? '#DCFCE7' : '#E5E7EF',
                      my: 0.5,
                    }}
                  />
                </Box>
                <Box>
                  <Typography level="title-sm" sx={{ fontWeight: 700, color: '#111827' }}>
                    2. Notice Period & Operational Handover
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#5B6173' }}>
                    {caseItem.stage >= 1
                      ? `Serving notice from ${caseItem.noticeGivenDate || '14 Sep 2026'} to ${caseItem.lastWorkingDay} • Operational handover in progress.`
                      : `Notice initiated on ${caseItem.noticeGivenDate || '14 Sep 2026'} • Operational handover pending acknowledgment.`}
                  </Typography>
                </Box>
              </Box>

              {/* Step 3 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: '#EDE9FE',
                      color: '#7C3AED',
                      border: '2px solid #7C3AED',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: '13px',
                    }}
                  >
                    3
                  </Box>
                  <Box sx={{ width: 2, height: 40, bgcolor: '#E5E7EF', my: 0.5 }} />
                </Box>
                <Box>
                  <Typography level="title-sm" sx={{ fontWeight: 700, color: '#7C3AED' }}>
                    3. Serving Notice Period (Active)
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#5B6173' }}>
                    Active countdown until {caseItem.lastWorkingDay} ({caseItem.dueText}) &bull; Handover in progress.
                  </Typography>
                </Box>
              </Box>

              {/* Step 4 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: '#F1F5F9',
                      color: '#64748B',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    4
                  </Box>
                  <Box sx={{ width: 2, height: 40, bgcolor: '#E5E7EF', my: 0.5 }} />
                </Box>
                <Box>
                  <Typography level="title-sm" sx={{ fontWeight: 600, color: '#374151' }}>
                    4. Last Working Day & System Access Revocation
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#8A90A2' }}>
                    Scheduled for {caseItem.lastWorkingDay} &bull; Crowne Plaza PMS and door card access terminated.
                  </Typography>
                </Box>
              </Box>

              {/* Step 5 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: '#F1F5F9',
                      color: '#64748B',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    5
                  </Box>
                  <Box sx={{ width: 2, height: 40, bgcolor: '#E5E7EF', my: 0.5 }} />
                </Box>
                <Box>
                  <Typography level="title-sm" sx={{ fontWeight: 600, color: '#374151' }}>
                    5. Clearance Sign-offs & Statutory Settlement
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#8A90A2' }}>
                    Hardware return, exit interview submission, and leave encashment calculations.
                  </Typography>
                </Box>
              </Box>

              {/* Step 6 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: caseItem.stage === 3 ? '#DCFCE7' : '#F1F5F9',
                      color: caseItem.stage === 3 ? '#16A34A' : '#64748B',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    {caseItem.stage === 3 ? '✓' : '6'}
                  </Box>
                </Box>
                <Box>
                  <Typography level="title-sm" sx={{ fontWeight: 600, color: '#374151' }}>
                    6. Case Closed & Profile Archived
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#8A90A2' }}>
                    Transferred to Employees &rsaquo; Exit &bull; Eligible for rehire noted.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>

          {/* Right Column: At a Glance Status Cards & Clearance Progress */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Status Cards */}
            <Card
              variant="outlined"
              sx={{
                bgcolor: '#FFFFFF',
                borderColor: '#E5E7EF',
                borderRadius: '16px',
                overflow: 'hidden',
                p: 0,
              }}
            >
              <Box
                sx={{
                  bgcolor: '#EEEBFF',
                  px: 2.5,
                  py: 1.5,
                  borderBottom: '1px solid #DDD6FE',
                }}
              >
                <Typography level="title-sm" sx={{ fontWeight: 700, color: '#7C3AED' }}>
                  At a Glance
                </Typography>
              </Box>

              <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: 600, color: '#111827' }}>
                      System Access & Security
                    </Typography>
                    <Typography level="body-xs" sx={{ color: '#5B6173' }}>
                      Opera Cloud PMS, POS, keycard locks & email
                    </Typography>
                  </Box>
                  <Chip size="sm" variant="soft" color="neutral" sx={{ fontWeight: 600 }}>
                    Active until Last Day
                  </Chip>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: 600, color: '#111827' }}>
                      Seat {caseItem.seat} Succession
                    </Typography>
                    <Typography level="body-xs" sx={{ color: '#5B6173' }}>
                      Designated cover: <strong>{caseItem.successor || 'None'}</strong>
                    </Typography>
                  </Box>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={caseItem.successor ? 'primary' : 'danger'}
                    sx={{ fontWeight: 600 }}
                  >
                    {caseItem.successor ? 'Handover in progress' : 'Seat Vacant'}
                  </Chip>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: 600, color: '#111827' }}>
                      Leave Balance Snapshot
                    </Typography>
                    <Typography level="body-xs" sx={{ color: '#5B6173' }}>
                      Synced automatically from Leave module
                    </Typography>
                  </Box>
                  <Typography
                    level="title-md"
                    sx={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 700,
                      color: '#7C3AED',
                    }}
                  >
                    {caseItem.leaveBalance || 12.5} days
                  </Typography>
                </Box>
              </Box>
            </Card>

            {/* Clearance Readiness Card */}
            <Card
              variant="outlined"
              sx={{
                bgcolor: '#FFFFFF',
                borderColor: '#E5E7EF',
                borderRadius: '16px',
                p: 2.5,
              }}
            >
              <Typography level="title-sm" sx={{ fontWeight: 700, color: '#111827' }}>
                Clearance Readiness
              </Typography>
              <Typography level="body-xs" sx={{ color: '#5B6173', mt: 0.5, mb: 1.5 }}>
                {approvedClearanceCount} of {totalClearanceCount} departmental sign-offs completed.
              </Typography>

              <LinearProgress
                determinate
                value={clearancePct}
                sx={{
                  color: '#7C3AED',
                  bgcolor: '#F1F5F9',
                  borderRadius: '6px',
                  height: 10,
                  mb: 2,
                }}
              />

              <Button
                variant="outlined"
                fullWidth
                onClick={() => setActiveTab('clearance')}
                endDecorator={<FiExternalLink />}
                sx={{
                  borderColor: '#DDD6FE',
                  color: '#7C3AED',
                  fontWeight: 600,
                  borderRadius: '10px',
                  fontSize: '13px',
                  '&:hover': { bgcolor: '#F5F3FF' },
                }}
              >
                View Departmental Sign-offs
              </Button>
            </Card>
          </Box>
        </Box>
      )}

      {/* ======================================================================
          TAB PANEL 2: HANDOVER & SUCCESSION
          ====================================================================== */}
      {activeTab === 'handover' && (
        <Card
          variant="outlined"
          sx={{
            bgcolor: '#FFFFFF',
            borderColor: '#E5E7EF',
            borderRadius: '16px',
            overflow: 'hidden',
            p: 0,
          }}
        >
          <Box
            sx={{
              bgcolor: '#EEEBFF',
              px: 2.5,
              py: 1.5,
              borderBottom: '1px solid #DDD6FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="title-sm" sx={{ fontWeight: 700, color: '#7C3AED' }}>
              Operational Responsibilities & Knowledge Transfer
            </Typography>
            <Chip size="sm" variant="solid" sx={{ bgcolor: '#7C3AED', color: '#FFFFFF' }}>
              {pendingHandoverCount} items remaining
            </Chip>
          </Box>

          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {handoverItems.map((item, idx) => (
              <Box
                key={item.key || idx}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: item.done ? '#F8FAFC' : '#FFFFFF',
                  border: '1px solid #E5E7EF',
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#F8FAFC' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                  <Checkbox
                    checked={item.done}
                    onChange={() => handleToggleHandover(idx)}
                    sx={{
                      color: '#7C3AED',
                      '&.Mui-checked': { color: '#7C3AED' },
                    }}
                  />
                  <Box>
                    <Typography
                      level="title-sm"
                      sx={{
                        fontWeight: 600,
                        color: item.done ? '#8A90A2' : '#111827',
                        textDecoration: item.done ? 'line-through' : 'none',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography level="body-xs" sx={{ color: '#5B6173', mt: 0.25 }}>
                      {item.subtitle}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {item.tag && (
                    <Chip size="sm" variant="soft" color="neutral" sx={{ fontWeight: 500 }}>
                      {item.tag}
                    </Chip>
                  )}
                  <Chip
                    size="sm"
                    variant="soft"
                    color={item.done ? 'success' : 'neutral'}
                    sx={{ fontWeight: 600 }}
                  >
                    {item.done ? 'Completed' : 'Pending'}
                  </Chip>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      )}

      {/* ======================================================================
          TAB PANEL 3: CLEARANCE CHECKLIST
          ====================================================================== */}
      {activeTab === 'clearance' && (
        <Card
          variant="outlined"
          sx={{
            bgcolor: '#FFFFFF',
            borderColor: '#E5E7EF',
            borderRadius: '16px',
            overflow: 'hidden',
            p: 0,
          }}
        >
          <Box
            sx={{
              bgcolor: '#EEEBFF',
              px: 2.5,
              py: 1.5,
              borderBottom: '1px solid #DDD6FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="title-sm" sx={{ fontWeight: 700, color: '#7C3AED' }}>
              Departmental Clearance Sign-offs
            </Typography>
            <Chip size="sm" variant="solid" sx={{ bgcolor: '#7C3AED', color: '#FFFFFF' }}>
              {approvedClearanceCount} of {totalClearanceCount} signed
            </Chip>
          </Box>

          <Box sx={{ p: 2.5 }}>
            <Table
              hoverRow
              sx={{
                '& thead th': {
                  bgcolor: '#EEEBFF',
                  color: '#7C3AED',
                  fontWeight: 700,
                  fontSize: '13px',
                },
                '& tbody td': {
                  fontSize: '13px',
                  verticalAlign: 'middle',
                },
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Clearance Task</th>
                  <th style={{ width: '18%' }}>Department</th>
                  <th style={{ width: '22%' }}>Designated Approver</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Sign-off Action</th>
                </tr>
              </thead>
              <tbody>
                {clearanceItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <Typography level="title-sm" sx={{ fontWeight: 600, color: '#111827' }}>
                        {item.title}
                      </Typography>
                      {item.notes && (
                        <Typography level="body-xs" sx={{ color: '#5B6173', mt: 0.25 }}>
                          {item.notes}
                        </Typography>
                      )}
                    </td>
                    <td>
                      <Chip size="sm" variant="soft" color="primary" sx={{ fontWeight: 600 }}>
                        {item.dept}
                      </Chip>
                    </td>
                    <td>
                      <Typography level="body-sm" sx={{ color: '#374151', fontWeight: 500 }}>
                        {item.approver || 'Department Head'}
                      </Typography>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        size="sm"
                        variant={item.done ? 'outlined' : 'solid'}
                        onClick={() => handleToggleClearance(idx)}
                        startDecorator={item.done ? <FiCheck /> : undefined}
                        sx={{
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '12.5px',
                          bgcolor: item.done ? 'transparent' : '#7C3AED',
                          borderColor: item.done ? '#16A34A' : 'transparent',
                          color: item.done ? '#16A34A' : '#FFFFFF',
                          '&:hover': {
                            bgcolor: item.done ? '#DCFCE7' : '#6D28D9',
                          },
                        }}
                      >
                        {item.done ? 'Signed off' : 'Sign off'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Box
              sx={{
                mt: 2.5,
                p: 2,
                bgcolor: '#F8FAFC',
                border: '1px solid #E5E7EF',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography level="body-sm" sx={{ color: '#5B6173' }}>
                Department heads review and sign off these operational clearances directly as part of exit clearance.
              </Typography>
              <Button
                variant="plain"
                size="sm"
                endDecorator={<FiExternalLink />}
                onClick={() => showToast('Filtering departmental clearance sign-offs...')}
                sx={{
                  color: '#7C3AED',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Department Sign-offs
              </Button>
            </Box>
          </Box>
        </Card>
      )}

      {/* ======================================================================
          TAB PANEL 4: EXIT INTERVIEW & FEEDBACK
          ====================================================================== */}
      {activeTab === 'interview' && (
        <Card
          variant="outlined"
          sx={{
            bgcolor: '#FFFFFF',
            borderColor: '#E5E7EF',
            borderRadius: '16px',
            overflow: 'hidden',
            p: 0,
          }}
        >
          <Box
            sx={{
              bgcolor: '#EEEBFF',
              px: 2.5,
              py: 1.5,
              borderBottom: '1px solid #DDD6FE',
            }}
          >
            <Typography level="title-sm" sx={{ fontWeight: 700, color: '#7C3AED' }}>
              Exit Interview & Retention Feedback
            </Typography>
          </Box>

          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' },
                gap: 2.5,
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: '#111827', mb: 0.75 }}>
                  Exit Survey Form Template
                </Typography>
                <Select
                  defaultValue="comp"
                  sx={{
                    maxWidth: 380,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    borderRadius: '8px',
                  }}
                >
                  <Option value="comp">Comprehensive Hospitality Exit Survey (12 questions)</Option>
                  <Option value="quick">Quick Mobile Exit Form (5 key metrics)</Option>
                </Select>
                <Typography level="body-xs" sx={{ color: '#8A90A2', mt: 0.5 }}>
                  Configured under Surveys &rsaquo; Exit Interview
                </Typography>
              </Box>

              <Box>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: '#111827', mb: 0.75 }}>
                  Submission Status
                </Typography>
                <Chip
                  size="md"
                  variant="soft"
                  color={
                    caseItem.exitInterviewStatus === 'completed'
                      ? 'success'
                      : caseItem.exitInterviewStatus === 'sent'
                      ? 'primary'
                      : caseItem.exitInterviewStatus === 'skipped'
                      ? 'neutral'
                      : 'warning'
                  }
                  sx={{ fontWeight: 600 }}
                >
                  {caseItem.exitInterviewStatus === 'completed'
                    ? 'Completed & Feedback Logged'
                    : caseItem.exitInterviewStatus === 'sent'
                    ? 'Sent · Pending Employee Submission'
                    : caseItem.exitInterviewStatus === 'skipped'
                    ? 'Skipped (Waived)'
                    : 'Survey Not Sent'}
                </Chip>
              </Box>
            </Box>

            <Divider />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              {caseItem.exitInterviewStatus !== 'completed' && (
                <>
                  <Button
                    size="sm"
                    variant="solid"
                    onClick={handleSendExitSurvey}
                    startDecorator={<FiSend />}
                    sx={{
                      bgcolor: '#7C3AED',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '13px',
                      '&:hover': { bgcolor: '#6D28D9' },
                    }}
                  >
                    Send exit survey email
                  </Button>
                  <Button
                    size="sm"
                    variant="outlined"
                    onClick={handleMarkSurveySubmitted}
                    startDecorator={<FiCheck />}
                    sx={{
                      borderColor: '#DDD6FE',
                      color: '#7C3AED',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    Mark submitted manually
                  </Button>
                  <Button
                    size="sm"
                    variant="plain"
                    onClick={handleSkipSurvey}
                    sx={{
                      color: '#8A90A2',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    Skip with reason
                  </Button>
                </>
              )}

              {caseItem.exitInterviewStatus === 'completed' && (
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => showToast('Viewing confidential responses...')}
                  startDecorator={<FiFileText />}
                  sx={{
                    borderColor: '#DDD6FE',
                    color: '#7C3AED',
                    borderRadius: '8px',
                    fontWeight: 600,
                  }}
                >
                  View feedback responses
                </Button>
              )}
            </Box>
          </Box>
        </Card>
      )}

      {/* ======================================================================
          TAB PANEL 5: STATUTORY FINAL SETTLEMENT & RELIEVING
          ====================================================================== */}
      {activeTab === 'settlement' && (
        <Card
          variant="outlined"
          sx={{
            bgcolor: '#FFFFFF',
            borderColor: '#E5E7EF',
            borderRadius: '16px',
            overflow: 'hidden',
            p: 0,
          }}
        >
          <Box
            sx={{
              bgcolor: '#EEEBFF',
              px: 2.5,
              py: 1.5,
              borderBottom: '1px solid #DDD6FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="title-sm" sx={{ fontWeight: 700, color: '#7C3AED' }}>
              Statutory Final Settlement & Relieving Letters
            </Typography>
            <Chip size="sm" variant="solid" sx={{ bgcolor: '#7C3AED', color: '#FFFFFF' }}>
              {(caseItem.settlement?.status || 'PENDING').toUpperCase()}
            </Chip>
          </Box>

          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 4 Financial Metric Cards in AED */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
                gap: 2,
              }}
            >
              {/* Card 1: Leave Balance */}
              <Card
                variant="outlined"
                sx={{
                  bgcolor: '#F8FAFC',
                  borderColor: '#E5E7EF',
                  borderRadius: '12px',
                  p: 2,
                }}
              >
                <Typography level="body-xs" sx={{ textTransform: 'uppercase', color: '#8A90A2', fontWeight: 700 }}>
                  Leave Balance
                </Typography>
                <Typography
                  level="h3"
                  sx={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    color: '#111827',
                    mt: 0.5,
                  }}
                >
                  {caseItem.settlement?.leaveDays || 12.5} d
                </Typography>
                <Typography level="body-xs" sx={{ color: '#5B6173', mt: 0.5 }}>
                  Last day leave snapshot
                </Typography>
              </Card>

              {/* Card 2: Leave Encashment */}
              <Card
                variant="outlined"
                sx={{
                  bgcolor: '#F8FAFC',
                  borderColor: '#E5E7EF',
                  borderRadius: '12px',
                  p: 2,
                }}
              >
                <Typography level="body-xs" sx={{ textTransform: 'uppercase', color: '#8A90A2', fontWeight: 700 }}>
                  Leave Encashment
                </Typography>
                <Typography
                  level="h3"
                  sx={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    color: '#111827',
                    mt: 0.5,
                  }}
                >
                  AED {caseItem.settlement?.encashmentAmount || '4,200'}
                </Typography>
                <Typography level="body-xs" sx={{ color: '#5B6173', mt: 0.5 }}>
                  Statutory leave payout
                </Typography>
              </Card>

              {/* Card 3: Recoveries */}
              <Card
                variant="outlined"
                sx={{
                  bgcolor: '#F8FAFC',
                  borderColor: '#E5E7EF',
                  borderRadius: '12px',
                  p: 2,
                }}
              >
                <Typography level="body-xs" sx={{ textTransform: 'uppercase', color: '#8A90A2', fontWeight: 700 }}>
                  Recoveries / Dues
                </Typography>
                <Typography
                  level="h3"
                  sx={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    color: '#DC2626',
                    mt: 0.5,
                  }}
                >
                  - AED {caseItem.settlement?.recoveriesAmount || '350'}
                </Typography>
                <Typography level="body-xs" sx={{ color: '#5B6173', mt: 0.5 }}>
                  Deductions & advances
                </Typography>
              </Card>

              {/* Card 4: Net Payable */}
              <Card
                variant="outlined"
                sx={{
                  bgcolor: '#F5F3FF',
                  borderColor: '#C4B5FD',
                  borderRadius: '12px',
                  p: 2,
                }}
              >
                <Typography level="body-xs" sx={{ textTransform: 'uppercase', color: '#7C3AED', fontWeight: 700 }}>
                  Net Payable
                </Typography>
                <Typography
                  level="h3"
                  sx={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    color: '#7C3AED',
                    mt: 0.5,
                  }}
                >
                  AED {caseItem.settlement?.netPayable || '3,850'}
                </Typography>
                <Typography level="body-xs" sx={{ color: '#6D28D9', mt: 0.5 }}>
                  Final statutory settlement
                </Typography>
              </Card>
            </Box>

            <Divider />

            {/* Settlement Status & Relieving Letters */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2.5,
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: '#111827', mb: 0.75 }}>
                  Settlement Processing Status
                </Typography>
                <Select
                  value={caseItem.settlement?.status || 'pending'}
                  onChange={(_, val) =>
                    handleSettlementStatusChange(val as 'pending' | 'in_progress' | 'paid' | 'waived')
                  }
                  sx={{
                    maxWidth: 360,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    borderRadius: '8px',
                  }}
                >
                  <Option value="pending">Pending Review & Calculation</Option>
                  <Option value="in_progress">In Progress · Payroll Routing</Option>
                  <Option value="paid">Paid & Reconciled</Option>
                  <Option value="waived">Waived / Non-payable</Option>
                </Select>
              </Box>

              <Card
                variant="outlined"
                sx={{
                  bgcolor: '#F8FAFC',
                  borderColor: '#E5E7EF',
                  borderRadius: '12px',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography level="title-sm" sx={{ fontWeight: 600, color: '#111827' }}>
                    Relieving & Experience Certificate
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#5B6173', mt: 0.25 }}>
                    Generated and handed over to employee
                  </Typography>
                </Box>
                <Switch
                  checked={caseItem.settlement?.lettersGenerated || false}
                  onChange={(e) => handleToggleLetters(e.target.checked)}
                  sx={{
                    '--Switch-trackBackground': '#E5E7EF',
                    '&.Mui-checked': {
                      '--Switch-trackBackground': '#7C3AED',
                    },
                  }}
                />
              </Card>
            </Box>
          </Box>
        </Card>
      )}
    </Box>
  );
};
