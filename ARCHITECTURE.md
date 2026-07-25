# Sentinel AI - Architecture & GenAI Integration

Technical architecture overview and explanation of GenAI service integration.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React/Next.js Frontend                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   Profile    │  │     Chat     │  │   Guidance   │   │   │
│  │  │     Form     │  │  Interface   │  │     Panel    │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │         ↓                ↓                    ↓           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         localStorage (Persistence Layer)        │   │   │
│  │  │  • Conversation history                         │   │   │
│  │  │  • User profile (triggers, activities, etc)     │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↕ (HTTPS)                               │
└─────────────────────────────────────────────────────────────────┘
                             │
                   ┌─────────▼──────────┐
                   │  Next.js API Route │
                   │  /api/guidance     │
                   └─────────┬──────────┘
                             │
                   ┌─────────▼──────────────────┐
                   │  AI Request Processor      │
                   │  (src/lib/gemini.ts)       │
                   │                            │
                   │  • Format prompt           │
                   │  • Timeout management      │
                   │  • Error handling          │
                   └─────────┬──────────────────┘
                             │
                   ┌─────────▼──────────────────┐
                   │  Response Validator        │
                   │  (src/lib/responseValidator)
                   │                            │
                   │  • Schema validation       │
                   │  • Placeholder detection   │
                   │  • Crisis response check   │
                   └─────────┬──────────────────┘
                             │
                   ┌─────────▼──────────────────┐
                   │    OpenRouter API          │
                   │  https://openrouter.ai    │
                   └─────────┬──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │   NVIDIA Nemotron 3 Nano Omni       │
          │   AI Model (Reasoning Enabled)      │
          │                                      │
          │  • Crisis detection                 │
          │  • Personalized guidance            │
          │  • Structured JSON output           │
          │  • Multi-turn conversation          │
          └──────────────────────────────────────┘
```

---

## 🎯 Data Flow

### Crisis Response Flow

```
User Message
     ↓
[ChatInterface.tsx]
• Capture user text
• Show loading state
     ↓
POST /api/guidance
{
  profile: RecoveryProfile,
  conversation: ChatMessage[]
}
     ↓
[route.ts - API Endpoint]
• Receive request
• Validate input
     ↓
[generateGuidance() in gemini.ts]
• Format system prompt + user message
• Include profile context (name, triggers, etc)
• Include conversation history
     ↓
[Call OpenRouter API]
https://openrouter.ai/api/v1/chat/completions
Model: nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
     ↓
[NVIDIA Nemotron AI Model]
SYSTEM: [5-tier crisis detection protocol]
USER: [Formatted prompt with profile + conversation]
     ↓
[AI Processes & Generates Response]
• Detects crisis keywords
• Analyzes tense (present = active use)
• Classifies into tier
• Generates appropriate response
• Returns JSON: {
    recoveryStatus,
    confidence,
    assistantMessage,
    suggestedActivities
  }
     ↓
[validateGuidanceResponse() in responseValidator.ts]
• Parse JSON
• Validate structure
• Check for "User A" placeholders
• Verify crisis responses don't end with "?"
• Check word count
     ↓
[Return to Client]
{
  success: true,
  data: GuidanceResponse
}
     ↓
[ChatInterface.tsx]
• Display response
• Auto-focus input
• Save to localStorage
• Update guidance panel
     ↓
