import React, { useState } from 'react';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Zap,
  AlertCircle,
  Plus,
  Moon,
  Feather,
  Edit2,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { AppState, RoutineBlock } from '../types';
import { playBaselineChime } from '../services/sound';

interface RoutinesViewProps {
  appState: AppState;
  onUpdateRoutineStatus: (routineId: string, status: 'pending' | 'completed' | 'minimum-viable' | 'skipped') => void;
  onAddRoutine: (routine: Partial<RoutineBlock>) => void;
  onDeleteRoutine: (routineId: string) => void;
  onOpenGratitudeScan: () => void;
  onOpenDailyJournal: () => void;
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  appState,
  onUpdateRoutineStatus,
  onAddRoutine,
  onDeleteRoutine,
  onOpenGratitudeScan,
  onOpenDailyJournal,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('10:00');
  const [itemsText, setItemsText] = useState('');
  const [isProtected, setIsProtected] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const items = itemsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    onAddRoutine({
      name: name.trim(),
      timeStart,
      timeEnd,
      isProtected,
      status: 'pending',
      items: items.length > 0 ? items : ['Primary focus output block'],
    });

    setName('');
    setItemsText('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 bg-[#161616] text-[#C5A059] border border-[#262626]">
              Schedule & Habit Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#E0E0E0] mt-2 tracking-tight">
            Daily Routine Blocks & Protected Anchors
          </h1>
          <p className="text-xs text-[#808080] max-w-2xl mt-1 leading-relaxed italic font-serif">
            Time-blocked recurring protocols. Fixed anchors (18:00 Gratitude Scan and 20:20 Evening Hard Stop) are non-negotiable boundaries.
          </p>
        </div>

        <button
          id="add-routine-block-btn"
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Routine Block</span>
        </button>
      </div>

      {/* Routine Blocks List */}
      <div className="space-y-4">
        {appState.routines.map((routine) => {
          const isGratitudeScan = routine.isProtected && routine.timeStart === '18:00';
          const isEveningProtocol = routine.isProtected && routine.timeStart === '20:20';

          return (
            <div
              key={routine.id}
              className={`p-6 border transition-all ${
                routine.isProtected
                  ? 'bg-[#161616] border-[#C5A059]/40 shadow-sm'
                  : routine.status === 'completed'
                  ? 'bg-[#111111] border-[#262626] opacity-75'
                  : routine.status === 'minimum-viable'
                  ? 'bg-[#161616] border-[#C5A059]/40'
                  : routine.status === 'skipped'
                  ? 'bg-[#0A0A0A] border-[#222222] opacity-50'
                  : 'bg-[#111111] border-[#262626] hover:border-[#C5A059]/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-[#0A0A0A] text-[#C5A059] border border-[#262626]">
                      {routine.timeStart} — {routine.timeEnd}
                    </span>
                    <h3 className="text-base font-serif text-[#E0E0E0]">
                      {routine.name}
                    </h3>
                    {routine.isProtected && (
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-[#0A0A0A] text-[#C5A059] border border-[#C5A059]/40 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                        Protected Anchor
                      </span>
                    )}
                  </div>

                  {/* Checklist Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {routine.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#808080]">
                        <span className="w-1.5 h-1.5 bg-[#C5A059] flex-shrink-0" />
                        <span className="text-[#A3A3A3]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Controls */}
                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-[#262626]">
                  {isGratitudeScan && (
                    <button
                      id={`open-scan-from-routine-${routine.id}`}
                      onClick={onOpenGratitudeScan}
                      className="px-3 py-1.5 bg-[#161616] hover:bg-[#222222] text-[#C5A059] border border-[#C5A059]/50 text-xs font-medium uppercase tracking-widest flex items-center gap-1.5"
                    >
                      <Feather className="w-3.5 h-3.5" />
                      <span>Execute Scan</span>
                    </button>
                  )}

                  {isEveningProtocol && (
                    <button
                      id={`open-journal-from-routine-${routine.id}`}
                      onClick={onOpenDailyJournal}
                      className="px-3 py-1.5 bg-[#161616] hover:bg-[#222222] text-[#E0E0E0] border border-[#262626] text-xs font-medium uppercase tracking-widest flex items-center gap-1.5"
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Review Journal</span>
                    </button>
                  )}

                  {/* Full Done */}
                  <button
                    id={`routine-full-${routine.id}`}
                    onClick={() => {
                      onUpdateRoutineStatus(routine.id, routine.status === 'completed' ? 'pending' : 'completed');
                      if (routine.status !== 'completed') playBaselineChime();
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                      routine.status === 'completed'
                        ? 'bg-[#6BBF8E] text-black shadow-sm'
                        : 'border border-[#262626] text-[#E0E0E0] hover:border-[#6BBF8E] hover:text-[#6BBF8E]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{routine.status === 'completed' ? 'Completed' : 'Complete'}</span>
                  </button>

                  {/* MVA */}
                  <button
                    id={`routine-mva-${routine.id}`}
                    onClick={() => {
                      onUpdateRoutineStatus(routine.id, routine.status === 'minimum-viable' ? 'pending' : 'minimum-viable');
                      if (routine.status !== 'minimum-viable') playBaselineChime();
                    }}
                    className={`px-3 py-1.5 text-xs font-medium uppercase tracking-widest flex items-center gap-1 transition-all ${
                      routine.status === 'minimum-viable'
                        ? 'bg-[#C5A059] text-black font-bold shadow-sm'
                        : 'border border-[#262626] text-[#808080] hover:border-[#C5A059] hover:text-[#C5A059]'
                    }`}
                    title="Mark Minimum Viable execution"
                  >
                    <Zap className="w-3 h-3 text-[#C5A059]" />
                    <span>MVA</span>
                  </button>

                  {/* Delete (only for non-protected custom blocks) */}
                  {!routine.isProtected && (
                    <button
                      id={`delete-routine-${routine.id}`}
                      onClick={() => onDeleteRoutine(routine.id)}
                      className="p-2 text-[#808080] hover:text-[#E06C75] hover:bg-[#161616] border border-transparent hover:border-[#262626] transition-colors"
                      title="Delete routine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h2 className="text-lg font-serif text-[#E0E0E0]">
                New Routine Block
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-[#808080] hover:text-[#E0E0E0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Routine Block Name</label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon Physical Stewardship"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">End Time</label>
                  <input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Protocol Checklist Items (one per line)</label>
                <textarea
                  rows={3}
                  placeholder="e.g.&#10;500ml water&#10;Mobility sequence&#10;Log reps"
                  value={itemsText}
                  onChange={(e) => setItemsText(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="protected-checkbox"
                  checked={isProtected}
                  onChange={(e) => setIsProtected(e.target.checked)}
                  className="bg-[#0A0A0A] border-[#262626] text-[#C5A059] focus:ring-0"
                />
                <label htmlFor="protected-checkbox" className="text-xs text-[#A3A3A3] cursor-pointer">
                  Mark as Non-Negotiable Protected Anchor
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Create Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
