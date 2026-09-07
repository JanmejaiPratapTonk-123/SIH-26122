import React, { useState, useMemo } from 'react';
import {
  NavigationPath,
  AdminUser,
  AdminProject,
  DataSourceItem,
  PlatformActivity,
  SystemActivityLog,
  AdminContractor,
} from '../types';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_PROJECTS,
  INITIAL_PLATFORM_ACTIVITIES,
  INITIAL_DATA_SOURCES,
  INITIAL_SYSTEM_ACTIVITY_LOGS,
  INITIAL_CONTRACTORS,
} from '../data/adminMockData';
import {
  AddUserModal,
  EditUserDrawer,
  ChangeRoleModal,
  CreateProjectModal,
  ProjectDetailDrawer,
  ManageTeamModal,
  ActivityDetailDrawer,
  DataSourceDetailDrawer,
  AddContractorModal,
} from './admin/AdminModals';

interface AdminConsoleScreenProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  onShowToast: (title: string, message: string, icon?: string, isError?: boolean) => void;
  sidebarOpen?: boolean;
}

type AdminTab =
  | 'overview'
  | 'users'
  | 'projects'
  | 'contractors'
  | 'datasources'
  | 'ai-settings'
  | 'activity'
  | 'settings';

export const AdminConsoleScreen: React.FC<AdminConsoleScreenProps> = ({
  currentPath,
  onNavigate,
  onShowToast,
  sidebarOpen = true,
}) => {
  // -------------------------------------------------------------
  // NAVIGATION & TAB STATE
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  React.useEffect(() => {
    switch (currentPath) {
      case 'admin-users':
        setActiveTab('users');
        break;
      case 'admin-projects':
        setActiveTab('projects');
        break;
      case 'admin-contractors':
        setActiveTab('contractors');
        break;
      case 'admin-datasources':
        setActiveTab('datasources');
        break;
      case 'admin-ai-settings':
        setActiveTab('ai-settings');
        break;
      case 'admin-activity':
        setActiveTab('activity');
        break;
      case 'admin-settings':
      case 'settings':
        setActiveTab('settings');
        break;
      case 'admin-overview':
      case 'home':
      default:
        setActiveTab('overview');
        break;
    }
  }, [currentPath]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    const pathMap: Record<AdminTab, NavigationPath> = {
      overview: 'admin-overview',
      users: 'admin-users',
      projects: 'admin-projects',
      contractors: 'admin-contractors',
      datasources: 'admin-datasources',
      'ai-settings': 'admin-ai-settings',
      activity: 'admin-activity',
      settings: 'admin-settings',
    };
    onNavigate(pathMap[tab]);
  };

  // -------------------------------------------------------------
  // CORE DATA REPOSITORY (STATEFUL)
  // -------------------------------------------------------------
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [projects, setProjects] = useState<AdminProject[]>(INITIAL_ADMIN_PROJECTS);
  const [dataSources, setDataSources] = useState<DataSourceItem[]>(INITIAL_DATA_SOURCES);
  const [platformActivities, setPlatformActivities] = useState<PlatformActivity[]>(
    INITIAL_PLATFORM_ACTIVITIES
  );
  const [systemLogs, setSystemLogs] = useState<SystemActivityLog[]>(
    INITIAL_SYSTEM_ACTIVITY_LOGS
  );
  const [contractors, setContractors] = useState<AdminContractor[]>(INITIAL_CONTRACTORS);

  // Available project names for assignment dropdowns
  const availableProjectNames = useMemo(() => projects.map((p) => p.name), [projects]);
  const managerNames = useMemo(() => {
    const managers = users.filter((u) => u.role === 'Project Manager').map((u) => u.name);
    return managers.length > 0 ? managers : ['A. Kumar', 'S. Mehta', 'R. Verma'];
  }, [users]);

  // -------------------------------------------------------------
  // MODAL & DRAWER INTERACTIVE STATES
  // -------------------------------------------------------------
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [changingRoleUser, setChangingRoleUser] = useState<AdminUser | null>(null);

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState<AdminProject | null>(null);
  const [managingTeamProject, setManagingTeamProject] = useState<AdminProject | null>(null);

  const [selectedActivity, setSelectedActivity] = useState<PlatformActivity | SystemActivityLog | null>(null);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSourceItem | null>(null);
  const [syncingSourceId, setSyncingSourceId] = useState<string | null>(null);

  const [isAddContractorOpen, setIsAddContractorOpen] = useState(false);

  // -------------------------------------------------------------
  // AI SETTINGS STATE
  // -------------------------------------------------------------
  const [autoApprove, setAutoApprove] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [sendUncertain, setSendUncertain] = useState(true);
  const [checkLocation, setCheckLocation] = useState(true);
  const [checkQuantities, setCheckQuantities] = useState(true);
  const [learnPlanner, setLearnPlanner] = useState(true);
  const [aiSettingsModified, setAiSettingsModified] = useState(false);

  // -------------------------------------------------------------
  // PLATFORM SETTINGS STATE
  // -------------------------------------------------------------
  const [orgName, setOrgName] = useState('Oil India Limited - Capital Projects');
  const [timeZone, setTimeZone] = useState('IST (UTC+05:30) India Standard Time');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60 minutes');
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  // -------------------------------------------------------------
  // FILTER STATES
  // -------------------------------------------------------------
  // Users filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userProjectFilter, setUserProjectFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');

  // Projects filters
  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('All');
  const [projectLocationFilter, setProjectLocationFilter] = useState('All');

  // System Activity filters
  const [logSearch, setLogSearch] = useState('');
  const [logActionFilter, setLogActionFilter] = useState('All');
  const [logResultFilter, setLogResultFilter] = useState('All');

  // Contractors filters
  const [contractorSearch, setContractorSearch] = useState('');
  const [contractorStatusFilter, setContractorStatusFilter] = useState('All');

  // -------------------------------------------------------------
  // HANDLERS: USERS
  // -------------------------------------------------------------
  const handleAddUser = (newUserData: Omit<AdminUser, 'id' | 'lastActive'>) => {
    const newUser: AdminUser = {
      ...newUserData,
      id: `usr-${Date.now()}`,
      lastActive: 'Just now',
    };
    setUsers((prev) => [newUser, ...prev]);

    // Record activity
    const newAct: PlatformActivity = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      title: `A new ${newUser.role.toLowerCase()} was added.`,
      actor: 'Meera Patel',
      project: newUser.assignedProjects[0] || 'Platform',
      category: 'User Management',
      detail: `${newUser.name} was granted ${newUser.role} access.`,
      status: 'Success',
    };
    setPlatformActivities((prev) => [newAct, ...prev]);

    const newLog: SystemActivityLog = {
      id: `log-${Date.now()}`,
      time: 'Just now',
      user: 'Meera Patel',
      action: 'Added user',
      project: newUser.assignedProjects[0] || 'Platform',
      result: 'Success',
      detail: `Created profile for ${newUser.name} with ${newUser.role} role.`,
    };
    setSystemLogs((prev) => [newLog, ...prev]);

    onShowToast('User Added', `Successfully created user account for ${newUser.name}.`, 'person_add');
  };

  const handleSaveUser = (updatedUser: AdminUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    onShowToast('User Updated', `Changes saved for ${updatedUser.name}.`, 'check_circle');
  };

  const handleConfirmChangeRole = (userId: string, newRole: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    const newLog: SystemActivityLog = {
      id: `log-${Date.now()}`,
      time: 'Just now',
      user: 'Meera Patel',
      action: 'Role updated',
      project: targetUser.assignedProjects[0] || 'Platform',
      result: 'Success',
      detail: `Updated role for ${targetUser.name} to ${newRole}.`,
    };
    setSystemLogs((prev) => [newLog, ...prev]);

    onShowToast('Role Updated', `${targetUser.name} is now a ${newRole}.`, 'verified_user');
  };

  const handleToggleUserStatus = (user: AdminUser) => {
    const newStatus: 'Active' | 'Inactive' = user.status === 'Active' ? 'Inactive' : 'Active';
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    onShowToast(
      newStatus === 'Active' ? 'User Activated' : 'User Deactivated',
      `${user.name} is now marked as ${newStatus}.`,
      newStatus === 'Active' ? 'check_circle' : 'block'
    );
  };

  // -------------------------------------------------------------
  // HANDLERS: PROJECTS
  // -------------------------------------------------------------
  const handleCreateProject = (newProject: AdminProject) => {
    setProjects((prev) => [newProject, ...prev]);

    const newAct: PlatformActivity = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      title: `New project "${newProject.name}" was created.`,
      actor: 'Meera Patel',
      project: newProject.name,
      category: 'Projects',
      detail: `Project code ${newProject.code} was initialized with ${newProject.manager} as Lead.`,
      status: 'Success',
    };
    setPlatformActivities((prev) => [newAct, ...prev]);

    const newLog: SystemActivityLog = {
      id: `log-${Date.now()}`,
      time: 'Just now',
      user: 'Meera Patel',
      action: 'Created project',
      project: newProject.name,
      result: 'Success',
      detail: `Initialized project ${newProject.name} (${newProject.code}).`,
    };
    setSystemLogs((prev) => [newLog, ...prev]);

    onShowToast('Project Created', `"${newProject.name}" has been created successfully.`, 'folder_open');
  };

  const handleArchiveProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    onShowToast('Project Archived', `"${target.name}" has been archived.`, 'archive');
  };

  const handleAddUserToProject = (projectId: string, userToAdd: AdminUser, roleInProject: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const exists = p.assignedUsers.some((u) => u.id === userToAdd.id);
        if (exists) return p;
        return {
          ...p,
          usersCount: p.usersCount + 1,
          assignedUsers: [
            ...p.assignedUsers,
            {
              id: userToAdd.id,
              name: userToAdd.name,
              email: userToAdd.email,
              role: roleInProject,
              status: userToAdd.status,
            },
          ],
        };
      })
    );

    // Also update the user's assigned projects list
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userToAdd.id) return u;
        const targetProj = projects.find((p) => p.id === projectId);
        if (!targetProj || u.assignedProjects.includes(targetProj.name)) return u;
        return {
          ...u,
          assignedProjects: [...u.assignedProjects, targetProj.name],
        };
      })
    );

    onShowToast('Team Member Added', `${userToAdd.name} added to project team.`, 'person_add');
  };

  const handleRemoveUserFromProject = (projectId: string, userId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          usersCount: Math.max(0, p.usersCount - 1),
          assignedUsers: p.assignedUsers.filter((u) => u.id !== userId),
        };
      })
    );
    onShowToast('Team Member Removed', 'User removed from project assignment.', 'person_remove');
  };

  // -------------------------------------------------------------
  // HANDLERS: DATA SOURCES & SYNC
  // -------------------------------------------------------------
  const handleSyncNow = (sourceId: string) => {
    const src = dataSources.find((s) => s.id === sourceId);
    if (!src) return;

    setSyncingSourceId(sourceId);
    setTimeout(() => {
      setSyncingSourceId(null);
      const randomInc = Math.floor(Math.random() * 25) + 12;
      setDataSources((prev) =>
        prev.map((s) =>
          s.id === sourceId
            ? {
                ...s,
                lastSync: 'Just now',
                recordsProcessed: s.recordsProcessed + randomInc,
              }
            : s
        )
      );

      const newLog: SystemActivityLog = {
        id: `log-${Date.now()}`,
        time: 'Just now',
        user: 'Meera Patel',
        action: 'Manual sync',
        project: 'All Projects',
        result: 'Success',
        detail: `Synchronized ${src.name} with ${randomInc} new records verified.`,
      };
      setSystemLogs((prev) => [newLog, ...prev]);

      onShowToast('Sync Completed', `Successfully synchronized ${src.name} with zero errors.`, 'sync');
    }, 850);
  };

  // -------------------------------------------------------------
  // HANDLERS: AI SETTINGS
  // -------------------------------------------------------------
  const handleSaveAiSettings = () => {
    setAiSettingsModified(false);

    const newAct: PlatformActivity = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      title: `AI matching threshold changed to ${confidenceThreshold}%.`,
      actor: 'Meera Patel',
      project: 'All Projects',
      category: 'AI Settings',
      detail: `Auto-approval confidence set to ${confidenceThreshold}% with validation rules refreshed.`,
      status: 'Success',
    };
    setPlatformActivities((prev) => [newAct, ...prev]);

    const newLog: SystemActivityLog = {
      id: `log-${Date.now()}`,
      time: 'Just now',
      user: 'Meera Patel',
      action: 'Changed AI threshold',
      project: 'All Projects',
      result: 'Success',
      detail: `Set auto-approval confidence to ${confidenceThreshold}%.`,
    };
    setSystemLogs((prev) => [newLog, ...prev]);

    onShowToast('Settings Saved', 'AI matching rules updated across all projects.', 'tune');
  };

  // -------------------------------------------------------------
  // HANDLERS: CONTRACTORS
  // -------------------------------------------------------------
  const handleAddContractor = (newContractor: AdminContractor) => {
    setContractors((prev) => [newContractor, ...prev]);
    onShowToast('Contractor Added', `${newContractor.name} added to approved registry.`, 'engineering');
  };

  // -------------------------------------------------------------
  // FILTERED DATASETS
  // -------------------------------------------------------------
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchQuery =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userRoleFilter === 'All' || u.role === userRoleFilter;
      const matchProject =
        userProjectFilter === 'All' ||
        u.assignedProjects.includes(userProjectFilter) ||
        u.assignedProjects.includes('All Projects');
      const matchStatus = userStatusFilter === 'All' || u.status === userStatusFilter;
      return matchQuery && matchRole && matchProject && matchStatus;
    });
  }, [users, userSearch, userRoleFilter, userProjectFilter, userStatusFilter]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchQuery =
        p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(projectSearch.toLowerCase());
      const matchStatus = projectStatusFilter === 'All' || p.status === projectStatusFilter;
      const matchLocation =
        projectLocationFilter === 'All' ||
        p.location.toLowerCase().includes(projectLocationFilter.toLowerCase());
      return matchQuery && matchStatus && matchLocation;
    });
  }, [projects, projectSearch, projectStatusFilter, projectLocationFilter]);

  const filteredLogs = useMemo(() => {
    return systemLogs.filter((log) => {
      const matchQuery =
        log.user.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.project.toLowerCase().includes(logSearch.toLowerCase());
      const matchAction = logActionFilter === 'All' || log.action === logActionFilter;
      const matchResult = logResultFilter === 'All' || log.result === logResultFilter;
      return matchQuery && matchAction && matchResult;
    });
  }, [systemLogs, logSearch, logActionFilter, logResultFilter]);

  const filteredContractors = useMemo(() => {
    return contractors.filter((c) => {
      const matchQuery =
        c.name.toLowerCase().includes(contractorSearch.toLowerCase()) ||
        c.specialty.toLowerCase().includes(contractorSearch.toLowerCase());
      const matchStatus = contractorStatusFilter === 'All' || c.status === contractorStatusFilter;
      return matchQuery && matchStatus;
    });
  }, [contractors, contractorSearch, contractorStatusFilter]);

  // Total reports processed across data sources
  const totalReportsProcessed = useMemo(() => {
    return dataSources.reduce((acc, curr) => acc + curr.recordsProcessed, 0);
  }, [dataSources]);

  return (
    <div className="flex-1 bg-[#f8f9ff] min-h-screen pb-16 overflow-y-auto">
      {/* =========================================================
          TOP ADMIN BANNER & TAB NAVIGATION
         ========================================================= */}
      <div className="bg-white border-b border-[#c5c5d3]/40 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00236f] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
              </div>
              <div>
                <h1 className="font-headline-sm text-[20px] font-bold text-[#131b2e] leading-tight">
                  Admin Console
                </h1>
                <p className="text-[12px] text-[#757682]">
                  Platform administration, user governance, and data pipeline control
                </p>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e6f7f5] text-[#006a61] rounded-full text-[11px] font-semibold border border-[#006a61]/20">
                <span className="w-2 h-2 rounded-full bg-[#006a61] animate-pulse"></span>
                System Healthy • All Pipelines Active
              </span>
            </div>
          </div>

          {/* Tab Navigation Strip */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
            <button
              type="button"
              onClick={() => handleTabChange('overview')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:bg-[#eaedff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">dashboard</span>
              <span>Admin Overview</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('users')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'users'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:bg-[#eaedff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">group</span>
              <span>Users & Roles</span>
              <span
                className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-[#e0e2ec] text-[#444651]'
                }`}
              >
                {users.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('projects')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'projects'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:bg-[#eaedff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">folder</span>
              <span>Projects</span>
              <span
                className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'projects' ? 'bg-white/20 text-white' : 'bg-[#e0e2ec] text-[#444651]'
                }`}
              >
                {projects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('contractors')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'contractors'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:bg-[#eaedff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">engineering</span>
              <span>Contractors</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('datasources')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'datasources'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:bg-[#eaedff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">database</span>
              <span>Data Sources</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('ai-settings')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ai-settings'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:bg-[#eaedff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">tune</span>
              <span>AI Settings</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('activity')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'activity'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:bg-[#eaedff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">history</span>
              <span>System Activity</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('settings')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:bg-[#eaedff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">settings</span>
              <span>Platform Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* =========================================================
            VIEW 1: ADMIN OVERVIEW (KPIs, ACTIVITY, PROJECTS ATTENTION)
           ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Card 1: Active Projects */}
              <button
                type="button"
                onClick={() => {
                  setProjectStatusFilter('All');
                  handleTabChange('projects');
                }}
                className="p-4 bg-white rounded-2xl border border-[#c5c5d3]/40 hover:border-[#00236f]/50 hover:shadow-md transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-[#757682]">Active Projects</span>
                  <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#00236f] flex items-center justify-center group-hover:bg-[#00236f] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">folder</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#131b2e] tracking-tight">12</div>
                <div className="mt-2 text-[11px] text-[#006a61] font-semibold flex items-center gap-1">
                  <span>View directory</span>
                  <span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </button>

              {/* Card 2: Active Users */}
              <button
                type="button"
                onClick={() => {
                  setUserStatusFilter('Active');
                  handleTabChange('users');
                }}
                className="p-4 bg-white rounded-2xl border border-[#c5c5d3]/40 hover:border-[#00236f]/50 hover:shadow-md transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-[#757682]">Active Users</span>
                  <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#00236f] flex items-center justify-center group-hover:bg-[#00236f] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">group</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#131b2e] tracking-tight">48</div>
                <div className="mt-2 text-[11px] text-[#006a61] font-semibold flex items-center gap-1">
                  <span>Manage users</span>
                  <span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </button>

              {/* Card 3: Reports Processed */}
              <button
                type="button"
                onClick={() => handleTabChange('datasources')}
                className="p-4 bg-white rounded-2xl border border-[#c5c5d3]/40 hover:border-[#00236f]/50 hover:shadow-md transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-[#757682]">Reports Processed</span>
                  <div className="w-8 h-8 rounded-lg bg-[#e6f7f5] text-[#006a61] flex items-center justify-center group-hover:bg-[#006a61] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#131b2e] tracking-tight">
                  {totalReportsProcessed.toLocaleString()}
                </div>
                <div className="mt-2 text-[11px] text-[#006a61] font-semibold flex items-center gap-1">
                  <span>Data sources</span>
                  <span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </button>

              {/* Card 4: AI Match Accuracy */}
              <button
                type="button"
                onClick={() => handleTabChange('ai-settings')}
                className="p-4 bg-white rounded-2xl border border-[#c5c5d3]/40 hover:border-[#00236f]/50 hover:shadow-md transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-[#757682]">AI Match Accuracy</span>
                  <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#00236f] flex items-center justify-center group-hover:bg-[#00236f] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#131b2e] tracking-tight">96.2%</div>
                <div className="mt-2 text-[11px] text-[#006a61] font-semibold flex items-center gap-1">
                  <span>Configure rules</span>
                  <span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </button>

              {/* Card 5: Pending Reviews */}
              <button
                type="button"
                onClick={() => onNavigate('match-review')}
                className="p-4 bg-white rounded-2xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all text-left group cursor-pointer bg-gradient-to-b from-white to-amber-50/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-amber-900">Pending Reviews</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-amber-900 tracking-tight">74</div>
                <div className="mt-2 text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                  <span>Open queue</span>
                  <span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </button>
            </div>

            {/* Middle Section: Recent Platform Activity & Fast Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 Cols): Recent Platform Activity */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c5c5d3]/40 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#c5c5d3]/30">
                  <div>
                    <h2 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
                      Recent Platform Activity
                    </h2>
                    <p className="text-[12px] text-[#757682]">
                      Latest updates across projects, users, and AI operations
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabChange('activity')}
                    className="text-[12px] font-semibold text-[#00236f] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <span>View all logs</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {platformActivities.map((act) => (
                    <div
                      key={act.id}
                      onClick={() => setSelectedActivity(act)}
                      className="p-3.5 rounded-xl border border-[#c5c5d3]/30 hover:border-[#00236f]/40 hover:bg-[#f8f9ff] transition-all cursor-pointer flex items-start gap-3.5 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#00236f] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#00236f] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[18px]">
                          {act.category === 'User Management'
                            ? 'person'
                            : act.category === 'AI Settings'
                            ? 'tune'
                            : act.category === 'Contractor'
                            ? 'engineering'
                            : act.category === 'Projects'
                            ? 'folder'
                            : 'history'}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="font-semibold text-[13px] text-[#131b2e] group-hover:text-[#00236f] transition-colors leading-snug truncate">
                            {act.title}
                          </span>
                          <span className="font-mono text-[11px] text-[#757682] shrink-0">
                            {act.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11.5px] text-[#757682]">
                          <span>By {act.actor}</span>
                          {act.project && (
                            <>
                              <span>•</span>
                              <span className="truncate">{act.project}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#c5c5d3] text-[18px] group-hover:text-[#00236f] transition-colors shrink-0 self-center">
                        chevron_right
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column (1 Col): Admin Shortcuts & Governance */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-[#c5c5d3]/40 p-5 shadow-2xs">
                  <h3 className="font-headline-sm text-[15px] font-bold text-[#131b2e] mb-1">
                    Quick Actions
                  </h3>
                  <p className="text-[12px] text-[#757682] mb-3.5">
                    Frequent platform administration tasks
                  </p>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsAddUserOpen(true)}
                      className="w-full p-2.5 rounded-xl border border-[#c5c5d3]/40 hover:bg-[#eaedff] hover:border-[#00236f]/30 transition-all text-left flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#00236f] text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[17px]">person_add</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[13px] text-[#131b2e] group-hover:text-[#00236f]">
                          Add New User
                        </div>
                        <div className="text-[11px] text-[#757682]">
                          Assign role and project permissions
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCreateProjectOpen(true)}
                      className="w-full p-2.5 rounded-xl border border-[#c5c5d3]/40 hover:bg-[#eaedff] hover:border-[#00236f]/30 transition-all text-left flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#006a61] text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[17px]">create_new_folder</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[13px] text-[#131b2e] group-hover:text-[#00236f]">
                          Create Project
                        </div>
                        <div className="text-[11px] text-[#757682]">
                          Initialize workspace and WBS
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAddContractorOpen(true)}
                      className="w-full p-2.5 rounded-xl border border-[#c5c5d3]/40 hover:bg-[#eaedff] hover:border-[#00236f]/30 transition-all text-left flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#444651] text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[17px]">engineering</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[13px] text-[#131b2e] group-hover:text-[#00236f]">
                          Add Contractor
                        </div>
                        <div className="text-[11px] text-[#757682]">
                          Register approved execution partner
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* AI Matching Health Card */}
                <div className="bg-[#f2f3ff] rounded-2xl border border-[#c5c5d3]/50 p-4.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#00236f] uppercase tracking-wide">
                      AI Auto-Match Engine
                    </span>
                    <span className="text-[11px] font-bold text-[#006a61] bg-white px-2 py-0.5 rounded-full border border-[#c5c5d3]/40">
                      Threshold: {confidenceThreshold}%
                    </span>
                  </div>
                  <p className="text-[12px] text-[#444651] mb-3">
                    Automated activity verification is running. Updates with confidence above {confidenceThreshold}%
                    are approved automatically.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleTabChange('ai-settings')}
                    className="w-full py-2 bg-white hover:bg-[#00236f] hover:text-white text-[#00236f] font-semibold text-[12px] rounded-xl border border-[#c5c5d3]/60 transition-colors cursor-pointer"
                  >
                    Adjust AI Confidence Rules
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section: Projects Needing Attention */}
            <div className="bg-white rounded-2xl border border-[#c5c5d3]/40 p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#c5c5d3]/30">
                <div>
                  <h2 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
                    Projects Needing Attention
                  </h2>
                  <p className="text-[12px] text-[#757682]">
                    High-priority projects with schedule slippage or unresolved review items
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('projects')}
                  className="px-3 py-1.5 bg-[#eaedff] text-[#00236f] hover:bg-[#00236f] hover:text-white rounded-xl text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  View All Projects
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projects.slice(0, 3).map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setViewingProject(proj)}
                    className="p-4 rounded-xl border border-[#c5c5d3]/40 hover:border-[#00236f]/50 hover:shadow-xs transition-all cursor-pointer bg-white group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[10px] text-[#757682] bg-[#f8f9ff] px-1.5 py-0.5 rounded border border-[#c5c5d3]/30">
                          {proj.code}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            proj.status === 'On Track'
                              ? 'bg-[#e6f7f5] text-[#006a61]'
                              : proj.status === 'At Risk'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-[14px] text-[#131b2e] group-hover:text-[#00236f] transition-colors truncate">
                        {proj.name}
                      </h4>
                      <p className="text-[11.5px] text-[#757682] mb-3">{proj.location}</p>

                      {/* Progress Bar */}
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#757682]">Progress</span>
                          <span className="font-bold text-[#131b2e]">{proj.progress}%</span>
                        </div>
                        <div className="w-full bg-[#f2f3ff] rounded-full h-1.5">
                          <div
                            className="bg-[#00236f] h-1.5 rounded-full"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#c5c5d3]/20 flex items-center justify-between text-[11px]">
                      <span className="text-amber-800 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        <span>{proj.openIssues} open issues</span>
                      </span>
                      <span className="text-[#00236f] font-semibold group-hover:underline">
                        Details →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 2: USERS & ROLES
           ========================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Header with Title and Add User Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs">
              <div>
                <h2 className="font-headline-sm text-[18px] font-bold text-[#131b2e]">
                  Users & Roles
                </h2>
                <p className="text-[12px] text-[#757682]">
                  Manage who can access Plan2Progress and what they can do
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(true)}
                className="px-4 py-2 bg-[#00236f] hover:bg-[#001c59] text-white font-semibold text-[13px] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>Add User</span>
              </button>
            </div>

            {/* Search and Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#757682] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full h-10 pl-9 pr-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] placeholder:text-[#757682] focus:outline-none focus:border-[#00236f] focus:bg-white"
                  />
                </div>

                {/* Role Filter */}
                <div>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white cursor-pointer"
                  >
                    <option value="All">All Roles</option>
                    <option value="System Administrator">System Administrator</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Project Planner">Project Planner</option>
                    <option value="Site Supervisor">Site Supervisor</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </div>

                {/* Project Filter */}
                <div>
                  <select
                    value={userProjectFilter}
                    onChange={(e) => setUserProjectFilter(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white cursor-pointer"
                  >
                    <option value="All">All Projects</option>
                    {availableProjectNames.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="flex-1 h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                  {(userSearch || userRoleFilter !== 'All' || userProjectFilter !== 'All' || userStatusFilter !== 'All') && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserSearch('');
                        setUserRoleFilter('All');
                        setUserProjectFilter('All');
                        setUserStatusFilter('All');
                      }}
                      className="h-10 px-3 text-[12px] font-semibold text-[#757682] hover:text-[#131b2e] hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer shrink-0"
                      title="Reset filters"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-[#c5c5d3]/40 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#c5c5d3]/30 bg-[#f8f9ff] text-[11px] font-bold text-[#757682] uppercase tracking-wider">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Assigned Projects</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Active</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5c5d3]/20 text-[13px]">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#757682]">
                          No users found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#f8f9ff] transition-colors">
                          {/* User Name & Email */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#00236f] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                                {u.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-[#131b2e] leading-snug">
                                  {u.name}
                                </div>
                                <div className="text-[11.5px] text-[#757682]">{u.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-3 px-4">
                            <span className="font-medium text-[#131b2e]">{u.role}</span>
                          </td>

                          {/* Assigned Projects */}
                          <td className="py-3 px-4 max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {u.assignedProjects.map((p, pIdx) => (
                                <span
                                  key={pIdx}
                                  className="text-[11px] bg-[#eaedff] text-[#00236f] px-2 py-0.5 rounded-md font-medium truncate max-w-[200px]"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleUserStatus(u)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                                u.status === 'Active'
                                  ? 'bg-[#e6f7f5] text-[#006a61] hover:bg-[#d0f0eb]'
                                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              }`}
                              title="Click to toggle status"
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  u.status === 'Active' ? 'bg-[#006a61]' : 'bg-amber-600'
                                }`}
                              ></span>
                              {u.status}
                            </button>
                          </td>

                          {/* Last Active */}
                          <td className="py-3 px-4 font-mono text-[11px] text-[#757682]">
                            {u.lastActive}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setEditingUser(u)}
                                className="p-1.5 rounded-lg text-[#757682] hover:text-[#00236f] hover:bg-[#eaedff] transition-colors cursor-pointer"
                                title="Edit User"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setChangingRoleUser(u)}
                                className="p-1.5 rounded-lg text-[#757682] hover:text-[#00236f] hover:bg-[#eaedff] transition-colors cursor-pointer"
                                title="Change Role"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  admin_panel_settings
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleUserStatus(u)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  u.status === 'Active'
                                    ? 'text-[#757682] hover:text-amber-700 hover:bg-amber-50'
                                    : 'text-[#757682] hover:text-[#006a61] hover:bg-[#e6f7f5]'
                                }`}
                                title={u.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {u.status === 'Active' ? 'block' : 'check_circle'}
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 3: PROJECTS
           ========================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Header with Title & Create Project Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs">
              <div>
                <h2 className="font-headline-sm text-[18px] font-bold text-[#131b2e]">
                  Projects
                </h2>
                <p className="text-[12px] text-[#757682]">
                  Manage projects and control who can access them
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateProjectOpen(true)}
                className="px-4 py-2 bg-[#00236f] hover:bg-[#001c59] text-white font-semibold text-[13px] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[18px]">create_new_folder</span>
                <span>Create Project</span>
              </button>
            </div>

            {/* Project Search & Filter Strip */}
            <div className="bg-white p-4 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#757682] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects by name or code..."
                    className="w-full h-10 pl-9 pr-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] placeholder:text-[#757682] focus:outline-none focus:border-[#00236f] focus:bg-white"
                  />
                </div>

                <div>
                  <select
                    value={projectStatusFilter}
                    onChange={(e) => setProjectStatusFilter(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="On Track">On Track</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Planning">Planning</option>
                  </select>
                </div>

                <div>
                  <select
                    value={projectLocationFilter}
                    onChange={(e) => setProjectLocationFilter(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white cursor-pointer"
                  >
                    <option value="All">All Locations</option>
                    <option value="Assam">Assam</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Duliajan">Duliajan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Projects Table / Grid */}
            <div className="bg-white rounded-2xl border border-[#c5c5d3]/40 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#c5c5d3]/30 bg-[#f8f9ff] text-[11px] font-bold text-[#757682] uppercase tracking-wider">
                      <th className="py-3 px-4">Project</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Project Manager</th>
                      <th className="py-3 px-4">Overall Progress</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Team</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5c5d3]/20 text-[13px]">
                    {filteredProjects.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => setViewingProject(p)}
                        className="hover:bg-[#f8f9ff] transition-colors cursor-pointer"
                      >
                        {/* Project Name & Code */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#131b2e] leading-snug">
                            {p.name}
                          </div>
                          <div className="font-mono text-[11px] text-[#757682] mt-0.5">
                            {p.code}
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 text-[#444651]">{p.location}</td>

                        {/* Manager */}
                        <td className="py-3.5 px-4 font-medium text-[#131b2e]">{p.manager}</td>

                        {/* Progress Bar */}
                        <td className="py-3.5 px-4 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-[#e0e2ec] rounded-full h-1.5">
                              <div
                                className="bg-[#00236f] h-1.5 rounded-full"
                                style={{ width: `${p.progress}%` }}
                              />
                            </div>
                            <span className="font-bold text-[12px] text-[#131b2e] w-8 text-right">
                              {p.progress}%
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              p.status === 'On Track'
                                ? 'bg-[#e6f7f5] text-[#006a61]'
                                : p.status === 'At Risk'
                                ? 'bg-amber-50 text-amber-700'
                                : p.status === 'Delayed'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-[#eaedff] text-[#00236f]'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>

                        {/* Team Count */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[12px] text-[#131b2e] font-semibold">
                            {p.usersCount} users
                          </span>
                        </td>

                        {/* Actions */}
                        <td
                          className="py-3.5 px-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setViewingProject(p)}
                              className="px-2.5 py-1 text-[12px] font-semibold text-[#00236f] hover:bg-[#eaedff] rounded-lg cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => setManagingTeamProject(p)}
                              className="px-2.5 py-1 text-[12px] font-semibold text-[#006a61] hover:bg-[#e6f7f5] rounded-lg cursor-pointer"
                            >
                              Team
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 4: CONTRACTORS
           ========================================================= */}
        {activeTab === 'contractors' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs">
              <div>
                <h2 className="font-headline-sm text-[18px] font-bold text-[#131b2e]">
                  Contractors
                </h2>
                <p className="text-[12px] text-[#757682]">
                  Manage approved contracting partners and assigned project work packages
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddContractorOpen(true)}
                className="px-4 py-2 bg-[#00236f] hover:bg-[#001c59] text-white font-semibold text-[13px] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[18px]">engineering</span>
                <span>Add Contractor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredContractors.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00236f] text-white flex items-center justify-center font-bold text-[14px]">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-[15px] text-[#131b2e] leading-snug">
                          {c.name}
                        </h4>
                        <p className="text-[12px] text-[#757682]">{c.email}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#e6f7f5] text-[#006a61]">
                      {c.status}
                    </span>
                  </div>

                  <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 space-y-1 text-[12.5px]">
                    <div className="text-[11px] text-[#757682] uppercase font-semibold">
                      Assigned Scope
                    </div>
                    <div className="font-semibold text-[#131b2e]">{c.assignedWork}</div>
                    <div className="text-[11.5px] text-[#00236f]">{c.project}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center pt-1 text-[12px]">
                    <div className="p-2 bg-white border border-[#c5c5d3]/30 rounded-lg">
                      <div className="font-bold text-[#131b2e] text-[14px]">{c.activeWorkers}</div>
                      <div className="text-[11px] text-[#757682]">Active Workers</div>
                    </div>
                    <div className="p-2 bg-white border border-[#c5c5d3]/30 rounded-lg">
                      <div className="font-bold text-[#006a61] text-[14px]">{c.reportsThisMonth}</div>
                      <div className="text-[11px] text-[#757682]">Reports This Month</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 5: DATA SOURCES
           ========================================================= */}
        {activeTab === 'datasources' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs">
              <h2 className="font-headline-sm text-[18px] font-bold text-[#131b2e]">
                Data Sources
              </h2>
              <p className="text-[12px] text-[#757682]">
                Manage where project updates come from and verify live data ingestion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataSources.map((ds) => {
                const isSyncing = syncingSourceId === ds.id;
                return (
                  <div
                    key={ds.id}
                    className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#00236f] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[22px]">
                            {ds.name.includes('Report')
                              ? 'description'
                              : ds.name.includes('Excel')
                              ? 'table_chart'
                              : ds.name.includes('Schedule')
                              ? 'calendar_today'
                              : 'cloud_sync'}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            ds.status === 'Connected'
                              ? 'bg-[#e6f7f5] text-[#006a61]'
                              : 'bg-[#f2f3ff] text-[#757682]'
                          }`}
                        >
                          {ds.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-[16px] text-[#131b2e] leading-snug">
                          {ds.name}
                        </h3>
                        <p className="text-[11.5px] text-[#00236f] font-mono mt-0.5">{ds.type}</p>
                      </div>

                      <p className="text-[12px] text-[#444651] line-clamp-2">{ds.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#c5c5d3]/30 space-y-3">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-[#757682]">Last Sync</span>
                        <span className="font-mono font-semibold text-[#131b2e]">{ds.lastSync}</span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-[#757682]">Records Processed</span>
                        <span className="font-mono font-bold text-[#00236f]">
                          {ds.recordsProcessed.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedDataSource(ds)}
                          className="flex-1 py-1.5 text-[12px] font-semibold text-[#444651] hover:text-[#131b2e] hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer border border-[#c5c5d3]/50 text-center"
                        >
                          View Details
                        </button>

                        {ds.status === 'Connected' && (
                          <button
                            type="button"
                            disabled={isSyncing}
                            onClick={() => handleSyncNow(ds.id)}
                            className="flex-1 py-1.5 bg-[#00236f] hover:bg-[#001c59] text-white text-[12px] font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs disabled:opacity-60"
                          >
                            <span
                              className={`material-symbols-outlined text-[15px] ${
                                isSyncing ? 'animate-spin' : ''
                              }`}
                            >
                              sync
                            </span>
                            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 6: AI SETTINGS & FLOW EXPLANATION
           ========================================================= */}
        {activeTab === 'ai-settings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs">
              <div>
                <h2 className="font-headline-sm text-[18px] font-bold text-[#131b2e]">
                  AI Matching Settings
                </h2>
                <p className="text-[12px] text-[#757682]">
                  Control how Plan2Progress handles automatic activity matching and confidence limits
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {aiSettingsModified && (
                  <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold">
                    Unsaved changes
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveAiSettings}
                  className="px-5 py-2 bg-[#00236f] hover:bg-[#001c59] text-white font-semibold text-[13px] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

            {/* AI Rules Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Card 1: Auto-approve high-confidence matches */}
              <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[15px] text-[#131b2e]">
                      Auto-Approve High-Confidence Matches
                    </h3>
                    <p className="text-[12px] text-[#757682] mt-0.5">
                      Matches above this confidence level can be approved automatically without manual review.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={autoApprove}
                      onChange={(e) => {
                        setAutoApprove(e.target.checked);
                        setAiSettingsModified(true);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#e0e2ec] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c5c5d3] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00236f]"></div>
                  </label>
                </div>

                {autoApprove && (
                  <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 space-y-2">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="font-semibold text-[#131b2e]">Confidence Threshold</span>
                      <span className="font-mono font-bold text-[#00236f] text-[15px]">
                        {confidenceThreshold}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={98}
                      value={confidenceThreshold}
                      onChange={(e) => {
                        setConfidenceThreshold(Number(e.target.value));
                        setAiSettingsModified(true);
                      }}
                      className="w-full accent-[#00236f] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[#757682]">
                      <span>70% (More automated)</span>
                      <span>98% (Strictly verified)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Send uncertain matches for review */}
              <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[15px] text-[#131b2e]">
                      Send Uncertain Matches for Review
                    </h3>
                    <p className="text-[12px] text-[#757682] mt-0.5">
                      Matches below the threshold are routed to project planners for human verification.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={sendUncertain}
                      onChange={(e) => {
                        setSendUncertain(e.target.checked);
                        setAiSettingsModified(true);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#e0e2ec] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c5c5d3] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00236f]"></div>
                  </label>
                </div>

                <div className="p-3 bg-[#e6f7f5] rounded-xl text-[12px] text-[#006a61] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Protects project schedule integrity by enforcing planner oversight.</span>
                </div>
              </div>

              {/* Card 3: Check location consistency */}
              <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-[15px] text-[#131b2e]">
                    Check Location Consistency
                  </h3>
                  <p className="text-[12px] text-[#757682] mt-0.5">
                    Verifies reported chainage and GPS coordinates against the project WBS boundary.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={checkLocation}
                    onChange={(e) => {
                      setCheckLocation(e.target.checked);
                      setAiSettingsModified(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#e0e2ec] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c5c5d3] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00236f]"></div>
                </label>
              </div>

              {/* Card 4: Check reported quantities */}
              <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-[15px] text-[#131b2e]">
                    Check Reported Quantities
                  </h3>
                  <p className="text-[12px] text-[#757682] mt-0.5">
                    Flags updates exceeding realistic daily execution limits or total task capacity.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={checkQuantities}
                    onChange={(e) => {
                      setCheckQuantities(e.target.checked);
                      setAiSettingsModified(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#e0e2ec] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c5c5d3] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00236f]"></div>
                </label>
              </div>

              {/* Card 5: Learn from planner decisions */}
              <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs lg:col-span-2 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-[15px] text-[#131b2e]">
                    Learn from Planner Decisions
                  </h3>
                  <p className="text-[12px] text-[#757682] mt-0.5">
                    Adapts future suggestions by learning from manual approvals, rematches, and rejections.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={learnPlanner}
                    onChange={(e) => {
                      setLearnPlanner(e.target.checked);
                      setAiSettingsModified(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#e0e2ec] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c5c5d3] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00236f]"></div>
                </label>
              </div>
            </div>

            {/* Visual Explanation: How Matching Works */}
            <div className="bg-white p-6 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs space-y-4">
              <div className="border-b border-[#c5c5d3]/30 pb-3">
                <h3 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
                  How Matching Works
                </h3>
                <p className="text-[12px] text-[#757682]">
                  A transparent step-by-step pipeline from field report to verified schedule progress
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                {/* Step 1 */}
                <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 relative">
                  <div className="w-7 h-7 rounded-full bg-[#00236f] text-white font-bold text-[12px] flex items-center justify-center mb-2.5">
                    1
                  </div>
                  <h4 className="font-bold text-[13px] text-[#131b2e] mb-1">Site Report</h4>
                  <p className="text-[11.5px] text-[#757682] leading-relaxed">
                    Field engineers upload reports as PDF, Excel, or mobile photos.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 relative">
                  <div className="w-7 h-7 rounded-full bg-[#00236f] text-white font-bold text-[12px] flex items-center justify-center mb-2.5">
                    2
                  </div>
                  <h4 className="font-bold text-[13px] text-[#131b2e] mb-1">AI Reads Update</h4>
                  <p className="text-[11.5px] text-[#757682] leading-relaxed">
                    System extracts reported quantities, chainages, and work items.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 relative">
                  <div className="w-7 h-7 rounded-full bg-[#00236f] text-white font-bold text-[12px] flex items-center justify-center mb-2.5">
                    3
                  </div>
                  <h4 className="font-bold text-[13px] text-[#131b2e] mb-1">Finds Activity</h4>
                  <p className="text-[11.5px] text-[#757682] leading-relaxed">
                    Searches master project WBS to locate the corresponding activity.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 relative">
                  <div className="w-7 h-7 rounded-full bg-[#00236f] text-white font-bold text-[12px] flex items-center justify-center mb-2.5">
                    4
                  </div>
                  <h4 className="font-bold text-[13px] text-[#131b2e] mb-1">Checks Confidence</h4>
                  <p className="text-[11.5px] text-[#757682] leading-relaxed">
                    Evaluates location bounds, quantity rates, and text matching accuracy.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="p-4 bg-[#e6f7f5] rounded-xl border border-[#006a61]/30 relative">
                  <div className="w-7 h-7 rounded-full bg-[#006a61] text-white font-bold text-[12px] flex items-center justify-center mb-2.5">
                    5
                  </div>
                  <h4 className="font-bold text-[13px] text-[#006a61] mb-1">Approves / Reviews</h4>
                  <p className="text-[11.5px] text-[#006a61]/90 leading-relaxed">
                    Auto-approves high scores (&ge;{confidenceThreshold}%) or routes to planner queue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 7: SYSTEM ACTIVITY (AUDIT LOGS)
           ========================================================= */}
        {activeTab === 'activity' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs">
              <h2 className="font-headline-sm text-[18px] font-bold text-[#131b2e]">
                System Activity
              </h2>
              <p className="text-[12px] text-[#757682]">
                Audit log of all user management actions, data syncs, and AI rule modifications
              </p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#757682] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    placeholder="Search logs..."
                    className="w-full h-10 pl-9 pr-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] placeholder:text-[#757682] focus:outline-none focus:border-[#00236f] focus:bg-white"
                  />
                </div>

                <div>
                  <select
                    value={logActionFilter}
                    onChange={(e) => setLogActionFilter(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white cursor-pointer"
                  >
                    <option value="All">All Actions</option>
                    <option value="Added user">Added user</option>
                    <option value="Approved match">Approved match</option>
                    <option value="Changed AI threshold">Changed AI threshold</option>
                    <option value="Sync completed">Sync completed</option>
                    <option value="Created project">Created project</option>
                    <option value="Submitted update">Submitted update</option>
                  </select>
                </div>

                <div>
                  <select
                    value={logResultFilter}
                    onChange={(e) => setLogResultFilter(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white cursor-pointer"
                  >
                    <option value="All">All Results</option>
                    <option value="Success">Success</option>
                    <option value="Warning">Warning</option>
                    <option value="Info">Info</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#c5c5d3]/40 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#c5c5d3]/30 bg-[#f8f9ff] text-[11px] font-bold text-[#757682] uppercase tracking-wider">
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Project</th>
                      <th className="py-3 px-4">Result</th>
                      <th className="py-3 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5c5d3]/20 text-[13px]">
                    {filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedActivity(log)}
                        className="hover:bg-[#f8f9ff] transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 font-mono text-[11.5px] text-[#757682]">
                          {log.time}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#131b2e]">{log.user}</td>
                        <td className="py-3 px-4 text-[#444651]">{log.action}</td>
                        <td className="py-3 px-4 text-[#00236f]">{log.project}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              log.result === 'Success'
                                ? 'bg-[#e6f7f5] text-[#006a61]'
                                : log.result === 'Warning'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-[#eaedff] text-[#00236f]'
                            }`}
                          >
                            {log.result}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[#00236f] font-semibold text-[12px] hover:underline">
                            View
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 8: PLATFORM SETTINGS
           ========================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs">
              <div>
                <h2 className="font-headline-sm text-[18px] font-bold text-[#131b2e]">
                  Platform Settings
                </h2>
                <p className="text-[12px] text-[#757682]">
                  Organization profiles, notification preferences, and security policies
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onShowToast('Settings Saved', 'Platform settings successfully saved.', 'check_circle');
                }}
                className="px-5 py-2 bg-[#00236f] hover:bg-[#001c59] text-white font-semibold text-[13px] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Save Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Organization Profile */}
              <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs space-y-4">
                <h3 className="font-bold text-[15px] text-[#131b2e] border-b border-[#c5c5d3]/30 pb-2">
                  Organization Profile
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
                      Default Time Zone
                    </label>
                    <select
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] cursor-pointer"
                    >
                      <option value="IST (UTC+05:30) India Standard Time">
                        IST (UTC+05:30) India Standard Time
                      </option>
                      <option value="UTC (UTC+00:00) Coordinated Universal Time">
                        UTC (UTC+00:00) Coordinated Universal Time
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs space-y-4">
                <h3 className="font-bold text-[15px] text-[#131b2e] border-b border-[#c5c5d3]/30 pb-2">
                  Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[13px] text-[#131b2e]">
                        Email Notifications
                      </div>
                      <div className="text-[11px] text-[#757682]">Daily match digests</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifs}
                      onChange={(e) => setEmailNotifs(e.target.checked)}
                      className="w-4 h-4 rounded text-[#00236f] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[13px] text-[#131b2e]">
                        System Alerts
                      </div>
                      <div className="text-[11px] text-[#757682]">Pipeline failure notices</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemAlerts}
                      onChange={(e) => setSystemAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-[#00236f] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[13px] text-[#131b2e]">
                        Review Alerts
                      </div>
                      <div className="text-[11px] text-[#757682]">Planner queue backlog</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={reviewAlerts}
                      onChange={(e) => setReviewAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-[#00236f] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Security & Authentication */}
              <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-2xs space-y-4">
                <h3 className="font-bold text-[15px] text-[#131b2e] border-b border-[#c5c5d3]/30 pb-2">
                  Security & Access
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
                      Session Timeout
                    </label>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] cursor-pointer"
                    >
                      <option value="30 minutes">30 minutes</option>
                      <option value="60 minutes">60 minutes</option>
                      <option value="8 hours">8 hours</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="font-semibold text-[13px] text-[#131b2e]">
                        Two-Factor Auth
                      </div>
                      <div className="text-[11px] text-[#757682]">Required for all roles</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={twoFactorAuth}
                      onChange={(e) => setTwoFactorAuth(e.target.checked)}
                      className="w-4 h-4 rounded text-[#00236f] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          MODALS & DRAWERS
         ========================================================= */}
      {/* 1. Add User Modal */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddUser={handleAddUser}
        availableProjects={availableProjectNames}
      />

      {/* 2. Edit User Drawer */}
      <EditUserDrawer
        isOpen={editingUser !== null}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSaveUser={handleSaveUser}
        availableProjects={availableProjectNames}
      />

      {/* 3. Change Role Modal */}
      <ChangeRoleModal
        isOpen={changingRoleUser !== null}
        onClose={() => setChangingRoleUser(null)}
        user={changingRoleUser}
        onConfirmChangeRole={handleConfirmChangeRole}
      />

      {/* 4. Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreateProject={handleCreateProject}
        managersList={managerNames}
      />

      {/* 5. Project Detail Drawer */}
      <ProjectDetailDrawer
        isOpen={viewingProject !== null}
        onClose={() => setViewingProject(null)}
        project={viewingProject}
        onOpenManageTeam={(proj) => {
          setViewingProject(null);
          setManagingTeamProject(proj);
        }}
        onArchiveProject={handleArchiveProject}
        onOpenEditProject={(proj) => {
          onShowToast('Edit Project', `Opening edit view for ${proj.name}.`, 'edit');
        }}
      />

      {/* 6. Manage Team Modal */}
      <ManageTeamModal
        isOpen={managingTeamProject !== null}
        onClose={() => setManagingTeamProject(null)}
        project={managingTeamProject}
        allUsers={users}
        onAddUserToProject={handleAddUserToProject}
        onRemoveUserFromProject={handleRemoveUserFromProject}
      />

      {/* 7. Activity Detail Drawer */}
      <ActivityDetailDrawer
        isOpen={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
        activity={selectedActivity}
      />

      {/* 8. Data Source Detail Drawer */}
      <DataSourceDetailDrawer
        isOpen={selectedDataSource !== null}
        onClose={() => setSelectedDataSource(null)}
        source={selectedDataSource}
        onSyncNow={handleSyncNow}
        isSyncing={syncingSourceId === selectedDataSource?.id}
      />

      {/* 9. Add Contractor Modal */}
      <AddContractorModal
        isOpen={isAddContractorOpen}
        onClose={() => setIsAddContractorOpen(false)}
        onAddContractor={handleAddContractor}
        projectsList={availableProjectNames}
      />
    </div>
  );
};
