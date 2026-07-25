/**
 * Configuration management for Sentinel AI
 * All configurable values should be managed here
 * Environment variables are used for deployment flexibility
 */

export const CONFIG = {
  // API Configuration
  OPENROUTER_MODEL:
    process.env.OPENROUTER_MODEL ||
    "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",

  // Timeouts (in milliseconds)
  API_TIMEOUT_MS: parseInt(process.env.API_TIMEOUT_MS || "15000", 10),
  VOICE_PAUSE_THRESHOLD_MS: parseInt(
    process.env.VOICE_PAUSE_THRESHOLD_MS || "5000",
    10
  ),
  SPEECH_TIMEOUT_MS: parseInt(process.env.SPEECH_TIMEOUT_MS || "10000", 10),

  // Response Limits
  RESPONSE_WORD_LIMIT: parseInt(process.env.RESPONSE_WORD_LIMIT || "40", 10),
  RESPONSE_MAX_TOKENS: 1600,
  MESSAGE_MAX_LENGTH: 1000,

  // Conversation Management
  CONVERSATION_HISTORY_MAX: 100,
  CONVERSATION_STORAGE_KEY: "sentinel_conversation",
  PROFILE_STORAGE_KEY: "sentinel_profile",

  // App Configuration
  APP_NAME: "Sentinel AI",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Feature Flags
  ENABLE_VOICE: process.env.NEXT_PUBLIC_ENABLE_VOICE === "true",
  ENABLE_LOGGING: process.env.NODE_ENV === "development",
} as const;

/**
 * Validate configuration at startup
 * Throws if required environment variables are missing
 */
export function validateConfig(): void {
  const requiredEnvVars = ["OPENROUTER_API_KEY"];

  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  if (CONFIG.API_TIMEOUT_MS <= 0) {
    throw new Error("API_TIMEOUT_MS must be positive");
  }

  if (CONFIG.RESPONSE_WORD_LIMIT <= 0) {
    throw new Error("RESPONSE_WORD_LIMIT must be positive");
  }
}
