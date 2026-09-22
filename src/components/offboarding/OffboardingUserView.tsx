import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Checkbox,
  Textarea,
  Input,
  Alert,
  Modal,
  ModalDialog,
  ModalClose,
} from '@mui/joy';
import {
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiFileText,
  FiSend,
  FiShield,
  FiDollarSign,
  FiDownload,
  FiHelpCircle,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiStar,
  FiCheck,
  FiInfo,
  FiExternalLink,
} from 'react-icons/fi';
import { OffboardingCase } from './types';

export interface OffboardingUserViewProps {
  caseData?: OffboardingCase;
  onBackToAdmin?: () => void;
}

interface UserTask {
  id: string;
  category: 'handover' | 'assets' | 'clearance';
  title: string;
  subtitle: string;
  department: string;
  completed: boolean;
  dueDate: string;
  required: boolean;
}

const INITIAL_USER_TASKS: UserTask[] = [
  // Operational Handover
  {
    id: 'tsk-1',
    category: 'handover',
    title: 'Complete Opera PMS Shift Handover Checklist',
    subtitle: 'Transfer ongoing guest folios, group reservations, and room assignment notes to Omar Haddad.',
    department: 'Front Office',
    completed: true,
    dueDate: '10 Oct 2026',
    required: true,
  },
  {
    id: 'tsk-2',
    category: 'handover',
    title: 'Transfer Master Rosters & Department Contacts',
    subtitle: 'Share duty manager scheduling templates, emergency contact trees, and vendor contact books.',
    department: 'Front Office',
    completed: true,
    dueDate: '11 Oct 2026',
    required: true,
  },
  {
    id: 'tsk-3',
    category: 'handover',
    title: 'Handover VIP Guest Profiles & Ongoing Escalations',
    subtitle: 'Walk through repeat IHG One Rewards Diamond members preferences and pending guest service inquiries.',
    department: 'Front Office',
    completed: false,
    dueDate: '13 Oct 2026',
    required: true,
  },

  // Physical Assets Return
  {
    id: 'tsk-4',
    category: 'assets',
    title: 'Master Front Office Keycards & Override Keys',
    subtitle: 'Surrender all master magnetic cards and physical emergency brass keys to Hotel Security.',
    department: 'Security & Safety',
    completed: false,
    dueDate: '14 Oct 2026',
    required: true,
  },
  {
    id: 'tsk-5',
    category: 'assets',
    title: 'Official Hotel Uniforms & Name Badges',
    subtitle: 'Dry clean and return 3 sets of Front Office blazer uniforms to Housekeeping Linen Room.',
    department: 'Housekeeping',
    completed: false,
    dueDate: '14 Oct 2026',
    required: true,
  },
  {
    id: 'tsk-6',
    category: 'assets',
    title: 'Staff Locker Key & Employee ID Access Card',
    subtitle: 'Clear personal effects from B2 locker #114 and surrender locker key and biometric card to HR.',
    department: 'People Operations',
    completed: false,
    dueDate: '14 Oct 2026',
    required: true,
  },
  {
    id: 'tsk-7',
    category: 'assets',
    title: 'Motorola Two-Way Radio & Duty Smartphone',
    subtitle: 'Return duty communication handset, wireless earpiece, and charging dock in good working order.',
    department: 'IT & Operations',
    completed: true,
    dueDate: '12 Oct 2026',
    required: false,
  },

  // Clearances & Formalities
  {
    id: 'tsk-8',
    category: 'clearance',
    title: 'IT Systems & Multi-Factor Access Revocation',
    subtitle: 'Formal verification of Oracle Opera PMS, Micros POS, and corporate email de-provisioning.',
    department: 'Information Technology',
    completed: false,
    dueDate: '14 Oct 2026',
    required: true,
  },
  {
    id: 'tsk-9',
    category: 'clearance',
    title: 'Finance & Front Office Petty Cash Reconciliation',
    subtitle: 'Audit AED 5,000 front desk float with Accounts. Settle any personal laundry or cafeteria balance.',
    department: 'Finance & Accounts',
    completed: false,
    dueDate: '13 Oct 2026',
    required: true,
  },
  {
    id: 'tsk-10',
    category: 'clearance',
    title: 'Staff Accommodation Checkout & Utilities Clearance',
    subtitle: 'Complete inspection of Al Barsha Staff Residence Unit #402. Return access gate transponder.',
    department: 'Housing & Facilities',
    completed: false,
    dueDate: '12 Oct 2026',
    required: false,
  },
  {
    id: 'tsk-11',
    category: 'clearance',
    title: 'UAE Residence Visa Cancellation & Medical Clearance',
    subtitle: 'Sign MOHRE cancellation agreement form and attend passport typing at Dubai Al Jafiliya Center.',
    department: 'PRO & Government Relations',
    completed: false,
    dueDate: '14 Oct 2026',
    required: true,
  },
];

