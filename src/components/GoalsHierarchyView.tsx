import React, { useState } from 'react';
import {
  Layers,
  Target,
  ShieldAlert,
  Compass,
  Plus,
  CheckCircle2,
  TrendingUp,
  Award,
  ChevronRight,
  Edit2,
  Trash2,
} from 'lucide-react';
import { AppState, Goal5Year, Goal1Year, MonthlyRoleGoal } from '../types';

interface GoalsHierarchyViewProps {
  appState: AppState;
  onAdd5YearGoal: (goal: Partial<Goal5Year>) => void;
  onAdd1YearGoal: (goal: Partial<Goal1Year>) => void;
  onAddMonthlyRole: (role: Partial<MonthlyRoleGoal>) => void;
  onIncrementRoleOutput: (roleId: string, delta: number) => void;
}

export const GoalsHierarchyView: React.FC<GoalsHierarchyViewProps> = ({
  appState,
  onAdd5YearGoal,
  onAdd1YearGoal,
  onAddMonthlyRole,
  onIncrementRoleOutput,
}) => {
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [monthlyObjective, setMonthlyObjective] = useState('');
  const [nonNegotiableBaseline, setNonNegotiableBaseline] = useState('');
  const [targetOutputCount, setTargetOutputCount] = useState(20);
  const [outputLabel, setOutputLabel] = useState('Deep work units');

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    onAddMonthlyRole({
      roleName: roleName.trim(),
      monthlyObjective: monthlyObjective.trim(),
      nonNegotiableBaseline: nonNegotiableBaseline.trim() || 'Daily core execution',
      targetOutputCount: Number(targetOutputCount) || 20,
      currentOutputCount: 0,
      outputLabel: outputLabel.trim() || 'Units',
    });

    setRoleName('');
    setMonthlyObjective('');
    setNonNegotiableBaseline('');
    setShowAddRoleModal(false);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 bg-[#161616] text-[#C5A059] border border-[#262626]">
              Multi-Tier Alignment
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#E0E0E0] mt-2 tracking-tight">
            5-Year Vision → 1-Year Milestones → Monthly Roles
          </h1>
          <p className="text-xs text-[#808080] max-w-2xl mt-1 leading-relaxed italic font-serif">
            Belief in the overarching identity is fixed. Monthly roles specify the physical non-negotiable baselines that guarantee downstream execution.
          </p>
        </div>

        <button
          id="add-monthly-role-btn"
          onClick={() => setShowAddRoleModal(true)}
          className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-2 shadow-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Monthly Role</span>
        </button>
      </div>

      {/* TIER 3 (Most immediate): Monthly Roles & Goals */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#262626] pb-2">
          <Compass className="w-4 h-4 text-[#C5A059]" />
          <h2 className="text-sm uppercase tracking-widest font-serif text-[#E0E0E0]">
            Current Month: Roles, Baselines & Output Counts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appState.monthlyRoleGoals.map((role) => {
            const pct = Math.min(100, Math.round((role.currentOutputCount / role.targetOutputCount) * 100)) || 0;

            return (
              <div
                key={role.id}
                className="bg-[#111111] border border-[#262626] p-6 space-y-4 relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-[#161616] text-[#C5A059] border border-[#262626]">
                      Active Role
                    </span>
                    <h3 className="text-base font-serif text-[#E0E0E0] mt-2">
                      {role.roleName}
                    </h3>
                  </div>

                  {/* Output Counter Controls */}
                  <div className="flex items-center gap-2 bg-[#0A0A0A] px-3 py-1.5 border border-[#262626]">
                    <button
                      id={`dec-role-${role.id}`}
                      onClick={() => onIncrementRoleOutput(role.id, -1)}
                      className="text-xs text-[#808080] hover:text-[#E0E0E0] px-1 font-mono font-bold"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-bold text-[#C5A059] px-1">
                      {role.currentOutputCount} / {role.targetOutputCount}
                    </span>
                    <button
                      id={`inc-role-${role.id}`}
                      onClick={() => onIncrementRoleOutput(role.id, 1)}
                      className="text-xs text-[#C5A059] hover:text-[#D6B570] px-1 font-mono font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#808080]">
                  <strong className="text-[#A3A3A3] font-medium">Objective:</strong> {role.monthlyObjective}
                </p>

                {/* Non-Negotiable Baseline */}
                <div className="p-3 bg-[#161616] border border-[#262626] text-xs text-[#E0E0E0] space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#C5A059] uppercase tracking-wider font-mono">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Non-Negotiable Baseline</span>
                  </div>
                  <p className="text-xs text-[#808080]">{role.nonNegotiableBaseline}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#808080] uppercase tracking-widest">
                    <span>Output Progress ({role.outputLabel}):</span>
                    <span className="text-[#E0E0E0] font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#262626] overflow-hidden">
                    <div
                      className="h-full bg-[#C5A059] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TIER 2: 1-Year Measurable Milestones */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#262626] pb-2">
          <Target className="w-4 h-4 text-[#808080]" />
          <h2 className="text-sm uppercase tracking-widest font-serif text-[#E0E0E0]">
            1-Year Milestones & Targets
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {appState.goals1Year.map((goal) => (
            <div
              key={goal.id}
              className="bg-[#111111] border border-[#262626] p-5 space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-[#808080] font-mono">
                <span className="text-[10px] uppercase">Target: {goal.targetDate}</span>
                <span className="text-[#C5A059] font-bold">{goal.progress}%</span>
              </div>
              <h3 className="text-sm font-serif text-[#E0E0E0] leading-snug">
                {goal.title}
              </h3>
              <div className="text-xs text-[#808080] font-mono">
                Metric: <span className="text-[#A3A3A3]">{goal.metric}</span>
              </div>
              <div className="w-full h-1 bg-[#262626] overflow-hidden mt-2">
                <div
                  className="h-full bg-[#808080]"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TIER 1: 5-Year Anchor Vision */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#262626] pb-2">
          <Award className="w-4 h-4 text-[#C5A059]" />
          <h2 className="text-sm uppercase tracking-widest font-serif text-[#E0E0E0]">
            5-Year Inviolable Anchor Vision
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {appState.goals5Year.map((g5) => (
            <div
              key={g5.id}
              className="bg-[#111111] border border-[#262626] p-6 space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#C5A059] uppercase tracking-widest text-[10px] font-semibold">
                  {g5.pillar}
                </span>
                <span className="text-[#808080] text-[10px]">{g5.targetYear}</span>
              </div>
              <p className="text-xs text-[#A3A3A3] leading-relaxed italic font-serif">
                &ldquo;{g5.vision}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h2 className="text-lg font-serif text-[#E0E0E0]">
                Add Monthly Steward Role
              </h2>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Builder / Lead Engineer"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Monthly Focus Objective</label>
                <input
                  type="text"
                  placeholder="e.g. Complete v1 architecture & ship core engine"
                  value={monthlyObjective}
                  onChange={(e) => setMonthlyObjective(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">
                  Non-Negotiable Daily Baseline <span className="text-[#C5A059]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 90m deep work block with zero browser distractions"
                  value={nonNegotiableBaseline}
                  onChange={(e) => setNonNegotiableBaseline(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Target Output Count</label>
                  <input
                    type="number"
                    value={targetOutputCount}
                    onChange={(e) => setTargetOutputCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Unit Label</label>
                  <input
                    type="text"
                    value={outputLabel}
                    onChange={(e) => setOutputLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                    placeholder="e.g. Sprints"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
