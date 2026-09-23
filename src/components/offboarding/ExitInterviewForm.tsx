import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  Option,
  FormControl,
  FormLabel,
} from '@mui/joy';
import { FiPlus, FiX, FiSparkles } from 'react-icons/fi';

export interface RatingLevel {
  id: string;
  label: string;
  color: string;
}

export interface ExitQuestionItem {
  id: string;
  title: string;
  type: string;
  placeholder?: string;
  options?: string[];
  ratingLabels?: RatingLevel[];
}

export interface ExitInterviewFormProps {
  onBack?: () => void;
  onSave?: (data: {
    department: string;
    title: string;
    description: string;
    questions: ExitQuestionItem[];
  }) => void;
}

export const DEFAULT_RATING_LABELS: RatingLevel[] = [
  { id: 'r1', label: 'Very Bad', color: '#22C55E' },
  { id: 'r2', label: 'Bad', color: '#EF4444' },
  { id: 'r3', label: 'Medium', color: '#3B82F6' },
  { id: 'r4', label: 'Good', color: '#F59E0B' },
  { id: 'r5', label: 'Very Good', color: '#8B5CF6' },
];

export const RATING_PALETTE = [
  '#22C55E',
  '#EF4444',
  '#3B82F6',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#6366F1',
  '#E11D48',
  '#06B6D4',
];

const INITIAL_QUESTIONS: ExitQuestionItem[] = [
  {
    id: 'q1',
    title: 'What was the primary reason for deciding to leave?',
    type: 'text',
    placeholder: 'Share your primary reasons for departing...',
  },
  {
    id: 'q2',
    title: 'How would you rate your overall work experience and environment?',
    type: 'rating',
    placeholder: 'Rate from 1 to 5 stars',
    ratingLabels: [
      { id: 'r2_1', label: 'Very Bad', color: '#22C55E' },
      { id: 'r2_2', label: 'Bad', color: '#EF4444' },
      { id: 'r2_3', label: 'Medium', color: '#3B82F6' },
      { id: 'r2_4', label: 'Good', color: '#F59E0B' },
      { id: 'r2_5', label: 'Very Good', color: '#8B5CF6' },
    ],
  },
  {
    id: 'q3',
    title: 'Did your direct line manager provide regular support and guidance?',
    type: 'rating',
    placeholder: 'Rate managerial support',
    ratingLabels: [
      { id: 'r3_1', label: 'Very Bad', color: '#22C55E' },
      { id: 'r3_2', label: 'Bad', color: '#EF4444' },
      { id: 'r3_3', label: 'Medium', color: '#3B82F6' },
      { id: 'r3_4', label: 'Good', color: '#F59E0B' },
      { id: 'r3_5', label: 'Very Good', color: '#8B5CF6' },
    ],
  },
  {
    id: 'q4',
    title: 'What constructive suggestions do you have for leadership to improve?',
    type: 'text',
    placeholder: 'Share your candid suggestions for executive leadership...',
  },
];

