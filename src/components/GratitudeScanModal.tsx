import React, { useState } from 'react';
import {
  Feather,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  X,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { GratitudeScan } from '../types';
import { playMonasticBell, playBaselineChime } from '../services/sound';

interface GratitudeScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayScan?: GratitudeScan;
  onSaveScan: (scan: GratitudeScan) => void;
  onToggleProofAction: () => void;
}

export const GratitudeScanModal: React.FC<GratitudeScanModalProps> = ({
  isOpen,
  onClose,
  todayScan,
  onSaveScan,
  onToggleProofAction,
}) => {
  const [q1, setQ1] = useState(todayScan?.q1NotGuaranteed || '');
  const [q2, setQ2] = useState(todayScan?.q2FrictionData || '');
  const [q3, setQ3] = useState(todayScan?.q3FixedBelief || '');
  const [q4, setQ4] = useState(todayScan?.q4ProofAction || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q1.trim() || !q4.trim()) return;

    const newScan: GratitudeScan = {
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      q1NotGuaranteed: q1.trim(),
      q2FrictionData: q2.trim() || 'Friction revealed an opportunity to sharpen tactical pacing.',
      q3FixedBelief: q3.trim() || 'Belief in execution remains non-negotiable regardless of circumstance.',
      q4ProofAction: q4.trim(),
      proofActionCompleted: todayScan?.proofActionCompleted || false,
      isLocked: true,
    };

    onSaveScan(newScan);
    playMonasticBell();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative my-8">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#262626] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-[#161616] text-[#C5A059] border border-[#262626]">
                <Feather className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                18:00 Protected Anchor
              </span>
            </div>
            <h2 className="text-xl font-serif text-[#E0E0E0]">
              Daily Empirical Gratitude Scan
            </h2>
            <p className="text-xs text-[#808080] font-serif italic">
              Not superficial positive thinking. This is an empirical calibration to transmute friction into data and commit to an immediate physical proof action.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#808080] hover:text-[#E0E0E0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Completed View */}
        {todayScan && todayScan.isLocked ? (
          <div className="space-y-5">
            <div className="p-4 bg-[#161616] border border-[#262626] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6BBF8E] flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#6BBF8E]" />
                  Scan Recorded at {new Date(todayScan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-[#0A0A0A] text-[#808080] border border-[#262626]">
                  Timestamped & Locked
                </span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 bg-[#0A0A0A] border border-[#262626] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#808080] font-mono block">
                  1. One concrete thing that exists today that was not guaranteed:
                </span>
                <p className="text-[#E0E0E0]">{todayScan.q1NotGuaranteed}</p>
              </div>

              <div className="p-4 bg-[#0A0A0A] border border-[#262626] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#808080] font-mono block">
                  2. One way today’s friction or inconsistency is usable data (not a verdict on identity):
                </span>
                <p className="text-[#E0E0E0]">{todayScan.q2FrictionData}</p>
              </div>

              <div className="p-4 bg-[#0A0A0A] border border-[#262626] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#808080] font-mono block">
                  3. One specific way the fixed belief remains intact despite the data:
                </span>
                <p className="text-[#E0E0E0]">{todayScan.q3FixedBelief}</p>
              </div>

              {/* 90-120 Minute Proof Action */}
              <div className="p-4 bg-[#161616] border border-[#C5A059]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif text-[#C5A059]">
                    4. Next 90–120 Minutes Proof Action:
                  </span>
                  <button
                    onClick={() => {
                      onToggleProofAction();
                      playBaselineChime();
                    }}
                    className={`px-3 py-1.5 text-xs uppercase tracking-widest font-semibold transition-all ${
                      todayScan.proofActionCompleted
                        ? 'bg-[#6BBF8E] text-black shadow-sm'
                        : 'bg-[#C5A059] hover:bg-[#D6B570] text-black shadow-sm'
                    }`}
                  >
                    {todayScan.proofActionCompleted ? '✓ Action Executed' : 'Mark Action Done'}
                  </button>
                </div>
                <p className="text-sm font-serif text-[#E0E0E0]">{todayScan.q4ProofAction}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#262626]">
              <button
                onClick={onClose}
                className="px-5 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
              >
                Close View
              </button>
            </div>
          </div>
        ) : (
          /* Form for Entering the 4 Questions */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Question 1 */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">
                1. One concrete thing that exists today that was not guaranteed:
              </label>
              <textarea
                rows={2}
                placeholder="e.g. The mental clarity and health to write 1,000 lines of clean architecture today without pain."
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] placeholder-[#555]"
                required
                autoFocus
              />
            </div>

            {/* Question 2 */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">
                2. One way today’s friction or inconsistency is usable data (not a verdict on identity):
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Getting tired at 15:00 showed that scheduling heavy planning right after lunch is tactical error, not a character flaw."
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] placeholder-[#555]"
                required
              />
            </div>

            {/* Question 3 */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">
                3. One specific way the fixed belief remains intact despite the data:
              </label>
              <textarea
                rows={2}
                placeholder="e.g. My identity as a disciplined builder is invariant; I simply adjust the afternoon protocol tomorrow."
                value={q3}
                onChange={(e) => setQ3(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] placeholder-[#555]"
                required
              />
            </div>

            {/* Question 4 */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#C5A059] block mb-1">
                4. One intentional action that will be executed in the next 90–120 minutes as physical proof of the belief:
              </label>
              <input
                type="text"
                placeholder="e.g. Spend 45 minutes coding the persistence layer with zero phone glances before 19:30."
                value={q4}
                onChange={(e) => setQ4(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#C5A059]/50 text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] placeholder-[#555] font-mono font-medium"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
              <div className="text-[10px] text-[#808080] font-mono flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#C5A059]" />
                <span>Timestamped upon submission (+20 pts)</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lock In Scan</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
