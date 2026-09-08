export type UserRoleType =
  | 'planner'
  | 'manager'
  | 'supervisor'
  | 'contractor'
  | 'admin';

export type NavigationPath =
  | 'home'
  | 'site-reports'
  | 'match-review'
  | 'project-progress'
  | 'schedule'
  | 'milestones'
  | 'insights'
  | 'audit-trail'
  | 'learn-improve'
  | 'settings'
  // Site Supervisor Paths
  | 'submit-report'
  | 'my-reports'
  | 'my-updates'
  // Contractor Paths
  | 'my-work'
  | 'submit-update'
  | 'contractor-progress'
  // System Admin Paths
  | 'admin-overview'
  | 'admin-users'
  | 'admin-projects'
  | 'admin-contractors'
  | 'admin-datasources'
  | 'admin-ai-settings'
  | 'admin-activity'
  | 'admin-settings';

export interface SiteReport {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'xlsx' | 'csv';
  submittedBy: string;
  role: string;
  date: string;
  time: string;
  status: 'Processed' | 'Need Review';
  reviewCount?: number;
  updatesFound: number;
}

export interface ReviewCandidate {
  id: string;
  title: string;
  activityId: string;
  workPackage: string;
  matchPct: number;
  reason: string;
  plannedCorridor?: string;
}

export interface ReviewQueueItem {
  id: string;
  itemNumber: number;
  totalItems: number;
  sector: string;
  priorityTag: string;
  sourceDoc: string;
  quote: string;
  submittedBy: string;
  shiftInfo: string;
  corridorLocation: string;
  corridorSub: string;
  reportedQuantity: string;
  quantityDetail: string;
  executionDate: string;
  shiftType: string;
  photoUrl: string;
  photoGeoTag: string;
  verifiedTag: string;
  photoTitle: string;
  photoDesc: string;
  attachmentMeta: string;
  suggestedActivity: {
    title: string;
    workPackage: string;
    activityId: string;
    activityUuid?: string;
    confidence: number;
    matchRationale: string;
    highlightCorridor?: string;
    highlightQuantity?: string;
    scopeTarget: string;
    currentDone: string;
    currentDonePct: number;
    thisUpdateAmount: string;
    thisUpdatePct: number;
    afterApproval: string;
    afterApprovalPct: number;
    unit: string;
  };
  alternatives: ReviewCandidate[];
}

export interface NeedsAttentionItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  issueType: 'delay' | 'drop' | 'missing';
  issueLabel: string;
  severity: 'critical' | 'warning';
  actionLabel: string;
  actionType: 'details' | 'request';
}

export interface TimelineUpdate {
  id: string;
  actor: string;
  role?: string;
  time: string;
  detail: string;
  fileBadge?: string;
  badgeCount?: string;
  dotColor: 'primary' | 'secondary' | 'neutral';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  roleType: UserRoleType;
  department: string;
  assignedProject: string;
  initials: string;
  avatarColor: string;
  permissions: string[];
  disallowedActions?: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  roleType: UserRoleType;
  assignedProjects: string[];
  status: 'Active' | 'Inactive';
  lastActive: string;
}

export interface ProjectTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export interface AdminProject {
  id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  progress: number;
  status: 'On Track' | 'At Risk' | 'Delayed' | 'Planning' | 'Completed';
  usersCount: number;
  openIssues: number;
  scheduleStatus: string;
  contractorsCount: number;
  reportsThisMonth: number;
  assignedUsers: ProjectTeamMember[];
  startDate: string;
  targetCompletion: string;
}

export interface DataSourceItem {
  id: string;
  name: string;
  status: 'Connected' | 'Coming Soon' | 'Syncing';
  lastSync: string;
  recordsProcessed: number;
  type: string;
  description: string;
}

export interface PlatformActivity {
  id: string;
  time: string;
  title: string;
  actor: string;
  project?: string;
  category: string;
  detail: string;
  status?: 'Success' | 'Info' | 'Warning';
}

export interface SystemActivityLog {
  id: string;
  time: string;
  user: string;
  action: string;
  project: string;
  result: 'Success' | 'Warning' | 'Info';
  detail: string;
}

export interface AdminContractor {
  id: string;
  name: string;
  email: string;
  project: string;
  status: 'Active' | 'Inactive';
  specialty: string;
  assignedWork: string;
  reportsThisMonth: number;
  activeWorkers: number;
}

export interface SupervisorReport {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'xlsx' | 'csv';
  workArea: string;
  chainage: string;
  submittedBy: string;
  role: string;
  date: string;
  time: string;
  status: 'Processed' | 'Pending Verification' | 'Draft';
  updatesCount: number;
  contractor: string;
  weather: string;
  temperature: string;
  shift: string;
  manpower: { trade: string; count: number }[];
  equipment: { name: string; count: number }[];
  quantities: {
    item: string;
    quantity: string;
    unit: string;
    chainage?: string;
    matchActivity?: string;
    matchConfidence?: number;
  }[];
  photos: {
    url: string;
    caption: string;
    geotag: string;
    timestamp: string;
  }[];
  notes?: string;
}

export interface SupervisorShiftNote {
  id: string;
  timestamp: string;
  date: string;
  chainage: string;
  category: 'Observation' | 'Safety' | 'Quality' | 'Weather' | 'Material';
  content: string;
  author: string;
  photoUrl?: string;
  photoCaption?: string;
}

export interface SupervisorFieldUpdate {
  id: string;
  reportId: string;
  reportName: string;
  activityId: string;
  activityName: string;
  workPackage: string;
  chainage: string;
  quantity: string;
  unit: string;
  trade: string;
  status: 'Approved into P6' | 'Pending AI Match' | 'Under Review';
  confidence: number;
  timestamp: string;
  contractor: string;
}