interface ExitSurveyState {
  experienceRating: number;
  managementRating: number;
  handoverRating: number;
  recommendRating: number;
  primaryReason: string;
  constructiveFeedback: string;
  submitted: boolean;
  submittedAt?: string;
}

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'When will my UAE Residence Visa and Medical Insurance be cancelled?',
    a: 'Your residence visa cancellation will be initiated 2 business days prior to your last working day (12 Oct 2026). You will receive your official electronic cancellation paper upon signature of the final settlement. Your DHA medical insurance remains active until midnight of your last official working day.',
    category: 'Immigration & Medical',
  },
  {
    q: 'How long do I have to exit or transfer visa under UAE Labour Law?',
    a: 'Under UAE Federal Decree-Law No. 33 of 2021, skilled categories (levels 1-3 including Front Desk Manager) are entitled to a 60-day grace period following visa cancellation to either exit the UAE or have a new employer sponsor their work permit.',
    category: 'Immigration & Medical',
  },
  {
    q: 'When will my Final Settlement (EOSB) and Leave Encashment be credited?',
    a: 'Final settlements are processed through WPS (Wages Protection System) into your Emirates NBD salary account within 14 calendar days of your last working day, following the receipt of all departmental clearances.',
    category: 'Settlement & Finance',
  },
  {
    q: 'What happens to my IHG Employee Room Benefits & Employee Rate privileges?',
    a: 'IHG Employee Rate privileges remain active until your final working day. Any reservations booked for dates beyond 14 Oct 2026 will automatically revert to standard Best Flexible Rates or may be rebooked as Friends & Family rates if eligible.',
    category: 'Company Benefits',
  },
  {
    q: 'How do I obtain my official Experience Certificate and Relieving Letter?',
    a: 'Your stamped and digitally signed Experience Certificate and Relieving Letter will be generated instantly upon submission of your signed final clearance and will be accessible directly in the "Final Settlement & Docs" tab for download.',
    category: 'Documentation',
  },
];

