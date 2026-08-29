import { AppState, RewardItem } from '../types';

// Helper to get formatted date string
export function getTodayDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// No default rewards — add your own from the Rewards Store modal.
export const INITIAL_REWARDS: RewardItem[] = [];

export const INITIAL_APP_STATE: AppState = {
  currentDate: getTodayDateString(0),
  nonNegotiables: [],
  dailyCompletions: {},
  routines: [],
  agendaTasks: [],
  goals5Year: [],
  goals1Year: [],
  monthlyRoleGoals: [],
  dailyJournals: {},
  gratitudeScans: {},
  interpretationInterventions: [],
  failurePatternLogs: [],
  weeklyReviews: [],
  monthlyReviews: [],
  screenTimeLogs: {},
  stewardPoints: 0,
  currentStreakNeverZero: 0,
  totalNeverZeroDays: 0,
  rewardsStore: INITIAL_REWARDS,
  pointsHistory: [],
  claimedRewards: [],
  settings: {
    userName: '',
    hardStopEveningTime: '20:20',
    eveningProtocolTime: '20:20',
    gratitudeScanTime: '18:00',
    minimumViableEveningMode: false,
    soundAlertsEnabled: true,
    soundEnabled: true,
    fixedCoreBelief: '',
    funeralIdentitySummary: '',
    dailyScreenLimitMinutes: 60,
    dailyGameLimitMinutes: 45,
  },
};
