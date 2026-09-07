import React, { useState } from 'react';
import { SupervisorReport, SupervisorFieldUpdate } from '../../types';
import { PRESET_FIELD_PHOTOS } from '../../data/supervisorMockData';

// 1. Report Details Modal
interface ReportDetailsModalProps {
  report: SupervisorReport | null;
  onClose: () => void;
  onEditDraft?: (report: SupervisorReport) => void;
  onSubmitDraft?: (reportId: string) => void;
}

export const SupervisorReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  onClose,
  onEditDraft,
  onSubmitDraft,
}) => {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-[#c5c5d3] overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#c5c5d3]/40 flex items-start justify-between bg-[#f8f9ff] shrink-0">
          <div className="space-y-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-label-caps text-[10px] uppercase font-bold text-[#006a61] tracking-wider px-2 py-0.5 rounded-full bg-[#e6f7f5] border border-[#bbf7d0]">
                Field Report Transmittal
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  report.status === 'Processed'
                    ? 'bg-[#e6f7f5] text-[#006a61] border border-[#bbf7d0]'
                    : report.status === 'Pending Verification'
                    ? 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]'
                    : 'bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    report.status === 'Processed'
                      ? 'bg-[#006a61]'
                      : report.status === 'Pending Verification'
                      ? 'bg-[#d97706]'
                      : 'bg-[#64748b]'
                  }`}
                />
                {report.status}
              </span>
            </div>
            <h3 className="font-headline-sm text-lg sm:text-xl text-[#131b2e] font-bold truncate">
              {report.fileName}
            </h3>
            <p className="text-[12px] text-[#757682]">
              Submitted by <strong className="text-[#131b2e]">{report.submittedBy}</strong> • {report.date} ({report.time}) • {report.fileSize}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#757682] hover:bg-[#eaedff] hover:text-[#131b2e] transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-[13px] text-[#131b2e]">
          {/* Top Key Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30">
              <span className="text-[10px] uppercase font-bold text-[#757682] block">Work Front</span>
              <span className="font-semibold text-[13px] text-[#131b2e] line-clamp-1">{report.workArea}</span>
            </div>
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30">
              <span className="text-[10px] uppercase font-bold text-[#757682] block">Chainage</span>
              <span className="font-semibold text-[13px] text-[#00236f]">{report.chainage}</span>
            </div>
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30">
              <span className="text-[10px] uppercase font-bold text-[#757682] block">Contractor</span>
              <span className="font-semibold text-[13px] text-[#131b2e] truncate block">{report.contractor}</span>
            </div>
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30">
              <span className="text-[10px] uppercase font-bold text-[#757682] block">Weather &amp; Shift</span>
              <span className="font-semibold text-[13px] text-[#006a61]">{report.temperature} • {report.shift}</span>
            </div>
          </div>

          {/* Quantities Extracted Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-headline-sm text-[13px] uppercase font-bold text-[#757682] tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#006a61]">straighten</span>
                <span>Reported Quantities &amp; Progress Updates ({report.quantities.length})</span>
              </h4>
              <span className="text-[11px] text-[#006a61] bg-[#e6f7f5] px-2 py-0.5 rounded-full font-semibold">
                {report.updatesCount} Total Updates
              </span>
            </div>

            <div className="border border-[#c5c5d3]/40 rounded-xl overflow-hidden divide-y divide-[#c5c5d3]/20">
              {report.quantities.map((q, idx) => (
                <div key={idx} className="p-3 hover:bg-[#f8f9ff] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-[14px] text-[#131b2e] flex items-center gap-2">
                      <span>{q.item}</span>
                      {q.matchConfidence && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#e6f7f5] text-[#006a61] font-bold">
                          {q.matchConfidence}% AI Match
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#757682] flex items-center gap-2 mt-0.5">
                      <span>{q.chainage || report.chainage}</span>
                      {q.matchActivity && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[#00236f]">{q.matchActivity}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="font-mono text-[16px] font-bold text-[#00236f]">
                      {q.quantity}
                    </span>
                    <span className="text-[12px] font-medium text-[#757682] ml-1">{q.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manpower & Equipment Deployment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 space-y-2">
              <div className="flex items-center justify-between text-[11px] uppercase font-bold text-[#757682]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">groups</span>
                  <span>Field Manpower</span>
                </span>
                <span className="text-[#006a61] font-mono">
                  {report.manpower.reduce((acc, m) => acc + m.count, 0)} Total
                </span>
              </div>
              <div className="space-y-1 text-[12px]">
                {report.manpower.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[#444651]">
                    <span>{m.trade}</span>
                    <span className="font-mono font-bold text-[#131b2e]">{m.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 space-y-2">
              <div className="flex items-center justify-between text-[11px] uppercase font-bold text-[#757682]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">construction</span>
                  <span>Heavy Equipment</span>
                </span>
                <span className="text-[#00236f] font-mono">
                  {report.equipment.reduce((acc, e) => acc + e.count, 0)} Units
                </span>
              </div>
              <div className="space-y-1 text-[12px]">
                {report.equipment.map((e, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[#444651]">
                    <span>{e.name}</span>
                    <span className="font-mono font-bold text-[#131b2e]">{e.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supervisor Field Notes */}
          {report.notes && (
            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 space-y-1">
              <span className="text-[11px] uppercase font-bold text-[#757682] block flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#006a61]">description</span>
                <span>Supervisor Remarks / Notes</span>
              </span>
              <p className="text-[12.5px] text-[#444651] leading-relaxed italic">
                &ldquo;{report.notes}&rdquo;
              </p>
            </div>
          )}

          {/* Attached Field Photos Gallery */}
          {report.photos && report.photos.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-headline-sm text-[13px] uppercase font-bold text-[#757682] tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#006a61]">photo_library</span>
                <span>Attached Inspection Photos ({report.photos.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhoto(photo.url)}
                    className="border border-[#c5c5d3]/40 rounded-xl overflow-hidden group cursor-pointer hover:border-[#006a61] transition-all bg-[#f8f9ff]"
                  >
                    <div className="h-36 overflow-hidden bg-black/5 relative">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">zoom_in</span> Click to enlarge
                      </span>
                    </div>
                    <div className="p-2.5 text-[11px] space-y-0.5">
                      <p className="font-medium text-[#131b2e] line-clamp-1">{photo.caption}</p>
                      <div className="flex items-center justify-between text-[#757682] text-[10px]">
                        <span className="font-mono truncate">{photo.geotag}</span>
                        <span>{photo.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ingestion Pipeline Audit */}
          <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 space-y-2">
            <span className="text-[11px] uppercase font-bold text-[#757682] block flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">history</span>
              <span>Processing Status &amp; Audit Trail</span>
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-[#006a61]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  <span>Document uploaded and checksum verified</span>
                </span>
                <span className="font-mono text-[10px]">{report.time}</span>
              </div>
              <div className="flex items-center justify-between text-[#006a61]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  <span>WBS OCR parsing &amp; quantity extraction</span>
                </span>
                <span className="font-mono text-[10px]">Auto-completed</span>
              </div>
              <div className="flex items-center justify-between text-[#444651]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">
                    {report.status === 'Processed' ? 'check_circle' : 'pending'}
                  </span>
                  <span>
                    {report.status === 'Processed'
                      ? 'Planner baseline match synchronized into Primavera P6'
                      : 'Pending final review in Project Planner review queue'}
                  </span>
                </span>
                <span className="font-mono text-[10px]">
                  {report.status === 'Processed' ? 'P6 Sync OK' : 'Queue Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#c5c5d3]/40 bg-[#f8f9ff] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {report.status !== 'Processed' && onEditDraft && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditDraft(report);
                }}
                className="px-4 py-2 rounded-xl bg-white border border-[#c5c5d3] hover:border-[#006a61] text-[#006a61] text-[13px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">edit_document</span>
                <span>Edit / Correct Draft</span>
              </button>
            )}

            {report.status === 'Draft' && onSubmitDraft && (
              <button
                type="button"
                onClick={() => {
                  onSubmitDraft(report.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#006a61] hover:bg-[#005049] text-white text-[13px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Submit for AI Verification</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#e2e7ff] hover:bg-[#d0d7ff] text-[#00236f] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {/* Lightbox for photo inspection */}
      {activePhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={activePhoto}
              alt="Enlarged field inspection photo"
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/20"
            />
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Draft Edit / Correction Modal
interface DraftEditModalProps {
  report: SupervisorReport | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedReport: SupervisorReport, submitNow: boolean) => void;
}

export const SupervisorDraftEditModal: React.FC<DraftEditModalProps> = ({
  report,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !report) return null;

  const [workArea, setWorkArea] = useState(report.workArea);
  const [chainage, setChainage] = useState(report.chainage);
  const [contractor, setContractor] = useState(report.contractor);
  const [weather, setWeather] = useState(report.weather);
  const [temperature, setTemperature] = useState(report.temperature);
  const [notes, setNotes] = useState(report.notes || '');
  const [quantities, setQuantities] = useState(report.quantities || []);

  const handleUpdateQuantity = (index: number, newQty: string) => {
    const updated = [...quantities];
    updated[index] = { ...updated[index], quantity: newQty };
    setQuantities(updated);
  };

  const handleAddQuantityRow = () => {
    setQuantities([
      ...quantities,
      {
        item: 'Pipeline Trench Excavation',
        quantity: '100',
        unit: 'm',
        chainage: chainage,
        matchConfidence: 94.0,
      },
    ]);
  };

  const handleRemoveQuantityRow = (index: number) => {
    setQuantities(quantities.filter((_, i) => i !== index));
  };

  const handleSubmit = (submitNow: boolean) => {
    const updated: SupervisorReport = {
      ...report,
      workArea,
      chainage,
      contractor,
      weather,
      temperature,
      notes,
      quantities,
      status: submitNow ? 'Pending Verification' : report.status,
    };
    onSave(updated, submitNow);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-[#c5c5d3] overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-5 border-b border-[#c5c5d3]/40 flex items-center justify-between bg-[#f8f9ff] shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#006a61] bg-[#e6f7f5] px-2 py-0.5 rounded-full font-label-caps">
              Supervisor Correction Mode
            </span>
            <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold mt-1">
              Correct Draft: {report.fileName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#757682] hover:bg-[#eaedff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-[13px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
                Work Area / Front
              </label>
              <input
                type="text"
                value={workArea}
                onChange={(e) => setWorkArea(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
                Chainage Corridor
              </label>
              <input
                type="text"
                value={chainage}
                onChange={(e) => setChainage(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
                Contractor
              </label>
              <input
                type="text"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
                Weather
              </label>
              <input
                type="text"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
                Temp
              </label>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
              />
            </div>
          </div>

          {/* Quantities Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase text-[#757682]">
                Reported Quantities
              </label>
              <button
                type="button"
                onClick={handleAddQuantityRow}
                className="text-[11px] text-[#006a61] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">add</span> Add Item
              </button>
            </div>

            <div className="border border-[#c5c5d3]/40 rounded-xl overflow-hidden divide-y divide-[#c5c5d3]/20 bg-[#f8f9ff]">
              {quantities.map((q, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-[13px] block truncate">{q.item}</span>
                    <span className="text-[11px] text-[#757682]">{q.chainage || chainage}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="text"
                      value={q.quantity}
                      onChange={(e) => handleUpdateQuantity(idx, e.target.value)}
                      className="w-20 h-8 px-2 text-right rounded border border-[#c5c5d3] text-[13px] font-mono bg-white text-[#131b2e] focus:outline-none focus:border-[#006a61]"
                    />
                    <span className="text-[12px] text-[#757682] w-8">{q.unit}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuantityRow(idx)}
                      className="text-[#ba1a1a] hover:bg-red-50 p-1 rounded cursor-pointer"
                      title="Remove"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
              Field Notes / Corrections
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
            />
          </div>
        </div>

        <div className="p-4 border-t border-[#c5c5d3]/40 bg-[#f8f9ff] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[#757682] hover:bg-[#eaedff] text-[13px] font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 rounded-xl bg-white border border-[#c5c5d3] hover:border-[#006a61] text-[#006a61] text-[13px] font-semibold cursor-pointer"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-5 py-2 rounded-xl bg-[#006a61] hover:bg-[#005049] text-white text-[13px] font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Submit for Verification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Quick Field Progress Log Modal
interface QuickProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (update: Partial<SupervisorFieldUpdate>) => void;
}

export const SupervisorQuickProgressModal: React.FC<QuickProgressModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [activity, setActivity] = useState('Pipeline Trench Excavation');
  const [chainage, setChainage] = useState('KP 12+400 to KP 12+850');
  const [quantity, setQuantity] = useState('150');
  const [unit, setUnit] = useState('meters');
  const [trade, setTrade] = useState('Earthwork / Excavation');
  const [contractor, setContractor] = useState('Kalpataru Field Ops');
  const [photoCaption, setPhotoCaption] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      activityName: activity,
      chainage,
      quantity,
      unit,
      trade,
      contractor,
      activityId: 'L6-PIPE-EXC-042',
      workPackage: 'Pipeline → Trench Excavation',
      status: 'Approved into P6',
      confidence: 96.0,
      timestamp: 'Just now',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-[#c5c5d3] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-5 border-b border-[#c5c5d3]/40 flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#e6f7f5] text-[#006a61] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add_task</span>
            </span>
            <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Log Field Progress Check
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#757682] hover:bg-[#eaedff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-[13px]">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
              Field Activity / Trade
            </label>
            <select
              value={activity}
              onChange={(e) => {
                setActivity(e.target.value);
                if (e.target.value.includes('Concrete')) {
                  setUnit('m³');
                  setTrade('Civil / Concrete');
                } else if (e.target.value.includes('Welding')) {
                  setUnit('joints');
                  setTrade('Welding (6G)');
                } else {
                  setUnit('meters');
                  setTrade('Earthwork / Excavation');
                }
              }}
              className="w-full h-9 px-3 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
            >
              <option value="Pipeline Trench Excavation">Pipeline Trench Excavation (L6-PIPE-EXC-042)</option>
              <option value="Trench Bedding & Padding">Trench Bedding & Padding (L6-TRENCH-BED-015)</option>
              <option value="Pipe Stringing & Placement">Pipe Stringing & Placement (L6-PIPE-STR-015)</option>
              <option value="Butt Weld Inspection (NDT)">Butt Weld Inspection (L5-WELD-MAIN-004)</option>
              <option value="Compressor Foundation Pour">Compressor Foundation Concrete (L4-CIV-COMP-012)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
                Quantity Completed
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61] font-mono font-bold"
                />
                <span className="text-[12px] text-[#757682] shrink-0 font-medium">{unit}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
                Contractor on Shift
              </label>
              <select
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
              >
                <option value="Kalpataru Field Ops">Kalpataru Field Ops</option>
                <option value="ABC Engineering">ABC Engineering</option>
                <option value="Assam In-House Civil Team">Assam In-House Civil Team</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
              Chainage / Station
            </label>
            <input
              type="text"
              required
              value={chainage}
              onChange={(e) => setChainage(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1">
              Field Verification Observation
            </label>
            <input
              type="text"
              placeholder="e.g. Survey prism verified depth 2.1m. Zero deviations recorded."
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#c5c5d3]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#757682] hover:bg-[#eaedff] text-[13px] font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#006a61] hover:bg-[#005049] text-white text-[13px] font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Log Field Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
