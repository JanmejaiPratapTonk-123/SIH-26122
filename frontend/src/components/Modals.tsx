import React, { useState } from 'react';
import { SiteReport, NeedsAttentionItem } from '../types';

interface ToastProps {
  toast: {
    title: string;
    message: string;
    icon?: string;
    isError?: boolean;
  } | null;
  onClose: () => void;
}

export const ToastBanner: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-md p-4 bg-[#283044] text-[#eef0ff] rounded-xl shadow-xl flex items-center gap-3 transform transition-all duration-300 z-50 animate-in fade-in slide-in-from-bottom-4 border border-[#757682]/40">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          toast.isError
            ? 'bg-[#ffdad6] text-[#93000a]'
            : 'bg-[#86f2e4] text-[#006f66]'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {toast.icon || (toast.isError ? 'close' : 'done')}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-headline-sm text-[13px] font-bold text-white">
          {toast.title}
        </div>
        <div className="font-body-sm text-[12px] text-[#c5c5d3] truncate">
          {toast.message}
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded text-[#c5c5d3] hover:text-white transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReport: (report: SiteReport) => void;
  onShowToast: (title: string, message: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddReport,
  onShowToast,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Select or drop site report');

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    setProcessing(true);
    setStatusMsg(`Ingesting ${file.name}...`);

    setTimeout(() => {
      setStatusMsg(`Matching entities against Primavera P6 baseline...`);
      setTimeout(() => {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const type: 'pdf' | 'xlsx' | 'csv' =
          fileExt === 'xlsx' || fileExt === 'xls' ? 'xlsx' : fileExt === 'csv' ? 'csv' : 'pdf';

        const newReport: SiteReport = {
          id: `rep-${Date.now()}`,
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          fileType: type,
          submittedBy: 'Field Engineer (Site Direct)',
          role: 'Operations & QA',
          date: 'Today',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Processed',
          updatesFound: 24,
        };

        onAddReport(newReport);
        setProcessing(false);
        onShowToast('Report Processed!', `${file.name} successfully analyzed (24 updates found).`);
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#c5c5d3] overflow-hidden">
        <div className="p-4 border-b border-[#c5c5d3]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00236f] text-[20px]">
              cloud_upload
            </span>
            <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Upload Daily Site Report
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="p-1 rounded text-[#757682] hover:bg-[#eaedff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragOver ? 'border-[#00236f] bg-[#e2e7ff]' : 'border-[#c5c5d3] hover:border-[#00236f]'
            }`}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf,.xlsx,.xls,.csv';
              input.onchange = (e: any) => {
                if (e.target.files[0]) handleFile(e.target.files[0]);
              };
              input.click();
            }}
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#00236f] mb-3">
              {processing ? (
                <span className="material-symbols-outlined text-[32px] animate-spin">
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined text-[32px]">upload_file</span>
              )}
            </div>
            <h4 className="font-headline-sm text-[16px] text-[#131b2e] font-semibold mb-1">
              {statusMsg}
            </h4>
            <p className="text-[12px] text-[#444651]">
              Supported files: PDF DPRs, Excel WBS trackers (.xlsx), or shift logs (.csv)
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between text-[12px] text-[#757682]">
            <span>OCR &amp; WBS Table Parser v4.2</span>
            <span>Target: Duliajan Gas Compression</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReportDetailsModalProps {
  report: SiteReport | null;
  onClose: () => void;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-[#c5c5d3] overflow-hidden">
        <div className="p-4 border-b border-[#c5c5d3]/40 flex items-center justify-between bg-[#f2f3ff]">
          <div>
            <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold truncate">
              {report.fileName}
            </h3>
            <p className="text-[12px] text-[#757682]">
              Submitted by {report.submittedBy} ({report.role}) • {report.date} at {report.time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#757682] hover:bg-[#eaedff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded bg-[#f2f3ff] border border-[#c5c5d3]/30">
              <span className="text-[10px] uppercase font-bold text-[#757682] block">
                Total Updates
              </span>
              <span className="text-[18px] font-bold text-[#00236f] font-mono">
                {report.updatesFound}
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#f2f3ff] border border-[#c5c5d3]/30">
              <span className="text-[10px] uppercase font-bold text-[#006a61] block">
                Auto-Matched
              </span>
              <span className="text-[18px] font-bold text-[#006a61] font-mono">
                {report.updatesFound - (report.reviewCount || 0)}
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#f2f3ff] border border-[#c5c5d3]/30">
              <span className="text-[10px] uppercase font-bold text-[#ba1a1a] block">
                Pending Review
              </span>
              <span className="text-[18px] font-bold text-[#ba1a1a] font-mono">
                {report.reviewCount || 0}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[12px] font-bold uppercase text-[#757682] tracking-wider">
              Ingested Work Packages
            </h4>
            <div className="space-y-1.5 text-[13px] text-[#131b2e]">
              <div className="p-2.5 rounded bg-[#f2f3ff]/60 border border-[#c5c5d3]/30 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Pipeline Corridor Trenching &amp; Bedding</div>
                  <div className="text-[11px] text-[#757682]">KP 12+400 to KP 12+850 • 450 meters</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#86f2e4] text-[#006f66] font-mono text-[10px] font-semibold">
                  96.8% Match
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#f2f3ff]/60 border border-[#c5c5d3]/30 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Compressor Foundation Concrete Batching</div>
                  <div className="text-[11px] text-[#757682]">Block TB-02 • 180 m³ M35 pour</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#86f2e4] text-[#006f66] font-mono text-[10px] font-semibold">
                  94.2% Match
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#f2f3ff]/60 border border-[#c5c5d3]/30 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Radiographic Inspection of Butt Welds</div>
                  <div className="text-[11px] text-[#757682]">Joints W-104 to W-135 • 32 welds</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#86f2e4] text-[#006f66] font-mono text-[10px] font-semibold">
                  98.1% Match
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded bg-[#00236f] text-white text-[13px] font-semibold hover:bg-[#1e3a8a] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NeedsAttentionModalProps {
  item: NeedsAttentionItem | null;
  onClose: () => void;
  onTakeAction: (msg: string) => void;
}

export const NeedsAttentionModal: React.FC<NeedsAttentionModalProps> = ({
  item,
  onClose,
  onTakeAction,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#c5c5d3] overflow-hidden">
        <div className="p-4 border-b border-[#c5c5d3]/40 flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
            <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Critical Risk Item: {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#757682] hover:bg-[#eaedff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-3 bg-[#ffdad6]/40 rounded-lg border border-[#ffdad6] text-[13px] text-[#93000a]">
            <strong>Warning:</strong> {item.subtitle} at {item.location}. Impact on project critical
            path: +4.5 days schedule variance.
          </div>

          <div className="space-y-2 text-[13px]">
            <h4 className="font-bold text-[#131b2e]">Root Cause Analysis:</h4>
            <p className="text-[#444651] leading-relaxed">
              Subcontractor Kalpataru reported delayed delivery of hydraulic shoring boxes and
              sub-surface groundwater seepage after unexpected heavy rainfall in the Assam sector.
            </p>

            <h4 className="font-bold text-[#131b2e] pt-2">Recommended Recovery Actions:</h4>
            <ul className="list-disc pl-5 space-y-1 text-[#444651]">
              <li>Authorize 2nd dewatering pump battery deployment to trench segment.</li>
              <li>Re-sequence foundation rebar cages pre-assembly in offsite fabrication yard.</li>
              <li>Issue formal schedule acceleration notice to contractor project manager.</li>
            </ul>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#c5c5d3]/30">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded bg-[#f2f3ff] text-[#444651] text-[13px] hover:bg-[#eaedff] cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                onTakeAction(`Mitigation task created for ${item.title}`);
                onClose();
              }}
              className="h-9 px-4 rounded bg-[#00236f] text-white text-[13px] font-semibold hover:bg-[#1e3a8a] cursor-pointer"
            >
              Issue Mitigation Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ConfigureIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, msg: string) => void;
}

export const ConfigureIntegrationsModal: React.FC<ConfigureIntegrationsModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [syncFreq, setSyncFreq] = useState('Hourly');
  const [p6Status, setP6Status] = useState(true);
  const [aconexStatus, setAconexStatus] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-[#c5c5d3] overflow-hidden">
        <div className="p-4 border-b border-[#c5c5d3]/40 flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00236f] text-[20px]">
              integration_instructions
            </span>
            <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Project Enterprise Integrations
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#757682] hover:bg-[#eaedff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4 text-[13px]">
          {/* Primavera P6 */}
          <div className="p-3 rounded-lg border border-[#c5c5d3]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#e2e7ff] text-[#00236f] flex items-center justify-center font-bold">
                P6
              </div>
              <div>
                <div className="font-semibold text-[#131b2e]">Oracle Primavera P6 EPPM</div>
                <div className="text-[11px] text-[#757682]">
                  Endpoint: https://p6.oilindia.internal/api/v1 • Baseline: BL-AUG-2026
                </div>
              </div>
            </div>
            <button
              onClick={() => setP6Status(!p6Status)}
              className={`px-3 py-1 rounded text-[11px] font-bold font-mono ${
                p6Status ? 'bg-[#86f2e4] text-[#006f66]' : 'bg-[#eaedff] text-[#757682]'
              }`}
            >
              {p6Status ? 'CONNECTED' : 'DISCONNECTED'}
            </button>
          </div>

          {/* Oracle Aconex */}
          <div className="p-3 rounded-lg border border-[#c5c5d3]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#86f2e4]/30 text-[#006a61] flex items-center justify-center font-bold">
                AC
              </div>
              <div>
                <div className="font-semibold text-[#131b2e]">Oracle Aconex Document Intake</div>
                <div className="text-[11px] text-[#757682]">
                  Workspace: OIL-DULIAJAN-EPC • Auto-fetch daily transmittals
                </div>
              </div>
            </div>
            <button
              onClick={() => setAconexStatus(!aconexStatus)}
              className={`px-3 py-1 rounded text-[11px] font-bold font-mono ${
                aconexStatus ? 'bg-[#86f2e4] text-[#006f66]' : 'bg-[#eaedff] text-[#757682]'
              }`}
            >
              {aconexStatus ? 'CONNECTED' : 'DISCONNECTED'}
            </button>
          </div>

          {/* Sync Frequency */}
          <div className="pt-2">
            <label className="block font-semibold text-[#131b2e] mb-1">
              Automated Ingestion Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Realtime Webhook', 'Hourly', 'Daily at 18:00'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSyncFreq(opt)}
                  className={`p-2 rounded border text-center transition-colors cursor-pointer ${
                    syncFreq === opt
                      ? 'border-[#00236f] bg-[#e2e7ff] text-[#00236f] font-semibold'
                      : 'border-[#c5c5d3] text-[#444651]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#c5c5d3]/30">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded bg-[#f2f3ff] text-[#444651] text-[13px] hover:bg-[#eaedff] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onShowToast(
                  'Integrations Configured',
                  `Primavera P6 & Aconex settings saved (${syncFreq}).`
                );
                onClose();
              }}
              className="h-9 px-4 rounded bg-[#00236f] text-white text-[13px] font-semibold hover:bg-[#1e3a8a] cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