export const ExitInterviewForm: React.FC<ExitInterviewFormProps> = ({
  onBack,
  onSave,
}) => {
  const [department, setDepartment] = useState<string>('Front Office');
  const [title, setTitle] = useState<string>('Employee Exit Interview Survey');
  const [description, setDescription] = useState<string>(
    'Please share your honest feedback regarding your time at Crowne Plaza Dubai to help us improve leadership, culture, and employee experience.'
  );
  const [questions, setQuestions] = useState<ExitQuestionItem[]>(INITIAL_QUESTIONS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDraftHyIq = () => {
    setTitle('Colleague Experience & Exit Survey');
    setDepartment('Front Office');
    setDescription(
      'Your candid insights help Crowne Plaza Dubai leadership continuously elevate guest service excellence, team well-being, and managerial support.'
    );
    setQuestions([
      {
        id: `q_${Date.now()}_1`,
        title: 'What was the decisive factor in your departure?',
        type: 'text',
        placeholder: 'Share the decisive factors in your departure...',
      },
      {
        id: `q_${Date.now()}_2`,
        title: 'How would you rate team camaraderie and departmental cooperation?',
        type: 'rating',
        placeholder: 'Rate from 1 to 5 stars',
        ratingLabels: [
          { id: 'r1', label: 'Very Bad', color: '#22C55E' },
          { id: 'r2', label: 'Bad', color: '#EF4444' },
          { id: 'r3', label: 'Medium', color: '#3B82F6' },
          { id: 'r4', label: 'Good', color: '#F59E0B' },
          { id: 'r5', label: 'Very Good', color: '#8B5CF6' },
        ],
      },
      {
        id: `q_${Date.now()}_3`,
        title: 'Did your Line Manager provide constructive shift feedback and support?',
        type: 'rating',
        placeholder: 'Rate managerial leadership',
        ratingLabels: [
          { id: 'r1', label: 'Very Bad', color: '#22C55E' },
          { id: 'r2', label: 'Bad', color: '#EF4444' },
          { id: 'r3', label: 'Medium', color: '#3B82F6' },
          { id: 'r4', label: 'Good', color: '#F59E0B' },
          { id: 'r5', label: 'Very Good', color: '#8B5CF6' },
        ],
      },
      {
        id: `q_${Date.now()}_4`,
        title: 'What should our leadership team change or prioritize going forward?',
        type: 'text',
        placeholder: 'Provide honest suggestions for executive management...',
      },
    ]);
    showToast('HyIQ: Exit Interview Form drafted with 4 hospitality questions.');
  };

  const handleRefineHyIq = () => {
    setDescription(
      'Your confidential feedback provides invaluable guidance to Crowne Plaza Dubai leadership to continuously refine operational excellence, staff well-being, and leadership practices.'
    );
    showToast('HyIQ: Survey description refined to professional standard.');
  };

  const handleAddQuestion = () => {
    const newQ: ExitQuestionItem = {
      id: `q_${Date.now()}`,
      title: '',
      type: 'text',
      placeholder: 'Enter Placeholder',
    };
    setQuestions((prev) => [...prev, newQ]);
    showToast(`Question ${questions.length + 1} added.`);
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) {
      showToast('Survey requires at least one question.');
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    showToast('Question deleted.');
  };

  const handleUpdateQuestion = (
    id: string,
    field: keyof ExitQuestionItem,
    val: any
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const updated = { ...q, [field]: val };
        if (field === 'type' && val === 'rating' && (!updated.ratingLabels || updated.ratingLabels.length === 0)) {
          updated.ratingLabels = [...DEFAULT_RATING_LABELS];
        }
        return updated;
      })
    );
  };

  const handleSetRatingCount = (qId: string, targetCount: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const current = q.ratingLabels && q.ratingLabels.length > 0 ? [...q.ratingLabels] : [...DEFAULT_RATING_LABELS];
        if (targetCount === current.length) return q;
        let nextLabels: RatingLevel[];
        if (targetCount < current.length) {
          nextLabels = current.slice(0, targetCount);
        } else {
          nextLabels = [...current];
          for (let i = current.length; i < targetCount; i++) {
            const color = RATING_PALETTE[i % RATING_PALETTE.length];
            const defaultName = DEFAULT_RATING_LABELS[i] ? DEFAULT_RATING_LABELS[i].label : `Level ${i + 1}`;
            nextLabels.push({
              id: `r_${Date.now()}_${i}`,
              label: defaultName,
              color,
            });
          }
        }
        return { ...q, ratingLabels: nextLabels };
      })
    );
    showToast(`Rating scale updated to ${targetCount} levels.`);
  };

  const handleUpdateRatingLabelText = (qId: string, rIdx: number, val: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const current = q.ratingLabels && q.ratingLabels.length > 0 ? [...q.ratingLabels] : [...DEFAULT_RATING_LABELS];
        if (!current[rIdx]) return q;
        current[rIdx] = { ...current[rIdx], label: val };
        return { ...q, ratingLabels: current };
      })
    );
  };

  const handleAddRatingLabel = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const current = q.ratingLabels && q.ratingLabels.length > 0 ? [...q.ratingLabels] : [...DEFAULT_RATING_LABELS];
        const nextIdx = current.length;
        const color = RATING_PALETTE[nextIdx % RATING_PALETTE.length];
        const defaultName = DEFAULT_RATING_LABELS[nextIdx] ? DEFAULT_RATING_LABELS[nextIdx].label : `Level ${nextIdx + 1}`;
        const nextLabels = [
          ...current,
          {
            id: `r_${Date.now()}_${nextIdx}`,
            label: defaultName,
            color,
          },
        ];
        return { ...q, ratingLabels: nextLabels };
      })
    );
    showToast('Rating level added.');
  };

  const handleDeleteRatingLabel = (qId: string, rIdx: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const current = q.ratingLabels && q.ratingLabels.length > 0 ? [...q.ratingLabels] : [...DEFAULT_RATING_LABELS];
        if (current.length <= 2) {
          showToast('Rating question requires at least 2 levels.');
          return q;
        }
        current.splice(rIdx, 1);
        return { ...q, ratingLabels: current };
      })
    );
    showToast('Rating level removed.');
  };

  const handleMoveRatingLabel = (
    qId: string,
    rIdx: number,
    direction: 'up' | 'down'
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const current = q.ratingLabels && q.ratingLabels.length > 0 ? [...q.ratingLabels] : [...DEFAULT_RATING_LABELS];
        const targetIdx = direction === 'up' ? rIdx - 1 : rIdx + 1;
        if (targetIdx < 0 || targetIdx >= current.length) return q;
        const item = current.splice(rIdx, 1)[0];
        current.splice(targetIdx, 0, item);
        return { ...q, ratingLabels: current };
      })
    );
  };

  const handleMoveQuestion = (id: string, direction: 'up' | 'down') => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
  };

  const handleSave = () => {
    if (!title.trim()) {
      showToast('Please enter a survey title.');
      return;
    }
    if (onSave) {
      onSave({ department, title, description, questions });
    }
    showToast(`✓ Exit Interview Form saved with ${questions.length} questions!`);
    if (onBack) onBack();
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        py: { xs: 1, md: 3 },
        px: { xs: 1, md: 2 },
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Toast */}
      {toastMsg && (
        <Box
          sx={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            bgcolor: '#0F172A',
            color: '#FFFFFF',
            py: 1.25,
            px: 2.25,
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          {toastMsg}
        </Box>
      )}

      <Card
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: '680px',
          bgcolor: '#FFFFFF',
          borderColor: '#E2E8F0',
          borderRadius: '16px',
          p: { xs: 2.5, md: 3.5 },
          boxShadow:
            '0 4px 20px rgba(0, 23, 65, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Form Header Matching Theme (media_1790073342868.png) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 2,
            borderBottom: '1px solid #F1F5F9',
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: '#EDE9FE',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </Box>
            <Box>
              <Typography
                level="title-lg"
                sx={{
                  fontWeight: 700,
                  color: '#0F172A',
                  fontSize: '18px',
                  letterSpacing: '-0.01em',
                }}
              >
                Exit Interview
              </Typography>
              <Typography
                level="body-xs"
                sx={{ color: '#64748B', mt: 0.25, fontSize: '13px' }}
              >
                Describe the questions and our support team will handle collection.
              </Typography>
            </Box>
          </Box>

          {onBack && (
            <IconButton
              size="sm"
              variant="outlined"
              onClick={onBack}
              title="Back to Departures"
              sx={{
                width: 34,
                height: 34,
                color: '#64748B',
                borderColor: '#E2E8F0',
                borderRadius: '8px',
                '&:hover': { bgcolor: '#F1F5F9', color: '#0F172A' },
              }}
            >
              <FiX size={18} />
            </IconButton>
          )}
        </Box>

        {/* Form Body */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
          {/* AI Fill Banner Matching Theme (media_1790073342868.png) */}
          <Box
            onClick={handleDraftHyIq}
            title="Click to auto-draft questions with AI"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: '#FAF5FF',
              border: '1px solid #EDE9FE',
              borderRadius: '12px',
              p: '10px 14px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              '&:hover': {
                bgcolor: '#F5EEFF',
                borderColor: '#DDD6FE',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  bgcolor: '#EDE9FE',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#7C3AED"/>
                </svg>
              </Box>
              <Typography sx={{ fontSize: '13.5px', color: '#334155' }}>
                Describe it and let{' '}
                <strong style={{ color: '#7C3AED' }}>AI fill this in</strong>
              </Typography>
            </Box>

            <Box
              title="Draft with AI"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: '#EDE9FE',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                transition: 'background 0.15s',
                '&:hover': { bgcolor: '#DDD6FE' },
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Box>
          </Box>

          {/* Department */}
          <FormControl required>
            <FormLabel sx={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
              Department
            </FormLabel>
            <Select
              value={department}
              onChange={(_, val) => val && setDepartment(val)}
              sx={{
                borderRadius: '8px',
                borderColor: '#CBD5E1',
                fontSize: '13px',
                height: '40px',
                bgcolor: '#F9FAFB',
              }}
            >
              <Option value="All Departments">All Departments</Option>
              <Option value="Front Office">Front Office</Option>
              <Option value="Food & Beverage">Food & Beverage</Option>
              <Option value="Housekeeping">Housekeeping</Option>
              <Option value="Kitchen / Culinary">Kitchen / Culinary</Option>
              <Option value="Engineering & Facilities">Engineering & Facilities</Option>
              <Option value="Sales & Marketing">Sales & Marketing</Option>
              <Option value="Human Resources">Human Resources</Option>
              <Option value="Security & Safety">Security & Safety</Option>
            </Select>
          </FormControl>

          {/* Survey Title with Character Counter */}
          <FormControl required>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5,
              }}
            >
              <FormLabel sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', m: 0 }}>
                Survey Title <span style={{ color: '#DC2626' }}>*</span>
              </FormLabel>
              <Typography level="body-xs" sx={{ color: '#94A3B8', fontSize: '11.5px' }}>
                {title.length}/100
              </Typography>
            </Box>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              placeholder="Enter survey title..."
              sx={{
                borderRadius: '8px',
                borderColor: '#CBD5E1',
                fontSize: '13px',
                height: '40px',
                bgcolor: '#F9FAFB',
              }}
            />
          </FormControl>

          {/* Description with Refine with HyIQ action */}
          <FormControl>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5,
              }}
            >
              <FormLabel sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', m: 0 }}>
                Description
              </FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  size="sm"
                  variant="plain"
                  onClick={handleRefineHyIq}
                  startDecorator={<FiSparkles />}
                  sx={{
                    color: '#7C3AED',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    p: 0,
                    minHeight: 0,
                    '&:hover': { bgcolor: 'transparent', color: '#6D28D9' },
                  }}
                >
                  Refine with HyIQ
                </Button>
                <Typography level="body-xs" sx={{ color: '#94A3B8', fontSize: '11.5px' }}>
                  {description.length}/250
                </Typography>
              </Box>
            </Box>
            <Textarea
              minRows={3}
              maxRows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 250))}
              placeholder="Enter description or instructions for the departing colleague..."
              sx={{
                borderRadius: '8px',
                borderColor: '#CBD5E1',
                fontSize: '13px',
                lineHeight: 1.5,
                bgcolor: '#F9FAFB',
              }}
            />
          </FormControl>

          {/* Questions Section Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography level="title-sm" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '14px' }}>
                Questions
              </Typography>
              <Typography
                level="body-xs"
                sx={{
                  bgcolor: '#EDE9FE',
                  color: '#7C3AED',
                  fontWeight: 600,
                  fontSize: '11px',
                  px: 1,
                  py: 0.25,
                  borderRadius: '6px',
                }}
              >
                {questions.length} Questions
              </Typography>
            </Box>
            <Typography level="body-xs" sx={{ color: '#94A3B8', fontSize: '11.5px' }}>
              Configured in individual boxes
            </Typography>
          </Box>

          {/* Contained Questions List Matching Theme */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {questions.map((q, idx) => (
              <Box
                key={q.id}
                sx={{
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  p: { xs: 2, sm: 2.5 },
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  '&:hover': {
                    borderColor: '#CBD5E1',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                {/* Header: Question N + Delete & Grip */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        bgcolor: '#EDE9FE',
                        color: '#7C3AED',
                        fontWeight: 700,
                        fontSize: '11px',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography
                      level="title-sm"
                      sx={{ fontWeight: 700, color: '#0F172A', fontSize: '14.5px' }}
                    >
                      Question {idx + 1}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="sm"
                      variant="plain"
                      onClick={() => handleDeleteQuestion(q.id)}
                      title="Delete Question"
                      sx={{
                        width: 28,
                        height: 28,
                        color: '#94A3B8',
                        borderRadius: '6px',
                        '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' },
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                    </IconButton>

                    <Box
                      title={`Reorder Question (${idx > 0 ? 'Click to move up' : 'Click to move down'})`}
                      onClick={() => handleMoveQuestion(q.id, idx > 0 ? 'up' : 'down')}
                      sx={{
                        width: 26,
                        height: 26,
                        display: 'grid',
                        placeItems: 'center',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        '&:hover': { color: '#475569', bgcolor: '#F1F5F9' },
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="9" cy="5" r="1.5" />
                        <circle cx="15" cy="5" r="1.5" />
                        <circle cx="9" cy="12" r="1.5" />
                        <circle cx="15" cy="12" r="1.5" />
                        <circle cx="9" cy="19" r="1.5" />
                        <circle cx="15" cy="19" r="1.5" />
                      </svg>
                    </Box>
                  </Box>
                </Box>

                {/* Row 1: Question * (FULL WIDTH) */}
                <FormControl required sx={{ mb: 2 }}>
                  <FormLabel sx={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                    Question <span style={{ color: '#DC2626' }}>*</span>
                  </FormLabel>
                  <Input
                    value={q.title}
                    onChange={(e) => handleUpdateQuestion(q.id, 'title', e.target.value)}
                    placeholder="Enter question..."
                    sx={{
                      width: '100%',
                      borderRadius: '8px',
                      borderColor: '#E2E8F0',
                      fontSize: '13.5px',
                      height: '42px',
                      bgcolor: '#F9FAFB',
                      '&:hover': { borderColor: '#CBD5E1' },
                      '&:focus-within': { borderColor: '#7C3AED' },
                    }}
                  />
                </FormControl>

                {/* Row 2: Type * and Placeholder (SIDE BY SIDE ON ONE LINE) */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1.75,
                  }}
                >
                  <FormControl required>
                    <FormLabel sx={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                      Type <span style={{ color: '#DC2626' }}>*</span>
                    </FormLabel>
                    <Select
                      value={q.type}
                      onChange={(_, val) => val && handleUpdateQuestion(q.id, 'type', val)}
                      sx={{
                        borderRadius: '8px',
                        borderColor: '#E2E8F0',
                        fontSize: '13.5px',
                        height: '42px',
                        bgcolor: '#F9FAFB',
                        '&:hover': { borderColor: '#CBD5E1' },
                        '&:focus-within': { borderColor: '#7C3AED' },
                      }}
                    >
                      <Option value="text">text</Option>
                      <Option value="rating">rating</Option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel sx={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                      Placeholder
                    </FormLabel>
                    <Input
                      value={q.placeholder || ''}
                      onChange={(e) => handleUpdateQuestion(q.id, 'placeholder', e.target.value)}
                      placeholder="Enter Placeholder"
                      sx={{
                        borderRadius: '8px',
                        borderColor: '#E2E8F0',
                        fontSize: '13.5px',
                        height: '42px',
                        bgcolor: '#F9FAFB',
                        '&:hover': { borderColor: '#CBD5E1' },
                        '&:focus-within': { borderColor: '#7C3AED' },
                      }}
                    />
                  </FormControl>
                </Box>

                {/* Rating Labels Builder matching screenshot (media_1790144297394.png) */}
                {q.type === 'rating' && (
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: '1px dashed #E2E8F0',
                    }}
                  >
                    {/* Header: Define Rating Labels ⓘ + Scale Selector */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography
                          sx={{
                            fontSize: '13.5px',
                            fontWeight: 600,
                            color: '#1E293B',
                          }}
                        >
                          Define Rating Labels
                        </Typography>
                        <Box
                          title="Configure rating scale levels and descriptive labels for the departing colleague."
                          sx={{
                            color: '#94A3B8',
                            display: 'inline-flex',
                            alignItems: 'center',
                            cursor: 'help',
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                          </svg>
                        </Box>
                      </Box>

                      {/* Scale Selector */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography level="body-xs" sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                          Scale:
                        </Typography>
                        <Select
                          size="sm"
                          value={(q.ratingLabels || DEFAULT_RATING_LABELS).length}
                          onChange={(_, val) => val && handleSetRatingCount(q.id, Number(val))}
                          sx={{
                            height: '32px',
                            minHeight: '32px',
                            fontSize: '12px',
                            borderRadius: '6px',
                            borderColor: '#E2E8F0',
                            bgcolor: '#FFFFFF',
                            width: '105px',
                          }}
                        >
                          {[2, 3, 4, 5, 6, 7, 10].map((cnt) => (
                            <Option key={cnt} value={cnt} sx={{ fontSize: '12px' }}>
                              {cnt} Levels
                            </Option>
                          ))}
                          {![2, 3, 4, 5, 6, 7, 10].includes((q.ratingLabels || DEFAULT_RATING_LABELS).length) && (
                            <Option value={(q.ratingLabels || DEFAULT_RATING_LABELS).length} sx={{ fontSize: '12px' }}>
                              {(q.ratingLabels || DEFAULT_RATING_LABELS).length} Levels
                            </Option>
                          )}
                        </Select>
                      </Box>
                    </Box>

                    {/* Dynamic Rating List Rows matching screenshot 1:1 */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mb: 1.5 }}>
                      {(q.ratingLabels || DEFAULT_RATING_LABELS).map((r, rIdx, arr) => (
                        <Box
                          key={r.id || `r_${rIdx}`}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          {/* 6-dot drag grip handle square button */}
                          <IconButton
                            size="sm"
                            variant="outlined"
                            title={`Reorder rating (${rIdx > 0 ? 'Click to move up' : 'Click to move down'})`}
                            onClick={() => handleMoveRatingLabel(q.id, rIdx, rIdx > 0 ? 'up' : 'down')}
                            sx={{
                              width: 42,
                              height: 42,
                              borderRadius: '8px',
                              borderColor: '#E2E8F0',
                              bgcolor: '#FFFFFF',
                              color: '#94A3B8',
                              flexShrink: 0,
                              '&:hover': {
                                bgcolor: '#F8FAFC',
                                borderColor: '#CBD5E1',
                                color: '#64748B',
                              },
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="9" cy="5" r="1.5" />
                              <circle cx="15" cy="5" r="1.5" />
                              <circle cx="9" cy="12" r="1.5" />
                              <circle cx="15" cy="12" r="1.5" />
                              <circle cx="9" cy="19" r="1.5" />
                              <circle cx="15" cy="19" r="1.5" />
                            </svg>
                          </IconButton>

                          {/* Input field with colored bullet dot on the left */}
                          <Box
                            sx={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              height: 42,
                              border: '1px solid #E2E8F0',
                              borderRadius: '8px',
                              bgcolor: '#FFFFFF',
                              px: 1.75,
                              transition: 'border-color 0.15s, box-shadow 0.15s',
                              '&:hover': { borderColor: '#CBD5E1' },
                              '&:focus-within': {
                                borderColor: '#7C3AED',
                                boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.12)',
                              },
                            }}
                          >
                            {/* Colored bullet dot */}
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: r.color || '#3B82F6',
                                mr: 1.5,
                                flexShrink: 0,
                              }}
                            />
                            {/* Input text */}
                            <input
                              type="text"
                              value={r.label}
                              onChange={(e) =>
                                handleUpdateRatingLabelText(q.id, rIdx, e.target.value)
                              }
                              placeholder="Enter rating label"
                              style={{
                                flex: 1,
                                height: '100%',
                                border: 'none',
                                outline: 'none',
                                background: 'transparent',
                                fontSize: '13.5px',
                                fontFamily: 'Inter, system-ui, sans-serif',
                                color: '#1E293B',
                                padding: 0,
                              }}
                            />
                            {arr.length > 2 && (
                              <IconButton
                                size="sm"
                                variant="plain"
                                title="Delete Rating Level"
                                onClick={() => handleDeleteRatingLabel(q.id, rIdx)}
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '6px',
                                  color: '#94A3B8',
                                  ml: 1,
                                  '&:hover': {
                                    bgcolor: '#FEE2E2',
                                    color: '#DC2626',
                                  },
                                }}
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    {/* + Add Rating pill button matching screenshot */}
                    <Button
                      variant="plain"
                      onClick={() => handleAddRatingLabel(q.id)}
                      startDecorator={
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      }
                      sx={{
                        height: 36,
                        px: 2,
                        borderRadius: '8px',
                        bgcolor: '#FAF5FF',
                        border: '1px solid #E9D5FF',
                        color: '#7C3AED',
                        fontSize: '13px',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: '#F3E8FF',
                          borderColor: '#DDD6FE',
                          color: '#6D28D9',
                        },
                      }}
                    >
                      Add Rating
                    </Button>
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          {/* Right-aligned + Add Question pill button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button
              variant="plain"
              onClick={handleAddQuestion}
              sx={{
                bgcolor: '#F5F3FF',
                color: '#7C3AED',
                fontWeight: 600,
                fontSize: '13.5px',
                borderRadius: '8px',
                border: '1px solid #EDE9FE',
                py: 1,
                px: 2.25,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                '&:hover': {
                  bgcolor: '#EDE9FE',
                  color: '#6D28D9',
                },
              }}
            >
              <FiPlus size={15} />
              Add Question
            </Button>
          </Box>

          {/* Form Actions Footer Matching Theme (media_1790073342860.png) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              mt: 2,
              pt: 2.5,
              borderTop: '1px solid #F1F5F9',
            }}
          >
            <Typography level="body-xs" sx={{ color: '#64748B', fontSize: '12px' }}>
              * Survey title and questions are required
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {onBack && (
                <Button
                  variant="outlined"
                  onClick={onBack}
                  sx={{
                    borderColor: '#E2E8F0',
                    bgcolor: '#FFFFFF',
                    color: '#1E293B',
                    fontWeight: 600,
                    fontSize: '13px',
                    borderRadius: '8px',
                    px: 2.5,
                    py: 1,
                    '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' },
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSave}
                endDecorator={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                }
                sx={{
                  fontWeight: 600,
                  fontSize: '13.5px',
                  borderRadius: '8px',
                  bgcolor: '#7C3AED',
                  color: '#FFFFFF',
                  px: 3,
                  py: 1,
                  boxShadow: '0 2px 6px rgba(124, 58, 237, 0.28)',
                  '&:hover': {
                    bgcolor: '#6D28D9',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.38)',
                  },
                }}
              >
                Save Exit Interview
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
