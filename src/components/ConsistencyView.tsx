import React, { useState } from 'react';
import {
  Activity,
  Flame,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Brain,
  Zap,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AppState, FailurePatternLog, LoopType } from '../types';
import { getTodayDateString } from '../data/initialData';

interface ConsistencyViewProps {
  appState: AppState;
  onLogFailurePattern: (log: Partial<FailurePatternLog>) => void;
  onOpenRecovery: (missedActionTitle?: string) => void;
  onOpenAiSteward: () => void;
}

export const ConsistencyView: React.FC<ConsistencyViewProps> = ({
  appState,
  onLogFailurePattern,
  onOpenRecovery,
  onOpenAiSteward,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [loopType, setLoopType] = useState<LoopType>('Thinking Loop');
  const [trigger, setTrigger] = useState('');
  const [description, setDescription] = useState('');
  const [recoveryActionTaken, setRecoveryActionTaken] = useState('');

  // Generate 28-day continuity grid
  const daysGrid = Array.from({ length: 28 }, (_, i) => {
    const dStr = getTodayDateString(i - 27);
    const completion = appState.dailyCompletions[dStr];
    return {
      dateStr: dStr,
      completion,
      isToday: dStr === appState.currentDate,
    };
  });

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigger.trim()) return;

    onLogFailurePattern({
      date: appState.currentDate,
      loopType,
      trigger: trigger.trim(),
      description: description.trim(),
      recoveryActionTaken: recoveryActionTaken.trim() || 'Executed 2-min micro baseline immediately',
      timestamp: new Date().toISOString(),
    });

    setTrigger('');
    setDescription('');
    setRecoveryActionTaken('');
    setShowLogModal(false);
  };

  // Pattern Counts
  const thinkingLoopCount = appState.failurePatternLogs.filter((l) => l.loopType === 'Thinking Loop').length;
  const motivationLoopCount = appState.failurePatternLogs.filter((l) => l.loopType === 'Motivation Loop').length;
  const resetLoopCount = appState.failurePatternLogs.filter((l) => l.loopType === 'Reset Loop').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 bg-[#161616] text-[#C5A059] border border-[#262626]">
              Empirical Auditing
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#E0E0E0] mt-2 tracking-tight">
            Consistency Wire & Diagnostics
          </h1>
          <p className="text-xs text-[#808080] max-w-2xl mt-1 leading-relaxed italic font-serif">
            Track output units and completion, not feelings or effort stories. When a baseline breaks, detect the loop and execute zero-debt recovery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="log-pattern-btn"
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2.5 bg-[#161616] hover:bg-[#222222] text-[#E0E0E0] border border-[#262626] text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all"
          >
            <AlertTriangle className="w-4 h-4 text-[#C5A059]" />
            <span>Log Break</span>
          </button>

          <button
            id="trigger-recovery-from-consistency-btn"
            onClick={() => onOpenRecovery()}
            className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Zap className="w-4 h-4" />
            <span>Recovery</span>
          </button>
        </div>
      </div>

      {/* Top 3 Diagnostic Cards: The 3 Core Loops */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thinking Loop */}
        <div className="bg-[#111111] border border-[#262626] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-serif text-[#C5A059]">
              Thinking Loop
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0A0A0A] text-[#808080] border border-[#262626]">
              {thinkingLoopCount} Logged
            </span>
          </div>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            <strong className="text-[#E0E0E0]">Symptom:</strong> Over-analyzing, endless research, system tweaking, or philosophical speculation that substitutes for shipping output units.
          </p>
          <div className="p-3 bg-[#161616] text-[11px] text-[#808080] border border-[#262626]">
            <strong className="text-[#C5A059]">Antidote:</strong> Set a 10-minute timer. Write 1 ugly paragraph or commit 1 simple line. Action precedes clarity.
          </div>
        </div>

        {/* Motivation Loop */}
        <div className="bg-[#111111] border border-[#262626] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-serif text-[#C5A059]">
              Motivation Loop
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0A0A0A] text-[#808080] border border-[#262626]">
              {motivationLoopCount} Logged
            </span>
          </div>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            <strong className="text-[#E0E0E0]">Symptom:</strong> Waiting to &ldquo;feel like it&rdquo;, demanding emotional inspiration or ideal environmental conditions before engaging.
          </p>
          <div className="p-3 bg-[#161616] text-[11px] text-[#808080] border border-[#262626]">
            <strong className="text-[#C5A059]">Antidote:</strong> Disconnect mood from execution. Fulfill the Minimum Viable Action (MVA) in complete somatic neutrality.
          </div>
        </div>

        {/* Reset Loop */}
        <div className="bg-[#111111] border border-[#262626] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-serif text-[#C5A059]">
              Reset Loop
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0A0A0A] text-[#808080] border border-[#262626]">
              {resetLoopCount} Logged
            </span>
          </div>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            <strong className="text-[#E0E0E0]">Symptom:</strong> Declaring a day or week &ldquo;ruined&rdquo; after a slip and waiting for Monday, tomorrow, or a clean slate to restart.
          </p>
          <div className="p-3 bg-[#161616] text-[11px] text-[#808080] border border-[#262626]">
            <strong className="text-[#C5A059]">Antidote:</strong> Instant micro-recovery within 120 seconds. Never postpone recovery to a future arbitrary date.
          </div>
        </div>
      </div>

      {/* 28-Day Continuity Wire Heatmap */}
      <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif text-[#E0E0E0] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#C5A059]" />
              28-Day Never-Zero Continuity Wire
            </h2>
            <p className="text-xs text-[#808080] mt-1 font-serif italic">
              Continuous unbroken line of execution. Minimum Viable Actions (MVA) maintain the identity wire.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-serif text-[#C5A059]">
              {appState.currentStreakNeverZero} Days Streak
            </div>
            <div className="text-[10px] text-[#808080] font-mono uppercase tracking-widest">
              {appState.totalNeverZeroDays} Total Never-Zero Days
            </div>
          </div>
        </div>

        {/* Visual Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-14 lg:grid-cols-28 gap-2 pt-2">
          {daysGrid.map((d) => {
            const hasData = !!d.completion;
            const isNeverZero = d.completion?.neverZeroPassed;
            const score = d.completion?.score || 0;

            return (
              <div
                key={d.dateStr}
                className="flex flex-col items-center gap-1.5 group relative"
              >
                <div
                  className={`w-full aspect-square border transition-all ${
                    d.isToday
                      ? 'ring-1 ring-[#C5A059] ring-offset-1 ring-offset-black'
                      : ''
                  } ${
                    score >= 90
                      ? 'bg-[#6BBF8E] border-[#6BBF8E]'
                      : score >= 50
                      ? 'bg-[#C5A059] border-[#C5A059]'
                      : isNeverZero
                      ? 'bg-[#8F7038] border-[#8F7038]'
                      : hasData
                      ? 'bg-[#E06C75] border-[#E06C75]'
                      : 'bg-[#0A0A0A] border-[#262626]'
                  }`}
                  title={`${d.dateStr}: ${hasData ? `${score}% score` : 'No data'}`}
                />
                <span className="text-[9px] font-mono text-[#808080]">
                  {d.dateStr.slice(8)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-[#808080] pt-4 border-t border-[#262626]">
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#6BBF8E] inline-block" /> Full Execution (90-100%)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#C5A059] inline-block" /> MVA / Partial
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#0A0A0A] border border-[#262626] inline-block" /> Pending / Rest
            </span>
          </div>
        </div>
      </div>

      {/* Failure Pattern & Baseline Break Logs History */}
      <div className="bg-[#111111] border border-[#262626] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h2 className="text-base font-serif text-[#E0E0E0]">
            Logged Inconsistency Traps & Recovery Actions
          </h2>
          <span className="text-xs font-mono text-[#808080]">
            {appState.failurePatternLogs.length} Total Logs
          </span>
        </div>

        <div className="space-y-3">
          {appState.failurePatternLogs.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#808080] border border-dashed border-[#262626]">
              No failure patterns logged. Log when an inconsistency or loop trap occurs.
            </div>
          ) : (
            appState.failurePatternLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-[#161616] border border-[#262626] space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#0A0A0A] text-[#C5A059] border border-[#262626]">
                      {log.loopType}
                    </span>
                    <span className="text-[10px] font-mono text-[#808080]">{log.date}</span>
                  </div>
                </div>

                <p className="text-xs text-[#A3A3A3]">
                  <strong className="text-[#E0E0E0]">Trigger:</strong> {log.trigger}
                </p>

                {log.description && (
                  <p className="text-xs text-[#808080]">
                    <strong className="text-[#A3A3A3]">Observation:</strong> {log.description}
                  </p>
                )}

                <div className="p-3 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0]">
                  <strong className="text-[#6BBF8E]">Zero-Debt Recovery Executed:</strong> {log.recoveryActionTaken}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Log Failure Pattern Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h2 className="text-lg font-serif text-[#E0E0E0]">
                Log Baseline Break & Failure Pattern
              </h2>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Detected Loop Trap</label>
                <select
                  value={loopType}
                  onChange={(e) => setLoopType(e.target.value as LoopType)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none"
                >
                  <option value="Thinking Loop">Thinking Loop (Over-planning / Analysis paralysis)</option>
                  <option value="Motivation Loop">Motivation Loop (Waiting for mood / emotional readiness)</option>
                  <option value="Reset Loop">Reset Loop (Waiting for Monday / Clean slate)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">What was the physical trigger / friction?</label>
                <input
                  type="text"
                  placeholder="e.g. Felt uncertain about API response format and procrastinated"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Observation of the unconscious behavior</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Spent 45 minutes reading news tabs instead of typing code"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">
                  Immediate Zero-Debt Recovery Action Taken <span className="text-[#C5A059]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wrote 1 function and committed to git within 5 min"
                  value={recoveryActionTaken}
                  onChange={(e) => setRecoveryActionTaken(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
