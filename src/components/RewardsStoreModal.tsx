import React, { useState } from 'react';
import {
  Coins,
  Gamepad2,
  Tv,
  Coffee,
  CheckCircle2,
  X,
  Sparkles,
  Lock,
  Plus,
  Play,
} from 'lucide-react';
import { AppState, RewardItem } from '../types';
import { playBaselineChime } from '../services/sound';

interface RewardsStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  onRedeemReward: (rewardId: string, pointCost: number) => void;
  onAddCustomReward: (reward: Partial<RewardItem>) => void;
}

export const RewardsStoreModal: React.FC<RewardsStoreModalProps> = ({
  isOpen,
  onClose,
  appState,
  onRedeemReward,
  onAddCustomReward,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [pointCost, setPointCost] = useState(60);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [category, setCategory] = useState<'screen-time' | 'game-time' | 'leisure' | 'special'>('game-time');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddCustomReward({
      title: title.trim(),
      pointCost: Number(pointCost) || 50,
      durationMinutes: Number(durationMinutes) || 30,
      category,
      unlockedCount: 0,
    });

    setTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#262626] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-[#161616] text-[#5FBF8C] border border-[#262626]">
                <Coins className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#5FBF8C]">
                Controlled Leisure Economy
              </span>
            </div>
            <h2 className="text-xl font-serif text-[#E0E0E0]">
              Steward Reward & Screen-Time Store
            </h2>
            <p className="text-xs text-[#808080] font-serif italic">
              Transform unconscious escapism into conscious, earned rest. Leisure without guilt.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#808080] hover:text-[#E0E0E0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Card */}
        <div className="p-4 bg-[#161616] border border-[#262626] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#5FBF8C] block">Available Balance</span>
            <div className="text-2xl sm:text-3xl font-mono text-[#E0E0E0] mt-0.5">
              {appState.stewardPoints} <span className="text-xs font-normal text-[#808080] font-sans">pts</span>
            </div>
          </div>

          <div className="text-right text-[10px] text-[#808080] space-y-0.5 font-mono">
            <div>+30 pts / Never-Zero Day</div>
            <div>+20 pts / Gratitude Scan</div>
            <div>+15 pts / Output Unit</div>
          </div>
        </div>

        {/* Rewards List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#808080]">
              Redeemable Passes
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs text-[#5FBF8C] hover:text-[#7FD1A6] font-mono flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Custom Reward</span>
            </button>
          </div>

          {/* Add Reward Form */}
          {showAddForm && (
            <form onSubmit={handleAdd} className="p-4 bg-[#0A0A0A] border border-[#262626] space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-[#808080] block mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 45m Strategy Video Game"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#111111] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#5FBF8C]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-[#808080] block mb-1">Point Cost</label>
                  <input
                    type="number"
                    value={pointCost}
                    onChange={(e) => setPointCost(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-[#111111] border border-[#262626] text-xs text-[#E0E0E0] font-mono focus:outline-none focus:border-[#5FBF8C]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#5FBF8C] hover:bg-[#7FD1A6] text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Create Pass
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {appState.rewardsStore.map((reward) => {
              const canAfford = appState.stewardPoints >= reward.pointCost;

              return (
                <div
                  key={reward.id}
                  className="p-3.5 bg-[#0A0A0A] border border-[#262626] flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif text-[#E0E0E0]">
                        {reward.title}
                      </span>
                      {reward.durationMinutes && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#161616] text-[#808080] border border-[#262626]">
                          {reward.durationMinutes}m duration
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-[#5FBF8C]">
                      Cost: {reward.pointCost} pts
                    </div>
                  </div>

                  <button
                    id={`redeem-btn-${reward.id}`}
                    onClick={() => {
                      if (canAfford) {
                        onRedeemReward(reward.id, reward.pointCost);
                        playBaselineChime();
                      }
                    }}
                    disabled={!canAfford}
                    className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all ${
                      canAfford
                        ? 'bg-[#5FBF8C] hover:bg-[#7FD1A6] text-black shadow-sm'
                        : 'bg-[#161616] border border-[#262626] text-[#555] cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem Pass' : 'Need More Pts'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Philosophy Note */}
        <div className="p-3.5 bg-[#0A0A0A] border border-[#262626] text-xs text-[#808080] font-serif italic leading-relaxed">
          <strong>Non-Addictive Principle:</strong> Leisure is not forbidden; it is governed. When you redeem a pass, enjoy it fully without background anxiety or mental guilt.
        </div>
      </div>
    </div>
  );
};
