import React, { useState, useEffect } from 'react';
import {
  NavigationPath,
  SupervisorReport,
  SupervisorShiftNote,
  SupervisorFieldUpdate,
  SiteReport,
} from '../types';
import {
  INITIAL_SUPERVISOR_REPORTS,
  INITIAL_SUPERVISOR_NOTES,
  INITIAL_SUPERVISOR_UPDATES,
  SUPERVISOR_WORK_AREAS,
  PRESET_FIELD_PHOTOS,
} from '../data/supervisorMockData';
import {
  SupervisorReportDetailsModal,
  SupervisorDraftEditModal,
  SupervisorQuickProgressModal,
} from './supervisor/SupervisorModals';
import { SupervisorSubmitReport } from './supervisor/SupervisorSubmitReport';
import { SupervisorMyReports } from './supervisor/SupervisorMyReports';
import { SupervisorMyUpdates } from './supervisor/SupervisorMyUpdates';

interface SupervisorHomeScreenProps {
  currentPath?: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  onOpenUploadModal?: () => void;
  onShowToast: (title: string, message: string, icon?: string, isError?: boolean) => void;
  sidebarOpen?: boolean;
  onGlobalAddReport?: (report: SiteReport) => void;
}

export const SupervisorHomeScreen: React.FC<SupervisorHomeScreenProps> = ({
  currentPath = 'home',
  onNavigate,
  onOpenUploadModal,
  onShowToast,
  sidebarOpen = true,
  onGlobalAddReport,
}) => {
  // 1. Persistent Reports State
  const [reports, setReports] = useState<SupervisorReport[]>(() => {
    try {
      const saved = localStorage.getItem('p2p_supervisor_reports');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load supervisor reports', e);
    }
    return INITIAL_SUPERVISOR_REPORTS;
  });

  // 2. Persistent Shift Notes State
  const [shiftNotes, setShiftNotes] = useState<SupervisorShiftNote[]>(() => {
    try {
      const saved = localStorage.getItem('p2p_supervisor_notes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load supervisor notes', e);
    }
    return INITIAL_SUPERVISOR_NOTES;
  });

  // 3. Persistent Updates State
  const [fieldUpdates, setFieldUpdates] = useState<SupervisorFieldUpdate[]>(() => {
    try {
      const saved = localStorage.getItem('p2p_supervisor_updates');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load supervisor updates', e);
    }
    return INITIAL_SUPERVISOR_UPDATES;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('p2p_supervisor_reports', JSON.stringify(reports));
    } catch (e) {
      console.error(e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem('p2p_supervisor_notes', JSON.stringify(shiftNotes));
    } catch (e) {
      console.error(e);
    }
  }, [shiftNotes]);

  useEffect(() => {
    try {
      localStorage.setItem('p2p_supervisor_updates', JSON.stringify(fieldUpdates));
    } catch (e) {
      console.error(e);
    }
  }, [fieldUpdates]);

  // Active Front & Filter
  const [activeSector, setActiveSector] = useState(SUPERVISOR_WORK_AREAS[0]);

  // Quick Note Form State
  const [quickNote, setQuickNote] = useState('');
  const [noteCategory, setNoteCategory] = useState<SupervisorShiftNote['category']>('Observation');
  const [attachedPhotoForNote, setAttachedPhotoForNote] = useState<typeof PRESET_FIELD_PHOTOS[0] | null>(null);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  // Modals state
  const [selectedReportForDetails, setSelectedReportForDetails] = useState<SupervisorReport | null>(null);
  const [selectedReportForEdit, setSelectedReportForEdit] = useState<SupervisorReport | null>(null);
  const [isQuickProgressModalOpen, setIsQuickProgressModalOpen] = useState(false);

  // Metrics computation
  const submittedCount = reports.filter((r) => r.status === 'Processed').length;
  const pendingCount = reports.filter((r) => r.status === 'Pending Verification').length;
  const draftCount = reports.filter((r) => r.status === 'Draft').length;

  // Add new report handler
  const handleAddReport = (newReport: SupervisorReport, submitToLedger = true) => {
    setReports((prev) => [newReport, ...prev]);

    // Also create field updates for newly submitted report
    if (newReport.quantities && newReport.quantities.length > 0) {
      const newUpdates: SupervisorFieldUpdate[] = newReport.quantities.map((q, idx) => ({
        id: `upd-${Date.now()}-${idx}`,
        reportId: newReport.id,
        reportName: newReport.fileName,
        activityId: q.matchActivity || `L6-PIPE-ACT-${idx + 10}`,
        activityName: q.item,
        workPackage: newReport.workArea,
        chainage: q.chainage || newReport.chainage,
        quantity: q.quantity,
        unit: q.unit,
        trade: q.item.includes('Excavation')
          ? 'Earthwork'
          : q.item.includes('Bedding')
          ? 'Civil / Bedding'
          : q.item.includes('Weld')
          ? 'Welding'
          : 'Pipeline',
        status: newReport.status === 'Processed' ? 'Approved into P6' : 'Under Review',
        confidence: q.matchConfidence || 95.0,
        timestamp: newReport.date,
        contractor: newReport.contractor,
      }));
      setFieldUpdates((prev) => [...newUpdates, ...prev]);
    }

    // Forward to global app reports ledger if provided
    if (onGlobalAddReport && submitToLedger) {
      const siteReport: SiteReport = {
        id: newReport.id,
        fileName: newReport.fileName,
        fileSize: newReport.fileSize,
        fileType: newReport.fileType,
        submittedBy: newReport.submittedBy,
        role: newReport.role,
        date: 'Today',
        time: newReport.time,
        status: newReport.status === 'Processed' ? 'Processed' : 'Need Review',
        updatesFound: newReport.updatesCount,
        reviewCount: newReport.status === 'Pending Verification' ? 1 : 0,
      };
      onGlobalAddReport(siteReport);
    }
  };

  // Edit draft handler
  const handleSaveDraft = (updatedReport: SupervisorReport, submitNow: boolean) => {
    setReports((prev) =>
      prev.map((r) => (r.id === updatedReport.id ? updatedReport : r))
    );

    if (submitNow) {
      onShowToast(
        'Draft Submitted',
        `${updatedReport.fileName} submitted to Project Planner review queue.`,
        'task_alt'
      );
      if (onGlobalAddReport) {
        onGlobalAddReport({
          id: updatedReport.id,
          fileName: updatedReport.fileName,
          fileSize: updatedReport.fileSize,
          fileType: updatedReport.fileType,
          submittedBy: updatedReport.submittedBy,
          role: updatedReport.role,
          date: 'Today',
          time: updatedReport.time,
          status: 'Need Review',
          updatesFound: updatedReport.updatesCount,
          reviewCount: 1,
        });
      }
    } else {
      onShowToast(
        'Draft Updated',
        `Changes saved to ${updatedReport.fileName}.`,
        'save'
      );
    }
  };

  // Submit draft directly
  const handleSubmitDraft = (reportId: string) => {
    const rep = reports.find((r) => r.id === reportId);
    if (!rep) return;

    const updated: SupervisorReport = {
      ...rep,
      status: 'Pending Verification',
    };
    handleSaveDraft(updated, true);
  };

  // Delete draft
  const handleDeleteDraft = (reportId: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    onShowToast('Draft Deleted', 'Unsubmitted draft removed from supervisor records.', 'delete');
  };

  // Quick note submit
  const handleQuickNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;

    const newNote: SupervisorShiftNote = {
      id: `note-${Date.now()}`,
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: '06 Sep 2026',
      chainage: activeSector,
      category: noteCategory,
      content: quickNote.trim(),
      author: 'R. Sharma (Site Supervisor)',
      photoUrl: attachedPhotoForNote?.url,
      photoCaption: attachedPhotoForNote?.caption,
    };

    setShiftNotes((prev) => [newNote, ...prev]);
    onShowToast(
      'Site Note Logged',
      `Field note logged under ${noteCategory} for ${activeSector}.`,
      'note_alt'
    );
    setQuickNote('');
    setAttachedPhotoForNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    setShiftNotes((prev) => prev.filter((n) => n.id !== noteId));
    onShowToast('Note Removed', 'Shift observation deleted.', 'delete');
  };

  // Quick progress update submit
  const handleAddQuickProgress = (updateData: Partial<SupervisorFieldUpdate>) => {
    const newUpd: SupervisorFieldUpdate = {
      id: `upd-${Date.now()}`,
      reportId: `quick-${Date.now()}`,
      reportName: 'Quick_Field_Check.log',
      activityId: updateData.activityId || 'L6-PIPE-EXC-042',
      activityName: updateData.activityName || 'Pipeline Trench Excavation',
      workPackage: updateData.workPackage || 'Pipeline Sector B',
      chainage: updateData.chainage || activeSector,
      quantity: updateData.quantity || '100',
      unit: updateData.unit || 'meters',
      trade: updateData.trade || 'Earthwork / Excavation',
      status: 'Approved into P6',
      confidence: 96.0,
      timestamp: 'Just now',
      contractor: updateData.contractor || 'Kalpataru Field Ops',
    };

    setFieldUpdates((prev) => [newUpd, ...prev]);
    onShowToast(
      'Progress Check Recorded',
      `Logged ${newUpd.quantity} ${newUpd.unit} for ${newUpd.activityName}.`,
      'task_alt'
    );
  };

  // RBAC Demonstration Toast
  const handleDisallowedAction = (actionName: string) => {
    onShowToast(
      'Action Restricted',
      `You don't have permission to ${actionName}. Contact your Project Planner or System Administrator.`,
      'block',
      true
    );
  };

  // Route sub-views based on currentPath
  if (currentPath === 'submit-report') {
    return (
      <>
        <SupervisorSubmitReport
          onAddReport={handleAddReport}
          onShowToast={onShowToast}
          onNavigateToReports={() => onNavigate('my-reports')}
        />
        <SupervisorReportDetailsModal
          report={selectedReportForDetails}
          onClose={() => setSelectedReportForDetails(null)}
          onEditDraft={(r) => setSelectedReportForEdit(r)}
          onSubmitDraft={handleSubmitDraft}
        />
      </>
    );
  }

  if (currentPath === 'my-reports') {
    return (
      <>
        <SupervisorMyReports
          reports={reports}
          onViewDetails={(rep) => setSelectedReportForDetails(rep)}
          onEditDraft={(rep) => setSelectedReportForEdit(rep)}
          onSubmitDraft={handleSubmitDraft}
          onDeleteDraft={handleDeleteDraft}
          onNavigateSubmit={() => onNavigate('submit-report')}
          onShowToast={onShowToast}
        />
        <SupervisorReportDetailsModal
          report={selectedReportForDetails}
          onClose={() => setSelectedReportForDetails(null)}
          onEditDraft={(r) => setSelectedReportForEdit(r)}
          onSubmitDraft={handleSubmitDraft}
        />
        <SupervisorDraftEditModal
          report={selectedReportForEdit}
          isOpen={!!selectedReportForEdit}
          onClose={() => setSelectedReportForEdit(null)}
          onSave={handleSaveDraft}
        />
      </>
    );
  }

  if (currentPath === 'my-updates') {
    return (
      <>
        <SupervisorMyUpdates
          updates={fieldUpdates}
          onOpenQuickLog={() => setIsQuickProgressModalOpen(true)}
          onShowToast={onShowToast}
        />
        <SupervisorQuickProgressModal
          isOpen={isQuickProgressModalOpen}
          onClose={() => setIsQuickProgressModalOpen(false)}
          onSubmit={handleAddQuickProgress}
        />
      </>
    );
  }

  // DEFAULT: Supervisor Home / Field Operations Front
  return (
    <div className="flex flex-col w-full gap-6 text-[#131b2e] animate-in fade-in duration-200">
      {/* Field Greeting & Active Front Header */}
      <header
        className={`flex flex-col justify-between gap-4 pb-1 transition-all ${
          sidebarOpen ? 'xl:flex-row xl:items-end' : 'lg:flex-row lg:items-end'
        }`}
      >
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-label-caps text-[11px] uppercase text-[#006a61] tracking-wider font-semibold">
              Field Operations Front
            </span>
            <span className="text-[#757682]">•</span>
            {/* Interactive Sector Switcher */}
            <div className="relative inline-flex items-center">
              <select
                value={activeSector}
                onChange={(e) => {
                  setActiveSector(e.target.value);
                  onShowToast(
                    'Sector Switched',
                    `Active field context switched to ${e.target.value}.`,
                    'near_me'
                  );
                }}
                className="text-[12px] text-[#006a61] font-semibold bg-[#e6f7f5] hover:bg-[#d8f4f0] px-2.5 py-1 rounded-full border border-[#bbf7d0] cursor-pointer focus:outline-none pr-6 appearance-none transition-colors"
              >
                {SUPERVISOR_WORK_AREAS.map((area, idx) => (
                  <option key={idx} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[14px] text-[#006a61] absolute right-2 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl md:text-4xl text-[#131b2e] tracking-tight font-bold">
            Good morning, R. Sharma.
          </h1>
          <p className="font-body-md text-[14px] sm:text-[16px] text-[#444651]">
            What&apos;s happening on the construction front today?
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => onNavigate('submit-report')}
            className="h-11 px-5 rounded-xl bg-[#006a61] hover:bg-[#005049] text-white font-headline-sm text-[14px] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>+ Submit Site Report</span>
          </button>

          <button
            type="button"
            onClick={() => setIsQuickProgressModalOpen(true)}
            className="h-11 px-4 rounded-xl bg-white border border-[#c5c5d3] hover:border-[#006a61] text-[#006a61] font-semibold text-[13px] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>Quick Progress Check</span>
          </button>
        </div>
      </header>

      {/* Field Metrics: 3 Interactive Clickable Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('my-reports')}
          className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between hover:border-[#006a61] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#757682]">
              Reports Processed
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#757682] group-hover:text-[#006a61] transition-colors">
              arrow_forward
            </span>
          </div>
          <div className="mt-2 text-3xl sm:text-4xl font-bold text-[#131b2e] group-hover:text-[#006a61] transition-colors">
            {submittedCount}
          </div>
          <div className="mt-2 text-[11px] text-[#006a61] font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Synchronized into master P6 baseline</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('my-reports')}
          className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between hover:border-[#d97706] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#d97706]">
              Reports Pending Verification
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#757682] group-hover:text-[#d97706] transition-colors">
              arrow_forward
            </span>
          </div>
          <div className="mt-2 text-3xl sm:text-4xl font-bold text-[#d97706]">
            {pendingCount}
          </div>
          <div className="mt-2 text-[11px] text-[#757682]">
            {draftCount > 0 ? `${draftCount} unsubmitted draft saved` : 'Awaiting planner baseline sync'}
          </div>
        </div>

        <div
          onClick={() => onNavigate('my-updates')}
          className="bg-white p-5 rounded-xl border border-[#c5c5d3]/40 shadow-xs flex flex-col justify-between hover:border-[#00236f] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#00236f]">
              Updates Logged
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#757682] group-hover:text-[#00236f] transition-colors">
              arrow_forward
            </span>
          </div>
          <div className="mt-2 text-3xl sm:text-4xl font-bold text-[#00236f]">
            {fieldUpdates.length}
          </div>
          <div className="mt-2 text-[11px] text-[#006a61] font-medium">
            Trenching, sand bedding, stringing, &amp; welding
          </div>
        </div>
      </div>

      {/* Recent Reports List with Live Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c5c5d3]/40 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c5c5d3]/30 pb-3">
          <div>
            <h2 className="font-headline-sm text-[16px] font-bold text-[#131b2e]">
              Recent Field Reports
            </h2>
            <p className="text-[12px] text-[#757682]">
              Reports uploaded or drafted from your sector workstation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('my-reports')}
              className="text-[12px] text-[#006a61] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({reports.length})</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#c5c5d3]/30 text-[#757682] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Report Document</th>
                <th className="py-2.5 px-3">Work Front</th>
                <th className="py-2.5 px-3">Submission Date</th>
                <th className="py-2.5 px-3">Updates</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c5c5d3]/20">
              {reports.slice(0, 4).map((rep) => (
                <tr key={rep.id} className="hover:bg-[#f8f9ff] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">
                        picture_as_pdf
                      </span>
                      <span
                        className="font-semibold text-[#131b2e] hover:text-[#006a61] cursor-pointer"
                        onClick={() => setSelectedReportForDetails(rep)}
                      >
                        {rep.fileName}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-[#444651]">
                    <span className="block truncate max-w-[200px]">{rep.workArea}</span>
                  </td>

                  <td className="py-3 px-3 text-[#757682] text-[12px]">{rep.date}</td>

                  <td className="py-3 px-3 font-semibold text-[#00236f]">
                    {rep.updatesCount} updates
                  </td>

                  <td className="py-3 px-3">
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

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedReportForDetails(rep)}
                        className="text-[12px] text-[#00236f] hover:underline font-semibold cursor-pointer"
                      >
                        View Details
                      </button>

                      {rep.status !== 'Processed' && (
                        <button
                          type="button"
                          onClick={() => setSelectedReportForEdit(rep)}
                          className="text-[12px] text-[#006a61] hover:underline font-semibold cursor-pointer"
                        >
                          Correct Draft
                        </button>
                      )}

                      {rep.status === 'Draft' && (
                        <button
                          type="button"
                          onClick={() => handleSubmitDraft(rep.id)}
                          className="text-[11px] text-white bg-[#006a61] hover:bg-[#005049] px-2 py-0.5 rounded font-semibold cursor-pointer"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Field Quick-Log & Shift Observations Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Field Quick Note Form */}
        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-2">
              <h2 className="font-headline-sm text-[15px] font-bold text-[#131b2e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#006a61]">edit_note</span>
                <span>Field Quick Note</span>
              </h2>
              <span className="text-[11px] text-[#006a61] bg-[#e6f7f5] px-2 py-0.5 rounded-full font-medium">
                Live Shift Log
              </span>
            </div>

            <form onSubmit={handleQuickNoteSubmit} className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
                    Sector Corridor
                  </label>
                  <select
                    value={activeSector}
                    onChange={(e) => setActiveSector(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-[#c5c5d3] text-[12px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
                  >
                    {SUPERVISOR_WORK_AREAS.map((area, idx) => (
                      <option key={idx} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
                    Note Category
                  </label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value as any)}
                    className="w-full h-9 px-2.5 rounded-lg border border-[#c5c5d3] text-[12px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
                  >
                    <option value="Observation">General Observation</option>
                    <option value="Safety">Safety &amp; Toolbox Meeting</option>
                    <option value="Quality">Quality &amp; Inspection</option>
                    <option value="Weather">Weather &amp; Soil Check</option>
                    <option value="Material">Material &amp; Pipe Delivery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
                  Observation / Field Update
                </label>
                <textarea
                  rows={2}
                  required
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="e.g., Bedding sand completed across chainage 12+600. Survey verified level."
                  className="w-full p-2.5 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
                />
              </div>

              {/* Photo preview if attached */}
              {attachedPhotoForNote && (
                <div className="p-2 bg-[#e6f7f5] rounded-lg border border-[#bbf7d0] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={attachedPhotoForNote.url}
                      alt="Thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded object-cover shrink-0"
                    />
                    <span className="truncate text-[#006a61] font-medium">
                      {attachedPhotoForNote.caption}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedPhotoForNote(null)}
                    className="text-[#ba1a1a] hover:bg-white p-1 rounded cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker(true)}
                  className="flex items-center gap-1.5 text-[12px] text-[#444651] hover:text-[#006a61] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  <span>{attachedPhotoForNote ? 'Change Photo' : 'Attach Site Photo'}</span>
                </button>

                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-[#006a61] hover:bg-[#005049] text-white text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  Post to Shift Log
                </button>
              </div>
            </form>
          </div>

          {/* Photo Picker Modal */}
          {showPhotoPicker && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-2">
                  <h3 className="font-headline-sm text-[15px] font-bold text-[#131b2e]">
                    Select Field Camera Photo
                  </h3>
                  <button
                    onClick={() => setShowPhotoPicker(false)}
                    className="text-[#757682] hover:text-[#131b2e]"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {PRESET_FIELD_PHOTOS.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setAttachedPhotoForNote(p);
                        setShowPhotoPicker(false);
                      }}
                      className="p-2 rounded-lg border border-[#c5c5d3]/40 hover:border-[#006a61] bg-[#f8f9ff] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <img
                        src={p.url}
                        alt="Photo"
                        referrerPolicy="no-referrer"
                        className="w-12 h-10 object-cover rounded"
                      />
                      <div className="text-[11px] min-w-0">
                        <p className="font-medium truncate">{p.caption}</p>
                        <span className="text-[#757682] text-[10px] font-mono">{p.geotag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Shift Log & Observations List */}
        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-2">
              <h2 className="font-headline-sm text-[15px] font-bold text-[#131b2e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#00236f]">feed</span>
                <span>Active Shift Log ({shiftNotes.length})</span>
              </h2>
              <span className="text-[11px] text-[#757682]">Chronological Audit</span>
            </div>

            <div className="mt-3 space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {shiftNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 text-[12px] space-y-1 group"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[10px] uppercase ${
                          note.category === 'Safety'
                            ? 'bg-[#fee2e2] text-[#991b1b]'
                            : note.category === 'Quality'
                            ? 'bg-[#e0e7ff] text-[#3730a3]'
                            : 'bg-[#e6f7f5] text-[#006a61]'
                        }`}
                      >
                        {note.category}
                      </span>
                      <span className="text-[#757682] font-mono">{note.timestamp}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#ba1a1a] hover:bg-red-50 p-0.5 rounded cursor-pointer transition-opacity"
                      title="Delete Note"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                  </div>

                  <p className="text-[#131b2e] leading-snug">{note.content}</p>

                  <div className="flex items-center justify-between text-[10px] text-[#757682] pt-0.5">
                    <span className="font-medium text-[#00236f]">{note.chainage}</span>
                    {note.photoUrl && (
                      <span className="text-[#006a61] flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">photo</span>
                        <span>Photo attached</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Permission boundary notice */}
          <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/40 text-[11px] space-y-1.5 mt-2">
            <div className="flex items-center gap-1.5 text-[#006a61] font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Supervisor Role Boundaries</span>
            </div>
            <p className="text-[#444651]">
              You can submit daily site reports, log field notes, and correct unapproved drafts.
            </p>
            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleDisallowedAction('approve AI match candidates')}
                className="text-[11px] text-[#757682] hover:text-[#ba1a1a] underline cursor-pointer"
              >
                Attempt Match Approval (Restricted)
              </button>
              <span className="text-[#c5c5d3]">•</span>
              <button
                type="button"
                onClick={() => handleDisallowedAction('modify project master schedule')}
                className="text-[11px] text-[#757682] hover:text-[#ba1a1a] underline cursor-pointer"
              >
                Modify Schedule (Restricted)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Modals */}
      <SupervisorReportDetailsModal
        report={selectedReportForDetails}
        onClose={() => setSelectedReportForDetails(null)}
        onEditDraft={(r) => setSelectedReportForEdit(r)}
        onSubmitDraft={handleSubmitDraft}
      />

      <SupervisorDraftEditModal
        report={selectedReportForEdit}
        isOpen={!!selectedReportForEdit}
        onClose={() => setSelectedReportForEdit(null)}
        onSave={handleSaveDraft}
      />

      <SupervisorQuickProgressModal
        isOpen={isQuickProgressModalOpen}
        onClose={() => setIsQuickProgressModalOpen(false)}
        onSubmit={handleAddQuickProgress}
      />
    </div>
  );
};
