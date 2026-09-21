import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Input,
  Chip,
  IconButton,
  Sheet,
  Switch,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
} from '@mui/joy';
import {
  FiSearch,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiMoreVertical,
  FiEdit2,
  FiCopy,
  FiTrash2,
  FiCheckCircle,
  FiLayers,
  FiUser,
  FiUsers,
  FiArrowRight,
  FiBriefcase,
  FiGrid,
  FiList,
  FiSparkles,
  FiPlay,
} from 'react-icons/fi';
import { ApprovalWorkflow, OperationalModule, WorkflowStatus } from './types';
import { INITIAL_APPROVAL_WORKFLOWS } from './mockData';
import { ApprovalFlowDrawer } from './ApprovalFlowDrawer';

interface ApprovalFlowsListProps {
  onNavigateToCreate: () => void;
  onNavigateToEdit: (workflow: ApprovalWorkflow) => void;
  onOpenSimulation?: (workflow: ApprovalWorkflow) => void;
}

const MODULE_DISPLAY_NAMES: Record<OperationalModule, { label: string; icon: string; color: string; bg: string }> = {
  expense: { label: 'Expense', icon: '💳', color: '#047857', bg: '#ECFDF5' },
  leave: { label: 'Leave', icon: '📅', color: '#0369A1', bg: '#F0F9FF' },
  attendance: { label: 'Attendance Correction', icon: '⏱️', color: '#B45309', bg: '#FFFBEB' },
  position: { label: 'Position Approval', icon: '💼', color: '#6D28D9', bg: '#F5F3FF' },
  preboarding: { label: 'Pre-boarding Approval', icon: '📋', color: '#1D4ED8', bg: '#EFF6FF' },
  notice_period: { label: 'Notice Period Approval', icon: '🚪', color: '#BE123C', bg: '#FFF1F2' },
  appraisal: { label: 'Appraisal Sign-off', icon: '⭐', color: '#A16207', bg: '#FEFCE8' },
};

