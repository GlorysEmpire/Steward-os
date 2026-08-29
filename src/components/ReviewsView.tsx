import React, { useState } from 'react';
import {
  Calendar,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Lock,
} from 'lucide-react';
import { AppState, WeeklyReview, MonthlyReview, DailyJournal } from '../types';

interface ReviewsViewProps {
  appState: AppState;
  onOpenWeeklyWizard: () => void;
  onOpenDailyJournal: () => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  appState,
  onOpenWeeklyWizard,
  onOpenDailyJournal,
}) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'daily' | 'monthly'>('weekly');

  const journalsList = (Object.values(appState.dailyJournals) as DailyJournal[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 bg-[#161616] text-[#C5A059] border border-[#262626]">
              Review Protocols
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#E0E0E0] mt-2 tracking-tight">
            Journals & Monastic Audits
          </h1>
          <p className="text-xs text-[#808080] max-w-2xl mt-1 leading-relaxed italic font-serif">
            Empirical inquiry archive and weekly single adjustments. Reviewing past data prevents looping.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="start-sunday-review-btn"
            onClick={onOpenWeeklyWizard}
            className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Run Sunday Audit</span>
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 border-b border-[#262626] pb-2">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-2 text-xs uppercase tracking-widest transition-all font-medium ${
            activeTab === 'weekly'
              ? 'bg-[#161616] text-[#C5A059] border border-[#262626]'
              : 'text-[#808080] hover:text-[#E0E0E0]'
          }`}
        >
          Weekly Audits ({appState.weeklyReviews.length})
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 text-xs uppercase tracking-widest transition-all font-medium ${
            activeTab === 'daily'
              ? 'bg-[#161616] text-[#C5A059] border border-[#262626]'
              : 'text-[#808080] hover:text-[#E0E0E0]'
          }`}
        >
          Evening Journals ({journalsList.length})
        </button>
      </div>

      {/* Content for Weekly Reviews */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          {appState.weeklyReviews.length === 0 ? (
            <div className="text-center py-12 bg-[#111111] border border-[#262626] p-8 space-y-4">
              <p className="text-xs text-[#808080]">No weekly audits recorded yet.</p>
              <button
                onClick={onOpenWeeklyWizard}
                className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold"
              >
                Launch First Sunday Audit
              </button>
            </div>
          ) : (
            appState.weeklyReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 bg-[#111111] border border-[#262626] space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A059]">
                      Week {rev.weekNumber || 34}, {rev.year || 2026}
                    </span>
                    <h3 className="text-lg font-serif text-[#E0E0E0]">
                      Weekly Monastic Audit
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#808080]">
                    {new Date(rev.timestamp).toLocaleDateString()}
                  </span>
                </div>

                {/* The Single Adjustment Callout */}
                <div className="p-4 bg-[#161616] border border-[#C5A059]/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#C5A059] uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>The Single Adjustment:</span>
                  </div>
                  <p className="text-sm font-serif text-[#E0E0E0]">
                    &ldquo;{rev.singleAdjustment}&rdquo;
                  </p>
                </div>

                {/* Role Output Summaries */}
                {rev.roleAssessments && rev.roleAssessments.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    {rev.roleAssessments.map((ra) => (
                      <div
                        key={ra.roleId}
                        className="p-3 bg-[#0A0A0A] border border-[#262626] space-y-1"
                      >
                        <div className="font-serif text-[#E0E0E0]">{ra.roleName}</div>
                        <div className="text-[#808080] text-[11px]">
                          Delivered: <span className="text-[#C5A059] font-mono font-bold">{ra.deliveredOutputUnits}</span> / {ra.targetOutputUnits} units
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dominant Loop & AI Diagnosis */}
                <div className="flex flex-col sm:flex-row gap-4 pt-3 text-xs text-[#E0E0E0] border-t border-[#262626]">
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#808080] block">Dominant Loop</span>
                    <p className="text-xs text-[#E0E0E0]">{rev.dominantLoopDetected || 'None'}</p>
                    <p className="text-[#808080] text-[11px] italic">{rev.loopAnalysisText}</p>
                  </div>

                  {rev.aiDiagnosisNote && (
                    <div className="flex-1 bg-[#161616] p-3 border border-[#262626] text-[#C5A059] text-[11px] italic leading-relaxed">
                      <strong className="text-white not-italic block mb-1">AI Monastic Steward:</strong> {rev.aiDiagnosisNote}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Content for Daily Journals */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          {journalsList.length === 0 ? (
            <div className="text-center py-12 bg-[#111111] border border-[#262626] p-8 space-y-4">
              <p className="text-xs text-[#808080]">No evening journals logged yet.</p>
              <button
                onClick={onOpenDailyJournal}
                className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold"
              >
                Log Today&apos;s 20:20 Journal
              </button>
            </div>
          ) : (
            journalsList.map((j: DailyJournal) => (
              <div
                key={j.date}
                className="p-6 bg-[#111111] border border-[#262626] space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#C5A059]">{j.date}</span>
                    <span
                      className={`text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
                        j.keptWordStatus === 'yes'
                          ? 'bg-[#161616] text-[#6BBF8E] border-[#6BBF8E]/40'
                          : j.keptWordStatus === 'partial'
                          ? 'bg-[#161616] text-[#C5A059] border-[#C5A059]/40'
                          : 'bg-[#161616] text-[#E06C75] border-[#E06C75]/40'
                      }`}
                    >
                      Kept Word: {j.keptWordStatus}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#808080] font-mono">
                    {new Date(j.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">1. Kept Word Evidence</span>
                    <p className="text-[#E0E0E0] pl-2 border-l border-[#262626]">{j.question1}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">2. Unconscious Drift & Triggers</span>
                    <p className="text-[#E0E0E0] pl-2 border-l border-[#262626]">{j.question2}</p>
                  </div>

                  {j.unconsciousTriggers && j.unconsciousTriggers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {j.unconsciousTriggers.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#161616] text-[#808080] border border-[#262626]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">3. Funeral Identity Trajectory</span>
                    <p className="text-[#E0E0E0] pl-2 border-l border-[#262626]">{j.question3}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
