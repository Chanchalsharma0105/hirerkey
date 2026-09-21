export type OperationalModule =
  | 'expense'
  | 'leave'
  | 'attendance'
  | 'position'
  | 'preboarding'
  | 'notice_period'
  | 'appraisal';

export type PolicyType = 'default' | 'scoped';

export type WorkflowStatus = 'active' | 'draft' | 'inactive';

export type RoutingMethod =
  | 'direct_manager'
  | 'skip_level_manager'
  | 'department_head'
  | 'role_queue'
  | 'specific_person'
  | 'auto_approve';

export interface ScopeCondition {
  id: string;
  field: 'department' | 'location' | 'grade' | 'amount' | 'category' | 'tenure';
  operator: 'equals' | 'in' | 'greater_than' | 'less_than';
  value: string | string[] | number;
}

export interface ApprovalStep {
  id: string;
  order: number;
  label: string;
  routingMethod: RoutingMethod;
  assigneeRole?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  hierarchyDepth?: number;
  consensusRule?: 'any_one' | 'unanimous';
  slaHours?: number;
  autoEscalate?: boolean;
  escalationTarget?: string;
  preventSelfApproval?: boolean;
  required?: boolean;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description?: string;
  module: OperationalModule;
  policyType: PolicyType;
  status: WorkflowStatus;
  version: string;
  priorityRank?: number;
  conditions: ScopeCondition[];
  steps: ApprovalStep[];
  fallbackPolicy?: {
    onVacantApprover: 'skip_to_next' | 'route_to_hr' | 'escalate_to_skip';
    allowDelegation: boolean;
    disallowSelfApproval?: boolean;
    notifyBeforeTimeout?: boolean;
  };
  inFlightCount?: number;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export interface SimulationEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  managerName: string;
  managerRole: string;
  avatar: string;
}

export interface SimulationResult {
  matchedWorkflow: ApprovalWorkflow;
  submitter: SimulationEmployee;
  contextSummary: string;
  resolvedSteps: {
    order: number;
    stepLabel: string;
    approverName: string;
    approverTitle: string;
    routingMethod: RoutingMethod;
    slaHours: number;
  }[];
  finalOutcome: string;
}
