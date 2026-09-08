import React, { useState } from 'react';
import { SupervisorReport, UserProfile } from '../../types';

interface SupervisorMyReportsProps {
  reports: SupervisorReport[];
  onViewDetails: (report: SupervisorReport) => void;
  onEditDraft: (report: SupervisorReport) => void;
  onSubmitDraft: (reportId: string) => void;
  onDeleteDraft: (reportId: string) => void;
  onNavigateSubmit: () => void;
  onShowToast: (title: string, message: string, icon?: string, isError?: boolean) => void;
  currentUser: UserProfile;
}

export const SupervisorMyReports: React.FC<SupervisorMyReportsProps> = ({
  reports,
  onViewDetails,
  onEditDraft,
  onSubmitDraft,
  onDeleteDraft,
  onNavigateSubmit,
  onShowToast,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Processed' | 'Pending Verification' | 'Draft'>('All');
  const [selectedWorkArea, setSelectedWorkArea] = useState<string>('All');
  const [transmittalReceiptReport, setTransmittalReceiptReport] = useState<SupervisorReport | null>(null);

  // Filtered reports
  const filteredReports = reports.filter((rep) => {
    const matchesSearch =
      rep.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.workArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.chainage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.contractor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || rep.status === statusFilter;
    const matchesArea = selectedWorkArea === 'All' || rep.workArea.includes(selectedWorkArea);

    return matchesSearch && matchesStatus && matchesArea;
  });

  const processedCount = reports.filter((r) => r.status === 'Processed').length;
  const pendingCount = reports.filter((r) => r.status === 'Pending Verification').length;
  const draftCount = reports.filter((r) => r.status === 'Draft').length;

  return (
    <div className="flex flex-col w-full gap-6 text-[#131b2e] animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c5c5d3]/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-[11px] uppercase text-[#006a61] tracking-wider font-semibold">
              Field Operations Records
            </span>
            <span className="text-[#757682]">•</span>
            <span className="text-[12px] text-[#006a61] bg-[#e6f7f5] px-2 py-0.5 rounded-full font-medium">
              Supervisor Reports Ledger
            </span>
          </div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight mt-1">
            My Site Reports
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#444651] mt-0.5">
            Audit trail of all field reports, daily progress logs, and verification drafts submitted from your sector.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateSubmit}
          className="h-10 px-5 rounded-xl bg-[#006a61] hover:bg-[#005049] text-white font-headline-sm text-[13px] font-semibold transition-all shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Submit New Report</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setStatusFilter('All')}
          className={`p-4 bg-white rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'All'
              ? 'border-[#006a61] ring-2 ring-[#006a61]/20 shadow-xs'
              : 'border-[#c5c5d3]/40 hover:border-[#757682]'
          }`}
        >
          <span className="text-[11px] uppercase font-bold text-[#757682] block">Total Reports</span>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-[#131b2e]">{reports.length}</div>
          <span className="text-[11px] text-[#006a61] mt-1 block">Active project sector</span>
        </div>

        <div
          onClick={() => setStatusFilter('Processed')}
          className={`p-4 bg-white rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'Processed'
              ? 'border-[#006a61] ring-2 ring-[#006a61]/20 shadow-xs'
              : 'border-[#c5c5d3]/40 hover:border-[#757682]'
          }`}
        >
          <span className="text-[11px] uppercase font-bold text-[#006a61] block">Processed into P6</span>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-[#006a61]">{processedCount}</div>
          <span className="text-[11px] text-[#757682] mt-1 block">AI matched &amp; synced</span>
        </div>

        <div
          onClick={() => setStatusFilter('Pending Verification')}
          className={`p-4 bg-white rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'Pending Verification'
              ? 'border-[#d97706] ring-2 ring-[#d97706]/20 shadow-xs'
              : 'border-[#c5c5d3]/40 hover:border-[#757682]'
          }`}
        >
          <span className="text-[11px] uppercase font-bold text-[#d97706] block">Pending Review</span>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-[#d97706]">{pendingCount}</div>
          <span className="text-[11px] text-[#757682] mt-1 block">In planner review queue</span>
        </div>

        <div
          onClick={() => setStatusFilter('Draft')}
          className={`p-4 bg-white rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'Draft'
              ? 'border-[#475569] ring-2 ring-[#475569]/20 shadow-xs'
              : 'border-[#c5c5d3]/40 hover:border-[#757682]'
          }`}
        >
          <span className="text-[11px] uppercase font-bold text-[#475569] block">Unsubmitted Drafts</span>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-[#475569]">{draftCount}</div>
          <span className="text-[11px] text-[#757682] mt-1 block">Editable before ingestion</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757682] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by file name, chainage, or contractor..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['All', 'Processed', 'Pending Verification', 'Draft'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors shrink-0 cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#006a61] text-white'
                  : 'bg-[#f8f9ff] text-[#444651] hover:bg-[#eaedff]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-[#c5c5d3]/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#c5c5d3]/30 bg-[#f8f9ff] text-[#757682] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Report Document</th>
                <th className="py-3 px-4">Work Front &amp; Chainage</th>
                <th className="py-3 px-4">Contractor</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Updates</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c5c5d3]/20">
              {filteredReports.length > 0 ? (
                filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[#f8f9ff] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-[#131b2e] block truncate hover:text-[#006a61] cursor-pointer" onClick={() => onViewDetails(rep)}>
                            {rep.fileName}
                          </span>
                          <span className="text-[11px] text-[#757682] font-mono">{rep.fileSize}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="min-w-0">
                        <span className="text-[#131b2e] font-medium block truncate max-w-[220px]">
                          {rep.workArea}
                        </span>
                        <span className="text-[11px] text-[#00236f] font-mono">{rep.chainage}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#444651] font-medium">
                      {rep.contractor}
                    </td>

                    <td className="py-3.5 px-4 text-[#757682] text-[12px]">
                      {rep.date}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold font-mono text-[#00236f] bg-[#e2e7ff] px-2 py-0.5 rounded text-[12px]">
                        {rep.updatesCount} updates
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          rep.status === 'Processed'
                            ? 'bg-[#e6f7f5] text-[#006a61] border border-[#bbf7d0]'
                            : rep.status === 'Pending Verification'
                            ? 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]'
                            : 'bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            rep.status === 'Processed'
                              ? 'bg-[#006a61]'
                              : rep.status === 'Pending Verification'
                              ? 'bg-[#d97706]'
                              : 'bg-[#64748b]'
                          }`}
                        />
                        {rep.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onViewDetails(rep)}
                          className="text-[12px] text-[#00236f] hover:underline font-semibold cursor-pointer px-2 py-1 rounded hover:bg-[#e2e7ff]/50"
                        >
                          View Details
                        </button>

                        {rep.status !== 'Processed' && (
                          <button
                            type="button"
                            onClick={() => onEditDraft(rep)}
                            className="text-[12px] text-[#006a61] hover:underline font-semibold cursor-pointer px-2 py-1 rounded hover:bg-[#e6f7f5]"
                          >
                            Correct Draft
                          </button>
                        )}

                        {rep.status === 'Draft' && (
                          <>
                            <button
                              type="button"
                              onClick={() => onSubmitDraft(rep.id)}
                              className="text-[12px] text-white bg-[#006a61] hover:bg-[#005049] px-2.5 py-1 rounded font-semibold cursor-pointer transition-colors"
                            >
                              Submit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteDraft(rep.id)}
                              className="p-1 rounded text-[#ba1a1a] hover:bg-red-50 cursor-pointer"
                              title="Delete Draft"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => setTransmittalReceiptReport(rep)}
                          className="p-1 rounded text-[#757682] hover:text-[#131b2e] hover:bg-[#eaedff] cursor-pointer"
                          title="Print Transmittal Slip"
                        >
                          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#757682]">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-[36px] text-[#c5c5d3]">
                        folder_off
                      </span>
                      <p className="text-[14px] font-medium text-[#131b2e]">No site reports found</p>
                      <p className="text-[12px] text-[#757682]">
                        Try adjusting your search criteria or submit a new daily site report.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transmittal Receipt Slip Modal */}
      {transmittalReceiptReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-[#c5c5d3] overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#006a61]">receipt</span>
                <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
                  Transmittal Slip Receipt
                </h3>
              </div>
              <button
                onClick={() => setTransmittalReceiptReport(null)}
                className="p-1 text-[#757682] hover:bg-[#eaedff] rounded cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 text-[12px] space-y-2 font-mono text-[#444651]">
              <div className="flex justify-between">
                <span>Receipt Ref:</span>
                <span className="font-bold text-[#131b2e]">TXM-{transmittalReceiptReport.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Document:</span>
                <span className="font-bold text-[#131b2e] truncate max-w-[200px]">{transmittalReceiptReport.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span>Signer:</span>
                <span>{currentUser.name} ({currentUser.role})</span>
              </div>
              <div className="flex justify-between">
                <span>Sector:</span>
                <span>{transmittalReceiptReport.chainage}</span>
              </div>
              <div className="flex justify-between">
                <span>Date &amp; Time:</span>
                <span>{transmittalReceiptReport.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Verification State:</span>
                <span className="text-[#006a61] font-bold">{transmittalReceiptReport.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onShowToast(
                    'Transmittal Downloaded',
                    `Downloaded official sign-off receipt for ${transmittalReceiptReport.fileName}.`,
                    'download'
                  );
                  setTransmittalReceiptReport(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#006a61] hover:bg-[#005049] text-white text-[13px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download PDF Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
