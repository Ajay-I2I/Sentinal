/**
 * Tone preference for emergency guidance messaging.
 */
export type EmergencyTone = "calm" | "motivational" | "direct";

/**
 * Recovery status classification returned by the AI coach.
 */
export type RecoveryStatus =
  | "Stable"
  | "Needs Attention"
  | "Immediate Support";

/**
 * User's Recovery Passport.
 */
export interface RecoveryProfile {
  name: string;

  recoveryStage: string;

  substance?: string;

  triggers: string[];

  trustedPerson: {
    name: string;
    relationship?: string;
  };

  healthyActivities: string[];

  emergencyTone: EmergencyTone;
}

/**
 * One conversational turn.
 */
export interface ChatMessage {
  role: "user" | "assistant";

  message: string;
}

/**
 * Request sent to Gemini.
 */
export interface GuidanceRequest {
  profile: RecoveryProfile;

  conversation: ChatMessage[];
}

/**
 * AI Coach response.
 */
export interface GuidanceResponse {
  recoveryStatus: RecoveryStatus;

  confidence: number;

  assistantMessage: string;

  shouldSuggestActivity: boolean;

  suggestedActivity?: string;

  activityReason?: string;

  emergency: boolean;

  emergencyScript?: string;

  caregiverAlert: boolean;
}