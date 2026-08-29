import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Bot,
  Loader2,
  Zap,
} from 'lucide-react';
import { InterpretationIntervention } from '../types';
import { playBaselineChime } from '../services/sound';

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveIntervention: (intervention: InterpretationIntervention) => void;
}

export const InterventionModal: React.FC<InterventionModalProps> = ({
  isOpen,
  onClose,
  onSaveIntervention,
}) => {
  const [step, setStep] = useState<number>(1);
  const [event, setEvent] = useState('');
  const [automaticNarrative, setAutomaticNarrative] = useState('');
  const [fixedBeliefAnchor, setFixedBeliefAnchor] = useState(
    'Belief is fixed; only strategy and interpretation change.'
  );
  const [productiveReinterpretation, setProductiveReinterpretation] = useState('');
  const [proofAction, setProofAction] = useState('');
  const [stewardNote, setStewardNote] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!isOpen) return null;

  const handleConsultAiCoach = async () => {
    if (!event.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/interpretation-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          automaticNarrative,
          fixedBelief: fixedBeliefAnchor,
        }),
      });

      if (!response.ok) throw new Error('Failed to consult AI coach');
      const data = await response.json();

      if (data.productiveReinterpretation) {
        setProductiveReinterpretation(data.productiveReinterpretation);
      }
      if (data.proofAction) {
        setProofAction(data.proofAction);
      }
      if (data.stewardNote) {
        setStewardNote(data.stewardNote);
      }
      setStep(4);
    } catch (e) {
      console.error('Error with AI Coach:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = () => {
    const item: InterpretationIntervention = {
      id: 'int-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      event: event.trim(),
      automaticNarrative: automaticNarrative.trim(),
      fixedBeliefAnchor: fixedBeliefAnchor.trim(),
      productiveReinterpretation: productiveReinterpretation.trim(),
      proofAction: proofAction.trim(),
      completedProofAction: false,
      stewardNote: stewardNote || undefined,
    };

    onSaveIntervention(item);
    playBaselineChime();
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
                <Brain className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Cognitive State Protocol
              </span>
            </div>
            <h2 className="text-xl font-serif text-[#E0E0E0]">
              5-Step Interpretation Intervention
            </h2>
            <p className="text-xs text-[#808080] font-serif italic">
              Transform reactive distortion and resistance into empirical clarity and an immediate proof action.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#808080] hover:text-[#E0E0E0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="grid grid-cols-5 gap-1.5 pb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s)}
              className={`py-1 text-[10px] font-mono uppercase tracking-widest transition-all ${
                step === s
                  ? 'bg-[#C5A059] text-black font-semibold'
                  : step > s
                  ? 'bg-[#161616] border border-[#262626] text-[#E0E0E0]'
                  : 'bg-[#0A0A0A] border border-[#262626] text-[#555]'
              }`}
            >
              Step {s}
            </button>
          ))}
        </div>

        {/* Step 1: Objective Event */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Step 1 of 5: Objective Event
              </span>
              <h3 className="text-sm font-serif text-[#E0E0E0]">
                What physically happened in concrete reality?
              </h3>
              <p className="text-xs text-[#808080] font-serif italic">
                Sensory physical data only. Strip all emotional commentary, blame, or future catastrophic predictions.
              </p>
            </div>

            <textarea
              rows={4}
              placeholder="e.g. I opened my laptop at 08:30, looked at the API bug for 10 minutes, and opened a social media tab instead of testing the endpoint."
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] placeholder-[#555]"
              autoFocus
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!event.trim()}
                className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] disabled:opacity-40 text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
              >
                <span>Proceed to Narrative</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Automatic Narrative */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Step 2 of 5: Automatic Narrative
              </span>
              <h3 className="text-sm font-serif text-[#E0E0E0]">
                What is the automatic story or victim interpretation?
              </h3>
              <p className="text-xs text-[#808080] font-serif italic">
                Write down the exact ego reaction, fear, or loop trap (e.g. &ldquo;I have lost my edge&rdquo;, &ldquo;Today is ruined&rdquo;).
              </p>
            </div>

            <textarea
              rows={4}
              placeholder="e.g. 'I am too exhausted to solve this bug today. I might as well cancel my afternoon deep work sprint and wait until tomorrow morning.'"
              value={automaticNarrative}
              onChange={(e) => setAutomaticNarrative(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] placeholder-[#555]"
              autoFocus
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!automaticNarrative.trim()}
                className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] disabled:opacity-40 text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
              >
                <span>Proceed to Anchor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Fixed Belief Anchor */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Step 3 of 5: Fixed Belief Anchor
              </span>
              <h3 className="text-sm font-serif text-[#E0E0E0]">
                Re-affirm the Invariant Premise
              </h3>
              <p className="text-xs text-[#808080] font-serif italic">
                The overarching commitment and identity are non-negotiable. Friction is only tactical feedback.
              </p>
            </div>

            <input
              type="text"
              value={fixedBeliefAnchor}
              onChange={(e) => setFixedBeliefAnchor(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] font-serif"
            />

            {/* AI Coach Helper Option */}
            <div className="p-4 bg-[#161616] border border-[#262626] flex items-center justify-between gap-3">
              <div className="text-xs text-[#808080]">
                <span className="font-serif text-[#C5A059] flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" /> AI Steward Coach
                </span>
                <span>Let Gemini generate the empirical reinterpretation and proof action.</span>
              </div>
              <button
                type="button"
                onClick={handleConsultAiCoach}
                disabled={isAiLoading}
                className="px-4 py-1.5 bg-[#0A0A0A] hover:bg-[#222222] text-[#E0E0E0] border border-[#262626] text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 flex-shrink-0"
              >
                {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />}
                <span>Auto-Coach</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
              >
                <span>Proceed to Reinterpretation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Productive Reinterpretation */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Step 4 of 5: Productive Reinterpretation
              </span>
              <h3 className="text-sm font-serif text-[#E0E0E0]">
                Empirical Calibration (Data, Not Failure)
              </h3>
              <p className="text-xs text-[#808080] font-serif italic">
                What does this friction actually reveal about the strategy?
              </p>
            </div>

            <textarea
              rows={4}
              placeholder="e.g. The bug friction indicates that the function is doing too much and needs to be split into 2 smaller helpers. It is not evidence of lack of skill."
              value={productiveReinterpretation}
              onChange={(e) => setProductiveReinterpretation(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] placeholder-[#555]"
              autoFocus
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(5)}
                disabled={!productiveReinterpretation.trim()}
                className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] disabled:opacity-40 text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
              >
                <span>Proceed to Proof Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Physical Proof Action */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Step 5 of 5: Physical Proof Action
              </span>
              <h3 className="text-sm font-serif text-[#E0E0E0]">
                Concrete Physical Execution (Next 15–90 min)
              </h3>
              <p className="text-xs text-[#808080] font-serif italic">
                Belief is validated exclusively through physical output units. What will you execute immediately?
              </p>
            </div>

            <input
              type="text"
              placeholder="e.g. Write 1 unit test for the isolated helper function within 15 minutes."
              value={proofAction}
              onChange={(e) => setProofAction(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#C5A059]/60 text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] font-mono font-medium"
              autoFocus
            />

            {stewardNote && (
              <div className="p-3 bg-[#161616] border border-[#262626] text-xs text-[#C5A059] font-serif italic">
                <strong>Steward Note:</strong> &ldquo;{stewardNote}&rdquo;
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!proofAction.trim()}
                className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] disabled:opacity-40 text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save & Commit Action</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
