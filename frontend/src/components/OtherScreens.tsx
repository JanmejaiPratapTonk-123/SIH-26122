import React, { useState } from 'react';
import { NavigationPath, UserProfile } from '../types';

interface SecondaryScreenProps {
  onNavigate: (path: NavigationPath) => void;
  onShowToast: (title: string, msg: string) => void;
}

interface SettingsScreenProps extends SecondaryScreenProps {
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onSignOut?: () => void;
}

export const ProjectProgressScreen: React.FC<SecondaryScreenProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label-caps text-[11px] text-[#006a61] uppercase tracking-wider font-semibold">
            Earned Value Management
          </span>
          <h1 className="font-headline-xl text-3xl text-[#131b2e] font-bold">Project Progress</h1>
          <p className="text-[14px] text-[#444651]">
            Comprehensive progress analytics comparing Budgeted Cost of Work Scheduled (BCWS) vs.
            Performed (BCWP).
          </p>
        </div>
        <button
          onClick={() => onNavigate('match-review')}
          className="h-10 px-4 rounded bg-[#00236f] text-white text-[13px] font-semibold flex items-center gap-2 hover:bg-[#1e3a8a] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">fact_check</span>
          Review Pending Updates
        </button>
      </div>

      {/* EVM KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#c5c5d3]/40 shadow-xs">
          <span className="text-[11px] text-[#757682] uppercase font-bold">
            Schedule Performance Index (SPI)
          </span>
          <div className="text-[32px] font-mono font-bold text-[#ba1a1a] mt-1">0.92</div>
          <div className="text-[12px] text-[#ba1a1a] font-medium">Slight schedule drag (-8%)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c5c5d3]/40 shadow-xs">
          <span className="text-[11px] text-[#757682] uppercase font-bold">
            Cost Performance Index (CPI)
          </span>
          <div className="text-[32px] font-mono font-bold text-[#006a61] mt-1">1.04</div>
          <div className="text-[12px] text-[#006a61] font-medium">Under budget (+4% efficiency)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c5c5d3]/40 shadow-xs">
          <span className="text-[11px] text-[#757682] uppercase font-bold">
            Earned Value (BCWP)
          </span>
          <div className="text-[32px] font-mono font-bold text-[#00236f] mt-1">$48.6M</div>
          <div className="text-[12px] text-[#444651]">Target: $52.7M</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c5c5d3]/40 shadow-xs">
          <span className="text-[11px] text-[#757682] uppercase font-bold">
            Schedule Slip Forecast
          </span>
          <div className="text-[32px] font-mono font-bold text-[#ba1a1a] mt-1">11 Days</div>
          <div className="text-[12px] text-[#ba1a1a] font-medium">Target completion: 28 Nov 2026</div>
        </div>
      </div>

      {/* Work Package Progress Table */}
      <div className="bg-white rounded-xl border border-[#c5c5d3]/40 shadow-xs overflow-hidden">
        <div className="p-4 bg-[#f2f3ff] border-b border-[#c5c5d3]/40 font-bold text-[14px] text-[#131b2e]">
          Work Package Progress Breakdown
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#f2f3ff]/50 font-label-caps text-[11px] text-[#757682] uppercase border-b border-[#c5c5d3]/30">
              <tr>
                <th className="py-3 px-4">WBS Package</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Planned Progress</th>
                <th className="py-3 px-4">Actual Progress</th>
                <th className="py-3 px-4">Variance</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c5c5d3]/20">
              {[
                {
                  pkg: 'WP-01 Engineering & Detailed Design',
                  w: '15%',
                  plan: '100%',
                  act: '100%',
                  var: '0.0%',
                  st: 'On Track',
                },
                {
                  pkg: 'WP-02 Procurement & Long Lead Items',
                  w: '25%',
                  plan: '95%',
                  act: '92%',
                  var: '-3.0%',
                  st: 'At Risk',
                },
                {
                  pkg: 'WP-03 Civil Works & Foundations',
                  w: '20%',
                  plan: '84%',
                  act: '74%',
                  var: '-10.0%',
                  st: 'Delayed',
                },
                {
                  pkg: 'WP-04 Mainline Pipeline Trenching & Laying',
                  w: '22%',
                  plan: '72%',
                  act: '68%',
                  var: '-4.0%',
                  st: 'At Risk',
                },
                {
                  pkg: 'WP-05 Compressor Mechanical & Piping',
                  w: '12%',
                  plan: '55%',
                  act: '50%',
                  var: '-5.0%',
                  st: 'At Risk',
                },
                {
                  pkg: 'WP-06 Electrical, Instrumentation & Telecom',
                  w: '6%',
                  plan: '42%',
                  act: '40%',
                  var: '-2.0%',
                  st: 'On Track',
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#f2f3ff]/40">
                  <td className="py-3 px-4 font-semibold text-[#131b2e]">{row.pkg}</td>
                  <td className="py-3 px-4 font-mono text-[#757682]">{row.w}</td>
                  <td className="py-3 px-4 font-mono">{row.plan}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#00236f]">{row.act}</td>
                  <td
                    className={`py-3 px-4 font-mono font-bold ${
                      row.var.startsWith('-') ? 'text-[#ba1a1a]' : 'text-[#006a61]'
                    }`}
                  >
                    {row.var}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        row.st === 'On Track'
                          ? 'bg-[#86f2e4]/30 text-[#006f66]'
                          : row.st === 'At Risk'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#ffdad6] text-[#93000a]'
                      }`}
                    >
                      {row.st}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const ScheduleScreen: React.FC<SecondaryScreenProps> = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label-caps text-[11px] text-[#006a61] uppercase tracking-wider font-semibold">
            Master WBS Schedule
          </span>
          <h1 className="font-headline-xl text-3xl text-[#131b2e] font-bold">Primavera Schedule</h1>
          <p className="text-[14px] text-[#444651]">
            Synced with Primavera P6 EPPM Baseline BL-AUG-2026. Critical path activities highlighted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#86f2e4]/20 border border-[#006a61]/30 text-[#006a61] text-[12px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#006a61]"></span>
            Active Baseline Synced
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#c5c5d3]/40 shadow-xs overflow-hidden">
        <div className="p-4 bg-[#f2f3ff] border-b border-[#c5c5d3]/40 flex items-center justify-between">
          <div className="font-bold text-[14px] text-[#131b2e]">Activity Schedule Matrix</div>
          <span className="text-[12px] text-[#757682]">1,284 total schedule lines</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#f2f3ff]/50 font-label-caps text-[11px] text-[#757682] uppercase border-b border-[#c5c5d3]/30">
              <tr>
                <th className="py-3 px-4">Activity ID</th>
                <th className="py-3 px-4">Activity Name</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Start</th>
                <th className="py-3 px-4">Finish</th>
                <th className="py-3 px-4">Total Float</th>
                <th className="py-3 px-4">Critical Path</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c5c5d3]/20 font-mono text-[12px]">
              {[
                {
                  id: 'L6-PIPE-EXC-042',
                  name: 'Pipeline Trench Excavation (KP 12+400 to 12+850)',
                  dur: '14d',
                  s: '25-Aug-26',
                  f: '08-Sep-26',
                  float: '0d',
                  cp: true,
                },
                {
                  id: 'L4-CIV-COMP-012',
                  name: 'Compressor Foundation Concreting TB-02',
                  dur: '21d',
                  s: '15-Aug-26',
                  f: '05-Sep-26',
                  float: '-9d',
                  cp: true,
                },
                {
                  id: 'L5-MECH-WELD-024',
                  name: 'Mainline Pipeline Welding & NDT Sector C',
                  dur: '18d',
                  s: '01-Sep-26',
                  f: '19-Sep-26',
                  float: '3d',
                  cp: false,
                },
                {
                  id: 'L4-STR-PRACK-008',
                  name: 'Structural Steel Erection - Pipe Racks PR-01',
                  dur: '12d',
                  s: '28-Aug-26',
                  f: '09-Sep-26',
                  float: '2d',
                  cp: false,
                },
                {
                  id: 'L6-HDD-RIV-002',
                  name: 'HDD River Crossing Pilot Hole Drilling',
                  dur: '28d',
                  s: '20-Aug-26',
                  f: '17-Sep-26',
                  float: '-5d',
                  cp: true,
                },
                {
                  id: 'L5-ELEC-CP-004',
                  name: 'Cathodic Protection Deep Well Groundbed #2',
                  dur: '8d',
                  s: '02-Sep-26',
                  f: '10-Sep-26',
                  float: '7d',
                  cp: false,
                },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-[#f2f3ff]/40">
                  <td className="py-3 px-4 font-bold text-[#00236f]">{row.id}</td>
                  <td className="py-3 px-4 font-sans font-medium text-[#131b2e]">{row.name}</td>
                  <td className="py-3 px-4 text-[#757682]">{row.dur}</td>
                  <td className="py-3 px-4 text-[#444651]">{row.s}</td>
                  <td className="py-3 px-4 text-[#444651]">{row.f}</td>
                  <td
                    className={`py-3 px-4 font-bold ${
                      row.float.startsWith('-')
                        ? 'text-[#ba1a1a]'
                        : row.float === '0d'
                        ? 'text-[#ba1a1a]'
                        : 'text-[#006a61]'
                    }`}
                  >
                    {row.float}
                  </td>
                  <td className="py-3 px-4">
                    {row.cp ? (
                      <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#93000a] font-sans font-bold text-[10px]">
                        CRITICAL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#444651] font-sans text-[10px]">
                        Float Available
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const MilestonesScreen: React.FC<SecondaryScreenProps> = () => {
  const milestones = [
    {
      id: 'M01',
      title: 'EPC Contract Signing & Mobilization',
      targetDate: '15-Jan-2026',
      actualDate: '12-Jan-2026',
      status: 'Completed',
    },
    {
      id: 'M02',
      title: 'Detailed Engineering Package Freeze',
      targetDate: '28-Feb-2026',
      actualDate: '01-Mar-2026',
      status: 'Completed',
    },
    {
      id: 'M03',
      title: 'Long Lead Turbo-Compressor PO Release',
      targetDate: '15-Mar-2026',
      actualDate: '10-Mar-2026',
      status: 'Completed',
    },
    {
      id: 'M04',
      title: 'Site Rough Grading & Access Roads',
      targetDate: '30-Apr-2026',
      actualDate: '25-Apr-2026',
      status: 'Completed',
    },
    {
      id: 'M18',
      title: 'Mainline Right-of-Way Trenching 50% Milestone',
      targetDate: '05-Sep-2026',
      actualDate: '05-Sep-2026',
      status: 'Completed',
    },
    {
      id: 'M19',
      title: 'Compressor Package Skid Placement & Grouting',
      targetDate: '15-Sep-2026',
      actualDate: 'Pending',
      status: 'At Risk',
    },
    {
      id: 'M20',
      title: 'HDD River Crossing Pipe Pullback',
      targetDate: '30-Sep-2026',
      actualDate: 'Pending',
      status: 'Pending',
    },
    {
      id: 'M24',
      title: 'Commercial Commissioning & Ready for Gas (RFG)',
      targetDate: '15-Nov-2026',
      actualDate: 'Pending',
      status: 'Target',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="font-label-caps text-[11px] text-[#006a61] uppercase tracking-wider font-semibold">
          Execution Governance
        </span>
        <h1 className="font-headline-xl text-3xl text-[#131b2e] font-bold">Key Project Milestones</h1>
        <p className="text-[14px] text-[#444651]">
          Tracking 18 completed out of 24 contractual milestones (75% completion).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((m) => (
          <div
            key={m.id}
            className="p-4 bg-white rounded-xl border border-[#c5c5d3]/40 shadow-xs flex items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] font-bold text-[#00236f]">{m.id}</span>
                <span className="text-[#757682]">·</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    m.status === 'Completed'
                      ? 'bg-[#86f2e4]/40 text-[#006f66]'
                      : m.status === 'At Risk'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-[#eaedff] text-[#444651]'
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <div className="font-headline-sm text-[14px] font-semibold text-[#131b2e] mt-1">
                {m.title}
              </div>
              <div className="text-[12px] text-[#757682] mt-1">
                Target: <span className="font-mono">{m.targetDate}</span>
                {m.actualDate !== 'Pending' && (
                  <>
                    {' '}
                    • Actual: <span className="font-mono text-[#006a61]">{m.actualDate}</span>
                  </>
                )}
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#f2f3ff] text-[#00236f]">
              <span className="material-symbols-outlined text-[20px]">
                {m.status === 'Completed' ? 'verified' : 'flag'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AuditTrailScreen: React.FC<SecondaryScreenProps> = () => {
  const auditLogs = [
    {
      time: '06-Sep-2026 10:45 AM',
      user: 'Arunav Sharma (Project Planner)',
      action: 'Approved Match & Reconciled with WBS L6-PIPE-EXC-042',
      details: 'Applied 450m linear progress to Pipeline Trench Excavation. Progress now 96%.',
    },
    {
      time: '06-Sep-2026 10:42 AM',
      user: 'Site Supervisor R. Sharma',
      action: 'Uploaded DPR_06_Sep_2026.pdf',
      details: 'Ingestion engine identified 28 updates with 96.8% mean confidence.',
    },
    {
      time: '06-Sep-2026 09:15 AM',
      user: 'Automated Bot (Primavera Sync)',
      action: 'Synchronized weekly baseline with Oracle P6 EPPM',
      details: 'Transferred 143 verified progress quantities to schedule baseline BL-AUG-2026.',
    },
    {
      time: '05-Sep-2026 04:20 PM',
      user: 'ABC Engineering (Turnkey Lead)',
      action: 'Uploaded Contractor_Progress_W36.xlsx',
      details: '143 updates extracted across 12 work packages.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="font-label-caps text-[11px] text-[#006a61] uppercase tracking-wider font-semibold">
          Verifiable Record of Progress
        </span>
        <h1 className="font-headline-xl text-3xl text-[#131b2e] font-bold">Audit Trail</h1>
        <p className="text-[14px] text-[#444651]">
          Immutable chronological ledger ensuring every reported meter and cubic yard is traceable to
          contractor source documents.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#c5c5d3]/40 shadow-xs overflow-hidden">
        <div className="divide-y divide-[#c5c5d3]/20">
          {auditLogs.map((log, i) => (
            <div key={i} className="p-4 hover:bg-[#f2f3ff]/40 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[12px] text-[#757682]">{log.time}</span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#e2e7ff] text-[#00236f] font-semibold">
                  AUDIT ID: #AUD-2026-{String(8940 - i)}
                </span>
              </div>
              <div className="font-headline-sm text-[14px] font-semibold text-[#131b2e] mt-1">
                {log.action}
              </div>
              <div className="text-[12px] text-[#444651] mt-0.5">By: {log.user}</div>
              <div className="text-[12px] text-[#757682] mt-1">{log.details}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LearnAndImproveScreen: React.FC<SecondaryScreenProps> = () => {
  return (
    <div className="space-y-6">
      <div>
        <span className="font-label-caps text-[11px] text-[#006a61] uppercase tracking-wider font-semibold">
          Adaptive Reconciliation Intelligence
        </span>
        <h1 className="font-headline-xl text-3xl text-[#131b2e] font-bold">Learn &amp; Improve</h1>
        <p className="text-[14px] text-[#444651]">
          Continuous machine learning feedback loop refining contractor text parsing and WBS matching
          accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs">
          <div className="text-[11px] uppercase font-bold text-[#757682]">Overall Model Accuracy</div>
          <div className="text-[34px] font-mono font-bold text-[#006a61] mt-1">96.8%</div>
          <p className="text-[12px] text-[#444651] mt-1">
            Up +4.2% since contractor terminology tuning was applied in Week 32.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs">
          <div className="text-[11px] uppercase font-bold text-[#757682]">Auto-Approval Rate</div>
          <div className="text-[34px] font-mono font-bold text-[#00236f] mt-1">84.2%</div>
          <p className="text-[12px] text-[#444651] mt-1">
            Matches above 95% confidence without requiring human planner adjustment.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs">
          <div className="text-[11px] uppercase font-bold text-[#757682]">Contractor Formats Learned</div>
          <div className="text-[34px] font-mono font-bold text-[#006a61] mt-1">14 Schemas</div>
          <p className="text-[12px] text-[#444651] mt-1">
            PDF DPRs, Welder log sheets, Batch plant slips, and P6 XML transmittals.
          </p>
        </div>
      </div>
    </div>
  );
};

export const InsightsScreen: React.FC<SecondaryScreenProps> = () => {
  return (
    <div className="space-y-6">
      <div>
        <span className="font-label-caps text-[11px] text-[#006a61] uppercase tracking-wider font-semibold">
          Predictive Analytics
        </span>
        <h1 className="font-headline-xl text-3xl text-[#131b2e] font-bold">Schedule Insights</h1>
        <p className="text-[14px] text-[#444651]">
          AI forward-looking risk models identifying early warning signals before critical path
          divergence.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-white rounded-xl border-l-4 border-l-[#ba1a1a] border border-[#c5c5d3]/40 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-[#ba1a1a] text-[14px]">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            Critical Path Slip Threat: Turbo-Compressor Foundation Curing
          </div>
          <p className="text-[13px] text-[#444651] mt-1">
            If curing tests for Compressor Pad 02 do not meet strength specifications by 10-Sep, skid
            placement crane mobilization will incur a $12,000/day standby penalty.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border-l-4 border-l-amber-500 border border-[#c5c5d3]/40 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-amber-800 text-[14px]">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            Weather Risk Alert: Assam Monsoon Season
          </div>
          <p className="text-[13px] text-[#444651] mt-1">
            Meteorological models indicate heavy precipitation probability between 14-Sep and 18-Sep.
            Recommend prioritizing open trench backfilling in Sector B.
          </p>
        </div>
      </div>
    </div>
  );
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onShowToast,
  currentUser,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [plannerName, setPlannerName] = useState(currentUser?.name || 'Arunav Sharma');
  const [plannerRole, setPlannerRole] = useState(currentUser?.role || 'Lead Project Planner');

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <span className="font-label-caps text-[11px] text-[#006a61] uppercase tracking-wider font-semibold">
          Platform Configuration
        </span>
        <h1 className="font-headline-xl text-3xl text-[#131b2e] font-bold">Project Settings</h1>
        <p className="text-[14px] text-[#444651]">
          Project parameters, auto-reconciliation thresholds, and workstation authentication.
        </p>
      </div>

      {/* Workstation Authentication & Account Section */}
      <div className="bg-white rounded-xl border border-[#c5c5d3]/40 p-5 shadow-xs space-y-4 text-[13px]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-[15px] text-[#131b2e]">Workstation Authentication</h3>
            <p className="text-[12px] text-[#757682]">
              Active project stakeholder profile and reconciliation authorization credentials.
            </p>
          </div>
          {currentUser && onOpenAuthModal && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="h-8 px-3 rounded-lg bg-[#eaedff] text-[#00236f] hover:bg-[#d8e0ff] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">switch_account</span>
              Switch Account
            </button>
          )}
        </div>

        {currentUser ? (
          <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#c5c5d3]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[15px] shadow-xs shrink-0"
                style={{ backgroundColor: currentUser.avatarColor || '#00236f' }}
              >
                {currentUser.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-[15px] font-bold text-[#131b2e]">
                    {currentUser.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#006a61] text-white font-label-caps text-[9px] font-semibold">
                    Authorized
                  </span>
                </div>
                <div className="text-[13px] text-[#00236f] font-medium">
                  {currentUser.role}
                </div>
                <div className="text-[11px] text-[#757682]">
                  {currentUser.email} • {currentUser.department}
                </div>
              </div>
            </div>

            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="h-8 px-3 rounded-lg border border-[#ba1a1a]/40 text-[#ba1a1a] hover:bg-[#ffdad6]/40 text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start sm:self-center"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Sign Out
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#eaedff]/50 border border-[#b6c4ff]/50 flex items-center justify-between gap-4">
            <div>
              <div className="font-headline-sm text-[14px] font-bold text-[#00236f]">
                Not Signed In
              </div>
              <p className="text-[12px] text-[#444651]">
                You are currently in guest preview mode with read-only schedule visibility.
              </p>
            </div>
            {onOpenAuthModal && (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="h-9 px-4 rounded-lg bg-[#00236f] text-white font-semibold hover:bg-[#1e3a8a] text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                Sign In Now
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#c5c5d3]/40 p-5 shadow-xs space-y-4 text-[13px]">
        <h3 className="font-bold text-[15px] text-[#131b2e]">Reconciliation Rules</h3>
        <div>
          <label className="block text-[#444651] font-semibold mb-1">
            Auto-Approve Match Threshold
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="85"
              max="99"
              defaultValue="95"
              className="flex-1 accent-[#00236f]"
            />
            <span className="font-mono font-bold text-[#00236f]">95.0% Confidence</span>
          </div>
          <p className="text-[11px] text-[#757682] mt-0.5">
            Matches with confidence score above this percentage can be accepted into the schedule.
          </p>
        </div>

        <div className="pt-3 border-t border-[#c5c5d3]/30">
          <h3 className="font-bold text-[15px] text-[#131b2e] mb-2">Planner Profile Overrides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#757682]">Display Name</label>
              <input
                type="text"
                value={plannerName}
                onChange={(e) => setPlannerName(e.target.value)}
                className="w-full p-2 border border-[#c5c5d3] rounded mt-0.5 bg-[#f8f9ff]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#757682]">Role Title</label>
              <input
                type="text"
                value={plannerRole}
                onChange={(e) => setPlannerRole(e.target.value)}
                className="w-full p-2 border border-[#c5c5d3] rounded mt-0.5 bg-[#f8f9ff]"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            onClick={() => onShowToast('Settings Saved', 'Project preferences updated.')}
            className="h-9 px-4 rounded bg-[#00236f] text-white font-semibold hover:bg-[#1e3a8a] cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
