import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Input,
  Textarea,
  Select,
  Option,
  Chip,
  IconButton,
  Sheet,
  Switch,
  Divider,
  Breadcrumbs,
  Link as JoyLink,
  Tooltip,
} from '@mui/joy';
import {
  FiArrowLeft,
  FiCheck,
  FiPlus,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiShield,
  FiUser,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiSparkles,
  FiInfo,
} from 'react-icons/fi';
import {
  ApprovalWorkflow,
  OperationalModule,
  PolicyType,
  RoutingMethod,
  ApprovalStep,
  ScopeCondition,
} from './types';

interface ApprovalFlowBuilderProps {
  initialWorkflow?: ApprovalWorkflow | null;
  onSave: (workflow: ApprovalWorkflow) => void;
  onCancel: () => void;
  onOpenSimulation?: () => void;
}

const MODULE_DISPLAY: Record<OperationalModule, { name: string; helper: string; submitter: string; outcome: string }> = {
  expense: {
    name: 'Expense',
    helper: 'Expense & travel reimbursement claims across departments.',
    submitter: 'Submitter Initiates Expense Claim',
    outcome: 'Marks the expense claim approved and records who reviewed it.',
  },
  leave: {
    name: 'Leave',
    helper: 'Employee paid time off, sick leaves, and statutory leaves.',
    submitter: 'Submitter Requests Time Off / Leave',
    outcome: 'Marks the leave request approved and updates balance records.',
  },
  attendance: {
    name: 'Attendance Correction',
    helper: 'Biometric time clock corrections and manual shift regularizations.',
    submitter: 'Submitter Submits Shift Clock Regularization',
    outcome: 'Marks attendance correction approved and syncs with payroll.',
  },
  position: {
    name: 'Position Approval',
    helper: 'Headcount opening, grade assignment, and vacancy authorizations.',
    submitter: 'Manager Requests New Position / Headcount',
    outcome: 'Authorizes job requisition and publishes vacancy to recruitment.',
  },
  preboarding: {
    name: 'Pre-boarding Approval',
    helper: 'Pre-hire document compliance, background checks, and offer sign-offs.',
    submitter: 'Candidate Submits Onboarding Documents',
    outcome: 'Clears candidate for day-one reporting and system provisioning.',
  },
  notice_period: {
    name: 'Notice Period Approval',
    helper: 'Auto-configured approval flow for planned departures and notice periods.',
    submitter: 'Submitter Initiates Planned Departure / Resignation',
    outcome: 'Confirms notice timeline and initiates departure clearance.',
  },
  appraisal: {
    name: 'Appraisal Sign-off',
    helper: 'Annual performance appraisals, bonus ratings, and grade calibrations.',
    submitter: 'Manager Submits Performance Appraisal Score',
    outcome: 'Finalizes employee rating and updates compensation matrix.',
  },
};

