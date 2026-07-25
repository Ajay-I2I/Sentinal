import OpenAI from "openai";
import type {
  GuidanceRequest,
  GuidanceResponse,
} from "@/types/recovery";
import { SYSTEM_PROMPT } from "@/prompts/system";
import { CONFIG, validateConfig } from "./config";
import { safeParseGuidanceResponse, logValidationDetails } from "./responseValidator";

// Validate configuration on module load
validateConfig();

const apiKey = process.env.OPENROUTER_API_KEY;

if (CONFIG.ENABLE_LOGGING) {
  console.log("[INIT] OPENROUTER_API_KEY present:", !!apiKey);
}

if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY is missing. Configure it in .env.local");
}

const client = new OpenAI({
  apiKey: apiKey.trim(),
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": CONFIG.APP_URL,
    "X-Title": CONFIG.APP_NAME,
  },
});

export async function generateGuidance(
  request: GuidanceRequest
): Promise<GuidanceResponse> {
  const conversation = request.conversation
    .map(({ role, message }) => `${role.toUpperCase()}: ${message}`)
    .join("\n\n");

  const prompt = `
## User Profile
Name: ${request.profile.name}
Recovery Stage: ${request.profile.recoveryStage}
Triggers: ${request.profile.triggers.join(", ")}
Trusted Person: ${request.profile.trustedPerson.name} (${request.profile.trustedPerson.relationship || "support person"})
Healthy Activities: ${request.profile.healthyActivities.join(", ")}
Emergency Tone: ${request.profile.emergencyTone}

## Conversation History
${conversation}

## Instructions
1. Apply the crisis detection and response protocols from the system prompt
2. Always use the user's actual name: ${request.profile.name}
3. Always use the trusted person's actual name and relationship: ${request.profile.trustedPerson.name} (${request.profile.trustedPerson.relationship || "support person"})
4. Detect the user's current state (active use, imminent use, craving, trigger exposure, or stable)
5. Respond according to the matching protocol tier
6. Keep response under ${CONFIG.RESPONSE_WORD_LIMIT} words
7. Return ONLY valid JSON - no markdown, no explanations

Return ONLY the JSON object, nothing else.
`.trim();

  try {
    if (CONFIG.ENABLE_LOGGING) {
      console.log(
        `[OpenRouter] Requesting guidance with model: ${CONFIG.OPENROUTER_MODEL}`
      );
    }

    const response = await Promise.race([
      client.chat.completions.create({
        model: CONFIG.OPENROUTER_MODEL,
        max_tokens: CONFIG.RESPONSE_MAX_TOKENS,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                `OpenRouter request timed out after ${CONFIG.API_TIMEOUT_MS}ms`
              )
            ),
          CONFIG.API_TIMEOUT_MS
        )
      ),
    ]);

    const rawResponse = response.choices[0]?.message.content ?? "";

    if (!rawResponse.trim()) {
      throw new Error("OpenRouter returned an empty response.");
    }

    // Parse and validate the response
    const parseResult = safeParseGuidanceResponse(rawResponse);

    if (!parseResult.success) {
      logValidationDetails(
        { valid: false, errors: parseResult.errors, warnings: [] },
        { rawResponse: rawResponse.substring(0, 200) }
      );
      throw new Error(
        `Response validation failed: ${parseResult.errors.join("; ")}`
      );
    }

    if (CONFIG.ENABLE_LOGGING) {
      console.log("[OpenRouter] Successfully generated and validated guidance");
    }

    return parseResult.data!;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate recovery guidance.";

    if (CONFIG.ENABLE_LOGGING) {
      console.error("[OpenRouter Error]", {
        message: errorMessage,
        type: error instanceof Error ? error.constructor.name : "Unknown",
      });
    }

    throw new Error(errorMessage);
  }
}