export const ApprovalFlowsList: React.FC<ApprovalFlowsListProps> = ({
  onNavigateToCreate,
  onNavigateToEdit,
  onOpenSimulation,
}) => {
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>(INITIAL_APPROVAL_WORKFLOWS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedWorkflowForDrawer, setSelectedWorkflowForDrawer] = useState<ApprovalWorkflow | null>(null);

  // Filtered workflows
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((w) => {
      if (statusFilter !== 'all' && w.status !== statusFilter) return false;
      if (selectedModule !== 'all' && w.module !== selectedModule) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = w.name.toLowerCase().includes(q);
        const matchesDesc = w.description?.toLowerCase().includes(q) ?? false;
        const matchesModule = w.module.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesModule) return false;
      }
      return true;
    });
  }, [workflows, statusFilter, selectedModule, searchQuery]);

  // Counts
  const totalCount = workflows.length;
  const activeCount = workflows.filter((w) => w.status === 'active').length;

  const handleToggleStatus = (wf: ApprovalWorkflow, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === wf.id ? { ...w, status: w.status === 'active' ? 'draft' : 'active' } : w
      )
    );
  };

  const handleClone = (wf: ApprovalWorkflow, e: React.MouseEvent) => {
    e.stopPropagation();
    const cloned: ApprovalWorkflow = {
      ...wf,
      id: `wf_${wf.module}_clone_${Date.now()}`,
      name: `${wf.name} (Copy)`,
      policyType: 'scoped',
      status: 'draft',
      version: '1.0',
      inFlightCount: 0,
      lastModifiedDate: 'Just now',
    };
    setWorkflows((prev) => [cloned, ...prev]);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100%', bgcolor: '#F8FAFC', pb: 8 }}>
      {/* 1. Property Settings Subheader Tabstrip */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EF',
          px: { xs: 2, md: 4 },
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '13px', color: '#64748B' }}>
            <span>Home</span>
            <span>›</span>
            <span>Property Settings</span>
            <span>›</span>
            <Typography sx={{ color: '#7C3AED', fontWeight: 600, fontSize: '13px' }}>
              Approval Flows
            </Typography>
          </Box>
          <Chip size="sm" variant="soft" sx={{ bgcolor: '#EDE9FE', color: '#7C3AED', fontWeight: 700 }}>
            9 Menus
          </Chip>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', py: 0.5 }}>
          <Button size="sm" variant="plain" sx={{ color: '#475569', fontWeight: 500 }}>Departments</Button>
          <Button size="sm" variant="plain" sx={{ color: '#475569', fontWeight: 500 }}>Grades</Button>
          <Button size="sm" variant="plain" sx={{ color: '#475569', fontWeight: 500 }}>Designations</Button>
          <Button
            size="sm"
            variant="solid"
            startDecorator={<FiBriefcase size={14} />}
            sx={{
              bgcolor: '#7C3AED',
              color: '#FFFFFF',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
              borderRadius: '8px',
              '&:hover': { bgcolor: '#6D28D9' },
            }}
          >
            Approval Flows
          </Button>
          <Button size="sm" variant="plain" sx={{ color: '#475569', fontWeight: 500 }}>Business Card Configurator</Button>
          <Button size="sm" variant="plain" sx={{ color: '#475569', fontWeight: 500 }}>Appraisals</Button>
        </Box>
      </Box>

      {/* Main Container */}
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1440px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        
        {/* Section Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography level="h3" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '22px' }}>
              Approval Workflows
            </Typography>
            <Typography level="body-sm" sx={{ color: '#64748B' }}>
              Configure multi-tier hierarchies, manager delegation rules, and automated sign-offs.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              size="sm"
              variant="outlined"
              color="primary"
              startDecorator={<FiSparkles size={14} />}
              onClick={onNavigateToCreate}
              sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px', bgcolor: '#FAF8FF' }}
            >
              AI Workflow Assistant
            </Button>

            <Button
              size="sm"
              variant="solid"
              startDecorator={<FiPlus size={16} />}
              onClick={onNavigateToCreate}
              sx={{
                bgcolor: '#7C3AED',
                '&:hover': { bgcolor: '#6D28D9' },
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
                px: 2,
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
              }}
            >
              Create Workflow
            </Button>
          </Box>
        </Box>

        {/* Sleek Governance Summary Strip (Space-efficient, zero clutter) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 1.5,
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              p: 1.25,
              px: 2,
              borderRadius: '10px',
              bgcolor: '#FFFFFF',
              borderColor: '#E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: '#F5F3FF',
                  color: '#7C3AED',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                ⚡
              </Box>
              <Box>
                <Typography level="body-xs" sx={{ fontWeight: 500, color: '#64748B' }}>
                  Total Workflows
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>
                  {totalCount} Configured
                </Typography>
              </Box>
            </Box>
            <Chip size="sm" variant="soft" color="primary" sx={{ fontWeight: 600 }}>
              7 Modules
            </Chip>
          </Sheet>

          <Sheet
            variant="outlined"
            sx={{
              p: 1.25,
              px: 2,
              borderRadius: '10px',
              bgcolor: '#FFFFFF',
              borderColor: '#E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: '#DCFCE7',
                  color: '#16A34A',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                ✓
              </Box>
              <Box>
                <Typography level="body-xs" sx={{ fontWeight: 500, color: '#64748B' }}>
                  Active in Force
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>
                  {activeCount} Live
                </Typography>
              </Box>
            </Box>
            <Chip size="sm" variant="soft" color="success" sx={{ fontWeight: 600 }}>
              93% Enforced
            </Chip>
          </Sheet>

          <Sheet
            variant="outlined"
            sx={{
              p: 1.25,
              px: 2,
              borderRadius: '10px',
              bgcolor: '#FFFFFF',
              borderColor: '#E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: '#EFF6FF',
                  color: '#2563EB',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '14px',
                }}
              >
                🛡️
              </Box>
              <Box>
                <Typography level="body-xs" sx={{ fontWeight: 500, color: '#64748B' }}>
                  Core Coverage
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>
                  5 / 7 Covered
                </Typography>
              </Box>
            </Box>
            <Chip size="sm" variant="soft" color="neutral" sx={{ fontWeight: 600 }}>
              2 Pending
            </Chip>
          </Sheet>

          <Sheet
            variant="outlined"
            sx={{
              p: 1.25,
              px: 2,
              borderRadius: '10px',
              bgcolor: '#FFFFFF',
              borderColor: '#E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: '#FEF3C7',
                  color: '#D97706',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '14px',
                }}
              >
                ⏱️
              </Box>
              <Box>
                <Typography level="body-xs" sx={{ fontWeight: 500, color: '#64748B' }}>
                  Average SLA
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>
                  36 Hours
                </Typography>
              </Box>
            </Box>
            <Chip size="sm" variant="soft" color="warning" sx={{ fontWeight: 600 }}>
              Fast Track
            </Chip>
          </Sheet>
        </Box>

        {/* Module Filter Pills */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', py: 0.5 }}>
          <Button
            size="sm"
            variant={selectedModule === 'all' ? 'solid' : 'outlined'}
            color={selectedModule === 'all' ? 'primary' : 'neutral'}
            onClick={() => setSelectedModule('all')}
            sx={{
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 600,
              bgcolor: selectedModule === 'all' ? '#7C3AED' : '#FFFFFF',
            }}
          >
            All Modules ({workflows.length})
          </Button>

          {Object.entries(MODULE_DISPLAY_NAMES).map(([key, meta]) => {
            const count = workflows.filter((w) => w.module === key).length;
            const isSelected = selectedModule === key;
            return (
              <Button
                key={key}
                size="sm"
                variant={isSelected ? 'solid' : 'outlined'}
                color={isSelected ? 'primary' : 'neutral'}
                onClick={() => setSelectedModule(key)}
                startDecorator={<span style={{ fontSize: '13px' }}>{meta.icon}</span>}
                sx={{
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  bgcolor: isSelected ? '#7C3AED' : '#FFFFFF',
                  whiteSpace: 'nowrap',
                }}
              >
                {meta.label} ({count})
              </Button>
            );
          })}
        </Box>

        {/* Operational Filter & Search Toolbar */}
        <Sheet
          variant="outlined"
          sx={{
            p: 1.5,
            borderRadius: '12px',
            bgcolor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Input
            size="sm"
            placeholder="Search workflows, modules, reviewers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startDecorator={<FiSearch size={15} color="#64748B" />}
            sx={{ width: { xs: '100%', sm: 320 }, borderRadius: '8px' }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', bgcolor: '#F1F5F9', p: 0.5, borderRadius: '8px', gap: 0.5 }}>
              <Button
                size="sm"
                variant={statusFilter === 'all' ? 'solid' : 'plain'}
                onClick={() => setStatusFilter('all')}
                sx={{ borderRadius: '6px', fontSize: '12px', py: 0.5, bgcolor: statusFilter === 'all' ? '#FFFFFF' : 'transparent', color: statusFilter === 'all' ? '#7C3AED' : '#64748B' }}
              >
                All ({workflows.length})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === 'active' ? 'solid' : 'plain'}
                onClick={() => setStatusFilter('active')}
                sx={{ borderRadius: '6px', fontSize: '12px', py: 0.5, bgcolor: statusFilter === 'active' ? '#FFFFFF' : 'transparent', color: statusFilter === 'active' ? '#7C3AED' : '#64748B' }}
              >
                Active ({activeCount})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === 'draft' ? 'solid' : 'plain'}
                onClick={() => setStatusFilter('draft')}
                sx={{ borderRadius: '6px', fontSize: '12px', py: 0.5, bgcolor: statusFilter === 'draft' ? '#FFFFFF' : 'transparent', color: statusFilter === 'draft' ? '#7C3AED' : '#64748B' }}
              >
                Draft ({workflows.length - activeCount})
              </Button>
            </Box>

            <Box sx={{ display: 'flex', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
              <IconButton
                size="sm"
                variant={viewMode === 'grid' ? 'solid' : 'plain'}
                color={viewMode === 'grid' ? 'primary' : 'neutral'}
                onClick={() => setViewMode('grid')}
                sx={{ borderRadius: 0, bgcolor: viewMode === 'grid' ? '#EDE9FE' : '#FFFFFF', color: viewMode === 'grid' ? '#7C3AED' : '#64748B' }}
              >
                <FiGrid size={15} />
              </IconButton>
              <IconButton
                size="sm"
                variant={viewMode === 'table' ? 'solid' : 'plain'}
                color={viewMode === 'table' ? 'primary' : 'neutral'}
                onClick={() => setViewMode('table')}
                sx={{ borderRadius: 0, bgcolor: viewMode === 'table' ? '#EDE9FE' : '#FFFFFF', color: viewMode === 'table' ? '#7C3AED' : '#64748B' }}
              >
                <FiList size={15} />
              </IconButton>
            </Box>

            <IconButton size="sm" variant="outlined" color="neutral" sx={{ borderRadius: '8px' }}>
              <FiRefreshCw size={15} />
            </IconButton>
          </Box>
        </Sheet>

        {/* Workflow Cards Grid */}
        {viewMode === 'grid' ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            {filteredWorkflows.map((wf) => {
              const meta = MODULE_DISPLAY_NAMES[wf.module] || { label: wf.module, icon: '📋', color: '#64748B', bg: '#F1F5F9' };
              const isActive = wf.status === 'active';
              return (
                <Sheet
                  key={wf.id}
                  variant="outlined"
                  onClick={() => setSelectedWorkflowForDrawer(wf)}
                  sx={{
                    p: 2.5,
                    borderRadius: '14px',
                    borderColor: '#E2E8F0',
                    bgcolor: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.75,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    '&:hover': { borderColor: '#C4B5FD', transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(124, 58, 237, 0.08)' },
                  }}
                >
                  {/* Card Top */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          bgcolor: meta.bg,
                          color: meta.color,
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '18px',
                          flexShrink: 0,
                          border: `1px solid ${meta.color}30`,
                        }}
                      >
                        {meta.icon}
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography level="title-sm" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>
                            {wf.name}
                          </Typography>
                          {wf.policyType === 'default' && (
                            <Chip size="sm" variant="soft" color="primary" sx={{ fontSize: '10.5px', fontWeight: 700 }}>
                              Default
                            </Chip>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                          <Chip size="sm" variant="soft" sx={{ fontSize: '11px', fontWeight: 600, bgcolor: meta.bg, color: meta.color }}>
                            {meta.label}
                          </Chip>
                          <Typography level="body-xs" sx={{ color: '#64748B' }}>
                            • {wf.steps.length} {wf.steps.length === 1 ? 'level' : 'levels'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Status Toggle & Menu */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer' }} onClick={(e) => handleToggleStatus(wf, e)}>
                        <Typography level="body-xs" sx={{ fontWeight: 600, color: isActive ? '#15803D' : '#64748B' }}>
                          {isActive ? '• Active' : '• Inactive'}
                        </Typography>
                        <Switch size="sm" checked={isActive} color="success" />
                      </Box>

                      <Dropdown>
                        <MenuButton size="sm" variant="plain" sx={{ p: 0.5, minWidth: 0, borderRadius: '6px' }}>
                          <FiMoreVertical size={16} color="#64748B" />
                        </MenuButton>
                        <Menu placement="bottom-end" size="sm" sx={{ borderRadius: '10px' }}>
                          <MenuItem onClick={() => onNavigateToEdit(wf)}>
                            <FiEdit2 size={14} /> Edit Workflow
                          </MenuItem>
                          <MenuItem onClick={(e) => handleClone(wf, e)}>
                            <FiCopy size={14} /> Duplicate
                          </MenuItem>
                          {onOpenSimulation && (
                            <MenuItem onClick={() => onOpenSimulation(wf)}>
                              <FiPlay size={14} /> Simulate Run
                            </MenuItem>
                          )}
                          <Divider />
                          <MenuItem color="danger" onClick={(e) => handleDelete(wf.id, e)}>
                            <FiTrash2 size={14} /> Delete
                          </MenuItem>
                        </Menu>
                      </Dropdown>
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography level="body-xs" sx={{ color: '#64748B', fontStyle: 'italic', fontSize: '12.5px' }}>
                    {wf.description || 'Standard automated approval policy • Click to edit'}
                  </Typography>

                  {/* Connected Step Pipeline Strip */}
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: '8px',
                      bgcolor: '#F8FAFC',
                      border: '1px solid #EEF2F6',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flexWrap: 'wrap',
                    }}
                  >
                    {wf.steps.map((step) => (
                      <React.Fragment key={step.id}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                            bgcolor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            px: 1,
                            py: 0.4,
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#334155',
                          }}
                        >
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              bgcolor: '#EDE9FE',
                              color: '#7C3AED',
                              fontSize: '10px',
                              fontWeight: 700,
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            {step.order}
                          </Box>
                          <span>{step.label}</span>
                        </Box>
                        <FiArrowRight size={12} color="#94A3B8" />
                      </React.Fragment>
                    ))}
                    <Chip size="sm" variant="soft" color="success" sx={{ fontSize: '11px', fontWeight: 700 }}>
                      ✓ Approved
                    </Chip>
                  </Box>

                  {/* Footer */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5, borderTop: '1px solid #F1F5F9' }}>
                    <Typography level="body-xs" sx={{ color: '#94A3B8' }}>
                      In-flight: <strong>{wf.inFlightCount || 0}</strong> • {wf.lastModifiedDate || 'Recent'}
                    </Typography>
                    <Button
                      size="sm"
                      variant="plain"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToEdit(wf);
                      }}
                      sx={{ fontSize: '12px', fontWeight: 600, p: 0 }}
                    >
                      Edit Flow
                    </Button>
                  </Box>
                </Sheet>
              );
            })}
          </Box>
        ) : (
          /* Dense Table View */
          <Sheet variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', bgcolor: '#FFFFFF' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#EEEBFF', color: '#7C3AED', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px' }}>Workflow Name</th>
                  <th style={{ padding: '12px 16px' }}>Module</th>
                  <th style={{ padding: '12px 16px' }}>Policy Scope</th>
                  <th style={{ padding: '12px 16px' }}>Pipeline</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkflows.map((wf) => (
                  <tr key={wf.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>{wf.name}</td>
                    <td style={{ padding: '12px 16px' }}>{wf.module}</td>
                    <td style={{ padding: '12px 16px' }}>{wf.policyType === 'default' ? 'Default' : 'Scoped'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {wf.steps.map((s) => `${s.order}. ${s.label}`).join(' → ')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Switch size="sm" checked={wf.status === 'active'} color="success" onChange={(e) => handleToggleStatus(wf, e as any)} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Button size="sm" variant="plain" onClick={() => onNavigateToEdit(wf)}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Sheet>
        )}
      </Box>

      {/* Slide-over Inspection Drawer */}
      <ApprovalFlowDrawer
        workflow={selectedWorkflowForDrawer}
        isOpen={Boolean(selectedWorkflowForDrawer)}
        onClose={() => setSelectedWorkflowForDrawer(null)}
        onEdit={(wf) => {
          setSelectedWorkflowForDrawer(null);
          onNavigateToEdit(wf);
        }}
      />
    </Box>
  );
};
