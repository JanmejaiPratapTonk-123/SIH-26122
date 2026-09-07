import React, { useState } from 'react';
import { NavigationPath } from '../types';

interface ManagerHomeScreenProps {
  onNavigate: (path: NavigationPath) => void;
  onShowToast: (title: string, message: string, icon?: string, isError?: boolean) => void;
  sidebarOpen?: boolean;
}

export const ManagerHomeScreen: React.FC<ManagerHomeScreenProps> = ({
  onNavigate,
  onShowToast,
  sidebarOpen = true,
}) => {
  const [filterAtRiskOnly, setFilterAtRiskOnly] = useState(false);

  return (
    <div className="flex flex-col w-full gap-6 text-[#131b2e]">
      {/* Executive Header */}
      <header
        className={`flex flex-col justify-between gap-4 pb-1 transition-all ${
          sidebarOpen ? 'xl:flex-row xl:items-end' : 'lg:flex-row lg:items-end'
        }`}
      >
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-label-caps text-[11px] uppercase text-[#0284c7] tracking-wider font-semibold">
              Executive Project Health
            </span>
            <span className="text-[#757682]">•</span>
            <span className="text-[12px] text-[#006a61] font-medium bg-[#e6f7f5] px-2 py-0.5 rounded-full">
              Real-time Portfolio View
            </span>
          </div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl md:text-4xl text-[#131b2e] tracking-tight font-bold">
            How is my project doing?
          </h1>
          <p className="font-body-md text-[13px] sm:text-[14px] text-[#444651] flex items-center gap-2 flex-wrap">
            <span>Duliajan Gas Compression Project</span>
            <span className="w-1 h-1 rounded-full bg-[#757682]/50"></span>
            <span className="text-[#757682]">Target COD: 15 Dec 2026</span>
          </p>
        </div>

        {/* Primary Executive Actions */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('project-progress')}
            className="h-10 px-4 rounded-xl bg-[#eaedff] hover:bg-[#d8e0ff] text-[#00236f] font-headline-sm text-[13px] font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer whitespace-nowrap border border-[#b6c4ff]/40"
          >
            <span className="material-symbols-outlined text-[18px]">query_stats</span>
            <span>View Project</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterAtRiskOnly((prev) => !prev);
              onShowToast(
                filterAtRiskOnly ? 'All Items Shown' : 'Filtered to At-Risk',
                filterAtRiskOnly
                  ? 'Showing complete project work packages.'
                  : 'Highlighting work fronts currently experiencing schedule slippage.',
                'warning'
              );
            }}
            className={`h-10 px-5 rounded-xl text-white font-headline-sm text-[13px] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap ${
              filterAtRiskOnly
                ? 'bg-[#ba1a1a] hover:bg-[#93000a]'
                : 'bg-[#00236f] hover:bg-[#1e3a8a]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>{filterAtRiskOnly ? 'Showing At-Risk Work' : 'View At-Risk Work'}</span>
          </button>
        </div>
      </header>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#757682] text-[12px] font-semibold uppercase tracking-wider">
            <span>Overall Progress</span>
            <span className="material-symbols-outlined text-[#00236f] text-[20px]">
              trending_up
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#131b2e] tracking-tight">72%</span>
            <span className="text-[12px] text-[#006a61] font-semibold bg-[#e6f7f5] px-1.5 py-0.5 rounded">
              Planned: 78%
            </span>
          </div>
          <div className="mt-3 w-full bg-[#f2f3ff] rounded-full h-2 overflow-hidden">
            <div className="bg-[#00236f] h-2 rounded-full" style={{ width: '72%' }}></div>
          </div>
        </div>

        {/* Days Behind Schedule */}
        <div className="bg-white p-5 rounded-xl border border-[#ba1a1a]/30 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white to-[#fff8f7]">
          <div className="flex items-center justify-between text-[#ba1a1a] text-[12px] font-semibold uppercase tracking-wider">
            <span>Days Behind Schedule</span>
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">
              schedule
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#ba1a1a] tracking-tight">11 days</span>
            <span className="text-[11px] text-[#757682] font-medium">Critical Path Impact</span>
          </div>
          <p className="mt-2 text-[11px] text-[#444651]">
            Driven primarily by compressor package tie-in trenching
          </p>
        </div>

        {/* Milestones */}
        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#757682] text-[12px] font-semibold uppercase tracking-wider">
            <span>Milestones</span>
            <span className="material-symbols-outlined text-[#0284c7] text-[20px]">
              flag
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#131b2e] tracking-tight">18 / 24</span>
            <span className="text-[12px] text-[#757682]">Achieved</span>
          </div>
          <div className="mt-3 text-[11px] text-[#006a61] flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[15px]">event</span>
            <span>Next: Hydrotest Section 1 (24 Sep)</span>
          </div>
        </div>

        {/* At Risk */}
        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#757682] text-[12px] font-semibold uppercase tracking-wider">
            <span>At Risk</span>
            <span className="material-symbols-outlined text-[#d97706] text-[20px]">
              crisis_alert
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#d97706] tracking-tight">21%</span>
            <span className="text-[12px] text-[#757682]">of work volume</span>
          </div>
          <p className="mt-2 text-[11px] text-[#444651]">
            4 packages flagged for potential monsoon delays
          </p>
        </div>
      </div>

      {/* Executive Management Sections: What's Behind? & What's At Risk? */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* What's Behind? */}
        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
              <h2 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
                What&apos;s Behind?
              </h2>
            </div>
            <span className="text-[11px] text-[#ba1a1a] font-semibold bg-[#ffdad6]/50 px-2 py-0.5 rounded">
              3 Activities Impacted
            </span>
          </div>

          <div className="space-y-2.5 text-[13px]">
            <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#c5c5d3]/30 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-[#131b2e]">
                  Compressor Station B Tie-in Piping
                </div>
                <div className="text-[11px] text-[#757682]">
                  L6-TIEIN-TR-018 • Contractor: ABC Engineering
                </div>
              </div>
              <span className="px-2 py-1 bg-[#ffdad6] text-[#ba1a1a] font-bold rounded text-[11px] shrink-0">
                +6 Days Late
              </span>
            </div>

            <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#c5c5d3]/30 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-[#131b2e]">
                  Foundation Concrete Pour Pad 3
                </div>
                <div className="text-[11px] text-[#757682]">
                  L4-CIVIL-FND-009 • Contractor: Kalpataru Field Ops
                </div>
              </div>
              <span className="px-2 py-1 bg-[#ffdad6] text-[#ba1a1a] font-bold rounded text-[11px] shrink-0">
                +5 Days Late
              </span>
            </div>

            <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#c5c5d3]/30 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-[#131b2e]">
                  Gas Pipeline Trench KP 14+200
                </div>
                <div className="text-[11px] text-[#757682]">
                  L6-PIPE-EXC-042 • Contractor: Kalpataru Field Ops
                </div>
              </div>
              <span className="px-2 py-1 bg-[#ffdad6] text-[#ba1a1a] font-bold rounded text-[11px] shrink-0">
                +3 Days Late
              </span>
            </div>
          </div>
        </div>

        {/* What's At Risk? */}
        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]"></span>
              <h2 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
                What&apos;s At Risk?
              </h2>
            </div>
            <span className="text-[11px] text-[#d97706] font-semibold bg-[#fef3c7] px-2 py-0.5 rounded">
              High Impact Risks
            </span>
          </div>

          <div className="space-y-2.5 text-[13px]">
            <div className="p-3 bg-[#fffbeb] rounded-lg border border-[#fef3c7] flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-[#92400e]">
                  Heavy Rainfall Forecast for Assam Sector
                </div>
                <p className="text-[11px] text-[#78350f] mt-0.5">
                  May halt open trench excavation along chainage 18+000 for 48 hours.
                </p>
              </div>
              <span className="px-2 py-0.5 bg-white text-[#b45309] font-semibold text-[10px] rounded border border-[#fef3c7] shrink-0">
                Weather Risk
              </span>
            </div>

            <div className="p-3 bg-[#fffbeb] rounded-lg border border-[#fef3c7] flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-[#92400e]">
                  Long-Lead High Pressure Valves Shipment
                </div>
                <p className="text-[11px] text-[#78350f] mt-0.5">
                  Custom clearance underway at Kolkata port; required on site by 28 Sep.
                </p>
              </div>
              <span className="px-2 py-0.5 bg-white text-[#b45309] font-semibold text-[10px] rounded border border-[#fef3c7] shrink-0">
                Supply Chain
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What's Improving? & Upcoming Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* What's Improving? */}
        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006a61]"></span>
              <h2 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
                What&apos;s Improving?
              </h2>
            </div>
            <span className="text-[11px] text-[#006a61] font-semibold bg-[#e6f7f5] px-2 py-0.5 rounded">
              Positive Trajectory
            </span>
          </div>

          <div className="space-y-2.5 text-[13px]">
            <div className="p-3 bg-[#f0fdf4] rounded-lg border border-[#bbf7d0] flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-[#166534]">
                  Earthwork Pace Accelerated (+14%)
                </div>
                <p className="text-[11px] text-[#15803d]">
                  Kalpataru deployed second shift excavator; closed 450m trenching today.
                </p>
              </div>
              <span className="px-2 py-1 bg-white text-[#166534] font-bold rounded text-[11px] shrink-0 border border-[#bbf7d0]">
                +14% Rate
              </span>
            </div>

            <div className="p-3 bg-[#f0fdf4] rounded-lg border border-[#bbf7d0] flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-[#166534]">
                  Zero Safety Incidents (120 Days)
                </div>
                <p className="text-[11px] text-[#15803d]">
                  HSE audit scored 98.4% across civil and mechanical packages.
                </p>
              </div>
              <span className="px-2 py-1 bg-white text-[#166534] font-bold rounded text-[11px] shrink-0 border border-[#bbf7d0]">
                Clean HSE
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
              <h2 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
                Upcoming Milestones
              </h2>
            </div>
            <button
              onClick={() => onNavigate('milestones')}
              className="text-[12px] text-[#00236f] hover:underline font-semibold"
            >
              View All 24 →
            </button>
          </div>

          <div className="space-y-2 text-[13px]">
            <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#c5c5d3]/30 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#131b2e]">
                  Hydrotesting Section 1 (KP 00 - 15)
                </div>
                <div className="text-[11px] text-[#757682]">Due: 24 Sep 2026</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#e6f7f5] text-[#006a61] text-[11px] font-semibold">
                On Track
              </span>
            </div>

            <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#c5c5d3]/30 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#131b2e]">
                  Compressor Unit 1 Delivery on Pad
                </div>
                <div className="text-[11px] text-[#757682]">Due: 02 Oct 2026</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#fffbeb] text-[#b45309] text-[11px] font-semibold">
                At Risk
              </span>
            </div>

            <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#c5c5d3]/30 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#131b2e]">
                  Pre-Commissioning Walkthrough
                </div>
                <div className="text-[11px] text-[#757682]">Due: 15 Oct 2026</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#00236f] text-[11px] font-semibold">
                Upcoming
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Planned vs Actual & Contractor Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planned vs Actual Executive Chart Card */}
        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-2">
            <h2 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
              Planned vs Actual Trajectory
            </h2>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00236f]"></span>
                Actual (72%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#757682]"></span>
                Planned (78%)
              </span>
            </div>
          </div>

          <div className="py-4 space-y-4">
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="font-semibold">Assam Gas Gathering Station</span>
                <span className="font-mono text-[#757682]">88% vs 90% planned</span>
              </div>
              <div className="w-full bg-[#f2f3ff] rounded-full h-2">
                <div className="bg-[#00236f] h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="font-semibold">Main Pipeline Trenching &amp; Stringing</span>
                <span className="font-mono text-[#757682]">68% vs 78% planned (-10%)</span>
              </div>
              <div className="w-full bg-[#f2f3ff] rounded-full h-2">
                <div className="bg-[#ba1a1a] h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="font-semibold">Compressor Mechanical Tie-ins</span>
                <span className="font-mono text-[#757682]">55% vs 62% planned</span>
              </div>
              <div className="w-full bg-[#f2f3ff] rounded-full h-2">
                <div className="bg-[#00236f] h-2 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Contractor Performance */}
        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-2">
            <h2 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
              Contractor Performance
            </h2>
            <span className="text-[11px] text-[#757682]">Weekly Ingestion Score</span>
          </div>

          <div className="space-y-3 text-[13px]">
            <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#c5c5d3]/30 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#131b2e]">ABC Engineering Services</div>
                <div className="text-[11px] text-[#757682]">Turnkey Piping &amp; Tie-in • 143 Updates</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-bold text-[#006a61]">92% On-Schedule</div>
                <span className="text-[10px] text-[#757682]">Tier 1 Rating</span>
              </div>
            </div>

            <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#c5c5d3]/30 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#131b2e]">Kalpataru Field Operations</div>
                <div className="text-[11px] text-[#757682]">Civil &amp; Trenching • 34 Updates</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-bold text-[#d97706]">84% On-Schedule</div>
                <span className="text-[10px] text-[#d97706]">Slight Delay</span>
              </div>
            </div>

            <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#c5c5d3]/30 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#131b2e]">QA/QC Inspection Agency</div>
                <div className="text-[11px] text-[#757682]">Testing &amp; Hydrotest • 19 Updates</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-bold text-[#006a61]">98% On-Schedule</div>
                <span className="text-[10px] text-[#757682]">Zero Backlog</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
