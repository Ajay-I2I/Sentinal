/**
 * Unit tests for response validation
 * Tests: placeholder detection, word count, crisis format, JSON parsing
 */

import {
  validateGuidanceResponse,
  safeParseGuidanceResponse,
} from "@/lib/responseValidator";

describe("responseValidator", () => {
  describe("validateGuidanceResponse", () => {
    it("should accept a valid response", () => {
      const response = {
        recoveryStatus: "Stable",
        confidence: 0.95,
        assistantMessage: "That's amazing! Keep going.",
      };

      const result = validateGuidanceResponse(response);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toBeDefined();
    });

    it("should reject response without recoveryStatus", () => {
      const response = {
        confidence: 0.95,
        assistantMessage: "Hello",
      };

      const result = validateGuidanceResponse(response);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Missing recoveryStatus field");
    });

    it("should reject response without confidence", () => {
      const response = {
        recoveryStatus: "Stable",
        assistantMessage: "Hello",
      };

      const result = validateGuidanceResponse(response);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("confidence"))).toBe(true);
    });

    it("should reject confidence outside 0-1 range", () => {
      const response = {
        recoveryStatus: "Stable",
        confidence: 1.5,
        assistantMessage: "Hello",
      };

      const result = validateGuidanceResponse(response);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("0 and 1"))).toBe(true);
    });

    it("should reject response with placeholder 'User A'", () => {
      const response = {
        recoveryStatus: "Stable",
        confidence: 0.95,
        assistantMessage: "Call User A right now",
      };

      const result = validateGuidanceResponse(response);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("placeholder"))).toBe(true);
    });

    it("should reject response with placeholder '[user]'", () => {
      const response = {
        recoveryStatus: "Stable",
        confidence: 0.95,
        assistantMessage: "Contact [user] for help",
      };

      const result = validateGuidanceResponse(response);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("placeholder"))).toBe(true);
    });

    it("should reject response with placeholder '[trusted]'", () => {
      const response = {
        recoveryStatus: "Stable",
        confidence: 0.95,
        assistantMessage: "Call [trusted] now",
      };

      const result = validateGuidanceResponse(response);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("placeholder"))).toBe(true);
    });

    it("should reject crisis response ending with question", () => {
      const response = {
        recoveryStatus: "Active Use",
        confidence: 0.95,
        assistantMessage: "Are you safe?",
      };

      const result = validateGuidanceResponse(response);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("question"))).toBe(true);
    });

    it("should accept imminent use response ending with question", () => {
      const response = {
        recoveryStatus: "Imminent Use",
        confidence: 0.95,
        assistantMessage: "Call 988 or 741741?",
      };

      const result = validateGuidanceResponse(response);

      // Imminent use can end with question, but this one shouldn't
      // Let's revise: imminent is like active, so should not end with ?
      // Actually per spec: Tier 2 also should not end with question
      expect(result.valid).toBe(false);
    });

    it("should warn about response exceeding word limit", () => {
      const response = {
        recoveryStatus: "Stable",
        confidence: 0.95,
        assistantMessage:
          "This is a very long message that contains many words and exceeds the recommended word limit for responses in the system. " +
          "It is important to keep messages short and concise. " +
          "This message is definitely over 40 words.",
      };

      const result = validateGuidanceResponse(response);

      expect(result.valid).toBe(true);
      expect(result.warnings.some((w) => w.includes("word limit"))).toBe(true);
    });

    it("should reject response exceeding max length", () => {
      const response = {
        recoveryStatus: "Stable",
        confidence: 0.95,
        assistantMessage: "a".repeat(1001),
      };

      const result = validateGuidanceResponse(response);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("max length"))).toBe(true);
    });
  });

  describe("safeParseGuidanceResponse", () => {
    it("should parse valid JSON", () => {
      const json = JSON.stringify({
        recoveryStatus: "Stable",
        confidence: 0.95,
        assistantMessage: "Great job!",
      });

      const result = safeParseGuidanceResponse(json);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });

    it("should parse JSON with markdown code blocks", () => {
      const json =
        '```json\n{"recoveryStatus": "Stable", "confidence": 0.95, "assistantMessage": "Great"}\n```';

      const result = safeParseGuidanceResponse(json);

      expect(result.success).toBe(true);
      expect(result.data?.recoveryStatus).toBe("Stable");
    });

    it("should handle invalid JSON", () => {
      const json = "{invalid json}";

      const result = safeParseGuidanceResponse(json);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should detect validation failures", () => {
      const json = JSON.stringify({
        recoveryStatus: "Active Use",
        confidence: 0.95,
        assistantMessage: "Are you safe?",
      });

      const result = safeParseGuidanceResponse(json);

      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.includes("question"))).toBe(true);
    });

    it("should reject response with 'User A'", () => {
      const json = JSON.stringify({
        recoveryStatus: "Stable",
        confidence: 0.95,
        assistantMessage: "Call User A now",
      });

      const result = safeParseGuidanceResponse(json);

      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.includes("placeholder"))).toBe(true);
    });
  });
});
