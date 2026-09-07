import React, { useState } from 'react';
import { NavigationPath, UserProfile } from '../types';
import { UserProfileMenu } from './UserProfileMenu';

const PATH_TITLES: Record<NavigationPath, string> = {
  'home': 'Project Overview',
  'site-reports': 'Site Reports',
  'match-review': 'Match & Review',
  'project-progress': 'Project Progress',
  'schedule': 'Schedule & WBS',
  'milestones': 'Milestones',
  'insights': 'Insights & Risk',
  'audit-trail': 'Audit Trail',
  'learn-improve': 'Learn & Improve',
  'settings': 'Settings',
  'submit-report': 'Submit Site Report',
  'my-reports': 'My Reports',
  'my-updates': 'My Updates',
  'my-work': 'My Work',
  'submit-update': 'Submit Update',
  'contractor-progress': 'Progress',
  'admin-overview': 'Admin Overview',
  'admin-users': 'Users & Roles',
  'admin-projects': 'Projects',
  'admin-contractors': 'Contractors',
  'admin-datasources': 'Data Sources',
  'admin-ai-settings': 'AI Settings',
  'admin-activity': 'System Activity',
  'admin-settings': 'Platform Settings',
};

interface HeaderProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetPage?: () => void;
  onOpenNotifications?: () => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  onSwitchRole?: (user: UserProfile) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  sidebarOpen,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onResetPage,
  onOpenNotifications,
  currentUser,
  onOpenAuthModal,
  onSignOut,
  onSwitchRole,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const isAdmin = currentUser?.roleType === 'admin';

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-[#ffffff] border-b border-[#c5c5d3]/40 z-30 px-3 md:px-6 flex items-center justify-between gap-3 transition-all duration-200 ease-in-out ${
        sidebarOpen ? 'left-0 md:left-64' : 'left-0'
      }`}
    >
      {/* Left: Sidebar Toggle + Breadcrumbs */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-[#444651] hover:text-[#00236f] hover:bg-[#eaedff] transition-colors focus:outline-none cursor-pointer flex items-center justify-center shrink-0"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <span className="material-symbols-outlined text-[22px]">
            {sidebarOpen ? 'menu_open' : 'menu'}
          </span>
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 font-body-sm text-[13px] text-[#444651] truncate">
            {isAdmin ? (
              <>
                <span className="font-semibold text-[#4f46e5]">Admin Console</span>
                <span className="text-[#757682]">/</span>
                <span className="font-medium text-[#131b2e] truncate">
                  {PATH_TITLES[currentPath] || 'Platform Governance'}
                </span>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:underline truncate text-[#444651] hover:text-[#00236f] hidden xs:inline cursor-pointer"
                >
                  Projects
                </button>
                <span className="text-[#757682] hidden xs:inline">/</span>
                <span className="font-headline-sm text-[13px] text-[#131b2e] truncate font-semibold">
                  Duliajan Gas
                </span>
                <span className="text-[#757682] hidden sm:inline">/</span>
                <span className="font-medium text-[#00236f] truncate hidden sm:inline text-[13px]">
                  {PATH_TITLES[currentPath] || 'Overview'}
                </span>
              </>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#86f2e4]/20 border border-[#006a61]/20 text-[#006a61] font-label-caps text-[10px] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
            Active
          </span>
        </div>
      </div>

      {/* Center: Search Field */}
      <div className="flex-1 max-w-md mx-2 hidden md:block">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[#757682] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isAdmin
                ? 'Search users, projects, contractors, AI rules...'
                : 'Search activities, reports, milestones...'
            }
            className="w-full h-9 pl-9 pr-4 bg-[#f2f3ff] border border-[#c5c5d3]/50 rounded-lg font-body-sm text-[13px] text-[#131b2e] placeholder:text-[#757682] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 text-[#757682] hover:text-[#131b2e] text-[14px]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: Demo Role Switcher, Reset View, Notifications & Avatar */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Quick Demo Role Switcher Button */}
        {currentUser && (
          <button
            type="button"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#eaedff] hover:bg-[#d8e0ff] border border-[#b6c4ff]/40 text-[#00236f] text-[12px] font-medium transition-colors cursor-pointer shadow-xs"
            title="Click to switch between 5 RBAC demo personas"
          >
            <span className="text-[#757682] text-[11px]">Viewing as:</span>
            <span className="font-bold text-[#00236f]">{currentUser.role}</span>
            <span className="material-symbols-outlined text-[15px] text-[#00236f]">
              arrow_drop_down
            </span>
          </button>
        )}

        {/* Reset Page Action */}
        {onResetPage && (
          <button
            type="button"
            onClick={onResetPage}
            aria-label="Reset page view"
            title="Reset page view and filters"
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#444651] hover:text-[#00236f] hover:bg-[#eaedff] border border-[#c5c5d3]/50 rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset View</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative p-1.5 rounded text-[#444651] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
        </button>

        {/* User Profile Avatar with Name & Role Indicator (Requirement 10) */}
        <div className="relative">
          {currentUser ? (
            <>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-[#eaedff] transition-colors cursor-pointer group focus:outline-none border border-transparent hover:border-[#c5c5d3]/40"
                title={`${currentUser.name} (${currentUser.role})`}
                aria-label="User account menu"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-headline-sm text-[12px] text-white shrink-0 font-bold shadow-xs group-hover:ring-2 group-hover:ring-[#86f2e4] transition-all"
                  style={{ backgroundColor: currentUser.avatarColor || '#00236f' }}
                >
                  {currentUser.initials}
                </div>
                <div className="hidden xl:flex flex-col text-left leading-tight">
                  <span className="text-[12px] font-bold text-[#131b2e] truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#757682] truncate">
                    {currentUser.role}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#757682] group-hover:text-[#00236f]">
                  {profileMenuOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                </span>
              </button>

              <UserProfileMenu
                isOpen={profileMenuOpen}
                onClose={() => setProfileMenuOpen(false)}
                user={currentUser}
                onSwitchRole={(userToSwitch) => {
                  if (onSwitchRole) onSwitchRole(userToSwitch);
                }}
                onNavigate={onNavigate}
                onSignOut={() => {
                  setProfileMenuOpen(false);
                  onSignOut();
                }}
              />
            </>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="h-8 px-3 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] text-white font-headline-sm text-[12px] font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
