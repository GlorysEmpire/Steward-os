import React, { useState, useEffect } from 'react';
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  X,
  Sparkles,
  Bot,
  Loader2,
  Shield,
} from 'lucide-react';
import { playBaselineChime, playMonasticBell } from '../services/sound';

interface AccessProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_PHASES = [
  {
    step: 1,
    name: 'Physiological Interruption',
    instructions: 'Stand up immediately. Drop your shoulders away from your ears. Take 3 slow, deep diaphragmatic breaths (4s in, 4s hold, 6s out). Shake out your hands.',
    durationSeconds: 30,
  },
  {
    step: 2,
    name: 'Data Disconnection',
    instructions: 'Recognize that fatigue, anxiety, or resistance are merely biological sensations, not moral verdicts. You are the observer of the data, not the sensation.',
    durationSeconds: 45,
  },
  {
    step: 3,
    name: 'Fixed Belief Anchor',
    instructions: 'Re-anchor your mind to the non-negotiable premise: "My identity as a disciplined builder is fixed. I do not negotiate with mood. I only negotiate strategy."',
    durationSeconds: 30,
  },
  {
    step: 4,
    name: 'Immediate Micro-Output',
    instructions: 'Perform one single physical execution unit right now (open the single active file, write 1 sentence, do 5 pushups). Break the inertia instantly.',
    durationSeconds: 60,
  },
];

export const AccessProtocolModal: React.FC<AccessProtocolModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_PHASES[0].durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [phases, setPhases] = useState(DEFAULT_PHASES);
  const [currentState, setCurrentState] = useState('Resistant / Overthinking');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      playBaselineChime();
      if (currentPhaseIdx < phases.length - 1) {
        setCurrentPhaseIdx((prev) => prev + 1);
        setTimeLeft(phases[currentPhaseIdx + 1].durationSeconds);
      } else {
        setIsRunning(false);
        playMonasticBell();
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentPhaseIdx, phases]);

  if (!isOpen) return null;

  const currentPhase = phases[currentPhaseIdx];

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(currentPhase.durationSeconds);
  };

  const handleSelectPhase = (idx: number) => {
    setCurrentPhaseIdx(idx);
    setTimeLeft(phases[idx].durationSeconds);
    setIsRunning(false);
  };

  const handleTailorWithAi = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/access-protocol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentState }),
      });
      if (!res.ok) throw new Error('Failed to generate tailored protocol');
      const data = await res.json();
      if (data.phases && Array.isArray(data.phases)) {
        setPhases(data.phases);
        setCurrentPhaseIdx(0);
        setTimeLeft(data.phases[0].durationSeconds || 30);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#262626] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-[#161616] text-[#5FBF8C] border border-[#262626]">
                <Compass className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#5FBF8C]">
                Guided Somatic Reset
              </span>
            </div>
            <h2 className="text-xl font-serif text-[#E0E0E0]">
              Access Protocol
            </h2>
            <p className="text-xs text-[#808080] font-serif italic">
              4 structured somatic phases to break cognitive paralysis and restore execution state.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#808080] hover:text-[#E0E0E0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State Selector & AI Tailor */}
        <div className="flex items-center justify-between gap-3 bg-[#0A0A0A] p-3 border border-[#262626]">
          <div className="flex-1">
            <label className="text-[9px] uppercase tracking-widest font-mono text-[#808080] block">Current State:</label>
            <select
              value={currentState}
              onChange={(e) => setCurrentState(e.target.value)}
              className="bg-transparent text-xs text-[#E0E0E0] focus:outline-none font-serif mt-0.5"
            >
              <option value="Resistant / Overthinking" className="bg-[#111111]">Resistant / Overthinking</option>
              <option value="Fatigued / Low Energy" className="bg-[#111111]">Fatigued / Low Energy</option>
              <option value="Scattered / Distracted" className="bg-[#111111]">Scattered / Distracted</option>
              <option value="Post-Interruption Spiral" className="bg-[#111111]">Post-Interruption Spiral</option>
            </select>
          </div>

          <button
            id="tailor-access-protocol-ai-btn"
            onClick={handleTailorWithAi}
            disabled={isAiLoading}
            className="px-3.5 py-1.5 bg-[#161616] hover:bg-[#222222] border border-[#262626] text-[#E0E0E0] text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5 flex-shrink-0"
          >
            {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5 text-[#5FBF8C]" />}
            <span>Tailor Flow</span>
          </button>
        </div>

        {/* Phase Tabs */}
        <div className="grid grid-cols-4 gap-1.5">
          {phases.map((p, idx) => (
            <button
              key={p.step}
              onClick={() => handleSelectPhase(idx)}
              className={`p-2.5 text-left border transition-all ${
                currentPhaseIdx === idx
                  ? 'bg-[#161616] border-[#5FBF8C] text-[#5FBF8C]'
                  : 'bg-[#0A0A0A] border-[#262626] text-[#808080] hover:text-[#E0E0E0]'
              }`}
            >
              <div className="text-[9px] uppercase font-mono tracking-widest">Phase {p.step}</div>
              <div className="text-xs font-serif truncate mt-0.5">{p.name}</div>
            </button>
          ))}
        </div>

        {/* Active Phase Card */}
        <div className="p-6 bg-[#0A0A0A] border border-[#262626] space-y-4 text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5FBF8C]">
            Phase {currentPhase.step}: {currentPhase.name}
          </span>

          <p className="text-sm text-[#E0E0E0] font-serif leading-relaxed max-w-md mx-auto">
            {currentPhase.instructions}
          </p>

          {/* Countdown Clock */}
          <div className="text-4xl sm:text-5xl font-mono text-[#5FBF8C] py-2">
            00:{String(timeLeft).padStart(2, '0')}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              id="access-protocol-timer-toggle"
              onClick={handleToggleTimer}
              className="px-6 py-2 bg-[#5FBF8C] hover:bg-[#7FD1A6] text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-2 shadow-sm"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 bg-[#161616] hover:bg-[#222222] border border-[#262626] text-[#808080] hover:text-[#E0E0E0] transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#262626]">
          <button
            onClick={() => {
              if (currentPhaseIdx > 0) handleSelectPhase(currentPhaseIdx - 1);
            }}
            disabled={currentPhaseIdx === 0}
            className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] disabled:opacity-30 text-xs uppercase tracking-widest"
          >
            Previous
          </button>

          {currentPhaseIdx < phases.length - 1 ? (
            <button
              onClick={() => handleSelectPhase(currentPhaseIdx + 1)}
              className="px-4 py-2 bg-[#161616] hover:bg-[#222222] border border-[#262626] text-[#E0E0E0] text-xs uppercase tracking-widest font-semibold"
            >
              Next Phase
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#6BBF8E] hover:bg-[#7DCFA0] text-black text-xs uppercase tracking-widest font-semibold"
            >
              Complete Protocol
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
