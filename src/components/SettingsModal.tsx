import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  Clock,
  User,
  ShieldAlert,
  X,
  CheckCircle2,
} from 'lucide-react';
import { AppState, AppSettings } from '../types';
import { exportAppDataJson, importAppDataJson, resetToDefaultState } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onStateRestored: (newState: AppState) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  appState,
  onUpdateSettings,
  onStateRestored,
}) => {
  const [userName, setUserName] = useState(appState.settings.userName);
  const [funeralSummary, setFuneralSummary] = useState(appState.settings.funeralIdentitySummary);
  const [gratitudeScanTime, setGratitudeScanTime] = useState(appState.settings.gratitudeScanTime);
  const [eveningProtocolTime, setEveningProtocolTime] = useState(appState.settings.eveningProtocolTime);
  const [soundEnabled, setSoundEnabled] = useState(appState.settings.soundEnabled);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      userName: userName.trim(),
      funeralIdentitySummary: funeralSummary.trim(),
      gratitudeScanTime,
      eveningProtocolTime,
      soundEnabled,
    });
    onClose();
  };

  const handleExport = () => {
    exportAppDataJson(appState);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const importedState = importAppDataJson(json);
        if (importedState) {
          onStateRestored(importedState);
          onClose();
        }
      } catch (err) {
        alert('Invalid StewardOS backup file');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    const fresh = resetToDefaultState();
    onStateRestored(fresh);
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#262626] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-[#161616] text-[#5FBF8C] border border-[#262626]">
                <Settings className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#808080]">
                System Governance
              </span>
            </div>
            <h2 className="text-xl font-serif text-[#E0E0E0]">
              StewardOS Settings & Anchors
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#808080] hover:text-[#E0E0E0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">User / Steward Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#5FBF8C]"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">
              Funeral Identity Affirmation (Core Invariant Compass)
            </label>
            <textarea
              rows={2}
              value={funeralSummary}
              onChange={(e) => setFuneralSummary(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#5FBF8C] font-serif italic"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Gratitude Scan Time</label>
              <input
                type="time"
                value={gratitudeScanTime}
                onChange={(e) => setGratitudeScanTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#5FBF8C] font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Evening Protocol Time</label>
              <input
                type="time"
                value={eveningProtocolTime}
                onChange={(e) => setEveningProtocolTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#5FBF8C] font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sound-checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="accent-[#5FBF8C] bg-[#0A0A0A] border-[#262626]"
            />
            <label htmlFor="sound-checkbox" className="text-xs text-[#808080] cursor-pointer flex items-center gap-1.5 font-serif">
              <Volume2 className="w-3.5 h-3.5 text-[#5FBF8C]" />
              Enable Monastic Bell & Audio Synthesis Feedback
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#5FBF8C] hover:bg-[#7FD1A6] text-black text-xs uppercase tracking-widest font-semibold"
            >
              Save Preferences
            </button>
          </div>
        </form>

        {/* Data Persistence & Backup Section */}
        <div className="p-4 bg-[#0A0A0A] border border-[#262626] space-y-3 pt-4">
          <span className="text-[10px] font-mono text-[#808080] uppercase tracking-widest block">
            Data Portability & Backup
          </span>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="px-3.5 py-1.5 bg-[#161616] hover:bg-[#222222] text-[#E0E0E0] text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5 border border-[#262626]"
            >
              <Download className="w-3.5 h-3.5 text-[#5FBF8C]" />
              <span>Export JSON State</span>
            </button>

            <label className="px-3.5 py-1.5 bg-[#161616] hover:bg-[#222222] text-[#E0E0E0] text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5 border border-[#262626] cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#5FBF8C]" />
              <span>Restore Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset Engine */}
          <div className="pt-2 border-t border-[#262626]">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-[10px] uppercase tracking-widest text-[#E07A5F] hover:text-[#f09a82] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Clean Default State</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-[#161616] p-2 border border-[#E07A5F]/40 text-xs">
                <span className="text-[#E07A5F] flex-1 text-[10px] uppercase tracking-wider">Confirm database reset?</span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1 bg-[#E07A5F] text-black font-semibold text-[10px] uppercase tracking-widest"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2.5 py-1 border border-[#262626] text-[#808080] text-[10px] uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
