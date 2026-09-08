import React, { useState } from 'react';
import { UserProfile, UserRoleType } from '../types';
import { DEFAULT_USERS } from '../data/mockData';
import { apiLogin } from '../services/api';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
  onShowToast: (title: string, message: string, icon?: string, isError?: boolean) => void;
}

interface RoleCardData {
  roleType: UserRoleType;
  title: string;
  description: string;
  icon: string;
  badge: string;
  user: UserProfile;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onShowToast }) => {
  // Default to Project Planner for primary demo experience
  const [selectedRoleType, setSelectedRoleType] = useState<UserRoleType>('planner');

  const roleOptions: RoleCardData[] = [
    {
      roleType: 'admin',
      title: 'System Administrator',
      description: 'Manage users, projects and platform settings.',
      icon: 'admin_panel_settings',
      badge: 'IT & Platform',
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
      badge: 'Core Controls',
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

  const activeRoleCard = roleOptions.find((r) => r.roleType === selectedRoleType) || roleOptions[2];

  const [email, setEmail] = useState(activeRoleCard.user.email);
  const [password, setPassword] = useState('password123');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSelectRole = (card: RoleCardData) => {
    setSelectedRoleType(card.roleType);
    setEmail(card.user.email);
    setPassword('password123');
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await apiLogin(email, password);
      onLogin(response.user as UserProfile);
      onShowToast('Authenticated', `Signed in as ${response.user.name} (${response.user.role}).`, 'verified');
    } catch (err: any) {
      onShowToast('Sign-in Failed', err.message || 'Could not authenticate with the backend.', 'error', true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9ff] flex flex-col justify-between text-[#131b2e] selection:bg-[#eaedff]">
      {/* Top Navigation / Brand Bar */}
      <header className="w-full h-16 border-b border-[#c5c5d3]/40 bg-white px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            alt="Plan2Progress Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XrNG2i3pvJ6cdHfw_WqzMoF-oVZVzwP4MC4Qcqw_weNkCDHxpIVLeBqpUkhFHEqL8yvvdgtVlf1T1a4YV3eFHGCgYyZOD3PCuykXl8JIsCIKgFqrqd7WkF70kwI87deTLMYWm_2JccPNqmFE0AQ-yMcFw2H4KhwqPZ6joDTCKfBFT3m8fdLjf8zLJCEFuI0TcqAcU4Y-EY1vzADmcellBJls2AW00qdpzsxG1vSvwc5PYGnL4nWn-wjA"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-[16px] font-bold text-[#00236f] tracking-tight">
              Plan2Progress
            </span>
            <span className="text-[10px] text-[#757682] uppercase tracking-wider font-semibold">
              Enterprise Execution Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eaedff] text-[#00236f] text-[11px] font-medium border border-[#b6c4ff]/50">
            <span className="w-2 h-2 rounded-full bg-[#00236f]"></span>
            SIH Prototype Evaluator Mode
          </span>
        </div>
      </header>

      {/* Main Login Canvas */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-4xl bg-white rounded-2xl border border-[#c5c5d3]/50 shadow-sm p-6 sm:p-10 md:p-12 space-y-8">
          {/* Header & Tagline */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-block font-label-caps text-[11px] uppercase tracking-wider text-[#006a61] font-semibold bg-[#86f2e4]/15 px-3 py-0.5 rounded-full border border-[#006a61]/20">
              Role-Based Access Control
            </div>
            <h1 className="font-headline-xl text-3xl sm:text-4xl text-[#131b2e] font-extrabold tracking-tight">
              Plan2Progress
            </h1>
            <p className="text-[18px] text-[#00236f] font-semibold tracking-tight">
              “From Plan to Progress.”
            </p>
            <p className="text-[14px] text-[#444651]">
              AI-powered execution intelligence for infrastructure projects.
            </p>
          </div>

          {/* Form and Role Selector */}
          <form onSubmit={handleContinue} className="space-y-8">
            {/* Enterprise Credentials Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div>
                <label className="block text-[12px] font-semibold text-[#444651] uppercase tracking-wider mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#757682]">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#c5c5d3] text-[14px] text-[#131b2e] bg-[#f8f9ff] focus:bg-white focus:outline-none focus:border-[#00236f] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#444651] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#757682]">
                    lock
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter workstation password"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#c5c5d3] text-[14px] text-[#131b2e] bg-[#f8f9ff] focus:bg-white focus:outline-none focus:border-[#00236f] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* "Sign in as" Section with 5 Clean Role Cards */}
            <div className="space-y-3 pt-2 border-t border-[#c5c5d3]/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h2 className="text-[14px] font-bold text-[#131b2e] uppercase tracking-wide">
                    Sign in as
                  </h2>
                  <p className="text-[12px] text-[#757682]">
                    Select a persona to experience its customized navigation, actions, and permissions.
                  </p>
                </div>
                <span className="text-[11px] text-[#006a61] font-medium bg-[#e6f7f5] px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  Demo Authentication
                </span>
              </div>

              {/* 5 Clean Role Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {roleOptions.map((card) => {
                  const isSelected = selectedRoleType === card.roleType;
                  return (
                    <button
                      key={card.roleType}
                      type="button"
                      onClick={() => handleSelectRole(card)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[148px] ${
                        isSelected
                          ? 'bg-[#eaedff]/70 border-[#00236f] shadow-sm ring-2 ring-[#00236f]/15'
                          : 'bg-white border-[#c5c5d3]/60 hover:border-[#00236f]/40 hover:bg-[#f8f9ff]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-1">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-[#00236f] text-white'
                                : 'bg-[#eaedff] text-[#00236f]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {card.icon}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="material-symbols-outlined text-[#00236f] text-[18px]">
                              check_circle
                            </span>
                          )}
                        </div>

                        <div>
                          <div
                            className={`text-[13px] font-bold leading-snug ${
                              isSelected ? 'text-[#00236f]' : 'text-[#131b2e]'
                            }`}
                          >
                            {card.title}
                          </div>
                          <p className="text-[11px] text-[#757682] leading-tight mt-1 line-clamp-3">
                            {card.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-[#c5c5d3]/20 flex items-center justify-between text-[10px] text-[#444651]">
                        <span className="truncate font-medium">{card.user.name}</span>
                        <span className="font-mono text-[#757682] shrink-0">{card.user.initials}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Persona Access Summary Pill */}
            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px]">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0 shadow-xs"
                  style={{ backgroundColor: activeRoleCard.user.avatarColor || '#00236f' }}
                >
                  {activeRoleCard.user.initials}
                </div>
                <div>
                  <div className="font-semibold text-[#131b2e] flex items-center gap-2">
                    <span>{activeRoleCard.user.name}</span>
                    <span className="text-[#757682]">•</span>
                    <span className="text-[#00236f] font-medium">{activeRoleCard.user.role}</span>
                  </div>
                  <div className="text-[11px] text-[#757682]">
                    Project: {activeRoleCard.user.assignedProject}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#006a61] bg-white px-2.5 py-1 rounded-md border border-[#006a61]/20 self-start sm:self-auto">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                <span>{activeRoleCard.user.permissions.length} Authorized Capabilities</span>
              </div>
            </div>

            {/* Main Action Button: "Continue as [Role Name] →" */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-[12px] text-[#757682] text-center sm:text-left">
                Enterprise SSO enabled • Role policies enforced at workstation gateway
              </p>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white font-semibold text-[14px] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Continue as {activeRoleCard.title}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 md:px-12 border-t border-[#c5c5d3]/30 bg-white text-[12px] text-[#757682] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Plan2Progress © 2026 • AI-Powered Infrastructure Execution Intelligence
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Security &amp; RBAC Framework</span>
          <span>•</span>
          <span>Duliajan Gas Compression Project</span>
        </div>
      </footer>
    </div>
  );
};
