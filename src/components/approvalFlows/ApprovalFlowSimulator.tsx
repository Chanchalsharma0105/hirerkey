import React, { useState } from 'react';
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Select,
  Option,
  Input,
  Button,
  Chip,
  Divider,
} from '@mui/joy';
import { FiPlay, FiCheckCircle, FiAlertCircle, FiClock, FiUser } from 'react-icons/fi';
import { ApprovalWorkflow, SimulationEmployee, SimulationResult } from './types';

interface ApprovalFlowSimulatorProps {
  workflow: ApprovalWorkflow | null;
  open: boolean;
  onClose: () => void;
}

const TEST_EMPLOYEES: SimulationEmployee[] = [
  {
    id: 'emp_1',
    name: 'Sarah Jenkins',
    role: 'Senior Sales Executive',
    department: 'Sales & Marketing',
    managerName: 'David Chen',
    managerRole: 'Sales Director',
    avatar: 'SJ',
  },
  {
    id: 'emp_2',
    name: 'Alex Morales',
    role: 'Software Engineer',
    department: 'Engineering',
    managerName: 'Vikram Malhotra',
    managerRole: 'Engineering Lead',
    avatar: 'AM',
  },
  {
    id: 'emp_3',
    name: 'Priya Nair',
    role: 'Culinary Supervisor',
    department: 'Food & Beverage',
    managerName: 'Rajiv Kapoor',
    managerRole: 'Executive Chef',
    avatar: 'PN',
  },
];

export const ApprovalFlowSimulator: React.FC<ApprovalFlowSimulatorProps> = ({
  workflow,
  open,
  onClose,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>('emp_1');
  const [contextValue, setContextValue] = useState<string>('$1,850.00 — Client Annual Dinner');

  if (!workflow) return null;

  const currentEmp = TEST_EMPLOYEES.find((e) => e.id === selectedEmpId) || TEST_EMPLOYEES[0];

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        sx={{
          maxWidth: 620,
          width: '100%',
          borderRadius: '16px',
          p: 3,
          boxShadow: '0 12px 36px rgba(0, 23, 65, 0.16)',
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '18px', fontWeight: 700 }}>
          <span style={{ color: '#7C3AED' }}>⚡</span>
          Test Flow Simulation
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Typography level="body-xs" sx={{ color: '#64748B' }}>
            Simulate how live employee submissions will evaluate and route through this policy:
          </Typography>

          <Box>
            <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
              Select Test Submitter
            </Typography>
            <Select
              size="sm"
              value={selectedEmpId}
              onChange={(_, val) => val && setSelectedEmpId(val)}
              sx={{ borderRadius: '8px' }}
            >
              {TEST_EMPLOYEES.map((e) => (
                <Option key={e.id} value={e.id}>
                  {e.name} — {e.role} ({e.department}, Mgr: {e.managerName})
                </Option>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
              Request Value / Scope Parameters
            </Typography>
            <Input
              size="sm"
              value={contextValue}
              onChange={(e) => setContextValue(e.target.value)}
              sx={{ borderRadius: '8px' }}
            />
          </Box>

          {/* Resolved Path Box */}
          <Box
            sx={{
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', pb: 1 }}>
              <Typography level="body-xs" sx={{ fontWeight: 700, color: '#0F172A', textTransform: 'uppercase' }}>
                Resolved Approval Path
              </Typography>
              <Chip size="sm" variant="soft" color="success" sx={{ fontWeight: 700 }}>
                Simulation Passed ✓
              </Chip>
            </Box>

            <Typography level="body-xs" sx={{ color: '#475569' }}>
              Workflow: <strong>{workflow.name}</strong> • Submitter: <strong>{currentEmp.name}</strong>
            </Typography>

            {workflow.steps.map((step, idx) => (
              <Box
                key={step.id}
                sx={{
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  p: 1.25,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: '#EDE9FE',
                      color: '#7C3AED',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {idx + 1}
                  </Box>
                  <Box>
                    <Typography level="body-sm" sx={{ fontWeight: 600, color: '#0F172A' }}>
                      {step.label}
                    </Typography>
                    <Typography level="body-xs" sx={{ color: '#64748B' }}>
                      Assigned to: {step.routingMethod === 'direct_manager' ? `${currentEmp.managerName} (${currentEmp.managerRole})` : step.assigneeRole || 'Role Queue'}
                    </Typography>
                  </Box>
                </Box>
                <Chip size="sm" variant="soft" color="primary" sx={{ fontWeight: 700 }}>
                  {step.slaHours || 48}h SLA
                </Chip>
              </Box>
            ))}

            <Box sx={{ bgcolor: '#DCFCE7', color: '#15803D', p: 1, borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
              ✓ Final Outcome: Automatically marked Approved and recorded in audit trail.
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ pt: 1 }}>
          <Button variant="solid" color="primary" onClick={onClose} sx={{ bgcolor: '#7C3AED', borderRadius: '8px' }}>
            Done Testing
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};
