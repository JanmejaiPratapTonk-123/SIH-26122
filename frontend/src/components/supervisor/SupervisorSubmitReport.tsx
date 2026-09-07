import React, { useState } from 'react';
import { SupervisorReport } from '../../types';
import { SUPERVISOR_WORK_AREAS, PRESET_FIELD_PHOTOS } from '../../data/supervisorMockData';

interface SupervisorSubmitReportProps {
  onAddReport: (report: SupervisorReport, submitToLedger?: boolean) => void;
  onShowToast: (title: string, message: string, icon?: string, isError?: boolean) => void;
  onNavigateToReports: () => void;
}

export const SupervisorSubmitReport: React.FC<SupervisorSubmitReportProps> = ({
  onAddReport,
  onShowToast,
  onNavigateToReports,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'upload'>('form');

  // Form states
  const [fileName, setFileName] = useState(`DPR_${new Date().getDate()}_Sep_2026.pdf`);
  const [workArea, setWorkArea] = useState(SUPERVISOR_WORK_AREAS[0]);
  const [chainage, setChainage] = useState('KP 12+400 – KP 14+000');
  const [contractor, setContractor] = useState('Kalpataru Field Ops');
  const [shift, setShift] = useState('Day Shift #1');
  const [weather, setWeather] = useState('Overcast (Trenching Safe)');
  const [temperature, setTemperature] = useState('28°C');
  const [notes, setNotes] = useState('');

  // Dynamic Quantities
  const [quantities, setQuantities] = useState<
    { item: string; quantity: string; unit: string; chainage: string }[]
  >([
    {
      item: 'Pipeline Trench Excavation',
      quantity: '380',
      unit: 'm',
      chainage: 'KP 12+400 to KP 12+780',
    },
    {
      item: 'Trench Sand Bedding & Padding',
      quantity: '260',
      unit: 'm',
      chainage: 'KP 12+400 to KP 12+660',
    },
  ]);

  // Manpower
  const [welders, setWelders] = useState(6);
  const [operators, setOperators] = useState(4);
  const [riggers, setRiggers] = useState(8);
  const [laborers, setLaborers] = useState(12);

  // Equipment
  const [excavators, setExcavators] = useState(3);
  const [sidebooms, setSidebooms] = useState(2);
  const [compactors, setCompactors] = useState(1);

  // Attached Photos
  const [attachedPhotos, setAttachedPhotos] = useState<typeof PRESET_FIELD_PHOTOS>([
    PRESET_FIELD_PHOTOS[0],
  ]);

  // Upload Tab States
  const [dragOver, setDragOver] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('Drag & drop daily progress report or click to browse');

  const handleAddQuantityRow = () => {
    setQuantities((prev) => [
      ...prev,
      {
        item: 'Pipe Stringing & Placement',
        quantity: '200',
        unit: 'm',
        chainage: chainage,
      },
    ]);
  };

  const handleRemoveQuantityRow = (index: number) => {
    setQuantities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index: number, field: string, value: string) => {
    setQuantities((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleTogglePhoto = (photo: (typeof PRESET_FIELD_PHOTOS)[0]) => {
    if (attachedPhotos.some((p) => p.url === photo.url)) {
      setAttachedPhotos((prev) => prev.filter((p) => p.url !== photo.url));
    } else {
      setAttachedPhotos((prev) => [...prev, photo]);
    }
  };

  const handleFormSubmit = (asDraft: boolean) => {
    if (!fileName.trim()) {
      onShowToast('Validation Error', 'Please enter a report document name.', 'warning', true);
      return;
    }

    const newReport: SupervisorReport = {
      id: `rep-sup-${Date.now()}`,
      fileName: fileName.endsWith('.pdf') || fileName.endsWith('.xlsx') || fileName.endsWith('.csv')
        ? fileName
        : `${fileName}.pdf`,
      fileSize: '3.2 MB',
      fileType: fileName.endsWith('.xlsx') ? 'xlsx' : fileName.endsWith('.csv') ? 'csv' : 'pdf',
      workArea,
      chainage,
      submittedBy: 'R. Sharma',
      role: 'Site Supervisor',
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: asDraft ? 'Draft' : 'Pending Verification',
      updatesCount: quantities.length * 9,
      contractor,
      weather,
      temperature,
      shift,
      manpower: [
        { trade: 'Pipeline Welder (6G)', count: welders },
        { trade: 'Equipment Operator', count: operators },
        { trade: 'Rigger / Pipe Fitter', count: riggers },
        { trade: 'General Civil Labor', count: laborers },
      ],
      equipment: [
        { name: 'CAT 320D Excavator', count: excavators },
        { name: 'Komatsu Sideboom D85C', count: sidebooms },
        { name: 'Vibratory Soil Compactor', count: compactors },
      ],
      quantities: quantities.map((q) => ({
        ...q,
        matchConfidence: 95.5,
      })),
      photos: attachedPhotos.map((p) => ({
        ...p,
        timestamp: 'Just now',
      })),
      notes: notes.trim() || 'Daily field progress report compiled from active supervisor log.',
    };

    onAddReport(newReport, !asDraft);
    onShowToast(
      asDraft ? 'Draft Saved' : 'Report Submitted for Verification',
      asDraft
        ? `${newReport.fileName} saved to your drafts. You can edit before submitting.`
        : `${newReport.fileName} submitted to Project Planner review pipeline.`,
      asDraft ? 'save' : 'task_alt'
    );
    onNavigateToReports();
  };

  const handleFileUpload = (file: File) => {
    setIsProcessingUpload(true);
    setUploadStatus(`Analyzing ${file.name} with OCR table parser...`);

    setTimeout(() => {
      setUploadStatus('Extracting chainages, quantities, and matching against P6 baseline...');
      setTimeout(() => {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const type: 'pdf' | 'xlsx' | 'csv' =
          fileExt === 'xlsx' || fileExt === 'xls' ? 'xlsx' : fileExt === 'csv' ? 'csv' : 'pdf';

        const newReport: SupervisorReport = {
          id: `rep-sup-${Date.now()}`,
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          fileType: type,
          workArea: 'Duliajan Main Pipeline Sector B (KP 12+400)',
          chainage: 'KP 12+400 – KP 14+000',
          submittedBy: 'R. Sharma',
          role: 'Site Supervisor',
          date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Processed',
          updatesCount: 26,
          contractor: 'Kalpataru Field Ops',
          weather: 'Overcast (Trenching Safe)',
          temperature: '28°C',
          shift: 'Day Shift #1',
          manpower: [
            { trade: 'Pipeline Welder (6G)', count: 8 },
            { trade: 'Excavator Operator', count: 4 },
            { trade: 'Civil Labor', count: 16 },
          ],
          equipment: [
            { name: 'CAT 320D Excavator', count: 4 },
            { name: 'Komatsu Sideboom D85C', count: 2 },
          ],
          quantities: [
            {
              item: 'Pipeline Trench Excavation',
              quantity: '420',
              unit: 'm',
              chainage: 'KP 12+400 to KP 12+820',
              matchActivity: 'L6-PIPE-EXC-042',
              matchConfidence: 96.4,
            },
            {
              item: 'Trench Sand Bedding & Padding',
              quantity: '290',
              unit: 'm',
              chainage: 'KP 12+400 to KP 12+690',
              matchActivity: 'L6-TRENCH-BED-015',
              matchConfidence: 95.0,
            },
          ],
          photos: [{ ...PRESET_FIELD_PHOTOS[0], timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
          notes: `Uploaded direct field transmittal: ${file.name}. OCR parsing completed with 26 updates extracted.`,
        };

        setIsProcessingUpload(false);
        onAddReport(newReport, true);
        onShowToast(
          'Document Processed',
          `${file.name} successfully analyzed and registered in site ledger.`,
          'cloud_done'
        );
        onNavigateToReports();
      }, 1200);
    }, 1000);
  };

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
              Daily Shift Transmittal
            </span>
          </div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight mt-1">
            Submit Site Report
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#444651] mt-0.5">
            Log field progress, work quantities, manpower, and inspection photos from the active shift.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Method Tabs */}
          <div className="bg-[#f8f9ff] p-1 rounded-xl border border-[#c5c5d3]/40 flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-white text-[#006a61] shadow-xs'
                  : 'text-[#757682] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>Daily DPR Form</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-[#006a61] shadow-xs'
                  : 'text-[#757682] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Interactive Field DPR Form */}
      {activeTab === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Form Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* 1. Header Information */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c5c5d3]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-3">
                <h2 className="font-headline-sm text-[15px] font-bold text-[#131b2e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#006a61]">assignment</span>
                  <span>Shift &amp; Front Specifications</span>
                </h2>
                <span className="text-[11px] text-[#757682]">Required for AI Baseline Matching</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1.5">
                    Report File / Transmittal Name
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1.5">
                    Work Area / Front
                  </label>
                  <select
                    value={workArea}
                    onChange={(e) => setWorkArea(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
                  >
                    {SUPERVISOR_WORK_AREAS.map((area, idx) => (
                      <option key={idx} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1.5">
                    Active Chainage Corridor
                  </label>
                  <input
                    type="text"
                    value={chainage}
                    onChange={(e) => setChainage(e.target.value)}
                    placeholder="e.g. KP 12+400 – KP 14+000"
                    className="w-full h-10 px-3 rounded-xl border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1.5">
                    Subcontractor on Duty
                  </label>
                  <select
                    value={contractor}
                    onChange={(e) => setContractor(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
                  >
                    <option value="Kalpataru Field Ops">Kalpataru Field Ops (Package #C-04)</option>
                    <option value="ABC Engineering">ABC Engineering (Turnkey Pipeline)</option>
                    <option value="In-House Assam Ops">In-House Assam Ops Team</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1.5">
                    Shift Type
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
                  >
                    <option value="Day Shift #1">Day Shift #1 (06:00 – 18:00)</option>
                    <option value="Night Shift Pour">Night Shift Pour (18:00 – 06:00)</option>
                    <option value="Morning Tie-in Slot">Morning Tie-in Slot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1.5">
                    Weather Condition
                  </label>
                  <input
                    type="text"
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#757682] mb-1.5">
                    Ambient Temperature
                  </label>
                  <input
                    type="text"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Work Quantities Executed */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c5c5d3]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-3">
                <div>
                  <h2 className="font-headline-sm text-[15px] font-bold text-[#131b2e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#006a61]">straighten</span>
                    <span>Work Quantities Executed Today</span>
                  </h2>
                  <p className="text-[12px] text-[#757682]">
                    Add line items for excavation, bedding, pipe stringing, and welding
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddQuantityRow}
                  className="h-9 px-3 rounded-xl bg-[#e6f7f5] hover:bg-[#cbf1ec] text-[#006a61] text-[12px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>+ Add Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {quantities.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/40 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                  >
                    <div className="flex-1 w-full min-w-0 space-y-1">
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => handleUpdateQuantity(idx, 'item', e.target.value)}
                        placeholder="Item description (e.g. Pipeline Trench Excavation)"
                        className="w-full h-8 px-2.5 rounded-lg border border-[#c5c5d3] text-[13px] bg-white font-medium text-[#131b2e] focus:outline-none focus:border-[#006a61]"
                      />
                      <input
                        type="text"
                        value={item.chainage}
                        onChange={(e) => handleUpdateQuantity(idx, 'chainage', e.target.value)}
                        placeholder="Chainage coverage (e.g. KP 12+400 to KP 12+780)"
                        className="w-full h-7 px-2.5 rounded-lg border border-[#c5c5d3]/60 text-[11px] bg-white text-[#757682] focus:outline-none focus:border-[#006a61]"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(idx, 'quantity', e.target.value)}
                        placeholder="Qty"
                        className="w-20 h-8 px-2.5 rounded-lg border border-[#c5c5d3] text-[13px] font-mono font-bold text-[#00236f] bg-white text-right focus:outline-none focus:border-[#006a61]"
                      />
                      <select
                        value={item.unit}
                        onChange={(e) => handleUpdateQuantity(idx, 'unit', e.target.value)}
                        className="h-8 px-2 rounded-lg border border-[#c5c5d3] text-[12px] bg-white text-[#444651] focus:outline-none focus:border-[#006a61]"
                      >
                        <option value="m">m</option>
                        <option value="m³">m³</option>
                        <option value="joints">joints</option>
                        <option value="MT">MT</option>
                        <option value="spools">spools</option>
                      </select>

                      {quantities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuantityRow(idx)}
                          className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-red-50 cursor-pointer"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Manpower & Equipment Deployment */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c5c5d3]/40 shadow-xs space-y-4">
              <h2 className="font-headline-sm text-[15px] font-bold text-[#131b2e] flex items-center gap-2 border-b border-[#c5c5d3]/30 pb-3">
                <span className="material-symbols-outlined text-[18px] text-[#006a61]">engineering</span>
                <span>Manpower &amp; Equipment Headcount</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 text-center">
                  <span className="text-[10px] uppercase font-bold text-[#757682] block">6G Welders</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setWelders(Math.max(0, welders - 1))}
                      className="w-6 h-6 rounded bg-white border border-[#c5c5d3] text-[13px] font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-[16px] text-[#131b2e] w-6">{welders}</span>
                    <button
                      type="button"
                      onClick={() => setWelders(welders + 1)}
                      className="w-6 h-6 rounded bg-white border border-[#c5c5d3] text-[13px] font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 text-center">
                  <span className="text-[10px] uppercase font-bold text-[#757682] block">Operators</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setOperators(Math.max(0, operators - 1))}
                      className="w-6 h-6 rounded bg-white border border-[#c5c5d3] text-[13px] font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-[16px] text-[#131b2e] w-6">{operators}</span>
                    <button
                      type="button"
                      onClick={() => setOperators(operators + 1)}
                      className="w-6 h-6 rounded bg-white border border-[#c5c5d3] text-[13px] font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 text-center">
                  <span className="text-[10px] uppercase font-bold text-[#757682] block">Riggers/Fitters</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setRiggers(Math.max(0, riggers - 1))}
                      className="w-6 h-6 rounded bg-white border border-[#c5c5d3] text-[13px] font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-[16px] text-[#131b2e] w-6">{riggers}</span>
                    <button
                      type="button"
                      onClick={() => setRiggers(riggers + 1)}
                      className="w-6 h-6 rounded bg-white border border-[#c5c5d3] text-[13px] font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 text-center">
                  <span className="text-[10px] uppercase font-bold text-[#757682] block">Civil Laborers</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setLaborers(Math.max(0, laborers - 1))}
                      className="w-6 h-6 rounded bg-white border border-[#c5c5d3] text-[13px] font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-[16px] text-[#131b2e] w-6">{laborers}</span>
                    <button
                      type="button"
                      onClick={() => setLaborers(laborers + 1)}
                      className="w-6 h-6 rounded bg-white border border-[#c5c5d3] text-[13px] font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Machinery deployment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center justify-between p-2.5 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 text-[12px]">
                  <span className="text-[#444651] font-medium">Excavators</span>
                  <span className="font-mono font-bold text-[#131b2e]">{excavators} active</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 text-[12px]">
                  <span className="text-[#444651] font-medium">Sidebooms</span>
                  <span className="font-mono font-bold text-[#131b2e]">{sidebooms} active</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 text-[12px]">
                  <span className="text-[#444651] font-medium">Compactors</span>
                  <span className="font-mono font-bold text-[#131b2e]">{compactors} active</span>
                </div>
              </div>
            </div>

            {/* 4. Notes & Observations */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c5c5d3]/40 shadow-xs space-y-3">
              <h2 className="font-headline-sm text-[15px] font-bold text-[#131b2e] flex items-center gap-2 border-b border-[#c5c5d3]/30 pb-2">
                <span className="material-symbols-outlined text-[18px] text-[#006a61]">notes</span>
                <span>Shift Observations &amp; Safety Remarks</span>
              </h2>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document ground conditions, survey benchmarks, safety toolbox meetings, or delays (e.g., dewatering pump required at KP 12+600)..."
                className="w-full p-3 rounded-xl border border-[#c5c5d3] text-[13px] bg-[#f8f9ff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a61]"
              />
            </div>
          </div>

          {/* Right Col: Field Photo Attachments & Submit Actions */}
          <div className="space-y-5">
            {/* Field Photos Picker */}
            <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#c5c5d3]/30 pb-2">
                <h3 className="font-headline-sm text-[14px] font-bold text-[#131b2e] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#006a61]">camera_alt</span>
                  <span>Attach Site Photos ({attachedPhotos.length})</span>
                </h3>
                <span className="text-[11px] text-[#006a61] bg-[#e6f7f5] px-2 py-0.5 rounded-full font-medium">
                  Field Camera
                </span>
              </div>
              <p className="text-[12px] text-[#757682]">
                Select geo-tagged field photos to attach to this transmittal for verification:
              </p>

              <div className="space-y-2.5">
                {PRESET_FIELD_PHOTOS.map((photo, idx) => {
                  const isSelected = attachedPhotos.some((p) => p.url === photo.url);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleTogglePhoto(photo)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-[#006a61] bg-[#e6f7f5]/40 shadow-xs'
                          : 'border-[#c5c5d3]/40 bg-[#f8f9ff] hover:border-[#757682]'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        referrerPolicy="no-referrer"
                        className="w-14 h-12 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-[11px] space-y-0.5">
                        <p className="font-medium text-[#131b2e] line-clamp-1">{photo.caption}</p>
                        <span className="text-[#757682] font-mono text-[10px] block">{photo.geotag}</span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-[18px] shrink-0 ${
                          isSelected ? 'text-[#006a61]' : 'text-[#c5c5d3]'
                        }`}
                      >
                        {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submission Actions Box */}
            <div className="bg-white p-5 rounded-2xl border border-[#c5c5d3]/40 shadow-xs space-y-3 sticky top-4">
              <div className="flex items-center gap-2 text-[#006a61]">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span className="font-headline-sm text-[14px] font-bold">Transmittal Summary</span>
              </div>

              <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 text-[12px] space-y-1 text-[#444651]">
                <div className="flex justify-between">
                  <span>Sign-off Role:</span>
                  <span className="font-semibold text-[#131b2e]">Site Supervisor (R. Sharma)</span>
                </div>
                <div className="flex justify-between">
                  <span>Corridor:</span>
                  <span className="font-semibold text-[#00236f]">{chainage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Work Items:</span>
                  <span className="font-semibold text-[#131b2e]">{quantities.length} line items</span>
                </div>
                <div className="flex justify-between">
                  <span>Inspection Photos:</span>
                  <span className="font-semibold text-[#006a61]">{attachedPhotos.length} attached</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => handleFormSubmit(false)}
                  className="w-full h-11 px-4 rounded-xl bg-[#006a61] hover:bg-[#005049] text-white font-headline-sm text-[14px] font-bold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>Submit for AI Verification</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFormSubmit(true)}
                  className="w-full h-10 px-4 rounded-xl bg-white border border-[#c5c5d3] hover:border-[#006a61] text-[#006a61] font-semibold text-[13px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save as Draft (Edit Later)</span>
                </button>
              </div>

              <p className="text-[11px] text-[#757682] text-center pt-1">
                Submitted reports are queued for AI matching against the master project schedule.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Document Upload Mode */
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#c5c5d3]/40 shadow-xs max-w-2xl mx-auto w-full space-y-6">
          <div className="text-center space-y-1">
            <h2 className="font-headline-sm text-xl font-bold text-[#131b2e]">
              Upload DPR Transmittal Document
            </h2>
            <p className="text-[13px] text-[#757682]">
              Upload signed PDF daily progress reports, Excel contractor sheets, or CSV shift logs.
            </p>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
            }}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
              dragOver ? 'border-[#006a61] bg-[#e6f7f5]' : 'border-[#c5c5d3] hover:border-[#006a61] bg-[#f8f9ff]'
            }`}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf,.xlsx,.xls,.csv';
              input.onchange = (e: any) => {
                if (e.target.files[0]) handleFileUpload(e.target.files[0]);
              };
              input.click();
            }}
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-[#e6f7f5] flex items-center justify-center text-[#006a61] mb-4">
              {isProcessingUpload ? (
                <span className="material-symbols-outlined text-[32px] animate-spin">
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
              )}
            </div>

            <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold mb-1">
              {uploadStatus}
            </h3>
            <p className="text-[12px] text-[#444651]">
              Accepted formats: PDF Daily Site Reports, Excel WBS trackers (.xlsx), or CSV shift manifests
            </p>

            <button
              type="button"
              disabled={isProcessingUpload}
              className="mt-5 px-5 py-2 rounded-xl bg-[#006a61] hover:bg-[#005049] text-white text-[13px] font-semibold transition-colors shadow-xs"
            >
              Browse Local Files
            </button>
          </div>

          <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#c5c5d3]/30 text-[12px] space-y-2 text-[#444651]">
            <div className="font-semibold text-[#131b2e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006a61]">auto_awesome</span>
              <span>Automated Extraction Engine</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Upon upload, the Plan2Progress AI engine extracts chainages (e.g., KP 12+400), work quantities, and matching activity codes from Primavera P6 to streamline planner sign-off.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
