import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  Bot,
  Loader2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { playBaselineChime } from '../services/sound';

interface RecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMissedAction?: string;
  onExecuteRecovery: (actionDescription: string) => void;
}

export const RecoveryModal: React.FC<RecoveryModalProps> = ({
  isOpen,
  onClose,
  defaultMissedAction = 'Deep Work Focus Block',
  onExecuteRecovery,
}) => {
  const [missedAction, setMissedAction] = useState(defaultMissedAction);
  const [context, setContext] = useState('Low energy / Schedule disruption');
  const [customAction, setCustomAction] = useState('');
  const [aiActions, setAiActions] = useState<any[]>([]);
  const [recalibrationQuote, setRecalibrationQuote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAiRecovery = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/recovery-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missedAction, context }),
      });
      if (!res.ok) throw new Error('Failed to generate recovery');
      const data = await res.json();
      if (data.actions) {
        setAiActions(data.actions);
      }
      if (data.recalibration) {
        setRecalibrationQuote(data.recalibration);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAction = (actionDesc: string) => {
    onExecuteRecovery(actionDesc);
    playBaselineChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#262626] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-[#161616] text-[#C5A059] border border-[#262626]">
                <Zap className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Zero-Debt Protocol
              </span>
            </div>
            <h2 className="text-xl font-serif text-[#E0E0E0]">
              Lightweight Micro-Recovery
            </h2>
            <p className="text-xs text-[#808080] font-serif italic">
              Never accumulate &ldquo;catch-up debt&rdquo;. Execute a 2–10 minute Minimum Viable Action to preserve the continuity of identity.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#808080] hover:text-[#E0E0E0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Axiom Callout */}
        <div className="p-3.5 bg-[#161616] border border-[#262626] text-xs text-[#C5A059] font-serif italic leading-relaxed">
          <strong>Steward Principle:</strong> Inconsistency is not a moral verdict. Do not double tomorrow&apos;s workload. Fulfill an immediate micro-baseline right now.
        </div>

        {/* Input Parameters */}
        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Missed Baseline or Friction Point</label>
            <input
              type="text"
              value={missedAction}
              onChange={(e) => setMissedAction(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] placeholder-[#555]"
              placeholder="e.g. Missed 90 min deep work block"
            />
          </div>

          <div className="flex justify-end">
            <button
              id="generate-ai-recovery-btn"
              onClick={handleGenerateAiRecovery}
              disabled={isLoading || !missedAction.trim()}
              className="px-4 py-1.5 bg-[#161616] hover:bg-[#222222] text-[#E0E0E0] border border-[#262626] text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5 text-[#C5A059]" />}
              <span>Generate Micro-Actions</span>
            </button>
          </div>
        </div>

        {/* Recalibration Quote */}
        {recalibrationQuote && (
          <div className="p-3 bg-[#0A0A0A] border border-[#262626] text-xs text-[#C5A059] font-serif italic">
            &ldquo;{recalibrationQuote}&rdquo;
          </div>
        )}

        {/* Recovery Action Options */}
        <div className="space-y-2.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-[#808080] block">
            Select Immediate Action:
          </span>

          {aiActions.length > 0 ? (
            aiActions.map((act, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAction(`${act.title} (${act.outputUnit})`)}
                className="w-full p-4 bg-[#0A0A0A] hover:bg-[#161616] border border-[#262626] hover:border-[#C5A059]/50 text-left transition-all flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[#161616] text-[#C5A059] border border-[#262626]">
                      {act.duration}
                    </span>
                    <span className="text-xs font-serif text-[#E0E0E0] group-hover:text-[#C5A059]">
                      {act.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#808080] font-serif">{act.description}</p>
                  <div className="text-[10px] font-mono text-[#808080]">
                    Output: <span className="text-[#E0E0E0]">{act.outputUnit}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#808080] group-hover:text-[#C5A059] mt-1 flex-shrink-0" />
              </button>
            ))
          ) : (
            <>
              {/* Default Option 1: 2-Minute MVA */}
              <button
                id="default-recovery-mva-btn"
                onClick={() => handleSelectAction('2-Minute Minimum Viable Action (1 sentence or 5 pushups)')}
                className="w-full p-4 bg-[#0A0A0A] hover:bg-[#161616] border border-[#262626] hover:border-[#C5A059]/50 text-left transition-all flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[#161616] text-[#C5A059] border border-[#262626] font-bold">
                      2 MIN
                    </span>
                    <span className="text-xs font-serif text-[#E0E0E0] group-hover:text-[#C5A059]">
                      Minimum Viable Action (MVA)
                    </span>
                  </div>
                  <p className="text-xs text-[#808080] font-serif">
                    Open the single document, write 1 clean line or do 5 slow deep breaths with physical movement.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#808080] group-hover:text-[#C5A059] mt-1 flex-shrink-0" />
              </button>

              {/* Default Option 2: 10-Minute Single Output Sprint */}
              <button
                id="default-recovery-10m-btn"
                onClick={() => handleSelectAction('10-Minute Unbroken Sprint (1 physical output unit delivered)')}
                className="w-full p-4 bg-[#0A0A0A] hover:bg-[#161616] border border-[#262626] hover:border-[#C5A059]/50 text-left transition-all flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[#161616] text-[#6BBF8E] border border-[#262626] font-bold">
                      10 MIN
                    </span>
                    <span className="text-xs font-serif text-[#E0E0E0] group-hover:text-[#C5A059]">
                      Single-Task Micro-Sprint
                    </span>
                  </div>
                  <p className="text-xs text-[#808080] font-serif">
                    Timer running, zero tabs, produce 1 tangible unit (1 function, 1 paragraph, 1 quick log).
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#808080] group-hover:text-[#C5A059] mt-1 flex-shrink-0" />
              </button>
            </>
          )}
        </div>

        {/* Custom Action Input */}
        <div className="pt-3 border-t border-[#262626] flex gap-2">
          <input
            type="text"
            placeholder="Or write custom micro-recovery action..."
            value={customAction}
            onChange={(e) => setCustomAction(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] placeholder-[#555] focus:outline-none focus:border-[#C5A059]"
          />
          <button
            onClick={() => {
              if (customAction.trim()) handleSelectAction(customAction.trim());
            }}
            disabled={!customAction.trim()}
            className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] disabled:opacity-40 text-black text-xs uppercase tracking-widest font-semibold"
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};
