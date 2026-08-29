'use client';

import React, { useState, useEffect } from 'react';
import {
  AppState,
  ViewTab,
  RoutineBlock,
  AgendaTask,
  GratitudeScan,
  DailyJournal,
  InterpretationIntervention,
  FailurePatternLog,
  WeeklyReview,
  RewardItem,
  Goal5Year,
  Goal1Year,
  MonthlyRoleGoal,
  AppSettings,
} from './types';
import { getTodayDateString } from './services/storage';
import { useAppState } from './hooks/useAppState';
import { useAuth } from './hooks/useAuth';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { RoutinesView } from './components/RoutinesView';
import { AgendaView } from './components/AgendaView';
import { GoalsHierarchyView } from './components/GoalsHierarchyView';
import { ConsistencyView } from './components/ConsistencyView';
import { ReviewsView } from './components/ReviewsView';

// Modals and Drawers
import { GratitudeScanModal } from './components/GratitudeScanModal';
import { DailyReviewModal } from './components/DailyReviewModal';
import { InterventionModal } from './components/InterventionModal';
import { AccessProtocolModal } from './components/AccessProtocolModal';
import { RecoveryModal } from './components/RecoveryModal';
import { WeeklyReviewWizard } from './components/WeeklyReviewWizard';
import { RewardsStoreModal } from './components/RewardsStoreModal';
import { AiStewardDrawer } from './components/AiStewardDrawer';
import { SettingsModal } from './components/SettingsModal';
import { playMonasticBell, playBaselineChime } from './services/sound';

