import React, { useState, useEffect } from 'react';
import {
  NavigationPath,
  SiteReport,
  ReviewQueueItem,
  NeedsAttentionItem,
  ReviewCandidate,
  UserProfile,
} from './types';
import { INITIAL_REPORTS, INITIAL_QUEUE_ITEMS, DEFAULT_USERS } from './data/mockData';
import { fetchReviewQueue, approveMatch, rejectMatch, fetchReports } from './services/api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { HomeScreen } from './components/HomeScreen';
import { ManagerHomeScreen } from './components/ManagerHomeScreen';
import { SupervisorHomeScreen } from './components/SupervisorHomeScreen';
import { ContractorHomeScreen } from './components/ContractorHomeScreen';
import { AdminConsoleScreen } from './components/AdminConsoleScreen';
import { SiteReportsScreen } from './components/SiteReportsScreen';
import { MatchReviewScreen } from './components/MatchReviewScreen';
import {
  ProjectProgressScreen,
  ScheduleScreen,
  MilestonesScreen,
  AuditTrailScreen,
  LearnAndImproveScreen,
  InsightsScreen,
  SettingsScreen,
} from './components/OtherScreens';
import {
  ToastBanner,
  UploadModal,
  ReportDetailsModal,
  NeedsAttentionModal,
  ConfigureIntegrationsModal,
} from './components/Modals';

