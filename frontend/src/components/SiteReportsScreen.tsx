import React, { useState, useRef } from 'react';
import { SiteReport, NavigationPath } from '../types';

interface SiteReportsScreenProps {
  reports: SiteReport[];
  onNavigate: (path: NavigationPath) => void;
  onAddReport: (report: SiteReport) => void;
  onOpenReportDetails: (report: SiteReport) => void;
  onOpenConfigureIntegrations: () => void;
  searchFilter?: string;
}

export const SiteReportsScreen: React.FC<SiteReportsScreenProps> = ({
  reports,
  onNavigate,
  onAddReport,
  onOpenReportDetails,
  onOpenConfigureIntegrations,
  searchFilter = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('Drop a report here');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const processUploadedFile = (file: File) => {
    setIsUploading(true);
    setUploadStatusText(`Analyzing ${file.name}...`);

    setTimeout(() => {
      setUploadStatusText(`Extracting site activities & WBS entities...`);
      setTimeout(() => {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const type: 'pdf' | 'xlsx' | 'csv' =
          fileExt === 'xlsx' || fileExt === 'xls' ? 'xlsx' : fileExt === 'csv' ? 'csv' : 'pdf';

        const newReport: SiteReport = {
          id: `rep-${Date.now()}`,
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          fileType: type,
          submittedBy: 'Field Engineer (Direct Upload)',
          role: 'Site Operations',
          date: 'Just now',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Processed',
          updatesFound: Math.floor(Math.random() * 25) + 12,
        };

        onAddReport(newReport);
        setIsUploading(false);
        setUploadStatusText('Drop a report here');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1500);
    }, 1200);
  };

  const filteredReports = reports.filter((r) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      r.fileName.toLowerCase().includes(q) ||
      r.submittedBy.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full">
      {/* Subtle Ambient Top Backing */}
      <div className="relative w-full overflow-hidden pb-8">
        <div className="absolute -top-24 right-10 w-96 h-96 rounded-full bg-[#dae2fd]/40 blur-3xl pointer-events-none"></div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#444651] font-label-caps text-[11px] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
              Field Intelligence
            </div>
            <h1 className="font-headline-xl text-3xl md:text-4xl text-[#00236f] tracking-tight font-bold">
              Site Reports
            </h1>
            <p className="font-body-lg text-[15px] text-[#444651]">
              Upload daily reports and turn site updates into verified project progress.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white shadow-xs rounded-xl text-[#444651] border border-[#c5c5d3]/40">
            <span className="material-symbols-outlined text-[#006a61] text-[20px]">
              verified
            </span>
            <span className="font-body-sm text-[12px] font-medium">
              Supported formats: PDF, Excel, CSV
            </span>
          </div>
        </div>

        {/* Hero Upload Station */}
        <div className="relative w-full mb-8">
          <div
            id="drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative overflow-hidden rounded-xl p-8 md:p-12 shadow-xs transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col items-center text-center border-2 ${
              isDragging
                ? 'bg-[#e2e7ff] border-[#00236f] border-dashed scale-[1.005]'
                : 'bg-white border-[#c5c5d3]/40 hover:border-[#00236f]/40'
            }`}
          >
            {/* Visual Tone Accents */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#f2f3ff]/50 via-transparent to-transparent opacity-80 pointer-events-none"></div>
            <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#b6c4ff] to-transparent"></div>

            <input
              ref={fileInputRef}
              accept=".pdf,.xlsx,.xls,.csv"
              className="hidden"
              id="file-input"
              type="file"
              onChange={handleFileInputChange}
            />

            {/* Document / Cloud Visual Token */}
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#00236f] transition-transform duration-300 group-hover:scale-105 shadow-xs">
                {isUploading ? (
                  <span className="material-symbols-outlined text-[36px] animate-spin text-[#00236f]">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[36px]">cloud_upload</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#86f2e4] text-[#006f66] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[16px]">add</span>
              </div>
            </div>

            <div className="max-w-lg space-y-1 relative z-10 mb-5">
              <h2 className="font-headline-lg text-[22px] md:text-[24px] text-[#131b2e] font-semibold">
                {uploadStatusText}
              </h2>
              <p className="font-body-md text-[14px] text-[#444651]">
                Upload Daily Site Reports (PDF), Contractor Excel sheets, or CSV logs
              </p>
            </div>

            {/* Primary CTA */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={isUploading}
                className="h-10 px-6 rounded bg-[#00236f] hover:bg-[#1e3a8a] text-white font-headline-sm text-[14px] font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span>{isUploading ? 'Analyzing...' : 'Upload Report'}</span>
              </button>
            </div>

            {/* Integration Note */}
            <div className="relative z-10 mt-5 pt-3 flex items-center justify-center gap-1 text-[#444651] text-[13px]">
              <span className="material-symbols-outlined text-[#757682] text-[16px]">
                sync_alt
              </span>
              <span>Or connect Oracle Aconex / Primavera P6 integrations</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenConfigureIntegrations();
                }}
                className="text-[#00236f] font-semibold hover:underline ml-1 cursor-pointer"
              >
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Active Ingestion Insight Card (Banner) */}
        <div className="mb-8 bg-[#f2f3ff] rounded-xl p-5 shadow-xs border border-[#c5c5d3]/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white text-[#006a61] flex items-center justify-center shrink-0 shadow-xs border border-[#c5c5d3]/30">
                <span className="material-symbols-outlined text-[26px]">auto_awesome</span>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-label-caps text-[11px] uppercase tracking-wider text-[#006a61] font-semibold">
                    Latest Processed Report
                  </span>
                  <span className="text-[#757682] text-xs">•</span>
                  <span className="font-mono text-[13px] text-[#00236f] font-bold">
                    DPR_06_Sep_2026.pdf
                  </span>
                </div>
                <p className="font-body-md text-[14px] text-[#131b2e]">
                  AI read <strong className="text-[#131b2e] font-semibold">28 site updates</strong> from this report.{' '}
                  <span className="text-[#444651]">
                    24 matched automatically with high confidence. 4 require your quick review.
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-end">
              <button
                onClick={() => onNavigate('match-review')}
                className="h-9 px-4 rounded bg-[#00236f] text-white font-headline-sm text-[13px] font-semibold flex items-center gap-2 hover:bg-[#1e3a8a] transition-colors shadow-xs cursor-pointer"
              >
                <span>Open Match &amp; Review</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Reports Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline-lg text-[20px] text-[#131b2e] font-semibold">
                Recent Reports
              </h3>
              <p className="font-body-sm text-[12px] text-[#444651]">
                Review historical ingestion logs, status audits, and schedule linkages.
              </p>
            </div>
            <div className="flex items-center gap-1 font-body-sm text-[12px] text-[#444651]">
              <span>Showing {filteredReports.length} documents</span>
            </div>
          </div>

          {/* Clean Data Table Container */}
          <div className="w-full bg-white rounded-xl shadow-xs overflow-hidden border border-[#c5c5d3]/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f3ff] text-[#444651] font-label-caps text-[11px] uppercase tracking-wider border-b border-[#c5c5d3]/40">
                    <th className="py-3 px-4">Report</th>
                    <th className="py-3 px-4">Submitted By</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Updates Found</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-[13px] text-[#131b2e] divide-y divide-[#c5c5d3]/20">
                  {filteredReports.map((report, idx) => {
                    const isEven = idx % 2 === 1;
                    return (
                      <tr
                        key={report.id}
                        className={`hover:bg-[#f2f3ff]/60 transition-colors ${
                          isEven ? 'bg-[#f2f3ff]/20' : ''
                        }`}
                      >
                        {/* Report filename & size */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${
                                report.fileType === 'xlsx'
                                  ? 'bg-[#86f2e4]/20 text-[#006a61]'
                                  : report.fileType === 'csv'
                                  ? 'bg-[#d5e3fc] text-[#1d2b3d]'
                                  : 'bg-[#e2e7ff] text-[#00236f]'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                {report.fileType === 'xlsx'
                                  ? 'table_view'
                                  : report.fileType === 'csv'
                                  ? 'description'
                                  : 'picture_as_pdf'}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="font-headline-sm text-[13px] font-semibold text-[#131b2e] truncate">
                                {report.fileName}
                              </div>
                              <div className="font-mono text-[11px] text-[#757682]">
                                {report.fileSize}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Submitted by */}
                        <td className="py-3 px-4">
                          <div className="font-headline-sm text-[13px] font-medium text-[#131b2e]">
                            {report.submittedBy}
                          </div>
                          <div className="font-body-sm text-[11px] text-[#444651]">
                            {report.role}
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-headline-sm text-[13px] text-[#131b2e] font-medium">
                            {report.date}
                          </span>
                          <span className="font-mono text-[11px] text-[#757682] block">
                            {report.time}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {report.status === 'Processed' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#86f2e4]/30 text-[#006f66] font-label-caps text-[11px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
                              Processed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-label-caps text-[11px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                              {report.reviewCount || 3} Need Review
                            </span>
                          )}
                        </td>

                        {/* Updates found */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-headline-sm text-[14px] text-[#00236f] font-bold">
                            {report.updatesFound}
                          </span>
                          <span className="text-[#444651] text-[12px]"> updates</span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {report.id === 'rep-1' ? (
                            <button
                              onClick={() => onNavigate('match-review')}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#00236f] text-white font-headline-sm text-[13px] hover:bg-[#1e3a8a] transition-colors shadow-xs cursor-pointer font-medium"
                            >
                              <span>Match to Work</span>
                              <span className="material-symbols-outlined text-[14px]">
                                arrow_forward
                              </span>
                            </button>
                          ) : report.status === 'Need Review' ? (
                            <button
                              onClick={() => onNavigate('match-review')}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#ffdad6] text-[#93000a] hover:bg-[#ba1a1a] hover:text-white font-headline-sm text-[13px] transition-colors shadow-xs cursor-pointer font-semibold"
                            >
                              <span>Review {report.reviewCount || 3} Updates</span>
                              <span className="material-symbols-outlined text-[14px]">
                                priority_high
                              </span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenReportDetails(report)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#eaedff] text-[#444651] hover:text-[#131b2e] font-headline-sm text-[13px] hover:bg-[#dae2fd] transition-colors cursor-pointer font-medium"
                            >
                              View Updates
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Direct Sub-Station Integration Footer Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-xs flex items-center gap-4 border border-[#c5c5d3]/40">
            <div className="w-10 h-10 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#00236f] shrink-0">
              <span className="material-symbols-outlined text-[22px]">history_edu</span>
            </div>
            <div>
              <div className="font-headline-sm text-[14px] font-semibold text-[#131b2e]">
                Automated Audit
              </div>
              <div className="font-body-sm text-[12px] text-[#444651]">
                Every number is traceable to raw contractor source records.
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs flex items-center gap-4 border border-[#c5c5d3]/40">
            <div className="w-10 h-10 rounded-lg bg-[#86f2e4]/20 flex items-center justify-center text-[#006a61] shrink-0">
              <span className="material-symbols-outlined text-[22px]">
                published_with_changes
              </span>
            </div>
            <div>
              <div className="font-headline-sm text-[14px] font-semibold text-[#131b2e]">
                Primavera Sync
              </div>
              <div className="font-body-sm text-[12px] text-[#444651]">
                Match percent completions directly to your active baseline.
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs flex items-center gap-4 border border-[#c5c5d3]/40">
            <div className="w-10 h-10 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#00236f] shrink-0">
              <span className="material-symbols-outlined text-[22px]">shield_person</span>
            </div>
            <div>
              <div className="font-headline-sm text-[14px] font-semibold text-[#131b2e]">
                Human in the Loop
              </div>
              <div className="font-body-sm text-[12px] text-[#444651]">
                Review discrepancies before any progress update is locked.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
