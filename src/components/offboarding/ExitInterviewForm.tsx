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
    type: 'Single Select',
    placeholder: 'e.g. Career growth, relocation, compensation...',
  },
  {
    id: 'q2',
    title: 'How would you rate your overall work experience and environment?',
    type: 'Rating',
    placeholder: 'Rate from 1 to 5 stars',
  },
  {
    id: 'q3',
    title: 'How was the support and communication from your direct manager?',
    type: 'Rating',
    placeholder: 'Rate managerial guidance and feedback',
  },
  {
    id: 'q4',
    title: 'What constructive suggestions do you have to improve our workplace?',
    type: 'Paragraph Text',
    placeholder: 'Share your candid suggestions for leadership...',
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
        type: 'Single Select',
        placeholder: 'Select primary departure driver',
      },
      {
        id: `q_${Date.now()}_2`,
        title: 'How would you rate team camaraderie and departmental cooperation?',
        type: 'Rating',
        placeholder: 'Rate from 1 to 5 stars',
      },
      {
        id: `q_${Date.now()}_3`,
        title: 'Did your Line Manager provide constructive shift feedback and support?',
        type: 'Rating',
        placeholder: 'Rate managerial leadership',
      },
      {
        id: `q_${Date.now()}_4`,
        title: 'What should our leadership team change or prioritize going forward?',
        type: 'Paragraph Text',
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
      type: 'Rating',
      placeholder: '',
    };
    setQuestions([...questions, newQ]);
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) {
      showToast('Survey requires at least one question.');
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleUpdateQuestion = (
    id: string,
    field: keyof ExitQuestionItem,
    val: string
  ) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: val } : q))
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
    showToast('Exit Interview Form saved successfully!');
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

          {/* Questions List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {questions.map((q, idx) => (
              <Box
                key={q.id}
                sx={{
                  bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  p: 2,
                  transition: 'border-color 0.15s',
                  '&:hover': { borderColor: '#CBD5E1' },
                }}
              >
                {/* Question Row Top Bar */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5,
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
                        fontSize: '11.5px',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography level="title-sm" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '13px' }}>
                      Question {idx + 1}
                    </Typography>
                  </Box>

                  <IconButton
                    size="sm"
                    variant="plain"
                    color="danger"
                    onClick={() => handleDeleteQuestion(q.id)}
                    sx={{
                      borderRadius: '6px',
                      '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' },
                    }}
                  >
                    <FiTrash2 size={14} />
                  </IconButton>
                </Box>

                {/* Question Inputs */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  <FormControl required>
                    <FormLabel sx={{ fontSize: '12px', fontWeight: 600, color: '#475569', mb: 0.5 }}>
                      Title
                    </FormLabel>
                    <Input
                      value={q.title}
                      onChange={(e) => handleUpdateQuestion(q.id, 'title', e.target.value)}
                      placeholder="Enter question..."
                      sx={{
                        borderRadius: '7px',
                        borderColor: '#CBD5E1',
                        fontSize: '12.5px',
                        height: '38px',
                        bgcolor: '#FFFFFF',
                      }}
                    />
                  </FormControl>

                  <FormControl required>
                    <FormLabel sx={{ fontSize: '12px', fontWeight: 600, color: '#475569', mb: 0.5 }}>
                      Type
                    </FormLabel>
                    <Select
                      value={q.type}
                      onChange={(_, val) => val && handleUpdateQuestion(q.id, 'type', val)}
                      sx={{
                        borderRadius: '7px',
                        borderColor: '#CBD5E1',
                        fontSize: '12.5px',
                        height: '38px',
                        bgcolor: '#FFFFFF',
                      }}
                    >
                      <Option value="Single Select">Single Select</Option>
                      <Option value="Rating">Rating (1-5 Stars)</Option>
                      <Option value="Multiple Choice">Multiple Choice</Option>
                      <Option value="Paragraph Text">Paragraph Text</Option>
                      <Option value="Yes / No">Yes / No</Option>
                    </Select>
                  </FormControl>
                </Box>

                <FormControl>
                  <FormLabel sx={{ fontSize: '12px', fontWeight: 600, color: '#475569', mb: 0.5 }}>
                    Placeholder
                  </FormLabel>
                  <Input
                    value={q.placeholder || ''}
                    onChange={(e) => handleUpdateQuestion(q.id, 'placeholder', e.target.value)}
                    placeholder="Optional field placeholder for colleague..."
                    sx={{
                      borderRadius: '7px',
                      borderColor: '#CBD5E1',
                      fontSize: '12.5px',
                      height: '38px',
                      bgcolor: '#FFFFFF',
                    }}
                  />
                </FormControl>
              </Box>
            ))}
          </Box>

          {/* Add Question Button */}
          <Button
            variant="outlined"
            onClick={handleAddQuestion}
            startDecorator={<FiPlus />}
            sx={{
              borderStyle: 'dashed',
              borderColor: '#C4B5FD',
              bgcolor: '#F5F3FF',
              color: '#7C3AED',
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '10px',
              py: 1.25,
              '&:hover': {
                bgcolor: '#EDE9FE',
                borderColor: '#7C3AED',
              },
            }}
          >
            Add Question
          </Button>
        </Box>

        {/* Footer Actions */}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
          {onBack && (
            <Button
              variant="outlined"
              color="neutral"
              onClick={onBack}
              sx={{
                fontWeight: 500,
                fontSize: '13px',
                borderRadius: '8px',
                borderColor: '#CBD5E1',
                color: '#475569',
                px: 2.25,
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSave}
            sx={{
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '8px',
              bgcolor: '#7C3AED',
              color: '#FFFFFF',
              px: 2.75,
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
              '&:hover': {
                bgcolor: '#6D28D9',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)',
              },
            }}
          >
            Save Exit Interview
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
