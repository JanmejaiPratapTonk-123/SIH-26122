import React, { useState } from 'react';
import {
  AdminUser,
  AdminProject,
  DataSourceItem,
  PlatformActivity,
  SystemActivityLog,
  AdminContractor,
  UserRoleType,
} from '../../types';

// ==========================================
// 1. ADD USER MODAL
// ==========================================
interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: Omit<AdminUser, 'id' | 'lastActive'>) => void;
  availableProjects: string[];
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onAddUser,
  availableProjects,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Project Planner');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([
    availableProjects[0] || 'Duliajan Gas Compression Project',
  ]);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const roleTypes: { label: string; roleType: UserRoleType }[] = [
    { label: 'System Administrator', roleType: 'admin' },
    { label: 'Project Manager', roleType: 'manager' },
    { label: 'Project Planner', roleType: 'planner' },
    { label: 'Site Supervisor', roleType: 'supervisor' },
    { label: 'Contractor', roleType: 'contractor' },
  ];

  const currentRoleObj = roleTypes.find((r) => r.label === role) || roleTypes[2];
  const requiresProjectAssignment = role !== 'System Administrator';

  const handleToggleProject = (proj: string) => {
    if (selectedProjects.includes(proj)) {
      if (selectedProjects.length > 1) {
        setSelectedProjects(selectedProjects.filter((p) => p !== proj));
      }
    } else {
      setSelectedProjects([...selectedProjects, proj]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter user full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid work email address.');
      return;
    }

    onAddUser({
      name: name.trim(),
      email: email.trim(),
      role,
      roleType: currentRoleObj.roleType,
      assignedProjects: role === 'System Administrator' ? ['All Projects'] : selectedProjects,
      status,
    });
    setName('');
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#c5c5d3]/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#c5c5d3]/30 flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-[18px] font-bold text-[#131b2e]">
              Add New User
            </h3>
            <p className="text-[12px] text-[#757682]">
              Create an account and assign workspace permissions
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#757682] hover:text-[#131b2e] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-[12px] rounded-lg border border-red-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arunav Sharma"
              className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] placeholder:text-[#757682] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
              Work Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@plan2progress.demo"
              className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] placeholder:text-[#757682] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
                Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="System Administrator">System Administrator</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Project Planner">Project Planner</option>
                <option value="Site Supervisor">Site Supervisor</option>
                <option value="Contractor">Contractor</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Assign Projects (shown when role is Manager, Planner, Supervisor, or Contractor) */}
          {requiresProjectAssignment ? (
            <div className="pt-2">
              <label className="block text-[12px] font-semibold text-[#131b2e] mb-1.5">
                Assign Projects
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-[#f8f9ff] border border-[#c5c5d3]/40 rounded-xl">
                {availableProjects.map((p) => {
                  const isChecked = selectedProjects.includes(p);
                  return (
                    <label
                      key={p}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors text-[12.5px] text-[#131b2e]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleProject(p)}
                        className="rounded border-[#c5c5d3] text-[#00236f] focus:ring-[#00236f] w-4 h-4 cursor-pointer"
                      />
                      <span className="truncate">{p}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#eaedff] text-[#00236f] rounded-xl text-[12px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>System Administrators automatically have access to all projects.</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#c5c5d3]/30 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-[#444651] hover:text-[#131b2e] hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-[13px] font-semibold text-white bg-[#00236f] hover:bg-[#001c59] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Create User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. EDIT USER DRAWER
// ==========================================
interface EditUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onSaveUser: (updatedUser: AdminUser) => void;
  availableProjects: string[];
}

export const EditUserDrawer: React.FC<EditUserDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser,
  availableProjects,
}) => {
  const [role, setRole] = useState(user?.role || 'Project Planner');
  const [status, setStatus] = useState<'Active' | 'Inactive'>(user?.status || 'Active');
  const [assignedProjects, setAssignedProjects] = useState<string[]>(
    user?.assignedProjects || []
  );

  React.useEffect(() => {
    if (user) {
      setRole(user.role);
      setStatus(user.status);
      setAssignedProjects(user.assignedProjects);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const roleTypes: { label: string; roleType: UserRoleType }[] = [
    { label: 'System Administrator', roleType: 'admin' },
    { label: 'Project Manager', roleType: 'manager' },
    { label: 'Project Planner', roleType: 'planner' },
    { label: 'Site Supervisor', roleType: 'supervisor' },
    { label: 'Contractor', roleType: 'contractor' },
  ];

  const handleToggleProject = (proj: string) => {
    if (assignedProjects.includes(proj)) {
      if (assignedProjects.length > 1) {
        setAssignedProjects(assignedProjects.filter((p) => p !== proj));
      }
    } else {
      setAssignedProjects([...assignedProjects, proj]);
    }
  };

  const handleSave = () => {
    const roleObj = roleTypes.find((r) => r.label === role) || roleTypes[2];
    onSaveUser({
      ...user,
      role,
      roleType: roleObj.roleType,
      status,
      assignedProjects: role === 'System Administrator' ? ['All Projects'] : assignedProjects,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/35 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl border-l border-[#c5c5d3]/50 flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#c5c5d3]/30 flex items-center justify-between bg-[#f8f9ff]">
          <div>
            <h3 className="font-headline-sm text-[17px] font-bold text-[#131b2e]">
              Edit User Profile
            </h3>
            <p className="text-[12px] text-[#757682]">
              Update role, workspace assignments, and access status
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#757682] hover:text-[#131b2e] hover:bg-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* User Profile Card */}
          <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#c5c5d3]/40 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#00236f] text-white font-bold text-[16px] flex items-center justify-center shrink-0 shadow-xs">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-[15px] text-[#131b2e] truncate">{user.name}</h4>
              <p className="text-[12px] text-[#757682] truncate">{user.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[11px] text-[#757682]">Last Active:</span>
                <span className="font-mono text-[11px] text-[#131b2e] font-semibold">
                  {user.lastActive}
                </span>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-[12px] font-semibold text-[#131b2e] mb-1.5">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors cursor-pointer"
            >
              <option value="System Administrator">System Administrator</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Project Planner">Project Planner</option>
              <option value="Site Supervisor">Site Supervisor</option>
              <option value="Contractor">Contractor</option>
            </select>
          </div>

          {/* Account Status */}
          <div>
            <label className="block text-[12px] font-semibold text-[#131b2e] mb-1.5">
              Account Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Active')}
                className={`py-2 px-3 rounded-xl border text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  status === 'Active'
                    ? 'bg-[#e6f7f5] text-[#006a61] border-[#006a61]/30'
                    : 'bg-white text-[#757682] border-[#c5c5d3]/50 hover:bg-[#f8f9ff]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#006a61]"></span>
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus('Inactive')}
                className={`py-2 px-3 rounded-xl border text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  status === 'Inactive'
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-white text-[#757682] border-[#c5c5d3]/50 hover:bg-[#f8f9ff]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                Inactive
              </button>
            </div>
          </div>

          {/* Assigned Projects */}
          {role !== 'System Administrator' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-semibold text-[#131b2e]">
                  Assigned Projects
                </label>
                <span className="text-[11px] text-[#757682]">
                  {assignedProjects.length} selected
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto p-2.5 bg-[#f8f9ff] border border-[#c5c5d3]/40 rounded-xl">
                {availableProjects.map((p) => {
                  const isChecked = assignedProjects.includes(p);
                  return (
                    <label
                      key={p}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors text-[13px] text-[#131b2e]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleProject(p)}
                        className="rounded border-[#c5c5d3] text-[#00236f] focus:ring-[#00236f] w-4 h-4 cursor-pointer"
                      />
                      <span className="truncate">{p}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#eaedff] text-[#00236f] rounded-xl text-[12px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>System Administrators automatically have access to all projects.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#c5c5d3]/30 flex items-center justify-end gap-2.5 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-[#444651] hover:text-[#131b2e] hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-[13px] font-semibold text-white bg-[#00236f] hover:bg-[#001c59] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. CHANGE ROLE MODAL
// ==========================================
interface ChangeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onConfirmChangeRole: (userId: string, newRole: string) => void;
}

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirmChangeRole,
}) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'Project Planner');

  React.useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const roles = [
    'System Administrator',
    'Project Manager',
    'Project Planner',
    'Site Supervisor',
    'Contractor',
  ];

  const handleUpdate = () => {
    onConfirmChangeRole(user.id, selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#c5c5d3]/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#c5c5d3]/30 flex items-center justify-between">
          <h3 className="font-headline-sm text-[17px] font-bold text-[#131b2e]">
            Change {user.name}&apos;s role?
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#757682] hover:text-[#131b2e] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30">
              <span className="text-[11px] text-[#757682] uppercase font-semibold block mb-0.5">
                Current Role
              </span>
              <span className="font-bold text-[#131b2e]">{user.role}</span>
            </div>
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30">
              <span className="text-[11px] text-[#757682] uppercase font-semibold block mb-0.5">
                New Role
              </span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-white border border-[#c5c5d3]/60 rounded-lg px-2 py-1 text-[12px] font-semibold text-[#00236f] focus:outline-none cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-800 text-[12px] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">
              warning
            </span>
            <p>
              <strong>Warning:</strong> Changing this role will change the user&apos;s available features
              and permissions across all assigned projects.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-[#444651] hover:text-[#131b2e] hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="px-5 py-2 text-[13px] font-semibold text-white bg-[#00236f] hover:bg-[#001c59] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Update Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. CREATE PROJECT MODAL
// ==========================================
interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (proj: AdminProject) => void;
  managersList: string[];
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  managersList,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState(managersList[0] || 'A. Kumar');
  const [startDate, setStartDate] = useState('01 Oct 2026');
  const [targetCompletion, setTargetCompletion] = useState('31 May 2027');
  const [status, setStatus] = useState<AdminProject['status']>('Planning');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a project name.');
      return;
    }
    const autoCode = code.trim() || `OIL-${name.slice(0, 3).toUpperCase()}-2026`;

    const newProject: AdminProject = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      code: autoCode,
      location: location.trim() || 'Assam, India',
      manager,
      progress: 0,
      status,
      usersCount: 1,
      openIssues: 0,
      scheduleStatus: 'Scheduled to start',
      contractorsCount: 0,
      reportsThisMonth: 0,
      startDate,
      targetCompletion,
      assignedUsers: [
        {
          id: `lead-${Date.now()}`,
          name: manager,
          email: `${manager.toLowerCase().replace(/[^a-z]/g, '')}@plan2progress.demo`,
          role: 'Project Manager',
          status: 'Active',
        },
      ],
    };

    onCreateProject(newProject);
    setName('');
    setCode('');
    setLocation('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#c5c5d3]/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#c5c5d3]/30 flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-[18px] font-bold text-[#131b2e]">
              Create New Project
            </h3>
            <p className="text-[12px] text-[#757682]">
              Initialize a project workspace and assign project leadership
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#757682] hover:text-[#131b2e] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-[12px] rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Numaligarh Pipeline Expansion"
              className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] placeholder:text-[#757682] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
                Project Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. NRL-PIPE-09"
                className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] placeholder:text-[#757682] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Duliajan, Assam"
                className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] placeholder:text-[#757682] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
                Project Manager *
              </label>
              <select
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors cursor-pointer"
              >
                {managersList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AdminProject['status'])}
                className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="Planning">Planning</option>
                <option value="On Track">On Track</option>
                <option value="At Risk">At Risk</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
                Start Date
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="01 Oct 2026"
                className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
                Target Completion
              </label>
              <input
                type="text"
                value={targetCompletion}
                onChange={(e) => setTargetCompletion(e.target.value)}
                placeholder="31 May 2027"
                className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#c5c5d3]/30 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-[#444651] hover:text-[#131b2e] hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-[13px] font-semibold text-white bg-[#00236f] hover:bg-[#001c59] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 5. PROJECT DETAIL DRAWER
// ==========================================
interface ProjectDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: AdminProject | null;
  onOpenManageTeam: (project: AdminProject) => void;
  onArchiveProject: (projectId: string) => void;
  onOpenEditProject?: (project: AdminProject) => void;
}

export const ProjectDetailDrawer: React.FC<ProjectDetailDrawerProps> = ({
  isOpen,
  onClose,
  project,
  onOpenManageTeam,
  onArchiveProject,
  onOpenEditProject,
}) => {
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/35 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl border-l border-[#c5c5d3]/50 flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#c5c5d3]/30 flex items-start justify-between bg-[#f8f9ff]">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] font-semibold text-[#757682] bg-white px-2 py-0.5 rounded border border-[#c5c5d3]/40">
                {project.code}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  project.status === 'On Track'
                    ? 'bg-[#e6f7f5] text-[#006a61]'
                    : project.status === 'At Risk'
                    ? 'bg-amber-50 text-amber-700'
                    : project.status === 'Delayed'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-[#eaedff] text-[#00236f]'
                }`}
              >
                {project.status}
              </span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-bold text-[#131b2e] leading-snug">
              {project.name}
            </h3>
            <p className="text-[12px] text-[#757682] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span>{project.location}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#757682] hover:text-[#131b2e] hover:bg-white transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30">
              <div className="text-[11px] text-[#757682] uppercase font-semibold">
                Project Manager
              </div>
              <div className="font-bold text-[14px] text-[#131b2e] mt-1">
                {project.manager}
              </div>
            </div>

            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30">
              <div className="text-[11px] text-[#757682] uppercase font-semibold">
                Schedule Status
              </div>
              <div className="font-bold text-[14px] text-[#00236f] mt-1">
                {project.scheduleStatus}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 space-y-2">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-semibold text-[#131b2e]">Overall Progress</span>
              <span className="font-bold text-[#00236f] text-[15px]">{project.progress}%</span>
            </div>
            <div className="w-full bg-[#e0e2ec] rounded-full h-2">
              <div
                className="bg-[#00236f] h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#757682] pt-1">
              <span>Start: {project.startDate}</span>
              <span>Target: {project.targetCompletion}</span>
            </div>
          </div>

          {/* 3 Stats: Team, Contractors, Reports */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 bg-white border border-[#c5c5d3]/40 rounded-xl">
              <div className="text-xl font-bold text-[#131b2e]">{project.usersCount}</div>
              <div className="text-[11px] text-[#757682]">Team Members</div>
            </div>
            <div className="p-3 bg-white border border-[#c5c5d3]/40 rounded-xl">
              <div className="text-xl font-bold text-[#131b2e]">{project.contractorsCount}</div>
              <div className="text-[11px] text-[#757682]">Contractors</div>
            </div>
            <div className="p-3 bg-white border border-[#c5c5d3]/40 rounded-xl">
              <div className="text-xl font-bold text-[#006a61]">{project.reportsThisMonth}</div>
              <div className="text-[11px] text-[#757682]">Reports This Month</div>
            </div>
          </div>

          {/* Assigned Users List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-2">
              <h4 className="font-bold text-[14px] text-[#131b2e]">
                Assigned Team ({project.assignedUsers.length})
              </h4>
              <button
                type="button"
                onClick={() => onOpenManageTeam(project)}
                className="text-[12px] text-[#00236f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">manage_accounts</span>
                <span>Manage Team</span>
              </button>
            </div>

            {project.assignedUsers.length === 0 ? (
              <p className="text-[12px] text-[#757682] italic py-2">
                No users assigned yet. Click &apos;Manage Team&apos; to add planners or supervisors.
              </p>
            ) : (
              <div className="space-y-2">
                {project.assignedUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 rounded-xl bg-[#f8f9ff] border border-[#c5c5d3]/30 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-[13px] text-[#131b2e]">{u.name}</div>
                      <div className="text-[11px] text-[#757682]">{u.role}</div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#006a61] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
                      {u.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#c5c5d3]/30 space-y-2.5">
            <div className="flex gap-2">
              {onOpenEditProject && (
                <button
                  type="button"
                  onClick={() => onOpenEditProject(project)}
                  className="flex-1 h-10 px-4 rounded-xl border border-[#c5c5d3]/60 hover:bg-[#f2f3ff] text-[13px] font-semibold text-[#131b2e] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#00236f]">
                    edit
                  </span>
                  <span>Edit Project</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenManageTeam(project)}
                className="flex-1 h-10 px-4 rounded-xl bg-[#00236f] hover:bg-[#001c59] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">group_add</span>
                <span>Manage Team</span>
              </button>
            </div>

            {!showArchiveConfirm ? (
              <button
                type="button"
                onClick={() => setShowArchiveConfirm(true)}
                className="w-full h-9 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">archive</span>
                <span>Archive Project</span>
              </button>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <p className="text-[12px] text-red-700">
                  Are you sure you want to archive <strong>{project.name}</strong>? Users will no
                  longer be able to submit reports for it.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowArchiveConfirm(false)}
                    className="px-3 py-1 bg-white border border-[#c5c5d3] text-[12px] rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onArchiveProject(project.id);
                      setShowArchiveConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-[12px] rounded-lg cursor-pointer"
                  >
                    Confirm Archive
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. MANAGE PROJECT TEAM MODAL
// ==========================================
interface ManageTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AdminProject | null;
  allUsers: AdminUser[];
  onAddUserToProject: (projectId: string, user: AdminUser, role: string) => void;
  onRemoveUserFromProject: (projectId: string, userId: string) => void;
}

export const ManageTeamModal: React.FC<ManageTeamModalProps> = ({
  isOpen,
  onClose,
  project,
  allUsers,
  onAddUserToProject,
  onRemoveUserFromProject,
}) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('Project Planner');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen || !project) return null;

  // Filter out users already assigned
  const unassignedUsers = allUsers.filter(
    (u) => !project.assignedUsers.some((pu) => pu.id === u.id || pu.name === u.name)
  );

  const handleAdd = () => {
    const usr = allUsers.find((u) => u.id === selectedUserId);
    if (!usr) return;
    onAddUserToProject(project.id, usr, selectedRole);
    setSelectedUserId('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#c5c5d3]/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#c5c5d3]/30 flex items-center justify-between bg-[#f8f9ff]">
          <div>
            <h3 className="font-headline-sm text-[17px] font-bold text-[#131b2e]">
              Manage Team: {project.name}
            </h3>
            <p className="text-[12px] text-[#757682]">
              Assign users, update project roles, or remove access
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#757682] hover:text-[#131b2e] hover:bg-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Header Action: Add User Button */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-[13px] text-[#131b2e]">
              Assigned Team Members ({project.assignedUsers.length})
            </span>
            {!isAdding && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="px-3 py-1.5 bg-[#eaedff] text-[#00236f] hover:bg-[#d8e0ff] rounded-xl text-[12px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add User</span>
              </button>
            )}
          </div>

          {/* Inline Add User Form */}
          {isAdding && (
            <div className="p-4 bg-[#f8f9ff] border border-[#c5c5d3]/50 rounded-xl space-y-3 animate-in fade-in duration-150">
              <div className="font-semibold text-[13px] text-[#131b2e]">
                Assign Existing User to Project
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-[#757682] mb-1">
                    Select User
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white border border-[#c5c5d3]/60 rounded-lg text-[12px] text-[#131b2e] focus:outline-none focus:border-[#00236f] cursor-pointer"
                  >
                    <option value="">-- Choose User --</option>
                    {unassignedUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#757682] mb-1">
                    Project Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white border border-[#c5c5d3]/60 rounded-lg text-[12px] text-[#131b2e] focus:outline-none focus:border-[#00236f] cursor-pointer"
                  >
                    <option value="Project Planner">Project Planner</option>
                    <option value="Site Supervisor">Site Supervisor</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-[12px] text-[#757682] hover:bg-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedUserId}
                  onClick={handleAdd}
                  className="px-4 py-1.5 bg-[#00236f] hover:bg-[#001c59] disabled:opacity-50 text-white text-[12px] font-semibold rounded-lg cursor-pointer"
                >
                  Confirm Add
                </button>
              </div>
            </div>
          )}

          {/* Assigned Members List */}
          <div className="divide-y divide-[#c5c5d3]/20">
            {project.assignedUsers.map((member) => (
              <div
                key={member.id}
                className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#00236f] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[13px] text-[#131b2e] truncate">
                      {member.name}
                    </div>
                    <div className="text-[11px] text-[#757682]">{member.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[#006a61] bg-[#e6f7f5] px-2 py-0.5 rounded-full font-semibold">
                    {member.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveUserFromProject(project.id, member.id)}
                    className="p-1 rounded-lg text-red-600 hover:bg-red-50 text-[12px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    title="Remove user from project"
                  >
                    <span className="material-symbols-outlined text-[16px]">person_remove</span>
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#c5c5d3]/30 bg-[#f8f9ff] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-semibold text-white bg-[#00236f] hover:bg-[#001c59] rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. ACTIVITY DETAIL DRAWER
// ==========================================
interface ActivityDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activity: PlatformActivity | SystemActivityLog | null;
}

export const ActivityDetailDrawer: React.FC<ActivityDetailDrawerProps> = ({
  isOpen,
  onClose,
  activity,
}) => {
  if (!isOpen || !activity) return null;

  const isPlatformActivity = 'title' in activity;
  const title = isPlatformActivity ? activity.title : `${activity.action} by ${activity.user}`;
  const actor = isPlatformActivity ? activity.actor : activity.user;
  const project = activity.project || 'General Platform';
  const detail = activity.detail;
  const time = activity.time;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/35 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl border-l border-[#c5c5d3]/50 flex flex-col z-10 animate-in slide-in-from-right duration-200">
        <div className="px-6 py-5 border-b border-[#c5c5d3]/30 flex items-center justify-between bg-[#f8f9ff]">
          <div>
            <h3 className="font-headline-sm text-[17px] font-bold text-[#131b2e]">
              Event Details
            </h3>
            <p className="text-[12px] text-[#757682]">Audit log entry verification</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#757682] hover:text-[#131b2e] hover:bg-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 space-y-2">
            <span className="text-[11px] font-mono text-[#00236f] font-semibold">
              Timestamp: {time}
            </span>
            <h4 className="font-bold text-[15px] text-[#131b2e] leading-snug">{title}</h4>
          </div>

          <div className="space-y-3 text-[13px]">
            <div className="flex justify-between py-2 border-b border-[#c5c5d3]/20">
              <span className="text-[#757682]">Initiated By</span>
              <span className="font-semibold text-[#131b2e]">{actor}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#c5c5d3]/20">
              <span className="text-[#757682]">Project Context</span>
              <span className="font-semibold text-[#131b2e]">{project}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#c5c5d3]/20">
              <span className="text-[#757682]">Result</span>
              <span className="font-semibold text-[#006a61] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
                Verified Success
              </span>
            </div>
          </div>

          <div className="pt-2">
            <span className="block text-[12px] font-semibold text-[#131b2e] mb-1">
              Full System Message
            </span>
            <div className="p-3 bg-[#f2f3ff] rounded-xl text-[12.5px] text-[#444651] leading-relaxed border border-[#c5c5d3]/40">
              {detail}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#c5c5d3]/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#00236f] text-white rounded-xl text-[13px] font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. DATA SOURCE DETAIL DRAWER
// ==========================================
interface DataSourceDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  source: DataSourceItem | null;
  onSyncNow: (sourceId: string) => void;
  isSyncing: boolean;
}

export const DataSourceDetailDrawer: React.FC<DataSourceDetailDrawerProps> = ({
  isOpen,
  onClose,
  source,
  onSyncNow,
  isSyncing,
}) => {
  if (!isOpen || !source) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/35 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl border-l border-[#c5c5d3]/50 flex flex-col z-10 animate-in slide-in-from-right duration-200">
        <div className="px-6 py-5 border-b border-[#c5c5d3]/30 flex items-center justify-between bg-[#f8f9ff]">
          <div>
            <h3 className="font-headline-sm text-[17px] font-bold text-[#131b2e]">
              {source.name}
            </h3>
            <p className="text-[12px] text-[#757682]">{source.type}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#757682] hover:text-[#131b2e] hover:bg-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#c5c5d3]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#757682]">Connection Status</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  source.status === 'Connected'
                    ? 'bg-[#e6f7f5] text-[#006a61]'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {source.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#757682]">Last Sync</span>
              <span className="font-mono font-semibold text-[#131b2e]">{source.lastSync}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#757682]">Records Processed</span>
              <span className="font-mono font-bold text-[#00236f]">
                {source.recordsProcessed.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <span className="block text-[12px] font-semibold text-[#131b2e] mb-1">
              Description
            </span>
            <p className="text-[13px] text-[#444651] bg-[#f8f9ff] p-3 rounded-xl border border-[#c5c5d3]/30">
              {source.description}
            </p>
          </div>

          <div className="space-y-2">
            <span className="block text-[12px] font-semibold text-[#131b2e]">
              Sync Configuration
            </span>
            <div className="p-3 bg-white border border-[#c5c5d3]/40 rounded-xl space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#757682]">Polling Frequency</span>
                <span className="font-medium text-[#131b2e]">Every 15 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#757682]">Error Handling</span>
                <span className="font-medium text-[#131b2e]">Retry 3 times with notification</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#757682]">Data Encryption</span>
                <span className="font-medium text-[#006a61]">AES-256 in Transit</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#c5c5d3]/30 flex items-center justify-between bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-[#444651] hover:bg-[#f2f3ff] rounded-xl cursor-pointer"
          >
            Close
          </button>
          {source.status === 'Connected' && (
            <button
              type="button"
              disabled={isSyncing}
              onClick={() => onSyncNow(source.id)}
              className="px-5 py-2 bg-[#00236f] hover:bg-[#001c59] text-white rounded-xl text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. ADD CONTRACTOR MODAL
// ==========================================
interface AddContractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContractor: (c: AdminContractor) => void;
  projectsList: string[];
}

export const AddContractorModal: React.FC<AddContractorModalProps> = ({
  isOpen,
  onClose,
  onAddContractor,
  projectsList,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState(projectsList[0] || 'Duliajan Gas Compression Project');
  const [specialty, setSpecialty] = useState('');
  const [assignedWork, setAssignedWork] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddContractor({
      id: `c-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || 'lead@contractor.demo',
      project,
      status: 'Active',
      specialty: specialty.trim() || 'Turnkey EPC Services',
      assignedWork: assignedWork.trim() || 'Mainline section installation',
      reportsThisMonth: 0,
      activeWorkers: 25,
    });
    setName('');
    setEmail('');
    setSpecialty('');
    setAssignedWork('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#c5c5d3]/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#c5c5d3]/30 flex items-center justify-between">
          <h3 className="font-headline-sm text-[17px] font-bold text-[#131b2e]">
            Add Contractor Organization
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#757682] hover:text-[#131b2e] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          <div>
            <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
              Contractor Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ABC Engineering Services"
              className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="lead@abc.demo"
              className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
              Assigned Project *
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white cursor-pointer"
            >
              {projectsList.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#131b2e] mb-1">
              Scope of Work
            </label>
            <input
              type="text"
              value={assignedWork}
              onChange={(e) => setAssignedWork(e.target.value)}
              placeholder="e.g. Valve Skid 03 & Mainline Tie-in"
              className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#c5c5d3]/60 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f] focus:bg-white"
            />
          </div>

          <div className="pt-3 border-t border-[#c5c5d3]/30 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] text-[#444651] hover:bg-[#f2f3ff] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00236f] hover:bg-[#001c59] text-white text-[13px] font-semibold rounded-xl cursor-pointer"
            >
              Add Contractor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
