/**
 * Unit tests for configuration management
 * Tests: CONFIG object, environment variable loading, validation
 */

describe("CONFIG", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = process.env;
    // Create a new environment object for testing
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe("CONFIG values", () => {
    it("should have default OPENROUTER_MODEL", () => {
      delete process.env.OPENROUTER_MODEL;

      // Re-import to get fresh config
      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.OPENROUTER_MODEL).toContain("nemotron");
    });

    it("should use environment OPENROUTER_MODEL if set", () => {
      process.env.OPENROUTER_MODEL = "anthropic/claude-3-5-sonnet:free";

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.OPENROUTER_MODEL).toBe(
        "anthropic/claude-3-5-sonnet:free"
      );
    });

    it("should parse API_TIMEOUT_MS as integer", () => {
      process.env.API_TIMEOUT_MS = "20000";

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.API_TIMEOUT_MS).toBe(20000);
      expect(typeof CONFIG.API_TIMEOUT_MS).toBe("number");
    });

    it("should use default API_TIMEOUT_MS if not set", () => {
      delete process.env.API_TIMEOUT_MS;

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.API_TIMEOUT_MS).toBe(15000);
    });

    it("should parse RESPONSE_WORD_LIMIT as integer", () => {
      process.env.RESPONSE_WORD_LIMIT = "50";

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.RESPONSE_WORD_LIMIT).toBe(50);
      expect(typeof CONFIG.RESPONSE_WORD_LIMIT).toBe("number");
    });

    it("should use default RESPONSE_WORD_LIMIT if not set", () => {
      delete process.env.RESPONSE_WORD_LIMIT;

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.RESPONSE_WORD_LIMIT).toBe(40);
    });

    it("should have all required string constants", () => {
      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.APP_NAME).toBe("Sentinel AI");
      expect(CONFIG.CONVERSATION_STORAGE_KEY).toBeDefined();
      expect(CONFIG.PROFILE_STORAGE_KEY).toBeDefined();
    });

    it("should have RESPONSE_MAX_TOKENS", () => {
      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.RESPONSE_MAX_TOKENS).toBe(1600);
    });

    it("should have MESSAGE_MAX_LENGTH", () => {
      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.MESSAGE_MAX_LENGTH).toBe(1000);
    });

    it("should have ENABLE_LOGGING flag", () => {
      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(typeof CONFIG.ENABLE_LOGGING).toBe("boolean");
    });
  });

  describe("VOICE configuration", () => {
    it("should parse VOICE_PAUSE_THRESHOLD_MS", () => {
      process.env.VOICE_PAUSE_THRESHOLD_MS = "7000";

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.VOICE_PAUSE_THRESHOLD_MS).toBe(7000);
    });

    it("should use default VOICE_PAUSE_THRESHOLD_MS", () => {
      delete process.env.VOICE_PAUSE_THRESHOLD_MS;

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.VOICE_PAUSE_THRESHOLD_MS).toBe(5000);
    });

    it("should parse SPEECH_TIMEOUT_MS", () => {
      process.env.SPEECH_TIMEOUT_MS = "12000";

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.SPEECH_TIMEOUT_MS).toBe(12000);
    });

    it("should use default SPEECH_TIMEOUT_MS", () => {
      delete process.env.SPEECH_TIMEOUT_MS;

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.SPEECH_TIMEOUT_MS).toBe(10000);
    });
  });

  describe("Conversation storage keys", () => {
    it("should use consistent conversation storage key", () => {
      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.CONVERSATION_STORAGE_KEY).toBe("sentinel_conversation");
    });

    it("should use consistent profile storage key", () => {
      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.PROFILE_STORAGE_KEY).toBe("sentinel_profile");
    });
  });

  describe("Feature flags", () => {
    it("should disable voice by default", () => {
      delete process.env.NEXT_PUBLIC_ENABLE_VOICE;

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.ENABLE_VOICE).toBe(false);
    });

    it("should enable voice if set to 'true'", () => {
      process.env.NEXT_PUBLIC_ENABLE_VOICE = "true";

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.ENABLE_VOICE).toBe(true);
    });

    it("should disable logging in production", () => {
      process.env.NODE_ENV = "production";

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.ENABLE_LOGGING).toBe(false);
    });

    it("should enable logging in development", () => {
      process.env.NODE_ENV = "development";

      jest.resetModules();
      const { CONFIG } = require("@/lib/config");

      expect(CONFIG.ENABLE_LOGGING).toBe(true);
    });
  });

  describe("validateConfig", () => {
    it("should throw if OPENROUTER_API_KEY missing", () => {
      delete process.env.OPENROUTER_API_KEY;

      jest.resetModules();
      const { validateConfig } = require("@/lib/config");

      expect(() => validateConfig()).toThrow(
        "Missing required environment variables"
      );
    });

    it("should not throw if OPENROUTER_API_KEY present", () => {
      process.env.OPENROUTER_API_KEY = "sk-or-v1-test";

      jest.resetModules();
      const { validateConfig } = require("@/lib/config");

      expect(() => validateConfig()).not.toThrow();
    });

    it("should throw if API_TIMEOUT_MS is invalid", () => {
      process.env.API_TIMEOUT_MS = "-100";
      process.env.OPENROUTER_API_KEY = "sk-or-v1-test";

      jest.resetModules();
      const { validateConfig } = require("@/lib/config");

      expect(() => validateConfig()).toThrow("must be positive");
    });

    it("should throw if RESPONSE_WORD_LIMIT is invalid", () => {
      process.env.RESPONSE_WORD_LIMIT = "0";
      process.env.OPENROUTER_API_KEY = "sk-or-v1-test";

      jest.resetModules();
      const { validateConfig } = require("@/lib/config");

      expect(() => validateConfig()).toThrow("must be positive");
    });
  });
});
