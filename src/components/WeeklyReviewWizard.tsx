import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bot,
  Loader2,
  X,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
} from 'lucide-react';
import { AppState, WeeklyReview } from '../types';
import { playMonasticBell, playBaselineChime } from '../services/sound';

interface WeeklyReviewWizardProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  onSaveWeeklyReview: (review: WeeklyReview) => void;
}

export const WeeklyReviewWizard: React.FC<WeeklyReviewWizardProps> = ({
  isOpen,
  onClose,
  appState,
  onSaveWeeklyReview,
}) => {
  const [currentBlock, setCurrentBlock] = useState<number>(1);

  // Block 1: Output audit
  const [roleOutputs, setRoleOutputs] = useState<Record<string, { planned: number; delivered: number; notes: string }>>(() => {
    const initial: Record<string, { planned: number; delivered: number; notes: string }> = {};
    appState.monthlyRoleGoals.forEach((r) => {
      initial[r.id] = {
        planned: 5,
        delivered: r.currentOutputCount || 3,
        notes: `Executed baseline targets for ${r.roleName}`,
      };
    });
    return initial;
  });

  // Block 2: Failure pattern audit
  const [dominantLoop, setDominantLoop] = useState<'Thinking Loop' | 'Motivation Loop' | 'Reset Loop' | 'None'>('Thinking Loop');
  const [loopAnalysis, setLoopAnalysis] = useState('Observed slight procrastination during morning context switching.');

  // Block 3: The Single Adjustment Rule
  const [singleAdjustment, setSingleAdjustment] = useState('');

  // Block 4: Gratitude & Trajectory Calibration
  const [weeklyGratitude, setWeeklyGratitude] = useState('');
  const [funeralIdentityAlignment, setFuneralIdentityAlignment] = useState(
    'Maintained high standard of personal integrity and disciplined execution.'
  );

  // Block 5: AI Steward Diagnosis
  const [aiReport, setAiReport] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!isOpen) return null;

  const handleRunAiDiagnostics = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/pattern-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period: 'weekly',
          failureLogs: appState.failurePatternLogs,
          neverZeroStreak: appState.currentStreakNeverZero,
          singleAdjustmentProposal: singleAdjustment,
        }),
      });

      if (!res.ok) throw new Error('Failed to analyze patterns');
      const data = await res.json();
      setAiReport(data);
      if (data.singleAdjustmentValidation && !singleAdjustment) {
        setSingleAdjustment(data.singleAdjustmentValidation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFinalize = () => {
    const today = new Date();
    const weekNumber = Math.ceil(today.getDate() / 7);

    const review: WeeklyReview = {
      id: 'rev-w-' + Date.now(),
      weekStartDate: appState.currentDate,
      weekNumber,
      year: today.getFullYear(),
      timestamp: new Date().toISOString(),
      roleAssessments: appState.monthlyRoleGoals.map((r) => ({
        roleId: r.id,
        roleName: r.roleName,
        targetOutputUnits: roleOutputs[r.id]?.planned || 5,
        deliveredOutputUnits: roleOutputs[r.id]?.delivered || 3,
        notes: roleOutputs[r.id]?.notes || '',
      })),
      dominantLoopDetected: dominantLoop,
      loopAnalysisText: loopAnalysis,
      singleAdjustment: singleAdjustment.trim() || 'Anchor deep work at 08:30 with phone in separate room.',
      gratitudeScanSummary: weeklyGratitude || 'Maintained physical consistency and protected daily anchors.',
      funeralIdentityAlignment,
      aiDiagnosisNote: aiReport?.diagnosis || undefined,
    };

    onSaveWeeklyReview(review);
    playMonasticBell();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#262626] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-[#161616] text-[#C5A059] border border-[#262626]">
                <Calendar className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Sunday Monastic Protocol
              </span>
            </div>
            <h2 className="text-xl font-serif text-[#E0E0E0]">
              Weekly Structured Review (5 Blocks)
            </h2>
            <p className="text-xs text-[#808080] font-serif italic">
              Rigorous empirical audit governed by the Single Adjustment Rule.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#808080] hover:text-[#E0E0E0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Blocks Progression Navigation */}
        <div className="grid grid-cols-5 gap-1.5 pb-2">
          {[
            { n: 1, label: 'Outputs' },
            { n: 2, label: 'Loops' },
            { n: 3, label: 'Adjustment' },
            { n: 4, label: 'Identity' },
            { n: 5, label: 'Steward AI' },
          ].map((b) => (
            <button
              key={b.n}
              type="button"
              onClick={() => setCurrentBlock(b.n)}
              className={`p-2 text-center border transition-all ${
                currentBlock === b.n
                  ? 'bg-[#C5A059] text-black font-semibold border-[#C5A059]'
                  : currentBlock > b.n
                  ? 'bg-[#161616] text-[#E0E0E0] border-[#262626]'
                  : 'bg-[#0A0A0A] text-[#555] border-[#262626]'
              }`}
            >
              <div className="text-[9px] font-mono uppercase tracking-widest">Block {b.n}</div>
              <div className="text-xs font-serif truncate mt-0.5">{b.label}</div>
            </button>
          ))}
        </div>

        {/* BLOCK 1: Empirical Output Audit */}
        {currentBlock === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Block 1: Output Units Audit
              </span>
              <h3 className="text-sm font-serif text-[#E0E0E0]">
                Role-by-Role Physical Deliverables
              </h3>
              <p className="text-xs text-[#808080] font-serif italic">
                Record actual completed output units versus planned commitments.
              </p>
            </div>

            <div className="space-y-3">
              {appState.monthlyRoleGoals.map((role) => (
                <div
                  key={role.id}
                  className="p-3.5 bg-[#0A0A0A] border border-[#262626] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif text-[#E0E0E0]">
                      {role.roleName}
                    </span>
                    <span className="text-[10px] text-[#808080] font-mono">
                      Baseline: {role.nonNegotiableBaseline}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] text-[#808080] uppercase font-mono tracking-widest block mb-0.5">Delivered Units</label>
                      <input
                        type="number"
                        value={roleOutputs[role.id]?.delivered || 0}
                        onChange={(e) =>
                          setRoleOutputs({
                            ...roleOutputs,
                            [role.id]: {
                              ...roleOutputs[role.id],
                              delivered: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-2.5 py-1 bg-[#111111] border border-[#262626] text-xs text-[#E0E0E0] font-mono focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-[#808080] uppercase font-mono tracking-widest block mb-0.5">Target Units</label>
                      <input
                        type="number"
                        value={roleOutputs[role.id]?.planned || 5}
                        onChange={(e) =>
                          setRoleOutputs({
                            ...roleOutputs,
                            [role.id]: {
                              ...roleOutputs[role.id],
                              planned: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-2.5 py-1 bg-[#111111] border border-[#262626] text-xs text-[#E0E0E0] font-mono focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCurrentBlock(2)}
                className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
              >
                <span>Proceed to Loops Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 2: Failure Patterns & Loop Diagnostics */}
        {currentBlock === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Block 2: Failure Patterns Audit
              </span>
              <h3 className="text-sm font-serif text-[#E0E0E0]">
                Which loop was most active this week?
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Thinking Loop', 'Motivation Loop', 'Reset Loop', 'None'] as const).map((loop) => (
                <button
                  key={loop}
                  type="button"
                  onClick={() => setDominantLoop(loop)}
                  className={`p-3 border text-left transition-all ${
                    dominantLoop === loop
                      ? 'bg-[#161616] border-[#C5A059] text-[#C5A059] font-serif'
                      : 'bg-[#0A0A0A] border-[#262626] text-[#808080] font-serif hover:text-[#E0E0E0]'
                  }`}
                >
                  <div className="text-xs">{loop}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Empirical Loop Analysis & Triggers</label>
              <textarea
                rows={3}
                value={loopAnalysis}
                onChange={(e) => setLoopAnalysis(e.target.value)}
                placeholder="Detail the exact friction points and unconscious moments..."
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] placeholder-[#555] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentBlock(1)}
                className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentBlock(3)}
                className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
              >
                <span>Proceed to Single Adjustment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 3: The Single Adjustment Rule */}
        {currentBlock === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Block 3: The Single Adjustment Rule
              </span>
              <h3 className="text-sm font-serif text-[#E0E0E0]">
                Define Exactly One Concrete Operational Change
              </h3>
              <p className="text-xs text-[#808080] font-serif italic leading-relaxed">
                <strong>Law of Stewardship:</strong> Do not overhaul your entire life or rebuild the whole system. Commit to exactly one measurable tactical adjustment for next week.
              </p>
            </div>

            <div className="p-4 bg-[#161616] border border-[#262626] space-y-2">
              <label className="text-xs font-serif text-[#C5A059] block">
                The Single Operational Adjustment for Next Week:
              </label>
              <input
                type="text"
                value={singleAdjustment}
                onChange={(e) => setSingleAdjustment(e.target.value)}
                placeholder="e.g. Leave smartphone in kitchen charger during 08:30–11:00 deep work block"
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#C5A059]/60 text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] font-mono"
                required
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentBlock(2)}
                className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentBlock(4)}
                disabled={!singleAdjustment.trim()}
                className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] disabled:opacity-40 text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
              >
                <span>Proceed to Identity Calibration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 4: Gratitude & Funeral Identity */}
        {currentBlock === 4 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Block 4: Identity & Gratitude Synthesis
              </span>
              <h3 className="text-sm font-serif text-[#E0E0E0]">
                Aligning with the 5-Year Anchor & Funeral Identity
              </h3>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Weekly Gratitude & Unearned Gifts</label>
              <textarea
                rows={2}
                value={weeklyGratitude}
                onChange={(e) => setWeeklyGratitude(e.target.value)}
                placeholder="One concrete blessing from this week that was not guaranteed..."
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] placeholder-[#555] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Funeral Identity Alignment Reflection</label>
              <textarea
                rows={2}
                value={funeralIdentityAlignment}
                onChange={(e) => setFuneralIdentityAlignment(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] placeholder-[#555] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentBlock(3)}
                className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentBlock(5)}
                className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
              >
                <span>Proceed to AI Diagnosis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 5: AI Steward Diagnosis & Final Lock */}
        {currentBlock === 5 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Block 5: AI Steward Audit & Synthesis
              </span>
              <h3 className="text-sm font-serif text-[#E0E0E0]">
                Algorithmic Validation of the Single Adjustment
              </h3>
            </div>

            <div className="p-4 bg-[#0A0A0A] border border-[#262626] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif text-[#C5A059] flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  Steward AI Diagnostic Engine
                </span>
                <button
                  type="button"
                  id="run-weekly-ai-diagnostics-btn"
                  onClick={handleRunAiDiagnostics}
                  disabled={isAiLoading}
                  className="px-3.5 py-1.5 bg-[#161616] hover:bg-[#222222] border border-[#262626] text-[#E0E0E0] text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5"
                >
                  {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />}
                  <span>Run Analysis</span>
                </button>
              </div>

              {aiReport ? (
                <div className="space-y-2 pt-2 border-t border-[#262626] text-xs">
                  <div className="text-[#E0E0E0] font-serif">
                    <strong>Pattern Diagnosis:</strong> {aiReport.diagnosis}
                  </div>
                  <div className="text-[#C5A059] font-serif">
                    <strong>Single Adjustment Validation:</strong> {aiReport.singleAdjustmentValidation}
                  </div>
                  {aiReport.calmEncouragement && (
                    <div className="text-[#808080] font-serif italic">
                      &ldquo;{aiReport.calmEncouragement}&rdquo;
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[#808080] font-serif italic">
                  Click &ldquo;Run Analysis&rdquo; to evaluate your week against the Steward principles.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
              <button
                type="button"
                onClick={() => setCurrentBlock(4)}
                className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
              >
                Back
              </button>
              <button
                type="button"
                id="finalize-weekly-review-btn"
                onClick={handleFinalize}
                className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finalize & Lock Review</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
