export type OffboardingStageKey = 'notice_initiated' | 'serving_notice' | 'clearing' | 'closed';

export interface StageConfig {
  key: OffboardingStageKey;
  numericStage: number;
  label: string;
  chipTone: 'warn' | 'pri' | 'bad' | 'ok';
}

export const STAGE_CONFIGS: Record<number, StageConfig> = {
  0: { key: 'notice_initiated', numericStage: 0, label: 'Notice initiated', chipTone: 'warn' },
  1: { key: 'serving_notice', numericStage: 1, label: 'Serving notice', chipTone: 'pri' },
  2: { key: 'clearing', numericStage: 2, label: 'Exited · clearing', chipTone: 'bad' },
  3: { key: 'closed', numericStage: 3, label: 'Closed', chipTone: 'ok' },
};

export type OffboardingReasonType = 'resignation' | 'retirement' | 'termination' | 'death_in_service';

export interface ReasonConfig {
  value: OffboardingReasonType;
  label: string;
  help: string;
  requiresNotice: boolean; // Operational notice period vs immediate exit
}

export const REASONS_LIST: ReasonConfig[] = [
  {
    value: 'resignation',
    label: 'Resigned (voluntary)',
    help: 'Employee submitted resignation via email. Standard notice period initiated.',
    requiresNotice: true,
  },
  {
    value: 'retirement',
    label: 'Retirement',
    help: 'Employee reached retirement. Planned notice and succession handover.',
    requiresNotice: true,
  },
  {
    value: 'termination',
    label: 'Terminated',
    help: 'Company ended employment. Takes effect immediately with clearance.',
    requiresNotice: false,
  },
  {
    value: 'death_in_service',
    label: 'Death in service',
    help: 'Recorded separately for bereavement, statutory settlements, and immediate coverage.',
    requiresNotice: false,
  },
];

export interface HandoverItem {
  key: string;
  title: string;
  subtitle: string;
  done: boolean;
  tag?: 'Physical Assets' | 'System Access' | 'Operations' | 'Team & Structure' | string;
}

export interface ClearanceItem {
  dept: 'IT' | 'Admin' | 'Finance' | 'Line manager' | string;
  title: string;
  source: 'Assets & Equipment' | 'Clearance checklist' | string;
  mandatory: boolean;
  done: boolean;
  approver?: string;
  notes?: string;
  status?: 'approved' | 'pending';
}

export interface SettlementRecord {
  status: 'pending' | 'in_progress' | 'paid' | 'waived';
  leaveDays: number;
  encashmentAmount: string;
  recoveriesAmount: string;
  netPayable: string;
  lettersGenerated: boolean;
  currency?: string;
}

export type CaseTabKey = 'overview' | 'handover' | 'clearance' | 'interview' | 'settlement';

export interface OffboardingCase {
  id: number;
  name: string;
  initials: string;
  title: string;
  seat: string; // e.g., 'FDM-01'
  department: string;
  reason: OffboardingReasonType;
  startDate?: string;
  noticeGivenDate?: string;
  lastWorkingDay: string;
  dueText: string;
  dueTone: 'neu' | 'bad' | 'warn' | 'ok';
  stage: number; // 0, 1, 2, 3
  successor: string | null;
  manager?: string;
  joinDate?: string;
  serviceLength?: string;
  leaveBalance?: number;
  currency?: string;
  handover?: HandoverItem[];
  clearance?: ClearanceItem[];
  exitInterviewStatus?: 'not_sent' | 'sent' | 'completed' | 'skipped';
  settlement?: SettlementRecord;
}

export type OffboardingScope = 'progress' | 'closed';

export interface OffboardingFilterState {
  scope: OffboardingScope;
  statuses: string[];
  departments: string[];
  reasons: string[];
  employee: string;
  successor: 'all' | 'assigned' | 'none';
  dateRange: 'all' | '7_days' | '30_days' | '60_days';
  searchQuery: string;
  sortBy: 'lwd' | 'name' | 'stage';
  sortOrder: 'asc' | 'desc';
  page: number;
  rowsPerPage: number;
}
