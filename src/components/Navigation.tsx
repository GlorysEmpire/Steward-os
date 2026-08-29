import React, { useState, useEffect } from 'react';
import {
  Shield,
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
  BookOpen,
  Sparkles,
  Bot,
  Sliders,
  Moon,
  Clock,
  Coins,
  AlertTriangle,
  Gift,
  Feather,
  LogOut,
} from 'lucide-react';
import { AppState, ViewTab } from '../types';
import { getMinutesUntil } from '../lib/utils';

interface NavigationProps {
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  appState: AppState;
  onOpenIntervention: () => void;
  onOpenAccessProtocol: () => void;
  onOpenAiSteward: () => void;
  onOpenRewards: () => void;
  onOpenSettings: () => void;
  onSignOut?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  appState,
  onOpenIntervention,
  onOpenAccessProtocol,
  onOpenAiSteward,
  onOpenRewards,
  onOpenSettings,
  onSignOut,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [minToScan, setMinToScan] = useState<number>(0);
  const [minToStop, setMinToStop] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setMinToScan(getMinutesUntil(appState.settings.gratitudeScanTime || '18:00'));
      setMinToStop(getMinutesUntil(appState.settings.hardStopEveningTime || appState.settings.eveningProtocolTime || '20:20'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [appState.settings]);

  const latestWeeklyReview = appState.weeklyReviews[0];
  const activeSingleAdjustment = latestWeeklyReview?.singleAdjustment;

  const todayDate = appState.currentDate;
  const todayScan = appState.gratitudeScans[todayDate];
  const scanDone = !!todayScan;

  return (
    <header className="border-b border-[#262626] bg-[#0A0A0A]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner for Protected Block Alerts */}
      <div className="bg-[#0F0F0F] border-b border-[#262626] px-4 sm:px-6 py-1.5 text-xs text-[#808080] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[#5FBF8C] font-medium text-[11px] tracking-wide">
            <Clock className="w-3.5 h-3.5" />
            {timeStr}
          </span>
          <span className="text-[#333]">|</span>
          <span className="text-[#A3A3A3] text-[11px]">
            {minToScan > 0 ? (
              <span>
                Gratitude Scan (18:00): in <strong className="text-[#5FBF8C] font-semibold">{minToScan}m</strong>
              </span>
            ) : scanDone ? (
              <span className="text-[#6BBF8E] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 inline" /> 18:00 Scan Done
              </span>
            ) : (
              <span className="text-[#5FBF8C] font-semibold animate-pulse">
                18:00 Gratitude Scan Window Active
              </span>
            )}
          </span>
          <span className="text-[#333]">|</span>
          <span className="text-[#A3A3A3] text-[11px]">
            {minToStop > 0 ? (
              <span>
                Evening Hard Stop (20:20): in <strong className="text-[#5FBF8C] font-semibold">{minToStop}m</strong>
              </span>
            ) : (
              <span className="text-[#E06C75] font-semibold">
                Post-20:20 Device Blackout Window
              </span>
            )}
          </span>
        </div>

        {/* Single Adjustment active banner */}
        {activeSingleAdjustment && (
          <div className="hidden lg:flex items-center gap-2 bg-[#161616] border border-[#333] px-3 py-0.5 rounded text-[11px] text-[#E0E0E0]">
            <span className="text-[#5FBF8C] font-serif font-bold uppercase tracking-widest text-[9px]">Single Adjustment:</span>
            <span className="truncate max-w-xs italic font-serif text-[#5FBF8C]">&ldquo;{activeSingleAdjustment}&rdquo;</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Steward Points */}
          <button
            id="nav-rewards-btn"
            onClick={onOpenRewards}
            className="flex items-center gap-1.5 px-3 py-0.5 rounded text-[11px] font-mono text-[#5FBF8C] bg-[#161616] hover:bg-[#202020] border border-[#262626] hover:border-[#5FBF8C]/50 transition-colors shadow-sm"
            title="Steward Points & Screen/Game Time Ledger"
          >
            <Coins className="w-3 h-3 text-[#5FBF8C]" />
            <span>{appState.stewardPoints} pts</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded bg-[#161616] border border-[#262626] flex items-center justify-center shadow-inner group-hover:border-[#5FBF8C] transition-all">
            <Shield className="w-4 h-4 text-[#5FBF8C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-[#E0E0E0] group-hover:text-white transition-colors">
                Steward<span className="text-[#5FBF8C]">OS</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#161616] text-[#808080] border border-[#262626]">
                Personal OS
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#808080] hidden sm:block">
              Truth • Consistency • Execution
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1.5 bg-[#111111] p-1 rounded border border-[#262626] overflow-x-auto no-scrollbar">
          <button
            id="tab-dashboard"
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#1C1C1C] text-[#5FBF8C] border border-[#5FBF8C]/40 shadow-sm'
                : 'text-[#808080] hover:text-white hover:bg-[#161616]'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'dashboard' ? 'bg-[#5FBF8C]' : 'bg-[#444]'}`} />
            <span>Daily Baseline</span>
          </button>

          <button
            id="tab-routines"
            onClick={() => onSelectTab('routines')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'routines'
                ? 'bg-[#1C1C1C] text-[#5FBF8C] border border-[#5FBF8C]/40 shadow-sm'
                : 'text-[#808080] hover:text-white hover:bg-[#161616]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Routines</span>
          </button>

          <button
            id="tab-agenda"
            onClick={() => onSelectTab('agenda')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'agenda'
                ? 'bg-[#1C1C1C] text-[#5FBF8C] border border-[#5FBF8C]/40 shadow-sm'
                : 'text-[#808080] hover:text-white hover:bg-[#161616]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agenda</span>
          </button>

          <button
            id="tab-goals"
            onClick={() => onSelectTab('goals')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'goals'
                ? 'bg-[#1C1C1C] text-[#5FBF8C] border border-[#5FBF8C]/40 shadow-sm'
                : 'text-[#808080] hover:text-white hover:bg-[#161616]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Goals</span>
          </button>

          <button
            id="tab-consistency"
            onClick={() => onSelectTab('consistency')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'consistency'
                ? 'bg-[#1C1C1C] text-[#5FBF8C] border border-[#5FBF8C]/40 shadow-sm'
                : 'text-[#808080] hover:text-white hover:bg-[#161616]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Pattern Intel</span>
          </button>

          <button
            id="tab-reviews"
            onClick={() => onSelectTab('reviews')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'reviews'
                ? 'bg-[#1C1C1C] text-[#5FBF8C] border border-[#5FBF8C]/40 shadow-sm'
                : 'text-[#808080] hover:text-white hover:bg-[#161616]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reviews</span>
          </button>
        </nav>

        {/* Action Shortcuts & AI Steward */}
        <div className="flex items-center gap-2.5">
          {/* AI Steward Consultation Button */}
          <button
            id="nav-open-ai-steward"
            onClick={onOpenAiSteward}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium bg-[#161616] hover:bg-[#222222] text-[#E0E0E0] hover:text-[#5FBF8C] border border-[#262626] hover:border-[#5FBF8C]/60 transition-all shadow-sm uppercase tracking-wider"
            title="Open AI Steward Consultation"
          >
            <Bot className="w-3.5 h-3.5 text-[#5FBF8C]" />
            <span className="hidden md:inline">AI Steward</span>
          </button>

          {/* Settings */}
          <button
            id="nav-open-settings"
            onClick={onOpenSettings}
            className="p-2 rounded text-[#808080] hover:text-white hover:bg-[#161616] border border-[#262626] hover:border-[#444] transition-colors"
            title="Settings & Backup"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {onSignOut && (
            <button
              id="nav-sign-out"
              onClick={onSignOut}
              className="p-2 rounded text-[#808080] hover:text-white hover:bg-[#161616] border border-[#262626] hover:border-[#444] transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
