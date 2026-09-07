import React, { useState } from 'react';
import { NavigationPath, NeedsAttentionItem, TimelineUpdate } from '../types';
import { NEEDS_ATTENTION_ITEMS, RECENT_UPDATES_TIMELINE } from '../data/mockData';

interface HomeScreenProps {
  onNavigate: (path: NavigationPath) => void;
  onOpenUploadModal: () => void;
  onOpenRiskAlerts: () => void;
  onRequestReport: (contractor: string) => void;
  onOpenAttentionDetails: (item: NeedsAttentionItem) => void;
  pendingCount?: number;
  sidebarOpen?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenUploadModal,
  onOpenRiskAlerts,
  onRequestReport,
  onOpenAttentionDetails,
  pendingCount = 11,
  sidebarOpen = true,
}) => {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  // Weekly data for S-curve tooltip
  const weeklyData = [
    { week: 'W01', planned: 5, actual: 4 },
    { week: 'W02', planned: 11, actual: 10 },
    { week: 'W03', planned: 19, actual: 18 },
    { week: 'W04', planned: 28, actual: 26 },
    { week: 'W05', planned: 38, actual: 34 },
    { week: 'W06', planned: 47, actual: 43 },
    { week: 'W07', planned: 55, actual: 50 },
    { week: 'W08', planned: 62, actual: 56 },
    { week: 'W09', planned: 68, actual: 61 },
    { week: 'W10', planned: 73, actual: 66 },
    { week: 'W11', planned: 76, actual: 69 },
    { week: 'W12', planned: 78, actual: 72 },
  ];

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Operational Header */}
      <header
        className={`flex flex-col justify-between gap-4 pb-1 transition-all ${
          sidebarOpen ? 'xl:flex-row xl:items-end' : 'lg:flex-row lg:items-end'
        }`}
      >
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-label-caps text-[11px] uppercase text-[#006a61] tracking-wider font-semibold">
              Enterprise Capital Delivery
            </span>
            <span className="text-[#757682]/40">·</span>
            <span className="inline-flex items-center gap-1.5 font-label-caps text-[11px] text-[#757682]">
              <span className="w-2 h-2 rounded-full bg-[#006a61] animate-pulse"></span>
              Live Ingestion
            </span>
          </div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl md:text-4xl text-[#131b2e] tracking-tight font-bold">
            Project Overview
          </h1>
          <p className="font-body-md text-[13px] sm:text-[14px] text-[#444651] flex items-center gap-2 flex-wrap">
            <span>Duliajan Gas Compression Project</span>
            <span className="w-1 h-1 rounded-full bg-[#757682]/50"></span>
            <span className="font-mono text-[11px] text-[#757682]">Updated 8 mins ago</span>
          </p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('match-review')}
            className="group h-10 px-4 rounded-xl bg-[#eaedff] hover:bg-[#d8e0ff] text-[#00236f] font-headline-sm text-[13px] font-semibold transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap shrink-0 border border-[#b6c4ff]/40 w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-[18px] text-[#00236f] group-hover:scale-105 transition-transform shrink-0">
              fact_check
            </span>
            <span className="whitespace-nowrap">Review Updates</span>
            <span className="px-2 py-0.5 rounded-full bg-white text-[#00236f] font-mono text-[11px] font-bold shadow-xs shrink-0">
              {pendingCount}
            </span>
          </button>
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="h-10 px-5 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white font-headline-sm text-[13px] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap shrink-0 w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-[18px] shrink-0">cloud_upload</span>
            <span className="whitespace-nowrap">Upload Site Report</span>
          </button>
        </div>
      </header>

      {/* 5 Clean Metric KPI Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px] border border-[#c5c5d3]/40">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[11px] text-[#757682] uppercase tracking-wider font-semibold">
              Overall Progress
            </span>
            <span className="material-symbols-outlined text-[#757682]/60 text-[18px]">
              donut_large
            </span>
          </div>
          <div className="my-1">
            <div className="font-headline-xl text-[38px] leading-tight text-[#131b2e] tracking-tight font-bold">
              72<span className="font-headline-lg text-[22px] text-[#757682] font-normal">%</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 text-[#444651] font-body-sm text-[12px]">
            <span>Planned Target</span>
            <span className="font-mono text-[13px] text-[#131b2e] font-semibold">78%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px] border border-[#c5c5d3]/40">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[11px] text-[#757682] uppercase tracking-wider font-semibold">
              Schedule Slip
            </span>
            <span className="material-symbols-outlined text-[#ba1a1a]/80 text-[18px]">
              history
            </span>
          </div>
          <div className="my-1">
            <div className="font-headline-xl text-[38px] leading-tight text-[#131b2e] tracking-tight font-bold">
              11{' '}
              <span className="font-headline-sm text-[18px] text-[#444651] font-normal">
                days
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-label-caps text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
              Needs Recovery
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px] border border-[#c5c5d3]/40">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[11px] text-[#757682] uppercase tracking-wider font-semibold">
              Work Activities
            </span>
            <span className="material-symbols-outlined text-[#757682]/60 text-[18px]">
              account_tree
            </span>
          </div>
          <div className="my-1">
            <div className="font-headline-xl text-[38px] leading-tight text-[#131b2e] tracking-tight font-bold">
              1,284
            </div>
          </div>
          <div className="pt-1 text-[#444651] font-body-sm text-[12px]">
            Across 6 work packages
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px] border border-[#c5c5d3]/40">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[11px] text-[#757682] uppercase tracking-wider font-semibold">
              Needs Your Review
            </span>
            <span className="material-symbols-outlined text-[#006a61] text-[18px]">
              notifications_active
            </span>
          </div>
          <div className="my-1">
            <div className="font-headline-xl text-[38px] leading-tight text-[#131b2e] tracking-tight font-bold">
              37
            </div>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] font-label-caps text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
              12 High Priority
            </span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px] border border-[#c5c5d3]/40">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[11px] text-[#757682] uppercase tracking-wider font-semibold">
              Milestones
            </span>
            <span className="material-symbols-outlined text-[#00236f] text-[18px]">
              flag
            </span>
          </div>
          <div className="my-1">
            <div className="font-headline-xl text-[38px] leading-tight text-[#131b2e] tracking-tight font-bold">
              18{' '}
              <span className="font-headline-lg text-[22px] text-[#757682] font-normal">
                / 24
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 text-[#444651] font-body-sm text-[12px]">
            <span>Completion</span>
            <span className="font-mono text-[13px] text-[#00236f] font-semibold">75%</span>
          </div>
        </div>
      </section>

      {/* Main Section: 65% / 35% Analytical Workspace */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* S-Curve Comparison Visualization (65% -> 8 columns) */}
        <div className="lg:col-span-8 bg-white rounded-xl p-6 shadow-xs flex flex-col justify-between min-h-[430px] border border-[#c5c5d3]/40">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="font-headline-sm text-[18px] font-semibold text-[#131b2e]">
                  Project Progress
                </h2>
                <p className="font-body-sm text-[12px] text-[#757682] mt-0.5">
                  12-week baseline schedule compared against validated field production
                </p>
              </div>
              <div className="flex items-center gap-4 font-mono text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#dae2fd]"></span>
                  <span className="text-[#444651] text-[12px]">Planned:</span>
                  <span className="font-semibold text-[#131b2e]">78%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00236f]"></span>
                  <span className="text-[#444651] text-[12px]">Actual:</span>
                  <span className="font-semibold text-[#00236f]">72%</span>
                </div>
              </div>
            </div>

            {/* SVG Line/Area Curve Chart */}
            <div className="relative w-full h-64 mt-3">
              <svg
                aria-label="Progress Curve Chart"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 760 220"
              >
                <defs>
                  <linearGradient id="actualGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00236f" stopOpacity="0.16"></stop>
                    <stop offset="100%" stopColor="#00236f" stopOpacity="0.0"></stop>
                  </linearGradient>
                  <linearGradient id="plannedGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#90a8ff" stopOpacity="0.10"></stop>
                    <stop offset="100%" stopColor="#90a8ff" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>

                {/* Subtle Grid Background */}
                <line stroke="#f2f3ff" strokeWidth="1.5" x1="0" x2="760" y1="40" y2="40"></line>
                <line stroke="#f2f3ff" strokeWidth="1.5" x1="0" x2="760" y1="95" y2="95"></line>
                <line stroke="#f2f3ff" strokeWidth="1.5" x1="0" x2="760" y1="150" y2="150"></line>
                <line stroke="#eaedff" strokeWidth="1.5" x1="0" x2="760" y1="205" y2="205"></line>

                {/* Planned Baseline Area & Path */}
                <path
                  d="M 0 195 C 130 190, 230 160, 360 115 C 490 75, 620 45, 760 35 L 760 205 L 0 205 Z"
                  fill="url(#plannedGrad)"
                ></path>
                <path
                  d="M 0 195 C 130 190, 230 160, 360 115 C 490 75, 620 45, 760 35"
                  fill="none"
                  stroke="#90a8ff"
                  strokeDasharray="4 4"
                  strokeWidth="2.5"
                ></path>

                {/* Actual Cumulative Progress Area & Path */}
                <path
                  d="M 0 198 C 130 192, 230 165, 360 130 C 470 102, 590 85, 760 62 L 760 205 L 0 205 Z"
                  fill="url(#actualGrad)"
                ></path>
                <path
                  d="M 0 198 C 130 192, 230 165, 360 130 C 470 102, 590 85, 760 62"
                  fill="none"
                  stroke="#00236f"
                  strokeLinecap="round"
                  strokeWidth="3"
                ></path>

                {/* Endpoint Pins */}
                <circle
                  cx="760"
                  cy="35"
                  fill="#ffffff"
                  r="4.5"
                  stroke="#90a8ff"
                  strokeWidth="2.5"
                ></circle>
                <circle
                  cx="760"
                  cy="62"
                  fill="#00236f"
                  r="5"
                  stroke="#ffffff"
                  strokeWidth="2"
                ></circle>
              </svg>
            </div>

            {/* Chart Timeline Labels */}
            <div className="flex items-center justify-between pt-2 font-mono text-[11px] text-[#757682]">
              {['W01', 'W03', 'W05', 'W07', 'W09', 'W11'].map((w) => (
                <span key={w} className="hover:text-[#00236f] cursor-pointer">
                  {w}
                </span>
              ))}
              <span className="text-[#131b2e] font-semibold">W12 (Current)</span>
            </div>
          </div>

          {/* Clean Minimal Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 bg-[#f2f3ff]/40 px-4 py-2 rounded-lg border border-[#c5c5d3]/30">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#00236f] rounded"></span>
                <span className="font-body-sm text-[12px] text-[#131b2e] font-medium">
                  Actual Progress
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 border-b-2 border-dashed border-[#b6c4ff]"></span>
                <span className="font-body-sm text-[12px] text-[#444651]">
                  Planned Baseline
                </span>
              </div>
            </div>
            <span className="font-body-sm text-[12px] text-[#757682]">
              Schedule Variance: -6.0%
            </span>
          </div>
        </div>

        {/* Work Status Composition (35% -> 4 columns) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-6 shadow-xs flex flex-col justify-between min-h-[430px] border border-[#c5c5d3]/40">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-sm text-[18px] font-semibold text-[#131b2e]">
                  Work Status
                </h2>
                <p className="font-body-sm text-[12px] text-[#757682] mt-0.5">
                  Execution across all milestones
                </p>
              </div>
              <span className="material-symbols-outlined text-[#757682]/60 text-[20px]">
                tune
              </span>
            </div>

            {/* Clean Multi-tone Segment Bar */}
            <div className="space-y-4">
              <div className="w-full h-3 bg-[#f2f3ff] rounded-full overflow-hidden flex p-0.5 border border-[#c5c5d3]/30">
                <div
                  className="h-full bg-[#006a61] rounded-l-full transition-all"
                  style={{ width: '68%' }}
                  title="On Track: 68%"
                ></div>
                <div
                  className="h-full bg-amber-500 mx-0.5 transition-all"
                  style={{ width: '21%' }}
                  title="At Risk: 21%"
                ></div>
                <div
                  className="h-full bg-[#ba1a1a] rounded-r-full transition-all"
                  style={{ width: '11%' }}
                  title="Delayed: 11%"
                ></div>
              </div>

              {/* Structured Progress Categories */}
              <div className="space-y-2 pt-1">
                {/* On Track */}
                <div className="p-2 rounded-lg hover:bg-[#f2f3ff]/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006a61]"></span>
                    <div>
                      <div className="font-headline-sm text-[13px] text-[#131b2e] leading-snug font-semibold">
                        On Track
                      </div>
                      <div className="font-body-sm text-[11px] text-[#757682]">
                        873 activities
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[14px] font-semibold text-[#006a61]">
                    68%
                  </span>
                </div>

                {/* At Risk */}
                <div className="p-2 rounded-lg hover:bg-[#f2f3ff]/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <div>
                      <div className="font-headline-sm text-[13px] text-[#131b2e] leading-snug font-semibold">
                        At Risk
                      </div>
                      <div className="font-body-sm text-[11px] text-[#757682]">
                        270 activities
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[14px] font-semibold text-amber-600">
                    21%
                  </span>
                </div>

                {/* Delayed */}
                <div className="p-2 rounded-lg hover:bg-[#f2f3ff]/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
                    <div>
                      <div className="font-headline-sm text-[13px] text-[#131b2e] leading-snug font-semibold">
                        Delayed
                      </div>
                      <div className="font-body-sm text-[11px] text-[#757682]">
                        141 activities
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[14px] font-semibold text-[#ba1a1a]">
                    11%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Executive Action Note */}
          <div className="mt-4 p-3 rounded-lg bg-[#f2f3ff] flex items-start gap-3 border border-[#c5c5d3]/30">
            <span className="material-symbols-outlined text-[#006a61] text-[20px] shrink-0 mt-0.5">
              crisis_alert
            </span>
            <div className="text-[#131b2e]">
              <p className="font-headline-sm text-[13px] leading-tight font-semibold">
                Critical Path Action
              </p>
              <p className="font-body-sm text-[12px] text-[#444651] mt-1">
                <strong className="text-[#131b2e] font-semibold">14 activities</strong> require
                attention this week to recover critical path.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Balanced Dual Panels */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Panel: Needs Attention */}
        <div className="bg-white rounded-xl p-6 shadow-xs flex flex-col justify-between border border-[#c5c5d3]/40">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#c5c5d3]/20">
              <div>
                <h2 className="font-headline-sm text-[18px] font-semibold text-[#131b2e]">
                  Needs Attention
                </h2>
                <p className="font-body-sm text-[12px] text-[#757682] mt-0.5">
                  High-impact items threatening project timelines
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-mono text-[10px] font-semibold">
                3 Critical
              </span>
            </div>

            <div className="space-y-3">
              {NEEDS_ATTENTION_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#f2f3ff]/50 hover:bg-[#f2f3ff] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#c5c5d3]/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.severity === 'critical' ? 'bg-[#ba1a1a]' : 'bg-amber-500'
                        }`}
                      ></span>
                      <span className="font-headline-sm text-[14px] text-[#131b2e] font-semibold">
                        {item.title}
                      </span>
                      <span className="text-[#757682]">·</span>
                      <span
                        className={`font-mono text-[11px] font-medium ${
                          item.severity === 'critical' ? 'text-[#ba1a1a]' : 'text-amber-700'
                        }`}
                      >
                        {item.subtitle}
                      </span>
                    </div>
                    <p className="font-body-sm text-[12px] text-[#444651] pl-4">
                      {item.location}
                    </p>
                  </div>

                  {item.actionType === 'request' ? (
                    <button
                      type="button"
                      onClick={() => onRequestReport('Contractor ABC')}
                      className="self-start sm:self-auto h-8 px-3 rounded bg-[#00236f] text-white hover:bg-[#1e3a8a] font-headline-sm text-[12px] font-semibold transition-colors shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      Request Report
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenAttentionDetails(item)}
                      className="self-start sm:self-auto h-8 px-3 rounded bg-white hover:bg-[#e2e7ff] text-[#131b2e] font-headline-sm text-[12px] font-medium transition-colors shadow-xs border border-[#c5c5d3]/40 cursor-pointer whitespace-nowrap"
                    >
                      View Details
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 text-right">
            <button
              onClick={onOpenRiskAlerts}
              className="inline-flex items-center gap-1 font-body-sm text-[12px] text-[#00236f] hover:underline font-semibold cursor-pointer"
            >
              <span>Explore all risk alerts</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right Panel: Recent Updates Timeline */}
        <div className="bg-white rounded-xl p-6 shadow-xs flex flex-col justify-between border border-[#c5c5d3]/40">
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#c5c5d3]/20">
              <div>
                <h2 className="font-headline-sm text-[18px] font-semibold text-[#131b2e]">
                  Recent Updates
                </h2>
                <p className="font-body-sm text-[12px] text-[#757682] mt-0.5">
                  Chronological site submissions and verifications
                </p>
              </div>
              <span className="material-symbols-outlined text-[#757682]/60 text-[20px]">
                history
              </span>
            </div>

            <div className="relative pl-6 space-y-4">
              {/* Timeline Track Line */}
              <div className="absolute left-2.5 top-2 bottom-3 w-0.5 bg-[#eaedff]"></div>

              {RECENT_UPDATES_TIMELINE.map((evt) => (
                <div key={evt.id} className="relative flex items-start gap-3">
                  <span
                    className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white shrink-0 ${
                      evt.dotColor === 'primary'
                        ? 'bg-[#00236f]'
                        : evt.dotColor === 'secondary'
                        ? 'bg-[#006a61]'
                        : 'bg-[#757682]/40'
                    }`}
                  ></span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-headline-sm text-[13px] text-[#131b2e] truncate font-semibold">
                        {evt.actor}
                      </span>
                      <span className="font-mono text-[11px] text-[#757682] shrink-0">
                        {evt.time}
                      </span>
                    </div>
                    <p className="font-body-sm text-[12px] text-[#444651] mt-0.5">
                      {evt.fileBadge ? (
                        <>
                          <span className="font-mono text-[#00236f] font-medium">
                            {evt.fileBadge}
                          </span>{' '}
                          uploaded
                        </>
                      ) : (
                        evt.detail
                      )}
                    </p>
                    {evt.badgeCount && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#eaedff] text-[#444651] font-mono text-[10px]">
                        {evt.badgeCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 text-right">
            <button
              onClick={() => onNavigate('audit-trail')}
              className="inline-flex items-center gap-1 font-body-sm text-[12px] text-[#00236f] hover:underline font-semibold cursor-pointer"
            >
              <span>View complete audit history</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
