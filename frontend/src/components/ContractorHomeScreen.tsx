import React, { useState } from 'react';
import { NavigationPath } from '../types';

interface ContractorHomeScreenProps {
  onNavigate: (path: NavigationPath) => void;
  onShowToast: (title: string, message: string, icon?: string, isError?: boolean) => void;
  sidebarOpen?: boolean;
}

interface AssignedActivity {
  id: string;
  name: string;
  code: string;
  completionPct: number;
  dueDate: string;
  scopeDone: string;
  scopeTotal: string;
  status: 'On Track' | 'Ahead' | 'At Risk' | 'In Progress';
}

export const ContractorHomeScreen: React.FC<ContractorHomeScreenProps> = ({
  onNavigate,
  onShowToast,
  sidebarOpen = true,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<AssignedActivity | null>(null);
  const [updateQuantity, setUpdateQuantity] = useState('');
  const [shiftNote, setShiftNote] = useState('');

  const activities: AssignedActivity[] = [
    {
      id: 'act-1',
      name: 'Pipeline Excavation',
      code: 'L6-PIPE-EXC-042',
      completionPct: 76,
      dueDate: '21 Sep 2026',
      scopeDone: '912 m',
      scopeTotal: '1,200 m',
      status: 'On Track',
    },
    {
      id: 'act-2',
      name: 'Foundation Work',
      code: 'L4-CIVIL-FND-009',
      completionPct: 91,
      dueDate: '18 Sep 2026',
      scopeDone: '218 m³',
      scopeTotal: '240 m³',
      status: 'Ahead',
    },
    {
      id: 'act-3',
      name: 'Trench Bedding & Padding',
      code: 'L6-TRENCH-BED-015',
      completionPct: 54,
      dueDate: '28 Sep 2026',
      scopeDone: '430 m',
      scopeTotal: '800 m',
      status: 'In Progress',
    },
    {
      id: 'act-4',
      name: 'Pipe Lowering & Stringing',
      code: 'L6-PIPE-LOW-022',
      completionPct: 32,
      dueDate: '04 Oct 2026',
      scopeDone: '380 m',
      scopeTotal: '1,200 m',
      status: 'At Risk',
    },
  ];

  const handleOpenUpdate = (act?: AssignedActivity) => {
    setSelectedActivity(act || activities[0]);
    setShowSubmitModal(true);
  };

  const handleSubmitProgress = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast(
      'Progress Update Submitted',
      `Submitted ${updateQuantity || 'progress entry'} for ${selectedActivity?.name || 'assigned activity'}. Forwarded to Project Planner for verification.`,
      'task_alt'
    );
    setShowSubmitModal(false);
    setUpdateQuantity('');
    setShiftNote('');
  };

  const handleRestrictedAction = () => {
    onShowToast(
      'Action Restricted',
      "You don't have permission to perform this action.",
      'block',
      true
    );
  };

  return (
    <div className="flex flex-col w-full gap-6 text-[#131b2e]">
      {/* Header Area */}
      <header
        className={`flex flex-col justify-between gap-4 pb-1 transition-all ${
          sidebarOpen ? 'xl:flex-row xl:items-end' : 'lg:flex-row lg:items-end'
        }`}
      >
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-label-caps text-[11px] uppercase text-[#d97706] tracking-wider font-semibold">
              Contractor Workspace
            </span>
            <span className="text-[#757682]">•</span>
            <span className="text-[12px] text-[#444651] font-medium bg-[#fffbeb] px-2 py-0.5 rounded-full border border-[#fef3c7]">
              Kalpataru Field Ops • Package #C-04
            </span>
          </div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl md:text-4xl text-[#131b2e] tracking-tight font-bold">
            Your Work
          </h1>
          <p className="font-body-md text-[13px] sm:text-[14px] text-[#444651]">
            Track assigned infrastructure packages, deadlines, and field execution logs.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenUpdate()}
            className="h-11 px-6 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white font-headline-sm text-[14px] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            <span>Submit Progress Update</span>
          </button>
        </div>
      </header>

      {/* 4 Contractor Work Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[#757682]">
            Assigned Activities
          </div>
          <div className="mt-2 text-3xl font-bold text-[#131b2e]">42</div>
          <div className="mt-2 text-[11px] text-[#757682]">Across 2 pipeline packages</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[#006a61]">
            Completed
          </div>
          <div className="mt-2 text-3xl font-bold text-[#006a61]">28</div>
          <div className="mt-2 text-[11px] text-[#006a61] font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>Planner approved</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[#0284c7]">
            In Progress
          </div>
          <div className="mt-2 text-3xl font-bold text-[#0284c7]">9</div>
          <div className="mt-2 text-[11px] text-[#444651]">Active crews on site</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[#ba1a1a]">
            At Risk
          </div>
          <div className="mt-2 text-3xl font-bold text-[#ba1a1a]">5</div>
          <div className="mt-2 text-[11px] text-[#ba1a1a] font-medium">Critical milestone proximity</div>
        </div>
      </div>

      {/* "My Assigned Work" Section */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#c5c5d3]/40 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c5c5d3]/30 pb-3">
          <div>
            <h2 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
              My Assigned Work
            </h2>
            <p className="text-[12px] text-[#757682]">
              Only showing work packages assigned to Kalpataru Field Ops
            </p>
          </div>
          <span className="text-[11px] text-[#00236f] bg-[#eaedff] px-2.5 py-1 rounded-full font-medium self-start sm:self-auto">
            Package #C-04 Scope
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((act) => {
            const isAtRisk = act.status === 'At Risk';
            const isAhead = act.status === 'Ahead';
            return (
              <div
                key={act.id}
                className="p-4 rounded-xl border border-[#c5c5d3]/40 bg-[#f8f9ff] hover:bg-white hover:border-[#00236f]/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-[15px] text-[#131b2e]">{act.name}</div>
                    <div className="text-[11px] text-[#757682] font-mono">{act.code}</div>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      isAtRisk
                        ? 'bg-[#ffdad6]/60 text-[#ba1a1a] border-[#ba1a1a]/30'
                        : isAhead
                        ? 'bg-[#e6f7f5] text-[#006a61] border-[#006a61]/20'
                        : 'bg-[#eaedff] text-[#00236f] border-[#b6c4ff]/40'
                    }`}
                  >
                    {act.status}
                  </span>
                </div>

                {/* Progress Bar & Stat */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#444651] font-medium">
                      {act.completionPct}% complete
                    </span>
                    <span className="text-[#757682]">
                      {act.scopeDone} / {act.scopeTotal}
                    </span>
                  </div>
                  <div className="w-full bg-[#e0e2ec] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        isAtRisk
                          ? 'bg-[#ba1a1a]'
                          : isAhead
                          ? 'bg-[#006a61]'
                          : 'bg-[#00236f]'
                      }`}
                      style={{ width: `${act.completionPct}%` }}
                    ></div>
                  </div>
                </div>

                {/* Due Date & Action */}
                <div className="pt-2 border-t border-[#c5c5d3]/30 flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-1 text-[#757682]">
                    <span className="material-symbols-outlined text-[15px]">event</span>
                    <span>Due: {act.dueDate}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenUpdate(act)}
                    className="text-[12px] text-[#00236f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Update</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permissions Boundary Banner */}
      <div className="bg-white p-4 rounded-xl border border-[#c5c5d3]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px]">
        <div className="flex items-center gap-2 text-[#444651]">
          <span className="material-symbols-outlined text-[18px] text-[#d97706]">security</span>
          <span>
            Contractor Role Boundaries: Work updates submitted here are queued for Project Planner verification and EVM reconciliation.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRestrictedAction}
            className="text-[11px] text-[#ba1a1a] hover:underline font-medium cursor-pointer"
          >
            Edit Schedule (Restricted)
          </button>
          <span className="text-[#c5c5d3]">•</span>
          <button
            type="button"
            onClick={handleRestrictedAction}
            className="text-[11px] text-[#ba1a1a] hover:underline font-medium cursor-pointer"
          >
            View Other Contractors (Restricted)
          </button>
        </div>
      </div>

      {/* Quick Progress Update Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-[#c5c5d3]/50 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-3">
              <div>
                <h3 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
                  Submit Progress Update
                </h3>
                <p className="text-[11px] text-[#757682]">
                  {selectedActivity?.name} ({selectedActivity?.code})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-[#757682] hover:text-[#131b2e] p-1 rounded-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitProgress} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
                  Quantity Completed in this Shift
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 meters, 12 cubic meters"
                  value={updateQuantity}
                  onChange={(e) => setUpdateQuantity(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#c5c5d3] text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
                  Shift Notes &amp; Chainage Coordinates
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide chainage, equipment used, and resident supervisor name..."
                  value={shiftNote}
                  onChange={(e) => setShiftNote(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#c5c5d3] text-[13px] text-[#131b2e] focus:outline-none focus:border-[#00236f]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="h-9 px-4 rounded-lg text-[#444651] hover:bg-[#eaedff] text-[13px] font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] text-white text-[13px] font-semibold transition-colors cursor-pointer"
                >
                  Send to Planner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
