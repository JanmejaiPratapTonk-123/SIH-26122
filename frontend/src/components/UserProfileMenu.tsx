import React, { useRef, useEffect, useState } from 'react';
import { UserProfile, NavigationPath, UserRoleType } from '../types';
import { DEFAULT_USERS } from '../data/mockData';

interface UserProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSwitchRole: (user: UserProfile) => void;
  onNavigate: (path: NavigationPath) => void;
  onSignOut: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  isOpen,
  onClose,
  user,
  onSwitchRole,
  onNavigate,
  onSignOut,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showRoleList, setShowRoleList] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const demoRoles = [
    {
      roleType: 'planner' as UserRoleType,
      title: 'Project Planner',
      user: DEFAULT_USERS.find((u) => u.roleType === 'planner') || DEFAULT_USERS[2],
      icon: 'calendar_month',
    },
    {
      roleType: 'manager' as UserRoleType,
      title: 'Project Manager',
      user: DEFAULT_USERS.find((u) => u.roleType === 'manager') || DEFAULT_USERS[1],
      icon: 'monitoring',
    },
    {
      roleType: 'supervisor' as UserRoleType,
      title: 'Site Supervisor',
      user: DEFAULT_USERS.find((u) => u.roleType === 'supervisor') || DEFAULT_USERS[3],
      icon: 'construction',
    },
    {
      roleType: 'contractor' as UserRoleType,
      title: 'Contractor',
      user: DEFAULT_USERS.find((u) => u.roleType === 'contractor') || DEFAULT_USERS[4],
      icon: 'engineering',
    },
    {
      roleType: 'admin' as UserRoleType,
      title: 'System Administrator',
      user: DEFAULT_USERS.find((u) => u.roleType === 'admin') || DEFAULT_USERS[0],
      icon: 'admin_panel_settings',
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-12 w-84 bg-white rounded-2xl shadow-2xl border border-[#c5c5d3]/50 py-3.5 z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Current Active Persona Header */}
      <div className="px-4 pb-3 border-b border-[#c5c5d3]/30">
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-[14px] shrink-0 shadow-xs"
            style={{ backgroundColor: user.avatarColor || '#00236f' }}
          >
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-headline-sm text-[15px] font-bold text-[#131b2e] truncate">
              {user.name}
            </div>
            <div className="font-body-sm text-[12px] text-[#757682] truncate">
              {user.email}
            </div>
            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eaedff] text-[#00236f] font-label-caps text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00236f]"></span>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 text-[11px] text-[#444651] bg-[#f8f9ff] px-2.5 py-1.5 rounded-lg border border-[#c5c5d3]/30 truncate">
          <span className="text-[#757682]">Project: </span>
          <span className="font-medium">{user.assignedProject}</span>
        </div>
      </div>

      {/* Demo Role Switcher Section (Requirement 8) */}
      <div className="px-3 py-2.5 bg-[#f8f9ff]/70 border-b border-[#c5c5d3]/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#00236f]">
              switch_account
            </span>
            <span className="font-label-caps text-[11px] uppercase tracking-wider text-[#131b2e] font-bold">
              Switch Demo Role
            </span>
          </div>
          <span className="text-[10px] text-[#006a61] font-semibold bg-[#e6f7f5] px-2 py-0.5 rounded-full">
            SIH Demo Mode
          </span>
        </div>

        <div className="space-y-1">
          {demoRoles.map((dr) => {
            const isCurrent = user.roleType === dr.roleType;
            return (
              <button
                key={dr.roleType}
                type="button"
                onClick={() => {
                  onSwitchRole(dr.user);
                  onClose();
                }}
                className={`w-full px-2.5 py-1.5 rounded-lg text-left text-[12px] flex items-center justify-between transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[#00236f] text-white font-semibold'
                    : 'text-[#444651] hover:bg-[#eaedff] hover:text-[#131b2e]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[16px]">
                    {dr.icon}
                  </span>
                  <span className="truncate">{dr.title}</span>
                </div>
                {isCurrent && (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Permissions Summary */}
      <div className="px-4 py-2 border-b border-[#c5c5d3]/30">
        <div className="font-label-caps text-[10px] uppercase tracking-wider text-[#757682] font-semibold mb-1">
          Authorized Privileges ({user.permissions.length})
        </div>
        <div className="flex flex-wrap gap-1">
          {user.permissions.slice(0, 2).map((perm, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#c5c5d3]/40 text-[#444651]"
            >
              {perm}
            </span>
          ))}
          {user.permissions.length > 2 && (
            <span className="text-[10px] text-[#757682] self-center">
              +{user.permissions.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Actions / Sign Out */}
      <div className="pt-1.5 px-1 space-y-0.5">
        <button
          type="button"
          onClick={() => {
            onClose();
            onNavigate('settings');
          }}
          className="w-full px-3 py-1.5 text-left text-[12.5px] font-medium text-[#444651] hover:bg-[#eaedff] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px] text-[#757682]">tune</span>
          <span>Role &amp; Session Settings</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onSignOut();
          }}
          className="w-full px-3 py-1.5 text-left text-[12.5px] font-medium text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px] text-[#ba1a1a]">logout</span>
          <span>Sign Out / Change Persona</span>
        </button>
      </div>
    </div>
  );
};
