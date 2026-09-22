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
  Divider,
} from '@mui/joy';
import { FiPlus, FiTrash2, FiX, FiSparkles } from 'react-icons/fi';

export interface ExitQuestionItem {
  id: string;
  title: string;
  type: string;
  placeholder?: string;
  options?: string[];
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

const INITIAL_QUESTIONS: ExitQuestionItem[] = [
  {
    id: 'q1',
    title: 'What was the primary reason for deciding to leave?',
    type: 'single_select',
    placeholder: 'Select primary departure driver',
    options: [
      'Career advancement',
      'Higher compensation',
      'Work-life balance',
      'Relocation / Family',
      'Leadership & management',
      'Other',
    ],
  },
  {
    id: 'q2',
    title: 'How would you rate your overall work experience and environment?',
    type: 'rating',
    placeholder: 'Rate from 1 to 5 stars',
  },
  {
    id: 'q3',
    title: 'Did your direct line manager provide regular support and guidance?',
    type: 'rating',
    placeholder: 'Rate managerial support',
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
        type: 'single_select',
        placeholder: 'Select primary departure driver',
        options: [
          'Better opportunity',
          'Compensation & benefits',
          'Career change',
          'Relocation / Family',
          'Work environment',
        ],
      },
      {
        id: `q_${Date.now()}_2`,
        title: 'How would you rate team camaraderie and departmental cooperation?',
        type: 'rating',
        placeholder: 'Rate from 1 to 5 stars',
      },
      {
        id: `q_${Date.now()}_3`,
        title: 'Did your Line Manager provide constructive shift feedback and support?',
        type: 'rating',
        placeholder: 'Rate managerial leadership',
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
      type: 'rating',
      placeholder: 'Enter Placeholder',
      options: ['Option 1', 'Option 2'],
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
        if (
          field === 'type' &&
          (val === 'single_select' || val === 'multi_select') &&
          (!updated.options || updated.options.length === 0)
        ) {
          updated.options = ['Option 1', 'Option 2'];
        }
        return updated;
      })
    );
  };

  const handleAddOption = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const opts = q.options ? [...q.options] : [];
        opts.push(`Option ${opts.length + 1}`);
        return { ...q, options: opts };
      })
    );
  };

  const handleUpdateOption = (qId: string, optIdx: number, val: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId || !q.options) return q;
        const opts = [...q.options];
        opts[optIdx] = val;
        return { ...q, options: opts };
      })
    );
  };

  const handleDeleteOption = (qId: string, optIdx: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId || !q.options) return q;
        if (q.options.length <= 1) {
          showToast('Select question requires at least one option.');
          return q;
        }
        const opts = q.options.filter((_, i) => i !== optIdx);
        return { ...q, options: opts };
      })
    );
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
        {/* Form Header: Archetype A */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 2,
            borderBottom: '1px solid #F1F5F9',
            mb: 2.5,
            gap: 1.5,
          }}
        >
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
              sx={{ color: '#64748B', mt: 0.25, fontSize: '12.5px' }}
            >
              Configure the exit interview questionnaire for departing employees
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Button
              size="sm"
              onClick={handleDraftHyIq}
              startDecorator={<FiSparkles />}
              sx={{
                background:
                  'linear-gradient(135deg, #7C3AED 0%, #6366F1 55%, #4F46E5 100%)',
                color: '#FFFFFF',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '12px',
                px: 1.75,
                py: 0.75,
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow:
                  '0 4px 14px -2px rgba(124, 58, 237, 0.42), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 55%, #4338CA 100%)',
                },
              }}
            >
              Draft with HyIQ
            </Button>

            {onBack && (
              <IconButton
                size="sm"
                variant="outlined"
                onClick={onBack}
                sx={{
                  color: '#64748B',
                  borderColor: '#E2E8F0',
                  borderRadius: '8px',
                  '&:hover': { bgcolor: '#F1F5F9', color: '#0F172A' },
                }}
              >
                <FiX />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Form Body */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
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

          {/* Title with Character Counter */}
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
                Title
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
              Configured for leaver survey
            </Typography>
          </Box>

          {/* Questions List Matching Screenshot media_1790069447703.png */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {questions.map((q, idx) => (
              <Box key={q.id}>
                {/* Header: Question N + Delete & Grip */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5,
                  }}
                >
                  <Typography
                    level="title-sm"
                    sx={{ fontWeight: 700, color: '#1E293B', fontSize: '15px' }}
                  >
                    Question {idx + 1}
                  </Typography>

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
                      title="Reorder Question"
                      sx={{
                        width: 26,
                        height: 26,
                        display: 'grid',
                        placeItems: 'center',
                        color: '#94A3B8',
                        cursor: 'grab',
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

                {/* Row 1: Title * and Type * */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                    mb: 1.75,
                  }}
                >
                  <FormControl required>
                    <FormLabel sx={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                      Title <span style={{ color: '#DC2626' }}>*</span>
                    </FormLabel>
                    <Input
                      value={q.title}
                      onChange={(e) => handleUpdateQuestion(q.id, 'title', e.target.value)}
                      placeholder={`Question ${idx + 1}`}
                      sx={{
                        borderRadius: '8px',
                        borderColor: '#E2E8F0',
                        fontSize: '13.5px',
                        height: '42px',
                        bgcolor: '#FFFFFF',
                        '&:focus-within': { borderColor: '#7C3AED' },
                      }}
                    />
                  </FormControl>

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
                        bgcolor: '#FFFFFF',
                        '&:focus-within': { borderColor: '#7C3AED' },
                      }}
                    >
                      <Option value="rating">rating</Option>
                      <Option value="text">text</Option>
                      <Option value="single_select">single_select</Option>
                      <Option value="multi_select">multi_select</Option>
                      <Option value="scale">scale</Option>
                      <Option value="yes_no">yes_no</Option>
                    </Select>
                  </FormControl>
                </Box>

                {/* Row 2: Placeholder (Matches Title width) */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                    mb: 1.5,
                  }}
                >
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
                        bgcolor: '#FFFFFF',
                        '&:focus-within': { borderColor: '#7C3AED' },
                      }}
                    />
                  </FormControl>
                </Box>

                {/* Options Builder for Select Questions */}
                {(q.type === 'single_select' || q.type === 'multi_select') && (
                  <Box
                    sx={{
                      mt: 1,
                      mb: 1.5,
                      p: 1.5,
                      bgcolor: '#F8FAFC',
                      border: '1px dashed #CBD5E1',
                      borderRadius: '8px',
                    }}
                  >
                    <Typography
                      level="body-xs"
                      sx={{ fontWeight: 600, color: '#475569', mb: 1 }}
                    >
                      Options / Choices
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {(q.options || ['Option 1', 'Option 2']).map((opt, optIdx) => (
                        <Box
                          key={optIdx}
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Input
                            value={opt}
                            onChange={(e) => handleUpdateOption(q.id, optIdx, e.target.value)}
                            placeholder={`Option ${optIdx + 1}`}
                            sx={{
                              height: '36px',
                              fontSize: '12.5px',
                              borderRadius: '6px',
                              borderColor: '#CBD5E1',
                              flex: 1,
                            }}
                          />
                          <IconButton
                            size="sm"
                            variant="plain"
                            onClick={() => handleDeleteOption(q.id, optIdx)}
                            title="Remove option"
                            sx={{
                              width: 28,
                              height: 28,
                              color: '#94A3B8',
                              '&:hover': { color: '#DC2626', bgcolor: '#FEE2E2' },
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="9" />
                              <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                    <Button
                      size="sm"
                      variant="plain"
                      onClick={() => handleAddOption(q.id)}
                      sx={{
                        mt: 1,
                        p: 0,
                        color: '#7C3AED',
                        fontSize: '12px',
                        fontWeight: 600,
                        minHeight: 0,
                        '&:hover': { bgcolor: 'transparent', color: '#6D28D9' },
                      }}
                    >
                      + Add Option
                    </Button>
                  </Box>
                )}

                {/* Question Divider */}
                {idx < questions.length - 1 && (
                  <Divider sx={{ my: 2, borderColor: '#F1F5F9' }} />
                )}
              </Box>
            ))}
          </Box>

          {/* Divider above + Add Question */}
          <Divider sx={{ my: 0.5, borderColor: '#E2E8F0' }} />

          {/* Right-aligned + Add Question pill button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 0.5 }}>
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
                '&:hover': {
                  bgcolor: '#EDE9FE',
                  color: '#6D28D9',
                },
              }}
            >
              + Add Question
            </Button>
          </Box>

          {/* Divider below + Add Question */}
          <Divider sx={{ my: 0.5, borderColor: '#E2E8F0' }} />

          {/* Footer Actions: Cancel and Add */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 2,
              pt: 0.5,
            }}
          >
            {onBack && (
              <Button
                variant="plain"
                onClick={onBack}
                sx={{
                  color: '#1E293B',
                  fontWeight: 600,
                  fontSize: '14px',
                  p: 1,
                  '&:hover': { bgcolor: '#F1F5F9', color: '#475569' },
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSave}
              sx={{
                fontWeight: 600,
                fontSize: '14px',
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
              Add
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
