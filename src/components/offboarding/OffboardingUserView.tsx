import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Avatar,
  Alert,
} from '@mui/joy';
import {
  FiCheck,
  FiLock,
  FiFileText,
  FiKey,
  FiPackage,
  FiDollarSign,
  FiArrowLeft,
  FiInfo,
  FiShield,
} from 'react-icons/fi';
import { OffboardingCase } from './types';

export interface OffboardingUserViewProps {
  caseData?: OffboardingCase;
  onBackToAdmin?: () => void;
}

interface StaticStepDeliverable {
  title: string;
  doc: string;
  icon: React.ReactNode;
}

interface StaticChecklistStep {
  id: string;
  order: number;
  title: string;
  desc: string;
  mandatory: boolean;
  isDefault: boolean;
  status: 'completed' | 'not_completed';
  deliverables: StaticStepDeliverable[];
}

export const OffboardingUserView: React.FC<OffboardingUserViewProps> = ({
  caseData,
  onBackToAdmin,
}) => {
  const [activeProfileTab, setActiveProfileTab] = useState<string>('offboarding');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const employeeName = caseData?.name || 'Sara Khan';
  const employeeInitials = caseData?.initials || 'SK';
  const seatCode = caseData?.seat || 'FDM-01';
  const roleTitle = caseData?.title || 'Front Desk Manager';
  const department = caseData?.department || 'Front Office';
  const managerName = caseData?.manager || 'James Cole (Hotel Manager)';
  const successorName = caseData?.successor || 'Omar Haddad';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Master Static Steps matching HR's Case Checklist
  const staticSteps: StaticChecklistStep[] = [
    {
      id: 'step_handover',
      order: 1,
      title: 'Handover & Knowledge Transfer',
      desc: 'Operational duties transfer, direct reports reassignment, pending tasks handover, VIP client portfolios, and documented knowledge transfer.',
      mandatory: true,
      isDefault: true,
      status: 'not_completed',
      deliverables: [
        {
          icon: <FiFileText size={14} color="#7C3AED" />,
          title: `Opera PMS & Key Accounts transfer documentation to successor ${successorName}`,
          doc: 'Signed Handover Note · Opera PMS Superuser Credential Transfer',
        },
        {
          icon: <FiFileText size={14} color="#7C3AED" />,
          title: 'Master front desk rosters, shift handover schedule & VIP guest protocols',
          doc: 'Documented SOPs · Duty Manager Shift Schedules Q4',
        },
        {
          icon: <FiShield size={14} color="#7C3AED" />,
          title: 'Line manager briefing & knowledge transfer completion sign-off',
          doc: `Line Manager Sign-off Certificate · ${managerName}`,
        },
      ],
    },
    {
      id: 'step_assets',
      order: 2,
      title: 'Assets Clearance',
      desc: 'Return of company hardware (laptops, monitors, mobile devices), staff accommodation room inspection, access keys retrieval, and accounts deprovisioning.',
      mandatory: true,
      isDefault: true,
      status: 'not_completed',
      deliverables: [
        {
          icon: <FiKey size={14} color="#7C3AED" />,
          title: 'Master floor keycards (Levels 1–18) & PMS supervisor master card surrender',
          doc: 'Security Department Asset Retrieval Receipt',
        },
        {
          icon: <FiPackage size={14} color="#7C3AED" />,
          title: 'Staff locker #114 inspection & staff accommodation handover inspection',
          doc: 'Facilities & Housekeeping Clearance Certificate',
        },
        {
          icon: <FiShield size={14} color="#7C3AED" />,
          title: 'Departmental communications radio (Motorola) & corporate nametag return',
          doc: 'IT & Uniform Return Form · Crowne Plaza Dubai',
        },
      ],
    },
    {
      id: 'step_settlement',
      order: 3,
      title: 'Final Settlement',
      desc: 'Statutory End-of-Service Benefits (EOSB gratuity), annual leave encashment calculations, company asset deductions, WPS disbursement, and relieving letter issuance.',
      mandatory: true,
      isDefault: true,
      status: 'not_completed',
      deliverables: [
        {
          icon: <FiFileText size={14} color="#7C3AED" />,
          title: 'MOHRE residence visa cancellation & passport release clearance',
          doc: 'Statutory MOHRE Work Permit Cancellation Form',
        },
        {
          icon: <FiDollarSign size={14} color="#7C3AED" />,
          title: 'Unused annual leave encashment audit (12.5 accrued balance days @ AED 308.00/day)',
          doc: 'Finance Payroll Audit & Leave Balance Statement',
        },
        {
          icon: <FiFileText size={14} color="#7C3AED" />,
          title: 'Final WPS direct bank transfer disbursement & official Relieving Certificate issuance',
          doc: 'Statutory Relieving Certificate & Experience Letter (Stamped)',
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1180,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Toast Alert */}
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
            bgcolor: '#7C3AED',
            boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          {toastMsg}
        </Alert>
      )}

      {/* 1. Authentic Hirerkey Profile Header Card */}
      <Card
        variant="outlined"
        sx={{
          bgcolor: '#FFFFFF',
          borderColor: '#E5E7EF',
          borderRadius: '14px',
          p: { xs: 2, md: 2.5 },
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Identity Left */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: '#EDE9FE',
                color: '#7C3AED',
                fontWeight: 700,
                fontSize: '18px',
                border: '2px solid #DDD6FE',
              }}
            >
              {employeeInitials}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography level="title-lg" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {employeeName}
                </Typography>
                <Chip
                  size="sm"
                  sx={{
                    bgcolor: '#EEF2FF',
                    color: '#5C75E7',
                    border: '1px solid #C7D2FE',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    borderRadius: '6px',
                  }}
                >
                  {seatCode}
                </Chip>
              </Box>
              <Typography level="body-sm" sx={{ color: '#64748B', fontWeight: 500 }}>
                {roleTitle} | {department} &bull; Crowne Plaza Dubai
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                <Chip
                  size="sm"
                  variant="soft"
                  sx={{
                    bgcolor: '#FEF3C7',
                    color: '#B45309',
                    fontWeight: 600,
                    fontSize: '11px',
                    borderRadius: '6px',
                  }}
                >
                  Serving notice · 29 days remaining
                </Chip>
                <Chip
                  size="sm"
                  variant="soft"
                  sx={{
                    bgcolor: '#DCFCE7',
                    color: '#15803D',
                    fontWeight: 600,
                    fontSize: '11px',
                    borderRadius: '6px',
                  }}
                >
                  Covered by {successorName}
                </Chip>
                <Chip
                  size="sm"
                  variant="outlined"
                  sx={{
                    bgcolor: '#F8FAFC',
                    borderColor: '#E2E8F0',
                    color: '#475569',
                    fontSize: '11px',
                    borderRadius: '6px',
                  }}
                >
                  Manager: {managerName}
                </Chip>
              </Box>
            </Box>
          </Box>

          {/* Action Right */}
          {onBackToAdmin && (
            <Button
              variant="outlined"
              size="sm"
              onClick={onBackToAdmin}
              startDecorator={<FiArrowLeft />}
              sx={{
                borderColor: '#CBD5E1',
                color: '#334155',
                fontWeight: 600,
                fontSize: '12px',
                borderRadius: '8px',
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              Switch to HR Case Workspace
            </Button>
          )}
        </Box>

        {/* Authentic Hirerkey Lavender Tabstrip */}
        <Box
          sx={{
            bgcolor: '#EEE9FD',
            p: '4px 6px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            overflowX: 'auto',
          }}
        >
          {[
            { key: 'details', label: 'User Details' },
            { key: 'documents', label: 'Documents' },
            { key: 'hierarchy', label: 'Hierarchy' },
            { key: 'feedback', label: 'Feedback' },
            { key: 'kjr', label: 'KJR / KPO' },
            { key: 'offboarding', label: 'Offboarding Details' },
          ].map((tab) => {
            const isActive = tab.key === activeProfileTab;
            return (
              <Button
                key={tab.key}
                size="sm"
                variant={isActive ? 'solid' : 'plain'}
                onClick={() => {
                  if (tab.key === 'offboarding') {
                    setActiveProfileTab(tab.key);
                  } else {
                    showToast(`${tab.label} profile section`);
                  }
                }}
                sx={{
                  bgcolor: isActive ? '#7C3AED' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#4C1D95',
                  fontWeight: 600,
                  fontSize: '12.5px',
                  borderRadius: '8px',
                  px: 2,
                  py: 0.75,
                  minHeight: 'auto',
                  boxShadow: isActive ? '0 1px 3px rgba(124, 58, 237, 0.3)' : 'none',
                  '&:hover': {
                    bgcolor: isActive ? '#6D28D9' : 'rgba(124, 58, 237, 0.08)',
                  },
                }}
              >
                {tab.label}
              </Button>
            );
          })}
        </Box>
      </Card>

      {/* 2. Informational Static Notice Banner */}
      <Box
        sx={{
          bgcolor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid #7C3AED',
          borderRadius: '12px',
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.75,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            bgcolor: '#EDE9FE',
            color: '#7C3AED',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <FiInfo size={18} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography level="title-sm" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.25 }}>
            Employee Offboarding Checklist &bull; Read-Only Overview
          </Typography>
          <Typography level="body-xs" sx={{ color: '#475569', lineHeight: 1.5 }}>
            Below are all mandatory steps and handover documents required for your departure. This is a read-only view of your progress: step verification and official sign-off are handled directly by your Line Manager ({managerName}) and HR Operations.
          </Typography>
        </Box>
        <Chip
          size="sm"
          variant="outlined"
          startDecorator={<FiLock size={12} />}
          sx={{
            bgcolor: '#FFFFFF',
            borderColor: '#CBD5E1',
            color: '#475569',
            fontWeight: 600,
            fontSize: '11.5px',
            borderRadius: '8px',
            flexShrink: 0,
          }}
        >
          Sign-off: Manager / HR Only
        </Chip>
      </Box>

      {/* 3. The Static Single Offboarding Checklist */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {staticSteps.map((step) => {
          const isComplete = step.status === 'completed';

          return (
            <Card
              key={step.id}
              variant="outlined"
              sx={{
                bgcolor: '#FFFFFF',
                borderColor: isComplete ? '#BBF7D0' : '#E2E8F0',
                borderRadius: '12px',
                p: { xs: 2, md: 2.5 },
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {/* Step Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75, flex: 1 }}>
                  {/* Step Number Avatar */}
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      bgcolor: isComplete ? '#DCFCE7' : '#EEEBFF',
                      color: isComplete ? '#15803D' : '#7C3AED',
                      border: `1.5px solid ${isComplete ? '#86EFAC' : '#DDD6FE'}`,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  >
                    {isComplete ? <FiCheck size={16} /> : step.order}
                  </Box>

                  {/* Title & Desc */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography level="title-md" sx={{ fontWeight: 700, color: '#0F172A' }}>
                        {step.title}
                      </Typography>
                      <Chip
                        size="sm"
                        sx={{
                          bgcolor: '#EDE9FE',
                          color: '#7C3AED',
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '6px',
                        }}
                      >
                        Default
                      </Chip>
                      <Chip
                        size="sm"
                        sx={{
                          bgcolor: '#FEE2E2',
                          color: '#991B1B',
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '6px',
                        }}
                      >
                        🔒 Mandatory Gate
                      </Chip>
                    </Box>
                    <Typography level="body-sm" sx={{ color: '#64748B', mt: 0.5, lineHeight: 1.5 }}>
                      {step.desc}
                    </Typography>
                  </Box>
                </Box>

                {/* Read-Only Status Chip (No user sign-off controls) */}
                <Box sx={{ flexShrink: 0 }}>
                  {isComplete ? (
                    <Chip
                      size="sm"
                      variant="soft"
                      startDecorator={<FiCheck />}
                      sx={{
                        bgcolor: '#ECFDF5',
                        color: '#047857',
                        border: '1px solid #A7F3D0',
                        fontWeight: 600,
                        fontSize: '12px',
                        py: 0.5,
                        px: 1.5,
                        borderRadius: '8px',
                      }}
                    >
                      Verified &amp; Signed Off by HR
                    </Chip>
                  ) : (
                    <Chip
                      size="sm"
                      variant="outlined"
                      startDecorator={<FiLock />}
                      sx={{
                        bgcolor: '#F8FAFC',
                        borderColor: '#E2E8F0',
                        color: '#64748B',
                        fontWeight: 600,
                        fontSize: '12px',
                        py: 0.5,
                        px: 1.5,
                        borderRadius: '8px',
                      }}
                    >
                      Pending HR / Manager Verification
                    </Chip>
                  )}
                </Box>
              </Box>

              {/* Deliverables & Required Documents */}
              <Box
                sx={{
                  bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  p: 2,
                }}
              >
                <Typography
                  level="body-xs"
                  sx={{
                    fontWeight: 700,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  <FiFileText size={13} />
                  Required Deliverables &amp; Documents to Complete
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {step.deliverables.map((deliv, dIdx) => (
                    <Box
                      key={dIdx}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.25,
                        py: 1,
                        borderBottom:
                          dIdx < step.deliverables.length - 1 ? '1px solid #EDF2F7' : 'none',
                      }}
                    >
                      <Box sx={{ mt: '2px', flexShrink: 0 }}>{deliv.icon}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography level="body-sm" sx={{ fontWeight: 600, color: '#1E293B' }}>
                          {deliv.title}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: '#64748B', mt: 0.25 }}>
                          Required Document:{' '}
                          <Typography sx={{ color: '#7C3AED', fontWeight: 500 }}>
                            {deliv.doc}
                          </Typography>
                        </Typography>
                      </Box>
                      <Typography
                        level="body-xs"
                        sx={{
                          color: isComplete ? '#15803D' : '#94A3B8',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {isComplete ? '✓ Verified' : 'Action Required'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Card Footer Note */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #F1F5F9',
                  pt: 1.25,
                }}
              >
                <Typography level="body-xs" sx={{ color: '#94A3B8' }}>
                  Verification authority: <strong>Line Manager ({managerName})</strong> &amp;{' '}
                  <strong>HR Operations</strong>
                </Typography>
                <Typography level="body-xs" sx={{ color: '#94A3B8' }}>
                  Static Checklist View &bull; Sign-off Disabled
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default OffboardingUserView;
