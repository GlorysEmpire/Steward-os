export type LoopType = 'Thinking Loop' | 'Motivation Loop' | 'Reset Loop';

export type ViewTab = 'dashboard' | 'routines' | 'agenda' | 'goals' | 'consistency' | 'reviews';

export interface NonNegotiable {
  id: string;
  title: string;
  category: 'Morning Protocol' | 'Deep Work' | 'Health & Body' | 'Evening Protocol' | 'Mind & Truth';
  timeSlot: string; // e.g. "07:00", "09:00", "18:00", "20:00"
  targetOutputUnit: string; // e.g. "60 min focused sprint", "30 min movement", "Complete Gratitude Scan"
  minimumViableUnit: string; // e.g. "5 deep breaths & 1 min stretch", "1 line written", "1 min review"
  isNeverZero: boolean; // Must never be zero
  points: number;
}

export interface RoutineBlock {
  id: string;
  name: string;
  timeStart: string; // "18:00"
  timeEnd: string;   // "18:30"
  isProtected: boolean; // 18:00 gratitude scan, 20:20 evening hard stop
  status: 'pending' | 'completed' | 'minimum-viable' | 'skipped';
  items: string[];
  notes?: string;
}

export interface AgendaTask {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Sunday, 1 = Monday ... 6 = Saturday
  outputUnit: string; // e.g. "3 code commits", "1 draft document"
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  roleGoalId?: string;
  estimatedMinutes?: number;
  timeBlock?: string;
}

export interface Goal5Year {
  id: string;
  vision: string;
  pillar: 'Craft & Work' | 'Health & Stewardship' | 'Character & Truth' | 'Freedom & Order' | string;
  targetYear: number;
}

export interface Goal1Year {
  id: string;
  fiveYearGoalId?: string;
  title: string;
  metric: string;
  progress: number; // 0 - 100
  targetDate: string;
}

export interface MonthlyRoleGoal {
  id: string;
  oneYearGoalId?: string;
  roleName: string; // "Builder", "Steward", "Leader", "Scholar"
  monthlyObjective: string;
  nonNegotiableBaseline: string;
  targetOutputCount: number;
  currentOutputCount: number;
  outputLabel: string; // e.g. "Hours of deep work", "Pages read", "Workouts completed"
}

export interface DailyJournal {
  date: string; // YYYY-MM-DD
  timestamp: string;
  question1: string; // Did I keep my word today?
  keptWordStatus: 'yes' | 'partial' | 'no';
  question2: string; // Where did I act unconsciously?
  question3: string; // Did I move toward my funeral identity?
  unconsciousTriggers: string[];
  funeralIdentityAffirmation: string;
}

export interface GratitudeScan {
  date: string; // YYYY-MM-DD
  timestamp: string;
  q1NotGuaranteed: string; // One concrete thing that exists today that was not guaranteed.
  q2FrictionData: string;  // One way today’s friction or inconsistency is usable data.
  q3FixedBelief: string;   // One specific way the fixed belief remains intact despite the data.
  q4ProofAction: string;   // One intentional action executed in next 90–120 minutes as proof of belief.
  proofActionCompleted: boolean;
  isLocked: boolean;
}

export interface InterpretationIntervention {
  id: string;
  date: string;
  event: string;
  automaticNarrative: string;
  fixedBeliefAnchor: string;
  productiveReinterpretation: string;
  proofAction: string;
  completedProofAction: boolean;
  stewardNote?: string;
}

export interface FailurePatternLog {
  id: string;
  date: string;
  loopType: LoopType;
  trigger: string;
  description: string;
  recoveryActionTaken: string;
  timestamp: string;
}

export interface RoleAssessment {
  roleId: string;
  roleName: string;
  targetOutputUnits: number;
  deliveredOutputUnits: number;
  notes?: string;
}

export interface WeeklyReview {
  id: string;
  weekId?: string;
  weekStartDate?: string;
  weekNumber?: number;
  year?: number;
  timestamp: string;
  roleAssessments: RoleAssessment[];
  dominantLoopDetected?: string;
  loopAnalysisText?: string;
  singleAdjustment: string;
  gratitudeScanSummary?: string;
  funeralIdentityAlignment?: string;
  aiDiagnosisNote?: string;
  consistencyScoreAverage?: number;
  neverZeroDaysCount?: number;
}

export interface MonthlyReview {
  id: string;
  monthId: string; // "2026-08"
  coreReflection: string;
  rolesAudit: string;
  singleMonthlyAdjustment: string;
  completed: boolean;
  completedAt: string;
}

export interface RewardItem {
  id: string;
  title: string;
  pointCost: number;
  costPoints?: number;
  description?: string;
  category?: string;
  durationMinutes?: number;
  unlockedCount?: number;
  iconName?: string;
}

export interface ScreenTimeLog {
  date: string;
  screenTimeMinutes: number;
  gameTimeMinutes: number;
  screenLimitMinutes: number;
  gameLimitMinutes: number;
  exceededLogged: boolean;
}

export interface DailyCompletionRecord {
  completedIds?: string[];
  mvaIds?: string[];
  skippedIds?: string[];
  neverZeroPassed: boolean;
  score: number;
  date?: string;
  completedRoutines?: number;
  totalRoutines?: number;
  completedAgendas?: number;
  totalAgendas?: number;
}

export interface AppSettings {
  userName: string;
  hardStopEveningTime?: string;
  eveningProtocolTime?: string;
  gratitudeScanTime: string;
  minimumViableEveningMode?: boolean;
  soundAlertsEnabled?: boolean;
  soundEnabled?: boolean;
  fixedCoreBelief?: string;
  funeralIdentitySummary: string;
  dailyScreenLimitMinutes?: number;
  dailyGameLimitMinutes?: number;
}

export interface AppState {
  currentDate: string; // YYYY-MM-DD
  nonNegotiables: NonNegotiable[];
  dailyCompletions: Record<string, DailyCompletionRecord>;
  routines: RoutineBlock[];
  agendaTasks: AgendaTask[];
  goals5Year: Goal5Year[];
  goals1Year: Goal1Year[];
  monthlyRoleGoals: MonthlyRoleGoal[];
  dailyJournals: Record<string, DailyJournal>;
  gratitudeScans: Record<string, GratitudeScan>;
  interpretationInterventions: InterpretationIntervention[];
  failurePatternLogs: FailurePatternLog[];
  weeklyReviews: WeeklyReview[];
  monthlyReviews: MonthlyReview[];
  screenTimeLogs: Record<string, ScreenTimeLog>;
  stewardPoints: number;
  currentStreakNeverZero: number;
  totalNeverZeroDays: number;
  rewardsStore: RewardItem[];
  pointsHistory: Array<{
    id: string;
    date: string;
    amount: number;
    reason: string;
    type: 'earn' | 'spend' | 'penalty';
  }>;
  claimedRewards: Array<{
    id: string;
    rewardId: string;
    title: string;
    claimedAt: string;
  }>;
  settings: AppSettings;
}
