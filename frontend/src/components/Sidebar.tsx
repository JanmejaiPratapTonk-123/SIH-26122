import React from 'react';
import { NavigationPath, UserProfile, UserRoleType } from '../types';

interface SidebarProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  pendingCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

interface NavItem {
  path: NavigationPath;
  label: string;
  icon?: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  pendingCount = 11,
  isOpen = true,
  onClose,
  currentUser,
  onOpenAuthModal,
}) => {
  const roleType: UserRoleType = currentUser?.roleType || 'planner';

  const handleNavClick = (path: NavigationPath) => {
    onNavigate(path);
  };

  // Build role-specific navigation sections
  const getNavSections = (): NavSection[] => {
    switch (roleType) {
      case 'manager':
        return [
          {
            title: 'Project Health',
            items: [
              { path: 'home', label: 'Home' },
              { path: 'project-progress', label: 'Project Progress' },
              { path: 'schedule', label: 'Schedule' },
              { path: 'milestones', label: 'Milestones' },
              { path: 'insights', label: 'Insights' },
              { path: 'site-reports', label: 'Reports' },
              { path: 'audit-trail', label: 'Audit Trail' },
            ],
          },
          {
            title: 'Settings',
            items: [{ path: 'settings', label: 'Settings' }],
          },
        ];

      case 'supervisor':
        return [
          {
            title: 'Field Reporting',
            items: [
              { path: 'home', label: 'Home' },
              { path: 'submit-report', label: 'Submit Site Report' },
              { path: 'my-reports', label: 'My Reports' },
              { path: 'my-updates', label: 'My Updates' },
            ],
          },
        ];

      case 'contractor':
        return [
          {
            title: 'Contractor Workspace',
            items: [
              { path: 'home', label: 'Home' },
              { path: 'my-work', label: 'My Work' },
              { path: 'submit-update', label: 'Submit Update' },
              { path: 'my-reports', label: 'My Reports' },
              { path: 'contractor-progress', label: 'Progress' },
            ],
          },
        ];

      case 'admin':
        return [
          {
            title: 'Admin Console',
            items: [
              { path: 'admin-overview', label: 'Admin Overview' },
              { path: 'admin-users', label: 'Users & Roles' },
              { path: 'admin-projects', label: 'Projects' },
              { path: 'admin-contractors', label: 'Contractors' },
              { path: 'admin-datasources', label: 'Data Sources' },
              { path: 'admin-ai-settings', label: 'AI Settings' },
              { path: 'admin-activity', label: 'System Activity' },
            ],
          },
          {
            title: 'Governance',
            items: [{ path: 'admin-settings', label: 'Platform Settings' }],
          },
        ];

      case 'planner':
      default:
        return [
          {
            title: 'Overview',
            items: [
              { path: 'home', label: 'Home' },
              { path: 'site-reports', label: 'Site Reports' },
              { path: 'match-review', label: 'Match & Review', badge: pendingCount },
              { path: 'project-progress', label: 'Project Progress' },
              { path: 'schedule', label: 'Schedule' },
              { path: 'milestones', label: 'Milestones' },
              { path: 'insights', label: 'Insights' },
            ],
          },
          {
            title: 'Governance',
            items: [
              { path: 'audit-trail', label: 'Audit Trail' },
              { path: 'learn-improve', label: 'Learn & Improve' },
            ],
          },
          {
            title: 'System',
            items: [{ path: 'settings', label: 'Settings' }],
          },
        ];
    }
  };

  const navSections = getNavSections();

  return (
    <>
      {/* Mobile/Narrow Screen Backdrop */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/25 z-30 md:hidden backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#ffffff] border-r border-[#c5c5d3]/40 flex flex-col z-40 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-xl md:shadow-none' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-3.5 flex items-center justify-between gap-2 border-b border-[#c5c5d3]/30 shrink-0">
          <button
            onClick={() => handleNavClick(roleType === 'admin' ? 'admin-overview' : 'home')}
            className="flex items-center gap-2 text-left cursor-pointer focus:outline-none min-w-0"
            title="Plan2Progress Workspace"
          >
            <img
              alt="Plan2Progress Logo"
              className="h-8 w-auto object-contain shrink-0"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XrNG2i3pvJ6cdHfw_WqzMoF-oVZVzwP4MC4Qcqw_weNkCDHxpIVLeBqpUkhFHEqL8yvvdgtVlf1T1a4YV3eFHGCgYyZOD3PCuykXl8JIsCIKgFqrqd7WkF70kwI87deTLMYWm_2JccPNqmFE0AQ-yMcFw2H4KhwqPZ6joDTCKfBFT3m8fdLjf8zLJCEFuI0TcqAcU4Y-EY1vzADmcellBJls2AW00qdpzsxG1vSvwc5PYGnL4nWn-wjA"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-headline-sm text-[14px] text-[#00236f] tracking-tight truncate font-bold">
                Plan2Progress
              </span>
              <span className="font-label-caps text-[9px] text-[#757682] tracking-wider uppercase truncate">
                {roleType === 'admin' ? 'Admin Console' : 'Project Controls'}
              </span>
            </div>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#757682] hover:text-[#00236f] hover:bg-[#eaedff] transition-colors cursor-pointer shrink-0"
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">first_page</span>
            </button>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-0.5">
              <div className="px-2 pb-1 font-label-caps text-[#757682] uppercase tracking-wider text-[10px]">
                {section.title}
              </div>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors text-left text-[13.5px] cursor-pointer ${
                        isActive
                          ? 'bg-[#00236f] text-white font-semibold shadow-xs'
                          : 'text-[#444651] hover:bg-[#eaedff] hover:text-[#131b2e] font-normal'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full font-mono text-[10px] font-semibold leading-none ${
                            isActive
                              ? 'bg-[#86f2e4] text-[#006f66]'
                              : 'bg-[#86f2e4] text-[#006f66]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer Area: Current Project & Active Persona */}
        <div className="p-2 border-t border-[#c5c5d3]/30 shrink-0 space-y-1 bg-[#ffffff]">
          {/* Assigned Project Card */}
          <div className="p-2 bg-[#f2f3ff] rounded-lg border border-[#c5c5d3]/40">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="font-label-caps text-[#757682] uppercase text-[10px]">
                {roleType === 'admin' ? 'Scope' : 'Assigned Project'}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-[#c5c5d3] text-[#006a61] font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
                {roleType === 'admin' ? '12 Active' : 'Active'}
              </span>
            </div>
            <div className="font-headline-sm text-[#131b2e] text-[12px] leading-snug truncate font-medium">
              {currentUser?.assignedProject || 'Duliajan Gas Compression Project'}
            </div>
          </div>

          {/* User Profile / Quick Switch Demo Role */}
          {currentUser ? (
            <div className="flex items-center justify-between p-1">
              <div
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 min-w-0 cursor-pointer hover:opacity-85 transition-opacity"
                title="Click to switch role or account"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-headline-sm text-[12px] text-white font-semibold shadow-xs"
                  style={{ backgroundColor: currentUser.avatarColor || '#00236f' }}
                >
                  {currentUser.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-headline-sm text-[13px] text-[#131b2e] truncate font-medium">
                    {currentUser.name}
                  </div>
                  <div className="font-body-sm text-[#757682] truncate text-[11px]">
                    {currentUser.role}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="text-[#00236f] hover:text-[#131b2e] text-[11px] font-semibold px-2 py-1 rounded bg-[#eaedff] hover:bg-[#d8e0ff] transition-colors cursor-pointer shrink-0"
                title="Switch demo role"
              >
                Switch Role
              </button>
            </div>
          ) : (
            <div className="p-2 bg-[#eaedff]/60 rounded-lg border border-[#b6c4ff]/50 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-[#00236f]">Guest</div>
                <div className="text-[10px] text-[#757682] truncate">Select persona</div>
              </div>
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="px-2.5 py-1 rounded bg-[#00236f] text-white text-[11px] font-semibold hover:bg-[#1e3a8a] transition-colors cursor-pointer shrink-0"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