User sees response in chat
```

---

## 🤖 GenAI Service Integration

### Why NVIDIA Nemotron via OpenRouter?

#### Selected Model: NVIDIA Nemotron 3 Nano Omni 30B with Reasoning

**Criteria Evaluation:**

| Criteria | Gemini | Nemotron | Claude | GPT-4 |
|----------|--------|----------|--------|-------|
| Free Tier | ❌ No | ✅ Yes | ❌ No | ❌ No |
| Reasoning | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| JSON Output | ✅ Good | ✅ Excellent | ✅ Good | ✅ Good |
| Speed | ✅ Fast | ✅ Fast | ⚠️ Medium | ⚠️ Slow |
| Cost | ❌ $5/month | ✅ Free | ❌ $20/month | ❌ $20/month |
| Hackathon Ready | ❌ No | ✅ Yes | ❌ No | ❌ No |

**Decision**: Nemotron wins on free tier + reasoning + speed

#### Why OpenRouter Instead of Direct API?

**OpenRouter Advantages:**
- ✅ Unified API for multiple models
- ✅ Free tier support
- ✅ OpenAI-compatible interface (familiar SDK)
- ✅ Fallback capability (switch models without code changes)
- ✅ No authentication complexity
- ✅ Request routing and load balancing

**Direct API Disadvantages:**
- ❌ Different auth per model
- ❌ Different API formats
- ❌ No fallback capability
- ❌ Harder to switch models

### API Integration Details

#### Endpoint
```
https://openrouter.ai/api/v1/chat/completions
```

#### Authentication
```typescript
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL,
    "X-Title": "Sentinel-AI",
  },
});
```

#### Request Format
```typescript
{
  model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  max_tokens: 1600,
  temperature: 0.4,  // Lower = more deterministic
  messages: [
    {
      role: "system",
      content: SYSTEM_PROMPT  // 5-tier crisis detection
    },
    {
      role: "user",
      content: formatPrompt()  // Profile + conversation
    }
  ]
}
```

#### Response Format
```json
{
  "choices": [
    {
      "message": {
        "content": "{\"recoveryStatus\": \"...\", \"assistantMessage\": \"...\"}"
      }
    }
  ]
}
```

---

## 📊 Tier-Based Crisis Detection

The AI model uses the system prompt to classify user state into 5 tiers:

### Tier 1: Active Use (Present Tense)
**Keywords**: "am drinking", "am using", "just used", "right now"
**Tense**: Present tense verbs
**Response**: 
- Immediate directive (no questions)
- Call trusted person
- Emergency numbers (988, 741741)
- Word limit: 40

**Example Response**:
```
"Call [Name] now. If unavailable, call 988 or text HELLO to 741741."
```

### Tier 2: Imminent Use (Future Intent)
**Keywords**: "thinking about", "might", "planning to", "want to use"
**Tense**: Future or conditional
**Response**:
- Stop/PAUSE
- One directive action
- One alternative option
- Word limit: 40

**Example Response**:
```
"STOP. Call [Name] or go for a walk. You've got this."
```

### Tier 3: Strong Craving (Desire)
**Keywords**: "craving", "urge", "tempted", "struggling"
**Tense**: General present
**Response**:
- Validate feelings
- ONE activity suggestion
- ONE clarifying question
- No directives
- Word limit: 40

**Example Response**:
```
"That craving is real, but it will pass. Try [activity]. What triggered it?"
```

### Tier 4: Trigger Exposure (At Risk)
**Keywords**: "saw my friend", "around alcohol", "stressful day"
**Tense**: Descriptive past/present
**Response**:
- Preventative guidance
- Explain trigger
- Suggest coping strategy
- Build resilience
- Word limit: 40

**Example Response**:
```
"That's a tough spot. Remember your plan: [activity]. You're prepared."
```

### Tier 5: Stable (Good State)
**Keywords**: "great day", "feeling good", "accomplished", "proud"
**Sentiment**: Positive
**Response**:
- Celebrate progress
- Reinforce positive behavior
- NO activities to do
- NO questions
- Word limit: 40

**Example Response**:
```
"That's amazing! You're crushing your recovery goals. Keep it up!"
```

---

## 🔄 System Prompt Engineering

**Location**: `src/prompts/system.ts`

The system prompt is crucial - it teaches the AI how to respond:

```typescript
export const SYSTEM_PROMPT = `
You are Sentinel, a compassionate AI recovery coach...

[TIER 1: ACTIVE USE]
Pattern: Present tense + substance keywords
Response: Immediate directive, call person, emergency numbers

[TIER 2: IMMINENT USE]
Pattern: Future intent + substance keywords
Response: STOP, one action, one alternative

[TIER 3: STRONG CRAVING]
Pattern: Desire words + struggle
Response: Validate, activity, question

[TIER 4: TRIGGER EXPOSURE]
Pattern: Risk situation described
Response: Preventative, coping strategy

[TIER 5: STABLE]
Pattern: Positive sentiment
Response: Celebrate, reinforce, no tasks

RULES:
- Always use real names from profile
- Keep responses under 40 words
- Crisis responses are directives (no ?)
- Activities only for tiers 1-3
- Return ONLY valid JSON
`;
```

---

## 🛡️ Response Validation Pipeline

**File**: `src/lib/responseValidator.ts`

### Validation Steps

1. **JSON Parsing**
   - Remove markdown code blocks
   - Parse JSON safely
   - Catch parse errors

2. **Schema Validation**
   - Required fields present
   - Data types correct
   - Confidence in 0-1 range

3. **Content Validation**
   - ❌ No "User A" placeholders
   - ❌ No "[user]" or "[trusted]" tags
   - ❌ No "{{" or "[[" patterns

4. **Tier-Specific Validation**
   - Crisis (Tier 1-2): Response must NOT end with "?"
   - Stable (Tier 5): Response should NOT suggest activities

5. **Word Count Check**
   - Warn if exceeds limit
   - Error if > 1000 chars

6. **Quality Logging**
   - Log validation details in dev mode
   - Silent in production
   - Structured error messages

### Example Validation

```typescript
// Input from AI
{
  "recoveryStatus": "Active Use",
  "confidence": 0.95,
  "assistantMessage": "Call [Trusted Person] now. 988. HELLO to 741741.",
  "suggestedActivities": []
}

