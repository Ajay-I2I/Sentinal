import { z } from "zod";
import { STORAGE_KEYS } from "./constants";
import { RecoveryProfile, ChatMessage } from "@/types/recovery";

const RecoveryProfileSchema = z.object({
  name: z.string(),
  recoveryStage: z.string(),
  substance: z.string().optional(),
  triggers: z.array(z.string()),
  trustedPerson: z.object({
    name: z.string(),
    relationship: z.string().optional(),
  }),
  healthyActivities: z.array(z.string()),
  emergencyTone: z.enum(["calm", "motivational", "direct"]),
});

const ChatMessageSchema = z.array(
  z.object({
    role: z.enum(["user", "assistant"]),
    message: z.string(),
  })
);

export function saveProfile(profile: RecoveryProfile): void {
  localStorage.setItem(
    STORAGE_KEYS.RECOVERY_PROFILE,
    JSON.stringify(profile)
  );
}

export function getProfile(): RecoveryProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECOVERY_PROFILE);

    if (!data) return null;

    const parsed = JSON.parse(data);

    return RecoveryProfileSchema.parse(parsed);
  } catch {
    localStorage.removeItem(STORAGE_KEYS.RECOVERY_PROFILE);
    return null;
  }
}

export function hasProfile(): boolean {
  return getProfile() !== null;
}

export function clearProfile(): void {
  localStorage.removeItem(STORAGE_KEYS.RECOVERY_PROFILE);
}

export function saveConversation(messages: ChatMessage[]): void {
  localStorage.setItem(
    STORAGE_KEYS.CONVERSATION_HISTORY,
    JSON.stringify(messages)
  );
}

export function getConversation(): ChatMessage[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATION_HISTORY);

    if (!data) return [];

    const parsed = JSON.parse(data);

    return ChatMessageSchema.parse(parsed);
  } catch {
    localStorage.removeItem(STORAGE_KEYS.CONVERSATION_HISTORY);
    return [];
  }
}

export function clearConversation(): void {
  localStorage.removeItem(STORAGE_KEYS.CONVERSATION_HISTORY);
}