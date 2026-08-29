import type { FailurePatternLog, LoopType } from "@/types";

// This module is the entire "brain" behind the AI Steward. It's rule-based
// and deterministic on purpose: zero external API cost, zero latency, zero
// dependency on a third-party provider — and every function here has a
// narrow, typed return shape that mirrors exactly what each component
// already expects (see the /api/ai/* route handlers). That's the seam:
// when you're ready to train or plug in your own model, each function
// below can become an API call to it without touching a single component.

const STEWARD_PHILOSOPHY = {
  neverZero:
    "Never-zero: the baseline never has to be zero. A two-minute minimum viable action preserves the identity's continuity.",
  fixedBelief:
    "Belief is fixed; only strategy and interpretation change. Friction is data about the current approach, not a verdict on you.",
  outputOverFeelings:
    "Track output units and completion, not the feelings or effort stories around them.",
  lightRecovery:
    "Inconsistency never becomes catch-up debt. The path back is always the lightest one available.",
  singleAdjustment:
    "Exactly one concrete operational change per review cycle — never several at once.",
};

const LOOP_DESCRIPTIONS: Record<LoopType, string> = {
  "Thinking Loop": "over-planning or refining the system instead of producing output units",
  "Motivation Loop": "waiting for inspiration or ideal conditions before starting",
  "Reset Loop": "abandoning momentum after one slip, waiting for Monday or the 1st for a clean start",
};

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

/** Detects the dominant failure pattern from recent logs — simple frequency
 * count, no ML needed for something this legible from the data itself. */
export function detectDominantLoop(logs: FailurePatternLog[]): LoopType | "Disciplined Execution" {
  if (logs.length === 0) return "Disciplined Execution";
  const counts: Record<LoopType, number> = {
    "Thinking Loop": 0,
    "Motivation Loop": 0,
    "Reset Loop": 0,
  };
  for (const log of logs) counts[log.loopType] = (counts[log.loopType] ?? 0) + 1;
  const [dominant] = (Object.entries(counts) as [LoopType, number][]).sort((a, b) => b[1] - a[1]);
  return dominant[1] > 0 ? dominant[0] : "Disciplined Execution";
}

// ---- steward-chat ----

const CHAT_REPLIES = [
  "Execution precedes motivation. What is the single output unit you will ship in the next hour?",
  "Friction is data, not a verdict. What did today's friction actually tell you about the current strategy?",
  "The baseline only asks for the minimum viable unit — not the ideal one. What's the smallest version you can do right now?",
  "One adjustment, not five. If you could change exactly one thing about this week's system, what would it be?",
  "Your identity isn't measured by today alone. What did you ship this week that a version of you a year ago couldn't?",
];

export function stewardChatReply(message: string, context: Record<string, unknown>): { reply: string } {
  const lower = message.toLowerCase();
  if (lower.includes("streak") || lower.includes("consisten")) {
    return {
      reply: `Current never-zero streak: ${context.currentStreak ?? 0} days. ${STEWARD_PHILOSOPHY.neverZero}`,
    };
  }
  if (lower.includes("fail") || lower.includes("missed") || lower.includes("slip")) {
    return {
      reply: `${STEWARD_PHILOSOPHY.lightRecovery} What's the two-minute version of what you missed?`,
    };
  }
  if (lower.includes("goal") || lower.includes("role")) {
    const roles = Array.isArray(context.activeRoles) ? context.activeRoles.join(", ") : "your roles";
    return { reply: `Looking at ${roles}: which one had the least output this week? Start there.` };
  }
  return { reply: pick(CHAT_REPLIES, message.length + (message.charCodeAt(0) || 0)) };
}

// ---- interpretation-coach ----

export function interpretationCoach(
  event: string,
  automaticNarrative: string,
  fixedBelief: string
): { productiveReinterpretation: string; proofAction: string; stewardNote: string } {
  const hasNarrative = automaticNarrative.trim().length > 0;
  return {
    productiveReinterpretation: hasNarrative
      ? `What happened: "${event.trim() || "the event"}." That's the fact. The story "${automaticNarrative.trim()}" is one interpretation — a more useful one: this is operational data about the current strategy, not evidence against "${fixedBelief.trim()}".`
      : `What happened: "${event.trim() || "the event"}." Treat it as one data point about the current approach, not a verdict on the fixed belief: "${fixedBelief.trim()}".`,
    proofAction:
      "In the next 30–60 minutes, complete one small, concrete output unit connected to this — a single paragraph written, one set done, one message sent. Small and real beats big and imagined.",
    stewardNote: "The belief holds. Only the strategy is up for revision.",
  };
}