// Validation checks
✓ JSON parses correctly
✓ Schema is valid
✓ No placeholders (✓ has real names)
✓ Crisis response (✓ no "?")
✓ Word count: 9 words (✓ < 40)
✓ Valid to return to user
```

---

## 🔐 Configuration Management

**File**: `src/lib/config.ts`

All hardcoded values extracted to environment variables:

```typescript
export const CONFIG = {
  // API
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || "...",
  
  // Timeouts
  API_TIMEOUT_MS: parseInt(process.env.API_TIMEOUT_MS || "15000", 10),
  VOICE_PAUSE_THRESHOLD_MS: parseInt(...),
  SPEECH_TIMEOUT_MS: parseInt(...),
  
  // Limits
  RESPONSE_WORD_LIMIT: parseInt(process.env.RESPONSE_WORD_LIMIT || "40", 10),
  RESPONSE_MAX_TOKENS: 1600,
  
  // Storage
  CONVERSATION_STORAGE_KEY: "sentinel_conversation",
  PROFILE_STORAGE_KEY: "sentinel_profile",
  
  // App
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ENABLE_LOGGING: process.env.NODE_ENV === "development",
};
```

**Why This Matters**:
- ✅ No hardcoded values (hackathon requirement)
- ✅ Easy to change via environment
- ✅ Different values per environment (dev vs production)
- ✅ Single source of truth
- ✅ Type-safe (TypeScript)

---

## 💾 Data Persistence

### localStorage Strategy

**Profile Storage**
```typescript
localStorage.setItem("sentinel_profile", JSON.stringify(profile))
// Persists user's recovery information
// Cleared if user clears browser data
```

**Conversation Storage**
```typescript
localStorage.setItem("sentinel_conversation", JSON.stringify(conversation))
// Persists chat history
// Auto-loads on page reload
// No server required
```

**Privacy Benefits**:
- ✅ No PII on servers
- ✅ User full control
- ✅ GDPR compliant (data stays with user)
- ✅ Offline capable (future)
- ✅ No database needed for MVP

---

## 🔌 Error Handling & Resilience

### Error Boundaries

**File**: `src/components/ErrorBoundary.tsx`

Catches React component errors and shows user-friendly UI instead of white screen.

### API Error Handling

```typescript
try {
  const response = await Promise.race([
    apiCall(),
    timeout(15000)
  ]);
  
  const validated = validateGuidanceResponse(response);
  return validated;
  
} catch (error) {
  if (error is timeout) {
    return "Request took too long. Please try again."
  } else if (error is validation) {
    return "Invalid response format"
  } else {
    return "Failed to generate guidance"
  }
}
```

### Graceful Degradation

- ✅ If AI slow: Timeout and show "trying again"
- ✅ If AI error: Show helpful message, not raw error
- ✅ If validation fails: Log details, ask user to retry
- ✅ If storage fails: Continue without persistence

---

## 🚀 Deployment Architecture

### Local Development
```
npm run dev
→ Next.js dev server (port 3000)
→ Reads .env.local
→ Direct API calls (no proxy)
```

### Production (Vercel)
```
GitHub Push
→ Vercel detects change
→ Builds: npm run build
→ Deploys to edge
→ Environment vars from dashboard
→ Auto-scales
→ CDN distributed
```

**Why Vercel**:
- ✅ Next.js native support
- ✅ Automatic deployments
- ✅ Environment variable management
- ✅ Free tier available
- ✅ Global CDN
- ✅ Serverless functions (API routes)

---

## 📈 Performance Considerations

### Timeouts
```
API Request → 15 seconds → Show error
```

### Response Limits
```
Max tokens: 1600
Word limit: 40 words
Message length: 1000 chars
```

### Temperature
```
0.4 (deterministic)
- Consistent responses
- Less creative (good for safety)
- More predictable
```

### Caching Strategy
```
Profile: localStorage (persistent)
Conversation: localStorage (persistent)
API responses: Not cached (always fresh)
Static assets: Vercel CDN
```

---

## 🔄 Future Extensibility

### Adding New AI Models

To switch models, only change `CONFIG.OPENROUTER_MODEL`:

```typescript
// Option 1: Claude
OPENROUTER_MODEL=anthropic/claude-3-5-sonnet:free

