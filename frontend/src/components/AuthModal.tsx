import React, { useState } from 'react';
import { UserProfile, UserRoleType } from '../types';
import { DEFAULT_USERS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onShowToast: (title: string, message: string, icon?: string, isError?: boolean) => void;
}

interface RoleOption {
  roleType: UserRoleType;
  title: string;
  description: string;
  icon: string;
  badge: string;
  user: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onShowToast,
}) => {
  const roleOptions: RoleOption[] = [
    {
      roleType: 'admin',
      title: 'System Administrator',
      description: 'Manage users, projects and platform settings.',
      icon: 'admin_panel_settings',
      badge: 'IT Governance',
      user: DEFAULT_USERS.find((u) => u.roleType === 'admin') || DEFAULT_USERS[0],
    },
    {
      roleType: 'manager',
      title: 'Project Manager',
      description: 'Monitor project health, progress and risks.',
      icon: 'monitoring',
      badge: 'Executive',
      user: DEFAULT_USERS.find((u) => u.roleType === 'manager') || DEFAULT_USERS[1],
    },
    {
      roleType: 'planner',
      title: 'Project Planner',
      description: 'Review site updates and keep project progress accurate.',
      icon: 'calendar_month',
      badge: 'Controls Lead',
      user: DEFAULT_USERS.find((u) => u.roleType === 'planner') || DEFAULT_USERS[2],
    },
    {
      roleType: 'supervisor',
      title: 'Site Supervisor',
      description: 'Submit daily site updates from the field.',
      icon: 'construction',
      badge: 'Field Ops',
      user: DEFAULT_USERS.find((u) => u.roleType === 'supervisor') || DEFAULT_USERS[3],
    },
    {
      roleType: 'contractor',
      title: 'Contractor',
      description: 'Submit work progress and track assigned activities.',
      icon: 'engineering',
      badge: 'Execution Front',
      user: DEFAULT_USERS.find((u) => u.roleType === 'contractor') || DEFAULT_USERS[4],
    },
  ];

  const [selectedRoleType, setSelectedRoleType] = useState<UserRoleType>(
    currentUser?.roleType || 'planner'
  );

  if (!isOpen) return null;

  const selectedRole =
    roleOptions.find((r) => r.roleType === selectedRoleType) || roleOptions[2];

  const handleSelectRole = (card: RoleOption) => {
    setSelectedRoleType(card.roleType);
  };

  const handleApplyRole = () => {
    onLogin(selectedRole.user);
    onShowToast(
      'Demo Role Switched',
      `Demo role switched to ${selectedRole.title}.`,
      'switch_account'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#c5c5d3]/40 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#f8f9ff] px-6 py-4 border-b border-[#c5c5d3]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00236f] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[20px]">
                switch_account
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
                Switch Demo Role
              </h2>
              <p className="font-body-sm text-[12px] text-[#757682]">
                Prototype Role-Based Access Control (RBAC) Switcher
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#757682] hover:text-[#131b2e] hover:bg-[#c5c5d3]/20 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body: 5 Clean Role Cards */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-[12px] text-[#444651]">
            <span className="font-semibold text-[#131b2e]">
              Choose Persona to Experience:
            </span>
            <span className="text-[11px] text-[#006a61] bg-[#e6f7f5] px-2.5 py-0.5 rounded-full font-medium">
              Real-time Permission Adaptation
            </span>
          </div>

          <div className="space-y-2.5">
            {roleOptions.map((card) => {
              const isSelected = selectedRoleType === card.roleType;
              return (
                <button
                  key={card.roleType}
                  type="button"
                  onClick={() => handleSelectRole(card)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#eaedff]/70 border-[#00236f] shadow-xs ring-2 ring-[#00236f]/15'
                      : 'bg-white border-[#c5c5d3]/50 hover:border-[#00236f]/40 hover:bg-[#f8f9ff]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-[#00236f] text-white'
                          : 'bg-[#eaedff] text-[#00236f]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {card.icon}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-[14px] ${
                            isSelected ? 'text-[#00236f]' : 'text-[#131b2e]'
                          }`}
                        >
                          {card.title}
                        </span>
                        <span className="text-[10px] text-[#757682] bg-white border border-[#c5c5d3]/40 px-2 py-0.5 rounded">
                          {card.user.name}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#757682] truncate mt-0.5">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-[#444651] hidden sm:inline">
                      {card.badge}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-[#00236f] bg-[#00236f] text-white'
                          : 'border-[#c5c5d3]'
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-[14px]">
                          check
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Persona Access Summary Details */}
          <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/40 text-[12px] space-y-1">
            <div className="font-semibold text-[#131b2e] flex items-center justify-between">
              <span>{selectedRole.title} Scope</span>
              <span className="text-[11px] text-[#757682] font-normal">
                Project: {selectedRole.user.assignedProject}
              </span>
            </div>
            <p className="text-[#444651] text-[11px]">
              Authorized privileges: {selectedRole.user.permissions.slice(0, 4).join(', ')}
              {selectedRole.user.permissions.length > 4 && '...'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#f8f9ff] px-6 py-3.5 border-t border-[#c5c5d3]/30 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-[#444651] hover:bg-[#c5c5d3]/20 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyRole}
            className="px-6 py-2 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white font-semibold text-[13px] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Continue as {selectedRole.title}</span>
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
