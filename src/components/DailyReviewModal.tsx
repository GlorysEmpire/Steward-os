import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Moon,
  Shield,
  X,
  Lock,
  Tag,
  Plus,
} from 'lucide-react';
import { DailyJournal, AppState } from '../types';
import { playEveningGong } from '../services/sound';

interface DailyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  onSaveJournal: (journal: DailyJournal) => void;
}

export const DailyReviewModal: React.FC<DailyReviewModalProps> = ({
  isOpen,
  onClose,
  appState,
  onSaveJournal,
}) => {
  const today = appState.currentDate;
  const existing = appState.dailyJournals[today];

  const [keptWordStatus, setKeptWordStatus] = useState<'yes' | 'partial' | 'no'>(
    existing?.keptWordStatus || 'yes'
  );
  const [q1, setQ1] = useState(existing?.question1 || '');
  const [q2, setQ2] = useState(existing?.question2 || '');
  const [q3, setQ3] = useState(existing?.question3 || '');
  const [triggerInput, setTriggerInput] = useState('');
  const [triggers, setTriggers] = useState<string[]>(
    existing?.unconsciousTriggers || ['Fatigue during task switching']
  );

  if (!isOpen) return null;

  const handleAddTrigger = () => {
    if (triggerInput.trim() && !triggers.includes(triggerInput.trim())) {
      setTriggers([...triggers, triggerInput.trim()]);
      setTriggerInput('');
    }
  };

  const handleRemoveTrigger = (t: string) => {
    setTriggers(triggers.filter((item) => item !== t));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const journal: DailyJournal = {
      date: today,
      timestamp: new Date().toISOString(),
      question1: q1.trim() || 'Executed scheduled baselines and protected the core wire.',
      keptWordStatus,
      question2: q2.trim() || 'No major unconscious drift identified.',
      question3: q3.trim() || 'Acted in full alignment with legacy values.',
      unconsciousTriggers: triggers,
      funeralIdentityAffirmation: appState.settings.funeralIdentitySummary,
    };

    onSaveJournal(journal);
    playEveningGong();
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
                <Moon className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                20:20 Evening Protocol
              </span>
            </div>
            <h2 className="text-xl font-serif text-[#E0E0E0]">
              Daily Structured Review (3 Inquiries)
            </h2>
            <p className="text-xs text-[#808080] font-serif italic">
              Honest audit of today&apos;s output units, unconscious slip-ups, and character trajectory.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#808080] hover:text-[#E0E0E0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Inquiry 1: Did I keep my word today? */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-serif text-[#E0E0E0] block">
                1. Did I keep my word today?
              </label>

              {/* Kept Word Status Selector */}
              <div className="flex items-center gap-1.5">
                {(['yes', 'partial', 'no'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setKeptWordStatus(status)}
                    className={`px-3 py-1 text-xs font-mono uppercase tracking-widest transition-all ${
                      keptWordStatus === status
                        ? status === 'yes'
                          ? 'bg-[#6BBF8E] text-black font-semibold'
                          : status === 'partial'
                          ? 'bg-[#C5A059] text-black font-semibold'
                          : 'bg-[#E06C75] text-white font-semibold'
                        : 'bg-[#161616] border border-[#262626] text-[#808080] hover:text-[#E0E0E0]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={2}
              placeholder="Describe physical evidence of kept commitments or exact failure points..."
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] placeholder-[#555]"
              required
            />
          </div>

          {/* Inquiry 2: Where did I act unconsciously? */}
          <div className="space-y-2">
            <label className="text-xs font-serif text-[#E0E0E0] block">
              2. Where did I act unconsciously? (Habitual drift, distraction, avoidance)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Scrolled phone for 20 minutes before afternoon deep work sprint due to task resistance..."
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] placeholder-[#555]"
              required
            />

            {/* Triggers Tags */}
            <div className="pt-1">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {triggers.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 bg-[#161616] text-[#A3A3A3] border border-[#262626] flex items-center gap-1.5"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTrigger(t)}
                      className="text-[#808080] hover:text-[#E0E0E0]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add unconscious trigger tag (e.g. Phone on desk, Post-lunch slump)"
                  value={triggerInput}
                  onChange={(e) => setTriggerInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTrigger();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] placeholder-[#555] focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="button"
                  onClick={handleAddTrigger}
                  className="px-4 py-1.5 bg-[#161616] hover:bg-[#222222] border border-[#262626] text-[#E0E0E0] text-xs font-semibold uppercase tracking-widest"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Inquiry 3: Did I move toward my funeral identity? */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-serif text-[#E0E0E0] block">
                3. Did I move toward my funeral identity?
              </label>
            </div>

            {/* Funeral Identity Callout */}
            <div className="p-3 bg-[#0A0A0A] border border-[#262626] text-xs text-[#808080] font-serif italic">
              &ldquo;{appState.settings.funeralIdentitySummary}&rdquo;
            </div>

            <textarea
              rows={2}
              placeholder="Reflect on today's actions in light of who you intend to be remembered as..."
              value={q3}
              onChange={(e) => setQ3(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] placeholder-[#555]"
              required
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
            <div className="text-[10px] text-[#808080] font-mono flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#C5A059]" />
              <span>Saves & reinforces evening shutdown</span>
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
                <span>Save Review</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