// Option 2: Local LLM
OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free

// Option 3: Multiple models with fallback
// (Future: Implement retry logic)
```

### Adding Backend Database

If needed later:

```typescript
// Replace localStorage with API
const saveProfile = async (profile) => {
  await fetch("/api/profile", {
    method: "POST",
    body: JSON.stringify(profile)
  })
}

// With Supabase/Firebase/MongoDB
// All logic stays the same
// Just swap storage layer
```

### Adding Authentication

```typescript
// Wrap routes with auth middleware
// Add user ID to API calls
// Namespace localStorage per user
// Everything else unchanged
```

---

## 📊 Metrics & Monitoring

### What to Monitor

1. **API Performance**
   - Average response time
   - Timeout rate
   - Error rate

2. **Validation Quality**
   - Placeholder detection rate
   - Validation errors per 1000 requests
   - False positives

3. **User Experience**
   - Chat load time
   - Profile creation success
   - Conversation persistence

4. **Infrastructure**
   - Vercel deployment status
   - Error logs
   - Build times

---

## 🎓 Summary

**Architecture Principle**: Keep it simple and focused

- ✅ Single AI model (Nemotron)
- ✅ Simple API (OpenRouter)
- ✅ Simple database (localStorage)
- ✅ Simple deployment (Vercel)
- ✅ Simple validation (responseValidator)
- ✅ Simple configuration (environment variables)

**Why This Works**:
- Fast to build (hackathon timeline)
- Easy to understand (reviewers)
- Reliable (fewer moving parts)
- Extensible (can add complexity later)
- Scalable (Vercel handles it)

---

**Version**: 1.0  
**Last Updated**: July 25, 2026  
**Author**: Sentinel AI Team

