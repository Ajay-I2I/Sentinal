export const STORAGE_KEYS = {
  RECOVERY_PROFILE: "sentinel-recovery-profile",
  CONVERSATION_HISTORY: "sentinel-conversation-history",
} as const;

export const RECOVERY_STAGES = [
  "Early Recovery",
  "Active Recovery",
  "Maintenance",
  "Long-term Recovery",
] as const;

export const EMERGENCY_TONES = [
  { value: "calm", label: "Calm", description: "Gentle and grounding" },
  {
    value: "motivational",
    label: "Motivational",
    description: "Encouraging and uplifting",
  },
  { value: "direct", label: "Direct", description: "Clear and straightforward" },
] as const;

export const COMMON_TRIGGERS = [
  "Work Stress",
  "Social Gatherings",
  "Loneliness",
  "Financial Pressure",
  "Relationship Conflict",
  "Boredom",
] as const;

export const COMMON_ACTIVITIES = [
  "Walking",
  "Listening to Music",
  "Gym",
  "Meditation",
  "Journaling",
  "Calling a Friend",
] as const;