// ---- recovery-action ----

const RECOVERY_TEMPLATES: Array<{ duration: string; title: string; description: string; outputUnit: string }> = [
  { duration: "2 min", title: "Minimum Viable Restart", description: "The smallest possible version of the missed action — done imperfectly, done now.", outputUnit: "1 unit completed" },
  { duration: "5 min", title: "Single-Sentence Log", description: "Write one sentence about where things stand, no more.", outputUnit: "1 line written" },
  { duration: "10 min", title: "One Clean Rep", description: "Do exactly one full rep of the core action, then stop and log it.", outputUnit: "1 rep completed" },
  { duration: "15 min", title: "Focused Restart Block", description: "Set a 15-minute timer and work only on the smallest next step of the missed action.", outputUnit: "1 focused block" },
];

const RECALIBRATIONS = [
  "The gap doesn't need to be closed today — it needs to stop growing.",
  "One small, real action outweighs the plan you didn't finish.",
  "The baseline was never about perfection. It was about continuity.",
];

export function recoveryAction(
  missedAction: string,
  loopDetected?: LoopType | string
): { actions: typeof RECOVERY_TEMPLATES; recalibration: string; loopAnalysis: string } {
  const loop = (loopDetected as LoopType) in LOOP_DESCRIPTIONS ? (loopDetected as LoopType) : undefined;
  return {
    actions: RECOVERY_TEMPLATES,
    recalibration: pick(RECALIBRATIONS, missedAction.length),
    loopAnalysis: loop
      ? `Pattern detected: ${loop} — ${LOOP_DESCRIPTIONS[loop]}. The recovery actions above are sized to interrupt exactly that pattern.`
      : "No dominant pattern detected yet — treat this as an isolated gap, not evidence of a loop.",
  };
}

// ---- access-protocol ----

export function accessProtocol(
  currentState: string,
  trigger: string
): {
  title: string;
  phases: Array<{ step: number; name: string; instructions: string; durationSeconds: number }>;
  affirmation: string;
} {
  return {
    title: "Access Protocol Calibration",
    phases: [
      {
        step: 1,
        name: "Physiological Interruption",
        instructions: "Uncross your arms, plant both feet flat, take 5 slow breaths — 4 seconds in, 6 seconds out.",
        durationSeconds: 30,
      },
      {
        step: 2,
        name: "Data Disconnection",
        instructions: `Name the current state out loud: "${currentState.trim() || "scattered"}." That's a sensation, not an identity. It's information about the trigger — "${trigger.trim() || "friction during focused work"}" — not about who you are.`,
        durationSeconds: 45,
      },
      {
        step: 3,
        name: "Fixed Belief Anchor",
        instructions: STEWARD_PHILOSOPHY.fixedBelief,
        durationSeconds: 30,
      },
      {
        step: 4,
        name: "Immediate Micro-Output",
        instructions: "Do one 60-second physical action that starts the next output unit — first line, first rep, first sentence.",
        durationSeconds: 60,
      },
    ],
    affirmation: "Strategy is negotiable. Execution is not optional. Begin.",
  };
}

// ---- pattern-analysis ----

export function patternAnalysis(
  failureLogs: FailurePatternLog[],
  neverZeroStreak: number,
  singleAdjustmentProposal: string
): { diagnosis: string; singleAdjustmentValidation: string; calmEncouragement: string } {
  const dominant = detectDominantLoop(failureLogs);
  const diagnosis =
    dominant === "Disciplined Execution"
      ? `No dominant failure pattern this week. Never-zero streak sits at ${neverZeroStreak} days — the current strategy is working.`
      : `Dominant pattern this week: ${dominant} (${LOOP_DESCRIPTIONS[dominant]}). Observed across ${
          failureLogs.filter((l) => l.loopType === dominant).length
        } logged instance(s).`;

  const singleAdjustmentValidation = singleAdjustmentProposal.trim()
    ? `Adjustment accepted: "${singleAdjustmentProposal.trim()}." One change, held for the full next cycle before reassessing.`
    : "No adjustment proposed yet — name exactly one concrete operational change for next week before closing this review.";

  return {
    diagnosis,
    singleAdjustmentValidation,
    calmEncouragement:
      dominant === "Disciplined Execution"
        ? "Consistency compounds quietly. Keep the baseline exactly where it is."
        : "Naming the pattern is most of the work. The adjustment above is enough for one week.",
  };
}
