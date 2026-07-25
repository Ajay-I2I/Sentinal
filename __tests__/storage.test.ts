/**
 * Unit tests for localStorage wrapper
 * Tests: save/load conversation, save/load profile, error handling
 */

import { saveConversation, getConversation, saveProfile, getProfile } from "@/lib/storage";
import type { ChatMessage, RecoveryProfile } from "@/types/recovery";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("storage utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("saveConversation and getConversation", () => {
    it("should save and retrieve empty conversation", () => {
      const conversation: ChatMessage[] = [];

      saveConversation(conversation);
      const retrieved = getConversation();

      expect(retrieved).toEqual(conversation);
    });

    it("should save and retrieve single message", () => {
      const conversation: ChatMessage[] = [
        {
          role: "user",
          message: "Hello",
        },
      ];

      saveConversation(conversation);
      const retrieved = getConversation();

      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].message).toBe("Hello");
      expect(retrieved[0].role).toBe("user");
    });

    it("should save and retrieve multiple messages", () => {
      const conversation: ChatMessage[] = [
        { role: "user", message: "Hello" },
        { role: "assistant", message: "Hi there!" },
        { role: "user", message: "How are you?" },
        { role: "assistant", message: "I'm doing well, thank you!" },
      ];

      saveConversation(conversation);
      const retrieved = getConversation();

      expect(retrieved).toHaveLength(4);
      expect(retrieved[0].role).toBe("user");
      expect(retrieved[1].role).toBe("assistant");
      expect(retrieved[2].message).toBe("How are you?");
      expect(retrieved[3].message).toBe("I'm doing well, thank you!");
    });

    it("should preserve message order", () => {
      const conversation: ChatMessage[] = [
        { role: "user", message: "First" },
        { role: "assistant", message: "Second" },
        { role: "user", message: "Third" },
      ];

      saveConversation(conversation);
      const retrieved = getConversation();

      expect(retrieved.map((m) => m.message)).toEqual(["First", "Second", "Third"]);
    });

    it("should return empty array if no conversation saved", () => {
      const retrieved = getConversation();

      expect(retrieved).toEqual([]);
      expect(Array.isArray(retrieved)).toBe(true);
    });

    it("should handle special characters in messages", () => {
      const conversation: ChatMessage[] = [
        { role: "user", message: "I'm drinking! @#$%^&*()" },
        { role: "assistant", message: "Call 988 or text 741741." },
      ];

      saveConversation(conversation);
      const retrieved = getConversation();

      expect(retrieved[0].message).toBe("I'm drinking! @#$%^&*()");
      expect(retrieved[1].message).toBe("Call 988 or text 741741.");
    });

    it("should handle multiline messages", () => {
      const conversation: ChatMessage[] = [
        {
          role: "user",
          message: "Line 1\nLine 2\nLine 3",
        },
      ];

      saveConversation(conversation);
      const retrieved = getConversation();

      expect(retrieved[0].message).toBe("Line 1\nLine 2\nLine 3");
    });

    it("should overwrite previous conversation", () => {
      const conversation1: ChatMessage[] = [
        { role: "user", message: "First conversation" },
      ];
      const conversation2: ChatMessage[] = [
        { role: "user", message: "Second conversation" },
      ];

      saveConversation(conversation1);
      let retrieved = getConversation();
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].message).toBe("First conversation");

      saveConversation(conversation2);
      retrieved = getConversation();
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].message).toBe("Second conversation");
    });
  });

  describe("saveProfile and getProfile", () => {
    it("should save and retrieve profile", () => {
      const profile: RecoveryProfile = {
        name: "John",
        recoveryStage: "Early Recovery",
        triggers: ["Stress", "Social pressure"],
        healthyActivities: ["Running", "Meditation"],
        trustedPerson: {
          name: "Sarah",
          relationship: "Sister",
          phone: "555-1234",
        },
        emergencyTone: "Direct",
      };

      saveProfile(profile);
      const retrieved = getProfile();

      expect(retrieved).toEqual(profile);
      expect(retrieved?.name).toBe("John");
      expect(retrieved?.trustedPerson.name).toBe("Sarah");
    });

    it("should return null if no profile saved", () => {
      const retrieved = getProfile();

      expect(retrieved).toBeNull();
    });

    it("should handle profile with special characters", () => {
      const profile: RecoveryProfile = {
        name: "John O'Brien",
        recoveryStage: "Maintenance",
        triggers: ["Alcohol & drugs"],
        healthyActivities: ["Yoga@gym"],
        trustedPerson: {
          name: "Dr. Sarah Smith",
          relationship: "Doctor/Friend",
          phone: "555-1234",
        },
        emergencyTone: "Compassionate",
      };

      saveProfile(profile);
      const retrieved = getProfile();

      expect(retrieved?.name).toBe("John O'Brien");
      expect(retrieved?.triggers[0]).toBe("Alcohol & drugs");
    });

    it("should handle profile with arrays", () => {
      const profile: RecoveryProfile = {
        name: "Test",
        recoveryStage: "Active Recovery",
        triggers: ["Trigger1", "Trigger2", "Trigger3"],
        healthyActivities: ["Activity1", "Activity2", "Activity3", "Activity4"],
        trustedPerson: {
          name: "Contact",
          relationship: "Friend",
          phone: "555-0000",
        },
        emergencyTone: "Supportive",
      };

      saveProfile(profile);
      const retrieved = getProfile();

      expect(retrieved?.triggers).toHaveLength(3);
      expect(retrieved?.healthyActivities).toHaveLength(4);
    });

    it("should overwrite previous profile", () => {
      const profile1: RecoveryProfile = {
        name: "John",
        recoveryStage: "Early Recovery",
        triggers: [],
        healthyActivities: [],
        trustedPerson: {
          name: "Sarah",
          relationship: "Sister",
          phone: "555-1234",
        },
        emergencyTone: "Direct",
      };

      const profile2: RecoveryProfile = {
        name: "Jane",
        recoveryStage: "Long-term Recovery",
        triggers: [],
        healthyActivities: [],
        trustedPerson: {
          name: "Tom",
          relationship: "Brother",
          phone: "555-5678",
        },
        emergencyTone: "Supportive",
      };

      saveProfile(profile1);
      let retrieved = getProfile();
      expect(retrieved?.name).toBe("John");

      saveProfile(profile2);
      retrieved = getProfile();
      expect(retrieved?.name).toBe("Jane");
      expect(retrieved?.trustedPerson.name).toBe("Tom");
    });
  });

  describe("error handling", () => {
    it("should handle corrupt conversation data gracefully", () => {
      localStorage.setItem("sentinel_conversation", "invalid json");

      const retrieved = getConversation();

      expect(Array.isArray(retrieved)).toBe(true);
      expect(retrieved).toHaveLength(0);
    });

    it("should handle corrupt profile data gracefully", () => {
      localStorage.setItem("sentinel_profile", "invalid json");

      const retrieved = getProfile();

      expect(retrieved).toBeNull();
    });

    it("should handle empty localStorage", () => {
      const conversation = getConversation();
      const profile = getProfile();

      expect(conversation).toEqual([]);
      expect(profile).toBeNull();
    });
  });
});
