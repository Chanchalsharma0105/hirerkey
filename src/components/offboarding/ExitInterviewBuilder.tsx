import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Sheet,
  Button,
  IconButton,
  Chip,
  Input,
  Textarea,
  Switch,
  Select,
  Option,
  RadioGroup,
  Radio,
  Checkbox,
  LinearProgress,
  Divider,
  Tooltip,
} from '@mui/joy';
import {
  FiPlus,
  FiTrash2,
  FiCopy,
  FiArrowUp,
  FiArrowDown,
  FiStar,
  FiCheckSquare,
  FiCircle,
  FiAlignLeft,
  FiSliders,
  FiCheckCircle,
  FiX,
  FiEye,
  FiEdit3,
  FiColumns,
  FiSmartphone,
  FiMonitor,
  FiRotateCcw,
  FiSave,
  FiLayers,
  FiSparkles,
} from 'react-icons/fi';

/* ==========================================================================
   TYPES & SCHEMAS
   ========================================================================== */
export type ExitQuestionType =
  | 'rating_stars'
  | 'number_scale'
  | 'multiple_choice'
  | 'single_select'
  | 'narrative_text'
  | 'boolean_yes_no';

export interface ExitQuestionOption {
  id: string;
  label: string;
}

export interface ExitQuestion {
  id: string;
  type: ExitQuestionType;
  title: string;
  subtitle?: string;
  required: boolean;
  options?: ExitQuestionOption[];
  minScale?: number;
  maxScale?: number;
  minLabel?: string;
  maxLabel?: string;
  placeholder?: string;
  categoryTag?: string;
}

export interface ExitTemplateMetadata {
  title: string;
  description: string;
  departments: string[];
  triggers: string[];
  status: 'draft' | 'published';
  lastSavedText: string;
  icon: string;
}

export type StudioViewMode = 'split' | 'builder' | 'preview';
export type PreviewViewport = 'desktop' | 'mobile';

/* ==========================================================================
   INITIAL HOSPITALITY TEMPLATE DATA (CROWNE PLAZA DUBAI)
   ========================================================================== */
const INITIAL_METADATA: ExitTemplateMetadata = {
  title: 'Hospitality Colleague Exit & Experience Survey',
  description:
    'Your candid feedback helps Crowne Plaza Dubai foster a transparent workplace, improve operational leadership, and support ongoing staff development. All responses are confidential.',
  departments: ['Front Office', 'Food & Beverage', 'Housekeeping'],
  triggers: ['Voluntary Resignation', 'End of Fixed Contract'],
  status: 'draft',
  lastSavedText: 'Auto-saved 2 mins ago',
  icon: '🏨',
};

const INITIAL_QUESTIONS: ExitQuestion[] = [
  {
    id: 'q1',
    type: 'rating_stars',
    title: 'How would you rate your overall working experience and culture at Crowne Plaza Dubai?',
    subtitle: 'Considers operational camaraderie, workplace safety, and team support.',
    required: true,
    minLabel: 'Poor',
    maxLabel: 'Exceptional',
    categoryTag: 'Culture & Workplace',
  },
  {
    id: 'q2',
    type: 'single_select',
    title: 'What was the primary factor that influenced your decision to leave?',
    subtitle: 'Select the single most decisive reason.',
    required: true,
    categoryTag: 'Departure Reason',
    options: [
      { id: 'opt1', label: 'Career advancement & promotional growth limits' },
      { id: 'opt2', label: 'Compensation, incentives, or gratuity benchmark' },
      { id: 'opt3', label: 'Relocation / Family commitments outside UAE' },
      { id: 'opt4', label: 'Shift schedule / Work-life balance in guest services' },
      { id: 'opt5', label: 'Pursuing higher education or specialized hospitality certification' },
    ],
  },
  {
    id: 'q3',
    type: 'rating_stars',
    title: 'How effectively did your direct Head of Department support your daily duties?',
    subtitle: 'Evaluates communication, shift handovers, and managerial guidance.',
    required: true,
    minLabel: 'Needs Support',
    maxLabel: 'Inspiring Leader',
    categoryTag: 'Leadership & Management',
  },
  {
    id: 'q4',
    type: 'multiple_choice',
    title: 'Which hotel benefits and operational resources met or exceeded your expectations?',
    subtitle: 'Select all that apply to your tenure.',
    required: false,
    categoryTag: 'Benefits & Accommodation',
    options: [
      { id: 'b1', label: 'Colleague dining & duty meals at Crowne Cafe' },
      { id: 'b2', label: 'Staff transportation & IHG accommodation facilities' },
      { id: 'b3', label: 'Health insurance & annual flight ticket allowance' },
      { id: 'b4', label: 'IHG Room & F&B colleague discount privileges' },
      { id: 'b5', label: 'On-the-job training & guest service certifications' },
    ],
  },
  {
    id: 'q5',
    type: 'number_scale',
    title: 'How likely are you to recommend IHG / Crowne Plaza Dubai as a great workplace to peers?',
    subtitle: 'Net Promoter Scale from 1 (Extremely Unlikely) to 10 (Extremely Likely).',
    required: true,
    minScale: 1,
    maxScale: 10,
    minLabel: 'Not likely at all',
    maxLabel: 'Extremely likely',
    categoryTag: 'NPS & Brand Loyalty',
  },
  {
    id: 'q6',
    type: 'narrative_text',
    title: 'What constructive advice would you give to the General Manager to make this hotel better?',
    subtitle: 'Optional open remarks on systems, staffing ratios, or colleague well-being.',
    required: false,
    placeholder: 'Please share your transparent suggestions for our Executive Committee...',
    categoryTag: 'Open Feedback',
  },
];

const AVAILABLE_DEPTS = [
  'All Departments',
  'Front Office',
  'Food & Beverage',
  'Housekeeping',
  'Kitchen / Culinary',
  'Engineering & Facilities',
  'Sales & Marketing',
  'Human Resources',
  'Security & Safety',
];

/* ==========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================== */
export interface ExitInterviewBuilderProps {
  onBack?: () => void;
  onSaveTemplate?: (template: { metadata: ExitTemplateMetadata; questions: ExitQuestion[] }) => void;
}

