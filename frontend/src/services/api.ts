/**
 * Plan2Progress — Frontend API Service Layer.
 *
 * Connects the React frontend to the FastAPI backend.
 * Falls back to mock data if the backend is unreachable.
 */

import { SiteReport, ReviewQueueItem, UserProfile } from '../types';

export const DEFAULT_PROJECT_ID = '9a7e45eb-ffcb-4064-aef0-d948994feb06';
const API_BASE = 'http://localhost:8000/api/v1';
const AUTH_TOKEN_KEY = 'p2p_access_token';
let resolvedProjectId: string | null = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    roleType: string;
    department: string;
    assignedProject: string;
    initials: string;
    avatarColor: string;
    permissions: string[];
    disallowedActions: string[];
  };
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
  return response;
}

export function clearApiSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

interface ProjectSummary {
  id: string;
  code: string;
}

async function getProjectId(projectId: string): Promise<string> {
  if (projectId !== DEFAULT_PROJECT_ID) return projectId;
  if (resolvedProjectId) return resolvedProjectId;

  const projects = await apiFetch<ProjectSummary[]>('/projects');
  const project = projects.find((candidate) => candidate.code === 'DGPP-2026');
  if (!project) throw new Error('Demo project DGPP-2026 was not found.');
  resolvedProjectId = project.id;
  return project.id;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface ReportUploadResult {
  reportId: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  status: string;
  eventsExtracted: number;
  message: string;
}

export async function uploadProgressReport(
  file: File | Blob,
  fileName: string,
  textContent?: string,
  submittedByName: string = 'Site Supervisor',
  projectId: string = DEFAULT_PROJECT_ID
): Promise<ReportUploadResult> {
  const formData = new FormData();
  formData.append('project_id', await getProjectId(projectId));
  formData.append('submitted_by_name', submittedByName);
  if (textContent) {
    formData.append('text_content', textContent);
  }
  formData.append('file', file, fileName);

  const res = await fetch(`${API_BASE}/reports/upload`, {
    method: 'POST',
    headers: (() => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      return token ? { Authorization: `Bearer ${token}` } : {};
    })(),
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Upload failed ${res.status}: ${body}`);
  }
  return res.json();
}

export async function fetchReports(projectId: string = DEFAULT_PROJECT_ID): Promise<SiteReport[]> {
  return apiFetch<SiteReport[]>(`/reports?project_id=${await getProjectId(projectId)}`);
}

// ─── Review Queue ─────────────────────────────────────────────────────────────

export async function fetchReviewQueue(projectId: string = DEFAULT_PROJECT_ID): Promise<ReviewQueueItem[]> {
  return apiFetch<ReviewQueueItem[]>(`/matches/queue?project_id=${await getProjectId(projectId)}`);
}

// ─── Match Actions ────────────────────────────────────────────────────────────

export interface MatchActionResult {
  match_id: string;
  status: string;
  activity_id?: string;
  progress_updated: boolean;
  new_progress_pct?: number;
  message: string;
}

export async function approveMatch(
  matchId: string,
  selectedActivityId?: string,
  notes?: string
): Promise<MatchActionResult> {
  const body: Record<string, string> = {};
  if (selectedActivityId) body.selected_activity_id = selectedActivityId;
  if (notes) body.notes = notes;

  return apiFetch<MatchActionResult>(`/matches/${matchId}/approve`, {
    method: 'POST',
    body: JSON.stringify(Object.keys(body).length > 0 ? body : {}),
  });
}

export async function rejectMatch(
  matchId: string,
  reason: string,
  notes?: string
): Promise<MatchActionResult> {
  return apiFetch<MatchActionResult>(`/matches/${matchId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason, notes }),
  });
}

// ─── Schedule & Activities ────────────────────────────────────────────────────

export interface ActivityApiItem {
  id: string;
  scheduleId: string;
  activityCode: string;
  name: string;
  wbsCode?: string;
  workPackage?: string;
  level?: string;
  plannedStart?: string;
  plannedFinish?: string;
  plannedQuantity: number;
  actualQuantity: number;
  uom: string;
  progressPct: number;
  status: string;
  corridorStart?: string;
  corridorFinish?: string;
  isCritical?: boolean;
  floatDays?: number;
  remarks?: string;
}

export interface ScheduleResponseApi {
  id: string;
  projectId: string;
  fileName: string;
  fileType: string;
  version: number;
  totalActivities: number;
  activities?: ActivityApiItem[];
}

export async function fetchActiveSchedule(
  projectId: string = DEFAULT_PROJECT_ID
): Promise<ScheduleResponseApi> {
  return apiFetch<ScheduleResponseApi>(`/projects/${await getProjectId(projectId)}/schedule`);
}

// ─── Audit & Activity Logs ────────────────────────────────────────────────────

export interface TimelineUpdateApi {
  id: string;
  actor: string;
  role: string;
  time: string;
  detail: string;
  fileBadge?: string;
  badgeCount?: number;
  dotColor: string;
}

export async function fetchTimeline(
  limit = 10,
  projectId: string = DEFAULT_PROJECT_ID
): Promise<TimelineUpdateApi[]> {
  return apiFetch<TimelineUpdateApi[]>(`/audit/timeline?project_id=${await getProjectId(projectId)}&limit=${limit}`);
}

export interface SystemLogApiItem {
  id: string;
  time: string;
  user: string;
  action: string;
  project: string;
  result: string;
  detail: string;
}

export async function fetchSystemLogs(limit = 20): Promise<SystemLogApiItem[]> {
  return apiFetch<SystemLogApiItem[]>(`/audit/system-logs?limit=${limit}`);
}