export const ApprovalFlowBuilder: React.FC<ApprovalFlowBuilderProps> = ({
  initialWorkflow,
  onSave,
  onCancel,
  onOpenSimulation,
}) => {
  const isEditing = Boolean(initialWorkflow);

  // Form states
  const [module, setModule] = useState<OperationalModule>(initialWorkflow?.module ?? 'expense');
  const [name, setName] = useState<string>(initialWorkflow?.name ?? '');
  const [description, setDescription] = useState<string>(initialWorkflow?.description ?? '');
  const [isDefault, setIsDefault] = useState<boolean>(initialWorkflow?.policyType === 'default');
  const [isActive, setIsActive] = useState<boolean>(initialWorkflow?.status !== 'draft');

  // Governance Fallback
  const [onVacantApprover, setOnVacantApprover] = useState<'skip_to_next' | 'route_to_hr' | 'escalate_to_skip'>(
    initialWorkflow?.fallbackPolicy?.onVacantApprover ?? 'skip_to_next'
  );
  const [preventSelfApproval, setPreventSelfApproval] = useState<boolean>(true);
  const [allowDelegation, setAllowDelegation] = useState<boolean>(
    initialWorkflow?.fallbackPolicy?.allowDelegation ?? true
  );

  // Steps
  const [steps, setSteps] = useState<ApprovalStep[]>(
    initialWorkflow?.steps ?? [
      {
        id: 'step_1',
        order: 1,
        label: 'Direct Manager Approval',
        routingMethod: 'direct_manager',
        hierarchyDepth: 1,
        slaHours: 48,
        preventSelfApproval: true,
        required: true,
      },
    ]
  );

  // Validation
  const hasNameError = name.trim().length === 0;
  const hasStepError = steps.length === 0;
  const canPublish = !hasNameError && !hasStepError;

  // Step Operations
  const handleAddStep = () => {
    const newOrder = steps.length + 1;
    const newStep: ApprovalStep = {
      id: `step_${Date.now()}`,
      order: newOrder,
      label: `Level ${newOrder} Review`,
      routingMethod: 'role_queue',
      assigneeRole: 'Finance Controller',
      slaHours: 48,
      preventSelfApproval: true,
      required: true,
    };
    setSteps((prev) => [...prev, newStep]);
  };

  const handleUpdateStep = (id: string, updates: Partial<ApprovalStep>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleDeleteStep = (id: string) => {
    if (steps.length <= 1) return;
    setSteps((prev) =>
      prev
        .filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, order: idx + 1 }))
    );
  };

  const handleMoveStep = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;

    const newSteps = [...steps];
    const [moved] = newSteps.splice(idx, 1);
    newSteps.splice(targetIdx, 0, moved);
    setSteps(newSteps.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const handleApplyAiPreset = () => {
    if (module === 'notice_period') {
      setName('Notice Period Default Flow');
      setDescription('Auto-configured approval flow for planned departures and notice periods.');
      setIsDefault(true);
      setSteps([
        {
          id: 's_1',
          order: 1,
          label: 'Direct Manager Approval',
          routingMethod: 'direct_manager',
          hierarchyDepth: 1,
          slaHours: 48,
          required: true,
        },
      ]);
    } else {
      setName('Standard Expense Authorization');
      setDescription('Automated policy routing for travel and departmental claims.');
      setIsDefault(true);
      setSteps([
        {
          id: 's_1',
          order: 1,
          label: 'Direct Manager Approval',
          routingMethod: 'direct_manager',
          hierarchyDepth: 1,
          slaHours: 48,
          required: true,
        },
        {
          id: 's_2',
          order: 2,
          label: 'Finance Controller Sign-off',
          routingMethod: 'role_queue',
          assigneeRole: 'Finance Controller',
          slaHours: 48,
          required: true,
        },
      ]);
    }
  };

  const handlePublish = () => {
    if (!canPublish) return;

    const workflowToSave: ApprovalWorkflow = {
      id: initialWorkflow?.id ?? `wf_${module}_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      module,
      policyType: isDefault ? 'default' : 'scoped',
      status: isActive ? 'active' : 'draft',
      version: initialWorkflow ? (parseFloat(initialWorkflow.version) + 0.1).toFixed(1) : '1.0',
      conditions: isDefault ? [] : initialWorkflow?.conditions ?? [],
      steps,
      fallbackPolicy: {
        onVacantApprover,
        allowDelegation,
        disallowSelfApproval: preventSelfApproval,
      },
      inFlightCount: initialWorkflow?.inFlightCount ?? 0,
      lastModifiedBy: 'Chanchal Sharma',
      lastModifiedDate: 'Just now',
    };

    onSave(workflowToSave);
  };

  const activeModuleInfo = MODULE_DISPLAY[module] || MODULE_DISPLAY.expense;

  return (
    <Box sx={{ width: '100%', minHeight: '100%', bgcolor: '#F8FAFC', pb: 12 }}>
      {/* 1. Header Bar */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EF',
          px: { xs: 2, md: 4 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            size="sm"
            variant="plain"
            color="neutral"
            startDecorator={<FiArrowLeft size={16} />}
            onClick={onCancel}
            sx={{ fontWeight: 600, color: '#475569', borderRadius: '8px' }}
          >
            Back to Workflows
          </Button>

          <Divider orientation="vertical" sx={{ height: '24px' }} />

          <Box>
            <Breadcrumbs size="sm" sx={{ p: 0, mb: 0.25 }}>
              <JoyLink color="neutral" sx={{ fontSize: '11.5px', color: '#64748B' }}>
                Property Settings
              </JoyLink>
              <JoyLink color="neutral" sx={{ fontSize: '11.5px', color: '#64748B' }}>
                Approval Flows
              </JoyLink>
              <Typography level="body-xs" sx={{ fontWeight: 600, color: '#7C3AED' }}>
                {isEditing ? 'Edit Workflow' : 'Create Workflow'}
              </Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography level="title-lg" sx={{ fontWeight: 700, color: '#001741', lineHeight: 1.2 }}>
                {isEditing ? `Edit Approval Workflow: ${initialWorkflow?.name}` : 'Create Approval Workflow'}
              </Typography>
              <Chip
                size="sm"
                variant="soft"
                color={isActive ? 'success' : 'neutral'}
                startDecorator={<FiCheck size={12} />}
                sx={{ fontWeight: 700, fontSize: '11px' }}
              >
                {isActive ? 'Active in Force' : 'Draft'}
              </Chip>
            </Box>
          </Box>
        </Box>

        {/* Top Right Action Cluster */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {onOpenSimulation && (
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={onOpenSimulation}
              sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}
            >
              Test Simulation
            </Button>
          )}

          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={onCancel}
            sx={{ borderRadius: '8px', fontWeight: 600 }}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            variant="solid"
            startDecorator={<FiCheck size={14} />}
            onClick={handlePublish}
            disabled={!canPublish}
            sx={{
              bgcolor: '#7C3AED',
              '&:hover': { bgcolor: '#6D28D9' },
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              px: 2.25,
            }}
          >
            Deploy Workflow
          </Button>
        </Box>
      </Box>

      {/* 2-Column Responsive Layout (Matches User Screenshot) */}
      <Box sx={{ maxWidth: '1400px', mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          {/* ================= LEFT RAIL ================= */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Card 1: Workflow Identity & Scope */}
            <Sheet
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: '14px',
                borderColor: '#E2E8F0',
                bgcolor: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: '#F5F3FF',
                    color: '#7C3AED',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <FiShield size={16} />
                </Box>
                <Typography level="title-sm" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  Workflow Identity & Scope
                </Typography>
              </Box>

              {/* Target Operational Area */}
              <Box sx={{ mb: 2 }}>
                <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
                  Target Operational Area <span style={{ color: '#DC2626' }}>*</span>
                </Typography>
                <Select
                  size="sm"
                  value={module}
                  onChange={(_, val) => val && setModule(val as OperationalModule)}
                  sx={{ borderRadius: '8px' }}
                >
                  <Option value="expense">Expense</Option>
                  <Option value="leave">Leave</Option>
                  <Option value="attendance">Attendance Correction</Option>
                  <Option value="position">Position Approval</Option>
                  <Option value="preboarding">Pre-boarding Approval</Option>
                  <Option value="notice_period">Notice Period Approval</Option>
                  <Option value="appraisal">Appraisal Sign-off</Option>
                </Select>
                <Typography level="body-xs" sx={{ color: '#64748B', mt: 0.5, fontSize: '12px' }}>
                  {activeModuleInfo.helper}
                </Typography>
              </Box>

              {/* Workflow Name */}
              <Box sx={{ mb: 2 }}>
                <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
                  Workflow Name <span style={{ color: '#DC2626' }}>*</span>
                </Typography>
                <Input
                  size="sm"
                  placeholder="e.g. Standard Expense Authorization"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={hasNameError}
                  sx={{ borderRadius: '8px' }}
                />
                <Typography level="body-xs" sx={{ color: '#64748B', mt: 0.5, fontSize: '12px' }}>
                  A clear descriptive title recognizable across the property.
                </Typography>
              </Box>

              {/* Description */}
              <Box sx={{ mb: 2 }}>
                <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
                  Description (Optional)
                </Typography>
                <Textarea
                  minRows={2}
                  maxRows={3}
                  placeholder="Optional policy scope or conditions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{ borderRadius: '8px', fontSize: '13px' }}
                />
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Setting 1: Default toggle */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
                <Box>
                  <Typography level="body-sm" sx={{ fontWeight: 600, color: '#0F172A' }}>
                    Default for {activeModuleInfo.name}
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#64748B' }}>
                    Auto-selected for new requests
                  </Typography>
                </Box>
                <Switch
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  color="primary"
                />
              </Box>

              {/* Setting 2: Active in force */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
                <Box>
                  <Typography level="body-sm" sx={{ fontWeight: 600, color: '#0F172A' }}>
                    Active in Force
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#64748B' }}>
                    Currently gating live submissions
                  </Typography>
                </Box>
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="success"
                />
              </Box>
            </Sheet>

            {/* Card 2: Governance & Fallback Policy */}
            <Sheet
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: '14px',
                borderColor: '#E2E8F0',
                bgcolor: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <FiShield size={16} />
                </Box>
                <Typography level="title-sm" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  Governance & Fallback Policy
                </Typography>
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
                  If Approver is Absent / Vacant:
                </Typography>
                <Select
                  size="sm"
                  value={onVacantApprover}
                  onChange={(_, val) => val && setOnVacantApprover(val as any)}
                  sx={{ borderRadius: '8px' }}
                >
                  <Option value="skip_to_next">Skip to next approval tier</Option>
                  <Option value="route_to_hr">Route to HR Operations queue</Option>
                  <Option value="escalate_to_skip">Escalate to submitter's skip-level</Option>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
                <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155' }}>
                  Prevent Self-Approval
                </Typography>
                <Switch
                  size="sm"
                  checked={preventSelfApproval}
                  onChange={(e) => setPreventSelfApproval(e.target.checked)}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
                <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155' }}>
                  Allow Temporary Delegation
                </Typography>
                <Switch
                  size="sm"
                  checked={allowDelegation}
                  onChange={(e) => setAllowDelegation(e.target.checked)}
                />
              </Box>
            </Sheet>
          </Box>

          {/* ================= RIGHT RAIL ================= */}
          <Sheet
            variant="outlined"
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: '14px',
              borderColor: '#E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1.5,
                pb: 2,
                borderBottom: '1px solid #F1F5F9',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: '#F5F3FF',
                    color: '#7C3AED',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <FiUsers size={16} />
                </Box>
                <Box>
                  <Typography level="title-md" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    Sequential Approval Hierarchy
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#64748B' }}>
                    Each level signs off in order.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  size="sm"
                  variant="outlined"
                  color="primary"
                  startDecorator={<FiSparkles size={14} />}
                  onClick={handleApplyAiPreset}
                  sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '12px' }}
                >
                  AI Drafter
                </Button>
                <Chip size="sm" variant="soft" color="primary" sx={{ fontWeight: 700 }}>
                  {steps.length} {steps.length === 1 ? 'Level' : 'Levels'}
                </Chip>
              </Box>
            </Box>

            {/* Step 0: Submitter Initiates Card */}
            <Sheet
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: '10px',
                borderColor: '#E2E8F0',
                bgcolor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#EFF6FF',
                  color: '#2563EB',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <FiUser size={16} />
              </Box>
              <Box>
                <Typography level="body-sm" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {activeModuleInfo.submitter}
                </Typography>
                <Typography level="body-xs" sx={{ color: '#64748B' }}>
                  The request is sent to Level 1 as soon as it is submitted.
                </Typography>
              </Box>
            </Sheet>

            {/* Sequential Steps */}
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                {/* Arrow Connector */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '24px',
                    position: 'relative',
                  }}
                >
                  <Typography level="body-xs" sx={{ color: '#94A3B8', fontWeight: 700 }}>
                    ↓
                  </Typography>
                </Box>

                {/* Step Card */}
                <Sheet
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    bgcolor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    '&:hover': { borderColor: '#CBD5E1' },
                  }}
                >
                  {/* Step Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: '#7C3AED',
                          color: '#FFFFFF',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        {step.order}
                      </Box>
                      <Typography level="title-sm" sx={{ fontWeight: 700, color: '#0F172A' }}>
                        Level {step.order} Review
                      </Typography>
                      <Chip size="sm" variant="soft" color="success" sx={{ fontSize: '11px', fontWeight: 600 }}>
                        🌿 {step.routingMethod === 'direct_manager' ? 'Reporting Line' : step.routingMethod === 'role_queue' ? 'Shared Role Queue' : 'Named Individual'}
                      </Chip>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        size="sm"
                        variant="plain"
                        disabled={idx === 0}
                        onClick={() => handleMoveStep(idx, 'up')}
                      >
                        <FiArrowUp size={14} />
                      </IconButton>
                      <IconButton
                        size="sm"
                        variant="plain"
                        disabled={idx === steps.length - 1}
                        onClick={() => handleMoveStep(idx, 'down')}
                      >
                        <FiArrowDown size={14} />
                      </IconButton>
                      {steps.length > 1 && (
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="danger"
                          onClick={() => handleDeleteStep(step.id)}
                        >
                          <FiTrash2 size={14} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>

                  {/* Step Label */}
                  <Box>
                    <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
                      Step Label <span style={{ color: '#DC2626' }}>*</span>
                    </Typography>
                    <Input
                      size="sm"
                      value={step.label}
                      onChange={(e) => handleUpdateStep(step.id, { label: e.target.value })}
                      sx={{ borderRadius: '8px' }}
                    />
                  </Box>

                  {/* Approver Routing Method (3 Visual Selector Cards) */}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155' }}>
                        Approver Routing Method
                      </Typography>
                      <Button size="sm" variant="plain" sx={{ fontSize: '11.5px', color: '#7C3AED', p: 0 }}>
                        Explore Org Chart
                      </Button>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
                      {/* Option 1: Direct Manager */}
                      <Sheet
                        variant="outlined"
                        onClick={() => handleUpdateStep(step.id, { routingMethod: 'direct_manager' })}
                        sx={{
                          p: 1.5,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          borderColor: step.routingMethod === 'direct_manager' ? '#7C3AED' : '#E2E8F0',
                          bgcolor: step.routingMethod === 'direct_manager' ? '#FAF8FF' : '#FFFFFF',
                          borderWidth: step.routingMethod === 'direct_manager' ? '2px' : '1px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            bgcolor: step.routingMethod === 'direct_manager' ? '#7C3AED' : '#F1F5F9',
                            color: step.routingMethod === 'direct_manager' ? '#FFFFFF' : '#64748B',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FiUsers size={16} />
                        </Box>
                        <Box>
                          <Typography level="body-xs" sx={{ fontWeight: 700, color: '#0F172A' }}>
                            Direct Manager
                          </Typography>
                          <Typography level="body-xs" sx={{ color: '#64748B', fontSize: '11px' }}>
                            Org Hierarchy
                          </Typography>
                        </Box>
                      </Sheet>

                      {/* Option 2: Designation Role */}
                      <Sheet
                        variant="outlined"
                        onClick={() => handleUpdateStep(step.id, { routingMethod: 'role_queue' })}
                        sx={{
                          p: 1.5,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          borderColor: step.routingMethod === 'role_queue' ? '#7C3AED' : '#E2E8F0',
                          bgcolor: step.routingMethod === 'role_queue' ? '#FAF8FF' : '#FFFFFF',
                          borderWidth: step.routingMethod === 'role_queue' ? '2px' : '1px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            bgcolor: step.routingMethod === 'role_queue' ? '#7C3AED' : '#F1F5F9',
                            color: step.routingMethod === 'role_queue' ? '#FFFFFF' : '#64748B',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FiShield size={16} />
                        </Box>
                        <Box>
                          <Typography level="body-xs" sx={{ fontWeight: 700, color: '#0F172A' }}>
                            Designation Role
                          </Typography>
                          <Typography level="body-xs" sx={{ color: '#64748B', fontSize: '11px' }}>
                            Shared Role Queue
                          </Typography>
                        </Box>
                      </Sheet>

                      {/* Option 3: Specific Person */}
                      <Sheet
                        variant="outlined"
                        onClick={() => handleUpdateStep(step.id, { routingMethod: 'specific_person' })}
                        sx={{
                          p: 1.5,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          borderColor: step.routingMethod === 'specific_person' ? '#7C3AED' : '#E2E8F0',
                          bgcolor: step.routingMethod === 'specific_person' ? '#FAF8FF' : '#FFFFFF',
                          borderWidth: step.routingMethod === 'specific_person' ? '2px' : '1px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            bgcolor: step.routingMethod === 'specific_person' ? '#7C3AED' : '#F1F5F9',
                            color: step.routingMethod === 'specific_person' ? '#FFFFFF' : '#64748B',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FiUser size={16} />
                        </Box>
                        <Box>
                          <Typography level="body-xs" sx={{ fontWeight: 700, color: '#0F172A' }}>
                            Specific Person
                          </Typography>
                          <Typography level="body-xs" sx={{ color: '#64748B', fontSize: '11px' }}>
                            Named Individual
                          </Typography>
                        </Box>
                      </Sheet>
                    </Box>

                    <Typography level="body-xs" sx={{ color: '#047857', mt: 1, fontSize: '12px' }}>
                      ⚡ Goes to the submitter's manager, or the next active manager above them.
                    </Typography>
                  </Box>

                  {/* Required Level Toggle */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #F1F5F9' }}>
                    <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155' }}>
                      Required level
                    </Typography>
                    <Switch
                      checked={step.required !== false}
                      onChange={(e) => handleUpdateStep(step.id, { required: e.target.checked })}
                      color="primary"
                    />
                  </Box>
                </Sheet>
              </React.Fragment>
            ))}

            {/* Add Approval Level Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '24px' }}>
              <Typography level="body-xs" sx={{ color: '#94A3B8', fontWeight: 700 }}>
                ↓
              </Typography>
            </Box>

            <Button
              variant="dashed"
              color="primary"
              startDecorator={<FiPlus size={16} />}
              onClick={handleAddStep}
              sx={{
                width: '100%',
                py: 1.5,
                borderRadius: '10px',
                borderColor: '#C4B5FD',
                bgcolor: '#FAF8FF',
                color: '#7C3AED',
                fontWeight: 700,
                fontSize: '13.5px',
                '&:hover': { bgcolor: '#F5F3FF', borderColor: '#7C3AED' },
              }}
            >
              + Add Approval Level {steps.length + 1}
            </Button>

            {/* Terminal Outcome Cards */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '24px' }}>
              <Typography level="body-xs" sx={{ color: '#94A3B8', fontWeight: 700 }}>
                ↓
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Final Approval */}
              <Sheet
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: '10px',
                  borderColor: '#86EFAC',
                  bgcolor: '#F0FDF4',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: '#16A34A',
                    color: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FiCheck size={16} />
                </Box>
                <Box>
                  <Typography level="body-sm" sx={{ fontWeight: 700, color: '#166534' }}>
                    Final Approval
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#15803D' }}>
                    {activeModuleInfo.outcome}
                  </Typography>
                </Box>
              </Sheet>

              {/* On Rejection */}
              <Sheet
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: '10px',
                  borderColor: '#FDE68A',
                  bgcolor: '#FFFBEB',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: '#D97706',
                    color: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FiAlertCircle size={16} />
                </Box>
                <Box>
                  <Typography level="body-sm" sx={{ fontWeight: 700, color: '#92400E' }}>
                    On rejection:
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#B45309' }}>
                    Marks the request rejected and records reviewer's feedback.
                  </Typography>
                </Box>
              </Sheet>
            </Box>
          </Sheet>
        </Box>
      </Box>
    </Box>
  );
};
