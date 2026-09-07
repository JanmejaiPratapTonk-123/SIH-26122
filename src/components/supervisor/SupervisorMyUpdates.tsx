import React, { useState } from 'react';
import { SupervisorFieldUpdate } from '../../types';

interface SupervisorMyUpdatesProps {
  updates: SupervisorFieldUpdate[];
  onOpenQuickLog: () => void;
  onShowToast: (title: string, message: string, icon?: string, isError?: boolean) => void;
}

export const SupervisorMyUpdates: React.FC<SupervisorMyUpdatesProps> = ({
  updates,
  onOpenQuickLog,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tradeFilter, setTradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredUpdates = updates.filter((upd) => {
    const matchesSearch =
      upd.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upd.chainage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upd.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upd.activityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTrade = tradeFilter === 'All' || upd.trade.toLowerCase().includes(tradeFilter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || upd.status === statusFilter;

    return matchesSearch && matchesTrade && matchesStatus;
  });

  const trades = ['All', 'Earthwork', 'Civil', 'Piping', 'Welding'];

  return (
    <div className="flex flex-col w-full gap-6 text-[#131b2e] animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c5c5d3]/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-[11px] uppercase text-[#006a61] tracking-wider font-semibold">
              Field Operations
            </span>
            <span className="text-[#757682]">•</span>
            <span className="text-[12px] text-[#006a61] bg-[#e6f7f5] px-2 py-0.5 rounded-full font-medium">
              Progress Line Items
            </span>
          </div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight mt-1">
            My Field Updates
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#444651] mt-0.5">
            Individual physical progress entries extracted from daily site reports and field checks.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenQuickLog}
          className="h-10 px-5 rounded-xl bg-[#006a61] hover:bg-[#005049] text-white font-headline-sm text-[13px] font-semibold transition-all shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_task</span>
          <span>+ Log Field Progress Check</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#757682]">
            Total Quantities Logged
          </span>
          <div className="mt-2 text-3xl font-bold text-[#131b2e]">{updates.length} Updates</div>
          <div className="mt-2 text-[12px] text-[#006a61] font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">done_all</span>
            <span>Across Duliajan KP 10-25 corridor</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#006a61]">
            Synced with P6 Baseline
          </span>
          <div className="mt-2 text-3xl font-bold text-[#006a61]">
            {updates.filter((u) => u.status === 'Approved into P6').length}
          </div>
          <div className="mt-2 text-[12px] text-[#757682]">
            Verified by Project Planner
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#d97706]">
            Under Verification
          </span>
          <div className="mt-2 text-3xl font-bold text-[#d97706]">
            {updates.filter((u) => u.status !== 'Approved into P6').length}
          </div>
          <div className="mt-2 text-[12px] text-[#757682]">
            Pending AI ingestion or lab survey
          </div>
        </div>
      </div>

      {/* Search & Trade Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757682] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activity, code, or chainage..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {trades.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTradeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors shrink-0 cursor-pointer ${
                tradeFilter === t
                  ? 'bg-[#00236f] text-white'
                  : 'bg-[#f8f9ff] text-[#444651] hover:bg-[#eaedff]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Updates Cards/List */}
      <div className="bg-white rounded-2xl border border-[#c5c5d3]/40 shadow-xs divide-y divide-[#c5c5d3]/20 overflow-hidden">
        {filteredUpdates.length > 0 ? (
          filteredUpdates.map((upd) => (
            <div
              key={upd.id}
              className="p-4 sm:p-5 hover:bg-[#f8f9ff] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-bold text-[#00236f] bg-[#e2e7ff] px-2 py-0.5 rounded">
                    {upd.activityId}
                  </span>
                  <span className="text-[11px] text-[#757682]">•</span>
                  <span className="text-[12px] font-medium text-[#444651]">{upd.workPackage}</span>
                  <span className="text-[11px] text-[#757682]">•</span>
                  <span className="text-[11px] text-[#006a61] font-semibold bg-[#e6f7f5] px-2 py-0.5 rounded-full">
                    {upd.trade}
                  </span>
                </div>

                <h3 className="font-headline-sm text-[15px] font-bold text-[#131b2e]">
                  {upd.activityName}
                </h3>

                <div className="flex items-center gap-2 text-[12px] text-[#757682] flex-wrap">
                  <span className="flex items-center gap-1 text-[#006a61] font-medium">
                    <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                    <span>{upd.chainage}</span>
                  </span>
                  <span>•</span>
                  <span>Source: <strong className="text-[#131b2e] font-mono">{upd.reportName}</strong></span>
                  <span>•</span>
                  <span>{upd.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#c5c5d3]/20">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-bold text-[#00236f]">
                    {upd.quantity}
                  </span>
                  <span className="text-[13px] font-semibold text-[#757682]">{upd.unit}</span>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    upd.status === 'Approved into P6'
                      ? 'bg-[#e6f7f5] text-[#006a61] border border-[#bbf7d0]'
                      : 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      upd.status === 'Approved into P6' ? 'bg-[#006a61]' : 'bg-[#d97706]'
                    }`}
                  />
                  {upd.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-[#757682]">
            <span className="material-symbols-outlined text-[36px] text-[#c5c5d3]">search_off</span>
            <p className="text-[14px] font-medium text-[#131b2e] mt-1">No field updates match filter</p>
          </div>
        )}
      </div>
    </div>
  );
};