export const ExitInterviewBuilder: React.FC<ExitInterviewBuilderProps> = ({
  onBack,
  onSaveTemplate,
}) => {
  // State
  const [metadata, setMetadata] = useState<ExitTemplateMetadata>(INITIAL_METADATA);
  const [questions, setQuestions] = useState<ExitQuestion[]>(INITIAL_QUESTIONS);
  const [viewMode, setViewMode] = useState<StudioViewMode>('split');
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>('desktop');
  const [activeQuestionId, setActiveQuestionId] = useState<string>('q1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Employee interactive preview mock answers
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({
    q1: 4,
    q2: 'opt1',
    q3: 5,
    q4: ['b1', 'b4'],
    q5: 9,
    q6: 'The team at Front Office is world-class. Providing dual monitors during high-occupancy check-ins would significantly reduce guest waiting times.',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Department chip toggle
  const toggleDepartment = (dept: string) => {
    if (dept === 'All Departments') {
      if (metadata.departments.includes('All Departments')) {
        setMetadata({ ...metadata, departments: ['Front Office'] });
      } else {
        setMetadata({ ...metadata, departments: ['All Departments'] });
      }
      return;
    }

    let updated = metadata.departments.filter((d) => d !== 'All Departments');
    if (updated.includes(dept)) {
      updated = updated.filter((d) => d !== dept);
      if (updated.length === 0) updated = ['Front Office'];
    } else {
      updated.push(dept);
    }
    setMetadata({ ...metadata, departments: updated });
  };

  // Question manipulation
  const handleUpdateQuestion = (id: string, partial: Partial<ExitQuestion>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...partial } : q))
    );
  };

  const handleDuplicateQuestion = (id: string) => {
    const target = questions.find((q) => q.id === id);
    if (!target) return;
    const newId = 'q_' + Date.now().toString(36);
    const clone: ExitQuestion = {
      ...target,
      id: newId,
      title: `${target.title} (Copy)`,
      options: target.options ? target.options.map((o, idx) => ({ ...o, id: `${newId}_opt${idx}` })) : undefined,
    };
    const index = questions.findIndex((q) => q.id === id);
    const updated = [...questions];
    updated.splice(index + 1, 0, clone);
    setQuestions(updated);
    setActiveQuestionId(newId);
    showToast('Question duplicated successfully.');
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) {
      showToast('A template must retain at least one question.');
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    showToast('Question removed from survey template.');
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const updated = [...questions];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setQuestions(updated);
  };

  const handleAddQuestion = (type: ExitQuestionType = 'rating_stars') => {
    const newId = 'q_' + Date.now().toString(36);
    const newQ: ExitQuestion = {
      id: newId,
      type,
      title: 'New Question Title',
      subtitle: 'Provide context or instructions for the respondent.',
      required: true,
      categoryTag: 'General Feedback',
      options:
        type === 'single_select' || type === 'multiple_choice'
          ? [
              { id: `${newId}_opt1`, label: 'Option 1' },
              { id: `${newId}_opt2`, label: 'Option 2' },
              { id: `${newId}_opt3`, label: 'Option 3' },
            ]
          : undefined,
      minScale: type === 'number_scale' ? 1 : undefined,
      maxScale: type === 'number_scale' ? 10 : undefined,
      minLabel: type === 'rating_stars' ? 'Poor' : 'Low',
      maxLabel: type === 'rating_stars' ? 'Exceptional' : 'High',
      placeholder: type === 'narrative_text' ? 'Type your comments here...' : undefined,
    };
    setQuestions([...questions, newQ]);
    setActiveQuestionId(newId);
    showToast('Added new ' + type.replace('_', ' ') + ' question.');
  };

  // Option row management
  const handleAddOption = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const currentOpts = q.options || [];
        const nextNum = currentOpts.length + 1;
        const newOpt: ExitQuestionOption = {
          id: `${qId}_opt_${Date.now().toString(36)}`,
          label: `Option ${nextNum}`,
        };
        return { ...q, options: [...currentOpts, newOpt] };
      })
    );
  };

  const handleUpdateOption = (qId: string, optId: string, label: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId || !q.options) return q;
        return {
          ...q,
          options: q.options.map((o) => (o.id === optId ? { ...o, label } : o)),
        };
      })
    );
  };

  const handleDeleteOption = (qId: string, optId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId || !q.options) return q;
        if (q.options.length <= 2) {
          showToast('Multiple choice questions require at least 2 options.');
          return q;
        }
        return {
          ...q,
          options: q.options.filter((o) => o.id !== optId),
        };
      })
    );
  };

  // HyIQ AI generation presets
  const handleApplyAiPreset = (preset: 'core' | 'leadership' | 'compensation') => {
    if (preset === 'core') {
      showToast('HyIQ: Applied Standard Hospitality Exit Suite (6 Questions).');
      setQuestions(INITIAL_QUESTIONS);
    } else if (preset === 'leadership') {
      const leadershipQ: ExitQuestion = {
        id: 'q_lead_' + Date.now().toString(36),
        type: 'rating_stars',
        title: 'Did you receive clear, regular feedback from your Department Head regarding your hospitality performance?',
        subtitle: 'Addresses monthly appraisals, duty shift debriefs, and recognition.',
        required: true,
        categoryTag: 'Leadership Communication',
        minLabel: 'Rarely',
        maxLabel: 'Consistent & Constructive',
      };
      setQuestions([...questions, leadershipQ]);
      showToast('HyIQ: Appended Leadership & Culture Question.');
    } else if (preset === 'compensation') {
      const compQ: ExitQuestion = {
        id: 'q_comp_' + Date.now().toString(36),
        type: 'boolean_yes_no',
        title: 'Were your service charge allocations, overtime records, and statutory leave balances clearly communicated?',
        subtitle: 'Verifies payroll transparency prior to end-of-service gratuity calculation.',
        required: true,
        categoryTag: 'Payroll & Gratuity',
      };
      setQuestions([...questions, compQ]);
      showToast('HyIQ: Appended Compensation Transparency Question.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#F8FAFC',
        color: '#1E293B',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ====================================================================
          1. STUDIO TOPBAR & CONTEXT CONTROLS
          ==================================================================== */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          px: { xs: 2, md: 3 },
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          boxShadow: '0 1px 3px rgba(0, 23, 65, 0.04)',
        }}
      >
        {/* Left: Breadcrumbs & Badges */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {onBack && (
            <IconButton
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={onBack}
              sx={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
            >
              <FiX size={15} />
            </IconButton>
          )}

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography level="body-xs" sx={{ color: '#64748B', fontWeight: 500 }}>
                Offboarding › Templates & Policy ›
              </Typography>
              <Typography level="body-xs" sx={{ color: '#7C3AED', fontWeight: 600 }}>
                Exit Interview Studio
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mt: 0.25 }}>
              <Typography level="title-md" sx={{ fontWeight: 700, color: '#0F172A' }}>
                Exit Interview Builder & Template Studio
              </Typography>
              <Chip
                size="sm"
                variant="soft"
                sx={{
                  bgcolor: '#F1F5F9',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '11px',
                  borderRadius: '6px',
                }}
              >
                ● Draft Template
              </Chip>
              <Chip
                size="sm"
                variant="soft"
                sx={{
                  bgcolor: '#EDE9FE',
                  color: '#7C3AED',
                  fontWeight: 600,
                  fontSize: '11px',
                  borderRadius: '6px',
                }}
              >
                {metadata.departments.length} Depts Assigned
              </Chip>
              <Typography level="body-xs" sx={{ color: '#94A3B8', display: { xs: 'none', md: 'inline' } }}>
                {metadata.lastSavedText}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Center: View Switcher (Split, Builder Only, Preview Only) */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            bgcolor: '#F1F5F9',
            p: '3px',
            borderRadius: '9px',
            border: '1px solid #E2E8F0',
          }}
        >
          <Button
            size="sm"
            variant={viewMode === 'builder' ? 'solid' : 'plain'}
            color={viewMode === 'builder' ? 'primary' : 'neutral'}
            onClick={() => setViewMode('builder')}
            startDecorator={<FiEdit3 size={13} />}
            sx={{
              borderRadius: '7px',
              fontSize: '12px',
              fontWeight: 600,
              py: '4px',
              px: '12px',
              minHeight: '28px',
              bgcolor: viewMode === 'builder' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'builder' ? '#7C3AED' : '#64748B',
              boxShadow: viewMode === 'builder' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              '&:hover': { bgcolor: viewMode === 'builder' ? '#FFFFFF' : '#E2E8F0' },
            }}
          >
            Builder
          </Button>

          <Button
            size="sm"
            variant={viewMode === 'split' ? 'solid' : 'plain'}
            color={viewMode === 'split' ? 'primary' : 'neutral'}
            onClick={() => setViewMode('split')}
            startDecorator={<FiColumns size={13} />}
            sx={{
              borderRadius: '7px',
              fontSize: '12px',
              fontWeight: 600,
              py: '4px',
              px: '12px',
              minHeight: '28px',
              bgcolor: viewMode === 'split' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'split' ? '#7C3AED' : '#64748B',
              boxShadow: viewMode === 'split' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              '&:hover': { bgcolor: viewMode === 'split' ? '#FFFFFF' : '#E2E8F0' },
            }}
          >
            Split Studio
          </Button>

          <Button
            size="sm"
            variant={viewMode === 'preview' ? 'solid' : 'plain'}
            color={viewMode === 'preview' ? 'primary' : 'neutral'}
            onClick={() => setViewMode('preview')}
            startDecorator={<FiEye size={13} />}
            sx={{
              borderRadius: '7px',
              fontSize: '12px',
              fontWeight: 600,
              py: '4px',
              px: '12px',
              minHeight: '28px',
              bgcolor: viewMode === 'preview' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'preview' ? '#7C3AED' : '#64748B',
              boxShadow: viewMode === 'preview' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              '&:hover': { bgcolor: viewMode === 'preview' ? '#FFFFFF' : '#E2E8F0' },
            }}
          >
            Live Preview
          </Button>
        </Box>

        {/* Right: Actions (Archetype A "The Royal Aura" AI Button & Save) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* HyIQ Archetype A Button */}
          <Button
            size="sm"
            variant="solid"
            onClick={() => handleApplyAiPreset('core')}
            startDecorator={
              <FiSparkles size={14} style={{ filter: 'drop-shadow(0 0 4px #FFFFFF)' }} />
            }
            sx={{
              height: '34px',
              px: '14px',
              fontSize: '12.5px',
              fontWeight: 600,
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 55%, #4F46E5 100%)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow:
                '0 4px 14px -2px rgba(124, 58, 237, 0.42), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
              transition: 'all 180ms cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow:
                  '0 6px 20px -2px rgba(124, 58, 237, 0.55), inset 0 1px 1.5px rgba(255, 255, 255, 0.55)',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 55%, #4338CA 100%)',
              },
            }}
          >
            Draft with HyIQ
          </Button>

          {onBack && (
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={onBack}
              sx={{
                height: '34px',
                borderRadius: '8px',
                borderColor: '#E2E8F0',
                color: '#475569',
                fontSize: '12.5px',
              }}
            >
              Cancel
            </Button>
          )}

          <Button
            size="sm"
            variant="solid"
            color="primary"
            startDecorator={<FiSave size={14} />}
            onClick={() => {
              if (onSaveTemplate) onSaveTemplate({ metadata, questions });
              showToast('Exit Interview Template saved successfully.');
            }}
            sx={{
              height: '34px',
              px: '16px',
              borderRadius: '8px',
              bgcolor: '#7C3AED',
              fontWeight: 600,
              fontSize: '12.5px',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
              '&:hover': { bgcolor: '#6D28D9' },
            }}
          >
            Save Template
          </Button>
        </Box>
      </Box>

      {/* Toast Alert */}
      {toastMessage && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            bgcolor: '#0F172A',
            color: '#FFFFFF',
            py: 1.25,
            px: 2,
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 10px 25px rgba(0, 23, 65, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <FiCheckCircle color="#34D399" size={16} />
          {toastMessage}
        </Box>
      )}

      {/* ====================================================================
          2. MAIN WORKSPACE: SPLIT CANVAS
          ==================================================================== */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          p: { xs: 2, md: 3 },
          gap: 3,
          maxWidth: '1680px',
          width: '100%',
          mx: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {/* ==================================================================
            LEFT COLUMN: THE BUILDER CANVAS
            ================================================================== */}
        {(viewMode === 'split' || viewMode === 'builder') && (
          <Box
            sx={{
              flex: viewMode === 'split' ? '1 1 58%' : '1 1 100%',
              maxWidth: viewMode === 'split' ? '60%' : '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            {/* --------------------------------------------------------------
                CARD 1: GENERAL INFORMATION & DEPARTMENT TARGETING
                -------------------------------------------------------------- */}
            <Card
              variant="outlined"
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: '14px',
                borderColor: '#E2E8F0',
                p: 2.5,
                boxShadow: '0 1px 3px rgba(0, 23, 65, 0.05)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Box
                    sx={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      bgcolor: '#EDE9FE',
                      color: '#7C3AED',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '16px',
                    }}
                  >
                    {metadata.icon}
                  </Box>
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: 700, color: '#0F172A' }}>
                      Survey Identification & Department Targeting
                    </Typography>
                    <Typography level="body-xs" sx={{ color: '#64748B' }}>
                      Configures who receives this exit interview upon offboarding initiation.
                    </Typography>
                  </Box>
                </Box>
                <Chip size="sm" variant="outlined" color="primary" sx={{ borderRadius: '6px' }}>
                  {questions.length} Questions Configured
                </Chip>
              </Box>

              <Divider sx={{ mb: 2.5, borderColor: '#F1F5F9' }} />

              {/* Department Multi-Select Chips */}
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155' }}>
                    Target Departments <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#94A3B8' }}>
                    {metadata.departments.length} selected
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {AVAILABLE_DEPTS.map((dept) => {
                    const isSelected = metadata.departments.includes(dept);
                    return (
                      <Chip
                        key={dept}
                        size="sm"
                        variant={isSelected ? 'solid' : 'outlined'}
                        onClick={() => toggleDepartment(dept)}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '12px',
                          borderRadius: '8px',
                          bgcolor: isSelected ? '#7C3AED' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#475569',
                          borderColor: isSelected ? '#7C3AED' : '#CBD5E1',
                          '&:hover': {
                            bgcolor: isSelected ? '#6D28D9' : '#F8FAFC',
                          },
                        }}
                      >
                        {isSelected && '✓ '}
                        {dept}
                      </Chip>
                    );
                  })}
                </Box>
              </Box>

              {/* Survey Title & Live Counter */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                  <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155' }}>
                    Survey Name <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#94A3B8' }}>
                    {metadata.title.length}/100 characters
                  </Typography>
                </Box>
                <Input
                  size="sm"
                  value={metadata.title}
                  onChange={(e) => setMetadata({ ...metadata, title: e.target.value.slice(0, 100) })}
                  placeholder="e.g. Front Office Colleague Exit & Experience Survey"
                  sx={{
                    borderRadius: '8px',
                    borderColor: '#CBD5E1',
                    fontSize: '13px',
                    '&:focus-within': { borderColor: '#7C3AED', boxShadow: '0 0 0 2px #EDE9FE' },
                  }}
                />
              </Box>

              {/* Description & Inline AI Refine Trigger */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                  <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155' }}>
                    Description & Colleague Notice
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Button
                      size="sm"
                      variant="plain"
                      onClick={() =>
                        setMetadata({
                          ...metadata,
                          description:
                            'Your candid feedback provides invaluable guidance to Crowne Plaza Dubai leadership to enhance operational support, team recognition, and hospitality standards.',
                        })
                      }
                      startDecorator={<FiSparkles size={12} color="#7C3AED" />}
                      sx={{
                        p: 0,
                        minHeight: 'auto',
                        fontSize: '11.5px',
                        color: '#7C3AED',
                        fontWeight: 600,
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                      }}
                    >
                      Refine with HyIQ
                    </Button>
                    <Typography level="body-xs" sx={{ color: '#94A3B8' }}>
                      {metadata.description.length}/250 characters
                    </Typography>
                  </Box>
                </Box>
                <Textarea
                  minRows={2}
                  maxRows={4}
                  size="sm"
                  value={metadata.description}
                  onChange={(e) =>
                    setMetadata({ ...metadata, description: e.target.value.slice(0, 250) })
                  }
                  placeholder="Write clear instructions regarding survey confidentiality and purpose..."
                  sx={{
                    borderRadius: '8px',
                    borderColor: '#CBD5E1',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    '&:focus-within': { borderColor: '#7C3AED', boxShadow: '0 0 0 2px #EDE9FE' },
                  }}
                />
              </Box>

              {/* Triggers & Compliance Matrix */}
              <Box>
                <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155', mb: 0.75 }}>
                  Applicable Departure Categories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Voluntary Resignation', 'End of Fixed Contract', 'Mutual Separation', 'Retirement'].map(
                    (trigger) => {
                      const active = metadata.triggers.includes(trigger);
                      return (
                        <Chip
                          key={trigger}
                          size="sm"
                          variant={active ? 'soft' : 'outlined'}
                          color={active ? 'primary' : 'neutral'}
                          onClick={() => {
                            const updated = active
                              ? metadata.triggers.filter((t) => t !== trigger)
                              : [...metadata.triggers, trigger];
                            setMetadata({ ...metadata, triggers: updated });
                          }}
                          sx={{
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '11.5px',
                            fontWeight: 500,
                          }}
                        >
                          {active && '✓ '}
                          {trigger}
                        </Chip>
                      );
                    }
                  )}
                </Box>
                <Typography level="body-xs" sx={{ color: '#94A3B8', mt: 1, fontSize: '11px' }}>
                  🔒 UAE Labor Law Compliance: Involuntary terminations and bereavement cases strictly bypass exit surveys.
                </Typography>
              </Box>
            </Card>

            {/* --------------------------------------------------------------
                HYIQ AI QUICK PROMPTS ACCELERATOR BAR
                -------------------------------------------------------------- */}
            <Sheet
              variant="outlined"
              sx={{
                bgcolor: 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%)',
                borderColor: '#DDD6FE',
                borderRadius: '12px',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1.25,
                boxShadow: '0 1px 4px rgba(124, 58, 237, 0.06)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 0.5 }}>
                <FiSparkles size={14} color="#7C3AED" />
                <Typography level="body-xs" sx={{ fontWeight: 700, color: '#7C3AED' }}>
                  HyIQ Presets:
                </Typography>
              </Box>

              <Button
                size="sm"
                variant="outlined"
                onClick={() => handleApplyAiPreset('core')}
                sx={{
                  height: '28px',
                  borderRadius: '7px',
                  borderColor: '#C4B5FD',
                  bgcolor: '#FFFFFF',
                  color: '#6D28D9',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#EDE9FE' },
                }}
              >
                + Core Hospitality Suite (6 Qs)
              </Button>

              <Button
                size="sm"
                variant="outlined"
                onClick={() => handleApplyAiPreset('leadership')}
                sx={{
                  height: '28px',
                  borderRadius: '7px',
                  borderColor: '#C4B5FD',
                  bgcolor: '#FFFFFF',
                  color: '#6D28D9',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#EDE9FE' },
                }}
              >
                + Leadership & Culture Q
              </Button>

              <Button
                size="sm"
                variant="outlined"
                onClick={() => handleApplyAiPreset('compensation')}
                sx={{
                  height: '28px',
                  borderRadius: '7px',
                  borderColor: '#C4B5FD',
                  bgcolor: '#FFFFFF',
                  color: '#6D28D9',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#EDE9FE' },
                }}
              >
                + Gratuity & Benefits Q
              </Button>
            </Sheet>

            {/* --------------------------------------------------------------
                CARD 2: THE INTERACTIVE QUESTIONS STACK
                -------------------------------------------------------------- */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {questions.map((q, idx) => {
                const isActive = activeQuestionId === q.id;
                return (
                  <Sheet
                    key={q.id}
                    variant="outlined"
                    onClick={() => setActiveQuestionId(q.id)}
                    sx={{
                      bgcolor: '#FFFFFF',
                      borderRadius: '14px',
                      borderColor: isActive ? '#7C3AED' : '#E2E8F0',
                      p: 2.5,
                      boxShadow: isActive
                        ? '0 4px 16px -2px rgba(124, 58, 237, 0.12)'
                        : '0 1px 3px rgba(0, 23, 65, 0.05)',
                      transition: 'all 160ms ease',
                    }}
                  >
                    {/* Question Card Header Bar */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pb: 1.5,
                        mb: 2,
                        borderBottom: '1px solid #F1F5F9',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        {/* Drag Handle & Number Pill */}
                        <Box sx={{ color: '#94A3B8', cursor: 'grab', display: 'flex', alignItems: 'center' }}>
                          <FiSliders size={14} />
                        </Box>

                        <Chip
                          size="sm"
                          variant="soft"
                          sx={{
                            bgcolor: '#EDE9FE',
                            color: '#7C3AED',
                            fontWeight: 700,
                            borderRadius: '6px',
                            fontSize: '12px',
                          }}
                        >
                          Q{idx + 1}
                        </Chip>

                        {q.categoryTag && (
                          <Chip
                            size="sm"
                            variant="outlined"
                            sx={{
                              borderColor: '#E2E8F0',
                              color: '#64748B',
                              fontSize: '11px',
                              borderRadius: '6px',
                            }}
                          >
                            {q.categoryTag}
                          </Chip>
                        )}
                      </Box>

                      {/* Controls: Reorder, Required, Duplicate, Delete */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
                          <Typography level="body-xs" sx={{ color: '#475569', fontSize: '12px' }}>
                            Required
                          </Typography>
                          <Switch
                            size="sm"
                            checked={q.required}
                            onChange={(e) => handleUpdateQuestion(q.id, { required: e.target.checked })}
                            sx={{
                              '--Switch-trackBackground': q.required ? '#7C3AED' : '#CBD5E1',
                            }}
                          />
                        </Box>

                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          disabled={idx === 0}
                          onClick={() => handleMoveQuestion(idx, 'up')}
                          sx={{ borderRadius: '6px' }}
                        >
                          <FiArrowUp size={13} />
                        </IconButton>

                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          disabled={idx === questions.length - 1}
                          onClick={() => handleMoveQuestion(idx, 'down')}
                          sx={{ borderRadius: '6px' }}
                        >
                          <FiArrowDown size={13} />
                        </IconButton>

                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleDuplicateQuestion(q.id)}
                          sx={{ borderRadius: '6px' }}
                        >
                          <FiCopy size={13} />
                        </IconButton>

                        <IconButton
                          size="sm"
                          variant="plain"
                          color="danger"
                          onClick={() => handleDeleteQuestion(q.id)}
                          sx={{ borderRadius: '6px', '&:hover': { bgcolor: '#FEE2E2' } }}
                        >
                          <FiTrash2 size={13} />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Question Title & Type Selection Row */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: '1 1 65%' }}>
                        <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
                          Question Text <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <Input
                          size="sm"
                          value={q.title}
                          onChange={(e) => handleUpdateQuestion(q.id, { title: e.target.value })}
                          placeholder="Type question prompt..."
                          sx={{
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '13.5px',
                            borderColor: '#CBD5E1',
                            '&:focus-within': { borderColor: '#7C3AED' },
                          }}
                        />
                      </Box>

                      <Box sx={{ flex: '1 1 28%', minWidth: '180px' }}>
                        <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
                          Answer Type
                        </Typography>
                        <Select
                          size="sm"
                          value={q.type}
                          onChange={(_, val) => {
                            if (val) {
                              const newType = val as ExitQuestionType;
                              handleUpdateQuestion(q.id, {
                                type: newType,
                                options:
                                  newType === 'multiple_choice' || newType === 'single_select'
                                    ? q.options || [
                                        { id: `${q.id}_1`, label: 'Option 1' },
                                        { id: `${q.id}_2`, label: 'Option 2' },
                                      ]
                                    : undefined,
                              });
                            }
                          }}
                          sx={{ borderRadius: '8px', fontSize: '13px' }}
                        >
                          <Option value="rating_stars">⭐ 1 to 5 Star Rating</Option>
                          <Option value="number_scale">🔢 Number Scale (1-10)</Option>
                          <Option value="single_select">🔘 Single Select (Radio)</Option>
                          <Option value="multiple_choice">☑️ Multiple Choice</Option>
                          <Option value="narrative_text">📝 Open Narrative</Option>
                          <Option value="boolean_yes_no">⚖️ Yes / No (Boolean)</Option>
                        </Select>
                      </Box>
                    </Box>

                    {/* Subtitle / Context Input */}
                    <Box sx={{ mb: 2 }}>
                      <Typography level="body-xs" sx={{ fontWeight: 500, color: '#64748B', mb: 0.5 }}>
                        Helper Text / Subtitle (Optional)
                      </Typography>
                      <Input
                        size="sm"
                        value={q.subtitle || ''}
                        onChange={(e) => handleUpdateQuestion(q.id, { subtitle: e.target.value })}
                        placeholder="Additional guidance for the colleague..."
                        sx={{ borderRadius: '8px', borderColor: '#E2E8F0', fontSize: '12.5px' }}
                      />
                    </Box>

                    {/* DYNAMIC TYPE CONFIGURATION & PREVIEW WITHIN CARD */}
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px dashed #CBD5E1',
                      }}
                    >
                      {/* CASE A: 1 to 5 Star Rating */}
                      {q.type === 'rating_stars' && (
                        <Box>
                          <Typography level="body-xs" sx={{ color: '#64748B', mb: 1, fontWeight: 500 }}>
                            Rating Scale Preview (1 = {q.minLabel || 'Poor'}, 5 = {q.maxLabel || 'Exceptional'}):
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Box
                                key={star}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  p: '6px 10px',
                                  borderRadius: '8px',
                                  bgcolor: '#FFFFFF',
                                  border: '1px solid #E2E8F0',
                                }}
                              >
                                <FiStar size={16} color="#F59E0B" fill="#F59E0B" />
                                <Typography level="body-xs" sx={{ fontWeight: 600, color: '#334155' }}>
                                  {star}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* CASE B: Number Scale 1-10 */}
                      {q.type === 'number_scale' && (
                        <Box>
                          <Typography level="body-xs" sx={{ color: '#64748B', mb: 1, fontWeight: 500 }}>
                            Score Range Preview (1 to 10):
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <Box
                                key={num}
                                sx={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '7px',
                                  bgcolor: num >= 9 ? '#EDE9FE' : '#FFFFFF',
                                  color: num >= 9 ? '#7C3AED' : '#334155',
                                  border: '1px solid',
                                  borderColor: num >= 9 ? '#C4B5FD' : '#CBD5E1',
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontWeight: 700,
                                  fontSize: '12.5px',
                                }}
                              >
                                {num}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* CASE C & D: Single Select / Multiple Choice Option Rows */}
                      {(q.type === 'single_select' || q.type === 'multiple_choice') && (
                        <Box>
                          <Typography level="body-xs" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                            Configured Options ({q.options?.length || 0}):
                          </Typography>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
                            {q.options?.map((opt, optIdx) => (
                              <Box
                                key={opt.id}
                                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                              >
                                <Typography level="body-xs" sx={{ color: '#94A3B8', width: '18px' }}>
                                  {optIdx + 1}.
                                </Typography>

                                {q.type === 'single_select' ? (
                                  <FiCircle size={14} color="#7C3AED" />
                                ) : (
                                  <FiCheckSquare size={14} color="#7C3AED" />
                                )}

                                <Input
                                  size="sm"
                                  value={opt.label}
                                  onChange={(e) => handleUpdateOption(q.id, opt.id, e.target.value)}
                                  sx={{ flex: 1, borderRadius: '6px', fontSize: '12.5px', bgcolor: '#FFFFFF' }}
                                />

                                <IconButton
                                  size="sm"
                                  variant="plain"
                                  color="danger"
                                  onClick={() => handleDeleteOption(q.id, opt.id)}
                                  sx={{ borderRadius: '6px' }}
                                >
                                  <FiTrash2 size={12} />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>

                          <Button
                            size="sm"
                            variant="plain"
                            startDecorator={<FiPlus size={12} />}
                            onClick={() => handleAddOption(q.id)}
                            sx={{
                              color: '#7C3AED',
                              fontWeight: 600,
                              fontSize: '12px',
                              p: 0,
                              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                            }}
                          >
                            + Add Option Row
                          </Button>
                        </Box>
                      )}

                      {/* CASE E: Narrative Text */}
                      {q.type === 'narrative_text' && (
                        <Box>
                          <Typography level="body-xs" sx={{ color: '#64748B', mb: 0.75, fontWeight: 500 }}>
                            Colleague Feedback Textarea (Preview):
                          </Typography>
                          <Textarea
                            disabled
                            minRows={2}
                            placeholder={q.placeholder || 'Colleague will type narrative thoughts here...'}
                            sx={{ bgcolor: '#FFFFFF', borderRadius: '8px', fontSize: '12.5px' }}
                          />
                        </Box>
                      )}

                      {/* CASE F: Boolean Yes / No */}
                      {q.type === 'boolean_yes_no' && (
                        <Box>
                          <Typography level="body-xs" sx={{ color: '#64748B', mb: 1, fontWeight: 500 }}>
                            Toggle Selector Preview:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="sm" variant="soft" color="primary" sx={{ borderRadius: '7px' }}>
                              Yes
                            </Button>
                            <Button size="sm" variant="outlined" color="neutral" sx={{ borderRadius: '7px' }}>
                              No
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Sheet>
                );
              })}
            </Box>

            {/* --------------------------------------------------------------
                ADD QUESTION FLOATING / SPEED DIAL DOCK
                -------------------------------------------------------------- */}
            <Card
              variant="outlined"
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: '14px',
                borderStyle: 'dashed',
                borderColor: '#DDD6FE',
                p: 2.5,
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0, 23, 65, 0.04)',
              }}
            >
              <Typography level="title-xs" sx={{ fontWeight: 700, color: '#7C3AED', mb: 1 }}>
                + Add Question to Exit Survey
              </Typography>
              <Typography level="body-xs" sx={{ color: '#64748B', mb: 2 }}>
                Select a format shortcut below to instantly append a configured card:
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => handleAddQuestion('rating_stars')}
                  startDecorator={<FiStar size={13} color="#F59E0B" />}
                  sx={{ borderRadius: '8px', fontSize: '12px', bgcolor: '#FAF5FF', borderColor: '#DDD6FE' }}
                >
                  Rating Stars
                </Button>

                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => handleAddQuestion('single_select')}
                  startDecorator={<FiCircle size={13} color="#7C3AED" />}
                  sx={{ borderRadius: '8px', fontSize: '12px', bgcolor: '#FAF5FF', borderColor: '#DDD6FE' }}
                >
                  Single Select
                </Button>

                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => handleAddQuestion('multiple_choice')}
                  startDecorator={<FiCheckSquare size={13} color="#7C3AED" />}
                  sx={{ borderRadius: '8px', fontSize: '12px', bgcolor: '#FAF5FF', borderColor: '#DDD6FE' }}
                >
                  Multiple Choice
                </Button>

                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => handleAddQuestion('number_scale')}
                  startDecorator={<FiSliders size={13} color="#7C3AED" />}
                  sx={{ borderRadius: '8px', fontSize: '12px', bgcolor: '#FAF5FF', borderColor: '#DDD6FE' }}
                >
                  1-10 Scale
                </Button>

                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => handleAddQuestion('narrative_text')}
                  startDecorator={<FiAlignLeft size={13} color="#7C3AED" />}
                  sx={{ borderRadius: '8px', fontSize: '12px', bgcolor: '#FAF5FF', borderColor: '#DDD6FE' }}
                >
                  Open Narrative
                </Button>

                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => handleAddQuestion('boolean_yes_no')}
                  startDecorator={<FiCheckCircle size={13} color="#7C3AED" />}
                  sx={{ borderRadius: '8px', fontSize: '12px', bgcolor: '#FAF5FF', borderColor: '#DDD6FE' }}
                >
                  Yes / No
                </Button>
              </Box>
            </Card>
          </Box>
        )}

        {/* ==================================================================
            RIGHT COLUMN: LIVE EMPLOYEE INTERACTIVE PREVIEW
            ================================================================== */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <Box
            sx={{
              flex: viewMode === 'split' ? '1 1 42%' : '1 1 100%',
              maxWidth: viewMode === 'split' ? '42%' : '860px',
              mx: viewMode === 'preview' ? 'auto' : 0,
              position: viewMode === 'split' ? 'sticky' : 'relative',
              top: viewMode === 'split' ? '76px' : 'auto',
              alignSelf: 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* Viewport & Persona Simulation Header */}
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
                boxShadow: '0 1px 3px rgba(0,23,65,0.04)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    bgcolor: '#EDE9FE',
                    color: '#7C3AED',
                    fontWeight: 700,
                    fontSize: '11px',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  SK
                </Box>
                <Box>
                  <Typography level="body-xs" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    Previewing: Sara Khan
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#64748B', fontSize: '11px' }}>
                    Front Desk Manager · Front Office (FDM-01)
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Device Viewport Toggle */}
                <Box sx={{ display: 'flex', bgcolor: '#F1F5F9', borderRadius: '7px', p: '2px' }}>
                  <IconButton
                    size="sm"
                    variant={previewViewport === 'desktop' ? 'solid' : 'plain'}
                    color={previewViewport === 'desktop' ? 'primary' : 'neutral'}
                    onClick={() => setPreviewViewport('desktop')}
                    sx={{
                      borderRadius: '6px',
                      minWidth: '28px',
                      minHeight: '26px',
                      bgcolor: previewViewport === 'desktop' ? '#FFFFFF' : 'transparent',
                      color: previewViewport === 'desktop' ? '#7C3AED' : '#64748B',
                    }}
                  >
                    <FiMonitor size={13} />
                  </IconButton>

                  <IconButton
                    size="sm"
                    variant={previewViewport === 'mobile' ? 'solid' : 'plain'}
                    color={previewViewport === 'mobile' ? 'primary' : 'neutral'}
                    onClick={() => setPreviewViewport('mobile')}
                    sx={{
                      borderRadius: '6px',
                      minWidth: '28px',
                      minHeight: '26px',
                      bgcolor: previewViewport === 'mobile' ? '#FFFFFF' : 'transparent',
                      color: previewViewport === 'mobile' ? '#7C3AED' : '#64748B',
                    }}
                  >
                    <FiSmartphone size={13} />
                  </IconButton>
                </Box>

                <Tooltip title="Reset mock answers">
                  <IconButton
                    size="sm"
                    variant="outlined"
                    onClick={() => {
                      setPreviewAnswers({});
                      showToast('Preview responses reset.');
                    }}
                    sx={{ borderRadius: '7px', borderColor: '#E2E8F0' }}
                  >
                    <FiRotateCcw size={13} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* THE SIMULATED EMPLOYEE SURROUNDING CONTAINER */}
            <Card
              variant="outlined"
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: '16px',
                borderColor: '#E2E8F0',
                p: previewViewport === 'mobile' ? 2 : 3,
                maxWidth: previewViewport === 'mobile' ? '390px' : '100%',
                mx: previewViewport === 'mobile' ? 'auto' : 0,
                boxShadow: '0 4px 20px rgba(0, 23, 65, 0.08)',
                maxHeight: 'calc(100vh - 170px)',
                overflowY: 'auto',
              }}
            >
              {/* Hotel Header & Confidentiality Hero */}
              <Box
                sx={{
                  bgcolor: 'linear-gradient(135deg, #001741 0%, #1E1B4B 100%)',
                  borderRadius: '12px',
                  p: 2.5,
                  color: '#FFFFFF',
                  mb: 2.5,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography sx={{ fontSize: '18px' }}>🏨</Typography>
                  <Typography level="title-sm" sx={{ color: '#C4B5FD', fontWeight: 700, letterSpacing: '0.04em' }}>
                    CROWNE PLAZA DUBAI · IHG
                  </Typography>
                </Box>

                <Typography level="title-md" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 0.75 }}>
                  {metadata.title || 'Colleague Exit & Experience Survey'}
                </Typography>

                <Typography level="body-xs" sx={{ color: '#E2E8F0', lineHeight: 1.5, mb: 1.5 }}>
                  {metadata.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 1, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                  <Typography level="body-xs" sx={{ color: '#93C5FD', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    🔒 Strictly Confidential
                  </Typography>
                  <Typography level="body-xs" sx={{ color: '#93C5FD', fontSize: '11px' }}>
                    ⏱️ ~4 min completion
                  </Typography>
                </Box>
              </Box>

              {/* Survey Questions Display */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {questions.map((q, idx) => {
                  return (
                    <Box
                      key={q.id}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid #EEF0F4',
                        bgcolor: '#FAFAFD',
                      }}
                    >
                      {/* Q Number & Title */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                        <Typography level="title-xs" sx={{ fontWeight: 700, color: '#7C3AED' }}>
                          {idx + 1}.
                        </Typography>
                        <Typography level="title-xs" sx={{ fontWeight: 700, color: '#0F172A', flex: 1 }}>
                          {q.title}{' '}
                          {q.required && <span style={{ color: '#EF4444' }}>*</span>}
                        </Typography>
                      </Box>

                      {q.subtitle && (
                        <Typography level="body-xs" sx={{ color: '#64748B', mb: 1.5, ml: 2.25 }}>
                          {q.subtitle}
                        </Typography>
                      )}

                      {/* Answer Widget */}
                      <Box sx={{ ml: 2.25 }}>
                        {/* Rating Stars Widget */}
                        {q.type === 'rating_stars' && (
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              {[1, 2, 3, 4, 5].map((starVal) => {
                                const current = previewAnswers[q.id] || 0;
                                const isFilled = current >= starVal;
                                return (
                                  <IconButton
                                    key={starVal}
                                    size="sm"
                                    variant="plain"
                                    onClick={() =>
                                      setPreviewAnswers({ ...previewAnswers, [q.id]: starVal })
                                    }
                                    sx={{
                                      p: '4px',
                                      minWidth: 'auto',
                                      '&:hover': { transform: 'scale(1.1)' },
                                    }}
                                  >
                                    <FiStar
                                      size={22}
                                      color={isFilled ? '#F59E0B' : '#CBD5E1'}
                                      fill={isFilled ? '#F59E0B' : 'transparent'}
                                    />
                                  </IconButton>
                                );
                              })}
                            </Box>
                            <Typography level="body-xs" sx={{ color: '#7C3AED', fontWeight: 600, fontSize: '11px' }}>
                              {previewAnswers[q.id]
                                ? `Selected: ${previewAnswers[q.id]} / 5 stars`
                                : 'Click a star to rate'}
                            </Typography>
                          </Box>
                        )}

                        {/* Number Scale 1-10 Widget */}
                        {q.type === 'number_scale' && (
                          <Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
                                const isSelected = previewAnswers[q.id] === val;
                                return (
                                  <Button
                                    key={val}
                                    size="sm"
                                    variant={isSelected ? 'solid' : 'outlined'}
                                    color={isSelected ? 'primary' : 'neutral'}
                                    onClick={() =>
                                      setPreviewAnswers({ ...previewAnswers, [q.id]: val })
                                    }
                                    sx={{
                                      minWidth: '28px',
                                      height: '28px',
                                      p: 0,
                                      borderRadius: '6px',
                                      fontSize: '11.5px',
                                      fontWeight: 700,
                                      bgcolor: isSelected ? '#7C3AED' : '#FFFFFF',
                                    }}
                                  >
                                    {val}
                                  </Button>
                                );
                              })}
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography level="body-xs" sx={{ fontSize: '10.5px', color: '#94A3B8' }}>
                                {q.minLabel || 'Not likely'}
                              </Typography>
                              <Typography level="body-xs" sx={{ fontSize: '10.5px', color: '#94A3B8' }}>
                                {q.maxLabel || 'Extremely likely'}
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        {/* Single Select Radio Widget */}
                        {q.type === 'single_select' && (
                          <RadioGroup
                            value={previewAnswers[q.id] || ''}
                            onChange={(e) =>
                              setPreviewAnswers({ ...previewAnswers, [q.id]: e.target.value })
                            }
                            sx={{ gap: 1 }}
                          >
                            {q.options?.map((opt) => (
                              <Radio
                                key={opt.id}
                                value={opt.id}
                                label={opt.label}
                                size="sm"
                                sx={{
                                  fontSize: '12.5px',
                                  color: '#334155',
                                  '& .MuiRadio-radio': {
                                    borderColor: '#CBD5E1',
                                  },
                                }}
                              />
                            ))}
                          </RadioGroup>
                        )}

                        {/* Multiple Choice Checkbox Widget */}
                        {q.type === 'multiple_choice' && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {q.options?.map((opt) => {
                              const selectedList: string[] = previewAnswers[q.id] || [];
                              const isChecked = selectedList.includes(opt.id);
                              return (
                                <Checkbox
                                  key={opt.id}
                                  size="sm"
                                  label={opt.label}
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const next = e.target.checked
                                      ? [...selectedList, opt.id]
                                      : selectedList.filter((id) => id !== opt.id);
                                    setPreviewAnswers({ ...previewAnswers, [q.id]: next });
                                  }}
                                  sx={{ fontSize: '12.5px', color: '#334155' }}
                                />
                              );
                            })}
                          </Box>
                        )}

                        {/* Open Narrative Text Widget */}
                        {q.type === 'narrative_text' && (
                          <Textarea
                            minRows={3}
                            size="sm"
                            value={previewAnswers[q.id] || ''}
                            onChange={(e) =>
                              setPreviewAnswers({ ...previewAnswers, [q.id]: e.target.value })
                            }
                            placeholder={q.placeholder || 'Type here...'}
                            sx={{
                              bgcolor: '#FFFFFF',
                              borderRadius: '8px',
                              borderColor: '#CBD5E1',
                              fontSize: '12.5px',
                            }}
                          />
                        )}

                        {/* Boolean Yes / No Widget */}
                        {q.type === 'boolean_yes_no' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {['Yes', 'No'].map((choice) => {
                              const isPicked = previewAnswers[q.id] === choice;
                              return (
                                <Button
                                  key={choice}
                                  size="sm"
                                  variant={isPicked ? 'solid' : 'outlined'}
                                  color={isPicked ? 'primary' : 'neutral'}
                                  onClick={() =>
                                    setPreviewAnswers({ ...previewAnswers, [q.id]: choice })
                                  }
                                  sx={{
                                    borderRadius: '7px',
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    px: 2,
                                    bgcolor: isPicked ? '#7C3AED' : '#FFFFFF',
                                  }}
                                >
                                  {choice}
                                </Button>
                              );
                            })}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {/* Preview Footer Submit Button */}
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #E2E8F0' }}>
                <Button
                  fullWidth
                  variant="solid"
                  color="primary"
                  onClick={() => showToast('Test submission received in preview simulator.')}
                  sx={{
                    borderRadius: '9px',
                    height: '40px',
                    bgcolor: '#7C3AED',
                    fontWeight: 600,
                    fontSize: '13px',
                    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
                    '&:hover': { bgcolor: '#6D28D9' },
                  }}
                >
                  Submit Exit Interview to HR
                </Button>
                <Typography level="body-xs" sx={{ textAlign: 'center', color: '#94A3B8', mt: 1, fontSize: '11px' }}>
                  Interactive preview mode for Sara Khan · Responses do not alter live database.
                </Typography>
              </Box>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
};