export default function App() {
  const { appState, setAppState, loading: stateLoading, error: stateError } = useAppState();
  const { logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewTab>('dashboard');

  // Modals state
  const [isGratitudeScanOpen, setIsGratitudeScanOpen] = useState(false);
  const [isDailyJournalOpen, setIsDailyJournalOpen] = useState(false);
  const [isInterventionOpen, setIsInterventionOpen] = useState(false);
  const [isAccessProtocolOpen, setIsAccessProtocolOpen] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryDefaultAction, setRecoveryDefaultAction] = useState('Deep Work Focus Block');
  const [isWeeklyWizardOpen, setIsWeeklyWizardOpen] = useState(false);
  const [isRewardsStoreOpen, setIsRewardsStoreOpen] = useState(false);
  const [isAiStewardOpen, setIsAiStewardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Recalculate Never-Zero completion for today
  const recalculateDailyNeverZero = (state: AppState): AppState => {
    const today = state.currentDate;
    const completedRoutines = state.routines.filter(
      (r) => r.status === 'completed' || r.status === 'minimum-viable'
    ).length;
    const totalRoutines = state.routines.length || 1;
    const routineRatio = completedRoutines / totalRoutines;

    const todayTasks = state.agendaTasks.filter((t) => t.date === today);
    const completedTasks = todayTasks.filter((t) => t.completed).length;
    const totalTasks = todayTasks.length;
    const taskRatio = totalTasks > 0 ? completedTasks / totalTasks : 1;

    const score = Math.round((routineRatio * 0.6 + taskRatio * 0.4) * 100);

    // Rule: At least 1 non-negotiable or 1 MVA completed means never-zero passed
    const neverZeroPassed = completedRoutines > 0 || completedTasks > 0;

    const updatedCompletions = {
      ...state.dailyCompletions,
      [today]: {
        date: today,
        score,
        completedRoutines,
        totalRoutines,
        completedAgendas: completedTasks,
        totalAgendas: totalTasks,
        neverZeroPassed,
      },
    };

    // Calculate streak
    let streak = 0;
    const dates = Object.keys(updatedCompletions).sort().reverse();
    for (const d of dates) {
      if (updatedCompletions[d]?.neverZeroPassed) {
        streak++;
      } else {
        break;
      }
    }

    return {
      ...state,
      dailyCompletions: updatedCompletions,
      currentStreakNeverZero: Math.max(streak, 1),
    };
  };

  // Routine status update
  const handleUpdateRoutineStatus = (
    routineId: string,
    status: 'pending' | 'completed' | 'minimum-viable' | 'skipped'
  ) => {
    setAppState((prev) => {
      const updatedRoutines = prev.routines.map((r) =>
        r.id === routineId ? { ...r, status } : r
      );
      const pointsDelta = status === 'completed' ? 10 : status === 'minimum-viable' ? 5 : 0;

      const next = {
        ...prev,
        routines: updatedRoutines,
        stewardPoints: prev.stewardPoints + pointsDelta,
      };
      return recalculateDailyNeverZero(next);
    });
  };

  // Add routine
  const handleAddRoutine = (routine: Partial<RoutineBlock>) => {
    setAppState((prev) => ({
      ...prev,
      routines: [
        ...prev.routines,
        {
          id: 'rt-' + Date.now(),
          name: routine.name || 'Custom Routine Block',
          timeStart: routine.timeStart || '09:00',
          timeEnd: routine.timeEnd || '10:00',
          isProtected: !!routine.isProtected,
          items: routine.items || ['Execute focus output'],
          status: 'pending',
        },
      ],
    }));
  };

  // Delete routine
  const handleDeleteRoutine = (routineId: string) => {
    setAppState((prev) => ({
      ...prev,
      routines: prev.routines.filter((r) => r.id !== routineId),
    }));
  };

  // Toggle Agenda Task
  const handleToggleTask = (taskId: string) => {
    setAppState((prev) => {
      const target = prev.agendaTasks.find((t) => t.id === taskId);
      const nextCompleted = !target?.completed;

      const updatedTasks = prev.agendaTasks.map((t) =>
        t.id === taskId ? { ...t, completed: nextCompleted } : t
      );

      let nextRoleGoals = prev.monthlyRoleGoals;
      if (target?.roleGoalId && nextCompleted) {
        nextRoleGoals = prev.monthlyRoleGoals.map((rg) =>
          rg.id === target.roleGoalId
            ? { ...rg, currentOutputCount: rg.currentOutputCount + 1 }
            : rg
        );
      }

      const pointsDelta = nextCompleted ? 15 : -15;

      const next = {
        ...prev,
        agendaTasks: updatedTasks,
        monthlyRoleGoals: nextRoleGoals,
        stewardPoints: Math.max(0, prev.stewardPoints + pointsDelta),
      };
      return recalculateDailyNeverZero(next);
    });
  };

  // Add Agenda Task
  const handleAddTask = (task: Partial<AgendaTask>) => {
    setAppState((prev) => ({
      ...prev,
      agendaTasks: [
        ...prev.agendaTasks,
        {
          id: 'ag-' + Date.now(),
          title: task.title || 'Untitled Agenda Task',
          outputUnit: task.outputUnit || '1 output deliverable',
          date: task.date || prev.currentDate,
          dayOfWeek: task.dayOfWeek ?? new Date(task.date || prev.currentDate).getDay(),
          priority: task.priority || 'medium',
          roleGoalId: task.roleGoalId,
          completed: false,
          estimatedMinutes: task.estimatedMinutes || 45,
        },
      ],
    }));
  };

  // Delete Agenda Task
  const handleDeleteTask = (taskId: string) => {
    setAppState((prev) => ({
      ...prev,
      agendaTasks: prev.agendaTasks.filter((t) => t.id !== taskId),
    }));
  };

  // Move Task Date
  const handleMoveTaskDate = (taskId: string, targetDate: string) => {
    setAppState((prev) => ({
      ...prev,
      agendaTasks: prev.agendaTasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              date: targetDate,
              dayOfWeek: new Date(targetDate).getDay(),
            }
          : t
      ),
    }));
  };

  // Gratitude Scan Save
  const handleSaveGratitudeScan = (scan: GratitudeScan) => {
    setAppState((prev) => {
      const next = {
        ...prev,
        gratitudeScans: {
          ...prev.gratitudeScans,
          [scan.date]: scan,
        },
        stewardPoints: prev.stewardPoints + 20,
      };
      return recalculateDailyNeverZero(next);
    });
  };

  // Toggle Proof Action
  const handleToggleProofAction = () => {
    const today = appState.currentDate;
    const scan = appState.gratitudeScans[today];
    if (!scan) return;

    setAppState((prev) => ({
      ...prev,
      gratitudeScans: {
        ...prev.gratitudeScans,
        [today]: {
          ...scan,
          proofActionCompleted: !scan.proofActionCompleted,
        },
      },
      stewardPoints: prev.stewardPoints + (scan.proofActionCompleted ? -15 : 15),
    }));
  };

  // Daily Journal Save
  const handleSaveDailyJournal = (journal: DailyJournal) => {
    setAppState((prev) => ({
      ...prev,
      dailyJournals: {
        ...prev.dailyJournals,
        [journal.date]: journal,
      },
      stewardPoints: prev.stewardPoints + 20,
    }));
  };

  // Save 5-Step Intervention
  const handleSaveIntervention = (intervention: InterpretationIntervention) => {
    setAppState((prev) => ({
      ...prev,
      interpretationInterventions: [intervention, ...prev.interpretationInterventions],
      stewardPoints: prev.stewardPoints + 15,
    }));
  };

  // Log Failure Pattern
  const handleLogFailurePattern = (log: Partial<FailurePatternLog>) => {
    setAppState((prev) => ({
      ...prev,
      failurePatternLogs: [
        {
          id: 'fp-' + Date.now(),
          date: log.date || prev.currentDate,
          loopType: log.loopType || 'Thinking Loop',
          trigger: log.trigger || 'Unconscious hesitation',
          description: log.description || '',
          recoveryActionTaken: log.recoveryActionTaken || 'Executed 2-min MVA',
          timestamp: new Date().toISOString(),
        },
        ...prev.failurePatternLogs,
      ],
    }));
  };

  // Execute Micro-Recovery
  const handleExecuteRecovery = (actionDescription: string) => {
    setAppState((prev) => {
      const recoveryTask: AgendaTask = {
        id: 'rec-' + Date.now(),
        title: `[Micro-Recovery] ${actionDescription}`,
        outputUnit: '1 zero-debt recovery unit',
        date: prev.currentDate,
        dayOfWeek: new Date().getDay(),
        priority: 'high',
        completed: true,
      };

      const next = {
        ...prev,
        agendaTasks: [recoveryTask, ...prev.agendaTasks],
        stewardPoints: prev.stewardPoints + 15,
      };
      return recalculateDailyNeverZero(next);
    });
  };

  // Save Weekly Review
  const handleSaveWeeklyReview = (review: WeeklyReview) => {
    setAppState((prev) => ({
      ...prev,
      weeklyReviews: [review, ...prev.weeklyReviews],
      stewardPoints: prev.stewardPoints + 50,
    }));
  };

  // Redeem Reward
  const handleRedeemReward = (rewardId: string, pointCost: number) => {
    setAppState((prev) => ({
      ...prev,
      stewardPoints: Math.max(0, prev.stewardPoints - pointCost),
      rewardsStore: prev.rewardsStore.map((r) =>
        r.id === rewardId ? { ...r, unlockedCount: (r.unlockedCount || 0) + 1 } : r
      ),
    }));
  };

  // Add Custom Reward
  const handleAddCustomReward = (reward: Partial<RewardItem>) => {
    setAppState((prev) => ({
      ...prev,
      rewardsStore: [
        ...prev.rewardsStore,
        {
          id: 'rew-' + Date.now(),
          title: reward.title || 'Custom Reward Pass',
          pointCost: reward.pointCost || 50,
          category: reward.category || 'game-time',
          durationMinutes: reward.durationMinutes || 30,
          unlockedCount: 0,
        },
      ],
    }));
  };

  // Increment Role Output
  const handleIncrementRoleOutput = (roleId: string, delta: number) => {
    setAppState((prev) => ({
      ...prev,
      monthlyRoleGoals: prev.monthlyRoleGoals.map((rg) =>
        rg.id === roleId
          ? {
              ...rg,
              currentOutputCount: Math.max(0, rg.currentOutputCount + delta),
            }
          : rg
      ),
      stewardPoints: delta > 0 ? prev.stewardPoints + 15 : prev.stewardPoints,
    }));
  };

  // Add Monthly Role
  const handleAddMonthlyRole = (role: Partial<MonthlyRoleGoal>) => {
    setAppState((prev) => ({
      ...prev,
      monthlyRoleGoals: [
        ...prev.monthlyRoleGoals,
        {
          id: 'rg-' + Date.now(),
          roleName: role.roleName || 'New Role',
          monthlyObjective: role.monthlyObjective || '',
          nonNegotiableBaseline: role.nonNegotiableBaseline || 'Core daily output',
          targetOutputCount: role.targetOutputCount || 20,
          currentOutputCount: 0,
          outputLabel: role.outputLabel || 'Units',
        },
      ],
    }));
  };

  // Update Settings
  const handleUpdateSettings = (settings: Partial<AppSettings>) => {
    setAppState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settings,
      },
    }));
  };

  // Restore state from file / reset
  const handleStateRestored = (newState: AppState) => {
    setAppState(newState);
  };

  const todayScan = appState.gratitudeScans[appState.currentDate];

  if (stateLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] flex items-center justify-center font-sans">
        <p className="font-serif-heading tracking-wide text-[#C5A059] text-sm uppercase">
          Loading your steward…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] flex flex-col font-sans selection:bg-[#C5A059] selection:text-black">
      
      {/* Top Main Navigation */}
      <Navigation
        activeTab={currentView}
        onSelectTab={setCurrentView}
        appState={appState}
        onOpenIntervention={() => setIsInterventionOpen(true)}
        onOpenAccessProtocol={() => setIsAccessProtocolOpen(true)}
        onOpenAiSteward={() => setIsAiStewardOpen(true)}
        onOpenRewards={() => setIsRewardsStoreOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSignOut={() => logout()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'dashboard' && (
          <DashboardView
            appState={appState}
            onUpdateRoutineStatus={handleUpdateRoutineStatus}
            onToggleAgendaTask={handleToggleTask}
            onOpenGratitudeScan={() => setIsGratitudeScanOpen(true)}
            onOpenDailyJournal={() => setIsDailyJournalOpen(true)}
            onOpenIntervention={() => setIsInterventionOpen(true)}
            onOpenAccessProtocol={() => setIsAccessProtocolOpen(true)}
            onOpenRecovery={(missedAction) => {
              if (missedAction) setRecoveryDefaultAction(missedAction);
              setIsRecoveryOpen(true);
            }}
            onOpenAiSteward={() => setIsAiStewardOpen(true)}
            onOpenWeeklyReview={() => setIsWeeklyWizardOpen(true)}
            onNavigateView={setCurrentView}
          />
        )}

        {currentView === 'routines' && (
          <RoutinesView
            appState={appState}
            onUpdateRoutineStatus={handleUpdateRoutineStatus}
            onAddRoutine={handleAddRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onOpenGratitudeScan={() => setIsGratitudeScanOpen(true)}
            onOpenDailyJournal={() => setIsDailyJournalOpen(true)}
          />
        )}

        {currentView === 'agenda' && (
          <AgendaView
            appState={appState}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onMoveTaskDate={handleMoveTaskDate}
          />
        )}

        {currentView === 'goals' && (
          <GoalsHierarchyView
            appState={appState}
            onAdd5YearGoal={() => {}}
            onAdd1YearGoal={() => {}}
            onAddMonthlyRole={handleAddMonthlyRole}
            onIncrementRoleOutput={handleIncrementRoleOutput}
          />
        )}

        {currentView === 'consistency' && (
          <ConsistencyView
            appState={appState}
            onLogFailurePattern={handleLogFailurePattern}
            onOpenRecovery={(missedAction) => {
              if (missedAction) setRecoveryDefaultAction(missedAction);
              setIsRecoveryOpen(true);
            }}
            onOpenAiSteward={() => setIsAiStewardOpen(true)}
          />
        )}

        {currentView === 'reviews' && (
          <ReviewsView
            appState={appState}
            onOpenWeeklyWizard={() => setIsWeeklyWizardOpen(true)}
            onOpenDailyJournal={() => setIsDailyJournalOpen(true)}
          />
        )}
      </main>

      {/* Footer Banner */}
      <footer className="border-t border-[#262626] bg-[#0A0A0A] py-3.5 px-6 text-center text-[10px] uppercase tracking-[0.25em] text-[#808080]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <span>Truth is fixed. Strategy is fluid. • <span className="text-[#C5A059]">StewardOS</span></span>
          <span className="text-[#555]">Never-Zero Baseline Integrity Engine // v1.0</span>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <GratitudeScanModal
        isOpen={isGratitudeScanOpen}
        onClose={() => setIsGratitudeScanOpen(false)}
        todayScan={todayScan}
        onSaveScan={handleSaveGratitudeScan}
        onToggleProofAction={handleToggleProofAction}
      />

      <DailyReviewModal
        isOpen={isDailyJournalOpen}
        onClose={() => setIsDailyJournalOpen(false)}
        appState={appState}
        onSaveJournal={handleSaveDailyJournal}
      />

      <InterventionModal
        isOpen={isInterventionOpen}
        onClose={() => setIsInterventionOpen(false)}
        onSaveIntervention={handleSaveIntervention}
      />

      <AccessProtocolModal
        isOpen={isAccessProtocolOpen}
        onClose={() => setIsAccessProtocolOpen(false)}
      />

      <RecoveryModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
        defaultMissedAction={recoveryDefaultAction}
        onExecuteRecovery={handleExecuteRecovery}
      />

      <WeeklyReviewWizard
        isOpen={isWeeklyWizardOpen}
        onClose={() => setIsWeeklyWizardOpen(false)}
        appState={appState}
        onSaveWeeklyReview={handleSaveWeeklyReview}
      />

      <RewardsStoreModal
        isOpen={isRewardsStoreOpen}
        onClose={() => setIsRewardsStoreOpen(false)}
        appState={appState}
        onRedeemReward={handleRedeemReward}
        onAddCustomReward={handleAddCustomReward}
      />

      <AiStewardDrawer
        isOpen={isAiStewardOpen}
        onClose={() => setIsAiStewardOpen(false)}
        appState={appState}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        appState={appState}
        onUpdateSettings={handleUpdateSettings}
        onStateRestored={handleStateRestored}
      />
    </div>
  );
}
