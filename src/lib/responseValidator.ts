/**
 * Response validation for AI-generated guidance
 * Ensures responses follow required format and don't contain placeholders
 */

import type { GuidanceResponse } from "@/types/recovery";
import { CONFIG } from "./config";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates that a guidance response meets requirements:
 * - Contains required fields
 * - Uses real names, not placeholders
 * - Crisis responses are directives, not questions
 * - Word count is within limits
 * - Confidence is in valid range
 */
export function validateGuidanceResponse(
  data: any
): ValidationResult & { data?: GuidanceResponse } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required fields exist
  if (!data || typeof data !== "object") {
    errors.push("Response is not a valid object");
    return { valid: false, errors, warnings };
  }

  if (!data.recoveryStatus) {
    errors.push("Missing recoveryStatus field");
  }

  if (typeof data.confidence !== "number") {
    errors.push("Invalid or missing confidence value");
  } else if (data.confidence < 0 || data.confidence > 1) {
    errors.push(`Confidence must be between 0 and 1, got ${data.confidence}`);
  }

  if (!data.assistantMessage || typeof data.assistantMessage !== "string") {
    errors.push("Missing or invalid assistantMessage");
  }

  // If we have critical errors, return early
  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  const message = data.assistantMessage || "";

  // Check for placeholder names that indicate model failure
  const placeholderPatterns = [
    /User\s+A\b/gi,
    /\[user[^\]]*\]/gi,
    /\[trusted[^\]]*\]/gi,
    /\{\{[^}]*\}\}/g,
    /\[\[[^\]]*\]\]/g,
  ];

  for (const pattern of placeholderPatterns) {
    if (pattern.test(message)) {
      errors.push(
        `Response contains placeholder names: ${message.match(pattern)?.[0]}`
      );
    }
  }

  // Validate crisis responses don't end with questions
  if (
    data.recoveryStatus === "Immediate Support" ||
    data.recoveryStatus === "Active Use"
  ) {
    if (message.trim().endsWith("?")) {
      errors.push(
        "Crisis response should not end with a question - must be a directive"
      );
    }
  }

  // Validate word count
  const wordCount = message.split(/\s+/).length;
  if (wordCount > CONFIG.RESPONSE_WORD_LIMIT) {
    warnings.push(
      `Response exceeds word limit: ${wordCount} words (limit: ${CONFIG.RESPONSE_WORD_LIMIT})`
    );
  }

  // Validate message length
  if (message.length > CONFIG.MESSAGE_MAX_LENGTH) {
    errors.push(
      `Response exceeds max length: ${message.length} chars (limit: ${CONFIG.MESSAGE_MAX_LENGTH})`
    );
  }

  // Check for suspicious patterns
  if (message.includes("..") || message.includes("  ")) {
    warnings.push("Response contains suspicious formatting patterns");
  }

  // If no critical errors, mark as valid
  const valid = errors.length === 0;

  if (valid) {
    return {
      valid: true,
      errors,
      warnings,
      data: data as GuidanceResponse,
    };
  }

  return { valid: false, errors, warnings };
}

/**
 * Safely parse and validate a JSON response from the AI model
 */
export function safeParseGuidanceResponse(
  jsonString: string
): { success: boolean; data?: GuidanceResponse; errors: string[] } {
  try {
    // Clean the response (remove markdown code blocks)
    let cleaned = jsonString
      .replace(/^```(?:json)?[\r\n]?/i, "")
      .replace(/[\r\n]?```$/i, "")
      .trim();

    // Try to parse as JSON
    const parsed = JSON.parse(cleaned);

    // Validate the parsed response
    const validation = validateGuidanceResponse(parsed);

    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    if (validation.warnings.length > 0 && CONFIG.ENABLE_LOGGING) {
      console.warn("Response validation warnings:", validation.warnings);
    }

    return {
      success: true,
      data: validation.data,
      errors: validation.errors,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown JSON parse error";
    return {
      success: false,
      errors: [`Failed to parse response: ${errorMessage}`],
    };
  }
}

/**
 * Log validation details for debugging (only in development)
 */
export function logValidationDetails(
  response: ValidationResult,
  context?: Record<string, any>
): void {
  if (!CONFIG.ENABLE_LOGGING) return;

  console.log("[Validation]", {
    valid: response.valid,
    errorCount: response.errors.length,
    warningCount: response.warnings.length,
    errors: response.errors,
    warnings: response.warnings,
    ...context,
  });
}
