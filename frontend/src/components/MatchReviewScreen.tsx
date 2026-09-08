import React, { useState } from 'react';
import { ReviewQueueItem, NavigationPath, ReviewCandidate } from '../types';

interface MatchReviewScreenProps {
  queueItems: ReviewQueueItem[];
  onNavigate: (path: NavigationPath) => void;
  onApproveItem: (itemId: string, activityId: string) => void;
  onRejectItem: (itemId: string) => void;
  onReassignActivity: (itemId: string, candidate: ReviewCandidate) => void;
  onShowToast: (title: string, message: string, icon?: string, isError?: boolean) => void;
  onReloadQueue?: () => void;
}

export const MatchReviewScreen: React.FC<MatchReviewScreenProps> = ({
  queueItems,
  onNavigate,
  onApproveItem,
  onRejectItem,
  onReassignActivity,
  onShowToast,
  onReloadQueue,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const totalItems = queueItems.length;
  const safeIndex = totalItems > 0 ? Math.min(Math.max(0, currentIndex), totalItems - 1) : 0;
  const currentItem: ReviewQueueItem | undefined = queueItems[safeIndex];

  const handleNext = () => {
    if (safeIndex < totalItems - 1) {
      setCurrentIndex(safeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    }
  };

  const handleApprove = () => {
    if (!currentItem) return;
    onApproveItem(currentItem.id, currentItem.suggestedActivity.activityUuid || '');
    if (safeIndex >= totalItems - 1) {
      setCurrentIndex(Math.max(0, totalItems - 2));
    }
  };

  const handleReject = () => {
    if (!currentItem) return;
    onRejectItem(currentItem.id);
    onShowToast(
      'Update Rejected',
      'Item flagged for contractor re-verification and resubmission.',
      'close',
      true
    );
    if (safeIndex >= totalItems - 1) {
      setCurrentIndex(Math.max(0, totalItems - 2));
    }
  };

  const handleSelectAlternative = (candidate: ReviewCandidate) => {
    if (!currentItem) return;
    onReassignActivity(currentItem.id, candidate);
    onShowToast(
      'Activity Reassigned',
      `Assigned this entry to: ${candidate.title} (${candidate.activityId})`
    );
    setShowAlternatives(false);
  };

  // Master activities for the "Choose Different Activity" modal
  const masterWbsActivities = [
    {
      id: 'L6-PIPE-EXC-042',
      title: 'Pipeline Trench Excavation',
      workPackage: 'Pipeline → Trench Excavation',
      code: 'L6-PIPE-EXC-042',
      scope: '1,200 m',
    },
    {
      id: 'L6-TIEIN-TR-018',
      title: 'Compressor Tie-in Corridor Trenching',
      workPackage: 'Tie-in Piping',
      code: 'L6-TIEIN-TR-018',
      scope: '850 m',
    },
    {
      id: 'L6-VALV-EXC-002',
      title: 'Valve Station Trenching',
      workPackage: 'Valve Stations',
      code: 'L6-VALV-EXC-002',
      scope: '320 m',
    },
    {
      id: 'L4-CIV-COMP-012',
      title: 'Compressor Foundation Concreting',
      workPackage: 'Civil Works → Compressor Station',
      code: 'L4-CIV-COMP-012',
      scope: '320 m³',
    },
    {
      id: 'L5-MECH-WELD-024',
      title: 'Mainline Pipeline Welding & NDT',
      workPackage: 'Mechanical → Mainline Welding',
      code: 'L5-MECH-WELD-024',
      scope: '160 joints',
    },
    {
      id: 'L4-STR-PRACK-008',
      title: 'Structural Steel Erection - Pipe Racks',
      workPackage: 'Civil/Structural → Pipe Racks',
      code: 'L4-STR-PRACK-008',
      scope: '45 MT',
    },
    {
      id: 'L6-PIPE-STR-015',
      title: 'Pipe Stringing & Bending - Sector A',
      workPackage: 'Pipeline → Stringing',
      code: 'L6-PIPE-STR-015',
      scope: '2,500 m',
    },
    {
      id: 'L5-ELEC-CP-004',
      title: 'Cathodic Protection Deep Well Groundbed Installation',
      workPackage: 'Electrical/CP → Groundbeds',
      code: 'L5-ELEC-CP-004',
      scope: '4 groundbeds',
    },
  ];

  const filteredPickerActivities = masterWbsActivities.filter(
    (a) =>
      a.title.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      a.code.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      a.workPackage.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  // If no items are pending review or currentItem is undefined, show empty state
  if (!currentItem || totalItems === 0) {
    return (
      <div className="flex flex-col w-full">
        {/* Top Stat Counters & Header Section */}
        <header className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#c5c5d3]/30">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-label-caps text-[11px] text-[#006a61] uppercase tracking-widest font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#006a61]"></span>
                Intelligent Reconciliation
              </div>
              <h1 className="font-headline-xl text-3xl md:text-4xl text-[#00236f] tracking-tight font-bold">
                Match &amp; Review
              </h1>
              <p className="font-body-lg text-[15px] text-[#444651] max-w-2xl">
                AI connects site updates to the right project activities. You make the final call.
              </p>
            </div>

            {/* Metrics */}
            <div className="flex items-stretch gap-2 flex-wrap sm:flex-nowrap">
              <div className="px-4 py-2.5 bg-white rounded-xl shadow-xs flex flex-col justify-center min-w-[130px] border border-[#c5c5d3]/40">
                <span className="font-label-caps text-[10px] text-[#757682] uppercase tracking-wider font-semibold">
                  Site Updates
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-lg text-[22px] font-bold text-[#131b2e]">128</span>
                  <span className="font-body-sm text-[12px] text-[#757682]">total read</span>
                </div>
              </div>

              <div className="px-4 py-2.5 bg-[#86f2e4]/20 rounded-xl shadow-xs flex flex-col justify-center min-w-[130px] border border-[#006a61]/30">
                <span className="font-label-caps text-[10px] text-[#006a61] uppercase tracking-wider font-semibold">
                  Reconciled
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-lg text-[22px] font-bold text-[#006a61]">100%</span>
                  <span className="font-body-sm text-[12px] text-[#006a61] flex items-center gap-0.5 font-medium">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    synchronized
                  </span>
                </div>
              </div>

              <div className="px-4 py-2.5 bg-[#e2e7ff] rounded-xl shadow-xs flex flex-col justify-center min-w-[140px] border border-[#b6c4ff]/50">
                <span className="font-label-caps text-[10px] text-[#00236f] font-bold uppercase tracking-wider">
                  Pending Review
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-lg text-[22px] font-bold text-[#00236f]">0</span>
                  <span className="font-body-sm text-[12px] text-[#006a61] font-medium flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    all clear
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Empty State Card */}
        <div className="bg-white rounded-2xl border border-[#c5c5d3]/40 p-8 md:p-12 shadow-xs text-center flex flex-col items-center max-w-2xl mx-auto my-6">
          <div className="w-16 h-16 rounded-full bg-[#86f2e4]/30 border border-[#006a61]/30 flex items-center justify-center text-[#006a61] mb-4">
            <span className="material-symbols-outlined text-[32px]">task_alt</span>
          </div>
          <h2 className="font-headline-lg text-2xl font-bold text-[#131b2e] mb-2">
            Review Queue All Caught Up
          </h2>
          <p className="font-body-md text-[14px] text-[#444651] max-w-md leading-relaxed mb-6">
            All reported field updates from site reports have been approved, reconciled, and synchronized into the master project schedule.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {onReloadQueue && (
              <button
                type="button"
                onClick={onReloadQueue}
                className="h-10 px-5 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] text-white font-headline-sm text-[13px] font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
                Reload Sample Queue Items
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('site-reports')}
              className="h-10 px-5 rounded-lg bg-[#eaedff] hover:bg-[#d8e0ff] text-[#00236f] font-headline-sm text-[13px] font-semibold flex items-center gap-2 transition-colors border border-[#b6c4ff]/50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              Go to Site Reports
            </button>
            <button
              type="button"
              onClick={() => onNavigate('project-progress')}
              className="h-10 px-5 rounded-lg border border-[#c5c5d3] hover:bg-[#f2f3ff] text-[#444651] font-headline-sm text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
              View Progress
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Top Stat Counters & Header Section */}
      <header className="mb-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-label-caps text-[11px] text-[#006a61] uppercase tracking-widest font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#006a61]"></span>
              Intelligent Reconciliation
            </div>
            <h1 className="font-headline-xl text-3xl md:text-4xl text-[#00236f] tracking-tight font-bold">
              Match &amp; Review
            </h1>
            <p className="font-body-lg text-[15px] text-[#444651] max-w-2xl">
              AI connects site updates to the right project activities. You make the final call.
            </p>
          </div>

          {/* Quick Triage Metric Ribbon */}
          <div className="flex items-stretch gap-2 flex-wrap sm:flex-nowrap">
            <div className="px-4 py-2.5 bg-white rounded-xl shadow-xs flex flex-col justify-center min-w-[130px] border border-[#c5c5d3]/40">
              <span className="font-label-caps text-[10px] text-[#757682] uppercase tracking-wider font-semibold">
                Site Updates
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-headline-lg text-[22px] font-bold text-[#131b2e]">128</span>
                <span className="font-body-sm text-[12px] text-[#757682]">total read</span>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-white rounded-xl shadow-xs flex flex-col justify-center min-w-[130px] border border-[#c5c5d3]/40">
              <span className="font-label-caps text-[10px] text-[#006a61] uppercase tracking-wider font-semibold">
                Matched
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-headline-lg text-[22px] font-bold text-[#131b2e]">117</span>
                <span className="font-body-sm text-[12px] text-[#006a61] flex items-center gap-0.5 font-medium">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  synced
                </span>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-[#e2e7ff] rounded-xl shadow-xs flex flex-col justify-center min-w-[140px] border border-[#b6c4ff]/50">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-[10px] text-[#00236f] font-bold uppercase tracking-wider">
                  Need Review
                </span>
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-headline-lg text-[22px] font-bold text-[#00236f]">
                  {totalItems}
                </span>
                <span className="font-body-sm text-[12px] text-[#444651] font-medium">
                  pending items
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper / Item Progress Strip */}
        <div className="flex items-center justify-between bg-[#f2f3ff] px-4 py-2 rounded-xl shadow-xs border border-[#c5c5d3]/40">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00236f] text-white font-label-caps text-[11px] font-semibold">
              Queue Item {safeIndex + 1} of {totalItems}
            </span>
            <span className="font-body-sm text-[13px] text-[#444651] font-medium">
              {currentItem.sector}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePrev}
              disabled={safeIndex === 0}
              className={`p-1 rounded transition-colors ${
                safeIndex === 0
                  ? 'text-[#757682] opacity-30 cursor-not-allowed'
                  : 'hover:bg-[#eaedff] text-[#131b2e] cursor-pointer'
              }`}
              title="Previous Item"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <span className="font-mono text-[12px] text-[#444651] px-1 font-semibold">
              {String(safeIndex + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
            </span>
            <button
              onClick={handleNext}
              disabled={safeIndex === totalItems - 1}
              className={`p-1 rounded transition-colors ${
                safeIndex === totalItems - 1
                  ? 'text-[#757682] opacity-30 cursor-not-allowed'
                  : 'hover:bg-[#eaedff] text-[#131b2e] cursor-pointer'
              }`}
              title="Next Item"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Canvas */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT PANE: Site Update (From the Field) */}
        <section className="lg:col-span-6 bg-white rounded-xl shadow-xs p-4 space-y-4 border border-[#c5c5d3]/40">
          {/* Section Tag & Source Document */}
          <div className="flex items-center justify-between pb-1 border-b border-[#c5c5d3]/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#00236f]">
                <span className="material-symbols-outlined text-[18px]">assignment</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-[15px] font-semibold text-[#131b2e]">
                  Site Update
                </h2>
                <p className="font-body-sm text-[11px] text-[#757682]">
                  Direct contractor report intake
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f2f3ff] text-[#131b2e] font-mono text-[11px] border border-[#c5c5d3]/40">
              <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">
                picture_as_pdf
              </span>
              <span className="truncate max-w-[190px] font-medium">{currentItem.sourceDoc}</span>
            </div>
          </div>

          {/* Field Excerpt Callout */}
          <div className="relative bg-[#f2f3ff] rounded-xl p-4 overflow-hidden border border-[#c5c5d3]/30">
            <span className="material-symbols-outlined absolute -top-2 -right-2 text-[#dae2fd] text-[84px] pointer-events-none select-none opacity-40">
              format_quote
            </span>
            <span className="font-label-caps text-[10px] text-[#757682] uppercase tracking-wider block mb-1 font-semibold">
              Reported Work Entry
            </span>
            <blockquote className="font-headline-sm text-[16px] md:text-[17px] text-[#00236f] leading-relaxed relative z-10 font-medium">
              {currentItem.quote}
            </blockquote>
            <div className="mt-2.5 flex items-center gap-1 text-[#444651] font-body-sm text-[12px]">
              <span className="material-symbols-outlined text-[16px] text-[#006a61]">person</span>
              <span>
                Submitted by{' '}
                <strong className="font-semibold text-[#131b2e]">
                  {currentItem.submittedBy}
                </strong>{' '}
                • {currentItem.shiftInfo}
              </span>
            </div>
          </div>

          {/* Extracted Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-[#f2f3ff] p-2.5 rounded-lg border border-[#c5c5d3]/30">
              <span className="font-label-caps text-[10px] text-[#757682] uppercase block mb-1 font-semibold">
                Corridor Location
              </span>
              <div className="flex items-center gap-1 text-[#131b2e] font-headline-sm text-[14px] font-semibold truncate">
                <span className="material-symbols-outlined text-[#00236f] text-[18px] shrink-0">
                  near_me
                </span>
                <span className="truncate">{currentItem.corridorLocation}</span>
              </div>
              <span className="font-body-sm text-[11px] text-[#757682] block mt-0.5 truncate">
                {currentItem.corridorSub}
              </span>
            </div>

            <div className="bg-[#f2f3ff] p-2.5 rounded-lg border border-[#c5c5d3]/30">
              <span className="font-label-caps text-[10px] text-[#757682] uppercase block mb-1 font-semibold">
                Reported Quantity
              </span>
              <div className="flex items-center gap-1 text-[#131b2e] font-headline-sm text-[14px] font-semibold truncate">
                <span className="material-symbols-outlined text-[#006a61] text-[18px] shrink-0">
                  straighten
                </span>
                <span className="truncate">{currentItem.reportedQuantity}</span>
              </div>
              <span className="font-body-sm text-[11px] text-[#757682] block mt-0.5 truncate">
                {currentItem.quantityDetail}
              </span>
            </div>

            <div className="bg-[#f2f3ff] p-2.5 rounded-lg border border-[#c5c5d3]/30">
              <span className="font-label-caps text-[10px] text-[#757682] uppercase block mb-1 font-semibold">
                Execution Date
              </span>
              <div className="flex items-center gap-1 text-[#131b2e] font-headline-sm text-[14px] font-semibold truncate">
                <span className="material-symbols-outlined text-[#00236f] text-[18px] shrink-0">
                  calendar_today
                </span>
                <span className="truncate">{currentItem.executionDate}</span>
              </div>
              <span className="font-body-sm text-[11px] text-[#757682] block mt-0.5 truncate">
                {currentItem.shiftType}
              </span>
            </div>
          </div>

          {/* Verified Field Visual Proof */}
          <div className="bg-[#f2f3ff] rounded-xl p-2.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 border border-[#c5c5d3]/30">
            <div className="relative w-full sm:w-32 h-24 rounded-lg overflow-hidden shrink-0 shadow-xs">
              <img
                src={currentItem.photoUrl}
                alt={currentItem.photoTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#283044]/85 text-[#eef0ff] font-mono text-[10px]">
                {currentItem.photoGeoTag}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#86f2e4] text-[#006f66] font-label-caps text-[10px] font-semibold">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  {currentItem.verifiedTag}
                </span>
                <span className="font-body-sm text-[11px] text-[#757682]">
                  {currentItem.attachmentMeta}
                </span>
              </div>
              <div className="font-headline-sm text-[13px] text-[#131b2e] truncate font-semibold">
                {currentItem.photoTitle}
              </div>
              <p className="font-body-sm text-[11px] text-[#444651] mt-0.5 line-clamp-2 leading-relaxed">
                {currentItem.photoDesc}
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT PANE: AI Recommended Schedule Match */}
        <section className="lg:col-span-6 bg-white rounded-xl shadow-xs p-4 space-y-4 border border-[#c5c5d3]/40">
          {/* Card Heading & Match Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-[#c5c5d3]/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#86f2e4]/30 flex items-center justify-center text-[#006a61]">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-[15px] font-semibold text-[#131b2e]">
                  Suggested Activity
                </h2>
                <p className="font-body-sm text-[11px] text-[#757682]">
                  Target schedule line in Master WBS
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#86f2e4] text-[#006f66] font-headline-sm text-[13px] font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#006a61]">
                check_circle
              </span>
              <span>{currentItem.suggestedActivity.confidence}% Match Confidence</span>
            </div>
          </div>

          {/* Target Activity Title & Meta */}
          <div className="p-3.5 bg-[#eaedff] rounded-xl border border-[#b6c4ff]/50">
            <div className="font-headline-lg text-[20px] text-[#00236f] tracking-tight font-bold">
              {currentItem.suggestedActivity.title}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-body-sm text-[12px] text-[#444651]">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#757682]">folder</span>
                Work Package:{' '}
                <strong className="font-semibold text-[#131b2e]">
                  {currentItem.suggestedActivity.workPackage}
                </strong>
              </span>
              <span className="text-[#757682]">•</span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                Activity ID:{' '}
                <strong className="text-[#00236f] font-bold">
                  {currentItem.suggestedActivity.activityId}
                </strong>
              </span>
            </div>
          </div>

          {/* Human Plain Rationale Box */}
          <div className="p-3.5 bg-[#f2f3ff] rounded-xl border border-[#c5c5d3]/30">
            <div className="flex items-center gap-1.5 mb-1 text-[#006a61] font-headline-sm text-[13px] font-semibold">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              Why this is the right match
            </div>
            <p className="font-body-md text-[13px] text-[#131b2e] leading-relaxed">
              {currentItem.suggestedActivity.matchRationale}
            </p>
          </div>

          {/* Schedule Impact Visualizer */}
          <div className="p-3.5 bg-[#f2f3ff] rounded-xl space-y-2 border border-[#c5c5d3]/30">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-[10px] text-[#757682] uppercase tracking-wider font-semibold">
                Schedule Impact Preview
              </span>
              <span className="font-label-caps text-[11px] text-[#006a61] uppercase font-bold">
                +{currentItem.suggestedActivity.thisUpdatePct.toFixed(0)}% Progression
              </span>
            </div>

            {/* Custom Dual Sched Progress Bar */}
            <div className="w-full bg-[#eaedff] rounded-full h-3 overflow-hidden flex relative border border-[#c5c5d3]/30">
              {/* Current Progress */}
              <div
                className="h-full bg-[#00236f]"
                style={{ width: `${currentItem.suggestedActivity.currentDonePct}%` }}
                title={`Current: ${currentItem.suggestedActivity.currentDone} (${currentItem.suggestedActivity.currentDonePct}%)`}
              ></div>
              {/* Newly Added By this Match */}
              <div
                className="h-full bg-[#006a61] transition-all"
                style={{ width: `${currentItem.suggestedActivity.thisUpdatePct}%` }}
                title={`This update: +${currentItem.suggestedActivity.thisUpdateAmount} (+${currentItem.suggestedActivity.thisUpdatePct}%)`}
              ></div>
            </div>

            {/* Metric Ledger Breakdown */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white p-2 rounded border border-[#c5c5d3]/30">
                <span className="font-label-caps text-[9px] text-[#757682] uppercase block font-semibold">
                  Scope Target
                </span>
                <div className="font-mono text-[13px] text-[#131b2e] mt-0.5 font-semibold">
                  {currentItem.suggestedActivity.scopeTarget}
                </div>
              </div>
              <div className="bg-white p-2 rounded border border-[#c5c5d3]/30">
                <span className="font-label-caps text-[9px] text-[#00236f] uppercase block font-semibold">
                  Current Done
                </span>
                <div className="font-mono text-[13px] text-[#00236f] mt-0.5 font-semibold">
                  {currentItem.suggestedActivity.currentDone}{' '}
                  <span className="text-[10px] text-[#757682] font-normal">
                    ({currentItem.suggestedActivity.currentDonePct.toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="bg-white p-2 rounded border border-[#c5c5d3]/30">
                <span className="font-label-caps text-[9px] text-[#006a61] uppercase block font-bold">
                  After Approval
                </span>
                <div className="font-mono text-[13px] text-[#006a61] font-bold mt-0.5">
                  {currentItem.suggestedActivity.afterApproval}{' '}
                  <span className="text-[10px] font-normal">
                    ({currentItem.suggestedActivity.afterApprovalPct.toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons Bar */}
          <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleApprove}
              className="w-full sm:flex-1 h-11 px-4 bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded font-headline-sm text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>Approve Match</span>
            </button>

            <button
              onClick={() => setShowPickerModal(true)}
              className="w-full sm:w-auto h-11 px-4 bg-white hover:bg-[#eaedff] text-[#131b2e] rounded font-headline-sm text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-[#c5c5d3]/50 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              <span>Choose Different Activity</span>
            </button>

            <button
              onClick={handleReject}
              className="w-full sm:w-auto h-11 px-4 bg-[#ffdad6] hover:bg-[#ba1a1a] hover:text-white text-[#93000a] rounded font-headline-sm text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              <span>Reject Update</span>
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Drawer: Alternative Considered Candidates */}
      <section className="mt-4 bg-white rounded-xl shadow-xs overflow-hidden border border-[#c5c5d3]/40">
        <button
          onClick={() => setShowAlternatives(!showAlternatives)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#f2f3ff] transition-colors cursor-pointer"
          type="button"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#eaedff] flex items-center justify-center text-[#444651]">
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
            </div>
            <div>
              <span className="font-headline-sm text-[14px] text-[#131b2e] font-semibold">
                Alternative Matches
              </span>
              <span className="font-body-sm text-[12px] text-[#757682] ml-1">
                ({currentItem.alternatives.length} other candidates considered)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 font-body-sm text-[12px] text-[#757682]">
            <span>{showAlternatives ? 'Hide options' : 'Show options'}</span>
            <span
              className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
                showAlternatives ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </div>
        </button>

        {/* Collapsible content */}
        {showAlternatives && (
          <div className="px-4 pb-4 space-y-2 pt-1 border-t border-[#c5c5d3]/20">
            {currentItem.alternatives.map((alt) => (
              <div
                key={alt.id}
                className="p-3.5 bg-[#f2f3ff] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 border border-[#c5c5d3]/30"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-[14px] text-[#131b2e] font-semibold">
                      {alt.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#444651] font-label-caps text-[10px] font-semibold">
                      {alt.matchPct}% match
                    </span>
                  </div>
                  <div className="font-body-sm text-[12px] text-[#757682]">
                    Activity ID: <span className="font-mono">{alt.activityId}</span> • Work
                    Package: {alt.workPackage}
                  </div>
                  <p className="font-body-sm text-[12px] text-[#444651] mt-1 leading-relaxed">
                    {alt.reason}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectAlternative(alt)}
                  className="h-9 px-4 bg-white hover:bg-[#eaedff] text-[#00236f] font-headline-sm text-[12px] font-semibold rounded flex items-center justify-center gap-1 shrink-0 transition-colors border border-[#c5c5d3]/40 cursor-pointer"
                >
                  Select This Instead
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Activity Picker Modal (Choose Different Activity from Master WBS) */}
      {showPickerModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-[#c5c5d3] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-[#c5c5d3]/40 flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
                  Select Activity from Master WBS
                </h3>
                <p className="text-[12px] text-[#757682]">
                  Reassign site report to an active Primavera P6 schedule activity
                </p>
              </div>
              <button
                onClick={() => setShowPickerModal(false)}
                className="p-1 rounded text-[#757682] hover:bg-[#eaedff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-3 border-b border-[#c5c5d3]/30 bg-[#f2f3ff]">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#757682] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search by activity name, WBS ID, or package..."
                  className="w-full h-9 pl-9 pr-3 bg-white border border-[#c5c5d3] rounded text-[13px] focus:outline-none focus:border-[#00236f]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredPickerActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg border border-[#c5c5d3]/40 hover:bg-[#f2f3ff] transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-headline-sm text-[13px] font-semibold text-[#131b2e] truncate">
                      {act.title}
                    </div>
                    <div className="text-[11px] text-[#757682]">
                      <span className="font-mono text-[#00236f] font-medium">{act.code}</span> •{' '}
                      {act.workPackage} • Scope Target: {act.scope}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleSelectAlternative({
                        id: act.id,
                        title: act.title,
                        activityId: act.code,
                        workPackage: act.workPackage,
                        matchPct: 100,
                        reason: 'Manually reassigned by Project Planner.',
                      });
                      setShowPickerModal(false);
                    }}
                    className="h-8 px-3 rounded bg-[#00236f] text-white text-[12px] font-semibold hover:bg-[#1e3a8a] transition-colors shrink-0 cursor-pointer"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