export default function App() {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<NavigationPath>('home');

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent sidebar state: stays open until manually closed
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Core Data States
  const [reports, setReports] = useState<SiteReport[]>(INITIAL_REPORTS);
  const [queueItems, setQueueItems] = useState<ReviewQueueItem[]>(INITIAL_QUEUE_ITEMS);

  // Modals & Popups
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedReportForDetails, setSelectedReportForDetails] = useState<SiteReport | null>(null);
  const [selectedAttentionItem, setSelectedAttentionItem] = useState<NeedsAttentionItem | null>(null);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Active User Authentication State (Default to Project Planner for primary SIH experience)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('p2p_active_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to restore user session', e);
    }
    // Default to Project Planner (Aarvi Sharma)
    return DEFAULT_USERS.find((u) => u.roleType === 'planner') || DEFAULT_USERS[2];
  });

  // Sync Review Queue and Reports with Backend API
  useEffect(() => {
    fetchReviewQueue()
      .then((items) => {
        if (items && items.length > 0) {
          setQueueItems(items);
        }
      })
      .catch((err) => console.warn('Queue API unavailable, using local mock items:', err));

    fetchReports()
      .then((reps) => {
        if (reps && reps.length > 0) {
          setReports(reps);
        }
      })
      .catch((err) => console.warn('Reports API unavailable:', err));
  }, [currentPath, currentUser?.roleType]);

  // Interactive Toast
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    icon?: string;
    isError?: boolean;
  } | null>(null);

  const showToast = (title: string, message: string, icon?: string, isError?: boolean) => {
    setToast({ title, message, icon, isError });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('p2p_active_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist user session', e);
    }
    if (user.roleType === 'admin') {
      setCurrentPath('admin-overview');
    } else {
      setCurrentPath('home');
    }
  };

  const handleSwitchRole = (newUser: UserProfile) => {
    setCurrentUser(newUser);
    try {
      localStorage.setItem('p2p_active_user', JSON.stringify(newUser));
    } catch (e) {
      console.error('Failed to persist user session', e);
    }

    if (newUser.roleType === 'admin') {
      setCurrentPath('admin-overview');
    } else {
      setCurrentPath('home');
    }

    // Exact requested subtle notification: "Demo role switched to [Role Name]."
    showToast(
      'Role Switched',
      `Demo role switched to ${newUser.role}.`,
      'switch_account'
    );
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('p2p_active_user');
    } catch (e) {
      console.error('Failed to clear user session', e);
    }
    showToast('Signed Out', 'Returned to role selection login screen.', 'logout');
  };

  // Navigate & reset page view accordingly
  const handleNavigate = (path: NavigationPath) => {
    // Check permission boundaries for sensitive paths
    if (path === 'match-review') {
      if (currentUser?.roleType === 'supervisor' || currentUser?.roleType === 'contractor') {
        showToast(
          'Action Restricted',
          "You don't have permission to access AI Match & Review.",
          'block',
          true
        );
        return;
      }
    }

    if (
      path.startsWith('admin-') &&
      currentUser?.roleType !== 'admin'
    ) {
      showToast(
        'Action Restricted',
        "You don't have permission to access Admin Console.",
        'block',
        true
      );
      return;
    }

    setCurrentPath(path);
    setSearchQuery('');
    setSelectedReportForDetails(null);
    setSelectedAttentionItem(null);
    setIsUploadModalOpen(false);
    setIsIntegrationsModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Explicit page reset action
  const handleResetPage = () => {
    setSearchQuery('');
    setSelectedReportForDetails(null);
    setSelectedAttentionItem(null);
    setIsUploadModalOpen(false);
    setIsIntegrationsModalOpen(false);
    setReports(INITIAL_REPORTS);
    setQueueItems(INITIAL_QUEUE_ITEMS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Page Reset', 'Page view, filters, and review queue items have been reset to default.');
  };

  // Add report handler
  const handleAddReport = (newReport: SiteReport) => {
    setReports((prev) => [newReport, ...prev]);
    showToast('Report Uploaded', `${newReport.fileName} added to site reports ledger.`);
  };

  // Queue actions
  const handleApproveQueueItem = async (itemId: string, activityId: string) => {
    // Restrict if not planner or admin
    if (currentUser && currentUser.roleType !== 'planner' && currentUser.roleType !== 'admin') {
      showToast(
        'Action Restricted',
        "You don't have permission to perform this action.",
        'block',
        true
      );
      return;
    }

    try {
      const res = await approveMatch(itemId, activityId);
      showToast('Match Approved!', res.message || 'Progress approved into schedule.', 'task_alt');
    } catch (err: any) {
      console.warn('API approve failed, applying state locally:', err);
    }

    setQueueItems((prev) => prev.filter((item) => item.id !== itemId));
    setReports((prev) =>
      prev.map((r) => {
        if (r.reviewCount && r.reviewCount > 0) {
          const nextCount = r.reviewCount - 1;
          return {
            ...r,
            reviewCount: nextCount,
            status: nextCount === 0 ? 'Processed' : 'Need Review',
          };
        }
        return r;
      })
    );
  };

  const handleRejectQueueItem = async (itemId: string) => {
    if (currentUser && currentUser.roleType !== 'planner' && currentUser.roleType !== 'admin') {
      showToast(
        'Action Restricted',
        "You don't have permission to perform this action.",
        'block',
        true
      );
      return;
    }

    try {
      await rejectMatch(itemId, 'Rejected by Planner');
    } catch (err) {
      console.warn('API reject failed:', err);
    }

    setQueueItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleReassignActivity = (itemId: string, candidate: ReviewCandidate) => {
    if (currentUser && currentUser.roleType !== 'planner' && currentUser.roleType !== 'admin') {
      showToast(
        'Action Restricted',
        "You don't have permission to perform this action.",
        'block',
        true
      );
      return;
    }

    setQueueItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            suggestedActivity: {
              ...item.suggestedActivity,
              title: candidate.title,
              activityId: candidate.activityId,
              workPackage: candidate.workPackage,
              confidence: candidate.matchPct,
              matchRationale: `Manually reassigned to ${candidate.title}. ${candidate.reason}`,
            },
          };
        }
        return item;
      })
    );
  };

  const handleRequestReport = (contractor: string) => {
    showToast(
      'Notice Dispatched',
      `Transmittal request sent to ${contractor} project controls representative.`
    );
  };

  // If user is logged out, render the Login Page with 5 role cards
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans antialiased">
        <LoginPage onLogin={handleLogin} onShowToast={showToast} />
        <ToastBanner toast={toast} onClose={() => setToast(null)} />
      </div>
    );
  }

  // Render role-specific Home dashboard or specific view
  const renderMainContent = () => {
    // 1. Admin Console views
    if (
      currentUser.roleType === 'admin' &&
      (currentPath === 'home' ||
        currentPath.startsWith('admin-') ||
        currentPath === 'settings')
    ) {
      return (
        <AdminConsoleScreen
          currentPath={currentPath === 'settings' ? 'admin-settings' : currentPath}
          onNavigate={handleNavigate}
          onShowToast={showToast}
          sidebarOpen={sidebarOpen}
        />
      );
    }

    // 2. Role-based Home screens
    if (currentPath === 'home') {
      switch (currentUser.roleType) {
        case 'manager':
          return (
            <ManagerHomeScreen
              onNavigate={handleNavigate}
              onShowToast={showToast}
              sidebarOpen={sidebarOpen}
            />
          );
        case 'supervisor':
          return (
            <SupervisorHomeScreen
              currentPath="home"
              onNavigate={handleNavigate}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onShowToast={showToast}
              sidebarOpen={sidebarOpen}
              onGlobalAddReport={handleAddReport}
            />
          );
        case 'contractor':
          return (
            <ContractorHomeScreen
              onNavigate={handleNavigate}
              onShowToast={showToast}
              sidebarOpen={sidebarOpen}
            />
          );
        case 'admin':
          return (
            <AdminConsoleScreen
              currentPath="admin-overview"
              onNavigate={handleNavigate}
              onShowToast={showToast}
              sidebarOpen={sidebarOpen}
            />
          );
        case 'planner':
        default:
          return (
            <HomeScreen
              onNavigate={handleNavigate}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onOpenRiskAlerts={() => handleNavigate('insights')}
              onRequestReport={handleRequestReport}
              onOpenAttentionDetails={(item) => setSelectedAttentionItem(item)}
              pendingCount={queueItems.length}
              sidebarOpen={sidebarOpen}
            />
          );
      }
    }

    // 3. Supervisor-specific paths
    if (
      currentUser.roleType === 'supervisor' &&
      (currentPath === 'submit-report' || currentPath === 'my-reports' || currentPath === 'my-updates')
    ) {
      return (
        <SupervisorHomeScreen
          currentPath={currentPath}
          onNavigate={handleNavigate}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          onShowToast={showToast}
          sidebarOpen={sidebarOpen}
          onGlobalAddReport={handleAddReport}
        />
      );
    }

    // 4. Contractor-specific paths
    if (
      currentUser.roleType === 'contractor' &&
      (currentPath === 'my-work' || currentPath === 'submit-update' || currentPath === 'contractor-progress' || currentPath === 'my-reports')
    ) {
      return (
        <ContractorHomeScreen
          onNavigate={handleNavigate}
          onShowToast={showToast}
          sidebarOpen={sidebarOpen}
        />
      );
    }

    // 5. Standard Project Views
    switch (currentPath) {
      case 'site-reports':
        return (
          <SiteReportsScreen
            reports={reports}
            onNavigate={handleNavigate}
            onAddReport={handleAddReport}
            onOpenReportDetails={(report) => setSelectedReportForDetails(report)}
            onOpenConfigureIntegrations={() => setIsIntegrationsModalOpen(true)}
            searchFilter={searchQuery}
          />
        );

      case 'match-review':
        return (
          <MatchReviewScreen
            queueItems={queueItems}
            onNavigate={handleNavigate}
            onApproveItem={handleApproveQueueItem}
            onRejectItem={handleRejectQueueItem}
            onReassignActivity={handleReassignActivity}
            onShowToast={showToast}
            onReloadQueue={() => {
              fetchReviewQueue()
                .then((items) => setQueueItems(items && items.length > 0 ? items : INITIAL_QUEUE_ITEMS))
                .catch(() => setQueueItems(INITIAL_QUEUE_ITEMS));
            }}
          />
        );

      case 'project-progress':
        return (
          <ProjectProgressScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );

      case 'schedule':
        return (
          <ScheduleScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );

      case 'milestones':
        return (
          <MilestonesScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );

      case 'insights':
        return (
          <InsightsScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );

      case 'audit-trail':
        return (
          <AuditTrailScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );

      case 'learn-improve':
        return (
          <LearnAndImproveScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSignOut={handleSignOut}
          />
        );

      default:
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenRiskAlerts={() => handleNavigate('insights')}
            onRequestReport={handleRequestReport}
            onOpenAttentionDetails={(item) => setSelectedAttentionItem(item)}
            pendingCount={queueItems.length}
            sidebarOpen={sidebarOpen}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#131b2e] flex flex-col font-sans antialiased selection:bg-[#00236f] selection:text-white">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        pendingCount={queueItems.length}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Container with dynamic sidebar offset */}
      <div
        className={`flex flex-col min-h-screen flex-1 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'md:pl-64' : 'pl-0'
        }`}
      >
        {/* Fixed Top Header with Demo Role Switcher */}
        <Header
          currentPath={currentPath}
          onNavigate={handleNavigate}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          onResetPage={handleResetPage}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onSignOut={handleSignOut}
          onSwitchRole={handleSwitchRole}
          onOpenNotifications={() => {
            showToast(
              'Notification Ledger',
              `3 high-priority reconciliation items awaiting sign-off.`
            );
          }}
        />

        {/* Scrollable Main Content Canvas */}
        <main className="flex-1 mt-16 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {renderMainContent()}
        </main>
      </div>

      {/* Floating Interactive Toast */}
      <ToastBanner toast={toast} onClose={() => setToast(null)} />

      {/* Auth / Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleSwitchRole}
        onShowToast={showToast}
      />

      {/* Project Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddReport={handleAddReport}
        onShowToast={showToast}
      />

      <ReportDetailsModal
        report={selectedReportForDetails}
        onClose={() => setSelectedReportForDetails(null)}
      />

      <NeedsAttentionModal
        item={selectedAttentionItem}
        onClose={() => setSelectedAttentionItem(null)}
        onTakeAction={(msg) => showToast('Action Dispatched', msg)}
      />

      <ConfigureIntegrationsModal
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
        onShowToast={showToast}
      />
    </div>
  );
}
