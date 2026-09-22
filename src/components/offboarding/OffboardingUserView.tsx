import React from 'react';
import {
  Box,
  Typography,
  Card,
  Chip,
  Link,
  Breadcrumbs,
} from '@mui/joy';
import { FiChevronRight, FiCheck } from 'react-icons/fi';
import { OffboardingCase } from './types';

export interface OffboardingUserViewProps {
  caseData?: OffboardingCase;
  onBackToAdmin?: () => void;
}

interface ChecklistStep {
  id: string;
  order: number;
  title: string;
  desc: string;
  isDefault: boolean;
  mandatory: boolean;
  isComplete: boolean;
}

const DEFAULT_USER_STEPS: ChecklistStep[] = [
  {
    id: 'step_handover',
    order: 1,
    title: 'Handover & Knowledge Transfer',
    desc: 'Operational duties transfer, direct reports reassignment, pending tasks handover, VIP client portfolios, and documented knowledge transfer.',
    isDefault: true,
    mandatory: true,
    isComplete: false,
  },
  {
    id: 'step_assets',
    order: 2,
    title: 'Assets Clearance',
    desc: 'Return of company hardware (laptops, monitors, mobile devices), staff accommodation room inspection, access keys retrieval, and accounts deprovisioning.',
    isDefault: true,
    mandatory: true,
    isComplete: true, // Matches uploaded screenshot with green border & checkmark
  },
  {
    id: 'step_settlement',
    order: 3,
    title: 'Final Settlement',
    desc: 'Statutory End-of-Service Benefits (EOSB gratuity), annual leave encashment calculations, company asset deductions, WPS disbursement, and relieving letter issuance.',
    isDefault: true,
    mandatory: true,
    isComplete: false,
  },
];

export const OffboardingUserView: React.FC<OffboardingUserViewProps> = ({
  caseData,
  onBackToAdmin,
}) => {
  const employeeName = caseData?.name || 'Sara Khan';

  return (
    <Box sx={{ width: '100%', maxWidth: 1240, mx: 'auto', pb: 6 }}>
      {/* Top Navigation / Breadcrumb Bar */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs
          separator={<FiChevronRight size={14} color="#94A3B8" />}
          sx={{ px: 0, py: 0, fontSize: '13px', fontWeight: 600 }}
        >
          {onBackToAdmin ? (
            <Link
              component="button"
              onClick={onBackToAdmin}
              underline="none"
              sx={{ color: '#64748B', fontWeight: 600, '&:hover': { color: '#7C3AED' } }}
            >
              Back to HR Case Workspace
            </Link>
          ) : (
            <Typography sx={{ color: '#64748B', fontWeight: 600 }}>
              HR Case Workspace
            </Typography>
          )}
          <Typography sx={{ color: '#0F172A', fontWeight: 700 }}>
            Employee View ({employeeName})
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Main 2-Column Layout: Left = Checklist, Right = Notice Countdown */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* LEFT: Offboarding Checklist (Strictly matching user uploaded screenshot) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography
            level="h2"
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#0F172A',
              margin: 0,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Offboarding Checklist
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {DEFAULT_USER_STEPS.map((step) => {
              return (
                <Card
                  key={step.id}
                  variant="outlined"
                  sx={{
                    bgcolor: '#FFFFFF',
                    borderColor: step.isComplete ? '#BBF7D0' : '#E2E8F0',
                    borderRadius: '14px',
                    p: '20px 22px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 2,
                    }}
                  >
                    {/* Left: Step Avatar & Details */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        flex: 1,
                      }}
                    >
                      {/* Step Number / Checkmark Avatar */}
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: step.isComplete ? '#DCFCE7' : '#EEEBFF',
                          color: step.isComplete ? '#15803D' : '#7C3AED',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '14px',
                          fontWeight: 700,
                          flexShrink: 0,
                          mt: 0.25,
                          userSelect: 'none',
                        }}
                      >
                        {step.isComplete ? <FiCheck size={16} strokeWidth={3} /> : step.order}
                      </Box>

                      {/* Title, Badges, and Description */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography
                            sx={{
                              fontSize: '15px',
                              fontWeight: 700,
                              color: '#0F172A',
                              fontFamily: 'Inter, system-ui, sans-serif',
                            }}
                          >
                            {step.title}
                          </Typography>

                          {step.isDefault && (
                            <Chip
                              size="sm"
                              sx={{
                                bgcolor: '#EDE9FE',
                                color: '#7C3AED',
                                fontSize: '11px',
                                fontWeight: 600,
                                px: 1,
                                py: 0.25,
                                borderRadius: '6px',
                                minHeight: 'auto',
                              }}
                            >
                              Default
                            </Chip>
                          )}

                          {step.mandatory && (
                            <Chip
                              size="sm"
                              sx={{
                                bgcolor: '#FEE2E2',
                                color: '#991B1B',
                                fontSize: '11px',
                                fontWeight: 600,
                                px: 1,
                                py: 0.25,
                                borderRadius: '6px',
                                minHeight: 'auto',
                              }}
                            >
                              🔒 Mandatory Gate
                            </Chip>
                          )}
                        </Box>

                        <Typography
                          sx={{
                            fontSize: '13px',
                            color: '#64748B',
                            mt: 0.75,
                            lineHeight: 1.5,
                            maxWidth: 680,
                            fontFamily: 'Inter, system-ui, sans-serif',
                          }}
                        >
                          {step.desc}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Right: Static Status Pill (Zero sign-off or completion option for user) */}
                    <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          bgcolor: step.isComplete ? '#ECFDF5' : '#F8FAFC',
                          color: step.isComplete ? '#047857' : '#475569',
                          border: '1px solid',
                          borderColor: step.isComplete ? '#A7F3D0' : '#CBD5E1',
                          borderRadius: '8px',
                          px: 2,
                          py: 1,
                          fontSize: '13px',
                          fontWeight: 600,
                          userSelect: 'none',
                          pointerEvents: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.75,
                        }}
                      >
                        {step.isComplete ? (
                          <>
                            <FiCheck size={14} strokeWidth={2.5} /> Completed
                          </>
                        ) : (
                          'Not Completed'
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Box>
        </Box>

        {/* RIGHT: Notice Countdown Widget */}
        <Box sx={{ position: { lg: 'sticky' }, top: 20 }}>
          <Card
            variant="outlined"
            sx={{
              bgcolor: '#FFFFFF',
              borderColor: '#E2E8F0',
              borderRadius: '14px',
              p: 2.75,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.75,
              }}
            >
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                Notice Countdown
              </Typography>
              <Chip
                size="sm"
                sx={{
                  bgcolor: '#F1F5F9',
                  color: '#475569',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '6px',
                }}
              >
                Active Notice
              </Chip>
            </Box>

            <Box
              sx={{
                textAlign: 'center',
                py: 2,
                px: 1.5,
                bgcolor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '34px',
                  fontWeight: 800,
                  color: '#7C3AED',
                  lineHeight: 1,
                }}
              >
                29
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#64748B',
                  mt: 0.75,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Days Remaining
              </Typography>
              <Typography sx={{ fontSize: '11.5px', color: '#94A3B8', mt: 0.5 }}>
                Last Day: Wednesday, 14 Oct 2026
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: '12.5px',
                color: '#64748B',
                lineHeight: 1.55,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Your standard 30-day notice period commenced on <strong>14 Sep 2026</strong>. System access, email, and hotel credentials remain fully active until <strong>18:00 on 14 Oct 2026</strong>.
            </Typography>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default OffboardingUserView;
