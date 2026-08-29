import React, { useState } from 'react';
import {
  ShieldCheck,
  Flame,
  CheckCircle,
  Circle,
  Clock,
  Sparkles,
  Zap,
  HelpCircle,
  AlertOctagon,
  Moon,
  Tv,
  Gamepad2,
  Plus,
  ArrowRight,
  TrendingUp,
  Brain,
  Feather,
  BookOpen,
  SlidersHorizontal,
  Check,
  X,
  Bot,
  AlertTriangle,
} from 'lucide-react';
import { AppState, RoutineBlock, AgendaTask, ViewTab } from '../types';
import { playBaselineChime, playMonasticBell } from '../services/sound';

interface DashboardViewProps {
  appState: AppState;
  onUpdateRoutineStatus: (
    routineId: string,
    status: 'pending' | 'completed' | 'minimum-viable' | 'skipped'
  ) => void;
  onToggleAgendaTask: (taskId: string) => void;
  onOpenGratitudeScan: () => void;
  onOpenDailyJournal: () => void;
  onOpenIntervention: () => void;
  onOpenAccessProtocol: () => void;
  onOpenRecovery: (missedActionTitle?: string) => void;
  onOpenAiSteward: () => void;
  onOpenWeeklyReview: () => void;
  onNavigateView: (tab: ViewTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  appState,
  onUpdateRoutineStatus,
  onToggleAgendaTask,
  onOpenGratitudeScan,
  onOpenDailyJournal,
  onOpenIntervention,
  onOpenAccessProtocol,
  onOpenRecovery,
  onOpenAiSteward,
  onOpenWeeklyReview,
  onNavigateView,
}) => {
  const today = appState.currentDate;
  const todayCompletions = appState.dailyCompletions[today] || {
    neverZeroPassed: false,
    score: 0,
    completedRoutines: 0,
    totalRoutines: 0,
    completedAgendas: 0,
    totalAgendas: 0,
  };

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskOutput, setNewTaskOutput] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [showTaskForm, setShowTaskForm] = useState(false);

  const completedRoutinesCount = appState.routines.filter(
    (r) => r.status === 'completed' || r.status === 'minimum-viable'
  ).length;
  const totalRoutinesCount = appState.routines.length;

  const todayTasks = appState.agendaTasks.filter((t) => t.date === today);
  const completedTasksCount = todayTasks.filter((t) => t.completed).length;

  const todayJournal = appState.dailyJournals[today];
  const todayScan = appState.gratitudeScans[today];
  const latestWeeklyReview = appState.weeklyReviews[0];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: AgendaTask = {
      id: 'task-' + Date.now(),
      title: newTaskTitle.trim(),
      outputUnit: newTaskOutput.trim() || '1 output deliverable',
      date: today,
      dayOfWeek: new Date().getDay(),
      priority: newTaskPriority,
      completed: false,
    };
    appState.agendaTasks.push(newTask);
    setNewTaskTitle('');
    setNewTaskOutput('');
    setShowTaskForm(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Operational Header */}
      <div className="border border-[#262626] bg-[#111111] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-none bg-[#161616] border border-[#262626] text-[#5FBF8C] text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5FBF8C]" />
              Never-Zero Baseline Integrity
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#808080]">
              Streak: <strong className="text-white font-serif text-xs">{appState.currentStreakNeverZero}d</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#E0E0E0] tracking-tight">
            Daily Command Center
          </h1>
          <p className="text-xs text-[#808080] max-w-2xl italic font-serif leading-relaxed">
            &ldquo;{appState.settings.fixedCoreBelief || 'Truth is fixed. Strategy is fluid.'}&rdquo;
          </p>
        </div>

        {/* Top Quick Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="dash-access-protocol-btn"
            onClick={onOpenAccessProtocol}
            className="px-4 py-2.5 text-xs border border-[#262626] hover:bg-white hover:text-black text-[#E0E0E0] transition-all uppercase tracking-widest font-medium"
          >
            Access Protocol
          </button>
          <button
            id="dash-start-gratitude-scan-btn"
            onClick={onOpenGratitudeScan}
            className="px-4 py-2.5 text-xs bg-[#5FBF8C] hover:bg-[#7FD1A6] text-black font-semibold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Start 18:00 Scan</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards matching Design Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-[#161616] border border-[#262626]">
          <p className="text-[10px] uppercase tracking-widest text-[#808080] mb-2 font-medium">Never-Zero Baseline</p>
          <p className="text-2xl font-serif text-white flex items-baseline gap-2">
            {completedRoutinesCount}/{totalRoutinesCount}
            <span className="text-xs italic text-[#808080] font-sans">({todayCompletions.score}% Achieved)</span>
          </p>
        </div>

        <div className="p-5 bg-[#161616] border border-[#262626]">
          <p className="text-[10px] uppercase tracking-widest text-[#808080] mb-2 font-medium">Active Operating Anchor</p>
          <p className="text-2xl font-serif text-[#5FBF8C] flex items-baseline gap-2 truncate">
            Deep Work Focus
            <span className="text-xs italic text-[#808080] font-sans">Protected 18:00 Fixed</span>
          </p>
        </div>

        <div className="p-5 bg-[#161616] border border-[#262626]">
          <p className="text-[10px] uppercase tracking-widest text-[#808080] mb-2 font-medium">System Failure Loops</p>
          <p className="text-2xl font-serif text-[#6BBF8E] flex items-baseline gap-2">
            {appState.failurePatternLogs.filter(f => f.date === today).length === 0 ? 'None Detected' : `${appState.failurePatternLogs.filter(f => f.date === today).length} Logged`}
            <span className="text-xs italic text-[#808080] font-sans">Stable</span>
          </p>
        </div>
      </div>

      {/* Grid Layout: Left 8 cols, Right 4 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Routines & Agenda Deliverables (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section: Daily Routines & Never-Zero Anchors */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div>
                <h2 className="text-xl font-serif text-[#E0E0E0] flex items-center gap-2">
                  Daily Baseline Anchors
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-[#808080] mt-0.5">
                  Non-negotiable blocks • Minimum Viable Action (MVA) Safeguard
                </p>
              </div>
              <button
                id="dash-recovery-btn"
                onClick={() => onOpenRecovery()}
                className="text-[10px] uppercase tracking-widest font-mono text-[#5FBF8C] hover:text-white border border-[#262626] hover:border-[#5FBF8C] px-3 py-1.5 transition-all flex items-center gap-1.5"
                title="Stuck or fell off? Generate immediate zero-debt micro recovery action"
              >
                <Zap className="w-3 h-3 text-[#5FBF8C]" />
                <span>Zero-Debt Micro Recovery</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {appState.routines.map((routine) => {
                const isCompleted = routine.status === 'completed';
                const isMva = routine.status === 'minimum-viable';
                const isSkipped = routine.status === 'skipped';

                return (
                  <div
                    key={routine.id}
                    className={`p-4 bg-[#111111] border transition-all ${
                      isCompleted
                        ? 'border-[#262626] bg-[#111111] opacity-75'
                        : isMva
                        ? 'border-[#5FBF8C]/40 bg-[#161616]'
                        : isSkipped
                        ? 'border-[#333] opacity-50 bg-[#0A0A0A]'
                        : 'border-[#262626] hover:border-[#5FBF8C]/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-[#161616] text-[#5FBF8C] border border-[#262626]">
                            {routine.timeStart} – {routine.timeEnd}
                          </span>
                          <h3
                            className={`text-sm font-medium ${
                              isCompleted
                                ? 'text-[#808080] line-through'
                                : isMva
                                ? 'text-[#5FBF8C]'
                                : 'text-[#E0E0E0]'
                            }`}
                          >
                            {routine.name}
                          </h3>
                          {routine.isProtected && (
                            <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-[#161616] text-[#5FBF8C] border border-[#5FBF8C]/40 tracking-wider">
                              Protected Anchor
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#808080] pl-0.5">
                          {routine.items.join(' • ')}
                        </div>
                      </div>

                      {/* Action Status Controls */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Full Complete Button */}
                        <button
                          id={`complete-btn-${routine.id}`}
                          onClick={() => {
                            const next = isCompleted ? 'pending' : 'completed';
                            onUpdateRoutineStatus(routine.id, next);
                            if (next === 'completed') playBaselineChime();
                          }}
                          className={`px-3 py-1.5 text-xs uppercase tracking-widest transition-all font-semibold ${
                            isCompleted
                              ? 'bg-[#6BBF8E] text-black shadow-sm'
                              : 'border border-[#262626] text-[#E0E0E0] hover:border-[#6BBF8E] hover:text-[#6BBF8E]'
                          }`}
                          title="Mark Full Completion"
                        >
                          {isCompleted ? 'Done' : 'Full'}
                        </button>

                        {/* Minimum Viable Action (MVA) Button */}
                        <button
                          id={`mva-btn-${routine.id}`}
                          onClick={() => {
                            const next = isMva ? 'pending' : 'minimum-viable';
                            onUpdateRoutineStatus(routine.id, next);
                            if (next === 'minimum-viable') playBaselineChime();
                          }}
                          className={`px-2.5 py-1.5 text-xs uppercase tracking-widest transition-all ${
                            isMva
                              ? 'bg-[#5FBF8C] text-black font-bold shadow-sm'
                              : 'border border-[#262626] text-[#808080] hover:border-[#5FBF8C] hover:text-[#5FBF8C]'
                          }`}
                          title="Fulfill via Minimum Viable Action"
                        >
                          MVA
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Today's Finite Agenda Deliverables */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div>
                <h2 className="text-xl font-serif italic text-[#E0E0E0] flex items-center gap-2">
                  Today&apos;s Agenda
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-[#808080] mt-0.5">
                  Finite Tasks Only • Discrete Output Deliverables
                </p>
              </div>
              <button
                id="dash-add-task-toggle"
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="text-[10px] uppercase tracking-widest px-3 py-1.5 bg-[#161616] hover:bg-[#222222] text-[#E0E0E0] border border-[#262626] hover:border-[#5FBF8C] flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3 h-3 text-[#5FBF8C]" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Quick Task Creation Form */}
            {showTaskForm && (
              <form onSubmit={handleCreateTask} className="p-4 bg-[#161616] border border-[#262626] space-y-3">
                <input
                  type="text"
                  placeholder="Task title (e.g. Draft Q4 strategic stewardship brief)"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] placeholder-[#555] focus:outline-none focus:border-[#5FBF8C]"
                  autoFocus
                />
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Output deliverable unit (e.g. 1 signed doc)"
                    value={newTaskOutput}
                    onChange={(e) => setNewTaskOutput(e.target.value)}
                    className="flex-1 min-w-[200px] px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] placeholder-[#555] focus:outline-none focus:border-[#5FBF8C]"
                  />
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#808080] focus:outline-none focus:border-[#5FBF8C]"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#5FBF8C] hover:bg-[#7FD1A6] text-black text-xs uppercase tracking-widest font-semibold"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {todayTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#555] border border-[#262626] bg-[#111111]">
                  No finite agenda tasks scheduled for today. Focus on non-negotiable baselines.
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleAgendaTask(task.id)}
                    className={`group flex items-center p-4 bg-[#111111] border transition-all cursor-pointer ${
                      task.completed
                        ? 'border-[#262626] opacity-50'
                        : 'border-[#262626] hover:border-[#5FBF8C]'
                    }`}
                  >
                    <div className="w-4 h-4 border border-[#5FBF8C] mr-4 flex items-center justify-center flex-shrink-0">
                      {task.completed ? (
                        <div className="w-2.5 h-2.5 bg-[#5FBF8C]"></div>
                      ) : (
                        <div className="w-2.5 h-2.5 bg-transparent group-hover:bg-[#5FBF8C]/30 transition-colors"></div>
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm ${
                            task.completed ? 'line-through text-[#808080]' : 'text-[#E0E0E0]'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 border ${
                            task.priority === 'high'
                              ? 'bg-[#161616] text-[#E06C75] border-[#E06C75]/40'
                              : task.priority === 'medium'
                              ? 'bg-[#161616] text-[#5FBF8C] border-[#5FBF8C]/40'
                              : 'bg-[#161616] text-[#808080] border-[#262626]'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#808080]">
                        Output: <strong className="text-[#A3A3A3]">{task.outputUnit}</strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Next Protocols & Identity Horizon (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Next Protocol */}
          <div className="p-6 border border-[#262626] bg-[#0F0F0F] space-y-4">
            <h3 className="font-serif text-lg italic text-[#E0E0E0]">Next Protocol</h3>
            
            <div className="space-y-4">
              {/* 18:00 Gratitude Scan Anchor */}
              <div
                onClick={onOpenGratitudeScan}
                className="flex items-start space-x-4 p-3 bg-[#161616] border border-[#262626] hover:border-[#5FBF8C] cursor-pointer transition-all"
              >
                <div className="text-xs font-serif text-[#5FBF8C] mt-0.5">18:00</div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#E0E0E0]">Gratitude Scan</p>
                    {todayScan && (
                      <span className="text-[9px] uppercase tracking-widest text-[#6BBF8E] font-semibold">Done</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#808080] uppercase tracking-wider leading-relaxed">
                    4 Questions • Protected Block
                  </p>
                  {todayScan?.q4ProofAction && (
                    <p className="text-[11px] text-[#5FBF8C] italic truncate">
                      Proof: &ldquo;{todayScan.q4ProofAction}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* 20:20 Evening Protocol Anchor */}
              <div
                onClick={onOpenDailyJournal}
                className="flex items-start space-x-4 p-3 bg-[#161616] border border-[#262626] hover:border-[#5FBF8C] cursor-pointer transition-all"
              >
                <div className="text-xs font-serif text-[#808080] mt-0.5">20:20</div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#808080]">Evening Protocol</p>
                    {todayJournal && (
                      <span className="text-[9px] uppercase tracking-widest text-[#6BBF8E] font-semibold">Done</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#808080] uppercase tracking-wider leading-relaxed">
                    Hard Stop • Digital Sunset & 3 Inquiries
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Identity Horizon */}
          <div className="p-6 bg-[#161616] border border-[#262626] space-y-4">
            <h3 className="font-serif text-sm uppercase tracking-widest text-[#5FBF8C]">Identity Horizon</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#808080]">5-Year Vision Pillar</p>
                <p className="text-xs italic font-serif text-[#E0E0E0] leading-relaxed mt-1">
                  &ldquo;{appState.goals5Year[0]?.vision || 'The calm steward operating in total empirical truth and consistent baseline output.'}&rdquo;
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#808080]">Current Monthly Roles</p>
                <ul className="text-xs space-y-1.5 mt-2">
                  {appState.monthlyRoleGoals.slice(0, 3).map((role, idx) => (
                    <li key={role.id} className="flex items-center justify-between text-[#E0E0E0]">
                      <span>• {role.roleName}</span>
                      <span className="text-[#5FBF8C] font-mono text-[11px]">
                        {role.currentOutputCount}/{role.targetOutputCount} {role.outputLabel}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Card: State Interventions & Monastic AI */}
          <div className="p-6 bg-[#111111] border border-[#262626] space-y-3">
            <h3 className="font-serif text-sm uppercase tracking-widest text-[#5FBF8C]">Intervention Protocols</h3>
            
            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="dash-open-intervention-btn"
                onClick={onOpenIntervention}
                className="p-3 bg-[#161616] hover:bg-[#202020] border border-[#262626] hover:border-[#5FBF8C] text-left transition-all group"
              >
                <div className="text-xs font-semibold text-[#E0E0E0] group-hover:text-[#5FBF8C]">
                  Interpretation
                </div>
                <div className="text-[10px] text-[#808080] mt-1">
                  5-step reframe
                </div>
              </button>

              <button
                id="dash-open-access-protocol-btn"
                onClick={onOpenAccessProtocol}
                className="p-3 bg-[#161616] hover:bg-[#202020] border border-[#262626] hover:border-[#5FBF8C] text-left transition-all group"
              >
                <div className="text-xs font-semibold text-[#E0E0E0] group-hover:text-[#5FBF8C]">
                  Access Reset
                </div>
                <div className="text-[10px] text-[#808080] mt-1">
                  Somatic release
                </div>
              </button>
            </div>

            <button
              onClick={onOpenAiSteward}
              className="w-full py-2.5 px-3 bg-[#161616] hover:bg-[#222222] border border-[#262626] hover:border-[#5FBF8C] text-[#5FBF8C] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all mt-2"
            >
              <Bot className="w-4 h-4 text-[#5FBF8C]" />
              <span>Consult AI Steward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