export const OffboardingUserView: React.FC<OffboardingUserViewProps> = ({
  caseData,
  onBackToAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'survey' | 'settlement' | 'faqs'>('checklist');
  const [tasks, setTasks] = useState<UserTask[]>(INITIAL_USER_TASKS);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Exit Survey Form State
  const [survey, setSurvey] = useState<ExitSurveyState>({
    experienceRating: 5,
    managementRating: 4,
    handoverRating: 5,
    recommendRating: 5,
    primaryReason: 'Career progression opportunity in a luxury resort group in Dubai Marina.',
    constructiveFeedback: 'Crowne Plaza Dubai has been an extraordinary growth chapter. The front office team is brilliant. Recommend accelerating front desk digital tablet check-in.',
    submitted: false,
  });

  // Modals State
  const [isCoordinatorModalOpen, setIsCoordinatorModalOpen] = useState<boolean>(false);
  const [coordinatorMessage, setCoordinatorMessage] = useState<string>('');
  const [previewDocTitle, setPreviewDocTitle] = useState<string | null>(null);

  // Forwarding contact details state
  const [contactInfo, setContactInfo] = useState({
    personalEmail: 'sara.khan.dxb@gmail.com',
    personalPhone: '+971 50 892 4110',
    forwardingCity: 'Dubai, United Arab Emirates',
  });
  const [contactSaved, setContactSaved] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
    const target = tasks.find((t) => t.id === taskId);
    if (target) {
      showToast(target.completed ? `Task marked incomplete: ${target.title}` : `✓ Completed: ${target.title}`);
    }
  };

  // Calculate task counts
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round(
    ((completedTasks + (survey.submitted ? 2 : 0)) / (totalTasks + 2)) * 100
  );

  // Submit survey handler
  const handleSubmitSurvey = () => {
    setSurvey((prev) => ({
      ...prev,
      submitted: true,
      submittedAt: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
    showToast('✓ Exit survey submitted securely to People Operations.');
  };

  // Send message to HR coordinator
  const handleSendCoordinatorMessage = () => {
    if (!coordinatorMessage.trim()) return;
    setIsCoordinatorModalOpen(false);
    setCoordinatorMessage('');
    showToast('✓ Message transmitted to Mariam Vance (People Operations Coordinator).');
  };

  return (
    <Box
      sx={{
        width: '100%',
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

      {/* 1. Context Ribbon (Employee Portal Banner) */}
      <Box
        sx={{
          bgcolor: '#FAF5FF',
          border: '1px solid #E9D5FF',
          borderRadius: '12px',
          px: { xs: 2, md: 2.5 },
          py: 1.25,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#16A34A',
              boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.2)',
            }}
          />
          <Typography sx={{ fontSize: '12.5px', fontWeight: 600, color: '#6B21A8' }}>
            Employee Offboarding Portal · Crowne Plaza Dubai
          </Typography>
          <Chip
            size="sm"
            variant="soft"
            color="primary"
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 600,
              fontSize: '11px',
              bgcolor: '#EDE9FE',
              color: '#7C3AED',
            }}
          >
            Viewing from Employee Session (Sara Khan)
          </Chip>
        </Box>

        {onBackToAdmin && (
          <Button
            size="sm"
            variant="plain"
            onClick={onBackToAdmin}
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#7C3AED',
              p: 0,
              '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' },
            }}
          >
            Switch back to HR Admin View →
          </Button>
        )}
      </Box>

      {/* 2. Leaver Status Hero Card */}
      <Card
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: '16px',
          border: '1px solid #E5E7EF',
          bgcolor: '#FFFFFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', lg: 'center' },
            gap: 2.5,
          }}
        >
          {/* Left: Employee Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: '#7C3AED',
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
              }}
            >
              SK
            </Avatar>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                  Sara Khan
                </Typography>
                <Chip
                  size="sm"
                  sx={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    fontSize: '11px',
                    bgcolor: '#F1F5F9',
                    color: '#475569',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  FDM-01
                </Chip>
                <Chip
                  size="sm"
                  variant="soft"
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: '11px',
                    bgcolor: '#FEF3C7',
                    color: '#B45309',
                  }}
                >
                  Serving Notice · 29 Days Left
                </Chip>
              </Box>

              <Typography sx={{ fontSize: '13px', color: '#64748B', mt: 0.5 }}>
                Front Desk Manager · Front Office · Crowne Plaza Dubai
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1, fontSize: '12px', color: '#64748B' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FiCalendar size={13} color="#94A3B8" />
                  <span>Resigned: <strong>14 Sep 2026</strong></span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FiClock size={13} color="#7C3AED" />
                  <span>Last Working Day: <strong style={{ color: '#7C3AED' }}>14 Oct 2026</strong></span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FiUser size={13} color="#94A3B8" />
                  <span>Successor: <strong>Omar Haddad</strong></span>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right: Departure Readiness Meter */}
          <Box
            sx={{
              minWidth: { xs: '100%', sm: '260px' },
              p: 2,
              borderRadius: '12px',
              bgcolor: '#FAF5FF',
              border: '1px solid #E9D5FF',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '12.5px', fontWeight: 700, color: '#581C87' }}>
                Departure Readiness
              </Typography>
              <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 800, color: '#7C3AED' }}>
                {progressPercent}%
              </Typography>
            </Box>
            <LinearProgress
              determinate
              value={progressPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#DDD6FE',
                '--LinearProgress-progressColor': '#7C3AED',
              }}
            />
            <Typography sx={{ fontSize: '11px', color: '#6B21A8', mt: 1 }}>
              {completedTasks} of {totalTasks} clearance tasks verified
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* 3. 5-Milestone Journey Stepper */}
      <Card
        sx={{
          p: 2.5,
          borderRadius: '16px',
          border: '1px solid #E5E7EF',
          bgcolor: '#FFFFFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', mb: 2 }}>
          Your Offboarding Journey
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
            gap: 1.5,
          }}
        >
          {/* Milestone 1 */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              border: '1px solid #BBF7D0',
              bgcolor: '#F0FDF4',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                Milestone 1
              </Typography>
              <FiCheckCircle size={14} color="#16A34A" />
            </Box>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#14532D' }}>
              Notice Submitted
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#15803D', mt: 0.5 }}>
              14 Sep 2026 · Approved
            </Typography>
          </Box>

          {/* Milestone 2 */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              border: '1px solid #DDD6FE',
              bgcolor: '#FAF5FF',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#6B21A8', textTransform: 'uppercase' }}>
                Milestone 2
              </Typography>
              <Chip size="sm" sx={{ fontSize: '10px', bgcolor: '#7C3AED', color: '#FFFFFF', fontWeight: 700, height: '18px' }}>
                ACTIVE
              </Chip>
            </Box>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#581C87' }}>
              Notice Period
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#7C3AED', mt: 0.5 }}>
              29 Days Remaining
            </Typography>
          </Box>

          {/* Milestone 3 */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              bgcolor: '#F8FAFC',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Milestone 3
              </Typography>
              <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700, color: '#7C3AED' }}>
                {completedTasks}/{totalTasks}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
              Clearances & Handover
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#64748B', mt: 0.5 }}>
              Due by 14 Oct 2026
            </Typography>
          </Box>

          {/* Milestone 4 */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              border: survey.submitted ? '1px solid #BBF7D0' : '1px solid #FED7AA',
              bgcolor: survey.submitted ? '#F0FDF4' : '#FFF7ED',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: survey.submitted ? '#166534' : '#C2410C', textTransform: 'uppercase' }}>
                Milestone 4
              </Typography>
              {survey.submitted ? (
                <FiCheckCircle size={14} color="#16A34A" />
              ) : (
                <Chip size="sm" sx={{ fontSize: '10px', bgcolor: '#F97316', color: '#FFFFFF', fontWeight: 700, height: '18px' }}>
                  PENDING
                </Chip>
              )}
            </Box>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: survey.submitted ? '#14532D' : '#9A3412' }}>
              Exit Survey
            </Typography>
            <Typography sx={{ fontSize: '11px', color: survey.submitted ? '#15803D' : '#C2410C', mt: 0.5 }}>
              {survey.submitted ? 'Submitted ✓' : 'Feedback Requested'}
            </Typography>
          </Box>

          {/* Milestone 5 */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              bgcolor: '#F8FAFC',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Milestone 5
              </Typography>
              <FiClock size={14} color="#94A3B8" />
            </Box>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
              Final Settlement
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#64748B', mt: 0.5 }}>
              Scheduled for 14 Oct
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* 4. Main 2-Column Section: 4 Tabs & Content (Left) + Persistent HR Support (Right) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
          gap: 2.5,
          alignItems: 'start',
        }}
      >
        {/* Left: Tabbed Workspace */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Lavender Signature Tabstrip */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: '#EEE9FD',
              p: 0.75,
              borderRadius: '12px',
              overflowX: 'auto',
            }}
          >
            <Button
              size="sm"
              variant={activeTab === 'checklist' ? 'solid' : 'plain'}
              onClick={() => setActiveTab('checklist')}
              sx={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '8px',
                bgcolor: activeTab === 'checklist' ? '#7C3AED' : 'transparent',
                color: activeTab === 'checklist' ? '#FFFFFF' : '#4C1D95',
                '&:hover': {
                  bgcolor: activeTab === 'checklist' ? '#6D28D9' : 'rgba(124, 58, 237, 0.08)',
                },
              }}
            >
              Tasks & Handover ({completedTasks}/{totalTasks})
            </Button>

            <Button
              size="sm"
              variant={activeTab === 'survey' ? 'solid' : 'plain'}
              onClick={() => setActiveTab('survey')}
              sx={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '8px',
                bgcolor: activeTab === 'survey' ? '#7C3AED' : 'transparent',
                color: activeTab === 'survey' ? '#FFFFFF' : '#4C1D95',
                '&:hover': {
                  bgcolor: activeTab === 'survey' ? '#6D28D9' : 'rgba(124, 58, 237, 0.08)',
                },
              }}
            >
              Exit Survey {survey.submitted ? '✓' : '(Action Req.)'}
            </Button>

            <Button
              size="sm"
              variant={activeTab === 'settlement' ? 'solid' : 'plain'}
              onClick={() => setActiveTab('settlement')}
              sx={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '8px',
                bgcolor: activeTab === 'settlement' ? '#7C3AED' : 'transparent',
                color: activeTab === 'settlement' ? '#FFFFFF' : '#4C1D95',
                '&:hover': {
                  bgcolor: activeTab === 'settlement' ? '#6D28D9' : 'rgba(124, 58, 237, 0.08)',
                },
              }}
            >
              Final Settlement & Docs
            </Button>

            <Button
              size="sm"
              variant={activeTab === 'faqs' ? 'solid' : 'plain'}
              onClick={() => setActiveTab('faqs')}
              sx={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '8px',
                bgcolor: activeTab === 'faqs' ? '#7C3AED' : 'transparent',
                color: activeTab === 'faqs' ? '#FFFFFF' : '#4C1D95',
                '&:hover': {
                  bgcolor: activeTab === 'faqs' ? '#6D28D9' : 'rgba(124, 58, 237, 0.08)',
                },
              }}
            >
              FAQs & Policies
            </Button>
          </Box>

          {/* TAB 1: Tasks & Handover */}
          {activeTab === 'checklist' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Group A: Handover to Successor */}
              <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E5E7EF', bgcolor: '#FFFFFF' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#7C3AED' }} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                      1. Operational Handover to Omar Haddad
                    </Typography>
                  </Box>
                  <Chip size="sm" sx={{ bgcolor: '#F5F3FF', color: '#7C3AED', fontWeight: 600 }}>
                    Front Office
                  </Chip>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  {tasks
                    .filter((t) => t.category === 'handover')
                    .map((t) => (
                      <Box
                        key={t.id}
                        onClick={() => handleToggleTask(t.id)}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: '10px',
                          border: t.completed ? '1px solid #DCFCE7' : '1px solid #E2E8F0',
                          bgcolor: t.completed ? '#F0FDF4' : '#F8FAFC',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': { bgcolor: t.completed ? '#DCFCE7' : '#F1F5F9' },
                        }}
                      >
                        <Checkbox
                          checked={t.completed}
                          color="primary"
                          sx={{ mt: 0.25 }}
                          onChange={() => handleToggleTask(t.id)}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: '13px',
                              fontWeight: 600,
                              color: t.completed ? '#15803D' : '#0F172A',
                              textDecoration: t.completed ? 'line-through' : 'none',
                            }}
                          >
                            {t.title}
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.25 }}>
                            {t.subtitle}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1.5, mt: 0.75, fontSize: '11px', color: '#94A3B8' }}>
                            <span>Due: {t.dueDate}</span>
                            <span>·</span>
                            <span>Owner: Sara Khan</span>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                </Box>
              </Card>

              {/* Group B: Physical Assets Return */}
              <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E5E7EF', bgcolor: '#FFFFFF' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#0284C7' }} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                      2. Physical Assets Return & Security Handover
                    </Typography>
                  </Box>
                  <Chip size="sm" sx={{ bgcolor: '#F0F9FF', color: '#0284C7', fontWeight: 600 }}>
                    Admin & Security
                  </Chip>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  {tasks
                    .filter((t) => t.category === 'assets')
                    .map((t) => (
                      <Box
                        key={t.id}
                        onClick={() => handleToggleTask(t.id)}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: '10px',
                          border: t.completed ? '1px solid #DCFCE7' : '1px solid #E2E8F0',
                          bgcolor: t.completed ? '#F0FDF4' : '#F8FAFC',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': { bgcolor: t.completed ? '#DCFCE7' : '#F1F5F9' },
                        }}
                      >
                        <Checkbox
                          checked={t.completed}
                          color="primary"
                          sx={{ mt: 0.25 }}
                          onChange={() => handleToggleTask(t.id)}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: '13px',
                              fontWeight: 600,
                              color: t.completed ? '#15803D' : '#0F172A',
                              textDecoration: t.completed ? 'line-through' : 'none',
                            }}
                          >
                            {t.title}
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.25 }}>
                            {t.subtitle}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1.5, mt: 0.75, fontSize: '11px', color: '#94A3B8' }}>
                            <span>Target: {t.department}</span>
                            <span>·</span>
                            <span>Due: {t.dueDate}</span>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                </Box>
              </Card>

              {/* Group C: Departmental Clearances */}
              <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E5E7EF', bgcolor: '#FFFFFF' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#E11D48' }} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                      3. Clearances & Statutory Formalities
                    </Typography>
                  </Box>
                  <Chip size="sm" sx={{ bgcolor: '#FFF1F2', color: '#E11D48', fontWeight: 600 }}>
                    Legal & HR
                  </Chip>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  {tasks
                    .filter((t) => t.category === 'clearance')
                    .map((t) => (
                      <Box
                        key={t.id}
                        onClick={() => handleToggleTask(t.id)}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: '10px',
                          border: t.completed ? '1px solid #DCFCE7' : '1px solid #E2E8F0',
                          bgcolor: t.completed ? '#F0FDF4' : '#F8FAFC',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': { bgcolor: t.completed ? '#DCFCE7' : '#F1F5F9' },
                        }}
                      >
                        <Checkbox
                          checked={t.completed}
                          color="primary"
                          sx={{ mt: 0.25 }}
                          onChange={() => handleToggleTask(t.id)}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: '13px',
                              fontWeight: 600,
                              color: t.completed ? '#15803D' : '#0F172A',
                              textDecoration: t.completed ? 'line-through' : 'none',
                            }}
                          >
                            {t.title}
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.25 }}>
                            {t.subtitle}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1.5, mt: 0.75, fontSize: '11px', color: '#94A3B8' }}>
                            <span>Dept: {t.department}</span>
                            <span>·</span>
                            <span>Target: {t.dueDate}</span>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                </Box>
              </Card>
            </Box>
          )}

          {/* TAB 2: Exit Survey */}
          {activeTab === 'survey' && (
            <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #E5E7EF', bgcolor: '#FFFFFF' }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                    Confidential Leaver Experience Feedback
                  </Typography>
                  <Chip size="sm" sx={{ bgcolor: '#EDE9FE', color: '#7C3AED', fontWeight: 700 }}>
                    IHG People & Culture
                  </Chip>
                </Box>
                <Typography sx={{ fontSize: '12.5px', color: '#64748B' }}>
                  Your candid feedback helps Crowne Plaza Dubai enhance leadership, employee wellbeing, and workplace culture. All submissions are encrypted and reviewed solely by Corporate HR.
                </Typography>
              </Box>

              {survey.submitted && (
                <Alert
                  color="success"
                  variant="soft"
                  sx={{ mb: 3, borderRadius: '10px' }}
                  startDecorator={<FiCheckCircle size={18} />}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#15803D' }}>
                      Exit Survey Successfully Submitted ({survey.submittedAt})
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#166534', mt: 0.25 }}>
                      Thank you for sharing your thoughts! Your responses have been archived securely for HR review.
                    </Typography>
                  </Box>
                </Alert>
              )}

              {/* Question 1 */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', mb: 1 }}>
                  1. Overall Employee Experience at Crowne Plaza Dubai
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconButton
                      key={star}
                      size="sm"
                      disabled={survey.submitted}
                      onClick={() => setSurvey((p) => ({ ...p, experienceRating: star }))}
                      sx={{
                        color: star <= survey.experienceRating ? '#F59E0B' : '#CBD5E1',
                        '&:hover': { bgcolor: '#FEF3C7' },
                      }}
                    >
                      <FiStar size={20} fill={star <= survey.experienceRating ? '#F59E0B' : 'none'} />
                    </IconButton>
                  ))}
                  <Typography sx={{ fontSize: '12.5px', color: '#64748B', alignSelf: 'center', ml: 1 }}>
                    {survey.experienceRating === 5 ? 'Exceptional (5/5)' : `${survey.experienceRating}/5`}
                  </Typography>
                </Box>
              </Box>

              {/* Question 2 */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', mb: 1 }}>
                  2. Leadership, Management Support & Guidance
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconButton
                      key={star}
                      size="sm"
                      disabled={survey.submitted}
                      onClick={() => setSurvey((p) => ({ ...p, managementRating: star }))}
                      sx={{
                        color: star <= survey.managementRating ? '#F59E0B' : '#CBD5E1',
                        '&:hover': { bgcolor: '#FEF3C7' },
                      }}
                    >
                      <FiStar size={20} fill={star <= survey.managementRating ? '#F59E0B' : 'none'} />
                    </IconButton>
                  ))}
                </Box>
              </Box>

              {/* Question 3 */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', mb: 1 }}>
                  3. Would you recommend Crowne Plaza Dubai as a great workplace?
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconButton
                      key={star}
                      size="sm"
                      disabled={survey.submitted}
                      onClick={() => setSurvey((p) => ({ ...p, recommendRating: star }))}
                      sx={{
                        color: star <= survey.recommendRating ? '#F59E0B' : '#CBD5E1',
                        '&:hover': { bgcolor: '#FEF3C7' },
                      }}
                    >
                      <FiStar size={20} fill={star <= survey.recommendRating ? '#F59E0B' : 'none'} />
                    </IconButton>
                  ))}
                </Box>
              </Box>

              {/* Question 4: Primary Reason */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', mb: 1 }}>
                  4. Primary reason for deciding to move on
                </Typography>
                <Textarea
                  minRows={2}
                  disabled={survey.submitted}
                  value={survey.primaryReason}
                  onChange={(e) => setSurvey((p) => ({ ...p, primaryReason: e.target.value }))}
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '13px',
                    borderRadius: '8px',
                  }}
                />
              </Box>

              {/* Question 5: Suggestions */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', mb: 1 }}>
                  5. Suggestions or recommendations for the Front Office & Hotel Leadership
                </Typography>
                <Textarea
                  minRows={3}
                  disabled={survey.submitted}
                  value={survey.constructiveFeedback}
                  onChange={(e) => setSurvey((p) => ({ ...p, constructiveFeedback: e.target.value }))}
                  sx={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '13px',
                    borderRadius: '8px',
                  }}
                />
              </Box>

              {!survey.submitted && (
                <Button
                  onClick={handleSubmitSurvey}
                  startDecorator={<FiSend size={15} />}
                  sx={{
                    bgcolor: '#7C3AED',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '13px',
                    '&:hover': { bgcolor: '#6D28D9' },
                  }}
                >
                  Submit Confidential Exit Feedback
                </Button>
              )}
            </Card>
          )}

          {/* TAB 3: Final Settlement & Docs */}
          {activeTab === 'settlement' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Financial Calculation Breakdown Card */}
              <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #E5E7EF', bgcolor: '#FFFFFF' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                      Statutory End of Service Benefits (EOSB) Calculation
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.25 }}>
                      Calculated under UAE Federal Decree Law No. 33 of 2021 (Labour Relations)
                    </Typography>
                  </Box>
                  <Chip
                    size="sm"
                    sx={{
                      bgcolor: '#FEF3C7',
                      color: '#B45309',
                      fontWeight: 700,
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  >
                    Estimate · Pending Final Payroll
                  </Chip>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <Typography sx={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                      Basic Salary
                    </Typography>
                    <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 800, color: '#0F172A', mt: 0.5 }}>
                      AED 12,500
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: '#94A3B8', mt: 0.5 }}>
                      Monthly base wage
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <Typography sx={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                      EOSB Gratuity
                    </Typography>
                    <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 800, color: '#15803D', mt: 0.5 }}>
                      AED 27,250
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: '#94A3B8', mt: 0.5 }}>
                      5 yrs 6 mos service
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <Typography sx={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                      Leave Encashment
                    </Typography>
                    <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 800, color: '#0284C7', mt: 0.5 }}>
                      AED 6,240
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: '#94A3B8', mt: 0.5 }}>
                      12.5 accrued days
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#FAF5FF', border: '1px solid #DDD6FE' }}>
                    <Typography sx={{ fontSize: '11.5px', color: '#6B21A8', fontWeight: 700 }}>
                      Net Estimated Payable
                    </Typography>
                    <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '20px', fontWeight: 800, color: '#7C3AED', mt: 0.5 }}>
                      AED 37,590
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: '#7C3AED', mt: 0.5 }}>
                      WPS salary account transfer
                    </Typography>
                  </Box>
                </Box>

                <Alert color="neutral" variant="soft" sx={{ fontSize: '12px', borderRadius: '8px' }}>
                  <FiInfo size={16} />
                  <span>
                    The final net settlement is disbursed within 14 calendar days of your last working day (14 Oct 2026) upon completion of departmental clearances and visa cancellation.
                  </span>
                </Alert>
              </Card>

              {/* Official Documents Generation & Downloads */}
              <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #E5E7EF', bgcolor: '#FFFFFF' }}>
                <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', mb: 2 }}>
                  Official Departure Documentation
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {/* Doc 1 */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      bgcolor: '#F8FAFC',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: '#EDE9FE', display: 'grid', placeItems: 'center', color: '#7C3AED' }}>
                        <FiFileText size={18} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                          Relieving & Service Certificate
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
                          Official verification of tenure (Jan 2021 – Oct 2026) and Front Desk Manager designation.
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="sm"
                        variant="outlined"
                        onClick={() => setPreviewDocTitle('Relieving & Service Certificate')}
                        sx={{ fontSize: '12px', borderRadius: '8px' }}
                      >
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="solid"
                        onClick={() => showToast('📥 Downloading Relieving Certificate (PDF)...')}
                        startDecorator={<FiDownload size={13} />}
                        sx={{ bgcolor: '#7C3AED', fontSize: '12px', borderRadius: '8px', '&:hover': { bgcolor: '#6D28D9' } }}
                      >
                        Download PDF
                      </Button>
                    </Box>
                  </Box>

                  {/* Doc 2 */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      bgcolor: '#F8FAFC',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: '#EDE9FE', display: 'grid', placeItems: 'center', color: '#7C3AED' }}>
                        <FiShield size={18} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                          UAE Residence Visa Cancellation Declaration (MOHRE Form)
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
                          Official immigration document confirming no outstanding dues and initiating 60-day grace period.
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="sm"
                        variant="outlined"
                        onClick={() => setPreviewDocTitle('UAE Residence Visa Cancellation Declaration')}
                        sx={{ fontSize: '12px', borderRadius: '8px' }}
                      >
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="solid"
                        onClick={() => showToast('📥 Downloading Visa Cancellation Declaration (PDF)...')}
                        startDecorator={<FiDownload size={13} />}
                        sx={{ bgcolor: '#7C3AED', fontSize: '12px', borderRadius: '8px', '&:hover': { bgcolor: '#6D28D9' } }}
                      >
                        Download PDF
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Card>

              {/* Forwarding Address Update Card */}
              <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #E5E7EF', bgcolor: '#FFFFFF' }}>
                <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', mb: 0.5 }}>
                  Post-Departure Contact Information
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#64748B', mb: 2 }}>
                  Ensure your personal email and phone number are current for receiving final WPS payslips and tax documents.
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#475569', mb: 0.5 }}>
                      Personal Email
                    </Typography>
                    <Input
                      value={contactInfo.personalEmail}
                      onChange={(e) => setContactInfo((p) => ({ ...p, personalEmail: e.target.value }))}
                      sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#475569', mb: 0.5 }}>
                      Mobile / WhatsApp
                    </Typography>
                    <Input
                      value={contactInfo.personalPhone}
                      onChange={(e) => setContactInfo((p) => ({ ...p, personalPhone: e.target.value }))}
                      sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#475569', mb: 0.5 }}>
                      Destination City / Country
                    </Typography>
                    <Input
                      value={contactInfo.forwardingCity}
                      onChange={(e) => setContactInfo((p) => ({ ...p, forwardingCity: e.target.value }))}
                      sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
                    />
                  </Box>
                </Box>

                <Button
                  size="sm"
                  onClick={() => {
                    setContactSaved(true);
                    showToast('✓ Forwarding contact details saved successfully.');
                  }}
                  sx={{
                    alignSelf: 'flex-start',
                    bgcolor: '#7C3AED',
                    borderRadius: '8px',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#6D28D9' },
                  }}
                >
                  {contactSaved ? 'Contact Details Saved ✓' : 'Update Contact Info'}
                </Button>
              </Card>
            </Box>
          )}

          {/* TAB 4: FAQs & Support */}
          {activeTab === 'faqs' && (
            <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #E5E7EF', bgcolor: '#FFFFFF' }}>
              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  Frequently Asked Questions & Departure Policies
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.25 }}>
                  Everything you need to know about notice obligations, UAE Labour Law rights, and hotel handovers.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {FAQ_ITEMS.map((faq, idx) => {
                  const isOpen = expandedFaqIndex === idx;
                  return (
                    <Box
                      key={idx}
                      sx={{
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        bgcolor: isOpen ? '#FAF5FF' : '#FFFFFF',
                      }}
                    >
                      <Box
                        onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                        sx={{
                          p: 1.75,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                          <FiHelpCircle size={16} color="#7C3AED" />
                          <Typography sx={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                            {faq.q}
                          </Typography>
                        </Box>
                        {isOpen ? <FiChevronUp size={16} color="#7C3AED" /> : <FiChevronDown size={16} color="#94A3B8" />}
                      </Box>

                      {isOpen && (
                        <Box sx={{ px: 2, pb: 2, pt: 0.5, borderTop: '1px solid #EDE9FE' }}>
                          <Typography sx={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.6 }}>
                            {faq.a}
                          </Typography>
                          <Chip size="sm" sx={{ mt: 1.5, bgcolor: '#EDE9FE', color: '#7C3AED', fontSize: '10.5px' }}>
                            {faq.category}
                          </Chip>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Card>
          )}
        </Box>

        {/* Right Sidebar: Persistent HR Coordinator & Notice Countdown */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Assigned HR Coordinator Card */}
          <Card
            sx={{
              p: 2.5,
              borderRadius: '16px',
              border: '1px solid #E5E7EF',
              bgcolor: '#FFFFFF',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Avatar
                sx={{
                  width: 46,
                  height: 46,
                  bgcolor: '#EDE9FE',
                  color: '#7C3AED',
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                MV
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  Mariam Vance
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
                  People Operations Coordinator
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600 }}>
                  Assigned Offboarding Specialist
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '12px', color: '#475569' }}>
                <FiMail size={14} color="#7C3AED" />
                <span>mariam.vance@crowneplaza-dubai.com</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '12px', color: '#475569' }}>
                <FiPhone size={14} color="#7C3AED" />
                <span>+971 4 331 1111 (Ext. 408)</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '11px', color: '#94A3B8' }}>
                <FiClock size={13} />
                <span>Mon – Fri · 08:30 – 17:30 GST</span>
              </Box>
            </Box>

            <Button
              onClick={() => setIsCoordinatorModalOpen(true)}
              startDecorator={<FiSend size={14} />}
              sx={{
                width: '100%',
                bgcolor: '#7C3AED',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '12.5px',
                '&:hover': { bgcolor: '#6D28D9' },
              }}
            >
              Message HR Coordinator
            </Button>
          </Card>

          {/* Notice Countdown Card */}
          <Card
            sx={{
              p: 2.5,
              borderRadius: '16px',
              border: '1px solid #E5E7EF',
              bgcolor: '#FFFFFF',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', mb: 1.5 }}>
              Notice Period Summary
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  bgcolor: '#FAF5FF',
                  border: '2px solid #7C3AED',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 800, color: '#7C3AED' }}>
                  29
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  Days Remaining
                </Typography>
                <Typography sx={{ fontSize: '11.5px', color: '#64748B' }}>
                  Notice finishes 14 Oct 2026 at 18:00
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.5 }}>
              Your hotel credentials, Opera PMS login, and staff email remain fully active until the close of business on 14 Oct 2026.
            </Typography>
          </Card>

          {/* Useful Departure Resources */}
          <Card
            sx={{
              p: 2.5,
              borderRadius: '16px',
              border: '1px solid #E5E7EF',
              bgcolor: '#FFFFFF',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', mb: 1.5 }}>
              Helpful Departure Guides
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                onClick={() => showToast('📥 Downloading Crowne Plaza Dubai Offboarding Guide (PDF)...')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.25,
                  borderRadius: '8px',
                  bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#EDE9FE' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiFileText size={15} color="#7C3AED" />
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#1E293B' }}>
                    Offboarding Guide (PDF)
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '11px', color: '#94A3B8' }}>1.4 MB</Typography>
              </Box>

              <Box
                onClick={() => showToast('📥 Downloading UAE Residence Visa & Grace Period Guide (PDF)...')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.25,
                  borderRadius: '8px',
                  bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#EDE9FE' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiShield size={15} color="#7C3AED" />
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#1E293B' }}>
                    Visa & Grace Period Guide
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '11px', color: '#94A3B8' }}>420 KB</Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* MODAL 1: Message HR Coordinator */}
      <Modal open={isCoordinatorModalOpen} onClose={() => setIsCoordinatorModalOpen(false)}>
        <ModalDialog sx={{ width: '480px', maxWidth: '95vw', borderRadius: '16px', p: 3 }}>
          <ModalClose />
          <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
            Message HR Coordinator
          </Typography>
          <Typography sx={{ fontSize: '12.5px', color: '#64748B', mb: 2 }}>
            Send a direct query regarding your clearances, notice dates, or settlement calculations to Mariam Vance.
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#334155', mb: 0.5 }}>
              Subject
            </Typography>
            <Input
              defaultValue="Question regarding final settlement & visa grace period"
              sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#334155', mb: 0.5 }}>
              Your Message
            </Typography>
            <Textarea
              minRows={4}
              placeholder="Type your question or request here..."
              value={coordinatorMessage}
              onChange={(e) => setCoordinatorMessage(e.target.value)}
              sx={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
            <Button variant="outlined" color="neutral" onClick={() => setIsCoordinatorModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendCoordinatorMessage}
              sx={{ bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6D28D9' } }}
            >
              Send Message
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* MODAL 2: Document Preview Modal */}
      <Modal open={Boolean(previewDocTitle)} onClose={() => setPreviewDocTitle(null)}>
        <ModalDialog sx={{ width: '640px', maxWidth: '95vw', borderRadius: '16px', p: 3 }}>
          <ModalClose />
          <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
            {previewDocTitle}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748B', mb: 2 }}>
            Official Crowne Plaza Dubai Employee Service Document
          </Typography>

          <Box
            sx={{
              p: 3,
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              bgcolor: '#F8FAFC',
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: 1.6,
              color: '#1E293B',
              fontSize: '13px',
              mb: 3,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '15px', color: '#7C3AED' }}>
                CROWNE PLAZA DUBAI · IHG HOTELS & RESORTS
              </Typography>
              <Typography sx={{ fontSize: '11px', color: '#64748B' }}>
                Sheikh Zayed Road, PO Box 23215, Dubai, United Arab Emirates
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Typography sx={{ fontWeight: 700, mb: 1 }}>TO WHOM IT MAY CONCERN</Typography>
            <Typography sx={{ mb: 1.5 }}>
              This is to certify that <strong>Sara Khan</strong> (Employee ID: <strong>FDM-01</strong>) was employed at <strong>Crowne Plaza Dubai</strong> as <strong>Front Desk Manager</strong> in the Front Office Department from <strong>12 January 2021</strong> to <strong>14 October 2026</strong>.
            </Typography>
            <Typography sx={{ mb: 1.5 }}>
              During her 5 years and 6 months of dedicated service, Sara demonstrated exceptional guest relations, team leadership, and front desk operational acumen. She leaves our organization on mutual good terms.
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#64748B', fontStyle: 'italic' }}>
              Digitally certified by General Manager James Cole & Director of Human Resources.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
            <Button variant="outlined" color="neutral" onClick={() => setPreviewDocTitle(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setPreviewDocTitle(null);
                showToast(`📥 Downloading ${previewDocTitle} (PDF)...`);
              }}
              startDecorator={<FiDownload size={14} />}
              sx={{ bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6D28D9' } }}
            >
              Download Signed PDF
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
};
