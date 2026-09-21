import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Divider,
  Sheet,
  Select,
  Option,
  Input,
  Tooltip,
} from '@mui/joy';
import {
  FiX,
  FiEdit2,
  FiCopy,
  FiShield,
  FiUser,
  FiUsers,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowDown,
  FiPlay,
  FiZap,
} from 'react-icons/fi';
import { ApprovalWorkflow } from './types';

interface ApprovalFlowDrawerProps {
  workflow: ApprovalWorkflow | null;
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  onEdit: (workflow: ApprovalWorkflow) => void;
  onClone?: (workflow: ApprovalWorkflow) => void;
}

const MOCK_EMPLOYEES = [
  { name: 'Sara Khan', role: 'Front Desk Manager', dept: 'Front Office', grade: 'L5' },
  { name: 'Rahul Mehta', role: 'Sous Chef', dept: 'Food & Beverage', grade: 'L4' },
  { name: 'Aisha Noor', role: 'Guest Relations Exec.', dept: 'Front Office', grade: 'L3' },
  { name: 'Vikram Malhotra', role: 'General Manager', dept: 'Executive', grade: 'L9' },
  { name: 'Carlos Rodriguez', role: 'Culinary Lead', dept: 'Food & Beverage', grade: 'L4' },
];

export const ApprovalFlowDrawer: React.FC<ApprovalFlowDrawerProps> = ({
  workflow,
  open,
  isOpen,
  onClose,
  onEdit,
  onClone,
}) => {
  const isDrawerOpen = open ?? isOpen ?? false;
  const [simulatorEmployee, setSimulatorEmployee] = useState<string>('Sara Khan');
  const [simulatorAmount, setSimulatorAmount] = useState<string>('6200');
  const [simulationResult, setSimulationResult] = useState<{
    matches: boolean;
    reason: string;
  } | null>(null);

  if (!workflow) return null;

  const handleRunSimulation = () => {
    const emp = MOCK_EMPLOYEES.find((e) => e.name === simulatorEmployee);
    if (!emp) return;

    if (workflow.policyType === 'default') {
      setSimulationResult({
        matches: true,
        reason: 'Matches as the universal fallback policy when no scoped override triggers.',
      });
      return;
    }

    // Check conditions
    let matched = true;
    let reason = 'All criteria met: ';

    for (const cond of workflow.conditions) {
      if (cond.field === 'amount') {
        const amt = parseFloat(simulatorAmount) || 0;
        if (cond.operator === 'greater_than' && amt <= (cond.value as number)) {
          matched = false;
          reason = `Amount $${amt} is below the required threshold of $${cond.value}.`;
          break;
        }
        if (cond.operator === 'less_than' && amt >= (cond.value as number)) {
          matched = false;
          reason = `Amount $${amt} exceeds the threshold of $${cond.value}.`;
          break;
        }
      }
      if (cond.field === 'department') {
        if (Array.isArray(cond.value)) {
          if (!cond.value.includes(emp.dept)) {
            matched = false;
            reason = `Employee department "${emp.dept}" is not in [${cond.value.join(', ')}].`;
            break;
          }
        } else if (cond.value !== emp.dept) {
          matched = false;
          reason = `Employee department "${emp.dept}" does not match "${cond.value}".`;
          break;
        }
      }
    }

    if (matched) {
      reason = `Matches for ${emp.name} (${emp.dept})! Will execute ${workflow.steps.length} approval tiers.`;
    }

    setSimulationResult({ matches: matched, reason });
  };

  return (
    <Drawer
      anchor="right"
      size="md"
      open={isDrawerOpen}
      onClose={onClose}
      sx={{
        '--Drawer-horizontalSize': '500px',
        '& .MuiDrawer-content': {
          bgcolor: '#FFFFFF',
          boxShadow: '-8px 0 24px rgba(0, 23, 65, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          p: 0,
        },
      }}
    >
      {/* 1. Header Bar */}
      <Box
        sx={{
          p: '20px 24px',
          borderBottom: '1px solid #E5E7EF',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          bgcolor: '#FAF8FF',
        }}
      >
        <Box sx={{ pr: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
            <Chip
              size="sm"
              variant="soft"
              color={workflow.policyType === 'default' ? 'primary' : 'neutral'}
              startDecorator={workflow.policyType === 'default' ? <FiShield size={12} /> : undefined}
              sx={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}
            >
              {workflow.policyType === 'default' ? 'Global Default' : 'Scoped Policy'}
            </Chip>
            <Chip
              size="sm"
              variant="outlined"
              sx={{
                fontSize: '11px',
                fontWeight: 600,
                color: workflow.status === 'active' ? '#16A34A' : '#D97706',
                borderColor: workflow.status === 'active' ? '#BBF7D0' : '#FDE68A',
                bgcolor: workflow.status === 'active' ? '#F0FDF4' : '#FFFBEB',
              }}
            >
              {workflow.status === 'active' ? '● Active' : '○ Draft'}
            </Chip>
            <Typography level="body-xs" sx={{ color: '#64748B', fontWeight: 500 }}>
              v{workflow.version}
            </Typography>
          </Box>
          <Typography level="title-lg" sx={{ fontWeight: 700, color: '#001741', lineHeight: 1.25 }}>
            {workflow.name}
          </Typography>
          {workflow.description && (
            <Typography level="body-sm" sx={{ color: '#475569', mt: 0.5 }}>
              {workflow.description}
            </Typography>
          )}
        </Box>

        <IconButton
          variant="plain"
          size="sm"
          onClick={onClose}
          sx={{ borderRadius: '8px', color: '#64748B' }}
        >
          <FiX size={18} />
        </IconButton>
      </Box>

      {/* 2. Action Bar */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          borderBottom: '1px solid #E5E7EF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#FFFFFF',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="sm"
            variant="solid"
            startDecorator={<FiEdit2 size={13} />}
            onClick={() => onEdit(workflow)}
            sx={{
              bgcolor: '#7C3AED',
              '&:hover': { bgcolor: '#6D28D9' },
              fontWeight: 600,
              fontSize: '12.5px',
              borderRadius: '8px',
            }}
          >
            Edit Workflow
          </Button>
          {onClone && (
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              startDecorator={<FiCopy size={13} />}
              onClick={() => onClone(workflow)}
              sx={{ fontWeight: 600, fontSize: '12.5px', borderRadius: '8px' }}
            >
              Clone
            </Button>
          )}
        </Box>

        <Typography level="body-xs" sx={{ color: '#64748B' }}>
          {workflow.inFlightCount ?? 0} in-flight requests
        </Typography>
      </Box>

      {/* 3. Scrollable Inspector Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Section A: Applicability & Targeting */}
        <Box>
          <Typography level="title-sm" sx={{ fontWeight: 700, color: '#001741', mb: 1 }}>
            Applicability & Scope Criteria
          </Typography>
          {workflow.policyType === 'default' ? (
            <Sheet
              variant="soft"
              color="primary"
              sx={{
                p: 1.75,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.25,
                bgcolor: '#FAF8FF',
                border: '1px solid #EDE9FE',
              }}
            >
              <FiShield size={18} color="#7C3AED" style={{ flexShrink: 0, marginTop: '2px' }} />
              <Box>
                <Typography level="body-xs" sx={{ fontWeight: 700, color: '#7C3AED' }}>
                  Universal Catch-All Fallback
                </Typography>
                <Typography level="body-xs" sx={{ color: '#475569', mt: 0.25 }}>
                  This policy automatically governs any request in the <strong>{workflow.module}</strong> area
                  that does not match a specialized scoped condition.
                </Typography>
              </Box>
            </Sheet>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {workflow.conditions.map((cond) => (
                <Box
                  key={cond.id}
                  sx={{
                    p: '8px 12px',
                    borderRadius: '8px',
                    bgcolor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography level="body-xs" sx={{ fontWeight: 600, color: '#1E293B' }}>
                    {cond.field.toUpperCase()} {cond.operator.replace('_', ' ')}
                  </Typography>
                  <Chip size="sm" variant="soft" color="neutral" sx={{ fontWeight: 600 }}>
                    {Array.isArray(cond.value) ? cond.value.join(', ') : cond.value}
                  </Chip>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Divider />

        {/* Section B: Sequential Review Pipeline */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography level="title-sm" sx={{ fontWeight: 700, color: '#001741' }}>
              Sequential Approval Hierarchy
            </Typography>
            <Chip size="sm" variant="soft" color="primary" sx={{ fontWeight: 700 }}>
              {workflow.steps.length} {workflow.steps.length === 1 ? 'Tier' : 'Tiers'}
            </Chip>
          </Box>

          {/* Submitter Box */}
          <Box
            sx={{
              p: '10px 14px',
              borderRadius: '8px',
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                bgcolor: '#E2E8F0',
                display: 'grid',
                placeItems: 'center',
                color: '#475569',
              }}
            >
              <FiUser size={13} />
            </Box>
            <Box>
              <Typography level="body-xs" sx={{ fontWeight: 700, color: '#1E293B' }}>
                Submitter Initiates Request
              </Typography>
              <Typography level="body-xs" sx={{ color: '#64748B' }}>
                Instant routing to Step 1 upon submission
              </Typography>
            </Box>
          </Box>

          {/* Steps Sequence */}
          {workflow.steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.75 }}>
                <FiArrowDown size={16} color="#94A3B8" />
              </Box>

              <Box
                sx={{
                  p: '12px 14px',
                  borderRadius: '10px',
                  bgcolor: '#FFFFFF',
                  border: '1.5px solid #EDE9FE',
                  boxShadow: '0 1px 3px rgba(124, 58, 237, 0.06)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        bgcolor: '#7C3AED',
                        color: '#FFFFFF',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography level="body-sm" sx={{ fontWeight: 700, color: '#1E293B' }}>
                      {step.label}
                    </Typography>
                  </Box>
                  {step.slaHours && (
                    <Chip
                      size="sm"
                      variant="plain"
                      startDecorator={<FiClock size={11} />}
                      sx={{ fontSize: '11px', color: '#64748B' }}
                    >
                      {step.slaHours}h SLA
                    </Chip>
                  )}
                </Box>

                <Typography level="body-xs" sx={{ color: '#475569', ml: 3.75 }}>
                  Routing:{' '}
                  <strong>
                    {step.routingMethod === 'direct_manager' && 'Immediate Direct Line Manager'}
                    {step.routingMethod === 'skip_level_manager' && 'Skip-Level Manager (+2)'}
                    {step.routingMethod === 'department_head' && 'Department Head'}
                    {step.routingMethod === 'role_queue' && `Role Queue (${step.assigneeRole})`}
                    {step.routingMethod === 'specific_person' && `Named Individual (${step.assigneeName})`}
                    {step.routingMethod === 'auto_approve' && 'Zero-Touch Instant Auto-Approval'}
                  </strong>
                </Typography>

                {step.preventSelfApproval && (
                  <Typography level="body-xs" sx={{ color: '#7C3AED', fontWeight: 600, ml: 3.75, mt: 0.5 }}>
                    ✓ Prevent Self-Approval: Auto-escalates if submitter matches approver
                  </Typography>
                )}
              </Box>
            </React.Fragment>
          ))}

          {/* Approved Terminal */}
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.75 }}>
            <FiArrowDown size={16} color="#94A3B8" />
          </Box>
          <Box
            sx={{
              p: '10px 14px',
              borderRadius: '8px',
              bgcolor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            <FiCheckCircle size={18} color="#16A34A" />
            <Box>
              <Typography level="body-xs" sx={{ fontWeight: 700, color: '#166534' }}>
                Terminal Approval: Executed & Logged
              </Typography>
              <Typography level="body-xs" sx={{ color: '#15803D' }}>
                Request finalized; notification dispatched to employee
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Section C: Instant Employee Flow Simulator */}
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: '#FAF8FF',
            border: '1px solid #EDE9FE',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
            <FiZap size={16} color="#7C3AED" />
            <Typography level="title-sm" sx={{ fontWeight: 700, color: '#7C3AED' }}>
              Policy Resolution Sandbox
            </Typography>
          </Box>
          <Typography level="body-xs" sx={{ color: '#475569', mb: 1.5 }}>
            Test whether an employee’s submission resolves to this workflow.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 1.25 }}>
            <Select
              size="sm"
              value={simulatorEmployee}
              onChange={(_, val) => setSimulatorEmployee(val as string)}
              sx={{ flex: 1, borderRadius: '8px' }}
            >
              {MOCK_EMPLOYEES.map((emp) => (
                <Option key={emp.name} value={emp.name}>
                  {emp.name} ({emp.dept})
                </Option>
              ))}
            </Select>

            {workflow.module === 'expense' && (
              <Input
                size="sm"
                value={simulatorAmount}
                onChange={(e) => setSimulatorAmount(e.target.value)}
                placeholder="Amount $"
                sx={{ width: '110px', borderRadius: '8px' }}
              />
            )}

            <Button
              size="sm"
              variant="solid"
              startDecorator={<FiPlay size={12} />}
              onClick={handleRunSimulation}
              sx={{ bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6D28D9' }, borderRadius: '8px' }}
            >
              Test
            </Button>
          </Box>

          {simulationResult && (
            <Sheet
              variant="soft"
              color={simulationResult.matches ? 'success' : 'warning'}
              sx={{ p: 1.25, borderRadius: '8px', mt: 1 }}
            >
              <Typography level="body-xs" sx={{ fontWeight: 700 }}>
                {simulationResult.matches ? '✓ Match Confirmed' : '✕ Condition Not Met'}
              </Typography>
              <Typography level="body-xs" sx={{ mt: 0.25 }}>
                {simulationResult.reason}
              </Typography>
            </Sheet>
          )}
        </Box>
      </Box>

      {/* 4. Footer Stamp */}
      <Box
        sx={{
          p: '14px 24px',
          borderTop: '1px solid #E5E7EF',
          bgcolor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography level="body-xs" sx={{ color: '#64748B' }}>
          Last modified by <strong>{workflow.lastModifiedBy ?? 'Admin'}</strong> on {workflow.lastModifiedDate}
        </Typography>
        <Button size="sm" variant="plain" color="neutral" onClick={onClose} sx={{ borderRadius: '8px' }}>
          Close
        </Button>
      </Box>
    </Drawer>
  );
};
